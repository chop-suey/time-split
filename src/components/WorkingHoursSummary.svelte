<script lang="ts">
import type { Timesplit } from "../model/timesplit";
import { getPreferencesService } from "../service/service-manager";
import { extractWorkingHours } from "../util/working-hours";

    export let splits: Timesplit[];

    const preferencesService = getPreferencesService();

    $: workingHours = extractWorkingHours(splits, preferencesService.getNonWorkTags());

    function copySummary(event: Event) {
        event.preventDefault();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(workingHours);
        } else {
            console.error('Cannot copy text (not supported by browser)');
        }
    }
</script>

<style>
    #container {
        display: flex;
        justify-content: center;
        margin: 0.5em;
    }

    form {
        display: inline-flex;
        flex-direction: row;
        width: 480px;
    }

    form * {
        margin: 0.3em;
    }

    input {
        flex: 1;
    }

    button {
        flex: 0;
    }
</style>

<div id="container">
    <form on:submit="{copySummary}">
        <input type="text" readonly value="{ workingHours }" disabled>
        <button type="submit"><img src="assets/copy.svg" alt="Copy"></button>
    </form>
</div>