<template>
  <div class="header">
    <img
      :src="logo"
      style="height: 40px"
    >
    <div class="title">
      {{ companyName }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    companyName: String,
    logo: String
  },
  mounted(){
      
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  width: 100%;
  background: #eee;
  padding: 20px;
  align-items: center;

  .title {
    font-size: 18px;
    margin-left: 15px;
  }
}
</style>
