<template>
	<Dialog v-model:visible="showDialoag" header="My videos" :draggable="false" modal :style="{ width: '70vw' }">
		<div class="flex flex-column">
			<Loader :load="loading" />
			<div class="flex flex-column mt-3">
				<DataTable :value="myVideos" @row-click="viewVideo" :row-class="() => 'cursor-pointer'">
					<Column field="thumbnail" header="Thumbnail">
						<template #body="{data}">
							<img class="w-5 h-5" style="object-fit: fill;"
								:src="baseUrl + `videos/thumbnail/${data.thumbnail}`" alt="Thumbnail">
						</template>
					</Column>
					<Column field="title" header="Title"></Column>
					<Column field="description" header="Description"></Column>
					<Column>
						<template #body="{data}">
							<Button icon="pi pi-times" severity="danger" text raised rounded @click="deleteVideo(data.id)" />
						</template>
					</Column>
				</DataTable>
			</div>

		</div>
	</Dialog>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapGetters } from "vuex";
export default {
	name: "Edit Videos",
	components: {
		Loader
	},
	props: [
		'show'
	],
	emits: [
		'closeMyVideos'
	],
	data() {
		return {
			loading: null,
			submitted: false,
			showDialoag: false,
			baseUrl: process.env.VUE_APP_SERVER_URL
		}
	},
	computed: {
		...mapGetters(['myVideos'])
	},
	watch: {
		show(value) {
			this.showDialoag = value;
		},
		async showDialoag() {
			if (this.showDialoag == false) {
				console.log('close');
				this.$emit('closeUpload');
			} else {
				await this.$store.dispatch("myVideos");
			}
		}
	},
	methods: {
		async deleteVideo(id) {
			console.log(id);
			try {
				this.loading = true;
				await this.$store.dispatch("deleteVideo", id);
				await this.$store.dispatch("myVideos", id);
				this.loading = false;
			} catch {
				this.loading = false;
			}
		},
		close () {
			this.showDialoag = false;
		},
		viewVideo(data) {
			this.close();
			this.$router.push({
				name: "Watch",
				query: {
					'video': data.data.id
				}
			})
		}
	}
}
</script>