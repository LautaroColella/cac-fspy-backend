const APIURL = "http://127.0.0.1:5000/";

// Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
// const APIURL = "https://USUARIO.pythonanywhere.com/";

document.addEventListener("DOMContentLoaded", () => {
	const searchForm = document.getElementById('searchEmployeeForm');
	searchForm.addEventListener('submit', (e) => { handleSearchForm(e); });
	getEmployees();
});

function getEmployees() {
	fetch(APIURL + "empleados")
		.then((response) => {
			if (response.ok) return response.json();
			displayAlert(true, response.mensaje);
			throw new Error(response.mensaje);
		})
		.then((data) => displayEmployees(data))
		.catch((error) => {
			console.error("Error:", error);
		});
}

function handleSearchForm(e) {
	e.preventDefault();

	let userQuery = document.getElementById('searchEmployeeInput').value;

	if (!userQuery) displayAlert(true, "La búsqueda debe contener al menos 1 carácter");
	userQuery = userQuery.trim();
	if (userQuery.length >= 100) displayAlert(true, "La búsqueda no debe contener más de 99 carácteres");

	const searchByName = document.getElementById('searchByName').checked;

	if (!searchByName) {
		if (!(/^\d+$/.test(userQuery))) {
			displayAlert(true, "La búsqueda solo debe contener dígitos enteros positivos")
			return;
		}
	} else {
		if ((/^\d+$/.test(userQuery))) {
			displayAlert(true, "La búsqueda debe contener letras")
			return;
		}
	}

	searchEmployee(userQuery);
}

async function searchEmployee(userQuery) {
	try {
		const response = await fetch(APIURL + "empleados/" + userQuery);
		let data = await response.json();
		if (data.mensaje) {
			displayAlert(true, data.mensaje);
			throw new Error(data.mensaje);
		}
		if (!Array.isArray(data)) data = [data];
		displayEmployees(data);
	} catch (error) {
		console.error('Error:', error);
	}
}

function displayEmployees(empleados) {
	const userListContainer = document.querySelector(".employeeList");
	userListContainer.innerHTML = '';

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


let isShowingAlert = false;
function displayAlert(errorAlert, message) {
	if (isShowingAlert) return;
	isShowingAlert = true;

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
			isShowingAlert = false;
		}, 500);
	}, 5000);
}
