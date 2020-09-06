function showCategoriesList(data) {

    let htmlContentToAppend = "";
    for (let i = 0; i < data.length; i++) {
        let category = data[i];

        htmlContentToAppend += `
            <a href="category-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ category.name + `</h4>
                            <small class="text-muted">` + category.productCount + ` artículos</small>
                        </div>
                        <p class="mb-1">` + category.description + `</p>
                    </div>
                </div>
            </a>
            `
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}


const filterConfig = [
    {
        clickId: "sortByCountUp",
        action: (list) => {
            list.sort({
                key:{
                    name: "productCount",
                    type: Number
                },
                mode:ORDER_ASC
            });
        }
    },
    {
        clickId: "sortByCountDown",
        action: (list) => {
            list.sort({
                key:{
                    name: "productCount",
                    type: Number
                },
                mode:ORDER_DESC
            });
        }
    },
    {
        clickId: "sortDesc",
        action: (list) => {
            list.sort({
                key:{
                    name: "name",
                    type: String
                },
                mode:ORDER_DESC
            });
        }
    },
    {
        clickId: "sortAsc",
        action: (list) => {
            list.sort({
                key:{
                    name: "name",
                    type: String
                },
                mode:ORDER_ASC
            });
        }
    },
    {
        clickId: "rangeFilterCount",
        action: (list) => {
            list.reset();
            list.filterNum({
                key: "productCount",
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
    getJSONData(CATEGORIES_URL).then(resultObj => {
        if (resultObj.status === "ok") {
            showCategoriesList(resultObj.data);
            filterComponent(resultObj.data, filterConfig, data => {
                showCategoriesList(data);
            });
        }
    });
});