<script lang="ts">
import { getTimeSplitStore } from "../service/service-manager";

let recentTags: string[] = [];

const timeSplitStore = getTimeSplitStore();

timeSplitStore.getRecentTags().subscribe(tags => recentTags = tags);
</script>

<style>
    #tagcontainer {
        flex-wrap: wrap;
        gap: 0.4em;
    }

    #tagcontainer > * {
        margin: 0;
    }
</style>

<div class="main">
    <div id="tagcontainer" class="box">
        {#each recentTags as recentTag}
        <button class="chip border" on:click="{ () => timeSplitStore.newSplit(recentTag) }">{recentTag}</button>
        {/each}
    </div>
</div>