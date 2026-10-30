<script lang="ts">
    import { Duration } from "../model/duration";
    import type { Timesplit } from "../model/timesplit";
    import { getPreferencesService } from "../service/service-manager";
    import { extractTicketReferences, ticketUrl } from "../util/ticket-link";

    let { splits }: { splits: Timesplit[] } = $props();

    const preferencesService = getPreferencesService();

    const ticketBaseUrl = preferencesService.ticketBaseUrl;
    const ticketMappings = preferencesService.ticketMappings;

    const tickets = $derived(conflateTickets(extractTickets(splits))
        .map(ticket => ({
            ...ticket,
            url: ticketUrl(ticket.reference, $ticketBaseUrl, $ticketMappings),
        })));

    function extractTickets(splits: Timesplit[]): Ticket[] {
        return splits.flatMap((split) => {
            const references = extractTicketReferences(split.tag);
            if (references.length === 0) {
                return [];
            }

            let duration = new Duration(split.getDuration().minutes / references.length);

            return references.map((reference) => ({ reference: reference.reference, duration }));
        });
    }

    /**
     * Conflate durations of all tickets with the same reference.
     * Ticket references are considered case insensitive and
     * displayed as they were first written.
     */
    function conflateTickets(tickets: Ticket[]): Ticket[] {
        let conflatedTickets = tickets.reduce((ticketDurations, ticket) => {
            let key = ticket.reference.toLowerCase();
            let existing = ticketDurations.get(key);
            ticketDurations.set(key, {
                reference: existing ? existing.reference : ticket.reference,
                duration: existing ? existing.duration.plus(ticket.duration) : ticket.duration,
            });
            return ticketDurations;
        }, new Map<string, Ticket>());
        return [...conflatedTickets.values()];
    }

    interface Ticket {
        reference: string;
        duration: Duration;
    }
</script>

<div id="tickets">
    <h1>Tickets</h1>
    <p>Splits that have not yet ended are not included.</p>
    <table>
        <tbody>            
            {#each tickets as ticket}
            <tr>
                <th>
                    {#if ticket.url !== null}
                        <a href="{ticket.url}" target="_blank">{ticket.reference}</a>
                    {:else}
                        {ticket.reference}
                    {/if}
                </th>
                <td>{ticket.duration}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        width: 100%;
        text-align: left;
    }

    th {
        font-weight: bold;
        width: 100%;
    }

    td {
        width: auto;
        white-space: nowrap;
    }

    th,
    td {
        padding: 0.5em 0.4em 0.5em 0;
    }

    h1 {
        font-weight: bold;
        font-size: 1.2em;
        margin: 0.2em 0 0.4em 0
    }

    p {
        margin: 0.2em 0;
    }
</style>
