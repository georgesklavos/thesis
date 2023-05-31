<template>
	<div class="flex justify-items-center align-items-center">
		<Loader :load="loading" />
		<Card style="width:25rem" class="mx-auto">
			<template #title>
				Register
			</template>

			<template #content>
				<div class="flex flex-column mt-3">
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.registerObject.firstName.$model" type="text"
								:class="{ 'p-invalid': v$.registerObject.firstName.$invalid && submitted }"></InputText>
							<label>First name</label>
						</span>
						<ErrorMessages :value="v$.registerObject.firstName" :submitted="submitted"></ErrorMessages>
					</div>
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.registerObject.lastName.$model" type="text"
								:class="{ 'p-invalid': v$.registerObject.lastName.$invalid && submitted }"></InputText>
							<label>Last name</label>
						</span>
						<ErrorMessages :value="v$.registerObject.lastName" :submitted="submitted"></ErrorMessages>
					</div>
					<div class="field">
						<span class="p-float-label p-fluid">
							<Calendar v-model="v$.registerObject.dateOfBirth.$model" type="text"
								:class="{ 'p-invalid': v$.registerObject.dateOfBirth.$invalid && submitted }"
								:showIcon="true"></Calendar>
							<label>Date of birth</label>
						</span>
						<ErrorMessages :value="v$.registerObject.dateOfBirth" :submitted="submitted"></ErrorMessages>
					</div>
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.registerObject.email.$model" type="text"
								:class="{ 'p-invalid': v$.registerObject.email.$invalid && submitted }"></InputText>
							<label>Email</label>
						</span>
						<ErrorMessages :value="v$.registerObject.email" :submitted="submitted"></ErrorMessages>
					</div>
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.registerObject.password.$model"
								:class="{ 'p-invalid': v$.registerObject.password.$invalid && submitted }" type="password">
							</InputText>
							<label>Password</label>
						</span>
						<ErrorMessages :value="v$.registerObject.password" :submitted="submitted"></ErrorMessages>
					</div>
					<!-- <div class="field">
						<label>Image</label>
						<span class="p-float-label p-fluid">
							<FileUpload mode="basic" :multiple="false" accept="image/*" @select="selectImage" :showCancelButton="false" :showUploadButton="false">
							</FileUpload>
						</span>
						<ErrorMessages :value="v$.registerObject.image" :submitted="submitted"></ErrorMessages>
					</div> -->
				</div>
			</template>

			<template #footer>
				<div class="flex justify-content-between">
					<Button @click="$router.push({ name: 'Main' })" block variant="flat" class="mt-2"
						color="info">Cancel</Button>
					<Button @click="register" :loading="loading" block variant="flat" class="mt-2"
						color="info">Register</Button>
				</div>
			</template>
		</Card>
		<ConfirmPopup></ConfirmPopup>
		<Dialog v-model:visible="showQR" header="Scan QR code" :draggable="false" modal :style="{ width: '30vw' }">
			<div class="flex align-items-center justify-content-center">
				<img :src="qrCodeUrl">
			</div>

			<div class="flex justify-content-between mt-3">
				<div></div>
				<Button label="Continue" type="button" iconPos="right" @click="confirmContinue($event)" />
			</div>
		</Dialog>
	</div>
</template>

<script>
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ErrorMessages from "@/components/ErrorMessages.vue";
import Loader from "@/components/Loader.vue";
import { mapGetters } from "vuex";
import QRcode from 'qrcode';

export default {
	name: "Register",
	components: {
		ErrorMessages,
		Loader
	},
	setup: () => ({ v$: useVuelidate() }),
	data() {
		return {
			registerObject: {
				firstName: "",
				lastName: "",
				dateOfBirth: null,
				email: "",
				password: ""
			},
			loading: false,
			submitted: false,
			qrCodeUrl: '',
			showQR: false
		}
	},
	validations() {
		return {
			registerObject: {
				firstName: {
					required
				},
				lastName: {
					required
				},
				dateOfBirth: {
					required
				},
				email: {
					required,
					email
				},
				password: {
					required
				}
			}
		}
	},
	computed: {
		...mapGetters(['registerData'])
	},
	methods: {
		selectImage(event) {
			console.log(event.files);
			this.registerObject.image = event.files[0];
		},
		async register() {
			this.submitted = true;
			const result = await this.v$.$validate();
			if (result) {
				this.loading = true;
				await this.$store.dispatch("register", this.registerObject);
				// await this.$store.dispatch("login", { email: this.registerObject.email, password: this.registerObject.password });
				QRcode.toDataURL(this.registerData.optUrl, (err, data_url) => {
					this.qrCodeUrl = data_url;
					this.showQR = true;
				})
				this.loading = false;
			} else {
				this.loading = false;
			}
		},
		confirmContinue(event) {
			this.$confirm.require({
				target: event.currentTarget,
				message: 'Are you sure you want to proceed?',
				icon: 'pi pi-exclamation-triangle',
				accept: () => {
					this.$router.push({ name: "Main" });
				},
				reject: () => {

				}
			});

		}
	}
}
</script>