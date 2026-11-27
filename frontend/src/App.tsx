
import { useEffect, useState } from 'react'
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

const navegacion = [
  { nombre: 'Dashboard', icono: '▦' },
  { nombre: 'Productos', icono: '◇' },
  { nombre: 'Proveedores', icono: '♙' },
  { nombre: 'Cotizaciones', icono: '▤' },
  { nombre: 'Órdenes', icono: '▣' },
  { nombre: 'Envíos', icono: '⇢' },
  { nombre: 'Reclamos', icono: '⚑' },
  { nombre: 'Oportunidades', icono: '⌕' },
]

const indicadores = [
  {
    titulo: 'Productos registrados',
    valor: '128',
    cambio: 'Catálogo disponible',
    icono: '◇',
    color: 'blue',
  },
  {
    titulo: 'Proveedores',
    valor: '36',
    cambio: 'Registrados en el sistema',
    icono: '♙',
    color: 'purple',
  },
  {
    titulo: 'Órdenes activas',
    valor: '14',
    cambio: 'En diferentes etapas',
    icono: '▣',
    color: 'green',
  },
  {
    titulo: 'Oportunidades',
    valor: '08',
    cambio: 'Detectadas por el radar',
    icono: '⌕',
    color: 'orange',
  },
]

function App() {
  const [seccionActiva, setSeccionActiva] = useState('Dashboard')

  const [estadoBackend, setEstadoBackend] = useState<
    'conectando' | 'activo' | 'error'
  >('conectando')

  const [evoluciones, setEvoluciones] = useState<EvolucionImportacion[]>([])
  const [cargandoEvolucion, setCargandoEvolucion] = useState(true)
  const [errorEvolucion, setErrorEvolucion] = useState('')

  useEffect(() => {
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
                <span className="nav-badge">8</span>
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
                <h3>{item.valor}</h3>
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
                      Valor CIF actual acumulado · Datos de {evoluciones[0].periodo_actual}
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
                                  width: `${(item.valor_cif_anterior / maximo) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="evolucion-barra-fondo">
                              <div
                                className="evolucion-barra actual"
                                style={{
                                  width: `${(item.valor_cif_actual / maximo) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="evolucion-valores">
                            <span>
                              {item.periodo_anterior}: {formatoUSD(item.valor_cif_anterior)}
                            </span>
                            <span>
                              {item.periodo_actual}: {formatoUSD(item.valor_cif_actual)}
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
                    <span><i className="leyenda-anterior"></i> {evoluciones[0].periodo_anterior}</span>
                    <span><i className="leyenda-actual"></i> {evoluciones[0].periodo_actual}</span>
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
                        (mapa.get(item.pais_origen) || 0) + item.valor_cif_actual
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
                                width: `${total > 0 ? (valor / total) * 100 : 0}%`,
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
                      <tr key={`${item.codigo_producto}-${item.pais_origen}`}>
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
        </div>
      </main>
    </div>
  )
}

export default App
