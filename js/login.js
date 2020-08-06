//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    const rmCheck = document.getElementById("rememberMe");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");

    if (localStorage.checkbox && localStorage.checkbox !== "") {
        rmCheck.setAttribute("checked", "checked");
        emailInput.value = localStorage.username;
        passInput.value = localStorage.password;
    } else {
        rmCheck.removeAttribute("checked");
        emailInput.value = "";
        passInput.value = "";
    }

    const rememberMe = () => {
        if (rmCheck.checked && emailInput.value !== "") {
            localStorage.username = emailInput.value;
            localStorage.password = passInput.value;
            localStorage.checkbox = rmCheck.value;
        } else {
            localStorage.username = "";
            localStorage.password = "";
            localStorage.checkbox = "";
        }
    }

    document.addEventListener("submit", (event) => {
        rememberMe();
        window.location.replace("/home.html");
    });
});