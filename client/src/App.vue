<template>
  <div id="app">
    <Header
      :company-name="companyName"
      :logo="logo"
    />
    <router-view />
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  export default {
    name: 'App',
    components: {
      Header
    },
    data: function() {
      return {
        companyName: process.env.VUE_APP_VIDEO_CALL_COMPANY_NAME,
        logo: process.env.VUE_APP_VIDEO_CALL_LOGO_URL
      };
    }
  };

</script>

<style>
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  html {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    height: 100vh;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>