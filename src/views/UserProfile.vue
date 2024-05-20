<template>
  <div class="container mt-50">
    <div v-if="user && userData" class="columns is-centered">
      <div class="column is-6">
        <h3 class="title is-3">Perfil de Usuario</h3>
        <hr>
        <form @submit.prevent="updateProfile">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input class="input" type="text" v-model="userData.firstName" />
            </div>
          </div>

          <div class="field">
            <label class="label">Apellidos</label>
            <div class="control">
              <input class="input" type="text" v-model="userData.lastName" />
            </div>
          </div>

          <div class="field">
            <label class="label">Tipo de Documento</label>
            <div class="control">
              <div class="select">
                <select v-model="userData.documentType">
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Número de Documento</label>
            <div class="control">
              <input class="input" type="text" v-model="userData.documentNumber" />
            </div>
          </div>

          <div class="field">
            <label class="label">Género</label>
            <div class="control">
              <div class="select">
                <select v-model="userData.gender">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Correo electrónico</label>
            <div class="control">
              <input class="input" type="email" v-model="userData.email" disabled />
            </div>
          </div>

          <div class="field">
            <label class="label">Número de Teléfono Móvil</label>
            <div class="control">
              <input class="input" type="text" v-model="userData.phoneNumber" />
            </div>
          </div>

          <div class="field" v-if="isAdmin">
            <label class="label">Rol</label>
            <div class="control">
              <div class="select">
                <select v-model="userData.role">
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Fecha de Nacimiento</label>
            <div class="control">
              <input class="input" type="date" v-model="userData.birthDate" />
            </div>
          </div>

          <div class="field">
            <label class="label">Foto</label>
            <div class="control">
              <input class="input" type="file" @change="onFileChange" />
            </div>
          </div>

          <button type="submit" class="button is-primary">Actualizar Perfil</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from '@/firebase/init';
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      user: null,
      userData: null,
      isAdmin: false,
      photo: null,
      error: ''
    };
  },
  name: 'UserProfile',
  methods: {
    onFileChange(e) {
      this.photo = e.target.files[0];
    },
    async fetchUserData(user) {
      const docRef = doc(db, "clientes", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.userData = docSnap.data();
        this.isAdmin = this.userData.role === 'admin';
      } else {
        this.error = 'No se encontraron datos del usuario.';
      }
    },
    async updateProfile() {
      if (!this.userData) return;

      const userRef = doc(db, "clientes", this.user.uid);
      try {
        await updateDoc(userRef, this.userData);

        if (this.photo) {
          const storageRef = ref(storage, `photos/${this.user.uid}/${this.photo.name}`);
          const uploadTask = uploadBytesResumable(storageRef, this.photo);
          await uploadTask;
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(userRef, { photoURL: photoURL });
        }
      } catch (error) {
        this.error = 'Error actualizando el perfil: ' + error.message;
      }
    }
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        await this.fetchUserData(user);
      } else {
        this.$router.push({ name: 'login' });
      }
    });
  }
};
</script>

<style scoped>
.mt-50 {
  margin-top: 50px;
}
</style>
