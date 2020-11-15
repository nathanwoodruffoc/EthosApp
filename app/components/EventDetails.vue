<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="Event Details"></Label>
    </ActionBar>
    <StackLayout>

    </StackLayout>
</Page>
</template>

<script>
export default {
props: {
    event: {}
},
mounted() {
    console.log("Viewing event details for: ", this.event);
}
}
</script>