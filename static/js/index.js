const APIURL = "http://127.0.0.1:5000/";

// Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
// const APIURL = "https://USUARIO.pythonanywhere.com/";

document.addEventListener("DOMContentLoaded", () => {
	const searchForm = document.getElementById('searchEmployeeForm');
	searchForm.addEventListener('submit', (e) => { handleSearchForm(e); });

	const createEmployeeButton = document.getElementById('createEmployee');
	createEmployeeButton.addEventListener('click', () => displayCreateForm());
	getEmployees();
});

async function getEmployees() {
	try {
		const response = await fetch(APIURL + "empleados");
		let data = await response.json();
		if (data.error) {
			displayAlert(true, data.error);
			throw new Error(data.error);
		}
		displayEmployees(data);
	} catch (error) {
		console.error('Error:', error);
	}
}

async function searchEmployee(userQuery) {
	try {
		const response = await fetch(APIURL + "empleados/" + userQuery);
		let data = await response.json();
		if (data.error) {
			displayAlert(true, data.error);
			throw new Error(data.error);
		}
		if (!Array.isArray(data)) data = [data];
		displayEmployees(data);
	} catch (error) {
		console.error('Error:', error);
	}
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

function displayCreateForm() {
	hideAll();
	const empCreate = document.querySelector('.createEmployeeSection');
	empCreate.style.display = 'block';


}

async function handleCreateEmployee(userInput) {
	const validInput = validateEmployee(userInput);
	if (Object.keys(validInput).length === 0) {
		return;
	}

	const reqOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validInput)
	}

	try {
		const response = await fetch(APIURL + "empleados", reqOptions);
		const data = await response.json();
		if (data.error) {
			displayAlert(true, data.error);
			throw new Error(data.error);
		}
		try {
			const response = await fetch(APIURL + "empleados/" + data.id);
			let dataEmp = await response.json();
			if (dataEmp.error) {
				displayAlert(true, dataEmp.error);
				throw new Error(dataEmp.error);
			}
			displayAlert(false, data.mensaje);
			if (!Array.isArray(dataEmp)) dataEmp = [dataEmp];
			displayEmployees(dataEmp);
		} catch (error) {
			console.error('Error:', error);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

function validateEmployee(userInput) {
	const namePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;
	const salaryPattern = /^\d{1,8}(\.\d{1,2})?$/;
	const photoUrlPattern = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
	const photoExtPattern = /\.(jpg|jpeg|png|bmp)$/i;

	if (!userInput.firstname) {
		displayAlert(true, "El nombre es obligatorio");
		return {};
	}
	const firstnameField = userInput.firstname.trim();
	if (!namePattern.test(firstnameField)) {
		displayAlert(true, "El nombre solo puede contener letras");
		return {};
	} if (firstnameField.length > 254) {
		displayAlert(true, "El nombre no puede contener más de 254 carácteres");
		return {};
	}

	if (!userInput.lastname) {
		displayAlert(true, "El apellido es obligatorio");
		return {};
	}
	const lastnameField = userInput.lastname.trim();
	if (!namePattern.test(lastnameField)) {
		displayAlert(true, "El apellido solo puede contener letras");
		return {};
	} if (lastnameField.length > 254) {
		displayAlert(true, "El apellido no puede contener más de 254 carácteres");
		return {};
	}

	if (!userInput.email) {
		displayAlert(true, "El email es obligatorio");
		return {};
	}
	const emailField = userInput.email.trim();
	if (!emailPattern.test(emailField)) {
		displayAlert(true, "El email es inválido");
		return {};
	} if (emailField.length > 254) {
		displayAlert(true, "El email no puede contener más de 254 carácteres");
		return {};
	}

	if (!userInput.position) {
		displayAlert(true, "La posición es obligatoria");
		return {};
	}
	const positionField = userInput.position.trim();
	if (positionField.length > 254) {
		displayAlert(true, "La posición no puede contener más de 254 carácteres");
		return {};
	}

	if (!userInput.age) {
		displayAlert(true, "La edad es obligatoria");
		return {};
	}
	const ageField = userInput.age.trim();
	if (isNaN(ageField)) {
		displayAlert(true, "La edad debe ser un número");
		return {};
	} if (ageField.length < 18 || ageField.length > 100) {
		displayAlert(true, "La edad debe ser entre 18 y 100 años");
		return {};
	}

	if (!userInput.start_date) {
		displayAlert(true, "La fecha de inicio es obligatoria");
		return {};
	}
	const myDate = userInput.start_date.trim();
	if (!datePattern.test(myDate)) {
		displayAlert(true, "La fecha de inicio tiene un formato inválido");
		return {};
	}
	const startField = new Date(myDate);
	if (startField < new Date('1944-01-01') || startField > new Date()) {
		displayAlert(true, "La fecha de inicio debe estar entre el 1 de enero de 1944 y la fecha actual");
		return {};
	}

	if (!userInput.salary) {
		displayAlert(true, "El salario es obligatorio");
		return {};
	}
	const salaryField = userInput.salary.trim();
	if (!salaryPattern.test(salaryField)) {
		displayAlert(true, "El salario debe ser un número válido con hasta dos decimales");
		return {};
	}

	if (!userInput.photo) {
		displayAlert(true, "La URL de la foto es obligatoria");
		return {};
	}
	const photoField = userInput.photo.trim();
	if (!photoUrlPattern.test(photoField)) {
		displayAlert(true, "La URL de la foto no es válida");
		return {};
	} if (!photoExtPattern.test(photoField)) {
		displayAlert(true, "La foto debe ser un archivo con una extensión válida (jpg, jpeg, png, bmp)");
		return {};
	}

	return {
		"firstname": firstnameField,
		"lastname": lastnameField,
		"position": positionField,
		"age": ageField,
		"start_date": startField,
		"salary": salaryField,
		"email": emailField,
		"photo": photoField,
	};
}

function displayEditEmployee(employee) {
	console.log('asd');
}

async function deleteEmployee(empId, fullname) {
	if (confirm(`Esta seguro que desea eliminar al empleado '${fullname}'?`)) {
		try {
			const response = await fetch(APIURL + "empleados/" + empId, { method: 'DELETE' });
			const data = await response.json();
			if (data.error) {
				displayAlert(true, data.error);
				throw new Error(data.error);
			}
			displayAlert(false, data.mensaje);
			const cardToDel = document.querySelector('[data-emp-id="' + empId + '"]');
			if (cardToDel) cardToDel.remove();
		} catch (error) {
			console.error('Error:', error);
		}
	}
}

function displayEmployees(empleados) {
	hideAll();
	const userListContainer = document.querySelector(".employeeList");
	userListContainer.style.display = 'block';
	userListContainer.innerHTML = '';

	for (let empleado of empleados) {
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("card");
		cardContainer.setAttribute('data-emp-id', empleado.id)

		const cardHeaderContainer = document.createElement("div");
		cardHeaderContainer.classList.add("card-header");
		cardHeaderContainer.classList.add("bg-primary");
		cardHeaderContainer.classList.add("text-white");

		const strongName = document.createElement("strong");
		strongName.textContent = `${empleado.firstname} ${empleado.lastname}`;

		cardHeaderContainer.appendChild(strongName);

		const editIcon = document.createElement('i');
		editIcon.classList.add('fas');
		editIcon.classList.add('fa-pen-to-square');
		editIcon.addEventListener('click', () => displayEditEmployee(empleado));
		cardHeaderContainer.appendChild(editIcon);

		const deleteIcon = document.createElement('i');
		deleteIcon.classList.add('fas');
		deleteIcon.classList.add('fa-trash');
		deleteIcon.addEventListener('click', () => deleteEmployee(empleado.id, `${empleado.firstname} ${empleado.lastname}`));
		cardHeaderContainer.appendChild(deleteIcon);

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

function hideAll() {
	const empList = document.querySelector('.employeeList');
	empList.style.display = 'none';
	const empCreate = document.querySelector('.createEmployeeSection');
	empCreate.style.display = 'none';
	const empEdit = document.querySelector('.editEmployeeSection');
	empEdit.style.display = 'none';
}

let isShowingAlert = false;
function displayAlert(errorAlert, message) {
	if (isShowingAlert) return;
	isShowingAlert = true;

	let alertElem = "";
	if (errorAlert) alertElem = document.querySelector('.alert-danger');
	else alertElem = document.querySelector('.alert-success');

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
