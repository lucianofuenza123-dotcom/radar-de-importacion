
from pydantic import BaseModel, Field


class ProductoCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str = Field(min_length=5, max_length=500)
    categoria: str = Field(min_length=2, max_length=80)
    codigo: str | None = None


class ProductoRespuesta(BaseModel):
    id: int
    nombre: str
    descripcion: str
    categoria: str
    codigo: str | None = None
    activo: bool
