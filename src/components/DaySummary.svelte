<script lang="ts">
import type { SplitGroup } from "../model/split-group";
import type { Timesplit } from "../model/timesplit";
import WorkingHoursSummary from "./WorkingHoursSummary.svelte";

export let group: SplitGroup;

let displaySummary = false;

$: entries = summarize(group.splits);

interface Summary {
    tag: string;
    hours: number;
}

function summarize(splits: Timesplit[]): Summary[] {
    return splits
        .reduce(addToSummary, [])
        .sort((a, b) => a.tag.localeCompare(b.tag));
}

function addToSummary(summaries: Summary[], split: Timesplit): Summary[] {
    if (!summaries.find(summary => summary.tag === split.tag)) {
        summaries.push({ tag: split.tag, hours: 0 });
    }
    summaries.find(summary => summary.tag === split.tag).hours += split.getDurationMinutes(true) / 60;
    return summaries;
}

function toggleSummary(ignored: Event): void {
    displaySummary = !displaySummary;
}

</script>

<style>
    .day_summary {
        margin: 0;
        padding: 0;
        background-color: #B0BEC5;
        border-bottom: 1px solid #B0BEC5;
    }

    h1 {
        margin: 0;
        padding: 0;

        cursor: pointer;
    }

    .chevron {
        float: left;
    }

    .summary {
        background-color: #CFD8DC;
    }

    dl {
        margin: 0;
        padding: 0.5em;
    }

    dt {
        font-weight: bold;
    }

    dt::after {
        content: ": ";
    }
</style>

<div class="day_summary">
    <h1 on:click="{toggleSummary}">
        <span class="chevron">
            {#if displaySummary}
            <img src="assets/expand_less.svg" alt="Collapse Summary">
            {:else}
            <img src="assets/expand_more.svg" alt="Expand Summary">
            {/if}
        </span>
        { group.date.getDateText() }</h1>
    {#if displaySummary}
    <div class="summary">
        <dl>
            {#each entries as entry}
            <dt>{ entry.tag }</dt>
            <dd>{ entry.hours.toFixed(2) } h</dd>
            {/each}
        </dl>
        <WorkingHoursSummary splits={group.splits}></WorkingHoursSummary>
    </div>
    {/if}
</div>