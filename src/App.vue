<template>
  <nav>
  <NavigationMenu></NavigationMenu> 
 
  </nav>
  <router-view/>
</template>


<script>
import NavigationMenu from '@/components/layout/NavigationMenu.vue';
export default {
  components:{
    NavigationMenu
  }
}
</script>
<style lang="scss">
@import './scss/App.scss';

  
</style>