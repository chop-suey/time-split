<script lang="ts">

let hidden = false;

function toggle(ignored: Event): void {
    hidden = !hidden;
}

</script>

<style>
    button {
        margin-top: 50px;
    }

    div {
        background-color: blueviolet;
        height: 300px;
    }

    .hidden {
        display: none;
    }
</style>

<button on:click={ toggle }>toggle</button>
<div class:hidden={hidden}>
    bla bl abla
</div>