class Producto:
    def __init__(self, id, nombre, descripcion, categoria, codigo=None, activo=True):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.categoria = categoria
        self.codigo = codigo
        self.activo = activo

    def desactivar(self):
        self.activo = False

    def activar(self):
        self.activo = True

    def obtener_informacion(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "categoria": self.categoria,
            "codigo": self.codigo,
            "activo": self.activo
        }