<template>
	<Login :show="showLogin" @closeLogin="closeLogin"></Login>
	<UploadFile :show="showUpload" @closeUpload="closeUpload"></UploadFile>
	<EditProfile :show="showProfile" @closeProfile="closeProfile"></EditProfile>
	<EditVideos :show="showMyVideos" @closeMyVideos="closeMyVideos"></EditVideos>
	<div class="flex justify-content-between align-items-center mb-5">
		<div>
			<Avatar icon="pi pi-home" size="xlarge" shape="circle" class="cursor-pointer"
				@click="$router.push({ name: 'Main' })" />
		</div>
		<div>
			<div class="flex flex-column justify-content-center align-items-center">
				<span class="p-input-icon-right">
					<i v-if="loading" class="pi pi-spin pi-spinner" />
					<i v-else class="pi pi-search" />
					<InputText @keyup="searchVideos" id="search-bar" v-model="search" type="text" placeholder="Search"
						@focusout="$nextTick($refs.results.focus())" />
				</span>
				<div v-show="searchResults.length" id="search-results" class="mt-1 bg-white text-black-alpha-90"
					@focusout="blurEvent" tabindex="0" ref='results'>
					<div @click="selectResult(result)"
						class="flex justify-content-between align-items-center mx-3 cursor-pointer"
						v-for="(result, i) in searchResults" :key="i">
						<i class="pi pi-search" />
						<h3 class="my-2">{{ result.title }}</h3>
						<i></i>
					</div>
				</div>
			</div>
		</div>
		<div class="w-1 flex justify-content-between align-items-center">
			<Button icon="pi pi-upload" class="p-button-rounded" @click="isLoggedIn ? videoUpload() : login()"
				size="large"></Button>
			<Button :icon="isLoggedIn ? 'pi pi-user' : 'pi pi-sign-in'" class="p-button-rounded mr-3"
				@click="isLoggedIn ? showSettings($event) : login()" size="large" aria-haspopup="true"
				aria-controls="overlay_tmenu" />
			<TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Login from '@/components/Login.vue';
import EditProfile from './EditProfile.vue';
import UploadFile from './UploadFile.vue';
import EditVideos from './EditVideos.vue';
export default {
	name: "Top Bar",
	components: {
		Login,
		UploadFile,
		EditProfile,
		EditVideos
	},
	data() {
		return {
			search: "",
			loading: false,
			showLogin: false,
			showUpload: false,
			showProfile: false,
			showMyVideos: false,
			items: [
				{
					label: 'Edit profile',
					icon: 'pi pi-fw pi-pencil',
					command: () => {
						console.log(this);
						this.showProfile = true;
					}
				},
				{
					label: 'My videos',
					icon: 'pi pi-fw pi-video',
					command: () => {
						this.showMyVideos = true;
					}
				},
				{
					separator: true
				},
				{
					label: 'Log out',
					icon: 'pi pi-fw pi-power-off',
					command: () => {
						localStorage.removeItem('token');
						this.$router.go()
					}
				}
			]
		}
	},
	computed: {
		...mapGetters(["searchResults", "userInfo"]),
		...mapMutations(["deleteSearchResults"]),
		isLoggedIn() {
			return Object.keys(this.userInfo).length > 0
		}
	},
	async created() {
		await this.$store.dispatch('me');
	},
	methods: {
		async searchVideos() {
			this.loading = true;
			await this.$store.dispatch("search", this.search);
			console.log(this.searchResults);
			this.loading = false;
		},
		selectResult(result) {
			console.log(result);
			this.$router.push({
				name: "Watch",
				query: {
					'video': result.id
				}
			})
		},
		blurEvent() {
			this.$store.commit('deleteSearchResults');
		},
		login() {
			this.showLogin = true;
		},
		closeLogin() {
			this.showLogin = false;
		},
		showSettings(event) {
			this.$refs.menu.toggle(event);
		},
		videoUpload() {
			this.showUpload = true;
		},
		closeUpload() {
			this.showUpload = false;
		},
		closeProfile() {
			this.showProfile = false;
		},
		closeMyVideos() {
			this.showMyVideos = false;
		}
	}
}

</script>

<style scoped>
#search-bar {
	height: 5vh;
	width: 35vw;
	border-radius: 30px;
}

#search-results {
	width: 34vw;
	border-radius: 25px;
	z-index: inherit;
}
</style>