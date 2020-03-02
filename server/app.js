const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(urlencodedParser)
const cors = require('cors')
const app = express()
const { db, shuffle, next } = require('./public/js/method')
const http = require('http')
const ws = require('socket.io')
const roommsg = []//[{roomid:'no1',member:[{nick:'nick',poker:[],flag:true},{nick:'nick'}],lastPoker}]
app.use(cors())
app.use(express.static(__dirname))
//router
router
.get('/',(req,res) => {
	res.send('<h1>title</h1>')
})
.post('/login',async(req,res) => {
	const {nick,password} = req.body
	if(nick.length > 10 || password.length < 3)
		return res.send({status:0,message:'昵称或密码长度不符合要求'})
	let {length} = await db(`select * from user where nick='${nick}'`)
	if(length){
	const result = await db(`select * from user where nick='${nick}' and password='${password}'`)//已存在昵称，验证密码
		if(result.length > 0)
			{
				// if(!result[0]['islogin'])
				// 	{
				// 		await db('update user set islogin=true where nick='+nick)
				// 	  res.send({status:2,message:'登陆成功',roommsg})
				// 	}
				// else
				// 	  res.send({status:5,message:'重复登陆'})
				 res.send({status:2,message:'登陆成功',roommsg})
			}
		else
			res.send({status:1,message:'密码错误'})
	}
	else{//新昵称，注册账号
		const {affectedRows} = await db(`insert into user values('${nick}','${password}','${new Date().getTime()}',0,true)`)
		if(affectedRows > 0)
			res.send({status:3,message:'新注册',roommsg})//Date.now()
		else 
			res.send({status:4,message:'注册失败'})
	}
})

app.use(router)
let server = http.createServer(app)
let io = ws(server)
//socket.io
function innershuffle(result) {
				const pokers = shuffle(),i = Math.floor(3 * Math.random())
				result.member.forEach((each,index) => 
					Object.assign(each,{poker:pokers[index],standby:[],flag:index==i?true:false,flag_right:true}))
				result.lastPoker = pokers[3]
				result.flag = i
				result.round = -1
				result.jiaodizhu = [[],[]]
}
io.on('connection',(socket) => {
	console.log('new user coming')
	const init_room = 'A(9DJ)+.?/$'
	let roomid = init_room
	socket.join(roomid)
	socket.on('join',async ({id}) => {
		const result = roommsg.filter(each => each.roomid == id && each.member.length < 3)
		if(result.length > 0)
			{
				socket.leave(init_room)
				roomid = id
				socket.join(roomid)
				const score = await db(`select score from user where nick='${socket._nick}'`)
				result[0].member.push({nick:socket._nick,score:score[0].score})//[roomid:'dasf',member:[{nick,poker}],lastpoker:]
				if(result[0].member.length == 3)
					innershuffle(result[0])
				socket.emit('receiver',{type:1,status:1,message:'加入房间成功',id,roommsg})
				// io.sockets.in(roomid).emit('renew',{roommsg})
				// io.sockets.in(init_room).emit('renew',{roommsg})
				io.emit('renew',{roommsg})
			}
		else
			socket.emit('receiver',{type:1,status:0,message:'加入房间失败，房间已满或不存在'})
		
	})
	socket.on('create',async ({id})=> {
		if(id.length == 0)
			return false
		let result = roommsg.filter(each => each.roomid == id )
		if(!result.length)//可以创建
		{
				roommsg.push({roomid:id,member:[]})
				result = roommsg.filter(each => each.roomid == id )[0]
				socket.leave(init_room)
				roomid = id
				socket.join(roomid)
				const score = await db(`select score from user where nick='${socket._nick}'`)
				result.member.push({score:score[0].score,nick:socket._nick})
			socket.emit('receiver',{type:2,status:1,message:'创建成功',id,roommsg})
			io.emit('renew',{roommsg})
		}else{//房间已存在，创建失败
			socket.emit('receiver',{type:2,status:0,message:'房间已存在，创建失败'})
		}
	})
	socket.on('chupai',({content,change}) => {
		console.log(content, socket._nick)
		const room = roommsg.filter(each => each.roomid == roomid)[0]
		if(!content)//未出牌 pass
				{
					next(room.member)
					io.sockets.in(roomid).emit('renew',{roommsg})
					return
				}
		const result = room.member.filter(each => each.nick == socket._nick)[0]
		result.poker = content
		result.standby = change
		next(room.member)
		io.sockets.in(roomid).emit('renew',{roommsg})
	})
	socket.on('jiaodizhu',(flag)=>{
		const room = roommsg.filter(each => each.roomid == roomid)[0]
		let i,result
		room.member.forEach((each, index) =>{
			if (each.nick == socket._nick)
				{
					i = index
					result = each
				}
		})
		if(i == 0 && room.round < 1)//-1 0 1
			{
				room.round++
			}
			room.jiaodizhu[room.round].push(flag)

		io.sockets.in(roomid).emit('renew',{roommsg})
	})
	socket.on('back',() => {
		const result = roommsg.filter(each => each.roomid == roomid)[0]
		let num
		if(result)
		{
			result.member.forEach((each,index) => {//nick
				if(each.nick == socket._nick)
				num = index
			})
				result.member.splice(num,1)
				io.emit('renew',{roommsg})
		}
	})
	socket.on('chat',({content}) => {
		io.sockets.in(roomid).emit('chat',{content,nick:socket._nick})
	})
	socket.on('report',({nick})=>{
		socket._nick = nick
	})
	socket.on('disconnect',async () => {
		let num
		console.log('someone disconnect!')
		socket.leave(roomid)
		const result = roommsg.filter(each => each.roomid == roomid)[0]
		if(result)
		{
			await db('update user set islogin=false where nick="'+socket._nick+'"')
			result.member.forEach((each,index) => {
				if(each.nick == socket._nick)
				num = index
			})
				result.member.splice(num,1)
				io.emit('renew',{roommsg})
		}
	})
})
server.listen(3000,() => {console.log('server start!')})