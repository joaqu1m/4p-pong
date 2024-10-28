LARGURA_ARENA = 600;
ALTURA_ARENA = 600;

let perdeu = false;

const CONTROLS = {
  UP_L: [37, 65],
  UP_R: [39, 68],
  LEFT_U: [38, 87],
  LEFT_D: [40, 83],
};

const POS = {
  UP: { x: 240, y: 0, side: "y", height: 20, width: 120 },
  DOWN: { x: 240, y: 580, side: "y", height: 20, width: 120 },
  LEFT: { x: 0, y: 240, side: "x", height: 120, width: 20 },
  RIGHT: { x: 580, y: 240, side: "x", height: 120, width: 20 },
};

let pressedNow = [];

const CHANGE_POS = (barrierCode) => {
  let { x, y, side, height, width } = POS[barrierCode];
  if (side !== "x") {
    if (x < 0) x = 0;
    if (x > LARGURA_ARENA - width) x = LARGURA_ARENA - width;
  }
  if (side !== "y") {
    if (y < 0) y = 0;
    if (y > ALTURA_ARENA - height) y = ALTURA_ARENA - height;
  }
  POS[barrierCode].x = x;
  POS[barrierCode].y = y;
  document.getElementById(`bar-${barrierCode}`).style.marginLeft = `${x}px`;
  document.getElementById(`bar-${barrierCode}`).style.marginTop = `${y}px`;
};
CHANGE_POS("UP");
CHANGE_POS("DOWN");
CHANGE_POS("LEFT");
CHANGE_POS("RIGHT");

let interval = null;
const change_pos_by_keyboard = () => {
  if (interval) return;
  interval = setInterval(() => {
    if (!pressedNow.length) {
      clearInterval(interval);
      interval = null;
      return;
    }

    if (
      (pressedNow.includes("UP_L") || pressedNow.includes("UP_R")) &&
      !(pressedNow.includes("UP_L") && pressedNow.includes("UP_R"))
    ) {
      if (pressedNow.includes("UP_L")) POS["UP"].x -= 6;
      if (pressedNow.includes("UP_R")) POS["UP"].x += 6;
      CHANGE_POS("UP");
    }
    if (
      (pressedNow.includes("LEFT_U") || pressedNow.includes("LEFT_D")) &&
      !(pressedNow.includes("LEFT_U") && pressedNow.includes("LEFT_D"))
    ) {
      if (pressedNow.includes("LEFT_U")) POS["LEFT"].y -= 6;
      if (pressedNow.includes("LEFT_D")) POS["LEFT"].y += 6;
      CHANGE_POS("LEFT");
    }
  }, 10);
};

document.addEventListener("keydown", function (e) {
  const controlsKeys = Object.keys(CONTROLS);
  for (let i = 0; i < controlsKeys.length; i++) {
    if (CONTROLS[controlsKeys[i]].includes(e.keyCode)) {
      if (!pressedNow.includes(controlsKeys[i])) {
        pressedNow.push(controlsKeys[i]);
        change_pos_by_keyboard();
      }
      break;
    }
  }
});
document.addEventListener("keyup", function (e) {
  const controlsKeys = Object.keys(CONTROLS);
  for (let i = 0; i < controlsKeys.length; i++) {
    if (CONTROLS[controlsKeys[i]].includes(e.keyCode)) {
      pressedNow = pressedNow.filter((item) => item !== controlsKeys[i]);
      break;
    }
  }
});
canvas.addEventListener("mousemove", function (e) {
  POS["DOWN"].x = e.clientX - POS["DOWN"].width / 2;
  CHANGE_POS("DOWN");
  POS["RIGHT"].y = e.clientY - POS["RIGHT"].height / 2;
  CHANGE_POS("RIGHT");
});

let pontos = 0;
const COUNT_PONTO = () => {
  document.getElementById("contador").innerHTML = ++pontos;
};

// BOLA

const BOLA = {
  x: 280,
  y: 280,
  height: 40,
  width: 40,
  goingTo: {
    velocidadeX: 3,
    velocidadeY: 1,
  },
};

const CHANGE_BALL_POS = (x, y) => {
  document.getElementById("ball").style.marginLeft = `${x}px`;
  document.getElementById("ball").style.marginTop = `${y}px`;
};
CHANGE_BALL_POS(...Object.values(BOLA));

const CHECAR_COLISAO_U = (obj1, obj2) => {
  if (obj1.y <= obj2.y + obj2.height) {
    if (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width) {
      BOLA.goingTo.velocidadeY *= -1.05;
      COUNT_PONTO();
    }
  }
};
const CHECAR_COLISAO_L = (obj1, obj2) => {
  if (obj1.x <= obj2.x + obj2.width) {
    if (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height) {
      BOLA.goingTo.velocidadeX *= -1.05;
      COUNT_PONTO();
    }
  }
};
const CHECAR_COLISAO_R = (obj1, obj2) => {
  if (obj1.x + obj1.width >= obj2.x) {
    if (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height) {
      BOLA.goingTo.velocidadeX *= -1.05;
      COUNT_PONTO();
    }
  }
};
const CHECAR_COLISAO_D = (obj1, obj2) => {
  if (obj1.y + obj1.height >= obj2.y) {
    if (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width) {
      BOLA.goingTo.velocidadeY *= -1.05;
      COUNT_PONTO();
    }
  }
};

const LOGICA_COLISAO = () => {
  if (BOLA.x > 560 || BOLA.x < 0 || BOLA.y > 560 || BOLA.y < 0) {
    perdeu = true;

    const soundFile = document.createElement("audio");
    soundFile.preload = "auto";

    const src = document.createElement("source");
    src.src = "metal-pipe-clang.mp3";
    soundFile.appendChild(src);

    soundFile.load();
    soundFile.volume = 0.2;
    soundFile.play();

    setTimeout(function () {
      soundFile.play();
      document.getElementById("metalpipe").style.display = "block";
    }, 1);
  }
};

const intervalBola = setInterval(() => {
  if (perdeu) {
    clearInterval(intervalBola);
    return;
  }
  let {
    x,
    y,
    goingTo: { velocidadeX, velocidadeY },
  } = BOLA;
  console.log(x, y);
  x += velocidadeX;
  y += velocidadeY;
  BOLA.x = x;
  BOLA.y = y;
  CHANGE_BALL_POS(BOLA.x, BOLA.y);
  CHECAR_COLISAO_U(BOLA, POS["UP"]);
  CHECAR_COLISAO_L(BOLA, POS["LEFT"]);
  CHECAR_COLISAO_R(BOLA, POS["RIGHT"]);
  CHECAR_COLISAO_D(BOLA, POS["DOWN"]);
  LOGICA_COLISAO();
}, 10);
