import httpx


URL_COMTRADE = (
    "https://comtradeapi.un.org/public/v1/preview/C/A/HS"
)


def consultar_importaciones(
    pais_importador=32,
    pais_origen=156,
    codigo_producto="851830",
    periodo=2024
):
    parametros = {
        "reporterCode": pais_importador,
        "partnerCode": pais_origen,
        "cmdCode": codigo_producto,
        "flowCode": "M",
        "period": periodo
    }

    try:
        respuesta = httpx.get(
            URL_COMTRADE,
            params=parametros,
            timeout=20
        )

        respuesta.raise_for_status()

        datos = respuesta.json()

    except httpx.HTTPError as error:
        raise ValueError(
            f"No se pudo consultar UN Comtrade: {error}"
        ) from error

    registros = datos.get("data", [])

    if not registros:
        raise ValueError(
            "UN Comtrade no devolvió registros para esta consulta."
        )

    resultados = []

    for registro in registros:
        resultados.append({
            "producto": "Auriculares y audífonos",
            "codigo_producto": registro["cmdCode"],
            "pais_importador": "Argentina",
            "pais_origen": "China",
            "periodo": registro["period"],
            "cantidad_declarada": registro.get("qty"),
            "unidad_cantidad_codigo": registro.get("qtyUnitCode"),
            "peso_neto_kg": registro.get("netWgt"),
            "valor_fob_usd": registro.get("fobvalue"),
            "valor_cif_usd": registro.get("cifvalue"),
            "fuente": "UN Comtrade"
        })

    return resultados