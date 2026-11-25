
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.proveedor import ProveedorCrear, ProveedorRespuesta

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])


@router.get("/", response_model=list[ProveedorRespuesta])
def listar_proveedores():
    conexion = conectar()

    try:
        proveedores = conexion.execute(
            "SELECT * FROM proveedores"
        ).fetchall()

        return [dict(proveedor) for proveedor in proveedores]

    finally:
        conexion.close()


@router.post("/", response_model=ProveedorRespuesta, status_code=201)
def crear_proveedor(datos: ProveedorCrear):
    conexion = conectar()

    try:
        cursor = conexion.execute(
            """
            INSERT INTO proveedores (nombre, pais, contacto, email)
            VALUES (?, ?, ?, ?)
            """,
            (
                datos.nombre,
                datos.pais,
                datos.contacto,
                str(datos.email) if datos.email else None
            )
        )

        conexion.commit()

        proveedor = conexion.execute(
            "SELECT * FROM proveedores WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return dict(proveedor)

    finally:
        conexion.close()


@router.get("/{proveedor_id}", response_model=ProveedorRespuesta)
def obtener_proveedor(proveedor_id: int):
    conexion = conectar()

    try:
        proveedor = conexion.execute(
            "SELECT * FROM proveedores WHERE id = ?",
            (proveedor_id,)
        ).fetchone()

        if proveedor is None:
            raise HTTPException(
                status_code=404,
                detail="Proveedor no encontrado"
            )

        return dict(proveedor)

    finally:
        conexion.close()
