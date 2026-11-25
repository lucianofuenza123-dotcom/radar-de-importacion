
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


EstadosEnvio = Literal[
    "Pendiente",
    "Preparando",
    "Despachado",
    "En tránsito",
    "Entregado",
    "Demorado"
]


class EnvioCrear(BaseModel):
    orden_id: int = Field(gt=0)
    transportista: str | None = None
    codigo_seguimiento: str | None = None
    fecha_estimada: date | None = None
    estado: EstadosEnvio = "Pendiente"


class EnvioActualizarEstado(BaseModel):
    estado: EstadosEnvio
    observacion: str | None = None


class HistorialEnvioRespuesta(BaseModel):
    estado: str
    observacion: str | None = None


class EnvioRespuesta(BaseModel):
    id: int
    orden_id: int
    transportista: str | None = None
    codigo_seguimiento: str | None = None
    fecha_estimada: date | None = None
    fecha_real: date | None = None
    estado: str
    historial: list[HistorialEnvioRespuesta]
