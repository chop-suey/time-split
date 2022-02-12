<script lang="ts">

import RecentTags from "./components/RecentTags.svelte";
import Splitter from "./components/Splitter.svelte";
import TimeSplits from "./components/TimeSplits.svelte";

</script>

<main>
	<h1>Timesplit</h1>
	<Splitter></Splitter>
	<RecentTags></RecentTags>
	<hr>
	<TimeSplits></TimeSplits>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>