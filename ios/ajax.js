function loadXMLDoc(url,documentEle)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			// 获得响应数据的形式：1，responseText；2，responseXML
			//如果来自服务器的响应并非xml，使用responseText;
			var loadText= xmlhttp.responseText;
			document.getElementById(documentEle).innerHTML = loadText;
			//如果是xml，且需要对其xml对象进行分析的，使用responseXML;
			var xmlDoc= xmlhttp.responseXML;
			//document.getElementById(documentEle).innerHTML = xmlDoc;
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}

//直接调用loadXMLDoc(url);s