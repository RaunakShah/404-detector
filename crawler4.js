
var express  = require('express');
var app      = express();                               // create our app w/ express
var port = process.env['PORT'] || 3000;
var http = require('http');
var https = require('https');
/*var postData = querystring.stringify({
  'msg' : 'Hello World!'
});
*/
var data = ''
var moved = []
var crawlLinks = []
var linkNumber = 0
crawlLinks[0] = 'sitemap.xml'
var j= 0;
var wrongUrl = ''
var crawler = new Object;
var flag = 0;
function request(url){
	//console.log("j=" + j + ' ' + url);
	console.log(linkNumber);
	console.log(url);
	if(url.indexOf("https") == 0)
		return;
	var req = http.request(url, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  /*if(res.statusCode==404){
		  wrongUrl += url;
		  console.log("wrong urls:" + wrongUrl);
		  request(expressionMatch[linknumber++]);
	  }
	  else
		*/  
	  res.setEncoding('utf8');
	  
	  res.on('data', function (chunk) {
		data += chunk;
		console.log('BODY: ' + data);
		
	  });
	  
	  res.on('end', function() {
			if(linkNumber == 0){	
				var regex = /http(.*)([^s])/
				var expressionMatch = data.match(regex);
				console.log(expressionMatch);
				crawlUrl = expressionMatch[linkNumber++];
				request(crawlUrl);			
			}
			else
				
					crawlUrl = expressionMatch[linkNumber++];
					request(crawlUrl);			
	});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);

		});
	req.end();
	});
}
request("http://www.rrap-software.com/sitemap.xml");
