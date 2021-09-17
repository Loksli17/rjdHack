<template>
    <div class="page-wrap">

        <div class="row">
            <button @click="showPopup = true">фильтры</button>
        </div>

        <div class="row">
            <Table 
                :actions="tableActions"
                :columnNames="columnNames" 
                :rowData="records"
            />
        </div>

        <div class="row">
            <Pagination
                ref="pagination"
                :take=take
                :currentPage=currentPage
                :pageGap="7"
                :endButton="true"
                :startButton="true"
                v-on:page-change="pageChangeEvt"
            />  
        </div>

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
    import Pagination          from '../components/Pagination.vue';


    export default defineComponent({

        name: "index",
        
        components: {
            Table,
            PopupWrapper,
            Pagination,
        },
        
        data() {
            return {
                columnNames: [
                    { fieldName: "id",        displayedName: "ID" },
                    { fieldName: "fileAudio", displayedName: "Имя файла" },
                    { fieldName: "isChecked", displayedName: "Файл обработан" },
                    { displayedName: 'Действия' },
                ] as Array<Column>,

                tableActions: [
                    { name: "Просмотр", path: (id: number) => `/record/${id}/view` },
                    { name: "Удалить", handler: this.removeRecord }
                ] as Array<Action>,
               
                showPopup: false as boolean,

                skip   : 0 as number,
                take   : 12 as number,
                records: [] as Array<Record<string, any>>,

                currentPage  : 1 as number,
                amountRecords: 0 as number, 
            }
        },

        mounted: async function(){
            this.records       = await AudioService.getAll(this.take, this.skip);
            this.amountRecords = await AudioService.illegalCount();

            const pagination = this.$refs.pagination! as any;
            pagination.setAmountElements(this.amountRecords);
        },

        methods: {
            async removeRecord(id: number): Promise<void> {
                console.log(id);
            },

            pageChangeEvt: async function(data: {take: number; skip: number}){

                this.records = await AudioService.getAll(data.take, data.skip);
            },
        }
    })
</script>


<style lang="scss">
    @import '../assets/scss/utils.scss';

    .row:first-child{
        padding: 0px 50px;
    }

    .row:not(.row:first-child){
        @include page-row;
    }
</style>