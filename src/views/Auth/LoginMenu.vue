<template>
    <div class="container mt-50">
      <div class="columns">
        <div class="column is-6 is-offset-3">
          <h3 class="title is-3">Iniciar sesión</h3>
          <hr>
          <form @submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input class="input" type="email" placeholder="Correo electrónico" v-model="email">
              </div>
            </div>
            <div class="field">
              <label class="label">Contraseña</label>
              <div class="control">
                <input class="input" type="password" placeholder="Contraseña" v-model="password">
              </div>
            </div>
            <button type="submit" class="button is-primary">Iniciar sesión</button>
          </form>
          <div class="notification is-danger mt-10" v-if="error">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { auth } from '@/firebase/init';
  import { signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      };
    },
    methods: {
      login() {
        this.error = '';
        if (this.email && this.password) {
          signInWithEmailAndPassword(auth, this.email, this.password)
            .then(userCredential => {
              // Inicio de sesión exitoso
              const user = userCredential.user;
              // Haz lo que necesites con el usuario
              console.log(user);
              // Por ejemplo, redirige a la página de inicio
              this.$router.push('/home');
            })
            .catch(err => {
              // Error durante el inicio de sesión
              this.error = err.message;
            });
        } else {
          this.error = 'Por favor, ingresa tu correo electrónico y contraseña';
        }
      }
    }
  };
  </script>
  
  
  
  
  
  
  