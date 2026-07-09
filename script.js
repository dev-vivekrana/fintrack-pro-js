const registerForm = document.querySelector("#register");
const loginForm = document.querySelector("#login");
const userName = document.querySelector("#username");
const password = document.querySelector("#password");
const lsd = localStorage.getItem("registered-users");
// getting the data from the local storage (if any)
let data = JSON.parse(lsd);
// console.log(data);
let usersDatabase = data;
if(!usersDatabase) usersDatabase = [];
// console.log(usersDatabase);
if(registerForm){
    registerForm.addEventListener("submit",(events)=>{
    // to prevent form from reloading 
    events.preventDefault();
    let flag = false;
    usersDatabase.some((elem)=>{
        if(userName.value.trim() === elem.username){
            alert("Username already exists! Please choose another.")
            flag = true;
        }
    })
    if(flag){
        userName.value = "";
        userName.focus();
        flag = false;
        return;
    }
    if(userName.value.trim() == ""){
        alert("Enter the valid username");
        userName.value = "";
        userName.focus();
        return;
    }
    if(password.value.trim() == ""){
        alert("Enter the valid password");
        password.value = "";
        password.focus();
        return;
    }
    const user = {
        username : userName.value.trim(),
        password : password.value.trim()
    };
    usersDatabase.push(user)
    localStorage.setItem("registered-users",JSON.stringify(usersDatabase));
    console.log(usersDatabase);
    
    registerForm.reset();
    if(!flag){
        alert("Registration successful! You can now log in.")
        window.location.href = "login.html"
    }
})
}
if(loginForm){
    if(data){
        loginForm.addEventListener("submit",(events)=>{
        events.preventDefault();
        const currUser = data.find((elem)=>{
            return elem.username == userName.value.trim();
        })
        console.log(currUser); 
            if(userName.value.trim()==currUser.username && password.value.trim() == currUser.password ){
            console.log("cred match")
        }
        else{
            alert("Invalid username or password.");
        }       
    })
    }
    else{
        loginForm.addEventListener("submit",(events)=>{
        events.preventDefault();
        alert("New User ? You need to register first .")
        window.location.href = "register.html";
    })
    }
}
