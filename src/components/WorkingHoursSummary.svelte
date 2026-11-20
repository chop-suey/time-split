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
    details > summary {
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
<details>
    <summary>Working hours</summary>
    {#each workingHours as block}
    <span class="work-block">{block}</span>
    {/each}
</details>
{/if}
