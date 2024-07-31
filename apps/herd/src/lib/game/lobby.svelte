<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");

    function handleKick(index: number): any {
        getSocket().emit("kick", { index });
    }

    function handleStart() {
        getSocket().emit("start");
    }
</script>

<div class="flex flex-col gap-4">
    <h2 class="text-center">lobby</h2>
    <div class="grid grid-cols-[auto_auto_auto] border p-4 gap-4">
        {#if $gameData?.players}
            {#each $gameData.players as { username }, i}
                <p>{i + 1}.</p>
                <p class="">{username}</p>
                <div class="">
                    {#if $gameData?.isHost}
                        {#if i > 0}
                            <button
                                class="rounded-full p-1 border border-dashed text-pink-500 hover:text-white hover:bg-pink-700"
                                on:click={() => handleKick(i)}
                            >
                                <Icon icon="game-icons:high-kick" />
                            </button>
                        {:else}
                            <div></div>
                        {/if}
                    {:else}
                        <div></div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    {#if $gameData?.isHost}
        <div class="flex justify-center">
            <button class="btn" on:click={handleStart}>start</button>
        </div>
    {/if}
</div>
