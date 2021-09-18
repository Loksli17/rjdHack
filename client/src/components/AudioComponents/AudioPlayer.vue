<template>
    <audio ref="player" :src="src" controls></audio>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: "audio-player",
        emits: ["update:current-time"],
        props: {
            src: {
                type: String,
                required: true
            },
            currentTime: {
                type: Number,
                required: true
            }
        },
        mounted() {
            const player = this.$refs.player as HTMLAudioElement;
            player.addEventListener("seeked", () => {
                this.$emit("update:current-time", player.currentTime);
            })
        },
        watch: {
            currentTime: function() {
                this.setTime();
            }
        },  
        methods: {
            setTime() {
                // this.currentTime = time;
                const 
                    player = this.$refs.player as HTMLAudioElement,
                    duration = player.duration;

                if(this.currentTime <= duration) {
                    player.currentTime = this.currentTime;
                } else {
                    player.currentTime = duration;
                }
            }
        }
    })
</script>