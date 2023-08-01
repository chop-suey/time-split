<script lang="ts">
    import { onMount } from "svelte";
    import { padStart } from "../util/format";

    let time = new Date();
    let timeoutHandle = null;

    $: hour = padStart(time.getHours(), 2);
    $: minute = padStart(time.getMinutes(), 2);
    $: second = padStart(time.getSeconds(), 2);

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