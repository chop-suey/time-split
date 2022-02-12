<script lang="ts">
import type { Timesplit } from "../model/timesplit";
import { timeSplitService } from "../service/time-split-service";

    export let split: Timesplit;
    export let end: Date = null;

    const dateFormat = Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' });

    $: dateText = dateFormat.format(split.datetime);
    $: duration = calculateDurationHours(split, end);

    function calculateDurationHours({ datetime: from }: Timesplit, to: Date): string {
        if (!from || !to) {
            return null;
        }
        const delta = to.getTime() - from.getTime();
        return (delta / 3_600_000).toFixed(2);
    }

    function deleteSplit(ignored: Event): void {
        timeSplitService.deleteSplit(split);
    }
</script>

<span>{ dateText }: {split.tag} {#if !!duration}&rarr; {duration} h{/if}</span><button on:click="{deleteSplit}">x</button>

