<template>
    <div id="height" class="page-wrap add-files">

        <div class="row">
            <FileUpload
                :maxFilesAmount="20"
                :autoLoad="true"
                :message="'Перетащите файл или нажмите на область, чтобы загрузить файл!'"
                v-on:load-handler="fileLoad"
                v-on:type-error-handler="fileTypeError"
                v-on:size-error-handler="fileSizeError"
                v-on:not-drag-and-drop-capable-error="dragAndDropCapableError"
            />
        </div>

        <div id="statistics" class="row" v-if="filesError.length">

            <h1>Cтатистика сессии</h1>

            <div class="file-error-wrap">
                <div class="error-file" v-for="(file, index) in filesError" :key="index">
                
                <div class="file-info">
                    <span>Файл</span>  <h3>{{file.file.name}}</h3>
                </div>

                <div class="errors">
                    <div class="error" v-for="(error, index) in file.errors" :key="index">
                        <h5>Ошибка:</h5>
                        <span>{{error.timeCode}}</span>
                        <span>{{error.word}}</span>
                        <span>{{error.typeError}}</span>
                    </div>
                </div>
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

    #height{
        height: max-content;
        min-height: 100vh;
        padding-bottom: 50px;
    }

    .add-files{

        .row:first-child{
            padding: 0px 50px;
        }

        .row:not(.row:first-child){
            @include page-row;
        }

        #statistics{

            .file-error-wrap{
                display: grid;
                row-gap: 50px;
            }

            padding: 30px;
            background: #fff;
            border-radius: 20px;
            margin: 50px;
            

            h1{
                text-align: left;
                margin-bottom: 30px;
            }
            
            .error-file{
                display: grid;
                grid-template-columns: 400px auto;

                .file-info{
                    display: grid;
                    grid-auto-flow: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    column-gap: 30px;
                }

                .errors{
                    display: grid;
                    row-gap: 30px;

                    .error{
                        display: grid;
                        grid-template-columns: max-content max-content 1fr 1fr;
                        justify-content: flex-start;
                        column-gap: 20px;
                        font-size: 21px;
                    }
                }
            }
            
        }
    }
</style>