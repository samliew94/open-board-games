<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import "../app.css";

    export let data;

    const auth = writable();
    $: auth.set({
        user: data.user,
        token: data.token,
    });
    setContext("auth", auth);
</script>

<div class="flex justify-center items-center h-screen">
    <div class="h-full flex flex-col justify-center items-center py-2 gap-4">
        <slot />
    </div>
</div>
