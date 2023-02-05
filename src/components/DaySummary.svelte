<script lang="ts">
import { onMount } from "svelte";
import type { SplitGroup } from "../model/split-group";
import type { Timesplit } from "../model/timesplit";
    import { getPreferencesService } from "../service/service-manager";
import WorkingHoursSummary from "./WorkingHoursSummary.svelte";

export let group: SplitGroup;

const preferencesService = getPreferencesService();

let displaySummary = false;
let tick = 0;

$: daySummary = summarize(group.splits, tick);

let refreshTimeoutHandle = null;

interface DaySummary {
    totalWorkingHours: number;
    ongoing: boolean;
    entries: Summary[];
}

interface Summary {
    tag: string;
    hours: number;
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
    const totalWorkingHours = workEntries.reduce((sum, curr) => sum + curr.hours, 0);
    const ongoing = workEntries.some(entry => entry.ongoing);

    if (ongoing) {
        scheduleRefresh();
    }

    return { totalWorkingHours, ongoing, entries };
}

function addToSummary(summaries: Summary[], split: Timesplit): Summary[] {
    if (!summaries.find(summary => summary.tag === split.tag)) {
        summaries.push({ tag: split.tag, hours: 0, ongoing: false });
    }

    const hoursOngoing = split.getDurationHoursOngoing()
    const ongoing = hoursOngoing != null;
    const hours = ongoing
        ? hoursOngoing
        : split.getDurationMinutes() / 60;

    const summary = summaries.find(summary => summary.tag === split.tag);
    summary.hours += hours;
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
        <span id="duration" class:ongoing="{daySummary.ongoing}">({daySummary.totalWorkingHours.toFixed(2)} h)</span>
        <h1>{ group.date.getDisplayDateText() }</h1>
    </div>
    {#if displaySummary}
    <div id="summary">
        <table>
            {#each daySummary.entries as entry}
            <tr>
                <th>{ entry.tag }</th>
                <td class:ongoing="{ entry.ongoing }">{ entry.hours.toFixed(2) } h</td>
            </tr>
            {/each}
            <tr id="total">
                <th>Working hours</th>
                <td class:ongoing="{ daySummary.ongoing }">{ daySummary.totalWorkingHours.toFixed(2) } h</td>
            </tr>
        </table>
        <WorkingHoursSummary splits={group.splits}></WorkingHoursSummary>
    </div>
    {/if}
</div>