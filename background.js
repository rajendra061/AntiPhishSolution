// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.



var errorStr = "Error";
var doubleSlash = "//";
var PhishingMsg = 'The website you are opening is suspicious. \nPlease do not provide any confidential information to the website.\n\n \n\n';
var DetailsMsg = '\n \n\n Click OK for details.';
var HttpMsg = 'The website asks for confidential information but it does not use encryption during data transmission. This makes your information unsecure.\n\n';
var TLDMsg = 'The website uses multiple top level domain (e.g., .com.np).\n\n';
var PortNoMsg = 'The website uses port other than 80 which is not recommended for website hosting. \n\n';
var IPAddressMsg = 'The website uses IP address (e.g.,';// 192.183.24.23) which is not recommended for website hosting.\n';
var IPAddressMsg2 = ') which is not recommended for website hosting.\n\n';
var URLLengthMsg = ' The website uses suspiciously lengthy URL.\n\n';
var ATMarkMsg = 'The website will suspiciously redirect to other site.\n\n';
var doubleSlashMsg = 'The website may suspiciously redirect to other site.\n\n';
var wordBasedMsg = 'The website url has sensitive words\n';
var BagOfWords = ["/","?",".","=","-","_"];

// 
var wordBased = ["webscr", "ebayisapi", "secure", "account", "login", "signin", "banking", "confirm"];
//var DoubleSlashMsg = '\nThe website has multile \\\\';

var URLLengthStd = 67; // PhishTank has 67 peak characters @report
var TLDdots = 4; // letimate website is less than 5
var ATMark = "@";


/*var tldCountries = [".edu", ".gov", ".mil", ".ac", ".ad", ".np", ".in", ".uk"];
var tlds = [".aero",".asia",".bike",".biz",".camera",".cat",".clothing",".com",".coop",".equipment",".estate",".eus",".gallery",".graphics",".guru",".info",".int",".holdings",".jobs",".lighting",".mobi",".museum",".name",".net",".org",".photography",".plumbing",".post",".pro",".singles",".tel",".travel",".ventures",".xxx"];*/

var whiteList = ["google.com","google.com.np","nibl.com.np","facebook","esewa.com.np","gmail.com", "nepalpolice.gov.np", "hotmail.com", "live.com", "thehimilayantimes.com", "ekantipur.com", "nepalnews.com"];
var tldCountries = ["ac", "ad", "np", "in", "uk", "jp"];
var TLDs = ["edu","gov", "mil","aero","asia","bike","biz","camera","cat","clothing","com","coop","equipment","estate","eus","gallery","graphics","guru","info","int","holdings","jobs","lighting","mobi","museum","name","net","org","photography","plumbing","post","pro","singles","tel","travel","ventures","xxx"];
var HTTPS = "https";

var popupWindow=null;

function checkURLLength(tab)
{
	return URLLengthStd < tab.url.length;	
}

function checkWhiteList(hostname)
{
	if(whiteList.indexOf(hostname) > -1)
		
	{
		return true;	
	}
	return false;
}
function customAlert(msg) {
var alertDiv = "<div style='position: fixed; top: 20px; left: 20px;'>"+msg+"</div>";
document.getElementsByTagName('body')[0].appendChild(alertDiv);
}
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) 
{ 
	//var TEST = false;
	//alert('test');
	//customAlert("This is test");
	
	//chrome.showModalDialog("TEST");
	//
	
	// For testing purpose
	/*if(!TEST)
	{
		var native_alert = alert;
	
		alert = function(msg) {
		console.log('call to alert() - message: '+msg);
		native_alert(msg);    
			}
	
		alert('intercepted!');
	
	
		return ;	
	} // end of test*/
	
		var detectionCount = 0;
		var EducativeMsg= "";
		var domainName = getDomainName(tab);
		
		if(domainName == errorStr)
		 {
			return false; 
		 }
		
		 // Checking White list
		 if(checkWhiteList(domainName))
		 {
			 return true;
		 }
		 		
		// Check HTTP Msg
		if(checkingHttps(tab))
		{
			return true;
		}
		var hostName = getHostName(domainName);
		var countMsg = "";
		if(hostName != errorStr)
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(HttpMsg);			
		}
		
		//var mtlds = checkMultipleTldsdots(domainName);
		
		// Check multiple TLDs
		if(checkMultipleTlds(domainName))
		{
			detectionCount++;
			countMsg = detectionCount + '. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(TLDMsg);
		}
		 
		//DoubleSlashMsg
		//var doubleSlashes = checkDoubleSlashes(tab);
		//if(doubleSlashes > 1)
		//{
		//	EducativeMsg = EducativeMsg.concat(DoubleSlashMsg);
		//	detectionCount++;
		//}
		 
		 
		// Check URL Length
		if(checkURLLength(tab))
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(URLLengthMsg);
		}
		
		//Is Port No
		if(IsPortNo(domainName) != -1)
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(PortNoMsg);
		}
				
		//IPAddressMsg
		if(IsIPAddress(domainName))
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(IPAddressMsg);
			EducativeMsg = EducativeMsg.concat(domainName);
			EducativeMsg = EducativeMsg.concat(IPAddressMsg2);
			
		}
			
		if(checkATMark(tab))
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(ATMarkMsg);
		}
		
		if (checkDoubleSlash(tab))
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(doubleSlashMsg);
		}
		
		if(checkwordBased(tab))
		{
			detectionCount++;
			countMsg = detectionCount+'. ';
			EducativeMsg = EducativeMsg.concat(countMsg);
			EducativeMsg = EducativeMsg.concat(wordBasedMsg);
		}
		

		//alert
		if(detectionCount > 1)
		{
			var displayMsg = PhishingMsg; //+DetailsMsg;
			//var answer = confirm(displayMsg);
			//if(answer)
			//{
				var allMsg = displayMsg.concat(EducativeMsg);
				alert (allMsg);	
			//}
			var googleSearch = 'https://www.google.com.np/?gws_rd=cr&ei=irLzUsVmye2IB5LHgagF#q=' + hostName;
			if (tab.url.indexOf('google') > -1 || hostName == "Error")
			{
				chrome.pageAction.show(tabId);
			}
			else
			{
				window.open(googleSearch, '_blank');
			}	
			chrome.pageAction.show(tabId);
		}
};

