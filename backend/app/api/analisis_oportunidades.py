
from fastapi import APIRouter, HTTPException

from app.schemas.analisis_oportunidades import (
    AnalisisProductoRespuesta
)

from app.services.analisis_oportunidades import (
    analizar_importaciones_argentina,
    obtener_ranking_importaciones_argentina,
    actualizar_importaciones_argentina
)


router = APIRouter(
    prefix="/analisis-oportunidades",
    tags=["Análisis de oportunidades"]
)


@router.get(
    "/importaciones/argentina",
    response_model=list[AnalisisProductoRespuesta]
)
def consultar_analisis_importaciones():
    return analizar_importaciones_argentina()


@router.get(
    "/ranking/argentina",
    response_model=list[AnalisisProductoRespuesta]
)
def consultar_ranking_importaciones():
    return obtener_ranking_importaciones_argentina()


@router.post(
    "/actualizar/argentina",
    response_model=list[AnalisisProductoRespuesta]
)
def actualizar_analisis_importaciones():
    try:
        return actualizar_importaciones_argentina()
    except ValueError as error:
        raise HTTPException(status_code=502, detail=str(error))
