<template>
    <a href="" @click.prevent="emitTIme">{{ timeInMinutes }}</a>
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
            timeInMinutes(): string {
                // let time = "";
                // if (this.time >= 60) {
                //     time += this.time / 60;
                // }

                // return time;
                return this.time;
            }
        },
        methods: {
            emitTIme(): void {
                this.$emit("get-time", moment.duration(`00:${this.time}`).asSeconds());
            }
        }
    })
</script>