function IsPortNo(domainName)
{
	var portNo = domainName.split(":");
	if(portNo.length > 0)
	{
		if(parseFloat(portNo[portNo.length - 1]).toString() == portNo[portNo.length - 1])
		{
			return portNo[portNo.length - 1];	
		}
		return -1;							
	}
	return -1;
}


function IsIPAddress(domainName)
{
	var ipAddress = domainName.split(".");
	if(ipAddress.length > 0)
	{
		if(parseFloat(ipAddress[ipAddress.length - 1]).toString() == ipAddress[ipAddress.length - 1])
		{
			return true;	
		}
		return false;							
	}
	return false;
}

function checkWithTopTLDs(subDomain)
{
	if(TLDs.indexOf(subDomain) > -1)
	{
		//alert('i am inside subdomain true');
		return true;
	}
	//alert('i am outside subdomain false');
	return false;
		
}

function getHostName(domainName)
{
	
	if(IsIPAddress(domainName))
	{
		return domainName;	
	}
	 if(IsPortNo(domainName) != -1)
	{
		var beforePort=domainName.split(":");
		if(beforePort.length < 2)
		{
			return errorStr;				
		}
		var subdomains=beforePort[beforePort.length - 2].split(".");
		if(subdomains.length >= 2)
		{
			if(subdomains[subdomains.length - 1].length == 2)
			{
				return subdomains[subdomains.length -3];
			}
			return subdomains[subdomains.length -2];
		}
	}
	else
	{
		var subdomains=domainName.split(".");
		if(subdomains.length >= 2)
		{
			if(subdomains[subdomains.length - 1].length == 2 && checkWithTopTLDs(subdomains[subdomains.length -2]))
			{
				return subdomains[subdomains.length -3];
			}
			return subdomains[subdomains.length -2];
		}
		else
		{
			return errorStr;	
		}			
	}	
}

function getDomainName(tab)
{
	
	var withurl=tab.url.split("/");
	var domainName = new Array();
	if(withurl.length > 2)
	{
		domainName = withurl[2];
	}
	else
	{
		return "Error";
	}
	
	if(IsIPAddress(domainName))
	{
		return domainName;	
	}
	else
	{		
		// returning upto along with tld
		return domainName;
		var subdomains=domainName.split(".");
		if(subdomains.length >= 2)
		{
			if(subdomains[subdomains.length - 1].length == 2)
			{
				return subdomains[subdomains.length -3];
			}
			return subdomains[subdomains.length -2];
		}
		else
		{
			return "Error";	
		}			
	}	
}

// At Mark Check
function checkATMark(tab)
{
	if(tab.url.indexOf(ATMark) > -1)
	{
		return true;
	}
	return false;
}

// checking HTTPS
function checkingHttps(tab)
{
	//alert('checking HTPPS'); http://www.nagariknews.com/
	var withurl=tab.url.split("/");
	if(withurl.length < 3)
	{
		return false;
	}
	if((withurl[0].indexOf(HTTPS)) > -1)
	{
		return true;	
	}
	return false;	
}

function checkTokens(tokens)
{
	for (var i = 0; i < tokens.length; i++)
	{
		if(wordBased.indexOf(tokens[i]) > -1)
		{
			return true;	
		}
	}
	return false;
}
function checkwordBased(tab)
{
	for (var i = 0; i < BagOfWords.length; i++)
	{
		
		var tokens = tab.url.split(BagOfWords[i]);
		if (checkTokens(tokens))
		{
			return true;
		}
	}
	return false;
}

function checkMultipleTlds(domainName)
{
	
	var dotsNo=domainName.split(".").length-1;
	//alert(withurl);
	if(dotsNo > TLDdots )
	{
		return true;	
	}
	return false;
}


function checkDoubleSlash(tab)
{
	var totalDoubleSlash = tab.url.split(doubleSlash);
	//alert (afterDot);
	if(totalDoubleSlash.length > 2)
	{
		return true;
	}
	return false;	
}

//doubleSlash
/*function checkDoubleSlashes()
{
	var withurl=tab.url.split("/");
	//alert(withurl);
	var slashCounter = 0;
	for(var i =0; i< withurl.length; i++)
	{
		if(withurl[i].length < 2)
		{
			continue;
		}
		if(checkDoubleSlash(withurl[i]))
		{
			slashCounter += 1;
		}
	}
	if(tldCounter > 0)
	{
		return slashCounter;
	}
	return -1;		
}*/

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
