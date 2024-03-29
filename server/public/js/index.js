const gE = id => document.getElementById(id)
const getr = n => n % 4 === 0 ? 3 : n % 4 - 1
const getc = n => Math.floor((n - 1) / 4)
let self_nick, nodes = [], current = []
window.onload = () => {
	let login = gE('login'), main = gE('main'), nick = gE('nick'), password = gE('password'), submit = gE('submit');
	document.getElementById('submit').onclick = () => {
		$.ajax({ url: '/login', method: 'post', data: { 'nick': nick.value, 'password': password.value } })
			.then(({ status, length = 2 }) => {//0 昵称或密码长度不符合要求 1 密码错误 2 登陆成功 3 新注册 4注册失败
				let str = `<h1>等待其他用户进入房间中，当前房间已有${length}人<h1>`
				switch (status) {
					case 0: console.log('昵称或密码长度不符合要求'); break;
					case 1: console.log('密码错误'); break;
					case 2: console.log('登陆成功'); login.style.display = 'none'; main.style.display = 'block'; self_nick = nick.value; break;
					case 3: console.log('新注册'); login.style.display = 'none'; main.style.display = 'block'; self_nick = nick.value; break;
					case 4: console.log('注册失败'); break;
				}
				main.innerHTML = str
			})
	}
	let socket = io.connect('/')
	socket.on('message', (obj) => {
		console.log(obj)
	})
	socket.on('chupai', obj => {
		console.log(obj)
	})
	socket.on('shuffle', ({ shuffle, member }) => {
		console.log(member)
		let sid = socket.id
		if (Reflect.has(shuffle, sid)) {
			let arr = shuffle[sid]
			main.className = 'bottom-player'
			main.innerHTML = null
			arr.forEach((each, index) => {
				let node = document.createElement('div')
				node.className = 'poker'
				node.style.backgroundPosition = getPosition(each)
				node.style.left = index * 30 + 'px'
				main.appendChild(node)
				node.flag = false
				node.index = index
				node.value = each
				node.onclick = toggle
				nodes.push(node)
			})
			let x;
			main.onmousedown = function ({ clientX: x0 }) {
				x = x0
			}
			main.onmouseup = function ({ clientX: x0 }) {
				const offsetLefts = nodes.map(each => each.offsetLeft)
				console.log(main.offsetLeft)
				x0 = x0 - x0 % 30 - 120
				x = x - x % 30 - 120
				if (x !== x0)
					nodes.filter(each => (each.offsetLeft >= x0 && each.offsetLeft <= x) || (each.offsetLeft <= x0 && each.offsetLeft >= x)).forEach(each => toggle.call(each))
			}

			/*main.onmousedown = function({clientX:x,clientY:y}){
			let node = document.createElement('div')
			this.appendChild(node)
			node.className = 'block'
			node.style.left = x
			node.style.top = y
				this.onmousemove = ({clientX,clientY}) => {
				const deltaX = clientX - x
				const deltaY = clientY - y
					if(deltaX > 0)
						node.style.width = deltaX;
					else{
						node.style.left = clientX
						node.style.width = -deltaX
					}
					if(deltaY > 0)
						node.style.height = deltaY;
					else{
						node.style.top = clientY
						node.style.height = -deltaY
					}
				}
			}
			main.onmouseup = function({clientX,clientY}){
				this.onmousemove = null
			}*/

			let box = document.createElement('div')
			box.className = 'butArea'
			let button1 = document.createElement('button')
			button1.innerText = '自动'
			let button2 = document.createElement('button')
			button2.innerText = '出牌'
			button2.onclick = function () {
				let a = nodes.filter(each => each.flag == true)
				let result = a.map(each => each.value)
				let indexs = []
				nodes.forEach((each, index) => {
					if (each.flag == true) {
						main.removeChild(each)
						indexs.push(index)
					}
				})
				indexs.reverse().forEach(each => {
					nodes.splice(each, 1)
				})
				nodes.forEach((each, index) => each.style.left = index * 30 + 'px')
				socket.send({ result, nick: self_nick, flag: false })
			}
			let button3 = document.createElement('button')
			button3.innerText = '不出'
			button3.onclick = function () {
				socket.send({ nick: self_nick, flag: true })
			}
			box.appendChild(button1)
			box.appendChild(button2)
			box.appendChild(button3)
			main.appendChild(box)
		}

	})
	const getPosition = (num) => {
		if (num < 53)
			return `${-10 - 105.5 * getc(num)}px ${-10 - 28 * 5 * getr(num)}px`//${-10-105.5*(each.column)}px ${-10-28*5*each.row}px
		else if (num == 53)
			return `${-10 - 105.5 * 1}px ${-10 - 28 * 5 * 4}px`
		else if (num == 54)
			return `${-10 - 105.5 * 0}px ${-10 - 28 * 5 * 4}px`
	}
	function toggle() {
		this.flag = !this.flag
		this.style.top = this.flag != true ? this.offsetTop + 22 + 'px' : this.offsetTop - 22 + 'px'
	}
}