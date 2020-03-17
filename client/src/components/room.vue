<template>
  <div>
    <div v-if="flag">
      <mt-button type="danger" size="normal" class="mtb" @click="back">返回</mt-button>

      <div class="kuai" id="top">
        <div v-for="(each,index) in showtop" :key="index">
          <div
            class="poker smallpoker"
            :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,left:`${index*50}px`}"
          ></div>
        </div>
      </div>
      <div class="kuai left-player" id="left">
        <div class="usermsg leftuser">
          <naozhong :num="countdown" id="leftcountdown" :visible="left.flag" />
          <img :src="'http://localhost:3000//public//img//'+ left.nick +'.jpg'" class="Avatar" />
          <div class="msgright">
            <div class="nick">
              <b>nick:</b>
              {{left.nick}}
            </div>
            <div class="score">
              <b>score:</b>
              {{left.score}}
            </div>
          </div>
          <img src="../../static/img/crown.jpg" alt width="40px" class="crown" v-if="left.king" />
        </div>
        <div id="leftstandby" class="standby">
          <div v-for="(each,index) in left.standby" :key="index">
            <div
              class="poker smallpoker"
              :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,left:`${index*15}px`}"
            ></div>
          </div>
        </div>
        <div
          class="poker bigpoker"
          :style="{backgroundPosition:`${-10-105.5*(2)}px ${-10-28*5*4}px`,top:0}"
        >{{left.poker.length}}</div>
      </div>
      <div class="kuai right-player" id="right">
        <div class="usermsg rightuser">
          <naozhong :num="countdown" id="rightcountdown" :visible="right.flag" />
          <div class="msgright">
            <div class="nick">
              <b>nick:</b>
              {{right.nick}}
            </div>
            <div class="score">
              <b>score:</b>
              {{right.score}}
            </div>
          </div>
          <img :src="'http://localhost:3000//public//img//'+ right.nick +'.jpg'" class="Avatar" />
          <img
            src="../../static/img/crown.jpg"
            alt
            width="40px"
            class="crown"
            v-if="right.king"
            style="left:100%;transform:translateX(-100%)"
          />
        </div>
        <div id="rightstandby" class="standby">
          <div v-for="(each,index) in right.standby" :key="index">
            <div
              class="poker smallpoker"
              :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                right:`${(right.standby.length-index)*15}px`}"
            ></div>
          </div>
        </div>
        <div
          class="poker bigpoker"
          :style="{backgroundPosition:`${-10-105.5*(2)}px ${-10-28*5*4}px`,top:0}"
        >{{right.poker.length}}</div>
      </div>
      <div class="bottom-player">
        <div id="pokers"></div>
        <div class="usermsg bottomuser">
          <naozhong :num="countdown" id="bottomcountdown" :visible="bottom.flag"></naozhong>
          <img :src="'http://localhost:3000//public//img//'+ bottom.nick +'.jpg'" class="Avatar" />
          <div class="msgright">
            <div class="nick">
              <b>nick:</b>
              {{this.bottom.nick}}
            </div>
            <div class="score">
              <b>score:</b>
              {{this.bottom.score}}
            </div>
          </div>
          <img src="../../static/img/crown.jpg" alt width="40px" class="crown" v-if="bottom.king" />
        </div>
        <div id="bottomstandby" class="standby">
          <div v-for="(each,index) in bottom.standby" :key="index">
            <div
              class="poker smallpoker"
              :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                left:`${index*15}px`}"
            ></div>
          </div>
        </div>
        <div v-for="(each,index) in bottom.poker" :key="index">
          <div
            class="poker bigpoker"
            :class="{Selected:each.flag}"
            @click="pokerclick(index)"
            :style="{backgroundPosition:`${-10-105.5*(each.column)}px ${-10-28*5*each.row}px`,left:`${basedelta+index*30}px`}"
          ></div>
        </div>
        <div class="butArea" v-show="bottom.flag && round==2">
          <button @click="chupai" :class="{dark:!permit}">出牌</button>
          <button @click="passpoker" v-show="flag_pass">不出</button>
        </div>
        <div class="butArea" v-if="bottom.flag && round == 0">
          <button @click="emit(true)">叫地主</button>
          <button @click="emit(false)">不叫</button>
        </div>
        <div class="butArea" v-show="bottom.flag && round==1">
          <button @click="emit(true)">抢地主</button>
          <button @click="emit(false)">不抢</button>
        </div>
        <div class="butArea" v-if="false">
          <button @click="prepare(true)">准备</button>
          <button @click="prepare(false)">取消准备</button>
        </div>
        <div class="butArea" v-if="false">
          <button>再来一局</button>
          <button>返回大厅</button>
        </div>
      </div>
      <div id="chatroom">
        <div v-for="(each,index) in Chat_Record" :key="index">
          <div
            class="chat"
            :class='each.nick == current_nick?"Mine":"Other"'
            :style="{bottom:each.bottom}"
          >{{each.nick}}说：{{each.content}}</div>
        </div>
        <input type="text" id="chatroomInput" v-model="inputcontent" />
        <button id="chatroomCommit" @click="commit">commit</button>
      </div>
      <div class="coverLayer" v-if="overflag">
        <div class="centerArea">
          <div class="topArea">恭喜你赢了||很遗憾你输了</div>
          <div class="mainArea">
                <table border="1" rules='rows' cellpadding='0' cellspacing="0">
                        <tr>
                            <th>昵称</th>
                            <th>本局输赢</th>
                            <th>总资产</th>
                        </tr>
                        <tr v-for="(each,index) in over_msg" :key=index :class="{'red':each.nick == current_nick}">
                          <td>{{each.nick}}</td>
                          <td>{{each.delta}}</td>
                          <td>{{each.score}}</td>
                        </tr>
                    </table>
          </div>
          <div class="btn">
            <el-button type='primary' size='mini' @click="refresh">继续游戏</el-button>
            <el-button type='danger' size='mini' @click="back">返回大厅</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>当前房间人数不足，已有{{Percount}}人</h1>
      <mt-button @click="back">返回大厅</mt-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { Toast } from "mint-ui";
