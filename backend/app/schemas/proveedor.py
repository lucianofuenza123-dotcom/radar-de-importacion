
from pydantic import BaseModel, Field, EmailStr


class ProveedorCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    pais: str = Field(min_length=2, max_length=80)
    contacto: str = Field(min_length=2, max_length=100)
    email: EmailStr | None = None


class ProveedorRespuesta(BaseModel):
    id: int
    nombre: str
    pais: str
    contacto: str
    email: EmailStr | None = None
    activo: bool
