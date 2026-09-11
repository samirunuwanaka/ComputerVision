/**
 * EN3160 - Image Processing and Machine Vision
 * Assignment 1: Intensity Transformations and Neighborhood Filtering
 * Interactive Laboratory Report Engine & Simulator Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize KaTeX render if ready
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }

    // Initialize interactive sections
    initQ1Q2Piecewise();
    initQ3Gamma();
    initQ4Vibrance();
    initQ5Q6HistEq();
    initQ7Sobel();
    initQ8Zooming();
    initQ9GrabCut();
    initQ10Bilateral();
});

// ==========================================
// Q1 & Q2: Piecewise Linear Transformation
// ==========================================
function initQ1Q2Piecewise() {
    const p1x = document.getElementById('q1_p1x');
    const p1y = document.getElementById('q1_p1y');
    const p2x = document.getElementById('q1_p2x');
    const p2y = document.getElementById('q1_p2y');

    const inputs = [p1x, p1y, p2x, p2y];
    inputs.forEach(inElem => {
        if (inElem) inElem.addEventListener('input', updateQ1Q2Plot);
    });

    // Preset buttons
    const btnContrast = document.getElementById('btnQ1Contrast');
    const btnWhiteMatter = document.getElementById('btnQ2WM');
    const btnGrayMatter = document.getElementById('btnQ2GM');

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            if (p1x) p1x.value = 50;
            if (p1y) p1y.value = 20;
            if (p2x) p2x.value = 200;
            if (p2y) p2y.value = 240;
            updateQ1Q2Plot();
        });
    }

    if (btnWhiteMatter) {
        btnWhiteMatter.addEventListener('click', () => {
            if (p1x) p1x.value = 140;
            if (p1y) p1y.value = 10;
            if (p2x) p2x.value = 210;
            if (p2y) p2y.value = 250;
            updateQ1Q2Plot();
        });
    }

    if (btnGrayMatter) {
        btnGrayMatter.addEventListener('click', () => {
            if (p1x) p1x.value = 80;
            if (p1y) p1y.value = 230;
            if (p2x) p2x.value = 150;
            if (p2y) p2y.value = 30;
            updateQ1Q2Plot();
        });
    }

    updateQ1Q2Plot();
}

function updateQ1Q2Plot() {
    const x1 = parseFloat(document.getElementById('q1_p1x')?.value || 50);
    const y1 = parseFloat(document.getElementById('q1_p1y')?.value || 50);
    const x2 = parseFloat(document.getElementById('q1_p2x')?.value || 200);
    const y2 = parseFloat(document.getElementById('q1_p2y')?.value || 200);

    const canvas = document.getElementById('q1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j <= h; j += h / 4) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Identity line (x = y)
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
    ctx.setLineDash([]);

    // Piecewise Linear Curve: (0,0) -> (x1, y1) -> (x2, y2) -> (255, 255)
    const mapX = val => (val / 255) * w;
    const mapY = val => h - (val / 255) * h;

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.lineTo(mapX(255), mapY(255));
    ctx.stroke();

    // Draw Breakpoint dots
    ctx.fillStyle = '#ef4444';
    [ [x1, y1], [x2, y2] ].forEach(pt => {
        ctx.beginPath();
        ctx.arc(mapX(pt[0]), mapY(pt[1]), 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}


// ==========================================
// Q3: Gamma Correction in L*a*b* Space
// ==========================================
function initQ3Gamma() {
    const slider = document.getElementById('q3GammaSlider');
    if (slider) {
        slider.addEventListener('input', updateQ3Gamma);
    }
    updateQ3Gamma();
}

function updateQ3Gamma() {
    const gamma = parseFloat(document.getElementById('q3GammaSlider')?.value || 1.0);
    const valDisp = document.getElementById('q3GammaVal');
    if (valDisp) valDisp.textContent = gamma.toFixed(2);

    const canvas = document.getElementById('q3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j <= h; j += h / 4) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Power Law Curve: L_out = 255 * (L_in / 255)^gamma
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x <= 255; x++) {
        const normX = x / 255.0;
        const normY = Math.pow(normX, gamma);
        const y = normY * 255.0;

        const canvasX = (x / 255.0) * w;
        const canvasY = h - (y / 255.0) * h;

        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();
}


// ==========================================
// Q4: Vibrance Enhancement in HSV Space
// ==========================================
function initQ4Vibrance() {
    const slider = document.getElementById('q4ASlider');
    if (slider) {
        slider.addEventListener('input', updateQ4Vibrance);
    }
    updateQ4Vibrance();
}

function updateQ4Vibrance() {
    const aVal = parseFloat(document.getElementById('q4ASlider')?.value || 0.5);
    const valDisp = document.getElementById('q4AVal');
    if (valDisp) valDisp.textContent = aVal.toFixed(2);

    const canvas = document.getElementById('q4Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 0; j <= h; j += h / 4) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }

    // Identity line f(x) = x
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
    ctx.setLineDash([]);

    // Vibrance function f(x) = min(x + a * 128 * exp(-((x-128)^2)/(2*sigma^2)), 255)
    const sigma = 70.0;
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x <= 255; x++) {
        const gauss = Math.exp(-Math.pow(x - 128, 2) / (2 * sigma * sigma));
        let fx = x + aVal * 128.0 * gauss;
        if (fx > 255) fx = 255;

        const canvasX = (x / 255.0) * w;
        const canvasY = h - (fx / 255.0) * h;

        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();
}


// ==========================================
// Q5 & Q6: Histogram Equalization
// ==========================================
function initQ5Q6HistEq() {
    updateQ5Q6Canvas();
}

function updateQ5Q6Canvas() {
    const canvas = document.getElementById('q5Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Simulated CDF curve vs Equalized linear CDF curve
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();

    // Cumulative CDF curve
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let i = 0; i <= w; i++) {
        const normX = i / w;
        // Sigmoidal typical cumulative histogram
        const normY = 1 / (1 + Math.exp(-8 * (normX - 0.5)));
        const canvasY = h - normY * h;

        if (i === 0) ctx.moveTo(i, canvasY);
        else ctx.lineTo(i, canvasY);
    }
    ctx.stroke();

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('CDF T(r_k) Mapping', 15, 25);
}


// ==========================================
// Q7: Sobel Filtering & Separability
// ==========================================
function initQ7Sobel() {
    // Computes FLOP count comparison dynamically
    const imgSizeSelect = document.getElementById('q7SizeSelect');
    if (imgSizeSelect) {
        imgSizeSelect.addEventListener('change', updateQ7Flops);
    }
    updateQ7Flops();
}

function updateQ7Flops() {
    const dim = parseInt(document.getElementById('q7SizeSelect')?.value || 512);
    const totalPixels = dim * dim;

    const flops2D = totalPixels * 9;
    const flops1D = totalPixels * (3 + 3);
    const speedup = (flops2D / flops1D).toFixed(2);

    const disp2D = document.getElementById('q7Flops2D');
    const disp1D = document.getElementById('q7Flops1D');
    const dispRatio = document.getElementById('q7Speedup');

    if (disp2D) disp2D.textContent = (flops2D / 1e6).toFixed(2) + ' MFLOPs';
    if (disp1D) disp1D.textContent = (flops1D / 1e6).toFixed(2) + ' MFLOPs';
    if (dispRatio) dispRatio.textContent = `${speedup}x Savings (${((1 - 6/9)*100).toFixed(0)}% drop)`;
}


// ==========================================
// Q8: Image Zooming & SSD Evaluation
// ==========================================
function initQ8Zooming() {
    const factorSlider = document.getElementById('q8FactorSlider');
    if (factorSlider) {
        factorSlider.addEventListener('input', updateQ8Zoom);
    }
    updateQ8Zoom();
}

function updateQ8Zoom() {
    const factor = parseFloat(document.getElementById('q8FactorSlider')?.value || 4.0);
    const dispFactor = document.getElementById('q8FactorVal');
    if (dispFactor) dispFactor.textContent = factor.toFixed(1) + 'x';

    // Theoretical SSD simulation
    const ssdNN = 0.0425 * (factor / 4.0);
    const ssdBilinear = 0.0185 * (factor / 4.0);

    const dispNN = document.getElementById('q8SsdNN');
    const dispBilinear = document.getElementById('q8SsdBilinear');

    if (dispNN) dispNN.textContent = ssdNN.toFixed(5);
    if (dispBilinear) dispBilinear.textContent = ssdBilinear.toFixed(5);
}


// ==========================================
// Q9: GrabCut & Background Blurring
// ==========================================
function initQ9GrabCut() {
    const blurSlider = document.getElementById('q9BlurSlider');
    if (blurSlider) {
        blurSlider.addEventListener('input', updateQ9Blur);
    }
    updateQ9Blur();
}

function updateQ9Blur() {
    const blurK = parseInt(document.getElementById('q9BlurSlider')?.value || 15);
    const dispK = document.getElementById('q9BlurVal');
    if (dispK) dispK.textContent = `${blurK} x ${blurK}`;
}


// ==========================================
// Q10: Bilateral Filtering
// ==========================================
function initQ10Bilateral() {
    const sigS = document.getElementById('q10SigS');
    const sigR = document.getElementById('q10SigR');

    if (sigS) sigS.addEventListener('input', updateQ10Bilateral);
    if (sigR) sigR.addEventListener('input', updateQ10Bilateral);

    updateQ10Bilateral();
}

function updateQ10Bilateral() {
    const sVal = parseFloat(document.getElementById('q10SigS')?.value || 15.0);
    const rVal = parseFloat(document.getElementById('q10SigR')?.value || 40.0);

    const dispS = document.getElementById('q10SigSVal');
    const dispR = document.getElementById('q10SigRVal');

    if (dispS) dispS.textContent = sVal.toFixed(1);
    if (dispR) dispR.textContent = rVal.toFixed(1);

    const canvas = document.getElementById('q10Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Range Gaussian Weight curve exp(- deltaI^2 / (2 * sigma_r^2))
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
        const deltaI = ((x - w / 2) / (w / 2)) * 128.0;
        const weight = Math.exp(-Math.pow(deltaI, 2) / (2 * rVal * rVal));
        const canvasY = h - weight * (h - 20) - 10;

        if (x === 0) ctx.moveTo(x, canvasY);
        else ctx.lineTo(x, canvasY);
    }
    ctx.stroke();

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Range Weight Kernel (σ_r = ${rVal})`, 15, 20);
}

function printReport() {
    window.print();
}
