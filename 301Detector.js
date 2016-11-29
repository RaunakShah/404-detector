/* Crawler to detect 301 Moved Permanently errors */

var express  = require('express');
var app      = express();           	              	// Create the app with express 
var port = process.env['PORT'] || 3000;
var http = require('http');
var https = require('https');
var data = ''
var movedUrl = []  //Array of urls that have been relocated											
var linkNumber = 0
var counter = 0;
var crawler = new Object;
var flag = 0;
function request(url){
	counter++;
	//End of crawl list
	if(url.indexOf("https") == 0)						
		return;
	var req = http.request(url, function(res) {
		console.log('STATUS: ' + res.statusCode);
		//Status code = 301, moved permanently
		if(res.statusCode == 301){  							
			// res.headers.location contains new location
			console.log(url + ' has been moved to ' + JSON.stringify(res.headers.location)); 
			movedUrl.push(url);
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
			var extractUrl = new Array(expressionMatch.length);			
			var loopCount = 0; 
			for (loopCount = 0; loopCount < expressionMatch.length; loopCount++) {
				expressionSplit[loopCount] = new Array(20);
				extractUrl[loopCount] = new Array(20);
			}
			for(loopCount = 0; loopCount < expressionMatch.length; loopCount++){	
				expressionSplit[loopCount] = expressionMatch[loopCount].split(regEx3)		//Split BODY of response 
				extractUrl[loopCount] = expressionSplit[loopCount][1].match(/http(.)*/);	//Match Url strings from BODY	
			}
			for(loopCount = 0; loopCount < extractUrl.length; loopCount++){
					//If new urls exist in BODY
					if(extractUrl[loopCount]!=null){	
						var urlString = extractUrl[loopCount][0];
						crawler[urlString] = 1;
					}
			}			
			for(loopCount=0;loopCount<extractUrl.length;loopCount++){
					if(extractUrl[loopCount]!=null){		
						var urlString = extractUrl[loopCount][0];
						if(crawler[urlString]==1){
							var crawlUrl = urlString;
							crawler[urlString]++;	//Increment to avoid repeats
							if(counter==100){		//Set max limit for crawler
								flag = 1;
								break;
							}
							else								
							request(crawlUrl);		//Next url to crawl 
						}
						else	//Url has already been encountered and crawler function has been performed
						{
							console.log("Repeated URl: " + urlString);
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

req.end();
}

//Command line argument to contain source url
if (process.argv.length <= 2) {
    console.log("Add source url to command line");
    process.exit(-1);
}
//Begin crawl
request(process.argv[2]);
