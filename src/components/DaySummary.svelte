<script lang="ts">
import type { Datetime } from "../model/datetime";
import type { Timesplit } from "../model/timesplit";

export let datetime: Datetime;
export let splits: Timesplit[];

$: entries = summarize(splits);

interface Summary {
    tag: string;
    hours: number;
}

function summarize(splits: Timesplit[]): Summary[] {
    return splits
        .reduce((acc, split) => {
            getOrCreateSummary(split.tag, acc).hours += split.getDurationMinutes(true) / 60;
            return acc;
        }, [] as Summary[])
        .sort((a, b) => a.tag.localeCompare(b.tag));
}

function getOrCreateSummary(tag: string, summaries: Summary[]): Summary {
    if (!summaries.find(summary => summary.tag === tag)) {
        summaries.push({ tag, hours: 0 });
    }
    return summaries.find(summary => summary.tag === tag);
}

</script>

<style>
    .day_summary {
        margin: 1em 0;

        border-bottom: 1px solid gray;
    }

    h1 {
        background-color: gray;
    }

    dt {
        font-weight: bold;
    }

    dt::after {
        content: ": ";
    }
</style>

<div class="day_summary">
    <h1>{ datetime.getDateText() }</h1>
    <div class="summary">
        <dl>
            {#each entries as entry}
            <dt>{ entry.tag }</dt>
            <dd>{ entry.hours.toFixed(2) } h</dd>
            {/each}
        </dl>
    </div>
</div>