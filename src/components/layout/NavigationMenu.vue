<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <h3 class="title is-3">
          <img :src="logo" alt="Icono" class="logo-image"> IKIGAI
        </h3>
      </router-link>

      <a role="button" class="navbar-burger" :class="{'is-active': isOpen}" @click.prevent="toggleMenu" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': isOpen}">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">
          Home
        </router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">


          <template v-if="user">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                USUARIO
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                  Informacion 
                </a>
                <a class="navbar-item" @click="logout">
                  Cerrar Sesión
                </a>
                <a class="navbar-item">
                  Contacto
                </a>
               
                <a class="navbar-item">
                  Reportar Error
                </a>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="buttons">
              <router-link class="button is-primary" to="/register">
                <strong>Registarme</strong>
              </router-link>
              <router-link class="button is-light" to="/login">
                Iniciar Sesión
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
//import { ref, onMounted } from "vue";

export default {
  data() {
    return {
      isOpen: false,
      logo: require('@/assets/logo.png'),
      user: null,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$router.push({ name: 'login' });
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user ? user : null;
    });
  },
};
</script>

<style>
.logo-image {
  width: 40px; /* Ajusta el ancho según tus necesidades */
  height: 40px; /* Mantén la proporción de la imagen */
}
</style>
