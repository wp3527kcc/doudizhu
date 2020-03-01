<template>
  <div>

  <div class='time' :class={red:red} @click="_click" v-if="visible">
  {{count}}
  </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            count:Number,
        }
    },
    computed:{
        red(){
            return this.count>=10?false:true
        }
    },
    props:{
        num:Number,
        visible:Boolean
    },
    methods:{
        _click:function(){
            this.$emit('over')
            console.log('click')
        }
    },
    mounted(){
        this.count = this.num
        if(this.count<=0)
            return
        this.count = Math.floor(this.count)
        const Interval = setInterval(()=>{
            if(this.count>0)
                this.count--
        },1e3)
    },
    watch:{
        visible:function(newValue,oldValue){
            this.count = 30
        }
    }
}
</script>

<style>
    .time{
        position: absolute;
        background: url(../../static/img/timg.jpg) no-repeat;
        background-position: 0 0;
        background-size: 100%;
        width: 50px;
        height: 50px;
        padding-top: 18px;
        padding-left: 18px;
        top: -65px;
    }
    .red{
        color:red;
    }
</style>