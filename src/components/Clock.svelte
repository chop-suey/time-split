<script lang="ts">
    import { onMount } from "svelte";
    import { padStart } from "../util/format";

    let time = $state(new Date());
    let timeoutHandle: number | null = null;

    const hour = $derived(padStart(time.getHours(), 2));
    const minute = $derived(padStart(time.getMinutes(), 2));
    const second = $derived(padStart(time.getSeconds(), 2));

    onMount(() => {
        refresh();
        return () => stopTimeout();
    });

    function refresh() {
        time = new Date();
        const timeout = 1000 - new Date().getMilliseconds();
        timeoutHandle = setTimeout(() => refresh(), timeout);
    }

    function stopTimeout() {
        if (timeoutHandle !== null) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        }
    }
</script>

<style>
    div {
        font-family: 'Inconsolata', monospace;
    }
</style>

<div>{hour}:{minute}:{second}</div>