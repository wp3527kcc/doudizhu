const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});
router.use(urlencodedParser);
const cors = require("cors");
const app = express();
const { db, shuffle, next, _sort } = require("./public/js/method");
const { judgement } = require("./public/js/fun");
const http = require("http");
const ws = require("socket.io");
const roommsg = []; //[{roomid:'no1',member:[{nick:'nick',poker:[],flag:true},{nick:'nick'}],lastPoker}]
app.use(cors());
app.use(express.static(__dirname));
//router
router
  .get("/", (req, res) => {
    res.send("<h1>title</h1>");
  })
  .post("/login", async (req, res) => {
    const { nick, password } = req.body;
    if (nick.length > 10 || password.length < 3)
      return res.send({
        status: 0,
        message: "昵称或密码长度不符合要求",
      });
    let { length } = await db(`select * from user where nick='${nick}'`);
    if (length) {
      const result = await db(
        `select * from user where nick='${nick}' and password='${password}'`
      ); //已存在昵称，验证密码
      if (result.length > 0) {
        res.send({
          status: 2,
          message: "登陆成功",
          roommsg,
        });
      } else
        res.send({
          status: 1,
          message: "密码错误",
        });
    } else {
      //新昵称，注册账号
      const { affectedRows } = await db(
        `insert into user(id,nick,password,time,score,islogin) values('${+Math.random()
          .toString()
          .slice(
            2,
            6
          )}', '${nick}','${password}','${new Date().getTime()}',0,true)`
      );
      if (affectedRows > 0)
        res.send({
          status: 3,
          message: "新注册",
          roommsg,
        });
      else
        res.send({
          status: 4,
          message: "注册失败",
        });
    }
  });
