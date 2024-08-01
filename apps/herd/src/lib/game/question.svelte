<script lang="ts">
    import { getSocket } from "$lib/socket/socket.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const gameData: any = getContext("gameData");
    let answer = "";

    $: if (answer) {
        answer = answer.replace(/[^a-zA-Z ]/g, "");
    }

    function handleSubmit() {
        getSocket()?.emit("answer", { answer });
    }
</script>

<h3>{$gameData?.topic}</h3>
<div
    class="grid grid-cols-[auto_auto] gap-4 h-full overflow-y-auto p-4 border border-dashed border-2"
>
    {#each $gameData?.players as { username, answered, points, cow }}
        <div
            class="p-4 border border-dashed h-min {answered
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
<button class="btn" on:click={handleSubmit}>submit</button>
