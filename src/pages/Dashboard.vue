<template>
  <v-container fluid grid-list-md>

  </v-container>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/pie');

  export default {
    name: "dashboard",
    data(){
      return {

      }
    },
    created(){
      this.verify().then(() => {

      }).catch(() => {
        this.$router.push("/login");
      });
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>
