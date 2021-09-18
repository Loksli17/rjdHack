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
    @import '../assets/scss/pagination.scss';
    @import '../assets/scss/table.scss';

    .view-all{

        .row:first-child{
            padding: 0px 50px;
            padding-top: 5px;
        }

        .row:not(.row:first-child){
            @include page-row;
        }
    }

</style>