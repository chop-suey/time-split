<script lang="ts">
import { timeSplitService } from "../service/time-split-service";

let recentTags = [];

timeSplitService.getRecentTags().subscribe(tags => recentTags = tags);
</script>

{#each recentTags as recentTag}
<button on:click="{ () => timeSplitService.newSplit(recentTag) }">{recentTag}</button>
{/each}