<template>
    <div class="loading-wrapper">
        <div class="loading">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1011;
}
.loading {
    position: relative;
    width: 80px;
    height: 80px;
}
.loading div {
    animation: loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
}
.loading div:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: red;
    margin: -4px 0 0 -4px;
}
.loading div:nth-child(1) {
    animation-delay: -0.036s;
}
.loading div:nth-child(1):after {
    top: 63px;
    left: 63px;
}
.loading div:nth-child(2) {
    animation-delay: -0.072s;
}
.loading div:nth-child(2):after {
    top: 68px;
    left: 56px;
}
.loading div:nth-child(3) {
    animation-delay: -0.108s;
}
.loading div:nth-child(3):after {
    top: 71px;
    left: 48px;
}
.loading div:nth-child(4) {
    animation-delay: -0.144s;
}
.loading div:nth-child(4):after {
    top: 72px;
    left: 40px;
}
.loading div:nth-child(5) {
    animation-delay: -0.18s;
}
.loading div:nth-child(5):after {
    top: 71px;
    left: 32px;
}
.loading div:nth-child(6) {
    animation-delay: -0.216s;
}
.loading div:nth-child(6):after {
    top: 68px;
    left: 24px;
}
.loading div:nth-child(7) {
    animation-delay: -0.252s;
}
.loading div:nth-child(7):after {
    top: 63px;
    left: 17px;
}
.loading div:nth-child(8) {
    animation-delay: -0.288s;
}
.loading div:nth-child(8):after {
    top: 56px;
    left: 12px;
}
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
