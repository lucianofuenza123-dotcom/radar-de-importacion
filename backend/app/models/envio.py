class Envio:
    ESTADOS = [
        "Pendiente",
        "Preparando",
        "Despachado",
        "En tránsito",
        "Entregado",
        "Demorado"
    ]

    def __init__(
        self,
        id,
        orden_id,
        transportista=None,
        codigo_seguimiento=None,
        fecha_estimada=None,
        fecha_real=None,
        estado="Pendiente"
    ):
        if estado not in self.ESTADOS:
            raise ValueError("El estado del envío no es válido")

        self.id = id
        self.orden_id = orden_id
        self.transportista = transportista
        self.codigo_seguimiento = codigo_seguimiento
        self.fecha_estimada = fecha_estimada
        self.fecha_real = fecha_real
        self.estado = estado
        self.historial = []

    def cambiar_estado(self, nuevo_estado, observacion=None):
        if nuevo_estado not in self.ESTADOS:
            raise ValueError("El estado del envío no es válido")

        self.estado = nuevo_estado
        self.historial.append({
            "estado": nuevo_estado,
            "observacion": observacion
        })

    def obtener_informacion(self):
        return {
            "id": self.id,
            "orden_id": self.orden_id,
            "transportista": self.transportista,
            "codigo_seguimiento": self.codigo_seguimiento,
            "fecha_estimada": self.fecha_estimada,
            "fecha_real": self.fecha_real,
            "estado": self.estado,
            "historial": self.historial
        }