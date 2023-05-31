import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue";
import Main from "../views/Main.vue";
import Watch from "../views/Watch.vue";

const routes = [
	{
		path: "/",
		name: "Main",
		component: Main,
	},
	{
		path: "/register",
		name: "Register",
		component: Register,
	},
	{
		path: "/watch",
		name: "Watch",
		component: Watch,
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
