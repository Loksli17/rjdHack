<template>
    <div>
        This is record with id: {{ recordID }}
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: "view-record",
        computed: {
            recordID(): string {
                return this.$route.params.id as string;
            }
        }
    })
</script>