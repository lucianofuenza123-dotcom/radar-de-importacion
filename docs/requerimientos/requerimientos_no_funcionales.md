# Requerimientos no funcionales — ImportaRadar

**Proyecto:** ImportaRadar — Sistema de gestión de importaciones y detección de oportunidades comerciales
**Versión:** 1.0

## 1. Introducción

Los requerimientos no funcionales establecen las condiciones de calidad y las características generales que deberá cumplir ImportaRadar. A diferencia de los requerimientos funcionales, no describen acciones específicas del sistema, sino cómo deberá comportarse y bajo qué condiciones deberá operar.

## 2. Requerimientos no funcionales

### RNF-01 — Seguridad

El sistema deberá proteger la información mediante autenticación, autorización y control de acceso según roles.

Las contraseñas deberán almacenarse de forma segura, utilizando mecanismos adecuados de hash.

### RNF-02 — Usabilidad

La interfaz deberá ser clara, intuitiva y fácil de utilizar.

Las funciones principales deberán estar organizadas en secciones identificables.

### RNF-03 — Rendimiento

El sistema deberá responder en tiempos razonables ante las operaciones habituales.

Las consultas y búsquedas deberán evitar cargas innecesarias.

### RNF-04 — Integridad de datos

El sistema deberá garantizar que las relaciones entre productos, proveedores, cotizaciones, órdenes y reclamos mantengan su consistencia.

Deberá validar los datos antes de almacenarlos.

### RNF-05 — Disponibilidad

El sistema deberá informar cuando una fuente externa no esté disponible y permitir continuar trabajando con la información local almacenada.

### RNF-06 — Mantenibilidad

El código deberá estar organizado por módulos y responsabilidades.

Las reglas de negocio no deberán depender directamente de la interfaz ni de los formatos particulares de las fuentes externas.

### RNF-07 — Escalabilidad

La arquitectura deberá permitir incorporar nuevas fuentes externas y funcionalidades sin tener que modificar todo el sistema.

### RNF-08 — Compatibilidad

La aplicación deberá poder utilizarse desde navegadores web modernos y adaptarse a diferentes tamaños de pantalla.

### RNF-09 — Trazabilidad

El sistema deberá conservar el origen y la fecha de los datos utilizados en los cálculos y evaluaciones de oportunidades.

### RNF-10 — Recuperación y respaldo

Se deberán contemplar mecanismos de respaldo de la base de datos y recuperación ante fallos.

### RNF-11 — Privacidad

El sistema deberá limitar el acceso a la información de acuerdo con los permisos del usuario y evitar exponer datos sensibles a fuentes externas sin autorización.

### RNF-12 — Testeabilidad

Las funcionalidades principales deberán contar con pruebas que permitan verificar su comportamiento.

## 3. Consideraciones generales

- Los requerimientos deberán tenerse en cuenta durante el diseño, desarrollo y pruebas del sistema.
- La seguridad y la integridad de los datos serán aspectos fundamentales para proteger la información de las operaciones de importación.
- La trazabilidad permitirá conocer el origen y la fecha de los datos comerciales utilizados para detectar oportunidades.
- La arquitectura modular facilitará la incorporación futura de nuevas fuentes externas y funcionalidades.
- Los tiempos de respuesta, disponibilidad y capacidad de recuperación podrán establecerse mediante métricas específicas en etapas posteriores del proyecto.

## 4. Alcance de la primera versión

En la primera versión de ImportaRadar se priorizará una estructura segura, modular, mantenible y fácil de utilizar. Algunos aspectos, como la escalabilidad avanzada, los mecanismos completos de recuperación y la optimización del rendimiento, podrán perfeccionarse progresivamente durante la evolución del sistema.
