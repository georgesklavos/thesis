<template>
	<BlockUI :blocked="loading" fullScreen>

		<ProgressSpinner v-if="loading" class="z-5 center" style="width: 200px; height: 200px;" />

	</BlockUI>
	<h3 v-if="loading" class="center z-5 text-white-alpha-80">{{ text || 'Loading...' }}</h3>
</template>

<script>
export default {
	name: "Loader",
	props: ['load', 'text'],
	computed: {
		loading() {
			return this.load;
		}
	}
}
</script>

<style>
.center {
	position: absolute !important;
	top: 50% !important;
	left: 50% !important;
	transform: translate(-50%, -50%) !important;
}

.p-blockui-container {
	position: unset !important;
}
</style>