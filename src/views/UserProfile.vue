<template>
  <div class="container mt-50">
    <div v-if="user" class="columns is-centered">
      <div class="column is-6">
        <h3 class="title is-3">Perfil de Usuario</h3>
        <hr>
        
        <!-- Admin User Selection -->
        <div v-if="isAdmin">
          <div class="field">
            <label class="label">Seleccionar Usuario</label>
            <div class="control">
              <div class="select">
                <select v-model="selectedUserId" @change="loadSelectedUser">
                  <option value="">Seleccione un usuario</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.data.firstName }} {{ user.data.lastName }} ({{ user.data.email }})
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="updateProfile" v-if="userData">
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

          <div class="field">
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
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      user: null,
      userData: null,
      isAdmin: false,
      photo: null,
      error: '',
      users: [],
      selectedUserId: ''
    };
  },
  name: 'UserProfile',
  methods: {
    onFileChange(e) {
      this.photo = e.target.files[0];
    },
    async fetchUserData(userId) {
      const docRef = doc(db, "clientes", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.userData = docSnap.data();
      } else {
        this.error = 'No se encontraron datos del usuario.';
      }
    },
    async fetchAllUsers() {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      this.users = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    },
    async loadSelectedUser() {
      if (this.selectedUserId) {
        await this.fetchUserData(this.selectedUserId);
      }
    },
    async updateProfile() {
      if (!this.userData) return;

      const userRef = doc(db, "clientes", this.selectedUserId || this.user.uid);
      try {
        await updateDoc(userRef, this.userData);

        if (this.photo) {
          const storageRef = ref(storage, `photos/${this.selectedUserId || this.user.uid}/${this.photo.name}`);
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
        const userRef = doc(db, "clientes", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          this.isAdmin = true;
          await this.fetchAllUsers();
        } else {
          await this.fetchUserData(user.uid);
        }
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
