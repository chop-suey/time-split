<script lang="ts">

import { derived } from "svelte/store";
import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

import { timeSplitService } from "../service/time-split-service";
import DaySummary from "./DaySummary.svelte";
import TimeSplit from "./TimeSplit.svelte";

const splits = derived(timeSplitService.getSplits(), matchAdjacentSplits);
const groupedSplits = derived(splits, groupSplitsByDay);

// TODO move to split service
function matchAdjacentSplits(splits: Timesplit[]): Timesplit[] {
    return splits.reduceRight((acc, split, index, arr) => {
        const next = index > 0 ? arr[index - 1] : null;
        return [ (!next ? split : split.withEnd(next.start)), ...acc ];
    }, []);
}

function groupSplitsByDay(splits: Timesplit[]): { date: Datetime, splits: Timesplit[]}[] {
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
    ul.splits {
        list-style-type: none;
    }
</style>

{#each $groupedSplits as {date, splits}}
    <DaySummary datetime={date} splits={splits}></DaySummary>
    <ul class="splits">
        {#each splits as split}
        <li><TimeSplit split={split}></TimeSplit></li>
    {/each}
</ul>
{/each}
