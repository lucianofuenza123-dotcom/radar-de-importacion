from app.database import conectar


def registrar_oportunidad(datos):
    conexion = conectar()

    try:
        cursor = conexion.execute("""
            INSERT INTO oportunidades (
                nombre,
                categoria,
                pais_origen,
                precio,
                moneda,
                fuente
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            datos.nombre,
            datos.categoria,
            datos.pais_origen,
            datos.precio,
            datos.moneda,
            datos.fuente
        ))

        conexion.commit()

        oportunidad = conexion.execute(
            "SELECT * FROM oportunidades WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return dict(oportunidad)

    finally:
        conexion.close()


def listar_oportunidades():
    conexion = conectar()

    try:
        oportunidades = conexion.execute("""
            SELECT *
            FROM oportunidades
            ORDER BY fecha_consulta DESC
        """).fetchall()

        return [dict(oportunidad) for oportunidad in oportunidades]

    finally:
        conexion.close()


def obtener_oportunidad(oportunidad_id):
    conexion = conectar()

    try:
        oportunidad = conexion.execute(
            "SELECT * FROM oportunidades WHERE id = ?",
            (oportunidad_id,)
        ).fetchone()

        if oportunidad is None:
            return None

        return dict(oportunidad)

    finally:
        conexion.close()