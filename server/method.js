var fs=require('fs')
exports.format=function(str){
	if(str<10)
		return '0'+str;
			return ''+str;
	}
exports.delete=function(id,comments,callback){
	for(var key in comments)
	if(comments[key].id==id)
		comments.splice(key, 1)
}
exports.edit=function(id,comments,callback){
	for(var key in comments)
	if(comments[key].id==id)
	return key
}
exports.add=function(id,callback){
	
}
exports.write=function(comments){
	var wstr=JSON.stringify(comments);
	 	fs.writeFile('./public/comment/comment.json',wstr,function(err){if(err)console.log(err)})
}
exports.read=function(url,callback){
	fs.readFile(url,'utf8',function(err,data)
{
	if(err) console.log(err)
	callback(data)
	})	
}
