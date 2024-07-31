<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");
    let answer = "";

    function handleSubmit() {
        getSocket()?.emit("answer", { answer });
    }
</script>

<div class="flex flex-col gap-4">
    <h3 class="">{$gameData?.topic}</h3>
    <div class="grid grid-cols-2 border p-4 gap-4">
        {#each $gameData?.players as { username, answered, points, cow }}
            <div
                class="grid border gap-2 p-4 border-dashed {answered
                    ? 'bg-pink-500 text-white'
                    : ''}"
            >
                <p class="text-xs">{username}</p>
                <div class="flex items-center space-x-2">
                    <p class="text-xs text-center">PTS:{points}</p>
                    {#if cow}
                        <Icon
                            icon={"ph:cow-fill"}
                            class="p-0.5 text-2xl border-2 rounded-md border-pink-500 text-pink-500 {answered
                                ? 'border-white text-white'
                                : ''}"
                        />
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <input bind:value={answer} />
    <div class="flex justify-center">
        <button class="btn" on:click={handleSubmit}>submit</button>
    </div>
</div>
