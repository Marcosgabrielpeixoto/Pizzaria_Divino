class OrderQueue {
    constructor() {
        this.items = []; 
    }

    insert(key, value) {
        this.items.push({ key, value });
    }

    popMin() {
        if (this.items.length === 0) return null;
        return this.items.shift();
    }

    inorder() {
        return this.items;
    }
}

export default OrderQueue;

