let mysql = require('mysql')
let config = mysql.createConnection({
	host: 'localhost',
	database: 'xscj',
	port: 3306,
	charset: 'utf8'
})
config.connect()

function query(sql, callback) {
	config.query(sql, (error, results) => {
		if (error) callback(error, null)
		callback(null, results)
	})
}

exports.shuffle = function(){
	const arr = []
	const _sort = (f,s) => {
		if(f>52||s>52)
			return f-s
		if(f<9&&s>8)return 1;
		if(f>8&&s<9)return -1;
		else return f-s
		}
	for(let i = 0 ;i<54;i++)
		arr.push(i+1)
	let count = 0
	while(count < 1e4){
		count++
		let randomIndex = Math.random()
		;[arr[Math.floor(54*randomIndex)], arr[0]] = [arr[0], arr[Math.floor(54*randomIndex)]]
	}
	return [arr.slice(0,17).sort(_sort),arr.slice(17,34).sort(_sort),arr.slice(34,51).sort(_sort),arr.slice(51,54).sort(_sort)]
}

exports.query = function (sql, callback) {
	config.query(sql, (error, results) => {
		if (error) callback(error, null);
		else callback(null, results)
	})
}

exports.db = function (sql) {
	// console.log(sql)
	return new Promise(
		function (resolve, reject) {
			query(sql, function (err, result) {
				if (!err)
					resolve(result)
				else
					console.error(err)
			})
		}
	)
}
exports.next = function (obj){
		let index
		obj.forEach((each,i) => {
			if (each.flag){
				index = i
				each.flag = false
			}
		})
		index = index == 2 ? 0 : index + 1
		obj[index].flag = true
		obj[index].standby = []
}