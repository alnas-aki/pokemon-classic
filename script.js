const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const battleDiv = document.getElementById('battle');
const battleMessage = document.getElementById('battle-message');
const playerHPBar = document.getElementById('playerHPBar');
const enemyHPBar = document.getElementById('enemyHPBar');
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('startScreen');

let player = { x: 180, y: 180, size: 16 };
let inBattle = false;
let playerHP = 50;
let enemyHP = 30;

// 草むらエリア
const grassAreas = [
  { x: 50, y: 50, w: 100, h: 100 },
  { x: 250, y: 200, w: 100, h: 120 }
];

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 草むら
  ctx.fillStyle = '#8ccf8c';
  grassAreas.forEach(g => ctx.fillRect(g.x, g.y, g.w, g.h));

  // プレイヤー
  ctx.fillStyle = '#f4e04d';
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.strokeStyle = '#c4b02d';
  ctx.strokeRect(player.x, player.y, player.size, player.size);

  if (!inBattle) requestAnimationFrame(draw);
}

// キー操作
document.addEventListener('keydown', (e) => {
  if (inBattle) return;
  const step = 8;
  if (e.key === 'ArrowUp' && player.y > 0) player.y -= step;
  if (e.key === 'ArrowDown' && player.y < canvas.height - player.size) player.y += step;
  if (e.key === 'ArrowLeft' && player.x > 0) player.x -= step;
  if (e.key === 'ArrowRight' && player.x < canvas.width - player.size) player.x += step;

  if (isInGrass(player.x, player.y) && Math.random() < 0.15) {
    startBattle();
  }
});

function isInGrass(x, y) {
  return grassAreas.some(g => x > g.x && x < g.x + g.w && y > g.y && y < g.y + g.h);
}

// 戦闘開始
function startBattle() {
  inBattle = true;
  battleDiv.classList.remove('hidden');
  playerHP = 50;
  enemyHP = 30;
  updateHPBars();
  battleMessage.textContent = "あ！ やせいのモンスターが とびだしてきた！";
}

// 戦闘ボタン
document.getElementById('attackBtn').addEventListener('click', () => {
  if (!inBattle) return;

  const dmg = Math.floor(Math.random() * 10) + 5;
  enemyHP -= dmg;
  if (enemyHP <= 0) {
    enemyHP = 0;
    battleMessage.textContent = `敵に${dmg}ダメージ！ たおした！🎉`;
    updateHPBars();
    setTimeout(endBattle, 1000);
    return;
  }

  battleMessage.textContent = `敵に${dmg}ダメージ！`;
  updateHPBars();

  setTimeout(enemyAttack, 600);
});

// 敵の反撃
function enemyAttack() {
  const enemyDmg = Math.floor(Math.random() * 8) + 3;
  playerHP -= enemyDmg;
  if (playerHP <= 0) {
    playerHP = 0;
    battleMessage.textContent = `敵のこうげき！ ${enemyDmg}ダメージ！ まけた💀`;
    updateHPBars();
    setTimeout(endBattle, 1000);
    return;
  }
  battleMessage.textContent += `\n敵のこうげき！ ${enemyDmg}ダメージ！`;
  updateHPBars();
}

// ボールで捕獲
document.getElementById('ballBtn').addEventListener('click', () => {
  if (!inBattle) return;

  const catchRate = Math.max(10, 50 - enemyHP); // HP低いほど捕獲しやすい
  const roll = Math.floor(Math.random() * 100);
  if (roll < catchRate) {
    battleMessage.textContent = `ボールで捕まえた！🎉`;
    setTimeout(endBattle, 1000);
  } else {
    battleMessage.textContent = `ボールに失敗…`;
    setTimeout(enemyAttack, 500);
  }
});

document.getElementById('runBtn').addEventListener('click', () => {
  if (!inBattle) return;
  battleMessage.textContent = "うまくにげた！💨";
  setTimeout(endBattle, 500);
});

function updateHPBars() {
  playerHPBar.style.width = playerHP + "%";
  enemyHPBar.style.width = enemyHP + "%";
}

function endBattle() {
  battleDiv.classList.add('hidden');
  inBattle = false;
  draw();
}

// スタートボタンでゲーム開始
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
  draw();
});