import naozhong from "./naozhong.vue";
import { compare, judgement } from "../../static/util/fun";
export default {
  data() {
    return {
      toppoker: [],
      Percount: 0,
      left: [],
      right: [],
      bottom: [],
      flag: false,
      permit: true,
      inputcontent: "",
      countdown: 30,
      standby: [],
      overflag:Boolean,
      round: Number,
    };
  },
  computed: {
    ...mapState(["RoomMsg", "current_roomid", "current_nick", "Chat_Record","over_msg"]),
    basedelta: function() {
      return (600 - (this.bottom.poker.length * 30 - 30 + 92)) / 2;
    },
    flag_pass: function() {
      return this.standby.length;
    }, //round 0 1 2,
    showtop: function() {
      if (
        this.left.king == undefined &&
        this.right.king == undefined &&
        this.bottom.king == undefined
      )
        return [
          { column: 2, row: 4 },
          { column: 2, row: 4 },
          { column: 2, row: 4 }
        ];
      return this.toppoker;
    }
  },
  mounted() {},
  watch: {
    RoomMsg: function(newValue, oldValue) {
      let re = newValue.filter(each => each.roomid == this.current_roomid)[0];
      this.Percount = re.member.length;
      if (re.lastPoker !== undefined && this.Percount == 3) {
        let { flag, jiaodizhu, lastPoker, round, overflag } = re;
        this.round = round;
        this.overflag = overflag
        this.toppoker = this.getObj(lastPoker);
        let i,
          result,
          left = this.left,
          right = this.right,
          bottom = this.bottom;
        re.member.forEach((each, index) => {
          if (each.nick == this.current_nick) {
            i = index;
            result = each;
          }
        });
        this.bottom = result;
        switch (i) {
          case 0:
            this.left = re.member[2];
            this.right = re.member[1];
            break;
          case 1:
            this.left = re.member[0];
            this.right = re.member[2];
            break;
          case 2:
            this.left = re.member[1];
            this.right = re.member[0];
            break;
        }
        this.left.standby = this.getObj(this.left.standby);
        this.right.standby = this.getObj(this.right.standby);
        this.bottom.standby = this.getObj(this.bottom.standby);
        this.bottom.poker = this.getObj(this.bottom.poker);
        if (this.bottom.flag) {
          if (this.left.standby.length) this.standby = this.left.standby;
          else if (this.right.standby.length) this.standby = this.right.standby;
          else this.standby = [];
        }
        this.flag = true;
      } else this.flag = false;
    }
  },
  methods: {
    getObj(arr) {
      const inarr = [];
      arr.forEach(each => {
        const { row, column } = this.getPosition(each);
        const right = this.getRight(each);
        inarr.push({ row, column, poker: each, right, flag: false });
      });
      return inarr;
    },
    pokerclick(index) {
      this.bottom.poker[index].flag = !this.bottom.poker[index].flag;
      const result = compare(
        this.standby.map(each => each.right),
        this.bottom.poker.filter(each => each.flag).map(each => each.right)
      );
      this.permit = result;
    },
    chupai() {
      const result = this.bottom.poker.filter(each => each.flag);
      if (!this.permit || result.length == 0) {
        Toast("不符合出牌规则，请重新选择!");
        this.permit = true;
        result.forEach(each => (each.flag = false));
        return false;
      }
      if (
        !compare(
          this.standby.map(each => each.right),
          result.map(each => each.right)
        )
      ) {
        Toast("你的选择没有大过对方!");
        this.permit = true;
        result.forEach(each => (each.flag = false));
        return false;
      }

      const indexs = [];
      this.bottom.poker.forEach((each, index) => {
        if (each.flag) indexs.push(index);
      });
      this.bottomstandby = result;
      indexs.reverse().forEach(each => this.bottom.poker.splice(each, 1));
      this.$socket.emit("chupai", {
        content: this.bottom.poker.map(each => each.poker),
        change: result.map(each => each.poker)
      });
      this.permit = true;
    },
    passpoker() {
      this.$socket.emit("chupai", {});
    },
    emit(flag) {
      // console.log(flag)
      this.$socket.emit("jiaodizhu", { flag });
    },
    getPosition(num) {
      const row = num % 4 === 0 ? 3 : (num % 4) - 1;
      const column = Math.floor((num - 1) / 4);
      let position = {};
      if (num < 53) position = { column, row };
      else if (num == 53) position = { column: 1, row: 4 };
      else if (num == 54) position = { column: 0, row: 4 };
      return position;
    },
    getRight(num) {
      const right = 1 + Math.floor((num - 1) / 4);
      if (right == 1 || right == 2) return right + 13;
      else if (right == 14) {
        if (num == 53) return 16;
        else return 17;
      } else return right;
    },
    back() {
      this.$socket.emit("back");
      this.$router.push("/selectRoom");
    },
    commit() {
      this.$socket.emit("chat", { content: this.inputcontent });
      this.inputcontent = "";
    },
    prepare(flag) {
      this.$socket.emit("prepare", { flag });
    }
  },
  components: { naozhong }
};
</script>
<style scoped>
.kuai {
  position: absolute;
  height: 40px;
  /* width: 40px; */
  background: red;
}
#top {
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  width: 150px;
  height: 70px;
  background-color: white;
}
.chat {
  position: absolute;
  border-radius: 2px;
  transition: ease 0.7s;
  padding: 5px;
  max-width: 180px;
}
.Mine {
  background-color: #8fcc33;
  right: 5px;
}
.Other {
  background-color: white;
  left: 5px;
}
#chatroom {
  position: absolute;
  left: 8px;
  bottom: 8px;
  width: 280px;
  height: 320px;
  overflow: hidden;
  border: solid 2px white;
}
#chatroomInput {
  position: absolute;
  bottom: 5px;
  width: 80%;
  margin: 0 5px;
  left: 0;
  height: 25px;
}
#chatroomCommit {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: darkorange;
  border-radius: 5px;
  height: 25px;
}
.poker {
  background: url(../../static/img/poker.jpg) no-repeat;
  position: absolute;
  transition: 0.4s ease all;
  color: pink;
  font-size: 40px;
  text-align: center;
  line-height: 128px;
}
.bigpoker {
  width: 92px;
  height: 128px;
}
.smallpoker {
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
.left-player {
  left: 8px;
  top: 10%;
  position: absolute;
}
.right-player {
  top: 10%;
  position: absolute;
  right: 100px;
}
.bottomuser {
  left: 100%;
  bottom: 30px;
  transform: translateX(120px);
}
.leftuser {
  left: 5px;
  top: 130px;
}
.rightuser {
  top: 130px;
  right: -90px;
}
.usermsg {
  width: 160px;
  height: 80px;
  background-color: cyan;
  position: absolute;
  color: black;
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.usermsg > .Avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: black 3px solid;
  flex: 1;
}
.usermsg > .msgright {
  background-color: cyan;
  flex: 1;
}
#leftstandby {
  width: 480px;
  height: 70px;
  position: absolute;
  top: 50px;
  left: 130px;
}
#rightstandby {
  width: 480px;
  height: 70px;
  position: absolute;
  left: -520px;
  top: 50px;
}
#bottomstandby {
  width: 480px;
  height: 70px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 220px;
}

