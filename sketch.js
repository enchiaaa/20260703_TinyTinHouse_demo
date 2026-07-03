let colorPalette, darkColorPalette, lightColorPalette, basePalette;
let padding = 400

// 設定此次要使用的條件
const activeSurface = SURFACE.wallLight;

async function setup() {
    createCanvas(2000, 1400);
    colorMode(HSB);
    background(activeSurface.palette.baseColor);
    
    // 牆
    drawBaseLayer(activeSurface.palette.colors);
    drawWall();
    let colors = colors.map((clr) => lerpColor(color(clr), color("#fff"), 0.3));
    drawTextureLine(activeSurface.lineDirection, colors);

    // 深綠的門
    // drawBaseLayer(activeSurface.palette.colors);
    // drawDoor();
    // drawTextureLine(activeSurface.lineDirection, activeSurface.palette.colors)

    // 屋頂
    // drawRoof(activeSurface.palette.colors);

    // 只畫一次
    noLoop();
}

function drawWall(){
    if(activeSurface.textureStyle == STYLE.texture.patchwork){
        drawPatch(activeSurface.palette.colors);
    }
    else if(activeSurface.textureStyle == STYLE.texture.scattered){
        drawScatter(activeSurface.palette.colors);
    }
}

// 畫屋頂
// 1. grid 的長度設為 height，做橫向排列
// 2. 交替使用深、中、淺色，以呈現鐵皮凹凸
// 3. 畫上 roofSpan = 300 的波浪，作為鐵皮之間的接縫
function drawRoof(colors){
    let xSum = 0;

    const R = 3;
    const xSpan = 2;
    const ySpan = R + 2;
    const xCount = 10;
    const yCount = height / ySpan;

    // 定義深、中、淺色
    let darkColors = colors.map((clr) => lerpColor(color(clr), color("#000"), 0.3));
    let midColors = colors.map((clr) => lerpColor(color(clr), color("#000"), 0.12));
    let lightColors = colors.map((clr) => lerpColor(color(clr), color("#fff"), 0.2));
   
    const tonePalettes = [
        darkColors,
        midColors,
        lightColors,
    ];

    let columnIndex = 0;

    // 畫出整個屋頂的 grid，直到 xSum 超過畫布寬度
    while (xSum < width){
        const selectedColors = tonePalettes[columnIndex % tonePalettes.length]; // 交替使用
        drawRoofGrid(xSum, 0, xCount, yCount, xSpan, ySpan, R, selectedColors);
        xSum += xSpan * xCount;
        columnIndex++;
    }

    drawRoofWaves(300, colors);
}


// x: 起始x座標, y: 起始y座標, xCount: x方向點點排數, yCount: y方向點點排數, xSpan: x方向間距, ySpan: y方向間距, R: 點點大小
function drawRoofGrid(x, y, xCount, yCount, xSpan, ySpan, R, palette) {
    let mainClr = random(palette); // 隨機選一個顏色
    let fade_scale = random(); // 0-1

    let mainHue = hue(mainClr);
    let mainSat = saturation(mainClr);
    let mainBri = brightness(mainClr);

    let lightClr = color(mainHue, mainSat - 10, mainBri + 50); 

    // 繪製點點矩陣
    for (let i = 0; i < xCount; i++) {
        let px = i * xSpan + x; // 計算 x 座標
        for (let j = 0; j < yCount; j++) {
            let py = j * ySpan + y; // 計算 y 座標

            let fade_rate = j / yCount; // 0-1
            fade_rate = map(fade_rate, 0, 1, 0, fade_scale);  // remap fade_rate from [0, 1] to [0, fade_scale]

            if (random() > fade_rate) {
                push(); // 儲存畫布目前狀態
                translate(px, py); // 移動畫布原點

                let r = R * random(0.8, 1.5);
                
                clr = abs(sin(px / 10)) < 0.15 ? lightClr : mainClr;
                
                if(random() > 0.3){
                    fill(clr);
                    noStroke(); // 不要外框線
                    circle(0, 0, r); // 
                }
                else{
                    stroke(clr);
                    noFill();
                    strokeWeight(random(1, 2));
                    line(r, r, -r, -r);
                    line(r, -r, -r, r);
                    line(-r, 0, r, 0);
                    line(0, -r, 0, r);
                }

                if(random() < activeSurface.effects.whitePaintChance){
                    let c = color("#fff");
                    c.setAlpha(random(0.2, 0.8)); // 在 HSB 模式下，Alpha 預設範圍是 0~1
                    noStroke();
                    fill(c);
                    ellipse_width = random(activeSurface.ellipse.width.min, activeSurface.ellipse.width.max);
                    ellipse_height = random(activeSurface.ellipse.height.min, activeSurface.ellipse.height.max);
                    ellipse(0, 0, ellipse_width, ellipse_height);
                }

                pop(); // 回復至畫布先前狀態
            }
        }
    }
}

