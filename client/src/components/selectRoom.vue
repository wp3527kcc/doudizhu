<template>
    <div class='contain'>
    <h1>selectRoom</h1>
        <div class="tableContain" v-if='RoomMsg.length'>
            <div class="table" v-for="(each,index) in RoomMsg" :key='index' @click='comeRoom(each.roomid)'>
                <p>{{each.roomid}}号房间</p>
                <p>{{each.member.length}}/3</p>
                <p v-if='each.member.length==3'>此房间已满</p>
                <p v-else>点击进入此房间</p>
            </div>
        </div>
        <div v-else>
            <h1>当前无房间，请创建</h1>
        </div>
        <input type="text" v-model="roomid" class='createRoom' placeholder="请输入您想创建的房间号">
        <mt-button type='primary' @click='createRoom'>创建新房间</mt-button>
    </div>
</template>
<script>
import { mapMutations,mapActions,mapState,mapGetters } from 'vuex'
import store from '../store'
export default {
    data(){
        return {
           roomid:'1'
        }
    },
    computed: {
        ...mapState(['RoomMsg','current_nick','current_roomid'])
    },
    methods:{
        comeRoom(id){
            this.$socket.emit('join',{id,nick:this.current_nick})
            this.$router.push('/room')
        },
        createRoom() {
            this.$socket.emit('create',{nick:this.current_nick,id:this.roomid})
            this.$router.push('/room')
        },
    },
    mounted(){
            this.$socket.emit('report',{nick:this.current_nick})
    }
}
</script>
<style lang="scss" scoped> 
    .contain{
        margin: 20px;
        padding: 5px;
        .tableContain{
        display: flex;
        // justify-content: space-around;
        margin: auto;
            .table{
                width: 200px;
                height: 200px;
                border: red solid 4px;
                margin: auto;
                padding: 10px;
                   p {
                        color:aqua;
                        font-size: 25px;
                        text-align: center;
                    }
            }
        margin: 20px;
        }
    }
    .createRoom{
        width: 25%;
    }
</style>