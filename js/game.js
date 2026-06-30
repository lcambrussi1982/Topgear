(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const wrap = document.getElementById("canvasWrap");
  const music = document.getElementById("bgMusic");

  const dom = {
    overlay: document.getElementById("overlay"),
    overlayTitle: document.getElementById("overlayTitle"),
    overlayText: document.getElementById("overlayText"),
    startButton: document.getElementById("startButton"),
    howToButton: document.getElementById("howToButton"),
    musicButton: document.getElementById("musicButton"),
    toast: document.getElementById("toast"),
    speedValue: document.getElementById("speedValue"),
    speedometerValue: document.getElementById("speedometerValue"),
    speedNeedle: document.getElementById("speedNeedle"),
    speedBar: document.getElementById("speedBar"),
    gearValue: document.getElementById("gearValue"),
    fuelFill: document.getElementById("fuelFill"),
    turboFill: document.getElementById("turboFill"),
    carFill: document.getElementById("carFill"),
    lapValue: document.getElementById("lapValue"),
    stageBadge: document.getElementById("stageBadge"),
    trackBadge: document.getElementById("trackBadge"),
    positionBadge: document.getElementById("positionBadge")
  };

  const VIEW_DISTANCE = 950;
  const ROAD_SLICES = 92;
  const MAX_DPR = 2;
  const WORLD_SPEED_SCALE = 1.65;
  const SPEEDOMETER_MAX = 420;
  const SPEEDOMETER_MAX_BONUS = 100;

  const tracks = [
    {
      name: "Cidade Neon",
      shortName: "Cidade Neon",
      laps: 2,
      length: 3300,
      maxSpeed: 260,
      traffic: 18,
      rivals: 7,
      pickups: 9,
      skyTop: "#1b1244",
      skyBottom: "#ff7a5a",
      horizon: "#3f245e",
      grassA: "#20224f",
      grassB: "#272b68",
      roadA: "#393948",
      roadB: "#30303e",
      rumbleA: "#ffffff",
      rumbleB: "#ff4d6d",
      lane: "#fff2a8",
      wave: 0.5,
      sections: [
        { end: 450, curve: 0.00, hill: 0.00 },
        { end: 850, curve: 0.42, hill: 0.10 },
        { end: 1180, curve: -0.55, hill: -0.06 },
        { end: 1650, curve: 0.12, hill: 0.02 },
        { end: 2150, curve: 0.70, hill: 0.09 },
        { end: 2600, curve: -0.34, hill: -0.03 },
        { end: 3300, curve: 0.00, hill: 0.00 }
      ]
    },
    {
      name: "Vale do Paredão",
      shortName: "Paredão",
      laps: 2,
      length: 3600,
      maxSpeed: 276,
      traffic: 21,
      rivals: 8,
      pickups: 10,
      skyTop: "#552500",
      skyBottom: "#f5b95a",
      horizon: "#7c421b",
      grassA: "#7a4d21",
      grassB: "#936029",
      roadA: "#3a342e",
      roadB: "#2e2b29",
      rumbleA: "#ffe0a5",
      rumbleB: "#c45022",
      lane: "#fff7c8",
      wave: 0.7,
      sections: [
        { end: 500, curve: -0.15, hill: 0.05 },
        { end: 950, curve: -0.68, hill: 0.11 },
        { end: 1320, curve: 0.25, hill: -0.08 },
        { end: 1900, curve: 0.76, hill: 0.04 },
        { end: 2380, curve: -0.72, hill: 0.06 },
        { end: 3000, curve: 0.34, hill: -0.02 },
        { end: 3600, curve: 0.00, hill: 0.00 }
      ]
    },
    {
      name: "Serra Azul",
      shortName: "Serra Azul",
      laps: 3,
      length: 2800,
      maxSpeed: 268,
      traffic: 22,
      rivals: 8,
      pickups: 11,
      skyTop: "#113b64",
      skyBottom: "#85d8ff",
      horizon: "#376d8c",
      grassA: "#14583a",
      grassB: "#1d7048",
      roadA: "#3c424c",
      roadB: "#323842",
      rumbleA: "#d9f3ff",
      rumbleB: "#2378ff",
      lane: "#eefbff",
      wave: 0.9,
      sections: [
        { end: 320, curve: 0.18, hill: 0.08 },
        { end: 720, curve: 0.82, hill: 0.20 },
        { end: 1150, curve: -0.88, hill: -0.12 },
        { end: 1420, curve: 0.00, hill: 0.16 },
        { end: 1850, curve: -0.54, hill: -0.08 },
        { end: 2350, curve: 0.66, hill: 0.12 },
        { end: 2800, curve: 0.00, hill: 0.00 }
      ]
    },
    {
      name: "Noite Metropolitana",
      shortName: "Metrópole",
      laps: 2,
      length: 4000,
      maxSpeed: 292,
      traffic: 26,
      rivals: 9,
      pickups: 12,
      skyTop: "#070a20",
      skyBottom: "#122f58",
      horizon: "#12172f",
      grassA: "#111936",
      grassB: "#18234a",
      roadA: "#2f3342",
      roadB: "#252a36",
      rumbleA: "#48f0ff",
      rumbleB: "#a252ff",
      lane: "#f8fbff",
      wave: 1.1,
      sections: [
        { end: 520, curve: 0.00, hill: -0.02 },
        { end: 1050, curve: 0.94, hill: 0.04 },
        { end: 1510, curve: -0.48, hill: 0.02 },
        { end: 2100, curve: -0.92, hill: -0.05 },
        { end: 2700, curve: 0.54, hill: 0.08 },
        { end: 3350, curve: -0.28, hill: -0.03 },
        { end: 4000, curve: 0.00, hill: 0.00 }
      ]
    },
    {
      name: "Litoral Relâmpago",
      shortName: "Litoral",
      laps: 3,
      length: 3100,
      maxSpeed: 304,
      traffic: 28,
      rivals: 9,
      pickups: 12,
      skyTop: "#1c6cc7",
      skyBottom: "#91fff0",
      horizon: "#47a8c7",
      grassA: "#d0b06b",
      grassB: "#e0c078",
      roadA: "#3d3f48",
      roadB: "#343740",
      rumbleA: "#ffffff",
      rumbleB: "#00a6ff",
      lane: "#fff7ba",
      wave: 1.3,
      sections: [
        { end: 330, curve: -0.12, hill: 0.02 },
        { end: 700, curve: -0.88, hill: 0.05 },
        { end: 1140, curve: 0.72, hill: -0.03 },
        { end: 1600, curve: -0.42, hill: 0.07 },
        { end: 2050, curve: 0.90, hill: 0.04 },
        { end: 2580, curve: -0.72, hill: -0.02 },
        { end: 3100, curve: 0.00, hill: 0.00 }
      ]
    },
    {
      name: "Grande Final: Arena do Chefão",
      shortName: "Chefão Final",
      laps: 3,
      length: 3500,
      maxSpeed: 320,
      traffic: 31,
      rivals: 10,
      pickups: 13,
      boss: true,
      skyTop: "#210016",
      skyBottom: "#ff315d",
      horizon: "#3b1539",
      grassA: "#270f25",
      grassB: "#351434",
      roadA: "#31313d",
      roadB: "#24242f",
      rumbleA: "#ffd166",
      rumbleB: "#ff315d",
      lane: "#ffffff",
      wave: 1.5,
      sections: [
        { end: 360, curve: 0.18, hill: 0.05 },
        { end: 820, curve: 1.05, hill: 0.10 },
        { end: 1180, curve: -0.96, hill: -0.07 },
        { end: 1650, curve: 0.82, hill: 0.12 },
        { end: 2120, curve: -1.08, hill: -0.08 },
        { end: 2600, curve: 0.58, hill: 0.05 },
        { end: 3050, curve: -0.42, hill: -0.02 },
        { end: 3500, curve: 0.00, hill: 0.00 }
      ]
    }
  ];

  const palettes = ["#ff4d6d", "#48f0ff", "#ffd166", "#75ff9b", "#9f7bff", "#ff8f4c", "#f7f7ff", "#36d399"];
  const rivalNames = ["Relâmpago", "Falcão", "Pantera", "Trovão", "Nitro", "Meteoro", "Vortex", "Cometa", "Raptor", "Sombra"];

  const state = {
    screen: "menu",
    trackIndex: 0,
    points: 0,
    lastPosition: 8,
    raceDistance: tracks[0].length * tracks[0].laps,
    overlayMode: "start",
    musicUnlocked: false,
    bossMessageShown: false,
    controlsHelpOpen: false
  };

  const player = {
    progress: 0,
    speed: 0,
    x: 0,
    targetX: 0,
    fuel: 100,
    turbo: 100,
    durability: 100,
    gear: 1,
    invincible: 0,
    lap: 1,
    finished: false,
    turboFlash: 0
  };

  let W = 960;
  let H = 540;
  let dpr = 1;
  let rivals = [];
  let traffic = [];
  let pickups = [];
  let particles = [];
  let lastTime = performance.now();
  let toastTimeout = 0;
  let cameraShake = 0;
  let roadFlash = 0;

  const input = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
    turbo: false
  };

  const touchSteer = {
    active: false,
    pointerId: null,
    target: 0
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function ordinal(n) {
    return `${n}º`;
  }

  function currentTrack() {
    return tracks[state.trackIndex];
  }

  function resizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    W = Math.max(320, Math.floor(rect.width));
    H = Math.max(360, Math.floor(rect.height));
    dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function roundedRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  function sectionValue(track, distance, key) {
    const lapPos = ((distance % track.length) + track.length) % track.length;
    let previousEnd = 0;
    let previousValue = 0;

    for (const section of track.sections) {
      if (lapPos <= section.end) {
        const span = Math.max(1, section.end - previousEnd);
        const local = clamp((lapPos - previousEnd) / span, 0, 1);
        return lerp(previousValue, section[key] || 0, smoothstep(local));
      }
      previousEnd = section.end;
      previousValue = section[key] || 0;
    }

    return 0;
  }

  function getCurveAt(distance, track = currentTrack()) {
    const base = sectionValue(track, distance, "curve");
    const wave = Math.sin(distance * 0.0027 + state.trackIndex * 1.7) * 0.08 * track.wave;
    return base + wave;
  }

  function getHillAt(distance, track = currentTrack()) {
    const base = sectionValue(track, distance, "hill");
    return base + Math.sin(distance * 0.0019 + state.trackIndex) * 0.04;
  }

  function project(relativeDistance, laneX = 0) {
    const track = currentTrack();
    const horizon = H * 0.34;
    const t = clamp(1 - relativeDistance / VIEW_DISTANCE, 0, 1);
    const perspective = Math.pow(t, 1.35);
    const y = horizon + Math.pow(t, 2.04) * (H - horizon) - getHillAt(player.progress + relativeDistance, track) * (1 - t) * H * 0.12;
    const roadWidth = W * (0.07 + 0.98 * perspective);
    const curve = getCurveAt(player.progress + relativeDistance, track) * Math.pow(1 - t, 0.82);
    const center = W / 2 + curve * W * 0.36 + Math.sin((player.progress + relativeDistance) * 0.0025) * track.wave * W * 0.014 * (1 - t);
    const x = center + laneX * roadWidth * 0.42;
    const scale = clamp(roadWidth / (W * 0.86), 0.05, 1.55);
    return { x, y, center, roadWidth, scale, t };
  }

  function resetPlayerForTrack() {
    const track = currentTrack();
    state.raceDistance = track.length * track.laps;
    state.bossMessageShown = false;
    player.progress = 0;
    player.speed = 0;
    player.x = 0;
    player.targetX = 0;
    player.fuel = 100;
    player.turbo = 84;
    player.durability = 100;
    player.gear = 1;
    player.invincible = 0;
    player.lap = 1;
    player.finished = false;
    player.turboFlash = 0;
    cameraShake = 0;
    roadFlash = 0;
  }

  function generateRaceObjects() {
    const track = currentTrack();
    rivals = [];
    traffic = [];
    pickups = [];
    particles = [];

    for (let i = 0; i < track.rivals; i += 1) {
      rivals.push({
        name: rivalNames[i % rivalNames.length],
        progress: randomRange(30, 290) + i * randomRange(18, 44),
        x: randomRange(-0.78, 0.78),
        laneBase: randomRange(-0.78, 0.78),
        baseSpeed: randomRange(track.maxSpeed * 0.62, track.maxSpeed * 0.83) + i * 1.7,
        color: palettes[i % palettes.length],
        seed: randomRange(0, 99),
        boss: false
      });
    }

    if (track.boss) {
      rivals.push({
        name: "CHEFÃO",
        progress: 520,
        x: 0,
        laneBase: 0,
        baseSpeed: track.maxSpeed * 0.87,
        color: "#090911",
        trim: "#ffd166",
        seed: 777,
        boss: true
      });
    }

    for (let i = 0; i < track.traffic; i += 1) {
      const d = randomRange(420, state.raceDistance - 250);
      traffic.push({
        progress: d,
        x: randomRange(-0.86, 0.86),
        laneBase: randomRange(-0.86, 0.86),
        speed: randomRange(82, track.maxSpeed * 0.55),
        color: palettes[(i + 3) % palettes.length],
        seed: randomRange(0, 100),
        van: Math.random() > 0.72,
        done: false
      });
    }

    const pickupTypes = ["fuel", "turbo", "repair"];
    for (let i = 0; i < track.pickups; i += 1) {
      pickups.push({
        progress: 520 + i * (state.raceDistance - 850) / track.pickups + randomRange(-90, 110),
        x: randomRange(-0.72, 0.72),
        type: pickupTypes[i % pickupTypes.length],
        collected: false,
        seed: randomRange(0, 100)
      });
    }

    traffic.sort((a, b) => a.progress - b.progress);
    pickups.sort((a, b) => a.progress - b.progress);
  }

  function showOverlay(title, text, actionLabel, action) {
    dom.overlayTitle.textContent = title;
    dom.overlayText.textContent = text;
    dom.startButton.textContent = actionLabel;
    dom.overlay.classList.add("visible");
    dom.startButton.onclick = action;
  }

  function hideOverlay() {
    dom.overlay.classList.remove("visible");
  }

  function showToast(text) {
    dom.toast.textContent = text;
    dom.toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => dom.toast.classList.remove("show"), 1900);
  }

  async function unlockMusic() {
    if (!music) return;
    music.volume = 0.42;
    try {
      await music.play();
      state.musicUnlocked = true;
      dom.musicButton.classList.add("playing");
      dom.musicButton.textContent = "♫ Tocando";
    } catch (error) {
      state.musicUnlocked = false;
      dom.musicButton.classList.remove("playing");
      dom.musicButton.textContent = "♫ Música";
    }
  }

  function toggleMusic() {
    if (!music) return;
    if (music.paused) {
      unlockMusic();
    } else {
      music.pause();
      dom.musicButton.classList.remove("playing");
      dom.musicButton.textContent = "♫ Música";
    }
  }

  function startChampionship() {
    state.trackIndex = 0;
    state.points = 0;
    startTrack();
  }

  function startTrack() {
    resetPlayerForTrack();
    generateRaceObjects();
    state.screen = "running";
    hideOverlay();
    unlockMusic();
    const track = currentTrack();
    showToast(`Fase ${state.trackIndex + 1}: ${track.name} — segure ACELERAR para ganhar velocidade`);
  }

  function retryTrack() {
    startTrack();
  }

  function nextTrack() {
    state.trackIndex = clamp(state.trackIndex + 1, 0, tracks.length - 1);
    startTrack();
  }

  function calculatePosition() {
    let position = 1;
    for (const rival of rivals) {
      if (rival.progress > player.progress) position += 1;
    }
    return clamp(position, 1, rivals.length + 1);
  }

  function pointsForPosition(position) {
    const table = [12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0];
    return table[position - 1] || 0;
  }

  function finishTrack() {
    if (player.finished) return;
    player.finished = true;
    player.progress = state.raceDistance;
    player.speed = 0;
    const position = calculatePosition();
    const points = pointsForPosition(position);
    state.points += points;
    state.lastPosition = position;
    const track = currentTrack();
    const boss = rivals.find((rival) => rival.boss);
    const bossBeaten = !boss || boss.progress < player.progress;

    if (state.trackIndex >= tracks.length - 1) {
      state.screen = "champion";
      const bossText = bossBeaten
        ? "Você cruzou a linha antes do chefão e venceu a Arena Final."
        : "Você completou a última fase, mas o chefão ainda ficou na sua frente. Tente novamente para derrotá-lo em 1º lugar.";
      showOverlay(
        "Campeonato finalizado!",
        `${bossText} Posição final: ${ordinal(position)}. Pontos totais: ${state.points}.`,
        "Jogar de novo",
        startChampionship
      );
      return;
    }

    state.screen = "stageEnd";
    showOverlay(
      "Fase concluída!",
      `${track.name} completa. Você chegou em ${ordinal(position)} e ganhou ${points} pontos. Pontuação total: ${state.points}.`,
      "Próxima fase",
      nextTrack
    );
  }

  function triggerGameOver(reason) {
    state.screen = "gameOver";
    player.speed = 0;
    showOverlay("Fim de corrida", reason, "Tentar novamente", retryTrack);
  }

  function togglePause() {
    if (state.screen === "running") {
      state.screen = "paused";
      showOverlay("Corrida pausada", "Aperte continuar para voltar para a pista.", "Continuar", () => {
        state.screen = "running";
        hideOverlay();
      });
    } else if (state.screen === "paused") {
      state.screen = "running";
      hideOverlay();
    }
  }

  function updateRivals(dt) {
    const track = currentTrack();
    for (const rival of rivals) {
      if (rival.progress >= state.raceDistance + 120) continue;
      const curvePenalty = Math.abs(getCurveAt(rival.progress, track)) * (rival.boss ? 8 : 14);
      const pulse = Math.sin(rival.progress * 0.011 + rival.seed) * (rival.boss ? 3 : 5);
      const rivalSpeed = clamp(rival.baseSpeed + pulse - curvePenalty, 75, track.maxSpeed + (rival.boss ? 32 : 8));
      rival.progress += (rivalSpeed / 3.6) * dt;
      rival.x = clamp(rival.laneBase + Math.sin(rival.progress * 0.008 + rival.seed) * (rival.boss ? 0.15 : 0.24), -0.9, 0.9);
    }
  }

  function updateTraffic(dt) {
    for (const car of traffic) {
      if (car.done) continue;
      car.progress += (car.speed / 3.6) * WORLD_SPEED_SCALE * dt;
      car.x = clamp(car.laneBase + Math.sin(car.progress * 0.012 + car.seed) * 0.12, -0.92, 0.92);
      if (car.progress > state.raceDistance + 200) car.done = true;
    }
  }

  function emitSpark(x, y, count, color = "#ffd166") {
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x,
        y,
        vx: randomRange(-90, 90),
        vy: randomRange(-130, -25),
        life: randomRange(0.25, 0.6),
        maxLife: 0.6,
        size: randomRange(2, 5),
        color
      });
    }
  }

  function updateParticles(dt) {
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 300 * dt;
      p.life -= dt;
    }
    particles = particles.filter((p) => p.life > 0);
  }

  function collideWithObjects() {
    if (player.invincible > 0) return;
    const allCars = traffic.filter((car) => !car.done).concat(rivals);
    for (const car of allCars) {
      const relative = car.progress - player.progress;
      const hitWindow = car.boss ? 24 : 18;
      const xWindow = car.boss ? 0.46 : 0.31;
      if (relative > -8 && relative < hitWindow && Math.abs(car.x - player.x) < xWindow && player.speed > 25) {
        player.invincible = 0.9;
        player.speed *= car.boss ? 0.42 : 0.55;
        player.durability = clamp(player.durability - (car.boss ? 18 : 10), 0, 100);
        cameraShake = car.boss ? 18 : 11;
        roadFlash = 0.18;
        const playerScreenX = W / 2 + player.x * W * 0.32;
        emitSpark(playerScreenX, H * 0.78, car.boss ? 28 : 18, car.boss ? "#ff315d" : "#ffd166");
        showToast(car.boss ? "Batida no chefão!" : "Batida! Carro danificado.");
        if (player.durability <= 0) {
          triggerGameOver("Seu carro quebrou. Pegue chaves de reparo e evite bater nos rivais.");
        }
        return;
      }
    }
  }

  function collectPickups() {
    for (const item of pickups) {
      if (item.collected) continue;
      const relative = item.progress - player.progress;
      if (relative > -8 && relative < 20 && Math.abs(item.x - player.x) < 0.32) {
        item.collected = true;
        const playerScreenX = W / 2 + player.x * W * 0.32;
        if (item.type === "fuel") {
          player.fuel = clamp(player.fuel + 28, 0, 100);
          showToast("Combustível coletado!");
          emitSpark(playerScreenX, H * 0.75, 16, "#75ff9b");
        } else if (item.type === "turbo") {
          player.turbo = clamp(player.turbo + 34, 0, 100);
          showToast("Turbo carregado!");
          emitSpark(playerScreenX, H * 0.75, 16, "#48f0ff");
        } else {
          player.durability = clamp(player.durability + 26, 0, 100);
          showToast("Reparo coletado!");
          emitSpark(playerScreenX, H * 0.75, 16, "#ffd166");
        }
      }
    }
  }

  function updatePlayer(dt) {
    const track = currentTrack();
    const throttlePressed = input.accelerate && player.fuel > 0;
    const braking = input.brake;
    const offRoad = Math.abs(player.x) > 1.02;
    const turboing = input.turbo && player.turbo > 0 && player.speed > 42 && player.fuel > 0;
    const cruiseSpeed = player.fuel <= 0 ? 64 : track.maxSpeed * 0.82;
    const maxSpeed = (player.fuel <= 0 ? 92 : track.maxSpeed) + (turboing ? SPEEDOMETER_MAX_BONUS : 0);
    const launchBoost = player.speed < 80 ? 1.35 : 1;

    // Aceleração automática leve para o carro não ficar parado no celular.
    // Segurar ACELERAR dá força total; TURBO passa dos 300 km/h nas fases avançadas.
    if (braking) {
      player.speed -= 260 * dt;
    } else if (throttlePressed) {
      player.speed += 260 * launchBoost * dt;
    } else if (player.speed < cruiseSpeed) {
      player.speed += 142 * dt;
    } else {
      player.speed -= (8 + player.speed * 0.01) * dt;
    }

    if (turboing) {
      player.speed += 170 * dt;
      player.turbo = clamp(player.turbo - 35 * dt, 0, 100);
      player.turboFlash = 0.12;
      cameraShake = Math.max(cameraShake, 5.5);
    } else {
      player.turbo = clamp(player.turbo + 5.6 * dt, 0, 100);
    }

    if (offRoad) {
      const offAmount = Math.abs(player.x) - 1;
      player.speed -= (62 + offAmount * 110) * dt;
      player.durability = clamp(player.durability - offAmount * 3.2 * dt, 0, 100);
      cameraShake = Math.max(cameraShake, 5);
    }

    player.speed = clamp(player.speed, 0, maxSpeed);
    player.gear = player.speed < 4 ? 0 : clamp(Math.floor((player.speed / Math.max(1, track.maxSpeed + SPEEDOMETER_MAX_BONUS)) * 6) + 1, 1, turboing ? 7 : 6);

    const speedRatio = clamp(player.speed / Math.max(1, track.maxSpeed), 0, 1.4);
    const steerStrength = (0.52 + speedRatio * 1.34) * dt;
    if (input.left) player.x -= steerStrength;
    if (input.right) player.x += steerStrength;
    if (touchSteer.active) player.x = lerp(player.x, touchSteer.target, clamp(dt * 7, 0, 1));

    const curvePull = getCurveAt(player.progress + 170, track) * speedRatio * 0.22 * dt;
    player.x -= curvePull;
    player.x = clamp(player.x, -1.32, 1.32);

    const fuelDrain = (0.024 + player.speed * 0.00068 + (turboing ? 0.18 : 0)) * dt;
    player.fuel = clamp(player.fuel - fuelDrain, 0, 100);
    if (player.fuel <= 0 && player.speed < 3) {
      triggerGameOver("Acabou o combustível. Pegue galões verdes durante a corrida para continuar.");
      return;
    }

    if (player.durability <= 0) {
      triggerGameOver("Seu carro quebrou. Use reparos amarelos e evite sair da pista.");
      return;
    }

    player.progress += (player.speed / 3.6) * WORLD_SPEED_SCALE * dt;
    player.lap = clamp(Math.floor(player.progress / track.length) + 1, 1, track.laps);

    if (track.boss && !state.bossMessageShown) {
      const boss = rivals.find((rival) => rival.boss);
      if (boss && boss.progress - player.progress < 220 && boss.progress > player.progress) {
        state.bossMessageShown = true;
        showToast("Chefão à frente! Use turbo para ultrapassar.");
      }
    }

    if (player.progress >= state.raceDistance) {
      finishTrack();
    }
  }

  function update(dt) {
    if (state.screen !== "running") {
      updateParticles(dt);
      return;
    }
    player.invincible = Math.max(0, player.invincible - dt);
    player.turboFlash = Math.max(0, player.turboFlash - dt);
    cameraShake = Math.max(0, cameraShake - 32 * dt);
    roadFlash = Math.max(0, roadFlash - dt);
    updatePlayer(dt);
    if (state.screen !== "running") {
      updateParticles(dt);
      updateHud();
      return;
    }
    updateRivals(dt);
    updateTraffic(dt);
    collideWithObjects();
    collectPickups();
    updateParticles(dt);
    updateHud();
  }

  function updateHud() {
    const track = currentTrack();
    const position = calculatePosition();
    const shownSpeed = Math.round(player.speed);
    const speedRatioForGauge = clamp(player.speed / SPEEDOMETER_MAX, 0, 1);
    const needleAngle = -130 + speedRatioForGauge * 260;
    dom.speedValue.textContent = shownSpeed;
    if (dom.speedometerValue) dom.speedometerValue.textContent = shownSpeed;
    if (dom.speedNeedle) dom.speedNeedle.style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;
    if (dom.speedBar) dom.speedBar.style.width = `${speedRatioForGauge * 100}%`;
    if (dom.gearValue) dom.gearValue.textContent = player.gear === 0 ? "N" : String(player.gear);
    dom.fuelFill.style.width = `${clamp(player.fuel, 0, 100)}%`;
    dom.turboFill.style.width = `${clamp(player.turbo, 0, 100)}%`;
    dom.carFill.style.width = `${clamp(player.durability, 0, 100)}%`;
    dom.lapValue.textContent = `${player.lap} / ${track.laps}`;
    dom.stageBadge.textContent = `${state.trackIndex + 1} / ${tracks.length}`;
    dom.trackBadge.textContent = track.shortName;
    dom.positionBadge.textContent = ordinal(position);
  }

  function drawBackground() {
    const track = currentTrack();
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
    sky.addColorStop(0, track.skyTop);
    sky.addColorStop(1, track.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    const horizonY = H * 0.34;
    const sunX = W * (0.72 + Math.sin(state.trackIndex) * 0.08);
    const sunY = H * (track.boss ? 0.17 : 0.2);
    const sunRadius = Math.max(32, W * 0.045);
    const sun = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, sunRadius * 1.7);
    sun.addColorStop(0, "rgba(255,255,255,0.9)");
    sun.addColorStop(0.38, "rgba(255,209,102,0.7)");
    sun.addColorStop(1, "rgba(255,209,102,0)");
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 1.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = track.horizon;
    ctx.beginPath();
    ctx.moveTo(0, horizonY + H * 0.05);
    for (let i = 0; i <= 10; i += 1) {
      const x = (i / 10) * W;
      const peak = horizonY - H * (0.05 + ((i + state.trackIndex) % 3) * 0.035);
      ctx.lineTo(x - W * 0.07, horizonY + H * 0.07);
      ctx.lineTo(x, peak);
      ctx.lineTo(x + W * 0.1, horizonY + H * 0.08);
    }
    ctx.lineTo(W, H * 0.52);
    ctx.lineTo(0, H * 0.52);
    ctx.closePath();
    ctx.fill();

    if (track.shortName === "Metrópole" || track.shortName === "Cidade Neon" || track.boss) {
      drawSkyline(horizonY);
    }
  }

  function drawSkyline(horizonY) {
    const track = currentTrack();
    for (let i = 0; i < 18; i += 1) {
      const w = W / 22;
      const x = i * w * 1.3 + ((i * 17) % 11);
      const h = H * (0.08 + ((i * 37) % 7) * 0.012);
      ctx.fillStyle = track.boss ? "rgba(12, 5, 20, 0.72)" : "rgba(7, 10, 25, 0.62)";
      ctx.fillRect(x, horizonY - h + H * 0.08, w, h);
      ctx.fillStyle = "rgba(255, 209, 102, 0.72)";
      for (let y = horizonY - h + H * 0.095; y < horizonY + H * 0.06; y += 16) {
        ctx.fillRect(x + w * 0.2, y, 3, 3);
        ctx.fillRect(x + w * 0.55, y, 3, 3);
      }
    }
  }

  function drawRoad() {
    const track = currentTrack();
    const horizon = H * 0.34;
    const ground = ctx.createLinearGradient(0, horizon, 0, H);
    ground.addColorStop(0, track.grassA);
    ground.addColorStop(1, track.grassB);
    ctx.fillStyle = ground;
    ctx.fillRect(0, horizon, W, H - horizon);

    for (let i = 0; i < ROAD_SLICES; i += 1) {
      const t1 = i / ROAD_SLICES;
      const t2 = (i + 1) / ROAD_SLICES;
      const rel1 = VIEW_DISTANCE * (1 - t1);
      const rel2 = VIEW_DISTANCE * (1 - t2);
      const p1 = project(rel1, 0);
      const p2 = project(rel2, 0);
      const segment = Math.floor((player.progress + rel2) / 48);
      const alt = segment % 2 === 0;
      const roadColor = alt ? track.roadA : track.roadB;
      const rumbleColor = alt ? track.rumbleA : track.rumbleB;
      const grassColor = alt ? track.grassA : track.grassB;

      ctx.fillStyle = grassColor;
      ctx.fillRect(0, p1.y, W, Math.max(1, p2.y - p1.y + 1));

      const roadHalf1 = p1.roadWidth * 0.47;
      const roadHalf2 = p2.roadWidth * 0.47;
      const rumbleHalf1 = p1.roadWidth * 0.54;
      const rumbleHalf2 = p2.roadWidth * 0.54;

      drawQuad(
        p1.center - rumbleHalf1,
        p1.y,
        p1.center + rumbleHalf1,
        p1.y,
        p2.center + rumbleHalf2,
        p2.y,
        p2.center - rumbleHalf2,
        p2.y,
        rumbleColor
      );

      drawQuad(
        p1.center - roadHalf1,
        p1.y,
        p1.center + roadHalf1,
        p1.y,
        p2.center + roadHalf2,
        p2.y,
        p2.center - roadHalf2,
        p2.y,
        roadFlash > 0 ? "#fff0c4" : roadColor
      );

      const marker = Math.floor((player.progress + rel2) / 78) % 2 === 0;
      if (marker && p2.roadWidth > 80) {
        drawLaneMarker(p1, p2, -0.17, track.lane);
        drawLaneMarker(p1, p2, 0.17, track.lane);
      }

      if (i % 17 === 0 && p2.roadWidth > 160) {
        drawStartSideStripe(p1, p2);
      }
    }
  }

  function drawLaneMarker(p1, p2, laneOffset, color) {
    const w1 = Math.max(1.5, p1.roadWidth * 0.006);
    const w2 = Math.max(2, p2.roadWidth * 0.007);
    const x1 = p1.center + p1.roadWidth * laneOffset;
    const x2 = p2.center + p2.roadWidth * laneOffset;
    drawQuad(x1 - w1, p1.y, x1 + w1, p1.y, x2 + w2, p2.y, x2 - w2, p2.y, color);
  }

  function drawStartSideStripe(p1, p2) {
    const left1 = p1.center - p1.roadWidth * 0.47;
    const left2 = p2.center - p2.roadWidth * 0.47;
    const right1 = p1.center + p1.roadWidth * 0.47;
    const right2 = p2.center + p2.roadWidth * 0.47;
    const w1 = Math.max(1, p1.roadWidth * 0.008);
    const w2 = Math.max(2, p2.roadWidth * 0.009);
    drawQuad(left1, p1.y, left1 + w1, p1.y, left2 + w2, p2.y, left2, p2.y, "rgba(255,255,255,0.42)");
    drawQuad(right1 - w1, p1.y, right1, p1.y, right2, p2.y, right2 - w2, p2.y, "rgba(255,255,255,0.42)");
  }

  function drawRoadsideObject(object) {
    const p = project(object.relative, object.x);
    if (!p || p.t <= 0.02 || p.t >= 1) return;
    const size = clamp(140 * p.scale, 6, 150);
    const groundY = p.y;
    const side = object.x < 0 ? -1 : 1;

    if (object.type === "tree") {
      ctx.fillStyle = "#5a351f";
      ctx.fillRect(p.x - size * 0.055, groundY - size * 0.38, size * 0.11, size * 0.38);
      ctx.fillStyle = object.variant ? "#1ed274" : "#20a35e";
      ctx.beginPath();
      ctx.moveTo(p.x, groundY - size * 0.98);
      ctx.lineTo(p.x - size * 0.42, groundY - size * 0.25);
      ctx.lineTo(p.x + size * 0.42, groundY - size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(p.x, groundY - size * 1.18);
      ctx.lineTo(p.x - size * 0.34, groundY - size * 0.55);
      ctx.lineTo(p.x + size * 0.34, groundY - size * 0.55);
      ctx.closePath();
      ctx.fill();
    } else if (object.type === "sign") {
      ctx.fillStyle = "rgba(10, 12, 25, 0.88)";
      ctx.fillRect(p.x - size * 0.33, groundY - size * 0.66, size * 0.66, size * 0.28);
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = Math.max(1, size * 0.025);
      ctx.strokeRect(p.x - size * 0.33, groundY - size * 0.66, size * 0.66, size * 0.28);
      ctx.fillStyle = "#ffd166";
      ctx.font = `${Math.max(6, size * 0.12)}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(object.label, p.x, groundY - size * 0.47);
      ctx.fillStyle = "#c8c8c8";
      ctx.fillRect(p.x - size * 0.03, groundY - size * 0.38, size * 0.06, size * 0.38);
    } else {
      ctx.fillStyle = side > 0 ? "#b89b70" : "#8f8b8b";
      ctx.beginPath();
      ctx.ellipse(p.x, groundY - size * 0.08, size * 0.26, size * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function roadsideObjects() {
    const objects = [];
    const start = Math.floor(player.progress / 120) * 120;
    for (let d = start + 160; d < player.progress + VIEW_DISTANCE; d += 130) {
      const id = Math.floor(d / 130);
      const side = id % 2 === 0 ? -1 : 1;
      const kindIndex = (id + state.trackIndex) % 5;
      objects.push({
        relative: d - player.progress,
        x: side * randomRoadsideLane(id),
        type: kindIndex === 0 ? "sign" : kindIndex === 1 || kindIndex === 3 ? "tree" : "rock",
        variant: id % 3 === 0,
        label: state.trackIndex === tracks.length - 1 && kindIndex === 0 ? "BOSS" : "DOM"
      });
    }
    return objects;
  }

  function randomRoadsideLane(id) {
    const n = Math.sin(id * 91.77) * 43758.5453;
    return 1.2 + (n - Math.floor(n)) * 0.4;
  }

  function drawPickup(item) {
    const rel = item.progress - player.progress;
    const p = project(rel, item.x);
    if (!p || p.t <= 0.03 || p.t >= 1) return;
    const bob = Math.sin(performance.now() * 0.006 + item.seed) * 4 * p.scale;
    const r = clamp(22 * p.scale, 5, 28);
    const x = p.x;
    const y = p.y - r * 1.7 + bob;
    const fill = item.type === "fuel" ? "#75ff9b" : item.type === "turbo" ? "#48f0ff" : "#ffd166";
    const label = item.type === "fuel" ? "F" : item.type === "turbo" ? "T" : "+";

    ctx.save();
    ctx.shadowColor = fill;
    ctx.shadowBlur = 16 * p.scale;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#07101b";
    ctx.font = `900 ${Math.max(7, r * 1.08)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 1);
    ctx.restore();
  }

  function drawCarBody(x, y, width, height, color, options = {}) {
    const trim = options.trim || "#ffffff";
    const dark = options.dark || "#09101c";
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(0, height * 0.43, width * 0.58, height * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    roundedRect(-width * 0.42, -height * 0.48, width * 0.84, height * 0.88, width * 0.12);
    ctx.fill();

    ctx.fillStyle = options.boss ? "#171721" : dark;
    roundedRect(-width * 0.28, -height * 0.28, width * 0.56, height * 0.28, width * 0.08);
    ctx.fill();

    ctx.fillStyle = trim;
    ctx.fillRect(-width * 0.35, -height * 0.47, width * 0.7, height * 0.055);
    ctx.fillRect(-width * 0.06, -height * 0.1, width * 0.12, height * 0.44);

    ctx.fillStyle = "#08080d";
    roundedRect(-width * 0.55, -height * 0.28, width * 0.16, height * 0.46, width * 0.04);
    ctx.fill();
    roundedRect(width * 0.39, -height * 0.28, width * 0.16, height * 0.46, width * 0.04);
    ctx.fill();

    ctx.fillStyle = "#fff2a8";
    ctx.fillRect(-width * 0.30, height * 0.23, width * 0.18, height * 0.06);
    ctx.fillRect(width * 0.12, height * 0.23, width * 0.18, height * 0.06);

    if (options.boss) {
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = Math.max(2, width * 0.045);
      roundedRect(-width * 0.46, -height * 0.52, width * 0.92, height * 0.96, width * 0.14);
      ctx.stroke();
      ctx.fillStyle = "#ff315d";
      ctx.fillRect(-width * 0.38, -height * 0.05, width * 0.76, height * 0.055);
    }

    ctx.restore();
  }

  function drawOpponent(car) {
    const relative = car.progress - player.progress;
    const p = project(relative, car.x);
    if (!p || p.t <= 0.035 || p.t >= 1) return;
    const width = clamp((car.boss ? 86 : car.van ? 66 : 54) * p.scale, 8, car.boss ? 125 : 86);
    const height = width * (car.boss ? 1.65 : car.van ? 1.52 : 1.42);
    drawCarBody(p.x, p.y - height * 0.43, width, height, car.color, {
      trim: car.trim || "#f7f7ff",
      dark: "#111827",
      boss: car.boss
    });

    if (car.boss && p.scale > 0.18) {
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      roundedRect(p.x - width * 0.58, p.y - height * 1.38, width * 1.16, height * 0.22, width * 0.06);
      ctx.fill();
      ctx.fillStyle = "#ffd166";
      ctx.font = `900 ${Math.max(8, width * 0.16)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("CHEFÃO", p.x, p.y - height * 1.22);
    }
  }

  function drawPlayer() {
    const track = currentTrack();
    const turboing = input.turbo && player.turbo > 0 && player.speed > 48;
    const baseW = clamp(W * 0.128, 72, 142);
    const baseH = baseW * 1.46;
    const roadEdgeWarning = Math.abs(player.x) > 1 ? 1 : 0;
    const x = W / 2 + player.x * W * 0.31 + randomRange(-cameraShake, cameraShake) * 0.15;
    const y = H - baseH * 0.55 - 12 + randomRange(-cameraShake, cameraShake) * 0.08;
    const lean = (input.left ? -1 : input.right ? 1 : 0) * clamp(player.speed / track.maxSpeed, 0, 1) * 0.06;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);

    if (turboing || player.turboFlash > 0) {
      const flame = 30 + Math.sin(performance.now() * 0.05) * 12;
      ctx.fillStyle = "rgba(72,240,255,0.72)";
      ctx.beginPath();
      ctx.moveTo(-baseW * 0.18, baseH * 0.32);
      ctx.lineTo(0, baseH * 0.32 + flame);
      ctx.lineTo(baseW * 0.18, baseH * 0.32);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,209,102,0.9)";
      ctx.beginPath();
      ctx.moveTo(-baseW * 0.1, baseH * 0.32);
      ctx.lineTo(0, baseH * 0.32 + flame * 0.62);
      ctx.lineTo(baseW * 0.1, baseH * 0.32);
      ctx.closePath();
      ctx.fill();
    }

    const playerColor = roadEdgeWarning ? "#ff8f4c" : "#48f0ff";
    drawCarBody(0, 0, baseW, baseH, playerColor, { trim: "#ffd166", dark: "#07101b" });

    if (player.invincible > 0 && Math.floor(performance.now() / 85) % 2 === 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 4;
      roundedRect(-baseW * 0.53, -baseH * 0.55, baseW * 1.06, baseH * 1.02, baseW * 0.13);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRaceObjects() {
    const objects = [];

    for (const object of roadsideObjects()) {
      objects.push({ type: "roadside", relative: object.relative, data: object });
    }

    for (const item of pickups) {
      if (!item.collected) {
        const relative = item.progress - player.progress;
        if (relative > 0 && relative < VIEW_DISTANCE) objects.push({ type: "pickup", relative, data: item });
      }
    }

    for (const car of traffic) {
      if (!car.done) {
        const relative = car.progress - player.progress;
        if (relative > -30 && relative < VIEW_DISTANCE) objects.push({ type: "car", relative, data: car });
      }
    }

    for (const rival of rivals) {
      const relative = rival.progress - player.progress;
      if (relative > -30 && relative < VIEW_DISTANCE) objects.push({ type: "car", relative, data: rival });
    }

    objects.sort((a, b) => b.relative - a.relative);

    for (const object of objects) {
      if (object.type === "roadside") drawRoadsideObject(object.data);
      else if (object.type === "pickup") drawPickup(object.data);
      else drawOpponent(object.data);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const alpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawSpeedLines() {
    if (player.speed < 125 || state.screen !== "running") return;
    const intensity = clamp((player.speed - 125) / 250, 0, 1);
    const lineCount = Math.floor(8 + intensity * 20);
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.13 + intensity * 0.24})`;
    ctx.lineWidth = 2 + intensity * 3;
    ctx.lineCap = "round";
    for (let i = 0; i < lineCount; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side < 0 ? randomRange(0, W * 0.22) : randomRange(W * 0.78, W);
      const y = randomRange(H * 0.38, H * 0.92);
      const len = randomRange(28, 84) * (1 + intensity * 1.15);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - side * len, y + len * 0.18);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMiniHud() {
    const track = currentTrack();
    const progressRatio = clamp(player.progress / state.raceDistance, 0, 1);
    const barW = clamp(W * 0.36, 160, 360);
    const x = 18;
    const y = 18;

    ctx.save();
    ctx.fillStyle = "rgba(5, 6, 17, 0.64)";
    roundedRect(x, y, barW + 22, 82, 14);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Fase ${state.trackIndex + 1}: ${track.shortName}`, x + 12, y + 24);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    roundedRect(x + 12, y + 40, barW, 12, 6);
    ctx.fill();
    ctx.fillStyle = track.boss ? "#ffd166" : "#48f0ff";
    roundedRect(x + 12, y + 40, barW * progressRatio, 12, 6);
    ctx.fill();
    ctx.fillStyle = "#adb3d5";
    ctx.font = "800 12px sans-serif";
    ctx.fillText(`${Math.floor(progressRatio * 100)}% da corrida`, x + 12, y + 70);
    ctx.restore();
  }

  function drawLowFuelWarning() {
    if (player.fuel > 18 || state.screen !== "running") return;
    if (Math.floor(performance.now() / 300) % 2 === 0) return;
    ctx.save();
    ctx.fillStyle = "rgba(255, 77, 109, 0.88)";
    ctx.font = `900 ${clamp(W * 0.035, 18, 42)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("COMBUSTÍVEL BAIXO", W / 2, H * 0.18);
    ctx.restore();
  }

  function render() {
    ctx.save();
    if (cameraShake > 0) {
      ctx.translate(randomRange(-cameraShake, cameraShake) * 0.18, randomRange(-cameraShake, cameraShake) * 0.12);
    }
    drawBackground();
    drawRoad();
    drawRaceObjects();
    drawSpeedLines();
    drawPlayer();
    drawParticles();
    ctx.restore();
    drawMiniHud();
    drawLowFuelWarning();
  }

  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(gameLoop);
  }

  function setControl(name, value) {
    if (!Object.prototype.hasOwnProperty.call(input, name)) return;
    input[name] = value;
    document.querySelectorAll(`[data-control="${name}"]`).forEach((button) => {
      button.classList.toggle("pressed", value);
    });
  }

  function releaseAllControls() {
    Object.keys(input).forEach((key) => setControl(key, false));
  }

  function setupKeyboard() {
    window.addEventListener("keydown", (event) => {
      const code = event.code;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(code)) event.preventDefault();
      if (code === "ArrowLeft" || code === "KeyA") setControl("left", true);
      if (code === "ArrowRight" || code === "KeyD") setControl("right", true);
      if (code === "ArrowUp" || code === "KeyW") setControl("accelerate", true);
      if (code === "ArrowDown" || code === "KeyS") setControl("brake", true);
      if (code === "Space") setControl("turbo", true);
      if (code === "KeyP") togglePause();
      if (code === "KeyM") toggleMusic();
      if (code === "Enter" && dom.overlay.classList.contains("visible")) dom.startButton.click();
    });

    window.addEventListener("keyup", (event) => {
      const code = event.code;
      if (code === "ArrowLeft" || code === "KeyA") setControl("left", false);
      if (code === "ArrowRight" || code === "KeyD") setControl("right", false);
      if (code === "ArrowUp" || code === "KeyW") setControl("accelerate", false);
      if (code === "ArrowDown" || code === "KeyS") setControl("brake", false);
      if (code === "Space") setControl("turbo", false);
    });
  }

  function setupTouchControls() {
    document.querySelectorAll("[data-control]").forEach((button) => {
      const name = button.dataset.control;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        setControl(name, true);
        unlockMusic();
      });
      const release = (event) => {
        event.preventDefault();
        setControl(name, false);
      };
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", () => setControl(name, false));
    });

    canvas.addEventListener("pointerdown", (event) => {
      if (state.screen !== "running") return;
      const rect = canvas.getBoundingClientRect();
      const y = event.clientY - rect.top;
      if (y > rect.height * 0.78) return;
      touchSteer.active = true;
      touchSteer.pointerId = event.pointerId;
      touchSteer.target = clamp(((event.clientX - rect.left) / rect.width - 0.5) / 0.31, -1.05, 1.05);
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!touchSteer.active || touchSteer.pointerId !== event.pointerId) return;
      const rect = canvas.getBoundingClientRect();
      touchSteer.target = clamp(((event.clientX - rect.left) / rect.width - 0.5) / 0.31, -1.05, 1.05);
    });

    const endTouchSteer = (event) => {
      if (touchSteer.pointerId === event.pointerId) {
        touchSteer.active = false;
        touchSteer.pointerId = null;
      }
    };
    canvas.addEventListener("pointerup", endTouchSteer);
    canvas.addEventListener("pointercancel", endTouchSteer);
  }

  function setupButtons() {
    dom.musicButton.addEventListener("click", toggleMusic);
    dom.howToButton.addEventListener("click", () => {
      state.controlsHelpOpen = !state.controlsHelpOpen;
      if (state.controlsHelpOpen) {
        showOverlay(
          "Controles",
          "PC: setas ou WASD dirigem e aceleram, Espaço usa turbo, P pausa e M liga a música. Celular: segure ACELERAR no canto direito para ganhar velocidade, use TURBO para passar dos 300 km/h e arraste o dedo na pista para ajustar a direção.",
          state.screen === "menu" ? "Iniciar corrida" : "Continuar",
          () => {
            state.controlsHelpOpen = false;
            if (state.screen === "menu") startChampionship();
            else {
              state.screen = "running";
              hideOverlay();
            }
          }
        );
      }
    });

    showOverlay(
      "Pronto para acelerar?",
      "Complete as 6 fases, colete combustível, use turbo nas retas e ultrapasse o chefão na última pista. Clique em iniciar para liberar a trilha sonora enviada.",
      "Iniciar corrida",
      startChampionship
    );
  }

  function init() {
    resizeCanvas();
    resetPlayerForTrack();
    generateRaceObjects();
    setupKeyboard();
    setupTouchControls();
    setupButtons();
    updateHud();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.screen === "running") togglePause();
      releaseAllControls();
    });
    requestAnimationFrame(gameLoop);
  }

  init();
})();
