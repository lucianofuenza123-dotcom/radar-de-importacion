from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_inicio():
    respuesta = client.get("/")

    assert respuesta.status_code == 200
    assert respuesta.json() == {
        "mensaje": "Bienvenido a ImportaRadar",
        "estado": "API funcionando correctamente"
    }


def test_verificar_salud():
    respuesta = client.get("/salud")

    assert respuesta.status_code == 200
    assert respuesta.json() == {
        "estado": "activo"
    }