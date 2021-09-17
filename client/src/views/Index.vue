<template>
    <div class="page-wrap">

        <div class="row row-hello">
            <div class="col-1">
                <span>
                    Добро пожаловать, Алекcандр Холодилов
                </span>
                <h2>
                    Необработанных файлов: {{amountRecords}}
                </h2>
            </div>

            <div class="col">

            </div>
        </div>

        <div class="row ">
            <h1>Все переговоры</h1>
            <button @click="showPopup = true">Фильтры</button>
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
                <PopupUserFilter />
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
    import PopupUserFilter     from "@/components/popup/popupUserFilter/PopupUserFilter.vue";
    import Pagination          from '../components/Pagination.vue';
    import { AxiosResponse }   from 'axios';


    export default defineComponent({

        name: "index",
        
        components: {
            Table,
            PopupWrapper,
            Pagination,
            PopupUserFilter
        },
        
        data() {
            return {
                columnNames: [
                    { fieldName: "id",        displayedName: "ID" },
                    { fieldName: "fileAudio", displayedName: "Имя файла" },
                    { fieldName: "isChecked", displayedName: "Статус обработки" },
                    { fieldName: "date",      displayedName: "Дата загрузки" },
                    { displayedName: 'Действия' },
                ] as Array<Column>,

                tableActions: [
                    { name: "Просмотр", path: (id: number) => `/record/${id}/view` },
                    { name: "Удалить", handler: this.removeRecord }
                ] as Array<Action>,
               
                showPopup: false as boolean,

                skip   : 0 as number,
                take   : 9 as number,
                records: [] as Array<Record<string, any>>,

                currentPage  : 1 as number,
                amountRecords: 0 as number, 
            }
        },

        mounted: async function(){
            this.records       = await AudioService.getAllIllegal(this.take, this.skip);
            this.amountRecords = await AudioService.illegalCount();

            const pagination = this.$refs.pagination! as any;
            pagination.setAmountElements(this.amountRecords);
        },

        methods: {
            async removeRecord(id: number): Promise<void> {
                let res: AxiosResponse = await AudioService.removeOne(id);

                const pagination = this.$refs.pagination! as any;
                pagination.setAmountElements(this.amountRecords--);
                this.records = await AudioService.getAllIllegal(pagination.take, pagination.skip);
                
            },

            pageChangeEvt: async function(data: {take: number; skip: number}){
                this.records = await AudioService.getAllIllegal(data.take, data.skip);
            },
        }
    })
</script>


<style lang="scss">
    @import '../assets/scss/utils.scss';

    .row:first-child{
        padding: 0px 50px;
    }

    .row:nth-child(2){
        display: grid;
        grid-template-columns: auto max-content;

        h1{
            text-align: left;
        }

        button{
            @include button;
            width: 180px;
            font-size: 23px;
        }
    }

    .row-hello{
        margin: 0px 50px;
        height: 180px;
        background: $color;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 1fr;

        .col-1{
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: flex-start;

            span{
                text-align: left;
                font-size: 20px;
            }

            h2{
                margin-top: 10px;
                text-align: left;
            }
        }
    }

    .row:not(.row:first-child){
        @include page-row;
    }
</style>