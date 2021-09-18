<template>
    <div>
        <Menu></Menu>
        <router-view/>
        <FlashMessage />
    </div>
</template>



<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;700&display=swap');
    body {
        font-family: Jost, Avenir, Helvetica, Arial, sans-serif;
    }

    #app {
        // font-family: Avenir, Helvetica, Arial, sans-serif;
        font-family: Jost, Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    ._vue-flash-msg-body {
        z-index: 10000;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
