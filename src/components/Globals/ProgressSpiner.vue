<template>
    <div>
        <img class="spinner" src="/images/spiner.gif" /> <slot>Wait for server response...</slot>
    </div>
</template>
<script>
export default {
    name: "progress-spiner"
}
</script>
<style scoped>
    .spinner{
        width: 40px;
        margin-left: 2%;
        padding: 0;
    }
</style>