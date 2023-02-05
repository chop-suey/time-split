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

<div class="main">
    <form class="box" on:submit="{onSubmit}">
        <input class="border expand sh item" id="tag" type="text" bind:value={tag}>
        <button class="sh sw border" type="submit">
            <img src="assets/add.svg" alt="Add Split">
        </button>
    </form>
</div>
