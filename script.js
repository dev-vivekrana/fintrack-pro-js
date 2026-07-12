const registerForm = document.querySelector("#register");
const loginForm = document.querySelector("#login");
const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const lsd = localStorage.getItem("registered-users");
// getting the data from the local storage (if any)
let data = JSON.parse(lsd);
// console.log(data);
let usersDatabase = data;
if (!usersDatabase) usersDatabase = [];
// console.log(usersDatabase);
if (registerForm) {
  registerForm.addEventListener("submit", (events) => {
    // to prevent form from reloading
    events.preventDefault();
    let flag = false;
    usersDatabase.some((elem) => {
      if (userName.value.trim() === elem.username) {
        alert("Username already exists! Please choose another.");
        flag = true;
      }
    });
    if (flag) {
      userName.value = "";
      userName.focus();
      flag = false;
      return;
    }
    if (userName.value.trim() == "") {
      alert("Enter the valid username");
      userName.value = "";
      userName.focus();
      return;
    }
    if (password.value.trim() == "") {
      alert("Enter the valid password");
      password.value = "";
      password.focus();
      return;
    }
    const user = {
      username: userName.value.trim(),
      password: password.value.trim(),
    };
    usersDatabase.push(user);
    localStorage.setItem("registered-users", JSON.stringify(usersDatabase));
    console.log(usersDatabase);

    registerForm.reset();
    if (!flag) {
      alert("Registration successful! You can now log in.");
      window.location.href = "login.html";
    }
  });
}
if (loginForm) {
  if (data) {
    loginForm.addEventListener("submit", (events) => {
      events.preventDefault();
      const currUser = data.find((elem) => {
        return elem.username == userName.value.trim();
      });
      console.log(currUser);
      if (
        userName.value.trim() == currUser.username &&
        password.value.trim() == currUser.password
      ) {
        console.log("cred match");
      } else {
        alert("Invalid username or password.");
      }
    });
  } else {
    loginForm.addEventListener("submit", (events) => {
      events.preventDefault();
      alert("New User ? You need to register first .");
      window.location.href = "register.html";
    });
  }
}

// Modal Window

const addTransactionsBtn = document.querySelector(".add-transactions-btn");
const darkMode = document.querySelector(".dark-mode");
const modalWindow = document.querySelector(".modal-container");
const closeModalBtn = document.querySelector(".close-modal");
const modalForm = document.querySelector(".modal-form");
const moneyTypeModal = document.querySelector("#money-type-modal");
const modalDescription = document.querySelector("#description");
const modalAmount = document.querySelector("#modal-amount");
const modalDate = document.querySelector("#modal-date");
const modalCategory = document.querySelector("#modal-category");
const tableBody = document.querySelector("#table-body");
const dateCell = document.querySelector(".date");

function closeModal() {
  modalWindow.classList.add("hidden");
  darkMode.classList.add("hidden");
}
function openModal() {
  modalWindow.classList.remove("hidden");
  darkMode.classList.remove("hidden");
}

// Getting data from local Storage
let id;
let LSDTrasactionsDatabase = localStorage.getItem("transactions");
let transactionsDatabase = JSON.parse(LSDTrasactionsDatabase);
if (!transactionsDatabase) {
  transactionsDatabase = [];
  id = 0;
}
// Modal window open
addTransactionsBtn.addEventListener("click", () => {
  openModal();

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  modalDate.value = formattedDate;
});

//  Modal Window close using button
closeModalBtn.addEventListener("click", () => {
  closeModal();
});

// Modal window close by clicking on body
darkMode.addEventListener("click", () => {
  closeModal();
});

// logic for loading the transactions
if (transactionsDatabase) {
  console.log(transactionsDatabase);

  loadtransactions();
  function loadtransactions() {
    tableBody.innerHTML = "";
    for (value of transactionsDatabase) {
      console.log(value);
      tableBody.innerHTML += `<tr>
                <td class = "date">${value.date}</td>
                <td>${value.description}</td>
                <td id="category-cell">${value.category}</td>
                <td>${value.amount}</td>
                <td><button class="edit-btn actions-btn"><i class="fa-solid fa-pen"></i></button>
              <button class="delete-btn actions-btn"><i class="fa-solid fa-trash"></i></button></td>
              </tr>`;
    }
  }
}

// Logic for  deleting particular transition

// collecting data from modal window while pressing save transactions btn
modalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  closeModal();

  const transaction = {
    date: modalDate.value,
    description: modalDescription.value,
    category: modalCategory.value,
    amount: modalAmount.value,
    id: Date.now(),
  };

  transactionsDatabase.push(transaction);
  // Adding data into local storage transactions database
  localStorage.setItem("transactions", JSON.stringify(transactionsDatabase));
  console.log(transactionsDatabase);
  console.log("hello");
  //   LSDTrasactionsDatabase = localStorage.getItem("transactions");
  //   transactionsDatabase = JSON.parse(LSDTrasactionsDatabase);
  //  console.log(transactionsDatabase);
  //  calling ui
  loadtransactions();
  modalForm.reset();
  console.log(id);
  id += 1;
  console.log(id);
});

// Side Bar

const dashboard = document.querySelector(".dashboard-section");
const settings = document.querySelector(".settings-section");
const dashboardBtn = document.querySelector(".dashboard-btn");
const settingsBtn = document.querySelector(".settings-btn");

dashboardBtn.addEventListener("click", (event) => {
  dashboard.classList.remove("hidden");
  dashboardBtn.classList.add("active");
  settings.classList.add("hidden");
  settingsBtn.classList.remove("active");
});
settingsBtn.addEventListener("click", (event) => {
  settings.classList.remove("hidden");
  settingsBtn.classList.add("active");
  dashboard.classList.add("hidden");
  dashboardBtn.classList.remove("active");
});
