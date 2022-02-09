<script lang="ts">

import type { Timestamp } from "./model/timestamp";


	let entries: Timestamp[] = [];

	let value = '';

	let recentTags: string[] = [];


	function onSubmit(event: Event): void {
		event.preventDefault();
		add(value);
		value = '';
	}

	function add(tag: string): void {
		entries = [ { datetime: new Date(), tag }, ...entries ];
		updateRecentTags(tag);
	}

	function updateRecentTags(tag: string): void {
		if (!recentTags.includes(tag)) {
			recentTags = [ ...recentTags, tag ];
		}
	}
</script>

<main>
	<h1>Timesplit</h1>
	<form on:submit="{onSubmit}">
		<input id="tag" type="text" bind:value>
		<button type="submit">
			Add
		</button>
	</form>
	{#each recentTags as recentTag}
		<button on:click="{ () => add(recentTag) }">{recentTag}</button>
	{/each}
	<hr>
	<ul>
		{#each entries as entry}
		<li>{ entry.datetime }: { entry.tag }</li>
		{/each}
	</ul>
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