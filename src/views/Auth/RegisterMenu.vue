<template>
  <div class="container mt-50">
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <h3 class="title is-3">Crear una cuenta</h3>
        <hr>
        <form @submit.prevent="register">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input class="input" type="text" placeholder="sebastian urbano" v-model="name">
            </div>
          </div>
          <div class="field">
            <label class="label">Correo electrónico</label>
            <div class="control">
              <input class="input" type="email" placeholder="sebasurb@gmail.com" v-model="email">
            </div>
          </div>
          <div class="field">
            <label class="label">Contraseña</label>
            <div class="control">
              <input class="input" type="password" placeholder="******" v-model="password">
            </div>
          </div>
          <button type="submit" class="button is-primary">Registrarme</button>
        </form>
        <div class="notification is-danger mt-10" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: ''
    };
  },
  name: 'RegisterMenu',
  methods: {
    register() {
      this.error = '';
      const auth = getAuth();
      if (this.name && this.email && this.password) {
        createUserWithEmailAndPassword(auth, this.email, this.password)
          .then(userCredential => {
            const user = userCredential.user;
            if (user) {
              updateProfile(user, {
                displayName: this.name
              }).then(() => {
                this.name = '';
                this.email = '';
                this.password = '';
                console.log(user);
                this.$router.push('/dashboard');
              }).catch(err => {
                this.error = err.message;
              });
            }
          })
          .catch(err => {
            this.error = err.message;
          });
      } else {
        this.error = 'Todos los campos son requeridos';
      }
    }
  }
};
</script>
