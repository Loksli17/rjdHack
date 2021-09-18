<template>
    <div class="page-wrap view">
        
        <div class="row">
            <router-link to="/"> Обратно к списку аудио-файлов </router-link>
        </div>

        <div class="row">
            <h1> Файл: {{record.fileAudio}}</h1>
            <button @click="showPopup = true">Редактировать</button>
            <button @click="generateReport">Сгенерировать отчёт</button>
            <div>
                <AudioPlayer v-if="record.fileAudio" v-model:currentTime="currentTimeStamp" :src="`http://localhost:3000/audios/${record.fileAudio}`" />
            </div>
        </div>

        <div class="row">

            <div class="col-1">

                <div>
                    <h1>Навигация</h1>
                </div>

                <div class="tabs">
                    <div :class="{ 'selected': textStatus }" @click="setContent('text')">
                        Текст переговоров
                    </div>

                    <div :class="{ 'selected': errorStatus }" @click="setContent('errors')">
                        Зафиксированные ошибки
                    </div>

                    <div :class="{ 'selected': infoStatus }" @click="setContent('info')">
                        Информация о файле
                    </div>
                </div>
            </div>


            <div class="col-2">

                <div class="content">

                    <div class="text tab" :class="{'tab-active': textStatus}">
                        {{record.text}}
                    </div>

                    <div class="tab" :class="{'tab-active': errorStatus}">
                        <h3>Ошибки</h3>
                        <div class="violation-lst-container">
                            <ul class="volation-list">
                                <li v-for="violation in record.violation" :key="violation.id">
                                    <AudioTImeCode :time="violation.timeCode" @get-time="currentTimeStamp = $event" />
                                    <span>{{ violation.word }}</span>
                                </li>
                            </ul>
                        </div>
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
                            <!-- <div>{{record.workers}}</div> -->
                            <ul class="worker-list" v-if="record.workers">
                                <li v-for="worker in record.workers">{{ worker.lastName }} {{ worker.firstName }}</li>
                            </ul>
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
    // import { jsPDF }           from "jspdf";
    import pdfmake             from "pdfmake/build/pdfmake";
    import pdfFonts            from "pdfmake/build/vfs_fonts.js";
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
            },
            generateReport(): void {
                pdfmake.vfs = pdfFonts.pdfMake.vfs;
                const docDef = {
                    content: [
                        { text: "Ошибки", style: "header" },
                        {
                            ul: [] as Array<any>,
                            style: "list"
                        }
                    ],
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            alignment: "center" ,
                            margin: [0, 20, 0, 40]
                        },
                        list: {
                            margin: [20, 0, 20, 0],
                        },
                        superMargin: {
                            margin: [20, 0, 40, 0],
                            fontSize: 15
                        }
                    }
                } as any;

                for (const violation of this.record.violation) {
                    docDef.content[1].ul?.push(`${violation.timeCode} ${violation.word}`);
                }

                pdfmake.createPdf(docDef).download("report.pdf");
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
                // @include button;
                padding: 20px 10px 20px 30px;
                @include link;
                color: #6C6C6C;

                &::before {
                    content: "";
                    display: inline-block;
                    // position: absolute;
                    width: 30px;
                    height: 30px;
                    position: relative;
                    top: 10px;
                    background-image: url("./../assets/back-arrow.svg");
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    transform: rotate(180deg);
                }
            }

        }

        .row:nth-child(2){
            @include grid-left;
            column-gap: 30px;
            grid-template-columns: repeat(3, max-content) 1fr;

            audio{
                width: 100%;
            }

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
                width: 13vw;
                background: #FFF;
                @include drop-shadow;
                border-radius: 18px;

                h1{
                    text-align: left;
                }

                .tabs{
                    margin-top: 30px;
                    display: grid;
                    row-gap: 20px;

                    div{
                        border-radius: 18px;
                        padding: 20px;
                        background: #EAEAEA;;
                        cursor: pointer;

                        &:hover{
                            transition: 0.4s;
                            background: #f72e24;
                            color: #FFF;
                        }
                    }

                    .selected {
                        background: #FF6961;
                        color: #FFF;
                    }
                }
            }

            .col-2{
                padding: 40px;
                background: #FFF;
                max-height: 650px;
                overflow-y: auto;
                @include drop-shadow;
                border-radius: 18px;

                .content{

                    .text{
                        text-align: left;
                        font-size: 20px;
                    }
                    
                    > .tab{
                        display: none;

                        .violation-lst-container {
                            width: 100%;

                            ul {
                                list-style: none;

                                li {
                                    text-align: left;
                                    padding: 15px;

                                    span {
                                        padding-left: 20px;
                                    }
                                }
                            }
                        }
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