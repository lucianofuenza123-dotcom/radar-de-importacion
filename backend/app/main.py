from fastapi import FastAPI
from app.api import productos, proveedores
from app.database import inicializar_db
from app.api import productos, proveedores, cotizaciones
from app.api import productos, proveedores, cotizaciones, ordenes

app = FastAPI(
    title="ImportaRadar API",
    description="Sistema de gestión de importaciones y oportunidades comerciales.",
    version="1.0.0"
)

# Inicializar la base de datos al arrancar
@app.on_event("startup")
def iniciar_base_datos():
    inicializar_db()

# Registrar las rutas
app.include_router(productos.router)
app.include_router(proveedores.router)
app.include_router(cotizaciones.router)
app.include_router(ordenes.router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido a ImportaRadar",
        "estado": "API funcionando correctamente"
    }


@app.get("/salud")
def verificar_salud():
    return {"estado": "activo"}