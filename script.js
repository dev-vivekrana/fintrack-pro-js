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

// getting profile data from local storage
let profile = JSON.parse(localStorage.getItem("profile-settings")) || {
  fullName: "vivek",
  currency: "$",
};
console.log(profile);
//SETTINGS

// Currency
const profileForm = document.querySelector("#profile-details-form");
const profileFullName = document.querySelector("#full-name");
const primaryCurrency = document.querySelector("#primary-currency");
profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
        profile = {
        fullName : profileFullName.value,
        currency : primaryCurrency.value
    };
    localStorage.setItem("profile-settings", JSON.stringify(profile));
    loadtransactions();
    totalIncome();
    alert("Settings saved successfully!");
});



// Modal Window

const addTransactionsBtn = document.querySelector(".add-transactions-btn");
const darkMode = document.querySelector(".dark-mode");
const modalWindow = document.querySelector(".modal-container");
const closeModalBtn = document.querySelector(".close-modal");
const modalForm = document.querySelector(".modal-form");
const modalMoneyType = document.querySelector("#money-type-modal");
const modalDescription = document.querySelector("#description");
const modalAmount = document.querySelector("#modal-amount");
const modalDate = document.querySelector("#modal-date");
const modalCategory = document.querySelector("#modal-category");
const tableBody = document.querySelector("#table-body");
const dateCell = document.querySelector(".date");
const modalTitle = document.querySelector(".modal-title");
const modalBtn = document.querySelector(".save-transaction-btn");
let editingId;
const resetBtn = document.querySelector(".reset-btn");

const totalIncomeValue = document.querySelector("#total-income-value");
const totalExpenseValue = document.querySelector("#total-expense-value");
const currentBalanceValue = document.querySelector("#current-balance-value");
const totalTransactionVlaue = document.querySelector("#total-transaction-value");


function closeModal() {
  modalWindow.classList.add("hidden");
  darkMode.classList.add("hidden");
}
function openModal() {
  modalWindow.classList.remove("hidden");
  darkMode.classList.remove("hidden");
}

// Getting data from local Storage
let LSDTrasactionsDatabase = localStorage.getItem("transactions");
let transactionsDatabase = JSON.parse(LSDTrasactionsDatabase);
if (!transactionsDatabase) {
  transactionsDatabase = [];
}
// Modal window open when clicked add-transaction-btn
addTransactionsBtn.addEventListener("click", () => {
  openModal();
modalTitle.textContent = "Add Transaction"
modalBtn.textContent = "Save Transaction";
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
  totalIncome();
  function loadtransactions() {
    tableBody.innerHTML = "";
    for (value of transactionsDatabase) {
    //   console.log(value);
      tableBody.innerHTML += `<tr>
                <td class = "date">${value.date}</td>
                <td id="description-cell">${value.description}</td>
                <td id="category-cell">${value.category}</td>
                <td class="amount-cell" id=${value.type}>
                ${value.type == "expense" ? "-" : "+"}
                ${fixedFormat(value.amount)}
                </td>
                <td><button class="edit-btn actions-btn" id=${value.id}><i class="fa-solid fa-pen"></i></button>
              <button class="delete-btn actions-btn" id=${value.id}><i class="fa-solid fa-trash"></i></button></td>
              </tr>`;
    }
  }
}

// Logic for  deleting particular transition

tableBody.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    const editBtn = event.target.closest(".edit-btn")
    if(deleteBtn){
        // console.log(deleteBtn.id);
        transactionsDatabase = transactionsDatabase.filter((elem) => {
        //   console.log(elem.id);
          return elem.id != deleteBtn.id;
        });
            console.log(transactionsDatabase);
            loadtransactions();
            totalIncome();
            localStorage.setItem(
              "transactions",
              JSON.stringify(transactionsDatabase),
            );

    }

    // LOGIC FOR EDITING THE TRANSACTION

    if(editBtn){
        modalTitle.textContent = "Edit Transaction";
        modalBtn.textContent = "Update Transaction";
        console.log(editBtn.id);
        editingId = editBtn.id
        const newTransaction = transactionsDatabase.find((elem) => {
            return elem.id == editBtn.id;
        })
        console.log(newTransaction);
        openModal();
        modalMoneyType.value = newTransaction.type
        modalDescription.value = newTransaction.description
        modalAmount.value = newTransaction.amount
        modalDate.value = newTransaction.date
        modalCategory.value = newTransaction.category
}
    });

// function for displaying the current currency and also proper format of the numbers (upto 2 decimal places)
function fixedFormat(value){
  return `${profile.currency}${Number(value).toFixed(2)}`;
}

// LOGIC FOR CURRENT TOTAL INCOME (FUNCTION TO CALCULATE THE TOTAL INCFOME)

function totalIncome(){
    let income = 0;
    let expense = 0;
    let count = 0;
transactionsDatabase.forEach((elem)=>{
    count++;
    // console.log(elem);
    if(elem.type=="income") income = income + Number(elem.amount)
    if(elem.type=="expense") expense = expense + Number(elem.amount);
});
// console.log('income:', income);
totalIncomeValue.textContent = fixedFormat(income);
// console.log('expense:', expense);
totalExpenseValue.textContent = fixedFormat(expense);
currentBalanceValue.textContent = `${income < expense ? "-" : ""}${profile.currency}${Math.abs(income - expense).toFixed(2)}`;
totalTransactionVlaue.textContent =`${count}`
}




// collecting data from modal window while pressing save transactions btn
modalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  closeModal();

  const transaction = {
    type :modalMoneyType.value,
    date: modalDate.value,
    description: modalDescription.value,
    category: modalCategory.value,
    amount: modalAmount.value,
    id: Date.now(),
  };

// EDIT - REPLACE A TRANSACTION
if (editingId) {
  const editTransactionIndex = transactionsDatabase.findIndex((elem) => {
    return elem.id == editingId;
  });
  console.log(editTransactionIndex);
  transactionsDatabase.splice(editTransactionIndex,1,transaction)
  editingId = null;
} else {
  //   ADDING NEW TRANSACTION
  transactionsDatabase.push(transaction);
}

  // Adding data into local storage transactions database
  localStorage.setItem("transactions", JSON.stringify(transactionsDatabase));
  console.log(transactionsDatabase);
  loadtransactions();
  totalIncome();
  modalForm.reset();
});


// RESET BUTTON
resetBtn.addEventListener("click", (event) => {
    transactionsDatabase = [];
    profile = {
      currency: "$",
    };
    localStorage.setItem("profile-settings", JSON.stringify(profile));
    localStorage.setItem("transactions", JSON.stringify(transactionsDatabase));
    loadtransactions();
    totalIncome();
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



