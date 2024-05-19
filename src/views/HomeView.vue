<template>
  <div class="home-container">
    <h1>BIENVENIDOS A</h1>

    <h3 class="title is-3">
         IKIGAI WEB
        </h3>
    <img :src="homeImage" alt="Home" class="home-image">
  </div>
</template>

<script>
import homeImage from '@/assets/logo1.png';  // Importa la imagen

export default {
  name: 'HomeView',
  data() {
    return {
      homeImage  // Añade la imagen importada a los datos del componente
    };
  }
}
</script>

<style scoped>
.home-container {
  text-align: center;
}

.home-image {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}
</style>