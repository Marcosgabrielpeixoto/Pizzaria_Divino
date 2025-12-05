class DeliveryService {
    constructor(sistema) {
        this.sistema = sistema;
    }

    novaEntrega(cliente, bairro, rua) {
        return this.sistema.novaEntrega(cliente, bairro, rua);
    }

    entregarProxima() {
        return this.sistema.entregarProxima();
    }
}

export default DeliveryService;

