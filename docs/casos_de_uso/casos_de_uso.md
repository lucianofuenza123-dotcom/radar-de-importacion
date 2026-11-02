\# Casos de uso — ImportaRadar



\*\*Proyecto:\*\* ImportaRadar — Sistema de gestión de importaciones y detección de oportunidades comerciales  

\*\*Versión:\*\* 1.0



\## 1. Introducción



Este documento describe las interacciones entre los actores y el sistema ImportaRadar. Los casos de uso se derivan de los requerimientos funcionales RF-01 a RF-20.



Se distingue entre las funcionalidades previstas para el Producto Mínimo Viable (MVP) y las planificadas para etapas posteriores.



\## 2. Actores



| Actor | Descripción |

|---|---|

| Administrador | Gestiona usuarios, roles, categorías, fuentes externas y parámetros generales. |

| Usuario operador | Administra productos, proveedores, cotizaciones, órdenes, oportunidades y seguimientos. |

| Fuente externa | Proporciona información comercial mediante integraciones o adaptadores. |

| Proveedor | Empresa o persona que ofrece productos para importar. En la primera versión no requiere acceso propio a la plataforma. |



\## 3. Casos de uso



\### CU-01. Autenticar usuario



\- \*\*Actor:\*\* Administrador / Usuario operador.

\- \*\*Requerimiento:\*\* RF-01.

\- \*\*Objetivo:\*\* Permitir el ingreso al sistema mediante credenciales.

\- \*\*Precondición:\*\* El usuario debe estar registrado y activo.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario ingresa sus credenciales.

&#x20; 2. El sistema verifica los datos.

&#x20; 3. El sistema habilita el acceso según el rol asignado.

\- \*\*Alternativa:\*\* Si las credenciales son incorrectas, el sistema rechaza el acceso.

\- \*\*Alcance:\*\* MVP.



\### CU-02. Gestionar usuarios, roles y permisos



\- \*\*Actor:\*\* Administrador.

\- \*\*Requerimiento:\*\* RF-01.

\- \*\*Objetivo:\*\* Administrar las cuentas de usuario.

\- \*\*Precondición:\*\* El administrador debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El administrador accede a la gestión de usuarios.

&#x20; 2. Selecciona registrar, consultar, modificar o desactivar un usuario.

&#x20; 3. Completa los datos solicitados.

&#x20; 4. Asigna roles y permisos.

&#x20; 5. El sistema valida y guarda los cambios.

\- \*\*Alternativa:\*\* Si los datos son inválidos, el sistema informa el error.

\- \*\*Alcance:\*\* MVP.



\### CU-03. Gestionar productos



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-02.

\- \*\*Objetivo:\*\* Registrar y mantener información de productos.

\- \*\*Precondición:\*\* El usuario debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario ingresa al módulo de productos.

&#x20; 2. Selecciona registrar, consultar, modificar o desactivar un producto.

&#x20; 3. Ingresa descripción, características, código y categoría.

&#x20; 4. El sistema valida y guarda la información.

&#x20; 5. El usuario consulta proveedores y cotizaciones asociadas.

\- \*\*Alternativa:\*\* Si faltan datos obligatorios, el sistema informa el problema.

\- \*\*Alcance:\*\* MVP.



\### CU-04. Gestionar categorías



\- \*\*Actor:\*\* Administrador.

\- \*\*Requerimiento:\*\* RF-03.

\- \*\*Objetivo:\*\* Organizar los productos mediante categorías.

\- \*\*Precondición:\*\* El administrador debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El administrador accede al módulo de categorías.

&#x20; 2. Selecciona crear, consultar, modificar o desactivar una categoría.

&#x20; 3. Ingresa los datos.

&#x20; 4. El sistema valida y guarda los cambios.

\- \*\*Alternativa:\*\* Si los datos son inválidos, el sistema informa el error.

\- \*\*Alcance:\*\* MVP.



\### CU-05. Gestionar proveedores



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-04.

\- \*\*Objetivo:\*\* Administrar información comercial y de contacto de proveedores.

\- \*\*Precondición:\*\* El usuario debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario accede al módulo de proveedores.

&#x20; 2. Registra o selecciona un proveedor.

&#x20; 3. Ingresa país de origen, contacto y condiciones comerciales.

&#x20; 4. El sistema valida y guarda la información.

