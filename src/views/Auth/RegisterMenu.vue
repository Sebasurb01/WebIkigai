<template>

<div class="container">
<div class ="columns">
<div class="column is-6 is-offset-3">
    <h3 class="title is-3">Crear una cuenta</h3><hr>
<form action="#" @submit.prevent="register">

    <div class="field">
  <label class="label">Name</label>
  <div class="control">
    <input class="input" type="text" placeholder="e.g Alex Smith" v-model="name">
  </div>
</div>

<div class="field">
  <label class="label">Email</label>
  <div class="control">
    <input class="input" type="email" placeholder="e.g. alexsmith@gmail.com" v-model="email">
  </div>
</div>

<div class="field">
  <label class="label">Contrasena</label>
  <div class="control">
    <input class="input" type="password" placeholder="123asd" v-model="password">
  </div>
</div>

<button type="submit" class="button is-primary">Registrarme</button>

</form>
<div class="notification is-danger" v-if="error">
 {{ error }}
</div>

</div>
</div>
   </div>
</template>


<script>

export default{
data(){
    return {
name:'',
email :'',
password :'',
error :''
       }
  },
    name:'RegisterMenu',
    methods: {
        register() {
            if (this.name && this.email && this.password ){
                //enviamos formularios
        }else{ this.error = 'todos los campos son requeridos '

                 }
        } 
        
     }



}
    

</script>