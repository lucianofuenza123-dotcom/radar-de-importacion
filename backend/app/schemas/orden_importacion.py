from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class OrdenProductoCrear(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(gt=0)
    precio_unitario: float = Field(ge=0)
    moneda: str = Field(min_length=3, max_length=10)


class OrdenProductoRespuesta(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float
    moneda: str


class OrdenImportacionCrear(BaseModel):
    proveedor_id: int = Field(gt=0)
    fecha: date
    estado: Literal[
        "En evaluación",
        "Cotizada",
        "Aprobada",
        "Despachada",
        "En tránsito",
        "Recibida",
        "Cancelada"
    ] = "En evaluación"
    observaciones: str | None = None
    productos: list[OrdenProductoCrear] = Field(min_length=1)


class OrdenImportacionRespuesta(BaseModel):
    id: int
    proveedor_id: int
    fecha: date
    estado: str
    observaciones: str | None = None
    productos: list[OrdenProductoRespuesta]