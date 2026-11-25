
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.reclamo import (
    ReclamoCrear,
    ReclamoActualizarEstado,
    ReclamoRespuesta
)

router = APIRouter(
    prefix="/reclamos",
    tags=["Reclamos"]
)


@router.get("/", response_model=list[ReclamoRespuesta])
def listar_reclamos():
    conexion = conectar()

    try:
        reclamos = conexion.execute(
            "SELECT * FROM reclamos ORDER BY id"
        ).fetchall()

        return [dict(reclamo) for reclamo in reclamos]

    finally:
        conexion.close()


@router.get("/{reclamo_id}", response_model=ReclamoRespuesta)
def obtener_reclamo(reclamo_id: int):
    conexion = conectar()

    try:
        reclamo = conexion.execute(
            "SELECT * FROM reclamos WHERE id = ?",
            (reclamo_id,)
        ).fetchone()

        if reclamo is None:
            raise HTTPException(
                status_code=404,
                detail="Reclamo no encontrado"
            )

        return dict(reclamo)

    finally:
        conexion.close()


@router.post("/", response_model=ReclamoRespuesta, status_code=201)
def crear_reclamo(datos: ReclamoCrear):
    conexion = conectar()

    try:
        proveedor = conexion.execute(
            "SELECT id FROM proveedores WHERE id = ?",
            (datos.proveedor_id,)
        ).fetchone()

        if proveedor is None:
            raise HTTPException(
                status_code=404,
                detail="Proveedor no encontrado"
            )

        if datos.orden_id is not None:
            orden = conexion.execute(
                """
                SELECT id, proveedor_id
                FROM ordenes_importacion
                WHERE id = ?
                """,
                (datos.orden_id,)
            ).fetchone()

            if orden is None:
                raise HTTPException(
                    status_code=404,
                    detail="Orden de importación no encontrada"
                )

            if orden["proveedor_id"] != datos.proveedor_id:
                raise HTTPException(
                    status_code=400,
                    detail="La orden no pertenece al proveedor indicado"
                )

        cursor = conexion.execute(
            """
            INSERT INTO reclamos (
                proveedor_id, orden_id, descripcion,
                fecha, estado
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                datos.proveedor_id,
                datos.orden_id,
                datos.descripcion,
                datos.fecha.isoformat(),
                datos.estado
            )
        )

        reclamo_id = cursor.lastrowid
        conexion.commit()

        reclamo = conexion.execute(
            "SELECT * FROM reclamos WHERE id = ?",
            (reclamo_id,)
        ).fetchone()

        return dict(reclamo)

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()


@router.put("/{reclamo_id}/estado", response_model=ReclamoRespuesta)
def actualizar_estado_reclamo(
    reclamo_id: int,
    datos: ReclamoActualizarEstado
):
    conexion = conectar()

    try:
        reclamo = conexion.execute(
            "SELECT * FROM reclamos WHERE id = ?",
            (reclamo_id,)
        ).fetchone()

        if reclamo is None:
            raise HTTPException(
                status_code=404,
                detail="Reclamo no encontrado"
            )

        conexion.execute(
            """
            UPDATE reclamos
            SET estado = ?, respuesta = ?
            WHERE id = ?
            """,
            (
                datos.estado,
                datos.respuesta,
                reclamo_id
            )
        )

        conexion.commit()

        reclamo_actualizado = conexion.execute(
            "SELECT * FROM reclamos WHERE id = ?",
            (reclamo_id,)
        ).fetchone()

        return dict(reclamo_actualizado)

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()
