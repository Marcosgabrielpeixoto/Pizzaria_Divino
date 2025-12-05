import Graph from './Graph';
import OrderQueue from './OrderQueue';

class SistemaEntrega {
    constructor() {
        this.depotNode = 'BAIRRO_DIVINO'; 
        this.g = new Graph();
        this.queue = new OrderQueue();
        this.seq = 1;
        this._createCity();
    }

    _createCity() {
        const bairros = { ... }; // Define bairros as before
        const ruas = { ... }; // Define ruas as before
        for (const [k, id] of Object.entries(bairros)) this.g.addNode(id, k.replace('_',' '));
        for (const [id, label] of Object.entries(ruas)) this.g.addNode(id, label);
        this._defineEdges();
    }

    _defineEdges() {
        this.g.addEdge(this.depotNode, 'BAIRRO_SAO_PEDRO', 7);
        // Define other edges here as before
    }

    bairrosDisponiveis() { return Object.keys(this._bairros); }
    ruasDoBairro(bairro) { return this._bairros[bairro] ? Object.keys(this._bairros[bairro]) : [] }
    novaEntrega(cliente, bairroChoice, ruaChoice) { ... } // Refatorada para separar responsabilidades
    entregarProxima() { ... } // Refatorada para limpar o código

    rotaOtima() { ... }
    listarPendentes() { return this.queue.inorder().map(i => i.value); }
}

export default SistemaEntrega;

