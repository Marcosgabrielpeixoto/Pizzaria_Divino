// views/DeliveryView.js
import { updateRoute } from '../utils/CanvasUtils.js';

export default class DeliveryView {
    constructor() {
        this.messageBox = document.getElementById('message-box');
        this.routePath = document.getElementById('route-path');
        this.totalDistance = document.getElementById('total-distance');
        this.pendingList = document.getElementById('pending-orders-list');
        this.pendingCount = document.getElementById('pending-count');
        this.noOrdersMsg = document.getElementById('no-orders');
    }

    displayMessage(msg, type) {
        this.messageBox.textContent = msg;
        this.messageBox.className = 'mt-4 p-3 rounded-lg text-sm';
        this.messageBox.classList.remove('hidden');
        if (type === 'success') {
            this.messageBox.classList.add('bg-green-100','text-green-800','border','border-green-400');
        } else {
            this.messageBox.classList.add('bg-red-100','text-red-800','border','border-red-400');
        }
    }

    renderPendingOrders(pending) {
        this.pendingList.innerHTML = '';
        this.pendingCount.textContent = pending.length;

        if (pending.length === 0) {
            this.noOrdersMsg.classList.remove('hidden');
            this.pendingList.appendChild(this.noOrdersMsg);
            return;
        }

        this.noOrdersMsg.classList.add('hidden');

        pending.forEach(p => {
            const timeStr = new Date(p.hora).toLocaleTimeString('pt-BR');
            const item = document.createElement('div');
            item.className = 'p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-yellow-50 transition';
            item.innerHTML = `
                <div class="font-bold text-gray-800">#${p.seq} - ${p.cliente}</div>
                <div class="text-sm text-gray-600">
                    <span class="font-medium">${p.bairro}</span>: ${p.rua}
                    <span class="text-xs text-gray-400 ml-2">(${timeStr})</span>
                </div>
            `;
            this.pendingList.appendChild(item);
        });
    }

    renderRoute(routeData) {
        const { rotaNodes, pathNames, totalDistance, nodeToClientMap } = routeData;
        this.totalDistance.textContent = `${totalDistance} km`;
        this.routePath.innerHTML = '';

        if (!pathNames || pathNames.length <= 1) {
            this.routePath.innerHTML = '<p class="text-gray-500">Nenhuma rota a ser percorrida além do depósito.</p>';
            updateRoute(routeData);
            return;
        }

        pathNames.forEach((name, index) => {
            const nodeId = rotaNodes[index];
            const clients = nodeToClientMap.get(nodeId);
            const item = document.createElement('div');
            item.className = 'flex items-start py-1';

            let iconHtml = '';
            let textClass = 'text-gray-800';

            if (index === 0) {
                iconHtml = '<span class="text-green-700 font-extrabold mr-2">🏠</span>';
                textClass = 'font-bold text-green-700';
            } else if (clients) {
                iconHtml = '<span class="text-red-600 font-extrabold mr-2">📍</span>';
                textClass = 'font-bold text-red-600';
            } else if (index === pathNames.length - 1) {
                iconHtml = '<span class="text-blue-500 font-extrabold mr-2">🏁</span>';
            } else {
                iconHtml = '<span class="text-gray-400 font-extrabold mr-2">→</span>';
            }

            item.innerHTML = `
                ${iconHtml}
                <div class="flex flex-col">
                    <span class="${textClass}">${name}</span>
                    ${clients ? `<span class="text-xs italic text-gray-500">Entregar para: ${clients.join(', ')}</span>` : ''}
                </div>
            `;
            this.routePath.appendChild(item);
        });

        updateRoute(routeData);
    }
}
