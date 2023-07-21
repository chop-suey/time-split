<script lang="ts">
import { onMount } from "svelte";
import type { SplitGroup } from "../model/split-group";
import type { Timesplit } from "../model/timesplit";
import { getPreferencesService } from "../service/service-manager";
import WorkingHoursSummary from "./WorkingHoursSummary.svelte";
import { Duration } from "../model/duration";

export let group: SplitGroup;

const preferencesService = getPreferencesService();

let displaySummary = false;
let tick = 0;

$: daySummary = summarize(group.splits, tick);

let refreshTimeoutHandle = null;

interface DaySummary {
    totalDuration: Duration;
    ongoing: boolean;
    entries: Summary[];
}

interface Summary {
    tag: string;
    duration: Duration;
    ongoing: boolean;
}

onMount(() => () => stopTimeout());

function stopTimeout() {
    if (refreshTimeoutHandle != null) {
        clearTimeout(refreshTimeoutHandle);
        refreshTimeoutHandle = null;
    }
}

function scheduleRefresh() {
    stopTimeout();
    refreshTimeoutHandle = setTimeout(() => tick = tick + 1, 60 * 1000);
}

function summarize(splits: Timesplit[], _: number): DaySummary {
    const entries = splits
        .reduce(addToSummary, [])
        .sort((a, b) => a.tag.localeCompare(b.tag));
    const nonWorkTags = preferencesService.getNonWorkTags();
    const workEntries = entries
        .filter(entry => !nonWorkTags.has(entry.tag));
    const totalDuration = workEntries.reduce((sum, curr) => sum.plus(curr.duration), new Duration(0));
    const ongoing = workEntries.some(entry => entry.ongoing);

    if (ongoing) {
        scheduleRefresh();
    }

    return { totalDuration, ongoing, entries };
}

function addToSummary(summaries: Summary[], split: Timesplit): Summary[] {
    if (!summaries.find(summary => summary.tag === split.tag)) {
        summaries.push({ tag: split.tag, duration: new Duration(0), ongoing: false });
    }

    const durationOngoing = split.getDurationOngoing();
    const ongoing = durationOngoing != null;
    const duration = ongoing
        ? durationOngoing
        : split.getDuration();

    const summary = summaries.find(summary => summary.tag === split.tag);
    summary.duration = summary.duration.plus(duration);
    summary.ongoing = summary.ongoing || ongoing;
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
        background-color: #DDDDDF;
        border-bottom: 1px solid #DDDDDF;
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

    #title span#duration {
        position: absolute;
        top: 25%;
        right: 0.5em;
    }

    #title span#duration.ongoing {
        color: #AAA;
    }

    #summary {
        background-color: #EEEEEF;
        padding: 0.4em;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    table {
        display: inline;
        text-align: left;
    }

    tr#total {
        border-top: 1px solid #AAA;
    }

    th {
        font-weight: bold;
    }

    th, td {
        padding: 0.5em 0.4em;
    }

    .ongoing {
        color: #AAA;
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
        <span id="duration" class:ongoing="{daySummary.ongoing}">({daySummary.totalDuration})</span>
        <h1>{ group.date.getDisplayDateText() }</h1>
    </div>
    {#if displaySummary}
    <div id="summary">
        <table>
            {#each daySummary.entries as entry}
            <tr>
                <th>{ entry.tag }</th>
                <td class:ongoing="{ entry.ongoing }">{entry.duration}</td>
            </tr>
            {/each}
            <tr id="total">
                <th>Working hours</th>
                <td class:ongoing="{ daySummary.ongoing }">{ daySummary.totalDuration}</td>
            </tr>
        </table>
        <WorkingHoursSummary splits={group.splits}></WorkingHoursSummary>
    </div>
    {/if}
</div>