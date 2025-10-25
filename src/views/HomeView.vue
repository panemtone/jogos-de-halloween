<template>
  <main>
    <section id="homePage" class="h-screen relative overflow-hidden" @click="handleScreenClick">
      <div id="text-section" class="absolute inset-0 z-20">
        <h1
          id="texto1"
          class="text-white text-5xl font-bold tracking-widest smoke-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          Os promoters do servidor<br />
          Bel Rodrigues apresentam...
        </h1>
        <div
          id="secao-principal"
          class="flex flex-col items-center text-center opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <h1 id="texto-principal" class="text-8xl font-bold tracking-widest text-center">
            Jogos de Halloween
          </h1>
          <p id="texto-secundario" class="text-7xl font-sans tracking-widest mt-4">2025</p>
          <router-link to="/profecia" class="ghost-button" @mouseover.once="handleButtonHover">
            Entrar
          </router-link>
        </div>
      </div>
      <div id="background-section" class="absolute inset-0 z-10">
        <div class="constelacao"></div>
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
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { gerarEstrelas } from '@/scripts/estrelas'

import jumpscareAudioFile from '@/assets/sounds/belGrito.mp3'

const clickSequenceStarted = ref(false)
const currentClickStep = ref(0)
const jumpscareVisible = ref(false)

const audio = ref(new Audio(jumpscareAudioFile))

const hotspots = [
  // 0. Janela do meio da casa
  { xMin: 93, xMax: 95, yMin: 65, yMax: 77 },
  // 1. Lua
  { xMin: 0, xMax: 14, yMin: 0, yMax: 25 },
  // 2. Raiz da árvore (canto inferior esquerdo)
  { xMin: 0, xMax: 3, yMin: 85, yMax: 100 },
  // 3. Terceira cruz (pequena)
  { xMin: 23, xMax: 27, yMin: 89, yMax: 98 },
]

function handleButtonHover() {
  gsap.to('.ghost-button', {
    opacity: 0,
    filter: 'blur(8px)', // Adiciona o "borrão" da fumaça
    scale: 1.1, // Faz o botão "expandir" como fumaça
    pointerEvents: 'none', // Isso é aplicado IMEDIATAMENTE no início
    duration: 0.5, // Aumentei a duração para o efeito ser mais visível
    ease: 'power2.out',
    onComplete: () => {
      clickSequenceStarted.value = true // Inicia o puzzle
    },
  })
}

function isClickInHotspot(xPercent, yPercent, hotspot) {
  return (
    xPercent >= hotspot.xMin &&
    xPercent <= hotspot.xMax &&
    yPercent >= hotspot.yMin &&
    yPercent <= hotspot.yMax
  )
}

function handleScreenClick(event) {
  if (!clickSequenceStarted.value || jumpscareVisible.value) {
    return
  }

  const xPercent = (event.clientX / window.innerWidth) * 100
  const yPercent = (event.clientY / window.innerHeight) * 100
  const expectedHotspot = hotspots[currentClickStep.value]

  if (isClickInHotspot(xPercent, yPercent, expectedHotspot)) {
    // ACERTOU!
    currentClickStep.value++

    if (currentClickStep.value === hotspots.length) {
      // COMPLETOU!
      console.log('Sequência correta! Botão reaparecendo...')
      clickSequenceStarted.value = false // Termina o puzzle

      // MUDANÇA: Faz o botão reaparecer e ser clicável
      gsap.fromTo(
        '.ghost-button',
        {
          // Estado INICIAL (fumaça)
          opacity: 0,
          filter: 'blur(8px)',
          scale: 1.1,
        },
        {
          // Estado FINAL (nítido)
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          pointerEvents: 'auto', // Torna clicável SÓ NO FINAL
          duration: 1.0, // Mesma duração da entrada
          ease: 'power2.inOut',
        },
      )
    }
  } else {
    // ERROU!
    console.log('Clique no local errado!')
    jumpscareVisible.value = true // Mostra o "jumpscare"
    clickSequenceStarted.value = false // Termina o puzzle (botão continua invisível)

    setTimeout(() => {
      jumpscareVisible.value = false // 1. Esconde o "jumpscare"
      currentClickStep.value = 0 // 2. Reinicia a contagem de cliques para o primeiro passo
      clickSequenceStarted.value = true // 3. REATIVA o puzzle para o usuário tentar de novo
    }, 3000)
  }
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

onMounted(() => {
  gerarEstrelas()

  const tl = gsap.timeline({
    delay: 5, // Inicia toda a sequência após 5 segundos
  })

  // 1. Animação de Desaparecimento do #texto1
  tl.to('#texto1', {
    duration: 2, // duração do desaparecimento
    opacity: 0, // desaparece
    filter: 'blur(8px)', // efeito de fumaça (ajuste conforme seu CSS 'smoke-text' se for o caso)
    ease: 'power2.out',
  })

  tl.fromTo(
    '#secao-principal',
    {
      opacity: 0,
      filter: 'blur(10px)', // Começa bem borrado
      scale: 0.9, // Começa um pouco menor para dar a impressão de surgir
    },
    {
      opacity: 1,
      filter: 'blur(0px)', // Desfaz o borrado
      scale: 1, // Volta ao tamanho normal
      duration: 1.5, // duração do aparecimento
      ease: 'power2.out',
    },
    '+=0.5',
  ) // Adiciona um atraso de 0.5 segundos após o #texto1 sumir.
})
</script>
