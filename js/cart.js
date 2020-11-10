function showCartList(data) {
    let htmlContentToAppend = "";
    for (let i = 0; i < data.length; i++) {
        let product = data[i];
        let unitCostUYU = product.currency == 'USD' ? product.unitCost * DOLAR_UYU : product.unitCost;

        htmlContentToAppend += `
        <div id="product:${i}" class="list-group-item list-group-item-action cart-item">
            <div class="row justify-content-center align-items-center">
                <div class="col-12 col-lg">
                    <img src="${product.src}" alt="${product.name}" class="img-thumbnail w-100 w-lg-auto">
                </div>
                <div class="col-12 col-lg p-4">
                <b>${product.name}</b>
                </div>
                <div class="col-lg-3 col-12">
                    <div class="d-flex">
                        <div class="col pr-1 pl-3">
                            <div class="input-group numericUpDown" style="min-width:100px">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary btnDown" type="button">-</button>
                                </div>
                                <span class="form-control text-right bg-transparent border-secondary textValue">${product.count}</span>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary btnUp" type="button">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="pr-3 pl-1">
                            <button class="btn btn-outline-danger remove-product d-block" type="button">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="unit-price col-6 col-lg p-4 text-center">
                    <b class="d-block d-lg-none">Precio unitario</b>
                    <span class="currency">UYU</span>
                    <span class="price">${unitCostUYU}</span>
                    <span class="d-none d-lg-inline">/u</span>
                </div>
                <div class="subtotal col-6 col-lg p-4 text-center">
                    <b class="d-block d-lg-none">Total</b>
                    <span class="currency">UYU</span>
                    <span class="price">${unitCostUYU * product.count}</span>
                </div>
            </div>
        </div>
        `;
    }
    document.querySelector("#product-list").innerHTML = htmlContentToAppend;
}

function removeProductCart(id) {
    let tempList = JSON.parse(localStorage['cart']);
    tempList.splice(id, 1);
    localStorage.setItem('cart', JSON.stringify(tempList));
}

function updateProductCart(id, { image, currency, name, count, price }) {
    let tempList = JSON.parse(localStorage['cart']);
    if (!tempList[id]) return;
    let newProduct = {
        name: name || tempList[id].name,
        count: count || tempList[id].count,
        unitCost: price || tempList[id].unitCost,
        currency: currency || tempList[id].currency,
        src: image || tempList[id].src
    }
    tempList[id] = newProduct;
    localStorage.setItem('cart', JSON.stringify(tempList));
}

function initRemoveButtons() {
    document.addEventListener('click', (e) => {
        if (e.target && e.target.matches('div.cart-item .remove-product, div.cart-item .remove-product *')) {
            const productItemElement = e.target.closest("div.cart-item");
            productItemElement.remove();

            const productId = productItemElement.id.split(':')[1];
            removeProductCart(productId);
        }
    });
}

function initProductRow(listener) {
    document.addEventListener('click', (e) => {
        if (!e.target) return;
        if (e.target.matches('div.cart-item .remove-product, div.cart-item .remove-product *') ||
            e.target.matches('div.cart-item .numericUpDown .btnDown, div.cart-item .numericUpDown .btnUp')) {
            listener(e.target.closest("div.cart-item"));
        }
    });
}

function updateProductRow(target) {
    const unitPrice = target.querySelector('.unit-price .price');
    const subtotal = target.querySelector('.subtotal .price');
    const count = target.querySelector('.numericUpDown .textValue');

    const productId = target.id.split(':')[1];

    updateProductCart(productId, { count: count.innerHTML });
    subtotal.innerHTML = unitPrice.innerHTML * count.innerHTML;
}

function updateProductCount() {
    const productCount = document.getElementById('product-count');
    const productList = document.querySelectorAll('#product-list div.cart-item');
    productCount.innerHTML = productList.length;
}

function updateTotal() {
    let sum = 0;
    const subtotal = document.querySelector('#costs #subtotal');
    const shippingCost = document.querySelector('#costs #shippingCost');
    const total = document.querySelector('#costs #total');

    const productList = document.querySelectorAll('#product-list div.cart-item');
    productList.forEach((item) => {
        sum += +item.querySelector(".subtotal .price").innerHTML || 0
    });


    const getShippingType = () => {
        var type = document.getElementsByName('shippingType');
        for (var i = 0; i < type.length; i++) {
            if (type[i].checked) {
                return type[i].value;
            }
        }
    };

    const updateCosts = () => {
        switch (getShippingType()) {
            case 'premium':
                shippingCost.innerHTML = "UYU" + (sum * 0.15).toFixed(2);
                total.innerHTML = "UYU " + (sum + sum * 0.15).toFixed(2);
                break;
            case 'express':
                shippingCost.innerHTML = "UYU" + (sum * 0.07).toFixed(2);
                total.innerHTML = "UYU " + (sum + sum * 0.07).toFixed(2);
                break;
            case 'standard':
                shippingCost.innerHTML = "UYU" + (sum * 0.05).toFixed(2);
                total.innerHTML = "UYU " + (sum + sum * 0.05).toFixed(2);
                break;
        }
    }
    updateCosts()
    document.querySelector('#shippingType #premium').addEventListener('change', updateCosts);
    document.querySelector('#shippingType #express').addEventListener('change', updateCosts);
    document.querySelector('#shippingType #standard').addEventListener('change', updateCosts);

    subtotal.innerHTML = "UYU " + sum.toFixed(2);
}

