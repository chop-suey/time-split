<script lang="ts">
import { derived } from "svelte/store";
import DaySummary from "./components/DaySummary.svelte";

import RecentTags from "./components/RecentTags.svelte";
import Splitter from "./components/Splitter.svelte";
import TimeSplit from "./components/TimeSplit.svelte";
import type { SplitGroup } from "./model/split-group";
import type { Timesplit } from "./model/timesplit";
import { getTimeSplitService } from "./service/service-manager";

const splits = derived(getTimeSplitService().getSplits(), matchAdjacentSplits);
const groupedSplits = derived(splits, groupSplitsByDay);

// TODO move to split service
function matchAdjacentSplits(splits: Timesplit[]): Timesplit[] {
    return splits.reduceRight((acc, split, index, arr) => {
        const next = index > 0 ? arr[index - 1] : null;
        return [ (!next ? split : split.withEnd(next.start)), ...acc ];
    }, []);
}

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
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	ul.day-splits {
		list-style-type: none;

		margin: 0.5em 0;
		padding: 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<main>
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
