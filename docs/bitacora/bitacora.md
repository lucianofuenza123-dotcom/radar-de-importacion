# Bitácora del proyecto ImportaRadar

## PE – 14/09/2026 – Patrón de diseño

**Patrón seleccionado: Adapter (Adaptador).**

Se seleccionó el patrón Adapter porque ImportaRadar necesita integrar información proveniente de diferentes fuentes externas, como estadísticas comerciales, catálogos de proveedores y archivos de datos.

Cada fuente puede presentar estructuras, nombres de campos y formatos diferentes. Esto genera un problema de compatibilidad al intentar procesar toda la información dentro del sistema.

Adapter permite transformar los datos de cada fuente a una estructura interna común, sin modificar la lógica principal de la aplicación.

Se eligió este patrón frente a otras alternativas porque resuelve directamente el problema de incompatibilidad entre interfaces y formatos. Además, permite incorporar nuevas fuentes de información sin tener que modificar el funcionamiento general del sistema.

### Reflexión sobre el uso de Inteligencia Artificial

1. **Problema:** necesitábamos seleccionar un patrón de diseño para integrar distintas fuentes de información en ImportaRadar.
2. **Propuesta de IA:** se sugirió utilizar Adapter para unificar los formatos de datos.
3. **Análisis:** se evaluó si el patrón respondía al problema real del proyecto.
4. **Verificación:** se revisó su funcionamiento y se comparó con las necesidades de integración.
5. **Corrección:** se decidió limitar su responsabilidad a la adaptación de datos, sin atribuirle funciones de conexión ni cálculos comerciales.
6. **Justificación:** se aceptó la propuesta porque permite incorporar fuentes nuevas de manera organizada y reducir el acoplamiento del sistema.
