import SistemaEntrega from '../models/SistemaEntrega';
import DeliveryService from '../services/DeliveryService';

class DeliveryController {
    constructor() {
        this.sistema = new SistemaEntrega();
        this.service = new DeliveryService(this.sistema);
    }

    async processNewDelivery(cliente, bairro, rua) {
        try {
            const { pedido, rota } = await this.service.novaEntrega(cliente, bairro, rua);
            return { success: true, message: `Entregas registradas com sucesso. Pedido: #${pedido.seq}`, rota };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default DeliveryController;

