<template>
	<div>
		<TopBar></TopBar>
		<div class="grid">
			<div v-for="(video, index) in videos" :key="index" class="col-3">
				<Card class="cursor-pointer" @click="viewVideo(video.id)">
					<template #content>
						<div>
							<img class="w-full h-full" style="object-fit: fill;"
								:src="baseUrl + `videos/thumbnail/${video.thumbnail}`" alt="Thumbnail">
						</div>
					</template>
					<template #footer>
						<div class="flex align-items-center">
							<Avatar :image="baseUrl + `users/image/${video.user.image}`" shape="circle" class="mr-3">
							</Avatar>
							<p class="font-bold text-white-alpha-90 text-xl">{{ video.title }}</p>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import { mapGetters } from 'vuex';
export default {
	name: "Main",
	components: {
		TopBar
	},
	data() {
		return {
			baseUrl: process.env.VUE_APP_SERVER_URL
		}
	},
	computed: {
		...mapGetters(['videos'])
	},
	async created() {
		await this.$store.dispatch('videos');
	},
	methods: {
		viewVideo(videoId) {
			this.$router.push({
				name: "Watch",
				query: {
					'video': videoId
				}
			})
		}
	}
}
</script>