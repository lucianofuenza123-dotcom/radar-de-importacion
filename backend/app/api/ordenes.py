
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.orden_importacion import (
    OrdenImportacionCrear,
    OrdenImportacionRespuesta,
    OrdenImportacionActualizarEstado
)

router = APIRouter(
    prefix="/ordenes",
    tags=["Órdenes de importación"]
)


@router.get("/", response_model=list[OrdenImportacionRespuesta])
def listar_ordenes():
    conexion = conectar()

    try:
        ordenes = conexion.execute(
            "SELECT * FROM ordenes_importacion"
        ).fetchall()

        resultado = []

        for orden in ordenes:
            productos = conexion.execute(
                """
                SELECT producto_id, cantidad, precio_unitario, moneda
                FROM orden_productos
                WHERE orden_id = ?
                """,
                (orden["id"],)
            ).fetchall()

            resultado.append({
                **dict(orden),
                "productos": [dict(producto) for producto in productos]
            })

        return resultado

    finally:
        conexion.close()


@router.get("/{orden_id}", response_model=OrdenImportacionRespuesta)
def obtener_orden(orden_id: int):
    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT * FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        if orden is None:
            raise HTTPException(
                status_code=404,
                detail="Orden de importación no encontrada"
            )

        productos = conexion.execute(
            """
            SELECT producto_id, cantidad, precio_unitario, moneda
            FROM orden_productos
            WHERE orden_id = ?
            """,
            (orden_id,)
        ).fetchall()

        return {
            **dict(orden),
            "productos": [dict(producto) for producto in productos]
        }

    finally:
        conexion.close()


@router.post("/", response_model=OrdenImportacionRespuesta, status_code=201)
def crear_orden(datos: OrdenImportacionCrear):
    conexion = conectar()

    try:
        proveedor = conexion.execute(
            "SELECT id FROM proveedores WHERE id = ?",
            (datos.proveedor_id,)
        ).fetchone()

        if proveedor is None:
            raise HTTPException(
                status_code=404,
                detail="Proveedor no encontrado"
            )

        for producto in datos.productos:
            existe = conexion.execute(
                "SELECT id FROM productos WHERE id = ?",
                (producto.producto_id,)
            ).fetchone()

            if existe is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto {producto.producto_id} no encontrado"
                )

        cursor = conexion.execute(
            """
            INSERT INTO ordenes_importacion (
                proveedor_id, fecha, estado, observaciones
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                datos.proveedor_id,
                datos.fecha.isoformat(),
                datos.estado,
                datos.observaciones
            )
        )

        orden_id = cursor.lastrowid

        for producto in datos.productos:
            conexion.execute(
                """
                INSERT INTO orden_productos (
                    orden_id, producto_id, cantidad,
                    precio_unitario, moneda
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    orden_id,
                    producto.producto_id,
                    producto.cantidad,
                    producto.precio_unitario,
                    producto.moneda
                )
            )

        conexion.commit()

        orden = conexion.execute(
            "SELECT * FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        productos = conexion.execute(
            """
            SELECT producto_id, cantidad, precio_unitario, moneda
            FROM orden_productos
            WHERE orden_id = ?
            """,
            (orden_id,)
        ).fetchall()

        return {
            **dict(orden),
            "productos": [dict(producto) for producto in productos]
        }

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()


@router.put("/{orden_id}/estado", response_model=OrdenImportacionRespuesta)
def actualizar_estado(
    orden_id: int,
    datos: OrdenImportacionActualizarEstado
):
    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT * FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        if orden is None:
            raise HTTPException(
                status_code=404,
                detail="Orden de importación no encontrada"
            )

        conexion.execute(
            """
            UPDATE ordenes_importacion
            SET estado = ?
            WHERE id = ?
            """,
            (datos.estado, orden_id)
        )

        conexion.commit()

        orden_actualizada = conexion.execute(
            "SELECT * FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        productos = conexion.execute(
            """
            SELECT producto_id, cantidad, precio_unitario, moneda
            FROM orden_productos
            WHERE orden_id = ?
            """,
            (orden_id,)
        ).fetchall()

        return {
            **dict(orden_actualizada),
            "productos": [dict(producto) for producto in productos]
        }

    finally:
        conexion.close()


@router.delete("/{orden_id}")
def eliminar_orden(orden_id: int):
    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT id FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        ).fetchone()

        if orden is None:
            raise HTTPException(
                status_code=404,
                detail="Orden de importación no encontrada"
            )

        conexion.execute(
            "DELETE FROM orden_productos WHERE orden_id = ?",
            (orden_id,)
        )

        conexion.execute(
            "DELETE FROM ordenes_importacion WHERE id = ?",
            (orden_id,)
        )

        conexion.commit()

        return {
            "mensaje": "Orden de importación eliminada correctamente",
            "orden_id": orden_id
        }

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()
