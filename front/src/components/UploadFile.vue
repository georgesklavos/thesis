<template>
	<Dialog v-model:visible="showDialoag" header="Upload" :draggable="false" modal :style="{ width: '50vw' }">
		<Toast />
		<div class="flex flex-column">
			<Loader :load="loading" />
			<div class="flex flex-column mt-3">
				<div class="field">
					<span class="p-float-label p-fluid">
						<InputText v-model="v$.videoObject.title.$model" type="text"
							:class="{ 'p-invalid': v$.videoObject.title.$invalid && submitted }"></InputText>
						<label>Title</label>
					</span>
					<ErrorMessages :value="v$.videoObject.title" :submitted="submitted"></ErrorMessages>
				</div>
				<div class="field">
					<span class="p-float-label p-fluid">
						<TextArea v-model="v$.videoObject.description.$model"
							:class="{ 'p-invalid': v$.videoObject.description.$invalid && submitted }" type="text">
						</TextArea>
						<label>Description</label>
					</span>
					<ErrorMessages :value="v$.videoObject.description" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<label>Thumbnail</label>
					<span class="p-float-label p-fluid">
						<FileUpload :multiple="false" accept="image/*" @select="selectThumbnail" :showCancelButton="false" :showUploadButton="false">
							<template #empty>
								<p>Drag and drop files to here to upload.</p>
							</template>
						</FileUpload>
					</span>
					<ErrorMessages :value="v$.videoObject.thumbnail" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<label>Video</label>
					<span class="p-float-label p-fluid">
						<FileUpload :multiple="false" accept="video/mp4" @select="selectVideo" :showCancelButton="false" :showUploadButton="false">
							<template #empty>
								<p>Drag and drop files to here to upload.</p>
							</template>
						</FileUpload>
					</span>
					<ErrorMessages :value="v$.videoObject.video" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<label>Public</label>
					<span class="p-float-label p-fluid">
						<InputSwitch v-model="v$.videoObject.public.$model"
							:class="{ 'p-invalid': v$.videoObject.public.$invalid && submitted }" type="text">
						</InputSwitch>
					</span>
					<ErrorMessages :value="v$.videoObject.public" :submitted="submitted"></ErrorMessages>
				</div>

				<div class="field">
					<span class="p-float-label p-fluid">
						<InputText v-model="v$.videoObject.password2FA.$model" type="text"
							:class="{ 'p-invalid': v$.videoObject.password2FA.$invalid && submitted }"></InputText>
						<label>2FA Password</label>
					</span>
					<ErrorMessages :value="v$.videoObject.password2FA" :submitted="submitted"></ErrorMessages>
				</div>
			</div>



			<div class="flex justify-content-between">
				<Button @click="close" label="Cancel" type="button" iconPos="right" />
				<Button label="Upload" type="button" iconPos="right" @click="upload" />
			</div>

		</div>
	</Dialog>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import ErrorMessages from "@/components/ErrorMessages.vue";
import Loader from "@/components/Loader.vue";
export default {
	name: "Upload",
	components: {
		ErrorMessages,
		Loader
	},
	setup: () => ({ v$: useVuelidate() }),
	props: [
		'show'
	],
	emits: [
		'closeUpload'
	],
	data() {
		return {
			videoObject: {
				video: "",
				title: "",
				description: "",
				thumbnail: "",
				public: true,
				password2FA: ""
			},
			loading: null,
			submitted: false,
			showDialoag: false
		}
	},
	watch: {
		show(value) {
			this.showDialoag = value;
		},
		showDialoag() {
			if (this.showDialoag == false) {
				console.log('close');
				this.$emit('closeUpload');
			}
		}
	},
	validations() {
		return {
			videoObject: {
				video: {
					required
				},
				title: {
					required
				},
				description: {
					required
				},
				thumbnail: {
					required
				},
				public: {
					required
				},
				password2FA: {
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
					console.log(this.videoObject);
					this.loading = true;
					await this.$store.dispatch("videoUpload", this.videoObject);
					this.loading = false;
					this.$nextTick(() => {
						this.showDialoag = false;
					})
				} catch {
					this.loading = false;
					this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid video data', life: 3000 });
				}
			}

		},
		close () {
			this.showDialoag = false;
		},
		selectThumbnail(event) {
			this.videoObject.thumbnail = event.files[0];
		},
		selectVideo(event) {
			this.videoObject.video = event.files[0];
		}
	}
}
</script>