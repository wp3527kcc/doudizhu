//login page
<template>
  <div class="contain">
    <h1>请登陆后选择房间</h1>
    <input type="text" placeholder="please input your nick" v-model="nick" />
    <input type="password" placeholder="please input your password" v-model="password" />
    <input type="button" value="登陆" @click="login({nick,password,router})" />
    <div href class="info"><span class='iconfont icon-tixing'></span>
    本系统登陆即注册</div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      nick: "",
      password: "",
      router: {}
    };
  },
  mounted() {
    this.router = this.$router;
  },
  methods: {
    ...mapActions(["login"])
  }
};
</script>

<style lang = 'scss' scoped>
.contain {
  margin: 100px auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
  padding: 40px;
  background: lightseagreen;
  input {
    margin: 10px 0;
    width: 90%;
  }
  input[type="button"] {
    background: #3287f0;
    color: #f0f0f0;
    height: 40px;
    transition: 0.4s ease all;
    &:hover {
      background: white;
      color: black;
    }
  }
  .info {
    align-self: flex-end;
    margin-right: 20px;
    font-size: 12px;
    color: #e74c3c;
  }
}
</style>
