<script lang="ts">
    import { onMount } from "svelte";

    import { LocalTime } from "../model/local-time";
    import type { Timesplit } from "../model/timesplit";
    import { getTimeSplitStore } from "../service/service-manager";
    import type { Duration } from "../model/duration";

    const timeSplitStore = getTimeSplitStore();

    export let split: Timesplit;

    let editMode = false;
    let editedTime: string;
    let editedTag: string;

    let tick = 0;
    let refreshTimeoutHandle = null;

    $: timeText = split.start.getTimeText();

    $: duration = split.getDuration();
    $: durationOngoing = getDurationOngoing(split, tick);

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

    function getDurationOngoing(s: Timesplit, _: number): Duration {
        const durationOngoing = s.getDurationOngoing();
        if (durationOngoing == null) {
            stopTimeout();
        } else {
            scheduleRefresh();
        }
        return durationOngoing;
    }

    function deleteSplit(ignored: Event): void {
        timeSplitStore.deleteSplit(split);
    }

    function editSplit(ignored: Event): void {
        editedTime = split.start.getTimeText();
        editedTag = split.tag;
        editMode = true;
    }

    function saveSplit(event: Event): void {
        event.preventDefault();
        editMode = false;

        const localTime = LocalTime.parse(editedTime);

        if (localTime) {
            const start = split.start.withTime(localTime.hours, localTime.minutes);
            const editedSplit = split
                .withStart(start)
                .withTag(editedTag);
            timeSplitStore.updateSplit(editedSplit);
        }
    }
</script>

<div class="main box">
    
    <div id="time">
        {#if editMode}
        <form on:submit="{saveSplit}">
            <input class="item sh border" type="text" pattern="{LocalTime.pattern}" bind:value="{editedTime}">
        </form>
        {:else}
        <div class="pl">
            { timeText }
        </div>
        {/if} 
    </div>

    <div class="expand">
        {#if editMode}
        <form on:submit="{saveSplit}">
            <input class="item sh border" type="text" bind:value="{editedTag}">
        </form>
        {:else}
            <span class="pl">
                { split.tag }
            </span>
            {#if duration.hasDuration()}
                <span class="duration">({duration})</span>
            {:else if !!durationOngoing}
                <span class="duration ongoing">({durationOngoing})</span>
            {/if}
        {/if} 
    </div>

    <div class="box">
        {#if editMode}
            <button class="sh sw border" on:click="{saveSplit}"><img src="assets/save.svg" alt="Save"></button>
        {:else}
            <button class="sh sw border" on:click="{editSplit}"><img src="assets/edit.svg" alt="Edit"></button>
            <button class="sh sw border" on:click="{deleteSplit}"><img src="assets/delete.svg" alt="Delete"></button>
        {/if}
    </div>
</div>

<style>
    #time {
        width: 60px;
    }

    .duration {
        float: right;
    }

    .duration.ongoing {
        color: #AAA;
    }
</style>