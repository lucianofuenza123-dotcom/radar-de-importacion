from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


EstadosReclamo = Literal[
    "Abierto",
    "En revisión",
    "Respondido",
    "Resuelto",
    "Cerrado"
]


class ReclamoCrear(BaseModel):
    proveedor_id: int = Field(gt=0)
    orden_id: int | None = Field(default=None, gt=0)
    descripcion: str = Field(min_length=5)
    fecha: date
    estado: EstadosReclamo = "Abierto"


class ReclamoActualizarEstado(BaseModel):
    estado: EstadosReclamo
    respuesta: str | None = None


class ReclamoRespuesta(BaseModel):
    id: int
    proveedor_id: int
    orden_id: int | None = None
    descripcion: str
    fecha: date
    estado: str
    respuesta: str | None = None