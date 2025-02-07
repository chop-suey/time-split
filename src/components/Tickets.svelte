<script lang="ts">
    import { Duration } from "../model/duration";
    import type { Timesplit } from "../model/timesplit";
    import { getPreferencesService } from "../service/service-manager";

    let { splits }: { splits: Timesplit[] } = $props();
    const tickets = $derived(conflateTickets(extractTickets(splits)));

    const preferencesService = getPreferencesService();

    let ticketBaseUrl = preferencesService.getTicketBaseUrl();


    function extractTickets(splits: Timesplit[]): Ticket[] {
        return splits.flatMap((split) => {
            const ticketRegex = /[A-Z]+-\d+/gi;
            let references = [...split.tag.matchAll(ticketRegex)].map(
                (ref) => ref[0],
            );
            if (references.length === 0) {
                return [];
            }

            let durationMinutes =
                split.getDuration().minutes / references.length;
            let duration = new Duration(durationMinutes);

            return references.map((reference) => ({ reference, duration }));
        });
    }

    /**
     * Conflate durations of all tickets with the same reference.
     * Ticket references are considered case insensitive and mapped
     * to upper case.
     */
    function conflateTickets(tickets: Ticket[]): Ticket[] {
        let conflatedTickets = tickets.reduce((ticketDurations, ticket) => {
            let reference = ticket.reference.toUpperCase();
            let cumulatedDuration = ticketDurations.has(reference)
                ? ticketDurations.get(reference)!.plus(ticket.duration)
                : ticket.duration;
            ticketDurations.set(reference, cumulatedDuration);
            return ticketDurations;
        }, new Map<string, Duration>());
        return [...conflatedTickets.entries()].map(([reference, duration]) => ({
            reference,
            duration,
        }));
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
                    {#if ticketBaseUrl !== null}
                        <a href="{ticketBaseUrl}{ticket.reference}" target="_blank">{ticket.reference}</a>
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
