<template>
    <a href="" @click.prevent="emitTIme">{{ time }}</a>
</template>

<script lang="ts">
    import moment from 'moment';
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: "time-code",
        emits: ["get-time"],
        props: {
            time: {
                type: String,
                required: true
            }
        },
        computed: {
            timeInSeconds(): number {
                return moment.duration(`00:${this.time}`).asSeconds();
            }
        },
        methods: {
            emitTIme(): void {
                this.$emit("get-time", this.timeInSeconds);
            }
        }
    })
</script>