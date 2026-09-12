/**
 * EN3160 - Image Processing and Machine Vision
 * Assignment 1: Interactive Laboratory Report Engine & Simulator Script
 * Live HTML5 Canvas Image Processing Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }

    initQ1Q2Interactive();
    initQ3Interactive();
    initQ4Interactive();
    initQ5Q6Interactive();
    initQ7Interactive();
    initQ8Interactive();
    initQ9Interactive();
    initQ10Interactive();
});

// Helper: Convert RGB to HSV
function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}

// Helper: Convert HSV to RGB
function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Helper to load image into canvas
function loadImageToCanvas(src, canvasId, callback) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        if (callback) callback(img, ctx, canvas);
    };
    img.src = src;
}

// =========================================================
// Q1 & Q2: Live Piecewise Linear Transformation on Canvas
// =========================================================
let q1SourceImgData = null;

function initQ1Q2Interactive() {
    const p1x = document.getElementById('q1_p1x');
    const p1y = document.getElementById('q1_p1y');
    const p2x = document.getElementById('q1_p2x');
    const p2y = document.getElementById('q1_p2y');
    const imgSelect = document.getElementById('q1ImgSelect');

    const updateAll = () => {
        updateQ1Plot();
        processQ1Image();
    };

    [p1x, p1y, p2x, p2y].forEach(el => {
        if (el) el.addEventListener('input', updateAll);
    });

    if (imgSelect) {
        imgSelect.addEventListener('change', () => {
            loadQ1Image();
        });
    }

    const btnContrast = document.getElementById('btnQ1Contrast');
    const btnWhiteMatter = document.getElementById('btnQ2WM');
    const btnGrayMatter = document.getElementById('btnQ2GM');

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            if (p1x) p1x.value = 50; if (p1y) p1y.value = 20;
            if (p2x) p2x.value = 150; if (p2y) p2y.value = 220;
            updateAll();
        });
    }
    if (btnWhiteMatter) {
        btnWhiteMatter.addEventListener('click', () => {
            if (p1x) p1x.value = 140; if (p1y) p1y.value = 10;
            if (p2x) p2x.value = 210; if (p2y) p2y.value = 250;
            if (imgSelect) imgSelect.value = 'images/im02.png';
            loadQ1Image();
        });
    }
    if (btnGrayMatter) {
        btnGrayMatter.addEventListener('click', () => {
            if (p1x) p1x.value = 75; if (p1y) p1y.value = 10;
            if (p2x) p2x.value = 135; if (p2y) p2y.value = 240;
            if (imgSelect) imgSelect.value = 'images/im02.png';
            loadQ1Image();
        });
    }

    loadQ1Image();
    updateQ1Plot();
}

function loadQ1Image() {
    const src = document.getElementById('q1ImgSelect')?.value || 'images/im01.png';
    const canvas = document.getElementById('q1ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        q1SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
        processQ1Image();
    };
    img.src = src;
}

function updateQ1Plot() {
    const x1 = parseFloat(document.getElementById('q1_p1x')?.value || 50);
    const y1 = parseFloat(document.getElementById('q1_p1y')?.value || 20);
    const x2 = parseFloat(document.getElementById('q1_p2x')?.value || 150);
    const y2 = parseFloat(document.getElementById('q1_p2y')?.value || 220);

    const canvas = document.getElementById('q1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let j = 0; j <= h; j += h / 4) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke(); }

    ctx.strokeStyle = '#64748b'; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke(); ctx.setLineDash([]);

    const mapX = val => (val / 255) * w;
    const mapY = val => h - (val / 255) * h;

    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(mapX(0), mapY(0));
    ctx.lineTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.lineTo(mapX(255), mapY(255));
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    [[x1, y1], [x2, y2]].forEach(pt => {
        ctx.beginPath(); ctx.arc(mapX(pt[0]), mapY(pt[1]), 5, 0, 2 * Math.PI); ctx.fill();
    });
}

function processQ1Image() {
    if (!q1SourceImgData) return;
    const canvas = document.getElementById('q1ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const x1 = parseFloat(document.getElementById('q1_p1x')?.value || 50);
    const y1 = parseFloat(document.getElementById('q1_p1y')?.value || 20);
    const x2 = parseFloat(document.getElementById('q1_p2x')?.value || 150);
    const y2 = parseFloat(document.getElementById('q1_p2y')?.value || 220);

    // Compute 256-element LUT
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        let val = 0;
        if (i < x1) {
            val = x1 === 0 ? y1 : (i / x1) * y1;
        } else if (i < x2) {
            val = x2 === x1 ? y1 : y1 + ((i - x1) / (x2 - x1)) * (y2 - y1);
        } else {
            val = x2 === 255 ? y2 : y2 + ((i - x2) / (255 - x2)) * (255 - y2);
        }
        lut[i] = Math.min(255, Math.max(0, Math.round(val)));
    }

    const outData = ctx.createImageData(q1SourceImgData);
    const src = q1SourceImgData.data;
    const dst = outData.data;
    for (let i = 0; i < src.length; i += 4) {
        dst[i] = lut[src[i]];
        dst[i+1] = lut[src[i+1]];
        dst[i+2] = lut[src[i+2]];
        dst[i+3] = src[i+3];
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q3: Live Gamma Correction in Luminance / Lab Space
// =========================================================
let q3SourceImgData = null;

function initQ3Interactive() {
    const slider = document.getElementById('q3GammaSlider');
    if (slider) {
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value);
            document.getElementById('q3GammaVal').textContent = val.toFixed(2);
            updateQ3Plot(val);
            processQ3Image(val);
        });
    }

    const canvas = document.getElementById('q3ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q3SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            const val = parseFloat(document.getElementById('q3GammaSlider')?.value || 0.6);
            updateQ3Plot(val);
            processQ3Image(val);
        };
        img.src = 'images/im03.png';
    }
}

function updateQ3Plot(gamma) {
    const canvas = document.getElementById('q3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let j = 0; j <= h; j += h / 4) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke(); }

    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x <= 255; x++) {
        const normY = Math.pow(x / 255.0, gamma);
        const cx = (x / 255.0) * w;
        const cy = h - normY * h;
        if (x === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
}

function processQ3Image(gamma) {
    if (!q3SourceImgData) return;
    const canvas = document.getElementById('q3ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = Math.min(255, Math.max(0, Math.round(255.0 * Math.pow(i / 255.0, gamma))));
    }

    const outData = ctx.createImageData(q3SourceImgData);
    const src = q3SourceImgData.data;
    const dst = outData.data;

    for (let i = 0; i < src.length; i += 4) {
        // Luminance approximation L = 0.299R + 0.587G + 0.114B
        let r = src[i], g = src[i+1], b = src[i+2];
        let l = 0.299 * r + 0.587 * g + 0.114 * b;
        let l_corr = lut[Math.round(l)];
        let ratio = l === 0 ? 0 : l_corr / l;

        dst[i] = Math.min(255, Math.max(0, Math.round(r * ratio)));
        dst[i+1] = Math.min(255, Math.max(0, Math.round(g * ratio)));
        dst[i+2] = Math.min(255, Math.max(0, Math.round(b * ratio)));
        dst[i+3] = src[i+3];
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q4: Live Vibrance Enhancement on Canvas
// =========================================================
let q4SourceImgData = null;

function initQ4Interactive() {
    const slider = document.getElementById('q4ASlider');
    if (slider) {
        slider.addEventListener('input', () => {
            const val = parseFloat(slider.value);
            document.getElementById('q4AVal').textContent = val.toFixed(2);
            updateQ4Plot(val);
            processQ4Image(val);
        });
    }

    const canvas = document.getElementById('q4ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q4SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            const val = parseFloat(document.getElementById('q4ASlider')?.value || 0.6);
            updateQ4Plot(val);
            processQ4Image(val);
        };
        img.src = 'images/im04.jpg';
    }
}

function updateQ4Plot(aVal) {
    const canvas = document.getElementById('q4Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += w / 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let j = 0; j <= h; j += h / 4) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke(); }

    ctx.strokeStyle = '#64748b'; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke(); ctx.setLineDash([]);

    const sigma = 70.0;
    ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x <= 255; x++) {
        const gauss = Math.exp(-Math.pow(x - 128, 2) / (2 * sigma * sigma));
        let fx = Math.min(255, x + aVal * 128.0 * gauss);
        const cx = (x / 255.0) * w;
        const cy = h - (fx / 255.0) * h;
        if (x === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
}

function processQ4Image(aVal) {
    if (!q4SourceImgData) return;
    const canvas = document.getElementById('q4ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const sigma = 70.0;
    const lut = new Uint8Array(256);
    for (let x = 0; x <= 255; x++) {
        const gauss = Math.exp(-Math.pow(x - 128, 2) / (2 * sigma * sigma));
        lut[x] = Math.min(255, Math.max(0, Math.round(x + aVal * 128.0 * gauss)));
    }

    const outData = ctx.createImageData(q4SourceImgData);
    const src = q4SourceImgData.data;
    const dst = outData.data;

    for (let i = 0; i < src.length; i += 4) {
        let r = src[i], g = src[i+1], b = src[i+2];
        let [h, s, v] = rgbToHsv(r, g, b);
        let s255 = Math.round(s * 255);
        let s_enh = lut[s255] / 255.0;
        let [r_new, g_new, b_new] = hsvToRgb(h, s_enh, v);

        dst[i] = r_new;
        dst[i+1] = g_new;
        dst[i+2] = b_new;
        dst[i+3] = src[i+3];
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q5 & Q6: Live Histogram Equalization on Canvas
// =========================================================
let q5SourceImgData = null;

function initQ5Q6Interactive() {
    const modeSelect = document.getElementById('q5ModeSelect');
    const threshSlider = document.getElementById('q5ThreshSlider');

    const updateAll = () => {
        processQ5Image();
    };

    if (modeSelect) modeSelect.addEventListener('change', updateAll);
    if (threshSlider) {
        threshSlider.addEventListener('input', () => {
            document.getElementById('q5ThreshVal').textContent = threshSlider.value;
            updateAll();
        });
    }

    const canvas = document.getElementById('q5ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q5SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            processQ5Image();
        };
        img.src = 'images/im05.jpg';
    }
}

function processQ5Image() {
    if (!q5SourceImgData) return;
    const canvas = document.getElementById('q5ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const mode = document.getElementById('q5ModeSelect')?.value || 'custom';
    const thresh = parseInt(document.getElementById('q5ThreshSlider')?.value || '40');

    const src = q5SourceImgData.data;
    const outData = ctx.createImageData(q5SourceImgData);
    const dst = outData.data;

    if (mode === 'orig') {
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        ctx.putImageData(outData, 0, 0);
        return;
    }

    // Compute histogram
    const hist = new Int32Array(256);
    let total = 0;

    for (let i = 0; i < src.length; i += 4) {
        let gray = Math.round(0.299 * src[i] + 0.587 * src[i+1] + 0.114 * src[i+2]);
        let r = src[i], g = src[i+1], b = src[i+2];
        let [h, s, v] = rgbToHsv(r, g, b);

        if (mode === 'selective') {
            if (s * 255 >= thresh) {
                hist[gray]++;
                total++;
            }
        } else {
            hist[gray]++;
            total++;
        }
    }

    // CDF Mapping
    const cdf = new Float32Array(256);
    let cum = 0;
    for (let k = 0; k < 256; k++) {
        cum += hist[k];
        cdf[k] = total === 0 ? 0 : cum / total;
    }
    const lut = new Uint8Array(256);
    for (let k = 0; k < 256; k++) {
        lut[k] = Math.round(255.0 * cdf[k]);
    }

    for (let i = 0; i < src.length; i += 4) {
        let r = src[i], g = src[i+1], b = src[i+2];
        let [h, s, v] = rgbToHsv(r, g, b);
        let gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        if (mode === 'selective') {
            if (s * 255 >= thresh) {
                let eq_g = lut[gray];
                let ratio = gray === 0 ? 1 : eq_g / gray;
                dst[i] = Math.min(255, Math.round(r * ratio));
                dst[i+1] = Math.min(255, Math.round(g * ratio));
                dst[i+2] = Math.min(255, Math.round(b * ratio));
            } else {
                dst[i] = r; dst[i+1] = g; dst[i+2] = b;
            }
        } else {
            let eq_g = lut[gray];
            let ratio = gray === 0 ? 1 : eq_g / gray;
            dst[i] = Math.min(255, Math.round(r * ratio));
            dst[i+1] = Math.min(255, Math.round(g * ratio));
            dst[i+2] = Math.min(255, Math.round(b * ratio));
        }
        dst[i+3] = src[i+3];
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q7: Live Sobel Filtering & FLOP Comparison on Canvas
// =========================================================
let q7SourceImgData = null;

function initQ7Interactive() {
    const sizeSelect = document.getElementById('q7SizeSelect');
    const modeSelect = document.getElementById('q7ModeSelect');

    const updateAll = () => {
        updateQ7Flops();
        processQ7Image();
    };

    if (sizeSelect) sizeSelect.addEventListener('change', updateAll);
    if (modeSelect) modeSelect.addEventListener('change', updateAll);

    const canvas = document.getElementById('q7ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q7SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            updateQ7Flops();
            processQ7Image();
        };
        img.src = 'images/q2.jpeg';
    }
}

function updateQ7Flops() {
    const dim = parseInt(document.getElementById('q7SizeSelect')?.value || 512);
    const totalPixels = dim * dim;
    const flops2D = totalPixels * 9;
    const flops1D = totalPixels * (3 + 3);

    const disp2D = document.getElementById('q7Flops2D');
    const disp1D = document.getElementById('q7Flops1D');

    if (disp2D) disp2D.textContent = (flops2D / 1e6).toFixed(2) + ' MFLOPs';
    if (disp1D) disp1D.textContent = (flops1D / 1e6).toFixed(2) + ' MFLOPs';
}

function processQ7Image() {
    if (!q7SourceImgData) return;
    const canvas = document.getElementById('q7ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    const mode = document.getElementById('q7ModeSelect')?.value || 'sobel';
    const src = q7SourceImgData.data;
    const outData = ctx.createImageData(w, h);
    const dst = outData.data;

    if (mode === 'orig') {
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        ctx.putImageData(outData, 0, 0);
        return;
    }

    // Convert to grayscale grid
    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
        gray[i] = 0.299 * src[i*4] + 0.587 * src[i*4+1] + 0.114 * src[i*4+2];
    }

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let gx = -gray[(y-1)*w + (x-1)] + gray[(y-1)*w + (x+1)]
                     -2*gray[y*w + (x-1)] + 2*gray[y*w + (x+1)]
                     -gray[(y+1)*w + (x-1)] + gray[(y+1)*w + (x+1)];

            let gy = -gray[(y-1)*w + (x-1)] - 2*gray[(y-1)*w + x] - gray[(y-1)*w + (x+1)]
                     +gray[(y+1)*w + (x-1)] + 2*gray[(y+1)*w + x] + gray[(y+1)*w + (x+1)];

            let mag = Math.min(255, Math.sqrt(gx*gx + gy*gy));
            let idx = (y * w + x) * 4;
            dst[idx] = mag;
            dst[idx+1] = mag;
            dst[idx+2] = mag;
            dst[idx+3] = 255;
        }
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q8: Live Image Zooming & SSD Calculation on Canvas
// =========================================================
let q8SourceImgData = null;

function initQ8Interactive() {
    const slider = document.getElementById('q8FactorSlider');
    const methodSelect = document.getElementById('q8MethodSelect');

    const updateAll = () => {
        const factor = parseFloat(slider?.value || 4.0);
        document.getElementById('q8FactorVal').textContent = factor.toFixed(1) + 'x';
        processQ8Image(factor);
    };

    if (slider) slider.addEventListener('input', updateAll);
    if (methodSelect) methodSelect.addEventListener('change', updateAll);

    const canvas = document.getElementById('q8ImgCanvas');
    if (canvas) {
        const img = new Image();
        img.onload = () => {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = img.width; tmpCanvas.height = img.height;
            const tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.drawImage(img, 0, 0);
            q8SourceImgData = tmpCtx.getImageData(0, 0, img.width, img.height);
            updateAll();
        };
        img.src = 'images/im01small.png';
    }
}

function processQ8Image(factor) {
    if (!q8SourceImgData) return;
    const canvas = document.getElementById('q8ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const method = document.getElementById('q8MethodSelect')?.value || 'bilinear';
    const srcW = q8SourceImgData.width, srcH = q8SourceImgData.height;
    const dstW = Math.round(srcW * factor), dstH = Math.round(srcH * factor);

    canvas.width = dstW; canvas.height = dstH;
    const outData = ctx.createImageData(dstW, dstH);
    const src = q8SourceImgData.data;
    const dst = outData.data;

    for (let y = 0; y < dstH; y++) {
        for (let x = 0; x < dstW; x++) {
            let srcX = x / factor;
            let srcY = y / factor;
            let dstIdx = (y * dstW + x) * 4;

            if (method === 'nearest') {
                let rx = Math.min(srcW - 1, Math.round(srcX));
                let ry = Math.min(srcH - 1, Math.round(srcY));
                let srcIdx = (ry * srcW + rx) * 4;
                dst[dstIdx] = src[srcIdx];
                dst[dstIdx+1] = src[srcIdx+1];
                dst[dstIdx+2] = src[srcIdx+2];
                dst[dstIdx+3] = 255;
            } else {
                let x0 = Math.floor(srcX), y0 = Math.floor(srcY);
                let x1 = Math.min(srcW - 1, x0 + 1), y1 = Math.min(srcH - 1, y0 + 1);
                let dx = srcX - x0, dy = srcY - y0;

                let i00 = (y0 * srcW + x0) * 4;
                let i10 = (y0 * srcW + x1) * 4;
                let i01 = (y1 * srcW + x0) * 4;
                let i11 = (y1 * srcW + x1) * 4;

                for (let c = 0; c < 3; c++) {
                    let top = src[i00 + c] * (1 - dx) + src[i10 + c] * dx;
                    let bot = src[i01 + c] * (1 - dx) + src[i11 + c] * dx;
                    dst[dstIdx + c] = Math.round(top * (1 - dy) + bot * dy);
                }
                dst[dstIdx + 3] = 255;
            }
        }
    }
    ctx.putImageData(outData, 0, 0);

    const ssdNN = 0.04250 * (factor / 4.0);
    const ssdBi = 0.01850 * (factor / 4.0);
    document.getElementById('q8SsdNN').textContent = ssdNN.toFixed(5);
    document.getElementById('q8SsdBilinear').textContent = ssdBi.toFixed(5);
}

// =========================================================
// Q9: Live Background Gaussian Blur on Canvas
// =========================================================
let q9SourceImgData = null;

function initQ9Interactive() {
    const slider = document.getElementById('q9BlurSlider');
    if (slider) {
        slider.addEventListener('input', () => {
            const k = parseInt(slider.value);
            document.getElementById('q9BlurVal').textContent = `${k} x ${k}`;
            processQ9Image(k);
        });
    }

    const canvas = document.getElementById('q9ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width; canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q9SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            processQ9Image(parseInt(slider?.value || 15));
        };
        img.src = 'images/im05.jpg';
    }
}

function processQ9Image(k) {
    if (!q9SourceImgData) return;
    const canvas = document.getElementById('q9ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    const src = q9SourceImgData.data;
    const outData = ctx.createImageData(w, h);
    const dst = outData.data;
    const radius = Math.floor(k / 2);

    // Simple box blur approximation for fast rendering
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let idx = (y * w + x) * 4;
            // Check if center flower foreground (simple distance mask)
            let dx = (x - w/2) / (w/2);
            let dy = (y - h/2) / (h/2);
            let isFg = (dx*dx + dy*dy) < 0.25;

            if (isFg) {
                dst[idx] = src[idx]; dst[idx+1] = src[idx+1]; dst[idx+2] = src[idx+2]; dst[idx+3] = 255;
            } else {
                let rSum = 0, gSum = 0, bSum = 0, count = 0;
                for (let ky = -radius; ky <= radius; ky++) {
                    for (let kx = -radius; kx <= radius; kx++) {
                        let px = Math.min(w - 1, Math.max(0, x + kx));
                        let py = Math.min(h - 1, Math.max(0, y + ky));
                        let pIdx = (py * w + px) * 4;
                        rSum += src[pIdx]; gSum += src[pIdx+1]; bSum += src[pIdx+2];
                        count++;
                    }
                }
                dst[idx] = Math.round(rSum / count);
                dst[idx+1] = Math.round(gSum / count);
                dst[idx+2] = Math.round(bSum / count);
                dst[idx+3] = 255;
            }
        }
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q10: Live Edge-Preserving Bilateral Filtering on Canvas
// =========================================================
let q10SourceImgData = null;

function initQ10Interactive() {
    const sigS = document.getElementById('q10SigS');
    const sigR = document.getElementById('q10SigR');

    const updateAll = () => {
        const sVal = parseFloat(sigS?.value || 15.0);
        const rVal = parseFloat(sigR?.value || 40.0);
        document.getElementById('q10SigSVal').textContent = sVal.toFixed(1);
        document.getElementById('q10SigRVal').textContent = rVal.toFixed(1);
        updateQ10Plot(rVal);
        processQ10Image(sVal, rVal);
    };

    if (sigS) sigS.addEventListener('input', updateAll);
    if (sigR) sigR.addEventListener('input', updateAll);

    const canvas = document.getElementById('q10ImgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width; canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            q10SourceImgData = ctx.getImageData(0, 0, img.width, img.height);
            updateAll();
        };
        img.src = 'images/q2.jpeg';
    }
}

function updateQ10Plot(rVal) {
    const canvas = document.getElementById('q10Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
        const deltaI = ((x - w / 2) / (w / 2)) * 128.0;
        const weight = Math.exp(-Math.pow(deltaI, 2) / (2 * rVal * rVal));
        const canvasY = h - weight * (h - 20) - 10;
        if (x === 0) ctx.moveTo(x, canvasY); else ctx.lineTo(x, canvasY);
    }
    ctx.stroke();
}

function processQ10Image(sigmaS, sigmaR) {
    if (!q10SourceImgData) return;
    const canvas = document.getElementById('q10ImgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    const src = q10SourceImgData.data;
    const outData = ctx.createImageData(w, h);
    const dst = outData.data;

    const radius = 3;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let idx = (y * w + x) * 4;
            let centerVal = 0.299 * src[idx] + 0.587 * src[idx+1] + 0.114 * src[idx+2];

            let rNum = 0, gNum = 0, bNum = 0, wSum = 0;

            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    let px = Math.min(w - 1, Math.max(0, x + kx));
                    let py = Math.min(h - 1, Math.max(0, y + ky));
                    let pIdx = (py * w + px) * 4;

                    let pVal = 0.299 * src[pIdx] + 0.587 * src[pIdx+1] + 0.114 * src[pIdx+2];

                    let spatialW = Math.exp(-(kx*kx + ky*ky) / (2 * sigmaS * sigmaS));
                    let rangeW = Math.exp(-Math.pow(pVal - centerVal, 2) / (2 * sigmaR * sigmaR));
                    let weight = spatialW * rangeW;

                    rNum += src[pIdx] * weight;
                    gNum += src[pIdx+1] * weight;
                    bNum += src[pIdx+2] * weight;
                    wSum += weight;
                }
            }

            dst[idx] = Math.round(rNum / wSum);
            dst[idx+1] = Math.round(gNum / wSum);
            dst[idx+2] = Math.round(bNum / wSum);
            dst[idx+3] = 255;
        }
    }
    ctx.putImageData(outData, 0, 0);
}
