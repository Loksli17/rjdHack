<template>
    <div class="page-wrap add-files">

        <div class="row">
            <FileUpload
                :maxFilesAmount="20"
                :autoLoad="true"
                :message="'Перетащите файлы сюда или нажмите на область!'"
                v-on:load-handler="fileLoad"
                v-on:type-error-handler="fileTypeError"
                v-on:size-error-handler="fileSizeError"
                v-on:not-drag-and-drop-capable-error="dragAndDropCapableError"
            />
        </div>
        
    </div>
</template>


<script lang="ts">
    import { defineComponent }         from 'vue';
    import FileUpload, { LoadingFile } from '../components/FileUpload/FileUpload.vue';
    import AudioService                from '../services/AudioService';

    
    export default defineComponent({

        name: "add-record",

        components: {
            FileUpload,
        },

        methods: {

            fileLoad: async function(loadingFile: LoadingFile){
                console.log(loadingFile);
                await AudioService.fileUpload(loadingFile);
            }
        },
    });
</script>

<style lang="scss">

    @import '../assets/scss/utils.scss';

    .add-files{

        .row:first-child{
            padding: 0px 50px;
        }

        .row:not(.row:first-child){
            @include page-row;
        }
    }
</style>