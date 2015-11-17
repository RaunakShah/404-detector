
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
crawlLinks[0] = 'index.html'
var j= 0;
var crawler = new Object;
var flag = 0;
function request(url){
	//console.log("j=" + j + ' ' + url);
	j++
	var options = {
	  hostname: 'www.rrap-software.com',
	  port: 80,
	  path: crawlLinks[linkNumber],
	  //method: 'POST',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	  }
	};
	if(url.indexOf("https") == 0)
		return;
	var req = http.request(url, function(res) {
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  if(res.statusCode == 301){
		  console.log(url + ' has been moved to ' + JSON.stringify(res.headers.location));
		  moved.push(url);
		  
		  //console.log("moved = " + moved);
		  console.log(moved.length);
	  }
	  res.setEncoding('utf8');
	  
	  res.on('data', function (chunk) {
		data += chunk;
		//console.log('BODY: ' + data);
		
	  });
	  
	  res.on('end', function() {
			
			var regex = /<a[\s]?href[\s]?=[\s]?"([^<]*)">/g
			var regex2 = /(.*)"([^\s]*)"/
			var regex3 = /"/
			var expressionMatch = data.match(regex);
			var expressionSplit2 = new Array(expressionMatch.length);
			
			var expressionSplit = new Array(expressionMatch.length);
			for (var i = 0; i < expressionMatch.length; i++) {
				expressionSplit[i] = new Array(20);
			}
			for (var i = 0; i < expressionMatch.length; i++) {
				expressionSplit2[i] = new Array(20);
			}
			for(i =0;i<expressionMatch.length;i++){	
				//console.log(expressionMatch[i]);
				expressionSplit[i] = expressionMatch[i].split(regex3)
				//console.log(expressionSplit[i][1]);
			}
			for(i=0;i<expressionSplit.length;i++){
				expressionSplit2[i] = expressionSplit[i][1].match(/http(.)*/);
				if(expressionSplit2[i]!=null){
					
					//console.log(i + expressionSplit2[i][0]);
				}
			}
			for(i=0;i<expressionSplit2.length;i++){
					if(expressionSplit2[i]!=null){
						var name = expressionSplit2[i][0];
						crawler[name] = 1	;
					//console.log(crawler[name]);
					}
			}
			
			
			for(i=0;i<expressionSplit2.length;i++){
					if(expressionSplit2[i]!=null){
					
						var name2 = expressionSplit2[i][0];
						//console.log(name2);
						crawler['http://www.facebook.com/ecommerceinindia'] = 2;
						if(crawler[name2]==1){
							//crawlLinks.push(expressionSplit2[i][0]);
							var crawlUrl = name2
							crawler[name2]++;
							//console.log("j="+j);
							//console.log(crawlUrl);
							if(j==100){
								flag = 1;
								break;
							}
							else								
							request(crawlUrl);
						}
						else
						{
							console.log("repeat! " + name2);
						}
					}
						if(flag==1)
							break;
					
					
			}
			//console.log(crawlLinks.length);
			/*for(i=0;i<crawlLinks.length;i++){
				console.log(i + ' ' + crawlLinks[i]);
			}*/
			//console.log(expressionSplit);
			//console.log('No more data in response.')
			
	  })
});

		req.on('error', function(e) {
  console.log('problem with request: ' + e.statusCode);

});
// write data to request body
//req.write(postData);
req.end();
}

request("http://www.rrap-software.com/index.html");
