import { useEffect, useState, type FormEvent, type CSSProperties } from 'react'
import api from './services/api'
import './App.css'

type EvolucionImportacion = {
  producto: string
  codigo_producto: string
  pais_origen: string
  periodo_anterior: string
  periodo_actual: string
  valor_cif_anterior: number
  valor_cif_actual: number
  variacion_porcentual: number
  tendencia: string
}

type Producto = {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  codigo: string | null
  activo: boolean
}

type ProductoFormulario = {
  nombre: string
  descripcion: string
  categoria: string
  codigo: string
}

type Proveedor = {
  id: number
  nombre: string
  pais: string
  contacto: string
  email: string | null
  activo: boolean
}

type ProveedorFormulario = {
  nombre: string
  pais: string
  contacto: string
  email: string
}

type Cotizacion = {
  id: number
  producto_id: number
  proveedor_id: number
  precio_unitario: number
  moneda: string
  cantidad_minima: number
  fecha_emision: string | null
  fecha_vencimiento: string | null
}

type CotizacionFormulario = {
  producto_id: string
  proveedor_id: string
  precio_unitario: string
  moneda: string
  cantidad_minima: string
  fecha_emision: string
  fecha_vencimiento: string
}

type OrdenProducto = {
  producto_id: number
  cantidad: number
  precio_unitario: number
  moneda: string
}

type Orden = {
  id: number
  proveedor_id: number
  fecha: string
  estado: string
  observaciones: string | null
  productos: OrdenProducto[]
}

type LineaOrdenFormulario = {
  producto_id: string
  cantidad: string
  precio_unitario: string
  moneda: string
}

type OrdenFormulario = {
  proveedor_id: string
  fecha: string
  estado: string
  observaciones: string
  productos: LineaOrdenFormulario[]
}

const estadosOrden = [
  'En evaluación',
  'Cotizada',
  'Aprobada',
  'Despachada',
  'En tránsito',
  'Recibida',
  'Cancelada',
]

type HistorialEnvio = {
  estado: string
  observacion: string | null
}

type Envio = {
  id: number
  orden_id: number
  transportista: string | null
  codigo_seguimiento: string | null
  fecha_estimada: string | null
  fecha_real: string | null
  estado: string
  historial: HistorialEnvio[]
}

type EnvioFormulario = {
  orden_id: string
  transportista: string
  codigo_seguimiento: string
  fecha_estimada: string
  estado: string
}

type Reclamo = {
  id: number
  proveedor_id: number
  orden_id: number | null
  descripcion: string
  fecha: string
  estado: string
  respuesta: string | null
}

type ReclamoFormulario = {
  proveedor_id: string
  orden_id: string
  descripcion: string
  fecha: string
  estado: string
}

const estadosReclamo = [
  'Abierto',
  'En revisión',
  'Respondido',
  'Resuelto',
  'Cerrado',
]

const estadosEnvio = [
  'Pendiente',
  'Preparando',
  'Despachado',
  'En tránsito',
  'Entregado',
  'Demorado',
]

type Oportunidad = {
  id: number
  nombre: string
  categoria: string
  pais_origen: string
  precio: number
  moneda: string
  fuente: string
  fecha_consulta: string
}

type OportunidadFormulario = {
  nombre: string
  categoria: string
  pais_origen: string
  precio: string
  moneda: string
  fuente: string
}

type OportunidadProveedorFormulario = {
  product_name: string
  category: string
  origin_country: string
  unit_price: string
  currency: string
}

type OportunidadArchivoFormulario = {
  nombre_producto: string
  rubro: string
  pais: string
  precio: string
  moneda: string
}

type CalculoCosto = {
  id?: number
  orden_id?: number
  precio_compra: number
  transporte: number
  seguro: number
  tributos: number
  otros_gastos: number
  cantidad: number
  moneda: string
  costo_total: number
  costo_unitario: number
  fecha_calculo?: string
}

type CalculoCostoFormulario = {
  precio_compra: string
  transporte: string
  seguro: string
  tributos: string
  otros_gastos: string
  cantidad: string
  moneda: string
}

type Indicador = {
  titulo: string
  valor: number
  cambio: string
  icono: string
  color: string
}

const navegacion = [
  { nombre: 'Dashboard', icono: '▦' },
  { nombre: 'Productos', icono: '◇' },
  { nombre: 'Proveedores', icono: '♙' },
  { nombre: 'Cotizaciones', icono: '▤' },
  { nombre: 'Órdenes', icono: '▣' },
  { nombre: 'Envíos', icono: '⇢' },
  { nombre: 'Reclamos', icono: '⚑' },
  { nombre: 'Oportunidades', icono: '⌕' },
  { nombre: 'Costos', icono: '$' },
  { nombre: 'Análisis', icono: '▥' },
]

const indicadoresIniciales: Indicador[] = [
  {
    titulo: 'Productos registrados',
    valor: 0,
    cambio: 'Catálogo disponible',
    icono: '◇',
    color: 'blue',
  },
  {
    titulo: 'Proveedores',
    valor: 0,
    cambio: 'Registrados en el sistema',
    icono: '♙',
    color: 'purple',
  },
  {
    titulo: 'Órdenes activas',
    valor: 0,
    cambio: 'En diferentes etapas',
    icono: '▣',
    color: 'green',
  },
  {
    titulo: 'Oportunidades',
    valor: 0,
    cambio: 'Detectadas por el radar',
    icono: '⌕',
    color: 'orange',
  },
]

const estiloCampoProducto: CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  border: '1px solid #d9e0ea',
  borderRadius: '8px',
  background: '#fff',
  color: '#17243a',
  font: 'inherit',
}

const estiloBotonProducto: CSSProperties = {
  border: 0,
  borderRadius: '8px',
  padding: '11px 18px',
  background: '#2457d6',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
}

