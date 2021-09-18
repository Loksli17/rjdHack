<template>
    <td>
        <!-- <a href="" @click.prevent="removeArticle(item.id)">Delete</a>
        <router-link :to="`/crud/${item.id}/edit`">Edit</router-link>
        <router-link :to="`/crud/${item.id}/view`">View</router-link> -->
        <template v-for="action in actions" :key="action.id">
            <router-link 
                v-if="action.path !== undefined"
                :class="action.cssClassName" 
                :to="action.path(itemId)"
            >
                {{ action.name }}
                <img v-if="action.imgPath" :src="action.imgPath">
            </router-link>
            <a 
                v-else-if="action.handler !== undefined" 
                :class="action.cssClassName"
                href="" 
                @click.prevent="action.handler(itemId)"
            >
                {{ action.name }}
                <img v-if="action.imgPath" :src="action.imgPath">
            </a>
        </template>
    </td>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Action } from "./types";

    export default defineComponent({
        props: {
            itemId: {
                type: Number,
                required: true
            },
            actions: {
                type: Object as PropType<Array<Action>>,
                required: true
            }
        }
    });
</script>