/**
 * Obtiene los datos desde el localstorage, en caso de no existir se buscaran desde una ubicación externa,
 * 
 */
function getCartData() {
    return new Promise((resolve, reject) => {
        if (!!localStorage['cart']) {
            resolve(JSON.parse(localStorage['cart']));
        } else {
            getJSONData(CART_INFO_URL).then(resultObj => {
                if (resultObj.status === "ok") {
                    localStorage.setItem('cart', JSON.stringify(resultObj.data.articles));
                    resolve(resultObj.data.articles);
                }
            });
        }
    });
}

/**
 * Inicializa eventos encargados del funcionamiento del formulario de método de pago
 */
function initPaymentMethodModalForm() {
    const modalForm = document.querySelector("#paymentMethodForm");
    const radioBtnCreditCardMode = modalForm.querySelector("#creditCardMode");
    const radioBtnBankTransferMode = modalForm.querySelector("#bankTransferMode");

    const activeCreditCardMode = (active) => {
        const cardNumber = modalForm.querySelector("#cardNumber");
        const cardSecurityCode = modalForm.querySelector("#cardSecurityCode");
        const expirationDate = modalForm.querySelector("#expirationDate");
        if (!!active) {
            cardNumber.removeAttribute("disabled");
            cardSecurityCode.removeAttribute("disabled");
            expirationDate.removeAttribute("disabled");
        } else {
            cardNumber.setAttribute("disabled", "");
            cardSecurityCode.setAttribute("disabled", "");
            expirationDate.setAttribute("disabled", "");
        }
    }

    const activeBankTransferMode = (active) => {
        const bankAccountNumber = modalForm.querySelector("#bankAccountNumber");

        if (!!active) {
            bankAccountNumber.setAttribute("required", "");
            bankAccountNumber.removeAttribute("disabled");
        } else {
            bankAccountNumber.removeAttribute("required");
            bankAccountNumber.setAttribute("disabled", "");
        }
    }

    const updateFormState = () => {
        if (radioBtnCreditCardMode.checked) {
            activeCreditCardMode(true);
            activeBankTransferMode(false);
        } else if (radioBtnBankTransferMode.checked) {
            activeCreditCardMode(false);
            activeBankTransferMode(true);
        }
    }
    updateFormState();
    radioBtnCreditCardMode.addEventListener('change', updateFormState);
    radioBtnBankTransferMode.addEventListener('change', updateFormState);
}

/**
 * inicializa evento submit del formulario del método de pago
 */
function initPaymentMethod() {
    const modalForm = document.querySelector("#paymentMethodForm");
    const radioBtnCreditCardMode = modalForm.querySelector("#creditCardMode");
    const radioBtnBankTransferMode = modalForm.querySelector("#bankTransferMode");
    document.getElementById("paymentMethodForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const paymentMethodValue = document.getElementById("paymentMethod");
        const paymentMethodMessage = document.getElementById("paymentMethodMessage");
        if (radioBtnCreditCardMode.checked) {
            paymentMethodValue.innerHTML = "Tarjeta de crédito";
            paymentMethodValue.setAttribute("data-paymentmethod", "card");
            paymentMethodMessage.classList.add("d-none");
        } else if (radioBtnBankTransferMode.checked) {
            paymentMethodValue.innerHTML = "Transferencia bancaria";
            paymentMethodValue.setAttribute("data-paymentmethod", "transfer");
            paymentMethodMessage.classList.add("d-none");
        }
        $("#modalPaymentMethod").modal('hide');
    });
}


/**
 * Inicializa eventos relacionados el formulario del carrito
 */
function initCartForm() {
    const cartForm = document.getElementById("cartForm");

    const paymentMethodValue = document.getElementById("paymentMethod");
    const paymentMethodMessage = document.getElementById("paymentMethodMessage");

    cartForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = paymentMethodValue.getAttribute("data-paymentmethod");
        if (!value) {
            paymentMethodMessage.classList.remove("d-none");
        } else {
            showAlert("Compra realizada con éxito", "success");
        }
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    //--------------------------------------------------------------------------//

    function consoleWithNoSource(...params) {
        setTimeout(console.log.bind(console, ...params));
    }
    consoleWithNoSource("%cPara reiniciar el listado de productos utilizar el comando:", "background:#FFEB3B;padding:1rem;border-radius:6px");
    consoleWithNoSource("%c►%clocalStorage.setItem('cart',[]);", "color:#FFA000;padding:0.4rem;", "padding:0.4rem");

    //--------------------------------------------------------------------------//

    getCartData().then(data => {
        showCartList(data);
        initRemoveButtons();
        updateProductCount();
        updateTotal();

        initProductRow((target) => {
            updateProductRow(target);
            updateProductCount();
            updateTotal();
        });
    });
    initCartForm();
    initPaymentMethod();
    initPaymentMethodModalForm();
});