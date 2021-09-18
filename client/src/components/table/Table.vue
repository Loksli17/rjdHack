<template>
    <table>
        <TableHeader 
            :columnNames="cols" 
            @selected-column="setSelectedColumn"
            :columnId="columnId"
            :sortOrder="sortOrder"
            :table-is-sortable="config.sortableByColumn"
            :has-actions="!!actions" 
            :columnsToHide="columnsToBeHidden"
            v-once
        />
        <tbody>
            <TableRow 
                v-for="row in rows" 
                :key="row.id" 
                :row="row" 
                :actions="actions"
                :columnsToHide="columnNamesToBeHidden"
            />
        </tbody>
        <tfoot>
            <slot name="footer"></slot>
        </tfoot>
    </table>
</template>

<script lang="ts">
    import { defineComponent, PropType }                          from 'vue';
    import TableHeader                                            from './TableHeader.vue';
    import TableRow                                               from "./TableRow.vue";
    import { Column, columnType, Action, TableConfig, SortOrder } from "./types";

    export default defineComponent({
        name: "Table",
        components: {
            TableHeader,
            TableRow
        },
        props: {
            columnNames: {
                type: Object as PropType<Array<Column>>,
                required: true
            },
            rowData: {
                type: Object as PropType<Array<Record<string, columnType>>>,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            },
            config: {
                type: Object as PropType<TableConfig>,
                default: () => ({
                    hideColumn:       undefined,
                    sortableByColumn: false,
                    // comparator:       undefined
                })
            }
        },
        data() {
            return {
                columnId: 0 as number,
                sortOrder: SortOrder.ASCENDING as SortOrder,
            }
        },
        computed: {
            reorderedRows(): Array<Record<string, columnType>> {
                let arr: Array<Record<string, columnType>> = [];

                for (const row of this.rowData) {
                    const newRow = {} as typeof row;
                    for (const col of this.cols) {
                        const fieldName: keyof typeof row = col.fieldName;
                        if (!(fieldName in row)) continue;

                        if (col.columnHandler) {
                            newRow[fieldName] = col.columnHandler(row[fieldName]);
                        } else {
                            newRow[fieldName] = row[fieldName];
                        }

                    }

                    arr.push(newRow);
                }

                return arr;
            },
            rows(): Array<Record<string, columnType>> {
                let arr: Array<Record<string, columnType>> = [];

                if (this.config.sortableByColumn) {
                    const comparator = /*this.config.comparator ?? */((row1: Record<string, columnType>, row2: Record<string, columnType>): number => {
                        const
                            columnName = Object.keys(this.reorderedRows[0])[this.columnId],
                            val1       = row1[columnName].toString().toLowerCase(),
                            val2       = row2[columnName].toString().toLowerCase();

                        let res = 0;
                        if (val1 < val2) {
                            res = -1;
                        } 
                        if (val1 > val2) {
                            res = 1;
                        }

                        return res * this.sortOrder;
                    });

                    arr = this.reorderedRows.slice().sort(comparator);
                } else {
                    arr = this.reorderedRows;
                }
                
                return arr;
            },
            cols(): Array<Column> {
                return this.columnNames;
            },
            
            columnNamesToBeHidden(): Array<string> {
                const columns: Array<string> = [];
                Object.keys(this.rowData[0]).forEach((val, index) => {
                    if (this.config.hideColumn?.includes(index)) {
                        columns.push(val);
                    }
                });

                return columns;
            },
            columnsToBeHidden(): Array<number> {
                if (this.config.hideColumn) {
                    return this.config.hideColumn;
                } else {
                    return [];
                }
            }
        },
        methods: {
            setSelectedColumn(id: number): void {
                this.columnId = id;
                this.sortOrder = (this.sortOrder === SortOrder.ASCENDING) ? SortOrder.DESCENDING : SortOrder.ASCENDING;
            }
        }
    });
</script>


<style lang="scss">

    table, th, td{
        border: 2px solid rgb(190, 184, 184);
    }

    table{
        width: 100%;
        margin: 20px 0px;
        border-collapse: collapse;

        th{
            background: #d6fff3;
            font-size: 20px;
            padding: 10px;
        }

        tr{
            &:nth-child(even){
                background: aliceblue;
            }
        }

        td{
            font-size: 18px;
            padding: 10px;
        }

        /* it can be baaaad */
        tfoot > div{
            padding: 10px;
            font-size: 20px;
        }
        
    }
</style>