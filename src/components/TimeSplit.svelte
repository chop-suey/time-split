<script lang="ts">
    import { onMount } from "svelte";

    import { LocalTime } from "../model/local-time";
    import type { Timesplit } from "../model/timesplit";
    import { getTimeSplitStore } from "../service/service-manager";
    import type { Duration } from "../model/duration";
    import SplitTag from "./SplitTag.svelte";

    
    let { split }: { split: Timesplit } = $props();
    
    let editedTime: string = $state("");
    let editedTag: string = $state("");
    
    let tick = $state(0);
    
    const timeText = $derived(split.start.getTimeText());
    const duration = $derived(split.getDuration());
    const durationOngoing = $derived(getDurationOngoing(split, tick));
    
    const timeSplitStore = getTimeSplitStore();
    const editingSplitId = timeSplitStore.getEditingSplitId();
    let refreshTimeoutHandle: number | null = null;

    const editMode = $derived($editingSplitId === split.id);

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

    function getDurationOngoing(s: Timesplit, _: number): Duration | null {
        const durationOngoing = s.getDurationOngoing();
        if (durationOngoing == null) {
            stopTimeout();
        } else {
            scheduleRefresh();
        }
        return durationOngoing;
    }

    function deleteSplit(ignored: Event): void {
        if ($editingSplitId != null) {
            return;
        }
        let message = `Delete ${split.tag}?`;
        if (confirm(message)) {
            timeSplitStore.deleteSplit(split);
        }
    }

    function editSplit(ignored: Event): void {
        if ($editingSplitId != null) {
            return;
        }
        editedTime = split.start.getTimeText();
        editedTag = split.tag;
        timeSplitStore.startEditingSplit(split);
    }

    function saveSplit(event: Event): void {
        event.preventDefault();

        const localTime = LocalTime.parse(editedTime);

        if (localTime) {
            const start = split.start.withTime(localTime.hours, localTime.minutes);
            const editedSplit = split
                .withStart(start)
                .withTag(editedTag);
            timeSplitStore.updateSplit(editedSplit);
            timeSplitStore.stopEditing();
        }
    }
</script>

<div class="box">
    <div id="time">
        {#if editMode}
        <form onsubmit="{saveSplit}">
            <input class="item sh border" type="text" pattern="{LocalTime.pattern}" bind:value="{editedTime}">
        </form>
        {:else}
        <div>
            { timeText }
        </div>
        {/if} 
    </div>

    <div id="tag" class="expand">
        {#if editMode}
        <form onsubmit="{saveSplit}">
            <input class="item sh border" type="text" bind:value="{editedTag}">
        </form>
        {:else}
        <SplitTag tag={split.tag} linkTickets></SplitTag>
        {/if} 
    </div>

    {#if !editMode}
        {#if duration.hasDuration()}
            <div class="duration">({duration})</div>
        {:else if !!durationOngoing}
            <div class="duration ongoing">({durationOngoing})</div>
        {/if}
    {/if}
    <div class="box">
        {#if editMode}
            <button class="sh sw border" onclick="{saveSplit}"><img src="assets/save.svg" alt="Save"></button>
        {:else}
            <button class="sh sw border" onclick="{editSplit}" disabled={ $editingSplitId != null }><img src="assets/edit.svg" alt="Edit"></button>
            <button class="sh sw border" onclick="{deleteSplit}" disabled={ $editingSplitId != null }><img src="assets/delete.svg" alt="Delete"></button>
        {/if}
    </div>
</div>

<style>
    #time {
        width: 60px;
    }

    #tag {
        overflow: hidden
    }

    .duration {
        float: right;
        white-space: nowrap;
    }

    .duration.ongoing {
        color: #AAA;
    }
</style>