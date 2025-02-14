<script lang="ts">
import { onMount } from "svelte";
import type { SplitGroup } from "../model/split-group";
import type { Timesplit } from "../model/timesplit";
import { getPreferencesService } from "../service/service-manager";
import Tickets from "./Tickets.svelte";
import { Duration } from "../model/duration";
import type { TagSummary, Summary } from "../model/day-summary";
import DaySummaryEntries from "./TagSummary.svelte";

let { group }: { group: SplitGroup } = $props();

let displaySummary = $state(false);
let tick = $state(0);

const daySummary = $derived(summarize(group.splits, tick));

const preferencesService = getPreferencesService();
let refreshTimeoutHandle: number | null = null;

onMount(() => () => stopTimeout());

function stopTimeout() {
    if (refreshTimeoutHandle != null) {
        clearTimeout(refreshTimeoutHandle);
        refreshTimeoutHandle = null;
    }
}

function scheduleRefresh() {
    stopTimeout();
    const timeout = (60 - (new Date()).getSeconds()) * 1000;
    refreshTimeoutHandle = setTimeout(() => tick = tick + 1, timeout);
}

function summarize(splits: Timesplit[], _: number): TagSummary {
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

    const summary = summaries.find(summary => summary.tag === split.tag)!;
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
        background-color: #EEEEEF;
        border-bottom: 1px solid #DDDDDF;
    }

    #title {
        background-color: #DDDDDF;
        position: relative;
    }

    h1 {
        margin: 0;
        padding: 0.3em;

        font-weight: bold;
        font-size: 1.5em;

        text-align: center;
    }

    #title > button {
        position: absolute;
        left: 0.5em;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: transparent;
        border: 0px;
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
        margin: 0.5em auto;
        background-color: #EEEEEF;

        display: flex;
        flex-direction: column;
        gap: 1.2em
    }

    .ongoing {
        color: #AAA;
    }
</style>

<div id="day_summary_container">
    <div id="title">        
        <button onclick="{toggleSummary}">
            {#if displaySummary}
                <img src="assets/expand_less.svg" alt="Collapse Summary">
                {:else}
                <img src="assets/expand_more.svg" alt="Expand Summary">
                {/if}
        </button>
        <span id="duration" class:ongoing="{daySummary.ongoing}">({daySummary.totalDuration})</span>
        <h1>{ group.date.getDisplayDateText() }</h1>
    </div>
    {#if displaySummary}
    <div id="summary" class="main">
        <DaySummaryEntries daySummary={ daySummary }></DaySummaryEntries>
        <Tickets splits={group.splits}></Tickets>
    </div>
    {/if}
</div>