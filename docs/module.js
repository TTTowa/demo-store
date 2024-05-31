class Paginator {
    constructor(totalItems, itemsPerPage, itemsContainer, topElement, pageInfo, mediaDir = './img/min', mediaExt = 'webp') {
        this.totalItems = totalItems;
        this.totalItemsLength = totalItems.length;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.itemsContainer = itemsContainer;
        this.topElement = topElement;
        this.pageInfo = pageInfo;
        this.productManager = new ProductManager(flatObjectData, mediaDir, mediaExt, itemsContainer);
        this.updatePage();
    }

    reset(totalItems) {
        this.totalItems = totalItems;
        this.totalItemsLength = totalItems.length;
        this.currentPage = 1;
        this.updatePage();
        this.scrollToProductsSection();
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
        this.scrollToProductsSection();
    }

    previousPage() {
        const newPageNumber = this.currentPage - 1;
        this.goToPage(newPageNumber);
        this.scrollToProductsSection();
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
        const pageItems = this.getPageItems();
        this.renderItems(pageItems);
        this.renderPageInfo();
    };
    scrollToProductsSection() {
        const margin = 50;
        const elementPosition = this.topElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - margin;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

class ProductManager {
    constructor(productData, mediaDir, mediaExt, itemsContainer) {
        this.productData = productData;
        this.mediaDir = mediaDir;
        this.mediaExt = mediaExt;
        this.itemsContainer = itemsContainer;
    }

    createProductElement(id) {
        const productData = this.productData[`${id}`] || null;
        if (productData === null) {
            return;
        }

        const product = document.createElement('div');
        product.classList.add('product');


        var imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        var skeletonLoader = document.createElement("div");
        skeletonLoader.classList.add("skeleton-loader");

        const img = document.createElement('img');
        img.src = `${this.mediaDir}/${productData.category}-${productData.subcategory}-${id}min.${this.mediaExt}`;
        img.alt = productData.name;
        img.style.width = '230px';
        img.style.height = '230px';
        img.style.display = "none";

        img.onload = (function (loader, img) {
            return function () {
                loader.style.display = "none";
                img.style.display = "block";
            };
        })(skeletonLoader, img);

        if (img.complete) {
            img.onload();
        }
        imageContainer.appendChild(skeletonLoader);
        imageContainer.appendChild(img);

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

        product.appendChild(imageContainer);
        product.appendChild(h3);
        product.appendChild(star);
        product.appendChild(category);
        product.appendChild(p);
        product.appendChild(link);

        return product;
    }

    addProducts(productsToAdd, container = this.itemsContainer) {
        const fragment = document.createDocumentFragment();
        productsToAdd.forEach((id) => {
            fragment.appendChild(this.createProductElement(id));
        });
        container.appendChild(fragment);
    }
}