<script lang="ts">
import { timeSplitService } from "../service/time-split-service";
    let value = '';

    function onSubmit(event: Event): void {
		event.preventDefault();
        timeSplitService.newSplit(value);
		value = '';
	}
</script>

<form on:submit="{onSubmit}">
    <input id="tag" type="text" bind:value>
    <button type="submit">
        Add
    </button>
</form>