&#x20; 5. El usuario consulta cotizaciones, operaciones y reclamos asociados.

\- \*\*Alternativa:\*\* Si faltan datos obligatorios, el sistema informa el problema.

\- \*\*Alcance:\*\* MVP básico.



\### CU-06. Gestionar y comparar cotizaciones



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-05.

\- \*\*Objetivo:\*\* Registrar cotizaciones y comparar propuestas.

\- \*\*Precondición:\*\* Deben existir el producto y el proveedor asociados.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona producto y proveedor.

&#x20; 2. Registra precio, moneda, cantidad mínima, fechas y condiciones comerciales.

&#x20; 3. El sistema valida y guarda la cotización.

&#x20; 4. El usuario selecciona cotizaciones para comparar.

&#x20; 5. El sistema presenta los resultados.

\- \*\*Alternativa:\*\* Si hay datos inválidos, el sistema informa el error.

\- \*\*Alcance:\*\* MVP.



\### CU-07. Descubrir oportunidades comerciales



\- \*\*Actor principal:\*\* Usuario operador.

\- \*\*Actor secundario:\*\* Fuente externa.

\- \*\*Requerimiento:\*\* RF-06.

\- \*\*Objetivo:\*\* Identificar productos que podrían representar oportunidades de importación.

\- \*\*Precondición:\*\* Debe existir información manual o de fuentes configuradas.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario accede al módulo de oportunidades.

&#x20; 2. Solicita información o incorpora datos manualmente.

&#x20; 3. El sistema procesa y normaliza los datos.

&#x20; 4. Identifica productos que cumplen los criterios definidos.

&#x20; 5. Presenta oportunidades con origen, fecha de actualización y datos faltantes.

&#x20; 6. El usuario guarda, evalúa o descarta una oportunidad.

\- \*\*Alternativa:\*\* Si una fuente no está disponible, el sistema permite trabajar con información manual.

\- \*\*Alcance:\*\* MVP inicial.



\### CU-08. Evaluar y puntuar oportunidades



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-07.

\- \*\*Objetivo:\*\* Ordenar oportunidades según criterios configurables.

\- \*\*Precondición:\*\* Deben existir oportunidades con información suficiente.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona una oportunidad.

&#x20; 2. El sistema aplica los criterios configurados.

&#x20; 3. Calcula una puntuación.

&#x20; 4. Presenta el resultado y sus motivos.

\- \*\*Alternativa:\*\* Si faltan datos, el sistema identifica la información faltante.

\- \*\*Alcance:\*\* Evolución posterior del MVP.



\### CU-09. Gestionar fuentes externas



\- \*\*Actor:\*\* Administrador.

\- \*\*Actor secundario:\*\* Fuente externa.

\- \*\*Requerimiento:\*\* RF-08.

\- \*\*Objetivo:\*\* Configurar fuentes y obtener información comercial.

\- \*\*Precondición:\*\* La fuente debe contar con una configuración viable.

\- \*\*Flujo principal:\*\*

&#x20; 1. El administrador registra o consulta una fuente.

&#x20; 2. Define el tipo de información que proporciona.

&#x20; 3. El sistema consulta la fuente.

&#x20; 4. Normaliza los datos y registra la fecha de consulta.

&#x20; 5. Controla duplicados y conserva el origen de los datos.

\- \*\*Alternativa:\*\* Si ocurre un error de conexión, se permite utilizar datos manuales disponibles.

\- \*\*Alcance:\*\* MVP con una fuente viable o adaptador simulado.



\### CU-10. Calcular costos de importación



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-09.

\- \*\*Objetivo:\*\* Estimar el costo total y unitario de una importación.

\- \*\*Precondición:\*\* Deben existir datos de compra y parámetros disponibles.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario ingresa el precio de compra.

&#x20; 2. Completa los costos disponibles: transporte, seguro, tributos y gastos asociados.

&#x20; 3. El sistema identifica valores pendientes.

&#x20; 4. Calcula el costo total y unitario estimado.

&#x20; 5. Presenta el detalle y permite guardar el escenario.

\- \*\*Alternativa:\*\* Si faltan datos, el sistema informa qué conceptos no pudieron determinarse.

\- \*\*Alcance:\*\* MVP básico.



\### CU-11. Comparar escenarios de importación



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-10.

