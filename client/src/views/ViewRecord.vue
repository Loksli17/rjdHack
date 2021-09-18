<template>
    <div class="page-wrap view">
        
        <div class="row">
            <router-link to="/"> Обратно к списку аудио-файлов </router-link>
        </div>

        <div class="row">
            <h1> Файл: {{record.fileAudio}}</h1>
            <button @click="showPopup = true">Редактировать</button>
            <AudioPlayer v-if="record.fileAudio" :currentTime="currentTimeStamp" :src="`http://localhost:3000/audios/${record.fileAudio}`" />
        </div>

        <div class="row">

            <div class="col-1">

                <div>
                    <h1>Навигация</h1>
                </div>

                <div class="tabs">
                    <div @click="setContent('text')">
                        Текст переговоров
                    </div>

                    <div @click="setContent('errors')">
                        Зафиксированные ошибки
                    </div>

                    <div @click="setContent('info')">
                        Информация о файле
                    </div>
                </div>
            </div>


            <div class="col-2">

                <div class="content">

                    <div class="text tab" :class="{'tab-active': textStatus}">
                        {{record.text}}
                        <AudioTImeCode :time="15" @get-time="currentTimeStamp = $event" />
                    </div>

                    <div class="tab" :class="{'tab-active': errorStatus}">
                        Ошибки
                    </div>

                    <div class="tab" :class="{'info': infoStatus}">

                        <div>
                            <h4>Название</h4>
                            <div>{{record.date}}</div>
                        </div>

                        <div>
                            <h4>Дата создания:</h4>
                            <div>{{record.date}}</div>
                        </div>

                        <div>
                            <h4>Нарушение</h4>
                            <div>{{record.isIllegalContent}}</div>
                        </div>

                        <div>
                            <h4>Обработано</h4>
                            <div>{{record.date}}</div>
                        </div>

                        <div>
                            <h4>Работники переговоров</h4>
                            <!-- Добавить нормальный вывод работников -->
                            <div>{{record.workers}}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';
    import AudioService        from '../services/AudioService';
    import AudioPlayer         from "@/components/AudioComponents/AudioPlayer.vue";
    import AudioTImeCode       from "@/components/AudioComponents/AudioTimeCode.vue";

    
    export default defineComponent({
        name: "view-record",
        components: {
            AudioPlayer,
            AudioTImeCode
        },
        data: function(){
            return {
                record          : {} as Record<string, any>,
                textStatus      : false as Boolean,
                errorStatus     : true as Boolean,
                infoStatus      : false as Boolean,
                currentTimeStamp: 0 as number
            }
        },
        
        computed: {
            recordID(): number {
                return Number(this.$route.params.id) as number;
            }
        },

        mounted: async function(){
            this.record = await AudioService.getOne(this.recordID);
        },

        methods: {
            setContent: function(param: string){

                switch(param){
                    case "text": 
                        this.infoStatus  = false;
                        this.errorStatus = false;
                        this.textStatus  = true;
                        break;
                    case "info":
                        this.infoStatus  = true;
                        this.errorStatus = false;
                        this.textStatus  = false;
                        break;
                    case "errors": 
                        this.infoStatus  = false;
                        this.errorStatus = true;
                        this.textStatus  = false;
                        break;
                }
            }
        },
    });
</script>


<style lang="scss">
    @import '../assets/scss/utils.scss';


    .view{
        .row:first-child{
            padding: 0px 50px;
            @include grid-left;

            a{
                @include button;
                @include link;
            }
        }

        .row:nth-child(2){
            @include grid-left;
            column-gap: 30px;
            grid-template-columns: max-content max-content;

            button{
                @include button;
            }
        }

        .row:not(.row:first-child){
            @include page-row;
        }

        .row:nth-child(3){
            display: grid;
            grid-template-columns: max-content auto;
            column-gap: 50px;
            height: 650px;

            .col-1{
                padding: 40px;
                background: $color;

                h1{
                    text-align: left;
                }

                .tabs{
                
                    margin-top: 30px;
                    display: grid;
                    row-gap: 20px;

                    div{
                        padding: 20px;
                        background: rgb(179, 177, 177);
                        cursor: pointer;

                        &:hover{
                            transition: 0.4s;
                            background: rgb(158, 151, 151);
                        }
                    }
                }
            }

            .col-2{
                padding: 40px;
                background: $color;
                max-height: 650px;
                overflow-y: auto;

                .content{

                    .text{
                        text-align: left;
                        font-size: 20px;
                    }
                    
                    > .tab{
                        display: none;
                    }

                     .tab-active{
                        display: block;
                    }

                    .info{
                        display: grid;
                        row-gap: 30px;
                        justify-content: left;

                        div{
                            display: grid;
                            row-gap: 10px;
                            justify-content: left;

                            h4{
                                text-align: left;
                            }
                        }
                    }
                }
            }
        }
    }
    

</style>