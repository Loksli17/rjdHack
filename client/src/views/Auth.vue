<template>
    <div>
        <h1>Авторизация</h1>
        <form @submit.prevent="loginUser">
            <label>
                <span>Логин</span>
                <input type="text" v-model="formData.login">
            </label>
            <label>
                <span>Пароль</span>
                <input type="password" v-model="formData.password">
            </label>
            <button type="submit">Авторизироваться</button>
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    
    export default defineComponent({
        name: "auth",
        data() {
            return {
                formData: {
                    login:    "" as string,
                    password: "" as string
                }
            }
        },
        methods: {
            loginUser() {
                console.table(this.formData);
                this.$router.push("/");
            }
        }
    })
</script>