app.use(router);
let server = http.createServer(app);
let io = ws(server);
//socket.io
function innershuffle(result) {
  result.baseValue = 1;
  const pokers = shuffle(),
    i = Math.floor(3 * Math.random());
  result.member.forEach((each, index) =>
    Object.assign(each, {
      poker: pokers[index],
      standby: [],
      flag: index == i ? true : false,
      king: false,
    })
  );
  result.lastPoker = pokers[3];
  result.flag = i;
  result.round = 0;
  result.overflag = false;
  result.jiaodizhu = [[], []];
  result.jiaodizhu[0].length = 3;
  result.jiaodizhu[1].length = 3;
}
io.on("connection", (socket) => {
  console.log("new user coming");
  const init_room = "A(9DJ)+.?/$";
  let roomid = init_room;
  socket.join(roomid);
  socket.on("join", async ({ id }) => {
    const result = roommsg.filter(
      (each) => each.roomid == id && each.member.length < 3
    );
    if (result.length > 0) {
      socket.leave(init_room);
      roomid = id;
      socket.join(roomid);
      const score = await db(
        `select score from user where nick='${socket._nick}'`
      );
      const exists = (url) => {
        return new Promise((resolve, reject) => {
          fs.exists(url, (flag, err) => {
            if (err) reject(err);
            resolve(flag);
          });
        });
      };
      const Avatarflag = await exists(`public/img/${socket._nick}.jpg`);
      result[0].member.push({
        nick: socket._nick,
        score: score[0].score,
        Avatarflag,
      }); //[roomid:'dasf',member:[{nick,poker}],lastpoker:]
      if (result[0].member.length == 3) innershuffle(result[0]);
      socket.emit("receiver", {
        type: 1,
        status: 1,
        message: "加入房间成功",
        id,
        roommsg,
      });
      io.emit("renew", {
        roommsg,
      });
    } else
      socket.emit("receiver", {
        type: 1,
        status: 0,
        message: "加入房间失败，房间已满或不存在",
      });
  });
  socket.on("create", async ({ id }) => {
    if (id.length == 0) return false;
    let result = roommsg.filter((each) => each.roomid == id);
    if (!result.length) {
      //可以创建
      roommsg.push({
        roomid: id,
        member: [],
        baseValue: 1,
      });
      result = roommsg.filter((each) => each.roomid == id)[0];
      socket.leave(init_room);
      roomid = id;
      socket.join(roomid);
      const score = await db(
        `select score from user where nick='${socket._nick}'`
      );
      result.member.push({
        score: score[0].score,
        nick: socket._nick,
      });
      socket.emit("receiver", {
        type: 2,
        status: 1,
        message: "创建成功",
        id,
        roommsg,
      });
      io.emit("renew", {
        roommsg,
      });
    } else {
      //房间已存在，创建失败
      socket.emit("receiver", {
        type: 2,
        status: 0,
        message: "房间已存在，创建失败",
      });
    }
  });
  socket.on("chupai", ({ content, change }) => {
    const room = roommsg.filter((each) => each.roomid == roomid)[0];
    if (!change) {
      //未出牌 pass
      next(room.member);
      io.sockets.in(roomid).emit("renew", {
        roommsg,
      });
      return;
    }
    if (judgement(change).type == "BOOM") room.baseValue *= 2;
    const result = room.member.filter((each) => each.nick == socket._nick)[0];
    result.poker = content;
    result.standby = change;
    next(room.member);
    io.sockets.in(roomid).emit("renew", {
      roommsg,
    });
    if (!content.length && change.length) {
      const dizhu = room.member.filter((each) => each.king)[0];
      const nongmings = room.member.filter((each) => !each.king);
      let v = room.baseValue,
        win = result.king ? 1 : -1;
      v *= win;
      const prep = [
        db(`update user set score=score+${v * 2} where nick='${dizhu.nick}'`),
        db(
          `update user set score=score+${-v} where nick='${nongmings[0].nick}'`
        ),
        db(
          `update user set score=score+${-v} where nick='${nongmings[1].nick}'`
        ),
      ];
      Promise.all(prep);

      db(
        `select score from user where nick='${dizhu.nick}' or nick='${nongmings[0].nick}' or nick='${nongmings[1].nick}'`
      ).then((result, err) => {
        const r = [
          {
            nick: dizhu.nick,
            score: result[0].score,
            delta: 2 * v,
          },
          {
            nick: nongmings[0].nick,
            score: result[1].score,
            delta: -v,
          },
          {
            nick: nongmings[1].nick,
            score: result[2].score,
            delta: -v,
          },
        ];
        room.overflag = true;
        io.sockets.in(roomid).emit("gameover", {
          result: r,
        });
        room.member.forEach((each) =>
          r.forEach((e) => {
            if (each.nick == e.nick) each.score = e.score;
          })
        );
        io.sockets.in(roomid).emit("renew", {
          roommsg,
        });
      });
    }
  });
  socket.on("jiaodizhu", ({ flag }) => {
    const room = roommsg.filter((each) => each.roomid == roomid)[0];
    let i, result;
    if (flag) room.baseValue *= 2;
    room.member.forEach((each, index) => {
      if (each.nick == socket._nick) {
        i = index;
        result = each;
      }
    });
    room.jiaodizhu[room.round][i] = flag;
    if (room.round == 0 && !room.jiaodizhu[0].includes(undefined)) {
      //第一轮最后一次 叫地主轮完成
      const { length } = room.jiaodizhu[0].filter((each) => each);
      if (length == 1) {
        //直接开始游戏，将地主牌派给地主
        const i = room.jiaodizhu[0].indexOf(true);
        const tar = room.member[i];
        tar.poker.push(...room.lastPoker);
        tar.poker.sort(_sort);
        tar.king = true;
        room.member.forEach((each) => (each.flag = false));
        tar.flag = true; //出牌权给到地主
        room.round = 2;
      } else if (length == 0) innershuffle(room); //重新洗牌
      else {
        //继续抢地主
        next(room.member, room.jiaodizhu[0]);
        room.jiaodizhu[0].forEach((each, index) => {
          if (!each) room.jiaodizhu[1][index] = false;
        });
      }
    } else if (room.round == 1) {
      if (flag) {
        result.poker.push(...room.lastPoker);
        result.poker.sort(_sort);
        result.king = true;
        room.round = 2;
      } else {
        if (!room.jiaodizhu[1].includes(undefined)) {
          const arr = [(room.flag + 2) % 3, (room.flag + 1) % 3, room.flag];
          const re = [
            room.jiaodizhu[0][arr[0]], //0 2 => 1 => 0
            room.jiaodizhu[0][arr[1]], //1 0 => 2 => 1
            room.jiaodizhu[0][arr[2]],
          ]; // 2 1 => 0 => 2
          let index = re.indexOf(true); //0 1 2
          index = arr[index];
          room.member[index].poker.push(...room.lastPoker);
          room.member[index].poker.sort(_sort);
          room.member[index].king = true;
          room.round = 2;
        } else next(room.member, room.jiaodizhu[0]);
      }
    } else next(room.member);
    if (i == (room.flag + 2) % 3 && room.round < 2)
      //0 1 2
      room.round++;
    io.sockets.in(roomid).emit("renew", {
      roommsg,
    });
  });
  socket.on("back", () => {
    const result = roommsg.filter((each) => each.roomid == roomid)[0];
    let num;
    if (result) {
      result.member.forEach((each, index) => {
        //nick
        if (each.nick == socket._nick) num = index;
      });
      result.member.splice(num, 1);
      io.emit("renew", {
        roommsg,
      });
    }
  });
  socket.on("chat", ({ content }) => {
    io.sockets.in(roomid).emit("chat", {
      content,
      nick: socket._nick,
    });
  });
  socket.on("report", ({ nick }) => {
    socket._nick = nick;
  });
  socket.on("disconnect", async () => {
    let num;
    console.log("someone disconnect!");
    socket.leave(roomid);
    const result = roommsg.filter((each) => each.roomid == roomid)[0];
    if (result) {
      await db(
        'update user set islogin=false where nick="' + socket._nick + '"'
      );
      result.member.forEach((each, index) => {
        if (each.nick == socket._nick) num = index;
      });
      result.member.splice(num, 1);
      result.round = 0;
      io.emit("renew", {
        roommsg,
      });
    }
  });
});
server.listen(3000, () => {
  console.log("server start!");
});
