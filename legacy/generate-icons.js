#!/usr/bin/env node
// generate-icons.js — Creates PWA icons using HTML5 Canvas via node-canvas

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = path.join(__dirname, 'icons');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const r = size * 0.22;

    // Background gradient - deep blue to black
    const bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, '#0D2144');
    bg.addColorStop(1, '#050A14');
    ctx.fillStyle = bg;

    // Rounded rectangle
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Outer glow ring
    const glow = ctx.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.5);
    glow.addColorStop(0, 'rgba(74, 158, 255, 0.15)');
    glow.addColorStop(1, 'rgba(74, 158, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Gold circle ring
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.38, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.lineWidth = size * 0.025;
    ctx.stroke();

    // Trident emoji (🔱) centered
    ctx.fillStyle = '#FFFFFF';
    const fontSize = size * 0.42;
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔱', size / 2, size / 2);

    return canvas;
}

SIZES.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✓ icon-${size}.png`);
});

// Also create a screenshot placeholder
const sc = createCanvas(1280, 720);
const sctx = sc.getContext('2d');
const scBg = sctx.createLinearGradient(0, 0, 1280, 720);
scBg.addColorStop(0, '#050A14');
scBg.addColorStop(1, '#0A1628');
sctx.fillStyle = scBg;
sctx.fillRect(0, 0, 1280, 720);
sctx.fillStyle = '#FFFFFF';
sctx.font = '60px serif';
sctx.textAlign = 'center';
sctx.textBaseline = 'middle';
sctx.fillText('🔱 DeOs Discipline', 640, 360);
fs.writeFileSync(path.join(OUT_DIR, 'screenshot-wide.png'), sc.toBuffer('image/png'));
console.log('✓ screenshot-wide.png');
console.log('\nAll icons generated successfully!');
