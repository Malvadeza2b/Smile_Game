// Configuração do jogo
const config = {
  totalCards: 6,
  images: {
    smile:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg",
    sad: "https://png.pngtree.com/png-vector/20221110/ourmid/pngtree-yellow-sad-emoji-design-with-big-glassy-eyes-png-image_6432751.png",
    bomb: "https://i.gifer.com/embedded/download/7UTj.gif", // GIF de explosão em tela cheia
    confetti: "https://i.gifer.com/embedded/download/7scZ.gif", // GIF de confete em tela cheia
  },
};
// Estado do jogo
const state = {
  score: 0,
  attempts: 0,
  hits: 0,
  isPlaying: true,
};

// Elementos DOM
const elements = {
  gameBoard: document.getElementById("game-board"),
  btnRestart: document.getElementById("reiniciar"),
  btnPlayAgain: document.getElementById("joganovamente"),
  effect: document.getElementById("efeito"),
  effectImg: document.getElementById("efeito-imagem"),
  response: document.getElementById("resposta"),
};

// Inicializa o tabuleiro
function initBoard() {
  elements.gameBoard.innerHTML = "";
  for (let i = 0; i < config.totalCards; i++) {
    elements.gameBoard.innerHTML += `
      <div class="col-md-4 col-sm-6 col-8">
        <div id="card-${i}" class="card card-cell inicial" onclick="checkCard(this)">
          <div class="card-body d-flex justify-content-center align-items-center">
            <span class="display-1 card-number">${i}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Mostra efeito visual modificado para tela cheia
function showEffect(type) {
  // Resetar animação
  elements.effectImg.style.animation = 'none';
  void elements.effectImg.offsetWidth;
  
  // Configurar a imagem e classe de efeito
  elements.effectImg.src = config.images[type === 'bomb' ? 'bomb' : 'confetti'];
  elements.effectImg.alt = type === 'bomb' ? 'Explosão' : 'Serpentinas';
  elements.effectImg.className = type === 'bomb' ? 'bomb-effect' : 'confetti-effect';
  
  // Mostrar o efeito
  elements.effect.classList.remove('d-none');
  
  // Esconder após a animação
  setTimeout(() => {
    elements.effect.classList.add('d-none');
  }, 1000);
}

// Atualiza o placar
function updateScore() {
  const performance =
    state.attempts > 0 ? Math.round((state.hits / state.attempts) * 100) : 0;

  elements.response.innerHTML = `
    Placar - Acertos: <span class="text-success">${state.hits}</span> | 
    Tentativas: <span class="text-primary">${state.attempts}</span> | 
    Desempenho: <span class="fw-bold">${performance}%</span>
  `;

  if (state.attempts > 0) {
    if (performance === 0) showEffect("bomb");
    if (performance === 100) showEffect("confetti");
  }
}

// Lógica do jogo
function checkCard(card) {
  if (!state.isPlaying)
    return alert('Clique em "Jogar novamente" para continuar');

  state.isPlaying = false;
  state.attempts++;

  const randomCard = Math.floor(Math.random() * config.totalCards);
  const isCorrect = card.id === `card-${randomCard}`;

  if (isCorrect) state.hits++;

  updateCard(card, isCorrect);
  updateCard(document.getElementById(`card-${randomCard}`), true);

  updateScore();
  toggleButtons();
}

// Atualiza visual da carta
function updateCard(card, isCorrect) {
  card.classList.remove("inicial");
  card.classList.add(isCorrect ? "acertou" : "errou");

  const number = card.querySelector(".card-number");
  number.classList.add("hidden-number");

  const img = new Image();
  img.src = isCorrect ? config.images.smile : config.images.sad;
  img.alt = isCorrect ? "Smile" : "Sad";
  img.classList.add("img-fluid", "card-img");

  card.querySelector(".card-body").appendChild(img);
}

// Controle de botões
function toggleButtons() {
  elements.btnPlayAgain.classList.toggle("d-none", state.attempts > 0);
  elements.btnRestart.classList.toggle("d-none", state.attempts === 0);
}

// Reinicia o jogo
function resetGame() {
  state.score = state.attempts = state.hits = 0;
  state.isPlaying = true;
  initBoard();
  updateScore();
  toggleButtons();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initBoard();
  elements.btnPlayAgain.addEventListener("click", () => {
    state.isPlaying = true;
    initBoard();
  });
  elements.btnRestart.addEventListener("click", resetGame);
});
