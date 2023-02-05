<script lang="ts">
import { getTimeSplitService } from "../service/service-manager";

let recentTags = [];

const timeSplitService = getTimeSplitService();

timeSplitService.getRecentTags().subscribe(tags => recentTags = tags);
</script>

<style>
    #container {
        margin: 0.7em;
    }
</style>

<div id="container" class="box">
    {#each recentTags as recentTag}
    <button class="chip border" on:click="{ () => timeSplitService.newSplit(recentTag) }">{recentTag}</button>
    {/each}
</div>