<template>
	<Dialog v-model:visible="showDialoag" header="Edit profile" :draggable="false" modal :style="{ width: '30vw' }">
		<div class="flex flex-column">
			<Loader :load="loading" />
			<div class="flex flex-column mt-3">
				<div class="field">
					<span class="p-float-label p-fluid">
						<InputText v-model="v$.profileObject.firstName.$model" type="text"
							:class="{ 'p-invalid': v$.profileObject.firstName.$invalid && submitted }"></InputText>
						<label>First Name</label>
					</span>
					<ErrorMessages :value="v$.profileObject.firstName" :submitted="submitted"></ErrorMessages>
				</div>
				<div class="field">
					<span class="p-float-label p-fluid">
						<InputText v-model="v$.profileObject.lastName.$model" type="text"
							:class="{ 'p-invalid': v$.profileObject.lastName.$invalid && submitted }"></InputText>
						<label>Last Name</label>
					</span>
					<ErrorMessages :value="v$.profileObject.lastName" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<span class="p-float-label p-fluid">
						<InputText v-model="v$.profileObject.email.$model" type="text"
							:class="{ 'p-invalid': v$.profileObject.email.$invalid && submitted }" disabled></InputText>
						<label>Email</label>
					</span>
					<ErrorMessages :value="v$.profileObject.email" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<span class="p-float-label p-fluid">
						<Calendar v-model="v$.profileObject.dateOfBirth.$model"
								:class="{ 'p-invalid': v$.profileObject.dateOfBirth.$invalid && submitted }"
								:showIcon="true"></Calendar>
						<label>Date of birth</label>
					</span>
					<ErrorMessages :value="v$.profileObject.dateOfBirth" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<label>Image</label>
					<span class="p-float-label p-fluid">
						<FileUpload  mode="basic" :multiple="false" accept="image/*" @select="selectImage" :showCancelButton="false" :showUploadButton="false">
						</FileUpload>
					</span>
					<ErrorMessages :value="v$.profileObject.image" :submitted="submitted"></ErrorMessages>
				</div>
			</div>



			<div class="flex justify-content-between">
				<Button @click="close" label="Cancel" type="button" iconPos="right" />
				<Button label="Save" type="button" iconPos="right" @click="upload" />
			</div>

		</div>
	</Dialog>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ErrorMessages from "@/components/ErrorMessages.vue";
import Loader from "@/components/Loader.vue";
import { mapGetters } from "vuex";
export default {
	name: "Profile",
	components: {
		ErrorMessages,
		Loader
	},
	setup: () => ({ v$: useVuelidate() }),
	props: [
		'show'
	],
	emits: [
		'closeProfile'
	],
	data() {
		return {
			profileObject: {
				firstName: "",
				lastName: "",
				email: "",
				dateOfBirth: "",
				image: ""
			},
			loading: null,
			submitted: false,
			showDialoag: false
		}
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	watch: {
		show(value) {
			this.showDialoag = value;
		},
		showDialoag() {
			this.profileObject = {
				...this.userInfo,
				dateOfBirth: new Date(this.userInfo.dateOfBirth)
			}
			if (this.showDialoag == false) {
				console.log('close');
				this.$emit('closeProfile');
			}
		}
	},
	validations() {
		return {
			profileObject: {
				firstName: {
					required
				},
				lastName: {
					required
				},
				email: {
					required
				},
				dateOfBirth: {
					required
				},
				image: {
					required
				}
			}
		}
	},
	methods: {
		async upload() {
			this.submitted = true;
			const result = await this.v$.$validate();
			if (result) {
				try {
					console.log(this.profileObject);
					this.loading = true;
					await this.$store.dispatch("editProfile", this.profileObject);
					await this.$store.dispatch("uploadUserImage", {
						image: this.profileObject.image
					});
					this.loading = false;
					this.$nextTick(() => {
						this.showDialoag = false;
					})
				} catch {
					this.loading = false;
				}
			}

		},
		close () {
			this.showDialoag = false;
		},
		selectImage(event) {
			this.profileObject.image = event.files[0];
		}
	}
}
</script>