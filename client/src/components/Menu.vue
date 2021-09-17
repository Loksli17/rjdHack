<template>
    <div class="menu">

        <div class="link-wrapper">
            <router-link to="/"> Плохие файлы </router-link>
            <router-link to="/view-all"> Все файлы </router-link>
        </div>

        <div class="user">
            <span>Холодилов А.</span>
            <router-link to="/logout">Выход</router-link>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../assets/scss/utils.scss';

    .menu{
        position: fixed;
        top: 0px;
        left: 0px;
        height: $menuHeigth;
        width: 100%;
        display: grid;
        background: rgb(241, 235, 235);
        grid-auto-flow: column;
        grid-template-columns: auto max-content;
        column-gap: 20px;
        box-sizing:  border-box;
        padding: 10px 30px;

        .user{
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: auto max-content;
            column-gap: 20px;
            align-items: center;
        }

        .link-wrapper{
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            column-gap: 20px;
            justify-items: flex-start;
            align-items: center;
        }
    }
    
</style>