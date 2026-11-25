
import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent.parent / "importaradar.db"


def conectar():
    conexion = sqlite3.connect(DATABASE_PATH)
    conexion.row_factory = sqlite3.Row
    return conexion


def inicializar_db():
    conexion = conectar()

    try:
        conexion.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                categoria TEXT NOT NULL,
                codigo TEXT,
                activo INTEGER NOT NULL DEFAULT 1
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS proveedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                pais TEXT NOT NULL,
                contacto TEXT NOT NULL,
                email TEXT,
                activo INTEGER NOT NULL DEFAULT 1
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS cotizaciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                producto_id INTEGER NOT NULL,
                proveedor_id INTEGER NOT NULL,
                precio_unitario REAL NOT NULL,
                moneda TEXT NOT NULL,
                cantidad_minima INTEGER NOT NULL,
                fecha_emision TEXT,
                fecha_vencimiento TEXT,
                FOREIGN KEY (producto_id) REFERENCES productos(id),
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS ordenes_importacion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                proveedor_id INTEGER NOT NULL,
                fecha TEXT NOT NULL,
                estado TEXT NOT NULL DEFAULT 'En evaluación',
                observaciones TEXT,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS orden_productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orden_id INTEGER NOT NULL,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL CHECK(cantidad > 0),
                precio_unitario REAL NOT NULL CHECK(precio_unitario >= 0),
                moneda TEXT NOT NULL,
                FOREIGN KEY (orden_id) REFERENCES ordenes_importacion(id),
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS envios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orden_id INTEGER NOT NULL UNIQUE,
                transportista TEXT,
                codigo_seguimiento TEXT,
                fecha_estimada TEXT,
                fecha_real TEXT,
                estado TEXT NOT NULL DEFAULT 'Pendiente',
                FOREIGN KEY (orden_id) REFERENCES ordenes_importacion(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS historial_envios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                envio_id INTEGER NOT NULL,
                estado TEXT NOT NULL,
                observacion TEXT,
                fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (envio_id) REFERENCES envios(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS reclamos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                proveedor_id INTEGER NOT NULL,
                orden_id INTEGER,
                descripcion TEXT NOT NULL,
                fecha TEXT NOT NULL,
                estado TEXT NOT NULL DEFAULT 'Abierto',
                respuesta TEXT,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
                FOREIGN KEY (orden_id) REFERENCES ordenes_importacion(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS costos_importacion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orden_id INTEGER NOT NULL,
                precio_compra REAL NOT NULL,
                transporte REAL NOT NULL,
                seguro REAL NOT NULL,
                tributos REAL NOT NULL,
                otros_gastos REAL NOT NULL,
                cantidad INTEGER NOT NULL,
                moneda TEXT NOT NULL,
                costo_total REAL NOT NULL,
                costo_unitario REAL NOT NULL,
                fecha_calculo TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (orden_id) REFERENCES ordenes_importacion(id)
            )
        """)

        conexion.execute("""
            CREATE TABLE IF NOT EXISTS oportunidades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                categoria TEXT NOT NULL,
                pais_origen TEXT NOT NULL,
                precio REAL NOT NULL CHECK(precio > 0),
                moneda TEXT NOT NULL,
                fuente TEXT NOT NULL,
                fecha_consulta TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conexion.commit()

    finally:
        conexion.close()
