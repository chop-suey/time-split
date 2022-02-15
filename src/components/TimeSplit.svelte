<script lang="ts">
import type { Datetime } from "../model/datetime";

import type { Timesplit } from "../model/timesplit";
import { timeSplitService } from "../service/time-split-service";

    export let split: Timesplit;
    export let end: Datetime = null;

    let editMode = false;

    $: dateText = split.datetime.getDateText();
    $: timeText = split.datetime.getTimeText();

    $: duration = calculateDurationHours(split, end);

    function calculateDurationHours({ datetime: from }: Timesplit, to: Datetime): string {
        if (!from || !to) {
            return null;
        }
        const delta = to.toDateUtc().getTime() - from.toDateUtc().getTime();
        return (delta / 3_600_000).toFixed(2);
    }

    function deleteSplit(ignored: Event): void {
        timeSplitService.deleteSplit(split);
    }
</script>

<span>
    { dateText }
    {#if editMode}
        <input type="time" value="{timeText}">: { split.tag } {#if !!duration}&rarr; {duration} h{/if}
        <button on:click="{ () => editMode = false }">save</button>
    {:else }
        {timeText}: { split.tag } {#if !!duration}&rarr; {duration} h{/if}
        <button on:click="{ () => editMode = true }">edit</button>
    {/if}
    <button on:click="{deleteSplit}">x</button>
</span>
