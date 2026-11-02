class OrdenImportacion:
    ESTADOS = [
        "En evaluación",
        "Cotizada",
        "Aprobada",
        "Despachada",
        "En tránsito",
        "Recibida",
        "Cancelada"
    ]

    def __init__(
        self,
        id,
        proveedor_id,
        fecha,
        estado="En evaluación",
        observaciones=None
    ):
        if estado not in self.ESTADOS:
            raise ValueError("El estado de la orden no es válido")

        self.id = id
        self.proveedor_id = proveedor_id
        self.fecha = fecha
        self.estado = estado
        self.observaciones = observaciones
        self.productos = []

    def agregar_producto(self, producto_id, cantidad, precio_unitario, moneda):
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor que cero")

        if precio_unitario < 0:
            raise ValueError("El precio no puede ser negativo")

        self.productos.append({
            "producto_id": producto_id,
            "cantidad": cantidad,
            "precio_unitario": precio_unitario,
            "moneda": moneda
        })

    def cambiar_estado(self, nuevo_estado):
        if nuevo_estado not in self.ESTADOS:
            raise ValueError("El estado de la orden no es válido")

        self.estado = nuevo_estado

    def obtener_informacion(self):
        return {
            "id": self.id,
            "proveedor_id": self.proveedor_id,
            "fecha": self.fecha,
            "estado": self.estado,
            "observaciones": self.observaciones,
            "productos": self.productos
        }