// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var whiteList = ["google.com","google.com.np","nibl.com.np","facebook","esewa.com.np","gmail.com", "nepalpolice.gov.np", "hotmail.com", "live.com"];

var popupWindow=null;

function checkURLLength(tab)
{
	return size = tab.url.length();
}

function checkWhiteList(hostname)
{
	if(whiteList.indexOf(hostname) > -1)
		
	{
		return true;	
	}
	return false;
}

function get_top_domain(){
  var i,h,
    weird_cookie='weird_get_top_level_domain=cookie',
    hostname = document.location.hostname.split('.');
  for(i=hostname.length-1; i>=0; i--) {
    h = hostname.slice(i).join('.');
    document.cookie = weird_cookie + ';domain=.' + h + ';';
    if(document.cookie.indexOf(weird_cookie)>-1){
      document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + h + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return h;
    }
  }
}



function get_top_domain(){
  var i,h,
    weird_cookie='weird_get_top_level_domain=cookie',
    hostname = document.location.hostname.split('.');
  for(i=hostname.length-1; i>=0; i--) {
    h = hostname.slice(i).join('.');
    document.cookie = weird_cookie + ';domain=.' + h + ';';
    if(document.cookie.indexOf(weird_cookie)>-1){
      document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + h + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return h;
    }
  }
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  //openPopupWindow();
  // parent_disable();
  //child_open();
  	// checking whitelist
  var domainName = getDomainName(tab);
  if(domainName != "Error")
  {
	  if(checkWhiteList(domainName))
	  {
		 return true;
		}
	}
var hostName = getHostName(tab);

  
  var displayText="HTTPS : "
  var httpsVal= "";
	  if(checkingHttps(tab))
	  {
		return true;
	  }
	else
	{
		httpsVal = "False";
	}
	//alert('<pre>'+displayText+'</pre>');
 	 displayText = displayText.concat(httpsVal);
	 
 	//var myWindow=window.open('popup.html','Search Window','width=200,height=100')
	//myWindow.document.write("<p>This is 'myWindow'</p>")
	//myWindow.focus()
	
	displayText = displayText.concat("Search Google:").concat(hostName);
	  
 	alert(displayText);
	
    chrome.pageAction.show(tabId);
	
};

function IsPortNo(domainName)
{
	var portNo = domainName.split(":");
	if(portNo.length > 0)
	{
		if(parseFloat(portNo[portNo.length - 1]).toString() == portNo[portNo.length - 1])
		{
			return true;	
		}
		return false;							
	}
	return false;
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
function getHostName(tab)
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
	 if(IsPortNo(domainName))
	{
		var beforePort=domainName.split(":");
		if(beforePort.length < 2)
		{
			return "Error";				
		}
		var subdomains=beforePort[beforePort.length - 2].split(".");
		if(subdomains.length >= 2)
		{
			if(subdomains[subdomains.length - 1].length == 2)
			{
				return subdomains[subdomains.length -3];
			}
			else
			{
				return subdomains[subdomains.length -2];
			}
		}
	}
	else
	{		
		var subdomains=domainName.split(".");
		if(subdomains.length >= 2)
		{
			if(subdomains[subdomains.length - 1].length == 2)
			{
				return subdomains[subdomains.length -3];
			}
			else
			{
				return subdomains[subdomains.length -2];
			}
		}
		else
		{
			return "Error";	
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
			else
			{
				return subdomains[subdomains.length -2];
			}
		}
		else
		{
			return "Error";	
		}			
	}	
}

// checking HTTPS
function checkingHttps(tab)
{
	//alert('checking HTPPS');
	
	var withurl=tab.url.split("/");
	if(withurl.length > 3)
	{
		if((withurl[0].indexOf('https')) > -1)
		{
			return true;	
		}
		else
		{
			//alert(withurl[2].indexOf('https'));
			return false;	
		}
	}	
	
	return false;	
}

function openPopupWindow()
{
	// window.open('popup.html','Search in Google','width=700,height=500,toolbar=1,menubar=1,location=1,status=1,scrollbars=1,resizable=1,left=0,top=0',1);
 //window.open('popup.html','1383231532704','width=700,height=500,toolbar=1,menubar=1,location=1,status=1,scrollbars=1,resizable=1,left=0,top=0');
  //popupWindow = window.open('child_page.html','name','width=200,height=200');
   // popupWindow.focus();
 return true;
}



function popup()
{
    popupWindow = window.open('popup.html','name','width=200,height=200');
}

function parent_disable() {
if(popupWindow && !popupWindow.closed)
popupWindow.focus();
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
