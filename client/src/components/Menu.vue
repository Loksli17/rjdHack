<template>
    <div class="menu">

        <div class="logo">
            <span>ReCheck</span>
        </div>

        <div class="link-wrapper">
            <router-link to="/"> Плохие файлы </router-link>
            <router-link to="/view-all"> Все файлы </router-link>
        </div>

        <div class="btn-wrap">
            <router-link class="add-files-btn" to="/record/add"> Добавить файлы </router-link>
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
        display: block;
        position: fixed;
        top: 0px;
        left: 0px;
        height: $menuHeigth;
        width: 100%;
        display: grid;
        background: #fff;
        grid-auto-flow: column;
        grid-template-columns: max-content auto max-content max-content;
        column-gap: 20px;
        box-sizing:  border-box;
        padding: 10px 50px;
        box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.25);

        .logo{
            display: grid;
            justify-content: center;
            align-items: center;

            span{
                font-style: normal;
                font-weight: 500;
                font-size: 38px;
            }
        }

        .user{
            display: grid;
            column-gap: 20px;
            align-items: center;
            justify-content: right;
            
            a{
                text-align: right;
                text-decoration: none;
                color: #000;
            }

            span{
                font-size: 22px;
            }
        }

        .link-wrapper{
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            column-gap: 30px;
            justify-items: flex-start;
            align-items: center;

            a{
                text-decoration: none;
                color: #000;
                font-size: 22px;

                &:hover{
                    transition: 0.4s;
                    color: $redColorHover;
                }
            }
        }

        .btn-wrap{
            display: grid;
            align-items: center;

            .add-files-btn{
                @include button;
                @include link;
                font-size: 18px;
            }
        }
        
    }
    
</style>