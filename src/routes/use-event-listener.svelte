<script lang="ts">
	import { useEventListener } from '$lib';

	useEventListener('keydown', (e) => {
		console.log(e);
	});

	useEventListener(null, 'keydown', (e) => {
		console.log(e);
	});
</script>
