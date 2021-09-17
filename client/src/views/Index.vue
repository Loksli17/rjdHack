<template>
    <div>
        <fieldset>
            <legend>кнопки</legend>
            <button @click="showPopup = true">фильтры</button>
            <router-link to="/view-all"></router-link>
        </fieldset>

        <Table 
            :actions="tableActions"
            :columnNames="columnNames" 
            :rowData="records"
        />

        <teleport to="body">
            <PopupWrapper v-if="showPopup" @popup-background-clicked="showPopup = false">
                <!-- Temporary -->
                <!-- thus, it is permanent -->
                <div style="background: white">
                    <h1>Окно</h1>
                    <div>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio ad illo ullam, 
                        illum quisquam aspernatur omnis nobis impedit odit soluta ipsam exercitationem 
                        quo laudantium inventore adipisci. Fuga vel quos ex!
                    </div>
                </div>
            </PopupWrapper>
        </teleport>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Table               from "@/components/table/Table.vue";
    import { Action, Column }  from "@/components/table/types";
    import AudioService        from "../services/AudioService";
    import PopupWrapper        from "@/components/popup/PopupWrapper.vue";


    export default defineComponent({

        name: "index",
        
        components: {
            Table,
            PopupWrapper
        },
        
        data() {
            return {
                columnNames: [
                    { fieldName: "id",      displayedName: "ID" },
                    { fieldName: "field_1", displayedName: "hah" },
                    { fieldName: "field_2", displayedName: "huh" },
                    { fieldName: "actions", displayedName: "Действия" }
                ] as Array<Column>,

                tableActions: [
                    { name: "Просмотр", path: (id: number) => `/record/${id}/view` },
                    { name: "Удалить", handler: this.removeRecord }
                ] as Array<Action>,
               
                showPopup: false as boolean,

                skip   : 0 as number,
                take   : 8 as number,
                records: [] as Array<Record<string, any>>,
            }
        },

        mounted: async function(){
            this.records = await AudioService.getAll(this.take, this.skip);
            console.log(this.records);
        },

        methods: {
            async removeRecord(id: number): Promise<void> {
                console.log(id);
            }
        }
    })
</script>
