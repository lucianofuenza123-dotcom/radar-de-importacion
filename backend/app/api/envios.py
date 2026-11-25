
from fastapi import APIRouter, HTTPException

from app.database import conectar
from app.schemas.envio import (
    EnvioCrear,
    EnvioActualizarEstado,
    EnvioRespuesta
)

router = APIRouter(
    prefix="/envios",
    tags=["Envíos y seguimiento"]
)


def obtener_datos_envio(conexion, envio_id):
    envio = conexion.execute(
        "SELECT * FROM envios WHERE id = ?",
        (envio_id,)
    ).fetchone()

    if envio is None:
        return None

    historial = conexion.execute(
        """
        SELECT estado, observacion
        FROM historial_envios
        WHERE envio_id = ?
        ORDER BY id
        """,
        (envio_id,)
    ).fetchall()

    return {
        **dict(envio),
        "historial": [dict(registro) for registro in historial]
    }


@router.get("/", response_model=list[EnvioRespuesta])
def listar_envios():
    conexion = conectar()

    try:
        envios = conexion.execute(
            "SELECT id FROM envios ORDER BY id"
        ).fetchall()

        return [
            obtener_datos_envio(conexion, envio["id"])
            for envio in envios
        ]

    finally:
        conexion.close()


@router.get("/{envio_id}", response_model=EnvioRespuesta)
def obtener_envio(envio_id: int):
    conexion = conectar()

    try:
        envio = obtener_datos_envio(conexion, envio_id)

        if envio is None:
            raise HTTPException(
                status_code=404,
                detail="Envío no encontrado"
            )

        return envio

    finally:
        conexion.close()


@router.post("/", response_model=EnvioRespuesta, status_code=201)
def crear_envio(datos: EnvioCrear):
    conexion = conectar()

    try:
        orden = conexion.execute(
            "SELECT id FROM ordenes_importacion WHERE id = ?",
            (datos.orden_id,)
        ).fetchone()

        if orden is None:
            raise HTTPException(
                status_code=404,
                detail="Orden de importación no encontrada"
            )

        envio_existente = conexion.execute(
            "SELECT id FROM envios WHERE orden_id = ?",
            (datos.orden_id,)
        ).fetchone()

        if envio_existente is not None:
            raise HTTPException(
                status_code=409,
                detail="La orden ya tiene un envío registrado"
            )

        cursor = conexion.execute(
            """
            INSERT INTO envios (
                orden_id, transportista, codigo_seguimiento,
                fecha_estimada, estado
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                datos.orden_id,
                datos.transportista,
                datos.codigo_seguimiento,
                datos.fecha_estimada.isoformat()
                if datos.fecha_estimada else None,
                datos.estado
            )
        )

        envio_id = cursor.lastrowid

        conexion.execute(
            """
            INSERT INTO historial_envios (envio_id, estado, observacion)
            VALUES (?, ?, ?)
            """,
            (envio_id, datos.estado, "Registro inicial del envío")
        )

        conexion.commit()

        return obtener_datos_envio(conexion, envio_id)

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()


@router.put("/{envio_id}/estado", response_model=EnvioRespuesta)
def actualizar_estado_envio(
    envio_id: int,
    datos: EnvioActualizarEstado
):
    conexion = conectar()

    try:
        envio = conexion.execute(
            "SELECT * FROM envios WHERE id = ?",
            (envio_id,)
        ).fetchone()

        if envio is None:
            raise HTTPException(
                status_code=404,
                detail="Envío no encontrado"
            )

        fecha_real = envio["fecha_real"]

        if datos.estado == "Entregado" and fecha_real is None:
            from datetime import date
            fecha_real = date.today().isoformat()

        conexion.execute(
            """
            UPDATE envios
            SET estado = ?, fecha_real = ?
            WHERE id = ?
            """,
            (datos.estado, fecha_real, envio_id)
        )

        conexion.execute(
            """
            INSERT INTO historial_envios (envio_id, estado, observacion)
            VALUES (?, ?, ?)
            """,
            (envio_id, datos.estado, datos.observacion)
        )

        conexion.commit()

        return obtener_datos_envio(conexion, envio_id)

    except Exception:
        conexion.rollback()
        raise

    finally:
        conexion.close()
