<script lang="ts">
import { onMount } from "svelte";
import { Datetime } from "../model/datetime";

import { LocalTime } from "../model/local-time";
import type { Timesplit } from "../model/timesplit";
import { getTimeSplitService } from "../service/service-manager";

const timeSplitService = getTimeSplitService();

    export let split: Timesplit;

    let editMode = false;
    let editedTime: string;
    let editedTag: string;

    let time = new Datetime();

    $: timeText = split.start.getTimeText();

    $: duration = getDurationHours(split);
    $: durationOngoing = getDurationHoursOngoing(split, time);

    onMount(() => {
        const interval = setInterval(() => time = new Datetime(), 60 * 1000);
        return () => clearInterval(interval);
    });

    function getDurationHours(s: Timesplit): string {
        const duration = s.getDurationMinutes(true) / 60;
        return duration > 0 ? duration.toFixed(2) : null;
    }

    function getDurationHoursOngoing(s: Timesplit, time: Datetime) {
        const duration = !s.end && time.isSameDay(s.start)
            ? s.start.getDifferenceMinutes(time) / 60
            : null;
        return duration?.toFixed(2);
    }

    function deleteSplit(ignored: Event): void {
        timeSplitService.deleteSplit(split);
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
            timeSplitService.updateSplit(editedSplit);
        }
    }
</script>

<div id="component">
    <div id="split">
        <div id="time">
            {#if editMode}
            <form on:submit="{saveSplit}">
                <input type="text" pattern="{LocalTime.pattern}" bind:value="{editedTime}">
            </form>
            {:else}
            { timeText }
            {/if} 
        </div>
        <div id="description">
            {#if editMode}
            <form on:submit="{saveSplit}">
                <input type="text" bind:value="{editedTag}">
            </form>
            {:else}
                { split.tag }
                {#if !!duration}
                    <span class="duration">({duration} h)</span>
                {:else if !!durationOngoing}
                    <span class="duration ongoing">({durationOngoing} h)</span>
                {/if}
            {/if} 
        </div>
        <div id="controls">
            {#if editMode}
                <button on:click="{saveSplit}"><img src="assets/save.svg" alt="Save"></button>
            {:else}
                <button on:click="{editSplit}"><img src="assets/edit.svg" alt="Edit"></button>
                <button on:click="{deleteSplit}"><img src="assets/delete.svg" alt="Delete"></button>
            {/if}
        </div>
    </div>
</div>

<style>
    #component {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #split {
        width: 480px;
        display: flex;
        justify-content: stretch;
        align-items: center;
    }

    #time {
        width: 60px;
    }

    #description {
        flex: 1;
        text-align: left;
    }

    .duration {
        float: right;
    }

    .duration.ongoing {
        color: #AAA;
    }

    input {
        margin: 0;
        width: 100%;
    }
</style>