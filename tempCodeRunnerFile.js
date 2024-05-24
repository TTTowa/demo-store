const flatProductObject = {};
Object.values(product_data).forEach(category, categoryIndex => {
    Object.values(category).forEach(products, subcategoryIndex => {
        products.forEach(product => {
            flatProductObject[product.id] = {
                name: product.name,
                price: product.price,
                star: product.star,
                category: categoryIndex,
                subcategory: subcategoryIndex
            };
        });
    });
});