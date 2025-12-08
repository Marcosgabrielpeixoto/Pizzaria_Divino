// controllers/DeliveryController.js
import DeliveryService from '../services/DeliveryService.js';

export default class DeliveryController {
    constructor(view) {
        this.view = view;
        this.service = new DeliveryService();
    }

    populateBairros(bairroSelectElement) {
        const bairros = this.service.getAvailableBairros();
        bairros.forEach(b => {
            const option = document.createElement('option');
            option.value = b;
            option.textContent = b.replace('_', ' ');
            bairroSelectElement.appendChild(option);
        });
    }

    handleBairroChange(bairroSelectElement, ruaSelectElement) {
        const bairro = bairroSelectElement.value;
        const ruas = this.service.getRuasDoBairro(bairro);

        ruaSelectElement.innerHTML = '<option value="" disabled selected>Selecione a Rua</option>';
        ruaSelectElement.disabled = ruas.length === 0;

        ruas.forEach(r => {
            const option = document.createElement('option');
            option.value = r;
            option.textContent = r;
            ruaSelectElement.appendChild(option);
        });

        if (ruas.length > 0) {
            ruaSelectElement.focus();
        }
    }

    async processNewDelivery(cliente, bairro, rua) {
        try {
            const { pedido, rota } = this.service.novaEntrega(cliente, bairro, rua);
            const pending = this.service.getPendingOrders();
            this.view.renderPendingOrders(pending);
            return {
                success: true,
                message: `✅ Entrega #${pedido.seq} para ${pedido.cliente} adicionada! Rota Recalculada.`,
                rota
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Erro: ${error.message}`
            };
        }
    }

    async entregarProxima() {
        const result = this.service.entregarProxima();
        const pending = this.service.getPendingOrders();
        this.view.renderPendingOrders(pending);
        return result;
    }

    getOptimalRoute() {
        return this.service.rotaOtima();
    }
}
