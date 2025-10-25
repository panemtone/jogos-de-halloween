export function gerarEstrelas() {
  // Suas variáveis originais
  var style = ['style1', 'style2', 'style3', 'style4']
  var tam = ['tam1', 'tam1', 'tam1', 'tam2', 'tam3']
  var opacity = ['opacity1', 'opacity1', 'opacity1', 'opacity2', 'opacity2', 'opacity3']

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  var estrela = ''
  var noite = document.querySelector('.constelacao')
  var widthWindow = window.innerWidth
  var heightWindow = window.innerHeight

  // --- MUDANÇAS AQUI ---

  // 1. Calcular a diagonal da tela e arredondar para cima
  var diagonal = Math.ceil(Math.sqrt(Math.pow(widthWindow, 2) + Math.pow(heightWindow, 2)))

  // 2. Definir o tamanho do contêiner como um quadrado com o tamanho da diagonal
  noite.style.width = diagonal + 'px'
  noite.style.height = diagonal + 'px'

  // 3. Centralizar o contêiner na tela
  // (Isso vai dar valores negativos de left/top, o que é correto)
  noite.style.left = (widthWindow - diagonal) / 2 + 'px'
  noite.style.top = (heightWindow - diagonal) / 2 + 'px'

  // 4. Aumentar a quantidade de estrelas para preencher a nova área (que é maior)
  // O original era 200. Vamos dobrar para 400. Ajuste se achar muito/pouco.
  var qtdeEstrelas = 400

  // 5. Gerar as estrelas dentro do novo contêiner (usando 'diagonal' como limite)
  for (var i = 0; i < qtdeEstrelas; i++) {
    estrela +=
      "<span class='estrela " +
      style[getRandomArbitrary(0, 4)] +
      ' ' +
      opacity[getRandomArbitrary(0, 6)] +
      ' ' +
      tam[getRandomArbitrary(0, 5)] +
      "' style='animation-delay: ." +
      getRandomArbitrary(0, 9) +
      's; left: ' +
      getRandomArbitrary(0, diagonal) + // <-- Usar diagonal
      'px; top: ' +
      getRandomArbitrary(0, diagonal) + // <-- Usar diagonal
      "px;'></span>"
  }

  // --- FIM DAS MUDANÇAS ---

  noite.innerHTML = estrela
}