\- \*\*Objetivo:\*\* Comparar alternativas de importación.

\- \*\*Precondición:\*\* Deben existir dos o más escenarios comparables.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona los escenarios.

&#x20; 2. El sistema compara proveedores, países, transporte, cantidades y costos.

&#x20; 3. Presenta los resultados.

\- \*\*Alternativa:\*\* Si faltan datos comparables, el sistema señala las diferencias.

\- \*\*Alcance:\*\* Evolución posterior del MVP.



\### CU-12. Gestionar órdenes de importación



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-11.

\- \*\*Objetivo:\*\* Crear y administrar órdenes de importación.

\- \*\*Precondición:\*\* Deben existir productos y proveedor.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario crea una orden.

&#x20; 2. Asocia uno o varios productos.

&#x20; 3. Registra cantidades, precios y monedas.

&#x20; 4. El sistema valida y guarda la orden.

&#x20; 5. El usuario consulta o modifica la orden según permisos y estado.

&#x20; 6. El sistema registra los cambios.

\- \*\*Alternativa:\*\* Si una modificación no está permitida, el sistema la rechaza.

\- \*\*Alcance:\*\* MVP.



\### CU-13. Realizar seguimiento de envíos



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-12.

\- \*\*Objetivo:\*\* Registrar y consultar el estado de los envíos.

\- \*\*Precondición:\*\* Debe existir una orden asociada.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario registra el envío.

&#x20; 2. Asocia transportista, código de seguimiento y fechas.

&#x20; 3. Actualiza el estado y agrega observaciones.

&#x20; 4. El sistema conserva el historial e identifica posibles retrasos.

\- \*\*Alternativa:\*\* Si faltan datos de seguimiento, se registra la información disponible.

\- \*\*Alcance:\*\* MVP básico.



\### CU-14. Gestionar documentación de importaciones



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-13.

\- \*\*Objetivo:\*\* Administrar documentos vinculados con una operación.

\- \*\*Precondición:\*\* Debe existir una operación registrada.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona la operación.

&#x20; 2. Adjunta un documento e indica tipo, fecha y estado.

&#x20; 3. El sistema valida y almacena la referencia.

&#x20; 4. El usuario consulta los documentos asociados.

\- \*\*Alternativa:\*\* Si el archivo no cumple las validaciones, el sistema informa el problema.

\- \*\*Alcance:\*\* Evolución posterior del MVP.



\### CU-15. Registrar y gestionar reclamos



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimientos:\*\* RF-14 y RF-15.

\- \*\*Objetivo:\*\* Registrar problemas de una importación y documentar su seguimiento.

\- \*\*Precondición:\*\* Debe existir una orden relacionada.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario registra orden, proveedor, producto, cantidad afectada y motivo.

&#x20; 2. Describe el problema y agrega evidencias cuando existan.

&#x20; 3. Indica la solución solicitada.

&#x20; 4. El sistema registra el reclamo.

&#x20; 5. El usuario actualiza el seguimiento y registra respuestas.

&#x20; 6. Documenta la resolución final.

\- \*\*Alternativa:\*\* Si no hay evidencias o respuesta, el reclamo queda registrado con esa información pendiente.

\- \*\*Alcance:\*\* Gestión básica en el MVP; seguimiento avanzado posterior.



\### CU-16. Consultar evaluación de proveedores



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-16.

\- \*\*Objetivo:\*\* Consultar indicadores de desempeño de proveedores.

\- \*\*Precondición:\*\* Deben existir operaciones y datos suficientes.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona un proveedor.

&#x20; 2. El sistema reúne los datos registrados.

&#x20; 3. Presenta indicadores de operaciones, plazos, incidencias, reclamos y costos.

&#x20; 4. Muestra los datos de referencia.

\- \*\*Alternativa:\*\* Si los datos son insuficientes, el sistema informa que la evaluación es incompleta.

\- \*\*Alcance:\*\* Futuras versiones.



\### CU-17. Registrar resultados reales de importaciones



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-17.

\- \*\*Objetivo:\*\* Registrar resultados finales y compararlos con estimaciones.

\- \*\*Precondición:\*\* Debe existir una operación.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario selecciona una operación.

&#x20; 2. Registra costos reales, cantidades recibidas, fecha e incidencias.

&#x20; 3. El sistema guarda los resultados.

