
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

        conexion.commit()

    finally:
        conexion.close()
