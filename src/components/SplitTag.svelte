<script lang="ts">
    import { getPreferencesService } from "../service/service-manager";
    import { splitTag } from "../util/ticket-link";

    let { tag, linkTickets = false }: { tag: string; linkTickets?: boolean } = $props();

    const preferencesService = getPreferencesService();
    const nonWorkTags = preferencesService.nonWorkTags;
    const ticketBaseUrl = preferencesService.ticketBaseUrl;
    const ticketMappings = preferencesService.ticketMappings;

    const segments = $derived(linkTickets
        ? splitTag(tag, $ticketBaseUrl, $ticketMappings)
        : []);
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
    <span title="{ tag }">
        {#if linkTickets}
        {#each segments as segment, index (index)}
            {#if segment.url !== null}
            <a href="{segment.url}" target="_blank">{segment.text}</a>
            {:else}
            {segment.text}
            {/if}
        {/each}
        {:else}
        { tag }
        {/if}
    </span>
</div>