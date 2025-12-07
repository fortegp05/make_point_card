// DOM要素の取得
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

// 入力要素の取得
const shopNameInput = document.getElementById('shopName');
const cardTitleInput = document.getElementById('cardTitle');
const pointCountInput = document.getElementById('pointCount');
const benefitInput = document.getElementById('benefit');
const backgroundColorInput = document.getElementById('backgroundColor');
const backgroundImageInput = document.getElementById('backgroundImage');
const clearImageBtn = document.getElementById('clearImageBtn');
const accentColorInput = document.getElementById('accentColor');
const createdByInput = document.getElementById('createdBy');

// 背景画像を保持する変数
let backgroundImage = null;

// レイアウト定数
const LAYOUT = {
    shopNameY: 60,        // 店舗名のY座標
    cardTitleY: 120,      // カードタイトルのY座標
    benefitY: 165,        // 特典内容のY座標
    pointGridStartY: 210  // ポイントグリッド開始Y座標
};

// カードを描画する関数
function drawCard() {
    const width = canvas.width;
    const height = canvas.height;

    // 入力値の取得
    const shopName = shopNameInput.value || 'お店の名前';
    const cardTitle = cardTitleInput.value || 'ポイントカード';
    const pointCount = parseInt(pointCountInput.value);
    const benefit = benefitInput.value || '特典内容';
    const bgColor = backgroundColorInput.value;
    const accentColor = accentColorInput.value;
    const createdBy = createdByInput.value;

    // 背景を描画（画像がある場合は画像、ない場合は色）
    if (backgroundImage) {
        // 画像をキャンバス全体にフィットさせて描画
        ctx.drawImage(backgroundImage, 0, 0, width, height);

        // 画像を60%暗くするために黒い半透明オーバーレイを追加
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, width, height);
    } else {
        // 背景色を塗りつぶす
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    // 背景画像がある場合は明るい色、ない場合は暗い色を使用
    const textColor = backgroundImage ? '#e8e8e8' : '#333';
    const lightTextColor = backgroundImage ? '#d0d0d0' : '#666';

    // 店舗名を描画
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(shopName, width / 2, LAYOUT.shopNameY);

    // カードタイトルを描画
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = backgroundImage ? '#f5f5f5' : accentColor;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(cardTitle, width / 2, LAYOUT.cardTitleY);

    // 特典内容を描画
    ctx.fillStyle = textColor;
    ctx.font = 'bold 22px sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(benefit, width / 2, LAYOUT.benefitY);

    // ポイント欄を描画
    drawPointGrid(pointCount, accentColor, backgroundImage);

    // クレジット表示（右下）
    if (createdBy) {
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = lightTextColor;
        ctx.fillText(`Created by ${createdBy}`, width - 20, height - 15);
    }

    // Canvasの内容をimgタグに変換
    previewImage.src = canvas.toDataURL('image/png');
}

// ポイントグリッドを描画
function drawPointGrid(count, color, hasBackgroundImage) {
    const width = canvas.width;
    const circleRadius = 30;
    const pointSpacing = 80; // ポイント間の間隔

    // グリッドのレイアウトを計算
    let cols, rows;
    if (count <= 5) {
        cols = 5;
        rows = 1;
    } else if (count <= 10) {
        cols = 5;
        rows = 2;
    } else if (count <= 15) {
        cols = 5;
        rows = 3;
    } else {
        cols = 5;
        rows = 4;
    }

    // X軸はセンタリング
    const gridWidth = (cols - 1) * pointSpacing;
    const startX = (width - gridWidth) / 2;

    // ポイント欄を描画
    let pointIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (pointIndex >= count) break;

            const x = startX + col * pointSpacing;
            const y = LAYOUT.pointGridStartY + row * pointSpacing;

            // 円を描画
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = hasBackgroundImage ? 'rgba(255, 255, 255, 0.9)' : 'white';
            ctx.fill();
            ctx.strokeStyle = hasBackgroundImage ? '#e0e0e0' : color;
            ctx.lineWidth = 3;
            ctx.stroke();

            // ポイント番号を描画
            ctx.fillStyle = hasBackgroundImage ? '#666' : color;
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((pointIndex + 1).toString(), x, y);

            pointIndex++;
        }
    }
}

// 画像をダウンロードする関数
function downloadCard() {
    const link = document.createElement('a');
    link.download = 'point-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 背景画像を読み込む関数
function loadBackgroundImage(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                backgroundImage = img;
                drawCard();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 背景画像をクリアする関数
function clearBackgroundImage() {
    backgroundImage = null;
    backgroundImageInput.value = '';
    drawCard();
}

// イベントリスナーの設定
generateBtn.addEventListener('click', drawCard);
downloadBtn.addEventListener('click', downloadCard);
backgroundImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        loadBackgroundImage(file);
    }
});
clearImageBtn.addEventListener('click', clearBackgroundImage);

// ページ読み込み時に初期カードを生成
window.addEventListener('load', drawCard);

// 入力値が変更されたときにリアルタイムでプレビューを更新
const inputs = [
    shopNameInput,
    cardTitleInput,
    pointCountInput,
    benefitInput,
    backgroundColorInput,
    accentColorInput,
    createdByInput
];

inputs.forEach(input => {
    input.addEventListener('input', drawCard);
    input.addEventListener('change', drawCard);
});
