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


function generateRandomProductInfo(seed = "1245") {
    const random = new Random(seed = seed);
    productIdList = random.unique(0, dataCount - 1, dataCount);
    return productIdList;
}

const generateHourlySeed = () => {
    const currentDate = new Date();
    return result = parseInt(`${currentDate.getFullYear()}${currentDate.getDate()}${currentDate.getDate()}${currentDate.getHours()}`);
}


function handleChange(element, inputFieldId = "search-box") {
    const inputFieldValue = document.getElementById(inputFieldId);
    if (inputFieldValue.value !== undefined) {
        inputFieldValue.value = '';
    }
    const category = element.dataset.category;
    if (category === 'all') {
        categoryTitle.textContent = 'すべて';
        paginator.reset(generateRandomProductInfo(seed = generateHourlySeed()));
    } else {
        const data = product_data[category]
        categoryTitle.textContent = category_data[category]?.display_name || 'エラー';
        var numbers = [];
        for (var row in data) {
            for (var column in data[row]) {
                numbers = numbers.concat(data[row][column]);
            }
        }
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
    if (!currentArray.includes(newEntry)) {
        currentArray.push(newEntry);
        if (currentArray.length > maxEntries) {
            currentArray = currentArray.slice(currentArray.length - maxEntries);
        }
        setArrayInCookie(cookieName, currentArray, maxEntries, days);
    }
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
    const inputField = document.getElementById("search-box");
    if (value == '') {
        categoryTitle.textContent = 'すべて';
        paginator.reset(generateRandomProductInfo(seed = generateHourlySeed()));
        document.querySelector('.tab-bar #tabAll').checked = true;
        return;
    }
    uncheckAll();
    let searchResults = searchByName(flatObjectData, value);
    categoryTitle.textContent = 'search: ' + value + ` (${searchResults.length})`;
    paginator.reset(searchResults);
}
function uncheckAll() {
    const targetElement = document.querySelector('.tab-bar');
    const checkboxes = targetElement.querySelectorAll('input[type="radio"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}


const productList = document.querySelector('.product-list');
const dataCount = Object.keys(flatObjectData).length;

const itemsContainer = document.querySelector('.product-list');

const productManager = new ProductManager(flatObjectData, './img', 'webp', itemsContainer);

const items = generateRandomProductInfo(seed = generateHourlySeed());
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

const categoryTitle = document.querySelector('#mainProducts .category-title');

try {
    const leastData = getArrayFromCookie("least");

    if (leastData.length === 0) {
        const el = document.querySelector('#leastProducts .category-title');
        el.style.display = 'none'
    } else {
        const itemsContainerLeast = document.querySelector('.product-list-l');
        const pageInfoLeast = document.getElementById('page-info-l');
        const topElementLeast = document.getElementById('leastProducts');

        const paginator_least = new Paginator(leastData, 30, itemsContainerLeast, topElementLeast, pageInfoLeast);
    }
    const inputField = document.getElementById("search-box");

    inputField.addEventListener("change", function () {
        search(this.value);
    });
} catch (error) {
    document.cookie = "least=; path=/;";
}



