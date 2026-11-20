<script lang="ts">
import type { Timesplit } from "../model/timesplit";
import { getPreferencesService } from "../service/service-manager";
import { extractWorkingHours } from "../util/working-hours";

    let { splits }: { splits: Timesplit[] } = $props();

    const preferencesService = getPreferencesService();

    const nonWorkTags = preferencesService.nonWorkTags;

    const workingHours = $derived(
        extractWorkingHours(splits, $nonWorkTags)
            .map(block => block.join(" – "))
    );
</script>

<style>
    h1 {
        font-weight: bold;
        font-size: 1.2em;
        margin: 0.2em 0 0.4em 0;
    }

    .work-block {
        display: block;
        line-height: 1.2;
    }
</style>

{#if workingHours.length > 0}
<div>
    <h1>Working hours</h1>
    {#each workingHours as block}
    <span class="work-block">{block}</span>
    {/each}
</div>
{/if}
