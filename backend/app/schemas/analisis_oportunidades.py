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