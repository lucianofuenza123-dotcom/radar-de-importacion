# Requerimientos funcionales — ImportaRadar

**Proyecto:** ImportaRadar — Sistema de gestión de importaciones y detección de oportunidades comerciales
**Versión:** 1.0

## 1. Introducción

Los requerimientos funcionales describen las acciones y servicios que deberá proporcionar ImportaRadar. Especifican qué operaciones podrán realizar los usuarios y qué respuestas deberá ofrecer el sistema.

El sistema permitirá administrar productos, proveedores, cotizaciones, órdenes de importación, envíos, documentación y reclamos. También contará con funcionalidades para detectar y evaluar oportunidades comerciales a partir de información manual y externa.

## 2. Actores del sistema

- **Administrador:** gestiona usuarios, roles, categorías, fuentes externas y parámetros generales.
- **Usuario operador:** administra productos, proveedores, cotizaciones, órdenes, oportunidades y seguimientos.
- **Fuente externa:** proporciona información comercial mediante integraciones o adaptadores.
- **Proveedor:** empresa o persona que ofrece productos para importar. En la primera versión será una entidad administrada por los usuarios, sin acceso propio obligatorio a la plataforma.

## 3. Requerimientos funcionales

### RF-01. Gestión de usuarios

El sistema deberá permitir registrar, consultar, modificar y desactivar usuarios. También deberá permitir autenticar usuarios mediante credenciales y asignarles roles y permisos.

**Actor principal:** Administrador.
**Alcance:** MVP.

### RF-02. Gestión de productos

El sistema deberá permitir:

- Registrar productos manualmente.
- Modificar y consultar sus datos.
- Eliminar o desactivar productos.
- Clasificarlos por categorías.
- Registrar descripción, características y código identificador cuando corresponda.
- Asociar productos con proveedores y cotizaciones.
- Consultar el historial de precios.

**Actor principal:** Usuario operador.
**Alcance:** MVP.

### RF-03. Gestión de categorías

El sistema deberá permitir crear, modificar, consultar y desactivar categorías para organizar los productos.

**Actor principal:** Administrador.
**Alcance:** MVP.

### RF-04. Gestión de proveedores

El sistema deberá permitir:

- Registrar y modificar proveedores.
- Registrar su país de origen.
- Guardar información de contacto.
- Registrar condiciones comerciales.
- Consultar cotizaciones asociadas.
- Consultar el historial de operaciones.
- Consultar antecedentes de reclamos e incidencias.

**Actor principal:** Usuario operador.
**Alcance:** MVP para la gestión básica.

### RF-05. Gestión de cotizaciones

El sistema deberá permitir registrar cotizaciones asociadas a productos y proveedores.

Cada cotización deberá almacenar producto, proveedor, precio unitario, moneda, cantidad mínima de compra cuando corresponda, fecha de emisión, fecha de vencimiento cuando corresponda, plazo estimado de entrega, condiciones comerciales y observaciones.

También deberá permitir comparar cotizaciones de distintos proveedores.

**Actor principal:** Usuario operador.
**Alcance:** MVP.

### RF-06. Descubrimiento de oportunidades comerciales

El sistema deberá contar con un módulo para identificar productos potencialmente interesantes para importar.

Deberá permitir:

- Obtener información de fuentes externas configuradas.
- Incorporar información manualmente.
- Identificar productos o categorías que cumplan determinados criterios.
- Analizar precios de referencia disponibles.
- Relacionar productos con proveedores y cotizaciones cuando existan.
- Generar una lista de oportunidades candidatas.
- Consultar el origen de cada dato.
- Mostrar la fecha de actualización.
- Identificar información faltante.
- Guardar, evaluar o descartar oportunidades.

El sistema deberá evitar presentar como comprobados los datos que sean estimaciones.

**Actor principal:** Usuario operador.
**Alcance:** MVP inicial con datos manuales y una fuente externa viable o un adaptador simulado.

### RF-07. Evaluación y puntuación de oportunidades

El sistema deberá calcular una puntuación para ordenar las oportunidades según criterios configurables.

Los criterios podrán incluir margen potencial estimado, costo total de importación, calidad y antigüedad de los datos, disponibilidad de proveedores, indicadores comerciales, riesgos identificados y ajuste al presupuesto del usuario.

Además, deberá mostrar los motivos por los cuales una oportunidad obtiene determinada puntuación.

**Actor principal:** Usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-08. Gestión de fuentes externas

El sistema deberá permitir configurar y consultar fuentes externas de información.

Deberá:

- Registrar las fuentes utilizadas.
- Identificar el tipo de información que proporciona cada fuente.
- Obtener datos cuando la integración esté disponible.
- Normalizar los datos recibidos.
- Registrar la fecha de consulta.
- Identificar errores de conexión.
- Evitar almacenar datos duplicados.
- Permitir utilizar datos manuales cuando una fuente no esté disponible.

**Actor principal:** Administrador y sistema.
**Alcance:** MVP mediante al menos una fuente viable o adaptador simulado; múltiples integraciones quedan para futuras versiones.

### RF-09. Calculadora de costos de importación

