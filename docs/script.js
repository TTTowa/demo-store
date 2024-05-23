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




const productList = document.querySelector('.product-list');

class ProductManager {
    constructor(productData, mediaDir, mediaExt) {
        this.productData = productData;
        this.mediaDir = mediaDir;
        this.mediaExt = mediaExt;
    }

    addListProduct(category, subcategory, id, container) {
        const productData = this.productData[category]?.[subcategory]?.find(obj => obj.id === id) || null;
        if (productData === null) {
            return;
        }

        const product = document.createElement('div');
        product.classList.add('product');

        const img = document.createElement('img');
        img.src = `${this.mediaDir}/${category}-${subcategory}-${id}.${this.mediaExt}`;
        img.alt = productData.name;

        const star = document.createElement('div');
        star.classList.add('star');
        star.style.setProperty("--star", productData.star);

        const h3 = document.createElement('h3');
        h3.textContent = productData.name;

        const p = document.createElement('p');
        p.textContent = `¥${productData.price}`;

        const link = document.createElement('a');
        link.classList.add('pagelink');
        link.href = `./product.html?category=${category}&subcategory=${subcategory}&id=${id}`;

        product.appendChild(img);
        product.appendChild(h3);
        product.appendChild(star);
        product.appendChild(p);
        product.appendChild(link);

        container.appendChild(product);
    }

    addProducts(productsToAdd, container) {
        productsToAdd.forEach(({ category, subcategory, id }) => {
            this.addListProduct(category, subcategory, id, container);
        });
    }
}

const productManager = new ProductManager(product_data, './img', 'jpg');


function generateRandomProductInfo(count, seed="1245") {
    const random = new Random(seed = seed);
    const result = [];
    
    for (let i = 0; i < count; i++) {
        const categories = Object.keys(product_data);
        const randomCategoryIndex = random.nextInt(0, categories.length - 1);
        const randomCategory = categories[randomCategoryIndex];
        
        const subCategories = Object.keys(product_data[randomCategory]);
        const randomSubCategoryIndex = random.nextInt(0, subCategories.length - 1);
        const randomSubCategory = subCategories[randomSubCategoryIndex];
        
        const products = product_data[randomCategory][randomSubCategory];
        const randomProductIndex = random.nextInt(0, products.length - 1);
        const randomProduct = products[randomProductIndex];
        
        result.push({
            category: randomCategory,
            subcategory: randomSubCategory,
            id: randomProduct.id
        });
    }
    
    return result;
}

productManager.addProducts(generateRandomProductInfo(25, seed=(new Date()).getTime()), productList);


