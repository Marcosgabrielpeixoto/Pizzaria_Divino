// services/DeliveryService.js
import SistemaEntrega from '../models/SistemaEntrega.js';

export default class DeliveryService {
    constructor() {
        this.sistema = new SistemaEntrega();
    }

    getAvailableBairros() {
        return this.sistema.bairrosDisponiveis();
    }

    getRuasDoBairro(bairro) {
        return this.sistema.ruasDoBairro(bairro);
    }

    novaEntrega(cliente, bairro, rua) {
        return this.sistema.novaEntrega(cliente, bairro, rua);
    }

    entregarProxima() {
        return this.sistema.entregarProxima();
    }

    rotaOtima() {
        return this.sistema.rotaOtima();
    }

    getPendingOrders() {
        return this.sistema.listarPendentes();
    }
}
