<template>
	<div>
		<Login :show="showLogin" @closeLogin="closeLogin"></Login>
		<TopBar></TopBar>
		<video ref="videoPlayer" class="video-js"></video>
		<div style="width: 80%;" class="pl-5 mt-2">
			<div class="flex">
				<p class="font-bold text-2xl">{{ videoInfo.title }}</p>
			</div>
			<div class="flex">
				<div style="flex:2;" class="w-6 flex align-items-center">
					<Avatar :image="this.baseUrl + `users/image/${videoInfo.user.image}`" shape="circle" class="mr-3"></Avatar>
					<p class="text-xl">{{ videoInfo.user.firstName }} {{ videoInfo.user.lastName }}</p>
				</div>
				<div style="flex:1;" class="flex align-items-center justify-content-around">
					<Button :icon="`pi ${videoInfo.liked ? 'pi-thumbs-up-fill' : 'pi-thumbs-up'}`"
						class="p-button-rounded w-3" :label="videoInfo.likes || '0'" severity="secondary"
						@click="isLoggedIn ? like() : login()" />
					<Button :icon="`pi ${videoInfo.disLiked ? 'pi-thumbs-down-fill' : 'pi-thumbs-down'}`"
						class="p-button-rounded w-3" :label="videoInfo.dislikes || '0'" severity="secondary"
						@click="isLoggedIn ? dislike() : login()" />
				</div>
			</div>


			<div class="mt-5">
				<h2>Post comment</h2>
			</div>

			<div class="field">
				<InputText class="p-fluid w-5" v-model="newComment" />
				<Button class="ml-3" label="Post" @click="isLoggedIn ? addComment() : login()"></Button>
			</div>

			<h2 class="mt-5">Comments</h2>

			<div v-for="(commentValue, index) in videoInfo.comments" :key="index">
				<span class="flex text-xl">
					{{ commentValue.comment }}
				</span>
				<Divider />
			</div>
		</div>
	</div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import Login from '@/components/Login.vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'
import { mapGetters } from 'vuex';

export default {
	name: "Watch",
	components: { TopBar, Login },
	data() {
		return {
			player: null,
			videoId: this.$route.query.video,
			baseUrl: process.env.VUE_APP_SERVER_URL,
			showLogin: false,
			newComment: ""
		};
	},
	computed: {
		...mapGetters(['videoInfo', 'userInfo']),
		isLoggedIn() {
			console.log(Object.keys(this.userInfo).length > 0);
			return Object.keys(this.userInfo).length > 0
		}
	},
	async beforeMount() {
		console.log('mount');
		await this.$store.dispatch('videoInfo', this.videoId);
	},
	mounted() {
		this.player = videojs(this.$refs.videoPlayer, {
			controls: true,
			sources: [
				{
					src: `${this.baseUrl}videos/play/${this.videoId}`,
					type: "video/mp4"
				}
			]
		}, () => {
			this.player.log("onPlayerReady", this);
		});
	},
	beforeUnmount() {
		if (this.player) {
			this.player.dispose();
		}
	},
	methods: {
		like() {
			if (this.videoInfo.liked) {
				this.$store.dispatch("removeLike", this.videoId);
				if (this.videoInfo.likes > 0)
					this.videoInfo.likes -= 1;
			} else {
				this.$store.dispatch("like", this.videoId);
				this.videoInfo.likes += 1;
			}

			this.videoInfo.liked = !this.videoInfo.liked;
			if (this.videoInfo.disLiked) {
				this.videoInfo.disLiked = false;
				this.$store.dispatch("removeDislike", this.videoId);
				if (this.videoInfo.dislikes > 0)
					this.videoInfo.dislikes -= 1;
			}
		},
		dislike() {
			if (this.videoInfo.disLiked) {
				this.$store.dispatch("removeDislike", this.videoId);
				if (this.videoInfo.dislikes > 0)
					this.videoInfo.dislikes -= 1;
			} else {
				this.$store.dispatch("dislike", this.videoId);
				this.videoInfo.dislikes += 1;
			}

			this.videoInfo.disLiked = !this.videoInfo.disLiked;
			if (this.videoInfo.liked) {
				this.videoInfo.liked = false;
				this.$store.dispatch("removeLike", this.videoId);
				if (this.videoInfo.likes > 0)
					this.videoInfo.likes -= 1;
			}
		},
		login() {
			this.showLogin = true;
		},
		closeLogin() {
			this.showLogin = false;
		},
		addComment() {
			this.$store.dispatch("comment", { videoId: this.videoId, comment: this.newComment });
		}
	}
}
</script>

<style>
.video-js {
	width: 80%;
	height: 60%;
}
</style>