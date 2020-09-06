const ORDER_ASC = 100;
const ORDER_DESC = 101;

const FILTER_NUM_MIN = 200;
const FILTER_NUM_MAX = 201;
const FILTER_STR_START = 202;
const FILTER_STR_INCLUDE = 203;

class JsonList {
    __data = [];
    __filtered = [];

    /**
     * @param {json data} data 
     */
    constructor(data) {
        this.__data = data;
        this.__filtered = data;
    }

    /**
     * @param {key: { name = name of json key, type = Object data type [String, Number]}, mode: [ORDER_ASC, ORDER_DESC]} params 
     */
    sort(params) {
        if (params.mode === ORDER_ASC) {
            this.__filtered = this.__filtered.sort(function (a, b) {
                let aVal = params.key.type(a[params.key.name]);
                let bVal = params.key.type(b[params.key.name]);

                if (aVal < bVal) { return -1; }
                if (aVal > bVal) { return 1; }
                return 0;
            });
        } else if (params.mode === ORDER_DESC) {
            this.__filtered = this.__filtered.sort(function (a, b) {
                let aVal = params.key.type(a[params.key.name]);
                let bVal = params.key.type(b[params.key.name]);

                if (aVal > bVal) { return -1; }
                if (aVal < bVal) { return 1; }
                return 0;
            });
        }
        return this;
    }

    /**
     * @param {key: "name of JSON key", filters: [{ type: "filter type [FILTER_NUM_MIN,FILTER_NUM_MAX]", value: "filter value" }]} params 
     */
    filterNum(params) {
        for (let i = 0; params.filters.length > i; i++) {
            this.__filtered = this.__filtered.filter(elem => {
                const count = parseInt(elem[params.key]);
                const filterValue = typeof params.filters[i].value == "function" ? params.filters[i].value() : params.filters[i].value;
                if (filterValue == 0) return true;
                if (params.filters[i].type === FILTER_NUM_MIN) {
                    return !(count < filterValue);
                } else if (params.filters[i].type === FILTER_NUM_MAX) {
                    return !(count > filterValue);
                }
            });
        }
        return this;
    }

    /**
     * @param {key: name of JSON key, filters: [{ type: filter type [FILTER_STR_START,FILTER_STR_CONTAINS], value: filter value }]} params 
     */
    filterStr(params) {
        for (let i = 0; params.filters.length > i; i++) {
            this.__filtered = this.__filtered.filter(elem => {
                const filterValue = typeof params.filters[i].value == "function" ? params.filters[i].value() : params.filters[i].value;
                if (filterValue == "") return true;
                if (params.filters[i].type === FILTER_STR_START) {
                    return elem[params.key].toLowerCase().startsWith(filterValue.toLowerCase());
                } else if (params.filters[i].type === FILTER_STR_INCLUDE) {
                    return elem[params.key].toLowerCase().includes(filterValue.toLowerCase());
                }
            });
        }
        return this;
    }

    reset() {
        this.__filtered = this.__data;
    }

    getList() {
        return this.__filtered;
    }
}

/**
 * @param {json input} data
 * @param {[{ clickId: "catch an html element by id for click action", action: "what to do when i click" }]} config
 * @param {listener: "trigger event after filtering"} listener
 */
function filterComponent(data, config, listener) {
    if (!data) return;
    if (!config && config.length <= 0) return;

    const listdata = new JsonList(data);

    for (let i = 0; config.length > i; i++) {
        document.getElementById(config[i].clickId).addEventListener('click', (event) => {
            event.preventDefault();
            config[i].action(listdata);
            listener(listdata.getList());
        });
    }
}


/**
 * 
 * @param {JSON data} data 
 * @param {id of HTML input} inputId 
 * @param {FILTER_STR_START || FILTER_STR_INCLUDE} mode 
 * @param {listener} listener 
 */
function searchComponent(data, inputId, mode, listener) {
    const listdata = new JsonList(data);
    document.getElementById(inputId).addEventListener('keyup', () => {
        listdata.reset();
        listdata.filterStr({
            key: "name",
            filters: [
                {
                    type: mode,
                    value: () => document.getElementById(inputId).value
                }
            ]
        });
        listener(listdata.getList());
    });
}