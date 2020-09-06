function showProductList(dataList) {

    let htmlContentToAppend = "";
    for (let i = 0; i < dataList.length; i++) {
        let product = dataList[i];

        htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name + `</h4>
                            <small class="text-muted">` + product.soldCount + ` artículos</small>
                        </div>
                        <p class="mb-1">` + product.description + `</p>
                        <h4 class="my-3">` + product.currency + ' ' + product.cost + `</h4>
                    </div>
                </div>
            </a>
            `
    }
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
}

const filterConfig = [
    {
        clickId: "sortByPriceUp",
        action: (list) => {
            list.sort({
                key:{
                    name: "cost",
                    type: Number
                },
                mode:ORDER_ASC
            });
        }
    },
    {
        clickId: "sortByPriceDown",
        action: (list) => {
            list.sort({
                key:{
                    name: "cost",
                    type: Number
                },
                mode:ORDER_DESC
            });
        }
    },
    {
        clickId: "sortBySold",
        action: (list) => {
            list.sort({
                key:{
                    name: "soldCount",
                    type: Number
                },
                mode:ORDER_DESC
            });
        }
    },
    {
        clickId: "rangeFilterCount",
        action: (list) => {
            list.reset();
            list.filterNum({
                key: "soldCount",
                filters: [
                    {
                        type: FILTER_NUM_MAX,
                        value: () => document.getElementById('rangeFilterCountMax').value
                    },
                    {
                        type: FILTER_NUM_MIN,
                        value: () => document.getElementById('rangeFilterCountMin').value
                    }
                ]
            });
        }
    },
    {
        clickId: "clearRangeFilter",
        action: (list) => {
            document.getElementById('rangeFilterCountMin').value = "";
            document.getElementById('rangeFilterCountMax').value = "";
            list.reset();
        }
    }
];

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(resultObj => {
        if (resultObj.status === "ok") {
            showProductList(resultObj.data);
            filterComponent(resultObj.data, filterConfig, data => {
                showProductList(data);
            });
            searchComponent(resultObj.data, "searchTextInput", FILTER_STR_START, (data) => {
                showProductList(data);
            });
        }
    });
});