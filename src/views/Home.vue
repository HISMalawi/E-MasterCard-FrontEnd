<template>
    <div>
    <div>
        <NavBar></NavBar>
    </div>
    <section class="container py-3">
        <div class="row d-flex justify-content-center">
            <h5>Search For Patient</h5>
        </div>
    </section>
    <section class="sticky-top bg-default">
        <div class="container">
            <div class="row  py-2">
                <form v-on:submit.prevent="search" class="search-form form-inline my-2 my-lg-0 d-flex justify-content-center align-self-center w-100">
                    <input v-model="searchParam" v-on:keyup="search" class="form-control mr-sm-2 py-4" style="width: 30% !important" type="search" placeholder="Search for Patient" aria-label="Search">
                    <button class="btn btn-success my-2 my-sm-0 py-2" type="submit"> <font-awesome-icon icon="search" class="ml-1"/> Search</button>
                </form>
            </div>

        </div>
        
    </section>
    <section class="search-results">
        <div class="container-fluid px-5">
            <div class="row d-flex justify-content-center py-5">
                    <div v-if="patients[0] !== undefined" class="alert alert-info" role="alert">
                             
                            <span class="alert-link">
                                {{patients.length}}  Patients Matching {{this.searchParam}} Search.
                            </span> 
                            Did not find who you were looking for? 
                            <button type="button" class="btn btn-success btn-lg" @click="activatePatientForm" v-b-modal.modal-1>
                                Add New Patient
                            </button>
                    </div>
                    <div v-if="patients[0] === undefined && searchParam != ''" class="alert text-align-center alert-warning" role="alert">
                        <h4 class="alert-heading">No Patient found  matching <strong>{{this.searchParam}}</strong> Search</h4>
                        <p class="mb-3">
                            Click on the button below to add a new Patient
                        </p>
                        <div>
                            <button type="button" class="btn btn-success btn-lg" v-b-modal.modal-1>Add New Patient</button>
                            
                        </div>
                        
                    </div>
                    
                    <table class="table">
                            <thead class="thead-dark">
                              <tr>
                                <th scope="col">ART No.</th>
                                <th scope="col">Given Name</th>
                                <th scope="col">Middle Name</th>
                                <th scope="col">Family Name</th>
                                <th scope="col">Sex</th>
                                <th scope="col">Date of Birth</th>
                                <th scope="col">Guardian</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                                <th scope="col">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(patient, index) in patients" v-bind:key="index">
                                <th scope="row">{{ patient.artNumber === null ? 'Unregistered' : patient.artNumber}}</th>
                                <td>{{ patient.person.personName.given}}</td>
                                <td>{{ patient.person.personName.middle}}</td>
                                <td>{{ patient.person.personName.family}}</td>
                                <td>{{ patient.person.gender}}</td>
                                <td>{{ patient.person.birthdate | moment("MMMM Do, YYYY")}}</td>
                                <td>{{ patient.guardianName}}</td>
                                <td>{{ patient.patientPhone}}</td>
                                <td>{{ patient.person.personAddress.cityVillage }}</td>
                                <td>
                                    <button v-if="patient.artNumber === null" type="button" class="btn btn-warning btn-sm" @click="continueRegistration(patient)" v-b-modal.modal-1>
                                        Continue Registeration
                                    </button>
                                    <button v-if="patient.artNumber !== null" type="button" class="btn btn-success btn-sm" @click.prevent="setPatient(patient,'/patients/show')">
                                        View Patient
                                    </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
            </div> 
        </div>
        
    </section>
    <b-modal id="modal-1" hide-header v-model="tabIndex" ref="register-patient" hide-footer size="lg" centered>
        <b-tabs content-class="mt-3">
            <div class="custom-close-btn">
                <button type="button" class="close" @click="hideModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <b-tab title="Enter Patient Details" v-if="showPatientForm" :active="patientFormIsActive" @click="patientFormIsActive = true">
                <form name='addpatient' v-on:submit.prevent="addPatient">
                    <div class="form-row">
                        <div class="col-md-4 mb-3">
                            <label>Given Name*</label>
                            <input type="text" class="form-control" placeholder="First name" 
                                pattern="^[a-zA-Z]+$" title="Name cannot have numbers." 
                                :class="{'is-invalid':!gnameAlphanumericValidation && given_name !== ''}"
                                v-model="given_name" required>
                            <b-form-invalid-feedback v-if="given_name !== ''" :state="gnameAlphanumericValidation">
                                Name cannot have numbers.
                            </b-form-invalid-feedback>
                            
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="validationServer02">Middle Name</label>
                            <input type="text" class="form-control" placeholder="Middle name" 
                                pattern="^[a-zA-Z]+$" title="Name cannot have numbers." 
                                :class="{'is-invalid':!mnameAlphanumericValidation && middle_name !== ''}"
                                v-model="middle_name">
                            <b-form-invalid-feedback v-if="middle_name !== ''" :state="mnameAlphanumericValidation">
                                Name cannot have numbers.
                            </b-form-invalid-feedback>

                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="validationServer02">Family Name*</label>
                            <input type="text" class="form-control" placeholder="Last name" 
                                pattern="^[a-zA-Z]+$" title="Name cannot have numbers." 
                                :class="{'is-invalid':!fnameAlphanumericValidation && family_name !== ''}"
                                v-model="family_name" required>
                            <b-form-invalid-feedback v-if="family_name !== ''" :state="fnameAlphanumericValidation">
                                Name cannot have numbers.
                            </b-form-invalid-feedback>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                                <label class="col-form-label col-sm-2 pt-0">Sex*</label>
                                <div class="input-group pt-1">
                                    <b-form-radio v-model="gender" name="sex" value="F">Female</b-form-radio>
                                    <span style="padding: 10px"></span>
                                    <b-form-radio v-model="gender" name="sex" value="M">Male</b-form-radio>
                                </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label>Date of Birth</label>
                            <input id="dob" min='1910-01-01' type="date" @keyup="validateDoBDate" @click="setDOBMax" @focus="setDOBMax" class="form-control" v-model="birthdate" :class="{'is-invalid': invalidDoBDate}">
                            <b-form-invalid-feedback :state="!invalidDoBDate">
                                Invalid Date
                            </b-form-invalid-feedback>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-md-4 mb-3">
                                <label>Physical Address</label>
                                <input type="text" class="form-control" placeholder="Physical Address" v-model="city_village">
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="validationServer03">District</label>
                            
                                <select v-model="county_district" class="form-control" placeholder="District" >
                                    <option v-for="(district, index) in districts" v-bind:key="index">{{district.name}}</option>
                                </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                                <label for="validationServer03">Guardian Name</label>
                                <input type="text" class="form-control" placeholder="Name of guardian" v-model="guardian_name">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="patient-phone">Patient Phone Number</label>
                            <input type="number" class="form-control" placeholder="Patient" 
                                :class="{'is-invalid': (patient_phone !== '' && !patientPhoneValidation)}" 
                                id="patient-phone" 
                                v-model="patient_phone">
                            <b-form-invalid-feedback v-if="patient_phone !== ''" :state="patientPhoneValidation">
                                Phone Number must be 10 characters long.
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="patientPhoneValidation">
                                Looks Good.
                            </b-form-valid-feedback>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label for="validationServer03">Guardian Phone Number</label>
                            <input type="number" class="form-control" placeholder="Guardian" v-model="guardian_phone">
                            <b-form-invalid-feedback v-if="guardian_phone !== ''" :state="guardianPhoneValidation">
                                Phone Number must be 10 characters long.
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="guardianPhoneValidation">
                                Looks Good.
                            </b-form-valid-feedback>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                                <label>Agrees to FUP</label>
                                <div class="input-group pt-1">
                                    <b-form-radio v-model="follow_up" name="followUp" value="true">Yes</b-form-radio>
                                    <span style="padding: 10px"></span>
                                    <b-form-radio v-model="follow_up" name="followUp" value="false">No</b-form-radio>
                                </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="validationServer03">Guardian Relation</label>
                            <select class="form-control" v-model="guardian_relation">
                                <option :value="null" disabled>Select Relation</option>
                                <option value="Parent">Parent</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Relative">Relative</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-success" type="submit" @click="patientFormIsActive = !patientFormIsActive">Add Patient</button>
                </form>
            </b-tab>
            <b-tab title="Enter Registration Details" v-if="isPatientAdded" :active="!patientFormIsActive">
                <form @submit.prevent="handlePatientRegistration">

                    <div class="form-row">
                        <div class="col-md-6 mb-3">
                            <div class="form-group">
                                <label>Select MasterCard Version</label>
                                <select class="form-control" v-model="selectedMasterCardVersion" required>
                                    <option :value="null" disabled>Pick from the Available Versions</option>
                                    <option v-for="(masterCard,index) in availableMasterCards" v-bind:key="index" :value="masterCard.masterCardID">{{masterCard.name}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-row" :class="{'is-disabled-section':selectedMasterCardVersion === null}">
                        <div class="col-md-6 mb-3">
                            <label>ART Status at Registration*</label>
                            <select class="form-control" v-model="concepts.concept55" :disabled="selectedMasterCardVersion === null">
                                <option :value="null" disabled>Select Status</option>
                                <option value="First Time Initiation">First Time Initiation</option>
                                <option value="Reinitiation">Reinitiation</option>
                                <option value="Transfer In">Transfer In</option>
                            </select>
                            
                        </div>
                        <div class="col-md-6 mb-3">
                            <label>Registration Date</label>
                            <input ref="registrationDate" v-model="concepts.concept56" @keyup="validateRegDate" type="date" @click="setDateMinMax" @focus="setDateMinMax" class="form-control" placeholder="Registration Date" :class="{'is-invalid':invalidRegDate}" :disabled="selectedMasterCardVersion === null" required>
                             <b-form-invalid-feedback :state="!invalidRegDate">
                                Invalid Date
                            </b-form-invalid-feedback>
                        </div>
                    </div>
                    <div class="form-row" :class="{'is-disabled-section':selectedMasterCardVersion === null}">
                        <div class="col-md-6 mb-3">
                            <label>Date of First Starting ART</label>
                            <input v-model="concepts.concept57" ref="artStartDate" @keyup="validateARTFirstStartDate" @change="validateARTFirstStartDate"  type="date" @click="setDateMinMax" @focus="setDateMinMax" class="form-control" placeholder="Art Start Date" :class="{'is-invalid':invalidARTFirstStartDate}">
                             <b-form-invalid-feedback :state="!invalidARTFirstStartDate">
                                Invalid Date
                            </b-form-invalid-feedback>
                        </div>

                        <div class="col-md-3 mb-3">
                            <label>Age at Initiation</label>
                            <div class="form-inline fit-2-input-fields">
                                <input v-model="concepts.concept58" type="number" min="1" step="1" oninput="validity.valid||(value='');" class="form-control" placeholder="Age" :disabled="selectedMasterCardVersion === null" required>
                                <select v-model="concepts.concept59" class="form-control" :disabled="selectedMasterCardVersion === null">
                                    <option value="Months">Months</option>
                                    <option value="Years">Years</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3" v-if="birthdate === '' && patient.person.birthdate === ''">
                            <label>Estimated DOB</label>
                            <input v-model="estimatedDoB" ref="estimatedDoB" id="estimetedDoB" type="date" @click="setDOBMax" @focus="setDOBMax" class="form-control" :disabled="selectedMasterCardVersion === null">
                        </div>
                    </div>
                    <div class="form-row" :class="{'is-disabled-section': selectedMasterCardVersion === null}">
                        <div class="col-md-6 mb-3">
                            <label>ARV Number</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">CODE</span>
                                </div>
                                <input type="number" v-model="identifier" class="form-control" :disabled="selectedMasterCardVersion === null" required>
                            </div>
                        </div>
                    </div>
                    <button 
                        class="btn btn-success" 
                        type="submit" 
                        >
                        Save Registration
                    </button>
                </form>
            </b-tab>
        </b-tabs>
          
        </b-modal>
    </div>
</template>

<script>
import { notificationSystem } from '../globals'
import NavBar from "./NavBar";
import { authResource } from './../authResource'
import { constants } from 'crypto';
import { mapGetters, mapActions } from 'vuex' 
import { match } from 'minimatch';
import { debuglog } from 'util';

export default {
    name: 'Home',
    components: {NavBar},
    methods: {
        ...mapActions([
            'searchPatients', 
            'selectPatient', 
            'setSearchParam', 
            'clearPatients', 
            'createPatientCard', 
            'mutatePatientCard',
            'loadMasterCardDetails',
            'setAgeAtARTInit',
            'setDateOfFirstStartingART',
        ]),
        search(e){
            this.setSearchParam(e.target.value)
            this.isLoading = true;
            this.patients = [];

            let payload = {
                search : this.searchParam,
            };
            let endpoint = `${this.APIHosts.art}/${this.BASE_URL}`;

            if(this.searchParam !== '' && this.searchParam !== undefined){
                this.searchPatients({endpoint, payload})
            }
            else{
                this.clearPatients()
            }
            
        },
        setPatient (patient, route){
            if(patient.person.birthdate && patient.person.birthdate !== ''){
                const dob = new Date(patient.person.birthdate)
                patient.person.birthdate = dob.toISOString().split('T')[0]
            }
            this.selectPatient(patient)
            this.$router.push(route)
        },
        addPatient(){
            this.isLoading = true;

            if (this.gender === ''){
                this.$toast.error(`Missing information, sex is required`, 'Error', notificationSystem.options.error)
                this.patientFormIsActive = true
            } else{
                let payload = {
                    prefix : this.prefix,
                    art_number : this.art_number,
                    given_name : this.given_name,
                    middle_name : this.middle_name,
                    family_name : this.family_name,
                    gender : this.gender,
                    birthdate : this.birthdate,
                    tribe : this.tribe,
                    guardian_name : this.guardian_name,
                    patient_phone : this.patient_phone,
                    guardian_phone : this.guardian_phone,
                    follow_up : this.follow_up,
                    guardian_relation : this.guardian_relation,
                    cityVillage : this.cityVillage,
                    address2 : this.address2,
                    city_village :  this.city_village,
                    state_province : this.state_province,
                    postal_code : this.postal_code,
                    country : this.country,
                    latitude : this.latitude,
                    longitude : this.longitude,
                    county_district : this.county_district,
                    neighborhood_cell : this.neighborhood_cell,
                    region : this.region,
                    subregion : this.subregion,
                    township_division : this.township_division
                }

                let dhisAPIEndpoint = `${this.APIHosts.art}/${this.BASE_URL_POST}`;

                authResource().post(dhisAPIEndpoint, payload)
                .then(({data: {data}})=>{
                    this.isLoading = false
                    
                    this.selectPatient(data)
                    this.$toast.success('Successfully added patient!', 'OK', notificationSystem.options.success)
                    this.isPatientAdded = true
                    
                })
                .catch(({response: {data: {errors}, data}}) => {
                    this.isLoading = false
                    this.patientFormIsActive = true

                    return Object.values(errors).forEach(error => {
                        this.$toast.error(`${data.message}, ${error[0]}`, 'Error', notificationSystem.options.error)
                    });
                        
                }) 
            }

        },
        addClinicalRegistrationDetails(){
            const payload = {
                id: 1,
                name: 'Registration Details',

            }
        },
        addARTNumber(){
            const payload = {
                identifier: this.identifier,
                patient: this.patient.patientID
            }
            const url = `${this.APIHosts.art}/patient-identifiers`
            authResource().post(url, payload)
            .then(response => {
                    this.$toast.success(
                        `Success! ART Number Added!`, 
                        'OK', 
                        notificationSystem.options.success
                    )
                    this.addNewPatientCard()
                })
                .catch(({response: {data: {errors}, data}}) => {
                    return Object.values(errors).forEach(error => {
                        this.$toast.error(
                            `${data.message}, 
                            ${error[0]}`, 
                            'Error', 
                            notificationSystem.options.error
                        )
                    });
                })
        },
        loadRegions(){
            let dhisAPIEndpoint = `${this.APIHosts.art}/regions`;


            authResource().get(dhisAPIEndpoint)
                .then(({data: {data}})=>{
                    this.isLoading = false;
                    this.regions = JSON.parse(JSON.stringify(data))
                })
                .catch((error)=>{
                    this.isLoading = false;
                    console.log(error)
                })
        },
        loadDistricts(){
            let dhisAPIEndpoint = `${this.APIHosts.art}/districts`;


            authResource().get(dhisAPIEndpoint)
                .then(({data: {data}})=>{
                    this.isLoading = false;
                    this.districts = JSON.parse(JSON.stringify(data))
                })
                .catch((error)=>{
                    this.isLoading = false;
                    console.log(error)
                })
        },
        loadTAs(districtId){
            let dhisAPIEndpoint = `${this.APIHosts.art}/districts/${districtId}/traditional-authorities`;


            authResource().get(dhisAPIEndpoint)
                .then(({data: {data}})=>{
                    this.isLoading = false;
                    this.TAs = JSON.parse(JSON.stringify(data))
                })
                .catch((error)=>{
                    this.isLoading = false;
                    console.log(error)
                })
        },
        setDOBMax(e){
            const target = e.target
            const today = new Date()
            Object.assign(target, {max: today.toISOString().split('T')[0]})
        },
        setMinDate(e, dob){
            const target = e.target
            const min = new Date(dob)
            Object.assign(target, {min: min.toISOString().split('T')[0]})
        },
        setDateMinMax(e){
            this.setDOBMax(e)
            if(this.birthdate !== '')
                this.setMinDate(e, this.birthdate)
            else
                this.setMinDate(e, '1900-01-01')
        },
        hideModal() {
            this.$refs['register-patient'].hide()
        },
        matchSting(word) {
            const pattern = /^[a-zA-Z]+$/
            const match = word.match(pattern)
            return (match && word !== '') ? true : false
        },
        validateDoBDate(e){
            this.invalidDoBDate = e.target.validity.valid
            if (e.target.validity.valid){
                e.target.vale = ''
                this.invalidDoBDate = !e.target.validity.valid
            }
            else{
                this.invalidDoBDate = !e.target.validity.valid
            }
        },
        validateARTFirstStartDate(e){
            this.invalidARTFirstStartDate = e.target.validity.valid
            if (e.target.validity.valid){
                e.target.vale = ''
                this.invalidARTFirstStartDate = !e.target.validity.valid
            }
            else{
                this.invalidARTFirstStartDate = !e.target.validity.valid
            }
        },
        validateRegDate(e){
            this.invalidRegDate = e.target.validity.valid
            if (e.target.validity.valid){
                e.target.vale = ''
                this.invalidRegDate = !e.target.validity.valid
            }
            else{
                this.invalidRegDate = !e.target.validity.valid
            }
        },
        continueRegistration(patient){
            this.isPatientAdded = true
            this.patientFormIsActive = false
            this.showPatientForm = false
            this.selectPatient(patient)
        },

        activatePatientForm(){
            this.isPatientAdded = false
            this.patientFormIsActive = true
            this.showPatientForm = true
        },
        getMasterCards(){
            const url = `${this.APIHosts.art}/master-cards`;

            authResource().get(url)
            .then(async (response)=>{
                this.availableMasterCards = await response.data.data
            })
            .catch((error)=>{
                console.log(error)
            })
        },
        addNewPatientCard (){
            let url = `${this.APIHosts.art}/patient-cards`;

            let payload = {
                'master-card' : this.selectedMasterCardVersion,
                patient : this.patient.patientID
            };
            
            this.createPatientCard({url, payload})
                .then(message => {
                    this.$toast.success(`Success! Patient Card Added!`, 'OK', notificationSystem.options.success)
                    
                    this.getMasterCardDetails()
                    
                })
                .catch(({response: {data: {errors}, data}, response}) => {
                    return Object.values(errors).forEach(error => {
                        this.$toast.error(`${data.message}, ${error[0]}`, 'Error', notificationSystem.options.error)
                    });
                    
                })
        },
        handlePatientRegistration(){
            this.patientFormIsActive = false
            this.addARTNumber()
        },
        getMasterCardDetails(){
            const url = `${this.APIHosts.art}/master-cards/${this.patientCard.masterCard.masterCardID}`;
            this.loadMasterCardDetails({url})
                .then( message => this.processDataForRegPost())
                .catch(err => console.error(err))
        },
        processDataForRegPost (){
            const payload = this.masterCardDetails.encounterTypes[0].concepts.map((item)=>{
                return {
                    'concept' : item.conceptID,
                    'encounter-type' : 1,
                    'value' : null,
                    'observation' : null
                }
            });
            const finalPayload = [...payload]
            Object.entries(this.concepts).forEach(([key, concept]) => {
                finalPayload.push({
                    'concept' : key.match(/\d+/)[0],
                    'encounter-type' : 1,
                    'value' : concept,
                    'observation' : null
                })
            })
            this.handleRegPost(finalPayload);

        },
        handleRegPost (payload){
            let url = `${this.APIHosts.art}/observations`;
            let finalPayload = {
                'patient-card' : this.patientCard.patientCardID,
                'observations' : payload
            };
            
            authResource().post(url, finalPayload)
                .then((response)=>{
                    this.$toast.success(`Success! Patient Details Saved!`, 'OK', notificationSystem.options.success)
                    this.pullPatient(this.patient.patientID)
                    this.setAgeAtARTInit(this.concepts.concept58)
                    this.setDateOfFirstStartingART(this.concepts.concept57)
                    
                    this.$router.push('/patients/show/card')
                })
                .catch((error)=>{
                    console.log(error)
                })
        },
        getObservation (conceptID){
            let obs = this.patientCardData.filter((item)=>{
                return item.concept.conceptID === conceptID
            });

            if (obs.length > 0)
                return obs[0].observationID;
            else
                return null
        },
        pullPatient(id){
            const url = `${this.APIHosts.art}/patients/${id}`
            authResource().get(url)
            .then(({data: {data}}) => {
                console.log(data)
                this.selectPatient(data)
            })
        },
        handleAgeEstimation(){
            if (
                this.patient.person.birthdate !== null
                && this.concepts.concept57 !== null
                )
            {
                    let birthDateObj = new Date(this.patient.person.birthdate)
                    let diff_ms = new Date(this.concepts.concept57) - birthDateObj.getTime();
                    let age_dt = new Date(diff_ms); 
                
                    this.concepts.concept58 = Math.abs(age_dt.getUTCFullYear() - 1970)
                    this.concepts.concept59 = 'Years'
            }
        },
        handleAgeEstimationMonths(){
            if (
                this.patient.person.birthdate !== null
                && this.concepts.concept57 !== null
            )
            {
                let startDateObj = new Date(this.concepts.concept57)
                let birthDateObj = new Date(this.patient.person.birthdate)

                const monthDiff = startDateObj.getMonth() - birthDateObj.getMonth()
                const yearDiff = startDateObj.getFullYear() - birthDateObj.getFullYear()

                this.concepts.concept58 =  monthDiff + (12 * yearDiff)
                this.concepts.concept59 = 'Months'
            }
        },
    },
    created(){
        this.loadRegions()
        this.loadDistricts()
        this.getMasterCards()
    },
    data: () => {
        return {
            notificationSystem,

            isLoading : false,

            BASE_URL : 'patients/search',
            BASE_URL_POST: 'patients',
            isPatientAdded: false,
            patientFormIsActive: true,
            regDetailsFormIsActive: false,
            tabIndex: 0,
            regions: [],
            districts: [],
            TAs:[],
            prefix : '',
            art_number : '',
            given_name : '',
            middle_name : '',
            family_name : '',
            gender : '',
            birthdate : '',
            tribe : '',
            guardian_name : '',
            patient_phone : '',
            guardian_phone : '',
            follow_up : '',
            guardian_relation : '',
            cityVillage : '',
            address2 : '',
            city_village :  '',
            state_province : '',
            postal_code : '',
            country : '',
            latitude : '',
            longitude : '',
            county_district : '',
            neighborhood_cell : '',
            region : '',
            subregion : '',
            township_division : '',
            invalidDoBDate: false,
            invalidARTFirstStartDate: false,
            invalidRegDate: false,
            showPatientForm: true,

            estimatedDoB: null,
            identifier: null, //ART number
            concepts: {
                concept55: null, //Clinic Registration Type (ConceptID:55, DataType : Text)
                concept56: null, //Clinic Registration Date (ConceptID:56, DataType : Date)
                concept57: null, //Clinic Registration ART Start Date (ConceptID:57, DataType : Date)
                concept58: null, //Clinic Registration Age at Initiation (ConceptID:58, DataType : Number)
                concept59: null, //}Clinic Registration Age at Init Units(Months/year) (ConceptID:59, DataType : Text)
            },
            availableMasterCards: [],
            selectedMasterCardVersion: null,
            watchRegStart: false
        }
    },
    computed: {
        ...mapGetters([
            'patients', 
            'patient', 
            'searchParam', 
            'patientCard', 
            'masterCardDetails',
            'dateOfFirstStartingART',
            'ageAtARTInit'
        ]),
        patientPhoneValidation() {
            return this.patient_phone !== '' && this.patient_phone.length === 10 
        },
        guardianPhoneValidation() {
            return this.guardian_phone !== '' && this.guardian_phone.length === 10 
        },
        gnameAlphanumericValidation(){
            return this.matchSting(this.given_name)
        },
        fnameAlphanumericValidation(){
            return this.matchSting(this.family_name)
        },
        mnameAlphanumericValidation(){
            return this.matchSting(this.middle_name)
        }
    },
    watch: {
        county_district: function(){
            const districtId = this.districts.filter(district => district.name === this.county_district)[0].districtID
            this.loadTAs(districtId)
        },
        'concepts.concept57': function(){
            if (this.selectedMasterCardVersion === 7)
                this.handleAgeEstimation()
            else if(this.selectedMasterCardVersion === 8)
                this.handleAgeEstimationMonths()

            if (this.watchRegStart === true && (this.concepts.concept56 !== this.concepts.concept57)){
                this.concepts.concept56 = this.concepts.concept57
            }
        },
        'concepts.concept56': function(){
            if (this.watchRegStart === true && (this.concepts.concept56 !== this.concepts.concept57)){
                this.concepts.concept57 = this.concepts.concept56
            }
        },
        'concepts.concept55': function(){
            if (this.concepts.concept55 === "First Time Initiation"){
                this.watchRegStart = true
            }
            else{
                this.watchRegStart = false
            }
        },
        selectedMasterCardVersion: function(){
            if (this.selectedMasterCardVersion === 7)
                this.handleAgeEstimation()
            else if(this.selectedMasterCardVersion === 8)
                this.handleAgeEstimationMonths()
        }
    }
    
}
</script>
