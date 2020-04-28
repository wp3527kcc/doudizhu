<template>
  <div class="contain">
    <!-- <h2>请选择或创建一个房间以开始游戏</h2> -->
    <p data-font="请选择或创建一个房间以开始游戏" class="spotlight">请选择或创建一个房间以开始游戏</p>
    <div class="tableContain" v-if="RoomMsg.length">
      <div
        class="table"
        v-for="(each,index) in RoomMsg"
        :key="index"
        @click="comeRoom(each.roomid)"
      >
        <p>{{each.roomid}}号房间</p>
        <p>{{each.member.length}}/3</p>
        <span v-if="each.member.length==3">此房间已满</span>
        <span v-else>点击进入此房间</span>
      </div>
    </div>
    <div v-else>
      <h1>当前无房间，请创建</h1>
    </div>
    <input type="text" v-model="roomid" class="createRoom" placeholder="请输入您想创建的房间号" />
    <button @click="createRoom">创建新房间</button>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
import store from "../store";
export default {
  data() {
    return {
      roomid: "1"
    };
  },
  computed: {
    ...mapState(["RoomMsg", "current_nick", "current_roomid"])
  },
  methods: {
    comeRoom(id) {
      this.$socket.emit("join", { id, nick: this.current_nick });
      this.$router.push("/room");
    },
    createRoom() {
      this.$socket.emit("create", { nick: this.current_nick, id: this.roomid });
      this.$router.push("/room");
    }
  },
  mounted() {
    this.$socket.emit("report", { nick: this.current_nick });
  }
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.contain {
  padding: 5px;
  background: url(../../static/img/bg1.jpg);
  background-size: 106%;
  height: 100vh;
  width: 100vw;
  display: flex;
  color: #bbb;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .tableContain {
    display: flex;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
    margin: auto;
    .table {
      width: 200px;
      height: 200px;
      border: #2980b9 solid 4px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-radius: 30px;
      color: #95a5a6;
      text-align: center;
      cursor: pointer;
      p {
        font-size: 25px;
      }
      span {
        font-size: 20px;
      }
      &:hover{
          color: #222;
          background: silver;
      }
    }
    margin: 20px;
  }
  button {
    padding: 20px;
    border: none;
    outline: none;
    font-size: 40px;
    text-transform: uppercase;
    color: #eee;
    cursor: pointer;
    background-image: linear-gradient(
      -30deg,
      #1abc9c,
      #2ecc71,
      #27ae60,
      #2980b9,
      #8e44ad
    );
    background-size: 400%;
    transition: 0.8s ease all;
    border-radius: 10px;
    &:hover {
      background-position: 80% 80%;
      color: #333;
    }
  }
}
.createRoom {
  width: 240px;
  color: #333;
  font-size: 24px;
  text-align: center;
}
.spotlight {
  background-image: linear-gradient(
    -30deg,
    #1abc9c,
    #2ecc71,
    #27ae60,
    #2980b9,
    #8e44ad
  );
  font-size: 40px;
  padding: 20px;
  color: transparent;
  text-transform: uppercase;
  -webkit-background-clip: text;
  position: relative;
  &::after {
    content: attr(data-font);
    position: absolute;
    left: 20px;
    top: 20px;
    color: #777;
    clip-path: circle(80px at 50% 50%);
    animation: spotlight 4s ease-in-out infinite;
  }
}
@keyframes spotlight {
  to {
    clip-path: circle(80px at -20% 50%);
  }
  50% {
    clip-path: circle(80px at 120% 50%);
  }
  from {
    clip-path: circle(80px at -20% 50%);
  }
}
</style>