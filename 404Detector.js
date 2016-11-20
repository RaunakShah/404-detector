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

function request(url){
	console.log(url);
	if(url.indexOf("https") == 0)
		return;
	var req = http.request(url, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  if(res.statusCode==404){												// Status code = 404 indicates Page Not Found
		  urlNotFoundList += url; 											//Add current url to list of Not Founds.
		  console.log("incorrect url:" + urlNotFoundList);
		  request(expressionMatch[linknumber++]);
	  }
	  else
		res.setEncoding('utf8');
	  
	  res.on('data', function (chunk) {
		data += chunk;
		//console.log('BODY: ' + data);
		
	  });
	  
//Locate website links on current url 	  
	  res.on('end', function() {
			if(linkNumber == 0){	
				var regex = /http(.*)([^s])/
				var expressionMatch = data.match(regex);
				//console.log(expressionMatch);
			}
			crawlUrl = expressionMatch[linkNumber++];				//Next url to crawl
			request(crawlUrl);						
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);

		});
		req.end(); 							
	});
}
request("http://www.rrap-software.com/sitemap.xml");
