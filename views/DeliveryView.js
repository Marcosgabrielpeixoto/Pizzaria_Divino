class DeliveryView {
    constructor() {
        this.elements = {
            messageBox: document.getElementById('message-box'),
            routePath: document.getElementById('route-path'),
            totalDistance: document.getElementById('total-distance'),
        };
    }

    // Exibe mensagens na interface
    displayMessage(msg, type) {
        this.elements.messageBox.textContent = msg;
        this.elements.messageBox.className = 'mt-4 p-3 rounded-lg text-sm';
        this.elements.messageBox.classList.remove('hidden');
        if (type === 'success') this.elements.messageBox.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-400');
        else this.elements.messageBox.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-400');
    }

    // Renderiza a rota no DOM
    renderRoute(routeData) {
        this.elements.totalDistance.textContent = `${routeData.totalDistance} km`;
        this.elements.routePath.innerHTML = '';
        if (routeData.pathNames.length <= 1) {
            this.elements.routePath.innerHTML = '<p class="text-gray-500">Nenhuma rota a ser percorrida além do depósito.</p>';
        } else {
            routeData.pathNames.forEach((name, index) => {
                const item = document.createElement('div');
                item.className = 'p-2';
                item.innerHTML = `<span>${name}</span>`;
                this.elements.routePath.appendChild(item);
            });
        }
    }
}

export default DeliveryView;
