<script lang="ts">
    import { getTimeSplitService } from "../service/service-manager";
    import { padStart } from "../util/format";

    const timeSplitService = getTimeSplitService();

    function exportSplits(ignored: Event) {
        const raw: [number, string][] = timeSplitService.getAll()
            .map(({ start, tag }) => [ start.toTime(), tag ]);
        const timestamps = raw.map(split => split[0]);
        const first = Math.min(...timestamps);
        const last = Math.max(...timestamps);
        const filename = `${timestampToString(last)}_${timestampToString(first)}.json`;
        const content = JSON.stringify(raw);
        
        const a = document.createElement('a');
        a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
        a.setAttribute('download', filename);
        a.click();
    }

    function timestampToString(timestamp: number) {
        const date = new Date(timestamp);
        const year = padStart(date.getFullYear(), 4);
        const month = padStart(date.getMonth() + 1, 2);
        const day = padStart(date.getDate(), 2);
        const hour = padStart(date.getHours(), 2);
        const minute = padStart(date.getMinutes(), 2);
        return `${year}${month}${day}${hour}${minute}`;
    }
</script>

<style>
    button {
        border: 0;
        background: none;
    }
</style>

<button on:click="{exportSplits}"><img src="assets/save.svg" title="Export" alt="Export"></button>
