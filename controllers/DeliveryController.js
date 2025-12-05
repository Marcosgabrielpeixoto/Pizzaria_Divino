import DeliveryService from '../services/DeliveryService';

class DeliveryController {
    constructor(view) {
        this.view = view;
        this.service = new DeliveryService();
    }

    // Preenche o dropdown de bairros
    populateBairros(bairroSelectElement) {
        const bairros = this.service.getAvailableBairros();
        bairros.forEach(b => {
            const option = document.createElement('option');
            option.value = b;
            option.textContent = b.replace('_', ' ');
            bairroSelectElement.appendChild(option);
        });
    }

    // Processa nova entrega
    async processNewDelivery(cliente, bairro, rua) {
        try {
            const { pedido, rota } = await this.service.novaEntrega(cliente, bairro, rua);
            return { success: true, message: `Entrega #${pedido.seq} para ${pedido.cliente} adicionada!`, rota };
        } catch (error) {
            return { success: false, message: `Erro: ${error.message}` };
        }
    }

    // Entrega o próximo pedido
    async entregarProxima() {
        return await this.service.entregarProxima();
    }

    // Obtém a rota ótima
    getOptimalRoute() {
        return this.service.rotaOtima();
    }
}

export default DeliveryController;
