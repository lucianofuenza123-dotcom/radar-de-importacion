
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.producto import ProductoCrear, ProductoRespuesta

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoRespuesta])
def listar_productos():
    conexion = conectar()

    try:
        productos = conexion.execute(
            "SELECT * FROM productos"
        ).fetchall()

        return [dict(producto) for producto in productos]

    finally:
        conexion.close()


@router.post("/", response_model=ProductoRespuesta, status_code=201)
def crear_producto(datos: ProductoCrear):
    conexion = conectar()

    try:
        cursor = conexion.execute(
            """
            INSERT INTO productos (nombre, descripcion, categoria, codigo)
            VALUES (?, ?, ?, ?)
            """,
            (
                datos.nombre,
                datos.descripcion,
                datos.categoria,
                datos.codigo
            )
        )

        conexion.commit()

        producto = conexion.execute(
            "SELECT * FROM productos WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return dict(producto)

    finally:
        conexion.close()


@router.get("/{producto_id}", response_model=ProductoRespuesta)
def obtener_producto(producto_id: int):
    conexion = conectar()

    try:
        producto = conexion.execute(
            "SELECT * FROM productos WHERE id = ?",
            (producto_id,)
        ).fetchone()

        if producto is None:
            raise HTTPException(
                status_code=404,
                detail="Producto no encontrado"
            )

        return dict(producto)

    finally:
        conexion.close()
