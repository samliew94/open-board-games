<script lang="ts">
    import { goto } from "$app/navigation";
    import { logout } from "$lib/client_api/logout.client";
    import { getSocket } from "$lib/socket/socket.client";
    import { clickOutside } from "$lib/utils/click-outside.client";
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    const gameData: Writable<any> = getContext("gameData");

    let showItems = false;

    function handleClickOutside() {
        showItems = false;
    }

    async function handleBackToLobby() {
        getSocket()?.emit("to-lobby");
    }

    async function handleLogout() {
        logout(() => goto("/login"));
    }
</script>

<div class="static" use:clickOutside={handleClickOutside}>
    <div class="absolute top-0 right-0 inline-block text-left p-4">
        <button
            on:click={() => {
                showItems = !showItems;
            }}
            type="button"
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-lg font-semibold text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
            <Icon icon="mdi:hamburger-menu" class="text-pink-500" />
        </button>

        {#if showItems}
            <div
                class="absolute right-4 mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 outline-none"
            >
                {#if $gameData?.isHost}
                    <div
                        class="py-1 hover:text-white hover:bg-pink-600 hover:rounded-md active:bg-pink-700"
                        role="none"
                    >
                        <button
                            on:click={handleBackToLobby}
                            class="flex items-center space-x-2 px-4 py-2 text-sm px-4 py-2"
                        >
                            <Icon
                                icon="game-icons:round-table"
                                class="text-2xl"
                            />
                            <p>Lobby</p>
                        </button>
                    </div>
                {/if}
                <div
                    class="py-1 hover:text-white hover:bg-pink-600 hover:rounded-md active:bg-pink-700"
                    role="none"
                >
                    <button
                        on:click={handleLogout}
                        class="flex items-center space-x-2 px-4 py-2 text-sm px-4 py-2"
                    >
                        <Icon icon="mdi:exit-run" class="text-2xl" />
                        <p>Logout</p>
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
