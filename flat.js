const fs = require('fs');
const product_data = require('./docs/product_data');

const flatProductObject = {};
Object.values(product_data).forEach(category => {
    Object.values(category).forEach(products => {
        products.forEach(product => {
            flatProductObject[product.id] = {
                name: product.name,
                price: product.price,
                star: product.star
            };
        });
    });
});

const jsonString = JSON.stringify(flatProductObject);
fs.writeFile('output.json', jsonString, err => {
    if (err) {
        console.error('Error writing file', err);
    } else {
        console.log('Successfully wrote file');
    }
});
