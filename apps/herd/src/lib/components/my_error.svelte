<script lang="ts">
    let dialog: any;
    export let error = "";
    export let onCloseCallback = () => {};

    $: if (error) {
        dialog?.showModal();
    } else {
        dialog?.close();
    }
</script>

<dialog bind:this={dialog} class="outline-none">
    <div class="flex flex-col justify-center p-4 text-center gap-4">
        <p class="text-pink-500 text-xl">{error}!</p>
        <div class="flex justify-center">
            <button class="btn uppercase" on:click={onCloseCallback}
                >close</button
            >
        </div>
    </div>
</dialog>
