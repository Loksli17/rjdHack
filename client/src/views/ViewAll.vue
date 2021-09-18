<template>
    <div class="page-wrap view-all">

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

    </div>
</template>


<script lang="ts">

    import { defineComponent } from 'vue';
    import Table               from "@/components/table/Table.vue";
    import { Action, Column }  from "@/components/table/types";
    import Pagination          from '../components/Pagination.vue';
    import AudioService        from "../services/AudioService";
    import { AxiosResponse }   from 'axios';
    import PopupWrapper        from "@/components/popup/PopupWrapper.vue";
    import PopupUserFilter     from "@/components/popup/popupUserFilter/PopupUserFilter.vue";


    export default defineComponent({
        
        name: "view-all",

        components: {
            Table,
            PopupWrapper,
            Pagination,
            PopupUserFilter
        },

        data() {
            return {
                columnNames: [
                    { fieldName: "id",               displayedName: "ID" },
                    { fieldName: "fileAudio",        displayedName: "Имя файла" },
                    { fieldName: "date",             displayedName: "Дата загрузки" },
                    { fieldName: "isIllegalContent", displayedName: "Статус нарушения" },
                    { fieldName: "isChecked",        displayedName: "Статус обработки" },
                    { displayedName: 'Действия' },
                ] as Array<Column>,

                tableActions: [
                    { path: (id: number) => `/record/${id}/view`, imgPath: require("./../assets/table-icons/view.svg") },
                    { handler: this.removeRecord,                 imgPath: require("./../assets/table-icons/delete.svg") }
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
            this.amountRecords = await AudioService.count();

            const pagination = this.$refs.pagination! as any;
            pagination.setAmountElements(this.amountRecords);
        },

        methods: {
            async removeRecord(id: number): Promise<void> {

                let res: AxiosResponse = await AudioService.removeOne(id);

                const pagination = this.$refs.pagination! as any;
                this.amountRecords = this.amountRecords - 1;
                pagination.setAmountElements(this.amountRecords);
                this.records = await AudioService.getAll(pagination.take, pagination.skip);

                this.$flashMessage.show({
                    type : "success",
                    title: "Удаление файла",
                    text : res.data.msg,
                })
                
            },

            pageChangeEvt: async function(data: {take: number; skip: number}){
                this.records = await AudioService.getAll(data.take, data.skip);
            },
        }
    });

</script>

<style lang="scss">

    @import '../assets/scss/utils.scss';
    $row-padding: 25px;

    .view-all{

        .row:first-child{
            padding: 0px 50px;
            padding-top: 5px;
        }

        .row:not(.row:first-child){
            @include page-row;
        }



        table {
            border: none;
            border-collapse: separate;
            border-spacing: 0;

            td {
                border: none;
            }
                
            tbody {
                tr{
                    td {
                        padding: 15px 15px;
                        text-align: left;

                        &:first-of-type {
                            padding-left: $row-padding;
                        }

                        &:last-of-type {
                            padding-right: $row-padding;
                        }
                    }

                    &:nth-child(odd){
                        background: #F6F6F6;
                    }
                    &:nth-child(even){
                        background: #E9E9E9;
                    }
                    .table-row-action-cell {
                        display: grid;
                        grid-template-columns: repeat(2, max-content);
                        gap: 15px;
                    }
                }
            }

            .table-header {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                background-color: #9E9E9E;

                th {
                    padding-top: 25px;
                    background-color: #9E9E9E;
                    color: #FFF;
                    font-weight: 600;
                    border: none;
                    text-align: left;
                }


                .table-header-column-names:first-of-type {
                    border-top-left-radius: 20px;
                    padding-left: $row-padding;
                }

                .table-header-column-names:last-of-type {
                    border-top-right-radius: 20px;
                    padding-right: $row-padding;
                }
            }
        }
    }

</style>