.butArea {
  position: absolute;
  margin: 10px 25px;
  left: 50%;
  transform: translate(-85%, -225%);
}

.butArea button {
  height: 30px;
  width: 50px;
  background-color: orange;
  border-radius: 50%;
}

.butArea button:hover {
  background-color: #fff;
}

.dark {
  background-color: gray !important;
}

.mtb {
  position: absolute;
  left: 20px;
  top: 5px;
  height: 30px;
}

.Selected {
  transform: translateY(-30px);
}
.crown {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 3px;
  left: 3px;
}
#leftcountdown {
  position: absolute;
  left: 115px;
}
#rightcountdown {
  position: absolute;
  left: 3px;
}
#bottomcountdown {
  position: absolute;
  left: 3px;
}
.coverlayyer {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.5);
}
.centerArea {
  width: 500px;
  height: 300px;
  border: 1px red solid;
  margin: 120px auto;
  position: relative;
}
.centerArea > .topArea {
  line-height: 50px;
  border-bottom: 3px #ddd solid;
  text-align: center;
}
.centerArea > .mainArea {
  background-color: rosybrown;
  height: 200px;
  color: black;
}
.centerArea > .mainArea table{
  width: 100%;
  height: 100%;
  text-align: center;
}
.centerArea > .btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.centerArea > .btn > button {
  margin: 0 15px;
}
</style>