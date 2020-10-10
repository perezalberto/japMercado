function showCartList(data) {
    let htmlContentToAppend = "";
    for (let i = 0; i < data.length; i++) {
        let product = data[i];
        let unitCostUYU = product.currency == 'USD' ? product.unitCost * DOLAR_UYU : product.unitCost;

        htmlContentToAppend += `
            <tr id="cart-item:${i}">
                <td class="align-middle">
                    <img src="${product.src}" alt="${product.name}" class="img-fluid" width="100">
                </td>
                <td class="align-middle">${product.name}</td>
                <td class="align-middle text-center">
                    <div class="input-group numericUpDown">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary btnDown" type="button">-</button>
                        </div>
                        <span class="form-control text-right textValue">${product.count}</span>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary btnUp" type="button">+</button>
                        </div>
                    </div>
                </td>
                <td class="align-middle text-center unit-price">
                    <span class="currency">UYU</span>
                    <span class="price">${unitCostUYU}</span>
                </td>
                <td class="align-middle text-center subtotal">
                    <span class="currency">UYU</span>
                    <span class="price">${unitCostUYU * product.count}</span>
                </td>
                <td class="align-middle text-center">
                    <button class="btn btn-outline-danger remove-product" type="button">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
            `
    }
    document.querySelector("#product-list tbody").innerHTML = htmlContentToAppend;
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

function startRemoveButtons() {
    document.addEventListener('click', (e) => {
        if (e.target && e.target.matches('tr .remove-product, tr .remove-product *')) {
            e.target.closest("tr").remove();

            const productId = e.target.closest("tr").id.split(':')[1];

            removeProductCart(productId);
        }
    });
}

function startProductRow(listener) {
    document.addEventListener('click', (e) => {
        if (!e.target) return;
        if (e.target.matches('tr .remove-product, tr .remove-product *') || e.target.matches('tr .numericUpDown .btnDown, tr .numericUpDown .btnUp')) {
            listener(e.target.closest("tr"));
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
    const productList = document.querySelectorAll('table#product-list tbody>tr');
    productCount.innerHTML = productList.length;
}

function updateTotal() {
    let sum = 0;
    const total = document.getElementById('total');
    const productList = document.querySelectorAll('table#product-list tbody>tr');
    productList.forEach((item) => {
        sum += +item.querySelector(".subtotal .price").innerHTML || 0
    });
    total.innerHTML = sum;
}

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

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getCartData().then(data => {
        showCartList(data);

        startRemoveButtons();
        updateProductCount();
        updateTotal();

        startProductRow((target) => {
            updateProductRow(target);
            updateProductCount();
            updateTotal();
        });
    });
});