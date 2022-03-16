<script lang="ts">
	import { useLocalStorage } from '$lib/use-local-storage';

	const value = useLocalStorage('key', 1);

	function hanleClick() {
		$value = 2;
	}
</script>

<button on:click={hanleClick}>click</button>
