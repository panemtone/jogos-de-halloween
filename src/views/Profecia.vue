<template>
  <section class="flex h-screen justify-center relative bg-[#52375f]">
    <div class="mt-20 text-center z-20">
      <h1 id="titulo-mensagem" class="text-[#16121f] mb-4 text-6xl">
        Descubra os dizeres da profecia
      </h1>
      <p id="dica" class="text-2xl text-[#16121f] mb-14">
        Reza a lenda que uma amiga desvendou os dizeres da profecia assistindo filmes,<br />
        ela provou seu conhecimento para os anciãos e conseguiu acessar o outro lado.
      </p>
      <p
        id="texto-mensagem"
        ref="textParagraph"
        class="text-[#16121f] whitespace-pre-line text-4xl"
      >
        $3$50iç%$0%@ 93 u3 93b$o9 @$kg[9ko% <br />
        f%[ç$d%@ $ 9@cuo$[ % 09@9@p9[% 9t9[k% <br />
        [9@%5v9k0% 3i@o9[i%@ 09 u3 3$ki$c% <br />
        $@ $53$@ fik$539ko9 v$% $% %uo[% 5$0%

        <!-- I thought you were gonna catch me <br />
        I never stopped falling for you <br />
        Now I know better, never let me <br />
        Leave home without a parachute -->
      </p>
      <div class="mt-14">
        <router-link to="/entrada" class="cemetery-button"> Provar conhecimento </router-link>
      </div>
    </div>
    <div class="absolute inset-0">
      <img
        src="../assets/photos/cemiterio.png"
        alt="Plano de Fundo de Halloween"
        class="w-full h-full z-10"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(SplitText, ScrambleTextPlugin)

const textParagraph = ref(null)

const textRevealPercent = 0.06
const upperAndLowerCase = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const getRandomLetter = () =>
  upperAndLowerCase[Math.round(upperAndLowerCase.length * Math.random())]

let textRevealRadius = 40
let st = null
let charData = []
let pageX = 0
let pageY = 0
let scrollY = 0
let scrollX = 0

function updateCharData() {
  // Pega os valores de scroll atuais da window
  scrollY = window.pageYOffset
  scrollX = window.pageXOffset

  charData = st.chars.map((char) => {
    const bounds = char.getBoundingClientRect()
    return {
      el: char,
      pageY: bounds.top + scrollY + bounds.height / 2,
      pageX: bounds.left + scrollX + bounds.width / 2,
      isVisible: false,
    }
  })
}

function handleResize() {
  textRevealRadius = window.innerWidth * textRevealPercent
  updateCharData()
}

function updateText(e) {
  if ('pageY' in e) {
    pageX = e.pageX
    pageY = e.pageY
  } else {
    let scrollYDif = window.pageYOffset - scrollY
    let scrollXDif = window.pageXOffset - scrollX
    scrollY += scrollYDif
    scrollX += scrollXDif
    pageY += scrollYDif
    pageX += scrollXDif
  }

  charData.forEach((data) => {
    const dx = pageX - data.pageX
    const dy = pageY - data.pageY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const isVisible = dist < textRevealRadius

    if (isVisible !== data.isVisible || !isVisible) {
      data.isVisible = isVisible
      gsap.to(data.el, {
        overwrite: true,
        duration: gsap.utils.clamp(1, 4, dist / textRevealRadius),
        scrambleText: {
          text: isVisible ? data.el.orig : getRandomLetter(),
          chars: upperAndLowerCase.join(''),
          tweenSpeed: 4,
        },
      })
    }
  })
}

onMounted(() => {
  // Agora 'textParagraph.value' existe e é o elemento <p>
  if (textParagraph.value) {
    // Inicializa valores de scroll
    scrollY = window.pageYOffset
    scrollX = window.pageXOffset

    // 1. Cria a instância do SplitText
    st = new SplitText(textParagraph.value, { type: 'chars', charsClass: 'char' })

    // 2. Salva o texto original
    st.chars.forEach((char) => (char.orig = char.textContent))

    // 3. Adiciona os event listeners globais
    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', updateText)
    window.addEventListener('scroll', updateText)

    // 4. Executa a configuração inicial
    handleResize()
    updateText({ pageX: 0, pageY: 0 })
  }
})

onUnmounted(() => {
  // 1. Remove os listeners da 'window'
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('pointermove', updateText)
  window.removeEventListener('scroll', updateText)

  // 2. (Opcional, mas boa prática) Reverte o SplitText
  if (st) {
    st.revert()
  }

  // 3. (Opcional, mas boa prática) Mata qualquer animação pendente
  if (charData.length > 0) {
    gsap.killTweensOf(charData.map((data) => data.el))
  }
})
</script>
