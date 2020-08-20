document.addEventListener("DOMContentLoaded", function (e) {
    const username = localStorage.username;
    const password = localStorage.password;
    if(!(username && password)) {
        window.location.href = "login.html"
    }else{
        document.getElementById('username').innerHTML = username;
    }
    document.getElementById('logout').addEventListener('click',(event) => {
        event.preventDefault();
        localStorage.username = '';
        localStorage.password = '';
        window.location.href = "login.html"
    })
});