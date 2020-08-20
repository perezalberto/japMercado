//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    if(localStorage.username && localStorage.password) {
        window.location.href = "index.html"
    }

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const msgError = document.getElementById("msg-error");

    const login = () => {
        localStorage.username = usernameInput.value;
        localStorage.password = passwordInput.value;
    }

    document.addEventListener("submit", (event) => {
        event.preventDefault();
        if(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(usernameInput.value)){
            if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordInput.value)){
                login();
                window.location.replace("index.html");
            }else{
                msgError.innerHTML = "Contraseña no válida: Mínimo ocho caracteres, al menos una letra y un número";
                msgError.style.display = "block";
            }
        }else{
            msgError.innerHTML = "Nombre de usuario no válido: solo números, letras y guiones. No puede comenzar ni terminar con guiones";
            msgError.style.display = "block";
        }
    });

    document.getElementById('password').addEventListener('change',(event) => {
        msgError.style.display = "none";
    });
});