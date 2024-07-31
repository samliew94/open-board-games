<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");

    function handleKick(i: number): any {
        getSocket().emit("kick", i);
    }

    function handleStart() {
        getSocket().emit("start");
    }
</script>

<div class="flex flex-col justify-center h-full items-center gap-4">
    <h2 class="text-center">settings</h2>
    <div
        class="grid grid-cols-5 uppercase items-center overflow-y-auto border p-4"
    >
        {#if $gameData?.usernames}
            {#each $gameData.usernames as username, i}
                <p>{i + 1}</p>
                <p class="col-span-3">{username}</p>
                <div class="">
                    {#if $gameData?.isHost}
                        {#if i > 0}
                            <button
                                class="btn-kick"
                                on:click={() => handleKick(i)}
                            >
                                x
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
        <button on:click={handleStart}>start</button>
    {/if}
</div>
