<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");

    function handleClick(index: number, isMajority: boolean) {
        getSocket()?.emit(isMajority ? "majority" : "cow", { index });
    }
    function handleNext() {
        getSocket()?.emit("award");
    }
</script>

<div class="flex flex-col gap-4">
    <h3 class="">{$gameData?.topic}</h3>
    <p class="text-xs">Select Majority & Cow</p>
    <div class="grid grid-cols-2 gap-4 p-4 border">
        {#each $gameData?.players as { username, answer, majority, cow }, j}
            <div class="grid border p-2 gap-2">
                <div class="grid gap-2">
                    <p class="text-xs uppercase">{username}</p>
                    <p class="uppercase break-all">{answer}</p>
                </div>
                <div class="flex justify-center items-center gap-4">
                    {#each Array.from({ length: 2 }).map((_, i) => i) as i}
                        <button
                            on:click={() => handleClick(j, !i)}
                            class="p-0.5 text-2xl border-2 border-gray-500 text-gray-500 rounded-md {(!i &&
                                majority) ||
                            (i && cow)
                                ? 'bg-pink-500 opacity-100 border-white text-white '
                                : ''}"
                        >
                            <Icon
                                icon={!i
                                    ? "pepicons-pop:raise-hand"
                                    : "ph:cow-fill"}
                            />
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    {#if $gameData?.isHost}
        <div class="flex justify-center">
            <button class="btn" on:click={handleNext}>next</button>
        </div>
    {/if}
</div>
