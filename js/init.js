const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

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
  for(let i=0; ratingElements.length > i; i++){
    let rating = ratingElements[i].dataset.rating;
    let result = '<span class="text-warning">&#9733;</span>'.repeat(rating<=5?(rating<0?0:rating):5);
    result += '<span class="text-muted">&#9733;</span>'.repeat(rating<5?(rating<0?5:5-rating):0)
    ratingElements[i].innerHTML = result;
  }
}

let zeroFill = (num,size) => {
  if(isNaN(num))return String(num);
  let strNum = String(num);
  return '0'.repeat(strNum.length<size?(size<0?0:size-strNum.length):0) + strNum;
}

function getDateTime(){
  let today = new Date();
  let date = zeroFill(today.getFullYear(),4)+'-'+zeroFill((today.getMonth()+1),2)+'-'+zeroFill(today.getDate(),2);
  let time = zeroFill(today.getHours(),2) + ":" + zeroFill(today.getMinutes(),2)+ ":" + zeroFill(today.getSeconds(),2);
  return date+' '+time;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
});