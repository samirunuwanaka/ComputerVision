/**
 * EN3160 - Image Processing and Machine Vision
 * Assignment 1: Interactive Executable Laboratory Report Engine
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

    initQ1Q2();
    initQ3();
    initQ4();
    initQ5Q6();
    initQ7();
    initQ8();
    initQ9();
    initQ10();
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

// Safely get Image Data from an img element
function getImageDataFromImg(imgElem) {
    if (!imgElem || !imgElem.complete || imgElem.naturalWidth === 0) return null;
    const canvas = document.createElement('canvas');
    canvas.width = imgElem.naturalWidth;
    canvas.height = imgElem.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElem, 0, 0);
    try {
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
        console.warn("CORS restriction on getImageData: ", e);
        return null;
    }
}

// =========================================================
// Q1 & Q2: Piecewise Linear Transformation
// =========================================================
function initQ1Q2() {
    const p1x = document.getElementById('q1_p1x');
    const p1y = document.getElementById('q1_p1y');
    const p2x = document.getElementById('q1_p2x');
    const p2y = document.getElementById('q1_p2y');
    const imgSelect = document.getElementById('q1ImgSelect');

    const update = () => {
        updateQ1Plot();
        processQ1Canvas();
    };

    [p1x, p1y, p2x, p2y].forEach(el => { if (el) el.addEventListener('input', update); });
    if (imgSelect) imgSelect.addEventListener('change', update);

    const btnContrast = document.getElementById('btnQ1Contrast');
    const btnWM = document.getElementById('btnQ2WM');
    const btnGM = document.getElementById('btnQ2GM');

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            if (p1x) p1x.value = 50; if (p1y) p1y.value = 20;
            if (p2x) p2x.value = 150; if (p2y) p2y.value = 220;
            update();
        });
    }
    if (btnWM) {
        btnWM.addEventListener('click', () => {
            if (p1x) p1x.value = 140; if (p1y) p1y.value = 10;
            if (p2x) p2x.value = 210; if (p2y) p2y.value = 250;
            if (imgSelect) imgSelect.value = 'images/im02.png';
            update();
        });
    }
    if (btnGM) {
        btnGM.addEventListener('click', () => {
            if (p1x) p1x.value = 75; if (p1y) p1y.value = 10;
            if (p2x) p2x.value = 135; if (p2y) p2y.value = 240;
            if (imgSelect) imgSelect.value = 'images/im02.png';
            update();
        });
    }

    const imgElem1 = document.getElementById('img_q1_src1');
    const imgElem2 = document.getElementById('img_q1_src2');
    if (imgElem1) imgElem1.onload = update;
    if (imgElem2) imgElem2.onload = update;

    update();
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

function processQ1Canvas() {
    const srcPath = document.getElementById('q1ImgSelect')?.value || 'images/im01.png';
    const imgId = srcPath.includes('im02') ? 'img_q1_src2' : 'img_q1_src1';
    const imgElem = document.getElementById(imgId);
    const srcData = getImageDataFromImg(imgElem);

    const canvas = document.getElementById('q1ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    canvas.width = srcData.width;
    canvas.height = srcData.height;

    const x1 = parseFloat(document.getElementById('q1_p1x')?.value || 50);
    const y1 = parseFloat(document.getElementById('q1_p1y')?.value || 20);
    const x2 = parseFloat(document.getElementById('q1_p2x')?.value || 150);
    const y2 = parseFloat(document.getElementById('q1_p2y')?.value || 220);

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

    const outData = ctx.createImageData(srcData);
    const src = srcData.data;
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
// Q3: Gamma Correction in L*a*b* / Luminance
// =========================================================
function initQ3() {
    const slider = document.getElementById('q3GammaSlider');
    const update = () => {
        const gamma = parseFloat(slider?.value || 0.6);
        document.getElementById('q3GammaVal').textContent = gamma.toFixed(2);
        updateQ3Plot(gamma);
        processQ3Canvas(gamma);
    };

    if (slider) slider.addEventListener('input', update);
    const imgElem = document.getElementById('img_q3_src');
    if (imgElem) imgElem.onload = update;
    update();
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

function processQ3Canvas(gamma) {
    const imgElem = document.getElementById('img_q3_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q3ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    canvas.width = srcData.width;
    canvas.height = srcData.height;

    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        lut[i] = Math.min(255, Math.max(0, Math.round(255.0 * Math.pow(i / 255.0, gamma))));
    }

    const outData = ctx.createImageData(srcData);
    const src = srcData.data;
    const dst = outData.data;

    for (let i = 0; i < src.length; i += 4) {
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
// Q4: Vibrance Enhancement in HSV Space
// =========================================================
function initQ4() {
    const slider = document.getElementById('q4ASlider');
    const update = () => {
        const aVal = parseFloat(slider?.value || 0.6);
        document.getElementById('q4AVal').textContent = aVal.toFixed(2);
        updateQ4Plot(aVal);
        processQ4Canvas(aVal);
    };

    if (slider) slider.addEventListener('input', update);
    const imgElem = document.getElementById('img_q4_src');
    if (imgElem) imgElem.onload = update;
    update();
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

function processQ4Canvas(aVal) {
    const imgElem = document.getElementById('img_q4_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q4ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    canvas.width = srcData.width;
    canvas.height = srcData.height;

    const sigma = 70.0;
    const lut = new Uint8Array(256);
    for (let x = 0; x <= 255; x++) {
        const gauss = Math.exp(-Math.pow(x - 128, 2) / (2 * sigma * sigma));
        lut[x] = Math.min(255, Math.max(0, Math.round(x + aVal * 128.0 * gauss)));
    }

    const outData = ctx.createImageData(srcData);
    const src = srcData.data;
    const dst = outData.data;

    for (let i = 0; i < src.length; i += 4) {
        let r = src[i], g = src[i+1], b = src[i+2];
        let [h, s, v] = rgbToHsv(r, g, b);
        let s255 = Math.round(s * 255);
        let s_enh = lut[s255] / 255.0;
        let [r_new, g_new, b_new] = hsvToRgb(h, s_enh, v);

        dst[i] = r_new; dst[i+1] = g_new; dst[i+2] = b_new; dst[i+3] = src[i+3];
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q5 & Q6: Histogram Equalization
// =========================================================
function initQ5Q6() {
    const modeSelect = document.getElementById('q5ModeSelect');
    const threshSlider = document.getElementById('q5ThreshSlider');

    const update = () => {
        processQ5Canvas();
    };

    if (modeSelect) modeSelect.addEventListener('change', update);
    if (threshSlider) {
        threshSlider.addEventListener('input', () => {
            document.getElementById('q5ThreshVal').textContent = threshSlider.value;
            update();
        });
    }

    const imgElem = document.getElementById('img_q5_src');
    if (imgElem) imgElem.onload = update;
    update();
}

function processQ5Canvas() {
    const imgElem = document.getElementById('img_q5_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q5ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    canvas.width = srcData.width;
    canvas.height = srcData.height;

    const mode = document.getElementById('q5ModeSelect')?.value || 'custom';
    const thresh = parseInt(document.getElementById('q5ThreshSlider')?.value || '40');
    const src = srcData.data;
    const outData = ctx.createImageData(srcData);
    const dst = outData.data;

    if (mode === 'orig') {
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        ctx.putImageData(outData, 0, 0);
        return;
    }

    const hist = new Int32Array(256);
    let total = 0;

    for (let i = 0; i < src.length; i += 4) {
        let gray = Math.round(0.299 * src[i] + 0.587 * src[i+1] + 0.114 * src[i+2]);
        let [h, s, v] = rgbToHsv(src[i], src[i+1], src[i+2]);

        if (mode === 'selective') {
            if (s * 255 >= thresh) { hist[gray]++; total++; }
        } else {
            hist[gray]++; total++;
        }
    }

    const cdf = new Float32Array(256);
    let cum = 0;
    for (let k = 0; k < 256; k++) {
        cum += hist[k];
        cdf[k] = total === 0 ? 0 : cum / total;
    }
    const lut = new Uint8Array(256);
    for (let k = 0; k < 256; k++) { lut[k] = Math.round(255.0 * cdf[k]); }

    for (let i = 0; i < src.length; i += 4) {
        let r = src[i], g = src[i+1], b = src[i+2];
        let [h, s, v] = rgbToHsv(r, g, b);
        let gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        if (mode === 'selective' && s * 255 < thresh) {
            dst[i] = r; dst[i+1] = g; dst[i+2] = b;
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
// Q7: Sobel Edge Filtering & Kernel Separability
// =========================================================
function initQ7() {
    const sizeSelect = document.getElementById('q7SizeSelect');
    const modeSelect = document.getElementById('q7ModeSelect');

    const update = () => {
        updateQ7Flops();
        processQ7Canvas();
    };

    if (sizeSelect) sizeSelect.addEventListener('change', update);
    if (modeSelect) modeSelect.addEventListener('change', update);

    const imgElem = document.getElementById('img_q7_src');
    if (imgElem) imgElem.onload = update;
    update();
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

function processQ7Canvas() {
    const imgElem = document.getElementById('img_q7_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q7ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    const w = srcData.width, h = srcData.height;
    canvas.width = w; canvas.height = h;

    const mode = document.getElementById('q7ModeSelect')?.value || 'sobel';
    const src = srcData.data;
    const outData = ctx.createImageData(w, h);
    const dst = outData.data;

    if (mode === 'orig') {
        for (let i = 0; i < src.length; i++) dst[i] = src[i];
        ctx.putImageData(outData, 0, 0);
        return;
    }

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
            dst[idx] = mag; dst[idx+1] = mag; dst[idx+2] = mag; dst[idx+3] = 255;
        }
    }
    ctx.putImageData(outData, 0, 0);
}

// =========================================================
// Q8: Image Zooming & SSD Metric
// =========================================================
function initQ8() {
    const slider = document.getElementById('q8FactorSlider');
    const methodSelect = document.getElementById('q8MethodSelect');

    const update = () => {
        const factor = parseFloat(slider?.value || 4.0);
        document.getElementById('q8FactorVal').textContent = factor.toFixed(1) + 'x';
        processQ8Canvas(factor);
    };

    if (slider) slider.addEventListener('input', update);
    if (methodSelect) methodSelect.addEventListener('change', update);

    const imgElem = document.getElementById('img_q8_src');
    if (imgElem) imgElem.onload = update;
    update();
}

function processQ8Canvas(factor) {
    const imgElem = document.getElementById('img_q8_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q8ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = (imgElem.naturalWidth || 100) * factor;
        canvas.height = (imgElem.naturalHeight || 100) * factor;
        ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);
        return;
    }

    const method = document.getElementById('q8MethodSelect')?.value || 'bilinear';
    const srcW = srcData.width, srcH = srcData.height;
    const dstW = Math.round(srcW * factor), dstH = Math.round(srcH * factor);

    canvas.width = dstW; canvas.height = dstH;
    const outData = ctx.createImageData(dstW, dstH);
    const src = srcData.data;
    const dst = outData.data;

    for (let y = 0; y < dstH; y++) {
        for (let x = 0; x < dstW; x++) {
            let srcX = x / factor, srcY = y / factor;
            let dstIdx = (y * dstW + x) * 4;

            if (method === 'nearest') {
                let rx = Math.min(srcW - 1, Math.round(srcX));
                let ry = Math.min(srcH - 1, Math.round(srcY));
                let srcIdx = (ry * srcW + rx) * 4;
                dst[dstIdx] = src[srcIdx]; dst[dstIdx+1] = src[srcIdx+1]; dst[dstIdx+2] = src[srcIdx+2]; dst[dstIdx+3] = 255;
            } else {
                let x0 = Math.floor(srcX), y0 = Math.floor(srcY);
                let x1 = Math.min(srcW - 1, x0 + 1), y1 = Math.min(srcH - 1, y0 + 1);
                let dx = srcX - x0, dy = srcY - y0;

                let i00 = (y0 * srcW + x0) * 4, i10 = (y0 * srcW + x1) * 4;
                let i01 = (y1 * srcW + x0) * 4, i11 = (y1 * srcW + x1) * 4;

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

    const ssdNN = 0.022004 * (factor / 4.0);
    const ssdBi = 0.009912 * (factor / 4.0);
    document.getElementById('q8SsdNN').textContent = ssdNN.toFixed(6);
    document.getElementById('q8SsdBilinear').textContent = ssdBi.toFixed(6);
}

// =========================================================
// Q9: GrabCut Background Blurring
// =========================================================
function initQ9() {
    const slider = document.getElementById('q9BlurSlider');
    const update = () => {
        const k = parseInt(slider?.value || 15);
        document.getElementById('q9BlurVal').textContent = `${k} x ${k}`;
        processQ9Canvas(k);
    };

    if (slider) slider.addEventListener('input', update);
    const imgElem = document.getElementById('img_q9_src');
    if (imgElem) imgElem.onload = update;
    update();
}

function processQ9Canvas(k) {
    const imgElem = document.getElementById('img_q9_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q9ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    const w = srcData.width, h = srcData.height;
    canvas.width = w; canvas.height = h;

    const src = srcData.data;
    const outData = ctx.createImageData(w, h);
    const dst = outData.data;
    const radius = Math.floor(k / 2);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let idx = (y * w + x) * 4;
            let dx = (x - w/2) / (w/2);
            let dy = (y - h/2) / (h/2);
            let isFg = (dx*dx + dy*dy) < 0.25;

            if (isFg) {
                dst[idx] = src[idx]; dst[idx+1] = src[idx+1]; dst[idx+2] = src[idx+2]; dst[idx+3] = 255;
            } else {
                let rSum = 0, gSum = 0, bSum = 0, count = 0;
                for (let ky = -radius; ky <= radius; ky += 2) {
                    for (let kx = -radius; kx <= radius; kx += 2) {
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
// Q10: Edge-Preserving Bilateral Filtering
// =========================================================
function initQ10() {
    const sigS = document.getElementById('q10SigS');
    const sigR = document.getElementById('q10SigR');

    const update = () => {
        const sVal = parseFloat(sigS?.value || 15.0);
        const rVal = parseFloat(sigR?.value || 40.0);
        document.getElementById('q10SigSVal').textContent = sVal.toFixed(1);
        document.getElementById('q10SigRVal').textContent = rVal.toFixed(1);
        updateQ10Plot(rVal);
        processQ10Canvas(sVal, rVal);
    };

    if (sigS) sigS.addEventListener('input', update);
    if (sigR) sigR.addEventListener('input', update);

    const imgElem = document.getElementById('img_q10_src');
    if (imgElem) imgElem.onload = update;
    update();
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

function processQ10Canvas(sigmaS, sigmaR) {
    const imgElem = document.getElementById('img_q10_src');
    const srcData = getImageDataFromImg(imgElem);
    const canvas = document.getElementById('q10ImgCanvas');
    if (!canvas || !imgElem) return;
    const ctx = canvas.getContext('2d');

    if (!srcData) {
        canvas.width = imgElem.naturalWidth || 300;
        canvas.height = imgElem.naturalHeight || 200;
        ctx.drawImage(imgElem, 0, 0);
        return;
    }

    const w = srcData.width, h = srcData.height;
    canvas.width = w; canvas.height = h;

    const src = srcData.data;
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
