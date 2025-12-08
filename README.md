# 🛵 Pizzaria Casa da Massa – Sistema de Entregas

Sistema de simulação de entregas da **Pizzaria Casa da Massa**, usando grafo, algoritmo de Dijkstra, heurística do Vizinho Mais Próximo e uma fila FIFO para gerenciar pedidos.  
A aplicação roda totalmente no **navegador**, com visualização em **canvas** e animação do motoboy.

---

## 📌 Visão Geral

Este projeto simula o fluxo de entregas de uma pizzaria em uma cidade fictícia, com:

- Bairros e ruas modelados como **nós de um grafo**;
- Distâncias entre bairros/ruas como **arestas ponderadas**;
- Cálculo da rota usando:
  - **Dijkstra** para menor caminho entre pontos;
  - **Vizinho Mais Próximo (heurística)** para definir a sequência de visitas;
- Fila de pedidos (**FIFO**) para decidir a ordem de entrega;
- Interface gráfica com **TailwindCSS**, **canvas** e animação do motoboy.

---

## 🚀 Funcionalidades

### 1. Cadastro de entrega

- Usuário informa:
  - **Nome do cliente**
  - **Bairro**
  - **Rua** (ponto de entrega dentro do bairro)
- O sistema:
  - Valida se a rua existe naquele bairro;
  - Cria um pedido na fila com número sequencial;
  - Recalcula a rota ótima para todas as entregas pendentes.

### 2. Cálculo da rota ótima

- Usa:
  - Grafo de bairros/ruas com pesos (distâncias);
  - **Dijkstra** para calcular os menores caminhos;
  - Heurística do **Vizinho Mais Próximo** para decidir a ordem dos destinos.
- Mostra:
  - Caminho completo (em texto, com ícones 🏠 📍 🏁);
  - Distância total acumulada (em “km” simbólicos);
  - Pontos de entrega marcados em vermelho no mapa.

### 3. Entregar próxima (FIFO)

- Botão **“✅ Entregar Próxima (FIFO)”**:
  - Remove o pedido mais antigo da fila (ordem de chegada);
  - Atualiza a lista de pedidos pendentes;
  - Recalcula a rota ótima para os pedidos restantes.

### 4. Visualização no mapa

- Canvas mostra:
  - Bairros (nós azuis);
  - Depósito/Pizzaria (nó verde);
  - Ruas de entrega (nós vermelhos);
  - Rota marcada em linha tracejada vermelha;
  - Motoboy animado seguindo a rota.

---

## 🧱 Arquitetura (Clean Code / Clean Architecture)

A aplicação foi organizada em camadas, seguindo princípios de **separação de responsabilidades**:

### Camadas principais

- **`models/` (Domínio)**
  - `Graph.js` → estrutura de grafo (nós, arestas, Dijkstra, menor caminho).
  - `OrderQueue.js` → fila FIFO para pedidos (inserir, remover, listar).
  - `SistemaEntrega.js` → regra de negócio da pizzaria:
    - Monta a cidade (bairros, ruas, arestas);
    - Registra pedidos;
    - Calcula rota ótima;
    - Lista entregas pendentes.

- **`services/` (Aplicação)**
  - `DeliveryService.js` → orquestra o `SistemaEntrega`:
    - Fornece bairros e ruas para a UI;
    - Chama `novaEntrega`, `entregarProxima`, `rotaOtima`;
    - Retorna dados prontos para o controller e a view.

- **`controllers/` (Interface de Aplicação)**
  - `DeliveryController.js` → faz a ponte entre UI (View) e Service:
    - Popula dropdown de bairros;
    - Atualiza ruas ao mudar o bairro;
    - Processa nova entrega;
    - Dispara atualização da lista de pendentes e da rota.

- **`views/` (Apresentação)**
  - `DeliveryView.js` → tudo que é DOM:
    - Mostra mensagens de feedback;
    - Renderiza lista de pedidos pendentes;
    - Renderiza descrição da rota (texto + ícones);
    - Chama utilitário de canvas para atualizar o mapa.

- **`utils/`**
  - `CanvasUtils.js` → desenho do mapa e animação do motoboy:
    - Usa `nodePositions` para posicionar nós;
    - Desenha nós, rótulos e rota;
    - Anima o motoboy percorrendo a rota.

- **`config/`**
  - `nodePositions.js` → configura as posições (x, y, label) de cada bairro e rua no canvas.

- **Raiz**
  - `app.js` → **ponto de entrada** do front:
    - Importa Controller e View;
    - Configura listeners de formulário e botões;
    - Inicializa bairros, canvas e resize;
    - Faz a ligação entre DOM e arquitetura.

---

## 📂 Estrutura de Pastas

```text
Pizzaria_Divino/
  index.html
  style.css
  app.js
  /controllers
    DeliveryController.js
  /views
    DeliveryView.js
  /services
    DeliveryService.js
  /models
    Graph.js
    OrderQueue.js
    SistemaEntrega.js
  /config
    nodePositions.js
  /utils
    CanvasUtils.js

