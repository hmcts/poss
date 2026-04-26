<%@ page language="Java" session="false" errorPage="error.jsp" isErrorPage="false" %>
<%    
    String testServer = request.getServerName() + ":" + request.getServerPort();
    String testPagesPath = request.getContextPath();
    String testBasePath = "jsunit/testRunner.html?testpage=" + testServer + testPagesPath;
    String additionalParams = "&autorun=true";
    String testScreenPath = "http://"+testServer+testPagesPath;
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3c.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>SUPS CaseMan Menu Page</title>
        
        <style>
        a { 
		  	font-weight: bold; 
		  	text-decoration:none; 
		  	color: #0000FF;
		}
        </style>
        
        <script language="JavaScript" type="text/javascript" >
        	var win = null;
            function openApplication()
            {
            	if ( win && win.open )
            	{
            		win.close();
     	      	}
	            var loggingLevel = document.forms.logging.loggingLevel.value;
	            var wpPRTwp  = "&wpPRTwp=" +document.forms.logging.wpPRTwp.checked;
	            var wpPRTora = "&wpPRTora="+document.forms.logging.wpPRTora.checked;
	            var wpDBGwp  = "&wpDBGwp="+document.forms.logging.wpDBGwp.checked;
	            win = window.open("./screens/caseman_menu/index.html" + loggingLevel + wpPRTwp + wpDBGwp + wpPRTora,"CasemanMainMenu","top=0,left=0,width=983,height=680,scrollbars=no")
            }
        </script>		
	</head>
	<body>
      <h2>CaseMan Menu Application</h2>
      <p><a href="javascript:openApplication()">CaseMan Form Menu</a></p>
    
      <form name="logging">
        Select desired Logging level:
        <select name="loggingLevel" id="loggingLevel">
          <option value="?logging=0" selected>Off</option selected>
          <option value="?logging=1">ERROR</option>
          <option value="?logging=2">WARN</option>
          <option value="?logging=3">INFO</option>
          <option value="?logging=4">DEBUG</option>
          <option value="?logging=5">TRACE</option>
        </select>
      <br/>&nbsp;<br/>
      <tt>Word Processing</tt>
      <ul>
      	<li><input type="checkbox" id="wpPRTora" checked="true">Allow Oracle Report Printing</li>
      	<li><input type="checkbox" id="wpPRTwp" checked="true">Allow Word Proccesing Printing</li>
      	<li><input type="checkbox" id="wpDBGwp">Allow Word Processing Debugging</li>
      </ul>
      </form>
 
      <tt>Unit Tests</tt>
      <ul>
      	<li><a href="<%=testBasePath%>/TestCaseManUtils.html<%=additionalParams%>">Run CaseMan Utils test suite</a></li>
      	<li><a href="<%=testBasePath%>/TestCaseManValidationHelper.html<%=additionalParams%>">Run CaseMan Validation Helper test suite</a></li>
      	<li><a href="<%=testBasePath%>/TestNavigationController.html<%=additionalParams%>">Run Navigation Controller test suite</a></li>
      	<li><a href="<%=testBasePath%>/TestMessages.html<%=additionalParams%>">Run CaseMan Messages test suite</a></li>
      </ul>

	</body>
</html>