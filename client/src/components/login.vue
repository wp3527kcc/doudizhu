//login page
<template>
	<div class="contain">
		<h1>请登陆后选择房间</h1>
		<input type="text" placeholder="please input your nick" v-model="nick" />
		<br>
		<input type="password" placeholder="please input your password" v-model="password"/>
		<br>
		<mt-button type="primary" class='mt' size="normal" @click="login({nick,password,router})">登陆</mt-button>
	</div>
</template>

<script>

import { Toast } from "mint-ui";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data () {
    return {
     nick:'',
	 password:'',
	 router:Object
    }
  },
  	mounted(){
		  this.router = this.$router
	},
	methods:{
		...mapActions(['login']),
		
	}
}
</script>

<style lang = 'scss' scoped>
	.contain{
		margin: 10px;
		text-align: center;
		input{
			max-width: 400px;
		}
		
	}
</style>
