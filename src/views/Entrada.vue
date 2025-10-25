<template>
  <section class="flex h-screen justify-center relative overflow-hidden">
    <div class="flex flex-col mt-25 text-center items-center z-20">
      <h1 id="titulo-mensagem" class="text-white mb-4 text-5xl">Profecia</h1>
      <p id="dica" class="text-white text-xl mb-15">
        Para fazer a passagem para o outro lado <br />
        informe a profecia corretamente
      </p>
      <textarea
        v-model="resposta"
        class="bg-transparent border border-white text-white rounded-lg w-90 h-30 p-3 mb-8 resize-none focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="Digite a profecia..."
      ></textarea>
      <div class="prophecy-button" @click="verificarProfecia">Atravessar</div>
    </div>

    <div ref="ghostContainer" class="absolute inset-0 z-5"></div>

    <div class="absolute inset-0">
      <img
        src="../assets/photos/portal.png"
        alt="Plano de Fundo de Halloween"
        class="w-full h-full z-10"
      />
    </div>

    <div
      v-if="jumpscareVisible"
      id="jumpscare-overlay"
      class="absolute inset-0 z-50 flex items-center justify-center bg-black"
    >
      <h2 id="texto-secundario" class="text-8xl font-bold text-red-600 animate-pulse">
        Você errou, tente novamente
      </h2>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'

import jumpscareAudioFile from '@/assets/sounds/belGrito.mp3'

// 1. Importar as imagens dos fantasmas
import fantasma1 from '../assets/photos/fantasma1.png'
import fantasma2 from '../assets/photos/fantasma2.png'
import fantasma3 from '../assets/photos/fantasma3.png'
import fantasma4 from '../assets/photos/fantasma4.png'

const router = useRouter()
const jumpscareVisible = ref(false)
const resposta = ref('')
const profecia = ref(
  'amaldiçoados em um embate sangrento forçados a escutar o desespero eterno resolvendo misterios de um maniaco as almas finalmente vao ao outro lado',
)
const audio = ref(new Audio(jumpscareAudioFile))

// Array com as imagens para facilitar a escolha aleatória
const ghostImages = [fantasma1, fantasma2, fantasma3, fantasma4]

// Referência para o container dos fantasmas no template
const ghostContainer = ref(null)

// Variável para guardar o ID do nosso intervalo
let ghostInterval = null

// Pegamos a função 'random' do GSAP para facilitar
const random = gsap.utils.random

const createAndAnimateGhost = () => {
  // Garante que o container já existe no DOM
  if (!ghostContainer.value) return

  // 1. Criar o elemento <img>
  const ghostImg = document.createElement('img')

  // 2. Escolher aleatoriamente o 'src' do fantasma
  ghostImg.src = ghostImages[Math.floor(Math.random() * ghostImages.length)]

  // 3. Adicionar o fantasma ao container no DOM
  ghostContainer.value.appendChild(ghostImg)

  // 4. Definir posição inicial e estilos com GSAP
  // Escolhe um lado (esquerda: 10-30% da tela, direita: 70-90% da tela)
  const side = Math.random() < 0.5 ? 'left' : 'right'
  const xPos = side === 'left' ? random(10, 25) : random(75, 90) // Posição horizontal em % (vw)
  const size = random(120, 150) // Tamanho em pixels

  gsap.set(ghostImg, {
    position: 'absolute',
    top: '100vh', // Começa 100% abaixo do topo da viewport (fora da tela, embaixo)
    left: `${xPos}vw`,
    width: `${size}px`,
    opacity: 0,
    xPercent: -50, // Truque para centralizar a imagem na posição 'left'
  })

  // 5. Criar a timeline da animação
  const tl = gsap.timeline({
    onComplete: () => ghostImg.remove(), // Limpa o DOM ao final
  })

  // Animação de subida (duração longa e aleatória)
  tl.to(
    ghostImg,
    {
      y: '-120vh', // Sobe 120% da altura da tela (garante que saia por cima)
      x: `random(-5, 5)vw`, // Adiciona um leve "zigue-zague" horizontal
      duration: random(7, 12),
      ease: 'none', // Movimento constante, sem aceleração
    },
    0,
  ) // O '0' faz essa animação começar no tempo 0 da timeline

    // Animação de fade-in (aparecer)
    .to(
      ghostImg,
      {
        opacity: random(0.6, 0.9), // Aparece com uma opacidade aleatória
        duration: 1.5,
      },
      0,
    ) // Também começa no tempo 0

    // Animação de fade-out (desaparecer)
    .to(
      ghostImg,
      {
        opacity: 0,
        duration: 2,
      },
      '>-=2',
    ) // '>-=2' significa "comece 2 segundos ANTES do final da timeline"
}

watch(jumpscareVisible, (newValue) => {
  if (newValue === true) {
    // Quando o jumpscare aparecer, toca o áudio
    audio.value.currentTime = 0 // Reinicia o áudio (caso já tenha tocado)
    audio.value.play()
  } else {
    // Opcional: Se quiser parar o áudio quando o susto sumir
    // audio.value.pause()
  }
})

function verificarProfecia() {
  console.log(resposta.value)
  console.log(profecia.value)
  if (resposta.value.toLowerCase() === profecia.value.toLowerCase()) {
    router.push('outrolado')
  } else {
    jumpscareVisible.value = true
    setTimeout(() => {
      jumpscareVisible.value = false
    }, 3000)
  }
}

// 6. Iniciar e parar o loop
onMounted(() => {
  // Inicia o loop, criando um fantasma a cada 4 segundos (4000ms)
  ghostInterval = setInterval(createAndAnimateGhost, 4000)
})

onUnmounted(() => {
  // Limpa o intervalo quando o componente é destruído
  // Isso evita vazamentos de memória e erros
  if (ghostInterval) {
    clearInterval(ghostInterval)
  }

  // Opcional: Animação para remover todos os fantasmas restantes
  // caso o usuário saia da página
  if (ghostContainer.value) {
    gsap.to(ghostContainer.value.children, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        if (ghostContainer.value) {
          ghostContainer.value.innerHTML = ''
        }
      },
    })
  }
})
</script>
