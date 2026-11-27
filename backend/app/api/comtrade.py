from fastapi import APIRouter, HTTPException

from app.schemas.comtrade import EstadisticaComtradeRespuesta
from app.integrations.comtrade import consultar_importaciones


router = APIRouter(
    prefix="/comtrade",
    tags=["UN Comtrade"]
)


@router.get(
    "/importaciones/auriculares",
    response_model=list[EstadisticaComtradeRespuesta]
)
def consultar_estadisticas_auriculares():
    try:
        return consultar_importaciones()

    except ValueError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        )