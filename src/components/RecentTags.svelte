<script lang="ts">
import { getTimeSplitService } from "../service/service-manager";

let recentTags = [];

const timeSplitService = getTimeSplitService();

timeSplitService.getRecentTags().subscribe(tags => recentTags = tags);
</script>

{#each recentTags as recentTag}
<button class="chips" on:click="{ () => timeSplitService.newSplit(recentTag) }">{recentTag}</button>
{/each}