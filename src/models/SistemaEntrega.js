// models/SistemaEntrega.js
import Graph from './Graph.js';
import OrderQueue from './OrderQueue.js';

export default class SistemaEntrega {
    constructor() {
        this.depotNode = 'BAIRRO_DIVINO';
        this.g = new Graph();
        this.queue = new OrderQueue();
        this.seq = 1;
        this._createCity();
    }

    _createCity() {
        const bairros = {
            'DIVINO': 'BAIRRO_DIVINO', 
            'CENTRO': 'BAIRRO_CENTRO',
            'SAO_PAULO': 'BAIRRO_SAO_PAULO',
            'SAO_PEDRO': 'BAIRRO_SAO_PEDRO',
            'APARECIDA': 'BAIRRO_APARECIDA',
            'SAO_JORGE': 'BAIRRO_SAO_JORGE',
            'PAZ': 'BAIRRO_PAZ'
        };
        for (const [k, id] of Object.entries(bairros)) {
            this.g.addNode(id, k.replace('_',' '));
        }

        const ruas = {
            'RUA_SP_NOVA_VITORIA': 'R. Nova Vitória',
            'RUA_SP_VITORIA': 'R. Vitória',
            'RUA_SPD_SANTA_DA_BAIA': 'R. Santa da Baia',
            'RUA_SPD_SANTA_RITA': 'R. Santa Rita',
            'RUA_SPD_SAO_FRANCISCO': 'R. São Francisco',
            'RUA_CENTRO_PASTOS': 'R. Pastos',
            'RUA_CENTRO_ESPERANCA': 'R. Esperança',
            'RUA_CENTRO_AGUAS': 'R. Águas',
            'RUA_PAZ_CEDRO': 'R. Cedro', 
            'RUA_SJ_DAS_FLORES': 'R. Das Flores',
            'RUA_SJ_DOS_SOIS': 'R. Dos Sóis',
            'RUA_AP_DA_IPE': 'R. Ipê' 
        };
        for (const [id, label] of Object.entries(ruas)) {
            this.g.addNode(id, label);
        }

        // LIGAÇÕES
        this.g.addEdge(this.depotNode, 'BAIRRO_SAO_PEDRO', 7); 
        this.g.addEdge(this.depotNode, 'BAIRRO_CENTRO', 3);    

        this.g.addEdge('BAIRRO_CENTRO', 'BAIRRO_SAO_JORGE', 6);    
        this.g.addEdge('BAIRRO_CENTRO', 'BAIRRO_PAZ', 11);         
        this.g.addEdge('BAIRRO_SAO_PEDRO', 'BAIRRO_SAO_PAULO', 8); 
        this.g.addEdge('BAIRRO_SAO_PEDRO', 'BAIRRO_APARECIDA', 7); 
        
        // BAIRRO-RUA
        this.g.addEdge('BAIRRO_SAO_PAULO', 'RUA_SP_NOVA_VITORIA', 8);
        this.g.addEdge('BAIRRO_SAO_PAULO', 'RUA_SP_VITORIA', 10);

        this.g.addEdge('BAIRRO_SAO_PEDRO', 'RUA_SPD_SANTA_DA_BAIA', 6);
        this.g.addEdge('BAIRRO_SAO_PEDRO', 'RUA_SPD_SANTA_RITA', 5);
        this.g.addEdge('BAIRRO_SAO_PEDRO', 'RUA_SPD_SAO_FRANCISCO', 7);

        this.g.addEdge('BAIRRO_CENTRO', 'RUA_CENTRO_PASTOS', 2);
        this.g.addEdge('BAIRRO_CENTRO', 'RUA_CENTRO_ESPERANCA', 2);
        this.g.addEdge('BAIRRO_CENTRO', 'RUA_CENTRO_AGUAS', 2);

        this.g.addEdge('BAIRRO_PAZ', 'RUA_PAZ_CEDRO', 10);

        this.g.addEdge('BAIRRO_SAO_JORGE', 'RUA_SJ_DAS_FLORES', 6);
        this.g.addEdge('BAIRRO_SAO_JORGE', 'RUA_SJ_DOS_SOIS', 7);

        this.g.addEdge('BAIRRO_APARECIDA', 'RUA_AP_DA_IPE', 4);
        
        this._bairros = {
            'CENTRO': { 'Pastos': 'RUA_CENTRO_PASTOS', 'Esperança': 'RUA_CENTRO_ESPERANCA', 'Águas': 'RUA_CENTRO_AGUAS' },
            'SAO_PAULO': { 'Nova Vitória': 'RUA_SP_NOVA_VITORIA', 'Vitória': 'RUA_SP_VITORIA' },
            'SAO_PEDRO': { 'Santa da Baia': 'RUA_SPD_SANTA_DA_BAIA', 'Santa Rita': 'RUA_SPD_SANTA_RITA', 'São Francisco': 'RUA_SPD_SAO_FRANCISCO' },
            'SAO_JORGE': { 'Das Flores': 'RUA_SJ_DAS_FLORES', 'Dos Sóis': 'RUA_SJ_DOS_SOIS' },
            'PAZ': { 'Cedro': 'RUA_PAZ_CEDRO' },
            'APARECIDA': { 'Ipê': 'RUA_AP_DA_IPE' }
        };

        this._ruaMap = {};
        for (const [bairro, ruasObj] of Object.entries(this._bairros)) {
            for (const [ruaName, nodeId] of Object.entries(ruasObj)) {
                const key = `${bairro.toUpperCase()}::${ruaName.toUpperCase()}`;
                this._ruaMap[key] = nodeId;
            }
        }
    }

