document.addEventListener("DOMContentLoaded", function () {
    const cartButtons = document.querySelectorAll('.product button');

    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            alert('商品がカートに追加されました。');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cartButtons = document.querySelectorAll('.product button');

    cartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            const productElement = event.target.closest('.product');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = productElement.querySelector('p').textContent;
            const productQuantity = prompt("追加する個数を入力してください", "1");

            if (productQuantity !== null && !isNaN(productQuantity) && productQuantity > 0) {
                addToCart(productName, productPrice, parseInt(productQuantity));
            } else {
                alert("有効な個数を入力してください。");
            }
        });
    });

    function addToCart(productName, productPrice, quantity) {
        alert(`${productName} を ${quantity} 個カートに追加しました。`);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    function addProducts(productName, productPrice, productImageSrc, quantity) {
        const productList = document.querySelector('.product-list');

        for (let i = 0; i < quantity; i++) {
            // 商品要素を作成
            const product = document.createElement('div');
            product.classList.add('product');

            // 商品画像
            const img = document.createElement('img');
            img.src = productImageSrc;
            img.alt = productName;

            // 商品名
            const h3 = document.createElement('h3');
            h3.textContent = productName;

            // 商品価格
            const p = document.createElement('p');
            p.textContent = `¥${productPrice}`;

            // カートに追加ボタン
            const button = document.createElement('button');
            button.textContent = 'カートに追加';

            // 商品要素に子要素を追加
            product.appendChild(img);
            product.appendChild(h3);
            product.appendChild(p);
            product.appendChild(button);

            // 商品リストに商品を追加
            productList.appendChild(product);
        }
    }

    // 商品を追加するためのテスト呼び出し
    addProducts('新商品', 3000, 'product3.jpg', 5);
});