const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT_UP = "CantUp";
const ORDER_BY_PROD_COUNT_DOWN = "CantDown";

function sortList(propCount, criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT_UP) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a[propCount]);
            let bCount = parseInt(b[propCount]);

            if (aCount < bCount) { return -1; }
            if (aCount > bCount) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT_DOWN) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a[propCount]);
            let bCount = parseInt(b[propCount]);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// filter component
function filterComponent(propCount,data,listener) {

    var minCount = undefined;
    var maxCount = undefined;

    document.getElementById("sortAsc").addEventListener("click", function () {
        listener(sortList(propCount,ORDER_ASC_BY_NAME,data));
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        listener(sortList(propCount,ORDER_DESC_BY_NAME,data));
    });

    document.getElementById("sortByCountUp").addEventListener("click", function () {
        listener(sortList(propCount,ORDER_BY_PROD_COUNT_UP,data));
    });

    document.getElementById("sortByCountDown").addEventListener("click", function () {
        listener(sortList(propCount,ORDER_BY_PROD_COUNT_DOWN,data));
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        listener(data);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        listener(data.filter(elem => {
            const count = parseInt(elem.productCount || elem.soldCount);
            return !(count < minCount || count > maxCount);
        }));
    });
}