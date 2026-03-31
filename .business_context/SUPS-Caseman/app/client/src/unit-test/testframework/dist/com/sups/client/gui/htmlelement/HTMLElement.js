//==================================================================
//
// HTMLElement.js
//
// Implement some of the IE HTMLElement APIs on other browsers
//
//==================================================================


// If this browser isn't IE then implement IE's proprietry contains()
// method as it's rather useful.
if(window.addEventListener != null)
{
	HTMLElement.prototype.contains = function (oEl)
	{
		if (oEl == this) return true;
		if (oEl == null) return false;
		return this.contains(oEl.parentNode);
	};
	
	HTMLElement.prototype.__defineGetter__(
		"innerText",
		function()
		{
			HTMLElement.getInnerText(this);
		}
	);

	HTMLElement.prototype.__defineSetter__(
		"innerText",
		function (sText)
		{
   			this.innerHTML = sText.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
	);
	
	
	HTMLElement.getInnerText = function(e)
	{
		var result = "";
		var kids = e.childNodes;
		for(var i = 0, l = kids.length; i < l; i++)
		{
			var kid = kids[i];
			
			switch (kid.nodeType)
			{
				case 1:		// Element
				{
					// Replace <br> elements with \n
					if("BR" == kid.nodeName)
					{
						result += "\n";
					}
					break;
				}
				
				case 3:		// TextNode
				{
					// Append text content to result
					result += kid.nodeValue;
				}
			}
		}
		
		return result;
	}
}