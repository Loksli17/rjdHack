<template>
    
    <div class="file-upload-container">
        <div v-if="files.length < maxFilesAmount" class="file-upload-field" @click="showDialogWindow" :class="{'file-upload-field-drag': dragStatus}" @drop.prevent="dragDrop" @dragenter.prevent @dragover.prevent="dragOver" @dragleave="dragLeave">
            <span>{{message}}</span>
            <input ref="fileInput" type="file" multiple hidden @change="addFilesDialogWindow">
        </div>

        <div v-if="files.length" class="file-container">
            <FileComponent
                v-for="file in files" :key="file.index"
                :loadingFile="file"
                v-model:progress="file.progress"
                v-on:remove-file="removeFile"
            />
            <button v-if="!autoLoad" @click="loadFiles">Send files</button>
        </div>
    </div>

</template>


<script lang="ts">
    import {defineComponent} from 'vue';
    import FileComponent     from './File.vue';

    export interface LoadingFile{
        file: File;
        index: number;
        progress: number;
        loading: boolean;
        image: string;
        shortName: string;
        normalType: string;
        icon?: string;
    }

    interface TypeIcon{
        [index: string]: string;
    }


    export default defineComponent({

        components: {
            FileComponent,
        },

        props: {
            maxFilesAmount: {
                type   : Number,
                default: 10,
            },
            message: {
                type   : String,
                default: 'Click on this field or drop files here!',
            },
            repeatFiles: {
                type   : Boolean,
                default: false, 
            },
            autoLoad: {
                type   : Boolean,
                default: true,
            },
            types: {
                type   : Array as () => Array<string>,
                default: null,
            },
            maxFileSize: {
                type   : Number,
                default: null,
            },
        },
        
        data: function(){
            return {
                files        : [] as Array<LoadingFile>,
                dragStatus   : false as boolean,
                images       : [] as Array<string>,
                filesProgress: [] as Array<number>,
                currentIndex : 0 as number,

                typeIcons: {
                    '.pdf'  : 'pdf.png',
                    '.docx' : 'word.svg',
                    '.doc'  : 'word.svg',
                    '.pptx' : 'power-point.svg',
                    '.xlsx' : 'excel.svg',
                    '.txt'  : 'notebook.png',
                    '.avi'  : 'avi.png',
                    '.gif'  : 'gif.png',
                    '.vsdx' : 'visio.svg',
                    '.wav'  : 'wav.svg'
                } as TypeIcon,
            }
        },

        computed: {

            normalMaxFileSize: function(): string{

                if(!this.maxFileSize) throw new Error('maxFileSize is null');

                let
                    size    : number = this.maxFileSize,
                    count   : number    = 0,
                    dataType: string = '';

                while(size > 1024){
                    count++;
                    size /= 1024;
                    size = +size.toFixed(3);
                }

                switch(count){
                    case 0:
                        dataType = 'b';
                        break;
                    case 1:
                        dataType = 'kb';
                        break;
                    case 2:
                        dataType = 'mb';
                        break;
                    case 3:
                        dataType = 'gb';
                        break;
                }

                return `${size} ${dataType}`;
            }
        },

        created: function(){
            if(!this.determineDragAndDropCapable()) {
                const msg: string = `Browser doesn't has supporting of DRAG and DROP API`;
                this.$emit('not-drag-and-drop-capable-error', msg);
                throw new Error(msg);
            }
        },

        methods: {

            showDialogWindow: function(): void{
                const input: HTMLInputElement = this.$refs.fileInput as HTMLInputElement;
                input.click();
            },

            addFilesDialogWindow: function(e: InputEvent): void{
                const newFiles: FileList | null = (e.target as HTMLInputElement).files;
                if (newFiles) this.addFiles(newFiles);
            },
            
            dragDrop: function(e: DragEvent): void {
                if(e.dataTransfer == null) new Error('Error with dataTransfer');
                const newFiles: FileList | null = e.dataTransfer!.files;
                if (newFiles) this.addFiles(newFiles);
            },

            dragOver: function(): void{
                this.dragStatus = true;
            },

            dragLeave: function(): void{
                this.dragStatus = false;
            },
            
            addFiles: function(newFiles: FileList): void{

                let allowedFiles: Array<File> = [];

                for (const file of newFiles) {
                    if(this.types != null)       this.checkFileType(file);
                    if(this.maxFileSize != null) this.checkFileSize(file);
                }

                this.dragStatus = false;

                for (const newFile of newFiles) {
                    if(this.files.length >= this.maxFilesAmount) return;
                    if(this.repeatFiles) {allowedFiles.push(newFile)}
                    if(!this.repeatFiles && !(this.files.find(loadFile => loadFile.file.name == newFile.name))) allowedFiles.push(newFile);
                }

                allowedFiles.forEach(async (file: File) => {

                    const
                        imagesTypes     : Array<string>        = ['.svg', '.jpeg', '.jpg', '.png'],
                        regExpType      : RegExp               = /\.[a-zA-Z]+$/gi,
                        dataFile        : string | ArrayBuffer = await this.readFile(file),
                        regExpTypeResult: Array<string> | null = file.name.match(regExpType),
                        clearFileName   : string               = file.name.slice(0, file.name.indexOf('.'));

                    if(!regExpTypeResult) throw Error('file has bad type');

                    const typeFile: string = regExpTypeResult[0];

                    const loadingFile: LoadingFile = {
                        file      : file, 
                        index     : this.currentIndex++, 
                        progress  : 0,
                        image     : imagesTypes.includes(typeFile.toLowerCase()) && typeof dataFile == "string" ? dataFile : '',
                        icon      : !imagesTypes.includes(typeFile) && typeof dataFile == "string" ? (this.typeIcons[typeFile] || 'default.png') : 'default.png',
                        loading   : false,
                        shortName : (clearFileName.length > 5) ? `${clearFileName.slice(0, 5)}..`: clearFileName,
                        normalType: typeFile,
                    };

                    this.files.push(loadingFile);
                    
                    // ! IT'S SO IMPORTANT do this with array item case JS has so STRANGE POINTERS. Please, DON'T EDIT IT
                    if(this.autoLoad){
                        this.$emit('load-handler', this.files[this.files.length - 1]);
                        this.files[this.files.length - 1].loading = true;
                    }

                });
            },

            readFile: function(file: File): Promise<string | ArrayBuffer>{
                return new Promise((resolve, reject) => {
                    const reader: FileReader = new FileReader();

                    reader.onload = () => {
                        resolve(reader.result || '');
                    }

                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            },

            loadFiles: function(){
                this.files.forEach((loadingFile: LoadingFile) => {
                    if(loadingFile.loading) return;
                    this.$emit('load-handler', loadingFile);
                    loadingFile.loading = true;
                });
            },

            removeFile: function(removingFile: LoadingFile): void{
                this.files = this.files.filter((file: LoadingFile) => file.index != removingFile.index);
            },

            checkFileType: function(file: File){
                
                let flag: boolean = false;

                this.types.forEach((type: string) => {
                    if(file.type.includes(type)){flag = true}
                });

                if(!flag){
                    this.$emit('type-error-handler', file, `File's type not belongs types: ${this.types}`);
                    throw new Error(`Unnecessary type of file ${file.name}`);
                }
            },

            checkFileSize: function(file: File){
                if(file.size > this.maxFileSize) { 
                    this.$emit('size-error-handler', file, `File's size more then ${this.normalMaxFileSize}!`);
                    throw new Error(`File ${file.name} has so big size!`);
                }
            },

            determineDragAndDropCapable: function(){

                let div: HTMLDivElement = document.createElement('div');

                return (('draggable' in div) || ( 'ondragstart' in div && 'ondrop' in div )) &&
                    'FormData' in window && 
                    'FileReader' in window;
            }
        }
    });
</script>


<style lang="scss" scoped>

    @import '../../assets/scss/utils.scss';


    .file-upload-container{
        margin-top: 30px;
        cursor: pointer;

        .file-container{
            margin-top: 20px;
            display: grid;
            row-gap: 30px;
        }
        
        .file-upload-field{
            padding: 20px;
            border: 3px dashed $redColor;
            display: grid;
            justify-content: center;

            span{
                font-size: 24px;
            }

            &:hover{
                transition: 0.4s;
                background-color: rgba($color: #f1928d, $alpha: 0.6);
            }
        }

        .file-upload-field-drag{
            border: 2px dashed #f1928d;
        }
    }
</style>