var http=require('http');
var fs=require('fs');
var template=require('art-template');
var url=require('url');
var server=http.createServer();
var comments=[
{name:'zhangsan',
message:'i have a dream',
datetime:'20181025'},
{name:'zhangsan1',
message:'i have a dream',
datetime:'20181025'},
{name:'zhangsan2',
message:'i have a dream',
datetime:'20181025'},
{name:'zhangsan3',
message:'i have a dream',
datetime:20181025}
];
server.on("request",function(req,res){
	var pathname=url.parse(req.url,true).pathname;
	
	if(pathname==='/'){
	  res.statusCode = 301
      res.setHeader('Location', '/htmldemo')
	  res.end();	
	  }
	else if(pathname==='/index'){res.end('<h1>index</h1>');}
	else if(pathname==='/sneak'){fs.readFile('../resource/sneak.html',function(err,data){
			if(err){return console.log('文件读取失败');}
			var str=data;
			res.setHeader("Content-Type","text/html;charset=utf-8");
			res.end(str);
		});}
	else if(pathname==='/image'){
		fs.readFile('../resource/demo.jpg',function(err,data){
		if(err){return console.log('文件读取失败');}
		 var str=data;
		res.setHeader("Content-Type","image/jpeg");
		res.end(str);
	});}
	else if(pathname=='/htmldemo'){
		fs.readFile('./demo.html',function(err,data){
		if(err){return console.log('文件读取失败');}
		 var htmlstr = template.render(data.toString(), {comments: comments})
		res.end(htmlstr);
	});}
	else if(pathname.indexOf('/public/')===0){
		fs.readFile('.'+pathname,function(err,data){
		if(err){console.log(err);}
		//res.setHeader("Content-Type","application/octet-stream");
		res.end(data);
	});}
	else if(pathname==='/comment'){
		var t=new Date();
	var jo={
	name:url.parse(req.url,true).query.name,
	message:url.parse(req.url,true).query.message,
	datetime:''+t.getFullYear()+'0'+(t.getMonth()+1)+t.getDate()
	}
	comments.push(jo);
      res.statusCode = 302;
      res.setHeader('Location', '/htmldemo')
	  res.end();
	}
	else
		res.end('<h1>404 NOT FOUND</h1>');
		}
	).listen(3000,function(){console.log('server running,port:3000')});