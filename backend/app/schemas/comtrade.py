from pydantic import BaseModel


class EstadisticaComtradeRespuesta(BaseModel):
    producto: str
    codigo_producto: str
    pais_importador: str
    pais_origen: str
    periodo: str
    cantidad_declarada: float | None = None
    unidad_cantidad_codigo: int | None = None
    peso_neto_kg: float | None = None
    valor_fob_usd: float | None = None
    valor_cif_usd: float | None = None
    fuente: str