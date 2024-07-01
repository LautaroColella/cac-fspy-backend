# Employee Management System

This is a demo application for the final project of "Codo a codo Full Stack Python" that allows managing employees in an enterprise. The application includes a backend REST API built with Flask in Python and a frontend interface built with HTML, CSS, Bootstrap, and JavaScript. The backend connects to a MySQL database and allows for CRUD operations. You can view the online demo at: [pythonanywhere](https://google.com)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **Backend:**
  - REST API built with Flask
  - Connects to a MySQL database
  - Supports CRUD operations for managing employees

- **Frontend:**
  - User interface built with HTML, CSS, Bootstrap, and JavaScript
  - Allows users to perform CRUD operations through a web interface

## Installation

### Prerequisites

- Python 3.x
- MySQL
- Flask
- Flask-CORS

### Backend Setup

1. Clone the repository:

  ```bash
  git clone https://github.com/LautaroColella/cac-fspy-backend.git
  cd cac-fspy-backend
  ```

2. Install the required packages:

  ```bash
  pip install flask flask-cors
  ```

3. Configure the MySQL database:

	- Make sure you have MySQL installed and running.
	- Create a new MySQL database.

4. Update the database configuration in myapp.py:

  ```python
  empleados = GestionEmpleados(host="yourhost", user="youruser", password="yourpassword", database="yourdatabase")
  ```

5. Run the Flask application:

  ```bash
  python myapp.py
  ```

### Frontend setup

1. Open the index.html file in your web browser to access the frontend interface.

## Usage

- Listing Employees: View a list of all employees.
- Searching Employee: Search for a employee by name or id.
- Adding an Employee: Add a new employee to the database.
- Updating an Employee: Update details of an existing employee.
- Deleting an Employee: Remove an employee from the database.

## API Endpoints

API Endpoints

- List all employees:
  - GET /empleados

- Get employee by name or id:
  - GET /empleados/`<name or id>`

- Add a new employee:
  - POST /empleados
  - Request body: JSON object with `firstname`, `lastname`, `position`, `age`, `start_date`, `salary`, `email`, `photo`

- Update an existing employee:
  - PUT /empleados/`<id>`
  - Request body: JSON object with `firstname`, `lastname`, `position`, `age`, `start_date`, `salary`, `email`, `photo`

- Delete an employee:
  - DELETE /empleados/`<id>`

## License

Copyright 2024 Lautaro Colella

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
