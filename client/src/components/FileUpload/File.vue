<template>

    <div class="file">
        <div class="file-img" v-if="loadingFile.image" :style="{backgroundImage: `url('${loadingFile.image}'`}"></div>
        <img v-else :src="require(`@/assets/type-icons/${loadingFile.icon}`) " alt="">

        <div class="filename">
            <span>{{loadingFile.shortName}}</span>
            <span>({{loadingFile.normalType}})</span>
        </div>
        
        <progress :value="progress" max="100">{{progress}}%</progress>
        <div class="remove-file" @click="removeFile">&#10006;</div>
    </div>
    
</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import {LoadingFile}     from './FileUpload.vue';

    export default defineComponent({
        
        props: {
            loadingFile: {
                type    : Object as () => LoadingFile,
                required: true,
            },
            progress: {
                type   : Number,
                default: 0, 
            }
        },

        watch: {
            progress: function(newVal, oldVal){
                console.log(`file[${this.loadingFile.index}]:`, oldVal, newVal);
            },
        },

        data: function(){
            return {
                iconWay: ''
            }
        },

        methods: {
            removeFile: function(){
                this.$emit('remove-file', this.loadingFile);
            }
        }
    });

</script>


<style lang="scss" scoped>

    @import '../../assets/scss/utils.scss';

    .file{
        width: 100%;
        display: grid;
        column-gap: 20px;
        grid-template-columns: 60px 1fr 4fr max-content;
        align-items: center;
        height: 45px;

        img{
            width: 80%;
        }

        .filename{
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            justify-content: center;
            font-size: 18px;
        }

        .file-img{
            height: 100%;
            background-position: center;
            background-size: cover;
        }

        .remove-file{
            font-size: 25px;
            cursor: pointer;
        }

        @mixin progress{
            display: block;
            width: 100%;
            border-radius: 10px;
        }

        progress{
            @include progress;
            appearance: none;
        }

        progress::-webkit-progress-value{
            @include progress;
            background-color: $redColor;
        }

        progress::-webkit-progress-bar{
            @include progress;
            background-color: #e6dede;
        }

        progress::-moz-progress-bar{
            @include progress;
            background-color: #e6dede;
        }
    }

     @media screen and (max-width: 700px) {
        .file{
            height: 40px;
            column-gap: 8px;
            grid-template-columns: 40px 1fr 2fr max-content;

            .filename{
                font-size: 16px;
            }
        }
    }
</style>