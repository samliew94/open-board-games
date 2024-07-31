<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    let dialog: any;

    onMount(() => dialog?.showModal());
</script>

<dialog bind:this={dialog} class="def-backdrop">
    <div class="flex justify-center">
        <Icon
            icon="mdi:loading"
            class="animate-spin-fast text-pink-500"
            width="128"
        ></Icon>
    </div>
</dialog>
