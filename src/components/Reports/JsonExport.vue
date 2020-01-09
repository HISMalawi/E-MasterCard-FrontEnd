<template>
        <downloadexcel
              class = "btn"
              :data = "jsonData.data"
              :fields = "jsonData.fields"
              type    = "csv"
              name    = "filename.xls">
                Download Excel
        </downloadexcel>
</template>
<script>
import downloadexcel from "vue-json-excel";
export default {
  name: "json-export",
  props:["jsonData"],
  components: {
    downloadexcel
  },
  data: ()=>{
      return {

      }
  }
}
</script>
<style scoped>

</style>