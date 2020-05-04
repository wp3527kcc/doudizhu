<template>
  <div>
    <div v-if="flag" class="rootContain">
      <header>
        <button class="topbtn" @click="back">退出游戏</button>
        <div class="toparea">
          <div v-for="(each,index) in showtop" :key="index">
            <div
              class="poker smallpoker"
              :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`}"
            ></div>
          </div>
        </div>
      </header>
      <main class="otherplayer">
        <div class="left">
          <div
            class="poker bigpoker"
            :style="{backgroundPosition:`${-10-105.5*(2)}px ${-10-28*5*4}px`,left:'40px',bottom: '5px'}"
          >{{left.poker.length}}</div>
          <div class="Avatar leftAvatar">
            <img :src="'http://localhost:3000//public//img//'+ `${left.Avatarflag?left.nick:'undefined'}` +'.jpg'" class="face" />
            <div class="nick">{{left.nick}}</div>
            <div class="contain">
              <div class="qian">
                <span class="iconfont icon-qian"></span>
                {{left.score}}
              </div>
              <span class="iconfont icon-dizhu" v-if="left.king"></span>
            </div>
            <div class="standby" style="position: relative; left: 120px;top:20px;">
              <clock :num="countdown" id="leftcountdown" :visible="left.flag" />
              <div v-for="(each,index) in left.standby" :key="index">
                <div
                  class="poker smallpoker"
                  :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,left:`${index*15}px`}"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div
            class="poker bigpoker"
            style="background-position: -221px -570px;right: 40px;bottom: 5px;"
          >{{right.poker.length}}</div>
          <div class="Avatar rightAvatar">
             <img :src="'http://localhost:3000//public//img//'+ `${right.Avatarflag?right.nick:'undefined'}` +'.jpg'" class="face" />
            <div class="nick">{{right.nick}}</div>
            <div class="contain">
              <div class="qian">
                <span class="iconfont icon-qian"></span>
                {{right.score}}
              </div>
              <span class="iconfont icon-dizhu" v-if="right.king"></span>
            </div>
            <div class="standby" style="position: relative; right: 120px;top:20px;">
              <clock :num="countdown" id="rightcountdown" :visible="right.flag" />
              <div v-for="(each,index) in right.standby" :key="index">
                <div
                  class="poker smallpoker"
                  :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                right:`${(right.standby.length-index)*15}px`}"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="player">
        <div class="standby">
          <clock :num="countdown" id="bottomcountdown" :visible="bottom.flag" />
          <div v-for="(each,index) in bottom.standby" :key="index">
            <div
              class="poker smallpoker"
              :style="{backgroundPosition:`${(-10-105.5*each.column)/2}px ${(-10-28*5*each.row)/2}px`,
                left:`${index*15}px`}"
            ></div>
          </div>
        </div>
        <div class="btn">
          <div v-show="bottom.flag && round==2">
            <button @click="chupai" :class="{dark:!permit}">出牌</button>
            <button @click="passpoker" v-show="flag_pass">不出</button>
          </div>
          <div v-if="bottom.flag && round == 0">
            <button @click="emit(true)">叫地主</button>
            <button @click="emit(false)">不叫</button>
          </div>
          <div v-show="bottom.flag && round==1">
            <button @click="emit(true)">抢地主</button>
            <button @click="emit(false)">不抢</button>
          </div>
        </div>
        <div class="bg">
          <div v-for="(each,index) in bottom.poker" :key="index">
            <div
              class="poker bigpoker"
              :class="{Selected:each.flag}"
              @click="pokerclick(index)"
              :style="{backgroundPosition:`${-10-105.5*(each.column)}px ${-10-28*5*each.row}px`,left:`${basedelta+index*30}px`}"
            ></div>
          </div>
        </div>
        <div class="info">
          <div class="Avatar bottomAvatar">
             <img :src="'http://localhost:3000//public//img//'+ `${bottom.Avatarflag?bottom.nick:'undefined'}` +'.jpg'" class="face" />
            <div class="nick">{{bottom.nick}}</div>
          </div>
          <div class="contain">
            <div class="qian">
              <span class="iconfont icon-qian"></span>
              {{bottom.score}}
            </div>
            <div class="bei">
              <span class="iconfont icon-bei"></span>
              {{baseValue}}
            </div>
            <span class="iconfont icon-dizhu" v-if="bottom.flag"></span>
          </div>
          <main class="chat">
            <article ref="chatarea">
                <div
                v-for="(each,index) in Chat_Record" :key="index"
                  :class='each.nick == current_nick?"Mine":"Other"'
                >{{each.nick+'说：'+each.content}}</div>
            </article>
            <footer>
              <button @click="toggleChat">
                <span class="iconfont" :class="[ iscollapse ? 'icon-upward' : 'icon-down' ]"></span>
                <aside v-if='message'>{{message}}</aside>
              </button>
              <input type="text" v-model="inputcontent" />
              <button @click="commit">
                <span class="iconfont icon-fasong"></span>
              </button>
            </footer>
          </main>
        </div>
      </footer>
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
            <el-button type='primary' size='mini'>继续游戏</el-button>
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
import clock from "./clock.vue";
import { compare, judgement } from "../../static/util/fun";
import { ajax } from '../../static/util/ajax.js'
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
      overflag: Boolean,
      round: Number,
      baseValue: Number,
      iscollapse: true,
      message: 0
    };
  },
  computed: {
    ...mapState([
      "RoomMsg",
      "current_roomid",
      "current_nick",
      "Chat_Record",
      "over_msg"
    ]),
    basedelta: function() {
      return (600 - (this.bottom.poker.length * 30 - 30 + 92)) / 2;
    },
    flag_pass: function() {
      return this.standby.length;
    }, //round 0 1 2,
    showtop: function() {
      if (
        !this.left.king &&
        !this.right.king &&
        !this.bottom.king 
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
    Chat_Record:function(newValue, oldValue){
      this.message += 1
      if(!this.iscollapse)
        this.message = 0
    },
    RoomMsg: function(newValue, oldValue) {
      let re = newValue.filter(each => each.roomid == this.current_roomid)[0];
      this.Percount = re.member.length;
      if (re.lastPoker !== undefined && this.Percount == 3) {
        let { flag, jiaodizhu, lastPoker, round, overflag, baseValue } = re;
        this.baseValue = baseValue;
        this.round = round;
        this.overflag = overflag;
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
    async commit() {
      await this.$socket.emit("chat", { content: this.inputcontent });
      this.inputcontent = "";
      const chatarea = this.$refs.chatarea;
      chatarea.scrollTop = chatarea.scrollHeight
    },
    toggleChat() {
      this.iscollapse = !this.iscollapse;
      this.message = 0
      const chatarea = this.$refs.chatarea;
      const vi = chatarea.style.visibility
      if(vi == 'visible' )
        {
          chatarea.style.visibility = 'hidden'
          chatarea.style.transform = 'translateY(100%)'
        }
        else
        {
          chatarea.style.visibility = 'visible'
          chatarea.style.transform = 'translateY(0)'
        }
    },
    prepare(flag) {
      this.$socket.emit("prepare", { flag });
    }
  },
  components: { clock }
};
</script>
<style lang='scss' scoped>
.rootContain {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: url(../../static/img/bg.jpg);
  background-size: 106%;
  position: relative;
}
header {
  height: 15vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
header .topbtn {
  position: absolute;
  left: 20px;
  top: 20px;
  padding: 5px 10px;
  background: #e74c3c;
  outline: none;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  border: solid 1px #e74c3c;
}
header .btn:hover {
  cursor: pointer;
  color: #e74c3c;
  background: #fff;
}
header .toparea {
  width: 150px;
  height: 80%;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
header .toparea .smallpoker {
  position: unset;
}
main.otherplayer {
  flex: 1;
  width: 100vw;
  display: flex;
  justify-content: space-between;
}
main.otherplayer > div {
  height: 100%;
  width: 25vw;
  position: relative;
}
footer.player {
  height: 40vh;
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}
footer.player div.standby {
  height: 70px;
  width: 40%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
footer.player div.btn {
  width: 140px;
  height: 30px;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
footer.player div.btn button {
  border-radius: 5px;
  background: #e67e22;
  padding: 2px 10px;
}
footer.player div.btn button:hover {
  cursor: pointer;
  background: #d35400;
}
footer.player div.bg {
  width: 50%;
  height: 50%;
  position: relative;
}
footer.player div.info {
  width: 100%;
  height: 28px;
  position: relative;
}
footer.player div.info div.contain {
  position: absolute;
  left: 150px;
  font-size: 18px !important;
}
footer.player div.info div.contain div {
  float: left;
  margin-right: 20px;
}
footer.player div.info div.contain span {
  font-size: 20px;
}
footer.player div.info main.chat {
  width: 300px;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  right: 0;
  bottom: 0;
}
footer.player div.info main.chat article {
  visibility: hidden;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: silver 2px solid;
  background: #f2ecf0;
  transition: 0.5s all ease;
  align-items: flex-start;
}
footer.player div.info main.chat article div {
  max-width: 280px;
  margin: 5px;
  font-size: 12px;
  border-radius: 3px;
  padding: 5px;
  background: #fafafa;
  word-break: break-word;
  text-align: left;
}
footer.player div.info main.chat article .Mine {
  background: #9ce459;
  align-self: flex-end;
}
footer.player div.info main.chat footer {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  background: rgba(189, 195, 199, 0);
}
footer.player div.info main.chat footer input {
  width: 60%;
  outline: none;
  border-radius: 3px;
  border: 1px solid #2c3e50;
  padding: 5px;
  height: 25px;
  font-size: 18px;
}
footer.player div.info main.chat footer button {
  border-radius: 5px;
  border: 2px solid #2c3e50;
  color: #e74c3c;
  float: left;
  width: 15%;
  padding: 0;
  >aside{
    min-width: 18px;
    line-height: 18px;
    border-radius: 9px;
    padding: 0 5px;
    background: #e67e22;
    position: absolute;
    top: -9px;
    right: -7px;
    color: #fff;
  }
}
footer.player div.info main.chat footer button:hover {
  cursor: pointer;
  background: #f2ecf0;
  color: black;
}
.poker {
  background: url(../../static/img/poker.jpg) no-repeat;
  position: absolute;
  transition: all 0.6s, background 0s;
  color: pink;
  font-size: 40px;
  text-align: center;
  line-height: 122px;
}
.bigpoker {
  border-radius: 8px;
  width: 90px;
  height: 122px;
}
.smallpoker {
  border-radius: 4px;
  width: 46px;
  height: 63px;
  background-size: 1500%;
}
.Selected {
  transform: translateY(-10px);
}
div.Avatar {
  position: absolute;
  width: 84px;
  height: 84px;
}
div.Avatar img.face {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
}
div.Avatar div.nick {
  left: 42px;
  bottom: 0;
  height: 20px;
  position: absolute;
  background: rgba(143, 52, 60, 0.8);
  color: #f0f0f0;
  border-radius: 10px;
  transform: translate(-50%);
  padding: 0 10px;
}
.bottomAvatar {
  left: 20px;
  bottom: 0;
}
.leftAvatar {
  top: 20px;
  left: 40px;
}
.leftAvatar > .contain {
  position: absolute;
  top: 100%;
}
.leftAvatar > .contain > div {
  float: left;
  margin: 0 10px;
  color: white;
}
.leftAvatar > .contain span {
  color: white;
  font-size: 18px;
}
.rightAvatar {
  top: 20px;
  right: 40px;
}
.rightAvatar > .contain {
  position: absolute;
  top: 100%;
}
.rightAvatar > .contain > div {
  float: right;
  margin: 0 10px;
  color: white;
}
.rightAvatar > .contain span {
  color: white;
  font-size: 18px;
}
.icon-clock::before {
  font-size: 40px;
}
.dark {
  background-color: gray !important;
}
.coverLayer{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
    .centerArea {
    border: 1px red solid;
    margin: 120px auto;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 400px;
    > .topArea {
      line-height: 50px;
      border-bottom: 3px #ddd solid;
      text-align: center;
    }
    > .mainArea {
      background-color: rosybrown;
      height: 200px;
      color: black;
    }
    > .mainArea table {
      width: 100%;
      height: 100%;
      text-align: center;
    }
    > .btn {
      margin: 15px 0;
      align-self: flex-end;
      > button {
        margin: 0 15px;
      }
    }
  }
}
</style>
