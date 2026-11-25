
from fastapi import FastAPI

from app.api import (
    productos,
    proveedores,
    cotizaciones,
    ordenes,
    envios,
    reclamos,
    costos
)

from app.database import inicializar_db


app = FastAPI(
    title="ImportaRadar API",
    description="Sistema de gestión de importaciones y oportunidades comerciales.",
    version="1.0.0"
)


@app.on_event("startup")
def iniciar_base_datos():
    inicializar_db()


app.include_router(productos.router)
app.include_router(proveedores.router)
app.include_router(cotizaciones.router)
app.include_router(ordenes.router)
app.include_router(envios.router)
app.include_router(reclamos.router)
app.include_router(costos.router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido a ImportaRadar",
        "estado": "API funcionando correctamente"
    }


@app.get("/salud")
def verificar_salud():
    return {"estado": "activo"}
