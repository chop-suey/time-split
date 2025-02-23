<script lang="ts">
    import { getPreferencesService } from "../service/service-manager";

    let { tag }: { tag: string } = $props();

    const nonWorkTags = getPreferencesService().nonWorkTags;
</script>

<style>
div {
    min-width: 0;
    display: flex;
    flex-direction: row;
    gap: 0.2em;
    align-items: center;
}

div > img {
    width: 1.3em;
}

div > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

<div>
    {#if $nonWorkTags.has(tag) }
    <img src="assets/pause.svg" alt="non work tag">
    {/if}
    <span title="{ tag }">{ tag }</span>
</div>