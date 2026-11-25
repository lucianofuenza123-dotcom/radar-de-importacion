
from app.database import conectar


def calcular_costo(datos):
    costo_total = (
        datos.precio_compra
        + datos.transporte
        + datos.seguro
        + datos.tributos
        + datos.otros_gastos
    )

    costo_unitario = costo_total / datos.cantidad

    return {
        "precio_compra": datos.precio_compra,
        "transporte": datos.transporte,
        "seguro": datos.seguro,
        "tributos": datos.tributos,
        "otros_gastos": datos.otros_gastos,
        "cantidad": datos.cantidad,
        "moneda": datos.moneda,
        "costo_total": round(costo_total, 2),
        "costo_unitario": round(costo_unitario, 2)
    }


def guardar_costo(orden_id, datos, resultado):
    conexion = conectar()

    try:
        cursor = conexion.execute("""
            INSERT INTO costos_importacion (
                orden_id,
                precio_compra,
                transporte,
                seguro,
                tributos,
                otros_gastos,
                cantidad,
                moneda,
                costo_total,
                costo_unitario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            orden_id,
            datos.precio_compra,
            datos.transporte,
            datos.seguro,
            datos.tributos,
            datos.otros_gastos,
            datos.cantidad,
            datos.moneda,
            resultado["costo_total"],
            resultado["costo_unitario"]
        ))

        conexion.commit()

        return cursor.lastrowid

    finally:
        conexion.close()
