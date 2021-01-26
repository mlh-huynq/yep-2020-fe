<template>
    <div v-if="success" class="wrapper">
        <h1 class="success">
            Đăng ký thành công.
        </h1>
    </div>
    <div v-else class="wrapper">
        <h1 class="title">Đăng ký tham gia<br />quay số trúng thưởng</h1>
        <form @submit.prevent="handleSubmit" class="register-form bg-white">
            <div class="register-form-control">
                <input type="text" autocomplete="off" required v-model="code" />
                <label for="email">Số tham gia</label>
                <div class="process"></div>
            </div>
            <div class="register-form-control">
                <input
                    type="text"
                    required
                    autocomplete="off"
                    v-model="password"
                />
                <label for="password">Mã xác nhận</label>
                <div class="process"></div>
            </div>
            <div class="register-form-actions">
                <button type="submit" class="register-btn bg-dark">
                    Tham gia
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    beforeRouteEnter(to, from, next) {
        if (['hn', 'dn', 'hn-guest', 'dn-guest'].includes(to.params.location)) {
            next();
        } else {
            next('/404');
        }
    },
    data() {
        return {
            name: '',
            password: '',
            code: '',
            success: false,
            disabled: false
        };
    },
    methods: {
        async handleSubmit() {
            this.disabled = true;
            const { password, code } = this;
            try {
                const res = await this.$axios.post('/dang-ky', {
                    password,
                    code,
                    location: this.$route.params.location,
                });
                this.success = res.data;
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title {
    font-size: 24px;
    text-align: center;
}
.register-form {
    width: 90%;
    max-width: 480px;
    padding: 30px;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    margin-bottom: 100px;
    .register-form-control {
        position: relative;
        margin: 20px auto 40px;
        input {
            height: 50px;
            width: 100%;
            position: relative;
            background: none;
            outline: none;
            border: none;
            font-size: 18px;
            z-index: 10;
            &:focus,
            &:valid {
                ~ label {
                    color: #9d9d9d;
                    transform: translate(-12%, -50%) scale(0.75);
                }
            }
            &:focus {
                ~ .process {
                    &::before,
                    &::after {
                        width: 50%;
                    }
                }
            }
        }
        label {
            position: absolute;
            top: 0;
            left: 0;
            color: #424242;
            font-weight: 300;
            font-size: 18px;
            line-height: 50px;
            transition: all 0.2s ease-in-out;
        }
        .process {
            width: 100%;
            height: 1px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #424242;
            &::after,
            &::before {
                content: '';
                height: 2px;
                width: 0;
                position: absolute;
                bottom: 0;
                background-color: #4caf50;
                transition: all 0.2s ease-in-out;
            }
            &::before {
                left: 50%;
            }
            &::after {
                right: 50%;
            }
        }
    }
    .register-form-actions {
        text-align: center;
    }
    .register-btn {
        display: inline-block;
        padding: 8px 36px;
        font-size: 18px;
        color: #424242;
        text-transform: uppercase;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        outline: none;
        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18),
                0 4px 15px 0 rgba(0, 0, 0, 0.15);
        }
    }
}
</style>
