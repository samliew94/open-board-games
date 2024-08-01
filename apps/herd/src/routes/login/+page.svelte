<script lang="ts">
    import Loading from "$lib/loading/loading.svelte";
    import { superForm } from "sveltekit-superforms";

    export let data: any;

    // Client API:
    const { form, errors, message, enhance, delayed } = superForm(data.form, {
        resetForm: false,
    });

    $: if ($form.username) {
        // only allow alphabets
        $form.username = $form.username.replace(/[^a-zA-Z]/g, "");
    }
    $: if ($form.room) {
        // only allow alphabets
        $form.room = $form.room.replace(/[^a-zA-Z0-9]/g, "");
    }
</script>

<div class="space-y-4 px-4">
    <div class="flex justify-center">
        <img
            src="https://www.bookxcess.com/cdn/shop/files/51jRz0kObkL._AC_SL1080.jpg?v=1702363628"
            alt="cover"
            class="rounded-md sm:max-w-[50%] text-center"
        />
    </div>

    {#if $message?.error}
        <p class="text-error text-center">{$message.error}</p>
    {/if}

    <form method="POST" class="grid gap-4" use:enhance>
        <h1 class="text-center">login</h1>
        <label for="username">
            {#if $errors?.username}
                <p class="text-error">{$errors.username[0]}</p>
            {/if}
            <p>Username:</p>
            <input
                type="text"
                name="username"
                class="uppercase"
                maxlength="8"
                bind:value={$form.username}
            />
        </label>

        <label for="room">
            {#if $errors?.room}
                <p class="text-error">{$errors.room[0]}</p>
            {/if}
            <p>Room:</p>
            <input
                type="text"
                name="room"
                class="uppercase"
                maxlength="6"
                bind:value={$form.room}
            />
        </label>

        <div class="text-center">
            <button class="btn" disabled={$delayed}>Submit</button>
        </div>
        {#if $delayed}
            <Loading />
        {/if}
    </form>
</div>