    bairrosDisponiveis() {
        return Object.keys(this._bairros);
    }

    ruasDoBairro(bairro) {
        const b = (bairro || '').trim().toUpperCase();
        const r = this._bairros[b];
        return r ? Object.keys(r) : [];
    }

    novaEntrega(cliente, bairroChoice, ruaChoice) {
        const bairro = bairroChoice.trim().toUpperCase();
        const rua = ruaChoice.trim().toUpperCase();
        const key = `${bairro}::${rua}`;
        const destino = this._ruaMap[key];
        if (!destino) {
            const ruasDisp = this._bairros[bairro] ? Object.keys(this._bairros[bairro]).join(', ') : 'nenhuma';
            throw new Error(`Rua '${ruaChoice}' não encontrada em ${bairroChoice}. Ruas válidas: ${ruasDisp}`);
        }
        const seq = this.seq++;
        const pedido = {
            seq,
            cliente,
            bairro: bairroChoice,
            rua: ruaChoice,
            destinoNode: destino,
            hora: new Date().getTime()
        };
        this.queue.insert(seq, pedido);
        return { pedido, rota: this.rotaOtima() };
    }

    entregarProxima() {
        const node = this.queue.popMin();
        if (!node) return null;
        return { key: node.key, value: node.value };
    }

    rotaOtima() {
        const pend = this.queue.inorder();
        if (pend.length === 0) {
            return {
                rotaNodes: [],
                pathNames: [],
                totalDistance: 0.0,
                nodeToClientMap: new Map()
            };
        }
        const nodeToClientMap = new Map();
        pend.forEach(p => {
            if (!nodeToClientMap.has(p.value.destinoNode)) {
                nodeToClientMap.set(p.value.destinoNode, []);
            }
            nodeToClientMap.get(p.value.destinoNode).push(p.value.cliente);
        });

        const destinos = Array.from(nodeToClientMap.keys());
        let current = this.depotNode;
        let rotaNodes = [current];
        let restantes = new Set(destinos);
        let totalDistance = 0.0;

        while (restantes.size > 0) {
            const { dist: distMap } = this.g.dijkstra(current);
            let prox = null;
            let minDist = Infinity;
            for (const node of restantes) {
                const dist = distMap.get(node) || Infinity;
                if (dist < minDist) {
                    minDist = dist;
                    prox = node;
                }
            }
            if (!prox || minDist === Infinity) break;
            const { distance: distSeg, path } = this.g.shortestPath(current, prox);
            totalDistance += distSeg;
            if (path.length > 0) {
                rotaNodes.push(...path.slice(1));
            }
            current = prox;
            restantes.delete(prox);
        }

        const pathNames = rotaNodes.map(n => this.g.nodes.get(n) || n);
        return {
            rotaNodes,
            pathNames,
            totalDistance: totalDistance.toFixed(2),
            nodeToClientMap
        };
    }

    listarPendentes() {
        return this.queue.inorder().map(i => i.value);
    }
}
