<template>
	<div class="mt-1 mb-2" v-if="submitted">
		<small v-for="(error, i) in value.$errors" :key="i" class="p-error">{{ error.$message }}</small>
	</div>
</template>

<script>
export default {
	name: "Error Messages",
	props: ['value', 'submitted']
}
</script>