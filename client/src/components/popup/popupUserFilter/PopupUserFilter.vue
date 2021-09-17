<template>
    <div class="popup-user-filter-wrapper">
        <h1>Поиск пользователей</h1>
        <div class="popup-user-filter-search">
            <input type="search" v-model="searchData">
            <button>Искать</button>
        </div>
        <div>
            <ul>

            </ul>
        </div>
        <div>
            <ul>

            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "popup-user-filter",
        data() {
            return {
                searchData: "" as string,
                selectedWorkersList: []
            }
        },
        mounted() {
            this.getFilteredWorkerList();
        },
        methods: {
            async getFilteredWorkerList(): Promise<void> {
                let workers = [];
                try {
                    const res = await axios.post("worker/search", { searchData: this.searchData });
                    const data = res.data;
                    workers = data.workers;
                } catch(err) {
                    console.error(err);
                }

                return workers;
            }
        }
    })
</script>

<style lang="scss" scoped>
    .popup-user-filter-wrapper {
        background-color: white;
        padding: 20px;
        width: 80%;
        height: 50%;
        border-radius: 10px;
    }
</style>