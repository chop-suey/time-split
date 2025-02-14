<script lang="ts">
import type { TagSummary } from "../model/day-summary";
import SplitTag from "./SplitTag.svelte";

let { daySummary }: { daySummary: TagSummary } = $props(); 
</script>

<style>
h1 {
    font-weight: bold;
    font-size: 1.2em;
    margin: 0.2em 0 0.4em 0
}

.ongoing {
    color: #AAA;
}

table {
    width: 100%;
    table-layout: fixed;
    text-align: left;
}

tr#total {
        border-top: 1px solid #AAA;
}

td, th {
    white-space: nowrap;
    padding: 0.5em 0.4em 0.5em 0;
}

th {
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
}

td {
    width: max-content;
}
</style>

<div>
    <h1>Summary</h1>
    <table>
        <tbody>
            {#each daySummary.entries as entry}
            <tr>
                <th><SplitTag tag={ entry.tag }></SplitTag></th>
                <td class:ongoing="{ entry.ongoing }">{ entry.duration }</td>
            </tr>
            {/each}
            <tr id="total">
                <th>Working hours</th>
                <td class:ongoing="{ daySummary.ongoing }">{ daySummary.totalDuration }</td>
            </tr>
        </tbody>
    </table>
</div>
