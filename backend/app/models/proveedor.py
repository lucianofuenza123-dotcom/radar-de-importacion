class Proveedor:
    def __init__(self, id, nombre, pais, contacto, email=None, activo=True):
        self.id = id
        self.nombre = nombre
        self.pais = pais
        self.contacto = contacto
        self.email = email
        self.activo = activo

    def desactivar(self):
        self.activo = False

    def activar(self):
        self.activo = True

    def obtener_informacion(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "pais": self.pais,
            "contacto": self.contacto,
            "email": self.email,
            "activo": self.activo
        }