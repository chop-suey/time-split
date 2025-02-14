<script lang="ts">
import { getPreferencesService, getTimeSplitStore } from "../service/service-manager";
import SplitTag from "./SplitTag.svelte";

interface Tag {
    label: string;
    pinned: boolean;
}

let displayedTags: Tag[] = $state([]);

const timeSplitStore = getTimeSplitStore();
const preferencesService = getPreferencesService();

const numberOfDisplayedTags = preferencesService.getNumberOfDisplayedTags(10);

timeSplitStore.getRecentTags(numberOfDisplayedTags).subscribe((tags: string[]) => {
        const pinnedTags = preferencesService.getPinnedTags();
        const recentTags = tags
            .filter(tag => !pinnedTags.has(tag))
            .map(label => ({ 
                label,
                pinned: false,
            }));
        displayedTags = [ ...pinnedTags ]
            .map(label => ({
                label,
                pinned: true,
            }))
            .concat(recentTags)
            .slice(0, numberOfDisplayedTags);
    });
</script>

<style>
    #tagcontainer {
        flex-wrap: wrap;
        gap: 0.4em;
    }

    #tagcontainer > * {
        margin: 0;
    }

    button {
        display: flex;

        flex-direction: row;
        gap: 0.2em;

        max-width: 40%;
    }

    button > img {
        width: 1.3em;
    }
</style>

<div class="main">
    <div id="tagcontainer" class="box">
        {#each displayedTags as tag}
        <button class="chip border" onclick="{ () => timeSplitStore.newSplit(tag.label) }">
            {#if tag.pinned}
                <img src="assets/pin.svg" alt="pinned">
            {/if}
            <SplitTag tag={tag.label}></SplitTag>
        </button>
        {/each}
    </div>
</div>