class Reclamo:
    ESTADOS = [
        "Abierto",
        "En revisión",
        "Respondido",
        "Resuelto",
        "Cerrado"
    ]

    def __init__(
        self,
        id,
        proveedor_id,
        descripcion,
        orden_id=None,
        fecha=None,
        estado="Abierto"
    ):
        if estado not in self.ESTADOS:
            raise ValueError("El estado del reclamo no es válido")

        self.id = id
        self.proveedor_id = proveedor_id
        self.descripcion = descripcion
        self.orden_id = orden_id
        self.fecha = fecha
        self.estado = estado
        self.respuesta = None

    def registrar_respuesta(self, respuesta):
        self.respuesta = respuesta
        self.estado = "Respondido"

    def cambiar_estado(self, nuevo_estado):
        if nuevo_estado not in self.ESTADOS:
            raise ValueError("El estado del reclamo no es válido")

        self.estado = nuevo_estado

    def obtener_informacion(self):
        return {
            "id": self.id,
            "proveedor_id": self.proveedor_id,
            "descripcion": self.descripcion,
            "orden_id": self.orden_id,
            "fecha": self.fecha,
            "estado": self.estado,
            "respuesta": self.respuesta
        }