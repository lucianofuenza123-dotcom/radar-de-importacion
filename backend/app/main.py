from fastapi import FastAPI

app = FastAPI(
    title="ImportaRadar API",
    description="Sistema de gestión de importaciones y oportunidades comerciales.",
    version="1.0.0"
)


@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido a ImportaRadar",
        "estado": "API funcionando correctamente"
    }


@app.get("/salud")
def verificar_salud():
    return {
        "estado": "activo"
    }