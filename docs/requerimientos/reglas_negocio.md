# Reglas de negocio — ImportaRadar

**Proyecto:** ImportaRadar — Sistema de gestión de importaciones y detección de oportunidades comerciales
**Versión:** 1.0

## 1. Introducción

Las reglas de negocio establecen las condiciones y restricciones que deberá respetar ImportaRadar durante su funcionamiento. Estas reglas permiten mantener la coherencia de la información y garantizar que las operaciones de importación se gestionen correctamente.

## 2. Reglas de negocio

### RN-01 — Relación entre productos y proveedores
Un producto podrá estar relacionado con varios proveedores.

### RN-02 — Productos ofrecidos por proveedores
Un proveedor podrá ofrecer varios productos.

### RN-03 — Asociación de cotizaciones
Una cotización deberá estar asociada a un proveedor y a un producto.

### RN-04 — Productos en órdenes de importación
Una orden de importación podrá contener varios productos.

### RN-05 — Productos en diferentes órdenes
Un producto podrá aparecer en diferentes órdenes de importación.

### RN-06 — Detalle de órdenes
La relación entre órdenes y productos deberá resolverse mediante una entidad de detalle.

### RN-07 — Validación de oportunidades
Una oportunidad no podrá considerarse validada si carece de información esencial para evaluar sus costos.

### RN-08 — Trazabilidad de datos externos
Los datos externos deberán conservar su fuente y fecha de consulta.

### RN-09 — Diferenciación de valores
Las estimaciones deberán diferenciarse de los valores confirmados.

### RN-10 — Vigencia de cotizaciones
Una cotización vencida deberá identificarse como tal y no presentarse como vigente.

### RN-11 — Cálculo de costos
El costo estimado de una importación deberá contemplar únicamente los conceptos disponibles y señalar los faltantes.

### RN-12 — Asociación de reclamos
Un reclamo deberá estar relacionado con una operación o recepción identificable.

### RN-13 — Historial de reclamos
Todo cambio de estado de un reclamo deberá quedar registrado en su historial.

### RN-14 — Resolución de reclamos
La resolución de un reclamo deberá documentarse antes de cerrarlo.

### RN-15 — Costos reales y estimados
Los costos reales deberán conservarse separados de los costos estimados.

### RN-16 — Disponibilidad de fuentes externas
Una fuente externa no deberá impedir el funcionamiento de los módulos que utilizan información local.

## 3. Consideraciones generales

- Las reglas deberán respetarse durante las operaciones del sistema.
- Las validaciones deberán evitar inconsistencias en los datos.
- La información externa deberá mantener su trazabilidad.
- Las reglas relacionadas con costos deberán permitir distinguir valores estimados de valores confirmados.
- La estructura de datos deberá contemplar las relaciones necesarias para cumplir estas reglas.
