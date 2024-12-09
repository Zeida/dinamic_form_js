let fieldsOk = false;
const emailOk = { valid: "false", repeated: "false" };
let name;
let email;
let age;
const people = [];
let errorList = [];
const peopleList = document.querySelector(".people-list");
let uniqueIdCounter;

const searchInput = document.getElementById("person-search");
const searchButton = document.getElementById("person-search-button");

// #################### VALIDACIÓN DE DATOS y GESTIÓN DE ERRORES ####################

function validateFieldsNotEmpty() {
  name = document.querySelector("[type='text']").value;
  email = document.querySelector("[type='email']").value;
  age = document.querySelector("[type='number']").value;
  fieldsOk = (name !== "" && email !== "" && age !== "");
}

function uniqueEmail(email) {
  emailOk.repeated = people.some(person => person.email === email);
}

function validateEmailFormat(email) {
  const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  emailOk.valid = emailPattern.test(email);
}

function errorsOnForm() {
  errorList = [];
  validateFieldsNotEmpty();
  validateEmailFormat(email);
  uniqueEmail(email);
  if (!fieldsOk) {
    errorList.push("Rellene todos los campos para poder añadir la persona.");
  }
  if (email !== "" && !emailOk?.valid) {
    errorList.push("El email no tiene un formato válido, revísalo.");
  }
  if (email !== "" && emailOk?.repeated) {
    errorList.push("Ese email ya se encuentra añadido. Pruebe con otro.");
  }
}

function handleErrors(errorContainer) {
  if (errorContainer) {
    errorContainer.innerHTML += `<p id="error" class="error"> * 
      ${errorList.map(error => `${error}`).join("<br>")}
    </p>`;
  }
}

function highlightInvalidInputs() {
  if (!fieldsOk) {
    if (name === "") {
      document.querySelector("[type='text']").classList.add("toggle-class");
    }
    if (email === "") {
      document.querySelector("[type='email']").classList.add("toggle-class");
    }
    if (age === "") {
      document.querySelector("[type='number']").classList.add("toggle-class");
    }
  }

  if (email !== "" && !emailOk.valid) {
    document.querySelector("[type='email']").classList.add("toggle-class");
  }

  if (email !== "" && emailOk?.repeated) {
    document.querySelector("[type='email']").classList.add("toggle-class");
  }
}

function generateCardHtml(person) {
  return `
    <div class="card" id="${person.id}">
      <div class="card-header">
        <h5 class="mb-0">${person.name}</h5>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Nombre" value="${person.name}" disabled>
      </div>
      <div class="mb-3">
        <input type="email" class="form-control" placeholder="Correo" value="${person.email}" disabled>
      </div>
      <div class="mb-3">
        <input type="number" class="form-control" placeholder="Edad" value="${person.age}" disabled>
      </div>
      <button class="person-remove" type="button" data-id="${person.id}">🗑️</button>
    </div>
  `;
}

function addPerson() {
  errorsOnForm();

  const error = document.querySelector(".register-errors");
  const person = { id: `person-${uniqueIdCounter}`, name, email, age };
  const uniqueId = `person-${uniqueIdCounter}`;
  uniqueIdCounter++;
  if (error) {
    error.innerHTML = "";
  }

  const inputs = document.querySelectorAll("input");

  if (fieldsOk && emailOk.valid && !emailOk.repeated) {
    peopleList.innerHTML += generateCardHtml(person);
    people.push({ id: uniqueId, name, email, age });

    inputs.forEach(input => {
      input.classList.remove("toggle-class");
    });
  } else {
    handleErrors(error);
    highlightInvalidInputs();
  }
}

function filteredPerson(filtered) {
  peopleList.innerHTML = "";

  filtered.forEach(person => {
    peopleList.innerHTML += generateCardHtml(person);
  });
}

// ############################ Manejo de eventos [botones] ############################

// ----------------- Add person  -----------------
const addButton = document.getElementById("add-button");

addButton.addEventListener("click", function () {
  addPerson();
});

// ----------- Search person (1 unique register -> 100% coincidence with name ) -----------
searchButton.addEventListener("click", function () {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    alert("El campo de búsqueda está vacío.");
    filteredPerson(people);
    return;
  }
  const filtered = people.filter(person => person.name === searchTerm);
  filteredPerson(filtered);
});

// ----------------- Reset people list  -----------------
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", function () {
  filteredPerson(people);
  searchInput.value = "";
});

// ----------------- Remove person  -----------------
peopleList.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("person-remove")) {
    const uniqueId = event.target.getAttribute("data-id");

    const cardElement = document.getElementById(uniqueId);
    console.log(cardElement);

    cardElement.remove();

    const personIndex = people.findIndex(person => person.id === uniqueId);
    if (personIndex !== -1) {
      people.splice(personIndex, 1);
    }
  }
});
