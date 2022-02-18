<script lang="ts">

import type { Timesplit } from "../model/timesplit";
import { timeSplitService } from "../service/time-split-service";

    export let split: Timesplit;

    let editMode = false;
    let editedTime: string;

    $: dateText = split.start.getDateText();
    $: timeText = split.start.getTimeText();

    $: duration = getDurationHours(split);

    function getDurationHours(s: Timesplit): string {
        const duration = s.getDurationMinutes(true) / 60;
        return duration > 0 ? duration.toFixed(2) : null;
    }

    function deleteSplit(ignored: Event): void {
        timeSplitService.deleteSplit(split);
    }

    function editSplit(ignored: Event): void {
        editMode = true;
        editedTime = split.start.getTimeText();
    }

    function saveSplit(ignored: Event): void {
        editMode = false;
        const [ hour, minute ] = editedTime.split(':');

        const start = split.start.withTime(+hour, +minute);

        timeSplitService.updateSplit(split.withStart(start));
    }
</script>

<span>
    { dateText }
    {#if editMode}
        <input type="time" bind:value="{editedTime}">: { split.tag } {#if !!duration}&rarr; {duration} h{/if}
        <button on:click="{saveSplit}">save</button>
    {:else }
        {timeText}: { split.tag } {#if !!duration}&rarr; {duration} h{/if}
        <button on:click="{editSplit}">edit</button>
    {/if}
    <button on:click="{deleteSplit}">x</button>
</span>
