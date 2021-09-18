<template>
    <div class="popup-container">
        <div class="popup-background" @click="clickedOnBackground"></div>
        <div class="popup-body">
            <slot>

            </slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    
    export default defineComponent({
        name: "popup-window",
        emits: ["popup-background-clicked"],
        mounted() {
            document.body.style.overflow = "hidden";
        },
        methods: {
            clickedOnBackground() {
                document.body.style.overflow = "initial";
                this.$emit("popup-background-clicked");
            }
        }
    });
</script>

<style lang="scss" scoped>
    
    @import '../../assets/scss/utils.scss';

    .popup-container {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .popup-body {
            position: fixed;
            align-self: center;
            width: 80%;
        }

        .popup-background {
            width: 100%;
            height: 100%;
            background-color: #000000e1;
        }
    }

</style>