from fastapi import APIRouter, HTTPException

from app.schemas.oportunidad import (
    OportunidadCrear,
    OportunidadRespuesta
)

from app.services.oportunidades import (
    registrar_oportunidad,
    listar_oportunidades,
    obtener_oportunidad
)

from app.integrations.adapters import (
    AdaptadorProveedor,
    AdaptadorArchivoComercial
)


router = APIRouter(
    prefix="/oportunidades",
    tags=["Oportunidades"]
)


@router.post("/", response_model=OportunidadRespuesta, status_code=201)
def crear_oportunidad(datos: OportunidadCrear):
    return registrar_oportunidad(datos)


@router.get("/", response_model=list[OportunidadRespuesta])
def consultar_oportunidades():
    return listar_oportunidades()


@router.get("/{oportunidad_id}", response_model=OportunidadRespuesta)
def consultar_oportunidad(oportunidad_id: int):
    oportunidad = obtener_oportunidad(oportunidad_id)

    if oportunidad is None:
        raise HTTPException(
            status_code=404,
            detail="Oportunidad no encontrada"
        )

    return oportunidad


# Registrar datos provenientes de un catálogo de proveedor
@router.post("/importar/proveedor", response_model=OportunidadRespuesta, status_code=201)
def importar_desde_proveedor(datos: dict):

    try:
        producto = AdaptadorProveedor().adaptar(datos)

        oportunidad = OportunidadCrear(
            nombre=producto.nombre,
            categoria=producto.categoria,
            pais_origen=producto.pais_origen,
            precio=producto.precio,
            moneda=producto.moneda,
            fuente="Catálogo de proveedor"
        )

        return registrar_oportunidad(oportunidad)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# Registrar datos provenientes de un archivo comercial
@router.post("/importar/archivo", response_model=OportunidadRespuesta, status_code=201)
def importar_desde_archivo(datos: dict):

    try:
        producto = AdaptadorArchivoComercial().adaptar(datos)

        oportunidad = OportunidadCrear(
            nombre=producto.nombre,
            categoria=producto.categoria,
            pais_origen=producto.pais_origen,
            precio=producto.precio,
            moneda=producto.moneda,
            fuente="Archivo comercial"
        )

        return registrar_oportunidad(oportunidad)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )