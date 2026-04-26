var editor;
var spellCheckURL="/jspelliframe2k4/JSpellIFrame.jsp";

//
// Extracted from JSpellIFrame2k4 and modified, see // CHANGED
//

var checkWindow;
var styleSheetURL="jspell.css";
var jspellpopupurl="/jspelliframe2k4/jspellpopup.html";
// CHANGED 1 line:
//var disableLearn=false; // set to true, to remove the Learn words capability
var disableLearn=true; // set to true, to remove the Learn words capability
var forceUpperCase=false; // force suggestions and spell checker to use upper case
var ignoreIrregularCaps=false;	// ignore lower case sentence beginnings, etc.
var ignoreFirstCaps=false;	// ignore if first character in a field is lowercase
var ignoreNumbers=true; // ignore words with embedded numbers
var ignoreUpper=false; // ignore words in upper case
var ignoreDouble=false; // ignore repeated words
var confirmAfterLearn=false; // show warning before user 'learns' a word
var supplementalDictionary=""; // optional supplemental word list kept at server.
var language="English (US)";
var parseText;

function highlight(position) 
{
	var range=editor.document.body.createTextRange();
	range.move("word",position);
	range.moveEnd("word",1);
	text=range.text;
	text=text.replace(/\W+$/,''); // strip spaces
	if(text.length==range.text.length-1)
	{
		range.moveEnd("character",-1);
	}
	range.select();
}

function replaceWord(word,position,validreplacement)
{
	var range=editor.document.body.createTextRange();
	range.move("word",position);
	range.moveEnd("word",1);
	text=range.text;
	text=text.replace(/\W+$/,''); // strip spaces
	if(text.length==range.text.length-1)
	{
		range.moveEnd("character",-1);
	}
	range.text=word;
}

function replaceAll(word,position,errorWord,validReplacement)
{
	var range=editor.document.body.createTextRange();
	range.move("word",position);
	var moved=range.moveEnd("word",1);
	var count=0;
	while(moved>0)
	{
		text=range.text;
		text=text.replace(/\W+$/,''); // strip spaces
		if(text.length==range.text.length-1)
		{
			range.moveEnd("character",-1);
		}
		if(range.text==errorWord)
		{
			range.text=word;
			count++;
		}

		range.moveStart("word",1);
		moved=range.moveEnd("word",1);
	}
	return count;
}

function nohighlight()
{
	var range=editor.document.body.createTextRange();
	range.move("word",0);
	range.select();
	editor.focus();
}

function parse(position)
{
	var range=editor.document.body.createTextRange();
	range.move("word",position);
	var moved=range.moveEnd("word",1);
	// moves word by word
	var count=position;
	parseText="";
	var specialcase;
	if(position==0)
		specialcase=" T";
	else
		specialcase=" F";
	if(moved>0)
	{
		text=range.text;
		text=text.replace(/[\ \n\r]+$/,'');	// trim trailing spaces.
		if(text=="." || text=="!" || text=="?")
			specialcase=" T";
		else
		{
			if(moved!=0 && text.match("[A-Za-z]"))
				parseText+=" "+count+" "+text+specialcase; // extracts the words
			specialcase=" F";
		}
		while(true)
		{
			range.moveStart("word",1);
			moved=range.moveEnd("word",1);
			count++;
			text=range.text;
			text=text.replace(/[\ \n\r]+$/,'');	// trim trailing spaces.
			if(text=="." || text=="!" || text=="?")
				specialcase=" T";
			else
			{
				if(moved!=0 && text.match("[A-Za-z]"))
					parseText+=" "+count+" "+text+specialcase; // extracts the words
				specialcase=" F";
			}
			if(moved==0)
				break;
		}	
	}
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
	begin = dc.indexOf(prefix);
	if (begin != 0) return null;
  } else
	begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
	end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

/* This function takes the editor object as a parameter. */
// CHANGED - Added languageLabel arg
function ActionSpellCheck(objname, languageLabel)
{
    // CHANGED - Add 4 lines:
    var ac = Services.getAppController();	
    spellCheckURL = Services.getSpellCheckURL();
    jspellpopupurl = Services.getSpellCheckPopup();
    language = languageLabel;
    

	this.editor=objname;
	// CHANGED - Comment out 1 line:
	//window.event.cancelBubble=true;
	parse(0);

	var w = 1024, h = 768;
	if (document.all || document.layers)
	{
		w=eval("scre"+"en.availWidth"); h=eval("scre"+"en.availHeight");
	}
	var leftPos = (w/2-260/2), topPos = (h/2-180/2);
	if((checkWindow==null || checkWindow.closed) && navigator.appName=='Microsoft Internet Explorer')
		checkWindow=window.open(jspellpopupurl, "checker", "width=260,height=180,top="+topPos+",left="+leftPos+",toolbar=no,status=no,menubar=no,directories=no,resizable=no");
	checkWindow.focus();
}

function  EditorGetText()
{
	return editor.document.body.innerText;
}

function  EditorSetText(text)
{
	text = text.replace(/\n/g, "<br>");
	editor.document.body.innerHTML = text;
}

function  EditorGetHTML()
{
	if (this.tm) {
		return editor.document.body.innerText;
	}
	return editor.document.body.innerHTML;
}

function  EditorSetHTML(html)
{
	if (this.tm) {
		editor.innerText = html;
	}
	else {
		editor.innerHTML = html;
	}
}