function App() {
  const [seccionActiva, setSeccionActiva] = useState('Dashboard')
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState('')
  const [guardandoProducto, setGuardandoProducto] = useState(false)
  const [mensajeProducto, setMensajeProducto] = useState('')
  const [formularioProducto, setFormularioProducto] = useState<ProductoFormulario>({
    nombre: '',
    descripcion: '',
    categoria: '',
    codigo: '',
  })

  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [cargandoProveedores, setCargandoProveedores] = useState(false)
  const [errorProveedores, setErrorProveedores] = useState('')
  const [guardandoProveedor, setGuardandoProveedor] = useState(false)
  const [mensajeProveedor, setMensajeProveedor] = useState('')
  const [formularioProveedor, setFormularioProveedor] = useState<ProveedorFormulario>({
    nombre: '',
    pais: '',
    contacto: '',
    email: '',
  })

  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [cargandoOrdenes, setCargandoOrdenes] = useState(false)
  const [errorOrdenes, setErrorOrdenes] = useState('')
  const [mensajeOrden, setMensajeOrden] = useState('')
  const [guardandoOrden, setGuardandoOrden] = useState(false)
  const [formularioOrden, setFormularioOrden] = useState<OrdenFormulario>({
    proveedor_id: '',
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'En evaluación',
    observaciones: '',
    productos: [{ producto_id: '', cantidad: '', precio_unitario: '', moneda: 'USD' }],
  })

  const [envios, setEnvios] = useState<Envio[]>([])
  const [cargandoEnvios, setCargandoEnvios] = useState(false)
  const [errorEnvios, setErrorEnvios] = useState('')
  const [mensajeEnvio, setMensajeEnvio] = useState('')
  const [guardandoEnvio, setGuardandoEnvio] = useState(false)
  const [actualizandoEnvio, setActualizandoEnvio] = useState<number | null>(null)
  const [observacionesEnvio, setObservacionesEnvio] = useState<Record<number, string>>({})
  const [formularioEnvio, setFormularioEnvio] = useState<EnvioFormulario>({
    orden_id: '',
    transportista: '',
    codigo_seguimiento: '',
    fecha_estimada: '',
    estado: 'Pendiente',
  })

  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [cargandoReclamos, setCargandoReclamos] = useState(false)
  const [errorReclamos, setErrorReclamos] = useState('')
  const [mensajeReclamo, setMensajeReclamo] = useState('')
  const [guardandoReclamo, setGuardandoReclamo] = useState(false)
  const [actualizandoReclamo, setActualizandoReclamo] = useState<number | null>(null)
  const [respuestasReclamo, setRespuestasReclamo] = useState<Record<number, string>>({})
  const [formularioReclamo, setFormularioReclamo] = useState<ReclamoFormulario>({
    proveedor_id: '',
    orden_id: '',
    descripcion: '',
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'Abierto',
  })

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [cargandoCotizaciones, setCargandoCotizaciones] = useState(false)
  const [errorCotizaciones, setErrorCotizaciones] = useState('')
  const [guardandoCotizacion, setGuardandoCotizacion] = useState(false)
  const [mensajeCotizacion, setMensajeCotizacion] = useState('')
  const [formularioCotizacion, setFormularioCotizacion] = useState<CotizacionFormulario>({
    producto_id: '',
    proveedor_id: '',
    precio_unitario: '',
    moneda: 'USD',
    cantidad_minima: '',
    fecha_emision: '',
    fecha_vencimiento: '',
  })

  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([])
  const [cargandoOportunidades, setCargandoOportunidades] = useState(false)
  const [errorOportunidades, setErrorOportunidades] = useState('')
  const [mensajeOportunidad, setMensajeOportunidad] = useState('')
  const [guardandoOportunidad, setGuardandoOportunidad] = useState(false)
  const [formularioOportunidad, setFormularioOportunidad] = useState<OportunidadFormulario>({
    nombre: '', categoria: '', pais_origen: '', precio: '', moneda: 'USD', fuente: 'Carga manual',
  })
  const [formularioOportunidadProveedor, setFormularioOportunidadProveedor] = useState<OportunidadProveedorFormulario>({
    product_name: '', category: '', origin_country: '', unit_price: '', currency: 'USD',
  })
  const [formularioOportunidadArchivo, setFormularioOportunidadArchivo] = useState<OportunidadArchivoFormulario>({
    nombre_producto: '', rubro: '', pais: '', precio: '', moneda: 'USD',
  })

  const [ordenCostoId, setOrdenCostoId] = useState('')
  const [historialCostos, setHistorialCostos] = useState<CalculoCosto[]>([])
  const [cargandoCostos, setCargandoCostos] = useState(false)
  const [guardandoCosto, setGuardandoCosto] = useState(false)
  const [errorCostos, setErrorCostos] = useState('')
  const [mensajeCosto, setMensajeCosto] = useState('')
  const [resultadoCosto, setResultadoCosto] = useState<CalculoCosto | null>(null)
  const [formularioCosto, setFormularioCosto] = useState<CalculoCostoFormulario>({
    precio_compra: '', transporte: '', seguro: '', tributos: '', otros_gastos: '', cantidad: '', moneda: 'USD',
  })

  const [indicadores, setIndicadores] = useState<Indicador[]>(
    indicadoresIniciales
  )
  const [cargandoIndicadores, setCargandoIndicadores] = useState(true)

  const [estadoBackend, setEstadoBackend] = useState<
    'conectando' | 'activo' | 'error'
  >('conectando')

  const [evoluciones, setEvoluciones] = useState<EvolucionImportacion[]>([])
  const [cargandoEvolucion, setCargandoEvolucion] = useState(true)
  const [errorEvolucion, setErrorEvolucion] = useState('')
  const [filtroAnalisis, setFiltroAnalisis] = useState('')
  const [paisAnalisis, setPaisAnalisis] = useState('Todos')

  useEffect(() => {
    const cargarIndicadores = async () => {
      const [
        respuestaProductos,
        respuestaProveedores,
        respuestaOrdenes,
        respuestaOportunidades,
      ] = await Promise.allSettled([
        api.get<unknown[]>('/productos/'),
        api.get<unknown[]>('/proveedores/'),
        api.get<Array<{ estado: string }>>('/ordenes/'),
        api.get<unknown[]>('/oportunidades/'),
      ])

      const nuevosIndicadores = indicadoresIniciales.map((item) => ({
        ...item,
      }))

      if (respuestaProductos.status === 'fulfilled') {
        nuevosIndicadores[0].valor = respuestaProductos.value.data.length
      } else {
        console.error(
          'Error al obtener los productos:',
          respuestaProductos.reason
        )
      }

      if (respuestaProveedores.status === 'fulfilled') {
        nuevosIndicadores[1].valor = respuestaProveedores.value.data.length
      } else {
        console.error(
          'Error al obtener los proveedores:',
          respuestaProveedores.reason
        )
      }

      if (respuestaOrdenes.status === 'fulfilled') {
        nuevosIndicadores[2].valor = respuestaOrdenes.value.data.filter(
          (orden) =>
            orden.estado !== 'Recibida' && orden.estado !== 'Cancelada'
        ).length
      } else {
        console.error(
          'Error al obtener las órdenes:',
          respuestaOrdenes.reason
        )
      }

      if (respuestaOportunidades.status === 'fulfilled') {
        nuevosIndicadores[3].valor = respuestaOportunidades.value.data.length
      } else {
        console.error(
          'Error al obtener las oportunidades:',
          respuestaOportunidades.reason
        )
      }

      setIndicadores(nuevosIndicadores)
      setCargandoIndicadores(false)
    }

    cargarIndicadores()

    api.get('/salud')
      .then((respuesta) => {
        setEstadoBackend(
          respuesta.data.estado === 'activo' ? 'activo' : 'error'
        )
      })
      .catch((error) => {
        console.error('Error al conectar con el backend:', error)
        setEstadoBackend('error')
      })

    api.get<EvolucionImportacion[]>('/analisis-oportunidades/evolucion')
      .then((respuesta) => {
        setEvoluciones(respuesta.data)
        setErrorEvolucion('')
      })
      .catch((error) => {
        console.error('Error al obtener la evolución:', error)
        setErrorEvolucion('No se pudieron cargar los datos de evolución.')
      })
      .finally(() => {
        setCargandoEvolucion(false)
      })
  }, [])

  useEffect(() => {
    if (seccionActiva !== 'Productos') return

    setCargandoProductos(true)
    setErrorProductos('')
    api.get<Producto[]>('/productos/')
      .then((respuesta) => setProductos(respuesta.data))
      .catch((error) => {
        console.error('Error al obtener los productos:', error)
        setErrorProductos('No se pudieron cargar los productos. Verificá que el backend esté conectado.')
      })
      .finally(() => setCargandoProductos(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Proveedores') return

    setCargandoProveedores(true)
    setErrorProveedores('')
    api.get<Proveedor[]>('/proveedores/')
      .then((respuesta) => setProveedores(respuesta.data))
      .catch((error) => {
        console.error('Error al obtener los proveedores:', error)
        setErrorProveedores('No se pudieron cargar los proveedores. Verificá que el backend esté conectado.')
      })
      .finally(() => setCargandoProveedores(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Órdenes') return

    setCargandoOrdenes(true)
    setErrorOrdenes('')
    Promise.all([
      api.get<Orden[]>('/ordenes/'),
      api.get<Producto[]>('/productos/'),
      api.get<Proveedor[]>('/proveedores/'),
    ])
      .then(([respuestaOrdenes, respuestaProductos, respuestaProveedores]) => {
        setOrdenes(respuestaOrdenes.data)
        setProductos(respuestaProductos.data)
        setProveedores(respuestaProveedores.data)
      })
      .catch((error) => {
        console.error('Error al cargar las órdenes:', error)
        setErrorOrdenes('No se pudieron cargar las órdenes, productos o proveedores.')
      })
      .finally(() => setCargandoOrdenes(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Envíos') return

    setCargandoEnvios(true)
    setErrorEnvios('')
    Promise.all([
      api.get<Envio[]>('/envios/'),
      api.get<Orden[]>('/ordenes/'),
      api.get<Proveedor[]>('/proveedores/'),
    ])
      .then(([respuestaEnvios, respuestaOrdenes, respuestaProveedores]) => {
        setEnvios(respuestaEnvios.data)
        setOrdenes(respuestaOrdenes.data)
        setProveedores(respuestaProveedores.data)
      })
      .catch((error) => {
        console.error('Error al cargar los envíos:', error)
        setErrorEnvios('No se pudieron cargar los envíos, órdenes o proveedores.')
      })
      .finally(() => setCargandoEnvios(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Reclamos') return

    setCargandoReclamos(true)
    setErrorReclamos('')
    Promise.all([
      api.get<Reclamo[]>('/reclamos/'),
      api.get<Proveedor[]>('/proveedores/'),
      api.get<Orden[]>('/ordenes/'),
    ])
      .then(([respuestaReclamos, respuestaProveedores, respuestaOrdenes]) => {
        setReclamos(respuestaReclamos.data)
        setProveedores(respuestaProveedores.data)
        setOrdenes(respuestaOrdenes.data)
      })
      .catch((error) => {
        console.error('Error al cargar los reclamos:', error)
        setErrorReclamos('No se pudieron cargar los reclamos, proveedores u órdenes.')
      })
      .finally(() => setCargandoReclamos(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Costos') return
    setCargandoCostos(true)
    setErrorCostos('')
    api.get<Orden[]>('/ordenes/')
      .then((respuesta) => {
        setOrdenes(respuesta.data)
        if (!ordenCostoId && respuesta.data.length > 0) setOrdenCostoId(String(respuesta.data[0].id))
      })
      .catch((error) => {
        console.error('Error al cargar órdenes para costos:', error)
        setErrorCostos('No se pudieron cargar las órdenes de importación.')
      })
      .finally(() => setCargandoCostos(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Costos' || !ordenCostoId) {
      setHistorialCostos([])
      return
    }
    setCargandoCostos(true)
    setErrorCostos('')
    api.get<CalculoCosto[]>(`/costos/orden/${ordenCostoId}`)
      .then((respuesta) => setHistorialCostos(respuesta.data))
      .catch((error) => {
        console.error('Error al cargar historial de costos:', error)
        setErrorCostos('No se pudo cargar el historial de costos de esta orden.')
      })
      .finally(() => setCargandoCostos(false))
  }, [seccionActiva, ordenCostoId])

  useEffect(() => {
    if (seccionActiva !== 'Oportunidades') return
    setCargandoOportunidades(true)
    setErrorOportunidades('')
    api.get<Oportunidad[]>('/oportunidades/')
      .then((respuesta) => setOportunidades(respuesta.data))
      .catch((error) => {
        console.error('Error al cargar las oportunidades:', error)
        setErrorOportunidades('No se pudieron cargar las oportunidades. Verificá que el backend esté conectado.')
      })
      .finally(() => setCargandoOportunidades(false))
  }, [seccionActiva])

  useEffect(() => {
    if (seccionActiva !== 'Cotizaciones') return

    setCargandoCotizaciones(true)
    setErrorCotizaciones('')
    Promise.all([
      api.get<Cotizacion[]>('/cotizaciones/'),
      api.get<Producto[]>('/productos/'),
      api.get<Proveedor[]>('/proveedores/'),
    ])
      .then(([respuestaCotizaciones, respuestaProductos, respuestaProveedores]) => {
        setCotizaciones(respuestaCotizaciones.data)
        setProductos(respuestaProductos.data)
        setProveedores(respuestaProveedores.data)
      })
      .catch((error) => {
        console.error('Error al cargar los datos de cotizaciones:', error)
        setErrorCotizaciones('No se pudieron cargar las cotizaciones o los datos de productos y proveedores.')
      })
      .finally(() => setCargandoCotizaciones(false))
  }, [seccionActiva])

  const manejarCambioProducto = (
    campo: keyof ProductoFormulario,
    valor: string
  ) => {
    setFormularioProducto((actual) => ({ ...actual, [campo]: valor }))
  }

  const crearProducto = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoProducto(true)
    setErrorProductos('')
    setMensajeProducto('')

    try {
      const respuesta = await api.post<Producto>('/productos/', {
        nombre: formularioProducto.nombre.trim(),
        descripcion: formularioProducto.descripcion.trim(),
        categoria: formularioProducto.categoria.trim(),
        codigo: formularioProducto.codigo.trim() || null,
      })
      setProductos((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) =>
        actuales.map((item, indice) =>
          indice === 0 ? { ...item, valor: item.valor + 1 } : item
        )
      )
      setFormularioProducto({ nombre: '', descripcion: '', categoria: '', codigo: '' })
      setMensajeProducto('Producto registrado correctamente.')
    } catch (error: any) {
      console.error('Error al crear el producto:', error)
      const detalle = error?.response?.data?.detail
      setErrorProductos(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo registrar el producto. Revisá los datos e intentá nuevamente.'
      )
    } finally {
      setGuardandoProducto(false)
    }
  }

  const manejarCambioProveedor = (
    campo: keyof ProveedorFormulario,
    valor: string
  ) => {
    setFormularioProveedor((actual) => ({ ...actual, [campo]: valor }))
  }

  const crearProveedor = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoProveedor(true)
    setErrorProveedores('')
    setMensajeProveedor('')

    try {
      const respuesta = await api.post<Proveedor>('/proveedores/', {
        nombre: formularioProveedor.nombre.trim(),
        pais: formularioProveedor.pais.trim(),
        contacto: formularioProveedor.contacto.trim(),
        email: formularioProveedor.email.trim() || null,
      })
      setProveedores((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) =>
        actuales.map((item, indice) =>
          indice === 1 ? { ...item, valor: item.valor + 1 } : item
        )
      )
      setFormularioProveedor({ nombre: '', pais: '', contacto: '', email: '' })
      setMensajeProveedor('Proveedor registrado correctamente.')
    } catch (error: any) {
      console.error('Error al crear el proveedor:', error)
      const detalle = error?.response?.data?.detail
      setErrorProveedores(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo registrar el proveedor. Revisá los datos e intentá nuevamente.'
      )
    } finally {
      setGuardandoProveedor(false)
    }
  }

  const manejarCambioCotizacion = (
    campo: keyof CotizacionFormulario,
    valor: string
  ) => {
    setFormularioCotizacion((actual) => ({ ...actual, [campo]: valor }))
  }

  const crearCotizacion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoCotizacion(true)
    setErrorCotizaciones('')
    setMensajeCotizacion('')

    try {
      const respuesta = await api.post<Cotizacion>('/cotizaciones/', {
        producto_id: Number(formularioCotizacion.producto_id),
        proveedor_id: Number(formularioCotizacion.proveedor_id),
        precio_unitario: Number(formularioCotizacion.precio_unitario),
        moneda: formularioCotizacion.moneda.trim().toUpperCase(),
        cantidad_minima: Number(formularioCotizacion.cantidad_minima),
        fecha_emision: formularioCotizacion.fecha_emision || null,
        fecha_vencimiento: formularioCotizacion.fecha_vencimiento || null,
      })
      setCotizaciones((actuales) => [...actuales, respuesta.data])
      setFormularioCotizacion({
        producto_id: '',
        proveedor_id: '',
        precio_unitario: '',
        moneda: 'USD',
        cantidad_minima: '',
        fecha_emision: '',
        fecha_vencimiento: '',
      })
      setMensajeCotizacion('Cotización registrada correctamente.')
    } catch (error: any) {
      console.error('Error al crear la cotización:', error)
      const detalle = error?.response?.data?.detail
      setErrorCotizaciones(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo registrar la cotización. Revisá los datos e intentá nuevamente.'
      )
    } finally {
      setGuardandoCotizacion(false)
    }
  }

  const actualizarLineaOrden = (
    indice: number,
    campo: keyof LineaOrdenFormulario,
    valor: string
  ) => {
    setFormularioOrden((actual) => ({
      ...actual,
      productos: actual.productos.map((linea, i) =>
        i === indice ? { ...linea, [campo]: valor } : linea
      ),
    }))
  }

  const agregarLineaOrden = () => {
    setFormularioOrden((actual) => ({
      ...actual,
      productos: [...actual.productos, {
        producto_id: '', cantidad: '', precio_unitario: '', moneda: 'USD'
      }],
    }))
  }

  const quitarLineaOrden = (indice: number) => {
    setFormularioOrden((actual) => ({
      ...actual,
      productos: actual.productos.filter((_, i) => i !== indice),
    }))
  }

  const crearOrden = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoOrden(true)
    setErrorOrdenes('')
    setMensajeOrden('')

    try {
      const respuesta = await api.post<Orden>('/ordenes/', {
        proveedor_id: Number(formularioOrden.proveedor_id),
        fecha: formularioOrden.fecha,
        estado: formularioOrden.estado,
        observaciones: formularioOrden.observaciones.trim() || null,
        productos: formularioOrden.productos.map((linea) => ({
          producto_id: Number(linea.producto_id),
          cantidad: Number(linea.cantidad),
          precio_unitario: Number(linea.precio_unitario),
          moneda: linea.moneda.trim().toUpperCase(),
        })),
      })

      setOrdenes((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) => actuales.map((item, indice) =>
        indice === 2 && !['Recibida', 'Cancelada'].includes(respuesta.data.estado)
          ? { ...item, valor: item.valor + 1 }
          : item
      ))
      setFormularioOrden({
        proveedor_id: '',
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'En evaluación',
        observaciones: '',
        productos: [{ producto_id: '', cantidad: '', precio_unitario: '', moneda: 'USD' }],
      })
      setMensajeOrden('Orden de importación registrada correctamente.')
    } catch (error: any) {
      console.error('Error al crear la orden:', error)
      const detalle = error?.response?.data?.detail
      setErrorOrdenes(typeof detalle === 'string' ? detalle : 'No se pudo registrar la orden. Revisá los datos e intentá nuevamente.')
    } finally {
      setGuardandoOrden(false)
    }
  }

  const cambiarEstadoOrden = async (orden: Orden, nuevoEstado: string) => {
    setErrorOrdenes('')
    try {
      const respuesta = await api.put<Orden>(`/ordenes/${orden.id}/estado`, {
        estado: nuevoEstado,
      })
      setOrdenes((actuales) => actuales.map((item) =>
        item.id === orden.id ? respuesta.data : item
      ))
      setMensajeOrden(`Estado de la orden #${orden.id} actualizado.`)
      setIndicadores((actuales) => {
        const antesActiva = !['Recibida', 'Cancelada'].includes(orden.estado)
        const ahoraActiva = !['Recibida', 'Cancelada'].includes(nuevoEstado)
        return actuales.map((item, indice) => indice === 2
          ? { ...item, valor: Math.max(0, item.valor + Number(ahoraActiva) - Number(antesActiva)) }
          : item
        )
      })
    } catch (error: any) {
      console.error('Error al actualizar el estado:', error)
      const detalle = error?.response?.data?.detail
      setErrorOrdenes(typeof detalle === 'string' ? detalle : 'No se pudo actualizar el estado de la orden.')
    }
  }

  const eliminarOrden = async (ordenId: number) => {
    const confirmar = window.confirm(`¿Querés eliminar la orden #${ordenId}?`)
    if (!confirmar) return
    try {
      const ordenEliminada = ordenes.find((item) => item.id === ordenId)
      await api.delete(`/ordenes/${ordenId}`)
      setOrdenes((actuales) => actuales.filter((item) => item.id !== ordenId))
      if (ordenEliminada && !['Recibida', 'Cancelada'].includes(ordenEliminada.estado)) {
        setIndicadores((actuales) => actuales.map((item, indice) =>
          indice === 2 ? { ...item, valor: Math.max(0, item.valor - 1) } : item
        ))
      }
      setMensajeOrden(`Orden #${ordenId} eliminada correctamente.`)
    } catch (error: any) {
      console.error('Error al eliminar la orden:', error)
      const detalle = error?.response?.data?.detail
      setErrorOrdenes(typeof detalle === 'string' ? detalle : 'No se pudo eliminar la orden.')
    }
  }

  const crearEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoEnvio(true)
    setErrorEnvios('')
    setMensajeEnvio('')

    try {
      const respuesta = await api.post<Envio>('/envios/', {
        orden_id: Number(formularioEnvio.orden_id),
        transportista: formularioEnvio.transportista.trim() || null,
        codigo_seguimiento: formularioEnvio.codigo_seguimiento.trim() || null,
        fecha_estimada: formularioEnvio.fecha_estimada || null,
        estado: formularioEnvio.estado,
      })
      setEnvios((actuales) => [...actuales, respuesta.data])
      setFormularioEnvio({
        orden_id: '',
        transportista: '',
        codigo_seguimiento: '',
        fecha_estimada: '',
        estado: 'Pendiente',
      })
      setMensajeEnvio('Envío registrado correctamente.')
    } catch (error: any) {
      console.error('Error al crear el envío:', error)
      const detalle = error?.response?.data?.detail
      setErrorEnvios(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo registrar el envío. Revisá los datos e intentá nuevamente.'
      )
    } finally {
      setGuardandoEnvio(false)
    }
  }

  const cambiarEstadoEnvio = async (envio: Envio, nuevoEstado: string) => {
    setActualizandoEnvio(envio.id)
    setErrorEnvios('')
    setMensajeEnvio('')

    try {
      const respuesta = await api.put<Envio>(`/envios/${envio.id}/estado`, {
        estado: nuevoEstado,
        observacion: observacionesEnvio[envio.id]?.trim() || null,
      })
      setEnvios((actuales) => actuales.map((item) =>
        item.id === envio.id ? respuesta.data : item
      ))
      setObservacionesEnvio((actuales) => ({ ...actuales, [envio.id]: '' }))
      setMensajeEnvio(`Estado del envío #${envio.id} actualizado correctamente.`)
    } catch (error: any) {
      console.error('Error al actualizar el envío:', error)
      const detalle = error?.response?.data?.detail
      setErrorEnvios(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo actualizar el estado del envío.'
      )
    } finally {
      setActualizandoEnvio(null)
    }
  }

  const crearReclamo = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoReclamo(true)
    setErrorReclamos('')
    setMensajeReclamo('')

    try {
      const respuesta = await api.post<Reclamo>('/reclamos/', {
        proveedor_id: Number(formularioReclamo.proveedor_id),
        orden_id: formularioReclamo.orden_id
          ? Number(formularioReclamo.orden_id)
          : null,
        descripcion: formularioReclamo.descripcion.trim(),
        fecha: formularioReclamo.fecha,
        estado: formularioReclamo.estado,
      })
      setReclamos((actuales) => [...actuales, respuesta.data])
      setFormularioReclamo({
        proveedor_id: '',
        orden_id: '',
        descripcion: '',
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'Abierto',
      })
      setMensajeReclamo('Reclamo registrado correctamente.')
    } catch (error: any) {
      console.error('Error al crear el reclamo:', error)
      const detalle = error?.response?.data?.detail
      setErrorReclamos(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo registrar el reclamo. Revisá los datos e intentá nuevamente.'
      )
    } finally {
      setGuardandoReclamo(false)
    }
  }

  const cambiarEstadoReclamo = async (reclamo: Reclamo, nuevoEstado: string) => {
    setActualizandoReclamo(reclamo.id)
    setErrorReclamos('')
    setMensajeReclamo('')

    try {
      const respuesta = await api.put<Reclamo>(`/reclamos/${reclamo.id}/estado`, {
        estado: nuevoEstado,
        respuesta: respuestasReclamo[reclamo.id]?.trim() || reclamo.respuesta || null,
      })
      setReclamos((actuales) => actuales.map((item) =>
        item.id === reclamo.id ? respuesta.data : item
      ))
      setRespuestasReclamo((actuales) => ({ ...actuales, [reclamo.id]: '' }))
      setMensajeReclamo(`Reclamo #${reclamo.id} actualizado correctamente.`)
    } catch (error: any) {
      console.error('Error al actualizar el reclamo:', error)
      const detalle = error?.response?.data?.detail
      setErrorReclamos(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo actualizar el reclamo.'
      )
    } finally {
      setActualizandoReclamo(null)
    }
  }

  const crearOportunidad = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoOportunidad(true)
    setErrorOportunidades('')
    setMensajeOportunidad('')
    try {
      const respuesta = await api.post<Oportunidad>('/oportunidades/', {
        nombre: formularioOportunidad.nombre.trim(),
        categoria: formularioOportunidad.categoria.trim(),
        pais_origen: formularioOportunidad.pais_origen.trim(),
        precio: Number(formularioOportunidad.precio),
        moneda: formularioOportunidad.moneda.trim().toUpperCase(),
        fuente: formularioOportunidad.fuente.trim(),
      })
      setOportunidades((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) => actuales.map((item, indice) => indice === 3 ? { ...item, valor: item.valor + 1 } : item))
      setFormularioOportunidad({ nombre: '', categoria: '', pais_origen: '', precio: '', moneda: 'USD', fuente: 'Carga manual' })
      setMensajeOportunidad('Oportunidad registrada correctamente.')
    } catch (error: any) {
      console.error('Error al crear la oportunidad:', error)
      const detalle = error?.response?.data?.detail
      setErrorOportunidades(typeof detalle === 'string' ? detalle : 'No se pudo registrar la oportunidad. Revisá los datos e intentá nuevamente.')
    } finally {
      setGuardandoOportunidad(false)
    }
  }

  const importarOportunidadProveedor = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoOportunidad(true)
    setErrorOportunidades('')
    setMensajeOportunidad('')
    try {
      const respuesta = await api.post<Oportunidad>('/oportunidades/importar/proveedor', {
        product_name: formularioOportunidadProveedor.product_name.trim(),
        category: formularioOportunidadProveedor.category.trim(),
        origin_country: formularioOportunidadProveedor.origin_country.trim(),
        unit_price: Number(formularioOportunidadProveedor.unit_price),
        currency: formularioOportunidadProveedor.currency.trim().toUpperCase(),
      })
      setOportunidades((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) => actuales.map((item, indice) => indice === 3 ? { ...item, valor: item.valor + 1 } : item))
      setFormularioOportunidadProveedor({ product_name: '', category: '', origin_country: '', unit_price: '', currency: 'USD' })
      setMensajeOportunidad('Oportunidad importada desde el catálogo del proveedor.')
    } catch (error: any) {
      console.error('Error al importar desde proveedor:', error)
      const detalle = error?.response?.data?.detail
      setErrorOportunidades(typeof detalle === 'string' ? detalle : 'No se pudo importar la oportunidad desde el proveedor.')
    } finally {
      setGuardandoOportunidad(false)
    }
  }

  const importarOportunidadArchivo = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setGuardandoOportunidad(true)
    setErrorOportunidades('')
    setMensajeOportunidad('')
    try {
      const respuesta = await api.post<Oportunidad>('/oportunidades/importar/archivo', {
        nombre_producto: formularioOportunidadArchivo.nombre_producto.trim(),
        rubro: formularioOportunidadArchivo.rubro.trim(),
        pais: formularioOportunidadArchivo.pais.trim(),
        precio: Number(formularioOportunidadArchivo.precio),
        moneda: formularioOportunidadArchivo.moneda.trim().toUpperCase(),
      })
      setOportunidades((actuales) => [...actuales, respuesta.data])
      setIndicadores((actuales) => actuales.map((item, indice) => indice === 3 ? { ...item, valor: item.valor + 1 } : item))
      setFormularioOportunidadArchivo({ nombre_producto: '', rubro: '', pais: '', precio: '', moneda: 'USD' })
      setMensajeOportunidad('Oportunidad importada desde el archivo comercial.')
    } catch (error: any) {
      console.error('Error al importar desde archivo:', error)
      const detalle = error?.response?.data?.detail
      setErrorOportunidades(typeof detalle === 'string' ? detalle : 'No se pudo importar la oportunidad desde el archivo comercial.')
    } finally {
      setGuardandoOportunidad(false)
    }
  }

  const calcularCostoImportacion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (!ordenCostoId) return
    setGuardandoCosto(true)
    setErrorCostos('')
    setMensajeCosto('')
    try {
      const datos = {
        precio_compra: Number(formularioCosto.precio_compra),
        transporte: Number(formularioCosto.transporte),
        seguro: Number(formularioCosto.seguro),
        tributos: Number(formularioCosto.tributos),
        otros_gastos: Number(formularioCosto.otros_gastos),
        cantidad: Number(formularioCosto.cantidad),
        moneda: formularioCosto.moneda.trim().toUpperCase(),
      }
      const respuesta = await api.post<CalculoCosto>(`/costos/calcular/${ordenCostoId}`, datos)
      setResultadoCosto(respuesta.data)
      setHistorialCostos((actuales) => [respuesta.data, ...actuales])
      setMensajeCosto('Costo calculado y guardado correctamente.')
    } catch (error: any) {
      console.error('Error al calcular costos:', error)
      const detalle = error?.response?.data?.detail
      setErrorCostos(typeof detalle === 'string' ? detalle : 'No se pudo calcular el costo. Revisá los datos e intentá nuevamente.')
    } finally {
      setGuardandoCosto(false)
    }
  }

  const formatoImporte = (valor: number, moneda: string) =>
    `${moneda} ${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor)}`

  const formatoUSD = (valor: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(valor)

  const valorTotalActual = evoluciones.reduce(
    (total, item) => total + item.valor_cif_actual,
    0
  )

  const evolucionesFiltradas = evoluciones.filter((item) => {
    const texto = `${item.producto} ${item.codigo_producto} ${item.pais_origen}`.toLowerCase()
    const coincideTexto = texto.includes(filtroAnalisis.trim().toLowerCase())
    const coincidePais = paisAnalisis === 'Todos' || item.pais_origen === paisAnalisis
    return coincideTexto && coincidePais
  })
  const cantidadEnAlza = evoluciones.filter((item) => item.variacion_porcentual > 0).length
  const cantidadEnBaja = evoluciones.filter((item) => item.variacion_porcentual < 0).length
  const paisesAnalisis = Array.from(new Set(evoluciones.map((item) => item.pais_origen))).sort()

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IR</div>
          <div>
            <h1>ImportaRadar</h1>
            <span>GESTIÓN COMERCIAL</span>
          </div>
        </div>

        <div className="menu-label">MENÚ PRINCIPAL</div>

        <nav className="navigation">
          {navegacion.map((item) => (
            <button
              key={item.nombre}
              className={`nav-item ${
                seccionActiva === item.nombre ? 'active' : ''
              }`}
              onClick={() => setSeccionActiva(item.nombre)}
            >
              <span className="nav-icon">{item.icono}</span>
              {item.nombre}
              {item.nombre === 'Oportunidades' && (
                <span className="nav-badge">{indicadores[3].valor}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">?</span>
            <div>
              <strong>¿Necesitás ayuda?</strong>
              <p>Consultá la documentación</p>
            </div>
          </div>

          <div className="profile">
            <div className="profile-avatar">IR</div>
            <div className="profile-info">
              <strong>Administrador</strong>
              <span>Panel de gestión</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Inicio</span>
            <span>/</span>
            <strong>{seccionActiva}</strong>
          </div>

          <div className="topbar-actions">
            <span className="connection-status">
              <span
                className="status-dot"
                style={{
                  backgroundColor:
                    estadoBackend === 'activo'
                      ? '#22c55e'
                      : estadoBackend === 'error'
                        ? '#ef4444'
                        : '#f59e0b',
                }}
              ></span>

              {estadoBackend === 'conectando'
                ? 'Conectando...'
                : estadoBackend === 'activo'
                  ? 'Backend conectado'
                  : 'Backend desconectado'}
            </span>

            <button
              className="notification-button"
              aria-label="Notificaciones"
            >
              ♧
              <span></span>
            </button>

            <div className="top-avatar">IR</div>
          </div>
        </header>

        <div className="dashboard-content">
          {seccionActiva === 'Productos' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">CATÁLOGO COMERCIAL</span>
                  <h2>Productos</h2>
                  <p>Consultá los productos registrados y agregá nuevos al catálogo.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar producto</h3>
                    <p>Completá los datos para incorporar un producto.</p>
                  </div>
                </div>
                <form onSubmit={crearProducto} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Nombre *
                    <input required minLength={2} maxLength={100} value={formularioProducto.nombre} onChange={(e) => manejarCambioProducto('nombre', e.target.value)} placeholder="Ej. Café en grano" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Categoría *
                    <input required minLength={2} maxLength={80} value={formularioProducto.categoria} onChange={(e) => manejarCambioProducto('categoria', e.target.value)} placeholder="Ej. Alimentos" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Código (opcional)
                    <input value={formularioProducto.codigo} onChange={(e) => manejarCambioProducto('codigo', e.target.value)} placeholder="Código interno o arancelario" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px', gridColumn: '1 / -1' }}>
                    Descripción *
                    <textarea required minLength={5} maxLength={500} value={formularioProducto.descripcion} onChange={(e) => manejarCambioProducto('descripcion', e.target.value)} placeholder="Describí brevemente el producto" rows={3} style={{ ...estiloCampoProducto, resize: 'vertical' }} />
                  </label>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoProducto} style={estiloBotonProducto}>
                      {guardandoProducto ? 'Guardando...' : '+ Registrar producto'}
                    </button>
                    {mensajeProducto && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeProducto}</span>}
                    {errorProductos && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorProductos}</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Productos registrados</h3>
                    <p>{productos.length} producto(s) en el catálogo</p>
                  </div>
                </div>
                {errorProductos && (
                  <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>
                    {errorProductos}
                  </p>
                )}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargandoProductos ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                            Cargando productos...
                          </td>
                        </tr>
                      ) : productos.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                            {errorProductos
                              ? 'No se pudieron cargar los productos.'
                              : 'Todavía no hay productos registrados. Agregá el primero con el formulario de arriba.'}
                          </td>
                        </tr>
                      ) : (
                        productos.map((producto) => (
                          <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td><strong>{producto.nombre}</strong></td>
                            <td>{producto.categoria}</td>
                            <td>{producto.codigo || '—'}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.activo ? 'Activo' : 'Inactivo'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Proveedores' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">RED COMERCIAL</span>
                  <h2>Proveedores</h2>
                  <p>Consultá los proveedores registrados y agregá nuevos contactos comerciales.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar proveedor</h3>
                    <p>Completá los datos de contacto del proveedor.</p>
                  </div>
                </div>
                <form onSubmit={crearProveedor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Nombre *
                    <input required minLength={2} maxLength={100} value={formularioProveedor.nombre} onChange={(e) => manejarCambioProveedor('nombre', e.target.value)} placeholder="Nombre de la empresa o proveedor" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    País *
                    <input required minLength={2} maxLength={80} value={formularioProveedor.pais} onChange={(e) => manejarCambioProveedor('pais', e.target.value)} placeholder="País de origen" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Contacto *
                    <input required minLength={2} maxLength={100} value={formularioProveedor.contacto} onChange={(e) => manejarCambioProveedor('contacto', e.target.value)} placeholder="Persona de contacto" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Correo electrónico (opcional)
                    <input type="email" value={formularioProveedor.email} onChange={(e) => manejarCambioProveedor('email', e.target.value)} placeholder="contacto@empresa.com" style={estiloCampoProducto} />
                  </label>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoProveedor} style={estiloBotonProducto}>
                      {guardandoProveedor ? 'Guardando...' : '+ Registrar proveedor'}
                    </button>
                    {mensajeProveedor && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeProveedor}</span>}
                    {errorProveedores && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorProveedores}</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Proveedores registrados</h3>
                    <p>{proveedores.length} proveedor(es) en el sistema</p>
                  </div>
                </div>
                {errorProveedores && (
                  <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>{errorProveedores}</p>
                )}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>País</th>
                        <th>Contacto</th>
                        <th>Email</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargandoProveedores ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Cargando proveedores...</td></tr>
                      ) : proveedores.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>{errorProveedores ? 'No se pudieron cargar los proveedores.' : 'Todavía no hay proveedores registrados. Agregá el primero con el formulario de arriba.'}</td></tr>
                      ) : (
                        proveedores.map((proveedor) => (
                          <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td><strong>{proveedor.nombre}</strong></td>
                            <td>{proveedor.pais}</td>
                            <td>{proveedor.contacto}</td>
                            <td>{proveedor.email || '—'}</td>
                            <td>{proveedor.activo ? 'Activo' : 'Inactivo'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Cotizaciones' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">GESTIÓN DE PRECIOS</span>
                  <h2>Cotizaciones</h2>
                  <p>Registrá y consultá ofertas comerciales vinculadas a productos y proveedores.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar cotización</h3>
                    <p>Seleccioná un producto y un proveedor, e ingresá las condiciones de la oferta.</p>
                  </div>
                </div>
                <form onSubmit={crearCotizacion} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Producto *
                    <select required value={formularioCotizacion.producto_id} onChange={(e) => manejarCambioCotizacion('producto_id', e.target.value)} style={estiloCampoProducto}>
                      <option value="">Seleccioná un producto</option>
                      {productos.filter((producto) => producto.activo).map((producto) => <option key={producto.id} value={producto.id}>{producto.nombre} (ID: {producto.id})</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Proveedor *
                    <select required value={formularioCotizacion.proveedor_id} onChange={(e) => manejarCambioCotizacion('proveedor_id', e.target.value)} style={estiloCampoProducto}>
                      <option value="">Seleccioná un proveedor</option>
                      {proveedores.filter((proveedor) => proveedor.activo).map((proveedor) => <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre} (ID: {proveedor.id})</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Precio unitario *
                    <input required type="number" min="0.01" step="0.01" value={formularioCotizacion.precio_unitario} onChange={(e) => manejarCambioCotizacion('precio_unitario', e.target.value)} placeholder="Ej. 125.50" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Moneda *
                    <input required minLength={3} maxLength={10} value={formularioCotizacion.moneda} onChange={(e) => manejarCambioCotizacion('moneda', e.target.value)} placeholder="USD" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Cantidad mínima *
                    <input required type="number" min="1" step="1" value={formularioCotizacion.cantidad_minima} onChange={(e) => manejarCambioCotizacion('cantidad_minima', e.target.value)} placeholder="Ej. 100" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Fecha de emisión
                    <input type="date" value={formularioCotizacion.fecha_emision} onChange={(e) => manejarCambioCotizacion('fecha_emision', e.target.value)} style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Fecha de vencimiento
                    <input type="date" min={formularioCotizacion.fecha_emision || undefined} value={formularioCotizacion.fecha_vencimiento} onChange={(e) => manejarCambioCotizacion('fecha_vencimiento', e.target.value)} style={estiloCampoProducto} />
                  </label>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoCotizacion || productos.filter((p) => p.activo).length === 0 || proveedores.filter((p) => p.activo).length === 0} style={estiloBotonProducto}>
                      {guardandoCotizacion ? 'Guardando...' : '+ Registrar cotización'}
                    </button>
                    {mensajeCotizacion && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeCotizacion}</span>}
                    {errorCotizaciones && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorCotizaciones}</span>}
                    {(productos.filter((p) => p.activo).length === 0 || proveedores.filter((p) => p.activo).length === 0) && <span style={{ color: '#64748b', fontSize: '13px' }}>Necesitás al menos un producto activo y un proveedor activo para registrar una cotización.</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Cotizaciones registradas</h3>
                    <p>{cotizaciones.length} cotización(es) en el sistema</p>
                  </div>
                </div>
                {errorCotizaciones && <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>{errorCotizaciones}</p>}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>ID</th><th>Producto</th><th>Proveedor</th><th>Precio unitario</th><th>Moneda</th><th>Cantidad mínima</th><th>Emisión</th><th>Vencimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargandoCotizaciones ? (
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Cargando cotizaciones...</td></tr>
                      ) : cotizaciones.length === 0 ? (
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>{errorCotizaciones ? 'No se pudieron cargar las cotizaciones.' : 'Todavía no hay cotizaciones registradas. Agregá la primera con el formulario de arriba.'}</td></tr>
                      ) : (
                        cotizaciones.map((cotizacion) => {
                          const producto = productos.find((item) => item.id === cotizacion.producto_id)
                          const proveedor = proveedores.find((item) => item.id === cotizacion.proveedor_id)
                          return (
                            <tr key={cotizacion.id}>
                              <td>{cotizacion.id}</td>
                              <td><strong>{producto?.nombre || `Producto #${cotizacion.producto_id}`}</strong></td>
                              <td>{proveedor?.nombre || `Proveedor #${cotizacion.proveedor_id}`}</td>
                              <td>{new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cotizacion.precio_unitario)}</td>
                              <td>{cotizacion.moneda}</td>
                              <td>{cotizacion.cantidad_minima}</td>
                              <td>{cotizacion.fecha_emision || '—'}</td>
                              <td>{cotizacion.fecha_vencimiento || '—'}</td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Órdenes' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">GESTIÓN DE COMPRAS</span>
                  <h2>Órdenes de importación</h2>
                  <p>Creá órdenes con uno o varios productos y seguí su estado.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar orden</h3>
                    <p>Seleccioná proveedor, fecha y agregá al menos un producto.</p>
                  </div>
                </div>

                <form onSubmit={crearOrden} style={{ display: 'grid', gap: '18px', marginTop: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                      Proveedor *
                      <select required value={formularioOrden.proveedor_id} onChange={(e) => setFormularioOrden((actual) => ({ ...actual, proveedor_id: e.target.value }))} style={estiloCampoProducto}>
                        <option value="">Seleccioná un proveedor</option>
                        {proveedores.filter((p) => p.activo).map((p) => <option key={p.id} value={p.id}>{p.nombre} (ID: {p.id})</option>)}
                      </select>
                    </label>
                    <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                      Fecha *
                      <input required type="date" value={formularioOrden.fecha} onChange={(e) => setFormularioOrden((actual) => ({ ...actual, fecha: e.target.value }))} style={estiloCampoProducto} />
                    </label>
                    <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                      Estado inicial
                      <select value={formularioOrden.estado} onChange={(e) => setFormularioOrden((actual) => ({ ...actual, estado: e.target.value }))} style={estiloCampoProducto}>
                        {estadosOrden.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                      </select>
                    </label>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <strong>Productos de la orden</strong>
                      <button type="button" onClick={agregarLineaOrden} style={{ ...estiloBotonProducto, background: '#e8efff', color: '#2457d6' }}>+ Agregar producto</button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {formularioOrden.productos.map((linea, indice) => (
                        <div key={indice} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', padding: '14px', border: '1px solid #e1e7ef', borderRadius: '10px' }}>
                          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Producto *
                            <select required value={linea.producto_id} onChange={(e) => actualizarLineaOrden(indice, 'producto_id', e.target.value)} style={estiloCampoProducto}>
                              <option value="">Seleccioná</option>
                              {productos.filter((p) => p.activo).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                          </label>
                          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Cantidad *
                            <input required type="number" min="1" step="1" value={linea.cantidad} onChange={(e) => actualizarLineaOrden(indice, 'cantidad', e.target.value)} style={estiloCampoProducto} />
                          </label>
                          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Precio unitario *
                            <input required type="number" min="0" step="0.01" value={linea.precio_unitario} onChange={(e) => actualizarLineaOrden(indice, 'precio_unitario', e.target.value)} style={estiloCampoProducto} />
                          </label>
                          <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Moneda *
                            <input required minLength={3} maxLength={10} value={linea.moneda} onChange={(e) => actualizarLineaOrden(indice, 'moneda', e.target.value)} style={estiloCampoProducto} />
                          </label>
                          <div style={{ display: 'flex', alignItems: 'end' }}>
                            <button type="button" disabled={formularioOrden.productos.length === 1} onClick={() => quitarLineaOrden(indice)} style={{ ...estiloBotonProducto, background: '#fee2e2', color: '#b91c1c', width: '100%' }}>Quitar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Observaciones (opcional)
                    <textarea rows={3} value={formularioOrden.observaciones} onChange={(e) => setFormularioOrden((actual) => ({ ...actual, observaciones: e.target.value }))} placeholder="Notas adicionales de la orden" style={{ ...estiloCampoProducto, resize: 'vertical' }} />
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoOrden || !proveedores.some((p) => p.activo) || !productos.some((p) => p.activo)} style={estiloBotonProducto}>
                      {guardandoOrden ? 'Guardando...' : '+ Registrar orden'}
                    </button>
                    {mensajeOrden && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeOrden}</span>}
                    {errorOrdenes && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorOrdenes}</span>}
                    {(!proveedores.some((p) => p.activo) || !productos.some((p) => p.activo)) && <span style={{ color: '#64748b', fontSize: '13px' }}>Necesitás al menos un proveedor activo y un producto activo.</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Órdenes registradas</h3>
                    <p>{ordenes.length} orden(es) en el sistema</p>
                  </div>
                </div>
                {errorOrdenes && <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>{errorOrdenes}</p>}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
                    <thead><tr><th>ID</th><th>Proveedor</th><th>Fecha</th><th>Productos</th><th>Estado</th><th>Observaciones</th><th>Acciones</th></tr></thead>
                    <tbody>
                      {cargandoOrdenes ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Cargando órdenes...</td></tr>
                      ) : ordenes.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Todavía no hay órdenes registradas. Creá la primera con el formulario de arriba.</td></tr>
                      ) : ordenes.map((orden) => {
                        const proveedor = proveedores.find((p) => p.id === orden.proveedor_id)
                        return (
                          <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>{proveedor?.nombre || `Proveedor #${orden.proveedor_id}`}</td>
                            <td>{orden.fecha}</td>
                            <td>{orden.productos.map((linea) => {
                              const producto = productos.find((p) => p.id === linea.producto_id)
                              return <div key={linea.producto_id}>{producto?.nombre || `Producto #${linea.producto_id}`} · {linea.cantidad} × {linea.precio_unitario} {linea.moneda}</div>
                            })}</td>
                            <td>
                              <select value={orden.estado} onChange={(e) => cambiarEstadoOrden(orden, e.target.value)} style={{ ...estiloCampoProducto, minWidth: '150px', padding: '7px' }}>
                                {estadosOrden.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                              </select>
                            </td>
                            <td>{orden.observaciones || '—'}</td>
                            <td><button type="button" onClick={() => eliminarOrden(orden.id)} style={{ ...estiloBotonProducto, background: '#fee2e2', color: '#b91c1c', padding: '8px 10px' }}>Eliminar</button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Envíos' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">LOGÍSTICA Y SEGUIMIENTO</span>
                  <h2>Envíos</h2>
                  <p>Registrá los despachos y seguí el estado de cada importación.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar envío</h3>
                    <p>Cada orden puede tener un único envío registrado.</p>
                  </div>
                </div>

                <form onSubmit={crearEnvio} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Orden de importación *
                    <select required value={formularioEnvio.orden_id} onChange={(e) => setFormularioEnvio((actual) => ({ ...actual, orden_id: e.target.value }))} style={estiloCampoProducto}>
                      <option value="">Seleccioná una orden</option>
                      {ordenes.filter((orden) => !envios.some((envio) => envio.orden_id === orden.id)).map((orden) => {
                        const proveedor = proveedores.find((item) => item.id === orden.proveedor_id)
                        return <option key={orden.id} value={orden.id}>Orden #{orden.id} · {proveedor?.nombre || `Proveedor #${orden.proveedor_id}`} · {orden.fecha}</option>
                      })}
                    </select>
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Transportista
                    <input value={formularioEnvio.transportista} onChange={(e) => setFormularioEnvio((actual) => ({ ...actual, transportista: e.target.value }))} placeholder="Ej. DHL, Maersk" style={estiloCampoProducto} />
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Código de seguimiento
                    <input value={formularioEnvio.codigo_seguimiento} onChange={(e) => setFormularioEnvio((actual) => ({ ...actual, codigo_seguimiento: e.target.value }))} placeholder="Número de tracking" style={estiloCampoProducto} />
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Fecha estimada de entrega
                    <input type="date" value={formularioEnvio.fecha_estimada} onChange={(e) => setFormularioEnvio((actual) => ({ ...actual, fecha_estimada: e.target.value }))} style={estiloCampoProducto} />
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Estado inicial
                    <select value={formularioEnvio.estado} onChange={(e) => setFormularioEnvio((actual) => ({ ...actual, estado: e.target.value }))} style={estiloCampoProducto}>
                      {estadosEnvio.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                    </select>
                  </label>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoEnvio || !ordenes.some((orden) => !envios.some((envio) => envio.orden_id === orden.id))} style={estiloBotonProducto}>
                      {guardandoEnvio ? 'Guardando...' : '+ Registrar envío'}
                    </button>
                    {mensajeEnvio && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeEnvio}</span>}
                    {errorEnvios && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorEnvios}</span>}
                    {ordenes.length === 0 && <span style={{ color: '#64748b', fontSize: '13px' }}>Primero necesitás registrar una orden de importación.</span>}
                    {ordenes.length > 0 && ordenes.every((orden) => envios.some((envio) => envio.orden_id === orden.id)) && <span style={{ color: '#64748b', fontSize: '13px' }}>Todas las órdenes ya tienen un envío registrado.</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Seguimiento de envíos</h3>
                    <p>{envios.length} envío(s) registrados</p>
                  </div>
                </div>
                {errorEnvios && <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>{errorEnvios}</p>}
                {mensajeEnvio && <p style={{ color: '#15803d', marginBottom: '12px' }}>{mensajeEnvio}</p>}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr><th>ID</th><th>Orden</th><th>Transportista</th><th>Seguimiento</th><th>Fecha estimada</th><th>Fecha real</th><th>Estado e historial</th><th>Actualizar</th></tr>
                    </thead>
                    <tbody>
                      {cargandoEnvios ? (
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Cargando envíos...</td></tr>
                      ) : envios.length === 0 ? (
                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Todavía no hay envíos registrados. Creá el primero con el formulario de arriba.</td></tr>
                      ) : envios.map((envio) => (
                        <tr key={envio.id}>
                          <td>{envio.id}</td>
                          <td>#{envio.orden_id}</td>
                          <td>{envio.transportista || '—'}</td>
                          <td>{envio.codigo_seguimiento || '—'}</td>
                          <td>{envio.fecha_estimada || '—'}</td>
                          <td>{envio.fecha_real || '—'}</td>
                          <td style={{ minWidth: '190px' }}>
                            <strong>{envio.estado}</strong>
                            {envio.historial.length > 0 && <details style={{ marginTop: '6px' }}>
                              <summary style={{ cursor: 'pointer', color: '#2457d6', fontSize: '13px' }}>Ver historial ({envio.historial.length})</summary>
                              <div style={{ display: 'grid', gap: '5px', marginTop: '7px', fontSize: '12px' }}>
                                {envio.historial.map((registro, indice) => <div key={`${envio.id}-${indice}`}><strong>{registro.estado}</strong>{registro.observacion ? ` · ${registro.observacion}` : ''}</div>)}
                              </div>
                            </details>}
                          </td>
                          <td style={{ minWidth: '220px' }}>
                            <div style={{ display: 'grid', gap: '7px' }}>
                              <select aria-label={`Estado del envío ${envio.id}`} value={envio.estado} onChange={(e) => cambiarEstadoEnvio(envio, e.target.value)} disabled={actualizandoEnvio === envio.id} style={{ ...estiloCampoProducto, padding: '7px' }}>
                                {estadosEnvio.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                              </select>
                              <input aria-label={`Observación del envío ${envio.id}`} value={observacionesEnvio[envio.id] || ''} onChange={(e) => setObservacionesEnvio((actuales) => ({ ...actuales, [envio.id]: e.target.value }))} placeholder="Observación del cambio (opcional)" style={{ ...estiloCampoProducto, padding: '7px', fontSize: '12px' }} />
                              {actualizandoEnvio === envio.id && <small>Actualizando...</small>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Reclamos' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">ATENCIÓN Y CONTROL COMERCIAL</span>
                  <h2>Reclamos</h2>
                  <p>Registrá incidencias con proveedores y seguí su resolución.</p>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Registrar reclamo</h3>
                    <p>Asociá el reclamo a un proveedor y, si corresponde, a una orden.</p>
                  </div>
                </div>

                <form onSubmit={crearReclamo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Proveedor *
                    <select required value={formularioReclamo.proveedor_id} onChange={(e) => setFormularioReclamo((actual) => ({ ...actual, proveedor_id: e.target.value, orden_id: '' }))} style={estiloCampoProducto}>
                      <option value="">Seleccioná un proveedor</option>
                      {proveedores.filter((proveedor) => proveedor.activo).map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre} · {proveedor.pais}</option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Orden relacionada (opcional)
                    <select value={formularioReclamo.orden_id} onChange={(e) => setFormularioReclamo((actual) => ({ ...actual, orden_id: e.target.value }))} disabled={!formularioReclamo.proveedor_id} style={estiloCampoProducto}>
                      <option value="">Sin orden asociada</option>
                      {ordenes.filter((orden) => orden.proveedor_id === Number(formularioReclamo.proveedor_id)).map((orden) => (
                        <option key={orden.id} value={orden.id}>Orden #{orden.id} · {orden.fecha}</option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Fecha *
                    <input required type="date" value={formularioReclamo.fecha} onChange={(e) => setFormularioReclamo((actual) => ({ ...actual, fecha: e.target.value }))} style={estiloCampoProducto} />
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>
                    Estado inicial
                    <select value={formularioReclamo.estado} onChange={(e) => setFormularioReclamo((actual) => ({ ...actual, estado: e.target.value }))} style={estiloCampoProducto}>
                      {estadosReclamo.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                    </select>
                  </label>

                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px', gridColumn: '1 / -1' }}>
                    Descripción del reclamo *
                    <textarea required minLength={5} value={formularioReclamo.descripcion} onChange={(e) => setFormularioReclamo((actual) => ({ ...actual, descripcion: e.target.value }))} placeholder="Describí el problema o la incidencia" rows={4} style={{ ...estiloCampoProducto, resize: 'vertical' }} />
                  </label>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button type="submit" disabled={guardandoReclamo || proveedores.filter((proveedor) => proveedor.activo).length === 0} style={estiloBotonProducto}>
                      {guardandoReclamo ? 'Guardando...' : '+ Registrar reclamo'}
                    </button>
                    {mensajeReclamo && <span style={{ color: '#15803d', fontSize: '14px' }}>{mensajeReclamo}</span>}
                    {errorReclamos && <span role="alert" style={{ color: '#dc2626', fontSize: '14px' }}>{errorReclamos}</span>}
                    {proveedores.filter((proveedor) => proveedor.activo).length === 0 && <span style={{ color: '#64748b', fontSize: '13px' }}>Primero necesitás registrar un proveedor activo.</span>}
                  </div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading">
                  <div>
                    <h3>Reclamos registrados</h3>
                    <p>{reclamos.length} reclamo(s) en el sistema</p>
                  </div>
                </div>
                {errorReclamos && <p role="alert" style={{ color: '#dc2626', marginBottom: '12px' }}>{errorReclamos}</p>}
                {mensajeReclamo && <p style={{ color: '#15803d', marginBottom: '12px' }}>{mensajeReclamo}</p>}
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '1150px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr><th>ID</th><th>Proveedor</th><th>Orden</th><th>Fecha</th><th>Descripción</th><th>Estado y respuesta</th><th>Actualizar</th></tr>
                    </thead>
                    <tbody>
                      {cargandoReclamos ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Cargando reclamos...</td></tr>
                      ) : reclamos.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Todavía no hay reclamos registrados. Creá el primero con el formulario de arriba.</td></tr>
                      ) : reclamos.map((reclamo) => {
                        const proveedor = proveedores.find((item) => item.id === reclamo.proveedor_id)
                        return (
                          <tr key={reclamo.id}>
                            <td>{reclamo.id}</td>
                            <td>{proveedor?.nombre || `Proveedor #${reclamo.proveedor_id}`}</td>
                            <td>{reclamo.orden_id ? `#${reclamo.orden_id}` : '—'}</td>
                            <td>{reclamo.fecha}</td>
                            <td style={{ maxWidth: '260px', whiteSpace: 'normal' }}>{reclamo.descripcion}</td>
                            <td style={{ minWidth: '220px', whiteSpace: 'normal' }}>
                              <strong>{reclamo.estado}</strong>
                              {reclamo.respuesta && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748b' }}>Respuesta: {reclamo.respuesta}</p>}
                            </td>
                            <td style={{ minWidth: '230px' }}>
                              <div style={{ display: 'grid', gap: '7px' }}>
                                <select aria-label={`Estado del reclamo ${reclamo.id}`} value={reclamo.estado} onChange={(e) => cambiarEstadoReclamo(reclamo, e.target.value)} disabled={actualizandoReclamo === reclamo.id} style={{ ...estiloCampoProducto, padding: '7px' }}>
                                  {estadosReclamo.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                                </select>
                                <input aria-label={`Respuesta del reclamo ${reclamo.id}`} value={respuestasReclamo[reclamo.id] || ''} onChange={(e) => setRespuestasReclamo((actuales) => ({ ...actuales, [reclamo.id]: e.target.value }))} placeholder="Respuesta / comentario (opcional)" style={{ ...estiloCampoProducto, padding: '7px', fontSize: '12px' }} />
                                {actualizandoReclamo === reclamo.id && <small>Actualizando...</small>}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Oportunidades' ? (
            <>
              <section className="welcome-section">
                <div><span className="eyebrow">RADAR COMERCIAL</span><h2>Oportunidades</h2><p>Registrá productos detectados y compará oportunidades de importación de distintas fuentes.</p></div>
              </section>
              {errorOportunidades && <p role="alert" style={{ color: '#dc2626', marginBottom: '14px' }}>{errorOportunidades}</p>}
              {mensajeOportunidad && <p role="status" style={{ color: '#15803d', marginBottom: '14px' }}>{mensajeOportunidad}</p>}

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Carga manual</h3><p>Registrá una oportunidad completando los datos comerciales.</p></div></div>
                <form onSubmit={crearOportunidad} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Nombre del producto *<input required minLength={2} maxLength={100} value={formularioOportunidad.nombre} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, nombre: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Categoría *<input required minLength={2} maxLength={80} value={formularioOportunidad.categoria} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, categoria: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>País de origen *<input required minLength={2} maxLength={80} value={formularioOportunidad.pais_origen} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, pais_origen: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Precio *<input required type="number" min="0.01" step="0.01" value={formularioOportunidad.precio} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, precio: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Moneda *<input required minLength={3} maxLength={10} value={formularioOportunidad.moneda} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, moneda: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Fuente *<input required minLength={2} maxLength={100} value={formularioOportunidad.fuente} onChange={(e) => setFormularioOportunidad((a) => ({ ...a, fuente: e.target.value }))} style={estiloCampoProducto} /></label>
                  <div style={{ gridColumn: '1 / -1' }}><button type="submit" disabled={guardandoOportunidad} style={estiloBotonProducto}>{guardandoOportunidad ? 'Guardando...' : '+ Registrar oportunidad'}</button></div>
                </form>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Importar desde catálogo de proveedor</h3><p>Campos del adaptador: product_name, category, origin_country, unit_price y currency.</p></div></div>
                <form onSubmit={importarOportunidadProveedor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Nombre del producto *<input required value={formularioOportunidadProveedor.product_name} onChange={(e) => setFormularioOportunidadProveedor((a) => ({ ...a, product_name: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Categoría *<input required value={formularioOportunidadProveedor.category} onChange={(e) => setFormularioOportunidadProveedor((a) => ({ ...a, category: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>País de origen *<input required value={formularioOportunidadProveedor.origin_country} onChange={(e) => setFormularioOportunidadProveedor((a) => ({ ...a, origin_country: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Precio unitario *<input required type="number" min="0.01" step="0.01" value={formularioOportunidadProveedor.unit_price} onChange={(e) => setFormularioOportunidadProveedor((a) => ({ ...a, unit_price: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Moneda *<input required minLength={3} maxLength={10} value={formularioOportunidadProveedor.currency} onChange={(e) => setFormularioOportunidadProveedor((a) => ({ ...a, currency: e.target.value }))} style={estiloCampoProducto} /></label>
                  <div style={{ gridColumn: '1 / -1' }}><button type="submit" disabled={guardandoOportunidad} style={estiloBotonProducto}>{guardandoOportunidad ? 'Importando...' : 'Importar catálogo de proveedor'}</button></div>
                </form>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Importar desde archivo comercial</h3><p>Campos del adaptador: nombre_producto, rubro, pais, precio y moneda.</p></div></div>
                <form onSubmit={importarOportunidadArchivo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Nombre del producto *<input required value={formularioOportunidadArchivo.nombre_producto} onChange={(e) => setFormularioOportunidadArchivo((a) => ({ ...a, nombre_producto: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Rubro *<input required value={formularioOportunidadArchivo.rubro} onChange={(e) => setFormularioOportunidadArchivo((a) => ({ ...a, rubro: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>País *<input required value={formularioOportunidadArchivo.pais} onChange={(e) => setFormularioOportunidadArchivo((a) => ({ ...a, pais: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Precio *<input required type="number" min="0.01" step="0.01" value={formularioOportunidadArchivo.precio} onChange={(e) => setFormularioOportunidadArchivo((a) => ({ ...a, precio: e.target.value }))} style={estiloCampoProducto} /></label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Moneda *<input required minLength={3} maxLength={10} value={formularioOportunidadArchivo.moneda} onChange={(e) => setFormularioOportunidadArchivo((a) => ({ ...a, moneda: e.target.value }))} style={estiloCampoProducto} /></label>
                  <div style={{ gridColumn: '1 / -1' }}><button type="submit" disabled={guardandoOportunidad} style={estiloBotonProducto}>{guardandoOportunidad ? 'Importando...' : 'Importar archivo comercial'}</button></div>
                </form>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading"><div><h3>Oportunidades registradas</h3><p>{oportunidades.length} oportunidad(es) en el sistema</p></div></div>
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
                    <thead><tr><th>ID</th><th>Producto</th><th>Categoría</th><th>País de origen</th><th>Precio</th><th>Moneda</th><th>Fuente</th><th>Fecha de consulta</th></tr></thead>
                    <tbody>
                      {cargandoOportunidades ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Cargando oportunidades...</td></tr>
                        : oportunidades.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Todavía no hay oportunidades registradas. Usá alguno de los formularios de arriba.</td></tr>
                        : oportunidades.map((o) => <tr key={o.id}><td>{o.id}</td><td><strong>{o.nombre}</strong></td><td>{o.categoria}</td><td>{o.pais_origen}</td><td>{new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(o.precio)}</td><td>{o.moneda}</td><td>{o.fuente}</td><td>{o.fecha_consulta}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Costos' ? (
            <>
              <section className="welcome-section">
                <div><span className="eyebrow">ANÁLISIS DE IMPORTACIÓN</span><h2>Costos de importación</h2><p>Calculá el costo total y unitario de una orden, incluyendo gastos y tributos.</p></div>
              </section>

              {errorCostos && <p role="alert" style={{ color: '#dc2626', marginBottom: '14px' }}>{errorCostos}</p>}
              {mensajeCosto && <p role="status" style={{ color: '#15803d', marginBottom: '14px' }}>{mensajeCosto}</p>}

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Calcular costo de una orden</h3><p>Ingresá los importes en la moneda indicada. Todos los importes deben ser mayores o iguales a cero.</p></div></div>
                <form onSubmit={calcularCostoImportacion} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px', gridColumn: '1 / -1' }}>Orden de importación *
                    <select required value={ordenCostoId} onChange={(e) => { setOrdenCostoId(e.target.value); setResultadoCosto(null); setMensajeCosto('') }} style={estiloCampoProducto}>
                      <option value="">Seleccioná una orden</option>
                      {ordenes.map((orden) => <option key={orden.id} value={orden.id}>Orden #{orden.id} · {orden.fecha} · {orden.estado}</option>)}
                    </select>
                  </label>
                  {([['precio_compra', 'Precio de compra *'], ['transporte', 'Transporte *'], ['seguro', 'Seguro *'], ['tributos', 'Tributos *'], ['otros_gastos', 'Otros gastos *']] as const).map(([campo, etiqueta]) => (
                    <label key={campo} style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>{etiqueta}
                      <input required type="number" min="0" step="0.01" value={formularioCosto[campo]} onChange={(e) => setFormularioCosto((actual) => ({ ...actual, [campo]: e.target.value }))} placeholder="0.00" style={estiloCampoProducto} />
                    </label>
                  ))}
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Cantidad *
                    <input required type="number" min="1" step="1" value={formularioCosto.cantidad} onChange={(e) => setFormularioCosto((actual) => ({ ...actual, cantidad: e.target.value }))} placeholder="Ej. 100" style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontWeight: 600, fontSize: '14px' }}>Moneda *
                    <input required minLength={3} maxLength={10} value={formularioCosto.moneda} onChange={(e) => setFormularioCosto((actual) => ({ ...actual, moneda: e.target.value }))} placeholder="USD" style={estiloCampoProducto} />
                  </label>
                  <div style={{ gridColumn: '1 / -1' }}><button type="submit" disabled={guardandoCosto || !ordenCostoId || cargandoCostos} style={estiloBotonProducto}>{guardandoCosto ? 'Calculando...' : 'Calcular y guardar costo'}</button>{ordenes.length === 0 && <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '13px' }}>Primero necesitás registrar una orden de importación.</span>}</div>
                </form>
              </section>

              {resultadoCosto && (
                <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                  <div className="panel-heading"><div><h3>Resultado del cálculo · Orden #{ordenCostoId}</h3><p>Resumen de los costos ingresados.</p></div></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '18px' }}>
                    <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '18px' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Costo total</span><h2 style={{ margin: '8px 0 0', color: '#17243a' }}>{formatoImporte(resultadoCosto.costo_total, resultadoCosto.moneda)}</h2></div>
                    <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '18px' }}><span style={{ color: '#64748b', fontSize: '13px' }}>Costo unitario</span><h2 style={{ margin: '8px 0 0', color: '#2457d6' }}>{formatoImporte(resultadoCosto.costo_unitario, resultadoCosto.moneda)}</h2></div>
                  </div>
                  <p style={{ marginTop: '14px', color: '#64748b', fontSize: '13px' }}>Cantidad considerada: {resultadoCosto.cantidad} unidades.</p>
                </section>
              )}

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading"><div><h3>Historial de costos</h3><p>Registros asociados a la orden seleccionada.</p></div></div>
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '1050px', borderCollapse: 'collapse' }}>
                    <thead><tr><th>Fecha</th><th>Compra</th><th>Transporte</th><th>Seguro</th><th>Tributos</th><th>Otros gastos</th><th>Cantidad</th><th>Costo total</th><th>Costo unitario</th></tr></thead>
                    <tbody>
                      {cargandoCostos ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>Cargando costos...</td></tr>
                        : historialCostos.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>{ordenCostoId ? 'Todavía no hay cálculos guardados para esta orden.' : 'Seleccioná una orden para consultar sus costos.'}</td></tr>
                        : historialCostos.map((costo, indice) => <tr key={costo.id ?? `${indice}-${costo.costo_total}`}><td>{costo.fecha_calculo || '—'}</td><td>{formatoImporte(costo.precio_compra, costo.moneda)}</td><td>{formatoImporte(costo.transporte, costo.moneda)}</td><td>{formatoImporte(costo.seguro, costo.moneda)}</td><td>{formatoImporte(costo.tributos, costo.moneda)}</td><td>{formatoImporte(costo.otros_gastos, costo.moneda)}</td><td>{costo.cantidad}</td><td><strong>{formatoImporte(costo.costo_total, costo.moneda)}</strong></td><td>{formatoImporte(costo.costo_unitario, costo.moneda)}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : seccionActiva === 'Análisis' ? (
            <>
              <section className="welcome-section">
                <div>
                  <span className="eyebrow">INTELIGENCIA COMERCIAL</span>
                  <h2>Análisis de oportunidades</h2>
                  <p>Explorá la evolución de las importaciones, compará valores CIF y detectá productos y mercados en crecimiento.</p>
                </div>
                <button className="date-filter" onClick={() => { setFiltroAnalisis(''); setPaisAnalisis('Todos') }}>
                  Limpiar filtros
                </button>
              </section>

              {errorEvolucion && <section className="panel" style={{ padding: '18px 22px', color: '#b91c1c' }} role="alert">{errorEvolucion}</section>}

              <section className="stats-grid">
                <article className="stat-card"><div className="stat-top"><span>Productos analizados</span><div className="stat-icon blue">▥</div></div><h3>{cargandoEvolucion ? '—' : evoluciones.length}</h3><p>Registros de evolución disponibles</p></article>
                <article className="stat-card"><div className="stat-top"><span>Valor CIF actual</span><div className="stat-icon green">$</div></div><h3>{cargandoEvolucion ? '—' : formatoUSD(valorTotalActual)}</h3><p>Total acumulado del período actual</p></article>
                <article className="stat-card"><div className="stat-top"><span>Tendencias en alza</span><div className="stat-icon green">↗</div></div><h3>{cargandoEvolucion ? '—' : cantidadEnAlza}</h3><p>Productos con variación positiva</p></article>
                <article className="stat-card"><div className="stat-top"><span>Tendencias en baja</span><div className="stat-icon orange">↘</div></div><h3>{cargandoEvolucion ? '—' : cantidadEnBaja}</h3><p>Productos con variación negativa</p></article>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Explorar datos</h3><p>Filtrá por producto, código arancelario o país de origen.</p></div></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '18px' }}>
                  <label style={{ display: 'grid', gap: '7px', fontSize: '14px', fontWeight: 600 }}>Buscar producto o código
                    <input value={filtroAnalisis} onChange={(e) => setFiltroAnalisis(e.target.value)} placeholder="Ej.: maquinaria, 8471..." style={estiloCampoProducto} />
                  </label>
                  <label style={{ display: 'grid', gap: '7px', fontSize: '14px', fontWeight: 600 }}>País de origen
                    <select value={paisAnalisis} onChange={(e) => setPaisAnalisis(e.target.value)} style={estiloCampoProducto}>
                      <option value="Todos">Todos los países</option>
                      {paisesAnalisis.map((pais) => <option key={pais} value={pais}>{pais}</option>)}
                    </select>
                  </label>
                </div>
              </section>

              <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div className="panel-heading"><div><h3>Comparación de valores CIF</h3><p>Período anterior frente al período actual · {evolucionesFiltradas.length} resultado(s)</p></div></div>
                {cargandoEvolucion ? <p style={{ marginTop: '18px' }}>Cargando análisis...</p> : evolucionesFiltradas.length === 0 ? <p style={{ marginTop: '18px', color: '#64748b' }}>No hay registros que coincidan con los filtros seleccionados.</p> : (
                  <div className="evolucion-lista" style={{ marginTop: '18px' }}>
                    {evolucionesFiltradas.map((item) => {
                      const maximo = Math.max(item.valor_cif_anterior, item.valor_cif_actual, 1)
                      return <div className="evolucion-item" key={`${item.codigo_producto}-${item.pais_origen}`}>
                        <div className="evolucion-titulo"><strong>{item.producto}</strong><span>{item.pais_origen} · {item.codigo_producto}</span></div>
                        <div className="evolucion-barras">
                          <div className="evolucion-barra-fondo"><div className="evolucion-barra anterior" style={{ width: `${(item.valor_cif_anterior / maximo) * 100}%` }} /></div>
                          <div className="evolucion-barra-fondo"><div className="evolucion-barra actual" style={{ width: `${(item.valor_cif_actual / maximo) * 100}%` }} /></div>
                        </div>
                        <div className="evolucion-valores"><span>{item.periodo_anterior}: {formatoUSD(item.valor_cif_anterior)}</span><span>{item.periodo_actual}: {formatoUSD(item.valor_cif_actual)}</span></div>
                        <div className="evolucion-tendencia"><strong className={item.variacion_porcentual >= 0 ? 'tendencia-positiva' : 'tendencia-negativa'}>{item.variacion_porcentual > 0 ? '+' : ''}{item.variacion_porcentual.toFixed(2)}%</strong><span>{item.tendencia}</span></div>
                      </div>
                    })}
                  </div>
                )}
                <div className="evolucion-leyenda" style={{ marginTop: '18px' }}><span><i className="leyenda-anterior"></i> Período anterior</span><span><i className="leyenda-actual"></i> Período actual</span></div>
              </section>

              <section className="panel bottom-panel" style={{ padding: '24px' }}>
                <div className="panel-heading"><div><h3>Detalle del análisis</h3><p>Valores y variaciones para cada producto y mercado.</p></div></div>
                <div className="tabla-evolucion" style={{ overflowX: 'auto' }}>
                  <table style={{ minWidth: '900px' }}><thead><tr><th>Producto</th><th>Código</th><th>País</th><th>Período anterior</th><th>Período actual</th><th>Variación</th><th>Tendencia</th></tr></thead>
                    <tbody>{cargandoEvolucion ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</td></tr> : evolucionesFiltradas.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay datos para mostrar.</td></tr> : evolucionesFiltradas.map((item) => <tr key={`${item.codigo_producto}-${item.pais_origen}`}><td>{item.producto}</td><td>{item.codigo_producto}</td><td>{item.pais_origen}</td><td>{formatoUSD(item.valor_cif_anterior)}</td><td>{formatoUSD(item.valor_cif_actual)}</td><td className={item.variacion_porcentual >= 0 ? 'tendencia-positiva' : 'tendencia-negativa'}>{item.variacion_porcentual > 0 ? '+' : ''}{item.variacion_porcentual.toFixed(2)}%</td><td>{item.tendencia}</td></tr>)}</tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            <>
          <section className="welcome-section">
            <div>
              <span className="eyebrow">CENTRO DE CONTROL</span>
              <h2>
                {seccionActiva === 'Dashboard'
                  ? 'Dashboard'
                  : seccionActiva}
              </h2>
              <p>
                {seccionActiva === 'Dashboard'
                  ? 'Bienvenido a ImportaRadar. Este es el resumen de tu actividad comercial.'
                  : `Panel de gestión de ${seccionActiva.toLowerCase()}.`}
              </p>
            </div>

            <button className="date-filter">
              <span>▦</span>
              Últimos 12 meses
              <span>⌄</span>
            </button>
          </section>

          <section className="stats-grid">
            {indicadores.map((item) => (
              <article className="stat-card" key={item.titulo}>
                <div className="stat-top">
                  <span>{item.titulo}</span>
                  <div className={`stat-icon ${item.color}`}>
                    {item.icono}
                  </div>
                </div>
                <h3>{cargandoIndicadores ? '—' : item.valor}</h3>
                <p>{item.cambio}</p>
              </article>
            ))}
          </section>

          <section className="charts-grid">
            <article className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <h3>Evolución de importaciones</h3>
                  <p>Comparación de valores CIF por producto</p>
                </div>
                <span className="chart-label">2023 - 2024</span>
              </div>

              {cargandoEvolucion ? (
                <p>Cargando datos de importaciones...</p>
              ) : errorEvolucion ? (
                <p>{errorEvolucion}</p>
              ) : evoluciones.length === 0 ? (
                <p>No hay datos de evolución disponibles.</p>
              ) : (
                <>
                  <div className="chart-summary">
                    <strong>{formatoUSD(valorTotalActual)}</strong>
                    <span>
                      Valor CIF actual acumulado · Datos de{' '}
                      {evoluciones[0].periodo_actual}
                    </span>
                  </div>

                  <div className="evolucion-lista">
                    {evoluciones.map((item) => {
                      const maximo = Math.max(
                        item.valor_cif_anterior,
                        item.valor_cif_actual,
                        1
                      )

                      return (
                        <div
                          className="evolucion-item"
                          key={`${item.codigo_producto}-${item.pais_origen}`}
                        >
                          <div className="evolucion-titulo">
                            <strong>{item.producto}</strong>
                            <span>{item.pais_origen}</span>
                          </div>

                          <div className="evolucion-barras">
                            <div className="evolucion-barra-fondo">
                              <div
                                className="evolucion-barra anterior"
                                style={{
                                  width: `${
                                    (item.valor_cif_anterior / maximo) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="evolucion-barra-fondo">
                              <div
                                className="evolucion-barra actual"
                                style={{
                                  width: `${
                                    (item.valor_cif_actual / maximo) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="evolucion-valores">
                            <span>
                              {item.periodo_anterior}:{' '}
                              {formatoUSD(item.valor_cif_anterior)}
                            </span>
                            <span>
                              {item.periodo_actual}:{' '}
                              {formatoUSD(item.valor_cif_actual)}
                            </span>
                          </div>

                          <div className="evolucion-tendencia">
                            <strong
                              className={
                                item.variacion_porcentual >= 0
                                  ? 'tendencia-positiva'
                                  : 'tendencia-negativa'
                              }
                            >
                              {item.variacion_porcentual > 0 ? '+' : ''}
                              {item.variacion_porcentual.toFixed(2)}%
                            </strong>
                            <span>{item.tendencia}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="evolucion-leyenda">
                    <span>
                      <i className="leyenda-anterior"></i>{' '}
                      {evoluciones[0].periodo_anterior}
                    </span>
                    <span>
                      <i className="leyenda-actual"></i>{' '}
                      {evoluciones[0].periodo_actual}
                    </span>
                  </div>
                </>
              )}
            </article>

            <article className="panel countries-panel">
              <div className="panel-heading">
                <div>
                  <h3>Principales países</h3>
                  <p>Origen de los productos analizados</p>
                </div>
                <span className="more-options">···</span>
              </div>

              {cargandoEvolucion ? (
                <p>Cargando países...</p>
              ) : errorEvolucion ? (
                <p>No se pudieron cargar los países.</p>
              ) : (
                <div className="countries-list">
                  {Array.from(
                    evoluciones.reduce((mapa, item) => {
                      mapa.set(
                        item.pais_origen,
                        (mapa.get(item.pais_origen) || 0) +
                          item.valor_cif_actual
                      )
                      return mapa
                    }, new Map<string, number>())
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([pais, valor]) => {
                      const total = evoluciones.reduce(
                        (suma, item) => suma + item.valor_cif_actual,
                        0
                      )

                      return (
                        <div className="country-item" key={pais}>
                          <div className="country-info">
                            <div className="country-code">
                              {pais.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong>{pais}</strong>
                              <span>{formatoUSD(valor)}</span>
                            </div>
                          </div>
                          <div className="country-progress">
                            <div
                              className="country-progress-fill"
                              style={{
                                width: `${
                                  total > 0 ? (valor / total) * 100 : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </article>
          </section>

          <section className="panel bottom-panel">
            <div className="panel-heading">
              <div>
                <h3>Detalle de evolución por producto</h3>
                <p>Datos obtenidos desde el análisis de importaciones</p>
              </div>
            </div>

            {cargandoEvolucion ? (
              <p>Cargando información...</p>
            ) : errorEvolucion ? (
              <p>{errorEvolucion}</p>
            ) : evoluciones.length === 0 ? (
              <p>No hay datos para mostrar.</p>
            ) : (
              <div className="tabla-evolucion">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Código</th>
                      <th>País de origen</th>
                      <th>Valor CIF 2023</th>
                      <th>Valor CIF 2024</th>
                      <th>Variación</th>
                      <th>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evoluciones.map((item) => (
                      <tr
                        key={`${item.codigo_producto}-${item.pais_origen}`}
                      >
                        <td>{item.producto}</td>
                        <td>{item.codigo_producto}</td>
                        <td>{item.pais_origen}</td>
                        <td>{formatoUSD(item.valor_cif_anterior)}</td>
                        <td>{formatoUSD(item.valor_cif_actual)}</td>
                        <td
                          className={
                            item.variacion_porcentual >= 0
                              ? 'tendencia-positiva'
                              : 'tendencia-negativa'
                          }
                        >
                          {item.variacion_porcentual > 0 ? '+' : ''}
                          {item.variacion_porcentual.toFixed(2)}%
                        </td>
                        <td>{item.tendencia}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="footer">
            <span>© 2026 ImportaRadar</span>
            <span>Plataforma de gestión de importaciones</span>
          </footer>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
