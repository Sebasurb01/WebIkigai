import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from '@/firebase/init'; // Importa tu inicialización de Firebase

let app = null;

// Asegúrate de que la instancia de Firebase Auth está lista antes de montar la aplicación
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
}); 
