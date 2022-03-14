<script lang="ts">
	import { useLocalStorageValue } from '$lib/use-local-storage';

	const value = useLocalStorageValue('key', 1);

	function hanleClick() {
		$value = 2;
	}
</script>

<button on:click={hanleClick}>click</button>
