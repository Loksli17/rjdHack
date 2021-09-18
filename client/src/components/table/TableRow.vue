<template>
    <tr>
        <template v-for="(value, name) in row" :key="name">
            <td 
                v-if="!columnsToHide.includes(name)" 
                style="white-space: pre-line"
            >
                <span :class="[{'checked': value == 'обработан'},{'not-checked': value == 'Не обработан'}]">{{ value }}</span>
            </td>
        </template>
        <TableRowActionCell v-if="actions" :actions="actions" :itemId="row.id" />
    </tr>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import TableRowActionCell from "./TableRowActionCell.vue";
    import { Action, columnType } from "./types";

    export default defineComponent({
        name: "TableRow",
        components: {
            TableRowActionCell
        },
        props: {
            row: {
                type: Object as PropType<columnType>,
                require: true
            },
            actions: {
                type: Object as PropType<Array<Action>>
            },
            columnsToHide: {
                type: Object as PropType<Array<{ pos: number }> | undefined>
            }
        }
    })
</script>

<style lang="scss">

    .not-checked {
        padding: 0px 20px;
        text-transform: uppercase;
        border: 4px solid #FF6961;
        color: #FF6961;
    }

    .checked {
        padding: 0px 20px;
        text-transform: uppercase;
        border: 4px solid #3AD475;
        color: #3AD475;
    }
</style>