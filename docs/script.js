class Random {
    constructor(seed = 49849484) {
        this.x = 494948154;
        this.y = 789216655;
        this.z = 418941848;
        this.w = seed;
    }

    next() {
        let t;

        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }

    nextInt(min, max) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
    unique(min, max, count) {
        const range = max - min + 1;
        if (count > range) {
            throw new Error('Count exceeds the number of unique values in the range');
        }
        const numbers = Array.from({ length: range }, (_, i) => min + i);

        for (let i = numbers.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        return numbers.slice(0, count);
    }
}

class Paginator {
    constructor(totalItems, itemsPerPage, itemsContainer, topElement, pageInfo, mediaDir='./img/min', mediaExt='webp') {
        this.totalItems = totalItems;
        this.totalItemsLength = totalItems.length;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.itemsContainer = itemsContainer;
        this.topElement = topElement;
        this.pageInfo = pageInfo;
        this.productManager = new ProductManager(flatObjectData, mediaDir, mediaExt, itemsContainer);

    }

    reset(totalItems) {
        this.totalItems = totalItems;
        this.totalItemsLength = totalItems.length;
        this.currentPage = 1;
        this.updatePage();
    }

    getTotalPages() {
        return Math.ceil(this.totalItemsLength / this.itemsPerPage);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    nextPage() {
        const newPageNumber = this.currentPage + 1;
        this.goToPage(newPageNumber);
    }
    
    previousPage() {
        const newPageNumber = this.currentPage - 1;
        this.goToPage(newPageNumber);
    }

    goToPage(page) {
        if (page >= 1 && page <= this.getTotalPages()) {
            this.currentPage = page;
        }
        this.updatePage();
    }

    getPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.totalItems.slice(start, end);
    }


    renderItems(items) {
        this.itemsContainer.innerHTML = '';
        this.productManager.addProducts(items);
    };

    renderPageInfo() {
        this.pageInfo.textContent = `Page ${this.getCurrentPage()} of ${this.getTotalPages()}`;
    };

    updatePage() {
        this.scrollToProductsSection();
        const pageItems = this.getPageItems();
        this.renderItems(pageItems);
        this.renderPageInfo();
    };
    scrollToProductsSection() {
            this.topElement.scrollIntoView({ behavior: 'smooth' });
    }
}


class ProductManager {
    constructor(productData, mediaDir, mediaExt, itemsContainer) {
        this.productData = productData;
        this.mediaDir = mediaDir;
        this.mediaExt = mediaExt;
        this.itemsContainer = itemsContainer;

    }

    addListProduct(id, container=this.itemsContainer) {
        const productData = this.productData[`${id}`] || null;
        if (productData === null) {
            return;
        }

        const product = document.createElement('div');
        product.classList.add('product');

        const img = document.createElement('img');
        img.src = `${this.mediaDir}/${productData.category}-${productData.subcategory}-${id}min.${this.mediaExt}`;
        img.alt = productData.name;

        const category = document.createElement('div');
        category.classList.add('category-text');
        const categoryInfo = category_data[productData.category];
        const categoryDisplayName = categoryInfo?.display_name;
        const subcategoryDisplayName = categoryInfo?.sub[productData.subcategory];
        category.textContent = `${categoryDisplayName} > ${subcategoryDisplayName}`;



        const star = document.createElement('div');
        star.classList.add('star');
        star.style.setProperty("--star", productData.star);

        const h3 = document.createElement('h3');
        h3.textContent = productData.name;

        const p = document.createElement('p');
        p.textContent = `¥${productData.price}`;

        const link = document.createElement('a');
        link.classList.add('pagelink');
        link.href = `./product.html?&id=${id}`;

        product.appendChild(img);
        product.appendChild(h3);
        product.appendChild(star);
        product.appendChild(category);
        product.appendChild(p);
        product.appendChild(link);

        container.appendChild(product);
    }

    addProducts(productsToAdd, container=this.itemsContainer) {
        productsToAdd.forEach((id) => {
            this.addListProduct(id, container=this.itemsContainer);
        });
    }
}

const productList = document.querySelector('.product-list');
const dataCount = Object.keys(flatObjectData).length;

const itemsContainer = document.querySelector('.product-list');


const productManager = new ProductManager(flatObjectData, './img', 'webp', itemsContainer);


function generateRandomProductInfo(seed="1245") {
    const random = new Random(seed = seed);
    productIdList = random.unique(0, dataCount-1, dataCount);
    return productIdList;
}

const generateHourlySeed = () => {
    const currentDate = new Date();
    return result = parseInt(`${currentDate.getFullYear()}${currentDate.getDate()}${currentDate.getDate()}${currentDate.getHours()}`);
}

const items = generateRandomProductInfo(seed=generateHourlySeed());
const pageInfo = document.getElementById('page-info');
const topElement = document.getElementById('mainProducts');
const paginator = new Paginator(items, 12, itemsContainer, topElement, pageInfo);
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
paginator.updatePage();

const categoryTitle = document.querySelector('#mainProducts #category-title');


function handleChange(element){
    const category = element.dataset.category;
    if (category === 'all') {
        paginator.reset(generateRandomProductInfo(seed=generateHourlySeed()));
    } else {
        const data = product_data[category]
        categoryTitle.textContent = category_data[category]?.display_name || 'エラー';
        var numbers = [];
        for (var row in data) {
            for (var column in data[row]) {
                numbers = numbers.concat(data[row][column]);
            }
        }
        console.log(numbers);
        paginator.reset(numbers);
    }
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
        currentArray.push(newEntry);
        if (currentArray.length > maxEntries) {
            currentArray = currentArray.slice(currentArray.length - maxEntries);
        }
        setArrayInCookie(cookieName, currentArray, maxEntries, days);
    }
}
const leastData = getArrayFromCookie("least");

if (leastData.length === 0) {
    const el = document.querySelector('#leastProducts #category-title');
    el.style.display = 'none'
} else {
    const itemsContainerLeast = document.querySelector('.product-list-l');
    const pageInfoLeast = document.getElementById('page-info-l');
    const topElementLeast = document.getElementById('leastProducts');
  
    const paginator_least = new Paginator(leastData, 3, itemsContainerLeast, topElementLeast, pageInfoLeast);
    paginator_least.updatePage();
}
function searchByName(data, searchString) {
    searchString = searchString.toLowerCase();
    let results = [];
    for (let key in data) {
        if (data[key].name.toLowerCase().includes(searchString)) {
            results.push(key);
        }
    }
    return results;
}
function search(value) {
    if (value === '') {
        return;
    }
    let searchResults = searchByName(flatObjectData, value);
    categoryTitle.textContent = 'search: '+value;
    paginator.reset(searchResults);
}