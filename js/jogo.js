// Variáveis globais
let desempenho = 0;
let tentativas = 0;
let acertos = 0;
let jogar = true;

// Elementos do DOM
const btnReiniciar = document.getElementById('reiniciar');
const btnJogarNovamente = document.getElementById('joganovamente');
const efeitoDiv = document.getElementById('efeito');
const efeitoImagem = document.getElementById('efeito-imagem');

// Função para exibir efeitos de bomba ou serpentinas
function mostrarEfeito(tipo) {
  // Forçar reinicialização da animação
  efeitoImagem.style.animation = 'none';
  efeitoImagem.offsetHeight; // Trigger reflow
  efeitoImagem.style.animation = 'efeitoAnimacao 1s ease-in-out';

  efeitoDiv.classList.remove('d-none');
  if (tipo === 'bomba') {
    efeitoImagem.src = 'https://pngtree.com/png-vector/20190115/ourmid/pngtree-explosion-burst-bomb-boom-bang-png-image_319239.jpg';
    efeitoImagem.alt = 'Explosão de Bomba';
  } else if (tipo === 'serpentinas') {
    efeitoImagem.src = 'https://pngtree.com/png-vector/20190228/ourmid/pngtree-confetti-background-png-image_708752.jpg';
    efeitoImagem.alt = 'Serpentinas';
  }
  // Esconder o efeito após a animação
  setTimeout(() => {
    efeitoDiv.classList.add('d-none');
  }, 1000); // Duração da animação (1 segundo)
}

// Função para reiniciar o jogo completamente
function reiniciar() {
  desempenho = 0;
  tentativas = 0;
  acertos = 0;
  jogar = true;
  jogarNovamente();
  atualizaPlacar(0, 0);
  btnJogarNovamente.classList.remove('d-none');
  btnReiniciar.classList.add('d-none');
}

// Função para jogar novamente (mantém o placar)
function jogarNovamente() {
  jogar = true;
  
  // Resetar as células
  document.querySelectorAll('.card-cell').forEach(cell => {
    cell.className = 'card card-cell inicial';
    const img = cell.querySelector('img');
    if (img) img.remove();
    
    // Mostrar o número novamente
    const numberSpan = cell.querySelector('.card-number');
    numberSpan.classList.remove('hidden-number');
  });
}

// Atualiza o placar
function atualizaPlacar(acertos, tentativas) {
  desempenho = tentativas > 0 ? (acertos / tentativas) * 100 : 0;
  document.getElementById("resposta").innerHTML = `
    Placar - Acertos: <span class="text-success">${acertos}</span> | 
    Tentativas: <span class="text-primary">${tentativas}</span> | 
    Desempenho: <span class="fw-bold">${Math.round(desempenho)}%</span>
  `;
  
  // Verificar desempenho para efeitos
  if (tentativas >= 1) { // Só mostrar efeitos após pelo menos uma tentativa
    if (Math.round(desempenho) === 0) {
      mostrarEfeito('bomba');
    } else if (Math.round(desempenho) === 100) {
      mostrarEfeito('serpentinas');
    }
  }
}

// Função chamada quando o jogador acerta
function acertou(obj) {
  obj.classList.remove('inicial');
  obj.classList.add('acertou');
  
  // Esconder o número
  const numberSpan = obj.querySelector('.card-number');
  numberSpan.classList.add('hidden-number');
  
  const img = new Image();
  img.id = "imagem";
  img.src = "https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg";
  img.alt = "Smile";
  img.classList.add('img-fluid');
  
  const cardBody = obj.querySelector('.card-body');
  cardBody.appendChild(img);
}

// Função chamada quando o jogador erra
function errou(obj) {
  obj.classList.remove('inicial');
  obj.classList.add('errou');
  
  // Esconder o número
  const numberSpan = obj.querySelector('.card-number');
  numberSpan.classList.add('hidden-number');
  
  const img = new Image();
  img.id = "imagem";
  img.src = "https://png.pngtree.com/png-vector/20221110/ourmid/pngtree-yellow-sad-emoji-design-with-big-glassy-eyes-png-image_6432751.png";
  img.alt = "Sad Face";
  img.classList.add('img-fluid');
  
  const cardBody = obj.querySelector('.card-body');
  cardBody.appendChild(img);
}

// Função principal que verifica a jogada
function verifica(obj) {
  if (!jogar) {
       alert('Clique em "Jogar novamente" para continuar');
    return;
  }

  jogar = false;
  tentativas++;

  if (tentativas === 1) {
    btnJogarNovamente.classList.add('d-none');
    btnReiniciar.classList.remove('d-none');
  }

  const sorteado = Math.floor(Math.random() * 6); // 6 cartas (0 a 5)
  
  if (obj.id == sorteado) {
    acertou(obj);
    acertos++;
  } else {
    errou(obj);
    const objSorteado = document.getElementById(sorteado);
    acertou(objSorteado);
  }

  atualizaPlacar(acertos, tentativas);
}

// Event listeners
btnJogarNovamente.addEventListener('click', jogarNovamente);
btnReiniciar.addEventListener('click', reiniciar);