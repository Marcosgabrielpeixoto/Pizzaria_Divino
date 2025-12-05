import DeliveryController from './controllers/DeliveryController';
import DeliveryView from './views/DeliveryView';
import { drawMapStatic } from './utils/CanvasUtils';

// Instancia os módulos necessários
const view = new DeliveryView();
const controller = new DeliveryController(view);

// Referências dos elementos DOM
const elements = {
    form: document.getElementById('delivery-form'),
    cliente: document.getElementById('cliente'),
    bairroSelect: document.getElementById('bairro'),
    ruaSelect: document.getElementById('rua'),
    messageBox: document.getElementById('message-box'),
    deliverBtn: document.getElementById('deliver-next-btn'),
    showRouteBtn: document.getElementById('show-route-btn'),
    pendingList: document.getElementById('pending-orders-list'),
    noOrdersMsg: document.getElementById('no-orders'),
    pendingCount: document.getElementById('pending-count'),
    routePath: document.getElementById('route-path'),
    totalDistance: document.getElementById('total-distance'),
    canvas: document.getElementById('delivery-map')
};

// Função para preencher bairros
function populateBairros() {
    controller.populateBairros(elements.bairroSelect);
}

// Ajuste do tamanho do canvas
function resizeCanvas() {
    const parentWidth = elements.canvas.parentElement.offsetWidth;
    elements.canvas.width = parentWidth;
    elements.canvas.height = Math.round(parentWidth * (650 / 700));
    drawMapStatic({ rotaNodes: [], pathNames: [], totalDistance: 0.0, nodeToClientMap: new Map() });
}

// Evento para enviar o formulário
elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cliente = elements.cliente.value.trim();
    const bairro = elements.bairroSelect.value;
    const rua = elements.ruaSelect.value;

    if (!cliente || !bairro || !rua) {
        view.displayMessage("Por favor, preencha todos os campos.", 'error');
        return;
    }

    try {
        const { success, message, rota } = await controller.processNewDelivery(cliente, bairro, rua);
        view.displayMessage(message, success ? 'success' : 'error');
        if (success) {
            view.renderRoute(rota);
        }
    } catch (error) {
        view.displayMessage(`❌ Erro: ${error.message}`, 'error');
    }
});

// Evento para entregar o próximo pedido
elements.deliverBtn.addEventListener('click', async () => {
    const result = await controller.entregarProxima();
    if (result) {
        view.displayMessage(`🍕 ENTREGUE! Pedido #${result.key} para ${result.value.cliente} em ${result.value.rua}.`, 'success');
        view.renderRoute(controller.getOptimalRoute());
    } else {
        view.displayMessage("📦 Nenhuma entrega pendente para realizar.", 'error');
    }
});

// Evento para calcular e mostrar a rota
elements.showRouteBtn.addEventListener('click', async () => {
    const rota = controller.getOptimalRoute();
    if (rota.pathNames.length <= 1) {
        view.displayMessage("⚠️ Sem entregas pendentes para calcular a rota.", 'error');
    } else {
        view.displayMessage(`🗺️ Rota ótima recalculada. Distância total: ${rota.totalDistance} km.`, 'success');
    }
    view.renderRoute(rota);
});

// Inicializa o app
window.onload = () => {
    populateBairros();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
};
