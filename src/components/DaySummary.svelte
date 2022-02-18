<script lang="ts">
import type { Datetime } from "../model/datetime";

export let datetime: Datetime;

$: date = datetime?.getDateText();

</script>

<style>
    div {
        background-color: gray;
    }
</style>

<div>{#if !!date}{ date }{/if}</div>