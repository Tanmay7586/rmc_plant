const { ipcRenderer } = require("electron");

const form = document.getElementById("truck-form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission

  const materialType = document.getElementById("material-type").value;
  const quantity = document.getElementById("quantity").value;
  const truckNumber = document.getElementById("truck-number").value;
  const driverName = document.getElementById("driver-name").value;
  const notes = document.getElementById("notes").value;

  // Create an object to hold the form data
  const truckData = {
    materialType,
    quantity,
    truckNumber,
    driverName,
    notes,
  };

  // Send the data to the main process to insert into the database
  ipcRenderer.send("insert-truck-data", truckData);

  // Reset the form
  form.reset();
});

// Event listener for the "Print" button
document.getElementById("print-button").addEventListener("click", () => {
  window.print();
});

// Event listener for the "Export CSV" button
document.getElementById("export-csv").addEventListener("click", () => {
  const materialType = document.getElementById("material-type").value;
  const quantity = document.getElementById("quantity").value;
  const truckNumber = document.getElementById("truck-number").value;
  const driverName = document.getElementById("driver-name").value;
  const notes = document.getElementById("notes").value;

  // Gather extra fields data
  let extraFields = "";
  const extraInputs = document.querySelectorAll(
    "#extra-fields-container input"
  );
  extraInputs.forEach((input) => {
    extraFields += `,${input.value}`;
  });

  // Create CSV data
  const csvContent = `Material Type,Quantity,Truck Number,Driver Name,Notes${
    extraFields ? "," + extraInputs.length + " Extra Fields" : ""
  }\n${materialType},${quantity},${truckNumber},${driverName},${notes}${extraFields}`;

  // Create a downloadable link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "truck-data.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
});

let extraFieldCount = 0;

// Event listener for adding extra fields
document.getElementById("add-field").addEventListener("click", () => {
  extraFieldCount++;

  const extraFieldContainer = document.getElementById("extra-fields-container");
  const div = document.createElement("div");
  div.classList.add("extra-field");
  div.id = `extra-field-${extraFieldCount}`;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Extra Field ${extraFieldCount}`;
  input.name = `extra-field-${extraFieldCount}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    div.remove(); // Remove this field
  });

  div.appendChild(input);
  div.appendChild(removeButton);
  extraFieldContainer.appendChild(div);
});

// Event listener for the "Print" button
document.getElementById("print-button").addEventListener("click", () => {
  window.print();
});

// Event listener for the "Export CSV" button
document.getElementById("export-csv").addEventListener("click", () => {
  // CSV export logic...
});

// Logout button functionality
document.getElementById("logout-button").addEventListener("click", () => {
  // Redirect to login.html
  window.location.href = "login.html";
});
