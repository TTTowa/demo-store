class Cart {
    constructor() {
        this.cartKey = 'cartItems';
        this.historyKey = 'purchaseHistory';
        this.cartItems = this.loadCart();
        this.updateCartDisplay();
    }

    loadCart() {
        const cart = localStorage.getItem(this.cartKey);
        console.log('Loading cart:', cart); // デバッグ用
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        console.log('Saving cart:', this.cartItems); // デバッグ用
        localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    }

    addItem(id, quantity) {
        const itemIndex = this.cartItems.findIndex(item => item.id === id);
        if (itemIndex >= 0) {
            this.cartItems[itemIndex].quantity += quantity;
        } else {
            this.cartItems.push({ id, quantity });
        }
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(id) {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    purchaseItems() {
        if (this.cartItems.length === 0) {
            alert('カートが空です。アイテムを追加してください。');
            return;
        }

        const history = this.loadHistory();
        const purchaseRecord = {
            date: new Date().toISOString(),
            items: [...this.cartItems]
        };
        console.log('Adding to history:', purchaseRecord); // デバッグ用
        history.push(purchaseRecord);
        localStorage.setItem(this.historyKey, JSON.stringify(history));
        this.clearCart();
    }

    loadHistory() {
        const history = localStorage.getItem(this.historyKey);
        console.log('Loading history:', history); // デバッグ用
        return history ? JSON.parse(history) : [];
    }

    updateCartDisplay() {
        const cartItemsElement = document.getElementById('cart-items');
        if (!cartItemsElement) {
            return;
        }
        cartItemsElement.innerHTML = '';
        this.cartItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            li.innerHTML = `<span>ID: ${item.id}</span><span>Quantity: ${item.quantity}</span>`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => this.removeItem(item.id);
            li.appendChild(removeButton);
            cartItemsElement.appendChild(li);
        });
    }

    displayHistory() {
        const history = this.loadHistory();
        const historyItemsElement = document.getElementById('history-items');
        historyItemsElement.innerHTML = '';

        history.forEach(record => {
            if (record.items) { // record.itemsが存在するかチェック
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <h3>購入日: ${new Date(record.date).toLocaleString()}</h3>
                    <ul>
                        ${record.items.map(item => `<li>ID: ${item.id}, Quantity: ${item.quantity}</li>`).join('')}
                    </ul>
                `;
                historyItemsElement.appendChild(li);
            } else {
                console.error('Invalid record format:', record); // デバッグ用
            }
        });
    }
}