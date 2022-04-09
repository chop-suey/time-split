<script lang="ts">
import { getTimeSplitService } from "../service/service-manager";

const timeSplitService = getTimeSplitService();

let tag = '';

    function onSubmit(event: Event): void {
		event.preventDefault();
        timeSplitService.newSplit(tag);
		tag = '';
	}
</script>

<form on:submit="{onSubmit}">
    <input id="tag" type="text" bind:value={tag}>
    <button type="submit">
        <img src="assets/add.svg" alt="Add Split">
    </button>
</form>