El sistema deberá permitir calcular el costo estimado de una operación contemplando, según la información disponible:

- Precio de compra.
- Transporte internacional.
- Seguro.
- Aranceles e impuestos aplicables.
- Gastos aduaneros y administrativos.
- Almacenamiento.
- Otros gastos asociados.

Deberá calcular el costo total estimado y el costo por unidad, mostrar los conceptos incluidos, identificar costos pendientes de confirmar, permitir modificar variables y guardar diferentes escenarios de cálculo.

Los parámetros tributarios y aduaneros deberán ser configurables y verificables. El resultado será una estimación, no una liquidación aduanera oficial.

**Actor principal:** Usuario operador.
**Alcance:** MVP con calculadora básica.

### RF-10. Comparación de escenarios

El sistema deberá permitir comparar distintas alternativas de importación considerando diferentes proveedores, países de origen, medios de transporte, tipos de cambio, cantidades de compra y costos estimados.

Los resultados deberán presentarse de forma comparativa.

**Actor principal:** Usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-11. Gestión de órdenes de importación

El sistema deberá permitir crear órdenes de importación, asociar uno o varios productos, registrar cantidades, asociar un proveedor, registrar precios y monedas, consultar detalles, modificar órdenes según permisos y estado, cancelarlas y consultar su historial de cambios.

Cada orden deberá tener un estado. Los estados posibles serán:

- En evaluación.
- Cotizada.
- Aprobada.
- Despachada.
- En tránsito.
- Recibida.
- Cancelada.

**Actor principal:** Usuario operador.
**Alcance:** MVP.

### RF-12. Seguimiento de envíos

El sistema deberá permitir registrar envíos asociados a órdenes, transportistas, códigos de seguimiento, fechas estimadas y reales, actualizar estados, agregar observaciones, consultar el historial e identificar retrasos respecto de las fechas previstas.

**Actor principal:** Usuario operador.
**Alcance:** MVP básico.

### RF-13. Gestión documental

El sistema deberá permitir adjuntar y administrar documentos relacionados con las operaciones, como facturas comerciales, órdenes de compra, documentos de transporte, listas de empaque, certificados y otros documentos de importación.

Cada documento deberá estar asociado a una operación y contar con un tipo, fecha y estado.

**Actor principal:** Usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-14. Gestión de reclamos a proveedores

El sistema deberá permitir registrar reclamos relacionados con una importación.

Los motivos podrán incluir mercadería dañada, productos defectuosos, unidades faltantes, productos equivocados, incumplimiento de condiciones y retrasos.

Cada reclamo deberá contener orden relacionada, proveedor, producto afectado, cantidad afectada, motivo, fecha de registro, descripción del problema, evidencias adjuntas, solución solicitada y estado.

**Actor principal:** Usuario operador.
**Alcance:** MVP básico.

### RF-15. Seguimiento de reclamos

El sistema deberá permitir actualizar estados de reclamos, registrar comunicaciones, adjuntar evidencias, registrar respuestas del proveedor, establecer plazos de seguimiento, consultar el historial y documentar la resolución final.

Las resoluciones podrán ser reposición, reembolso, compensación, nota de crédito, acuerdo parcial, rechazo o ausencia de resolución.

**Actor principal:** Usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-16. Evaluación de proveedores

El sistema deberá generar información sobre el desempeño de los proveedores utilizando datos registrados.

Podrá considerar cantidad de operaciones, cumplimiento de plazos, incidencias, reclamos realizados y resueltos, y diferencias entre costos cotizados y reales.

Deberá mostrar los indicadores utilizados y no atribuir responsabilidades sin evidencia.

**Actor principal:** Usuario operador.
**Alcance:** Futuras versiones.

### RF-17. Historial de resultados reales

El sistema deberá permitir registrar los resultados finales de cada operación, incluyendo costo total real, cantidad efectivamente recibida, fecha real de recepción, gastos adicionales, incidencias, reclamos y observaciones.

También deberá permitir comparar estos resultados con las estimaciones iniciales.

**Actor principal:** Usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-18. Dashboard y estadísticas

El sistema deberá contar con un panel principal que presente información resumida, como cantidad de importaciones, órdenes pendientes, envíos en tránsito, reclamos abiertos, oportunidades detectadas, costos estimados y reales, proveedores con mayor cantidad de operaciones e indicadores de cumplimiento.

**Actor principal:** Administrador y usuario operador.
**Alcance:** MVP.

### RF-19. Notificaciones y alertas

El sistema deberá generar alertas cuando una cotización esté próxima a vencer, un envío supere su fecha estimada, existan documentos pendientes, un reclamo requiera seguimiento o se produzca un cambio relevante en una oportunidad guardada.

Las alertas deberán mostrarse dentro de la aplicación. El envío por correo o mediante notificaciones externas podrá incorporarse posteriormente.

**Actor principal:** Sistema y usuario operador.
**Alcance:** Evolución posterior del MVP.

### RF-20. Búsqueda y filtros

El sistema deberá permitir buscar y filtrar información por nombre del producto, categoría, proveedor, país, estado, fecha, rango de precios y tipo de operación.

**
