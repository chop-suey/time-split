<script lang="ts">
import { derived } from "svelte/store";
import type { Timesplit } from "../model/timesplit";

import { timeSplitService } from "../service/time-split-service";
import TimeSplit from "./TimeSplit.svelte";

const splits = derived(timeSplitService.getSplits(), matchAdjacentSplits);

// TODO move to split service
function matchAdjacentSplits(splits: Timesplit[]): Timesplit[] {
    return splits.reduceRight((acc, split, index, arr) => {
        const next = index > 0 ? arr[index - 1] : null;
        return [ (!next ? split : split.withEnd(next.start)), ...acc ];
    }, []);
}
</script>

<style>
    ul.splits {
        list-style-type: none;
    }
</style>

<ul class="splits">
    {#each $splits as split}
    <li><TimeSplit split={split}></TimeSplit></li>
    {/each}
</ul>