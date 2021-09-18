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

        <div class="row">

            <div class="error-file" v-for="(file, index) in filesError" :key="index">
                
                <div>
                    {{file.file.name}}
                </div>

                <div class="errors" v-for="(error, index) in file.errors" :key="index">
                    {{error.timeCode}}
                </div>
            </div>
        </div>
        
    </div>
</template>


<script lang="ts">
    import { defineComponent }         from 'vue';
    import FileUpload, { LoadingFile } from '../components/FileUpload/FileUpload.vue';
    import AudioService                from '../services/AudioService';
    import {AxiosResponse}             from 'axios';

    
    export default defineComponent({

        name: "add-record",

        components: {
            FileUpload,
        },

        data: function(){
            return {
                filesError: [] as Array<Record<string, any>>,
            }  
        },

        methods: {

            fileLoad: async function(loadingFile: LoadingFile){
                console.log(loadingFile);
                const res: AxiosResponse = await AudioService.fileUpload(loadingFile);

                let obj: Record<string, any> = Object.assign({}, loadingFile);
                obj.errors = res.data.errors;
                
                if(res.data.errors.length > 0) this.filesError.push(obj);
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