<script lang="ts">
import { derived } from "svelte/store";
import DaySummary from "./components/DaySummary.svelte";
import ImportExport from "./components/ImportExport.svelte";

import RecentTags from "./components/RecentTags.svelte";
import Splitter from "./components/Splitter.svelte";
import TimeSplit from "./components/TimeSplit.svelte";
import type { SplitGroup } from "./model/split-group";
import type { Timesplit } from "./model/timesplit";
import { getTimeSplitStore } from "./service/service-manager";
import Clock from "./components/Clock.svelte";

const splits = getTimeSplitStore().getSplits();
const groupedSplits = derived(splits, groupSplitsByDay);

function groupSplitsByDay(splits: Timesplit[]): SplitGroup[] {
    const valueIterator = splits.reduce((acc, curr) => {
        const key = curr.start.getDateText();
        if (!acc.has(key)) {
            acc.set(key, []);
        }
        acc.get(key).push(curr);
        return acc;
    }, new Map<string, Timesplit[]>()).values();
    return [ ...valueIterator ]
        .map(splits => ({ date: splits[0].start.withTime(0, 0), splits }));
}
</script>

<style>
	main {
		position: absolute;
		width: 100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin: 0.5em auto;

		text-align: center;
	}

	ul.day-splits {
		list-style-type: none;

		margin: 0.8em 0;
		padding: 0;
	}

	#header {
		position: absolute;
		top: 0;

		width: 100%;
	}

	nav ul {
		list-style: none;
	}

	nav ul li {
		display: inline-block;
		padding: 0.2em;
	}

	#header #clock {
		position: absolute;
		top: 0;
		right: 0;

		padding: 0.2em;
	}
</style>

<main>
	<div id="header">
		<nav>
			<ul>
				<li>
					<ImportExport></ImportExport>
				</li>
			</ul>
		</nav>
		<div id="clock">
			<Clock></Clock>
		</div>
	</div>
	<h1>Timesplit</h1>
	<Splitter></Splitter>
	<RecentTags></RecentTags>
	{#each $groupedSplits as group}
	<DaySummary group={group}></DaySummary>
	<ul class="day-splits">
		{#each group.splits as split}
		<li><TimeSplit split={split}></TimeSplit></li>
		{/each}
	</ul>
	{/each}
</main>