&#x20; 4. Permite compararlos con las estimaciones iniciales.

\- \*\*Alternativa:\*\* Los datos sin confirmar se identifican como pendientes.

\- \*\*Alcance:\*\* Evolución posterior.



\### CU-18. Consultar dashboard y estadísticas



\- \*\*Actor:\*\* Administrador / Usuario operador.

\- \*\*Requerimiento:\*\* RF-18.

\- \*\*Objetivo:\*\* Visualizar un resumen de la actividad del sistema.

\- \*\*Precondición:\*\* El usuario debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario accede al panel principal.

&#x20; 2. El sistema reúne la información disponible.

&#x20; 3. Presenta importaciones, órdenes pendientes, envíos, reclamos, oportunidades y costos.

\- \*\*Alternativa:\*\* Si no hay datos para un indicador, el sistema informa que no hay información disponible.

\- \*\*Alcance:\*\* MVP.



\### CU-19. Consultar alertas y notificaciones



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Actor secundario:\*\* Sistema.

\- \*\*Requerimiento:\*\* RF-19.

\- \*\*Objetivo:\*\* Informar situaciones que requieren atención.

\- \*\*Precondición:\*\* Deben existir eventos que generen alertas.

\- \*\*Flujo principal:\*\*

&#x20; 1. El sistema detecta cotizaciones próximas a vencer, envíos retrasados, documentos pendientes, reclamos que requieren seguimiento o cambios en oportunidades.

&#x20; 2. Genera una alerta.

&#x20; 3. El usuario consulta las alertas dentro de la aplicación.

\- \*\*Alternativa:\*\* Si no existen eventos relevantes, el sistema informa que no hay alertas pendientes.

\- \*\*Alcance:\*\* Evolución posterior.



\### CU-20. Buscar y filtrar información



\- \*\*Actor:\*\* Usuario operador.

\- \*\*Requerimiento:\*\* RF-20.

\- \*\*Objetivo:\*\* Encontrar información aplicando criterios de búsqueda.

\- \*\*Precondición:\*\* El usuario debe haber iniciado sesión.

\- \*\*Flujo principal:\*\*

&#x20; 1. El usuario ingresa un texto o selecciona filtros.

&#x20; 2. Filtra por producto, categoría, proveedor, país, estado, fecha, rango de precios o tipo de operación.

&#x20; 3. El sistema procesa los criterios.

&#x20; 4. Presenta los resultados coincidentes.

\- \*\*Alternativa:\*\* Si no hay coincidencias, el sistema informa que no se encontraron resultados.

\- \*\*Alcance:\*\* MVP.



\## 4. Resumen de alcance



| Área | Casos de uso | Alcance |

|---|---|---|

| Usuarios y categorías | CU-01, CU-02, CU-04 | MVP |

| Productos y proveedores | CU-03, CU-05 | MVP |

| Cotizaciones | CU-06 | MVP |

| Oportunidades y fuentes | CU-07, CU-09 | MVP inicial |

| Evaluación de oportunidades | CU-08 | Evolución posterior |

| Costos y escenarios | CU-10, CU-11 | Calculadora básica en MVP; comparación posterior |

| Órdenes y envíos | CU-12, CU-13 | MVP |

| Documentación | CU-14 | Evolución posterior |

| Reclamos | CU-15 | Gestión básica en MVP; seguimiento avanzado posterior |

| Evaluación y resultados reales | CU-16, CU-17 | Futuras versiones |

| Dashboard | CU-18 | MVP |

| Alertas | CU-19 | Evolución posterior |

| Búsqueda y filtros | CU-20 | MVP |



\## 5. Observaciones



1\. Los casos de uso se derivan de los requerimientos funcionales RF-01 a RF-20.

2\. Un caso de uso puede agrupar varias operaciones relacionadas de un mismo requerimiento.

3\. El proveedor se considera un actor externo del negocio, pero no necesariamente un usuario de la plataforma en el MVP.

4\. La fuente externa participa como actor secundario cuando el sistema obtiene información mediante una integración.

5\. Los datos estimados deben distinguirse de los datos comprobados.

6\. Los flujos alternativos describen respuestas esperadas ante datos incompletos, errores o falta de disponibilidad.

7\. Este documento es una especificación inicial y debe revisarse junto con la consigna de la materia y los requerimientos aprobados.

