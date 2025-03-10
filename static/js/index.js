const APIURL = "https://lautarocolella.pythonanywhere.com/";

document.addEventListener("DOMContentLoaded", () => {
	const searchForm = document.getElementById('searchEmployeeForm');
	searchForm.addEventListener('submit', (e) => { handleSearchForm(e); });

	const createEmployeeButton = document.getElementById('createEmployee');
	createEmployeeButton.addEventListener('click', () => displayCreateForm());

	const createEmployeeForm = document.getElementById('createEmployeeForm');
	createEmployeeForm.addEventListener('submit', (e) => { handleCreateEmployee(e) });
	createEmployeeForm.addEventListener('reset', () => getEmployees());

	const editEmployeeForm = document.getElementById('editEmployeeForm');
	editEmployeeForm.addEventListener('submit', (e) => { handleEditEmployee(e) });
	editEmployeeForm.addEventListener('reset', () => getEmployees());

	const listUsersButton = document.getElementById('listUsersButton');
	listUsersButton.addEventListener('click', () => getEmployees());
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
	empCreate.classList.remove('hideElem');
}

async function handleCreateEmployee(e) {
	e.preventDefault();

	const createEmployeeForm = document.getElementById('createEmployeeForm');

	const formData = new FormData(createEmployeeForm);
	const formDataJSON = {};

	formData.forEach((value, key) => {
		formDataJSON[key] = value;
	});

	const userInput = {
		"firstname": formDataJSON["firstname"],
		"lastname": formDataJSON["lastname"],
		"position": formDataJSON["position"],
		"age": formDataJSON["age"],
		"start_date": formDataJSON["start_date"],
		"salary": formDataJSON["salary"],
		"email": formDataJSON["email"],
		"photo": formDataJSON["photo"]
	};

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
			const goBack = document.querySelector('.goBackButton');
			goBack.classList.remove('hideElem');
		} catch (error) {
			console.error('Error:', error);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

let currEditingId = 0;
function displayEditEmployee(employee) {
	hideAll();
	const empEdit = document.querySelector('.editEmployeeSection');
	empEdit.classList.remove('hideElem');

	currEditingId = employee.id;

	const savedDate = new Date(employee.start_date);
	const dateFormatted = `${savedDate.getFullYear()}-${('0' + (savedDate.getMonth() + 1)).slice(-2)}-${('0' + savedDate.getDate()).slice(-2)}`;

	document.getElementById('editFirstname').value = employee.firstname;
	document.getElementById('editLastname').value = employee.lastname;
	document.getElementById('editEmail').value = employee.email;
	document.getElementById('editPosition').value = employee.position;
	document.getElementById('editAge').value = employee.age;
	document.getElementById('editStart').value = dateFormatted;
	document.getElementById('editSalary').value = employee.salary;
	document.getElementById('editPhoto').value = employee.photo;
}

async function handleEditEmployee(e) {
	e.preventDefault();

	const editEmployeeForm = document.getElementById('editEmployeeForm');

	const formData = new FormData(editEmployeeForm);
	const formDataJSON = {};

	formData.forEach((value, key) => {
		formDataJSON[key] = value;
	});

	const userInput = {
		"firstname": formDataJSON["firstname"],
		"lastname": formDataJSON["lastname"],
		"position": formDataJSON["position"],
		"age": formDataJSON["age"],
		"start_date": formDataJSON["start_date"],
		"salary": formDataJSON["salary"],
		"email": formDataJSON["email"],
		"photo": formDataJSON["photo"]
	};

	const validInput = validateEmployee(userInput);
	if (Object.keys(validInput).length === 0) {
		return;
	}

	const reqOptions = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validInput)
	}

	try {
		const response = await fetch(APIURL + "empleados/" + currEditingId, reqOptions);
		const data = await response.json();
		if (data.error) {
			displayAlert(true, data.error);
			throw new Error(data.error);
		}
		try {
			const response = await fetch(APIURL + "empleados/" + currEditingId);
			let dataEmp = await response.json();
			if (dataEmp.error) {
				displayAlert(true, dataEmp.error);
				throw new Error(dataEmp.error);
			}
			displayAlert(false, data.mensaje);
			if (!Array.isArray(dataEmp)) dataEmp = [dataEmp];
			displayEmployees(dataEmp);
			currEditingId = 0;
			const goBack = document.querySelector('.goBackButton');
			goBack.classList.remove('hideElem');
		} catch (error) {
			console.error('Error:', error);
		}
	} catch (error) {
		console.error('Error:', error);
	}
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
			getEmployees();
		} catch (error) {
			console.error('Error:', error);
		}
	}
}

function displayEmployees(empleados) {
	hideAll();
	const userListContainer = document.querySelector(".employeeList");
	userListContainer.classList.remove('hideElem');
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
	} if (ageField < 18 || ageField > 100) {
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
		"start_date": startField.toISOString().slice(0, 10),
		"salary": salaryField,
		"email": emailField,
		"photo": photoField,
	};
}

function hideAll() {
	const empList = document.querySelector('.employeeList');
	empList.classList.add('hideElem');
	const empCreate = document.querySelector('.createEmployeeSection');
	empCreate.classList.add('hideElem');
	const empEdit = document.querySelector('.editEmployeeSection');
	empEdit.classList.add('hideElem');
	const goBack = document.querySelector('.goBackButton');
	goBack.classList.add('hideElem');
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
