from flask import Flask, request, jsonify, render_template
from flask import request
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)


class GestionEmpleados:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(host=host, user=user, password=password)
        self.cursor = self.conn.cursor()

        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute(
            """CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            position VARCHAR(255) NOT NULL,
            age INT NOT NULL,
            start_date DATE NOT NULL,
            salary DECIMAL(10, 2) NOT NULL,
            email VARCHAR(255) NOT NULL,
            photo VARCHAR(255) NOT NULL
            )"""
        )
        self.conn.commit()

        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_empleados(self):
        self.cursor.execute("SELECT * FROM employees")
        empleados = self.cursor.fetchall()
        return empleados

    def consultar_empleado_id(self, id):
        self.cursor.execute("SELECT * FROM employees WHERE id = %s", (id,))
        return self.cursor.fetchone()

    def consultar_empleado_nombre(self, userquery):
        words = userquery.split()

        query = "SELECT DISTINCT * FROM employees WHERE "
        conditions = ["firstname LIKE %s OR lastname LIKE %s" for _ in words]
        query += " OR ".join(conditions)

        params = []
        for word in words:
            word_param = f"%{word}%"
            params.extend([word_param, word_param])

        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    def agregar_empleado(
        self, firstname, lastname, position, age, start_date, salary, email, photo
    ):
        query = "INSERT INTO employees (firstname, lastname, position, age, start_date, salary, email, photo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (firstname, lastname, position, age, start_date, salary, email, photo)

        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.lastrowid

    def modificar_empleado(
        self, id, firstname, lastname, position, age, start_date, salary, email, photo
    ):
        query = "UPDATE employees SET firstname = %s, lastname = %s, position = %s, age = %s, start_date = %s, salary = %s, email = %s, photo = %s WHERE id = %s"
        values = (
            firstname,
            lastname,
            position,
            age,
            start_date,
            salary,
            email,
            photo,
            id,
        )

        self.cursor.execute(query, values)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def eliminar_empleado(self, id):
        self.cursor.execute("DELETE FROM employees WHERE id = %s", (id))
        self.conn.commit()
        return self.cursor.rowcount > 0


empleados = GestionEmpleados(
    host="localhost", user="root", password="root", database="cac_fspy_employees"
)
# empleados = GestionEmpleados(host='USUARIO.mysql.pythonanywhere-services.com', user='USUARIO', password='CLAVE', database='USUARIO$miapp')


@app.route("/empleados", methods=["GET"])
def listar_empleados():
    lista_empleados = empleados.listar_empleados()
    return jsonify(lista_empleados)


@app.route("/empleados/<string:userquery>", methods=["GET"])
def mostrar_empleado(userquery):
    if userquery.isdigit():
        empleado = empleados.consultar_empleado_id(int(userquery))
        if empleado:
            return jsonify(empleado), 200
        else:
            return jsonify({"mensaje": "Empleado no encontrado"}), 404
    else:
        lista_empleados = empleados.consultar_empleado_nombre(userquery)
        return jsonify(lista_empleados)


@app.route("/empleados", methods=["POST"])
def agregar_empleado():
    data = request.json
    nuevo_id = empleados.agregar_empleado(
        data["firstname"],
        data["lastname"],
        data["position"],
        data["age"],
        data["start_date"],
        data["salary"],
        data["email"],
        data["photo"],
    )
    if nuevo_id:
        return (
            jsonify({"mensaje": "Empleado agregado correctamente", "id": nuevo_id}),
            201,
        )
    else:
        return jsonify({"mensaje": "Error del servidor al agregar empleado"}), 500


@app.route("/empleados/<int:id>", methods=["PUT"])
def modificar_empleado(id):
    data = request.json
    if empleados.modificar_empleado(
        id,
        data["firstname"],
        data["lastname"],
        data["position"],
        data["age"],
        data["start_date"],
        data["salary"],
        data["email"],
        data["photo"],
    ):
        return jsonify({"mensaje": "Empleado modificado correctamente"}), 200
    else:
        return jsonify({"mensaje": "Empleado no encontrado o no hubo cambios"}), 404


@app.route("/empleados/<int:id>", methods=["DELETE"])
def eliminar_empleado(id):
    if empleados.eliminar_empleado(id):
        return jsonify({"mensaje": "Empleado eliminado correctamente"}), 200
    else:
        return (
            jsonify(
                {
                    "mensaje": "Error del servidor al eliminar empleado o empleado no encontrado"
                }
            ),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True)
