class Usuario:
    def __init__(self, id, nombre, email, rol, activo=True):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.rol = rol
        self.activo = activo

    def desactivar(self):
        self.activo = False

    def activar(self):
        self.activo = True

    def obtener_informacion(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "rol": self.rol,
            "activo": self.activo
        }