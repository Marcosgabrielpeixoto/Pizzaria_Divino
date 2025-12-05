import SistemaEntrega from './models/SistemaEntrega';
import DeliveryController from './controllers/DeliveryController';
import DeliveryView from './views/DeliveryView';
import { drawMapStatic, drawMotoboy } from './utils/CanvasUtils';

// Instancia os módulos
const sistema = new SistemaEntrega();
const controller = new DeliveryController();
const view = new DeliveryView();

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

const ctx = elements.canvas.getContext('2d');

// Função para preencher os bairros no dropdown
function populateBairros() {
    const bairros = sistema.bairrosDisponiveis();
    bairros.forEach(bairro => {
        const option = document.createElement('option');
        option.value = bairro;
        option.textContent = bairro.replace('_', ' ');
        elements.bairroSelect.appendChild(option);
    });
}

// Evento para alteração de bairro
elements.bairroSelect.addEventListener('change', (e) => {
    const bairro = e.target.value;
    const ruas = sistema.ruasDoBairro(bairro);
    elements.ruaSelect.innerHTML = '<option value="" disabled selected>Selecione a Rua</option>';
    elements.ruaSelect.disabled = ruas.length === 0;
    ruas.forEach(rua => {
        const option = document.createElement('option');
        option.value = rua;
        option.textContent = rua;
        elements.ruaSelect.appendChild(option);
    });
    if (ruas.length > 0) elements.ruaSelect.focus();
});

// Função para renderizar a rota
function renderRoute(routeData) {
    view.renderRoute(routeData);
    drawMapStatic(routeData); // Exibe o mapa
}

// Envio do formulário para adicionar entrega
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
            renderRoute(rota);
        }
    } catch (error) {
        view.displayMessage(`❌ Erro: ${error.message}`, 'error');
    }
});

// Botão para entrega do próximo pedido
elements.deliverBtn.addEventListener('click', async () => {
    const result = await controller.entregarProxima();
    if (result) {
        view.displayMessage(`🍕 ENTREGUE! Pedido #${result.key} para ${result.value.cliente} em ${result.value.rua}.`, 'success');
        renderRoute(sistema.rotaOtima());
    } else {
        view.displayMessage("📦 Nenhuma entrega pendente para realizar.", 'error');
    }
});

// Botão para mostrar a rota
elements.showRouteBtn.addEventListener('click', async () => {
    const rota = sistema.rotaOtima();
    if (rota.pathNames.length <= 1) {
        view.displayMessage("⚠️ Sem entregas pendentes para calcular a rota.", 'error');
    } else {
        view.displayMessage(`🗺️ Rota ótima recalculada. Distância total: ${rota.totalDistance} km.`, 'success');
    }
    renderRoute(rota);
});

// Ajuste da responsividade do canvas
function resizeCanvas() {
    const parentWidth = elements.canvas.parentElement.offsetWidth;
    elements.canvas.width = parentWidth;
    elements.canvas.height = Math.round(parentWidth * (650 / 700));
    drawMapStatic({ rotaNodes: [], pathNames: [], totalDistance: 0.0, nodeToClientMap: new Map() });
}

// Inicialização do app
window.onload = () => {
    populateBairros();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
};

