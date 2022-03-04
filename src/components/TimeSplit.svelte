<script lang="ts">

import type { Timesplit } from "../model/timesplit";
import { getTimeSplitService } from "../service/service-manager";

const timeSplitService = getTimeSplitService();

    export let split: Timesplit;

    let editMode = false;
    let editedTime: string;
    let editedTag: string;

    $: timeText = split.start.getTimeText();

    $: duration = getDurationHours(split);

    function getDurationHours(s: Timesplit): string {
        const duration = s.getDurationMinutes(true) / 60;
        return duration > 0 ? duration.toFixed(2) : null;
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

        const pattern = /([0-1]?[0-9]|2[0-3])[.:]([0-5][0-9])/;
        const match = editedTime.match(pattern);

        if (match.length == 3) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);

            const start = split.start.withTime(hours, minutes);
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
                <input type="text" pattern="([0-1]?[0-9]|2[0-3])[.:][0-5][0-9]" bind:value="{editedTime}">
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
            { split.tag }{#if !!duration}<span class="duration">({duration} h)</span>{/if}
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

    #split > * {
        margin: 2px 5px;
    }

    #time {
        width: 100px;
    }

    #description {
        flex: 1;
        text-align: left;
    }

    button {
        padding: 2px;
    }

    .duration {
        float: right;
    }

    input {
        margin: 0;
        width: 100%;
    }
</style>