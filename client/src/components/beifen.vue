<template>
    <div>
        <div  v-if="flag">
            <mt-button type='danger' size='normal' class='mtb' @click='back'>返回</mt-button>
            <naozhong :num=30 />

          <div class="kuai" id='top'>
               <div v-for='(each,index) in toppoker' :key=index>
                <div class="poker smallpoker"  
                    :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,left:`${index*50}px`}">
                </div>
            </div>
          </div>
    <div class="kuai left-player" id='left'>
        <div class="usermsg leftuser">
            <img src="../../static/img/tx.jpg"  class="Avatar">
            <div class='msgright'>
                <div class="nick"><b>nick:</b> wp3527kcc</div>
                <div class="score"><b>score:</b>100</div>
            </div>
        </div>
        <div id="leftstandby" class='standby'>
            <div v-for="(each,index) in leftstandby" :key='index'>
                <div class="poker smallpoker" 
                :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,left:`${index*15}px`}"></div>
            </div>
        </div>
                <div class="poker bigpoker"  
                    :style="{backgroundPosition:`${-10-105.5*(2)}px ${-10-28*5*4}px`,top:0}">
                    {{leftShow.length}}
            </div>
    </div>
    <div class="kuai right-player" id='right'>
        <div class="usermsg rightuser">
            <div class='msgright'>
                <div class="nick"><b>nick:</b> wp3527kcc</div>
                <div class="score"><b>score:</b>100</div>
            </div>
            <img src="../../static/img/tx.jpg"  class="Avatar">
        </div>
        <div id="rightstandby" class='standby'>
            <div v-for="(each,index) in rightstandby" :key='index'>
                <div class="poker smallpoker" 
                :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                right:`${(rightstandby.length-index)*15}px`}"></div>
            </div>
        </div>
        <div class="poker bigpoker"  
                    :style="{backgroundPosition:`${-10-105.5*(2)}px ${-10-28*5*4}px`,top:0}">
                    {{rightShow.length}}
            </div>
    </div>
    <div class="bottom-player">
        <div class="btn"></div>
        <div id="pokers"></div>
        <div class="usermsg bottomuser">
            <img src="../../static/img/tx.jpg"  class="Avatar">
            <div class='msgright'>
                <div class="nick"><b>nick:</b> wp3527kcc</div>
                <div class="score"><b>score:</b>100</div>
            </div>
            <img src="../../static/img/crown.jpg" alt="" width="40px" class='crown'>
        </div>
        <div id="bottomstandby" class='standby'>
            <div v-for="(each,index) in bottomstandby" :key='index'>
                <div class="poker smallpoker" 
                :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                left:`${index*15}px`}"></div>
            </div>
        </div>
         <div v-for='(each,index) in pokerlist' :key='index'>
                <div class="poker bigpoker" :class='{Selected:each.flag}' @click='pokerclick(index)'
                    :style="{backgroundPosition:`${-10-105.5*(each.column)}px ${-10-28*5*each.row}px`,left:`${index*30}px`}">
                </div>
            </div>
            <div class='butArea' v-show='flag1'>
                    <button @click='chupai'>出牌</button>
                    <button>不出</button>
            </div>
            <div class='butArea' v-show='flag2'>
                    <button>抢地主</button>
                    <button>不抢</button>
            </div>
            <div class="butArea" v-if="false">
                <button>叫地主</button>
                <button>不叫</button>
            </div>
            <div class="butArea" v-if="false">
                <button>准备</button>
                <button>取消准备</button>
            </div>
            <div class="butArea" v-if="false">
                <button>再来一局</button>
                <button>返回大厅</button>
            </div>
    </div>
    <div id="chatroom">
        <input type="text" id='chatroomInput'>
        <button id='chatroomCommit'>commit</button>
    </div>
</div>
        <div v-else>
        <h1>当前房间人数不足，已有{{Percount}}人</h1>
        </div>
   </div>
