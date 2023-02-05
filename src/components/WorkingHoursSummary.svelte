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

<form class="main box" on:submit="{copySummary}">
    <input class="item sh border" type="text" readonly value="{ workingHours }" disabled>
    <button class="sh sw border" type="submit"><img src="assets/copy.svg" alt="Copy"></button>
</form>