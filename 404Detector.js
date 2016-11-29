/* Crawler to detect 404 Page Not Found errors */

var express  = require('express');
var app      = express();                               // create the app with express
var port = process.env['PORT'] || 3000;
var http = require('http');
var https = require('https');
var data = ''
var crawlLinks = []
var linkNumber = 0
crawlLinks[0] = 'sitemap.xml'
var urlNotFoundList = ''
var crawler = new Object;
var expressionMatch;
var count=0;
function request(url){
	if(url.indexOf("https") == 0)
		return;
	var req = http.request(url, function(res) {
		//Print Status of every url response	
		console.log('STATUS: ' + res.statusCode );							
		// Status code = 404 indicates Page Not Found
		if(res.statusCode==404){											
			//Add current url to list of Not Founds
			urlNotFoundList += url; 											
			console.log("incorrect url:"+url);
		}
		else{
			res.setEncoding('utf8');
		}
		res.on('data', function (chunk) {
			data += chunk;
			//console.log('BODY: ' + data);
		});
	  
		//Locate website links  	  
		res.on('end', function() {
			//404 detection is performed only on source url
			if((linkNumber++) == 0){				 
				var regex = /(https?:\/\/[^\s]+)/g
				expressionMatch = data.match(regex);
				for(count=0;count<expressionMatch.length;count++){
				crawlUrl = expressionMatch[count];				
				//Next url to crawl
				request(crawlUrl);				
				}
			}
		});
	});
	
	//Error
	req.on('error', function(e) {								
			console.log('problem with request: ' + e.message);

		});
		req.end();
}

//Command line argument to contain source url
if (process.argv.length <= 2) {
    console.log("Add source url to command line");
    process.exit(-1);
}
//Begin crawl
request(process.argv[2]);
