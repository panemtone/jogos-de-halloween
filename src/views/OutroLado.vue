<template>
  <section class="flex h-screen justify-center relative bg-[#eb6521]">
    <div class="flex flex-col mt-35 text-center items-center z-20">
      <h1 id="titulo-mensagem" class="mb-4 text-6xl">Parabéns por alcançar o outro lado</h1>
      <p id="titulo-mensagem" class="text-3xl mb-4">Como recompensa, sua alma será liberta</p>
      <p id="texto-outro-lado" class="text-xl mb-14 w-240">
        Para finalizar a prova, envie a frase a seguir no privado de um dos promoters
        <br />
        "Descobri a profecia, fui para o outro lado e minha alma foi liberta"<br />
        Lembrando: <b>não</b> conte para as outras equipes que vocês terminaram, comentem sobre a
        prova somente no chat e call da sua equipe.
      </p>
      <div class="mt-8">
        <router-link to="/galeria" class="halloween-button"> Galeria </router-link>
      </div>
    </div>
    <div class="absolute inset-0">
      <img
        src="../assets/photos/halloweentown.png"
        alt="Plano de Fundo de Halloween"
        class="w-full h-full z-10"
      />
    </div>
  </section>
</template>

<script setup></script>
