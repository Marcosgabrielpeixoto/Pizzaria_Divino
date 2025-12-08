// models/Graph.js
export default class Graph {
    constructor() {
        this.nodes = new Map(); // id -> display name
        this.edges = new Map(); // id -> Map(neighbor_id, weight)
    }

    addNode(id, name) {
        this.nodes.set(id, name);
        if (!this.edges.has(id)) {
            this.edges.set(id, new Map());
        }
    }

    addEdge(a, b, w, bidir = true) {
        if (!this.nodes.has(a) || !this.nodes.has(b)) {
            console.warn(`Nodes missing for edge ${a} - ${b}`);
            return;
        }
        this.edges.get(a).set(b, parseFloat(w));
        if (bidir) {
            this.edges.get(b).set(a, parseFloat(w));
        }
    }

    _pq() {
        const q = [];
        return {
            push: (d, u) => { q.push({ d, u }); q.sort((x, y) => x.d - y.d); },
            pop: () => q.shift(),
            isEmpty: () => q.length === 0
        };
    }

    dijkstra(start) {
        const dist = new Map();
        const prev = new Map();
        if (!this.nodes.has(start)) return { dist, prev };

        for (const k of this.nodes.keys()) {
            dist.set(k, Infinity);
            prev.set(k, null);
        }
        dist.set(start, 0);

        const pq = this._pq();
        pq.push(0, start);

        while (!pq.isEmpty()) {
            const { d, u } = pq.pop();
            if (d > dist.get(u)) continue;
            const neigh = this.edges.get(u) || new Map();
            for (const [v, w] of neigh.entries()) {
                const nd = d + w;
                if (nd < dist.get(v)) {
                    dist.set(v, nd);
                    prev.set(v, u);
                    pq.push(nd, v);
                }
            }
        }
        return { dist, prev };
    }

    shortestPath(a, b) {
        const { dist, prev } = this.dijkstra(a);
        const distance = dist.get(b);
        if (distance === undefined || distance === Infinity) {
            return { distance: Infinity, path: [] };
        }
        const path = [];
        let cur = b;
        while (cur !== null) {
            path.push(cur);
            cur = prev.get(cur);
        }
        path.reverse();
        return { distance, path };
    }
}
