
from fastapi import APIRouter, HTTPException

from app.schemas.analisis_oportunidades import (
    AnalisisProductoRespuesta,
    ComparacionPaisRespuesta,
    EvolucionImportacionesRespuesta
)

from app.services.analisis_oportunidades import (
    analizar_importaciones_argentina,
    obtener_ranking_importaciones_argentina,
    actualizar_importaciones_argentina,
    comparar_paises_por_producto,
    analizar_evolucion_importaciones
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


@router.get(
    "/comparacion-paises",
    response_model=list[ComparacionPaisRespuesta]
)
def consultar_comparacion_paises():
    return comparar_paises_por_producto()


@router.get(
    "/evolucion",
    response_model=list[EvolucionImportacionesRespuesta]
)
def consultar_evolucion_importaciones():
    return analizar_evolucion_importaciones()
