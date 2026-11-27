
from pydantic import BaseModel


class AnalisisProductoRespuesta(BaseModel):
    producto: str
    codigo_producto: str
    pais_importador: str
    pais_origen: str
    periodo: str
    valor_fob_usd: float | None = None
    valor_cif_usd: float | None = None
    peso_neto_kg: float | None = None
    fuente: str


class ComparacionPaisRespuesta(BaseModel):
    producto: str
    codigo_producto: str
    periodo: str
    pais_mayor_importacion: str
    valor_cif_usd: float
    paises_comparados: int


class EvolucionImportacionesRespuesta(BaseModel):
    producto: str
    codigo_producto: str
    pais_origen: str
    periodo_anterior: str
    periodo_actual: str
    valor_cif_anterior: float
    valor_cif_actual: float
    variacion_porcentual: float
    tendencia: str
