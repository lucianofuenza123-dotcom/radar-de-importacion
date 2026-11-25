
from pydantic import BaseModel, Field


class OportunidadCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    categoria: str = Field(min_length=2, max_length=80)
    pais_origen: str = Field(min_length=2, max_length=80)
    precio: float = Field(gt=0)
    moneda: str = Field(min_length=3, max_length=10)
    fuente: str = Field(min_length=2, max_length=100)


class OportunidadRespuesta(BaseModel):
    id: int
    nombre: str
    categoria: str
    pais_origen: str
    precio: float
    moneda: str
    fuente: str
    fecha_consulta: str
