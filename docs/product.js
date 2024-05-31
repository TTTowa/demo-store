function getUrlParams(url) {
    const params = {};
    const urlParams = new URLSearchParams(url.split('?')[1]);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

function getProductDataFromURL(url) {
    const params = getUrlParams(url);

    const productId = params["id"];
    const productData = flatObjectData[productId] || null;
    const categoryInfo = category_data[productData.category];
    
    return {
        category: productData.category,
        subcategory: productData.subcategory,
        productId: productId,
        productImageSrc: `./img/min/${productData.category}-${productData.subcategory}-${productId}min.webp`,
        productName: productData.name,
        productPrice: `¥${productData.price}`,
        starStyle: `--star: ${productData.star}`,
        categoryDisplayName: `${categoryInfo.display_name} > ${categoryInfo.sub[productData.subcategory]}`
    };
}
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
    for (let i = 0; i < ca.length; i++) {
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
    let index = currentArray.indexOf(newEntry);
    if (index > -1) {
        currentArray.splice(index, 1);
    }

    currentArray.unshift(newEntry);

    if (currentArray.length > maxEntries) {
        currentArray = currentArray.slice(currentArray.length - maxEntries);
    }
    setArrayInCookie(cookieName, currentArray, maxEntries, days);
}

const url = window.location.href;
const productData = getProductDataFromURL(url);
const category = productData.category;
const subcategory = productData.subcategory;
const productId = productData.productId;

const productImageElement = document.getElementById('product-image');
const skeletonLoader = document.getElementsByClassName('skeleton-loader')[0];
const productDetailsDiv = document.getElementById("product-details");
const names = document.getElementById('product-name');
const price = document.getElementById('product-price');
const star = document.querySelector('.star');
const categoryElement = document.getElementById('category');

const relatedTitle = document.querySelector('.category-title.related');

productImageElement.onload = (function (loader, img) {
    return function () {
        loader.style.display = "none";
        img.style.display = "block";
    };
})(skeletonLoader, productImageElement);

try {
    document.title = productData.productName;
} catch (error) {
}

productImageElement.src = productData.productImageSrc;
names.textContent = productData.productName;
price.textContent = productData.productPrice;
star.style.setProperty("starStyle", productData.starStyle);
categoryElement.textContent = productData.categoryDisplayName;
relatedTitle.textContent = `(${productData.categoryDisplayName}) の関連商品`;

try {
    pushToArrayInCookieNoDuplicates("least", `${productId}`, 30, 7);
} catch (error) {
    document.cookie = "least=; path=/;";
}


const relatedCategory = {...product_data[category]};
const relatedSubCategory = [...relatedCategory[subcategory]];
relatedSubCategory.splice(relatedSubCategory.indexOf(parseInt(productId)), 1);
delete relatedCategory[subcategory];

const relatedItems = [...relatedSubCategory, ...Object.values(relatedCategory).flat()];


const productList = document.querySelector('.product-list');
const dataCount = Object.keys(flatObjectData).length;


const productManager = new ProductManager(flatObjectData, './img', 'webp', productList);

const pageInfo = document.getElementById('page-info');
const paginator = new Paginator(relatedItems, 12, productList, relatedTitle, pageInfo);

const cart = new Cart();
const quantity = document.getElementById('quantity');
function cartAddItem() {
    cart.addItem(productId, parseInt(quantity.value));
}