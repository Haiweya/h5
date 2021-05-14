<template>
    <div class="home">
        <van-button type="primary" @click="goHome">home</van-button>
    </div>
</template>

<script>
import { Button } from "vant"

export default {
    name: 'Home',
    components: {
        [Button.name]: Button
    },
    methods: {
        goHome() {
            console.log('I wanna go home')
        }
    }
}
</script>
<style scoped>
.home {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
