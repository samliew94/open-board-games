<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const user: any = getContext("user");
</script>

{#if user}
    <div class="static">
        <div class="absolute top-0 left-0 pl-2 pt-2 flex flex-col gap-1">
            <button class="">
                <Icon icon="mdi:" />
            </button>
        </div>
    </div>
{/if}
