<script lang="ts">
import { timeSplitService } from "../service/time-split-service";
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
        Add
    </button>
</form>