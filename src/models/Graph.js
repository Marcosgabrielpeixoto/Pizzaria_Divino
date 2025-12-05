class Graph {
    constructor() {
        this.nodes = new Map(); 
        this.edges = new Map(); 
    }

    addNode(id, name) {
        this.nodes.set(id, name);
        this.edges.set(id, new Map());
    }

    addEdge(a, b, w, bidir = true) {
        if (!this.nodes.has(a) || !this.nodes.has(b)) {
            throw new Error(`Nodes ${a} or ${b} are not in the graph`);
        }
        this.edges.get(a).set(b, parseFloat(w));
        if (bidir) this.edges.get(b).set(a, parseFloat(w));
    }

    dijkstra(start) {
        const dist = new Map();
        const prev = new Map();

        if (!this.nodes.has(start)) return { dist, prev };
        this.nodes.forEach((_, key) => {
            dist.set(key, Infinity);
            prev.set(key, null);
        });
        dist.set(start, 0);

        const pq = this._pq();
        pq.push(0, start);
        
        while (!pq.isEmpty()) {
            const { d, u } = pq.pop();
            if (d > dist.get(u)) continue;

            for (const [v, w] of this.edges.get(u).entries()) {
                const newDist = d + w;
                if (newDist < dist.get(v)) {
                    dist.set(v, newDist);
                    prev.set(v, u);
                    pq.push(newDist, v);
                }
            }
        }
        return { dist, prev };
    }

    shortestPath(a, b) {
        const { dist, prev } = this.dijkstra(a);
        const distance = dist.get(b);
        if (distance === undefined || distance === Infinity) return { distance: Infinity, path: [] };

        const path = [];
        let cur = b;
        while (cur !== null) {
            path.push(cur);
            cur = prev.get(cur);
        }
        path.reverse();
        return { distance, path };
    }

    _pq() {
        const q = [];
        return {
            push: (d, u) => { q.push({ d, u }); q.sort((x, y) => x.d - y.d); },
            pop: () => q.shift(),
            isEmpty: () => q.length === 0,
        };
    }
}

export default Graph;

