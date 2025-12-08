// models/OrderQueue.js
export default class OrderQueue {
    constructor() {
        this.items = []; // { key, value }
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
