class Cotizacion:
    def __init__(
        self,
        id,
        producto_id,
        proveedor_id,
        precio_unitario,
        moneda,
        cantidad_minima,
        fecha_emision=None,
        fecha_vencimiento=None
    ):
        self.id = id
        self.producto_id = producto_id
        self.proveedor_id = proveedor_id
        self.precio_unitario = precio_unitario
        self.moneda = moneda
        self.cantidad_minima = cantidad_minima
        self.fecha_emision = fecha_emision
        self.fecha_vencimiento = fecha_vencimiento

    def obtener_informacion(self):
        return {
            "id": self.id,
            "producto_id": self.producto_id,
            "proveedor_id": self.proveedor_id,
            "precio_unitario": self.precio_unitario,
            "moneda": self.moneda,
            "cantidad_minima": self.cantidad_minima,
            "fecha_emision": self.fecha_emision,
            "fecha_vencimiento": self.fecha_vencimiento
        }