<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");

    function handleToLobby() {
        getSocket()?.emit("to-lobby");
    }
</script>

{#if $gameData?.isHost && $gameData?.screen}
    <div class="static">
        <div class="absolute top-0 right-0 m-4 flex flex-col gap-1">
            <button class="text-xs" on:click={handleToLobby}>
                <Icon
                    icon="tabler:door-exit"
                    class="rounded-full border-2 border-pink-500 border-dashed p-1 text-4xl hover:text-white hover:border-white active:bg-pink-500"
                />
            </button>
        </div>
    </div>
{/if}
