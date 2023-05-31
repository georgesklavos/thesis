import { createStore } from "vuex";
import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

let authAxios = axios.create({
	headers: {
		common: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	},
});

export default createStore({
	state: {
		registerData: {},
		searchResults: [],
		userInfo: {},
		videos: [],
		videoInfo: {},
		myVideos: []
	},
	getters: {
		registerData(state) {
			return state.registerData;
		},
		searchResults(state) {
			return state.searchResults;
		},
		userInfo(state) {
			return state.userInfo;
		},
		videos(state) {
			return state.videos;
		},
		videoInfo(state) {
			return state.videoInfo;
		},
		myVideos(state) {
			return state.myVideos;
		}
	}, 
	mutations: {
		registerData(state, payload) {
			state.registerData = payload;
		},
		searchResults(state, payload) {
			state.searchResults = payload;
		},
		deleteSearchResults(state) {
			state.searchResults = [];
		},
		userInfo(state, payload) {
			state.userInfo = payload;
		},
		videos(state, payload) {
			state.videos = payload;
		},
		videoInfo(state, payload) {
			state.videoInfo = payload;
		},
		myVideos(state, payload) {
			state.myVideos = payload;
		},
	},
	actions: {
		async register(context, data) {
			await authAxios.post("users", data).then((res) => {
				context.commit("registerData", res.data);
			});
		},
		async login(context, data) {
			await authAxios.post("login", data).then((res) => {
				localStorage.setItem("token", res.data.access_token);
				authAxios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${res.data.access_token}`;
			});
		},
		async me(context) {
			await authAxios.get("users/me").then((res) => {
				context.commit("userInfo", res.data);
			});
		},
		async editProfile(context, data) {
			await authAxios.put(`users/${data.id}`, data).then((res) => {
				context.commit("userInfo", res.data);
			});
		},
		async uploadUserImage(context, data) {
			let bodyFormData = new FormData();
			bodyFormData.append('image', data.image);

			await authAxios.post(`users/image`, bodyFormData);
		},
		async search(context, search) {
			await axios
				.get("videos/search", {
					params: {
						search,
					},
				})
				.then((res) => {
					context.commit("searchResults", res.data);
				});
		},
		async videos(context) {
			await axios
				.get("videos/public")
				.then((res) => {
					context.commit("videos", res.data);
				});
		},
		async videoInfo(context, videoId) {
			await authAxios.get(`videos/details/${videoId}`).then((res) => {
				context.commit("videoInfo", res.data);
			});
		},
		async like(context, videoId) {
			await authAxios.post(`likes/${videoId}`);
		},
		async removeLike(context, videoId) {
			await authAxios.delete(`likes/${videoId}`);
		},
		async dislike(context, videoId) {
			await authAxios.post(`dislikes/${videoId}`);
		},
		async removeDislike(context, videoId) {
			await authAxios.delete(`dislikes/${videoId}`);
		},
		async comment(context, data) {
			await authAxios.post(`comments/${data.videoId}`, {comment: data.comment});
		},
		async videoUpload(context, data) {
			let bodyFormData = new FormData();
			bodyFormData.append('title', data.title);
			bodyFormData.append('description', data.description);
			bodyFormData.append('thumbnail', data.thumbnail);
			bodyFormData.append('video', data.video);
			bodyFormData.append('public', data.public);
			bodyFormData.append('password2FA', data.password2FA);

			await authAxios.post(`videos`, bodyFormData);
		},
		async myVideos(context) {
			await authAxios.get("/videos").then((res) => {
				context.commit("myVideos", res.data);
			})
		},
		async deleteVideo(context, id) {
			await authAxios.delete(`/videos/${id}`);
		}
	},
});
