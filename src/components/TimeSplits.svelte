<script lang="ts">
import { derived } from "svelte/store";
import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

import { timeSplitService } from "../service/time-split-service";
import TimeSplit from "./TimeSplit.svelte";

const matchedSplits = derived(timeSplitService.getSplits(), matchSplits);

function matchSplits(splits: Timesplit[]): {split: Timesplit, end: Datetime }[] {
    return splits.reduceRight((acc, split, idx, arr) => {
        const end = idx > 0 
            ? arr[idx - 1].datetime
            : null;
        return [ { split, end }, ...acc ];
    }, []);
}
</script>

<ul>
    {#each $matchedSplits as { split, end }}
    <li><TimeSplit split={split} end={end}></TimeSplit></li>
    {/each}
</ul>