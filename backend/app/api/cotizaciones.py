
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.cotizacion import CotizacionCrear, CotizacionRespuesta

router = APIRouter(prefix="/cotizaciones", tags=["Cotizaciones"])


@router.get("/", response_model=list[CotizacionRespuesta])
def listar_cotizaciones():
    conexion = conectar()

    try:
        cotizaciones = conexion.execute(
            "SELECT * FROM cotizaciones"
        ).fetchall()

        return [dict(cotizacion) for cotizacion in cotizaciones]

    finally:
        conexion.close()


@router.post("/", response_model=CotizacionRespuesta, status_code=201)
def crear_cotizacion(datos: CotizacionCrear):
    conexion = conectar()

    try:
        producto = conexion.execute(
            "SELECT id FROM productos WHERE id = ?",
            (datos.producto_id,)
        ).fetchone()

        proveedor = conexion.execute(
            "SELECT id FROM proveedores WHERE id = ?",
            (datos.proveedor_id,)
        ).fetchone()

        if producto is None:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        if proveedor is None:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado")

        cursor = conexion.execute(
            """
            INSERT INTO cotizaciones (
                producto_id, proveedor_id, precio_unitario,
                moneda, cantidad_minima, fecha_emision, fecha_vencimiento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datos.producto_id,
                datos.proveedor_id,
                datos.precio_unitario,
                datos.moneda,
                datos.cantidad_minima,
                datos.fecha_emision.isoformat() if datos.fecha_emision else None,
                datos.fecha_vencimiento.isoformat() if datos.fecha_vencimiento else None
            )
        )

        conexion.commit()

        cotizacion = conexion.execute(
            "SELECT * FROM cotizaciones WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return dict(cotizacion)

    finally:
        conexion.close()
