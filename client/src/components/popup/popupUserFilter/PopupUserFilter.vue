<template>
    <div class="popup-user-filter-wrapper">
        <h1>Фильтрация участников</h1>
        
        <div class="popup-user-filter-search">
            <input @change="getFilteredWorkerList" type="search" v-model="searchData">
        </div>

        <div class="popup-user-filter-data">
            <div>
                <ul>
                    <li 
                        v-for="worker in filteredWorkerList" 
                        :key="worker.id"
                        @click="addWorkerToSelected(worker.id)"
                    > 
                        {{ worker.firstName }} {{ worker.lastName }} 
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li
                        v-for="worker in selectedWorkersList" 
                        :key="worker.id"
                    >
                        {{ worker.firstName }} {{ worker.lastName }} 
                    </li>
                </ul>
            </div>
        </div>
        <button @click="resultSubmit">Применить или чо там</button>
    </div>
</template>

<script lang="ts">
    import axios from 'axios';
    import { defineComponent } from 'vue';

    interface Worker {
        id: number;
        firstName: string;
        lastName: string;
        email: string; 
        phone: string;
    }

    export default defineComponent({
        name: "popup-user-filter",
        // emits: ["workers-selected"],
        
        data() {
            return {
                searchData         : "" as string,
                selectedWorkersList: new Set<Worker>(),
                filteredWorkerList : [] as Array<Worker>
            }
        },

        mounted() {
            // this.getFilteredWorkerList();
        },

        methods: {
            async getFilteredWorkerList(): Promise<void> {
                try {
                    const res = await axios.post("worker/search", { searchData: this.searchData });
                    const data = res.data;
                    this.filteredWorkerList = data.workers;
                } catch(err) {
                    console.error(err);
                }
            },
            addWorkerToSelected(id: number): void {
                const worker = this.filteredWorkerList.find(worker => worker.id === id);

                if (worker) {
                    this.selectedWorkersList.add(worker);
                }
            },
            resultSubmit(): void {
                // this.$emit("workers-selected", Array.from(this.selectedWorkersList));
                // ! this.selectedWorkersList это Set
                
                const selectedWorkers = Array.from(this.selectedWorkersList);
                this.$flashMessage.show({
                    type: "success",
                    title: "Здраствуйте",
                    text: "Я, Кирилл. Хотел бы чтобы вы сделали игру, 3Д-экшон суть такова... И если пользователь играет эльфами то эльфы в лесу, домики деревяные набигают солдаты дворца и злодеи. Можно грабить корованы..."
                });
            }
        }
    })
</script>

<style lang="scss" scoped>

    @import '../../../assets/scss/utils.scss'; 

    .popup-user-filter-wrapper {
        background-color: white;
        padding: 20px;
        height: 100%;
        border-radius: 10px;

        button{
            @include button;
        }

        .popup-user-filter-data {
            display: flex;
            flex-flow: row;
            width: 100%;

            ul {
                list-style: none;
                padding: 0;
    
                li {
                    padding: 10px;
                    user-select: none;
    
                    &:hover {
                        background-color: #ccc;
                        cursor: pointer;
                    }
                }
            }
        }

    }
</style>