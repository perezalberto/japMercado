const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
//const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

const DOLAR_UYU = 40;

var showSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
    var result = {};
    showSpinner();
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = 'ok';
            result.data = response;
            hideSpinner();
            return result;
        })
        .catch(function (error) {
            result.status = 'error';
            result.data = error;
            hideSpinner();
            return result;
        });
}

/**
 * Función de star rating
 * Busca todos los elementos con la clase "star-rating"
 * e inserta las estrellas correspondientes según dato obtenido de atributo data-rating
 */
let starsRating = () => {
    const ratingElements = document.querySelectorAll('.star-rating');
    for (let i = 0; ratingElements.length > i; i++) {
        let rating = ratingElements[i].dataset.rating;
        let result = '<span class="text-warning">&#9733;</span>'.repeat(rating <= 5 ? (rating < 0 ? 0 : rating) : 5);
        result += '<span class="text-muted">&#9733;</span>'.repeat(rating < 5 ? (rating < 0 ? 5 : 5 - rating) : 0)
        ratingElements[i].innerHTML = result;
    }
}

let zeroFill = (num, size) => {
    if (isNaN(num)) return String(num);
    let strNum = String(num);
    return '0'.repeat(strNum.length < size ? (size < 0 ? 0 : size - strNum.length) : 0) + strNum;
}

function getDateTime() {
    let today = new Date();
    let date = zeroFill(today.getFullYear(), 4) + '-' + zeroFill((today.getMonth() + 1), 2) + '-' + zeroFill(today.getDate(), 2);
    let time = zeroFill(today.getHours(), 2) + ":" + zeroFill(today.getMinutes(), 2) + ":" + zeroFill(today.getSeconds(), 2);
    return date + ' ' + time;
}

function startInputsUpDown() {
    document.addEventListener('click', (e) => {
        if (e.target && e.target.matches('.numericUpDown .btnDown')) {
            const parent = e.target.closest('.numericUpDown').querySelector('.textValue');
            if (parent.innerHTML > 0) parent.innerHTML = parent.innerHTML - 1
        } else if (e.target && e.target.matches('.numericUpDown .btnUp')) {
            const parent = e.target.closest('.numericUpDown').querySelector('.textValue');
            parent.innerHTML = +parent.innerHTML + 1
        }
    });
}

function addProductCart({ image, currency, name, count, price }) {
    let tempList = JSON.parse(localStorage['cart']);
    let newProduct = {
        name: name,
        count: count,
        unitCost: price,
        currency: currency,
        src: image
    }
    tempList.push(newProduct);
    localStorage.setItem('cart', JSON.stringify(tempList));
}

function showAlert(message, type) {
    let alertElement = document.querySelector("#alertResult");

    if (!alertElement) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="alert fade alert-${type}" role="alert" id="alertResult" style="z-index:100">
                <span id="resultSpan">${message}</span>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    } else {
        alertElement.remove();
        showAlert(message, type);
        return;
    }

    alertElement = document.querySelector("#alertResult");

    alertElement.classList.add("show");
    setTimeout(() => {
        alertElement.classList.remove("show");
    }, 2000);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    startInputsUpDown();
});