<script lang="ts">
import { getTimeSplitService } from "../service/service-manager";

let recentTags = [];

const timeSplitService = getTimeSplitService();

timeSplitService.getRecentTags().subscribe(tags => recentTags = tags);
</script>

<style>
    #container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 0.5em;
    }
</style>

<div id="container">
    {#each recentTags as recentTag}
    <button class="chips" on:click="{ () => timeSplitService.newSplit(recentTag) }">{recentTag}</button>
    {/each}
</div>