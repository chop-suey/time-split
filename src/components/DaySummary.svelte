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
    #day_summary_container {
        margin: 0.4em auto;
        padding: 0;
        background-color: #B0BEC5;
        border-bottom: 1px solid #B0BEC5;
    }

    #title {
        position: relative;
        cursor: pointer;
    }

    h1 {
        margin: 0;
        padding: 0.3em;

        font-weight: bold;
        font-size: 1.5em;

        cursor: pointer;

        text-align: center;
    }

    .chevron {
        position: absolute;
        left: 0.5em;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #summary {
        background-color: #CFD8DC;
        padding: 0.4em;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    table {
        display: inline;
        text-align: left;
    }

    th {
        font-weight: bold;
    }

    th, td {
        padding: 0.5em 0.4em;
    }
</style>



<div id="day_summary_container">
    <div id="title" on:click="{toggleSummary}">        
        <span class="chevron">
            {#if displaySummary}
            <img src="assets/expand_less.svg" alt="Collapse Summary">
            {:else}
            <img src="assets/expand_more.svg" alt="Expand Summary">
            {/if}
        </span>
        <h1>{ group.date.getDisplayDateText() }</h1>
    </div>
    {#if displaySummary}
    <div id="summary">
        <table>
            {#each entries as entry}
            <tr>
                <th>{ entry.tag }</th>
                <td>{ entry.hours.toFixed(2) } h</td>
            </tr>
            {/each}
        </table>
        <WorkingHoursSummary splits={group.splits}></WorkingHoursSummary>
    </div>
    {/if}
</div>