</template>
<script>
import {mapActions,mapMutations,mapState} from 'vuex'
import naozhong from "./naozhong.vue";
export default {
    data(){
        return {
            pokerlist:[],
            leftpoker:[],
            rightpoker:[],
            leftstandby:[],
            rightstandby:[],
            bottomstandby:[],
            toppoker:[],
            Percount:0,
            left:[],
            right:[],
            bottom:[],
            flag1:true,
            flag2:false,
            flag:false
        }
    },
    computed: {
        ...mapState(['RoomMsg','current_roomid','current_nick']),
        leftShow:function(){
            let arr = []
            arr.length = this.leftpoker.length
            arr.fill({row:4,column:2,num:0,right:0})
            return arr
        },
        rightShow:function(){
            let arr = []
            arr.length = this.rightpoker.length
            arr.fill({row:4,column:2,num:0,right:0})
            return arr
        }
    },
    mounted(){
       
    },
    watch:{
        RoomMsg:function (newValue,oldValue) {
           let re = newValue.filter(each => each.roomid == this.current_roomid)[0]
           this.Percount = re.member.length
           if(re.lastPoker !== undefined)
                {
                    this.toppoker = this.getObj(re.lastPoker)
                    let i, result 
                    re.member.forEach((each,index) => {
                        if(each.nick == this.current_nick)
                            {
                            i = index
                            result = each
                            }
                    })
                    this.pokerlist = this.getObj(result.poker)
                    switch(i){
                        case 0:
                            // this.leftpoker = this.getObj(re.member[2].poker);
                            // this.leftstandby = this.getObj(re.member[2].standby)
                            // this.rightpoker = this.getObj(re.member[1].poker);
                            // this.rightstandby = this.getObj(re.member[1].standby)
                            this.left = re.member[2]
                            this.right = re.member[1]
                            break;
                        case 1:
                            // this.leftpoker = this.getObj(re.member[0].poker);
                            // this.leftstandby = this.getObj(re.member[0].standby)
                            // this.rightpoker = this.getObj(re.member[2].poker);
                            // this.rightstandby = this.getObj(re.member[2].standby)
                            this.left = re.member[0]
                            this.right = re.member[2]
                            break;
                        case 2:
                            // this.leftpoker = this.getObj(re.member[1].poker);
                            // this.leftstandby = this.getObj(re.member[1].standby)
                            // this.rightpoker = this.getObj(re.member[0].poker);
                            // this.rightstandby = this.getObj(re.member[0].standby)
                            this.left = re.member[1]
                            this.right = re.member[0]
                            break;
                    }
                    this.flag = true
                }
        }
    },
    methods:{
        getObj(arr){
            const inarr = []
            arr.forEach(each => {
                const {row,column} = this.getPosition(each)
                const right = this.getRight(each)
                inarr.push({row,column,poker:each,right,flag:false})
            })
            return inarr
        },
        pokerclick(index){
            this.pokerlist[index].flag = !this.pokerlist[index].flag 
        },
        chupai(){
            const result = this.pokerlist.filter(each => each.flag)
            const indexs = []
            this.pokerlist.forEach((each,index) => {
                if(each.flag)
                    indexs.push(index)
            })
            this.bottomstandby = result
            indexs.reverse().forEach(each => this.pokerlist.splice(each,1))
            this.$socket.emit('renewRoomMsg',{content:this.pokerlist.map(each => each.poker),
            change:result.map(each => each.poker),nick:this.current_nick,id:this.current_roomid})
        },
        judge(arr){
        const pokers = arr.map(each => each.right),result = {}
        for(let i=0;i<15;i++)
        result[i+1] = 0
        pokers.forEach(each=>result[each] += 1)
        return result
        },
        getPosition(num){
        const row = num%4 === 0 ? 3:num%4-1
        const column = Math.floor((num-1)/4)   
        let position = {}
        if(num<53)
            position = {column,row}
        else if(num==53)
            position = {column:1,row:4}
        else if(num==54)
            position = {column:0,row:4}
        return position
        },
        getRight(num){
            const right = 1+Math.floor((num-1)/4)
            if(right==1||right==2)
                return right+11
            else if(right==14)
                {
                    if(num==53)
                        return 14
                    else 
                        return 15
                }
            else
                return right-2
        },
        back(){
            // this.$socket.emit('back',{nick:current_nick,id:current_roomid})
        }
    },
    components:{naozhong}
}
</script>
<style scoped>
.kuai{
    position: absolute;
    height: 40px;
    /* width: 40px; */
    background: red;
}
#top{
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    width: 150px;
    height: 70px;
    background-color: white;
}
.chat{
    position: absolute;
    right: 5px;
    background-color: cyan;
    border-radius: 5px;
    transition: ease .7s;
}
#chatroom{
    position: absolute;
    left: 8px;
    bottom:8px;
    width: 280px;
    height: 120px;
    overflow-y: hidden;
    background-color: white;
}
#chatroomInput{
    position: absolute;
    bottom: 5px;
    width: 80%;
    margin: 0 5px;
    left: 0;
    height: 25px;
}
#chatroomCommit{
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: darkorange;
    border-radius: 5px;
    height: 25px;
}
.poker{
    background: url(../../static/img/poker.jpg) no-repeat;
    position: absolute;
    transition: .4s ease all;
    color: pink;
    font-size: 40px;
    text-align: center;
    line-height: 128px;
}
.bigpoker{
    width: 92px;
    height: 128px;
}
.smallpoker{
    width: 46px;
    height: 64px;
    background-size: 1500%;
}
.bottom-player {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 128px;
    width: 600px;
    position: absolute;
}
.left-player{
    left: 8px;
    top: 10%;
    position: absolute;

}
.right-player{
    top: 10%;
    position: absolute;
    right: 100px;
}
.bottomuser{
    left: 100%;
    bottom: 30px;
    transform: translateX(120px);
}
.leftuser{
    left: 5px;
    top:130px;
}
.rightuser{
    top: 130px;
    right: -90px;
}
.usermsg{
    width: 160px;
    height: 80px;
    background-color: cyan;
    position: absolute;
    color: black;
    display: flex;
    justify-content: space-between;
    text-align: left
}
.usermsg>.Avatar{
    width: 80px;
    height: 80px;
    /* border-radius: 50%; */
    border: black 3px solid;
    flex: 1;
}
.usermsg>.msgright{
    background-color: cyan;
    flex:1;
}
#leftstandby{
    width: 480px;
    height: 70px;
    position: absolute;
    top: 50px;
    left: 130px;
}
#rightstandby{
    width: 480px;
    height: 70px;
    position: absolute;
    left: -520px;
    top: 50px;
}
#bottomstandby{
    width: 480px;
    height: 70px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 200px;
}

    .butArea{
        position: absolute;
        margin: 10px 25px ;
        left: 50%;
        transform: translate(-50%,-50px);
    }

    .butArea button{
        height: 30px;
        width: 50px;
        background-color: orange;
        border-radius: 50%;
    }

    .butArea button:hover{
        background-color: #FFF;
    }

     .mtb{
         position: absolute;
         left: 20px;
         top: 5px;
         height: 30px;
    }

    .Selected{
        transform: translateY(-30px)
    }
    .crown{
        position: absolute;
        width: 40px;
        height: 40px;
        top: 3px;
        left: 3px;
    }
</style>