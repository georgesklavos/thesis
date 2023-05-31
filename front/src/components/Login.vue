<template>
	<div>
		<Toast />
		<Dialog v-model:visible="showDialoag" header="Login" :draggable="false" modal :style="{ width: '30vw' }">
			<div class="flex flex-column">
				<Loader :load="loading" />
				<div class="flex flex-column mt-3">
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.loginObject.email.$model" type="text"
								:class="{ 'p-invalid': v$.loginObject.email.$invalid && submitted }"></InputText>
							<label>Email</label>
						</span>
						<ErrorMessages :value="v$.loginObject.email" :submitted="submitted"></ErrorMessages>
					</div>
					<div class="field">
						<span class="p-float-label p-fluid">
							<InputText v-model="v$.loginObject.password.$model"
								:class="{ 'p-invalid': v$.loginObject.password.$invalid && submitted }" type="password">
							</InputText>
							<label>Password</label>
						</span>
						<ErrorMessages :value="v$.loginObject.password" :submitted="submitted"></ErrorMessages>
					</div>
				</div>
	
	
	
				<div class="flex justify-content-between">
					<Button @click="$router.push({ name: 'Register' })" label="Register" type="button" iconPos="right" />
					<Button label="Login" type="button" iconPos="right" @click="login" />
				</div>
	
			</div>
		</Dialog>

		<Dialog v-model:visible="show2fa" header="Enter 2FA password" :draggable="false" modal :style="{ width: '30vw' }">
			
			<InputText v-model="password2FA"></InputText>

			<div class="flex justify-content-between mt-3">
				<div></div>
				<Button label="Continue" type="button" iconPos="right" @click="finalLogin" />
			</div>
		</Dialog>
	</div>
</template>

<script>
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ErrorMessages from "@/components/ErrorMessages.vue";
import Loader from "@/components/Loader.vue";
export default {
	name: "Login",
	components: {
		ErrorMessages,
		Loader
	},
	setup: () => ({ v$: useVuelidate() }),
	props: [
		'show'
	],
	emits: [
		'closeLogin'
	],
	data() {
		return {
			loginObject: {
				email: "",
				password: "",
			},
			password2FA: "",
			loading: null,
			submitted: false,
			showDialoag: false,
			show2fa: false
		}
	},
	watch: {
		show(value) {
			this.showDialoag = value;
		},
		showDialoag() {
			if (this.showDialoag == false) {
				console.log('close');
				this.$emit('closeLogin');
			}
		}
	},
	validations() {
		return {
			loginObject: {
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
	methods: {
		async login() {
			this.submitted = true;
			const result = await this.v$.$validate();
			if (result) {
				this.show2fa = true;
			}
		},
		async finalLogin() {
			try {
					this.loading = true;
					await this.$store.dispatch("login", {...this.loginObject, password2FA: this.password2FA});
					await this.$store.dispatch("me");
					this.loading = false;
					this.$nextTick(() => {
						this.showDialoag = false;
						this.show2fa = false;
					})
				} catch {
					this.show2fa = false;
					this.password2FA = '';
					this.loading = false;
					this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials', life: 3000 });
				}
		}
	}
}
</script>