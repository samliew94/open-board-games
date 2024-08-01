<script lang="ts">
    import { getContext } from "svelte";
    import Menu from "./menu.svelte";

    const auth: any = getContext("auth");
</script>

{#if $auth}
    <!-- <div class="static">
        <div class="absolute top-0 left-0 pl-2 pt-2 flex flex-col gap-1">
            <button class="">
                <Icon icon="mdi:exit-run" width="24" />
            </button>
        </div>
    </div> -->
    <Menu />
{/if}
