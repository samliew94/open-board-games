<script lang="ts">
    import { getContext } from "svelte";

    let dialog: any;

    let disconnected: any = getContext("disconnected");

    export let onRetry = () => {};

    $: if ($disconnected) {
        dialog?.showModal();
    } else {
        dialog?.close();
    }
</script>

<dialog bind:this={dialog} class="outline-none">
    <div class="flex flex-col justify-center p-4 text-center gap-4">
        <p class="text-pink-500 text-xl">Disconnected</p>
        <div class="flex justify-center">
            <button class="btn uppercase" on:click={onRetry}>retry</button>
        </div>
    </div>
</dialog>
