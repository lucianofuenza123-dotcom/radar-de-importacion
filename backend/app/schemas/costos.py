
from pydantic import BaseModel, Field


class CalculoCostoCrear(BaseModel):
    precio_compra: float = Field(ge=0)
    transporte: float = Field(ge=0)
    seguro: float = Field(ge=0)
    tributos: float = Field(ge=0)
    otros_gastos: float = Field(ge=0)
    cantidad: int = Field(gt=0)
    moneda: str = Field(min_length=3, max_length=10)


class CalculoCostoRespuesta(BaseModel):
    precio_compra: float
    transporte: float
    seguro: float
    tributos: float
    otros_gastos: float
    cantidad: int
    moneda: str
    costo_total: float
    costo_unitario: float
