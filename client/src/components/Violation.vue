<template>
    <div>
        <AudioTImeCode :time="violation.timem" />
        <span>{{ violation.text }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import AudioTImeCode       from "./AudioComponents/AudioTimeCode.vue";

    export default defineComponent({
        name: "violation",
        components: {
            AudioTImeCode
        },
        props: {
            violation: {
                type: Object as PropType<Record<string, any>>,
                required: true
            }
        }
    })
</script>