// x: 起始x座標, y: 起始y座標, xCount: x方向點點排數, yCount: y方向點點排數, xSpan: x方向間距, ySpan: y方向間距, R: 點點大小
function drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, palette) {
    let mainClr = random(palette);  // 隨機選一個顏色
    let fade_scale = random();      // 0-1

    let mainHue = hue(mainClr);
    let mainSat = saturation(mainClr);
    let mainBri = brightness(mainClr);

    let darkClr = lerpColor(color(mainClr), color("#000"), 0.4);
    let lightClr = color(mainHue, mainSat - 10, mainBri + activeSurface.effects.lightBrightnessBoost); 

    // 設定漸層，讓左上方的顏色較亮，右下方的顏色較暗
    // 左上：x + y 越小，lightAmount 越大，顏色越亮
    // 右下：x + y 越大，lightAmount 越小，顏色越暗
    let lightAmount = map(x + y, 0, width + height, 1, 0);
    lightAmount = constrain(lightAmount, 0, 1);                 // 確保 lightAmount 在 0-1 範圍內
    let wallClr = lerpColor(darkClr, lightClr, lightAmount);    // 根據 lightAmount 混合顏色

    // 設定 noise 生鏽參數 -----------------------------------------------
    let noiseStep = 0.002; // 波型取樣距離，小->波型變化小；大->波型變化大
    let sharpness = 0.1; // 銳利取樣範圍，大->比較不銳利；銳利畫取樣範圍，小-> 邊緣銳利
    let noiseRnd = random();

    // 繪製點點矩陣
    for (let i = 0; i < xCount; i++) {
        let px = i * xSpan + x;         // 計算 x 座標
        for (let j = 0; j < yCount; j++) {
            let py = j * ySpan + y;     // 計算 y 座標

            let fade_rate = j / yCount; // 0-1
            fade_rate = map(fade_rate, 0, 1, 0, fade_scale);  // remap fade_rate from [0, 1] to [0, fade_scale]

            if (random() > fade_rate) {
                push();             // 儲存畫布目前狀態
                translate(px, py);  // 移動畫布原點

                // 繪製 noise 生鏽 -----------------------------------------------
                if (noiseRnd < 0.5) {
                    let off = noise(px * noiseStep, py * noiseStep);
                    let valley = abs(sin(px / 20));
                    let offStroke = constrain(map(off, 0.5 - sharpness, 0.5 + sharpness, 0, 1)*R * 3, 0, R * 3) * valley * 0.7;

                    // 設定生鏽顏色，根據 y 座標來決定顏色深淺，越往下越深
                    let rustDark = color(activeSurface.palette.rustDarkColor);
                    let rustLight = color(activeSurface.palette.rustLightColor);
                    let lightAmount = constrain(map(y, 0, height, 1, 0), 0, 1);
                    let rustClr = lerpColor(
                        rustDark,
                        rustLight,
                        lightAmount
                    );

                    stroke(rustClr);
                    noFill();
                    strokeWeight(2);
                    circle(0, 0, offStroke);
                }


                let r = R * random(0.8, 1.5);
                let clr = abs(sin(px / 10)) < 0.15 ? lightClr : wallClr;

                if(random() > 0.3){
                    fill(clr);
                    noStroke();
                    circle(0, 0, r);
                }
                else{
                    // 畫米字
                    stroke(clr);
                    noFill();
                    strokeWeight(random(1, 2));
                    line(r, r, -r, -r);
                    line(r, -r, -r, r);
                    line(-r, 0, r, 0);
                    line(0, -r, 0, r);
                }

                // 畫白色油漆效果
                if(random() < activeSurface.effects.whitePaint.chance){
                    let c = color("#fff");
                    c.setAlpha(random(activeSurface.effects.whitePaint.alpha.min, activeSurface.effects.whitePaint.alpha.max)); // 在 HSB 模式下，Alpha 預設範圍是 0~1
                    noStroke();
                    fill(c);
                    ellipse_width = random(activeSurface.ellipse.width.min, activeSurface.ellipse.width.max);
                    ellipse_height = random(activeSurface.ellipse.height.min, activeSurface.ellipse.height.max);
                    ellipse(0, 0, ellipse_width, ellipse_height);
                }

                pop(); // 回復至畫布先前狀態
            }
        }
    }
}

