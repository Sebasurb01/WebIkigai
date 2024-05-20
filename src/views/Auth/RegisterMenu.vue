<template>
  <div class="container mt-50">
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <h3 class="title is-3">Crear una cuenta</h3>
        <hr>
        <form @submit.prevent="register">
          <!-- Nombre -->
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input class="input" type="text" placeholder="Nombre" v-model="firstName" required>
            </div>
          </div>
          
          <!-- Apellidos -->
          <div class="field">
            <label class="label">Apellidos</label>
            <div class="control">
              <input class="input" type="text" placeholder="Apellidos" v-model="lastName" required>
            </div>
          </div>

          <!-- Tipo de documento -->
          <div class="field">
            <label class="label">Tipo de Documento</label>
            <div class="control">
              <div class="select">
                <select v-model="documentType" required>
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Número de documento -->
          <div class="field">
            <label class="label">Número de Documento</label>
            <div class="control">
              <input class="input" type="text" placeholder="Número de Documento" v-model="documentNumber" required>
            </div>
          </div>

          <!-- Género -->
          <div class="field">
            <label class="label">Género</label>
            <div class="control">
              <div class="select">
                <select v-model="gender" required>
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Correo electrónico -->
          <div class="field">
            <label class="label">Correo electrónico</label>
            <div class="control">
              <input class="input" type="email" placeholder="Correo electrónico" v-model="email" required>
            </div>
          </div>

          <!-- Número de teléfono móvil -->
          <div class="field">
            <label class="label">Número de Teléfono Móvil</label>
            <div class="control">
              <input class="input" type="text" placeholder="Número de Teléfono Móvil" v-model="phoneNumber" required>
            </div>
          </div>

          <!-- Rol -->
          <div class="field">
            <label class="label">Rol</label>
            <div class="control">
              <div class="select">
                <select v-model="role" required>
                  <option value="">Seleccione</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Fecha de nacimiento -->
          <div class="field">
            <label class="label">Fecha de Nacimiento</label>
            <div class="control">
              <input class="input" type="date" v-model="birthDate" required>
            </div>
          </div>

          <!-- Foto -->
          <div class="field">
            <label class="label">Foto</label>
            <div class="control">
              <input class="input" type="file" @change="onFileChange">
            </div>
          </div>

          <!-- Contraseña -->
          <div class="field">
            <label class="label">Contraseña</label>
            <div class="control">
              <input class="input" type="password" placeholder="Contraseña" v-model="password" required>
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
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from '@/firebase/init';
import { doc, setDoc, query, where, getDocs, collection } from "firebase/firestore";

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      documentType: '',
      documentNumber: '',
      gender: '',
      email: '',
      phoneNumber: '',
      role: '',
      birthDate: '',
      photo: null,
      password: '',
      error: ''
    };
  },
  name: 'RegisterMenu',
  methods: {
    onFileChange(e) {
      this.photo = e.target.files[0];
    },
    async register() {
      this.error = '';
      const auth = getAuth();
      if (this.firstName && this.lastName && this.documentType && this.documentNumber && this.gender && this.email && this.phoneNumber && this.role && this.birthDate && this.password) {
        try {
          // Verificar la cantidad de administradores
          if (this.role === 'admin') {
            const adminsQuery = query(collection(db, "clientes"), where("role", "==", "admin"));
            const adminSnapshot = await getDocs(adminsQuery);
            if (adminSnapshot.size >= 2) {
              this.error = 'No se pueden registrar más de dos administradores.';
              return;
            }
          }

          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;

          if (user) {
            await updateProfile(user, {
              displayName: `${this.firstName} ${this.lastName}`
            });

            let photoURL = '';
            if (this.photo) {
              const storageRef = ref(storage, `photos/${user.uid}/${this.photo.name}`);
              const uploadTask = uploadBytesResumable(storageRef, this.photo);
              await uploadTask;
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
            }

            await setDoc(doc(db, "clientes", user.uid), {
              firstName: this.firstName,
              lastName: this.lastName,
              documentType: this.documentType,
              documentNumber: this.documentNumber,
              gender: this.gender,
              email: this.email,
              phoneNumber: this.phoneNumber,
              role: this.role,
              birthDate: this.birthDate,
              photoURL: photoURL,
              createdAt: new Date(),
              isActive: true
            });

            // Clear form fields
            this.firstName = '';
            this.lastName = '';
            this.documentType = '';
            this.documentNumber = '';
            this.gender = '';
            this.email = '';
            this.phoneNumber = '';
            this.role = '';
            this.birthDate = '';
            this.photo = null;
            this.password = '';

            // Redirect to profile
            this.$router.push({ name: 'profile' });
          }
        } catch (err) {
          this.error = err.message;
        }
      } else {
        this.error = 'Todos los campos son requeridos';
      }
    }
  }
};
</script>
