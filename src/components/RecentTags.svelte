<script lang="ts">
import { getTimeSplitStore } from "../service/service-manager";

let recentTags = [];

const timeSplitStore = getTimeSplitStore();

timeSplitStore.getRecentTags().subscribe(tags => recentTags = tags);
</script>

<style>
    #container {
        margin: 0.7em;
    }
</style>

<div id="container" class="box">
    {#each recentTags as recentTag}
    <button class="chip border" on:click="{ () => timeSplitStore.newSplit(recentTag) }">{recentTag}</button>
    {/each}
</div>