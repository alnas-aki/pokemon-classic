const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const battleDiv = document.getElementById('battle');
const text = document.getElementById('text');
const enemyHPText = document.getElementById('enemyHP');

let player = { x: 180, y: 180, size: 16 };
let enemyHP = 30;
let inBattle = false;

// 草むら
const grassAreas = [
  { x: 100, y: 100, w: 100, h: 100 },
  { x: 250, y: 250, w: 80, h: 80 }
];

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrass();
  drawPlayer();
  if (!inBattle) requestAnimationFrame(draw);
}

function drawGrass() {
  ctx.fillStyle = '#8ccf8c';
  grassAreas.forEach(g => ctx.fillRect(g.x, g.y, g.w, g.h));
}

function drawPlayer() {
  ctx.fillStyle = '#f4e04d';
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.strokeStyle = '#c4b02d';
  ctx.strokeRect(player.x, player.y, player.size, player.size);
}

document.addEventListener('keydown', (e) => {
  if (inBattle) return;
  const step = 8;
  if (e.key === 'ArrowUp' && player.y > 0) player.y -= step;
  if (e.key === 'ArrowDown' && player.y < canvas.height - player.size) player.y += step;
  if (e.key === 'ArrowLeft' && player.x > 0) player.x -= step;
  if (e.key === 'ArrowRight' && player.x < canvas.width - player.size) player.x += step;

  if (isInGrass(player.x, player.y) && Math.random() < 0.1) {
    startBattle();
  }
});

function isInGrass(x, y) {
  return grassAreas.some(g => x > g.x && x < g.x + g.w && y > g.y && y < g.y + g.h);
}

function startBattle() {
  inBattle = true;
  battleDiv.classList.remove('hidden');
  enemyHP = 30;
  enemyHPText.textContent = enemyHP;
  text.textContent = "あ！ やせいのモンスターが とびだしてきた！";
}

document.getElementById('attackBtn').addEventListener('click', () => {
  const dmg = Math.floor(Math.random() * 8) + 5;
  enemyHP -= dmg;
  if (enemyHP <= 0) {
    text.textContent = `てきに ${dmg} のダメージ！ たおした！`;
    enemyHPText.textContent = 0;
    setTimeout(endBattle, 1500);
  } else {
    text.textContent = `てきに ${dmg} のダメージ！`;
    enemyHPText.textContent = enemyHP;
  }
});

document.getElementById('runBtn').addEventListener('click', () => {
  text.textContent = "うまく にげきれた！";
  setTimeout(endBattle, 1000);
});

function endBattle() {
  battleDiv.classList.add('hidden');
  inBattle = false;
  draw();
}

// 初期描画
draw();