// 計算屋頂波浪的 y 座標
function getRoofWaveY(x) {
  return (
    sin(x * 0.08) * 3 +
    sin(x * 0.21)
  ) * 2;
}

// 畫波浪(用於屋頂)
function drawRoofWaves(roofSpan = 300, colors) {
  for (let i = 0; i < 5; i++) {
    let mainClr = color(random(colors));
    let darkClr = lerpColor(mainClr, color("#000"), 0.6);

    let shadowClr = color("#000000");
    shadowClr.setAlpha(0.25);

    push();
    translate(0, roofSpan * (i + 1));

    // 畫出屋頂的漸層陰影
    drawSeamGradientShadow(15);

    noFill();

    // 畫出屋頂的波浪線條
    stroke(darkClr);
    strokeWeight(3);

    beginShape();

    for (let x = 0; x < width; x++) {
      let y = getRoofWaveY(x);
      vertex(x, y);
    }

    endShape();

    pop();
  }
}

// 畫出屋頂 接縫的漸層陰影
// maxDistance: 陰影向下延伸的最大距離
function drawSeamGradientShadow(maxDistance = 15) {
  noFill();

  for (let offset = maxDistance; offset >= 1; offset--) {
    // offset 越小，越靠近接縫，透明度越高
    let fadeRate = 1 - offset / maxDistance;
    let alpha = pow(fadeRate, 2) * 0.3;

    let shadowClr = color("#000000");
    shadowClr.setAlpha(alpha);

    stroke(shadowClr);
    strokeWeight(2);

    beginShape();

    for (let x = 0; x < width; x++) {
      let y = getRoofWaveY(x);
      vertex(x, y + offset);
    }

    endShape();
  }
}

// 畫背景層
function drawBaseLayer(colors){
    let xsum = 0;
    for (let i = 0; i < 30; i++){
        let x = xsum;
        let y = 0;
        let xCount = int(random(10, 40));
        let yCount = 1400;
        let R = 4;
        let xSpan = R + random(2, 5);
        let ySpan = R + random(3);
        drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
        xsum += xSpan * xCount;
    }
}

// 畫分散的色塊
function drawScatter(colors){
    for (let i = 0; i < 200; i++) {
        let x = random(-padding, width);
        let y = random(-padding, height);
        let xCount = int(random(activeSurface.grid.xCount.min, activeSurface.grid.xCount.max));
        let yCount = int(random(activeSurface.grid.yCount.min, activeSurface.grid.yCount.max));
        let R = 4;
        let xSpan = R + random(2, 5);
        let ySpan = R + random(5);
        drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
        // await sleep(10);
    }
}

// 畫排列的色塊
function drawPatch(colors){
    let xSum = 0, ySum = 0;
    let xSpan, ySpan, xCount, yCount = 110;
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            let R = 3;
            xSpan = 2
            ySpan = R + 2;
            xCount = int(random(50, 250));
            let x = xSum;
            let y = ySum;

            if(j < 3){
                drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
            }
            else{
                drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
            }
            
            xSum += xSpan * xCount;
        }
        xSum = 0;
        ySum += ySpan * yCount;
        yCount = random(yCount - 25, yCount - 20);
    }
}

// 畫線(指定直的或橫的)
function drawTextureLine(direction, colors){
    if(direction == STYLE.lineDirection.vertical){
        xsum = 0;
        for (let i = 0; i < 15; i++) {
            let R = 3;
            let xSpan = 2
            let ySpan = R + 2;
            let xCount = 2;
            let yCount = 1000;
            let x = xsum;
            let y = 0;

            drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
            drawGrid(x + 15, y, xCount, yCount, xSpan, ySpan, R, colors);

            xsum += random(50, 300);
        }
    }
    else if(direction == STYLE.lineDirection.horizontal){
        ysum = 0;
        for (let i = 0; i < 15; i++) {
            let R = 3;
            let xSpan = R + 2
            let ySpan = R;
            let xCount = 1000;
            let yCount = 2;
            let x = 0;
            let y = ysum;

            drawGrid(x, y, xCount, yCount, xSpan, ySpan, R, colors);
            drawGrid(x, y + 15, xCount, yCount, xSpan, ySpan, R, colors);

            ysum += random(50, 300);
        }
    }

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function drawDoor(){
    drawScatter(activeSurface.palette.colors);
}