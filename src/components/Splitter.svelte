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

<style>
    #container {
        display: flex;
        justify-content: center;
        margin: 0.5em;
    }

    form {
        display: inline-flex;
        flex-direction: row;
        width: 480px;
    }

    form > * {
        margin: 0.3em;
    }

    input {
        flex: 1;
    }

    button {
        flex: 0;
    }

</style>

<div id="container">
    <form on:submit="{onSubmit}">
        <input id="tag" type="text" bind:value={tag}>
        <button type="submit">
            <img src="assets/add.svg" alt="Add Split">
        </button>
    </form>
</div>
