
from datetime import date

from pydantic import BaseModel, Field


class CotizacionCrear(BaseModel):
    producto_id: int = Field(gt=0)
    proveedor_id: int = Field(gt=0)
    precio_unitario: float = Field(gt=0)
    moneda: str = Field(min_length=3, max_length=10)
    cantidad_minima: int = Field(gt=0)
    fecha_emision: date | None = None
    fecha_vencimiento: date | None = None


class CotizacionRespuesta(BaseModel):
    id: int
    producto_id: int
    proveedor_id: int
    precio_unitario: float
    moneda: str
    cantidad_minima: int
    fecha_emision: date | None = None
    fecha_vencimiento: date | None = None
