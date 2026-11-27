
from app.database import conectar


def guardar_estadisticas_comtrade(registros):

    conexion = conectar()

    try:
        for registro in registros:
            conexion.execute("""
                INSERT INTO estadisticas_comtrade (
                    producto,
                    codigo_producto,
                    pais_importador,
                    pais_origen,
                    periodo,
                    valor_fob_usd,
                    valor_cif_usd,
                    peso_neto_kg,
                    fuente
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

                ON CONFLICT (
                    codigo_producto,
                    pais_importador,
                    pais_origen,
                    periodo
                )
                DO UPDATE SET
                    producto = excluded.producto,
                    valor_fob_usd = excluded.valor_fob_usd,
                    valor_cif_usd = excluded.valor_cif_usd,
                    peso_neto_kg = excluded.peso_neto_kg,
                    fuente = excluded.fuente,
                    fecha_actualizacion = CURRENT_TIMESTAMP
            """, (
                registro["producto"],
                registro["codigo_producto"],
                registro["pais_importador"],
                registro["pais_origen"],
                registro["periodo"],
                registro.get("valor_fob_usd"),
                registro.get("valor_cif_usd"),
                registro.get("peso_neto_kg"),
                registro["fuente"]
            ))

        conexion.commit()

    finally:
        conexion.close()


def listar_estadisticas_comtrade():

    conexion = conectar()

    try:
        registros = conexion.execute("""
            SELECT *
            FROM estadisticas_comtrade
            ORDER BY valor_cif_usd DESC
        """).fetchall()

        return [dict(registro) for registro in registros]

    finally:
        conexion.close()
