function showProductImages(images) {
    const productImages = document.getElementById('product-images');

    let result = "";

    if (!Array.isArray(images)) return;

    for (let i = 0; images.length > i; i++) {
        result += `
        <div class="carousel-item${i == 0 ? " active" : ""}">
            <img src="${images[i]}" class="d-block w-100" alt="product image">
        </div>`;
    }

    productImages.innerHTML = result
}

function showProductData(data) {
    document.getElementById('product-title').innerHTML = data.name;
    document.getElementById('product-price').innerHTML = `${data.currency} ${data.cost}`;
    document.getElementById('product-sold').innerHTML = `${data.soldCount} vendidos`;
    document.getElementById('product-description').innerHTML = data.description;
    document.getElementById('product-category').innerHTML = data.category;
}

function showRelatedProducts(productsId) {
    const relatedProducts = document.querySelector('#related-products>#product-list');
    getJSONData(PRODUCTS_URL).then(resultObj => {
        let result = '';
        for (id in productsId) {
            if (resultObj.data.length <= id || id < 0) continue;

            result += `
            <a href="product-info.html">
                <div class="card">
                    <img src="${resultObj.data[id].imgSrc}" class="card-img-top" alt="${resultObj.data[id].name}">
                    <div class="card-body">
                        <h5 class="card-title">${resultObj.data[id].name}</h5>
                    </div>
                </div>
            </a>`;
        }
        relatedProducts.innerHTML = result;
    });
}

function initializeCommentForm(data) {
    const form = document.querySelector('#comment-form');
    const text = form.querySelector('[name="text"]');
    const rating = form.querySelector('[name="rating"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (localStorage) {
            var comments;

            if (!localStorage['comments']) {
                comments = [];
            } else {
                comments = JSON.parse(localStorage['comments']);
            }

            if (!(comments instanceof Array)) comments = [];

            comments.push({ user: localStorage.username || "anonimous", description: text.value, score: rating.value, dateTime: getDateTime() });

            localStorage.setItem('comments', JSON.stringify(comments));

            text.value = '';
            rating.value = '';
        }
        refreshComments(data);
    });

    refreshComments(data);
}

function showComments(comments) {
    let result = '';
    for (let i = 0; comments.length > i; i++) {
        result += `
        <div class="col-md-12 rounded border p-0 mb-2">
            <div class="border-bottom p-2">
                <span class="user-name">${comments[i].user}</span>
                <span class="star-rating pl-2" data-rating="${comments[i].score}"></span>
                <time class="text-muted float-right">${comments[i].dateTime}</time>
            </div>
            <div class="p-2">${comments[i].description}</div>
        </div>`;
    }
    document.querySelector('#product-comments #comments').innerHTML = result;
}

let refreshComments = (data) => {
    if (!!localStorage['comments']) {
        showComments(data.concat(JSON.parse(localStorage['comments'])));
    } else {
        showComments(data);
    }
    starsRating();
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(resultObj => {
        showProductImages(resultObj.data.images);
        showProductData(resultObj.data);
        showRelatedProducts(resultObj.data.relatedProducts);
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(resultObj => {
        initializeCommentForm(resultObj.data);
    });
});