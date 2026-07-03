// 定義可選樣式
const STYLE = {
  texture: {
    none: "none",
    patchwork: "patchwork", // 有序排列
    scattered: "scattered"  // 分散
  },

  lineDirection: {
    none: "none",
    vertical: "vertical",
    horizontal: "horizontal",
    both: "both"
  }
};

// 定義色盤
const PALETTES = {
  roof: {
    baseColor: "#E3B5A4",
    colors: [
      "#653C3D",
      "#6B3E3E",
      "#977579",
    ],
  },

  green: {
    baseColor: "#cfd5dc",
    colors:[
        "#DCEED1",
        "#AAC0AA",
        "#736372",
        "#A18276",
        "#7A918D"
    ]
  },

  light: {
    baseColor: "#d8ecb1",
    colors:[
        "#f5e695",
        "#b2d3be",
        "#5a9472",
        "#3c6a4f"
    ],
    rustDarkColor: "#7e5a26",
    rustLightColor: "#cba571",
  },

  door: {
    baseColor: "#7d9062",
    colors:[
        "#505d26",
        "#5C5A3E",
        "#415534"
    ],
    rustDarkColor: "#cb6a52",
    rustLightColor: "#cd906d",
  }
};


// 定義每種表面的設定
const SURFACE= {
  roof: {
    textureStyle: STYLE.texture.patchwork,
    lineDirection: STYLE.lineDirection.vertical,
    palette: PALETTES.roof,

    ellipse:{
      width: {
        min: 10,
        max: 30
      },
      height: {
        min: 10,
        max: 50
      }
    },

    effects: {
      whitePaint:{
        chance: 0.0001,
        alpha:{
          min: 0.2,
          max: 0.5,
        }
      },
      showRoofWaves: true
    }
  },

  wallLight: {
    textureStyle: STYLE.texture.scattered,
    lineDirection: STYLE.lineDirection.both,
    palette: PALETTES.light,

    grid: {
      xCount: {
        min: 10,
        max: 40
      },
      yCount: {
        min: 50,
        max: 200
      }
    },

    ellipse:{
      width: {
        min: 10,
        max: 50
      },
      height: {
        min: 10,
        max: 50
      }
    },

    effects: {
      whitePaint:{
          chance: 0.0001,
          alpha:{
            min: 0.2,
            max: 0.8,
          }
      },
      showRust: true,
      lightBrightnessBoost: 50,
    }
  },

  door: {
    textureStyle: STYLE.texture.patchwork,
    lineDirection: STYLE.lineDirection.vertical,
    palette: PALETTES.door,

    grid: {
      xCount: {
        min: 30,
        max: 80
      },
      yCount: {
        min: 80,
        max: 200
      }
    },

    ellipse:{
      width: {
        min: 20,
        max: 70
      },
      height: {
        min: 20,
        max: 70
      }
    },

    effects: {
      whitePaint:{
          chance: 0.0001,
          alpha:{
            min: 0.2,
            max: 0.8,
          }
      },
      showRust: true,
      lightBrightnessBoost: 20,
    }
  }
};