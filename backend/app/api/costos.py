
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.costos import (
    CalculoCostoCrear,
    CalculoCostoRespuesta
)
from app.services.costos import calcular_costo, guardar_costo


router = APIRouter(
    prefix="/costos",
    tags=["Costos"]
)


@router.post(
    "/calcular/{orden_id}",
    response_model=CalculoCostoRespuesta
)
def calcular_costos(orden_id: int, datos: CalculoCostoCrear):

    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT id FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

    finally:
        conexion.close()

    if orden is None:
        raise HTTPException(
            status_code=404,
            detail="La orden de importación no existe"
        )

    resultado = calcular_costo(datos)

    guardar_costo(orden_id, datos, resultado)

    return resultado


@router.get("/orden/{orden_id}")
def obtener_costos_orden(orden_id: int):

    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT id FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        if orden is None:
            raise HTTPException(
                status_code=404,
                detail="La orden de importación no existe"
            )

        costos = conexion.execute("""
            SELECT *
            FROM costos_importacion
            WHERE orden_id = ?
            ORDER BY fecha_calculo DESC
        """, (orden_id,)).fetchall()

        return [dict(costo) for costo in costos]

    finally:
        conexion.close()
