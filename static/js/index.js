const URL = "http://127.0.0.1:5000/";

// Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
// const URL = "https://USUARIO.pythonanywhere.com/";

document.addEventListener("DOMContentLoaded", () => {
	getEmployees();
});

function getEmployees() {
	fetch(URL + "empleados")
		.then((response) => {
			if (response.ok) return response.json();
			else throw new Error("Error al obtener los empleados");
		})
		.then((data) => displayEmployees(data))
		.catch((error) => {
			displayAlert(true, "Error desconocido, ver consola")
			console.error("Ocurrio un error desconocido:", error);
		});
}

function displayEmployees(empleados) {
	const userListContainer = document.querySelector(".employeeList");

	for (let empleado of empleados) {
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("card");

		const cardHeaderContainer = document.createElement("div");
		cardHeaderContainer.classList.add("card-header");
		cardHeaderContainer.classList.add("bg-primary");
		cardHeaderContainer.classList.add("text-white");

		const strongName = document.createElement("strong");
		strongName.textContent = `${empleado.firstname} ${empleado.lastname}`;

		cardHeaderContainer.appendChild(strongName);

		const cardBodyContainer = document.createElement("div");
		cardBodyContainer.classList.add("card-body");

		const rowContainer = document.createElement("div");
		rowContainer.classList.add("row");

		const leftContent = document.createElement("div");
		leftContent.classList.add("col-md-4");

		const employeeImg = document.createElement("img");
		employeeImg.src = empleado.photo;
		employeeImg.alt = `Foto de '${empleado.firstname} ${empleado.lastname}'`;
		employeeImg.classList.add("img-fluid");
		employeeImg.classList.add("rounded-circle");

		leftContent.appendChild(employeeImg);

		const rightContent = document.createElement("div");
		rightContent.classList.add("col-md-8");

		const ulData = document.createElement("ul");
		ulData.classList.add("list-unstyled");

		const idLi = document.createElement("li");
		const nameLi = document.createElement("li");
		const lastnameLi = document.createElement("li");
		const ageLi = document.createElement("li");
		const emailLi = document.createElement("li");
		const positionLi = document.createElement("li");
		const salaryLi = document.createElement("li");
		const startdateLi = document.createElement("li");

		const dateTransformed = new Date(empleado.start_date);
		const dateFormatted = `${dateTransformed.getFullYear()}/${dateTransformed.getMonth() + 1
			}/${dateTransformed.getDate()}`;

		idLi.innerHTML = `<strong>ID:</strong> ${empleado.id}`;
		nameLi.innerHTML = `<strong>Nombre:</strong> ${empleado.firstname}`;
		lastnameLi.innerHTML = `<strong>Apellido:</strong> ${empleado.lastname}`;
		ageLi.innerHTML = `<strong>Edad:</strong> ${empleado.age}`;
		emailLi.innerHTML = `<strong>Email:</strong> ${empleado.email}`;
		positionLi.innerHTML = `<strong>Posición:</strong> ${empleado.position}`;
		salaryLi.innerHTML = `<strong>Salario:</strong> $${empleado.salary}`;
		startdateLi.innerHTML = `<strong>Fecha de inicio:</strong> ${dateFormatted}`;

		ulData.appendChild(idLi);
		ulData.appendChild(nameLi);
		ulData.appendChild(lastnameLi);
		ulData.appendChild(ageLi);
		ulData.appendChild(emailLi);
		ulData.appendChild(positionLi);
		ulData.appendChild(salaryLi);
		ulData.appendChild(startdateLi);
		rightContent.appendChild(ulData);
		rowContainer.appendChild(leftContent);
		rowContainer.appendChild(rightContent);
		cardBodyContainer.appendChild(rowContainer);

		cardContainer.appendChild(cardHeaderContainer);
		cardContainer.appendChild(cardBodyContainer);
		userListContainer.appendChild(cardContainer);
	}
}

function displayAlert(errorAlert, message) {
	let alertElem = "";
	if (errorAlert) alertElem = document.querySelector('.alert-danger');
	else alertElem = document.querySelector('.alert-danger');

	alertElem.textContent = message;

	alertElem.classList.remove('d-none');
	alertElem.classList.add('slide-in-right');

	setTimeout(() => {
		alertElem.classList.remove('slide-in-right');
		alertElem.classList.add('slide-out-right');

		setTimeout(() => {
			alertElem.classList.add('d-none');
			alertElem.classList.remove('slide-out-right');
		}, 500);
	}, 5000);
}