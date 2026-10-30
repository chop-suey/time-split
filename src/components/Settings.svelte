<script lang="ts">
    import { getPreferencesService } from "../service/service-manager";

    const preferencesService = getPreferencesService();
    const nonWorkTags = preferencesService.nonWorkTags;
    const pinnedTags = preferencesService.pinnedTags;
    const ticketBaseUrl = preferencesService.ticketBaseUrl;
    const ticketMappings = preferencesService.ticketMappings;
    const numberOfRecentTags = preferencesService.numberOfRecentTags;

    let newNonWorkTag = $state("");
    let newPinnedTag = $state("");
    let newTicketProject = $state("");
    let newTicketPath = $state("");

    function addToSet(tags: Set<string>, tag: string): Set<string> {
        const updated = new Set(tags);
        updated.add(tag);
        return updated;
    }

    function removeFromSet(tags: Set<string>, tag: string): Set<string> {
        const updated = new Set(tags);
        updated.delete(tag);
        return updated;
    }

    function addNonWorkTag(event: Event): void {
        event.preventDefault();
        const trimmed = newNonWorkTag.trim();
        newNonWorkTag = "";
        if (trimmed.length === 0) {
            return;
        }
        preferencesService.setNonWorkTags(addToSet($nonWorkTags, trimmed));
    }

    function addPinnedTag(event: Event): void {
        event.preventDefault();
        const trimmed = newPinnedTag.trim();
        newPinnedTag = "";
        if (trimmed.length === 0) {
            return;
        }
        preferencesService.setPinnedTags(addToSet($pinnedTags, trimmed));
    }

    function saveTicketBaseUrl(): void {
        preferencesService.setTicketBaseUrl(ticketBaseUrlValue.trim());
    }

    let ticketBaseUrlValue = $state($ticketBaseUrl);

    function addTicketMapping(event: Event): void {
        event.preventDefault();
        const project = newTicketProject.trim();
        const path = newTicketPath.trim();
        if (project.length === 0 || path.length === 0) {
            return;
        }
        newTicketProject = "";
        newTicketPath = "";
        const otherMappings = $ticketMappings
            .filter(mapping => mapping.project.toLowerCase() !== project.toLowerCase());
        preferencesService.setTicketMappings([ ...otherMappings, { project, path } ]);
    }

    function removeTicketMapping(project: string): void {
        preferencesService.setTicketMappings(
            $ticketMappings.filter(mapping => mapping.project.toLowerCase() !== project.toLowerCase()));
    }

    function saveNumberOfRecentTags(): void {
        const parsed = parseInt(numberOfDisplayedTagsValue);
        if (!isNaN(parsed) && parsed >= 1) {
            preferencesService.setNumberOfRecentTags(parsed);
        } else {
            numberOfDisplayedTagsValue = String($numberOfRecentTags);
        }
    }

    let numberOfDisplayedTagsValue = $state(String($numberOfRecentTags));
</script>

<style>
    #settings {
        margin: 0.4em auto;
        padding: 0.4em 0.6em;

        background-color: #EEEEEF;
        border-bottom: 1px solid #DDDDDF;
    }

    section {
        margin: 0.6em 0;
    }

    h2 {
        margin: 0 0 0.3em 0;

        font-size: 1em;
        font-weight: bold;
    }

    #tags {
        flex-wrap: wrap;
        justify-content: flex-start;

        margin-top: 0.4em;
    }

    .chip {
        display: flex;
        flex-direction: row;
        gap: 0.3em;
        align-items: center;

        min-width: 0;
        max-width: 100%;
    }

    .chip span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chip:hover {
        background-color: #ccffcc;
        border-color: #88cc88;
    }

    #ticket-links .box {
        justify-content: flex-start;
    }

    #ticket-mapping-form {
        margin-top: 0.4em;
    }

    #ticket-mapping-form .box + .box {
        margin-top: 0.3em;
    }

    label {
        width: 6em;

        font-weight: bold;
    }

    #mappings {
        flex-wrap: wrap;
        justify-content: flex-start;

        margin-top: 0.4em;
    }

    #mappings .project {
        font-weight: bold;
    }
</style>

<div id="settings">
    <div class="main">
    <section>
        <h2>Non work tags</h2>
        <form class="box" onsubmit="{addNonWorkTag}">
            <input class="item sh border expand" type="text" placeholder="Tag" bind:value="{newNonWorkTag}">
            <button class="sh sw border" type="submit"><img src="assets/add.svg" alt="Add"></button>
        </form>
        {#if $nonWorkTags.size > 0}
        <div id="tags" class="box">
            {#each $nonWorkTags as tag}
            <button class="chip border" title="Remove {tag} from non work tags"
                onclick="{ () => preferencesService.setNonWorkTags(removeFromSet($nonWorkTags, tag)) }">
                <span>{tag}</span>
            </button>
            {/each}
        </div>
        {/if}
    </section>
    <section>
        <h2>Pinned tags</h2>
        <form class="box" onsubmit="{addPinnedTag}">
            <input class="item sh border expand" type="text" placeholder="Tag" bind:value="{newPinnedTag}">
            <button class="sh sw border" type="submit"><img src="assets/add.svg" alt="Add"></button>
        </form>
        {#if $pinnedTags.size > 0}
        <div id="tags" class="box">
            {#each $pinnedTags as tag}
            <button class="chip border" title="Unpin {tag}"
                onclick="{ () => preferencesService.setPinnedTags(removeFromSet($pinnedTags, tag)) }">
                <span>{tag}</span>
            </button>
            {/each}
        </div>
        {/if}
    </section>
    <section id="ticket-links">
        <h2>Ticket links</h2>
        <div class="box">
            <label for="ticket-base-url">Base URL</label>
            <input id="ticket-base-url" class="item sh border expand" type="text" placeholder="https://ticket.example.com"
                bind:value="{ticketBaseUrlValue}" onchange="{saveTicketBaseUrl}">
        </div>
        <form id="ticket-mapping-form" onsubmit="{addTicketMapping}">
            <div class="box">
                <label for="ticket-project">Project</label>
                <input id="ticket-project" class="item sh border expand" type="text" placeholder="proj"
                    bind:value="{newTicketProject}">
            </div>
            <div class="box">
                <label for="ticket-path">Path</label>
                <input id="ticket-path" class="item sh border expand" type="text" placeholder="path/to/ticket/"
                    title="Path before the ticket number; relative to the base URL or a full URL"
                    bind:value="{newTicketPath}">
            </div>
            <div class="box">
                <button class="sh sw border" type="submit"><img src="assets/add.svg" alt="Add"></button>
            </div>
        </form>
        {#if $ticketMappings.length > 0}
        <div id="mappings" class="box">
            {#each $ticketMappings as mapping (mapping.project)}
            <button class="chip border" title="Remove link for {mapping.project}"
                onclick="{ () => removeTicketMapping(mapping.project) }">
                <span class="project">{mapping.project} →</span>
                <span class="path">{mapping.path}</span>
            </button>
            {/each}
        </div>
        {/if}
    </section>
    <section>
        <h2>Displayed tags</h2>
        <div class="box">
            <input class="item sh border" type="number" min="1" bind:value="{numberOfDisplayedTagsValue}"
                onchange="{saveNumberOfRecentTags}">
        </div>
    </section>
    </div>
</div>
