<template>
    <div>

        <table id="patient-list-table" v-if="patients.length > 0">
                <tr>
                    <th  v-for="(column, index) in Object.keys(patients[0])" v-bind:key="index">
                        {{column}}
                    </th>                
                </tr>
                <tr v-for="(patient, index) in patients" v-bind:key="index">
                    <td  v-for="(column, index) in Object.keys(patients[0])" v-bind:key="index">
                        {{patient[column]}}
                    </td> 
                </tr>
        </table>
         <p v-if="showResponse"> No patients here...</p>
         <progress-spiner v-if=" showProgressSpinner"> Loading Patients ... </progress-spiner>
        <!-- <b-table striped hover responsive  :items="patients" sticky-header="200px" >
            
        </b-table> -->
    </div>    
</template>
<script>
import CONFIG from "../../../public/config.json";
import {authResource} from "../../../src/authResource";
import ProgressSpiner from "../../components/Globals/ProgressSpiner";
export default {
    name: "patient-list",
    props: ["reportParams"],
    components:{ProgressSpiner},
    data: ()=>{
      return {
          patients: [
          ],
          showProgressSpinner: false,
          showResponse: false,
      }
  },
  methods: {

  },
  mounted(){
         let reportParams =this.reportParams;
         this.patients = []
         this.showProgressSpinner = true;
         let endpoint = `${CONFIG.api.protocol}://${CONFIG.api.host}:${CONFIG.api.port}/api/${CONFIG.api.version}/reports/age-disaggregates-patient-list?type=${reportParams.type}&code=${reportParams.code}&reportStartDate=${reportParams.reportStartDate}&reportEndDate=${reportParams.reportEndDate}`
         authResource().get(endpoint)
                .then((response)=>{                    
                    this.patients = response.data.data[reportParams.type];
                    this.showProgressSpinner = false;
                    if(this.patients==undefined || this.patients.length == 0){
                        this.showResponse = true;
                    }else{
                        this.showResponse = false;
                    }
                    
         })
        .catch((error)=> console.warn(error));

        //To review inorder to use a data centric approach
        let domElement = document.getElementById('modal-patient-list___BV_modal_header_');
        let title = domElement.getElementsByTagName("h5")[0];
        title.innerHTML = "Drill down Patient List for " + reportParams.type+" ("+ reportParams.reportTitle + ")" ;
  }   
}
</script>
<style scoped>
    #patient-list-table{
        font-size: 0.8em !important;
        width: 100%;
    }

    #patient-list-table tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    #patient-list-table th {
        background-color: aliceblue;
        border-bottom: 1px solid rgb(175, 173, 173);
        padding: 1em;
    }

    #patient-list-table td {     
        border-bottom: 1px solid rgb(175, 173, 173);
        padding: 1em;

    }
    
</style>