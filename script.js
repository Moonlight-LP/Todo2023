// Define the base URL for the API
const apiUrl = "http://127.0.0.1:4557";

// Function to load all appointments from the server
async function loadAppointments() {
  fetch(`${apiUrl}/appointments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Add each appointment to the todo list
      const todoList = document.getElementById('todo-list');
      todoList.innerHTML = ""
      for (const appointmentId in data) {
        const appointment = data[appointmentId];
        let newAppointment = createAppointmentElement(appointment.title, appointment.description, appointment.due_date, appointment.completed, appointmentId);

        // const newAppointment = document.createElement("li");
        // newAppointment.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        // newAppointment.innerHTML = `Title:${appointment.title}, Desc:${appointment.description}, Completed:${appointment.completed} 
        //       <div>
        //           <button class="btn btn-sm btn-success mr-2" onclick="completeAppointment(${appointmentId})">Complete</button>
        //           <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${appointmentId})">Delete</button>
        //       </div>`;
        todoList.appendChild(newAppointment);
      }
    })
    .catch(error => console.error('Error:', error));
}

// Function to update an appointment
async function completeAppointment(appointmentId, title, description, due_date) {
  const appointment = {
    title: title,
    description: description,
    due_date: due_date,
    completed: true
  };
  // Make the API request to update the appointment
  const response = await fetch(`${apiUrl}/appointments/${appointmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });

  // Parse the response body as JSON
  const responseBody = await response.json();

  loadAppointments();

  // Log the response for debugging purposes
  console.log(responseBody);
}

// Function to delete a appointment
async function deleteAppointment(appointmentId) {
  // Make the API request to delete the appointment
  const response = await fetch(`${apiUrl}/appointments/${appointmentId}`, {
    method: "DELETE",
  });

  // Parse the response body as JSON
  const responseBody = await response.json();

  loadAppointments();

  // Log the response for debugging purposes
  console.log(responseBody);
}

// Load all appointments when the page is loaded
loadAppointments();

window.addEventListener("DOMContentLoaded", (event) => {
  const createAppointmentForm = document.querySelector('#create-appointment-form');
  // Get references to the HTML elements we need
  // const appointmentForm = document.getElementById("appointment-form");
  const appointmentTitleInput = document.getElementById("title");
  const appointmentDescriptionInput = document.getElementById("description");
  const appointmentDueDateInput = document.getElementById("due_date");
  const appointmentList = document.getElementById("appointment-list");

  if (createAppointmentForm) {
    createAppointmentForm.addEventListener("submit", createAppointment);
  }

  if (createAppointmentForm) {
    createAppointmentForm.addEventListener("submit", createAppointment);
  }

  if (createAppointmentForm) {
    createAppointmentForm.addEventListener("submit", createAppointment);
  }

  if (createAppointmentForm) {
    createAppointmentForm.addEventListener("submit", createAppointment);
  }

  // Function to create a new appointment
  async function createAppointment(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    // Build the request body
    const appointment = {
      title: appointmentTitleInput.value,
      description: appointmentDescriptionInput.value,
      due_date: appointmentDueDateInput.value,
      completed: false
    };

    // Make the API request to create the new appointment
    fetch(`${apiUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointment)
    })
      // Parse the response body as JSON
      .then(response => response.json())
      // Add the new appointment to the appointment list
      .then(data => {
        loadAppointments();
        // Clear the form inputs
        appointmentTitleInput.value = "";
        appointmentDescriptionInput.value = "";
        appointmentDueDateInput.value = "";
      })
      .catch(error => console.error('Error:', error));
  }
});

// Function to create new appointment element
function createAppointmentElement(title, description, due_date, completed, id) {
  // Create a new list item
  let listItem = document.createElement('li');
  listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

  // Create the appointment title element
  let appointmentTitle = document.createTextNode(title);

  // Create the appointment description element
  let appointmentDescription = document.createElement('small');
  appointmentDescription.className = 'text-muted ml-2';
  appointmentDescription.innerText = description;

  // Create the appointment due date element
  let appointmentDueDate = document.createElement('small');
  appointmentDueDate.className = 'text-muted ml-2';
  appointmentDueDate.innerText = due_date;

  // Create the complete button element
  let completeButton = document.createElement('button');
  completeButton.className = 'btn btn-sm btn-success mr-2';
  completeButton.innerText = 'Complete';
  completeButton.addEventListener('click', function () {
    completeAppointment(id, title, description, due_date);
  });

  // Create the delete button element
  let deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-sm btn-danger';
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', function () {
    deleteAppointment(id);
  });

  // Add the appointment title, description, due date, complete button, and delete button elements to the list item
  listItem.appendChild(appointmentTitle);
  listItem.appendChild(appointmentDescription);
  listItem.appendChild(appointmentDueDate);
  if (!completed) {
    listItem.appendChild(completeButton);
  }
  listItem.appendChild(deleteButton);
 

  // Return the list item element
  return listItem;
}