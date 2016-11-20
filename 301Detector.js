/* Crawler to detect 301 Moved Permanently errors */

var express  = require('express');
var app      = express();           	              	// Create the app with express 
var port = process.env['PORT'] || 3000;
var http = require('http');
var https = require('https');
var data = ''
var moved = [] 					// array of urls that have been relocated
var crawlLinks = []				//List of url's in line 
var linkNumber = 0
crawlLinks[0] = 'index.html'
var counter = 0;
var crawler = new Object;
var flag = 0;
function request(url){
	counter++
	var options = {
	  hostname: 'www.rrap-software.com',
	  port: 80,
	  path: crawlLinks[linkNumber],
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	  }
	};
	if(url.indexOf("https") == 0)			//End of crawl list
		return;
	var req = http.request(url, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  if(res.statusCode == 301){  						//Status code = 301, moved permanently
		  console.log(url + ' has been moved to ' + JSON.stringify(res.headers.location)); // res.headers.location contains new location
		  moved.push(url);
		  //console.log(moved.length);
	  }
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		data += chunk;
		//console.log('BODY: ' + data);		
	  });
	  
//Locate website links on current url 
	  res.on('end', function() {
			var regEx = /<a[\s]?href[\s]?=[\s]?"([^<]*)">/g
			var regEx2 = /(.*)"([^\s]*)"/
			var regEx3 = /"/
			var expressionMatch = data.match(regEx);
			var expressionSplit = new Array(expressionMatch.length);
			var expressionSplit2 = new Array(expressionMatch.length);
			var loopCount = 0; 
			for (loopCount = 0; loopCount < expressionMatch.length; loopCount++) {
				expressionSplit[loopCount] = new Array(20);
				expressionSplit2[loopCount] = new Array(20);
			}
			for(loopCount = 0; loopCount < expressionMatch.length; loopCount++){	
				expressionSplit[loopCount] = expressionMatch[loopCount].split(regex3)
				expressionSplit2[loopCount] = expressionSplit[loopCount][1].match(/http(.)*/);	
				//console.log(expressionSplit[loopCount][1]);
			}
			for(loopCount = 0; loopCount < expressionSplit2.length; loopCount++){
					if(expressionSplit2[loopCount]!=null){
						var name = expressionSplit2[loopCount][0];
						console.log(name);
						crawler[name] = 1	;
					}
			}			
			for(loopCount=0;loopCount<expressionSplit2.length;loopCount++){
					if(expressionSplit2[loopCount]!=null){		
						var name2 = expressionSplit2[loopCount][0];
						crawler['http://www.facebook.com/ecommerceinindia'] = 2;
						if(crawler[name2]==1){
							var crawlUrl = name2
							crawler[name2]++;
							//console.log(crawlUrl);
							if(counter==100){
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
	  })
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.statusCode);
	});

// write data to request body
//request.write(postData);
req.end();
}
request("http://www.rrap-software.com/index.html");
