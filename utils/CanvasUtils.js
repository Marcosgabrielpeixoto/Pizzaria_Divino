// utils/CanvasUtils.js
import { nodePositions } from '../config/nodePositions.js';

let canvas = null;
let ctx = null;

let currentRouteData = {
    rotaNodes: [],
    pathNames: [],
    totalDistance: 0.0,
    nodeToClientMap: new Map()
};

let motoboy = {
    x: 0,
    y: 0,
    pathIndex: 0,
    segmentProgress: 0,
    isMoving: false,
    path: []
};

let animationFrameId = null;
const DEPOT_ID = 'BAIRRO_DIVINO';

function ensureContext() {
    if (!canvas) {
        canvas = document.getElementById('delivery-map');
        if (!canvas) return false;
        ctx = canvas.getContext('2d');
    }
    return true;
}

function drawMotoboyStatic() {
    if (!ensureContext()) return;
    const lastNode = motoboy.path.length > 0
        ? motoboy.path[Math.min(motoboy.pathIndex, motoboy.path.length - 1)]
        : DEPOT_ID;
    const p = nodePositions[lastNode] || nodePositions[DEPOT_ID];
    if (!p) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8800';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('🛵', p.x, p.y + 4);
    ctx.restore();
}

function drawFullMap() {
    if (!ensureContext()) return;

    const { rotaNodes, nodeToClientMap } = currentRouteData;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha rota (apenas o caminho da rota ótima)
    if (rotaNodes && rotaNodes.length > 1) {
        ctx.strokeStyle = '#E3342F';
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 5]);
        for (let i = 0; i < rotaNodes.length - 1; i++) {
            const a = rotaNodes[i];
            const b = rotaNodes[i + 1];
            const pa = nodePositions[a];
            const pb = nodePositions[b];
            if (!pa || !pb) continue;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    }

    // Desenha nós
    for (const [id, pos] of Object.entries(nodePositions)) {
        const isDepot = id === DEPOT_ID;
        const isBairro = id.startsWith('BAIRRO');
        const isRua = id.startsWith('RUA');
        const isDestination = nodeToClientMap && nodeToClientMap.has(id);

        ctx.beginPath();
        const r = isBairro ? 12 : 8;
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);

        if (isDepot) ctx.fillStyle = '#059669';
        else if (isBairro) ctx.fillStyle = '#2563EB';
        else if (isRua && isDestination) ctx.fillStyle = '#fe0800ff';
        else if (isRua) ctx.fillStyle = '#ff0800ff';
        else ctx.fillStyle = '#9CA3AF';

        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = isBairro ? '13px bold Arial' : '12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(pos.label, pos.x, pos.y - (r + 10));
    }
}

function animateMotoboy() {
    if (!ensureContext()) return;
    drawFullMap();

    if (!motoboy.isMoving || motoboy.pathIndex >= motoboy.path.length - 1) {
        drawMotoboyStatic();
        return;
    }

    const curId = motoboy.path[motoboy.pathIndex];
    const nextId = motoboy.path[motoboy.pathIndex + 1];
    const pA = nodePositions[curId];
    const pB = nodePositions[nextId];
    if (!pA || !pB) {
        motoboy.isMoving = false;
        drawFullMap();
        drawMotoboyStatic();
        return;
    }

    motoboy.x = pA.x + (pB.x - pA.x) * motoboy.segmentProgress;
    motoboy.y = pA.y + (pB.y - pA.y) * motoboy.segmentProgress;

    ctx.save();
    ctx.beginPath();
    ctx.arc(motoboy.x, motoboy.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8800';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('🛵', motoboy.x, motoboy.y + 4);
    ctx.restore();

    const speed = 0.02;
    motoboy.segmentProgress += speed;
    if (motoboy.segmentProgress >= 1) {
        motoboy.segmentProgress = 0;
        motoboy.pathIndex++;
        if (motoboy.pathIndex >= motoboy.path.length - 1) {
            motoboy.isMoving = false;
        }
    }

    animationFrameId = requestAnimationFrame(animateMotoboy);
}

// Exportado: usado no resize inicial (apenas redesenha)
export function drawMapStatic(_routeDataIgnored) {
    // usa a rota atual, se houver
    drawFullMap();
    drawMotoboyStatic();
}

// Exportado: chamado pela View quando a rota muda
export function updateRoute(routeData) {
    currentRouteData = routeData || {
        rotaNodes: [],
        pathNames: [],
        totalDistance: 0.0,
        nodeToClientMap: new Map()
    };

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    motoboy.path = currentRouteData.rotaNodes || [];
    motoboy.pathIndex = 0;
    motoboy.segmentProgress = 0;
    motoboy.isMoving = motoboy.path.length > 1;

    animateMotoboy();
}
