<script lang="ts">
    import Disconnected from "$lib/components/disconnected.svelte";
    import Menu from "$lib/components/menu.svelte";
    import MyError from "$lib/components/my_error.svelte";
    import Judging from "$lib/game/judging.svelte";
    import Lobby from "$lib/game/lobby.svelte";
    import Question from "$lib/game/question.svelte";
    import {
        getSocket,
        initSocketServer,
        socketConnect,
    } from "$lib/socket/socket.client";
    import { getContext, onMount, setContext } from "svelte";
    import { writable } from "svelte/store";

    const auth: any = getContext("auth");

    let gameData = writable<any>();
    setContext("gameData", gameData);

    let disconnected = writable(false);
    setContext("disconnected", disconnected);

    onMount(() => {
        initSocketServer($auth);
        getSocket()?.on("game", (data) => {
            console.log("game", data);
            $gameData = data;
        });

        getSocket()?.on("connect", () => {
            console.log(`connected`);
        });

        getSocket()?.on("disconnect", (reason: any) => {
            console.log("client disconnected reason:", reason);
            $disconnected = true;
        });
        getSocket()?.on("error", (error: any) => {
            console.log(error);
            $gameData.error = error;
        });

        socketConnect();

        // // mock data for dev conveniences
        // gameData.set({
        //     screen: 0,
        //     isHost: true,
        //     players: Array.from({ length: 20 }).map((_, i) => {
        //         return {
        //             username: "FOOBARBAZ0",
        //         };
        //     }),
        // });
        // gameData.set({
        //     screen: 1,
        //     isHost: true,
        //     topic: "vegetable",
        //     players: Array.from({ length: 2 }).map((_, i) => ({
        //         username: `FFFFFFFFFF`,
        //         answered: Math.random() < 0.5 ? true : false,
        //         points: Math.floor(Math.random() * (8 - 0 + 1)) + 0,
        //         cow: true,
        //     })),
        // });
        // gameData.set({
        //     screen: 2,
        //     isHost: true,
        //     topic: "vegetable",
        //     players: Array.from({ length: 10 }).map((_, i) => ({
        //         username: `PLAYER ${i + 1}`,
        //         answer: "hang yu pin yin",
        //         majority: Math.random() < 0.5,
        //         cow: true,
        //     })),
        // });
    });
</script>

<Disconnected
    onRetry={() => {
        $disconnected = false;
        socketConnect();
    }}
/>
<MyError
    error={$gameData?.error}
    onCloseCallback={() => {
        $gameData.error = "";
    }}
/>
<!-- <Logout />
<ToLobby /> -->
<Menu />

{#if $gameData?.screen === 0}
    <Lobby />
{:else if $gameData?.screen === 1}
    <Question />
{:else if $gameData?.screen === 2}
    <Judging />
{/if}
