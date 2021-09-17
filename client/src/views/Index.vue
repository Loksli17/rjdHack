<template>
    <fieldset>
        <legend>кнопки</legend>
        <button>фильтры</button>
        <router-link to="/view-all"></router-link>
    </fieldset>
    <Table 
        :actions="tableActions"
        :columnNames="columnNames" 
        :rowData="records"
    />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Table from "@/components/table/Table.vue";
    import { Action, Column } from "@/components/table/types";

    export default defineComponent({
        name: "Index",
        components: {
            Table
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
                    { name: "Просмотр", path: (id: number) => `record/${id}/view` },
                    { name: "Удалить", handler: this.removeRecord }
                ] as Array<Action>
            }
        },
        computed: {
            records(): Array<Record<string, any>> {
                return [
                    { id: 0, field_1: "jaj", field_2: "joj" },
                    { id: 1, field_1: "jaj", field_2: "joj" },
                    { id: 2, field_1: "jaj", field_2: "joj" },
                    { id: 3, field_1: "jaj", field_2: "joj" },
                ]
            }
        },
        methods: {
            async removeRecord(id: number): Promise<void> {
                console.log(id);
            }
        }
    })
</script>
