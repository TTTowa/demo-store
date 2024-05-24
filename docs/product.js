function getUrlParams(url) {
    const params = {};
    const urlParams = new URLSearchParams(url.split('?')[1]);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

// Get URL parameters
const url = window.location.href;
const params = getUrlParams(url);

const productImageElement = document.getElementById('product-image');

// Generate product page based on parameters
const productDetailsDiv = document.getElementById("product-details");
const productId = params["id"];
const productData = flatObjectData[productId] || null;
const name = document.getElementById('product-name');
const price = document.getElementById('product-price');
const star = document.querySelector('.star');
const category = document.getElementById('category');
productImageElement.src = `./img/min/${productData.category}-${productData.subcategory}-${productId}min.webp`;
name.textContent = productData.name;
price.textContent = `¥${productData.price}`;
star.style.setProperty("--star", productData.star);
const categoryInfo = category_data[productData.category];
const categoryDisplayName = categoryInfo.display_name;
const subcategoryDisplayName = categoryInfo.sub[productData.subcategory];
category.textContent = `${categoryDisplayName} > ${subcategoryDisplayName}`;
function setCookie(name, value, days) {
let expires = "";
if (days) {
let date = new Date();
date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
expires = "; expires=" + date.toUTCString();
}
document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
let nameEQ = name + "=";
let ca = document.cookie.split(';');
for(let i = 0; i < ca.length; i++) {
let c = ca[i];
while (c.charAt(0) === ' ') c = c.substring(1, c.length);
if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
}
return null;
}

function setArrayInCookie(cookieName, array, maxEntries, days) {
if (array.length > maxEntries) {
array = array.slice(array.length - maxEntries);
}
let arrayString = JSON.stringify(array);
setCookie(cookieName, arrayString, days);
}

function getArrayFromCookie(cookieName) {
let cookieValue = getCookie(cookieName);
return cookieValue ? JSON.parse(cookieValue) : [];
}

function pushToArrayInCookieNoDuplicates(cookieName, newEntry, maxEntries, days) {
let currentArray = getArrayFromCookie(cookieName);
if (!currentArray.includes(newEntry)) {
currentArray.unshift(newEntry);
if (currentArray.length > maxEntries) {
    currentArray = currentArray.slice(currentArray.length - maxEntries);
}
setArrayInCookie(cookieName, currentArray, maxEntries, days);
}
}

pushToArrayInCookieNoDuplicates("least", `${productId}`, 5, 7); // "newEntry"を追加（重複なし）、最大5エントリ、7日間有効

let retrievedArray = getArrayFromCookie("least");