<script lang="ts">
import { getTimeSplitStore } from "../service/service-manager";

let tag = $state("");

const timeSplitStore = getTimeSplitStore();

function onSubmit(event: Event): void {
	event.preventDefault();
    timeSplitStore.newSplit(tag);
	tag = '';
}
</script>

<div class="main">
    <form class="box" onsubmit="{onSubmit}">
        <input class="border expand sh item" id="tag" type="text" bind:value={tag}>
        <button class="sh sw border" type="submit">
            <img src="assets/add.svg" alt="Add Split">
        </button>
    </form>
</div>
