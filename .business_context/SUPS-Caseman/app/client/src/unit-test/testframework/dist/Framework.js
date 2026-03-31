
function fwException(msg,rootCause)
{this.message=msg;this.m_rootCause=rootCause;this.exceptionHierarchy=new Array('Error');}
fwException.prototype=new Error();fwException.prototype.constructor=fwException;fwException.m_fatalExceptionHandler=function(exception){fwException._defaultFatalExceptionHandler(exception);};fwException.prototype.toString=function()
{var str="Exception message: "+this.message;if(null!=this.m_rootCause)
{str+="\n  Root cause: "+fwException.getErrorMessage(this.m_rootCause);}
return str;}
fwException.prototype.getRootCause=function()
{return this.m_rootCause;}
fwException.setFatalExceptionHandler=function(handler)
{fwException.m_fatalExceptionHandler=handler;}
fwException.getErrorMessage=function(ex)
{if(ex instanceof fwException)
{return ex.toString();}
else if(ex instanceof Error)
{return ex.message;}
return"Non Error based object thrown, .toString() result is: "+ex.toString();}
fwException._defaultFatalExceptionHandler=function(exception)
{appC=top.AppController.getInstance();if(appC.m_requestCount>0)
{appC._hideProgress();}
var exMsg=fwException.getErrorMessage(exception);var alertMsg=null;if(exMsg!=null&&exMsg!="")
{alertMsg="An unexpected application error has occurred. The associated error message is shown below: \n\n'"+
exMsg+"'\n\n Unfortunately the application may no longer work correctly. Therefore, the application \n"+"will terminate when you close this alert message.";}
else
{alertMsg="An unexpected application error has occurred. Unfortunately, the application may no longer work\n"+"correctly. Therefore, the application will terminate when you close this alert message.";}
alert(alertMsg);appC.shutdown();}
fwException.invokeFatalExceptionHandler=function(exception)
{fwException.m_fatalExceptionHandler(exception);}
String.m_trimRegExp=/^\s*(.*?)\s*$/;String.trim=function(s)
{return s.replace(String.m_trimRegExp,"$1");}
String.strcmp=function(s1,s2)
{if(s1>s2)
{return 1;}
else if(s1<s2)
{return-1;}
return 0;}
function Comparators(){};Comparators.numericalSort=function(a,b)
{var n1=parseInt(a);var n2=parseInt(b);if(isNaN(n1))n1=0;if(isNaN(n2))n2=0;return n2-n1;}
Comparators.numericalFloatingPointSort=function(a,b)
{var returnValue=null;var f1=parseFloat(a);var f2=parseFloat(b);var isf1NaN=false;if(isNaN(f1))
{isf1NaN=true;}
var isf2NaN=false;if(isNaN(f2))
{isf2NaN=true;}
if(isf1NaN&&isf2NaN)
{returnValue=0;}
else if(isf1NaN&&!isf2NaN)
{returnValue=1;}
else if(!isf1NaN&&isf2NaN)
{returnValue=-1;}
else
{if(f2>f1)
{returnValue=1;}
else if(f1>f2)
{returnValue=-1;}
else
{returnValue=0;}}
return returnValue;}
Comparators.alphabeticalSort=function(a,b)
{if(a>b)
return-1;else if(b>a)
return 1;else
return 0;}
Comparators.alphabeticalSortLowToHigh=function(a,b)
{return(-1*Comparators.alphabeticalSort(a,b));}
Comparators.alphabeticalLocaleCompareSort=function(a,b)
{return a.localeCompare(b);}
Comparators.alphabeticalCaseInsensitiveSort=function(a,b)
{var Ua=a.toUpperCase();var Ub=b.toUpperCase();if(Ua>Ub)
return-1;else if(Ub>Ua)
return 1;else
return 0;}
function ArrayUtils(){};ArrayUtils.contains=function(array,object)
{for(var i=0;i<array.length;i++)
{if(array[i]==object)
{return true;}}
return false;}
SerialisationUtils=function(){};SerialisationUtils.stringArrayToLiteral=function(array)
{str="[";for(var i=0;i<array.length;i++)
{str+=array[i]+",";}
if(array.length>0)
{str=str.substring(0,str.length-1);}
str+="]";return str;}
SerialisationUtils.printListeners=function(node)
{var printString="";printString+=node.serialise()+"\n";for(var a in node.m_childNodes)
{if(a!="__parent__"&&a!="__proto__")
{printString+=SerialisationUtils.printListeners(node.m_childNodes[a]);}}
for(var a in node.m_predicates)
{if(a!="__parent__"&&a!="__proto__")
{printString+=SerialisationUtils.printListeners(node.m_predicates[a]);}}
return printString;}
SerialisationUtils.printDataDep=function()
{var adaptors=FormController.getInstance().m_adaptors;str="FormController.dataDepPreCompArray = new Array(";for(var i=0;i<adaptors.length;i++)
{var m_parentsString=SerialisationUtils.convertObjectOfAdaptorsToStringArray(adaptors[i].m_parents);var m_childrenString=SerialisationUtils.convertArrayOfAdaptorsToString(adaptors[i].m_children);var m_containedChildren=SerialisationUtils.convertArrayOfAdaptorsToString(adaptors[i].m_containedChildren);var parentContainer=adaptors[i].m_parentContainer;var parentContainerStr="";if(parentContainer==null)
{parentContainerStr="null";}
else
{parentContainerStr="'"+parentContainer.getId()+"'";}
str+="new Array('"+adaptors[i].getId()+"',"
+m_parentsString+","
+m_childrenString+","
+m_containedChildren+","
+parentContainerStr
+")\n,";}
if(adaptors.length>0)
{str=str.substring(0,str.length-1);}
str+=");\n";return str;}
SerialisationUtils.printPrecompile=function()
{var resultsWindow=window.open("","Results","height=600,width=400,scrollbars=yes,resizable=yes");var preComp=SerialisationUtils.getPrecompile();resultsWindow.document.write("<DIV>"+preComp+"</DIV>");}
SerialisationUtils.getPrecompile=function()
{var dm=FormController.getInstance().getDataModel();var str="FormController.regNodes = new Object();";var listenerString=SerialisationUtils.printListeners(dm.m_root);var dataDepString=SerialisationUtils.printDataDep();var tabOrderString=SerialisationUtils.getTabOrder();return str+listenerString+dataDepString+tabOrderString;}
SerialisationUtils.getTabOrder=function()
{var tabArray=FormController.getInstance().m_tabbingManager.m_tabOrder;return"FormController.tabOrder = "+SerialisationUtils.convertArrayOfAdaptorsToString(tabArray)+";";}
SerialisationUtils.convertArrayOfAdaptorsToString=function(adaptorArray)
{if(adaptorArray==null)
{return"new Array()";}
var str="new Array(";var foundAdaptor=false;for(var i=0;i<adaptorArray.length;i++)
{str+="'"+adaptorArray[i].getId()+"',";foundAdaptor=true;}
if(foundAdaptor)
{str=str.substring(0,str.length-1);}
str+=")";return str;}
SerialisationUtils.convertObjectOfAdaptorsToStringArray=function(adaptorObject)
{if(adaptorObject==null)
{return"new Array()";}
var str="new Array(";var foundAdaptor=false;for(var a in adaptorObject)
{str+="'"+adaptorObject[a].getId()+"',";foundAdaptor=true;}
if(foundAdaptor)
{str=str.substring(0,str.length-1);}
str+=")";return str;}
SerialisationUtils.convertStringArrayToAdaptorArray=function(array)
{var newArray=new Array();var m_adaptors=FormController.getInstance().m_adaptors;for(var i=0,l=array.length;i<l;i++)
{newArray.push(m_adaptors[array[i]]);}
return newArray;}
SerialisationUtils.convertStringArrayToAdaptorObject=function(array)
{var newObject=new Array();var m_adaptors=FormController.getInstance().m_adaptors;for(var i=0,l=array.length;i<l;i++)
{newObject[array[i]]=m_adaptors[array[i]];}
return newObject;}
StandardDialogTypes={OK:0,OK_CANCEL:1,YES_NO:2,YES_NO_CANCEL:3};StandardDialogButtonTypes={OK:0,CANCEL:1,YES:2,NO:3};BusinessLifeCycleEvents={EVENT_RAISE:"raise",EVENT_LOWER:"lower",EVENT_CANCEL:"cancel",EVENT_NAVIGATE:"navigate",EVENT_MODIFY:"modify",EVENT_SUBMIT:"submit",EVENT_CREATE:"create",EVENT_CLEAR:"clear",EVENT_ACTION:"action"};FormLifeCycleStates={FORM_BLANK:"blank",FORM_CREATE:"create",FORM_MODIFY:"modify"};FormDatabindings={DEFAULT_FORM_DATABINDING_ROOT:"/ds/var/form",DEFAULT_SUBFORM_DATABINDING_ROOT:"/ds/var/subform"}
function AsynchTest(testFunctionName)
{this.testName=testFunctionName.substr(4);this.testFunction=testFunctionName;this.validateFunction="asynchValidate"+this.testName;this.status=AsynchTest.NOT_RUN;}
AsynchTest.PASSED=0;AsynchTest.FAILED=1;AsynchTest.RUNNING=2;AsynchTest.NOT_RUN=3;AsynchTest.DELAY=1000;FUnitAsynch.asynchSetup=false;AsynchTest._testUnderSetup=null;AsynchTest.prototype.runTest=function()
{if(FUnitAsynch.asynchSetup)
{AsynchTest._testUnderSetup=this;}
if(window.setup!=undefined)
{window.setup.call(window);}
if(!FUnitAsynch.asynchSetup)
{AsynchTest._testUnderSetup=null;this.executeTest();}}
AsynchTest.setupComplete=function()
{AsynchTest._testUnderSetup.executeTest();}
AsynchTest.prototype.executeTest=function()
{try
{this.startTime=new Date();window[this.testFunction].call(window);this.status=AsynchTest.RUNNING;}
catch(e)
{this.status=AsynchTest.FAILED;this.exception=e;}}
AsynchTest.prototype.validateTest=function()
{var endTime=new Date();this.duration=(endTime.getTime()-this.startTime.getTime())-AsynchTest.DELAY;try
{if(window[this.validateFunction]!=undefined)
{window[this.validateFunction].call(window);}
this.status=AsynchTest.PASSED;}
catch(e)
{this.status=AsynchTest.FAILED;this.exception=e;}
if(window.teardown!=undefined)
{window.teardown.call(window);}}
AsynchTest.prototype.fail=function(exception)
{this.status=AsynchTest.FAILED;this.exception=exception;}
function FUnitAsynch()
{this.tests=[];}
FUnitAsynch.prototype.startTests=function(resultsHandler,testNames)
{this.resultsHandler=resultsHandler;for(var i=0;i<testNames.length;i++)
{this.tests.push(new AsynchTest(testNames[i]));}
this.runNextTest();}
FUnitAsynch.prototype.failAllTests=function(resultsHandler,exception,testNames)
{this.resultsHandler=resultsHandler;for(var i=0;i<testNames.length;i++)
{var test=new AsynchTest(testNames[i]);test.fail(exception);this.tests.push(test);}
this._invokeResultsHandler();}
FUnitAsynch.prototype.runNextTest=function()
{var currentTest=null;for(var i=0;i<this.tests.length;i++)
{if(this.tests[i].status==AsynchTest.NOT_RUN)
{currentTest=this.tests[i];currentTest.runTest();break;}}
if(currentTest)
{var thisObj=this;setTimeout(function(){thisObj.checkTestResult(currentTest);},AsynchTest.DELAY);}
else
{this._invokeResultsHandler();}}
FUnitAsynch.prototype._invokeResultsHandler=function()
{this.resultsHandler.processResults.call(this.resultsHandler,this.tests);}
FUnitAsynch.prototype.checkTestResult=function(targetTest)
{if(targetTest.status==AsynchTest.RUNNING)
{targetTest.validateTest();}
this.runNextTest();}
function BatchTestRun(){};BatchTestRun.FIRST_FORM_NAME='FUnitStartForm';BatchTestRun.FINAL_FORM_NAME='FUnitEndForm';BatchTestRun.POLL_INTERVAL=100;BatchTestRun.NUMBER_OF_POLLS_PER_MINUTE=60*1000/BatchTestRun.POLL_INTERVAL;BatchTestRun.prototype.m_numberOfPolls=0;BatchTestRun.b=null;BatchTestRun.begin=function()
{BatchTestRun.b=new BatchTestRun();BatchTestRun.b._begin();}
BatchTestRun.prototype._begin=function()
{if(FormController.getInstance()==null)
{try
{FormController.initialise();}
catch(e)
{var funit=new FUnitAsynch();funit.failAllTests(this,e,window.tests);}}
if(Services.getValue('/ds/var/app/funit/running')=='true')
{this._waitForFormControllerInitialisation();}}
BatchTestRun.prototype._waitForFormControllerInitialisation=function()
{if(FormController.getInstance().m_ready!=true)
{try
{this.m_numberOfPolls++;if(this.m_numberOfPolls>BatchTestRun.NUMBER_OF_POLLS_PER_MINUTE)
{var ex=new Error();ex.message="FormController failed to initialise after 1 minute";throw ex;}
var thisObj=this;setTimeout(function(){thisObj._waitForFormControllerInitialisation();},100);}
catch(e)
{var funit=new FUnitAsynch();funit.failAllTests(this,e,window.tests);}}
else
{var funit=new FUnitAsynch();funit.startTests(this,window.tests);}}
BatchTestRun.prototype.processResults=function(tests)
{var fc=FormController.getInstance();var dom=fc.getDataModel().getInternalDOM();var thisFormName=Services.getAppController().m_currentForm.getName();var thisSuite=dom.selectSingleNode("/ds/var/app/funit/test-suite[./form-name = '"+thisFormName+"']");if(thisSuite)
{try
{for(var i=0;i<tests.length;i++)
{var testNode=this.addNewNode(thisSuite,'test');passNode=this.addNewNode(testNode,'pass');this.addNewNode(testNode,'test-name',tests[i].testName);if(tests[i].status==AsynchTest.PASSED)
{XML.replaceNodeTextContent(passNode,"true");this.addNewNode(testNode,'duration',tests[i].duration.toString());}
else
{XML.replaceNodeTextContent(passNode,"false");this.addNewNode(testNode,'error-msg',tests[i].exception.message);}}
XML.setElementTextContent(thisSuite,'./state','complete');}
catch(e)
{XML.setElementTextContent(thisSuite,'./state','failed-to-run');}
this.runNextTestSuite();}}
BatchTestRun.prototype.runNextTestSuite=function()
{var dom=FormController.getInstance().getDataModel().getInternalDOM();var testNodes=dom.selectNodes("/ds/var/app/funit/test-suite[./state = 'not-run']");if(testNodes.length>0)
{var formName=XML.selectNodeGetTextContent(testNodes[0],'./form-name');Services.navigate(formName,false);}
else
{Services.navigate(BatchTestRun.FINAL_FORM_NAME,false);}}
BatchTestRun.prototype.addNewNode=function(parent,name,value)
{var node=XML.createElement(parent,name);if(value)XML.replaceNodeTextContent(node,value);parent.appendChild(node);return node;}
BatchTestRun.prototype.getTestSuites=function(appConfigURL)
{var dom=Services.loadDOMFromURL(appConfigURL);var xpath="//form[@funit = 'true']";var forms=dom.selectNodes(xpath);var formNames=[];for(var i=0;i<forms.length;i++)
{formNames.push(forms[i].getAttribute('name'));}
return formNames;}
BatchTestRun.prototype.initiateBatchRun=function(appConfigURL,resultsXslURL)
{var testSuites=this.getTestSuites(appConfigURL);fc_assert(testSuites.length>0);Services.removeNode('/ds/var/app/funit');var dom=XML.createDOM();funitNode=XML.createElement(dom,'funit');this.addNewNode(funitNode,'running','true');for(var i=0;i<testSuites.length;i++)
{var testNode=this.addNewNode(funitNode,'test-suite');this.addNewNode(testNode,'form-name',testSuites[i]);this.addNewNode(testNode,'state','not-run');}
var date=new Date();this.addNewNode(funitNode,'start-time',date.toString());Services.addNode(funitNode,'/ds/var/app');this.runNextTestSuite();}
function InteractivePageTest(){};InteractivePageTest.i=null;InteractivePageTest.begin=function()
{InteractivePageTest.i=new InteractivePageTest();InteractivePageTest.i._begin();}
InteractivePageTest.prototype._begin=function()
{this.resultsWindow=window.open("","Results","height=600,width=400,scrollbars=yes,resizable=yes");var thisObj=this;this.resultsWindow.onload=function(){thisObj._initiateTests();};this._initiateTests();}
InteractivePageTest.prototype._initiateTests=function()
{var funit=new FUnitAsynch();funit.startTests(this,window.tests);}
InteractivePageTest.prototype.processResults=function(tests)
{this._renderBlankResults(this.resultsWindow);var display=this.resultsWindow.document.getElementById("theTestResults");var passes=0;var fails=0;for(var i=0;i<tests.length;i++)
{var result=this.resultsWindow.document.createElement('DIV');display.appendChild(result);if(tests[i].status==AsynchTest.PASSED)
{passes++;result.className='FUnitPass';result.innerHTML=tests[i].testName+' has passed in '+tests[i].duration+"ms";}
else
{fails++;result.className='FUnitFail';result.innerHTML=tests[i].testName+' has failed with error '+tests[i].exception.message;}}
var summary=this.resultsWindow.document.getElementById("theTestSummary");summary.innerHTML='Tests passed: '+passes.toString()+'<br/>Tests failed: '
+fails.toString()+'<br/> Total tests: '+(passes+fails).toString();}
InteractivePageTest.prototype._renderBlankResults=function(resultsWindow)
{resultsWindow.document.write("<DIV id='wrapper'>.</DIV>");var wrapper=resultsWindow.document.getElementById('wrapper');var testPanel=resultsWindow.document.createElement('DIV');testPanel.className="testPanel";wrapper.appendChild(testPanel);var testTitle=resultsWindow.document.createElement('DIV');testPanel.appendChild(testTitle);testTitle.innerHTML="Automated test results";var testResults=resultsWindow.document.createElement('DIV');testResults.id="theTestResults";testPanel.appendChild(testResults);var testSummary=resultsWindow.document.createElement('DIV')
testSummary.className="testResult";testSummary.id="theTestSummary";testPanel.appendChild(testSummary);}
function SingleInteractiveTest(){};SingleInteractiveTest.s=null;SingleInteractiveTest.begin=function(selectElem)
{SingleInteractiveTest.s=new SingleInteractiveTest();SingleInteractiveTest.s._begin(selectElem);}
SingleInteractiveTest.prototype._begin=function(selectElem)
{var testName=selectElem.options[selectElem.selectedIndex].innerHTML;if(""!=testName&&null!=testName)
{var testToRun="test"+testName;this.funit=new FUnitAsynch();this.funit.startTests(this,[testToRun]);}}
SingleInteractiveTest.prototype.processResults=function(tests)
{if(tests[0].status==AsynchTest.PASSED)
{alert(tests[0].testName+" has passed without exception");}
else
{alert("Exception thrown: "+tests[0].exception.message);}}
function FUnitRenderer(){};FUnitRenderer.createInline=function()
{document.write("<DIV id='_funit-PleaseIgnore'></DIV>");var wrapper=document.getElementById("_funit-PleaseIgnore");var buttonElem=document.createElement('INPUT');buttonElem.type='BUTTON';wrapper.appendChild(buttonElem);buttonElem.value="Run automated tests";var selectElem=document.createElement('SELECT');wrapper.appendChild(selectElem);var blank=document.createElement('OPTION');selectElem.appendChild(blank);if(null!=tests)
{for(var i=0;i<tests.length;i++)
{var optionElem=document.createElement('OPTION');selectElem.appendChild(optionElem);optionElem._funitTest=tests[i];optionElem.innerHTML=tests[i].substr(4);}
selectElem.onchange=function(){SingleInteractiveTest.begin(selectElem);};buttonElem.onclick=InteractivePageTest.begin;}
else
{buttonElem.onclick=function(){alert("There are no tests defined");};}}
function FUnitEvent()
{this._events=new Array();this._overrideSUPSEvent();}
FUnitEvent.prototype.addEventHandlerWrapper=function(thisObj,element,eventName,action,capture)
{if(null!=element&&null!=element.id)
{if(null==thisObj._events[element.id+eventName])
{thisObj._events[element.id+eventName]=new Array();}
thisObj._events[element.id+eventName].push(action);}
return thisObj._addEventHandler.call(null,element,eventName,action,capture);}
FUnitEvent.prototype.removeEventHandlerKeyWrapper=function(key)
{this._removeHandler(key.m_element.id,key.m_eventName,key.m_action);this._removeEventHandlerKey.call(null,key);}
FUnitEvent.prototype.removeEventHandlerWrapper=function(element,eventName,action,capture)
{this._removeHandler(element.id,eventName,action);this._removeEventHandler.call(null,element,eventName,action,capture);}
FUnitEvent.prototype._removeHandler=function(elementId,eventName,action)
{if(this._events[elementId+eventName]!=null)
{for(var i=0;i<this._events[elementId+eventName].length;i++)
{if(this._events[elementId+eventName][i]==action)
{var actionArray=this._events[elementId+eventName];for(var j=i;j<actionArray.length-1;j++)
{actionArray[j]=actionArray[j+1];}
actionArray.pop();}}}}
FUnitEvent.prototype._overrideSUPSEvent=function()
{var thisObj=this;this._addEventHandler=SUPSEvent.addEventHandler;SUPSEvent.addEventHandler=function(element,eventName,action,capture)
{return thisObj.addEventHandlerWrapper(thisObj,element,eventName,action,capture);};this._removeEventHandlerKey=SUPSEvent.removeEventHandlerKey;SUPSEvent.removeEventHandlerKey=function(key)
{thisObj.removeEventHandlerKeyWrapper(key);};this._removeEventHandler=SUPSEvent.removeEventHandler;SUPSEvent.removeEventHandler=function(element,eventName,action,capture)
{thisObj.removeEventHandlerWrapper(element,eventName,action,capture);};}
FUnitEvent.prototype._fireEvent=function(elementId,eventName,event)
{supsAssert(this._events[elementId+eventName],"No handlers for this event");for(var i=0;i<this._events[elementId+eventName].length;i++)
{this._events[elementId+eventName][i].call(null,event);}}
FUnitEvent.prototype.fireEvent=function(elementId,eventName)
{this._fireEvent(elementId,eventName);}
FUnitEvent.prototype.fireKeyEvent=function(elementId,eventName,keycode)
{var event=new Object();event.keyCode=keycode.m_keyCode;this._fireEvent(elementId,eventName,event);}
function IEEventSimulator()
{}
IEEventSimulator.simulateClickOnAdaptor=function(adaptorId)
{var adaptor=Services.getAdaptorById(adaptorId);if(null!=adaptor)
{var element=null;if(adaptor.getFocusElement)
{element=adaptor.getFocusElement();}
else
{element=adaptor.getElement();}
if(null!=element)
{IEEventSimulator.fireMouseDownEvent(element);IEEventSimulator.fireMouseClickEvent(element);}}}
IEEventSimulator.simulateClickOnAdaptorLabel=function(adaptorId)
{var labels=document.getElementsByTagName("LABEL");var adaptorLabel=null;for(var i=0,l=labels.length;i<l;i++)
{var label=labels[i];if(label.htmlFor==adaptorId||label.htmlFor==adaptorId+TabbingManager.NON_NATIVE_FOCUS_ID)
{adaptorLabel=label;break;}}
if(null!=adaptorLabel)
{IEEventSimulator.fireMouseDownEvent(adaptorLabel);IEEventSimulator.fireMouseClickEvent(adaptorLabel);}}
IEEventSimulator.simulateClickOnBackground=function()
{var body=document.body;if(null!=body)
{IEEventSimulator.fireMouseDownEvent(body);}}
IEEventSimulator.fireMouseDownEvent=function(element)
{if(element.attachEvent)
{var mouseDownEvent=document.createEventObject();element.fireEvent("onmousedown",mouseDownEvent);}}
IEEventSimulator.fireMouseClickEvent=function(element)
{if(element.attachEvent)
{var mouseClickEvent=document.createEventObject();element.fireEvent("onclick",mouseClickEvent);}}
function SupsTestException(msg)
{this.message=msg;}
SupsTestException.prototype=new Error()
SupsTestException.prototype.constructor=SupsTestException;function SupsNonApplicableTestException(msg)
{this.message=msg;}
SupsNonApplicableTestException.prototype=new Error()
SupsNonApplicableTestException.prototype.constructor=SupsNonApplicableTestException;function supsAssert(expression,msg)
{if(!expression)
{throw new SupsTestException(msg);}}
function assertFocused(fieldId)
{var fc=FormController.getInstance();supsAssert((fc.getAdaptorById(fieldId)).hasFocus(),"Field "+fieldId+" did not get focus");if(null!=document.activeElement)
{supsAssert(document.getElementById(fieldId)==document.activeElement,"Browser belives "+fieldId+" does not have focus");}}
function manualAssert(condition)
{if(FUnit.interactiveMode())
{var ok=confirm("Please visually confirm:\n"+condition);if(!ok)
{throw new SupsTestException("Visual inspection failed for "+condition);}}
else
{throw new SupsNonApplicableTestException("Manual test run in non-interactive mode");}}function FUnit(){};FUnit.createInline=function()
{FUnitRenderer.createInline();}
FUnit.continueTestRun=function()
{BatchTestRun.begin();}
FUnit.interactiveMode=function()
{return true;}
function preventSelection(e)
{if(typeof e.style.MozUserSelect=="string")
{e.style.MozUserSelect="none";}
else if(typeof e.onselectstart!="undefined")
{e.onselectstart=preventElementTextSelection;}}
function unPreventSelection(e)
{if(typeof e.style.MozUserSelect=="none")
{e.style.MozUserSelect="string";}
else if(typeof e.onselectstart!="undefined")
{e.onselectstart=null;}}
function preventElementTextSelection()
{var event=window.event;event.returnValue=false;return false;}
function checkItemExists(item)
{var functionExists=false;try
{functionExists=eval(item+' ? true : false');}
catch(e)
{functionExists=false;}
return functionExists;}
function isContained(e1,e2)
{var e1Pos=getAbsolutePosition(e1);var e1X=e1Pos.left;var e1Y=e1Pos.top;var e1W=e1.offsetWidth;var e1H=e1.offsetHeight;var e2Pos=getAbsolutePosition(e2);var e2X=e2Pos.left;var e2Y=e2Pos.top;var e2W=e2.offsetWidth;var e2H=e2.offsetHeight;if(e1X<e2X&&(e1X+e1W)<e2X)return false;if(e1X>(e2X+e2W))return false;if(e1Y<e2Y&&(e1Y+e1H)<e2Y)return false;if(e1Y>(e2Y+e2H))return false;return true;}
function getAbsolutePosition(element)
{var leftPos=element.offsetLeft;var topPos=element.offsetTop-element.scrollTop;var parentElement=element.offsetParent;while(parentElement!=null){leftPos+=parentElement.offsetLeft;topPos+=(parentElement.offsetTop-parentElement.scrollTop);parentElement=parentElement.offsetParent;}
var result=new Object();result.left=leftPos;result.top=topPos;return result;}
function fc_assert(condition,message)
{if(!eval(condition))
{var msg="Assertion failure: "+message;if(Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_ERROR))
{Logging.logMessage("<font color=red>"+msg+"</font>",Logging.LOGGING_LEVEL_ERROR);}
var params=getURLParameters();if(params['showAssertionAlerts']!=null)
{alert(msg);}
throw msg;}}
function fc_assertAlways(message)
{fc_assert(1==0,message);}
function displayObjectProperties(obj)
{var names="";for(var name in obj)
{if(isNaN(name))
{var value=eval('obj.'+name);names+=('<b>'+name+'</b> = '+value+'<br>');}}
return names;}
function addMessage(msg,doc)
{if(doc==null)doc=document;var extra=doc.createElement("div");extra.innerHTML=msg;doc.body.appendChild(extra);}
function getURLParameters()
{var args=new Array();var paramIndex=document.URL.indexOf('?');if(-1!=paramIndex&&paramIndex<document.URL.length)
{var query=document.URL.substring(paramIndex+1);var pairs=query.split("&");for(var i=0;i<pairs.length;i++)
{var pos=pairs[i].indexOf('=');if(pos==-1)continue;var argname=pairs[i].substring(0,pos);var value=pairs[i].substring(pos+1);args[argname]=unescape(value);}}
return args;}
function getBaseURL(doc)
{var baseRegexp=new RegExp("^https?://.*?/");var baseURL=baseRegexp.exec(doc.URL);if(null!=baseURL)
{var len=baseURL[0].length;baseURL=baseURL[0].substring(0,len-1);}
else
{baseURL=doc.URL;}
return baseURL;}
function isParentOf(child,parent)
{if(child.parentNode==null)
{return false;}
else if(child.parentNode==parent)
{return true;}
else
{return isParentOf(child.parentNode,parent);}}
function isElementVisible(el)
{while(el.tagName!='HTML')
{var style=getCalculatedStyle(el);if(style.visibility=='hidden'||style.display=='none')return false;el=el.parentNode;}
return true;}
function getCalculatedStyle(el)
{return document.defaultView!=null?document.defaultView.getComputedStyle(el,''):el.currentStyle;}
function encodeXML(text)
{return text.replace(/\&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function decodeXML(text)
{return text.replace(/\&amp;/g,'&').replace(/\&lt;</g,'<').replace(/@gt;/g,'>');}
function isString(str)
{return(str instanceof String||typeof str=="string");}
function getIframeDocument(iframe)
{var doc=null;if(iframe.contentDocument)
{doc=iframe.contentDocument;}
else if(iframe.Document)
{doc=iframe.Document;}
else
{fc_assertAlways("Unrecognised browser: Unable to get iframe's document");}
return doc;}
function getIframeWindow(iframe)
{var wnd=null;if(iframe.defaultView)
{wnd=iframe.defaultView;}
else if(iframe.contentWindow)
{wnd=iframe.contentWindow;}
else
{fc_assertAlways("Unrecognised browser: Unable to get iframe's window");}
return wnd;}
function convertDateToString(date,includeMilliseconds)
{var dateStr="";var dayOfMonth=date.getDate();dateStr+=padDateOrTimeElement(dayOfMonth)+"/";var month=date.getMonth()+1;dateStr+=padDateOrTimeElement(month)+"/";var year=date.getYear();if(year<1000)
{year+=1900;}
dateStr+=year+" ";var hours=date.getHours();dateStr+=padDateOrTimeElement(hours)+":";var minutes=date.getMinutes();dateStr+=padDateOrTimeElement(minutes)+":";var seconds=date.getSeconds();dateStr+=padDateOrTimeElement(seconds);if(includeMilliseconds==true)
{var milliseconds=date.getMilliseconds();dateStr+="."+milliseconds;}
return dateStr;}
function padDateOrTimeElement(value)
{var valueStr="";if(value>=10)
{valueStr=value;}
else
{valueStr="0"+value;}
return valueStr;}
function LoggingImpl()
{}
LoggingImpl.m_reservedCategory="Default";LoggingImpl.m_initialised=false;LoggingImpl.m_loggingLevel=new Array();LoggingImpl.m_logQueue=new Array();LoggingImpl.m_logCounter=0;LoggingImpl.m_timeout=null;LoggingImpl.m_levels=["OFF","ERROR","WARN","INFO","DEBUG","TRACE"];LoggingImpl.initialise=function(logconfigURL)
{if(false==LoggingImpl.m_initialised){var params=getURLParameters();var loggingLevel=parseInt(params['logging']);if(loggingLevel!=null&&!isNaN(loggingLevel)){if(loggingLevel<Logging.LOGGING_LEVEL_OFF){loggingLevel=Logging.LOGGING_LEVEL_OFF;}
else if(loggingLevel>Logging.LOGGING_LEVEL_TRACE){loggingLevel=Logging.LOGGING_LEVEL_TRACE;}}
else{loggingLevel=Logging.LOGGING_LEVEL_OFF;}
LoggingImpl.m_loggingLevel[LoggingImpl.m_reservedCategory]=loggingLevel;LoggingImpl.m_initialised=true;LoggingImpl.logMessage("Logging initialised to level: "+
LoggingImpl.m_levels[loggingLevel],Logging.LOGGING_LEVEL_INFO,LoggingImpl.m_reservedCategory);if(logconfigURL!=null){LoggingImpl.configureCategories(logconfigURL);}}}
LoggingImpl._registerCategory=function(name)
{if(null==LoggingImpl.m_loggingLevel[name])
{LoggingImpl.m_loggingLevel[name]=LoggingImpl.LEVEL_OFF;}}
LoggingImpl.configureCategories=function(logconfigURL)
{var callBack={onSuccess:function(dom)
{LoggingImpl.configure(dom);},onError:function(ex)
{LoggingImpl.logMessage("Error loading category configuration XML ("+logconfigURL+"): "+ex.message,Logging.LOGGING_LEVEL_ERROR,LoggingImpl.m_reservedCategory);}}
var dom=Services.loadDOMFromURL(logconfigURL,callBack,false,false);}
LoggingImpl.configure=function(dom)
{var categoryNodes=dom.getElementsByTagName("category");var noOfNodes=categoryNodes.length;if(0==noOfNodes){LoggingImpl.logMessage("No category nodes in category configuration XML",Logging.LOGGING_LEVEL_ERROR,LoggingImpl.m_reservedCategory);return;}
for(i=0;i<noOfNodes;i++){var nameNode=categoryNodes[i].selectSingleNode("name");var levelNode=categoryNodes[i].selectSingleNode("level");if(nameNode!=null&&levelNode!=null){var categoryName=XML.getNodeTextContent(nameNode);var categoryLevel=XML.getNodeTextContent(levelNode);if(categoryName!=null&&categoryLevel!=null){categoryLevel=eval('Logging.LOGGING_LEVEL_'+categoryLevel);if(categoryLevel!=null){LoggingImpl.m_loggingLevel[categoryName]=categoryLevel;LoggingImpl.logMessage("Logging for category set to level: "+
LoggingImpl.m_levels[categoryLevel],Logging.LOGGING_LEVEL_INFO,categoryName);}
else{LoggingImpl.m_loggingLevel[categoryName]=LoggingImpl.LEVEL_OFF;LoggingImpl.logMessage("Invalid logging level, "+XML.getNodeTextContent(levelNode)+", for category: "+categoryName,Logging.LOGGING_LEVEL_ERROR,LoggingImpl.m_reservedCategory);}}
else{LoggingImpl.logMessage("Missing value for category node: "+
((null==categoryName)?"<name>":"<level> category: "+categoryName),Logging.LOGGING_LEVEL_ERROR,LoggingImpl.m_reservedCategory);}}
else{LoggingImpl.logMessage("Missing category node: "+
((null==nameNode)?"<name>":"<level>"),Logging.LOGGING_LEVEL_ERROR,LoggingImpl.m_reservedCategory);}}}
LoggingImpl.getConfig=function()
{var str="<categories>";var levels=LoggingImpl.m_loggingLevel;for(i in levels)
{var levelStr="OFF";switch(levels[i])
{case Logging.LOGGING_LEVEL_ERROR:{levelStr="ERROR";break;}
case Logging.LOGGING_LEVEL_WARN:{levelStr="WARN";break;}
case Logging.LOGGING_LEVEL_INFO:{levelStr="INFO";break;}
case Logging.LOGGING_LEVEL_DEBUG:{levelStr="DEBUG";break;}
case Logging.LOGGING_LEVEL_TRACE:{levelStr="TRACE";break;}
default:{}}
str+=("<category><name>"+i+"</name><level>"+levelStr+"</level></category>");}
str+="</categories>";return str;}
LoggingImpl.logMessage=function(message,level,category)
{if(LoggingImpl.isCategoryLoggingAtLevel(category,level)){if(null==category){category=LoggingImpl.m_reservedCategory;}
LoggingImpl.m_logCounter++;message=encodeXML(message);LoggingImpl.m_logQueue.push(LoggingImpl.m_logCounter+" ("+category+" - "+LoggingImpl.m_levels[level]+"): "+
new Date()+": "+message);if(LoggingImpl.m_timeout!=null){clearTimeout(LoggingImpl.m_timeout);}
LoggingImpl.m_timeout=setTimeout("LoggingImpl.delayedLogMessage()",100);}}
LoggingImpl.isCategoryLoggingAtLevel=function(category,level)
{var isCategoryLogging=false;if(null==category){category=LoggingImpl.m_reservedCategory;}
if(level<=LoggingImpl.m_loggingLevel[LoggingImpl.m_reservedCategory]&&LoggingImpl.m_loggingLevel[category]!=null&&level<=LoggingImpl.m_loggingLevel[category])
{isCategoryLogging=true;}
return isCategoryLogging;}
LoggingImpl.delayedLogMessage=function()
{if(this.m_logQueue.length>0){var w=LoggingImpl.w;if((null==LoggingImpl.w)||LoggingImpl.w.closed)
{LoggingImpl.w=window.open("","logging","scrollbars,resizable");w=null;}
if(null==w||null==w.document||null==w.document.body){LoggingImpl.m_timeout=setTimeout("LoggingImpl.delayedLogMessage()",100);}
else{var d=w.document;var b=d.body;var l=d.createElement("div");b.insertBefore(l,b.firstChild);this.m_logQueue.reverse();l.innerHTML=this.m_logQueue.join("<br>");this.m_logQueue=new Array();}}}
LoggingImpl.flush=function()
{LoggingImpl.delayedLogMessage();}
function Logging()
{}
Logging.LOGGING_LEVEL_OFF=0;Logging.LOGGING_LEVEL_ERROR=1;Logging.LOGGING_LEVEL_WARN=2;Logging.LOGGING_LEVEL_INFO=3;Logging.LOGGING_LEVEL_DEBUG=4;Logging.LOGGING_LEVEL_TRACE=5;Logging.m_implWindow=null;Logging.m_logQueue=new Array();Logging.m_registerQueue=new Array();Logging.initialise=function(implWindow)
{if(implWindow!=null){Logging.m_implWindow=implWindow;Logging.isCategoryLoggingAtLevel=Logging._isCategoryLoggingAtLevel;Logging.logMessage=Logging._logMessage;Logging._registerCategory=Logging.__registerCategory;var i;for(i=0;i<Logging.m_registerQueue.length;i++)
{Logging._registerCategory(Logging.m_registerQueue[i]);}
Logging.m_registerQueue=null;for(i=0;i<Logging.m_logQueue.length;i++){var msgObj=Logging.m_logQueue.pop();Logging.logMessage(msgObj.message,msgObj.level,msgObj.category);}
Logging.m_logQueue=null;}}
Logging.destroy=function()
{if(Logging.m_implWindow!=null)
{Logging.m_implWindow.LoggingImpl.flush();Logging.m_implWindow=null;}
if(Logging.m_logQueue!=null)
{for(var i=Logging.m_logQueue.length-1;i>=0;i--)
{Logging.m_logQueue[i]=null;}
Logging.m_logQueue=null;}
if(Logging.m_registerQueue!=null)
{for(var i=Logging.m_registerQueue.length-1;i>=0;i--)
{Logging.m_registerQueue[i]=null;}
Logging.m_registerQueue=null;}}
Logging.logMessage=function(message,level,category)
{var msgObj=new Object();msgObj.message=message;msgObj.level=level;msgObj.category=category;Logging.m_logQueue.push(msgObj);}
Logging._logMessage=function(message,level,category)
{Logging.m_implWindow.LoggingImpl.logMessage(message,level,category);}
Logging._registerCategory=function(category)
{Logging.m_registerQueue.push(category);}
Logging.__registerCategory=function(category)
{Logging.m_implWindow.LoggingImpl._registerCategory(category.m_name);}
Logging.isCategoryLoggingAtLevel=function(category,level)
{return true;}
Logging._isCategoryLoggingAtLevel=function(category,level)
{return Logging.m_implWindow.LoggingImpl.isCategoryLoggingAtLevel(category,level);}
Logging.error=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_ERROR,null);}
Logging.warn=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_WARN,null);}
Logging.info=function(message,category)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_INFO,null);}
Logging.debug=function(message,category)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_DEBUG,null);}
Logging.trace=function(message,category)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_TRACE,null);}
Logging.isError=function()
{return Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_ERROR);}
Logging.isWarn=function()
{return Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_WARN);}
Logging.isInfo=function()
{return Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_INFO);}
Logging.isDebug=function()
{return Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_DEBUG);}
Logging.isTrace=function()
{return Logging.isCategoryLoggingAtLevel(null,Logging.LOGGING_LEVEL_TRACE);}
function Category(name)
{this.m_name=name;Logging._registerCategory(this);}
Category.prototype.m_name;Category.prototype.logMessage=function(message,level)
{Logging.logMessage(message,level,this.m_name);}
Category.prototype.error=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_ERROR,this.m_name);}
Category.prototype.warn=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_WARN,this.m_name);}
Category.prototype.info=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_INFO,this.m_name);}
Category.prototype.debug=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_DEBUG,this.m_name);}
Category.prototype.trace=function(message)
{Logging.logMessage(message,Logging.LOGGING_LEVEL_TRACE,this.m_name);}
Category.prototype.isError=function()
{return Logging.isCategoryLoggingAtLevel(this.m_name,Logging.LOGGING_LEVEL_ERROR);}
Category.prototype.isWarn=function()
{return Logging.isCategoryLoggingAtLevel(this.m_name,Logging.LOGGING_LEVEL_WARN);}
Category.prototype.isInfo=function()
{return Logging.isCategoryLoggingAtLevel(this.m_name,Logging.LOGGING_LEVEL_INFO);}
Category.prototype.isDebug=function()
{return Logging.isCategoryLoggingAtLevel(this.m_name,Logging.LOGGING_LEVEL_DEBUG);}
Category.prototype.isTrace=function()
{return Logging.isCategoryLoggingAtLevel(this.m_name,Logging.LOGGING_LEVEL_TRACE);}
if(document.implementation&&document.implementation.createDocument)
{Element.prototype.selectNodes=function(binding)
{return this.ownerDocument.selectNodes(binding,this);}
Element.prototype.selectSingleNode=function(binding)
{return this.ownerDocument.selectSingleNode(binding,this);};XMLDocument.prototype.selectSingleNode=function(binding,contextNode)
{var nodes=this.selectNodes(binding,contextNode);return nodes.length>0?nodes[0]:null;}
XMLDocument.prototype.selectNodes=function(binding,contextNode)
{var nodes=null;if(this.documentElement)
{var namespaceResolver=this.createNSResolver(this.documentElement);var result=this.evaluate(binding,(null==contextNode?this:contextNode),namespaceResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);var nodes=new Array(result.snapshotLength);for(var i=nodes.length-1;i>=0;i--)
{nodes[i]=result.snapshotItem(i);}}
else
{nodes=new Array();}
return nodes;}
XMLDocument.prototype.loadXML=function(s)
{this.__resetError();this.__changeReadyState(1);var doc2=(new DOMParser()).parseFromString(s,"text/xml");while(this.hasChildNodes())
{this.removeChild(this.lastChild);}
var cN=doc2.childNodes;for(var i=0,l=cN.length;i<l;i++)
{this.appendChild(this.importNode(cN[i],true));}
this.__handleOnLoad();this.__changeReadyState(4);}
XMLDocument.prototype.transformNode=function(xslDOM)
{pro=new XSLTProcessor();pro.importStylesheet(xslDOM);p=pro.transformToFragment(this,this);return(new XMLSerializer()).serializeToString(p);}
if(undefined===Node.prototype.xml)
{Node.prototype.__defineGetter__("xml",function(){return(new XMLSerializer()).serializeToString(this);});}
XMLDocument.prototype.readyState=0;XMLDocument.prototype.__load__=XMLDocument.prototype.load;XMLDocument.prototype.load=function(url)
{this.__resetError();this.__changeReadyState(1);try
{this.__load__(url);}
catch(e)
{this.parseError={errorCode:-9999999,reason:e.toString()};this.__changeReadyState(4);}}
XMLDocument.prototype.__changeReadyState=function(readyState)
{this.readyState=readyState;if(this.onreadystatechange!=null&&typeof this.onreadystatechange=="function")
{this.onreadystatechange();}}
XMLDocument.prototype.__handleOnLoad=function()
{if(!this.documentElement)
{this.__setError("Unknown loading error");}
else if(this.documentElement.tagName=="parsererror")
{this.__setError(XML.getNodeTextContent(this.documentElement));}
this.__changeReadyState(4);};XMLDocument.prototype.__resetError=function()
{this.parseError={errorCode:0,reason:null};}
XMLDocument.prototype.parseError={errorCode:0,reason:null};XMLDocument.prototype.__setError=function(msg)
{this.parseError={errorCode:-9999999,reason:msg};}}
function XML()
{}
XML.getRootNode=function(fromDom)
{var rootNode=null;if(fromDom.nodeType==XML.ELEMENT_NODE)
{rootNode=fromDom;}
else
{var childNodes=fromDom.childNodes;for(var i=childNodes.length-1;i>=0;i--)
{if(childNodes[i].nodeType==XML.ELEMENT_NODE)
{rootNode=childNodes[i];break;}}}
return rootNode;}
XML.showFullDom=function(dom)
{var msg="DOM:";if(null!=dom)
{msg+=encodeXML(dom.xml);}
return msg;}
XML.serializeToString=function(dom)
{return(new XMLSerializer()).serializeToString(dom);}
XML.createElement=function(node,name)
{fc_assert(null!=node,"XML.createElement: node was null");if(node.ownerDocument)
{return node.ownerDocument.createElement(name);}
else
{return node.createElement(name);}}
XML.createAttribute=function(node,name)
{if(node.ownerDocument)
{return node.ownerDocument.createAttribute(name);}
else
{return node.createAttribute(name);}}
XML.createTextNode=function(node,value)
{if(node.ownerDocument)
{return node.ownerDocument.createTextNode(value);}
else
{return node.createTextNode(value);}}
XML.removeChildNodes=function(n)
{if(null!=n)
{while(n.hasChildNodes())
{n.removeChild(n.firstChild);}}}
XML.createDOM=function(onloadCallback,thisObj,callbackArgs)
{var dom=XML.createDocument();if(null==onloadCallback)
{dom.async=false;}
else
{dom.async=true;dom.onreadystatechange=function()
{if(dom.readyState==4)
{var args=new Array();args[0]=dom;if(callbackArgs.length!=0)
{for(var i=0;i<callbackArgs.length;i++)
{args[args.length]=callbackArgs[i];}}
onloadCallback.apply(thisObj,args);}}}
return dom;}
XML.createDocument=function()
{var dom=null;if(typeof ActiveXObject!='undefined')
{dom=new ActiveXObject("Microsoft.XMLDOM");dom.setProperty("SelectionLanguage","XPath");}
else if(document.implementation&&document.implementation.createDocument)
{dom=document.implementation.createDocument("","",null);dom.addEventListener("load",function(){dom.__handleOnLoad();},false);}
else
{fc_assertAlways("Browser doesn't support recognised XML DOM");}
return dom;}
XML.loadStatic=function(url)
{var index;var requestInfo=new Object();index=xmlHttpServiceRequestQueue.length;xmlHttpServiceRequestQueue.push(requestInfo);requestInfo.server=new XMLHttpServiceRequest();var dom=XML.createDocument();requestInfo.dom=dom;var async=false;requestInfo.server.initialise(null,url,async,null,handleLoadStaticReadyStateChange);var handlerArgs=new Array();handlerArgs[0]=index;requestInfo.server.sendGET("loadStaticFile",handlerArgs);return dom;}
function handleLoadStaticReadyStateChange(handlerArgs)
{var index=handlerArgs[0];var requestInfo=xmlHttpServiceRequestQueue[index];if(null!=requestInfo)
{var request=requestInfo.server.getRequest();if(request.readyState==4)
{if(request.status==200)
{var theXML=request.responseText;requestInfo.dom.loadXML(theXML);}
requestInfo.server.dispose();requestInfo.server=null;requestInfo.dom=null;delete xmlHttpServiceRequestQueue[index];}
requestInfo=null;}}
XML.getNodeTextContent=function(n)
{var t=null;var f=false;var cn=n.childNodes;for(var i=0,l=cn.length;i<l;i++)
{var c=cn[i];if(XML.TEXT_NODE==c.nodeType)
{t=(null==t)?c.nodeValue:t+c.nodeValue;}}
return t;}
XML.getPathTextContent=function(node,xpath)
{var n=node.selectSingleNode(xpath);return null==n?null:XML.getNodeTextContent(n);}
XML.showDom=function(dom)
{var msg="DOM";if(dom.childNodes)
{msg+="<ul>";msg+=XML.showChildren(dom.childNodes);msg+="</ul>";}
else
{msg+=" has no childNodes";}
return msg;}
XML.showChildren=function(nodelist,indent)
{var iindent=(null!=indent)?indent++:1;var indentString="";for(var i=0;i<iindent;i++)
{indentString+="\t";}
var msg='';if(nodelist&&nodelist.length)
{for(var i=0;i<nodelist.length;i++)
{var node=nodelist[i];msg+="\n"+indentString+"<li>Node: type="+XML.NODE_TYPES[node.nodeType-1]+", name="+node.nodeName+", value="+node.nodeValue;if(node.hasChildNodes())
{msg+="<ul>";msg+=XML.showChildren(node.childNodes,iindent);msg+="</ul>";}
msg+="</li>";}}
return msg;}
XML.selectNodeGetTextContent=function(node,xp)
{var text=null;var foundNode=node.selectSingleNode(xp)
if(null!=foundNode)
{text=XML.getNodeTextContent(foundNode);}
return text;}
XML.setElementTextContent=function(node,xp,value)
{var text=null;var foundNode=node.selectSingleNode(xp);if(null!=foundNode)
{XML.replaceNodeTextContent(foundNode,value);}
else
{throw new XMLException("Unable to location child node at path: "+xp);}}
XML.replaceNodeTextContent=function(n,v)
{var r=new Array();var cn=n.childNodes;for(var i=0,l=cn.length;i<l;i++)
{var c=cn[i];if(XML.TEXT_NODE==c.nodeType)
{r.push(c);}}
for(var i=0,l=r.length;i<l;i++)
{n.removeChild(r[i]);}
if(null!=v)
{var t=XML.createTextNode(n.ownerDocument,v);n.appendChild(t);}}
function XMLException(message)
{this.message=message;}
XMLException.prototype=new Error();XMLException.prototype.constructor=XMLException;XML.NODE_TYPES=new Array();XML.NODE_TYPES[0]='Element';XML.NODE_TYPES[1]='Attribute';XML.NODE_TYPES[2]='Text';XML.NODE_TYPES[3]='CData Section';XML.NODE_TYPES[4]='Entity Reference';XML.NODE_TYPES[5]='Entity';XML.NODE_TYPES[6]='Processing Instruction';XML.NODE_TYPES[7]='Comment';XML.NODE_TYPES[8]='Document';XML.NODE_TYPES[9]='Document Type';XML.NODE_TYPES[10]='Document Fragment';XML.NODE_TYPES[11]='Notation';XML.ELEMENT_NODE=1;XML.ATTRIBUTE_NODE=2;XML.TEXT_NODE=3;XML.CDATA_SECTION=4;XML.ENTITY_REFERENCE=5;XML.ENTITY=6;XML.PROCESSING_INSTRUCTION=7;XML.COMMENT=8;XML.DOCUMENT=9;XML.DOCUMENT_TYPE=10;XML.DOCUMENT_FRAGMENT=11;XML.NOTATION=12;function CallbackList()
{this.m_callbacks=new Array();}
CallbackList.prototype.addCallback=function(callback)
{fc_assert(typeof callback=="function","CallbackList.addCallback(): callback must be function");this.m_callbacks[this.m_callbacks.length]=callback;}
CallbackList.prototype.removeCallback=function(callback)
{var position=-1;for(var i=0,len=this.m_callbacks.length;i<len;i++)
{if(callback==this.m_callbacks[i])
{position=i;break;}}
if(position!=-1)
{this.m_callbacks.splice(position,1);}}
CallbackList.prototype.invoke=function()
{for(var i=0,l=this.m_callbacks.length;i<l;i++)
{if(arguments.length==0)
{this.m_callbacks[i].apply(null);}
else
{this.m_callbacks[i].apply(null,arguments);}}}
CallbackList.prototype.invokeSelectedCallbackMethod=function()
{var returnValue=null;var length=arguments.length;if(length==1)
{returnValue=this.m_callbacks[arguments[0]].apply(null);}
else if(length>1)
{var methodIndex=arguments[0];var newArguments=new Array();for(var i=1;i<length;i++)
{newArguments[i-1]=arguments[i];}
returnValue=this.m_callbacks[methodIndex].apply(null,newArguments);}
return returnValue;}
CallbackList.prototype.dispose=function()
{for(var i=this.m_callbacks.length;i>=0;i--)
{delete this.m_callbacks[this.m_callbacks.length];}}
function XPathParseError(message,ex)
{this.message=message;this.exception=ex;}
XPathParseError.prototype=new Error();XPathParseError.prototype.constructor=XPathParseError;function XPathParser()
{this.m_xp=null;this.m_listener=null;}
XPathParser.prototype.getXPath=function()
{return this.m_xp;}
XPathParser.prototype.parse=function(xp,listener)
{fc_assert(xp!=null,"XPathParser.parse(): XPath must not be a null string");fc_assert(listener!=null,"XPathParser.parse(): listener must not be null");this.m_xp=xp;this.m_listener=listener;var p=0;if(p<xp.length)
{switch(xp.charAt(p))
{case'/':this._startNode(++p);break;default:this._exception(p,"XPath must start at root - first character must be /");}}
else
{this._exception(p,"XPath was empty");}
this.m_xp=null;this.m_listener=null;}
XPathParser.prototype._startNode=function(p)
{var xp=this.m_xp;if(p<xp.length)
{switch(xp.charAt(p))
{case'/':this.m_listener.node('/');this._decendantNode(++p);break;case"'":case'"':case'[':case']':this._exception(p,"Illegal character '"+xp.charAt(p)+"' in startNode");break;default:this._parseNode(p);break;}}}
XPathParser.prototype._decendantNode=function(p)
{var xp=this.m_xp;if(p<xp.length)
{switch(xp.charAt(p))
{case'/':case"'":case'"':case'[':case']':this._exception(p,"Illegal character '"+xp.charAt(p)+"' in decendantNode");break;default:this._parseNode(p);}}
else
{this._exception(p,"Recursive match must be followed by a node match");}}
XPathParser.prototype._parseNode=function(p)
{var s=p;var xp=this.m_xp;var le=xp.length;while(p<le&&s!=-1)
{switch(xp.charAt(p))
{case'/':this.m_listener.node(xp.substring(s,p));this._startNode(++p);s=-1;break;case'[':this.m_listener.node(xp.substring(s,p));this._startPredicate(++p);s=-1;break;case"'":case'"':case']':this._exception(p,"Illegal character '"+xp.charAt(p)+"' in parseNode");break;default:p++;}}
if(s!=-1&&s!=p)
{this.m_listener.node(xp.substring(s,p));}}
XPathParser.prototype._startPredicate=function(p)
{var s=p;var xp=this.m_xp;var le=xp.length;var nestedPredicateCount=1;while(p<le&&s!=-1)
{switch(xp.charAt(p))
{case'"':case"'":p++;var e=xp.indexOf(xp.charAt(p-1),p);if(-1==e)
{this._exception(p,"Unterminated quoted string");}
else
{p=e+1;}
break;case'[':p++;nestedPredicateCount++;break;case']':nestedPredicateCount--;if(nestedPredicateCount==0)
{this.m_listener.predicate(xp.substring(s,p));this._endPredicate(++p);s=-1;break;}
default:p++;}}
if(s!=-1&&s!=p)
{this._exception(p,"Unclosed predicate");}}
XPathParser.prototype._endPredicate=function(p)
{var xp=this.m_xp;if(p<xp.length)
{switch(xp.charAt(p))
{case'/':this._startNode(++p);break;case'[':this._startPredicate(++p);break;default:this._exception(p,"Illegal character after predicate '"+xp.charAt(p)+"' in endPredicate");break;}}}
XPathParser.prototype._exception=function(position,message)
{throw new XPathParseError(message+" at char: "+position+" in xpath: "+this.m_xp);}
function XPathParserListenerError(message,ex)
{this.message=message;this.exception=ex;}
XPathParserListenerError.prototype=new Error();XPathParserListenerError.prototype.constructor=XPathParserListenerError;function XPathParserListener()
{}
XPathParserListener.prototype.node=undefined;XPathParserListener.prototype.predicate=undefined;function DataModel()
{this._initialise();}
DataModel.m_logger=new Category("DataModel");DataModel.DEFAULT_ROOT="/ds";DataModel.VARIABLES_ROOT="/ds/var";DataModel.DEFAULT_PAGE_BINDING_ROOT="/ds/var/page";DataModel.DEFAULT_APP_BINDING_ROOT="/ds/var/app";DataModel.DEFAULT_FORM_BINDING_ROOT="/ds/var/form";DataModel.DEFAULT_TMP_BINDING_ROOT="/ds/var/page/tmp";DataModel.DEFAULT_REF_DATA_ROOT=DataModel.DEFAULT_FORM_BINDING_ROOT;DataModel.prototype.m_xpathParser=null;DataModel.prototype.m_registerListener=null;DataModel.prototype.m_matchListener=null;DataModel.prototype.m_root=null;DataModel.prototype.m_dom=null;DataModel.prototype.m_transactionListeners=null;DataModel.prototype._initialise=function()
{this._resetCache();this.m_xpathParser=new XPathParser();this.m_registerListener=new XPathRegistryListener(this);this.m_matchListener=new XPathMatchListener(this);this.m_registerCache=new Array();this.m_transactionListeners=new Array();this.m_transactionCount=0;this.m_root=new XPathRegistryNode(null,"");this.m_dom=XML.createDOM(null,null,null);}
DataModel.prototype.dispose=function()
{for(var i=0;i<this.m_transactionListeners.length;i++)
{this.m_transactionListeners[i]=null;}
this.m_transactionListeners=null;for(var i in this.m_parseCache)
{this.m_parseCache[i]=null;}
this.m_parseCache=null;for(var i in this.m_registerCache)
{this.m_registerCache[i]=null;}
this.m_registerCache=null;this.m_xpathParser=null;this.m_registerListener=null;this.m_matchListener=null;this.m_root.dispose();this.m_root=null;this.m_dom=null;}
DataModel.prototype._resetCache=function()
{this.m_parseCache=null;this.m_parseCache=new Array();}
DataModel.prototype.getInternalDOM=function()
{return this.m_dom;}
DataModel.prototype.setInternalDOM=function(d)
{this._startTransaction();this.m_dom=d;this._invokeAllListeners();this._endTransaction();}
DataModel.prototype.invokeUpdateEventGeneration=function()
{this._startTransaction();this._invokeAllListeners();this._endTransaction();}
DataModel.prototype._invokeAllListeners=function()
{var listeners=this.m_root.getListenersRecursive();var event=new DataModelEvent();var e=DataModelEvent.create('/',DataModelEvent.ADD);for(var i=0,l=listeners.length;i<l;i++)
{listeners[i].invoke(e);}}
DataModel.prototype.getValue=function(xp)
{var v=null;var n=this.m_dom.selectNodes(xp);switch(n.length)
{case 0:break;case 1:v=XML.getNodeTextContent(n[0]);break;default:throw new DataModelError("Value for multiple nodes cannot be retrieved!");break;}
return v;}
DataModel.prototype.setValue=function(xp,v)
{if(DataModel.m_logger.isDebug())DataModel.m_logger.debug("** DataModel.prototype.setValue(xp:"+xp+", v:"+v+")");this._startTransaction();var currentValue=this.getValue(xp);var changed=false;if(currentValue!=v)
{var l=this.parseXPath(xp);var created=l.setDOMValue(v);var eventType=created?DataModelEvent.ADD:DataModelEvent.UPDATE;var e=DataModelEvent.create(xp,eventType);l.invokeMatchedNodesListeners(e);changed=true;}
this._endTransaction();return changed;}
DataModel.prototype.getNode=function(xp)
{var n=this.m_dom.selectSingleNode(xp);return null==n?null:n.cloneNode(true);}
DataModel.prototype.getNodes=function(xp)
{var nodes=this.m_dom.selectNodes(xp);var result=new Array();for(var i=0,l=nodes.length;i<l;i++)
{result[i]=nodes[i].cloneNode(true);}
return result;}
DataModel.prototype._startTransaction=function()
{if(this.m_transactionCount==0)
{for(var i=0,l=this.m_transactionListeners.length;i<l;i++)
{this.m_transactionListeners[i].start();}}
this.m_transactionCount++;}
DataModel.prototype._endTransaction=function()
{if(this.m_transactionCount>0)
{this.m_transactionCount--;}
else
{if(DataModel.m_logger.isError())DataModel.m_logger.error("Error: DataModel._endTransaction() transactionCount is already 0, the number of start and end transactions do not match!");}
if(this.m_transactionCount==0)
{for(var i=0,l=this.m_transactionListeners.length;i<l;i++)
{this.m_transactionListeners[i].end();}}}
DataModel.prototype.parseXPath=function(xp)
{var l;if(null==this.m_parseCache[xp])
{l=this.m_matchListener;l.reset();try
{this.m_xpathParser.parse(xp,l);}
catch(ex)
{throw new DataModelError("Error while parsing XPath",ex);}
l.finishMatch();this.m_parseCache[xp]=XPathMatchListener.clone(l);}
return XPathMatchListener.clone(this.m_parseCache[xp]);}
DataModel.prototype.addChildrenNodes=function(nodelist,toNode)
{if(nodelist&&nodelist.length)
{for(var i=0;i<nodelist.length;i++)
{var node=nodelist[i];var newNode=toNode.appendChild(node);if(node.hasChildNodes())
{addChildrenNodes(node.childNodes,newNode);}}}}
DataModel.prototype.hasValue=function(xp)
{var v=this.getValue(xp);return(null!=v&&""!=v);}
DataModel.prototype.exists=function(xp)
{var n=this.m_dom.selectNodes(xp);return(n.length!=0)}
DataModel.prototype.countNodes=function(xp)
{var n=this.m_dom.selectNodes(xp);return n.length;}
DataModel.prototype.registerListenerArray=function(listenerArray)
{for(var i=0,l=listenerArray.length;i<l;i++)
{this._register(listenerArray[i].xpath,listenerArray[i].listener);}}
DataModel.prototype.deRegisterListenerArray=function(listenerArray)
{for(var i=0,l=listenerArray.length;i<l;i++)
{this._deRegister(listenerArray[i].xpath,listenerArray[i].listener);}}
DataModel.prototype._register=function(xp,listener)
{this._resetCache();if(null!=this.m_registerCache[xp])
{var n=this.m_registerCache[xp];n.addListener(listener);}
else
{var l=this.m_registerListener;l.reset();this.m_xpathParser.parse(xp,l);var n=l.getCurrentNode();listener._setXPath(xp);n.addListener(listener);this.m_registerCache[xp]=n;}}
DataModel.prototype._deRegister=function(xp,listener)
{this._resetCache();var n=this.m_registerCache[xp];if(null!=n)
{delete this.m_registerCache[xp];}
else
{var l=this.m_registerListener;l.reset();this.m_xpathParser.parse(xp,l);n=l.getCurrentNode();}
n.removeListener(listener);}
DataModel.prototype.registerTransactionListener=function(listener)
{this._resetCache();this.m_transactionListeners.push(listener);}
DataModel.prototype.isXPathInDirtyCheckedSubTree=function(xp)
{var shouldBeChecked=true;var excludedSubTrees=['/ds/var'];for(var i=0,l=excludedSubTrees.length;i<l;i++)
{if(xp.indexOf(excludedSubTrees[i])==0)
{shouldBeChecked=false;break;}}
return shouldBeChecked;}
function DataModelError(message,ex)
{this.message=message;this.exception=ex;}
DataModelError.prototype=new Error();DataModelError.prototype.constructor=DataModelError;function DataModelEvent()
{}
DataModelEvent.ADD=0;DataModelEvent.REMOVE=1;DataModelEvent.UPDATE=2;DataModelEvent.prototype.m_xPath=null;DataModelEvent.prototype.m_type=null;DataModelEvent.prototype.m_node=null;DataModelEvent.create=function(xp,t,node)
{var e=new DataModelEvent();e.m_xPath=xp;e.m_type=t;e.m_node=node;return e;}
DataModelEvent.prototype.isEqual=function(e)
{return(e.m_xPath==this.m_xPath)&&(e.m_type==this.m_type);}
DataModelEvent.prototype.getType=function()
{return this.m_type;}
DataModelEvent.prototype.getXPath=function()
{return this.m_xPath;}
DataModelEvent.prototype.setXPath=function(xp)
{return this.m_xPath=xp;}
DataModelEvent.prototype.getNode=function()
{return this.m_node;}
DataModelEvent.prototype.setNode=function(n)
{this.m_node=n;}
DataModelEvent.prototype.dispose=function()
{if(this.m_node!=null)
{delete this.m_node;this.m_node=null;}
this.m_xPath=null;this.m_type=null;}
DataModelEvent.prototype.toString=function()
{var type="";switch(this.m_type)
{case DataModelEvent.ADD:type="ADD";break;case DataModelEvent.REMOVE:type="REMOVE";break;case DataModelEvent.UPDATE:type="UPDATE";break
default:break;}
return"{m_xPath: "+this.m_xPath+", m_type: "+type+"}";}
function DataModelListener()
{}
DataModelListener.prototype.invoke=function(e)
{}
DataModelListener.prototype.dispose=function()
{}
function DataModelTransactionListener()
{}
DataModelTransactionListener.prototype.start=function()
{}
DataModelTransactionListener.prototype.end=function()
{}
function XPathRegistryNode(v,path)
{this.m_objectRef=XPathRegistryNode.m_objectRef++;this.m_childNodes={};this.m_predicates={};this.m_listeners=new Array();this.m_value=v;if(v==null)
{this.m_xp=path;}
else
{if(path.length>=2&&(path.lastIndexOf("//")==(path.length-2)))
{this.m_xp=path+v;}
else
{this.m_xp=path+"/"+v;}}}
XPathRegistryNode.m_objectRef=0;XPathRegistryNode.prototype.dispose=function()
{this.m_childNodes=null;this.m_predicates=null;var listeners=this.m_listeners;for(var i=0,l=listeners.length;i<l;i++)
{listeners[i].dispose();this.m_listeners[i]=null;}
this.m_listeners=null;}
XPathRegistryNode.prototype.toString=function()
{return"[\""+this.m_value+"\" (ref:"+this.m_objectRef+", "+this.m_xp+")]";}
XPathRegistryNode.prototype.getObjectRef=function()
{return this.m_objectRef;}
XPathRegistryNode.prototype.getValue=function()
{return this.m_value;}
XPathRegistryNode.prototype.addChildNode=function(n)
{var c=this.m_childNodes[n];if(null==c)
{c=new XPathRegistryNode(n,this.m_xp);this.m_childNodes[n]=c;}
return c;}
XPathRegistryNode.prototype._noOfChildNodes=function()
{var c=0;for(var i in this.m_childNodes)c++;return c;}
XPathRegistryNode.prototype.getChildNode=function(n)
{var c=this.m_childNodes[n];return(undefined==c?null:c);}
XPathRegistryNode.prototype.getChildren=function()
{return this.m_childNodes;}
XPathRegistryNode.prototype.addPredicateNode=function(n)
{var c=this.m_predicates[n];if(null==c)
{c=new XPathRegistryNode(n,this.m_xp);this.m_predicates[n]=c;}
return c;}
XPathRegistryNode.prototype._noOfPredicateNodes=function()
{var c=0;for(var i in this.m_predicates)c++;return c;}
XPathRegistryNode.prototype.getPredicateNode=function(n)
{var p=this.m_predicates[n];return(undefined==p?null:p);}
XPathRegistryNode.prototype.getPredicates=function()
{return this.m_predicates;}
XPathRegistryNode.prototype.addListener=function(l)
{this.m_listeners.push(l);}
XPathRegistryNode.prototype.removeListener=function(l)
{var listeners=this.m_listeners;var newListeners=[];for(var i=listeners.length-1;i>=0;i--)
{var li=listeners[i];if(l==li)
{li.dispose();}
else
{newListeners.push(li);}}
this.m_listeners=newListeners;}
XPathRegistryNode.prototype._noOfListeners=function()
{return this.m_listeners.length;}
XPathRegistryNode.prototype.getListeners=function()
{return this.m_listeners;}
XPathRegistryNode.prototype.getListenersRecursive=function()
{var ls=new Array();ls=this._getListenersRecursive(ls,this);return ls;}
XPathRegistryNode.prototype._getListenersRecursive=function(ls,n)
{ls=n.m_listeners.concat(ls);for(var c in n.m_childNodes)
{ls=this._getListenersRecursive(ls,n.m_childNodes[c]);}
for(var p in n.m_predicates)
{ls=this._getListenersRecursive(ls,n.m_predicates[p]);}
return ls;}
XPathRegistryNode.prototype.serialise=function()
{var xp="'"+this.m_xp+"'\n";var value="'"+this.m_value+"'\n";var objectRef="'"+this.m_objectRef+"'\n";var childObjectRefArray=new Array();for(var a in this.m_childNodes)
{if(a!="__parent__"&&a!="__proto__")
{childObjectRefArray.push(this.m_childNodes[a].m_objectRef);}}
var childRef=SerialisationUtils.stringArrayToLiteral(childObjectRefArray)+"\n";var predicateObjectRefArray=new Array();for(var a in this.m_predicates)
{if(a!="__parent__"&&a!="__proto__")
{predicateObjectRefArray.push(this.m_predicates[a].m_objectRef);}}
var predicateRef=SerialisationUtils.stringArrayToLiteral(predicateObjectRefArray)+"\n";var lstr="[";var foundListener=false;for(var i=0;i<this.m_listeners.length;i++)
{lstr+=this.m_listeners[i].serialise()+",";foundListener=true;}
if(foundListener)
{lstr=lstr.substring(0,lstr.length-1);}
lstr+="]\n";var str="FormController.regNodes["+this.m_objectRef+"]=XPathRegistryNode.deserialise("+objectRef+","+xp+","+value+","+predicateRef+","+childRef+","+lstr+");\n";return str;}
XPathRegistryNode.deserialise=function(objectRef,xp,value,predicates,childRef,listeners)
{var node=new XPathRegistryNode();node.m_objectRef=objectRef;node.m_xp=xp;node.m_value=value;node.m_predicateRefArray=predicates;node.m_childRefArray=childRef;node.m_listeners=listeners;return node;}
function XPathRegistryListener(dataModel)
{this.m_objectRef=XPathRegistryListener.m_objectRef++;this.m_dataModel=dataModel;this.reset();}
XPathRegistryListener.prototype=new XPathParserListener();XPathRegistryListener.prototype.constructor=XPathRegistryListener;XPathRegistryListener.m_objectRef=0;XPathRegistryListener.prototype.toString=function()
{return"[XPathRegistryListener objectRef:"+this.m_objectRef+"]";}
XPathRegistryListener.prototype.node=function(name)
{this.m_currentNode=this.m_currentNode.addChildNode(name);}
XPathRegistryListener.prototype.predicate=function(pred)
{}
XPathRegistryListener.prototype.reset=function()
{this.m_currentNode=this.m_dataModel.m_root;}
XPathRegistryListener.prototype.getCurrentNode=function()
{return this.m_currentNode;}
function XPathMatchListener(dataModel)
{this.m_objectRef=XPathMatchListener.m_objectRef++;this.m_dataModel=dataModel;this.reset();}
XPathMatchListener.clone=function(source)
{var target=new XPathMatchListener(source.m_dataModel);for(var i in source)
{target[i]=source[i];}
for(var j in source.m_parentXPaths)
{target.m_parentXPaths[j]=source.m_parentXPaths[j];}
for(var k in source.m_matchedNodes)
{target.m_matchedNodes[k]=source.m_matchedNodes[k];}
return target;}
XPathMatchListener.prototype=new XPathParserListener();XPathMatchListener.prototype.constructor=XPathMatchListener;XPathMatchListener.clone=function(source)
{var target=new XPathMatchListener(source.m_dataModel);for(var i in source)
{target[i]=source[i];}
for(var j in source.m_parentXPaths)
{target.m_parentXPaths[j]=source.m_parentXPaths[j];}
for(var k in source.m_matchedNodes)
{target.m_matchedNodes[k]=source.m_matchedNodes[k];}
return target;}
XPathMatchListener.m_objectRef=0;XPathMatchListener.prototype.toString=function()
{return"[XPathMatchListener objectRef:"+this.m_objectRef+"]";}
XPathMatchListener.prototype.node=function(name)
{fc_assert("*"!=name,"Cannot use xpath wildcard match when setting a value");fc_assert("/"!=name,"Cannot use xpath decendant match when setting a value");if(null!=this.m_lastName)
{this._matchCurrentNodeChildren(this.m_lastName);this._matchDOMNode(this.m_lastName,this.m_lastPred);}
this.m_lastName=name;}
XPathMatchListener.prototype._matchDOMNode=function(name,pred)
{var xp=name;if(pred.length!=0)
{var predicatesStr="";do{predicatesStr+=('['+pred.shift()+']');}while(pred.length!=0);xp+=predicatesStr;}
this.m_aggregateXPath+=("/"+xp);var notifyNodes=new Array();for(var i=0,l=this.m_matchedNodes.length;i<l;i++)
{var matchedNode=this.m_matchedNodes[i];if(matchedNode.getValue()!='/')
{notifyNodes[notifyNodes.length]=matchedNode;}}
this.m_parentXPaths.push({parent:this.m_aggregateXPath,node:name,notify:notifyNodes});}
XPathMatchListener.prototype._matchCurrentNodeChildren=function(name)
{var m=this.m_matchedNodes;var l=m.length;for(var i=0;i<l;i++)
{var n=m.shift();if('/'==n.getValue())m.push(n);this._matchChildren(n,name);}}
XPathMatchListener.prototype._matchChildren=function(n,name)
{var c=n.getChildren();for(var i in c)
{switch(i)
{case'/':this.m_matchedNodes.push(c[i]);this._matchChildren(c[i],name);break;case'*':this.m_matchedNodes.push(c[i]);break;default:if(i==name)
{this.m_matchedNodes.push(c[i]);}
break;}}
var p=n.getPredicates();for(var i in p)
{this._matchChildren(p[i],name);}}
XPathMatchListener.prototype.predicate=function(pred)
{this.m_lastPred.push(pred);}
XPathMatchListener.prototype.reset=function()
{this.m_lastName=null;this.m_lastPred=new Array();this.m_matchedNodes=new Array();this.m_matchedNodes.push(this.m_dataModel.m_root);this.m_aggregateXPath="";this.m_parentXPaths=new Array();}
XPathMatchListener.prototype.finishMatch=function()
{if(null!=this.m_lastName)
{this._matchCurrentNodeChildren(this.m_lastName);this._matchDOMNode(this.m_lastName,this.m_lastPred);this.m_lastName=null;}}
XPathMatchListener.prototype.createElementsToPath=function(invokeListeners)
{var pxps=this.m_parentXPaths;var dom=this.m_dataModel.m_dom;var n=null;var i=pxps.length-1;var found=false;var created=false;while(i>=0&&!found)
{var ns=dom.selectNodes(pxps[i].parent);switch(ns.length)
{case 0:i--;break;case 1:var found=true;i++;n=ns[0];break;default:throw new XPathParserListenerError("Multiple nodes selected by xpath fragment: "+pxps[i].parent);break;}}
if(null==n)
{n=dom;i=0;}
var newNodes=new Array;if(i<pxps.length)
{created=true;var length=pxps.length;for(var j=i;j<length;j++)
{var c=dom.createElement(pxps[j].node);n.appendChild(c);n=c;if(j<pxps.length)
{if(invokeListeners==true)
{var notifyNodes=pxps[j].notify;for(var k=notifyNodes.length-1;k>=0;k--)
{newNodes.push(notifyNodes[k]);var e=DataModelEvent.create(pxps[j].parent,DataModelEvent.ADD);var li=notifyNodes[k].getListeners();for(var m=0;m<li.length;m++)
{li[m].invoke(e);}}}}}}
var wrapper=new Array();wrapper["node"]=n;wrapper["created"]=created;wrapper["notifyNodes"]=newNodes;return wrapper;}
XPathMatchListener.prototype.setDOMValue=function(v)
{var n=this.createElementsToPath(true);XML.replaceNodeTextContent(n["node"],v);return n["created"];}
XPathMatchListener.prototype.invokeMatchedNodesListeners=function(t)
{var m=this.m_matchedNodes;for(var i=0,l=m.length;i<l;i++)
{if('/'!=m[i].getValue())
{var li=m[i].getListeners();for(var j=0,ll=li.length;j<ll;j++)
{li[j].invoke(t);}}}}
XPathMatchListener.prototype.invokeRecursiveMatchedNodeListeners=function(t,m)
{if('/'!=m.getValue())
{var listeners=m.getListeners();for(var j=0,c=listeners.length;j<c;j++)
{listeners[j].invoke(t);}
var children=m.getChildren();for(var k in children)
{this.invokeRecursiveMatchedNodeListeners(t,children[k]);}}}
DataModel.prototype.replaceNode=function(xp,nodes)
{if(DataModel.m_logger.isDebug())DataModel.m_logger.debug("** DataModel.prototype.replaceNode(xp:"+xp+")");this._startTransaction();var listeners=null;var removedListeners=null;var nodesToRemove=this.m_dom.selectNodes(xp);if(nodesToRemove.length>0)
{listeners=this.matchAgainstNodes(xp,nodesToRemove);removedListeners=listeners.slice(0);}
else
{removedListeners=new Array();}
var removeEvent=DataModelEvent.create(xp,DataModelEvent.REMOVE);var parent=null;for(var i=0,l=nodesToRemove.length;i<l;i++)
{var child=nodesToRemove[i];parent=child.parentNode;parent.removeChild(child);}
if(null==nodes)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.replaceNode(), source dom is null, therefore we have only removed the node at the specified xpath");this.invokeListeners(removedListeners,removeEvent);this._endTransaction();}
else
{var rootNode=this._getRootNode(nodes);if(null==rootNode)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.replaceNode(), source dom rootNode is null, therefore we have only removed the node at the specified xpath");this.invokeListeners(removedListeners,removeEvent);}
else
{if(null==parent)
{var l=this.parseXPath(xp);var toNode=l.createElementsToPath(true);parent=toNode["node"].parentNode;parent.removeChild(toNode["node"]);parent.appendChild(rootNode.cloneNode(true));}
else
{parent.appendChild(rootNode.cloneNode(true));}
listeners=this.matchAgainstNodes(xp,new Array(rootNode));var addedListeners=listeners.slice(0);var n=this.m_dom.selectNodes(xp);var position=n.length;var addedXp=xp+"[position() = "+position+"]";var addEvent=DataModelEvent.create(addedXp,DataModelEvent.ADD);var updateEvent=DataModelEvent.create(addedXp,DataModelEvent.UPDATE);this.invokeCombinedListeners(addedListeners,removedListeners,addEvent,removeEvent,updateEvent);}
this._endTransaction();nodes=null;}}
DataModel.prototype.addNodeSet=function(fromDom,toXPath)
{if(DataModel.m_logger.isDebug())DataModel.m_logger.debug("** DataModel.prototype.addNodeSet(xp:"+toXPath+")");if(null==fromDom)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.addNodeSet(), source dom is null");}
else
{var rootNode=this._getRootNode(fromDom);var originalToXPath=toXPath;if(null==rootNode)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.addNodeSet(), source dom rootNode is null");}
else
{this._startTransaction();var l=this.parseXPath(toXPath);var toNode=l.createElementsToPath(true);toNode["node"].appendChild(rootNode.cloneNode(true));toXPath=XPathUtils.concatXPaths(toXPath,rootNode.nodeName);var listeners=this.matchAgainstNodes(toXPath,new Array(rootNode));var n=this.m_dom.selectNodes(toXPath);var position=n.length;toXPath=toXPath+"[position() = "+position+"]";var event=DataModelEvent.create(toXPath,DataModelEvent.ADD);this.invokeListeners(listeners,event);this._endTransaction();}
fromDom=null;}}
DataModel.prototype.addNodeSetWithoutEvents=function(fromDom,toXPath)
{if(null==fromDom)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.addNodeSet(), source dom is null");}
else
{var rootNode=this._getRootNode(fromDom);if(null==rootNode)
{if(DataModel.m_logger.isWarn())DataModel.m_logger.warn("DataModel.addNodeSet(), source dom rootNode is null");}
else
{var l=this.parseXPath(toXPath);var toNode=l.createElementsToPath(false);var targetNode=toNode["node"];var targetChild=null;var childIndex=-1;var rootNodeName=rootNode.nodeName;var targetChildren=targetNode.childNodes;for(var i=0,l=targetChildren.length;i<l;i++)
{targetChild=targetChildren[i];if(targetChild.nodeType==XML.ELEMENT_NODE)
{if(targetChild.nodeName==rootNodeName)
{childIndex=i;break;}}}
if(childIndex==-1)
{targetNode.appendChild(rootNode.cloneNode(true));}
else
{if(rootNode.childNodes.length>0)
{this._appendChildrenToTargetNode(targetChildren[childIndex],rootNode.childNodes);}
else
{targetNode.appendChild(rootNode.cloneNode(true));}}}
fromDom=null;}}
DataModel.prototype._appendChildrenToTargetNode=function(target,children)
{var childIndex;var child;var targetChild;var targetChildren=target.childNodes;for(var i=0,il=children.length;i<il;i++)
{child=children[i];if(child.nodeType==XML.ELEMENT_NODE)
{childIndex=-1;for(var j=0,jl=targetChildren.length;j<jl;j++)
{targetChild=targetChildren[j];if(targetChild.nodeType==XML.ELEMENT_NODE)
{if(targetChild.nodeName==child.nodeName)
{childIndex=j;break;}}}
if(childIndex==-1)
{target.appendChild(child.cloneNode(true));}
else
{if(child.childNodes.length>0)
{this._appendChildrenToTargetNode(targetChildren[j],child.childNodes);}
else
{target.appendChild(child.cloneNode(true));}}}}}
DataModel.prototype.removeNode=function(xp)
{if(DataModel.m_logger.isDebug())DataModel.m_logger.debug("** DataModel.prototype.removeNode(xp:"+xp+")");this._startTransaction();var nodesToRemove=this.m_dom.selectNodes(xp);var listeners=this.matchAgainstNodes(xp,nodesToRemove);var event=DataModelEvent.create(xp,DataModelEvent.REMOVE);this.invokeListeners(listeners,event);for(var i=0,l=nodesToRemove.length;i<l;i++)
{var child=nodesToRemove[i];var parent=child.parentNode;parent.removeChild(child);}
this._endTransaction();return nodesToRemove;}
DataModel.prototype.invokeListenersFromHashMap=function(listeners,event)
{var totalListeners=new Array();var m=listeners;for(var i in m)
{if('/'!=m[i].getValue())
{var li=m[i].getListeners();for(var j=0,ll=li.length;j<ll;j++)
{totalListeners[totalListeners.length]=li[j];}}}
this._invokeUniqueListeners(totalListeners,event);}
DataModel.prototype.invokeListeners=function(listeners,event)
{var totalListeners=new Array();var m=listeners;for(var i=m.length-1;i>=0;i--)
{if('/'!=m[i].getValue())
{var li=m[i].getListeners();for(var j=li.length-1;j>=0;j--)
{totalListeners[totalListeners.length]=li[j];}}}
this._invokeUniqueListeners(totalListeners,event);}
DataModel.prototype._invokeUniqueListeners=function(totalListeners,event)
{var count=0;totalListeners.sort(FormControllerListener._sortFormControllerListeners);var last=null;while(totalListeners.length>0)
{var candidate=totalListeners.pop();if(last!=candidate)
{last=candidate;candidate.invoke(event);count++;}}
if(DataModel.m_logger.isInfo())
{if(event.getType()==DataModelEvent.REMOVE)
{if(DataModel.m_logger.isInfo())DataModel.m_logger.info("***** invoked "+count+" listeners with REMOVE event");}
else if(event.getType()==DataModelEvent.UPDATE)
{if(DataModel.m_logger.isInfo())DataModel.m_logger.info("***** invoked "+count+" listeners with UPDATE event");}
else
{if(DataModel.m_logger.isInfo())DataModel.m_logger.info("***** invoked "+count+" listeners with ADD event");}}}
DataModel.prototype.invokeCombinedListeners=function(addedListeners,removedListeners,addEvent,removeEvent,updateEvent)
{var totalNodes=new Array();var adds=addedListeners;var removes=removedListeners;var removesHashMap=new Array();var addsHashMap=new Array();var combinedHashMap=new Array();for(var j=0,m=removes.length;j<m;j++)
{var item=removes[j];removesHashMap[item.getObjectRef()]=item;combinedHashMap[item.getObjectRef()]=item;}
for(var i=0,n=adds.length;i<n;i++)
{var item=adds[i];addsHashMap[item.getObjectRef()]=item;combinedHashMap[item.getObjectRef()]=item;}
for(var r in combinedHashMap)
{var item=combinedHashMap[r];if(addsHashMap[r]&&removesHashMap[r])
{totalNodes[totalNodes.length]=item;delete addsHashMap[r];delete removesHashMap[r];}}
if(totalNodes.length>0)this.invokeListeners(totalNodes,updateEvent);totalNodes.length=0;this.invokeListenersFromHashMap(removesHashMap,removeEvent);this.invokeListenersFromHashMap(addsHashMap,addEvent);}
DataModel.prototype.matchAgainstNodes=function(xp,nodes)
{var l=this.parseXPath(xp);if(nodes.length>0)
{l=l.matchAgainstNodes(nodes,xp);}
return l;}
DataModel.prototype._getRootNode=function(fromDom)
{var rootNode=null;if(fromDom.nodeType==XML.ELEMENT_NODE)
{rootNode=fromDom;}
else
{var childNodes=fromDom.childNodes;for(var i=childNodes.length-1;i>=0;i--)
{if(childNodes[i].nodeType==XML.ELEMENT_NODE)
{rootNode=childNodes[i];break;}}}
return rootNode;}
XPathMatchListener.prototype.matchAgainstNodes=function(nodes)
{this.m_totalMatches=new Array();this.m_totalMatches["/"]=this.m_matchedNodes.slice(0);for(var i=0;i<this.m_matchedNodes.length;i++)
{var registryNode=this.m_matchedNodes[i];if(registryNode.getValue()=="/")
{this._matchListenerChildrenAgainstNodes(registryNode,nodes,"./");}
else
{this._matchListenerChildrenAgainstNodes(registryNode,nodes,".");}}
var totalMatches=new Array();for(var i in this.m_totalMatches)
{totalMatches=totalMatches.concat(this.m_totalMatches[i]);delete this.m_totalMatches[i];}
this.m_totalMatches.length=0;totalMatches.sort(XPathRegistryNode._sortRegistryNodes);var last=null;var tm=this.m_totalMatches;while(totalMatches.length>0)
{var candidate=totalMatches.pop();if(last!=candidate.getObjectRef())
{last=candidate.getObjectRef();tm[tm.length]=candidate;}}
return this.m_totalMatches;}
XPathMatchListener.prototype._matchListenerChildrenAgainstNodes=function(registryNode,nodes,xp)
{var children=registryNode.getChildren();for(var i in children)
{var childXp=null;var bMatch=false;var child=children[i];var childValue=child.getValue();if(xp.length>2&&(xp.lastIndexOf("//")==(xp.length-2)))
{childXp=xp+childValue;}
else
{childXp=xp+"/"+childValue;}
if(childValue=="/"||childValue=="*")
{this._addChildToTotalMatches(childXp,child);bMatch=true;}
else
{var result=null;for(var i=0,l=nodes.length;i<l;i++)
{result=nodes[i].selectNodes(childXp);if(result.length>0)break;}
if(result.length>0)
{this._addChildToTotalMatches(childXp,child);bMatch=true;}}
if(bMatch)
{this._matchListenerChildrenAgainstNodes(child,nodes,childXp);}}}
XPathMatchListener.prototype._addChildToTotalMatches=function(xp,node)
{if(null==this.m_totalMatches[xp])this.m_totalMatches[xp]=new Array();this.m_totalMatches[xp][this.m_totalMatches[xp].length]=node;}
XPathRegistryNode._sortRegistryNodes=function(a,b)
{if(a.getObjectRef()>b.getObjectRef())
{return 1;}
else if(a.getObjectRef()==b.getObjectRef())
{return 0;}
return-1;}
function FormView()
{}
FormView.prototype.m_guiAdaptorFactory=null;FormView.prototype.m_configManager=null;FormView.prototype.getGUIAdaptorFactory=function()
{return this.m_guiAdaptorFactory;}
FormView.prototype.getConfigManager=function()
{return this.m_configManager;}
FormView.prototype.dispose=function()
{}
function ServiceParams()
{this.m_dom=XML.createDOM(null,null,null);this.m_paramsNode=XML.createElement(this.m_dom,'params');this.m_dom.appendChild(this.m_paramsNode);}
ServiceParams.prototype.getDOM=function()
{return this.m_dom;}
ServiceParams.prototype.addSimpleParameter=function(paramName,value)
{var paramNode=this._createBaseParameterNode(paramName);if(value!=null)
{var valueNode=XML.createTextNode(this.m_dom,value.toString());paramNode.appendChild(valueNode);}}
ServiceParams.prototype.addDOMParameter=function(paramName,dom)
{var paramNode=this._createBaseParameterNode(paramName);var copy=dom.documentElement.cloneNode(true);paramNode.appendChild(copy);}
ServiceParams.prototype.addNodeParameter=function(paramName,node)
{var paramNode=this._createBaseParameterNode(paramName);var copy=node.cloneNode(true);paramNode.appendChild(copy);}
ServiceParams.prototype._createBaseParameterNode=function(paramName)
{var paramNode=XML.createElement(this.m_dom,'param');var nameNode=XML.createAttribute(this.m_dom,'name');nameNode.value=paramName;paramNode.attributes.setNamedItem(nameNode);this.m_paramsNode.appendChild(paramNode);return paramNode;}
ServiceParams.PAYLOAD_XML_HEADER="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";ServiceParams.prototype.getPayload=function()
{var xmlString=this.m_dom.xml;if(xmlString.indexOf(ServiceParams.PAYLOAD_XML_HEADER)==-1)
{xmlString=ServiceParams.PAYLOAD_XML_HEADER+xmlString;}
return xmlString;}
function fwDataService()
{}
fwDataService.m_logger=new Category("fwDataService");fwDataService.prototype.m_config=null;fwDataService.prototype.m_resultHandler=null;fwDataService.prototype.m_dom=null;fwDataService.prototype.load=function()
{fc_assertAlways("fwDataService.load() base class method must be overridden");}
fwDataService.prototype._handleResultDOM=function(dom)
{var error=dom.parseError;if(error.errorCode!=0)
{this.handleException(new fwDataServiceException("Loaded Document contained parsing error."+"\nReason for failure: "+error.reason));}
else
{this.handleValidDom(dom);}}
fwDataService.prototype.handleValidDom=function(dom)
{try
{if(null!=dom)
{if(null!=this.m_resultHandler.onSuccess)
{this._processSuccessfulDOMCreation(dom);}
else
{throw new ConfigurationException("No onSuccess method defined on handler.");}}
else
{this.handleException(new fwDataServiceException("Empty DOM returned from server."));}}
catch(exception)
{this.handleException(exception)}}
fwDataService.prototype.handleException=function(ex)
{try
{var handler=this.m_resultHandler;this._executeExceptionHandlingPreprocessing(handler);var exceptionHandled=false;if(ex instanceof fwException)
{var exceptionArray=ex.exceptionHierarchy;for(var i=exceptionArray.length-1;i>-1;i--)
{if(handler["on"+exceptionArray[i]]!=null)
{handler["on"+exceptionArray[i]](ex,this.m_serviceMethodName);exceptionHandled=true;break;}}}
else
{ex=new fwException("Runtime exception throw",ex);}
if(!exceptionHandled)
{this.invokeOnError(ex);}}
catch(exception)
{var newException=new fwException("Exception thrown handling result of document creation - "
+fwException.getErrorMessage(exception),ex);FormController.handleFatalException(newException);}}
fwDataService.prototype.invokeOnError=function(ex,name)
{if(null!=this.m_resultHandler.onError)
{this.m_resultHandler.onError(ex,this.m_serviceMethodName);}
else
{this.m_resultHandler.defaultErrorHandler(ex,this.m_serviceMethodName);}}
fwDataService.prototype._processSuccessfulDOMCreation=function(dom)
{this.m_resultHandler.onSuccess(dom,this.m_serviceMethodName);}
fwDataService.create=function(config,resultHandler,async)
{if(null==config)
{throw new ConfigurationException("No configuration provided");}
if(!(fwDataService.isDataServiceConfigured(config)))
{throw new ConfigurationException("Form fwDataService configuration must specify one and only of serviceName, fileName, srcXPath, xml or computed properties");}
var dS=null;if(config.serviceName!=null)
{dS=new fwServiceCallDataService();}
else if(config.fileName!=null)
{dS=new fwFileDataService();}
else if(config.computed!=null)
{dS=new fwComputedDataService();}
else if(config.srcXPath!=null)
{dS=new fwSrcXPathDataService();}
else if(config.xml!=null)
{dS=new fwXMLStringDataService();}
dS._initialise(config,async,resultHandler);return dS;}
fwDataService.isDataServiceConfigured=function(config)
{var serviceName=config.serviceName;var fileName=config.fileName;var srcXPath=config.srcXPath;var computed=config.computed;var xml=config.xml;return((null!=serviceName&&null==fileName&&null==srcXPath&&null==computed&&null==xml)||(null==serviceName&&null!=fileName&&null==srcXPath&&null==computed&&null==xml)||(null==serviceName&&null==fileName&&null!=srcXPath&&null==computed&&null==xml)||(null==serviceName&&null==fileName&&null==srcXPath&&null!=computed&&null==xml)||(null==serviceName&&null==fileName&&null==srcXPath&&null==computed&&null!=xml));}
fwDataService.prototype._setResultDOM=function(dom)
{this.m_dom=dom;}
fwDataService.prototype._initialise=function(config,async,resultHandler)
{this.m_config=config;this.m_resultHandler=resultHandler;this.m_async=async;this.m_serviceMethodName=config.method;}
fwDataService.prototype.getDefaultName=function()
{return"Unknown";}
fwDataService.prototype._executeExceptionHandlingPreprocessing=function(resultHandler)
{var preProcessingFunc=resultHandler[fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING];if(null!=preProcessingFunc)
{preProcessingFunc.call(this);}}
fwDataService.prototype.httpConnectionExceptionHandlerExists=function()
{return null!=this.m_resultHandler.onHttpConnectionException;}
fwDataService.prototype.invokeOnHttpConnectionExceptionHandler=function(ex)
{this.m_resultHandler.onHttpConnectionException(ex,this.m_serviceMethodName);}
var xmlHttpServiceRequestQueue=new Array();function fwServerCallDataService()
{}
fwServerCallDataService.prototype=new fwDataService();fwServerCallDataService.prototype.constructor=fwServerCallDataService;fwServerCallDataService.m_logger=new Category("fwServerCallDataService");fwServerCallDataService.MAX_RETRIES=3;fwServerCallDataService.HTTP_Error_Constants={400:"Erroneous request made to the server.",401:"Not authorized to access this resource.",403:"Forbidden to access this resource.",404:"Service not found on server.",500:"An internal error has occurred at the server.",501:"Service not implemented.",502:"Service call timed out.",12002:"The request has timed out.",12029:"The attempt to connect to the server failed.",12030:"The connection with the server has been terminated.",12031:"The connection with the server has been reset.",12152:"The server response could not be parsed.",13030:"Request/response status not available."};fwServerCallDataService.DEFAULT_HTTP_CONNECTION_ERROR_RETRY_RESPONSES={"12030":true,"12152":true};fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE=13030;fwServerCallDataService.prototype._initialise=function(config,async,resultHandler)
{this.m_retryCount=0;fwDataService.prototype._initialise.call(this,config,async,resultHandler);}
fwServerCallDataService.prototype.handleReadyStateChange=function(index)
{var requestInfo=xmlHttpServiceRequestQueue[index];if(null!=requestInfo)
{var request=requestInfo.server.getRequest();if(request.readyState==4)
{if(this.m_config.showProgress)
{var fc=FormController.getInstance();this.m_appC.m_serviceRequestCount--;this.m_appC._hideProgress(fc);}
var requestStatus=this._getRequestStatus(request);if(requestStatus==200||requestStatus==999)
{this.resetRetryCount();if(fwServerCallDataService.m_logger.isDebug())fwServerCallDataService.m_logger.debug("Response text: "+request.responseText);if(fwServerCallDataService.m_logger.isDebug())fwServerCallDataService.m_logger.debug("Status text: "+request.statusText);var dom=XML.createDOM(null,null,null);dom.loadXML(request.responseText);this._handleResultDOM(dom);requestInfo.server.dispose();requestInfo.server=null;delete xmlHttpServiceRequestQueue[index];requestInfo=null;}
else
{var errorRetryResponses=this._getHttpConnectionErrorRetryResponses();var retryStatus=this._isRetryStatus(requestStatus,errorRetryResponses);var httpConnectionExceptionHandlerExists=this.httpConnectionExceptionHandlerExists();if(retryStatus&&httpConnectionExceptionHandlerExists)
{this.resetRetryCount();var errorMessage=fwServerCallDataService.HTTP_Error_Constants[requestStatus];var exception;if(null!=errorMessage)
{exception=new HttpConnectionException("Http connection error - "+errorMessage);}
else
{exception=new HttpConnectionException("Request/response status defined in configured Http connection error retry responses detected. Request status : "+
requestStatus);}
exception.setResponseStatus(requestStatus);requestInfo.server.dispose();requestInfo.server=null;delete xmlHttpServiceRequestQueue[index];requestInfo=null;this.invokeOnHttpConnectionExceptionHandler(exception);}
else if(retryStatus&&(!httpConnectionExceptionHandlerExists)&&this.getRetryCount()<this._getHttpConnectionErrorRetryLimit())
{this.incrementRetryCount();requestInfo.server.dispose();requestInfo.server=null;delete xmlHttpServiceRequestQueue[index];requestInfo=null;this.load();}
else
{this.resetRetryCount();if(fwServerCallDataService.m_logger.isDebug())fwServerCallDataService.m_logger.debug("requestStatus: "+requestStatus);var errorMessage=fwServerCallDataService.HTTP_Error_Constants[requestStatus];var exception;if(errorMessage!=null)
{exception=new SystemException("Network or System error - "+requestStatus+" : "+errorMessage);}
else
{exception=new SystemException("Erroneous or unexpected server response code: "+requestStatus);}
requestInfo.server.dispose();requestInfo.server=null;delete xmlHttpServiceRequestQueue[index];requestInfo=null;this.invokeOnError(exception);}
errorRetryResponses=null;retryStatus=null;httpConnectionExceptionHandlerExists=null;}}}}
fwServerCallDataService.prototype.incrementRetryCount=function(){this.m_retryCount++;}
fwServerCallDataService.prototype.getRetryCount=function(){return this.m_retryCount;}
fwServerCallDataService.prototype.resetRetryCount=function(){this.m_retryCount=0;}
fwServerCallDataService.prototype._getRequestStatus=function(request)
{var requestStatus;try
{if(request.status!==undefined&&request.status!=0)
{requestStatus=request.status;}
else
{requestStatus=fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE;}}
catch(ex)
{requestStatus=fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE;}
return requestStatus;}
fwServerCallDataService.prototype._getHttpConnectionErrorRetryLimit=function()
{var retryLimit=null;if(null!=this.m_appC)
{retryLimit=this.m_appC.getHttpConnectionErrorRetryLimit();}
if(null==retryLimit)
{retryLimit=fwServerCallDataService.MAX_RETRIES;}
return retryLimit;}
fwServerCallDataService.prototype._getHttpConnectionErrorRetryResponses=function()
{var errorRetryResponses=null;if(null!=this.m_appC)
{errorRetryResponses=this.m_appC.getHttpConnectionErrorRetryResponses();}
if(null==errorRetryResponses)
{errorRetryResponses=fwServerCallDataService.DEFAULT_HTTP_CONNECTION_ERROR_RETRY_RESPONSES;}
return errorRetryResponses;}
fwServerCallDataService.prototype._isRetryStatus=function(requestStatus,errorRetryResponses)
{var isRetryStatus=errorRetryResponses[requestStatus.toString()];if(null==isRetryStatus)
{isRetryStatus=false;}
return isRetryStatus;}
function fwComputedDataService()
{}
fwComputedDataService.prototype=new fwDataService();fwComputedDataService.prototype.constructor=fwComputedDataService;fwComputedDataService.prototype.load=function()
{var dom=XML.createDOM(null,null,null);var async=(true==this.m_config.computedAsync);if(async)
{var thisObj=this;this.m_config.computed(dom,function(){thisObj._handleLoadSuccess(dom);},function(ex){thisObj._handleLoadFail(ex);});}
else
{try
{this.m_config.computed(dom);this._handleLoadSuccess(dom);}
catch(ex)
{this._handleLoadFail(ex);}}}
fwComputedDataService.prototype._handleLoadSuccess=function(dom)
{this._handleResultDOM(dom);}
fwComputedDataService.prototype._handleLoadFail=function(ex)
{if(null==ex)
{ex=new fwDataServiceException("Loading failed for Data Service: "+this.getDefaultName()+" no reason provided by application");}
this.handleException(ex);}
fwComputedDataService.prototype.getDefaultName=function()
{return"Computed Data Service";}
function fwDataServiceException(msg,rootCause)
{fwException.call(this,msg,rootCause);this.exceptionHierarchy=new Array('Error','BusinessException','fwDataServiceException');}
fwDataServiceException.prototype=new fwException();fwDataServiceException.prototype.constructor=fwDataServiceException;function fwComputedDataServiceException(msg,rootCause)
{fwException.call(this,msg,rootCause);this.exceptionHierarchy=new Array('Error','BusinessException','fwComputedDataServiceException');}
fwComputedDataServiceException.prototype=new fwException();fwComputedDataServiceException.prototype.constructor=fwDataServiceException;fwComputedDataServiceException.prototype.addDetail=function(detail)
{this.m_detail=detail;}
fwComputedDataServiceException.prototype.getDetail=function()
{return this.m_detail;}
function fwFileDataService()
{}
fwFileDataService.prototype=new fwServerCallDataService();fwFileDataService.prototype.constructor=fwFileDataService;fwFileDataService.prototype._initialise=function(config,async,resultHandler)
{var showProgress=config.showProgress;config.showProgress=(null==showProgress)?true:showProgress;if(config.showProgress)
{this.m_appC=Services.getAppController();}
fwServerCallDataService.prototype._initialise.call(this,config,async,resultHandler);}
fwFileDataService.prototype.load=function()
{this.retrieveFileUsingXMLHttpServiceRequest();}
fwFileDataService.prototype.retrieveFileUsingXMLHttpServiceRequest=function()
{if(this.m_config.showProgress)
{this.m_appC._showProgress();this.m_appC.m_serviceRequestCount++;}
var index;var requestInfo=new Object();index=xmlHttpServiceRequestQueue.length;xmlHttpServiceRequestQueue.push(requestInfo);requestInfo.server=new XMLHttpServiceRequest();var async;if(this.m_async==false)
{async=false;}
else
{async=true;}
requestInfo.server.initialise(this,this.m_config.fileName,async,null,handleRequestReadyStateChange);var handlerArgs=new Array();handlerArgs[0]=index;requestInfo.server.sendGET("loadStaticFile",handlerArgs);}
fwFileDataService.prototype._handleLoadComplete=function(dom)
{this._handleResultDOM(dom);}
fwFileDataService.prototype.getDefaultName=function()
{return this.m_config.fileName;}
function fwServiceCallDataService()
{}
fwServiceCallDataService.prototype=new fwServerCallDataService();fwServiceCallDataService.prototype.constructor=fwServiceCallDataService;fwServiceCallDataService.m_logger=new Category("fwServiceCallDataLoader");fwServiceCallDataService.servletName="InvokerServlet";fwServiceCallDataService.MAX_PUT_URL_LENGTH=2028;fwServiceCallDataService.SUPS_ExceptionTag="SupsServiceException";fwServiceCallDataService.prototype._initialise=function(config,async,resultHandler)
{this.m_appC=Services.getAppController();var mappingName=config.serviceName;var parameters=(config.callServiceParams!=null?config.callServiceParams:fwServiceCallDataService._createParameters(config.serviceParams,false));this.m_serviceURL=this.m_appC.m_rootURL+this.m_appC.m_config.getServiceBaseURL()
+"_invoker/"+fwServiceCallDataService.servletName;if(config.secure)
{var securePort=this.m_appC.m_config.m_servicesSecurePort;this.m_serviceURL=this.m_serviceURL.replace(/^http[s]{0,1}:/,"https:");this.m_serviceURL=this.m_serviceURL.replace(/^(https:\/\/[^:\/]*)[:,0-9]*(.*)/,"$1:"+securePort+"$2");}
var formName=this.m_appC.m_currentForm.getName();var service=this.m_appC.m_config.getServiceForFormMapping(formName,mappingName);if(service==null)
{throw new ConfigurationException("No Service found for mapping: "+mappingName+" in form: "+formName);}
var serviceURL=this.m_serviceURL;var serviceName=service.getURL();var method=service.getMethod();var username;if(config.username==null)
{username=this.m_appC.getSecurityContext().getCurrentUser().getUserName();}
else
{username=config.username;}
var password=config.password;var commonParameters=this.m_appC.m_config.getCommonParameters();for(var i=0;i<commonParameters.length;i++)
{parameters.addSimpleParameter(commonParameters[i].name,Services.getValue(commonParameters[i].value));}
var payload=parameters.getPayload();var cacheStrategy=service.m_cacheStrategy;var thisObj=this;var exceptionHandlers=this.m_appC.getExceptionHandlers();var useDefault=exceptionHandlers["InvalidUserSession"].useDefault;if(null==resultHandler.onInvalidUserSessionException&&true==useDefault)
{var invalidUserSessionMsg=exceptionHandlers["InvalidUserSession"].message;resultHandler.onInvalidUserSessionException=function(ex,name)
{thisObj.defaultExceptionHandler(invalidUserSessionMsg,ex.message);};}
useDefault=exceptionHandlers["Authorization"].useDefault;if(null==resultHandler.onAuthorizationException&&true==useDefault)
{var authorizationMsg=exceptionHandlers["Authorization"].message;resultHandler.onAuthorizationException=function(ex,name)
{thisObj.defaultExceptionHandler(authorizationMsg,ex.message);};}
var async=(null==config.async)?true:config.async;var showProgress=(null==config.showProgress)?true:config.showProgress;var fullConfig={url:serviceURL,serviceName:serviceName,method:method,handler:resultHandler,payload:payload,username:username,password:password,async:async,showProgress:showProgress,cacheStrategy:cacheStrategy,secure:config.secure}
fwServerCallDataService.prototype._initialise.call(this,fullConfig,async,resultHandler);}
fwServiceCallDataService.prototype.defaultExceptionHandler=function(uMsg,eMsg)
{if(null==uMsg)
{uMsg=eMsg;}
if(this.m_appC.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{var callbackFunction=function(userResponse)
{var ac=Services.getAppController();if(ac!=null)
{ac.logoff(null,false);}}
this.m_appC._hideProgress();Services.showDialog(StandardDialogTypes.OK,callbackFunction,uMsg);}
else
{this.m_appC._hideProgress();alert(uMsg);this.m_appC.logoff(null,false);}}
fwServiceCallDataService.prototype.load=function()
{this.callHTTPService();}
fwServiceCallDataService.prototype.callHTTPService=function()
{if(fwServiceCallDataService.m_logger.isTrace())fwServiceCallDataService.m_logger.trace("fwServiceCallDataService.callService");var config=this.m_config;try{var handler=config.handler;if(handler==null)
{throw new ConfigurationException("Null handler object");}
else if(handler.onSuccess==undefined)
{throw new ConfigurationException("Must implement onSuccess");}
var url=config.url;var serviceName=config.serviceName;var method=config.method;var handler=config.handler;var payload=config.payload;var username=config.username;var password=config.password;var async=config.async;var showProgress=config.showProgress;var cacheStrategy=config.cacheStrategy;var secure=config.secure;if(fwServiceCallDataService.m_logger.isDebug())fwServiceCallDataService.m_logger.debug("processing request for serviceName: "+serviceName);if(showProgress)
{this.m_appC._showProgress();this.m_appC.m_serviceRequestCount++;}
handler.serviceName=serviceName;var index;var requestInfo=new Object();index=xmlHttpServiceRequestQueue.length;xmlHttpServiceRequestQueue.push(requestInfo);requestInfo.server=new XMLHttpServiceRequest();requestInfo.server.initialise(this,url,async,handler,handleRequestReadyStateChange);requestInfo.server.addHeader("SUPS-User",username);requestInfo.server.addParameter("SUPS-Method",method);requestInfo.server.addParameter("SUPS-Service",serviceName);if(password!=null)
{requestInfo.server.addHeader("SUPS-Password",password);}
else
{var macString=this.m_appC.m_securityContext.generateMac(payload);requestInfo.server.addHeader("SUPS-Mac",macString);}
if(secure)
{payload=null;}
var handlerArgs=new Array();handlerArgs[0]=index;if(cacheStrategy!=null&&cacheStrategy=="GET")
{requestInfo.server.sendGET(payload,handlerArgs);}
else
{requestInfo.server.sendPOST(payload,handlerArgs);}}
catch(ex)
{throw new SystemException("Exception thrown calling service.",ex);}}
fwServiceCallDataService.prototype._processSuccessfulDOMCreation=function(dom)
{var exceptionNodeArray=dom.selectNodes("/"+fwServiceCallDataService.SUPS_ExceptionTag);if(exceptionNodeArray.length==0)
{fwDataService.prototype._processSuccessfulDOMCreation.call(this,dom);return;}
var exceptionString=XML.getNodeTextContent(exceptionNodeArray[0]);var exceptionStringArray=exceptionString.split("||");var exceptionArray=exceptionStringArray[0].split("|");exceptionStringArray.shift();var exceptionMessage=exceptionStringArray.join();var exceptionHandled=false;var handler=this.m_config.handler;var exception=new fwException(exceptionMessage);exception.exceptionHierarchy=exceptionArray;this.handleException(exception);}
function XMLHttpServiceRequest(){};XMLHttpServiceRequest.prototype.initialise=function(callingObject,url,async,handler,readyStateHandler)
{this.m_async=async;this.m_url=url;this.m_firstParam=true;this.m_params=new Array();this.m_headers=new Array();this.m_callingObject=callingObject;this.m_handler=handler;this.m_request=null;this.m_readyStateHandler=readyStateHandler;}
XMLHttpServiceRequest.prototype.dispose=function()
{this.m_callingObject=null;this.m_handler=null;this.m_readyStateHandler=null;this.m_request=null;}
XMLHttpServiceRequest.prototype.addParameter=function(name,value)
{this.m_params.push({Name:name,Value:value});}
XMLHttpServiceRequest.prototype.addHeader=function(name,value)
{this.m_headers.push({Name:name,Value:value});}
XMLHttpServiceRequest.prototype.sendGET=function(payload,handlerArgs)
{var firstParam=true;var url=this.m_url+"?PARAMS="+encodeURIComponent(payload);for(var i=0,l=this.m_params.length;i<l;i++)
{var name=this.m_params[i].Name;var value=this.m_params[i].Value;if(name==null||name==""||value==null)
{throw new ConfigurationException("Empty parameter name or null value");}
url=url+"&"+name+"="+encodeURIComponent(value);}
if(url.length>fwServiceCallDataService.MAX_PUT_URL_LENGTH)
{this.sendPOST(payload,handlerArgs);return;}
var request=this._getRequest(handlerArgs);request.open("GET",url,this.m_async);request.setRequestHeader("Content-Type","application/x-javascript");for(var i=0,l=this.m_headers.length;i<l;i++)
{var name=this.m_headers[i].Name;var value=this.m_headers[i].Value;request.setRequestHeader(name,value);}
request.send(null);}
XMLHttpServiceRequest.prototype.sendPOST=function(payload,handlerArgs)
{var request=this._getRequest(handlerArgs);request.open("POST",this.m_url,this.m_async);request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");for(var i=0,l=this.m_params.length;i<l;i++)
{var name=this.m_params[i].Name;var value=this.m_params[i].Value;request.setRequestHeader(name,value);}
for(var i=0,l=this.m_headers.length;i<l;i++)
{var name=this.m_headers[i].Name;var value=this.m_headers[i].Value;request.setRequestHeader(name,value);}
request.send(payload);}
XMLHttpServiceRequest.prototype._getRequest=function(handlerArgs)
{this.m_request=new ActiveXObject("Microsoft.XMLHTTP");var localHandlerArgs=handlerArgs;var thisObj=this;if(typeof ActiveXObject=='undefined'){this.m_request.onload=function(e){var evt=window.event?window.event:e;var targ=evt.target?evt.target:evt.srcElement;thisObj.m_readyStateHandler.call(thisObj,handlerArgs);}}
else{this.m_request.onreadystatechange=function(){thisObj.m_readyStateHandler.call(thisObj,handlerArgs);};}
return this.m_request;}
XMLHttpServiceRequest.prototype.getRequest=function()
{return this.m_request;}
function handleRequestReadyStateChange(handlerArgs)
{var index=handlerArgs[0];var requestInfo=xmlHttpServiceRequestQueue[index];if(null!=requestInfo)
{requestInfo.server.m_callingObject.handleReadyStateChange(index);requestInfo=null;}}
fwServiceCallDataService._createParameters=function(paramConfigs,stripCleanRecords)
{var params=new ServiceParams();var _stripCleanRecords=(null==stripCleanRecords)?false:stripCleanRecords;for(var i in paramConfigs)
{var paramConfig=paramConfigs[i];var paramName=paramConfig.name;if(null==paramName)
{throw new ConfigurationException("Service parameter name not defined.");}
if(null!=paramConfig.value)
{var value=Services.getValue(paramConfig.value);if(null==value)
{value="";}
if(fwServiceCallDataService.m_logger.isTrace())fwServiceCallDataService.m_logger.debug("fwServiceCallDataService._createParameters(): adding parameter to ServiceParams, name = "+paramName+", from XPath = '"+paramConfig.value+"', value = "+value);params.addSimpleParameter(paramName,value);}
else if(null!=paramConfig.constant)
{var value=paramConfig.constant;if(null==value)
{value="";}
if(fwServiceCallDataService.m_logger.isTrace())fwServiceCallDataService.m_logger.debug("fwServiceCallDataService._createParameters():, adding constant parameter to ServiceParams, name = "+paramName+", value = "+value);params.addSimpleParameter(paramName,value);}
else if(null!=paramConfig.node)
{var tmpDOM=XML.createDOM(null,null,null);var paramXPath=paramConfig.node;var saveNode=Services.getNode(paramXPath);var targetXPath=paramConfig.target;if(null!=targetXPath)
{var targetNodeParents=fwServiceCallDataService._parseXPathNodeNames(targetXPath);var pathNodes=new Array();for(var j=0,jl=targetNodeParents.length;j<jl;j++)
{pathNodes[j]=XML.createElement(tmpDOM,targetNodeParents[j]);if(j>0)
{pathNodes[j-1].appendChild(pathNodes[j]);}}
pathNodes[j-1].appendChild(saveNode);tmpDOM.appendChild(pathNodes[0]);}
else
{tmpDOM.appendChild(saveNode);}
if(_stripCleanRecords)
{var recordOffset=XPathUtils.removeTrailingNode(paramXPath);tmpDOM=RecordsProtocol.stripCleanRecords(tmpDOM,recordOffset,targetXPath);}
params.addDOMParameter(paramName,tmpDOM);}}
return params;}
fwServiceCallDataService._parseXPathNodeNames=function(xp)
{var s=0;var lastSlash=-1;var nodeNames=new Array();var length=xp.length;if(length>0)
{if(xp.charAt(s)=='/')
{s=1;lastSlash=0;}
while(s<length)
{switch(xp.charAt(s))
{case'/':if(s>lastSlash+1)
{nodeNames[nodeNames.length]=xp.substring(lastSlash+1,s);lastSlash=s;s++;}
else
{throw new ConfigurationException("Error target node definition contains unexpected double foreslashes");}
break;default:s++;break;}}
if(lastSlash!=length-1)
{nodeNames[nodeNames.length]=xp.substring(lastSlash+1,s)}}
return nodeNames;}
fwServiceCallDataService.prototype.getDefaultName=function()
{return this.m_config.serviceName;}
function fwSrcXPathDataService()
{}
fwSrcXPathDataService.prototype=new fwDataService();fwSrcXPathDataService.prototype.constructor=fwSrcXPathDataService;fwSrcXPathDataService.prototype.load=function()
{var dom=XML.createDOM(null,null,null);try
{var srcNode=Services.getNode(this.m_config.srcXPath);if(null!=srcNode)
{dom.appendChild(srcNode);}
this._handleResultDOM(dom);}
catch(ex)
{this.handleException(ex);}}
fwSrcXPathDataService.prototype.getDefaultName=function()
{return this.m_config.srcXPath;}
function fwXMLStringDataService()
{}
fwXMLStringDataService.prototype=new fwDataService();fwXMLStringDataService.prototype.constructor=fwXMLStringDataService;fwXMLStringDataService.prototype.load=function()
{var dom=XML.createDOM(null,null,null);dom.loadXML(this.m_config.xml);this._handleResultDOM(dom);}
fwXMLStringDataService.prototype.getDefaultName=function()
{return this.m_config.xml;}
function fwDataLoader()
{}
fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING="exceptionHandlerPreprocessing";fwDataLoader.prototype.m_config=null;fwDataLoader.prototype.m_dataService=null;fwDataLoader.prototype._initialise=function(config)
{this.m_config=config;var resultHandler=this._getResultHandler();this.m_dataService=this._createDataService(resultHandler);}
fwDataLoader.prototype.load=function()
{try
{this.m_dataService.load();}
catch(ex)
{FormController.handleFatalException(new fwException("Exception thrown while loading data service",ex));}}
fwDataLoader.prototype._getResultHandler=function()
{var thisObj=this;var resultHandler=new Object();var config=this.m_config;if(config.errorHandler)
{for(var i in config.errorHandler)
{if(i=="onSuccess")
{throw new ConfigurationException("Cannot specify onSuccess handler for framework service call configurations");}
else
{resultHandler[i]=config.errorHandler[i];}}}
resultHandler.onSuccess=function(dom,name){thisObj._successHandler(dom,name);};resultHandler.defaultErrorHandler=function(ex,name){thisObj._defaultErrorHandler(ex,name);};return resultHandler;}
fwDataLoader.prototype._createDataService=function(resultHandler)
{return fwDataService.create(this.m_config,resultHandler,this.m_config.async);}
fwDataLoader.prototype._retry=function()
{this.m_dataService.load();}
fwDataLoader.prototype._abort=function()
{try
{var ac=Services.getAppController();ac.shutdown();}
catch(msg)
{alert(msg);window.close();}}
fwDataLoader.prototype._successHandler=function(dom,name)
{fwAssertAlways("fwDataLoader::successHandler() must be overridden");}
fwDataLoader.prototype._defaultErrorHandler=function(e,name)
{if(window.confirm(this._getAbortRetryMessage(e)))
{this._retry();}
else
{this._abort();}}
fwDataLoader.prototype._getServiceTypeName=function()
{return"Data loading service";}
fwDataLoader.prototype._getAbortRetryMessage=function(e)
{var serviceTypeName=this._getServiceTypeName();var name=this.m_config.name;if(null==name||""==name)
{name=this.m_dataService.getDefaultName();}
if(null==name||""==name)
{name="Unknown"}
if(name.length>200)
{name=name.substring(0,199);}
var msg=serviceTypeName+" '"+name+"' reported the following error\n\n"+((null==e)?"No error message provided.":fwException.getErrorMessage(e))+"\n\nPress OK to "+this._getRetryMessage()+" or Cancel to "+this._getAbortMessage();return msg;}
fwDataLoader.prototype._getRetryMessage=function()
{return"retry";}
fwDataLoader.prototype._getAbortMessage=function()
{return"abort the application";}
function fwLoginDataLoader()
{}
fwLoginDataLoader.prototype=new fwDataLoader();fwLoginDataLoader.prototype.constructor=fwLoginDataLoader;fwLoginDataLoader.create=function(config)
{var ldl=new fwLoginDataLoader();var payload=null;config.serviceName="login";config.secure=false;var serviceURL=this.m_secureServiceURL;var async=false;var showProgress=true;ldl._initialise(config);return ldl;}
fwLoginDataLoader.prototype._getResultHandler=function()
{var loginHandler=new HTTPLoginHandler();loginHandler.handler=this.m_config.handler;loginHandler.username=this.m_config.username;return loginHandler;}
fwLoginDataLoader.prototype._getServiceTypeName=function()
{return"Login service";}
function HTTPLoginHandler(){};HTTPLoginHandler.secretNode="SupsSessionKey";HTTPLoginHandler.errorNode="SUPSLoginError";HTTPLoginHandler.prototype.onSuccess=function(dom)
{var secretNodeArray=dom.selectNodes("/"+HTTPLoginHandler.secretNode);var secret=null;if(secretNodeArray.length>0)
{secret=XML.getNodeTextContent(secretNodeArray[0]);}
var authResult=new Object();var appC=Services.getAppController();if(null!=secret&&secret.length!=0&&secret!="null")
{appC._setSecurityContext(secret,this.username);authResult.value="authenticated";}
else
{authResult.value=null;}
this.handler.method.call(this.handler.controller,appC.m_securityContext,authResult);}
HTTPLoginHandler.prototype.onInvalidUserSessionException=function(dom)
{var authResult=new Object();authResult.value=null;this.handler.method.call(this.handler.controller,appC.m_securityContext,authResult);}
HTTPLoginHandler.prototype.onError=function(ex,name)
{var authResult=new Object();authResult.error=true;authResult.detail=fwException.getErrorMessage(ex);this.handler.method.call(this.handler.controller,null,authResult);}
function fwServiceCallDataLoader()
{}
fwServiceCallDataLoader.prototype=new fwDataLoader();fwServiceCallDataLoader.prototype.constructor=fwServiceCallDataLoader;fwServiceCallDataLoader.m_logger=new Category("fwServiceCallDataLoader");fwServiceCallDataLoader.create=function(mappingName,parameters,handler,async,showProgress)
{var scdl=new fwServiceCallDataLoader();var config={serviceName:mappingName,callServiceParams:parameters,handler:handler,async:async,showProgress:showProgress}
scdl._initialise(config);return scdl;}
fwServiceCallDataLoader.prototype._getResultHandler=function()
{var thisObj=this;var handler=this.m_config.handler;var config=this.m_config;if(handler.onSuccess==null)
{throw new ConfigurationException("onSuccess must be defined for service calls.");}
handler.defaultErrorHandler=function(ex,name){thisObj._defaultErrorHandler(ex,name);};return handler;}
function fwFileDataLoader()
{}
fwFileDataLoader.prototype=new fwDataLoader();fwFileDataLoader.prototype.constructor=fwFileDataLoader;fwFileDataLoader.m_logger=new Category("fwFileDataLoader");fwFileDataLoader.create=function(fileName,handler,async,showProgress)
{var fdl=new fwFileDataLoader();var config={fileName:fileName,handler:handler,async:async,showProgress:showProgress};fdl._initialise(config);return fdl;}
fwFileDataLoader.prototype._getResultHandler=function()
{var thisObj=this;var handler=this.m_config.handler;var config=this.m_config;if(handler.onSuccess==null)
{throw new ConfigurationException("onSuccess must be defined for service calls.");}
handler.defaultErrorHandler=function(ex,name){thisObj._defaultErrorHandler(ex,name);};return handler;}
function StateChangeEventProtocol()
{}
StateChangeEventProtocol.m_logger=new Category("StateChangeEventProtocol");StateChangeEventProtocol.prototype.m_parents=null;StateChangeEventProtocol.prototype.m_children=null;StateChangeEventProtocol.prototype.m_aggregateState=null;StateChangeEventProtocol.prototype.m_dataDependencyOn=null;StateChangeEventProtocol.prototype.includeInValidation=true;StateChangeEventProtocol.prototype.m_disableChildStateChangeEvents=false;StateChangeEventProtocol.prototype.disposeStateChangeEventProtocol=function()
{if(this.m_dataDependencyOn!=null)
{this.m_dataDependencyOn.length=0;delete this.m_dataDependencyOn;}
if(this.m_aggregateState!=null)
{this.m_aggregateState.dispose();this.m_aggregateState=null;}}
StateChangeEventProtocol._isContainerAdaptor=function(a)
{return(a instanceof GridGUIAdaptor||a instanceof SelectElementGUIAdaptor||a instanceof TabSelectorGUIAdaptor||a instanceof AutocompletionGUIAdaptor||a instanceof FwSelectElementGUIAdaptor);}
StateChangeEventProtocol._isKeyAdaptor=function(a)
{return(a instanceof GridGUIAdaptor||a instanceof SelectElementGUIAdaptor||a instanceof AutocompletionGUIAdaptor||a instanceof FwSelectElementGUIAdaptor);}
StateChangeEventProtocol.prototype.getAggregateState=function()
{if(this.m_aggregateState==null)this.m_aggregateState=SubmissibleState.create(this);return this.m_aggregateState;}
StateChangeEventProtocol.prototype.getParents=function()
{if(this.m_parents==null)this.m_parents=new Array();return this.m_parents;}
StateChangeEventProtocol.prototype.getParentsDebug=function()
{var parents=this.getParents();var debugString="[parents, length="+parents.length+": ";for(var i in parents)
{debugString=debugString+parents[0].getId()+", ";}
debugString=debugString+"]";return debugString;}
StateChangeEventProtocol.prototype.getChildren=function()
{if(this.m_children==null)this.m_children=new Array();return this.m_children;}
StateChangeEventProtocol.prototype.stateToString=function()
{var msg="{id:"+this.getId()+", parents=[";var parents=this.getParents();var children=this.getChildren();var state=this.getAggregateState();var keyStates=state.getKeyStates();for(var l in parents)
{msg+=parents[l].getId()+", ";}
msg+="], aggregateState=";msg+=state.toString();msg+="], keyStates:[";for(var j in keyStates)
{var keyState=keyStates[j];msg+="key="+j;for(var k in keyState)
{msg+=" childAdaptorId="+k+" state="+keyState[k]+",";}}
msg+="} isSubmissible="+this.isSubmissible();return msg;}
StateChangeEventProtocol.prototype.getDataDependencyOn=function()
{return this.m_dataDependencyOn;}
StateChangeEventProtocol.prototype.configStateChangeEventProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{c=cs[i];if(null!=c.dataDependencyOn)
{this.m_dataDependencyOn=c.dataDependencyOn;break;}
if(null!=c.includeInValidation)
{this.includeInValidation=c.includeInValidation;}
if(null!=c.disableChildStateChangeEvents)
{this.m_disableChildStateChangeEvents=c.disableChildStateChangeEvents;}}
this.keyAdaptor=StateChangeEventProtocol._isKeyAdaptor(this);}
StateChangeEventProtocol.prototype.addDataDependency=function(container)
{var parents=this.getParents();container.keyAdaptor=StateChangeEventProtocol._isKeyAdaptor(container);parents[container.getId()]=container;}
StateChangeEventProtocol.prototype.removeDataDependency=function(container)
{var parents=this.getParents();for(var i in parents)
{var parent=parents[i];if(parent.getId()==container.getId())
{delete parent[i];break;}}}
StateChangeEventProtocol.prototype.addChild=function(childAdaptor)
{var children=this.getChildren();children[children.length]=childAdaptor;}
StateChangeEventProtocol.prototype.changeAdaptorState=function(event)
{this.m_stateChangeListener.invoke(event);}
StateChangeEventProtocol.prototype.showNonSubmissibleParents=function()
{if(this.keyAdaptor==true)
{var key=this.getAggregateState().getFirstNonSubmissibleKey();if(null!=key)
{Services.setValue(this.dataBinding,key);}}
var parents=this.getParents();for(var i in parents)
{if(parents[i]!=null)parents[i].showNonSubmissibleParents();}
return;}
StateChangeEventProtocol.prototype.bubbleStateChangeEventToParents=function(event,allParents)
{var parents=this.getParents();for(var i in parents)
{var parent=parents[i];if(parent!=null&&(allParents==true||parent.keyAdaptor==true))parent.changeAdaptorState(event);}
return;}
StateChangeEventProtocol.prototype.propogateStateChangeEventToContainedChildren=function(event)
{var children=this.getContainedChildren();for(var i=children.length-1;i>=0;i--)
{var child=children[i];child.changeAdaptorState(event);}
return;}
StateChangeEventProtocol.prototype.invokeUpdateAdaptorState=function(event)
{var changed=false;var key=null;if(this.dataBinding)
{key=Services.getValue(this.dataBinding);}
var state=this.getAggregateState();changed=state.setState(event,key);var e=StateChangeEvent.create(StateChangeEvent.CHILD_TYPE,this.isSubmissible(),this);this.bubbleStateChangeEventToParents(e,changed);if(this.isAContainer==true&&this.isContainerProtocolPropogationSupported(event.getType()))
{var e=StateChangeEvent.create(StateChangeEvent.PARENT_TYPE,event.getType(),this);this.propogateStateChangeEventToContainedChildren(e,changed);}
return changed;}
StateChangeEventProtocol.prototype.isContainerProtocolPropogationSupported=function(type)
{var result=false;switch(type)
{case StateChangeEvent.ENABLED_TYPE:result=true;break;case StateChangeEvent.READONLY_TYPE:result=true;break;default:break;}
return result;}
StateChangeEventProtocol.prototype.isSubmissible=function()
{return this.getAggregateState().isSubmissible();}
function StateChangeEvent(type,state,adaptor)
{this.m_type=type;this.m_state=state;this.m_adaptor=adaptor;}
StateChangeEvent.ENABLED_TYPE=0;StateChangeEvent.VALID_TYPE=1;StateChangeEvent.READONLY_TYPE=2;StateChangeEvent.MANDATORY_TYPE=3;StateChangeEvent.TEMPORARY_TYPE=4;StateChangeEvent.CHILD_TYPE=5;StateChangeEvent.VALUE_TYPE=6;StateChangeEvent.SRCDATA_TYPE=7;StateChangeEvent.PARENT_TYPE=8;StateChangeEvent.REMOVED_ADAPTOR_TYPE=9;StateChangeEvent.create=function(type,state,adaptor)
{var event=new StateChangeEvent(type,state,adaptor);return event;}
StateChangeEvent.prototype.dispose=function()
{this.m_adaptor=null;}
StateChangeEvent.prototype.toString=function()
{var msg="[StateChangeEvent: type=";switch(this.m_type)
{case StateChangeEvent.ENABLED_TYPE:msg+="ENABLED";break;case StateChangeEvent.VALID_TYPE:msg+="VALID";break;case StateChangeEvent.READONLY_TYPE:msg+="READONLY";break;case StateChangeEvent.MANDATORY_TYPE:msg+="MANDATORY";break;case StateChangeEvent.TEMPORARY_TYPE:msg+="TEMPORARY";break;case StateChangeEvent.CHILD_TYPE:msg+="CHILD";break;case StateChangeEvent.VALUE_TYPE:msg+="VALUE";break;case StateChangeEvent.SRCDATA_TYPE:msg+="SRCDATA";break;case StateChangeEvent.PARENT_TYPE:msg+="PARENT";break;case StateChangeEvent.REMOVED_ADAPTOR_TYPE:msg+="REMOVED_ADAPTOR";break;default:msg+="UNKNOWN";break;}
msg+=", state="+this.m_state;msg+=", adaptorId="+this.m_adaptor.getId()+"]";return msg;}
StateChangeEvent.prototype.getType=function()
{return this.m_type;}
StateChangeEvent.prototype.getState=function()
{return this.m_state;}
StateChangeEvent.prototype.getAdaptor=function()
{return this.m_adaptor;}
function SubmissibleState(adaptor)
{this.m_adaptor=adaptor;this.m_value=null;this.m_keyStates=new Array();this.m_key=null;this.m_temporary=false;this.m_enabled=true;this.m_valid=true;this.m_readOnly=false;this.m_mandatory=false;}
SubmissibleState.m_logger=new Category("SubmissibleState");SubmissibleState.prototype.m_enabled=null;SubmissibleState.prototype.m_valid=null;SubmissibleState.prototype.m_readOnly=null;SubmissibleState.prototype.m_mandatory=null;SubmissibleState.prototype.m_temporary=null;SubmissibleState.prototype.m_value=null;SubmissibleState.prototype.m_childrenSubmissible=null;SubmissibleState.prototype.m_keyStates=null;SubmissibleState.prototype.dispose=function()
{this.m_adaptor=null;this.m_keyStates=null;}
SubmissibleState.prototype.toString=function()
{var msg="[SubmissibleState: id="+this.m_adaptor.getId()+", key="+this.m_key+", enabled="+this.m_enabled+", valid="+this.m_valid+", value = "+this.m_value+", mandatory="+this.m_mandatory;return msg;}
SubmissibleState.prototype.getKey=function()
{return this.m_key;}
SubmissibleState.prototype.getKeyStates=function()
{return this.m_keyStates;}
SubmissibleState.create=function(adaptor)
{var state=new SubmissibleState(adaptor);return state;}
SubmissibleState.prototype.isChildAdaptorSubmissible=function(childAdaptorId)
{var result=true;var keyStates=this.m_keyStates;for(var i in keyStates)
{var keyChildStates=keyStates[i];if(keyChildStates.deleted!=true)
{var childState=keyChildStates[childAdaptorId];if(childState!=null&&childState==false)
{result=false;break;}}}
return result;}
SubmissibleState.prototype._isChildOfNonKeyAdaptorSubmissible=function(childAdaptorId)
{var result=true;var keyChildStates=this.m_keyStates["<framework_dummy_key>"];if(keyChildStates!=null&&keyChildStates[childAdaptorId]!=null&&keyChildStates.deleted!=true)
{result=keyChildStates[childAdaptorId];}
return result;}
SubmissibleState.prototype.isKeySubmissible=function(key)
{var result=true;var keyChildStates=this.m_keyStates[key];if(keyChildStates!=null)
{for(var i in keyChildStates)
{if(keyChildStates[i]==false&&i!="deleted")
{result=false;break;}}}
return result;}
SubmissibleState.prototype.areChildrenSubmissible=function()
{var result=true;var keyStates=this.m_keyStates;for(var i in keyStates)
{var keyChildStates=keyStates[i];if(keyChildStates.deleted!=true)
{for(var j in keyChildStates)
{if(keyChildStates[j]==false&&j!="deleted")
{result=false;break;}}}}
return result;}
SubmissibleState.prototype.getFirstNonSubmissibleKey=function()
{var result=null;var keyStates=this.m_keyStates;for(var key in keyStates)
{var keyChildStates=keyStates[key];if(keyChildStates!=null&&keyChildStates.deleted!=true)
{for(var i in keyChildStates)
{if(keyChildStates[i]==false&&i!="deleted")
{result=key;break;}}}
if(null!=null)break;}
return result;}
SubmissibleState.prototype.hasValue=function()
{if(this.m_adaptor instanceof GridGUIAdaptor)
return true;else
return!(this.m_value==null||this.m_value=="");}
SubmissibleState.prototype.isSubmissible=function(key)
{var result=true;var a=this.m_adaptor;if(!this.m_enabled||this.m_temporary)
{}
else
{if(key!=null)
{result=this.isKeySubmissible(key);}
else
{result=this.areChildrenSubmissible();}
if(result==true)
{if(a.getDataBinding)
{if(this.hasValue())
{if(this.m_valid==false)
{result=false;}}
else
{if(this.m_mandatory)
{result=false;}}}}}
return result;}
SubmissibleState.prototype.getAdaptorState=function()
{var adaptor=this.m_adaptor;if(adaptor.dataBinding)
{this.m_value=Services.getValue(adaptor.dataBinding);}
if(adaptor.getEnabled)
{this.m_enabled=adaptor.getEnabled();}
else
{this.m_enabled=true;}
if(adaptor.getValid)
{this.m_valid=adaptor.getValid();}
else
{this.m_valid=true;}
if(adaptor.getReadOnly)
{this.m_readOnly=adaptor.getReadOnly();}
else
{this.m_readOnly=false;}
if(adaptor.getMandatory)
{this.m_mandatory=adaptor.getMandatory();}
else
{this.m_mandatory=false;}
if(adaptor.hasTemporary&&adaptor.hasTemporary())
{this.m_temporary=adaptor.invokeIsTemporary();}
else
{this.m_temporary=false;}}
SubmissibleState.prototype.isKeyInSrcData=function(key)
{var result=false;var adaptor=this.m_adaptor;var isEmpty=(key==null||key=="");if(adaptor.getSrcData&&isEmpty==false)
{result=adaptor.checkForKeyExistence(key);}
return result;}
SubmissibleState.prototype.setState=function(stateChangeEvent,key)
{if(this.m_adaptor.keyAdaptor==false)
{key=null;}
this.m_key=key;var originalAggregateState=this.isSubmissible(key);this.getAdaptorState();switch(stateChangeEvent.getType())
{case StateChangeEvent.SRCDATA_TYPE:var result=this.handleSrcDataEvent();if(result==true)return result;break;case StateChangeEvent.CHILD_TYPE:this.handleChildEvent(stateChangeEvent,key);break;case StateChangeEvent.PARENT_TYPE:return this.handleParentEvent(stateChangeEvent,key);break;case StateChangeEvent.REMOVED_ADAPTOR_TYPE:return this.handleRemovedAdaptorEvent(stateChangeEvent,key);break;default:break;}
var newAggregateState=this.isSubmissible(key);return(originalAggregateState!=newAggregateState);}
SubmissibleState.prototype.handleParentEvent=function(stateChangeEvent)
{var changed=false;var adaptor=this.m_adaptor;var parent=stateChangeEvent.getAdaptor();switch(stateChangeEvent.getState())
{case StateChangeEvent.ENABLED_TYPE:if(adaptor.getEnabled)
{var enabled=parent.getEnabled();changed=adaptor.setContainerEnabled(enabled);}
break;case StateChangeEvent.READONLY_TYPE:if(adaptor.getReadOnly)
{var readOnly=parent.getReadOnly();changed=adaptor.setContainerReadOnly(readOnly);}
break;default:break;}
return changed;}
SubmissibleState.prototype.handleSrcDataEvent=function()
{var changed=false;var keyStates=this.m_keyStates;for(var i in keyStates)
{var isKeyInSrcData=this.isKeyInSrcData(i);if(!isKeyInSrcData&&keyStates[i]!=null)
{keyStates[i].length=0;keyStates[i].deleted=true;changed=true;}
else
{if(keyStates[i].deleted==true)
{keyStates[i].deleted=false;changed=true;}}}
return changed;}
SubmissibleState.prototype.handleChildEvent=function(stateChangeEvent,key)
{if(this.m_adaptor.keyAdaptor==true)
{if(!this.canAcceptChildEvents())
{return;}
var isKeyInSrcData=this.isKeyInSrcData(key);var isKeyEmpty=(key==null||key=="");if(isKeyEmpty==true||isKeyInSrcData==false)
{if(isKeyInSrcData==false&&isKeyEmpty==false&&this.m_keyStates[key]!=null)
{this.m_keyStates[key].deleted=true;}
return;}}
var childAdaptorId=stateChangeEvent.getAdaptor().getId();if(key==null||key=="")
{key="<framework_dummy_key>";}
else
{childAdaptorId+=":"+key;}
var keyStates=this.m_keyStates;if(keyStates[key]==null)keyStates[key]=new Array();keyStates[key][childAdaptorId]=stateChangeEvent.getState();if(key=="<framework_dummy_key>")key=null;}
SubmissibleState.prototype.handleRemovedAdaptorEvent=function(stateChangeEvent)
{var changed=false;if(this.canAcceptChildEvents())
{var childAdaptorIds=stateChangeEvent.getState();var keyStates=this.m_keyStates;var keyAdaptor=this.m_adaptor.keyAdaptor;for(var i in keyStates)
{var keyChildStates=keyStates[i];for(var j=0;j<childAdaptorIds.length;j++)
{var childAdaptorId=childAdaptorIds[j];if(keyAdaptor==true)
{childAdaptorId+=":"+i;}
if(keyChildStates[childAdaptorId]!=null)
{keyChildStates[childAdaptorId].deleted=true;changed=true;}}}}
return changed;}
SubmissibleState.prototype.canAcceptChildEvents=function()
{if(this.m_canAcceptChildEvents==null)
{this.m_canAcceptChildEvents=true;var adaptor=this.m_adaptor;if((adaptor.m_disableChildStateChangeEvents==true)||(adaptor instanceof GridGUIAdaptor&&adaptor.getMultipleSelection()==true)||(adaptor instanceof AutocompletionGUIAdaptor&&adaptor.strictValidation==false)||(adaptor instanceof SelectElementGUIAdaptor&&adaptor.areOptionsHardcoded()==true)||(adaptor instanceof FwSelectElementGUIAdaptor&&adaptor.areOptionsHardcoded()==true))
{this.m_canAcceptChildEvents=false;}}
return this.m_canAcceptChildEvents;}
function ComponentContainerProtocol()
{}
ComponentContainerProtocol.m_logger=new Category("ComponentContainerProtocol");ComponentContainerProtocol.prototype.configComponentContainerProtocol=function(cs)
{for(var i=cs.length-1;i>=0;i--)
{var c=cs[i];if(null!=c.firstFocusedAdaptorId)this.firstFocusedAdaptorId=c.firstFocusedAdaptorId;}
if(this.m_containedChildren==null)this.m_containedChildren=new Array();}
ComponentContainerProtocol.prototype.disposeComponentContainerProtocol=function()
{}
ComponentContainerProtocol.prototype.isAContainer=true;ComponentContainerProtocol.prototype.invokeFirstFocusedAdaptorId=function()
{return(this.firstFocusedAdaptorId!=null)?this.firstFocusedAdaptorId.call(this):null;}
ComponentContainerProtocol.prototype.firstFocusedAdaptorId=null;ComponentContainerProtocol.prototype.m_containedChildren=null;ComponentContainerProtocol.prototype.getContainedChildren=function()
{return this.m_containedChildren;}
ComponentContainerProtocol.prototype.addContainedChild=function(childAdaptor)
{if(this.m_containedChildren==null)this.m_containedChildren=new Array();if(ComponentContainerProtocol.m_logger.isDebug())ComponentContainerProtocol.m_logger.debug(this.getId()+":ComponentContainerProtocol.addContainedChild() added child adaptor id="+childAdaptor.getId());this.m_containedChildren[this.m_containedChildren.length]=childAdaptor;if(ComponentContainerProtocol.m_logger.isTrace())ComponentContainerProtocol.m_logger.trace(this.getId()+":ComponentContainerProtocol.addContainedChild() this.m_containedChildren.length="+this.m_containedChildren.length);}
ComponentVisibilityProtocol.VISIBILITY_VISIBLE="visible";function ComponentVisibilityProtocol()
{}
ComponentVisibilityProtocol.prototype.configComponentVisibilityProtocol=function(cs)
{}
ComponentVisibilityProtocol.prototype.disposeComponentVisibilityProtocol=function()
{}
ComponentVisibilityProtocol.prototype.show=function(showMe)
{fc_assert(false,"Must implement show function");}
function DataBindingError(message,ex)
{this.message=message;this.exception=ex;}
DataBindingError.prototype=new Error();DataBindingError.prototype.constructor=DataBindingError;function DataBindingProtocol()
{}
DataBindingProtocol.m_logger=new Category("DataBindingProtocol");DataBindingProtocol.prototype.m_value=null;DataBindingProtocol.prototype.m_valueChanged=false;DataBindingProtocol.prototype.dataBinding=null;DataBindingProtocol.prototype.retrieveOn=null;DataBindingProtocol.prototype.update=function()
{var db=this.dataBinding;if(null!=db)
{var fm=FormController.getInstance();var dm=fm.getDataModel();fm.startDataTransaction(this);var changed=false;var mV=this._getValueFromView();var dV=this.invokeTransformToModel(mV);var origValue=dm.getValue(db);if((mV==""||mV==null)&&(origValue==""||origValue==null))
{changed=true;}
else
{changed=(origValue==dV);}
var result=null;if(changed==true)
{result=false;}
else
{result=dm.setValue(db,dV);var e=StateChangeEvent.create(StateChangeEvent.VALUE_TYPE,dV,this);this.changeAdaptorState(e);}
fm.endDataTransaction(this);return result;}
else
{throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = "+this.getId());}}
DataBindingProtocol.prototype.retrieve=function(event)
{var db=this.dataBinding;if(null!=db)
{var mV=FormController.getInstance().getDataModel().getValue(db);var dV=this.invokeTransformToDisplay(mV);var valueChanged=this._setValue(dV);if(!this.m_valueChanged)this.m_valueChanged=valueChanged;var e=StateChangeEvent.create(StateChangeEvent.VALUE_TYPE,dV,this);this.changeAdaptorState(e);return valueChanged;}
else
{throw new DataBindingError("DataBindingProtocol.retrieve(), no dataBinding specified for adaptor id = "+this.getId());}}
DataBindingProtocol.prototype.setDefault=null;DataBindingProtocol.prototype.setDefaultOn=null;DataBindingProtocol.prototype.isNoneEmptyValue=function(mV)
{return!(null==mV||""==mV);}
DataBindingProtocol.prototype.transformToModel=null;DataBindingProtocol.prototype.tranformToDisplay=null;DataBindingProtocol.prototype.configDataBindingProtocol=function(cs)
{for(var i=cs.length-1;i>=0;i--)
{var c=cs[i];if(null!=c.update)this.update=c.update;if(null!=c.retrieve)this.retrieve=c.retrieve;if(null!=c.transformToModel)this.transformToModel=c.transformToModel;if(null!=c.transformToDisplay)this.transformToDisplay=c.transformToDisplay;if(null!=c.dataBinding)this.dataBinding=c.dataBinding;if(null!=c.retrieveOn)this.retrieveOn=c.retrieveOn;if(null!=c.setDefaultOn)this.setDefaultOn=c.setDefaultOn;if(null!=c.setDefault)this.setDefault=c.setDefault;}
if(null==this.dataBinding||""==this.dataBinding)
{throw new ConfigurationException("DataBindingProtocol.configDataBindingProtocol(), no dataBinding specified for adaptor id = "+this.getId()+", this is a mandatory configuration property!");}
if(DataBindingProtocol.m_logger.isTrace())
{DataBindingProtocol.m_logger.trace("DataBindingProtocol.configDataBindingProtocol(), "+DataBindingProtocol.toString(this));}}
DataBindingProtocol.prototype.disposeDataBindingProtocol=function()
{}
DataBindingProtocol.prototype.getDataBinding=function()
{return this.dataBinding;}
DataBindingProtocol.prototype.initialiseDataBindingProtocol=function(e)
{this.initialiseDataBindingState(e);}
DataBindingProtocol.prototype.initialiseDataBindingState=function(e)
{db=this.getDataBinding();if(null!=db)
{this.invokeRetrieve(e);var on=this.getSetDefaultOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{if(on[i]=="/")
{this.invokeSetDefault(e);}}}}}
DataBindingProtocol.prototype.getRetrieveOn=function()
{return this.retrieveOn;}
DataBindingProtocol.prototype.getSetDefaultOn=function()
{return this.setDefaultOn;}
DataBindingProtocol.prototype.invokeUpdate=function(mV)
{return this.update.call(this,mV);}
DataBindingProtocol.prototype.invokeRetrieve=function(event)
{return this.retrieve.call(this,event);}
DataBindingProtocol.prototype.invokeTransformToModel=function(dV)
{return(null==this.transformToModel)?dV:this.transformToModel.call(this,dV);}
DataBindingProtocol.prototype.invokeTransformToDisplay=function(mV)
{return(null==this.transformToDisplay)?mV:this.transformToDisplay.call(this,mV);}
DataBindingProtocol.prototype.hasSetDefault=function()
{return this.hasConfiguredProperty("setDefault");}
DataBindingProtocol.prototype.invokeSetDefault=function(e)
{var mV=null;if(null!=this.dataBinding)
{mV=Services.getValue(this.dataBinding);}
if(DataBindingProtocol.m_logger.isDebug())
{DataBindingProtocol.m_logger.debug("Type: "+e.getType());DataBindingProtocol.m_logger.debug("X Path: "+e.getXPath());}
if(null!=this.setDefault&&e.getType()==DataModelEvent.ADD&&!this.isNoneEmptyValue(mV))
{this.setDefault.call(this,e);}}
DataBindingProtocol.prototype._getValue=function()
{return this.m_value;}
DataBindingProtocol.prototype._setValue=function(v)
{var changed=(v!=this.m_value);this.m_value=v;return changed;}
DataBindingProtocol.prototype.hasValue=function()
{return this.isNoneEmptyValue(this.m_value);}
DataBindingProtocol.toString=function(a)
{var msg=new String("DataBindingProtocol(adaptor id: "+a.getId()+"): ");if(null!=a.dataBinding)msg+="dataBinding = "+a.dataBinding;if(null!=a.retrieveOn)
{msg+=", retrieveOn = [";for(var i=0;i<a.retrieveOn.length;i++)
{msg+=a.retrieveOn[i]+", ";}
msg+="]";}
if(null!=a.defaultOn)
{msg+=", defaultOn = [";for(var i=0;i<a.defaultOn.length;i++)
{msg+=a.defaultOn[i]+", ";}
msg+="]";}
return msg;}
DataBindingProtocol.prototype.getListenersForDataBindingProtocol=function()
{var listenerArray=new Array();var refreshListener=FormControllerListener.create(this,FormController.REFRESH);var defaultListener=FormControllerListener.create(this,FormController.DEFAULT);db=this.getDataBinding();if(null!=db)
{listenerArray.push({xpath:db,listener:refreshListener});if(this.hasSetDefault())
{listenerArray.push({xpath:db,listener:defaultListener});var setDefaultOn=this.getSetDefaultOn();if(null!=setDefaultOn)
{for(var i=setDefaultOn.length-1;i>=0;i--)
{listenerArray.push({xpath:setDefaultOn[i],listener:defaultListener});}}}}
var on=this.getRetrieveOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:refreshListener});}}
return listenerArray;}
function DynamicLoadingProtocol()
{}
DynamicLoadingProtocol.prototype.loadOn=null;DynamicLoadingProtocol.prototype.load=null;DynamicLoadingProtocol.prototype.unloadOn=null;DynamicLoadingProtocol.prototype.unload=null;DynamicLoadingProtocol.prototype.handleLoad=function()
{}
DynamicLoadingProtocol.prototype.handleUnload=function()
{}
DynamicLoadingProtocol.prototype.configDynamicLoadingProtocol=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null==this.loadOn&&null!=c.loadOn)this.loadOn=c.loadOn;if(null==this.unloadOn&&null!=c.unloadOn)this.unloadOn=c.unloadOn;}}
DynamicLoadingProtocol.prototype.initialiseDynamicLoadingProtocol=function(e)
{var ds=this._getDynamicLoadingDetails();if(null==ds)
{this.invokeLoad(e,null);}
else
{for(var i=0,l=ds.length;i<l;i++)
{var d=ds[i];this.invokeLoad(e,d);}}}
DynamicLoadingProtocol.prototype.disposeDynamicLoadingProtocol=function()
{}
DynamicLoadingProtocol.prototype.getLoadOn=function()
{return this.loadOn;}
DynamicLoadingProtocol.prototype.getUnloadOn=function()
{return this.unloadOn;}
DynamicLoadingProtocol.prototype.getOnLoadConfigs=function(d)
{var cs=this.getConfigs();var configs=[];for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].load)configs.push(cs[i].load);}
return configs;}
DynamicLoadingProtocol.prototype.getOnUnloadConfigs=function(d)
{var cs=this.getConfigs();var configs=[];for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].unload)configs.push(cs[i].unload);}
return configs;}
DynamicLoadingProtocol.prototype.invokeLoad=function(e,d)
{var detail=(null==d?null:d.m_detail);var configs=this.getOnLoadConfigs(detail);var load=false;for(var i=0,l=configs.length;i<l;i++)
{if(configs[i].call(this,e))
{load=true;break;}}
if(load)
{this.handleLoad(detail);}}
DynamicLoadingProtocol.prototype.invokeUnload=function(e,d)
{var detail=(null==d?null:d.m_detail);var configs=this.getOnUnloadConfigs(detail);var unload=true;for(var i=0,l=configs.length;i<l;i++)
{if(!configs[i].call(this,e))
{unload=false;break;}}
if(unload)
{this.handleUnload(detail);}}
DynamicLoadingProtocol.prototype.getListenersForDynamicLoadingProtocol=function()
{var listenerArray=new Array();var loadListener=FormControllerListener.create(this,FormController.LOAD);var unloadListener=FormControllerListener.create(this,FormController.UNLOAD);var on=this.getLoadOn();if(null!=on)
{for(var i=0,l=on.length;i<l;i++)
{listenerArray.push({xpath:on[i],listener:loadListener});}}
on=this.getUnloadOn();if(null!=on)
{for(var i=0,l=on.length;i<l;i++)
{listenerArray.push({xpath:on[i],listener:unloadListener});}}
return listenerArray;}
DynamicLoadingProtocol.prototype._getDynamicLoadingDetails=function()
{return null;}
function XPathUtils()
{}
XPathUtils.m_logger=new Category("XPathUtils");XPathUtils.concatXPaths=function(xp1,xp2)
{if(null==xp1||xp1=="")
{throw new ConfigurationException("XPathUtils.concatXPaths(), cannot concatenate an xpath to an empty xpath");}
var result=xp1;if(null!=xp2&&xp2!="")
{if(xp1.lastIndexOf("/")!=(xp1.length-1))
{result+="/";}
if(xp2.charAt(0)=='/')
{xp2=xp2.slice(1);}
result+=xp2;}
if(XPathUtils.m_logger.isTrace())
{XPathUtils.m_logger.trace("XPathUtils.concatXPaths("+xp1+", "+xp2+"): returning "+result);}
return result;}
XPathUtils.removeTrailingNode=function(xp)
{xp=XPathUtils.removeTrailingSlash(xp);var index=xp.lastIndexOf("/");xp=xp.substring(0,index);return xp;}
XPathUtils.getTrailingNode=function(xp)
{xp=XPathUtils.removeTrailingSlash(xp);var index=xp.lastIndexOf("/");xp=xp.substring(index+1);return xp;}
XPathUtils.removeLeadingSlash=function(xp)
{if(xp&&(xp!=""))
{if(xp.charAt(0)=='/')
{xp=xp.slice(1);}}
return xp;}
XPathUtils.removeTrailingSlash=function(xp)
{if(xp&&(xp!=""))
{if(xp.charAt(xp.length-1)=='/')
{xp=xp.slice(0,length-1);}}
return xp;}
XPathUtils.getLastNodeName=function(xp)
{if(xp&&(xp!=""))
{xp=XPathUtils.removeLeadingSlash(xp);xp=XPathUtils.removeTrailingSlash(xp);var lastForeslash=xp.lastIndexOf("/");if(lastForeslash!=-1)
{xp=xp.substr(lastForeslash+1);}
var openSquareBracket=xp.indexOf("[");if(openSquareBracket!=-1)
{xp=xp.substr(0,openSquareBracket);}}
return xp;}
XPathUtils.getNameOfLastNode=function(xp)
{if(xp&&(xp!=""))
{xp=XPathUtils.removeLeadingSlash(xp);xp=XPathUtils.removeTrailingSlash(xp);xp=XPathUtils.removeTrailingPredicates(xp);var lastForeslash=xp.lastIndexOf("/");if(lastForeslash!=-1)
{xp=xp.substr(lastForeslash+1);}}
return xp;}
XPathUtils.removeTrailingPredicates=function(xpath)
{var xp=xpath;if(xp&&(xp!=""))
{var startLength=null;var endLength=null;do
{if(null!=endLength)
{startLength=endLength;}
else
{startLength=xp.length;}
xp=XPathUtils.removeTrailingPredicate(xp);endLength=xp.length;}while(endLength>0&&endLength<startLength)}
return xp;}
XPathUtils.removeTrailingPredicate=function(xpath)
{var xp=xpath;if(xp&&(xp!=""))
{var length=xp.length;if(xp.charAt(length-1)=="]")
{var unmatchedCloseSquareBracketCount=1;var searchPos=length-2;var charAtPos=null;while(searchPos>=0)
{charAtPos=xp.charAt(searchPos);if(charAtPos=="]")
{unmatchedCloseSquareBracketCount+=1;}
else if(charAtPos=="[")
{unmatchedCloseSquareBracketCount-=1;if(unmatchedCloseSquareBracketCount==0)
{break;}}
searchPos-=1;}
if(searchPos!=-1)
{xp=xp.substr(0,searchPos);}
else
{throw new ConfigurationException("XPathUtils.removeTrailingPredicate(), xpath "+
xp+" contains unmatched square brackets.");}}}
return xp;}
function SrcDataError(message,ex)
{this.message=message;this.exception=ex;}
SrcDataError.prototype=new Error();SrcDataError.prototype.constructor=SrcDataError;function ListSrcDataProtocol()
{}
ListSrcDataProtocol.m_logger=new Category("ListSrcDataProtocol");ListSrcDataProtocol.prototype.m_keyNumber=0;ListSrcDataProtocol.prototype.m_orMode=false;ListSrcDataProtocol.prototype.srcData=null;ListSrcDataProtocol.prototype.srcDataOn=null;ListSrcDataProtocol.prototype.srcDataFilterOn=null;ListSrcDataProtocol.prototype.rowXPath=null;ListSrcDataProtocol.prototype.keyXPath=null;ListSrcDataProtocol.prototype.initialiseListSrcDataProtocol=function(e)
{this.initialiseListSrcDataState(e);}
ListSrcDataProtocol.prototype.retrieveSrcData=function(event)
{throw new ConfigurationException("ListSrcDataProtocol.retrieveSrcData(), please supply a retrieveSrcData method for this adaptor.");}
ListSrcDataProtocol.prototype.filterSrcData=function(event)
{throw new ConfigurationException("ListSrcDataProtocol.filterSrcData(), please supply a filterSrcData method for this adaptor.");}
ListSrcDataProtocol.prototype.configListSrcDataProtocol=function(cs)
{for(var i=0;i<cs.length;i++)
{if(null!=cs[i].srcData)this.srcData=cs[i].srcData;if(null!=cs[i].srcDataOn)this.srcDataOn=cs[i].srcDataOn;if(null!=cs[i].rowXPath)this.rowXPath=cs[i].rowXPath;if(null!=cs[i].keyXPath)
{this.keyXPath=XPathUtils.removeLeadingSlash(cs[i].keyXPath);}
if(null!=cs[i].generateKeys)this.generateKeys=cs[i].generateKeys;}
if(ListSrcDataProtocol.m_logger.isTrace())
{ListSrcDataProtocol.m_logger.trace("ListSrcDataProtocol.configListSrcDataProtocol(), "+ListSrcDataProtocol.toString(this));}
if(this.srcData&&(""!=this.srcData))
{if(null==this.srcDataOn)
{this.srcDataOn=new Array();}
if(this.srcData.indexOf("|")!=-1)
{this.m_orMode=true;var ar=this.srcData.split("|");for(var i=0,l=ar.length;i<l;i++)
{ar[i]=String.trim(ar[i]);}
this.srcDataOn=this.srcDataOn.concat(ar);this.m_rowXPaths=ar;}
else
{this.m_orMode=false;var rowXP=this._getRowXPath();this.srcDataOn[this.srcDataOn.length]=rowXP;this.m_rowXPaths=[rowXP];}}}
ListSrcDataProtocol.prototype.disposeListSrcDataProtocol=function()
{}
ListSrcDataProtocol.prototype.getSrcData=function()
{return this.srcData;}
ListSrcDataProtocol.prototype.getSrcDataOn=function()
{return this.srcDataOn;}
ListSrcDataProtocol.prototype.getSrcDataFilterOn=function()
{return this.srcDataFilterOn;}
ListSrcDataProtocol.prototype.initialiseListSrcDataState=function(e)
{if(null!=this.getSrcData())this.invokeRetrieveSrcData(e);}
ListSrcDataProtocol.prototype._getRowXPath=function()
{if(true==this.m_orMode)
{return this.srcData;}
else
{return XPathUtils.concatXPaths(this.srcData,this.rowXPath);}}
ListSrcDataProtocol.prototype.getRowXPaths=function()
{return this.m_rowXPaths;}
ListSrcDataProtocol.prototype.getRowXPathWithSuffix=function(predicate)
{if(null==predicate)predicate="";var xpath=this.m_rowXPaths.join(predicate+"|");return xpath+predicate;}
ListSrcDataProtocol.prototype.getRowXPathArrayWithSuffix=function(suffix)
{var rowXPaths=this.m_rowXPaths;var xpaths=rowXPaths.slice(0,rowXPaths.length);if(null!=suffix&&""!=suffix)
{for(var i=0,l=rowXPaths;i<l;i++)
{xpaths[i]+=suffix;}}
return xpaths;}
ListSrcDataProtocol.prototype.checkForKeyExistence=function(key)
{var keyXPath=this.getKeyXPath();if(keyXPath.lastIndexOf("/.")==keyXPath.length-2)
{keyXPath=keyXPath.substring(0,keyXPath.length-2);}
keyXPath+="[text()="+Services.xPathToConcat(key)+"]";var keyNode=FormController.getInstance().getDataModel().getInternalDOM().selectSingleNode(keyXPath);return(null!=keyNode);}
ListSrcDataProtocol.prototype.getKeyXPath=function()
{return XPathUtils.concatXPaths(this._getRowXPath(),this.keyXPath);}
ListSrcDataProtocol.prototype.invokeRetrieveSrcData=function(event)
{if(this.generateKeys)
{this.createKeyNodes();}
if(0!=this.findKeylessNodes().length)
{throw new DataException("Source data is missing key nodes");}
return this.retrieveSrcData.call(this,event);}
ListSrcDataProtocol.prototype.invokeFilterSrcData=function(event)
{return this.filterSrcData.call(this,event);}
ListSrcDataProtocol.toString=function(a)
{var msg=new String("ListSrcDataProtocol(adaptor id: "+a.getId()+"): ");if(null!=a.srcData)msg+="srcData = "+a.srcData;if(null!=a.rowXPath)msg+="rowXPath = "+a.rowXPath;if(null!=a.keyXPath)msg+="keyXPath = "+a.keyXPath;if(null!=a.srcDataOn)
{msg+=", srcDataOn = [";for(var i=0;i<a.srcDataOn.length;i++)
{msg+=a.srcDataOn[i]+", ";}
msg+="]";}
return msg;}
ListSrcDataProtocol.selectValueFromNodeByXPath=function(node,xp)
{if(null==node)
{throw new ConfigurationException("ListSrcDataProtocol.selectValueFromNodeByXPath() could not apply the xpath as the node was null");}
var value=null;if(xp&&(xp!=""))
{var valueNode=node.selectSingleNode(xp);if(null==valueNode)
{if(ListSrcDataProtocol.m_logger.isError())ListSrcDataProtocol.m_logger.error("Warning: Field has a null value for part of the source data (missing node) - this can lead to data integrity problems!");if(ListSrcDataProtocol.m_logger.isInfo())ListSrcDataProtocol.m_logger.info("ListSrcDataProtocol.selectValueFromNodeByXPath() could not find the value node, configured to xpath: "+xp);}
else
{value=XML.getNodeTextContent(valueNode);}}
else
{value=XML.getNodeTextContent(node);}
if(null==value||""==value)
{if(ListSrcDataProtocol.m_logger.isError())ListSrcDataProtocol.m_logger.error("Warning: Field has a null value for part of the source data (null or empty value in node) - this can lead to data integrity problems!");if(ListSrcDataProtocol.m_logger.isInfo())ListSrcDataProtocol.m_logger.info("ListSrcDataProtocol.selectValueFromNodeByXPath() the XML content of the node is empty or null!");}
return value;}
ListSrcDataProtocol.prototype.createKeyNodes=function()
{var nodes=this.findKeylessNodes();for(var i=0;i<nodes.length;i++)
{var idNode=nodes[i].selectSingleNode(this.keyXPath);idNode=idNode?idNode:XML.createElement(nodes[i],this.keyXPath);nodes[i].appendChild(idNode);var textNode=XML.createTextNode(idNode.ownerDocument,this.generateKey());idNode.appendChild(textNode);}}
ListSrcDataProtocol.prototype.resolveNodeXPath=function(node)
{if(null!=this._lastXPathResolvedUsedPosition)
{var guessXPath=this._lastXPathResolved+"[position() = "+(this._lastXPathResolvedUsedPosition+1)+"]";var guessNode=FormController.getInstance().getDataModel().getInternalDOM().selectSingleNode(guessXPath);if(guessNode==node)
{this._lastXPathResolvedUsedPosition++;return guessXPath;}}
return this.getPathToRoot(node);}
ListSrcDataProtocol.prototype.findKeylessNodes=function()
{var keylessXPath;var predicate="[count(./"+this.keyXPath+"/text()) = 0]";;if(this.m_orMode)
{keylessXPath=this.srcData.replace(/\|/g,predicate+"|")+predicate;}
else
{keylessXPath=this._getRowXPath()+predicate;}
var dom=FormController.getInstance().getDataModel().getInternalDOM();return dom.selectNodes(keylessXPath);}
ListSrcDataProtocol.prototype.getPathToRoot=function(node)
{fc_assert(node,"Null node cannot have xpath to root");if("#document"==node.parentNode.nodeName)
{return'/'+node.nodeName;}
else
{var siblingNodes=node.parentNode.selectNodes(node.nodeName);var position="";this._lastXPathResolvedUsedPosition=null;for(i=0;i<siblingNodes.length;i++)
{if(siblingNodes[i]==node)
{position="[position() = "+(i+1)+"]";this._lastXPathResolvedUsedPosition=i+1;break;}}
this._lastXPathResolved=this.getPathToRoot(node.parentNode)+'/'+node.nodeName;return this._lastXPathResolved+position;}}
ListSrcDataProtocol.prototype.generateKey=function(xp)
{return this.m_keyNumber++;}
ListSrcDataProtocol.prototype.getListenersForListSrcDataProtocol=function(db)
{var listenerArray=new Array();var srcDataListener=FormControllerListener.create(this,FormController.SRCDATA);var filterListener=FormControllerListener.create(this,FormController.FILTER);var on=this.getSrcDataOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:srcDataListener});}}
on=this.getSrcDataFilterOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:filterListener});}}
return listenerArray;}
function RecordsProtocolLazyLoadingDataLoader()
{}
RecordsProtocolLazyLoadingDataLoader.prototype=new fwDataLoader();RecordsProtocolLazyLoadingDataLoader.prototype.constructor=RecordsProtocolLazyLoadingDataLoader;RecordsProtocolLazyLoadingDataLoader.m_logger=new Category("RecordsProtocolLazyLoadingDataLoader");RecordsProtocolLazyLoadingDataLoader.prototype.m_recordsProtocol=null;RecordsProtocolLazyLoadingDataLoader.prototype.m_rowXPath;RecordsProtocolLazyLoadingDataLoader.prototype._successHandler=function(dom,name)
{this.m_recordsProtocol.onLazyFetchingServerSuccess(dom,this.m_rowXPath,this.m_resultTargetXPath);}
RecordsProtocolLazyLoadingDataLoader.prototype._abort=function()
{}
RecordsProtocolLazyLoadingDataLoader.create=function(config,recordsProtocol,rowXPath,resultTargetXPath)
{var dl=new RecordsProtocolLazyLoadingDataLoader();dl.m_recordsProtocol=recordsProtocol;dl.m_rowXPath=rowXPath;dl.m_resultTargetXPath=resultTargetXPath;dl._initialise(config);return dl;}
RecordsProtocolLazyLoadingDataLoader.prototype._getServiceTypeName=function()
{return"Lazy loading data service";}
RecordsProtocolLazyLoadingDataLoader.prototype._getAbortMessage=function()
{return"abort the data retrieval (data will not be available for viewing or editing)";}
function RecordsProtocol()
{}
RecordsProtocol.m_logger=new Category("RecordsProtocol");RecordsProtocol.prototype.m_records=null;RecordsProtocol.prototype.m_isRecord=false;RecordsProtocol.prototype.m_recordName=null;RecordsProtocol.RECORD_DIRTY_ELEMENT="RecordDirty";RecordsProtocol.prototype.initialiseRecordsProtocol=function(e)
{}
RecordsProtocol.prototype.getMarkDirtyRecordOn=function()
{return this.m_markDirtyRecordOn;}
RecordsProtocol.prototype.getLazyFetchRecordOn=function()
{return this.m_lazyFetchRecordOn;}
RecordsProtocol.prototype.hasRecordsForStripping=function()
{if(this.m_hasRecordsForStripping==null)
{this.m_hasRecordsForStripping=false;for(var i=0,l=this.m_records.length;i<l;i++)
{if(this.m_records[i].getStripCleanRecords()==true)
{this.m_hasRecordsForStripping=true;break;}}}
return this.m_hasRecordsForStripping;}
RecordsProtocol.prototype.hasRecords=function()
{return(this.m_records.length>0);}
RecordsProtocol.prototype.configLazyFetchs=function(c)
{if(c.lazyFetchs&&this.getSrcData&&this.getSrcData()!=null)
{c.isRecord=true;c.stripCleanRecords=false;this.configIsRecord(c);}}
RecordsProtocol.prototype.configIsRecord=function(c)
{if(c.isRecord&&c.isRecord==true&&this.getSrcData&&this.getSrcData()!=null)
{this.m_isRecord=true;var xpath=this._getRowXPath();var keyXPath=(c.keyXPath==null)?this.keyXPath:c.keyXPath;var displayName=(c.displayName==null)?this.getDisplayName():c.displayName;var stripCleanRecords=(c.stripCleanRecords==null)?true:c.stripCleanRecords;var lazyFetchXPath=(c.lazyFetchXPath==null)?this.dataBinding:c.lazyFetchXPath;var lazyFetchs=c.lazyFetchs;this.m_records[this.m_records.length]=this.createRecord(xpath,keyXPath,stripCleanRecords,lazyFetchXPath,lazyFetchs,displayName);}}
RecordsProtocol.prototype.configRecords=function(c)
{if(c.records)
{this.m_isRecord=false;for(var i=0,l=c.records.length;i<l;i++)
{var record=c.records[i];record.displayName=(record.displayName==null)?this.getDisplayName():record.displayName;record.stripCleanRecords=(record.stripCleanRecords==null)?true:record.stripCleanRecords;this.m_records[this.m_records.length]=this.createRecord(record.xpath,record.keyXPath,record.stripCleanRecords,record.lazyFetchXPath,record.lazyFetchs,record.displayName);}}}
RecordsProtocol.prototype.configRecordsProtocol=function(cs)
{if(RecordsProtocol.m_logger.isTrace())RecordsProtocol.m_logger.trace(this.getDisplayName()+": configRecordsProtocol()");var cs=this.getConfigs();if(this.m_records==null)
{this.m_records=new Array();}
if(this.m_markDirtyRecordOn==null)
{this.m_markDirtyRecordOn=new Array();}
if(this.m_lazyFetchRecordOn==null)
{this.m_lazyFetchRecordOn=new Array();}
for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.records)
{this.configRecords(c);}
else if(c.isRecord)
{this.configIsRecord(c);}
else if(c.lazyFetches)
{this.configLazyFetchs(c);}}
var formAdaptor=FormController.getInstance().getFormAdaptor();if(this.getId()!=formAdaptor.getId()&&this.m_records.length>0)
{formAdaptor.addRecords(this.m_records);}}
RecordsProtocol.prototype.addRecords=function(recordOn)
{if(RecordsProtocol.m_logger.isTrace())RecordsProtocol.m_logger.trace(this.getDisplayName()+": addRecords() this.m_records length = "+this.m_records.length+", adding "+recordOn.length+" records");this.m_records=this.m_records.concat(recordOn);}
RecordsProtocol.prototype.disposeRecordsProtocol=function()
{}
RecordsProtocol.stripCleanRecords=function(stripNode,recordOffset,targetXPath)
{var formAdaptor=FormController.getInstance().getFormAdaptor();if(formAdaptor.hasRecordsForStripping())
{stripNode=formAdaptor.stripCleanRecords(stripNode,recordOffset,targetXPath);}
return stripNode;}
RecordsProtocol.prototype.stripCleanRecords=function(stripNode,recordOffset,targetXPath)
{if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": stripCleanRecords() recordOffset = "+recordOffset+", targetXPath = "+targetXPath);for(var i=0,rl=this.m_records.length;i<rl;i++)
{var record=this.m_records[i];var recordXPath=record.getXPath();if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": stripCleanRecords() recordXPath = "+recordXPath);if(recordOffset!=null&&recordOffset!="")
{var index=recordXPath.indexOf(recordOffset);if(index!=0)
{recordXPath=null;}
else
{recordXPath=recordXPath.substring(recordOffset.length);}
if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": stripCleanRecords() recordXPath after taking into account recordOffset = "+recordXPath);}
if(targetXPath!=null&&targetXPath!="")
{recordXPath=XPathUtils.concatXPaths(targetXPath,recordXPath);if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": stripCleanRecords() added targetXPath, recordXPath = "+recordXPath);}
if(recordXPath!=null)
{var nodes=stripNode.selectNodes(recordXPath);for(var j=0,nl=nodes.length;j<nl;j++)
{var node=nodes[j];var dirtyNode=node.selectSingleNode("./"+RecordsProtocol.RECORD_DIRTY_ELEMENT);if(dirtyNode==null||XML.getNodeTextContent(dirtyNode)!="true")
{var parent=node.parentNode;parent.removeChild(node);}
else
{var parent=dirtyNode.parentNode;parent.removeChild(dirtyNode);}}}}
return stripNode;}
RecordsProtocol.prototype.invokeMarkRecordDirty=function(event)
{if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": invokeMarkRecordDirty() data model event = "+event.toString());if(event.getType()!=DataModelEvent.REMOVE)
{var dirtyRecordXPath="/"+RecordsProtocol.RECORD_DIRTY_ELEMENT;var dm=FormController.getInstance().getDataModel();var eventXPath=event.getXPath();if(eventXPath.lastIndexOf("/RecordDirty")!=(eventXPath.length-dirtyRecordXPath.length))
{for(var i=0,rl=this.m_records.length;i<rl;i++)
{var recordXPath=this.m_records[i].getXPath();var finalNode=XPathUtils.getNameOfLastNode(eventXPath);var xpath=recordXPath+"[descendant-or-self::"+finalNode+" = "+eventXPath+"]";var nodes=dm.getNodes(xpath);if(nodes.length>0)
{var rowToMarkDirtyXPath=RecordsProtocol.getRowXPathFromEventXPath(eventXPath,recordXPath);if(rowToMarkDirtyXPath!=null)
{dm.setValue(rowToMarkDirtyXPath+dirtyRecordXPath,"true");}}}}}
return false;}
RecordsProtocol.getRowXPathFromEventXPath=function(eventXPath,recordXPath)
{var originalXPath=eventXPath;var eventIndex=0;var slashIndex=0;while(slashIndex!=-1)
{recordXPath=recordXPath.substring(slashIndex+1);slashIndex=recordXPath.indexOf("/");if(slashIndex!=-1)
{var nextElement=recordXPath.substring(0,slashIndex);var index=eventXPath.indexOf(nextElement);if(index!=-1)
{eventIndex=eventIndex+index+nextElement.length;eventXPath=eventXPath.substring(index+nextElement.length);while(eventXPath.charAt(0)=="[")
{index=eventXPath.indexOf("]");eventIndex=eventIndex+index+1;eventXPath=eventXPath.substring(index+1);}}
else
{return null;}}
else
{var nextElement=recordXPath;var index=eventXPath.indexOf(nextElement);if(index!=-1)
{eventIndex=eventIndex+index+nextElement.length;eventXPath=eventXPath.substring(index+nextElement.length);while(eventXPath.charAt(0)=="[")
{index=eventXPath.indexOf("]");eventIndex=eventIndex+index+1;eventXPath=eventXPath.substring(index+1);}}
else
{return null;}}}
return originalXPath.substring(0,eventIndex);}
RecordsProtocol.prototype.invokeLazyFetchRecord=function(event)
{if(RecordsProtocol.m_logger.isDebug())RecordsProtocol.m_logger.debug(this.getDisplayName()+": invokeLazyFetchRecord() data model event = "+event.toString());var dm=FormController.getInstance().getDataModel();var eventXPath=event.getXPath();for(var i=0,rl=this.m_records.length;i<rl;i++)
{var record=this.m_records[i];var lazyFetchXPath=record.getLazyFetchXPath();if(lazyFetchXPath==eventXPath)
{var lazyFetchs=record.getLazyFetchs();var key=Services.getValue(lazyFetchXPath);if(key==null||key=="")
{}
else
{var rowXPath=record.getXPath();rowXPath=rowXPath+"["+record.getKeyXPath()+" = \'"+key+"\']";for(var i=0,l=lazyFetchs.length;i<l;i++)
{var lazyFetch=lazyFetchs[i];var nodeExistsCheckXPath=rowXPath+"/"+lazyFetch.getNodeXPath();if(!Services.exists(nodeExistsCheckXPath))
{this.invokeLazyFetchingService(rowXPath,lazyFetch);}}}}}
return false;}
RecordsProtocol.prototype.invokeLazyFetchingService=function(rowXPath,lazyFetch)
{var serviceConfig=lazyFetch.getService();var resultTargetXPath=lazyFetch.getResultTargetXPath();var dL=RecordsProtocolLazyLoadingDataLoader.create(serviceConfig,this,rowXPath,resultTargetXPath);dL.load();}
RecordsProtocol.prototype.onLazyFetchingServerSuccess=function(dom,rowXPath,resultTargetXPath)
{var fc=FormController.getInstance();var formAdaptor=fc.getFormAdaptor();var restartDirtyEventChecking=false
if(formAdaptor.supportsProtocol("FormDirtyProtocol")&&!formAdaptor.dirtyEventsSuspended())
{restartDirtyEventChecking=true;formAdaptor.suspendDirtyEvents(true);}
try
{if(resultTargetXPath!=null)
{var nodesToAdd=dom.selectNodes(resultTargetXPath);for(var i=0,l=nodesToAdd.length;i<l;i++)
{Services.addNode(nodesToAdd[i],rowXPath);}}
else
{Services.addNode(dom,rowXPath);}}
catch(e)
{if(RecordsProtocol.m_logger.isError())RecordsProtocol.m_logger.error(this.getDisplayName()+": RecordsProtocol.onLazyFetchingServerSuccess() caught exception attempting to add the lazy fetch data to the record, e = "+e);}
if(restartDirtyEventChecking)
{formAdaptor.suspendDirtyEvents(false);}}
RecordsProtocol.prototype.getListenersForRecordsProtocol=function()
{var listenerArray=new Array();var dirtyRecordListener=FormControllerListener.create(this,FormController.DIRTY_RECORD);var lazyFetchListener=FormControllerListener.create(this,FormController.LAZY_FETCH_RECORD);var on=this.getMarkDirtyRecordOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i]+"//*",listener:dirtyRecordListener});}}
var on=this.getLazyFetchRecordOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:lazyFetchListener});}}
return listenerArray;}
RecordsProtocol.prototype.createRecord=function(xpath,keyXPath,stripCleanRecords,lazyFetchXPath,lazyFetchs,displayName)
{var record=Record._create(xpath,keyXPath,stripCleanRecords,lazyFetchXPath,lazyFetchs,displayName);if(stripCleanRecords==true)
{this.m_markDirtyRecordOn[this.m_markDirtyRecordOn.length]=xpath;}
if(lazyFetchs!=null&&lazyFetchs.length>0)
{this.m_lazyFetchRecordOn[this.m_lazyFetchRecordOn.length]=lazyFetchXPath;}
return record;}
function Record()
{this.m_xpath=null;this.m_stripCleanRecords=null;this.m_lazyFetchXPath=null;this.m_lazyFetchs=null;this.m_displayName=null;}
Record._create=function(xpath,keyXPath,stripCleanRecords,lazyFetchXPath,lazyFetchs,displayName)
{var record=new Record();record.m_xpath=xpath;record.m_keyXPath=keyXPath;record.m_stripCleanRecords=stripCleanRecords;record.m_lazyFetchXPath=lazyFetchXPath;record.m_lazyFetchs=new Array();if(lazyFetchs!=null)
{for(var i=0,l=lazyFetchs.length;i<l;i++)
{var lazyFetchConfig=lazyFetchs[i];record.m_lazyFetchs[record.m_lazyFetchs.length]=new LazyFetch(lazyFetchConfig);}}
record.m_displayName=displayName;return record;}
Record.prototype.getXPath=function()
{return this.m_xpath;}
Record.prototype.getKeyXPath=function()
{return this.m_keyXPath;}
Record.prototype.getLazyFetchXPath=function()
{return this.m_lazyFetchXPath;}
Record.prototype.getStripCleanRecords=function()
{return this.m_stripCleanRecords;}
Record.prototype.getLazyFetchs=function()
{return this.m_lazyFetchs;}
Record.prototype.getDisplayName=function()
{return this.m_displayName;}
function LazyFetch(lazyFetchConfig)
{this.m_nodeXPath=lazyFetchConfig.nodeXPath;this.m_resultTargetXPath=lazyFetchConfig.resultTargetXPath;this.m_service=lazyFetchConfig.service;this.m_displayName=(lazyFetchConfig.displayName==null)?XPathUtils.getLastNodeName(this.m_nodeXPath):lazyFetchConfig.displayName;}
LazyFetch.prototype.getNodeXPath=function()
{return this.m_nodeXPath;}
LazyFetch.prototype.getResultTargetXPath=function()
{return this.m_resultTargetXPath;}
LazyFetch.prototype.getService=function()
{return this.m_service;}
LazyFetch.prototype.getDisplayName=function()
{return this.m_displayName;}
function EnablementProtocol()
{}
EnablementProtocol.prototype.m_enabled=true;EnablementProtocol.prototype.m_originalEnabled=true;EnablementProtocol.prototype.m_containerEnabled=true;EnablementProtocol.prototype.m_enabledChanged=false;EnablementProtocol.prototype.enableOn=null;EnablementProtocol.prototype.isEnabled=null;EnablementProtocol.prototype.initialiseEnablementProtocol=function(e)
{this.setEnabled(this.invokeIsEnabled(e));}
EnablementProtocol.prototype.configEnablementProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].enableOn)
{this.enableOn=cs[i].enableOn;break;}}}
EnablementProtocol.prototype.disposeEnablementProtocol=function()
{}
EnablementProtocol.prototype.getEnableOn=function()
{return this.enableOn;}
EnablementProtocol.prototype.hasIsEnabled=function()
{return this.hasConfiguredProperty("isEnabled");}
EnablementProtocol.prototype.invokeIsEnabled=function(event)
{var cs=this.getConfigs();var enabled=true;for(var i=0,l=cs.length;i<l&&enabled;i++)
{if(null!=cs[i].isEnabled&&!cs[i].isEnabled.call(this,event))
{enabled=false;break;}}
return enabled;}
EnablementProtocol.prototype.setContainerEnabled=function(e)
{var r=false;this.m_containerEnabled=e;if(e==true)
{if(this.m_enabled!=this.m_originalEnabled)
{this.m_enabled=this.m_originalEnabled;this.m_enabledChanged=!this.m_enabledChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE,this.m_enabled,this);this.changeAdaptorState(e);}}
else
{this.m_originalEnabled=this.m_enabled;if(e!=this.m_enabled)
{this.m_enabled=e;this.m_enabledChanged=!this.m_enabledChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE,this.m_enabled,this);this.changeAdaptorState(e);}}
return r;}
EnablementProtocol.prototype.setEnabled=function(e,detail)
{var r=false;if(this.m_containerEnabled==false)
{this.m_originalEnabled=e;}
if(this.m_containerEnabled==true&&e!=this.m_enabled)
{this.m_enabled=e;this.m_enabledChanged=!this.m_enabledChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE,this.m_enabled,this);this.changeAdaptorState(e);}
return r;}
EnablementProtocol.prototype.getEnabled=function()
{return this.m_enabled;}
EnablementProtocol.prototype.getListenersForEnablementProtocol=function()
{var listenerArray=new Array();if(!this.hasIsEnabled())
{return listenerArray;}
var listener=FormControllerListener.create(this,FormController.ENABLEMENT);var db=this.dataBinding;if(null!=db)
{listenerArray.push({xpath:db,listener:listener});}
var on=this.getEnableOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}
return listenerArray;}
function FocusProtocol()
{}
FocusProtocol.m_logger=new Category("FocusProtocol");FocusProtocol.prototype.tabIndex=null;FocusProtocol.prototype.m_focus=false;FocusProtocol.prototype.m_focusChanged=false;FocusProtocol.prototype.moveFocus=null;FocusProtocol.prototype.configFocusProtocol=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].tabIndex)
{if(this.tabIndex==null)this.tabIndex=cs[i].tabIndex;}
if(null!=cs[i].moveFocus)
{if(this.moveFocus==null)this.moveFocus=cs[i].moveFocus;}}}
FocusProtocol.prototype.disposeFocusProtocol=function()
{}
FocusProtocol.prototype.getTabIndex=function()
{var index=0;if(this.tabIndex!=null)
{var indexPosition=parseInt(this.tabIndex);if(indexPosition>0||indexPosition<0)
{index=indexPosition;}
else
{}}
return index;}
FocusProtocol.prototype.invokeMoveFocus=function(forwards)
{var targetAdaptorId=null;if(null!=this.moveFocus)
{targetAdaptorId=this.moveFocus.call(this,forwards);}
return targetAdaptorId;}
FocusProtocol.prototype.setFocus=function(f,wasClick)
{if(FocusProtocol.m_logger.isDebug())FocusProtocol.m_logger.debug("FocusProtocol.setFocus() adaptor "+this.getId()+", focus = "+f);var r=false;if(f!=this.m_focus)
{this.m_focus=f;this.m_focusChanged=true;r=true;}
else
{this.m_focusChanged=false;}
return r;}
FocusProtocol.prototype.hasFocus=function()
{return this.m_focus;}
FocusProtocol.prototype.acceptFocus=function()
{return true;}
FocusProtocol.prototype.onFocus=null;FocusProtocol.prototype.onBlur=null;function FormDirtyProtocol()
{}
FormDirtyProtocol.m_logger=new Category("FormDirtyProtocol");FormDirtyProtocol.DEFAULT_MODEL_XPATH=DataModel.DEFAULT_ROOT;FormDirtyProtocol.prototype.m_dirty=false;FormDirtyProtocol.prototype.m_suspend=false;FormDirtyProtocol.prototype.configFormDirtyProtocol=function(cs)
{}
FormDirtyProtocol.prototype.disposeFormDirtyProtocol=function()
{}
FormDirtyProtocol.prototype.getModelXPath=function()
{fc_assertAlways("FormDirtyProtocol.getModelXPath(): must be overridden in implmeneting adaptor");}
FormDirtyProtocol.prototype.formDirtyUpdate=function(e)
{if(this._getState()!=FormElementGUIAdaptor.FORM_BLANK)
{if(!((this.getModelXPath()==FormDirtyProtocol.DEFAULT_MODEL_XPATH&&(e.getXPath().indexOf(DataModel.VARIABLES_ROOT)==0))||e.getXPath()=="/"))
{if(FormDirtyProtocol.m_logger.isDebug())FormDirtyProtocol.m_logger.debug("set form to dirty - change to xpath: "+e.getXPath());this._setDirty(true);this.update();}
else
{if(FormDirtyProtocol.m_logger.isDebug())FormDirtyProtocol.m_logger.debug("Not setting form dirty because xpath is outside Form Model Xpath. Change to xpath: "+e.getXPath());}}
else
{if(FormDirtyProtocol.m_logger.isDebug())FormDirtyProtocol.m_logger.debug("Not setting form dirty because form is in blank state. Change to xpath: "+e.getXPath());}}
FormDirtyProtocol.prototype.getListenersForFormDirtyProtocol=function()
{var listenerArray=new Array();var listener=FormControllerListener.create(this,FormController.FORMDIRTY);listenerArray.push({xpath:this.getModelXPath()+"//*",listener:listener});return listenerArray;}
FormDirtyProtocol.prototype.dirtyEventsSuspended=function()
{return this.m_suspend;}
FormDirtyProtocol.prototype.suspendDirtyEvents=function(suspend)
{this.m_suspend=suspend;}
function HelpProtocol()
{}
HelpProtocol.prototype.helpText=null;HelpProtocol.prototype.getHelpText=function()
{return this.helpText;}
HelpProtocol.prototype.configHelpProtocol=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].helpText)
{this.helpText=cs[i].helpText;this.bindHelp();break;}}}
HelpProtocol.prototype.disposeHelpProtocol=function()
{if(this.helpText!=null)
{if(this.unbindHelp!=null)
{this.unbindHelp();}}}
HelpProtocol.prototype.bindHelp=undefined;HelpProtocol.prototype.unbindHelp=undefined;function InitialiseProtocol()
{}
InitialiseProtocol.prototype.initialise=null;InitialiseProtocol.prototype.m_defaultValue=null;InitialiseProtocol.prototype.hasInitialise=function()
{return this.hasConfiguredProperty("initialise");}
InitialiseProtocol.prototype.invokeInitialise=function()
{var cs=this.getConfigs();for(var i=cs.length-1;i>=0;i--)
{if(null!=cs[i].initialise)
{var dV=cs[i].initialise.call(this);if(null!=dV)
{this.m_defaultValue=dV;}}}}
InitialiseProtocol.prototype.configInitialiseProtocol=function(cs)
{}
InitialiseProtocol.prototype.disposeInitialiseProtocol=function()
{}
function KeybindingProtocol()
{}
KeybindingProtocol.prototype.m_keys=null;KeybindingProtocol.prototype.keyBindings=null;KeybindingProtocol.prototype.configKeybindingProtocol=function(cs)
{var kbs=[];for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];var ckbs=c.keyBindings;if(null!=ckbs)
{kbs=kbs.concat(ckbs);}}
var kb=null;var qualifiers=null;var propagate;for(var i=0,l=kbs.length;i<l;i++)
{kb=kbs[i];if(kb.ctrl==true||kb.alt==true||kb.shift==true)
{qualifiers=new Object();qualifiers.ctrl=kb.ctrl;qualifiers.alt=kb.alt;qualifiers.shift=kb.shift;}
propagate=(kb.propagate==true)?true:false;this.bindKey(kb.key,kb.action,qualifiers,propagate);if(null!=qualifiers)
{qualifiers=null;}}}
KeybindingProtocol.prototype.disposeKeybindingProtocol=function()
{if(null!=this.m_keys)this.m_keys.dispose();}
KeybindingProtocol.prototype.bindKey=function(k,a,q,p)
{var keys=this.getKeyBindings();keys.bindKey(k,a,q,p);}
KeybindingProtocol.prototype.getKeyBindings=function()
{if(null==this.m_keys)this.m_keys=new ElementKeyBindings(this);return this.m_keys;}
function MouseWheelBindingProtocol()
{}
MouseWheelBindingProtocol.prototype.configMouseWheelBindingProtocol=function(cs)
{}
MouseWheelBindingProtocol.prototype.disposeMouseWheelBindingProtocol=function()
{}
MouseWheelBindingProtocol.prototype.getKeyBindings=function()
{if(null==this.m_keys)this.m_keys=new ElementKeyBindings(this);return this.m_keys;}
MouseWheelBindingProtocol.prototype.handleScrollMouse=function(evt)
{}
function MandatoryProtocol()
{}
MandatoryProtocol.m_logger=new Category("MandatoryProtocol");MandatoryProtocol.prototype.m_mandatory=false;MandatoryProtocol.prototype.m_mandatoryChanged=false;MandatoryProtocol.prototype.mandatoryOn=null;MandatoryProtocol.prototype.isMandatory=null;MandatoryProtocol.prototype.configMandatoryProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].mandatoryOn)
{this.mandatoryOn=cs[i].mandatoryOn;break;}}}
MandatoryProtocol.prototype.initialiseMandatoryProtocol=function(e)
{this.setMandatory(this.invokeIsMandatory(e));}
MandatoryProtocol.prototype.disposeMandatoryProtocol=function()
{}
MandatoryProtocol.prototype.getMandatoryOn=function()
{return this.mandatoryOn;}
MandatoryProtocol.prototype.hasIsMandatory=function()
{return this.hasConfiguredProperty("isMandatory");}
MandatoryProtocol.prototype.invokeIsMandatory=function(event)
{if(this.configDataBindingProtocol!=null&&this.hasValue())
{return false;}
var mandatory=false;var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].isMandatory&&cs[i].isMandatory.call(this,event))
{mandatory=true;break;}}
return mandatory;}
MandatoryProtocol.prototype.setMandatory=function(m)
{var r=false;if(m!=this.m_mandatory)
{this.m_mandatory=m;this.m_mandatoryChanged=!this.m_mandatoryChanged;r=true;this.fireMandatoryStateChangeEvent();}
return r;}
MandatoryProtocol.prototype.fireMandatoryStateChangeEvent=function()
{var e=StateChangeEvent.create(StateChangeEvent.MANDATORY_TYPE,this.m_mandatory,this);this.changeAdaptorState(e);}
MandatoryProtocol.prototype.getMandatory=function()
{return this.m_mandatory;}
MandatoryProtocol.prototype.getListenersForMandatoryProtocol=function()
{var listenerArray=new Array();if(!this.hasIsMandatory())
{return listenerArray;}
var listener=FormControllerListener.create(this,FormController.MANDATORY);var db=this.dataBinding;if(null!=db)
{listenerArray.push({xpath:db,listener:listener});}
var on=this.getMandatoryOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}
return listenerArray;}
function NameProtocol()
{}
NameProtocol.prototype.componentName=null;NameProtocol.prototype.getName=function()
{return null==this.componentName?this.getId():this.componentName;}
NameProtocol.prototype.configNameProtocol=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].componentName)
{this.componentName=cs[i].componentName;break;}}}
NameProtocol.prototype.disposeNameProtocol=function()
{}
function ReadOnlyProtocol()
{}
ReadOnlyProtocol.prototype.m_readOnly=false;ReadOnlyProtocol.prototype.m_originalReadOnly=false;ReadOnlyProtocol.prototype.m_containerReadOnly=false;ReadOnlyProtocol.prototype.m_readOnlyChanged=false;ReadOnlyProtocol.prototype.readOnlyOn=null;ReadOnlyProtocol.prototype.isReadOnly=null;ReadOnlyProtocol.prototype.configReadOnlyProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].readOnlyOn)
{this.readOnlyOn=cs[i].readOnlyOn;break;}}}
ReadOnlyProtocol.prototype.initialiseReadOnlyProtocol=function(e)
{this.setReadOnly(this.invokeIsReadOnly(e));}
ReadOnlyProtocol.prototype.disposeReadOnlyProtocol=function()
{}
ReadOnlyProtocol.prototype.getReadOnlyOn=function()
{return this.readOnlyOn;}
ReadOnlyProtocol.prototype.hasIsReadOnly=function()
{return this.hasConfiguredProperty("isReadOnly");}
ReadOnlyProtocol.prototype.invokeIsReadOnly=function(event)
{var cs=this.getConfigs();var readOnly=false;for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].isReadOnly&&cs[i].isReadOnly.call(this,event))
{readOnly=true;break;}}
return readOnly;}
ReadOnlyProtocol.prototype.setContainerReadOnly=function(ro)
{var r=false;this.m_containerReadOnly=ro;if(ro==false)
{if(this.m_readOnly!=this.m_originalReadOnly)
{this.m_readOnly=this.m_originalReadOnly;this.m_readOnlyChanged=!this.m_readOnlyChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.READONLY_TYPE,this.m_readOnly,this);this.changeAdaptorState(e);}}
else
{this.m_originalReadOnly=this.m_readOnly;if(ro!=this.m_readOnly)
{this.m_readOnly=ro;this.m_readOnlyChanged=!this.m_readOnlyChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.READONLY_TYPE,this.m_readOnly,this);this.changeAdaptorState(e);}}
return r;}
ReadOnlyProtocol.prototype.setReadOnly=function(ro)
{var r=false;if(this.m_containerReadOnly==true)
{this.m_originalReadOnly=ro;}
if(this.m_containerReadOnly==false&&ro!=this.m_readOnly)
{this.m_readOnly=ro;this.m_readOnlyChanged=!this.m_readOnlyChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.READONLY_TYPE,this.m_readOnly,this);this.changeAdaptorState(e);}
return r;}
ReadOnlyProtocol.prototype.getReadOnly=function()
{return this.m_readOnly;}
ReadOnlyProtocol.prototype.getListenersForReadOnlyProtocol=function()
{var listenerArray=new Array();if(!this.hasIsReadOnly())
{return listenerArray;}
var listener=FormControllerListener.create(this,FormController.READONLY);var db=this.dataBinding;if(null!=db)
{listenerArray.push({xpath:db,listener:listener});}
var on=this.getReadOnlyOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}
return listenerArray;}
function TemporaryProtocol()
{}
TemporaryProtocol.prototype.isTemporary=null;TemporaryProtocol.prototype.configTemporaryProtocol=function(cs)
{}
TemporaryProtocol.prototype.disposeTemporaryProtocol=function()
{}
TemporaryProtocol.prototype.hasTemporary=function()
{return this.hasConfiguredProperty("isTemporary");}
TemporaryProtocol.prototype.invokeIsTemporary=function()
{var cs=this.getConfigs();var temp=false;for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].isTemporary)
{temp=cs[i].isTemporary.call(this);this.setTemporary(temp);}}
return temp;}
TemporaryProtocol.prototype.setTemporary=function(t)
{var r=false;if(t!=this.m_temporary)
{this.m_temporary=t;this.m_temporaryChanged=!this.m_temporaryChanged;r=true;var e=StateChangeEvent.create(StateChangeEvent.TEMPORARY_TYPE,this.m_temporary,this);this.changeAdaptorState(e);}
return r;}
TemporaryProtocol.prototype.getTemporary=function()
{return this.m_temporary;}
function ValidationProtocolServerValidationDataLoader()
{}
ValidationProtocolServerValidationDataLoader.prototype=new fwDataLoader();ValidationProtocolServerValidationDataLoader.prototype.constructor=ValidationProtocolServerValidationDataLoader;ValidationProtocolServerValidationDataLoader.m_logger=new Category("ValidationProtocolServerValidationDataLoader");ValidationProtocolServerValidationDataLoader.prototype._successHandler=function(dom,name)
{this.m_validationProtocol.onServerValidationServerSuccess(dom);}
ValidationProtocolServerValidationDataLoader.prototype._abort=function()
{this.m_validationProtocol.onServerValidationAbort();}
ValidationProtocolServerValidationDataLoader.create=function(config,validationProtocol)
{var dl=new ValidationProtocolServerValidationDataLoader();dl.m_validationProtocol=validationProtocol;dl._initialise(config);return dl;}
ValidationProtocolServerValidationDataLoader.prototype._getServiceTypeName=function()
{return"Server validation service";}
ValidationProtocolServerValidationDataLoader.prototype._getAbortMessage=function()
{return"abort the server side validation (field will remain invalid)";}
function ValidationProtocol()
{}
ValidationProtocol.prototype=new StateChangeEventProtocol();ValidationProtocol.prototype.constructor=ValidationProtocol;ValidationProtocol.prototype.m_valid=true;ValidationProtocol.prototype.m_serverValid=true;ValidationProtocol.prototype.m_pendingServerValidation=false;ValidationProtocol.prototype.m_serverValidationActive=false;ValidationProtocol.prototype.m_validChanged=false;ValidationProtocol.prototype.m_lastError=null;ValidationProtocol.prototype.validateOn=null;ValidationProtocol.prototype.validate=null;ValidationProtocol.prototype.serverValidateOn=null;ValidationProtocol.prototype.serverValidate=null;ValidationProtocol.prototype.configValidationProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].validateOn)
{this.validateOn=cs[i].validateOn;}
if(null!=cs[i].serverValidateOn)
{this.serverValidateOn=cs[i].serverValidateOn;}
if(null!=cs[i].serverValidate)
{this.serverValidate=cs[i].serverValidate;}}}
ValidationProtocol.prototype.initialiseValidationProtocol=function(e)
{this.setValid(this.invokeValidate(e)==null);}
ValidationProtocol.prototype.disposeValidationProtocol=function()
{}
ValidationProtocol.prototype.getServerValidateOn=function()
{return this.serverValidateOn;}
ValidationProtocol.prototype.getValidateOn=function()
{return this.validateOn;}
ValidationProtocol.prototype.hasValidate=function()
{return this.hasConfiguredProperty("validate");}
ValidationProtocol.prototype.hasServerValidate=function()
{return this.hasConfiguredProperty("serverValidate");}
ValidationProtocol.prototype.invokeValidate=function(event)
{var ec=null;if(this.supportsProtocol("DataBindingProtocol")&&this.hasValue())
{var cs=this.getConfigs();for(var i=cs.length-1;i>=0&&null==ec;i--)
{if(null!=cs[i].validate)
{ec=cs[i].validate.call(this,event);}}}
return ec;}
ValidationProtocol.prototype.invokeServerValidate=function(event)
{var repaintAdaptor=false;if(this.configDataBindingProtocol!=null&&this.hasValue())
{if(this.m_valid==true)
{this.m_serverValid=false;this.m_serverValidationActive=true;this.invokeService();this.triggerStateChangeEvent();repaintAdaptor=true;}
else
{this.m_pendingServerValidation=true;}}
return repaintAdaptor;}
ValidationProtocol.prototype.triggerStateChangeEvent=function()
{var e=StateChangeEvent.create(StateChangeEvent.VALID_TYPE,this.getValid(),this);this.changeAdaptorState(e);}
ValidationProtocol.prototype.invokeService=function()
{var dm=FormController.getInstance().getDataModel();this.m_pendingServerValidation=false;var dL=ValidationProtocolServerValidationDataLoader.create(this.serverValidate,this);dL.load();}
ValidationProtocol.prototype.handleServerValidationSuccess=function(dom)
{var errorCodeId=XML.selectNodeGetTextContent(dom,"//ErrorCode");if(errorCodeId==""||errorCodeId==null)
{this.m_serverValid=true;this.setLastError(null);}
else
{var errorCode=null;var paramNodes=dom.selectNodes("//ErrorCode/Parameters/Parameter");if(paramNodes==null||paramNodes.length==0)
{errorCode=ErrorCode.getErrorCode(errorCodeId);}
else
{var params=new Array();params[0]="ErrorCode.getErrorCode(\"";params[1]=errorCodeId;params[2]="\"";for(var i=0,l=paramNodes.length;i<l;i++)
{params[params.length]=", \"";params[params.length]=XML.getNodeTextContent(paramNodes[i]);params[params.length]="\"";}
params[params.length]=");";var evalString=params.join("");errorCode=eval(evalString);}
this.setLastError(errorCode);}
this.triggerStateChangeEvent();FormController.getInstance().processEvents();this.m_serverValidationActive=false;}
ValidationProtocol.prototype.onServerValidationServerSuccess=function(dom)
{this.handleServerValidationSuccess(dom);this.renderState();}
ValidationProtocol.prototype.handleServerValidationAbort=function()
{this.m_serverValid=false;this.triggerStateChangeEvent();FormController.getInstance().processEvents();this.m_serverValidationActive=false;}
ValidationProtocol.prototype.onServerValidationAbort=function()
{this.handleServerValidationAbort();this.renderState();}
ValidationProtocol.prototype.getLastError=function()
{return this.m_lastError;}
ValidationProtocol.prototype.setLastError=function(lastError)
{this.m_lastError=lastError;}
ValidationProtocol.prototype.setValid=function(v)
{var r=false;var invokeServer=false;if(this.m_pendingServerValidation==true&&this.m_valid==false&&v==true)
{invokeServer=true;}
if(v!=this.m_valid)
{this.m_valid=v;this.m_validChanged=!this.m_validChanged;r=true;this.triggerStateChangeEvent();}
if(invokeServer==true)
{this.invokeServerValidate();}
return r;}
ValidationProtocol.prototype.getValid=function()
{return(this.m_valid&this.m_serverValid);}
ValidationProtocol.prototype.getPendingServerValidation=function()
{return this.m_pendingServerValidation;}
ValidationProtocol.prototype.setServerValid=function(v)
{this.m_serverValid=v;}
ValidationProtocol.prototype.getServerValid=function()
{return this.m_serverValid;}
ValidationProtocol.prototype.m_validationListener=null;ValidationProtocol.prototype.getValidationListener=function()
{if(this.m_validationListener==null)
{this.m_validationListener=FormControllerListener.create(this,FormController.VALIDATION);}
return this.m_validationListener;}
ValidationProtocol.prototype.m_serverValidationListener=null;ValidationProtocol.prototype.getServerValidationListener=function()
{if(this.m_serverValidationListener==null)
{this.m_serverValidationListener=FormControllerListener.create(this,FormController.SERVER_VALIDATION);}
return this.m_serverValidationListener;}
ValidationProtocol.prototype.getListenersForValidationProtocol=function()
{var listenerArray=new Array();if(this.hasValidate())
{var listener=this.getValidationListener();var db=this.dataBinding;if(null!=db)
{listenerArray.push({xpath:db,listener:listener});}
var on=this.getValidateOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}}
if(this.hasServerValidate())
{var listener=this.getServerValidationListener();var on=this.getServerValidateOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}}
return listenerArray;}
ValidationProtocol.prototype._validateMaxLength=function()
{var mV=FormController.getInstance().getDataModel().getValue(this.dataBinding);var ec=null;if(mV!=null&&mV.length>this.maxLength)
{ec=ErrorCode.getErrorCode('FW_TEXTINPUT_InvalidFieldLength');ec.m_message=ec.getMessage()+this.maxLength;}
return ec;}
ValidationProtocol.prototype.isServerValidationActive=function()
{return this.m_serverValidationActive;}
ValidationProtocol.prototype._validateWhitespaceOnlyEntry=function()
{var mV=FormController.getInstance().getDataModel().getValue(this.dataBinding);var ec=null;if(typeof mV=="string")
{if(String.trim(mV)=="")
{ec=ErrorCode.getErrorCode('FW_TEXTINPUT_WhitespaceOnlyEntry');}}
return ec;}
ValidationProtocol.prototype._addWhitespaceOnlyEntryValidation=function()
{var validationObj=new Object();validationObj["validate"]=this._validateWhitespaceOnlyEntry;this.addConfig(validationObj);}
function IteratorProtocol()
{this.m_keys=new Array();this.retrieveOn=new Array();}
IteratorProtocol.m_logger=new Category("IteratorProtocol");IteratorProtocol.prototype.m_selectedKeyDataBinding=null;IteratorProtocol.prototype.m_srcData=null;IteratorProtocol.prototype.m_rowXPath=null;IteratorProtocol.prototype.m_keyXPath=null;IteratorProtocol.prototype.m_keys=null;IteratorProtocol.prototype.reset=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.reset()");this.m_keys.length=0;var nodes=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this.getPath());for(var i=0;i<nodes.length;i++)
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.reset() adding node value = "+XML.selectNodeGetTextContent(nodes[i],this.m_keyXPath)+" at m_keys["+i+"]");this.m_keys[i]=XML.selectNodeGetTextContent(nodes[i],this.m_keyXPath);}
if(this.m_keys.length>0)
{this.setSelectedKey(this.m_keys[0]);}
else
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.reset() m_keys[] array is empty, therefore cannot set the initial selected key for this iterator");}}
IteratorProtocol.prototype.setSelectedKey=function(key)
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.setSelectedKey("+key+")");FormController.getInstance().getDataModel().setValue(this.m_selectedKeyDataBinding,key);}
IteratorProtocol.prototype.getSelectedKey=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.getSelectedKey() from location "+this.m_selectedKeyDataBinding);return FormController.getInstance().getDataModel().getValue(this.m_selectedKeyDataBinding);}
IteratorProtocol.prototype.previous=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.previous() this.m_keys.length = "+this.m_keys.length);var currentIndex=this.getPosition(this.getSelectedKey());if(this.hasPrevious())
{if(null==currentIndex)
{var previousKey=this.m_keys[0];this.setSelectedKey(previousKey);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.previous(), currentIndex = null, resetting new key = "+previousKey);}
else
{var previousKey=this.m_keys[currentIndex-1];this.setSelectedKey(previousKey);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.previous(), currentIndex = "+currentIndex+", old key = "+this.m_keys[currentIndex]+", new key = "+this.m_keys[currentIndex-1]);}}
else
{if(IteratorProtocol.m_logger.isWarn())IteratorProtocol.m_logger.warn("IteratorProtocol.previous(), this.hasPrevious() returned false, not changing current selected key = "+this.m_keys[currentIndex]);}}
IteratorProtocol.prototype.next=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.next() this.m_keys.length = "+this.m_keys.length);var currentIndex=this.getPosition(this.getSelectedKey());if(this.hasNext())
{if(null==currentIndex)
{var nextKey=this.m_keys[0];this.setSelectedKey(nextKey);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.next(), currentIndex = null, resetting new key = "+nextKey);}
else
{var nextKey=this.m_keys[currentIndex+1];this.setSelectedKey(nextKey);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.next(), currentIndex = "+currentIndex+", old key = "+this.m_keys[currentIndex]+", new key = "+this.m_keys[currentIndex+1]);}}
else
{if(IteratorProtocol.m_logger.isWarn())IteratorProtocol.m_logger.warn("IteratorProtocol.next(), this.hasNext() returned false, not changing current selected key = "+this.m_keys[currentIndex]);}}
IteratorProtocol.prototype.hasPrevious=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.hasPrevious()");return this.getPosition(this.getSelectedKey())==0?false:true;}
IteratorProtocol.prototype.hasNext=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.hasNext()");return this.getPosition(this.getSelectedKey())==(this.m_keys.length-1)?false:true;}
IteratorProtocol.prototype.atStart=function()
{return this.hasPrevious()?false:true;}
IteratorProtocol.prototype.atEnd=function()
{return this.hasNext()?false:true;}
IteratorProtocol.prototype.configIteratorProtocol=function(cs)
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol()");for(var i=cs.length-1;i>=0;i--)
{var c=cs[i];if(null!=c.srcData)
{this.m_srcData=c.srcData;this.retrieveOn[0]=c.srcData+"//*";}
if(null!=c.rowXPath)this.m_rowXPath=c.rowXPath;if(null!=c.keyXPath)this.m_keyXPath=c.keyXPath;if(null!=c.selectedKeyDataBinding)this.m_selectedKeyDataBinding=c.selectedKeyDataBinding;if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_srcData = "+this.m_srcData);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_rowXPath = "+this.m_rowXPath);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_keyXPath = "+this.m_keyXPath);if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.configIteratorProtocol() this.m_selectedKeyDataBinding = "+this.m_selectedKeyDataBinding);}}
IteratorProtocol.prototype.disposeIteratorProtocol=function()
{}
IteratorProtocol.prototype.getPath=function()
{if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.getPath() returning "+this.m_srcData+this.m_rowXPath);return this.m_srcData+this.m_rowXPath;}
IteratorProtocol.prototype.getPosition=function(key)
{var position=null;if(key)
{for(var i=0;i<this.m_keys.length;i++)
{if(this.m_keys[i]==key)
{position=i;if(IteratorProtocol.m_logger.isInfo())IteratorProtocol.m_logger.info("IteratorProtocol.getPosition() position found for key ("+key+") = "+position);break;}}}
else
{if(IteratorProtocol.m_logger.isWarn())IteratorProtocol.m_logger.warn("IteratorProtocol.getPosition() no position found, key = "+key);}
return position;}
function LogicProtocol()
{}
LogicProtocol.prototype.logicOn=null;LogicProtocol.prototype.logic=null;LogicProtocol.prototype.initialiseLogicProtocol=function(e)
{this.initialiseLogicState(e);}
LogicProtocol.prototype.getLogicOn=function()
{return this.logicOn;}
LogicProtocol.prototype.hasLogic=function()
{return this.hasConfiguredProperty("logic");}
LogicProtocol.prototype.initialiseLogicState=function(e)
{if(this.hasLogic())
{var on=this.getLogicOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{if(on[i]=="/")
{this.invokeLogic(e);}}}}}
LogicProtocol.prototype.invokeLogic=function(event)
{var cs=this.getConfigs();if(null!=this.logic)
{this.logic.call(this,event);}}
LogicProtocol.prototype.configLogicProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i].logicOn)
{this.logicOn=cs[i].logicOn;this.logic=cs[i].logic;break;}}}
LogicProtocol.prototype.disposeLogicProtocol=function()
{}
LogicProtocol.prototype.getListenersForLogicProtocol=function()
{var listenerArray=new Array();var listener=FormControllerListener.create(this,FormController.LOGIC);var on=this.getLogicOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}
return listenerArray;}
function LabelProtocol()
{}
LabelProtocol.prototype.m_labelXPath=null;LabelProtocol.prototype.m_labelChanged=false;LabelProtocol.prototype.m_label=null;LabelProtocol.prototype.labelOn=null;LabelProtocol.prototype.label=null;LabelProtocol.prototype.configLabelProtocol=function(cs)
{var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(this.label==null)
this.label=cs[i].label;if(this.labelOn==null)
this.labelOn=cs[i].labelOn;if(this.m_labelXPath==null)
this.m_labelXPath=cs[i].labelXPath;}
if(this.label==null&&this.m_labelXPath!=null)
{this.label=this._defaultLabelImpl;}}
LabelProtocol.prototype.initialiseLabelProtocol=function(e)
{this.setLabel(this.invokeLabel(e));}
LabelProtocol.prototype._defaultLabelImpl=function()
{return Services.getValue(this.m_labelXPath);}
LabelProtocol.prototype.disposeLabelProtocol=function()
{}
LabelProtocol.prototype.getLabelXPath=function()
{return this.m_labelXPath;}
LabelProtocol.prototype.hasLabelXPath=function()
{return this.hasConfiguredProperty("labelXPath");}
LabelProtocol.prototype.getLabelOn=function()
{return this.labelOn;}
LabelProtocol.prototype.hasLabelOn=function()
{return this.hasConfiguredProperty("labelOn");}
LabelProtocol.prototype.hasLabel=function()
{if(null==this.label)
{return false;}
else
{return true;}}
LabelProtocol.prototype.invokeLabel=function()
{if(this.hasLabel())
{return this.label.call(this);}}
LabelProtocol.prototype.setLabel=function(e)
{var r=false;if(e!=this.m_label)
{this.m_label=e;this.m_labelChanged=true;r=true;}
return r;}
LabelProtocol.prototype.getLabel=function()
{return this.m_label;}
LabelProtocol.prototype.getListenersForLabelProtocol=function()
{var listenerArray=new Array();var listener=FormControllerListener.create(this,FormController.LABEL);if(null!=this.hasLabelXPath&&this.hasLabelXPath())
{labelXP=this.getLabelXPath();if(null!=labelXP)
{listenerArray.push({xpath:labelXP,listener:listener});}}
var on=this.getLabelOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{listenerArray.push({xpath:on[i],listener:listener});}}
return listenerArray;}
function BusinessLifeCycleError(message,ex)
{this.message=message;this.exception=ex;}
BusinessLifeCycleError.prototype=new Error();BusinessLifeCycleError.prototype.constructor=BusinessLifeCycleError;function BusinessLifeCycle(){}
BusinessLifeCycle.m_logger=new Category("BusinessLifeCycle");BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG='Unsaved changes exist. Click "Yes" to save changes and continue; click "No" to discard changes and continue; click "Cancel" to return to existing screen.';BusinessLifeCycle.prototype.m_eventBinding=null;BusinessLifeCycle.prototype.m_adaptor=null;BusinessLifeCycle.prototype.initialise=function(adaptor)
{this.m_adaptor=adaptor;}
BusinessLifeCycle.prototype.configure=function(config)
{if(null!=config.eventBinding)
{var id=this.m_adaptor.getId()+"_"+
this.getName()+"_eventBinding";this.m_eventBinding=new EventBinding(id);this.m_eventBinding.configure(config.eventBinding);if(this.m_eventBinding.hasConfiguredProperty("isEnabled"))
{FormController.getInstance().addEnablementEventBinding(this.m_eventBinding);}
var thisObj=this;this.m_eventBinding.bind(function(){thisObj.dispatchEvent();});}
this._configure(config);}
BusinessLifeCycle.prototype._configure=function(config)
{}
BusinessLifeCycle.prototype.dispose=function()
{this._dispose();if(null!=this.m_eventBinding)
{this.m_eventBinding.dispose();}}
BusinessLifeCycle.prototype._dispose=function(config)
{}
BusinessLifeCycle.prototype.getEventBinding=function()
{return this.m_eventBinding;}
BusinessLifeCycle.prototype.dispatchEvent=function()
{Services.dispatchEvent(this.m_adaptor.getId(),this.getName(),null);}
BusinessLifeCycle.prototype.getName=function()
{fc_assertAlways("BusinessLifeCycle::getName(): Base class method must be overriden");}
BusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{fc_assertAlways("BusinessLifeCycle::invokeBusinessLifeCycle(): Base class method must be overriden");}
BusinessLifeCycle.prototype.start=function()
{if(null!=this.m_eventBinding)
{this.m_eventBinding.start();}}
BusinessLifeCycle.prototype.stop=function()
{if(null!=this.m_eventBinding)
{this.m_eventBinding.stop();}}
BusinessLifeCycle.prototype.getAdaptor=function()
{return this.m_adaptor;}
function BusinessLifeCycleEvent()
{}
BusinessLifeCycleEvent.prototype.m_id=null;BusinessLifeCycleEvent.prototype.m_type=null;BusinessLifeCycleEvent.prototype.m_detail=null;BusinessLifeCycleEvent.create=function(id,type,detail)
{var e=new BusinessLifeCycleEvent();e.m_id=id;e.m_type=type;e.m_detail=detail;return e;}
BusinessLifeCycleEvent.prototype.getComponentId=function()
{return this.m_id;}
BusinessLifeCycleEvent.prototype.getType=function()
{return this.m_type;}
BusinessLifeCycleEvent.prototype.getDetail=function()
{return this.m_detail;}
function BusinessLifeCycleProtocol()
{}
BusinessLifeCycleProtocol.PROTOCOL_NAME="BusinessLifeCycleProtocol";BusinessLifeCycleProtocol.prototype.m_lifeCycles=null;BusinessLifeCycleProtocol.prototype.configBusinessLifeCycleProtocol=function(cs)
{this.m_lifeCycles=new Array();}
BusinessLifeCycleProtocol.prototype.disposeBusinessLifeCycleProtocol=function()
{var lifeCycles=this.m_lifeCycles;for(var i in lifeCycles)
{lifeCycles[i].dispose();}}
BusinessLifeCycleProtocol.prototype.handleBusinessLifeCycleEvent=function(event)
{var lifeCycle=this.m_lifeCycles[event.getType()];if(null!=lifeCycle)
{lifeCycle.invokeBusinessLifeCycle(event);}
else
{throw new BusinessLifeCycleError("Adaptor '"+this.getId()+"' does not support event of type '"+event.getType()+"'");}}
BusinessLifeCycleProtocol.prototype.addBusinessLifeCycle=function(lifeCycle)
{var lifeCycles=this.m_lifeCycles;var name=lifeCycle.getName();if(null==lifeCycles[name])
{lifeCycles[name]=lifeCycle;}
else
{throw new BusinessLifeCycleError("Duplicate lifecycle '"+name+"' added to adaptor '"+this.getId()+"'");}}
BusinessLifeCycleProtocol.prototype.getListenersForBusinessLifeCycleProtocol=function()
{var eventBinding;var lifeCycle;var lifeCycleListeners;var lifeCyclesListeners=new Array();var index=0;var lifeCycles=this.m_lifeCycles;for(var i in lifeCycles)
{lifeCycle=lifeCycles[i];eventBinding=lifeCycle.getEventBinding();if(null!=eventBinding)
{lifeCycleListeners=eventBinding.getListeners();for(var j=0,l=lifeCycleListeners.length;j<l;j++)
{lifeCyclesListeners[index]=lifeCycleListeners[j];index++;}
lifeCycleListeners=null;eventBinding=null;}}
return lifeCyclesListeners;}
BusinessLifeCycleProtocol.prototype.initialiseBusinessLifeCycleProtocol=function(e)
{var lifeCycle;var eventBinding;var lifeCycles=this.m_lifeCycles;for(var i in lifeCycles)
{lifeCycle=lifeCycles[i];eventBinding=lifeCycle.getEventBinding();if(null!=eventBinding)
{eventBinding.initialiseStates(e);}}}
function EventConfiguration()
{EventConfiguration.m_logger.error("EventConfiguration objects should never be instantiated");}
EventConfiguration.m_logger=new Category("EventConfiguration");EventConfiguration.prototype.singleClicks=null;EventConfiguration.prototype.doubleClicks=null;EventConfiguration.prototype.keys=null;function GUIAdaptor()
{}
GUIAdaptor.m_logger=new Category("GUIAdaptor");GUIAdaptor.prototype.m_configs=null;GUIAdaptor.prototype.m_stateChangeListener=null;GUIAdaptor.prototype.register=function(listener)
{this.m_stateChangeListener=listener;}
GUIAdaptor.prototype.m_protocols=new Array();GUIAdaptor.prototype.getId=undefined;GUIAdaptor.prototype.initialiseStates=function(e)
{Services.startTransaction();for(var i=0,l=this.m_initialiseList.length;i<l;i++)
{this[this.m_initialiseList[i]].call(this,e);}
Services.endTransaction();}
GUIAdaptor.prototype.registerListeners=function()
{var dm=FormController.getInstance().getDataModel();this.m_registeredListeners=new Array();for(var i=0,l=this.m_listeningProtocols.length;i<l;i++)
{var listeners=this["getListenersFor"+this.m_listeningProtocols[i]].call(this);dm.registerListenerArray(listeners);this.m_registeredListeners[this.m_listeningProtocols[i]]=listeners;}}
GUIAdaptor.prototype.deRegisterListeners=function()
{var dm=FormController.getInstance().getDataModel();for(var i in this.m_registeredListeners)
{dm.deRegisterListenerArray(this.m_registeredListeners[i]);}
this.m_registeredListeners=null;}
GUIAdaptor.prototype.renderState=function()
{}
GUIAdaptor.prototype.configure=function(cs)
{cs[cs.length]=this;this.m_configs=cs;for(var i=0,l=this.m_protocols.length;i<l;i++)
{var protocolName=this.m_protocols[i];if(GUIAdaptor.m_logger.isTrace())
{GUIAdaptor.m_logger.trace("Configuring protocol "+i+": "+protocolName+" for adaptor "+this.getId());}
this['config'+protocolName].call(this,cs);}
this._configure(cs);}
GUIAdaptor.prototype._configure=function(cs)
{}
GUIAdaptor.prototype.dispose=function()
{for(var i=0,l=this.m_protocols.length;i<l;i++)
{var protocolName=this.m_protocols[i];if(GUIAdaptor.m_logger.isTrace())
{GUIAdaptor.m_logger.trace("Disposing protocol "+i+": "+protocolName+" for adaptor "+this.getId());}
this['dispose'+protocolName].call(this,this.m_configs);}
this._dispose();this.m_parentContainer=null;}
GUIAdaptor.prototype._dispose=function()
{if(GUIAdaptor.m_logger.isError())GUIAdaptor.m_logger.error("GUIAdaptor:_dispose(): _dispose() not overridden for adaptor with id: "+this.getId());}
GUIAdaptor.prototype.getConfigs=function()
{return this.m_configs;}
GUIAdaptor.prototype.addConfig=function(config)
{this.m_configs[this.m_configs.length]=config;}
GUIAdaptor.prototype.hasConfiguredProperty=function(propName)
{var ret=false;var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i][propName])
{ret=true;break;}}
return ret;}
GUIAdaptor.prototype.m_parentContainer=null;GUIAdaptor.prototype.setParentContainer=function(parentContainer)
{if(parentContainer!=null)
{if(GUIAdaptor.m_logger.isDebug())GUIAdaptor.m_logger.debug(this.getId()+":GUIAdaptor.setParentContainer() parent container adaptor id="+parentContainer.getId());this.m_parentContainer=parentContainer;parentContainer.addContainedChild(this);}
else
{if(GUIAdaptor.m_logger.isDebug())GUIAdaptor.m_logger.debug(this.getId()+":GUIAdaptor.setParentContainer() parent container  = null");}}
GUIAdaptor.prototype.getParentContainer=function()
{return this.m_parentContainer;}
GUIAdaptor.prototype.m_containedChildren=null;GUIAdaptor.prototype.getContainedChildren=function()
{return[];}
GUIAdaptor.prototype.addContainedChild=function(childAdaptor)
{if(GUIAdaptor.m_logger.isError())GUIAdaptor.m_logger.error(this.getId()+":GUIAdaptor.addContainedChild() method is only valid for container adaptors");}
GUIAdaptor.prototype.isChildOf=function(a)
{var currentAdaptor=a;var currentParent=this.getParentContainer();while(null!=currentParent)
{if(a==currentParent)
{return true;}
currentParent=currentParent.getParentContainer();}
return false;}
GUIAdaptor._addProtocol=function(c,p)
{var cproto=window[c].prototype;var pproto=window[p].prototype;for(var i in pproto)
{cproto[i]=pproto[i];}
var ps=window[c].prototype.m_protocols;ps[ps.length]=p;if(cproto['initialise'+p])
{cproto.m_initialiseList.push('initialise'+p);}
cproto.m_initialiseList.sort(GUIAdaptor.protocolOrderComparator);if(cproto['getListenersFor'+p])
{cproto.m_listeningProtocols.push(p);}}
GUIAdaptor.protocolOrderComparator=function(p1,p2)
{if(p1=="initialiseDataBindingProtocol")
{return-1;}
else if(p2=="initialiseDataBindingProtocol")
{return 1;}
else if(p1=="initialiseLogicProtocol")
{return 1;}
else if(p2=="initialiseLogicProtocol")
{return-1;}
else if(p1=="initialiseListSrcDataProtocol")
{return-1;}
else if(p2=="initialiseListSrcDataProtocol")
{return 1;}
return-1;}
GUIAdaptor._setUpProtocols=function(c)
{window[c].prototype.m_protocols=window[c].prototype.m_protocols.slice(0);if(window[c].prototype.m_initialiseList)
{window[c].prototype.m_initialiseList=window[c].prototype.m_initialiseList.slice(0);}
else
{window[c].prototype.m_initialiseList=new Array();}
if(window[c].prototype.m_listeningProtocols)
{window[c].prototype.m_listeningProtocols=window[c].prototype.m_listeningProtocols.slice(0);}
else
{window[c].prototype.m_listeningProtocols=new Array();}}
GUIAdaptor.prototype.supportsProtocol=function(protocolName)
{return this['config'+protocolName]!=null;}
function GUIAdaptorRegistration()
{}
GUIAdaptorRegistration.m_logger=new Category("GUIAdaptorRegistration");GUIAdaptorRegistration.prototype.m_className=null;GUIAdaptorRegistration.prototype.m_factory
GUIAdaptorRegistration.create=function(className,factory)
{if(GUIAdaptorRegistration.m_logger.isInfo())GUIAdaptorRegistration.m_logger.info("GUIAdaptorRegistration.create(className: "+className+", factory: "+factory+")");var r=new GUIAdaptorRegistration();r.m_className=className;r.m_factory=factory;return r;}
GUIAdaptorRegistration.prototype.getClassName=function()
{return this.m_className;}
GUIAdaptorRegistration.prototype.getFactory=function()
{return this.m_factory;}
GUIAdaptorRegistration.prototype.toString=function()
{return"[GUIAdaptorRegistration className: "+this.m_className+", factory: "+this.m_factory+"]";}
GUIAdaptorRegistration.prototype.dispose=function()
{this.m_className=null;this.m_factory=null;}
function ConfigManager()
{}
ConfigManager.m_logger=new Category("ConfigManager");ConfigManager.prototype.getConfig=function(id)
{var co=window[id];var cs=null==co?[]:[co];if(ConfigManager.m_logger.isInfo())ConfigManager.m_logger.info("ConfigManager.getConfig("+id+") cs = "+cs);return cs;}
ConfigManager.prototype.setConfig=function(id,config)
{window[id]=config;}
ConfigManager.prototype.removeConfig=function(id)
{var config=window[id];if(null!=config)
{for(var i in config)
{delete config[i];}
config=null;}}
function GUIUtils(){}
GUIUtils.INVALID_CSS_CLASS_NAME="invalid";GUIUtils.MANDATORY_CSS_CLASS="mandatory";GUIUtils.READONLY_CSS_CLASS="readOnly";function renderStateChanged(adaptor,oldRenderState)
{var renderState=true;if(adaptor.supportsProtocol("EnablementProtocol")&&!adaptor.getEnabled())
{renderState=false;}
if(adaptor.supportsProtocol("ActiveProtocol")&&!adaptor.isActive())
{renderState=false;}
if(renderState!=oldRenderState)
{return true;}
return false;}
GUIUtils.getDocumentHeadElement=function(d)
{var headElement=null;var headElements=d.getElementsByTagName("HEAD")
if(0==headElements.length)
{var htmlElement=d.getElementsByTagName("HTML");if(null==htmlElement)throw new Error("Unable to locate HTML element in document",null);headElement=d.createElement("HEAD");htmlElement.appendChild(headElement);}
else
{headElement=headElements[0];}
return headElement;}
GUIUtils.createStyleLinkElement=function(headElement,url,id)
{var d=headElement.ownerDocument;var link=d.createElement("LINK");if(null!=id&&""!=id)
{link.setAttribute("id",StyleManager.FRAMEWORK_STYLESHEET_ID);}
link.setAttribute("rel","stylesheet");link.setAttribute("type","text/css");link.setAttribute("title",StyleManager.FRAMEWORK_STYLESHEET_TITLE);link.setAttribute("href",url);headElement.appendChild(link);return link;}
function SUPSEvent()
{}
SUPSEvent.m_logger=new Category("SUPSEvent");SUPSEvent.addEventHandler=function(element,eventName,action,capture)
{if(element.attachEvent)
{element.attachEvent("on"+eventName,action);}
else if(element.addEventListener)
{element.addEventListener(eventName,action,null!=capture?capture:false);}
else
{fc_assertAlways("Cannot add event handler. Browser not IE or W3C compliant?");}
var obj=new Object();obj.m_element=element;obj.m_eventName=eventName;obj.m_action=action;obj.m_capture=capture;return obj;}
SUPSEvent.removeEventHandler=function(element,eventName,action,capture)
{if(element.detachEvent)
{element.detachEvent("on"+eventName,action);}
else if(element.removeEventListener)
{element.removeEventListener(eventName,action,null!=capture?capture:false);}
else
{fc_assertAlways("Cannot remove event handler. Browser not IE or W3C compliant?");}}
SUPSEvent.removeEventHandlerKey=function(key)
{if(key!=null)
{SUPSEvent.removeEventHandler(key.m_element,key.m_eventName,key.m_action,key.m_capture);key.m_element=null;key=null;}
else
{if(SUPSEvent.m_logger.isWarn())SUPSEvent.m_logger.warn("SUPSEvent.removeEventHandlerKey(key), key is null!");}}
SUPSEvent.stopPropagation=function(evt)
{if(evt.stopPropagation!=null)
{evt.stopPropagation();}
evt.cancelBubble=true;}
SUPSEvent.preventDefault=function(evt)
{if(evt.preventDefault)
{evt.preventDefault();}
evt.returnValue=false;}
SUPSEvent.getTargetElement=function(evt)
{var target=null;if(evt.target!=undefined)
{target=evt.target;}
else if(evt.srcElement!=undefined)
{target=evt.srcElement;}
else
{fc_assertAlways("Unknown browser");}
return target;}
SUPSEvent.getRelatedElement=function(evt)
{var e=null;if(evt.relatedTarget!==undefined)
{e=evt.relatedTarget;}
else if(evt.toElement!==undefined)
{e=evt.toElement;}
else
{fc_assertAlways("Unknown browser");}
return e;}
SUPSEvent.getPageX=function(e)
{if(e.pageX!=null)
{return e.pageX;}
else if(e.clientX!=null)
{return e.clientX;}
else
{fc_assertAlways("Unknown browser");}}
SUPSEvent.getPageY=function(e)
{if(e.pageY!=null)
{return e.pageY;}
else if(e.clientY!=null)
{return e.clientY;}
else
{fc_assertAlways("Unknown browser");}}
function HTMLView()
{}
HTMLView.m_logger=new Category("HTMLView");HTMLView.isIE=(document.attachEvent!=null);HTMLView.preventBubblingHandler=function()
{return false;}
HTMLView.blockEventsForDocument=function(d)
{d.onhelp=HTMLView.preventBubblingHandler;d.oncontextmenu=HTMLView.preventBubblingHandler;if(HTMLView.isIE)
{d.onkeydown=HTMLView._blockEvents;}
else
{d.onkeypress=HTMLView._blockEvents;}}
HTMLView.unblockEventsForDocument=function(d)
{d.onhelp=null;d.oncontextmenu=null;if(HTMLView.isIE)
{d.onkeydown=null;}
else
{d.onkeypress=null;}}
HTMLView.blockEventsForProgress=function(e)
{e.onhelp=HTMLView.preventBubblingHandler;e.oncontextmenu=HTMLView.preventBubblingHandler;e.onclick=HTMLView.preventBubblingHandler;if(HTMLView.isIE)
{e.onkeydown=HTMLView._blockProgressEvents;}
else
{e.onkeypress=HTMLView._blockProgressEvents;}}
HTMLView.unblockEventsForProgress=function(e)
{e.onclick=null;HTMLView.unblockEventsForDocument(e);}
HTMLView._blockProgressEvents=function(evt)
{if(null==evt){evt=window.event;}
if(null!=evt)
{SUPSEvent.stopPropagation(evt);SUPSEvent.preventDefault(evt);if(HTMLView.isIE&&!evt.altKey){try
{evt.keyCode=0;}
catch(e)
{}}}
return false;}
HTMLView.checkForEventHandlers=function()
{var events=["onabort","onblur","onchange","oncontextmenu","onclick","ondblclick","onerror","onfocus","onkeydown","onkeyup","onkeypress","onload","onmousedown","onmousemove","onmouseout","onmouseover","onmouseenter","onmouseleave","onreset","onresize","onselect","onselectstart","onselectend","onscroll","onsubmit","onunload"];var unfreedHandlers=new Array();HTMLView._checkElementsForEventHandlers(document.documentElement,events,unfreedHandlers);if(unfreedHandlers.length>0)
{var msg="Unfreed event handlers detected:\n";for(var i=0,l=unfreedHandlers.length;i<l;i++)
{var unfreedHandler=unfreedHandlers[i];var element=unfreedHandler.element;var event=unfreedHandler.event;msg+="Unfreed handler: '"+event+"' on element (nodeName: '"+element.nodeName+"' id: '"+element.id+"' class: '"+element.className+"')\n";}
alert(msg);}}
HTMLView._checkElementsForEventHandlers=function(e,events,unfreedHandlers)
{HTMLView._checkElementForEventHandlers(e,events,unfreedHandlers);for(var i=0,l=e.childNodes.length;i<l;i++)
{HTMLView._checkElementsForEventHandlers(e.childNodes[i],events,unfreedHandlers);}}
HTMLView._checkElementForEventHandlers=function(e,events,unfreedHandlers)
{for(var i=0,l=events.length;i<l;i++)
{var event=events[i];if(HTMLView.m_logger.isDebug())HTMLView.m_logger.debug("Checking for event handler: "+event+" value is: "+e[event]);if(e[event]!=null)
{if(HTMLView.m_logger.isWarn())HTMLView.m_logger.warn("Unfreed "+event+" event handler detected");unfreedHandlers.push({element:e,event:event});}}}
HTMLView._blockEvents=function(evt)
{if(null==evt){evt=window.event;}
if(null!=evt)
{var cancelKeyPress=false;var doc=window.document;if(null==doc.framework_expando_progressBarVisible)
{var ac=Services.getAppController();if(null!=ac)
{if(ac.isProgressBarVisible())
{cancelKeyPress=true;}}}
else
{if(doc.framework_expando_progressBarVisible!=false)
{cancelKeyPress=true;}
doc.framework_expando_progressBarVisible=null;}
if(cancelKeyPress)
{return HTMLView._cancelKeyPress(evt);}
else
{var keyCode=(HTMLView.isIE||evt.altKey)?evt.keyCode:evt.which;if(HTMLView.m_logger.isDebug())HTMLView.m_logger.debug("Key pressed: "+String.fromCharCode(keyCode)+" Key code: "+keyCode+" Ctrl key: "+evt.ctrlKey+" Alt key: "+evt.altKey+" Shift key: "+evt.shiftKey);var target=SUPSEvent.getTargetElement(evt);if((keyCode==Key.Backspace.m_keyCode&&!HTMLView._canAcceptBackspaceKeyEvents(target))||HTMLView._isFunctionKey(evt.keyCode)||Key.ESC.m_keyCode==keyCode||evt.ctrlKey&&!(Key.CHAR_X.m_keyCode==keyCode||Key.CHAR_x.m_keyCode==keyCode||Key.CHAR_C.m_keyCode==keyCode||Key.CHAR_c.m_keyCode==keyCode||Key.CHAR_V.m_keyCode==keyCode||Key.CHAR_v.m_keyCode==keyCode||Key.CHAR_A.m_keyCode==keyCode||Key.CHAR_a.m_keyCode==keyCode||Key.CHAR_Z.m_keyCode==keyCode||Key.CHAR_z.m_keyCode==keyCode||Key.CHAR_Y.m_keyCode==keyCode||Key.CHAR_y.m_keyCode==keyCode||Key.Home.m_keyCode==keyCode||Key.End.m_keyCode==keyCode)||evt.altKey)
{if(HTMLView.m_logger.isDebug())HTMLView.m_logger.debug("Cancelling key: "+keyCode+" Ctrl key: "+evt.ctrlKey+" Alt key: "+evt.altKey+" Shift key: "+evt.shiftKey);return HTMLView._cancelKeyPress(evt);}}}
return true;}
HTMLView._canAcceptBackspaceKeyEvents=function(e)
{return((e.nodeName=="TEXTAREA"&&!e.readOnly)||(e.nodeName=="INPUT"&&(e.type=="text"||e.type=="password")&&!e.readOnly));}
HTMLView._isFunctionKey=function(keyCode)
{return(keyCode>=Key.F1.m_keyCode&&keyCode<=Key.F12.m_keyCode)?true:false;}
HTMLView._cancelKeyPress=function(evt)
{SUPSEvent.stopPropagation(evt);SUPSEvent.preventDefault(evt);if(HTMLView.isIE&&!evt.altKey)
{try
{evt.keyCode=0;}
catch(e)
{}}
return false;}
function EventBinding(id)
{this.m_id=id;};EventBinding.m_logger=new Category("EventBinding");EventBinding.prototype.m_protocols=new Array();GUIAdaptor._setUpProtocols('EventBinding');GUIAdaptor._addProtocol('EventBinding','EnablementProtocol');EventBinding.prototype.m_keyAdaptors=null;EventBinding.prototype.m_singleClickAdaptors=null;EventBinding.prototype.m_doubleClickAdaptors=null;EventBinding.prototype.m_started=false;EventBinding.prototype.m_config=null;EventBinding.prototype.m_eventHandler=null;EventBinding.prototype.getId=function()
{return this.m_id;}
EventBinding.prototype.getConfigs=function()
{var cs=new Array();if(null!=this.m_config)
{cs[cs.length]=this.m_config;}
return cs;}
EventBinding.prototype.configure=function(config)
{this.m_config=config;var protocolName;var cs=this.getConfigs();for(var i=0,l=this.m_protocols.length;i<l;i++)
{protocolName=this.m_protocols[i];if(EventBinding.m_logger.isTrace())
{EventBinding.m_logger.trace("Configuring protocol "+
i+": "+
protocolName+" for event binding.");}
this['config'+protocolName].call(this,cs);}}
EventBinding.prototype.bind=function(callback)
{var config=this.m_config;this.m_keyAdaptors=this._locateAdaptors(config.keys);this.m_singleClickAdaptors=this._locateAdaptors(config.singleClicks);this.m_doubleClickAdaptors=this._locateAdaptors(config.doubleClicks);this.m_callback=callback;this.m_started=false;}
EventBinding.prototype.dispose=function()
{this.stop();var protocolName;var cs=this.getConfigs();for(var i=0,l=this.m_protocols.length;i<l;i++)
{protocolName=this.m_protocols[i];if(EventBinding.m_logger.isTrace())
{EventBinding.m_logger.trace("Disposing protocol "+
i+": "+
protocolName+" for event binding.");}
this['dispose'+protocolName].call(this,cs);}}
EventBinding.prototype.start=function()
{fc_assert(this.m_callback,"Must bind EventBinding");var fc=FormController.getInstance();if(false==this.m_started)
{this.m_started=true;var thisObj=this;this.m_eventHandler=function(){return thisObj._handleEvent()};var iBindingPos=0;this.m_keyBindings=new Array();var keys=this.m_config.keys;if(null!=keys)
{var qualifiers=null;var propagate;for(var i=0,l=keys.length;i<l;i++)
{var key=keys[i];var adaptor=fc.getAdaptorById(key.element);if(adaptor.supportsProtocol("KeybindingProtocol"))
{this.m_keyBindings[i]=new ElementKeyBindings(this.m_keyAdaptors[i]);if(key.ctrl==true||key.alt==true||key.shift==true)
{qualifiers=new Object();qualifiers.ctrl=key.ctrl;qualifiers.alt=key.alt;qualifiers.shift=key.shift;}
propagate=(key.propagate==true)?true:false;this.m_keyBindings[i].bindKey(keys[i].key,this.m_eventHandler,qualifiers,propagate);if(adaptor.m_keys!=null)
{var keyCodeString=''+keys[i].key.m_keyCode;keyCodeString+=ElementKeyBindings.getQualifiersSuffix(key);if(null==adaptor.m_keys.m_keys[keyCodeString])
{adaptor.bindKey(keys[i].key,this.m_eventHandler,qualifiers,propagate);}}
else
{adaptor.m_keys=this.m_keyBindings[i];}
if(null!=qualifiers)qualifiers=null;}
else
{if(EventBinding.m_logger.isError())EventBinding.m_logger.error("Adaptor does not support keybinding: "+adaptor.getId());}}}
this.m_SClickBindings=new Array();for(var i=0;i<this.m_singleClickAdaptors.length;i++)
{this.m_SClickBindings[i]=SUPSEvent.addEventHandler(this.m_singleClickAdaptors[i].getElement(),'click',this.m_eventHandler);}
this.m_DClickBindings=new Array();for(var i=0;i<this.m_doubleClickAdaptors.length;i++)
{if(!GridGUIAdaptor.isGridAdaptor(this.m_doubleClickAdaptors[i]))
{this.m_DClickBindings[iBindingPos]=SUPSEvent.addEventHandler(this.m_doubleClickAdaptors[i].getElement(),'dblclick',this.m_eventHandler);iBindingPos++;}
else
{this.m_doubleClickAdaptors[i].addDblclickListener(this.m_eventHandler);}}}}
EventBinding.prototype.stop=function()
{if(true==this.m_started)
{this.m_started=false;var iBindingPos=0;for(var i=0,l=this.m_keyBindings.length;i<l;i++)
{this.m_keyBindings[i].dispose();}
for(var i=0,l=this.m_SClickBindings.length;i<l;i++)
{SUPSEvent.removeEventHandlerKey(this.m_SClickBindings[i]);this.m_SClickBindings[i]=null;}
for(var i=0,l=this.m_doubleClickAdaptors.length;i<l;i++)
{if(!GridGUIAdaptor.isGridAdaptor(this.m_doubleClickAdaptors[i]))
{SUPSEvent.removeEventHandlerKey(this.m_DClickBindings[iBindingPos]);this.m_DClickBindings[iBindingPos]=null;iBindingPos++;}
else
{this.m_doubleClickAdaptors[i].removeDblclickListener(this.m_eventHandler);}}
this.m_eventHandler=null;}}
EventBinding.prototype._locateAdaptors=function(bindings)
{var fc=FormController.getInstance();var targetAdaptors=new Array();if(bindings!=null)
{if(bindings.length==null)
{throw new ConfigurationException("EventBinding properties must be arrays");}
for(var i=0,l=bindings.length;i<l;i++)
{targetAdaptors[i]=fc.getAdaptorById(bindings[i].element);if(null==targetAdaptors[i])
{throw new ConfigurationException("Invalid element ID in EventBinding binding: "+bindings[i].element);}}}
return targetAdaptors;}
EventBinding.prototype.getSources=function()
{fc_assert(this.m_callback,"Must bind EventBinding");if(null==this.m_sources)
{this.m_sources=new Array();var all=this.m_keyAdaptors.concat(this.m_singleClickAdaptors.concat(this.m_doubleClickAdaptors));all.sort(function(a,b){return String.strcmp(a.m_element.id,b.m_element.id);});var last=null;while(all.length>0)
{var candidate=all.pop();if(last!=candidate.m_element.id)
{last=candidate.m_element.id;this.m_sources.push(candidate);}}}
return this.m_sources;}
EventBinding.prototype._handleEvent=function()
{if(this.getEnabled()==true)
{this.m_callback.call();}}
EventBinding.prototype.getListeners=function()
{var listenersForProtocol;var index=0;var allListeners=new Array();for(var i=0,l1=this.m_listeningProtocols.length;i<l1;i++)
{listenersForProtocol=this['getListenersFor'+this.m_listeningProtocols[i]].call(this);for(var j=0,l2=listenersForProtocol.length;j<l2;j++)
{allListeners[index]=listenersForProtocol[j];index++;}
listenersForProtocol=null;}
return allListeners;}
EventBinding.prototype.initialiseStates=function(e)
{Services.startTransaction();for(var i=0,l=this.m_initialiseList.length;i<l;i++)
{this[this.m_initialiseList[i]].call(this,e);}
Services.endTransaction();}
EventBinding.prototype.hasConfiguredProperty=function(propName)
{var ret=false;var cs=this.getConfigs();for(var i=0,l=cs.length;i<l;i++)
{if(null!=cs[i][propName])
{ret=true;break;}}
return ret;}
EventBinding.prototype.changeAdaptorState=function(event)
{}
EventBinding.prototype.renderState=function()
{}
if(window.addEventListener!=null)
{HTMLElement.prototype.contains=function(oEl)
{if(oEl==this)return true;if(oEl==null)return false;return this.contains(oEl.parentNode);};HTMLElement.prototype.__defineGetter__("innerText",function()
{HTMLElement.getInnerText(this);});HTMLElement.prototype.__defineSetter__("innerText",function(sText)
{this.innerHTML=sText.replace(/\&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");});HTMLElement.getInnerText=function(e)
{var result="";var kids=e.childNodes;for(var i=0,l=kids.length;i<l;i++)
{var kid=kids[i];switch(kid.nodeType)
{case 1:{if("BR"==kid.nodeName)
{result+="\n";}
break;}
case 3:{result+=kid.nodeValue;}}}
return result;}}
function StyleManager()
{}
StyleManager.m_logger=new Category("StyleManager");StyleManager.FRAMEWORK_STYLESHEET_TITLE="Default";StyleManager.FRAMEWORK_STYLESHEET_ID="FW_StyleSheet";StyleManager.prototype.m_config=null;StyleManager.prototype.m_currentStyle="default";StyleManager.prototype.m_documents=null;StyleManager.prototype.m_onLoadCallbackLists=null;StyleManager.prototype.setConfiguration=function(config)
{this.m_config=config;this.m_currentStyle=config.getDefaultStyleSheetName();this.m_documents=new Array();this.m_onLoadCallbackLists=[];}
StyleManager.prototype.dispose=function()
{for(var i=0;i<this.m_onLoadCallbackLists.length;i++)
{var callBackListEntry=this.m_onLoadCallbackLists[i];callBackListEntry.document=null;callBackListEntry.callbackList.dispose();callBackListEntry.callbackList=null;}
this.m_onLoadCallbackLists=null;for(var i=0;i<this.m_documents.length;i++)
{this.m_documents[i].dispose();}
this.m_documents=null;}
StyleManager.prototype.registerOnLoadHandler=function(callbackListMethod,doc)
{var cbListEntry=null;for(var i=0,l=this.m_onLoadCallbackLists.length;i<l;i++)
{var cble=this.m_onLoadCallbackLists[i];if(cble.document==doc)
{cbListEntry=cble;break;}}
if(null==cbListEntry)
{var cbListEntry={document:doc,callbackList:new CallbackList()};this.m_onLoadCallbackLists.push(cbListEntry);}
cbListEntry.callbackList.addCallback(callbackListMethod);}
StyleManager.prototype.unregisterOnLoadHandler=function(callbackListMethod,doc)
{var cbListEntry=null;for(var i=0,l=this.m_onLoadCallbackLists.length;i<l;i++)
{var cble=this.m_onLoadCallbackLists[i];if(cble.document==doc)
{cbListEntry=cble;break;}}
if(null!=cbListEntry)
{cbListEntry.callbackList.removeCallback(callbackListMethod);}}
StyleManager.prototype._handleCSSLoaded=function(docEntry)
{var doc=docEntry.m_document;for(var i=0,l=this.m_onLoadCallbackLists.length;i<l;i++)
{var cble=this.m_onLoadCallbackLists[i];if(cble.document==doc)
{cble.callbackList.invoke();break;}}}
StyleManager.prototype.setStyle=function(name)
{if(name==null)
{name="default";}
var found=true;if(this.m_currentStyle!=name)
{this.m_currentStyle=name;found=false;var availableStyles=this.getAvailableStyles();for(var i=0,l=availableStyles.length;i<l;i++)
{if(availableStyles[i].getName()==name)
{found=true;break;}}
if(found)
{for(var i=0,l=this.m_documents.length;i<l;i++)
{this.m_documents[i].applyStyleSheets(this.m_currentStyle);}}}
return found;}
StyleManager.prototype.getCurrentStyle=function()
{return this.m_currentStyle;}
StyleManager.prototype.getAvailableStyles=function()
{return this.m_config.getAvailableStyleSheets();}
StyleManager.prototype.registerDocument=function(doc,styleSheets)
{var docEntry=this.getDocumentEntry(doc);if(null!=docEntry)
{if(StyleManager.m_logger.isWarn())StyleManager.m_logger.warn("StyleManager.registerDocument(): Adding duplicate document with url: "+doc.URL);}
else
{if(StyleManager.m_logger.isDebug())StyleManager.m_logger.debug("StyleManager.registerDocument(): Adding document with url: "+doc.URL);var ac=Services.getAppController();var rootURL=ac.m_config.m_appBaseURL;var ss=[AppCSS.create(rootURL+"/fw_",true,true)];if(null!=styleSheets)
{ss=ss.concat(styleSheets);}
var docEntry=new StyleManagerDocEntry(this,doc,ss);this.m_documents.push(docEntry);docEntry.applyStyleSheets(this.m_currentStyle);}
if(StyleManager.m_logger.isDebug())
{this._logRegisteredDocuments();}}
StyleManager.prototype.unregisterDocument=function(doc)
{var isIE=(navigator.appName=="Microsoft Internet Explorer");var newArray=new Array();var count=0;for(var i=0,l=this.m_documents.length;i<l;i++)
{if(this.m_documents[i].m_document!=doc)
{newArray[count++]=this.m_documents[i];}
else
{this.m_documents[i].dispose();}}
this.m_documents=newArray;if(StyleManager.m_logger.isDebug())
{this._logRegisteredDocuments();}}
StyleManager.prototype._logRegisteredDocuments=function()
{for(var i=0,l=this.m_documents.length;i<l;i++)
{var d=this.m_documents[i].m_document;StyleManager.m_logger.debug("StyleManager._logRegisteredDocuments(): Have document: "+(i+1)+" of "+l);StyleManager.m_logger.debug("StyleManager._logRegisteredDocuments(): Have registered document with URL: "+null==d.URL?"null":d.URL);}}
StyleManager.prototype.getDocumentEntry=function(document)
{var docEntry=null;for(var i=0,l=this.m_documents.length;i<l;i++)
{if(this.m_documents[i].m_document==document)
{docEntry=this.m_documents[i];break;}}
return docEntry;}
function StyleManagerDocEntry(manager,doc,cssDefs)
{this.m_manager=manager;this.m_document=doc;this.m_styleSheets=new Array(cssDefs.length);for(var i=0;i<cssDefs.length;i++)
{var cssDef=cssDefs[i];this.m_styleSheets[i]=StyleManagerCSSEntry.create(this,cssDef.getBaseURL(),cssDef.getBrowserDependant(),cssDef.getColourSchemeDependant());}}
StyleManagerDocEntry.prototype.dispose=function()
{for(var i=0,l=this.m_styleSheets.length;i<l;i++)
{this.m_styleSheets[i].dispose();}}
StyleManagerDocEntry.prototype.handleStyleSheetLoaded=function(cssEntry)
{var allLoaded=true;for(var i=0,l=this.m_styleSheets.length;i<l;i++)
{var ss=this.m_styleSheets[i];if(ss==cssEntry)
{ss.loaded=true;}
if(true!==ss.loaded)
{allLoaded=false;}}
if(allLoaded)
{this.m_manager._handleCSSLoaded(this);}}
StyleManagerDocEntry.prototype.applyStyleSheets=function(colourScheme)
{for(var i=0,l=this.m_styleSheets.length;i<l;i++)
{var ss=this.m_styleSheets[i];ss.loaded=false;}
for(var i=0,l=this.m_styleSheets.length;i<l;i++)
{var ss=this.m_styleSheets[i];ss.applyStyleSheet(colourScheme);}}
function StyleManagerCSSEntry()
{}
StyleManagerCSSEntry.m_logger=new Category("StyleManagerCSSEntry");StyleManagerCSSEntry.prototype.m_baseURL=null;StyleManagerCSSEntry.prototype.m_browserDependant=false;StyleManagerCSSEntry.prototype.m_colourSchemeDependant=true;StyleManagerCSSEntry.prototype.m_linkElement=null;StyleManagerCSSEntry.prototype.m_onLoadHandlerKey=null;StyleManagerCSSEntry.create=function(docEntry,baseURL,browserDependant,colourSchemeDependant)
{var css=new StyleManagerCSSEntry();css.m_docEntry=docEntry;css.m_baseURL=baseURL;css.m_browserDependant=browserDependant;css.m_colourSchemeDependant=colourSchemeDependant;return css;}
StyleManagerCSSEntry.prototype.dispose=function()
{if(null!=this.m_onLoadHandlerKey)
{SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);this.m_onLoadHandlerKey=null;}}
StyleManagerCSSEntry.prototype._getURL=function(colourScheme)
{var styleSheetURL=this.m_baseURL;if(this.m_browserDependant)
{var isIE=(navigator.appName=="Microsoft Internet Explorer");var styleSheetURL=styleSheetURL+(isIE?"IE":"Moz");}
if(this.m_colourSchemeDependant&&colourScheme!=null)
{styleSheetURL+=("_"+colourScheme);}
styleSheetURL+=".css";return styleSheetURL;}
StyleManagerCSSEntry.prototype.isColourSchemeDependant=function()
{return this.m_colourSchemeDependant;}
StyleManagerCSSEntry.prototype.applyStyleSheet=function(colourScheme)
{var d=this.m_docEntry.m_document;var headElement=GUIUtils.getDocumentHeadElement(d);var url=this._getURL(colourScheme);if(null==this.m_linkElement)
{if(StyleManagerCSSEntry.m_logger.isDebug())StyleManagerCSSEntry.m_logger.debug("StyleManager.applyStyleSheet(): Creating new stylesheet link for document with URL: '"+d.URL+"' with href: '"+url+"'");this.m_linkElement=GUIUtils.createStyleLinkElement(headElement,url,null);if(HTMLView.isIE)
{var thisObj=this;this.m_onLoadHandlerKey=SUPSEvent.addEventHandler(this.m_linkElement,"load",function(){thisObj._handleOnLoadEvent();});}}
else
{if(StyleManagerCSSEntry.m_logger.isDebug())StyleManagerCSSEntry.m_logger.debug("StyleManagerCSSEntry.applyStyleSheet(): Updating stylesheet link for document with URL: '"+d.URL+"' with href: '"+url+"'");this.m_linkElement.setAttribute("href",url);}
if(!HTMLView.isIE)
{this._handleOnLoadEvent();}}
StyleManagerCSSEntry.prototype._handleOnLoadEvent=function()
{this.m_docEntry.handleStyleSheetLoaded(this);}
function StyleManagerError(message,rootCause)
{this.message=message;this.m_rootCause=rootCause;this.exceptionHierarchy=new Array('Error','SystemException','StyleManagerError');this.name='StyleManagerError';}
StyleManagerError.prototype=new Error();StyleManagerError.prototype.constructor=StyleManagerError;function ElementKeyBindings(a)
{this.m_adaptor=a;this.m_keys=new Array();this.m_qualifiers=new Array();this.m_stopPropagation=new Array();var thisObj=this;var evtToHdle=ElementKeyBindings.isIE?"keydown":"keypress";var bindingElement=this.getKeyBindingElement(this.m_adaptor);this.evtHdle=SUPSEvent.addEventHandler(bindingElement,evtToHdle,function(evt){thisObj.handleKeyEvent(evt);});}
ElementKeyBindings.m_logger=new Category("ElementKeyBindings");ElementKeyBindings.CTRL_KEY_MASK=1;ElementKeyBindings.ALT_KEY_MASK=2;ElementKeyBindings.SHIFT_KEY_MASK=4;ElementKeyBindings.CTRL_KEY_SUFFIX="_ctrl";ElementKeyBindings.ALT_KEY_SUFFIX="_alt";ElementKeyBindings.SHIFT_KEY_SUFFIX="_shift";ElementKeyBindings.prototype.dispose=function()
{if(this.evtHdle!=null)
{SUPSEvent.removeEventHandlerKey(this.evtHdle);this.evtHdle=null;}
this.m_adaptor=null;this.m_keys=null;this.m_qualifiers=null;this.m_stopPropagation=null;}
ElementKeyBindings.prototype.handleKeyEvent=function(evt)
{if(null==evt)evt=window.event;var ret=true;var progressBarVisible=false;var ac=Services.getAppController();if(null!=ac)
{progressBarVisible=ac.isProgressBarVisible();}
if(!progressBarVisible)
{var kc=(ElementKeyBindings.isIE||Key.isFunctionKey(evt.keyCode))?evt.keyCode:evt.which;var keyCodeString=''+kc;if(ElementKeyBindings.m_logger.isDebug())ElementKeyBindings.m_logger.debug('Handling key event. Adaptor ID: '+this.m_adaptor.getId()+' KeyCode: '+kc);var qualifiers=0;if(evt.ctrlKey)
{qualifiers|=ElementKeyBindings.CTRL_KEY_MASK;keyCodeString+=ElementKeyBindings.CTRL_KEY_SUFFIX;}
if(evt.altKey)
{qualifiers|=ElementKeyBindings.ALT_KEY_MASK;keyCodeString+=ElementKeyBindings.ALT_KEY_SUFFIX;}
if(evt.shiftKey)
{qualifiers|=ElementKeyBindings.SHIFT_KEY_MASK;keyCodeString+=ElementKeyBindings.SHIFT_KEY_SUFFIX;}
if(ElementKeyBindings.m_logger.isDebug())ElementKeyBindings.m_logger.debug("Qualifiers - Ctrl: "+(qualifiers&ElementKeyBindings.CTRL_KEY_MASK)+" Alt: "+(qualifiers&ElementKeyBindings.ALT_KEY_MASK)+" Shift: "+(qualifiers&ElementKeyBindings.SHIFT_KEY_MASK));var handled=this._handleKey(kc,qualifiers);if(handled)
{if(this.m_stopPropagation[keyCodeString])
{ret=ElementKeyBindings.cancelKeyEvent(evt);}
else
{if(null==window.document.framework_expando_progressBarVisible)
{window.document.framework_expando_progressBarVisible=progressBarVisible;}}}
else
{if(null==window.document.framework_expando_progressBarVisible)
{window.document.framework_expando_progressBarVisible=progressBarVisible;}}}
else
{var docExpando=window.document.framework_expando_progressBarVisible;if(docExpando!=false)
{ret=ElementKeyBindings.cancelKeyEvent(evt);}}
return ret;}
ElementKeyBindings.determineBrowser=function()
{switch(navigator.appName)
{case"Netscape":{ElementKeyBindings.isIE=false;ElementKeyBindings.isMoz=true;break;}
case"Microsoft Internet Explorer":{ElementKeyBindings.isIE=true;ElementKeyBindings.isMoz=false;break;}
default:{alert("Unknown browser type");break;}}
return null;}
ElementKeyBindings.forceDetermineBrowser=ElementKeyBindings.determineBrowser();ElementKeyBindings.prototype.bindKey=function(key,action,qualifiers,propagate)
{var keyCodeString=''+key.m_keyCode;if(qualifiers!=null)
{keyCodeString+=ElementKeyBindings.getQualifiersSuffix(qualifiers);}
if(this.m_keys[keyCodeString]!=null)
{if(ElementKeyBindings.m_logger.isWarn())ElementKeyBindings.m_logger.warn('Key with keyCode "'+keyCodeString+'" already bound to HTML element with id: '+this.m_adaptor.getId());}
this.m_keys[keyCodeString]=action;this.m_qualifiers[keyCodeString]=0;if(qualifiers!=null)
{if(qualifiers.ctrl)this.m_qualifiers[keyCodeString]|=ElementKeyBindings.CTRL_KEY_MASK;if(qualifiers.alt)this.m_qualifiers[keyCodeString]|=ElementKeyBindings.ALT_KEY_MASK;if(qualifiers.shift)this.m_qualifiers[keyCodeString]|=ElementKeyBindings.SHIFT_KEY_MASK;}
this.m_stopPropagation[keyCodeString]=!propagate;}
ElementKeyBindings.prototype._handleKey=function(keyCode,qualifiers)
{var keyCodeString=''+keyCode;if(qualifiers!=0)
{if(qualifiers&ElementKeyBindings.CTRL_KEY_MASK)keyCodeString+=ElementKeyBindings.CTRL_KEY_SUFFIX;if(qualifiers&ElementKeyBindings.ALT_KEY_MASK)keyCodeString+=ElementKeyBindings.ALT_KEY_SUFFIX;if(qualifiers&ElementKeyBindings.SHIFT_KEY_MASK)keyCodeString+=ElementKeyBindings.SHIFT_KEY_SUFFIX;}
var action=this.m_keys[keyCodeString];if(action!=null&&this._canAdaptorAcceptKey(this.m_adaptor)&&this.m_qualifiers[keyCodeString]==qualifiers)
{if(ElementKeyBindings.m_logger.isDebug())ElementKeyBindings.m_logger.debug("Calling action for key: "+keyCode);if(this.m_adaptor.update)
{this.m_adaptor.update();}
var currentFocussedAdaptor=FormController.getInstance().getTabbingManager().m_currentFocussedAdaptor;if(currentFocussedAdaptor!=null&&currentFocussedAdaptor.update)
{if(currentFocussedAdaptor.getId()!=this.m_adaptor.getId())
currentFocussedAdaptor.update();}
action.call(this.m_adaptor);return true;}
else
{return false;}}
ElementKeyBindings.prototype._canAdaptorAcceptKey=function(a)
{var enabled=true;var active=true;if(a.supportsProtocol("EnablementProtocol"))
{enabled=a.getEnabled();}
if(a.supportsProtocol("ActiveProtocol"))
{active=a.isActive();}
return(enabled&&active);}
ElementKeyBindings.prototype.getKeyBindingElement=function(adaptor)
{var bindingElement=adaptor.getElement();if(bindingElement.tagName=='FORM')
{var parent=bindingElement.parentNode;while(null!=parent)
{if(parent.tagName=='BODY')
{bindingElement=parent;break;}
parent=parent.parentNode;}}
return bindingElement;}
ElementKeyBindings.getQualifiersSuffix=function(qualifiers)
{var suffix="";if(qualifiers.ctrl==true)suffix+=ElementKeyBindings.CTRL_KEY_SUFFIX;if(qualifiers.alt==true)suffix+=ElementKeyBindings.ALT_KEY_SUFFIX;if(qualifiers.shift==true)suffix+=ElementKeyBindings.SHIFT_KEY_SUFFIX;return suffix;}
ElementKeyBindings.cancelKeyEvent=function(evt)
{SUPSEvent.stopPropagation(evt);SUPSEvent.preventDefault(evt);try
{if(ElementKeyBindings.isMoz!=true)
{evt.keyCode=0;}}
catch(e)
{}
return false;}
function Key(keyCode)
{this.m_keyCode=keyCode;}
Key.Return=new Key(13);Key.Backspace=new Key(8);Key.Space=new Key(32);Key.ESC=new Key(27);Key.Insert=new Key(45);Key.Delete=new Key(46);Key.Home=new Key(36);Key.End=new Key(35);Key.PageUp=new Key(33);Key.PageDown=new Key(34);Key.Tab=new Key(9);Key.ScrollLock=new Key(145);Key.PrintScreen=new Key(44);Key.NumLock=new Key(144);Key.Menu=new Key(93);Key.Windows=new Key(91);Key.ArrowLeft=new Key(37);Key.ArrowUp=new Key(38);Key.ArrowRight=new Key(39);Key.ArrowDown=new Key(40);Key.NP0=new Key(96);Key.NP1=new Key(97);Key.NP2=new Key(98);Key.NP3=new Key(99);Key.NP4=new Key(100);Key.NP5=new Key(101);Key.NP6=new Key(102);Key.NP7=new Key(103);Key.NP8=new Key(104);Key.NP9=new Key(105);Key.F1=new Key(112);Key.F2=new Key(113);Key.F3=new Key(114);Key.F4=new Key(115);Key.F5=new Key(116);Key.F6=new Key(117);Key.F7=new Key(118);Key.F8=new Key(119);Key.F9=new Key(120);Key.F10=new Key(121);Key.F11=new Key(122);Key.F12=new Key(123);Key.CHAR_A=new Key(65);Key.CHAR_B=new Key(66);Key.CHAR_C=new Key(67);Key.CHAR_D=new Key(68);Key.CHAR_E=new Key(69);Key.CHAR_F=new Key(70);Key.CHAR_G=new Key(71);Key.CHAR_H=new Key(72);Key.CHAR_I=new Key(73);Key.CHAR_J=new Key(74);Key.CHAR_K=new Key(75);Key.CHAR_L=new Key(76);Key.CHAR_M=new Key(77);Key.CHAR_N=new Key(78);Key.CHAR_O=new Key(79);Key.CHAR_P=new Key(80);Key.CHAR_Q=new Key(81);Key.CHAR_R=new Key(82);Key.CHAR_S=new Key(83);Key.CHAR_T=new Key(84);Key.CHAR_U=new Key(85);Key.CHAR_V=new Key(86);Key.CHAR_W=new Key(87);Key.CHAR_X=new Key(88);Key.CHAR_Y=new Key(89);Key.CHAR_Z=new Key(90);Key.CHAR_a=new Key(97);Key.CHAR_b=new Key(98);Key.CHAR_c=new Key(99);Key.CHAR_d=new Key(100);Key.CHAR_e=new Key(101);Key.CHAR_f=new Key(102);Key.CHAR_g=new Key(103);Key.CHAR_h=new Key(104);Key.CHAR_i=new Key(105);Key.CHAR_j=new Key(106);Key.CHAR_k=new Key(107);Key.CHAR_l=new Key(108);Key.CHAR_m=new Key(109);Key.CHAR_n=new Key(110);Key.CHAR_o=new Key(111);Key.CHAR_p=new Key(112);Key.CHAR_q=new Key(113);Key.CHAR_r=new Key(114);Key.CHAR_s=new Key(115);Key.CHAR_t=new Key(116);Key.CHAR_u=new Key(117);Key.CHAR_v=new Key(118);Key.CHAR_w=new Key(119);Key.CHAR_x=new Key(120);Key.CHAR_y=new Key(121);Key.CHAR_z=new Key(122);Key.isFunctionKey=function(keyCode)
{return(keyCode>=Key.F1.m_keyCode&&keyCode<=Key.F12.m_keyCode)||(keyCode>=Key.ArrowLeft.m_keyCode&&keyCode<=Key.ArrowDown.m_keyCode)?true:false;}
Key.isPrintableKey=function(keyCode)
{return(keyCode>=32&&keyCode<=126)||(keyCode>=128&&keyCode<=255)?true:false;}
Key.isScrollKey=function(keyCode)
{var scrollKey;switch(keyCode)
{case Key.ArrowUp.m_keyCode:case Key.ArrowDown.m_keyCode:case Key.PageUp.m_keyCode:case Key.PageDown.m_keyCode:case Key.Home.m_keyCode:case Key.End.m_keyCode:case Key.Space.m_keyCode:{scrollKey=true;break;}
default:{scrollKey=false;break;}}
return scrollKey;}
if(window.attachEvent)
{PopupHelp.isIE=true;PopupHelp.isMoz=false;}
else if(window.addEventListener)
{PopupHelp.isIE=false;PopupHelp.isMoz=true;}
else
{fc_assertAlways("Unknown browser type");}
function PopupHelp()
{this.m_popup=document.createElement("div");this.m_popup.className='popuphelp';document.body.appendChild(this.m_popup);if(PopupHelp.isIE)
{this.m_iframe=document.createElement("iframe");this.m_iframe.className='popuphelp';this.m_iframe.setAttribute("scrolling","no");this.m_iframe.setAttribute("frameBorder",0);this.m_popup.appendChild(this.m_iframe);this.m_cell=null;}
else
{this.m_iframe=null;}
this.m_timeoutID=null;this.m_eventX=0;this.m_eventY=0;this.m_eventAdaptor=null;this.m_displayDate=null;this.m_showHelp=false;this.m_helpCount=0;this.m_mouseoverHandler=new Array();this.m_mouseoutHandler=new Array();this.m_mousedownHandler=new Array();this.m_mousemoveHandler=new Array();this.m_helpBound=new Array();}
PopupHelp.m_logger=new Category("PopupHelp");PopupHelp.m_instance=null;PopupHelp.TOOLTIP_Y_OFFSET=22;PopupHelp.getInstance=function()
{if(PopupHelp.m_instance==null)
{PopupHelp.m_instance=new PopupHelp();}
return PopupHelp.m_instance;}
PopupHelp.prototype.addToElement=function(a)
{var id=a.getId();if(null!=a.getHelpText()&&true!=this.m_helpBound[id])
{var e=a.getElement();this.m_mouseoverHandler[id]=SUPSEvent.addEventHandler(e,"mouseover",function(evt){PopupHelp.showEvent(a,evt);},null);this.m_mouseoutHandler[id]=SUPSEvent.addEventHandler(e,"mouseout",function(evt){PopupHelp.hideEvent(evt);},null);this.m_mousedownHandler[id]=SUPSEvent.addEventHandler(e,"mousedown",function(evt){PopupHelp.clickEvent(evt);},null);this.m_helpCount++;this.m_helpBound[id]=true;}}
PopupHelp.prototype.removeFromElement=function(a)
{var id=a.getId();if(null!=a.getHelpText()&&true==this.m_helpBound[id])
{if(null!=this.m_mouseoverHandler[id])
{SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler[id]);this.m_mouseoverHandler[id]=null;}
if(null!=this.m_mouseoutHandler[id])
{SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler[id]);this.m_mouseoutHandler[id]=null;}
if(null!=this.m_mousedownHandler[id])
{SUPSEvent.removeEventHandlerKey(this.m_mousedownHandler[id]);this.m_mousedownHandler[id]=null;}
if(null!=this.m_mousemoveHandler[id])
{SUPSEvent.removeEventHandlerKey(this.m_mousemoveHandler[id]);this.m_mousemoveHandler[id]=null;}
this.m_helpCount--;this.m_helpBound[id]=false;if(0==this.m_helpCount&&null!=this.m_iframe)
{Services.getAppController().getStyleManager().unregisterDocument(getIframeDocument(this.m_iframe));}}}
PopupHelp.prototype._createHelpDocument=function()
{var iFrameDoc=getIframeDocument(this.m_iframe);iFrameDoc.open();iFrameDoc.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3c.org/TR/html4/strict.dtd">');iFrameDoc.write('<html><head><title>PopupHelp</title></head><body class="popuphelp"><table><tbody><tr><td id="cell"></td></tr></tbody></table></body></html>');iFrameDoc.close();this.m_cell=iFrameDoc.getElementById("cell");Services.getAppController().getStyleManager().registerDocument(iFrameDoc,null);}
PopupHelp.showEvent=function(a,evt)
{evt=(evt)?evt:((event)?event:null);var srcElement=SUPSEvent.getTargetElement(evt);var element=a.getElement();if(element.contains(srcElement))
{if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.showEvent(): show help event for adaptor: "+a.getId());var popupHelp=PopupHelp.getInstance();if(popupHelp.m_eventAdaptor==null)
{if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.showEvent(): registering timeout for adaptor: "+a.getId());if(popupHelp.m_timeoutID!=null)
{clearTimeout(popupHelp.m_timeoutID);popupHelp.m_timeoutID=null;}
if(popupHelp.m_iframe!=null&&popupHelp.m_cell==null)
{popupHelp._createHelpDocument();}
popupHelp.m_eventX=SUPSEvent.getPageX(evt);popupHelp.m_eventY=SUPSEvent.getPageY(evt);if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.showEvent() - Location x: "+popupHelp.m_eventX+" y: "+popupHelp.m_eventY);popupHelp.m_eventAdaptor=a;var text=a.getHelpText();if(null!=text)
{if(popupHelp.m_cell)
{popupHelp.m_cell.innerHTML=text;}
else
{popupHelp.m_popup.innerHTML=text;}}
popupHelp.m_mousemoveHandler[a.getId()]=SUPSEvent.addEventHandler(element,"mousemove",function(evt){PopupHelp.moveEvent(a,evt);},null);popupHelp.m_timeoutID=setTimeout("PopupHelp.showTrigger()",1000);}}}
PopupHelp.hideEvent=function(evt)
{evt=(evt)?evt:((event)?event:null);var toElement=null!=evt.relatedTarget?evt.relatedTarget:evt.toElement;var popupHelp=PopupHelp.getInstance();if(popupHelp.m_eventAdaptor!=null)
{var processHideEvent=true;if(popupHelp.m_eventAdaptor.getElement().contains(toElement))
{processHideEvent=false;}
if(processHideEvent)
{if(popupHelp.m_timeoutID!=null)
{clearTimeout(popupHelp.m_timeoutID);popupHelp.m_timeoutID=null;}
var id=popupHelp.m_eventAdaptor.getId();if(popupHelp.m_mousemoveHandler[id]!=null)
{SUPSEvent.removeEventHandlerKey(popupHelp.m_mousemoveHandler[id]);popupHelp.m_mousemoveHandler[id]=null;}
popupHelp.m_eventAdaptor=null;popupHelp.m_displayDate=null;if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.hideEvent() - Location x: "+SUPSEvent.getPageX(evt)+" y: "+SUPSEvent.getPageY(evt));popupHelp.hide(true);}}}
PopupHelp.clickEvent=function(evt)
{var popupHelp=PopupHelp.getInstance();if(popupHelp.m_eventAdaptor!=null)
{evt=(evt)?evt:((event)?event:null);var targetElement=SUPSEvent.getTargetElement(evt);if(popupHelp.m_eventAdaptor.getElement().contains(targetElement))
{if(popupHelp.m_timeoutID!=null)
{clearTimeout(popupHelp.m_timeoutID);popupHelp.m_timeoutID=null;}
var id=popupHelp.m_eventAdaptor.getId();if(popupHelp.m_mousemoveHandler[id]!=null)
{SUPSEvent.removeEventHandlerKey(popupHelp.m_mousemoveHandler[id]);popupHelp.m_mousemoveHandler[id]=null;}
popupHelp.hide(true);}}}
PopupHelp.moveEvent=function(a,evt)
{var popupHelp=PopupHelp.getInstance();evt=(evt)?evt:((event)?event:null);popupHelp.m_eventX=SUPSEvent.getPageX(evt);popupHelp.m_eventY=SUPSEvent.getPageY(evt);if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.moveEvent()- Location x: "+popupHelp.m_eventX+" y: "+popupHelp.m_eventY);if(PopupHelp.isIE)
{var pointElement=document.elementFromPoint(popupHelp.m_eventX,popupHelp.m_eventY);if(pointElement!=null)
{if(a.getElement().contains(pointElement)){popupHelp.m_showHelp=true;}
else{popupHelp.m_showHelp=false;}}
else
{popupHelp.m_showHelp=false;}
popupHelp.m_eventX+=document.documentElement.scrollLeft;popupHelp.m_eventY+=document.documentElement.scrollTop;}
else
{popupHelp.m_showHelp=true;}}
PopupHelp.showTrigger=function()
{PopupHelp.getInstance().show();}
PopupHelp.hideTrigger=function()
{var popupHelp=PopupHelp.getInstance();popupHelp.m_timeoutID=null;popupHelp.hide(false);}
PopupHelp.prototype.show=function()
{if(this.m_eventAdaptor!=null&&this.m_showHelp)
{if(PopupHelp.m_logger.isDebug())PopupHelp.m_logger.debug("PopupHelp.show(): showing help for adaptor: "+this.m_eventAdaptor.getId());if(null!=this.m_eventAdaptor.getHelpText())
{if(this.m_iframe!=null)
{var height=this.m_cell.offsetHeight;var width=this.m_cell.offsetWidth;this.m_iframe.style.width=width+2;this.m_iframe.style.height=height+2;}
else
{var height=this.m_popup.offsetHeight;var width=this.m_popup.offsetWidth;}
var xPos=this.m_eventX;var yPos=this.m_eventY;if(PopupHelp.isIE)
{if((typeof this.m_eventAdaptor=="object")&&(this.m_eventAdaptor.constructor==SelectElementGUIAdaptor))
{xPos+=2;yPos+=2;}}
yPos+=PopupHelp.TOOLTIP_Y_OFFSET;var element=this.m_eventAdaptor.getElement();if(null!=element)
{var helpTextOrigin=PopupHelp.checkHelpTextOrigin(element,xPos,yPos,width,height);this.m_popup.style.left=helpTextOrigin.x+"px";this.m_popup.style.top=helpTextOrigin.y+"px";this.m_popup.style.zIndex="10000";this.m_popup.style.visibility="visible";this.m_displayDate=new Date();this.m_popup.m_timeoutID=setTimeout("PopupHelp.hideTrigger()",3000);}}}}
PopupHelp.prototype.hide=function(hideEventOccurred)
{if(hideEventOccurred)
{if(this.m_popup.style.visibility=="visible")
{this.m_popup.style.visibility="hidden";}}
else
{if(this.m_displayDate!=null)
{var currentDate=new Date();var timeExpired=currentDate-this.m_displayDate;if(timeExpired>2750)
{this.m_displayDate=null;if(this.m_popup.style.visibility=="visible")
{this.m_popup.style.visibility="hidden";}}
else
{this.m_timeoutID=setTimeout("PopupHelp.hideTrigger()",500);}}
else
{if(this.m_popup.style.visibility=="visible")
{this.m_popup.style.visibility="hidden";}}}}
PopupHelp.prototype.calculateHelpTextOrigin=function(element)
{var elementPosition=getAbsolutePosition(element);var originLeft=elementPosition.left;var originTop=elementPosition.top-element.offsetHeight;var result=new Object();result.left=originLeft;result.top=originTop;return result;}
PopupHelp.checkHelpTextOrigin=function(element,x,y,helpTextWidth,helpTextHeight)
{var width,height,scrollX,scrollY;if(PopupHelp.isIE)
{var documentElement=element.ownerDocument.documentElement;width=documentElement.clientWidth;height=documentElement.clientHeight;scrollX=documentElement.scrollLeft;scrollY=documentElement.scrollTop;}
else
{width=window.innerWidth;height=window.innerHeight;scrollX=window.scrollX;scrollY=window.scrollY;}
var result=new Object();if(x+helpTextWidth>width+scrollX)
{result.x=x-helpTextWidth;if(result.x<0)
{result.x=0;}}
else
{result.x=x;}
if(y+helpTextHeight>height+scrollY)
{result.y=y-helpTextHeight-PopupHelp.TOOLTIP_Y_OFFSET-10;if(result.y<0)
{result.y=0;}}
else
{result.y=y;}
return result;}
function PopupLayer()
{}
PopupLayer.m_popupCount=0;PopupLayer.m_allSelects=document.getElementsByTagName("SELECT");PopupLayer.prototype.m_popup=null;PopupLayer.prototype.m_hiddenSelects=new Array();PopupLayer.create=function(element)
{var pl=new PopupLayer();pl.m_popup=element;return pl;}
PopupLayer.prototype._dispose=function()
{if(this.m_hiddenSelects!=null)
{for(var i=this.m_hiddenSelects.length-1;i>=0;i--)
{delete this.m_hiddenSelects[i];}
this.m_hiddenSelects=null;}}
PopupLayer.prototype.show=function(hideSelects)
{if(hideSelects==null)hideSelects=true;if(HTMLView.isIE&&hideSelects==true)
{this._hideSelectElements();}
this.m_popup.style.visibility="visible";PopupLayer.m_popupCount++;this.m_popup.style.zIndex=PopupLayer.m_popupCount+2;}
PopupLayer.prototype._hideSelectElements=function()
{var selects=PopupLayer.m_allSelects;var hiddenSelects=new Array();var e=this.m_popup;for(var i=selects.length-1;i>=0;i--)
{var s=selects[i];var selectState=new Object();selectState.element=s;selectState.prevState=s.style.visibility;selectState.prevDisabled=s.disabled;hiddenSelects.push(selectState);if(e.contains(s))
{if(s.style.visibility=="hidden")
{s.style.visibility="visible";}
else
{}}
else
{if(isContained(s,e))
{s.disabled=true;s.style.visibility="hidden";}}
selectState=null;}
this.m_hiddenSelects[PopupLayer.m_popupCount]=hiddenSelects;}
PopupLayer.prototype.hide=function(showSelects)
{if(showSelects==null)showSelects=true;this.m_popup.style.visibility="hidden";this.m_popup.style.zIndex=-1;PopupLayer.m_popupCount--;if(HTMLView.isIE&&showSelects==true)
{this._showSelectElements();}}
PopupLayer.prototype._showSelectElements=function()
{var restoreSelects=this.m_hiddenSelects[PopupLayer.m_popupCount];for(var i=restoreSelects.length-1;i>=0;i--)
{var selectState=restoreSelects[i];selectState.element.style.visibility=selectState.prevState;selectState.element.disabled=selectState.prevDisabled;delete restoreSelects[i];}}
function Renderer()
{}
Renderer.CHILD_ELEMENT=0;Renderer.BEFORE_ELEMENT=1;Renderer.AFTER_ELEMENT=2;Renderer.prototype.m_element=null;Renderer.createAsChild=function(id)
{if(null==id||""==id)
{throw new ConfigurationException("Must supply id to Renderer.createAsChild");}
var e=window.document.createElement("div");e.id=id;return e;}
Renderer.createInline=function(id,focusable)
{if(null==id||""==id)
{throw new ConfigurationException("Must supply id to Renderer.createInline");}
var divHTML="<div id='"+id+"'";if(true==focusable)
{divHTML+=" tabindex='1' hideFocus='true'";}
divHTML+="></div>";var d=window.document;d.write(divHTML);var e=d.getElementById(id);return e;}
Renderer.createAsInnerHTML=function(refElement,relativePos,id,focussable)
{if(null==id||""==id)
{throw new ConfigurationException("Must supply id to Renderer.createInline");}
var wrapper=window.document.createElement("div");var divHTML="<div id='"+id+"'";if(focussable==true)
{divHTML+=" tabindex='1'  hideFocus='true'";}
divHTML+="></div>";wrapper.innerHTML=(divHTML);var innerDiv=wrapper.childNodes[0];wrapper.removeChild(innerDiv);switch(relativePos)
{case Renderer.CHILD_ELEMENT:refElement.appendChild(innerDiv);break;case Renderer.BEFORE_ELEMENT:refElement.parentNode.insertBefore(innerDiv,refElement);break;case Renderer.AFTER_ELEMENT:var nodeAfterElement=refElement.nextSibling;if(null==nodeAfterElement)
{refElement.parentNode.appendChild(innerDiv);}
else
{refElement.parentNode.insertBefore(innerDiv,nodeAfterElement);}
break;default:break;}
return innerDiv;}
Renderer.createElementAsChild=function(p,nodeName)
{var n=window.document.createElement(nodeName);p.appendChild(n);return n;}
Renderer.createAsInnerHtml=function(parent,id,focusable)
{var scriptTag=document.createElement("script");parent.appendChild(scriptTag);var scriptText="Renderer.createDivisionUsingInnerHTML('"+
id+"',this.arguments[0],this.arguments[1]);";var fn=new Function(scriptText);fn.call(fn,scriptTag,focusable);var nodeChild=null;var e=null;var nodeChildren=parent.childNodes;for(var i=0,l=nodeChildren.length;i<l;i++)
{nodeChild=nodeChildren[i];if(nodeChild.id==id)
{e=nodeChild;break;}}
return e;}
Renderer.createDivisionUsingInnerHTML=function(id,scriptTag,focusable)
{var wrapper=document.createElement("div");var divHTML="<div id='"+id+"'";if(true==focusable)
{divHTML+=" tabindex='1' hideFocus='true'";}
divHTML+="></div>";wrapper.innerHTML=(divHTML);var innerDiv=wrapper.childNodes[0];wrapper.removeChild(innerDiv);var nodeAfterScriptTag=scriptTag.nextSibling;if(null==nodeAfterScriptTag)
{scriptTag.parentNode.appendChild(innerDiv);}
else
{scriptTag.parentNode.insertBefore(innerDiv,nodeAfterScriptTag)}}
Renderer.prototype.getElement=function()
{return this.m_element;}
Renderer.prototype._setElement=function(e)
{this.m_element=e;}
Renderer.prototype._initRenderer=function(e)
{this.m_element=e;e.__renderer=this;}
function fwFrameManager()
{}
fwFrameManager.m_logger=new Category("fwFrameManager");fwFrameManager.prototype.m_frame=null;fwFrameManager.prototype.m_url=null;fwFrameManager.prototype.m_loadHandler=null;fwFrameManager.prototype.m_retries;fwFrameManager.MAX_NUMBER_OF_RETRIES=20;fwFrameManager.prototype.m_loadCompleteListeners=null;fwFrameManager.create=function(frame)
{var fm=new fwFrameManager();fm.m_frame=frame;fm.m_loadHandler=SUPSEvent.addEventHandler(frame,'load',function(){fm._loadComplete();});fm.m_loadCompleteListeners=new CallbackList();return fm;}
fwFrameManager.prototype.dispose=function()
{if(null!=this.m_loadHandler)
{SUPSEvent.removeEventHandlerKey(this.m_loadHandler);this.m_loadHandler=null;}
this.m_frame=null;}
fwFrameManager.prototype.addLoadCompleteListener=function(cb)
{this.m_loadCompleteListeners.addCallback(cb);}
fwFrameManager.prototype.removeLoadCompleteListener=function(cb)
{this.m_loadCompleteListeners.removeCallback(cb);}
fwFrameManager.prototype.getFrame=function()
{return this.m_frame;}
fwFrameManager.prototype.load=function(url)
{if(fwFrameManager.m_logger.isDebug())fwFrameManager.m_logger.debug("Starting load of url: '"+url+"'");this.m_retries=0;this.m_url=url;this.m_frame.src=url;}
fwFrameManager.prototype._loadComplete=function()
{var doc=null;if(fwFrameManager.m_logger.isDebug())fwFrameManager.m_logger.debug("Checking ready state of document: '"+this.m_url+"'");try
{doc=this.m_frame.contentWindow.document;if(fwFrameManager.m_logger.isDebug())fwFrameManager.m_logger.debug("Notifying listeners of successful load of url: '"+this.m_url+"'");try
{this.m_loadCompleteListeners.invoke(null);}
catch(innerEx)
{this.m_loadCompleteListeners.invoke(innerEx.message);}}
catch(ex)
{if(this.m_retries<fwFrameManager.MAX_NUMBER_OF_RETRIES)
{if(fwFrameManager.m_logger.isDebug())fwFrameManager.m_logger.debug("Access denied to frames document - will retry: '"+this.m_url+"'");this.m_retries++;var thisObj=this;setTimeout(function(){thisObj._loadComplete();},100);}
else
{if(fwFrameManager.m_logger.isDebug())fwFrameManager.m_logger.debug("Notifying listeners of failure to load url: '"+this.m_url+"'");this.m_loadCompleteListeners.invoke(ex.message);}}}
function HTMLFormView()
{}
HTMLFormView.m_logger=new Category("HTMLFormView");HTMLFormView.prototype=new FormView();HTMLFormView.prototype.constructor=HTMLFormView;HTMLFormView.create=function()
{var fv=new HTMLFormView();fv._initialise();return fv;}
HTMLFormView.prototype._initialise=function()
{HTMLView.blockEventsForDocument(document);this.m_guiAdaptorFactory=new GUIAdaptorFactory();this.m_configManager=new ConfigManager();}
HTMLFormView.prototype.dispose=function()
{HTMLView.unblockEventsForDocument(document);this.m_guiAdaptorFactory.dispose();FormView.prototype.dispose.call(this);}
function HTMLFormViewManager()
{}
HTMLFormViewManager.m_logger=new Category("HTMLFormViewManager");HTMLFormViewManager.prototype.m_viewBound=false;HTMLFormViewManager.prototype.m_viewReadyListeners=null;HTMLFormViewManager.prototype.m_formReadyListeners=null;HTMLFormViewManager.prototype.m_cssDefs=null;HTMLFormViewManager.prototype.m_waitForConfigLoading=null;HTMLFormViewManager.create=function()
{var fv=new HTMLFormViewManager();fv._initialise();return fv;}
HTMLFormViewManager.prototype._initialise=function()
{this.m_viewReadyListeners=new CallbackList();this.m_formReadyListeners=new CallbackList();this.m_waitForConfigLoading=top.AppController.getInstance().getWaitForConfigLoadingMode();}
HTMLFormViewManager.prototype.dispose=function()
{this._unbindView();this.m_waitForConfigLoading=null;}
HTMLFormViewManager.prototype._getWindow=function()
{return window;}
HTMLFormViewManager.prototype._getDocument=function()
{return this._getWindow().document;}
HTMLFormViewManager.prototype.getFormController=function()
{var FCClass=this._getWindow().FormController;return(FCClass!=null)?FCClass.getInstance():null;}
HTMLFormViewManager.prototype.registerViewReadyListener=function(cb)
{this.m_viewReadyListeners.addCallback(cb);}
HTMLFormViewManager.prototype.registerFormReadyListener=function(cb)
{this.m_formReadyListeners.addCallback(cb);}
HTMLFormViewManager.prototype._bindView=function()
{if(!this.m_viewBound)
{var doc=this._getDocument();var sm=Services.getAppController().getStyleManager();this.m_cssLoaded=false;var thisObj=this;this.m_cssListener=function(){thisObj._viewCSSLoaded();};sm.registerOnLoadHandler(this.m_cssListener,doc);sm.registerDocument(doc,this.m_cssDefs);this.m_viewBound=true;}}
HTMLFormViewManager.prototype._unbindView=function()
{if(this.m_viewBound)
{var doc=this._getDocument();var ac=Services.getAppController();ac.m_styleManager.unregisterDocument(doc);this.m_viewBound=false;}}
HTMLFormViewManager.prototype._viewCSSLoaded=function()
{var sm=Services.getAppController().getStyleManager();var doc=this._getDocument();sm.unregisterOnLoadHandler(this.m_cssListener,doc);this.m_cssListener=null;this.m_cssLoaded=true;}
HTMLFormViewManager.prototype._waitForFrameworkToLoad=function()
{var cW=this._getWindow();var waitForConfigLoading=this.m_waitForConfigLoading;if((undefined!==cW.Services)&&(true==cW.Services.frameworkLoaded)&&((waitForConfigLoading==false)||(waitForConfigLoading==true&&cW.Services.formConfigLoaded==true)))
{this._frameworkLoadComplete();}
else
{var thisObj=this;setTimeout(function(){thisObj._waitForFrameworkToLoad();},50);}}
HTMLFormViewManager.prototype._frameworkLoadComplete=function()
{this._bindView();this.m_viewReadyListeners.invoke();}
HTMLFormViewManager.prototype._startFormController=function(initialData,invokingAdaptor,funit)
{var cW=this._getWindow();var thisObj=this;if(funit)
{cW.setTimeout(function(){cW.FormController.setFatalExceptionHandler(function(e){throw e;});cW.FormController.initialise(thisObj,initialData,invokingAdaptor);cW.FUnit.continueTestRun();},0);}
else
{cW.setTimeout(function(){cW.FormController.initialise(thisObj,initialData,invokingAdaptor);},0);}}
HTMLFormViewManager.prototype._disposeFormController=function()
{this.m_formController.dispose();this.m_formController=null;}
HTMLFormViewManager.prototype.setFormController=function(formController)
{this.m_formController=formController;}
HTMLFormViewManager.prototype.formControllerInitialised=function()
{if(this.m_cssLoaded)
{this.m_formReadyListeners.invoke();}
else
{var thisObj=this;setTimeout(function(){thisObj.formControllerInitialised();},50);}}
function HTMLFrameFormViewManager()
{}
HTMLFrameFormViewManager.m_logger=new Category("HTMLFrameFormViewManager");HTMLFrameFormViewManager.prototype=new HTMLFormViewManager();HTMLFrameFormViewManager.prototype.constructor=HTMLFrameFormViewManager;HTMLFrameFormViewManager.prototype.m_frame=null;HTMLFrameFormViewManager.prototype.m_manageLifeCycle=false;HTMLFrameFormViewManager.prototype.m_url=null;HTMLFrameFormViewManager.manageExistingFrame=function(frame)
{var fv=new HTMLFrameFormViewManager();fv.m_frame=fwFrameManager.create(frame);fv.m_manageLifeCycle=false;fv._initialise();return fv;}
HTMLFrameFormViewManager.createManagedIFrame=function(p,className)
{var fv=new HTMLFrameFormViewManager();var className=(className==null?"popupsubformframe":className);p.innerHTML="<iframe width='100%' height='100%' frameborder='0' scrolling='no' class='"+className+"'></iframe>"
fv.m_frame=fwFrameManager.create(p.childNodes[0]);fv.m_manageLifeCycle=true;fv._initialise();return fv;}
HTMLFrameFormViewManager.prototype._initialise=function(frame)
{var thisObj=this;this.m_frame.addLoadCompleteListener(function(errMsg){thisObj._loadViewComplete(errMsg);});HTMLFormViewManager.prototype._initialise.call(this);}
HTMLFrameFormViewManager.prototype.dispose=function()
{HTMLFormViewManager.prototype.dispose.call(this);var frame=this.m_frame.getFrame();this.m_frame.dispose();this.m_frame=null;frame.contentWindow.Logging.destroy();if(this.m_manageLifeCycle)
{frame.parentNode.innerHTML="";}}
HTMLFrameFormViewManager.prototype._getWindow=function()
{return this.m_frame.getFrame().contentWindow;}
HTMLFrameFormViewManager.prototype.loadView=function(url,cssDefs)
{if(null!=this.m_url)
{this._unbindView();if(this.m_formController)
{this._disposeFormController();}}
this.m_frame.getFrame().style.visibility="hidden";this.m_frame.load(url);this.m_url=url;this.m_cssDefs=cssDefs;}
HTMLFrameFormViewManager.prototype._loadViewComplete=function(errorMessage)
{if(null==errorMessage)
{this._waitForFrameworkToLoad();}
else
{if(confirm("Unable to load form.\n\nException was: "+errorMessage+"\n\nPress OK to retry or Cancel to exit application"))
{this._loadView(this.m_url);}
else
{this.m_url=null;Services.getAppController().shutdown();}}}
HTMLFrameFormViewManager.prototype._frameworkLoadComplete=function()
{this.m_frame.getFrame().style.visibility="inherit";HTMLFormViewManager.prototype._frameworkLoadComplete.call(this);}
function HelpProtocolHTMLImpl(){};HelpProtocolHTMLImpl.prototype.bindHelp=function()
{PopupHelp.getInstance().addToElement(this);}
HelpProtocolHTMLImpl.prototype.unbindHelp=function()
{PopupHelp.getInstance().removeFromElement(this);}
HelpProtocolHTMLImpl.prototype.getHelpText=function()
{var text=this.helpText;if(typeof text=="function")text=text.call();return(text);}
HelpProtocolHTMLImpl.prototype.configHelpProtocolHTMLImpl=function()
{}
HelpProtocolHTMLImpl.prototype.disposeHelpProtocolHTMLImpl=function()
{}
function FocusProtocolHTMLImpl(){};FocusProtocolHTMLImpl.prototype.configFocusProtocolHTMLImpl=function()
{}
FocusProtocolHTMLImpl.prototype.disposeFocusProtocolHTMLImpl=function()
{}
FocusProtocolHTMLImpl.prototype.getFocusElement=function()
{return this.getElement();}
function ActiveProtocol()
{}
ActiveProtocol.prototype.m_active=true;ActiveProtocol.prototype.setActive=function(elementActive)
{this.m_active=elementActive;}
ActiveProtocol.prototype.isActive=function()
{return this.m_active;}
ActiveProtocol.prototype.disposeActiveProtocol=function()
{}
ActiveProtocol.prototype.configActiveProtocol=function(cs)
{}
function HTMLElementGUIAdaptor()
{}
HTMLElementGUIAdaptor.prototype=new GUIAdaptor();GUIAdaptor._setUpProtocols("HTMLElementGUIAdaptor");GUIAdaptor._addProtocol('HTMLElementGUIAdaptor','StateChangeEventProtocol');GUIAdaptor._addProtocol('HTMLElementGUIAdaptor','LogicProtocol');GUIAdaptor._addProtocol('HTMLElementGUIAdaptor','ActiveProtocol');HTMLElementGUIAdaptor.prototype.constructor=HTMLElementGUIAdaptor;HTMLElementGUIAdaptor.prototype.m_element=null;HTMLElementGUIAdaptor.prototype.m_renderer=null;HTMLElementGUIAdaptor.prototype._initialiseAdaptor=function(e)
{this.m_element=e;if(null!=e.__renderer)
{this.m_renderer=e.__renderer;this.m_element.__renderer=null;}}
HTMLElementGUIAdaptor.prototype.getId=function()
{return this.m_element.id;}
HTMLElementGUIAdaptor.prototype.getDisplayName=function()
{return(null==this.getName?this.getId():this.getName());}
HTMLElementGUIAdaptor.prototype.getElement=function()
{return this.m_element;}
HTMLElementGUIAdaptor.prototype._getValueFromView=function()
{if(null==this.m_element)
{throw new GUIAdaptorError("HTMLElementGUIAdaptor._getValueFromView(), this.m_element == null");}
if(undefined==this.m_element.value)
{throw new GUIAdaptorError("HTMLElementGUIAdaptor._getValueFromView(id: "+this.getId()+"), this.m_element contains no \'value\' property. The adaptor should override this method.");}
return this.m_element.value;}
HTMLElementGUIAdaptor.prototype.getElementPosition=function()
{if(null!=this.m_position)return this.m_position;var style=this.m_element.style;if(style.position=="absolute")
{return{left:style.left,top:style.top,width:style.width,height:style.height};}
var offsetTrail=this.m_element;var offsetLeft=0;var offsetTop=0;var offsetWidth=offsetTrail.offsetWidth;var offsetHeight=offsetTrail.offsetHeight;while(offsetTrail)
{offsetLeft+=offsetTrail.offsetLeft;offsetTop+=offsetTrail.offsetTop;offsetTrail=offsetTrail.offsetParent;}
this.m_position={left:offsetLeft,top:offsetTop,width:offsetWidth,height:offsetHeight};return this.m_position;}
function fwFormInitDataLoader()
{}
fwFormInitDataLoader.prototype=new fwDataLoader();fwFormInitDataLoader.prototype.constructor=fwFormInitDataLoader;fwFormInitDataLoader.m_logger=new Category("fwFormInitDataLoader");fwFormInitDataLoader.prototype.m_form=null;fwFormInitDataLoader.prototype.m_generateDMEvents=false;fwFormInitDataLoader.prototype._setGenerateDMEvents=function(generateEvents)
{this.m_generateDMEvents=generateEvents;}
fwFormInitDataLoader.prototype.load=function()
{var fc=FormController.getInstance();fc.registerRunningDataService(this.m_config.name);fwDataLoader.prototype.load.call(this);}
fwFormInitDataLoader.prototype._successHandler=function(dom,name)
{var fc=FormController.getInstance();var dm=fc.getDataModel();if(this.m_generateDMEvents)
{dm.addNodeSet(dom,this.m_config.dataBinding);}
else
{dm.addNodeSetWithoutEvents(dom,this.m_config.dataBinding);}
fc.runningDataServiceComplete(this.m_config.name);}
fwFormInitDataLoader.prototype._getResultHandler=function()
{var resultHandler=fwDataLoader.prototype._getResultHandler.call(this);var thisObj=this;resultHandler[fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING]=function(){thisObj._unregisterRunningDataService();};return resultHandler;}
fwFormInitDataLoader.prototype._unregisterRunningDataService=function()
{FormController.getInstance().runningDataServiceComplete(this.m_config.name);}
function fwFormInitModelDataLoader()
{}
fwFormInitModelDataLoader.prototype=new fwFormInitDataLoader()
fwFormInitModelDataLoader.prototype.constructor=fwFormInitModelDataLoader;fwFormInitModelDataLoader.m_logger=new Category("fwFormInitModelDataLoader");fwFormInitModelDataLoader.create=function(config,form,generateEvents)
{var mdl=new fwFormInitModelDataLoader();mdl._setGenerateDMEvents(generateEvents);if(null==config.name)
{config.name="Model data for form "+form.getId();if(fwFormInitModelDataLoader.m_logger.isWarn())fwFormInitModelDataLoader.m_logger.warn("Missing name for model data in form "+form.getId()+", defaulting to "+config.name);}
if(null==config.dataBinding)
{config.dataBinding=form.getModelParentXPath();if(fwFormInitModelDataLoader.m_logger.isWarn())fwFormInitModelDataLoader.m_logger.warn("Missing dataBinding for model data "+this.m_name+" for form "+form.getId()+", defaulting to "+config.dataBinding);}
mdl._initialise(config);return mdl;}
fwFormInitModelDataLoader.prototype._createDataService=function(resultHandler)
{return fwDataService.create(null==this.m_config.initialise?this.m_config:this.m_config.initialise,resultHandler,true);}
fwFormInitModelDataLoader.prototype._getServiceTypeName=function()
{return"Initial form data loading service";}
fwFormInitModelDataLoader.prototype._successHandler=function(dom,name)
{if(null!=this.m_config.postBusinessLifeCycleAction)
{this.m_config.postBusinessLifeCycleAction.call(null,dom);}
fwFormInitDataLoader.prototype._successHandler.call(this,dom,name)}
function fwFormRefDataLoader()
{}
fwFormRefDataLoader.prototype=new fwFormInitDataLoader();fwFormRefDataLoader.prototype.constructor=fwFormRefDataLoader;fwFormRefDataLoader.m_logger=new Category("fwFormRefDataLoader");fwFormRefDataLoader.m_count=0;fwFormRefDataLoader.create=function(config,form,generateEvents)
{var rdl=new fwFormRefDataLoader();rdl._setGenerateDMEvents(generateEvents);if(null==config.name)
{config.name=form.getId()+" reference data "+RefDataLoader.m_count;if(fwFormRefDataLoader.m_logger.isWarn())RefDataLoader.m_logger.warn("Missing name for reference data in form "+form.getId()+", defaulting to "+config.name);RefDataLoader.m_count++;}
if(null==config.dataBinding)
{config.dataBinding="/ds/var/form";if(fwFormRefDataLoader.m_logger.isWarn())RefDataLoader.m_logger.warn("Missing dataBinding for reference data "+this.m_name+" for form "+form.getId()+", defaulting to "+config.dataBinding);}
rdl._initialise(config);return rdl;}
fwFormRefDataLoader.prototype.load=function()
{var cacheName=this._getCacheName();var rootNodeName=Services.getAppController().getRefDataRootNodeForCurrentForm(cacheName);var nodeExists=false;if(null!=rootNodeName)
{var rootNodeInDM=XPathUtils.concatXPaths(this.m_config.dataBinding,rootNodeName);nodeExists=Services.exists(rootNodeInDM);}
if(false==nodeExists)
{fwFormInitDataLoader.prototype.load.call(this);}}
fwFormRefDataLoader.prototype._successHandler=function(dom,name)
{var cacheName=this._getCacheName();if(null!=cacheName)
{var ac=Services.getAppController();var rootNode=XML.getRootNode(dom);ac.setRefDataRootNodeForCurrentForm(cacheName,rootNode.nodeName);}
fwFormInitDataLoader.prototype._successHandler.call(this,dom,name);}
fwFormRefDataLoader.prototype._getCacheName=function()
{var cacheName=null;if(this.m_dataService instanceof fwServiceCallDataService)
{cacheName=this.m_config.serviceName;}
else if(this.m_dataService instanceof fwFileDataService)
{cacheName=this.m_config.fileName;}
return cacheName;}
fwFormRefDataLoader.prototype._getServiceTypeName=function()
{return"Reference data loading service";}
function fwFormModelDataLoader()
{}
fwFormModelDataLoader.prototype=new fwDataLoader();fwFormModelDataLoader.prototype.constructor=fwFormModelDataLoader;fwFormModelDataLoader.m_logger=new Category("fwFormModelDataLoader");fwFormModelDataLoader.prototype.m_formLifeCycle;fwFormModelDataLoader.prototype._successHandler=function(dom,name)
{this.m_formLifeCycle._handleDocumentLoadSuccess(dom,null,null);}
fwFormModelDataLoader.prototype._abort=function()
{}
fwFormModelDataLoader.create=function(config,formLifeCycle)
{var dl=new fwFormModelDataLoader();dl.m_formLifeCycle=formLifeCycle;if(null==config.dataBinding)
{config.dataBinding=formLifeCycle.getAdaptor().getModelParentXPath();if(fwFormModelDataLoader.m_logger.isInfo())fwFormModelDataLoader.m_logger.info("Defaulting form "+formLifeCycle.getAdaptor().getId()+" life cycle "+formLifeCycle.getName()+" dataBinding to "+config.dataBinding+" - the parent of the form's modelXPath configuration");}
dl._initialise(config);return dl;}
fwFormModelDataLoader.prototype._getServiceTypeName=function()
{return"Form data loading service";}
fwFormModelDataLoader.prototype._getAbortMessage=function()
{return"abort the loading of form data (Existing data will remain)";}
function fwFormSubmitDataLoader()
{}
fwFormSubmitDataLoader.prototype=new fwDataLoader();fwFormSubmitDataLoader.prototype.constructor=fwFormSubmitDataLoader;fwFormSubmitDataLoader.m_logger=new Category("fwFormSubmitDataLoader");fwFormSubmitDataLoader.prototype.m_formLifeCycle;fwFormSubmitDataLoader.prototype._successHandler=function(dom,name)
{this.m_formLifeCycle.onSuccess(dom);}
fwFormSubmitDataLoader.prototype._abort=function()
{}
fwFormSubmitDataLoader.create=function(config,formLifeCycle)
{var dl=new fwFormSubmitDataLoader();dl.m_formLifeCycle=formLifeCycle;config.callServiceParams=fwServiceCallDataService._createParameters(config.serviceParams,true);dl._initialise(config);return dl;}
fwFormSubmitDataLoader.prototype._getServiceTypeName=function()
{return"Form data submission service";}
fwFormSubmitDataLoader.prototype._getAbortMessage=function()
{return"abort the submission of form data";}
function FormBusinessLifeCycleDelegate(){};FormBusinessLifeCycleDelegate.confirmMethod=null;FormBusinessLifeCycleDelegate.confirmWhenDataModelDirty=function(lifecycle,confirmMessage,method)
{var doMethod=null;var a=lifecycle.m_adaptor;if(a._isDirty()&&a._getState()!=FormElementGUIAdaptor.FORM_BLANK)
{var ac=FormController.getInstance().getAppController();if(ac.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{FormBusinessLifeCycleDelegate.confirmMethod=method;var callbackFunction=function(userResponse)
{switch(userResponse)
{case StandardDialogButtonTypes.OK:FormBusinessLifeCycleDelegate.invokeMethod(FormBusinessLifeCycleDelegate.confirmMethod);break;default:break;}}
Services.showDialog(StandardDialogTypes.OK_CANCEL,callbackFunction,confirmMessage);}
else
{if(confirm(confirmMessage))
{doMethod=true;}
else
{doMethod=false;}}}
else
{doMethod=true;}
if(doMethod)
{FormBusinessLifeCycleDelegate.invokeMethod(method);}}
FormBusinessLifeCycleDelegate.returnDOMToParent=function()
{var nodes=new Array();nodes["app"]=Services.getNode("/ds/var/app");nodes["form"]=Services.getNode("/ds/var/form");var invokingAdaptor=FormController.getInstance().getInvokingAdaptor();invokingAdaptor.setReturnedDOM(nodes);}
FormBusinessLifeCycleDelegate.invokeMethod=function(method)
{if(null!=method)
{if(typeof method=="function")
{method.call(this);}
else
{throw new ConfigurationException('Error with method configuration (is not a function)');}}}
FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty=function(lifeCycleObj,msg,title,postSubmitEventDetails,lifeCycleActionMethod)
{var adaptor=lifeCycleObj.getAdaptor();if(adaptor._isDirty()&&adaptor._getState()!=FormElementGUIAdaptor.FORM_BLANK)
{var ac=FormController.getInstance().getAppController();var callbackFunction=function(userResponse)
{switch(userResponse)
{case StandardDialogButtonTypes.YES:FormBusinessLifeCycleDelegate.submitWithDynamicPostSubmitAction(adaptor,postSubmitEventDetails);break;case StandardDialogButtonTypes.NO:FormBusinessLifeCycleDelegate.invokeMethod(lifeCycleActionMethod);break;default:break;}}
if(ac.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{Services.showDialog(StandardDialogTypes.YES_NO_CANCEL,callbackFunction,msg,title);}
else
{var url=ac.m_config.getAppBaseURL()+"/com/sups/client/gui/form/lifecycles/YesNoCancelDialog.html";if(null==title)
{title=ac.getProjectName();}
var userResponse=window.showModalDialog(url+"?title="+title+"&message="+msg,null,"dialogWidth:500px; dialogHeight:130px; help:no; scroll:no; status:no");if(userResponse!=null)
{callbackFunction.call(null,userResponse);}}}
else
{FormBusinessLifeCycleDelegate.invokeMethod(lifeCycleActionMethod);}}
FormBusinessLifeCycleDelegate.submitWithDynamicPostSubmitAction=function(formAdaptor,businessLifeCycleEvent)
{var detail=null;if(businessLifeCycleEvent!=null)
{detail=new Object();detail["postSubmitEventDetails"]=businessLifeCycleEvent;}
Services.dispatchEvent(formAdaptor.getId(),BusinessLifeCycleEvents.EVENT_SUBMIT,detail);}
function SubmitFormBusinessLifeCycle()
{}
SubmitFormBusinessLifeCycle.prototype=new BusinessLifeCycle();SubmitFormBusinessLifeCycle.prototype.constructor=SubmitFormBusinessLifeCycle;SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE="navigate";SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM="form";SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM="custom";SubmitFormBusinessLifeCycle.m_logger=new Category("SubmitFormBusinessLifeCycle");SubmitFormBusinessLifeCycle.prototype.m_submitConfig=null;SubmitFormBusinessLifeCycle.prototype.m_dynamicPostSubmitEvent=null;SubmitFormBusinessLifeCycle.prototype.m_useSubmitResponseAsModel=null;SubmitFormBusinessLifeCycle.create=function()
{var submitFormBusinessLifeCycle=new SubmitFormBusinessLifeCycle();return submitFormBusinessLifeCycle;}
SubmitFormBusinessLifeCycle.createClosureForExceptionHandler=function(exceptionName,thisObj)
{return function(e){return thisObj.m_exceptionHandlers[exceptionName](e,thisObj.m_dynamicPostSubmitEvent);};}
SubmitFormBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_SUBMIT;}
SubmitFormBusinessLifeCycle.prototype._configure=function(submitConfig)
{this.m_submitConfig=submitConfig;if(null==this.m_submitConfig)
{return;}
if(null!=this.m_submitConfig.stopOnCleanData)
{this.m_stopOnCleanData=this.m_submitConfig.stopOnCleanData;}
else
{this.m_stopOnCleanData=function(){return false;};}
this.m_postSubmitActionConfig=this.m_submitConfig["postSubmitAction"];if(null==this.m_postSubmitActionConfig)
{throw new ConfigurationException("Missing postSubmitAction for form submit life cycle");}
var navigationAction=this.m_postSubmitActionConfig[SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE];var formAction=this.m_postSubmitActionConfig[SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM];var customAction=this.m_postSubmitActionConfig[SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM];if(null!=navigationAction)
{this.m_postSubmitAction=SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE;this.m_formName=navigationAction["formName"];if(null==this.m_formName)
{throw new ConfigurationException("Missing form name for form post submit navigation action configuration");}
this.m_state=null;var state=navigationAction["state"];if(state!=null)
{var stateLength=state.length;if(stateLength>0)
{this.m_state=new Array(stateLength);for(var i=0;i<stateLength;i++)
{this.m_state[i]=state[i];}}}}
else if(null!=formAction)
{this.m_postSubmitAction=SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM;if(typeof formAction=="string")
{this.m_formAction=formAction;}
else if(typeof formAction=="object")
{this.m_formAction=formAction["state"];var useSubmitResponseAsModel=formAction["useSubmitResponseAsModel"];if(null!=useSubmitResponseAsModel)
{this.m_useSubmitResponseAsModel=useSubmitResponseAsModel;}}
if(!this._validState(this.m_formAction))
{throw new ConfigurationException("Invalid form state in form post submit action configuration");}}
else if(null!=customAction)
{this.m_postSubmitAction=SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM;this.m_customAction=customAction;if(typeof this.m_customAction!="function")
{throw new ConfigurationException("Invalid form post submit action configuration. Custom option must define a function.");}}
if(this.m_postSubmitAction==null)
{throw new ConfigurationException("Invalid form configuration. The postSubmitAction configuration must define the post submit action.");}
navigationAction=null;formAction=null;customAction=null;var preDynamicPostSubmitEventProcess=this.m_submitConfig.preDynamicPostSubmitEventProcess;if(null!=preDynamicPostSubmitEventProcess)
{if(typeof preDynamicPostSubmitEventProcess!="function")
{throw new ConfigurationException('Error with configuration property '+'preDynamicPostSubmitEventProcess. '+'Property must be of type "function"');}}
preDynamicPostSubmitEventProcess=null;}
SubmitFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_dynamicPostSubmitEvent=null;var eventDetail=e.getDetail();if(null!=eventDetail)
{this.m_dynamicPostSubmitEvent=eventDetail["postSubmitEventDetails"];}
var state=this.m_adaptor._getState();if(state!=FormElementGUIAdaptor.FORM_CREATE&&state!=FormElementGUIAdaptor.FORM_MODIFY)
{var ac=Services.getAppController();var title=ac.getCurrentForm().getTitle();var msg;if(null==title||""==title)
{title=this.m_adaptor.getId();}
msg="Form '"+title+"' cannot be submitted in its current state";Services.showAlert(msg);return;}
if(!this._formValid())
{return;}
if(this.m_adaptor._isDirty())
{this._submitData();}
else
{if(this.m_stopOnCleanData()==true||(this.m_postSubmitAction==SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM&&this.m_formAction==FormElementGUIAdaptor.FORM_MODIFY))
{Services.showAlert("Not submitting data to server as nothing has changed");return;}
else
{this._postSubmitAction();}}}
SubmitFormBusinessLifeCycle.prototype._formValid=function()
{var fc=FormController.getInstance();var invalidFields=fc.validateForm(true,true);if(invalidFields.length!=0)
{return false;}
return true;}
SubmitFormBusinessLifeCycle.prototype._submitData=function()
{this._callService();}
SubmitFormBusinessLifeCycle.prototype._callService=function()
{var adaptor=this.getAdaptor();var state=adaptor._getState();FormBusinessLifeCycleDelegate.invokeMethod(this.m_submitConfig.preprocess);var serviceConfig=this.m_submitConfig[state];if(null==serviceConfig)
{throw new ConfigurationException("Form "+adaptor.getId()+" is not configured for submit whilst in "+
state+" state.");}
var dL=null;try
{dL=fwFormSubmitDataLoader.create(serviceConfig,this);}
catch(ex)
{serviceConfig.serviceName=serviceConfig.name;serviceConfig.serviceParams=serviceConfig.params;dL=fwFormSubmitDataLoader.create(serviceConfig,this);if(SubmitFormBusinessLifeCycle.m_logger.isError())SubmitFormBusinessLifeCycle.m_logger.trace("Submit configuration for form: "+adaptor.getId()+" is using deprecated name and params configuration properties - please update to use serviceName and serviceParams properties");}
dL.load();}
SubmitFormBusinessLifeCycle.prototype.onSuccess=function(dom)
{if(null==this.m_dynamicPostSubmitEvent)
{this._postSubmitAction(dom);}
else
{this._dynamicPostSubmitAction(dom);}}
SubmitFormBusinessLifeCycle.prototype._postSubmitAction=function(dom)
{this.m_adaptor._setDirty(false);this.m_adaptor.update();if(this.m_postSubmitAction==SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE)
{this._navigate();}
else if(this.m_postSubmitAction==SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM)
{this._refreshForm(dom);}
else if(this.m_postSubmitAction==SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM)
{this.m_customAction.call(this,dom);}}
SubmitFormBusinessLifeCycle.prototype._navigate=function()
{var fc=FormController.getInstance();if(null!=this.m_state)
{var state=null;var sourceValue=null;var sourceNode=null;var source=null;var target=null;var targetNode=null;var targetNodeChildName=null;var dm=fc.getDataModel();for(var i=0,l=this.m_state.length;i<l;i++)
{state=this.m_state[i];target=state["target"];if(null!=target)
{sourceValue=state["sourceValue"];sourceNode=state["sourceNode"];if(null!=sourceValue)
{source=dm.getValue(sourceValue);if(null!=source)
{dm.setValue(target,source);}}
else if(null!=sourceNode)
{source=dm.getNode(sourceNode);targetNodeChildName=target+"/"+
source.nodeName;targetNode=dm.getNode(targetNodeChildName);if(null==targetNode)
{dm.addNodeSet(source,target);}
else
{dm.replaceNode(targetNodeChildName,source);}}
source=null;sourceValue=null;sourceNode=null;targetNode=null;}}}
var details=new Object();details["formName"]=this.m_formName;fc.dispatchBusinessLifeCycleEvent(this.m_adaptor.getId(),BusinessLifeCycleEvents.EVENT_NAVIGATE,details);}
SubmitFormBusinessLifeCycle.prototype._refreshForm=function(dom)
{var fc=FormController.getInstance();if(this.m_formAction==FormElementGUIAdaptor.FORM_BLANK)
{fc.dispatchBusinessLifeCycleEvent(this.m_adaptor.getId(),BusinessLifeCycleEvents.EVENT_CLEAR,null);}
else if(this.m_formAction==FormElementGUIAdaptor.FORM_CREATE)
{var detail=null;if(this.m_useSubmitResponseAsModel==true)
{if(dom!=null)
{detail=new Object();detail.DOM=dom;}
else
{throw new ConfigurationException("Post submit condition is create, but not service has been configured for submit");}}
fc.dispatchBusinessLifeCycleEvent(this.m_adaptor.getId(),BusinessLifeCycleEvents.EVENT_CREATE,detail);}
else if(this.m_formAction==FormElementGUIAdaptor.FORM_MODIFY)
{var detail=null;if(this.m_useSubmitResponseAsModel!=false)
{if(dom!=null)
{detail=new Object();detail.DOM=dom;}
else
{throw new ConfigurationException("Post submit condition is modify, but not service has been configured for submit");}}
fc.dispatchBusinessLifeCycleEvent(this.m_adaptor.getId(),BusinessLifeCycleEvents.EVENT_MODIFY,detail);}}
SubmitFormBusinessLifeCycle.prototype._dynamicPostSubmitAction=function(dom)
{var postSubmitEvent=this.m_dynamicPostSubmitEvent;var preDynamicPostSubmitEventProcess=this.m_submitConfig.preDynamicPostSubmitEventProcess;if(null!=preDynamicPostSubmitEventProcess)
{preDynamicPostSubmitEventProcess.call(this,postSubmitEvent.getType(),dom);}
this.m_adaptor._setDirty(false);this.m_adaptor.update();Services.dispatchEvent(postSubmitEvent.getComponentId(),postSubmitEvent.getType(),postSubmitEvent.getDetail());}
SubmitFormBusinessLifeCycle.prototype._validState=function(state)
{var validState=true;if(state!=FormElementGUIAdaptor.FORM_BLANK&&state!=FormElementGUIAdaptor.FORM_CREATE&&state!=FormElementGUIAdaptor.FORM_MODIFY)
{validState=false;}
return validState;}
SubmitFormBusinessLifeCycle.prototype._parseXPathNodeNames=function(xp)
{var s=0;var lastSlash=-1;var nodeNames=new Array();var length=xp.length;if(length>0)
{if(xp.charAt(s)=='/')
{s=1;lastSlash=0;}
while(s<length)
{switch(xp.charAt(s))
{case'/':if(s>lastSlash+1)
{nodeNames[nodeNames.length]=xp.substring(lastSlash+1,s);lastSlash=s;s++;}
else
{throw new ConfigurationException("Error target node definition contains unexpected double foreslashes");}
break;default:s++;break;}}
if(lastSlash!=length-1)
{nodeNames[nodeNames.length]=xp.substring(lastSlash+1,s)}}
return nodeNames;}
function SubmitSubformBusinessLifeCycle()
{}
SubmitSubformBusinessLifeCycle.prototype=new SubmitFormBusinessLifeCycle();SubmitSubformBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_SUBMIT;}
SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE="close";SubmitSubformBusinessLifeCycle.prototype.constructor=SubmitSubformBusinessLifeCycle;SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CANCEL=SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE;SubmitSubformBusinessLifeCycle.prototype._configure=function(submitConfig)
{this.m_submitConfig=submitConfig;if(null!=this.m_submitConfig)
{var returnSourceNodes=this.m_submitConfig["returnSourceNodes"];if(null!=returnSourceNodes)
{this.m_returnSourceNodes=new Array();for(var i=0;i<returnSourceNodes.length;i++)
{this.m_returnSourceNodes.push(returnSourceNodes[i]);}}
this.m_postSubmitActionConfig=this.m_submitConfig["postSubmitAction"];if(null==this.m_postSubmitActionConfig)
{throw new ConfigurationException("Missing postSubmitAction for form submit life cycle");}
var closeAction=this.m_postSubmitActionConfig[SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE];if(null!=closeAction)
{this.m_postSubmitAction=SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE;}}
else
{return;}
SubmitFormBusinessLifeCycle.prototype._configure.call(this,submitConfig);}
SubmitSubformBusinessLifeCycle.prototype._submitData=function()
{var dm=FormController.getInstance().getDataModel();var db=this.m_adaptor.dataBinding;var state=dm.getValue(db+FormElementGUIAdaptor.FORM_STATE_XPATH);var serviceConfig=this.m_submitConfig[state];if(null!=serviceConfig&&(fwDataService.isDataServiceConfigured(serviceConfig)||null!=serviceConfig.name))
{SubmitFormBusinessLifeCycle.prototype._submitData.call(this);}
else
{FormBusinessLifeCycleDelegate.returnDOMToParent();this.returnDataToParent();this._postSubmitAction();}}
SubmitSubformBusinessLifeCycle.prototype.onSuccess=function(dom)
{FormBusinessLifeCycleDelegate.returnDOMToParent();this.returnDataToParent();this._postSubmitAction(dom);}
SubmitSubformBusinessLifeCycle.prototype._postSubmitAction=function(dom)
{if(null==this.m_dynamicPostSubmitEvent)
{if(null!=dom)
{this._staticPostSubmitAction(dom);}
else
{this._staticPostSubmitAction();}}
else
{SubmitFormBusinessLifeCycle.prototype._dynamicPostSubmitAction.call(this);}}
SubmitSubformBusinessLifeCycle.prototype._staticPostSubmitAction=function(dom)
{this.m_adaptor._setDirty(false);if(this.m_postSubmitAction==SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE)
{this.lowerSubformTimeout();}
else
{SubmitFormBusinessLifeCycle.prototype._postSubmitAction.call(this,dom);}}
SubmitSubformBusinessLifeCycle.prototype.returnDataToParent=function()
{var returnNodes=null;if(this.m_returnSourceNodes!=null&&this.m_returnSourceNodes.length>0)
{returnNodes=new Array();for(var i=0;i<this.m_returnSourceNodes.length;i++)
{returnNodes.push(Services.getNode(this.m_returnSourceNodes[i]));}}
var invokingAdaptor=FormController.getInstance().getInvokingAdaptor();FormController.getInstance().processEvents();invokingAdaptor.setReturnedData(returnNodes);}
SubmitSubformBusinessLifeCycle.prototype.lowerSubformTimeout=function()
{setTimeout("SubmitSubformBusinessLifeCycle.lowerSubform()",100);}
SubmitSubformBusinessLifeCycle.lowerSubform=function()
{var invokingAdaptor=FormController.getInstance().getInvokingAdaptor();window.parent.Services.dispatchEvent(invokingAdaptor.getId(),PopupGUIAdaptor.EVENT_LOWER);}
function ClearFormBusinessLifeCycle()
{}
ClearFormBusinessLifeCycle.prototype=new BusinessLifeCycle();ClearFormBusinessLifeCycle.prototype.constructor=ClearFormBusinessLifeCycle;ClearFormBusinessLifeCycle.prototype.m_clearConfig=null;ClearFormBusinessLifeCycle.create=function()
{var clearFormBusinessLifeCycle=new ClearFormBusinessLifeCycle();return clearFormBusinessLifeCycle;}
ClearFormBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_CLEAR;}
ClearFormBusinessLifeCycle.prototype._configure=function(clearConfig)
{this.m_clearConfig=clearConfig;}
ClearFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var details=e.getDetail();if(null==details||details.raiseWarningIfDOMDirty!==false)
{var thisObj=this;FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(thisObj,BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,null,e,function()
{thisObj.clearForm();});}
else
{this.clearForm();}}
ClearFormBusinessLifeCycle.prototype.clearForm=function()
{var adaptor=this.getAdaptor();var dm=FormController.getInstance().getDataModel();this.invokeClearBusinessLifeCyclePreprocessing();adaptor.clearFormDataModel();adaptor._setState(FormElementGUIAdaptor.FORM_BLANK);adaptor._setDirty(false);adaptor.update();var focusAdaptorID=adaptor.invokeFirstFocusedAdaptorId();var thisObj=this;setTimeout(function(){thisObj._setFocus(focusAdaptorID);},0);}
ClearFormBusinessLifeCycle.prototype._setFocus=function(adaptorId)
{Services.setFocus(adaptorId);}
ClearFormBusinessLifeCycle.prototype.invokeClearBusinessLifeCyclePreprocessing=function()
{var config=this.m_clearConfig;if(null!=config)
{if(null!=config.preprocess)
{FormBusinessLifeCycleDelegate.invokeMethod(this.m_clearConfig.preprocess);}}}
function CancelSubformBusinessLifeCycle()
{}
CancelSubformBusinessLifeCycle.prototype=new BusinessLifeCycle();CancelSubformBusinessLifeCycle.prototype.constructor=CancelSubformBusinessLifeCycle;CancelSubformBusinessLifeCycle.prototype.m_raiseWarningIfDOMDirty=true;CancelSubformBusinessLifeCycle.create=function()
{var CancelSubformBusinessLifeCycle=new CancelSubformBusinessLifeCycle();return CancelSubformBusinessLifeCycle;}
CancelSubformBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_CANCEL;}
CancelSubformBusinessLifeCycle.prototype._configure=function(cancelConfig)
{if(null!=cancelConfig)
{if(cancelConfig.raiseWarningIfDOMDirty==false)
{this.m_raiseWarningIfDOMDirty=false;}}}
CancelSubformBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var raiseWarning=null;var details=e.getDetail();if(null!=details&&null!=details.raiseWarningIfDOMDirty)
{if(details.raiseWarningIfDOMDirty==true)
{raiseWarning=true;}
else if(details.raiseWarningIfDOMDirty==false)
{raiseWarning=false;}}
if(null==raiseWarning)
{raiseWarning=this.m_raiseWarningIfDOMDirty;}
if(raiseWarning)
{var thisObj=this;e=null;FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(thisObj,BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,null,e,thisObj._cancelSubformTimeout);}
else
{this._cancelSubformTimeout();}}
CancelSubformBusinessLifeCycle.prototype._cancelSubformTimeout=function()
{setTimeout("CancelSubformBusinessLifeCycle._cancelSubform()",100);}
CancelSubformBusinessLifeCycle._cancelSubform=function()
{FormBusinessLifeCycleDelegate.returnDOMToParent();var invokingAdaptor=FormController.getInstance().getInvokingAdaptor();window.parent.Services.dispatchEvent(invokingAdaptor.getId(),PopupGUIAdaptor.EVENT_LOWER);}
function EditFormBusinessLifeCycle()
{}
EditFormBusinessLifeCycle.prototype=new BusinessLifeCycle();EditFormBusinessLifeCycle.prototype.constructor=EditFormBusinessLifeCycle;EditFormBusinessLifeCycle.m_logger=new Category("EditFormBusinessLifeCycle");EditFormBusinessLifeCycle.prototype.m_config=null;EditFormBusinessLifeCycle.prototype._configure=function(config)
{this.m_config=config;}
EditFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var details=e.getDetail();if(null==details||details.raiseWarningIfDOMDirty!==false)
{var thisObj=this;FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(thisObj,BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,null,e,function()
{thisObj.refreshDOM(e)});}
else
{this.refreshDOM(e);}}
EditFormBusinessLifeCycle.prototype.refreshDOM=function(e)
{var refreshDOM=null;var fc=FormController.getInstance();var dm=fc.getDataModel();var eventDetails=e.m_detail;if(null!=eventDetails)
{refreshDOM=eventDetails.DOM;}
if(null!=refreshDOM)
{var dataBinding=eventDetails.dataBinding;var isDirty=(eventDetails.isDirty===true);this._handleDocumentLoadSuccess(refreshDOM,dataBinding,isDirty);}
else
{var dL=fwFormModelDataLoader.create(this.m_config,this);dL.load();}}
EditFormBusinessLifeCycle.prototype._handleDocumentLoadSuccess=function(dom,dataBinding,dirty)
{var adaptor=this.getAdaptor();var state=this._getTargetState();if(null==dataBinding)
{dataBinding=this._getModelDataBinding()
if(null==dataBinding)
{throw new ConfigurationException("No Data binding for form '"+this.getAdaptor().getId()+"' "+state+" lifeCycle");}}
var dm=FormController.getInstance().getDataModel();dm._startTransaction();this.callPostBusinessLifeCycleAction(dom);adaptor.suspendDirtyEvents(true);adaptor.clearFormDataModel();dm.addNodeSet(dom,this._getModelDataBinding());adaptor._setState(state);adaptor._setDirty((dirty===true));adaptor.update();adaptor.suspendDirtyEvents(false);dm._endTransaction();}
EditFormBusinessLifeCycle.prototype.callPostBusinessLifeCycleAction=function(dom)
{if(null!=this.m_config.postBusinessLifeCycleAction)
{this.m_config.postBusinessLifeCycleAction.call(null,dom);}}
EditFormBusinessLifeCycle.prototype._getModelDataBinding=function()
{var dataBinding=this.m_config.dataBinding;if(null==dataBinding)
{dataBinding=this.getAdaptor().getModelParentXPath();}
return dataBinding;}
EditFormBusinessLifeCycle.prototype._getTargetState=function()
{fc_assertAlways("fwDataService._getTargetState() base class method must be overridden");}
function CreateFormBusinessLifeCycle()
{}
CreateFormBusinessLifeCycle.prototype=new EditFormBusinessLifeCycle();CreateFormBusinessLifeCycle.prototype.constructor=CreateFormBusinessLifeCycle;CreateFormBusinessLifeCycle.create=function()
{return new CreateFormBusinessLifeCycle();}
CreateFormBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_CREATE;}
CreateFormBusinessLifeCycle.prototype._getTargetState=function()
{return FormLifeCycleStates.FORM_CREATE;}
function ModifyFormBusinessLifeCycle()
{}
ModifyFormBusinessLifeCycle.prototype=new EditFormBusinessLifeCycle();ModifyFormBusinessLifeCycle.prototype.constructor=ModifyFormBusinessLifeCycle;ModifyFormBusinessLifeCycle.create=function()
{return new ModifyFormBusinessLifeCycle();}
ModifyFormBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_MODIFY;}
ModifyFormBusinessLifeCycle.prototype._getTargetState=function()
{return FormLifeCycleStates.FORM_MODIFY;}
function NavigateFormBusinessLifeCycle()
{}
NavigateFormBusinessLifeCycle.prototype=new BusinessLifeCycle();NavigateFormBusinessLifeCycle.prototype.constructor=NavigateFormBusinessLifeCycle;NavigateFormBusinessLifeCycle.FORM="form";NavigateFormBusinessLifeCycle.LOGOUT="logout";NavigateFormBusinessLifeCycle.EXIT="exit";NavigateFormBusinessLifeCycle.create=function()
{var navigateFormBusinessLifeCycle=new NavigateFormBusinessLifeCycle();return navigateFormBusinessLifeCycle;}
NavigateFormBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_NAVIGATE;}
NavigateFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var state=this.m_adaptor._getState();var navigate=false;var details=e.getDetail();switch(state){case FormElementGUIAdaptor.FORM_BLANK:Services.getAppController().navigate(details["formName"],details["mode"]);break;case FormElementGUIAdaptor.FORM_CREATE:case FormElementGUIAdaptor.FORM_MODIFY:default:if(details["raiseWarningIfDOMDirty"])
{var thisObj=this;FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(thisObj,BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,null,e,function(){Services.getAppController().navigate(details["formName"],details["mode"]);});}
else
{Services.getAppController().navigate(details["formName"],details["mode"]);}
break;}}
function FormElementGUIAdaptor()
{}
FormElementGUIAdaptor.m_logger=new Category("FormElementGUIAdaptor");FormElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols("FormElementGUIAdaptor");GUIAdaptor._setUpProtocols('FormElementGUIAdaptor');GUIAdaptor._addProtocol('FormElementGUIAdaptor','ComponentContainerProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','BusinessLifeCycleProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','FormDirtyProtocol');GUIAdaptor._addProtocol('FormElementGUIAdaptor','RecordsProtocol');FormElementGUIAdaptor.prototype.constructor=FormElementGUIAdaptor;FormElementGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS="form_notsubmissable";FormElementGUIAdaptor.DEFAULT_MODEL_XPATH=DataModel.DEFAULT_ROOT;FormElementGUIAdaptor.prototype.statusLine="status_line";FormElementGUIAdaptor.prototype.m_statusLine=undefined;FormElementGUIAdaptor.FORM_BLANK=FormLifeCycleStates.FORM_BLANK;FormElementGUIAdaptor.FORM_CREATE=FormLifeCycleStates.FORM_CREATE;FormElementGUIAdaptor.FORM_MODIFY=FormLifeCycleStates.FORM_MODIFY;FormElementGUIAdaptor.FORM_STATE_XPATH="/state";FormElementGUIAdaptor.FORM_DIRTY_XPATH="/dirty";FormElementGUIAdaptor.prototype.m_transientMessageTimeout=null;FormElementGUIAdaptor.STATUSBAR_TIMEOUT=1000;FormElementGUIAdaptor.prototype.m_dmClearExclusionNodes=new Array("app","form");FormElementGUIAdaptor.prototype.FORM_REQUIRED_DATABINDING_ROOT=FormDatabindings.DEFAULT_FORM_DATABINDING_ROOT;FormElementGUIAdaptor.prototype.m_removeXPaths=null;FormElementGUIAdaptor.prototype.refDataServices=[];FormElementGUIAdaptor.prototype.submitLifeCycle=null;FormElementGUIAdaptor.prototype.clearLifeCycle=null;FormElementGUIAdaptor.prototype.createLifeCycle=null;FormElementGUIAdaptor.prototype.modifyLifeCycle=null;FormElementGUIAdaptor.prototype.navigation=null;FormElementGUIAdaptor.prototype.startupState=null;FormElementGUIAdaptor.prototype.modelXPath=null;FormElementGUIAdaptor.prototype.loadModelDataService=null;FormElementGUIAdaptor.prototype.includeInValidation=false;FormElementGUIAdaptor.prototype.m_initialFormState=null;FormElementGUIAdaptor.prototype.m_markAsDirtyOnInitialise=false;FormElementGUIAdaptor.create=function(e)
{var a=new FormElementGUIAdaptor();a._initialiseAdaptor(e);return a;}
FormElementGUIAdaptor.prototype._initialiseAdaptor=function(e)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.dataBinding=this.FORM_REQUIRED_DATABINDING_ROOT+"/"+this.getId();this._setInitialValue();var thisObj=this;this.m_submitHandler=SUPSEvent.addEventHandler(this.m_element,"submit",function(evt){thisObj._blockEventsForForm(evt);},null);this.m_dragStartHandler=SUPSEvent.addEventHandler(this.m_element,"dragstart",function(evt){thisObj._disableDragAndDrop(evt);},null);this.m_element.ownerDocument.body.setAttribute("hideFocus","true");}
FormElementGUIAdaptor.prototype.reinitialise=function()
{this._reinitialiseDataModel();}
FormElementGUIAdaptor.prototype._reinitialiseDataModel=function()
{this.clearFormDataModel();this._setInitialValue();this._loadReferenceData(true);this._loadInitialModelData(true);this.update();}
FormElementGUIAdaptor.prototype._setInitialValue=function()
{this.m_value={state:FormElementGUIAdaptor.FORM_BLANK,dirty:false}}
FormElementGUIAdaptor.prototype._dispose=function()
{if(this.m_submitHandler!=null)
{SUPSEvent.removeEventHandlerKey(this.m_submitHandler);this.m_submitHandler=null;}
if(this.m_dragStartHandler!=null)
{SUPSEvent.removeEventHandlerKey(this.m_dragStartHandler);this.m_dragStartHandler=null;}}
FormElementGUIAdaptor.prototype.renderState=function()
{this._renderForm("");}
FormElementGUIAdaptor.prototype._renderForm=function(className)
{if(!this.getAggregateState().isSubmissible())
{className+=" "+FormElementGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;}
this.m_element.className=className;}
FormElementGUIAdaptor.prototype._configure=function(cs)
{var c;var refDataServices=[];for(var i=0,l=cs.length;i<l;i++)
{c=cs[i];if(c.submitLifeCycle&&this.submitLifeCycle==null)
{this.submitLifeCycle=c.submitLifeCycle;}
if(c.clearLifeCycle&&this.clearLifeCycle==null)
{this.clearLifeCycle=c.clearLifeCycle;}
if(c.createLifeCycle&&this.createLifeCycle==null)
{this.createLifeCycle=c.createLifeCycle;}
if(c.modifyLifeCycle&&this.modifyLifeCycle==null)
{this.modifyLifeCycle=c.modifyLifeCycle;}
if(c.startupState&&this.startupState==null)
{this.startupState=c.startupState;}
if(c.navigation&&this.navigation==null)
{this.navigation=c.navigation;}
if(c.loadModelDataService&&this.loadModelDataService==null)
{this.loadModelDataService=c.loadModelDataService;}
if(c.statusLine!=null)
{this.statusLine=c.statusLine;}
if(c.prepareModelData)
{this.prepareModelData=c.prepareModelData;}
if(c.refDataServices&&c.refDataServices.length&&c.refDataServices.length>0)
{refDataServices=refDataServices.concat(c.refDataServices);}
if(c.modelXPath&&this.modelXPath==null)
{this.modelXPath=c.modelXPath;}}
this.refDataServices=refDataServices;if(null==this.modelXPath)
{this.modelXPath=FormElementGUIAdaptor.DEFAULT_MODEL_XPATH;}
else
{if(0==this.modelXPath.indexOf(DataModel.VARIABLES_ROOT))
{throw new ConfigurationException("Form "+this.getId()+" modelXPath cannot be inside "+DataModel.VARIABLES_ROOT+". modelXPath is: "+this.modelXPath);}}
if(this.dataBinding.indexOf(this.FORM_REQUIRED_DATABINDING_ROOT)!=0)
{throw new ConfigurationException("Form dataBinding must be under "
+this.FORM_REQUIRED_DATABINDING_ROOT
+". Actual location: "+this.dataBinding);}
if(this.m_lifeCycles[BusinessLifeCycleEvents.EVENT_SUBMIT]==null)
{var submitFormBusinessLifeCycle=SubmitFormBusinessLifeCycle.create();submitFormBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(submitFormBusinessLifeCycle);if(null!=this.submitLifeCycle)submitFormBusinessLifeCycle.configure(this.submitLifeCycle);submitFormBusinessLifeCycle.start();}
var clearFormBusinessLifeCycle=ClearFormBusinessLifeCycle.create();clearFormBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(clearFormBusinessLifeCycle);var createFormBusinessLifeCycle=CreateFormBusinessLifeCycle.create();createFormBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(createFormBusinessLifeCycle);var modifyFormBusinessLifeCycle=ModifyFormBusinessLifeCycle.create();modifyFormBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(modifyFormBusinessLifeCycle);var navigateFormBusinessLifeCycle=NavigateFormBusinessLifeCycle.create();navigateFormBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(navigateFormBusinessLifeCycle);if(null!=this.clearLifeCycle)clearFormBusinessLifeCycle.configure(this.clearLifeCycle);if(null!=this.createLifeCycle)createFormBusinessLifeCycle.configure(this.createLifeCycle);if(null!=this.modifyLifeCycle)modifyFormBusinessLifeCycle.configure(this.modifyLifeCycle);clearFormBusinessLifeCycle.start();createFormBusinessLifeCycle.start();modifyFormBusinessLifeCycle.start();if(null!=this.navigation)
{this.m_removeXPaths=this.navigation["removeXPaths"];}
this._loadReferenceData(false);this._loadInitialModelData(false);}
FormElementGUIAdaptor.prototype._loadReferenceData=function(withEvents)
{var rd=this.refDataServices;var l=rd.length;if(l>0)
{for(var i=0;i<l;i++)
{if(FormElementGUIAdaptor.m_logger.isTrace())FormElementGUIAdaptor.m_logger.trace("About to create ref data service number "+i);var refDataLoader=fwFormRefDataLoader.create(rd[i],this,withEvents);refDataLoader.load();}}
else
{if(FormElementGUIAdaptor.m_logger.isInfo())FormElementGUIAdaptor.m_logger.info("No ref data services configured for form "+this.getId());}}
FormElementGUIAdaptor.prototype._loadInitialModelData=function(withEvents)
{var modelDataLoader=null;var initialConfig=null;this.m_value.state=this._determineInitialState();switch(this.m_value.state)
{case FormElementGUIAdaptor.FORM_CREATE:{if(null==this.createLifeCycle)
{throw new ConfigurationException("Form "+this.getId()+" configured to initially enter CREATE state but no createLifeCycle configuration specified");}
modelDataLoader=fwFormInitModelDataLoader.create(this.createLifeCycle,this,withEvents);initialConfig=this.createLifeCycle;break;}
case FormElementGUIAdaptor.FORM_MODIFY:{if(null==this.modifyLifeCycle)
{throw new ConfigurationException("Form "+this.getId()+" configured to initially enter MODIFY state but no modifyLifeCycle configuration specified");}
modelDataLoader=fwFormInitModelDataLoader.create(this.modifyLifeCycle,this,withEvents);initialConfig=this.modifyLifeCycle;break;}
case FormElementGUIAdaptor.FORM_BLANK:{break;}
default:{this.m_value.state=FormElementGUIAdaptor.FORM_BLANK;if(null!=this.loadModelDataService)
{modelDataLoader=fwFormInitModelDataLoader.create(this.loadModelDataService,this,withEvents);if(FormElementGUIAdaptor.m_logger.isError())FormElementGUIAdaptor.m_logger.error("Form with id: '"+this.getId()+"' uses obsolete loadModelDataService");}
break;}}
if(null!=initialConfig&&null!=initialConfig.initialise&&null!=initialConfig.initialise.markAsDirty)
{this.m_markAsDirtyOnInitialise=initialConfig.initialise.markAsDirty;}
if(null!=modelDataLoader)
{modelDataLoader.load();}}
FormElementGUIAdaptor.prototype._determineInitialState=function()
{var s=null;if(this.startupState!=null)
{s=this._invokeStartupState();}
if(null==s)
{var createConfig=this.createLifeCycle;var modifyConfig=this.modifyLifeCycle;if(null!=createConfig&&null==modifyConfig)
{if(FormElementGUIAdaptor.m_logger.isDebug())FormElementGUIAdaptor.m_logger.debug("About to create model data service for new data");s=FormElementGUIAdaptor.FORM_CREATE;}
else if(null==createConfig&&null!=modifyConfig)
{if(FormElementGUIAdaptor.m_logger.isDebug())FormElementGUIAdaptor.m_logger.debug("About to create model data service for update data");s=FormElementGUIAdaptor.FORM_MODIFY;}
else if(null!=createConfig&&null!=modifyConfig)
{throw new ConfigurationException("Incorrect configuration for form "+this.getId()+". startupState must be defined if both create and update lifecycles configured.");}
else
{}}
return s;}
FormElementGUIAdaptor.prototype._invokeStartupState=function()
{var state=null;var mode=this.startupState.mode;if(null!=mode)
{switch(typeof mode)
{case"string":{state=mode;if(!this.isValidState(state))
{throw new ConfigurationException("Initial state for form "+this.getId()+" is invalid");}
break;}
case"function":{state=mode.call(this);if(!this.isValidState(state))
{throw new ConfigurationException("Initial state of form "+this.getId()+" provided by custom function is invalid");}
break;}
default:{throw new ConfigurationException("Invalid configuration for form "+this.getId()+". Mode parameter of startUpState must be a string or a custom function");}}}
else
{throw new ConfigurationException("Invalid configuration for form "+this.getId()+". Parameter mode of startUpState must be defined.");}
return state;}
FormElementGUIAdaptor.prototype.isValidState=function(s)
{return(s==FormElementGUIAdaptor.FORM_BLANK||s==FormElementGUIAdaptor.FORM_MODIFY||s==FormElementGUIAdaptor.FORM_CREATE);}
FormElementGUIAdaptor.prototype.isDirtyOnInit=function()
{var isDirty=false;if(null!=this.m_markAsDirtyOnInitialise)
{if(typeof this.m_markAsDirtyOnInitialise=="function")
{isDirty=this.m_markAsDirtyOnInitialise();}
else
{isDirty=this.m_markAsDirtyOnInitialise;}
if(typeof isDirty!="boolean")
{throw new ConfigurationException("markAsDirty configuration must be of type boolean or a function that returns a boolean");}}
return isDirty;}
FormElementGUIAdaptor.prototype.update=function()
{if(FormElementGUIAdaptor.m_logger.isDebug())FormElementGUIAdaptor.m_logger.debug("FormElementGUIAdaptor.update(): "+this.getId());var db=this.dataBinding;if(null!=db)
{var fc=FormController.getInstance();var dm=fc.getDataModel();fc.startDataTransaction(this);var state=this.m_value.state;var stateXPath=db+FormElementGUIAdaptor.FORM_STATE_XPATH;var origState=dm.getValue(stateXPath);var stateChanged=Services.compareStringValues(state,origState);var stateUpdated=false;if(!stateChanged)
{stateUpdated=dm.setValue(stateXPath,state);}
var dirty=this.m_value.dirty.toString();var dirtyXPath=db+FormElementGUIAdaptor.FORM_DIRTY_XPATH;var origDirty=dm.getValue(dirtyXPath);var dirtyChanged=Services.compareStringValues(state,origState);var dirtyUpdated=false;if(!dirtyUpdated)
{dirtyUpdated=dm.setValue(dirtyXPath,dirty);}
fc.endDataTransaction(this);return stateUpdated||dirtyUpdated;}
else
{throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = "+this.getId());}}
FormElementGUIAdaptor.prototype._setState=function(state)
{this.m_value.state=state;}
FormElementGUIAdaptor.prototype._getState=function()
{return this.m_value.state;}
FormElementGUIAdaptor.prototype._setDirty=function(dirty)
{this.m_value.dirty=dirty;}
FormElementGUIAdaptor.prototype._isDirty=function()
{return this.m_value.dirty;}
FormElementGUIAdaptor.prototype._getValueFromView=function()
{return this.m_value;}
FormElementGUIAdaptor.prototype.retrieve=function()
{}
FormElementGUIAdaptor.prototype.initialise=function()
{this.update();}
FormElementGUIAdaptor.prototype._setCurrentFocusedField=function(a)
{var message=null;if(null!=a)
{if(a.supportsProtocol('ValidationProtocol'))
{var lastError=a.getLastError();if(null!=lastError)
{message=lastError.getMessage();}}
if(null==message&&a.supportsProtocol('HelpProtocol'))
{message=a.getHelpText();}}
if(null==message)
{message="OK";}
var date=new Date();var current_time=date.valueOf();if(this.m_transientMessageTimeout==null||current_time-this.m_transientMessageTimeout>FormElementGUIAdaptor.STATUSBAR_TIMEOUT)
{this.setStatusBarMessage(message);}}
FormElementGUIAdaptor.prototype.setStatusBarMessage=function(message)
{if(this.m_statusLine===undefined)
{this.m_statusLine=document.getElementById(this.statusLine);}
if(this.m_statusLine)this.m_statusLine.innerHTML=message;}
FormElementGUIAdaptor.prototype.setTransientMessage=function(message)
{this.setStatusBarMessage(message);var date=new Date();this.m_transientMessageTimeout=date.valueOf();}
FormElementGUIAdaptor.prototype.getModelXPath=function()
{return this.modelXPath;}
FormElementGUIAdaptor.prototype.getModelParentXPath=function()
{var parentXPath=this.getModelXPath();if(FormElementGUIAdaptor.DEFAULT_MODEL_XPATH!=parentXPath)
{parentXPath=XPathUtils.removeTrailingNode(parentXPath);}
return parentXPath;}
FormElementGUIAdaptor.prototype.clearFormDataModel=function()
{var i,j,il,jl,tmpXPath;var removeXPaths=new Array();var dm=FormController.getInstance().getDataModel();var rootNode=dm._getRootNode(dm.m_dom);var rootNodeName=rootNode.nodeName;dm._startTransaction();var rootNodeChildren=rootNode.childNodes;for(i=0,il=rootNodeChildren.length;i<il;i++)
{if(rootNodeChildren[i].nodeType==XML.ELEMENT_NODE)
{var rootChildNodeName=rootNodeChildren[i].nodeName;if(rootChildNodeName!="var")
{tmpXPath="/"+rootNodeName+"/"+rootChildNodeName;removeXPaths[removeXPaths.length]=tmpXPath;}
else
{var varNodeChildren=rootNodeChildren[i].childNodes;for(j=0,jl=varNodeChildren.length;j<jl;j++)
{if(varNodeChildren[j].nodeType==XML.ELEMENT_NODE)
{var varChildNodeName=varNodeChildren[j].nodeName;if(!ArrayUtils.contains(this.m_dmClearExclusionNodes,varChildNodeName))
{tmpXPath="/"+rootNodeName+"/var/"+varChildNodeName;removeXPaths[removeXPaths.length]=tmpXPath;}}}}}}
for(i=0,il=removeXPaths.length;i<il;i++)
{dm.removeNode(removeXPaths[i]);}
this._setDirty(false);dm._endTransaction();}
FormElementGUIAdaptor.prototype.removeSelectedXPaths=function(xPaths)
{if(null!=xPaths)
{var length=xPaths.length;if(length>0)
{var dm=FormController.getInstance().getDataModel();dm._startTransaction();for(var i=0;i<length;i++)
{dm.removeNode(xPaths[i]);}
dm._endTransaction();}}}
FormElementGUIAdaptor.prototype._blockEventsForForm=function(evt)
{if(null==evt){evt=window.event;}
SUPSEvent.preventDefault(evt);return false;}
FormElementGUIAdaptor.prototype._disableDragAndDrop=function(evt)
{if(null==evt){evt=window.event;}
var formElement=this.getElement();if(formElement.attachEvent)
{try
{evt.dataTransfer.effectAllowed="none";}
catch(e)
{SUPSEvent.preventDefault(evt);}}
else if(formElement.addEventListener)
{SUPSEvent.preventDefault(evt);}
return false;}
function SubformElementGUIAdaptor(){};SubformElementGUIAdaptor.prototype=new FormElementGUIAdaptor();SubformElementGUIAdaptor.prototype.constructor=SubformElementGUIAdaptor;SubformElementGUIAdaptor.CSS_CLASS="subform";SubformElementGUIAdaptor.prototype.FORM_REQUIRED_DATABINDING_ROOT=FormDatabindings.DEFAULT_SUBFORM_DATABINDING_ROOT;SubformElementGUIAdaptor.create=function(e)
{var a=new SubformElementGUIAdaptor();a._initialiseAdaptor(e);return a;}
SubformElementGUIAdaptor.prototype._configure=function(cs)
{this.includeInValidation=false;var cancelBusinessLifeCycle=new CancelSubformBusinessLifeCycle();cancelBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(cancelBusinessLifeCycle);var submitSubformBusinessLifeCycle=new SubmitSubformBusinessLifeCycle();submitSubformBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(submitSubformBusinessLifeCycle);var cancel=null;var submit=null;var newCs=new Array();for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.cancelLifeCycle&&cancel==null)
{cancelBusinessLifeCycle.configure(c.cancelLifeCycle);cs[i].cancelLifeCycle=null;}
if(c.submitLifeCycle&&submit==null)
{submitSubformBusinessLifeCycle.configure(c.submitLifeCycle);cs[i].submitLifeCycle=null;}}
cancelBusinessLifeCycle.start();submitSubformBusinessLifeCycle.start();FormElementGUIAdaptor.prototype._configure.call(this,cs);}
SubformElementGUIAdaptor.prototype.renderState=function()
{this._renderForm(SubformElementGUIAdaptor.CSS_CLASS);}
SubformElementGUIAdaptor.prototype.m_dmClearExclusionNodes=new Array("app","form","subform");function TabDef(tabLabel,pageId)
{this.tabLabel=tabLabel;this.pageId=pageId;}
function _fwTab(selector,tdElement,label,pageId)
{this.m_tabSelector=selector;this.m_tdElement=tdElement;this.m_label=label;this.m_pageId=pageId;}
_fwTab.prototype.m_tabSelector=null;_fwTab.prototype.m_enabled=true;_fwTab.prototype.m_label=null;_fwTab.prototype.m_tdElement=null;_fwTab.prototype.m_pageId=null;_fwTab.prototype.m_clickHandler=null;_fwTab.prototype.m_selected=false;_fwTab.prototype.m_submissable=true;_fwTab.prototype.setEnabled=function(enabled)
{if(this.m_enabled!=enabled)
{this.m_enabled=enabled;return true;}
else
{return false;}}
_fwTab.prototype.isEnabled=function()
{return this.m_enabled;}
_fwTab.prototype.setLabel=function(label)
{if(this.m_label!=label)
{this.m_label=label;return true;}
else
{return false;}}
_fwTab.prototype.setSelected=function(selected)
{if(this.m_selected!=selected)
{this.m_selected=selected;return true;}
else
{return false;}}
_fwTab.prototype.isSelected=function(selected)
{return this.m_selected;}
_fwTab.prototype.setSubmissible=function(submissible)
{this.m_submissable=submissible;}
_fwTab.prototype.getPageId=function()
{return this.m_pageId;}
_fwTab.prototype.renderState=function()
{var cellElement=this.m_tdElement;var tdClassName=TabSelector.TAB_CELL_CSS_CLASS;var divClassName=TabSelector.TAB_CELL_DIV_CSS_CLASS;if(this.m_enabled&&this.m_tabSelector.isEnabled())
{if(null==this.m_clickHandler)
{var thisObj=this;this.m_clickHandler=SUPSEvent.addEventHandler(cellElement,"mousedown",function(evt){thisObj.m_tabSelector._onCellClick(thisObj);},false);}
if(this.m_selected)
{tdClassName+=" "+TabSelector.TAB_CELL_SELECTED_CSS_CLASS;if(this.m_tabSelector.m_focussed)
{tdClassName+=" "+TabSelector.TAB_CELL_FOCUSSED_CSS_CLASS;divClassName+=" "+TabSelector.TAB_CELL_DIV_FOCUSSED_CSS_CLASS;if(cellElement.focus)
{cellElement.focus();}}}
if(!this.m_submissable)
{tdClassName+=" "+TabSelector.TAB_CELL_NOT_SUBMISSIBLE_CSS_CLASS;}}
else
{tdClassName+=" "+TabSelector.TAB_CELL_DISABLED_CSS_CLASS;this._removeClickHandler();}
cellElement.className=tdClassName;cellElement.firstChild.className=divClassName;cellElement.firstChild.innerHTML=this.m_label;}
_fwTab.prototype._removeClickHandler=function()
{if(null!=this.m_clickHandler)
{SUPSEvent.removeEventHandlerKey(this.m_clickHandler);this.m_clickHandler=null;}}
_fwTab.prototype.dispose=function()
{this._removeClickHandler();}
function TabSelector(){};TabSelector.prototype=new Renderer();TabSelector.prototype.constructor=TabSelector;TabSelector.prototype.m_cellClickHandlers=null;TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME="tabselectorwrapper";TabSelector.TAB_SELECTOR_CSS_CLASS="tabselector";TabSelector.TAB_CELL_CSS_CLASS="tabCell";TabSelector.TAB_CELL_UNSELECTED_CSS_CLASS="tabCellUnselected";TabSelector.TAB_CELL_SELECTED_CSS_CLASS="tabCellSelected";TabSelector.TAB_CELL_DISABLED_CSS_CLASS="tabCellDisabled";TabSelector.TAB_CELL_FOCUSSED_CSS_CLASS="tabCellFocus";TabSelector.TAB_CELL_NOT_SUBMISSIBLE_CSS_CLASS="tabCellNotSubmissible";TabSelector.TAB_CELL_DIV_CSS_CLASS="tabCellDiv";TabSelector.TAB_CELL_DIV_FOCUSSED_CSS_CLASS="tabCellDivFocus";TabSelector.SPACER_CSS_CLASS="tabSpacer";TabSelector.VISIBILITY_HIDDEN="hidden";TabSelector.VISIBILITY_INHERIT="inherit";TabSelector.VISIBILITY_VISIBLE="visible";TabSelector.TABBED_AREA_CSS_CLASS_NAME="tabbedArea";TabSelector.prototype.m_enabled=true;TabSelector.prototype.m_enabledChanged=false;TabSelector.prototype.m_focussed=false;TabSelector.createInline=function(id,tabDefs)
{var e=Renderer.createInline(id,true);return TabSelector._create(e,tabDefs);}
TabSelector.createAsInnerHTML=function(refElement,relativePos,id,tabDefs)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,true);return TabSelector._create(e,tabDefs);}
TabSelector.createAsChild=function(p,id,tabDefs)
{var e=Renderer.createAsChild(id);p.appendChild(e);return TabSelector._create(e,tabDefs);}
TabSelector._create=function(e,tabDefs)
{e.className=TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME;var r=new TabSelector();r._initRenderer(e);r.m_cellClickHandlers=new Array();preventSelection(e);r.m_tabsTable=Renderer.createElementAsChild(e,"table");r.m_tabsTable.className=TabSelector.TAB_SELECTOR_CSS_CLASS;r.m_tabsTable.setAttribute("cellspacing","0px");r.m_tabsTable.setAttribute("cellpadding","0px");var tbody=Renderer.createElementAsChild(r.m_tabsTable,"tbody");var row=Renderer.createElementAsChild(tbody,"tr");r.m_tabs=new Array(tabDefs.length);var cellIdBase=e.id+"_id";for(var i=0;i<tabDefs.length;i++)
{var tabDef=tabDefs[i];var pageId=tabDef.pageId;var label=tabDef.tabLabel;if(null==pageId||""==pageId||null==label||""==label)
{throw new ConfigurationException("tabDefs parameter must contain objects with a pageId and tabLabel properties");}
var cellId=cellIdBase+i.toString();var cell=Renderer.createElementAsChild(row,"td")
cell.id=cellId;cell.className=TabSelector.TAB_CELL_CSS_CLASS;var cellInnerDiv=Renderer.createElementAsChild(cell,"div");cellInnerDiv.innerHTML=label;cellInnerDiv.className=TabSelector.TAB_CELL_DIV_CSS_CLASS;r.m_tabs[i]=new _fwTab(r,cell,label,pageId);r.m_tabs[i].renderState();}
var spacer=Renderer.createElementAsChild(row,"td");spacer.className=TabSelector.SPACER_CSS_CLASS;spacer.innerHTML="&nbsp;";r.setTabClickHandler(function(clickedTab){r._unmanagedClickHandler(clickedTab);});return r;}
TabSelector.prototype.dispose=function()
{unPreventSelection(this.m_element);for(var i=0,l=this.m_tabs.length;i<l;i++)
{this.m_tabs[i].dispose();}}
TabSelector.prototype._onCellClick=function(clickedTab)
{if(this.m_currentTab!=clickedTab)
{this.m_tabClickHandler.call(null,clickedTab);}}
TabSelector.prototype.setTabClickHandler=function(handler)
{this.m_tabClickHandler=handler;}
TabSelector.prototype._unmanagedClickHandler=function(clickedTab)
{if(null!=this.m_currentTab)
{this.m_currentTab.setSelected(false);this.m_currentTab.renderState();}
this.m_currentTab=clickedTab;this.m_currentTab.setSelected(true);this.m_currentTab.renderState();if(null!=this.m_currentPageElement)
{this.m_currentPageElement.style.visibility=TabSelector.VISIBILITY_HIDDEN;}
this.m_currentPageElement=document.getElementById(this.m_currentTab.getPageId());if(null!=this.m_currentPageElement)
{this.m_currentPageElement.style.visibility=TabSelector.VISIBILITY_INHERIT;}}
TabSelector.prototype._getTabForPageId=function(pageId)
{var t=this.m_tabs;for(var i=0,l=t.length;i<l;i++)
{if(pageId==t[i].getPageId())
{return t[i];}}
return null;}
TabSelector.prototype._getAssociatedPagedArea=function()
{if(null==this.m_associatedPagedArea)
{var kids=this.m_element.parentNode.childNodes;for(var i=0,l=kids.length;i<l;i++)
{var kid=kids[i];if(1==kid.nodeType&&"DIV"==kid.nodeName&&PagedAreaGUIAdaptor.CSS_CLASS_NAME==kid.className)
{this.m_associatedPagedArea=kid;break;}}
if(null==this.m_associatedPagedArea)throw new ConfigurationException("Could not find pagedArea associated with TabSelector: "+this.m_element.id);}
return this.m_associatedPagedArea;}
TabSelector.prototype.setEnabled=function(enabled)
{if(this.m_enabled!=enabled)
{this.m_enabled=enabled;this.m_enabledChanged=!this.m_enabledChanged;return true;}
else
{return false;}}
TabSelector.prototype.isEnabled=function()
{return this.m_enabled;}
TabSelector.prototype.renderState=function()
{if(this.m_enabledChanged)
{var t=this.m_tabs;for(var i=0,l=t.length;i<l;i++)
{t[i].renderState();}
this.m_enabledChanged=false}}
TabSelector.prototype.getAllTabsDisabled=function()
{var t=this.m_tabs;for(var i=0,l=t.length;i<l;i++)
{if(t[i].isEnabled())return false;}
return true;}
TabSelector.prototype.getCurrentlySelectedTab=function()
{var pos=this._getPositionOfCurrentlySelectedTab();return(null==pos?null:this.m_tabs[pos]);}
TabSelector.prototype.setFocus=function(focussed)
{this.m_focussed=focussed;var tab=this.getCurrentlySelectedTab();if(null!=tab)
{tab.renderState();}}
TabSelector.prototype.setTabSelectionState=function(tab,selected)
{if(tab.setSelected(selected))
{tab.renderState();}}
TabSelector.prototype.setTabLabel=function(tab,label)
{if(tab.setLabel(label))
{tab.renderState();}}
TabSelector.prototype.setTabEnablementState=function(tab,enabled)
{if(tab.setEnabled(enabled))
{tab.renderState();}}
TabSelector.prototype.selectPreviousTab=function()
{var initialPos=this._getPositionOfCurrentlySelectedTab();if(null==initialPos)initialPos=0;var pos=initialPos;do
{pos--;if(pos<0)pos=this.m_tabs.length-1;if(this.m_tabs[pos].isEnabled())break;}while(pos!=initialPos);if(pos!=initialPos)
{this._onCellClick(this.m_tabs[pos]);}}
TabSelector.prototype.selectNextTab=function()
{var initialPos=this._getPositionOfCurrentlySelectedTab();if(null==initialPos)initialPos=this.m_tabs.length-1;var pos=initialPos;do
{pos++;if(pos>=this.m_tabs.length)pos=0;if(this.m_tabs[pos].isEnabled())break;}while(pos!=initialPos);if(pos!=initialPos)
{this._onCellClick(this.m_tabs[pos]);}}
TabSelector.prototype._getPositionOfCurrentlySelectedTab=function()
{var t=this.m_tabs;for(var i=0,l=t.length;i<l;i++)
{if(t[i].isSelected())return i;}
return null;}
TabSelector.prototype._setTabSelectorWidth=function()
{var pagedArea=this._getAssociatedPagedArea();var style=getCalculatedStyle(pagedArea);var borderWidth=style.borderRightWidth.slice(0,-2);borderWidth=isNaN(borderWidth)?1:Number(borderWidth);style=getCalculatedStyle(this.m_tabsTable);var marginWidth=style.marginRight.slice(0,-2);marginWidth=isNaN(marginWidth)?2:Math.abs(Number(marginWidth));this.m_element.style.width=pagedArea.offsetWidth+marginWidth+borderWidth+"px";}
function Button()
{}
Button.prototype.m_element=null;Button.prototype.m_inner=null;Button.prototype.m_disabled=false;Button.prototype.m_repeatInterval=0;Button.m_clickedButton=null;Button.m_timeoutID=null;Button.prototype.m_pressed=false;Button.prototype.m_addClasses=null;Button.prototype.m_buttonReleased=true;Button.prototype.m_clickListeners=null;Button.prototype.m_mousedownHandler=null;Button.prototype.m_mouseupHandler=null;Button.prototype.m_mouseoutHandler=null;Button.prototype.m_mouseoverHandler=null;Button.createInline=function(id)
{document.write("<div id='"+id+"'></div>");var e=document.getElementById(id);return Button._createButton(e,null);}
Button.createAsChild=function(p,id,ac)
{var b=document.createElement("div");if(null!=id)b.id=id;p.appendChild(b);return Button._createButton(b,ac);}
Button._createButton=function(be,ac)
{var b=new Button();b.m_element=be;b.m_inner=document.createElement("div");be.appendChild(b.m_inner);preventSelection(be);b.m_disabled=false;b.m_addClasses=ac;b.m_buttonReleased=true;b.m_clickListeners=new CallbackList();b._render();this.m_mousedownHandler=null;this.m_mouseupHandler=null;this.m_mouseoutHandler=null;this.m_mouseoverHandler=null;be.__renderer=b;return b;}
Button.prototype.dispose=function()
{this.m_element.__renderer=null;this.stopEventHandlers();unPreventSelection(this.m_element);this.m_clickListeners.dispose();this.m_clickListeners=null;this.m_element=null;}
Button.prototype.startEventHandlers=function()
{if(null==this.m_mousedownHandler)
{var b=this;b.m_mousedownHandler=SUPSEvent.addEventHandler(b.m_element,"mousedown",function(){b._handleMouseDown();});}}
Button.prototype.stopEventHandlers=function()
{if(null!=this.m_mousedownHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mousedownHandler);this.m_mousedownHandler=null;}
if(null!=this.m_mouseupHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);this.m_mouseupHandler=null;}
if(null!=this.m_mouseoutHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);this.m_mouseoutHandler=null;}
if(null!=this.m_mouseoverHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler);this.m_mouseoverHandler=null;}}
Button.prototype.setDisable=function(disable)
{if(this.m_disabled!=disable)
{this.m_disabled=disable;this._render();}}
Button.prototype.addClickListener=function(cb)
{this.m_clickListeners.addCallback(cb);}
Button.prototype.setRepeatInterval=function(initialDelay,repeatInterval)
{this.m_initialDelay=initialDelay;this.m_repeatInterval=repeatInterval;}
Button.prototype._handleMouseDown=function()
{this.m_pressed=true;this.m_buttonReleased=false;b=this;if(null==this.m_mouseupHandler)
{this.m_mouseupHandler=SUPSEvent.addEventHandler(document,"mouseup",function(){b._handleMouseUp();},null);}
if(null==this.m_mouseoutHandler)
{this.m_mouseoutHandler=SUPSEvent.addEventHandler(this.m_element,"mouseout",function(){b._handleMouseOut();},null);}
if(null==this.m_mouseoverHandler)
{this.m_mouseoverHandler=SUPSEvent.addEventHandler(this.m_element,"mouseover",function(){b._handleMouseOver();},null);}
this._render();if(0!=this.m_repeatInterval)
{Button.m_clickedButton=this;this._startRepeat(this.m_initialDelay);}}
Button._clickRepeat=function()
{var b=Button.m_clickedButton;if(b!=null)
{b._startRepeat(b.m_repeatInterval);}}
Button.prototype._startRepeat=function(timeout)
{this.m_clickListeners.invoke();Button.m_timeoutID=setTimeout("Button._clickRepeat()",timeout);}
Button.prototype._handleMouseUp=function()
{this.m_pressed=false;this.m_buttonReleased=true;this._render();SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler);this.m_mouseupHandler=null;this.m_mouseoutHandler=null;this.m_mouseoverHandler=null;if(0==this.m_repeatInterval)
{this.m_clickListeners.invoke();}
else
{if(null!=Button.m_timeoutID)
{clearTimeout(Button.m_timeoutID);Button.m_timeoutID=null;}}
Button.m_clickedButton=null;}
Button.prototype._handleMouseOut=function()
{this.m_pressed=false;this._render();}
Button.prototype._handleMouseOver=function()
{this.m_pressed=!this.m_buttonReleased;this._render();}
Button.prototype._render=function()
{var oc="button";var ic="button_inner";var ac="";if(this.m_disabled)
{ac+=" disabled";}
else
{if(this.m_pressed)
{ac+=" pressed";}}
this.m_inner.className=ic+ac;if(null!=this.m_addClasses)
{ac+=" "+this.m_addClasses;}
this.m_element.className=oc+ac;}
var isIE=!(document.implementation&&document.implementation.createDocument);function Scrollbar()
{}
Scrollbar.m_logger=new Category("Scrollbar");Scrollbar.MINIMUM_HEIGHT=40;Scrollbar.prototype.m_element=null;Scrollbar.prototype.m_vertical=true;Scrollbar.prototype.m_decButton=null;Scrollbar.prototype.m_container=null;Scrollbar.prototype.m_slider=null;Scrollbar.prototype.m_sliderInner=null;Scrollbar.prototype.m_incButton=null;Scrollbar.prototype.m_min=0;Scrollbar.prototype.m_max=100;Scrollbar.prototype.m_proportion=100;Scrollbar.prototype.m_position=0;Scrollbar.prototype.m_increment=100;Scrollbar.prototype.m_dragStartX=null;Scrollbar.prototype.m_dragStartY=null;Scrollbar.prototype.m_changeListeners=null;Scrollbar.prototype.m_mousedownHandler=null;Scrollbar.prototype.m_mouseupHandler=null;Scrollbar.prototype.m_mousemoveHandler=null;Scrollbar.prototype.m_registerWithStyleManager=null;Scrollbar.prototype.m_resetVScrollbarHeight=null;Scrollbar.REPEAT_INITIAL_DELAY=250;Scrollbar.REPEAT_INTERVAL=100;Scrollbar.createInline=function(id,vertical,registerWithStyleManager)
{document.write("<div id='"+id+"'></div>");var e=document.getElementById(id);return Scrollbar._create(e,vertical,null,registerWithStyleManager);}
Scrollbar.createAsChild=function(p,id,vertical,ac,registerWithStyleManager)
{var e=document.createElement("div");if(null!=id)e.id=id;p.appendChild(e);return Scrollbar._create(e,vertical,ac,registerWithStyleManager);}
Scrollbar._create=function(sbe,vertical,ac,registerWithStyleManager)
{var sb=new Scrollbar();sb.m_element=sbe;sb.m_element.className="scrollbar scrollbar_"+(vertical?"vertical":"horizontal");if(registerWithStyleManager==false)
{sb.m_registerWithStyleManager=false;}
else
{sb.m_registerWithStyleManager=true;}
if(isIE)
{sbe.style.height=Scrollbar._calculateHeight(sbe)+"px";if(vertical&&sb.m_registerWithStyleManager)
{sb._registerResetVScrollBarHeight();}}
sb.m_vertical=vertical;sb.m_decButton=Button.createAsChild(sb.m_element,null,"dec");sb.m_decButton.setRepeatInterval(Scrollbar.REPEAT_INITIAL_DELAY,Scrollbar.REPEAT_INTERVAL);sb.m_decButton.addClickListener(function(){sb._handleDecrementClick();});sb.m_container=document.createElement("div");sb.m_container.className="scrollbar_container";sb.m_element.appendChild(sb.m_container);sb.m_slider=document.createElement("div");sb.m_slider.className="scrollbar_slider button";sb.m_container.appendChild(sb.m_slider);var sliderInner=document.createElement("div");sliderInner.className="button_inner";sb.m_slider.appendChild(sliderInner);sb.m_incButton=Button.createAsChild(sb.m_element,null,"inc");sb.m_incButton.setRepeatInterval(Scrollbar.REPEAT_INITIAL_DELAY,Scrollbar.REPEAT_INTERVAL);sb.m_incButton.addClickListener(function(){sb._handleIncrementClick();});sb.m_min=0;sb.m_max=100;sb.m_proportion=100;sb.m_position=0;sb.m_increment=100;sb.m_dragStartX=null;sb.m_dragStartY=null;sb.m_dragStartSliderX=null;sb.m_dragStartSliderY=null;sb.m_changeListeners=new CallbackList();sb.m_mousedownHandler=null;sb.m_mouseupHandler=null;sb.m_mousemoveHandler=null;sb._render();sbe.__renderer=sb;return sb;}
Scrollbar.prototype.dispose=function()
{this.stopEventHandlers();this.m_incButton.dispose();this.m_decButton.dispose();this.m_element.__renderer=null;this.m_changeListeners.dispose();this.m_changeListeners=null;if(isIE&&this.m_vertical&&this.m_registerWithStyleManager)
{this._unregisterResetVScrollBarHeight();}}
Scrollbar.prototype.startEventHandlers=function()
{var sb=this;sb.m_mousedownHandler=SUPSEvent.addEventHandler(sb.m_slider,"mousedown",function(e){sb._handleDragMouseDown(e);},null);sb.m_containerMouseDownHandler=SUPSEvent.addEventHandler(sb.m_container,"mousedown",function(e){sb._handleMouseDownContainer(e);},null);sb.m_containerMouseUpHandler=SUPSEvent.addEventHandler(sb.m_container,"mouseup",function(e){sb._handleMouseUpContainer(e);},null);this.m_incButton.startEventHandlers();this.m_decButton.startEventHandlers();}
Scrollbar.prototype.stopEventHandlers=function()
{this.m_incButton.stopEventHandlers();this.m_decButton.stopEventHandlers();if(null!=this.m_mousedownHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mousedownHandler);this.m_mousedownHandler=null;}
if(null!=this.m_mouseupHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);this.m_mouseupHandler=null;}
if(null!=this.m_mousemoveHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);this.m_mouseoutHandler=null;}
if(null!=this.m_containerMouseDownHandler)
{SUPSEvent.removeEventHandlerKey(this.m_containerMouseDownHandler);this.m_containerMouseDownHandler=null;}
if(null!=this.m_containerMouseUpHandler)
{SUPSEvent.removeEventHandlerKey(this.m_containerMouseUpHandler);this.m_containerMouseUpHandler=null;}}
Scrollbar.prototype.addPositionChangeListener=function(cb)
{this.m_changeListeners.addCallback(cb);}
function ScrollbarCalculateHeightId(id)
{var sb=document.getElementById(id);return sb==null?Scrollbar.MINIMUM_HEIGHT:Scrollbar._calculateHeight(sb);}
Scrollbar._calculateHeight=function(scrollbar)
{var parent=scrollbar.parentElement;var height=parent.offsetHeight;return height<Scrollbar.MINIMUM_HEIGHT?Scrollbar.MINIMUM_HEIGHT:parent.offsetHeight;}
Scrollbar.prototype.setScaling=function(min,max,proportion,increment)
{this.m_min=min;this.m_max=max;this.m_proportion=proportion;this.m_increment=null==increment?proportion:increment;this._render();}
Scrollbar.prototype.setPosition=function(position)
{this.m_position=position;}
Scrollbar.prototype.getPosition=function()
{return this.m_position;}
Scrollbar.prototype._render=function()
{if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._render");var range=this.m_max-this.m_min;var scale;var start;if(0==range)
{scale=1;start=0;}
else
{scale=range/this.m_proportion;start=this.m_position;}
if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Range: "+range+"\nScale: "+scale+"\nStart: "+start);if(this.m_vertical)
{if(isIE)
{this.m_element.style.height=Scrollbar._calculateHeight(this.m_element);}
this.m_container.style.top=this.m_incButton.m_element.offsetHeight+"px";if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: this.m_container.style.top: "+this.m_container.style.top+"\nthis.m_incButton.m_element.offsetHeight: "+this.m_incButton.m_element.offsetHeight);this.m_container.style.height=(this.m_element.offsetHeight-(this.m_incButton.m_element.offsetHeight+this.m_decButton.m_element.offsetHeight))+"px";var buttonSize=Math.floor(this.m_container.offsetHeight*scale);if(buttonSize<10)buttonSize=10;var a=this.m_proportion-(this.m_max-this.m_min);var top=a==0?0:(start*(this.m_container.offsetHeight-this.m_slider.offsetHeight))/a;top=Math.floor(top);if(top>(this.m_container.offsetHeight-buttonSize))
{top=(this.m_container.offsetHeight-buttonSize);}
this.m_slider.style.height=buttonSize+"px";this.m_slider.style.top=top+"px";this.m_sliderTop=top;this.m_sliderHeight=buttonSize;if(isIE)
{var sliderHeight=this.m_slider.offsetHeight-4;var sliderWidth=this.m_slider.offsetWidth-4;if(sliderHeight>0){this.m_slider.firstChild.style.height=sliderHeight+"px";}
if(sliderWidth>0){this.m_slider.firstChild.style.width=sliderWidth+"px";}}
if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: top: "+top+"\nthis.m_slider.style.top: "+this.m_slider.style.top);if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Vertical\nButtonSize: "+buttonSize+"\nTop Pos: "+top+"\nContainer height: "+this.m_container.offsetHeight);}
else
{var buttonSize=Math.floor(this.m_container.offsetWidth*scale);if(buttonSize<10)buttonSize=10;var a=this.m_proportion-(this.m_max-this.m_min);var top=a==0?0:(start*(this.m_container.offsetWidth-this.m_slider.offsetWidth))/a;top=Math.floor(top);if(top>(this.m_container.offsetWidth-buttonSize))
{top=(this.m_container.offsetWidth-buttonSize);}
this.m_slider.style.width=buttonSize+"px";this.m_slider.style.left=top+"px";}}
Scrollbar.prototype._handleDragMouseDown=function(e)
{if(null==e)e=window.event;this.m_dragStartX=e.screenX;this.m_dragStartY=e.screenY;this.m_dragStartSliderX=this.m_slider.offsetLeft;this.m_dragStartSliderY=this.m_slider.offsetTop;var s=this;if(null==this.m_mouseupHandler)
{this.m_mouseupHandler=SUPSEvent.addEventHandler(document,"mouseup",function(){s._handleDragMouseUp();},null);}
if(null==this.m_mousemoveHandler)
{this.m_mousemoveHandler=SUPSEvent.addEventHandler(document,"mousemove",function(){s._handleDragMouseMove(e);},null);}}
Scrollbar.prototype._handleDragMouseUp=function()
{SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);SUPSEvent.removeEventHandlerKey(this.m_mousemoveHandler);this.m_mouseupHandler=null;this.m_mousemoveHandler=null;}
Scrollbar.prototype._handleDragMouseMove=function(e)
{if(null==e)e=window.event;var pos;var range;var size;var delta;if(this.m_vertical)
{delta=e.screenY-this.m_dragStartY;pos=this.m_dragStartSliderY+delta;range=this.m_container.offsetHeight;size=this.m_slider.offsetHeight;}
else
{delta=e.screenX-this.m_dragStartX;pos=this.m_dragStartSliderX+delta;range=this.m_container.offsetWidth;size=this.m_slider.offsetWidth;}
if(delta>0)
{if(pos+size>range)pos=range-size;}
else
{if(pos<0)pos=0;}
var scrollEmptySize=range-size;var logicalRange=this.m_proportion-(this.m_max-this.m_min);var scaledPosition=this.m_min+((pos*logicalRange)/scrollEmptySize);this.m_position=parseInt(scaledPosition.toFixed(0));if(this.m_vertical)
{this.m_slider.style.top=pos+"px";}
else
{this.m_slider.style.left=pos+"px";}
this.m_changeListeners.invoke(pos,range,size);}
Scrollbar.prototype._setScrollbarTimeout=function()
{var numPages=this.m_proportion/(this.m_max-this.m_min);if(numPages<5)numPages=5;var timer=20+Math.round(600/numPages);Scrollbar.scrollTimeout=timer;}
Scrollbar.prototype._handleMouseDownContainer=function(evt)
{var target=SUPSEvent.getTargetElement(evt);if(target.className=="scrollbar_container")
{Scrollbar.scrollTimeout=35;if(evt.layerY!=null)
{Scrollbar.clickY=evt.layerY;}
else
{Scrollbar.clickY=evt.offsetY;}
if(Scrollbar.clickY<this.m_sliderTop)
{Scrollbar.direction="UP";}
else
{Scrollbar.direction="DOWN";}
Scrollbar.currentScrollbar=this;Scrollbar.mouseDownTimeout=setTimeout("Scrollbar._handleContainerScroll()",Scrollbar.scrollTimeout);}}
Scrollbar.prototype._handleMouseUpContainer=function(evt)
{if(null==evt)evt=window.event;if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleMouseUpContainer()");Scrollbar.currentScrollbar=null;clearTimeout(Scrollbar.mouseDownTimeout);Scrollbar.mouseDownTimeout=null;}
Scrollbar._handleContainerScroll=function()
{if(Scrollbar.currentScrollbar!=null)
{var scrollbar=Scrollbar.currentScrollbar;var numberOfRows=scrollbar.m_max-scrollbar.m_min;var scrolled=false;if(Scrollbar.direction=="UP")
{if(Scrollbar.clickY<scrollbar.m_sliderTop)
{if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleClickContainer() clicked above slider so page up");scrollbar.m_position=scrollbar.m_position-numberOfRows;if(scrollbar.m_position<scrollbar.m_min)
{scrollbar.m_position=scrollbar.m_min;}
scrolled=true;}}
else
{if(Scrollbar.clickY>scrollbar.m_sliderTop+scrollbar.m_sliderHeight)
{if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleClickContainer() clicked below slider so page down");scrollbar.m_position=scrollbar.m_position+numberOfRows;if(scrollbar.m_position>=scrollbar.m_proportion-numberOfRows)
{scrollbar.m_position=scrollbar.m_proportion-numberOfRows;}
scrolled=true;}}
if(scrolled==true)
{scrollbar.m_changeListeners.invoke();Scrollbar.mouseDownTimeout=setTimeout("Scrollbar._handleContainerScroll()",Scrollbar.scrollTimeout);}}}
Scrollbar.prototype._handleIncrementClick=function()
{if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._handleIncrementClick");if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: this.m_position == "+this.m_position+" this.m_proportion ==  "+this.m_proportion+" this.m_max == "+this.m_max+" this.m_min == "+this.m_min);if(this.m_position<(this.m_proportion-(this.m_max-this.m_min)))
{this.m_position++;this._render();this.m_changeListeners.invoke();}}
Scrollbar.prototype._handleDecrementClick=function()
{if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._handleDecrementClick");if(Scrollbar.m_logger.isTrace())Scrollbar.m_logger.trace("SCROLLBAR: this.m_position == "+this.m_position+" this.m_min == "+this.m_min);if(this.m_position>this.m_min)
{this.m_position--;this._render();this.m_changeListeners.invoke();}}
Scrollbar.prototype._registerResetVScrollBarHeight=function()
{var ac=Services.getAppController();if(null!=ac)
{var sm=ac.getStyleManager();if(null!=sm)
{var thisObj=this;this.m_resetVScrollbarHeight=function(){return thisObj._resetVScrollbarHeight();};sm.registerOnLoadHandler(this.m_resetVScrollbarHeight,document);}}}
Scrollbar.prototype._unregisterResetVScrollBarHeight=function()
{var ac=Services.getAppController();var sm=ac.getStyleManager();sm.unregisterOnLoadHandler(this.m_resetVScrollbarHeight,document);this.m_resetVScrollbarHeight=null;}
Scrollbar.prototype._resetVScrollbarHeight=function()
{this.m_element.style.height="auto";this._render();}
function Grid()
{}
Grid.createInline=function(id,columns,rows,groupSize)
{GridRenderer.createInline(id,columns,rows,groupSize);}
Grid.createAsInnerHTML=function(refElement,relativePos,id,columns,rows,groupSize)
{GridRenderer.createAsInnerHTML(refElement,relativePos,id,columns,rows,groupSize);}
Grid.createAsChild=function(p,id,columns,rows,groupSize,ac)
{return GridRenderer.createAsChild(p,id,columns,rows,groupSize,ac);}
Grid.determineBrowser=function()
{switch(navigator.appName)
{case"Netscape":{Grid.isIE=false;Grid.isMoz=true;break;}
case"Microsoft Internet Explorer":{Grid.isIE=true;Grid.isMoz=false;break;}
default:{alert("Unknown browser type");break;}}}
function FilteredGrid()
{}
FilteredGrid.CSS_CLASS_NAME="filteredGrid";FilteredGrid.GRID_ID_SUFFIX="_filtered_grid";FilteredGrid.createInline=function(id,columns,rows,groupSize,ac)
{var e=Renderer.createInline(id,true);e.className=FilteredGrid.CSS_CLASS_NAME;Grid.createAsInnerHTML(e,Renderer.CHILD_ELEMENT,id+FilteredGrid.GRID_ID_SUFFIX,columns,rows,groupSize);FilteredGrid._create(e,id,columns,rows,groupSize,ac);}
FilteredGrid.createAsInnerHTML=function(refElement,relativePos,id,columns,rows,groupSize)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,true);e.className=FilteredGrid.CSS_CLASS_NAME;Grid.createAsInnerHTML(e,Renderer.CHILD_ELEMENT,id+FilteredGrid.GRID_ID_SUFFIX,columns,rows,groupSize);FilteredGrid._create(e,id,columns,rows,groupSize,null);}
FilteredGrid.createAsChild=function(p,id,columns,rows,groupSize,ac)
{var e=Renderer.createAsChild(id);e.className=FilteredGrid.CSS_CLASS_NAME;Grid.createAsChild(e,id+FilteredGrid.GRID_ID_SUFFIX,columns,rows,groupSize,ac);FilteredGrid._create(e,id,columns,rows,groupSize,ac);p.appendChild(e);}
FilteredGrid._create=function(e,id,columns,rows,groupSize,ac)
{var filterDiv=document.createElement("div");e.appendChild(filterDiv);var gridFilterContainer=document.createElement("div");gridFilterContainer.className="grid_filter";filterDiv.appendChild(gridFilterContainer);var gridFilterRow=document.createElement("div");gridFilterContainer.appendChild(gridFilterRow);var columnHeadersRequired=false;if((typeof columns=="object")&&(columns.constructor==Array))
{columnHeadersRequired=true;}
else if(typeof columns=="number")
{if(columns!=parseInt(columns.toString()))
{throw new ConfigurationException("Grid argument columns must be an integer value.");}
else
{if(columns<=0)
{throw new ConfigurationException("Number of columns in grid should be greater than zero.");}}}
else
{throw new ConfigurationException("Grid columns argument must contain an array of column names or the number of columns only.");}
var numberOfColumns;if(columnHeadersRequired)
{numberOfColumns=columns.length;}
else
{numberOfColumns=columns;}
for(var i=0;i<numberOfColumns;i++)
{var inputElement=document.createElement("input");var inputId=id+"_column_filter_col"+i;inputElement.id=inputId;var cN="grid_filter_cell col"+i;inputElement.className=cN;gridFilterRow.appendChild(inputElement);}}
function RenderEventQueue()
{this.m_queue=new Array()}
RenderEventQueue.prototype.addEvent=function(event)
{this.m_queue[this.m_queue.length]=event;}
RenderEventQueue.prototype.getEvents=function()
{return this.m_queue;}
RenderEventQueue.prototype.clear=function()
{this.m_queue.length=0;}
function ColumnSortConfiguration(){};ColumnSortConfiguration.prototype.m_columnNumber=null;ColumnSortConfiguration.prototype.m_comparator=null;ColumnSortConfiguration.prototype.m_sortAsc;function GridRowRange(model,startRowNumber,numberOfRows)
{this.m_model=model;this.m_startRowNumber=parseInt(startRowNumber);this.m_numberOfRows=parseInt(numberOfRows);this._calculateEndRowNumber();if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridRowRange() startRowNumber = "+startRowNumber+", numberOfRows = "+numberOfRows);}
GridRowRange.prototype.isRowVisible=function(rowNumber)
{var result=false;if(rowNumber>=this.m_startRowNumber&&rowNumber<=this.m_endRowNumber)
{result=true;}
if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.m_model.getId()+" : GridRowRange.isRowVisible(rowNumber = "+rowNumber+") startRowNumber = "+this.m_startRowNumber+", endRowNumber = "+this.m_endRowNumber+", returning "+result);return result;}
GridRowRange.prototype.getStartRowNumber=function()
{return this.m_startRowNumber;}
GridRowRange.prototype.setStartRowNumber=function(startRowNumber)
{if(startRowNumber<0)
{startRowNumber=0;}
if(this.m_startRowNumber!=startRowNumber)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridRowRange.setStartRowNumber() new startRowNumber = "+startRowNumber+". About to refresh all view rows.");this.m_startRowNumber=startRowNumber;this._calculateEndRowNumber();this.m_model.refreshAllViewRows();this.m_model.setVerticalScrollBarPosition(startRowNumber);}}
GridRowRange.prototype.getEndRowNumber=function()
{return this.m_endRowNumber;}
GridRowRange.prototype._calculateEndRowNumber=function()
{this.m_endRowNumber=parseInt((this.m_startRowNumber+this.m_numberOfRows))-1;}
GridRowRange.prototype.getNumberOfRows=function()
{return this.m_numberOfRows;}
function GridModel(adaptor)
{this.m_adaptor=adaptor;this.m_rowRenderEventQueue=new RenderEventQueue();this.m_columnRenderEventQueue=new RenderEventQueue();this.m_gridModelEvent=null;this.m_data=new Array();this.m_columns=new Array();this.m_isSortable=true;this.m_cursorRow=0;this.m_verticalScrollBarScale=0;this.m_verticalScrollBarPosition=0;this.m_valid=true;this.m_enabled=true;this.m_readOnly=false;this.m_hasFocus=false;this.m_active=true;}
GridModel.prototype.dispose=function()
{this.m_gridRenderer=null;this.m_adaptor=null;}
GridModel.prototype._getDebugInfo=function()
{var debug="GridModel id:"+this.getId()+", multipleSelection:"+this.m_multipleSelection+", cursorRow:"+this.m_cursorRow;debug+=" \ndata: length = "+this.m_data.length;for(var i=0;i<this.m_data.length;i++)
{debug+=", data["+i+"].key = "+this.m_data[i].key;}
return debug;}
GridModel.prototype.getId=function()
{return this.m_adaptor.getId();}
GridModel.prototype.setView=function(gridRenderer)
{this.m_gridRenderer=gridRenderer;gridRenderer.setModel(this);this.m_rowRange=new GridRowRange(this,0,gridRenderer.getNumberOfRowsInView());this.setVerticalScrollBarScale();}
GridModel.prototype.getRowRange=function()
{var rowRange=new Object();rowRange.startRowNumber=this.m_rowRange.getStartRowNumber();rowRange.numberOfRowsInView=parseInt(rowRange.startRowNumber)+parseInt(this.m_gridRenderer.getNumberOfRowsInView());rowRange.maxNumberOfRows=this.m_data.length;return rowRange;}
GridModel.prototype.getCurrentSelectedRow=function()
{return this.getDataRowNumberByKey(Services.getValue(this.m_dataBinding));}
GridModel.prototype.getSelectedRows=function()
{var selectedRowsDataNumbers=new Array();var keys=Services.getNode(this.m_dataBinding);if(keys!=null)
{var keyXPath=this.getKeyXPath();var keyNodes=keys.selectNodes(keyXPath);for(var j=0,l=keyNodes.length;j<l;j++)
{var key=XML.getNodeTextContent(keyNodes[j]);selectedRowsDataNumbers[selectedRowsDataNumbers.length]=this.getDataRowNumberByKey(key);}}
return selectedRowsDataNumbers;}
GridModel.prototype.getView=function()
{return this.m_gridRenderer;}
GridModel.prototype.getAdaptor=function()
{return this.m_adaptor;}
GridModel.prototype.handleRowAggregateStateChangeEvent=function(event)
{var key=event.getKey();var dataRowNumber=this.getDataRowNumberByKey(key);if(dataRowNumber!=null)
{var dataRow=this.m_data[dataRowNumber];dataRow.submissible=event.getIsSubmissible();var event=new RowRenderEvent(dataRowNumber,key,"handleRowAggregateStateChangeEvent");this.publishRowRenderEvent(event);}}
GridModel.prototype.publishGridRenderEvent=function(event)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.publishGridRenderEvent() event = "+event.toString());this.m_valid=event.getValid();this.m_serverValid=event.getServerValid();this.m_enabled=event.getEnabled();this.m_readOnly=event.getReadOnly();this.m_hasFocus=event.getHasFocus();this.m_active=event.getActive();this.m_isSubmissible=event.getIsSubmissible();this.m_gridModelEvent=event;}
GridModel.prototype.publishVerticalScrollbarRenderEvent=function(event)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.publishVerticalScrollbarRenderEvent() event = "+event.toString());this.m_verticalScrollbarEvent=event;}
GridModel.prototype.publishRowRenderEvent=function(event)
{if(GridGUIAdaptor.m_logger.isDebug())
{GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.publishRowRenderEvent() event = "+event.toString());var viewRowNumber=event.getViewRowNumber();if(viewRowNumber<0||viewRowNumber>this.m_rowRange.getNumberOfRows())
{GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.publishRowRenderEvent() warning, the view row number exceeds the actual number of rows in the view");}}
this.m_rowRenderEventQueue.addEvent(event);}
GridModel.prototype.publishColumnRenderEvent=function(event)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.publishColumnRenderEvent() event = "+event.toString());this.m_columnRenderEventQueue.addEvent(event);}
GridModel.prototype.getViewRowNumberFromDataRowNumber=function(dataRowNumber)
{var startRowNumber=this.m_rowRange.getStartRowNumber();var viewRowNumber=parseInt(dataRowNumber)-parseInt(startRowNumber);return viewRowNumber;}
GridModel.prototype.processRenderEvents=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents()");var renderer=this.m_gridRenderer;var events=this.m_rowRenderEventQueue.getEvents();var processedEvents=new Array();if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents() number of row render events = "+events.length);for(var i=events.length-1;i>=0;i--)
{var event=events[i];var rowKey=event.getKey();if(processedEvents[""+rowKey]==null||rowKey==null)
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.processRenderEvents() event number "+i+" for row with key = "+rowKey);var dataRowNumber=event.getDataRowNumber();if(this.m_rowRange.isRowVisible(dataRowNumber))
{event.setViewRowNumber(this.getViewRowNumberFromDataRowNumber(dataRowNumber));renderer.handleRowRenderEvent(event);}
else
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.processRenderEvents() event number "+i+" dataRowNumber "+dataRowNumber+" is not visible, therefore not sending event to view");}
processedEvents[rowKey]=true;}
else
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.processRenderEvents() ignoring event number "+i+" rowKey = "+rowKey+", processedEvents[rowKey] = "+processedEvents[""+rowKey]);}}
this.m_rowRenderEventQueue.clear();var events=this.m_columnRenderEventQueue.getEvents();if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents() number of column render events = "+events.length);for(var i=0,l=events.length;i<l;i++)
{var event=events[i];if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.processRenderEvents() event for column number = "+event.getColumnNumber());renderer.handleColumnRenderEvent(event);}
this.m_columnRenderEventQueue.clear();var gridModelEvent=this.m_gridModelEvent;if(gridModelEvent!=null)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents() grid event is not null therefore processing");renderer.handleGridRenderEvent(gridModelEvent);this.m_gridModelEvent=null;}
var verticalScrollbarEvent=this.m_verticalScrollbarEvent;var previousVerticalScrollbarEvent=this.m_previousVerticalScrollbarEvent;if(verticalScrollbarEvent!=null)
{if(previousVerticalScrollbarEvent!=null&&previousVerticalScrollbarEvent.equals(verticalScrollbarEvent))
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents() scrollbar event is the same as the previous event, therefore not processing");}
else
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.processRenderEvents() scrollbar event is not null therefore processing");renderer.handleVerticalScrollbarRenderEvent(verticalScrollbarEvent);}
this.m_previousVerticalScrollbarEvent=verticalScrollbarEvent;this.m_verticalScrollbarEvent=null;}}
GridModel.prototype.getColumns=function()
{return this.m_columns;}
GridModel.prototype.setColumns=function(columns)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.setColumns() "+((columns!=null)?"number of columns = "+columns.length:"columns is null!"));var renderer=this.getView();this.m_columns.length=0;for(var i=0,l=columns.length;i<l;i++)
{var column=columns[i];this.m_columns[i]=ColumnHeader.create(this,i,column);var sortComparator=(this.m_isSortable==true)?column.sort:"disabled";renderer.configureHeaderSorting(i,sortComparator);}}
GridModel.prototype.getData=function()
{return this.m_data;}
GridModel.prototype.setData=function(data)
{this.m_data=data;this.resetStartRowNumberAfterDataChange();this.setVerticalScrollBarScale();}
GridModel.prototype.resetStartRowNumberAfterDataChange=function()
{var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();var maxStartRowNumber=maxNumberOfRows-numberOfRowsInView;if(maxStartRowNumber<0)
{maxStartRowNumber=0;}
var startRowNumber=this.m_rowRange.getStartRowNumber();if(maxStartRowNumber<startRowNumber)
{this.m_rowRange.setStartRowNumber(maxStartRowNumber);}}
GridModel.prototype.getRowRenderingRule=function()
{return this.m_rowRenderingRule;}
GridModel.prototype.setRowRenderingRule=function(rowRenderingRule)
{this.m_rowRenderingRule=rowRenderingRule;}
GridModel.prototype.refreshAllViewRows=function()
{var startRowNumber=this.m_rowRange.getStartRowNumber();var endRowNumber=this.m_rowRange.getEndRowNumber();if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.refreshAllViewRows() startRowNumber = "+startRowNumber+", endRowNumber = "+endRowNumber);for(var i=startRowNumber;i<=endRowNumber;i++)
{var rowData=this.m_data[i];var key=null;if(rowData!=null)
{key=rowData.key;}
var event=new RowRenderEvent(i,key,"refreshAllViewRows");this.publishRowRenderEvent(event);}}
GridModel.prototype.getDataRowByDataRowNumber=function(rowNumber)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.getDataRowByDataRowNumber() dataRowNumber = "+rowNumber);var dataRow=null;var row=this.m_data[rowNumber];if(row!=null)
{dataRow=DataRow.create(row);if(null!=this.m_rowRenderingRule)
{var additionalStylingClasses=this.m_rowRenderingRule.call(this.m_adaptor,dataRow.getKey());dataRow.setAdditionalStylingClasses(additionalStylingClasses);}}
return dataRow;}
GridModel.prototype.getDataRowNumberByKey=function(key)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.getDataRowNumberByKey() key = "+key);var dataRowNumber=this.m_data["key:"+key];if(this.m_data[dataRowNumber]==null)dataRowNumber=null;return dataRowNumber;}
GridModel.prototype.refreshDataBinding=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.refreshDataBinding()");var db=this.m_dataBinding;if(null!=db)
{this.m_selectionStrategy.refreshSelectionsFromDataBinding();}}
GridModel.prototype.filterSrcData=function(dataModelEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.filterSrcData() dataModelEvent = "+dataModelEvent.toString());this.refreshSrcData(dataModelEvent);this.resetStartRowNumberAfterDataChange();}
GridModel.prototype.refreshSrcData=function(dataModelEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.refreshSrcData() dataModelEvent = "+dataModelEvent.toString());this.getDataLoadingStrategy().refreshSrcData(dataModelEvent);this._sortData();this.m_selectionStrategy.resetRowStatesAfterSrcDataRefresh();}
GridModel.prototype.getKeyXPath=function()
{return this.m_keyXPath;}
GridModel.prototype.setKeyXPath=function(keyXPath)
{this.m_keyXPath=keyXPath;}
GridModel.prototype.getRowXPath=function()
{return this.m_rowXPath;}
GridModel.prototype.setRowXPath=function(rowXPath)
{this.m_rowXPath=rowXPath;}
GridModel.prototype.setMultipleSelectionMode=function(multipleSelection)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.setMultipleSelectionMode() multipleSelection = "+multipleSelection);this.m_multipleSelection=multipleSelection;this.m_selectionStrategy=GridSelectionStrategy.createGridSelectionStrategy(this,multipleSelection);}
GridModel.prototype.setDataBinding=function(dataBinding)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.setDataBinding() dataBinding = "+dataBinding);this.m_dataBinding=dataBinding;}
GridModel.prototype.setIsSortable=function(isSortable)
{this.m_isSortable=isSortable;}
GridModel.prototype.getDataLoadingStrategy=function()
{if(this.m_currentDataLoadingStrategy==null)
{this.m_currentDataLoadingStrategy=new LoadCompleteDataStrategy(this);}
return this.m_currentDataLoadingStrategy;}
GridModel.prototype.isGridSelectable=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.isGridSelectable() this.m_readOnly = "+this.m_readOnly+", this.m_enabled = "+this.m_enabled+", this.m_active = "+this.m_active+", returning "+(this.m_readOnly==false&&this.m_enabled==true&&this.m_active==true));return(this.m_readOnly==false&&this.m_enabled==true&&this.m_active==true);}
GridModel.prototype.selectRow=function(selectEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.selectRow() selectEvent = "+selectEvent.toString());if(this.isGridSelectable())
{var startRowNumber=this.m_rowRange.getStartRowNumber();var viewRowNumber=selectEvent.getViewRowNumber();var dataRowNumber=parseInt(startRowNumber)+parseInt(viewRowNumber);this.m_selectionStrategy.selectRow(dataRowNumber,false);}}
GridModel.prototype.setCursorRow=function(dataRowNumber)
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.setCursorRow() dataRowNumber = "+dataRowNumber);var currentCursorDataRowNumber=this.m_cursorRow;if(currentCursorDataRowNumber>=this.m_data.length)
{currentCursorDataRowNumber=this.m_data.length-1;}
var currentCursorDataRow=this.m_data[currentCursorDataRowNumber];if(currentCursorDataRow!=null)
{if(this.m_rowRange.isRowVisible(currentCursorDataRowNumber))
{var event=new RowRenderEvent(currentCursorDataRowNumber,currentCursorDataRow.key,"setCursorRow");this.publishRowRenderEvent(event);}
currentCursorDataRow.cursor=false;var dataRow=this.m_data[dataRowNumber];this.m_cursorRow=dataRowNumber;if(dataRow!=null)
{dataRow.cursor=true;if(this.m_rowRange.isRowVisible(dataRowNumber))
{var event=new RowRenderEvent(dataRowNumber,dataRow.key,"setCursorRow");this.publishRowRenderEvent(event);}}}
else
{this.m_cursorRow=0;this._handleKeyDown();}}
GridModel.prototype.setVerticalScrollBarPosition=function(position,renderChangeInScrollbar)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.setVerticalScrollBarPosition() position = "+position);if(this.m_verticalScrollBarPosition!=position)
{this.m_verticalScrollBarPosition=position;var scrollbarEvent=new VerticalScrollbarRenderEvent(position,this.m_verticalScrollBarScale);this.publishVerticalScrollbarRenderEvent(scrollbarEvent);}}
GridModel.prototype.setVerticalScrollBarScale=function()
{var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();this.m_verticalScrollBarScale=(numberOfRowsInView>maxNumberOfRows)?numberOfRowsInView:maxNumberOfRows;if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.setVerticalScrollBarScale() verticalScrollBarScale = "+this.m_verticalScrollBarScale);var scrollbarEvent=new VerticalScrollbarRenderEvent(this.m_verticalScrollBarPosition,this.m_verticalScrollBarScale);this.publishVerticalScrollbarRenderEvent(scrollbarEvent);}
GridModel.prototype._handleKeyDown=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyDown()");var cursorRow=this.m_cursorRow;var topRow=this.m_rowRange.getStartRowNumber();var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();if(this.m_cursorRow<maxNumberOfRows-1)
{if(cursorRow>=topRow&&cursorRow<=(topRow+numberOfRowsInView-1))
{if(cursorRow==(topRow+numberOfRowsInView-1))
{this.m_rowRange.setStartRowNumber(++topRow);this.setCursorRow(++cursorRow);}
else
{this.setCursorRow(++cursorRow);}}
else
{this.setCursorRow(++cursorRow);this.m_rowRange.setStartRowNumber(cursorRow);topRow=cursorRow;if(topRow+numberOfRowsInView>maxNumberOfRows-1)
{topRow=maxNumberOfRows-numberOfRowsInView;this.m_rowRange.setStartRowNumber(topRow);}}}
else
{if(topRow<maxNumberOfRows-numberOfRowsInView)
{topRow=maxNumberOfRows-numberOfRowsInView;this.m_rowRange.setStartRowNumber(topRow);}}}
GridModel.prototype._handleKeyUp=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyUp()");var cursorRow=this.m_cursorRow;if(cursorRow>0)
{var topRow=this.m_rowRange.getStartRowNumber();var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();if(cursorRow>=topRow&&cursorRow<=(topRow+numberOfRowsInView-1))
{if(cursorRow==topRow)
{this.m_rowRange.setStartRowNumber(--topRow);this.setCursorRow(--cursorRow);}
else
{this.setCursorRow(--cursorRow);}}
else
{this.m_rowRange.setStartRowNumber(--cursorRow);this.setCursorRow(cursorRow);if(topRow+numberOfRowsInView>maxNumberOfRows-1)
{topRow=maxNumberOfRows-numberOfRowsInView;if(topRow<0)
{topRow=0;}
this.m_rowRange.setStartRowNumber(topRow);}}}
else
{if(topRow!=0)
{topRow=0;this.m_rowRange.setStartRowNumber(topRow);}}}
GridModel.prototype._handleKeySpace=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeySpace()");var result=false;if(this.isGridSelectable())
{var maxNumberOfRows=this.m_data.length;if(maxNumberOfRows>0)
{var cursorRow=this.m_cursorRow;var topRow=this.m_rowRange.getStartRowNumber();var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();if(cursorRow>=topRow&&cursorRow<=(topRow+numberOfRowsInView-1))
{}
else
{topRow=cursorRow;if(topRow+numberOfRowsInView>maxNumberOfRows-1)
{topRow=maxNumberOfRows-numberOfRowsInView;}
this.m_rowRange.setStartRowNumber(topRow);}
var selectEvent=new RowSelectionEvent(cursorRow-topRow);this.selectRow(selectEvent);result=true;}}
return result;}
GridModel.prototype._handleKeyPageDown=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handlePageDown()");var cursorRow=this.m_cursorRow;var topRow=this.m_rowRange.getStartRowNumber();var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();if(cursorRow<maxNumberOfRows-1)
{if(cursorRow>=topRow&&cursorRow<=(topRow+numberOfRowsInView-1))
{cursorRow+=numberOfRowsInView;if(cursorRow>maxNumberOfRows-1)
{cursorRow=maxNumberOfRows-1;}
topRow+=numberOfRowsInView;if(topRow+numberOfRowsInView>maxNumberOfRows-1)
{topRow=maxNumberOfRows-numberOfRowsInView;if(topRow<0)
{topRow=0;}}}
else
{cursorRow+=numberOfRowsInView;if(cursorRow>maxNumberOfRows-1)
{cursorRow=maxNumberOfRows-1;}
topRow=cursorRow;if(topRow+numberOfRowsInView>maxNumberOfRows-1)
{topRow=maxNumberOfRows-numberOfRowsInView;}}
this.m_rowRange.setStartRowNumber(topRow);this.setCursorRow(cursorRow);}
else
{if(topRow<maxNumberOfRows-numberOfRowsInView)
{topRow=maxNumberOfRows-numberOfRowsInView;this.m_rowRange.setStartRowNumber(topRow);}}}
GridModel.prototype._handleKeyPageUp=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handlePageUp()");var cursorRow=this.m_cursorRow;if(cursorRow>0)
{var topRow=this.m_rowRange.getStartRowNumber();var maxNumberOfRows=this.m_data.length;var numberOfRowsInView=this.m_gridRenderer.getNumberOfRowsInView();if(cursorRow>=topRow&&cursorRow<=(topRow+numberOfRowsInView-1))
{cursorRow-=numberOfRowsInView;if(cursorRow<0)
{cursorRow=0;}
topRow-=numberOfRowsInView;if(topRow<0)
{topRow=0;}}
else
{cursorRow-=numberOfRowsInView;if(cursorRow<0)
{cursorRow=0;}
topRow=cursorRow;}
this.m_rowRange.setStartRowNumber(topRow);this.setCursorRow(cursorRow);}
else
{if(topRow!=0)
{topRow=0;this.m_rowRange.setStartRowNumber(topRow);}}}
GridModel.prototype._handleKeyLeft=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyLeft()");var cols=this.getColumns();var firstColumn=cols[0].getColumnNumber();var selectedColumn;if(this.m_selectedColumn==firstColumn)
{var length=cols.length;selectedColumn=cols[length-1].getColumnNumber();}
else
{selectedColumn=cols[this.m_selectedColumn-1].getColumnNumber();}
var event=new ColumnSortEvent(this.m_selectedColumn,null);this.publishColumnRenderEvent(event);var headerIcon=ColumnRenderer.SORT_NONE;if(selectedColumn==this.m_sortColumn)
{var sortDirection=this.m_columns[selectedColumn].getSortDirection();if(true==sortDirection)
{headerIcon=ColumnRenderer.SORT_ASC;}
else if(false==sortDirection)
{headerIcon=ColumnRenderer.SORT_DSC;}}
event=new ColumnSortEvent(selectedColumn,headerIcon);this.publishColumnRenderEvent(event);this.m_selectedColumn=selectedColumn;}
GridModel.prototype._handleKeyRight=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyRight()");var cols=this.getColumns();var length=cols.length;var lastColumn=cols[length-1].getColumnNumber();var selectedColumn;if(this.m_selectedColumn==lastColumn)
{selectedColumn=cols[0].getColumnNumber();}
else
{selectedColumn=cols[this.m_selectedColumn+1].getColumnNumber();}
var event=new ColumnSortEvent(this.m_selectedColumn,null);this.publishColumnRenderEvent(event);var headerIcon=ColumnRenderer.SORT_NONE;if(selectedColumn==this.m_sortColumn)
{var sortDirection=this.m_columns[selectedColumn].getSortDirection();if(true==sortDirection)
{headerIcon=ColumnRenderer.SORT_ASC;}
else if(false==sortDirection)
{headerIcon=ColumnRenderer.SORT_DSC;}}
event=new ColumnSortEvent(selectedColumn,headerIcon);this.publishColumnRenderEvent(event);this.m_selectedColumn=selectedColumn;}
GridModel.prototype._handleKeyShiftUp=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyShiftUp()");var sorted=false;var sortDirection=this.m_columns[this.m_selectedColumn].getSortDirection();if(false==sortDirection||null==sortDirection)
{var sortEvent=new ColumnSortEvent(this.m_selectedColumn,true);this.sortData(sortEvent);sorted=true;}
return sorted;}
GridModel.prototype._handleKeyShiftDown=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel._handleKeyShiftDown()");var sorted=false;var sortDirection=this.m_columns[this.m_selectedColumn].getSortDirection();if(true==sortDirection||null==sortDirection)
{var sortEvent=new ColumnSortEvent(this.m_selectedColumn,false);this.sortData(sortEvent);sorted=true;}
return sorted;}
GridModel.prototype.setSelectedColumn=function(column)
{this.m_selectedColumn=column;}
GridModel.prototype.getSelectedColumn=function()
{return this.m_selectedColumn;}
GridModel.prototype.verticalScroll=function(scrollEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.verticalScroll() scrollEvent = "+scrollEvent.toString());var topRow=this.m_rowRange.getStartRowNumber();var scrollbarPosition=scrollEvent.getPosition();if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace(this.getId()+" : GridModel.verticalScroll() topRow = "+topRow+", scrollbarPosition = "+scrollbarPosition);if(topRow!=scrollbarPosition)
{this.m_rowRange.setStartRowNumber(scrollbarPosition);}}
GridModel.prototype.scrollSelectedRowIntoView=function()
{this.m_selectionStrategy.scrollSelectedRowIntoView();}
GridModel.prototype.refreshKeyStates=function()
{var dataBinding=this.m_dataBinding;var currentSelection=Services.getValue(dataBinding);var keyStates=this.m_adaptor.getAggregateState().getKeyStates();for(var i in keyStates)
{Services.setValue(dataBinding,i);}
Services.setValue(dataBinding,currentSelection);}
GridModel.prototype.sortData=function(sortEvent)
{if(sortEvent!=null)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.sortData() sortEvent = "+sortEvent.toString());var column=sortEvent.getColumnNumber();var sortDirection=sortEvent.getSortDirection();if(column==this.m_sortColumn)
{if(sortDirection==null)sortDirection=!this.m_columns[column].getSortDirection();this.m_columns[column].setSortDirection(sortDirection);}
else
{if(sortDirection==null)sortDirection=false;if(this.m_sortColumn!=null)this.m_columns[this.m_sortColumn].setSortDirection(null);this.m_sortColumn=column;this.m_columns[this.m_sortColumn].setSortDirection(sortDirection);}}
this.getDataLoadingStrategy().loadDataForSort(sortEvent);this._sortData();}
GridModel.prototype._sortData=function()
{if(true==this.m_isSortable&&this.m_data.length>1&&!this._isColumnSortingDisabled(this.m_sortColumn))
{var currentCursorRow=this.m_data[this.m_cursorRow];var comparatorDetails=new Array();var sortColumn=this.m_sortColumn;comparatorDetails[0]=new ColumnSortConfiguration();comparatorDetails[0].m_columnNumber=sortColumn;comparatorDetails[0].m_comparator=this._getComparator(sortColumn);comparatorDetails[0].m_sortAsc=this.m_columns[sortColumn].getSortDirection();var additionalSortColumns=this.m_columns[sortColumn].getAdditionalSortColumns();if(additionalSortColumns!=null&&additionalSortColumns.length>0)
{var additionalSortColumn;for(var i=0,l=additionalSortColumns.length;i<l;i++)
{comparatorDetails[i+1]=new ColumnSortConfiguration();additionalSortColumn=additionalSortColumns[i];comparatorDetails[i+1].m_columnNumber=additionalSortColumn.columnNumber;comparatorDetails[i+1].m_comparator=this._getComparator(additionalSortColumn.columnNumber);if(!comparatorDetails[0].m_sortAsc)
{if(additionalSortColumn.orderOnAsc!=null)
{comparatorDetails[i+1].m_sortAsc=this._setAdditionalSortColumnSortOrder(additionalSortColumn.orderOnAsc);}}else{if(additionalSortColumn.orderOnDesc!=null)
{comparatorDetails[i+1].m_sortAsc=this._setAdditionalSortColumnSortOrder(additionalSortColumn.orderOnDesc);}}
if(comparatorDetails[i+1].m_sortAsc==null)comparatorDetails[i+1].m_sortAsc=comparatorDetails[0].m_sortAsc;}}
this._sort["comparatorDetails"]=comparatorDetails;try{this.m_data.sort(this._sort);}catch(e){alert("GridGUIAdaptor._sortData() caught exception = "+e.message);}
this.maintainKeyToDataRowNumberMapping();this.refreshAllViewRows();this.resetCursorRow(currentCursorRow);}}
GridModel.prototype.maintainKeyToDataRowNumberMapping=function()
{var data=this.m_data;for(var i=0,l=data.length;i<l;i++)
{data["key:"+data[i].key]=i;}}
GridModel.prototype.resetCursorRow=function(row)
{if(row!=null)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.getId()+" : GridModel.resetCursorRow() this.m_cursorRow currently set to = "+this.m_cursorRow+", resetting it based on key "+row.key+" to "+this.getDataRowNumberByKey(row.key));this.setCursorRow(this.getDataRowNumberByKey(row.key));}}
GridModel.prototype._isColumnSortingDisabled=function(sortColumn)
{var result=false;var comparator=this.m_columns[sortColumn].getSortComparator();if(comparator=="disabled")
{result=true;}
return result;}
GridModel.prototype._getComparator=function(sortColumn)
{var comparator=this.m_columns[sortColumn].getSortComparator();if(comparator=="numerical")
{comparator=Comparators.numericalSort;}
else if(comparator=="numericalFloatingPoint")
{comparator=Comparators.numericalFloatingPointSort;}
else if(comparator=="disabled")
{comparator=null;}
else if(comparator=="alphabeticalCaseInsensitive")
{comparator=Comparators.alphabeticalCaseInsensitiveSort;}
else if(comparator=="alphabetical"||null==comparator)
{comparator=Comparators.alphabeticalSort;}
return comparator;}
GridModel.prototype._setAdditionalSortColumnSortOrder=function(sortOrder)
{var sortAsc=null;if(sortOrder==GridGUIAdaptor.SORT_ASC)
{sortAsc=false;}
else if(sortOrder==GridGUIAdaptor.SORT_DESC)
{sortAsc=true;}
return sortAsc;}
GridModel.prototype._sort=function(a,b)
{var sortConfiguration=null;var returnValue=0;var index=0;var comparatorDetails=arguments.callee["comparatorDetails"];var length=comparatorDetails.length;while(returnValue==0&&index<length)
{sortConfiguration=comparatorDetails[index];if(sortConfiguration.m_sortAsc)
{returnValue=sortConfiguration.m_comparator.call(arguments.callee,a[sortConfiguration.m_columnNumber],b[sortConfiguration.m_columnNumber]);}
else
{returnValue=sortConfiguration.m_comparator.call(arguments.callee,b[sortConfiguration.m_columnNumber],a[sortConfiguration.m_columnNumber]);}
index++;}
return returnValue;}
function GridSelectionStrategy(model)
{}
GridSelectionStrategy.refreshSelectionsFromDataBinding=function()
{}
GridSelectionStrategy.selectRow=function(dataRowNumber,forceUpdate)
{}
GridSelectionStrategy.resetRowStatesAfterSrcDataRefresh=function()
{}
GridSelectionStrategy.prototype.setKeyValue=function(dV)
{}
GridSelectionStrategy.createGridSelectionStrategy=function(model,multipleSelection)
{if(multipleSelection==false)
{return new GridSingleSelectionStrategy(model);}
else
{return new GridMultipleSelectionStrategy(model);}}
GridSelectionStrategy.prototype.getKeyFromDataRowNumber=function(dataRowNumber)
{var key=null;var data=this.m_model.m_data;var dataRow=data[dataRowNumber];if(dataRow!=null)
{key=dataRow.key;}
return key;}
GridSelectionStrategy.prototype.removeSelectionFromRowByKey=function(key)
{var dataRowNumber=this.m_model.getDataRowNumberByKey(key);if(dataRowNumber!=null)
{var data=this.m_model.m_data;var dataRow=data[dataRowNumber];if(dataRow!=null)
{dataRow.selected=false;var event=new RowRenderEvent(dataRowNumber,key,"removeSelectionFromRowByKey");this.m_model.publishRowRenderEvent(event);}}}
GridSelectionStrategy.prototype.addSelectionToRowByKey=function(key)
{var dataRowNumber=this.m_model.getDataRowNumberByKey(key);if(dataRowNumber!=null)
{var data=this.m_model.m_data;var dataRow=data[dataRowNumber];if(dataRow!=null)
{dataRow.selected=true;var event=new RowRenderEvent(dataRowNumber,key,"addSelectionToRowByKey");this.m_model.publishRowRenderEvent(event);this.m_currentSelectedDataRowNumber=dataRowNumber;}}}
GridSelectionStrategy.isNullOrEmpty=function(value)
{return(value==null||value=="");}
GridSelectionStrategy.prototype.scrollSelectedRowIntoView=function(dataRowNumber)
{var model=this.m_model;var topRow=model.m_rowRange.getStartRowNumber();var numberOfRowsInView=model.m_gridRenderer.getNumberOfRowsInView();if(dataRowNumber<topRow||dataRowNumber>=(topRow+numberOfRowsInView))
{var numberOfRows=model.getData().length;topRow=dataRowNumber+numberOfRowsInView;if(topRow<=numberOfRows)
{topRow=dataRowNumber;}
else
{var diff=numberOfRows-dataRowNumber;topRow=dataRowNumber-numberOfRowsInView+diff;}
model.m_rowRange.setStartRowNumber(topRow);model.setCursorRow(dataRowNumber);}}
function GridSingleSelectionStrategy(model)
{this.m_model=model;this.m_dataBinding=model.m_dataBinding;this.m_keyXPath=model.getKeyXPath();this.type="SingleSelection";}
GridSingleSelectionStrategy.prototype=new GridSelectionStrategy();GridSingleSelectionStrategy.prototype.constructor=GridSingleSelectionStrategy;GridSingleSelectionStrategy.prototype.refreshSelectionsFromDataBinding=function()
{this.removeSelectionFromRowByKey(this.m_value);this.m_value=Services.getValue(this.m_dataBinding);if(GridSelectionStrategy.isNullOrEmpty(this.m_value))
{this.defaultSelectedRowToFirstRow();}
else
{this.addSelectionToRowByKey(this.m_value);}}
GridSingleSelectionStrategy.prototype.selectRow=function(dataRowNumber,forceUpdate)
{var key=this.getKeyFromDataRowNumber(dataRowNumber);if(key!=null)
{this.setKeyValue(key);}
this.m_model.setCursorRow(dataRowNumber);}
GridSingleSelectionStrategy.prototype.resetRowStatesAfterSrcDataRefresh=function()
{var setDefaultRow=false;var data=this.m_model.m_data;if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridModel.resetRowStatesAfterSrcDataRefresh() this.m_multipleSelection = "+this.m_multipleSelection+", this.m_currentSelectedDataRowNumber = "+this.m_currentSelectedDataRowNumber);if(data.length>0)
{this.removeSelectionFromRowByKey(this.m_value);this.m_value=Services.getValue(this.m_dataBinding);if(GridSelectionStrategy.isNullOrEmpty(this.m_value))
{this.defaultSelectedRowToFirstRow();}
else
{var dataRowNumber=this.m_model.getDataRowNumberByKey(this.m_value);if(dataRowNumber!=null)
{this.addSelectionToRowByKey(this.m_value);}
else
{this.defaultSelectedRowToRemovedRow();}}}
else
{this.setKeyValue(null);}}
GridSingleSelectionStrategy.prototype.setKeyValue=function(dV)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridModel._setKeyValue() db = "+db+", dV = "+dV);return Services.setValue(this.m_dataBinding,dV);}
GridSingleSelectionStrategy.prototype.defaultSelectedRowToFirstRow=function()
{var data=this.m_model.m_data;if(data.length>0)
{this.selectRow(0,true);}}
GridSingleSelectionStrategy.prototype.defaultSelectedRowToRemovedRow=function()
{if(this.m_currentSelectedDataRowNumber<this.m_model.m_data.length)
{this.selectRow(this.m_currentSelectedDataRowNumber,true);}
else
{this.selectRow(this.m_model.m_data.length-1,true);}}
GridSingleSelectionStrategy.prototype.scrollSelectedRowIntoView=function()
{var dataRowNumber=this.m_model.getDataRowNumberByKey(this.m_value);if(dataRowNumber!=null)
{GridSelectionStrategy.prototype.scrollSelectedRowIntoView.call(this,dataRowNumber);}}
function GridMultipleSelectionStrategy(model)
{this.m_model=model;this.m_dataBinding=model.m_dataBinding;this.m_keyXPath=model.getKeyXPath();this.type="MultipleSelection";}
GridMultipleSelectionStrategy.prototype=new GridSelectionStrategy();GridMultipleSelectionStrategy.prototype.constructor=GridMultipleSelectionStrategy;GridMultipleSelectionStrategy.prototype.resetRowStatesAfterSrcDataRefresh=function()
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridModel.resetRowStatesAfterSrcDataRefresh() this.m_multipleSelection = "+this.m_multipleSelection+", this.m_currentSelectedDataRowNumber = "+this.m_currentSelectedDataRowNumber);if(this.m_model.m_data.length>0)
{this.refreshSelectionsFromDataBinding();this.m_model.setCursorRow(this.m_model.m_cursorRow);}
else
{Services.removeNode(this.m_dataBinding);}}
GridMultipleSelectionStrategy.prototype.selectRow=function(dataRowNumber,forceUpdate)
{var key=this.getKeyFromDataRowNumber(dataRowNumber);if(key!=null)
{var data=this.m_model.m_data;var row=data[dataRowNumber];if(row.selected==false)
{this.setKeyValue(key);}
else
{this.deleteKey(key);}}
this.m_model.setCursorRow(dataRowNumber);}
GridMultipleSelectionStrategy.prototype.refreshSelectionsFromDataBinding=function()
{var data=this.m_model.m_data;if(this.m_value!=null)
{for(var j=0,l=this.m_value.length;j<l;j++)
{var key=XML.getNodeTextContent(this.m_value[j]);this.removeSelectionFromRowByKey(key);if(this.m_model.m_adaptor.checkForKeyExistence(key)==false)
{this.deleteKey(key);}}}
this.m_value=this.getKeyNodes();if(this.m_value!=null)
{for(var j=0,l=this.m_value.length;j<l;j++)
{var key=XML.getNodeTextContent(this.m_value[j]);this.addSelectionToRowByKey(key);}}}
GridMultipleSelectionStrategy.prototype.getKeyNodes=function()
{var keyNodes=null;var keys=Services.getNode(this.m_dataBinding);if(keys!=null)
{keyNodes=keys.selectNodes(this.m_keyXPath);}
return keyNodes;}
GridMultipleSelectionStrategy.prototype.deleteKey=function(key)
{var found=false;var keyNodes=this.getKeyNodes();if(keyNodes!=null)
{for(var j=0,kl=keyNodes.length;j<kl;j++)
{if(key==XML.getNodeTextContent(keyNodes[j]))
{found=true;break;}}}
if(found)
{var xpath=XPathUtils.concatXPaths(this.m_dataBinding,XPathUtils.getLastNodeName(this.m_keyXPath))+"[text()=\'"+key+"\']";Services.removeNode(xpath);}}
GridMultipleSelectionStrategy.prototype.setKeyValue=function(dV)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug(this.m_model.getId()+" : GridModel._setKeyValue() db = "+db+", dV = "+dV);Services.startTransaction();var xpath=XPathUtils.concatXPaths(this.m_dataBinding,XPathUtils.getLastNodeName(this.m_keyXPath))+"[text()=\'"+dV+"\']";Services.removeNode(xpath);var node=FormController.getInstance().getDataModel().getInternalDOM().createElement(XPathUtils.getLastNodeName(this.m_keyXPath));var newKeyNode=XML.createTextNode(node,dV);node.appendChild(newKeyNode);Services.addNode(node,this.m_dataBinding);Services.endTransaction();return true;}
GridMultipleSelectionStrategy.prototype.scrollSelectedRowIntoView=function()
{var dataRowNumber=null;var keyNodes=this.getKeyNodes();if(keyNodes!=null)
{var numberOfNodes=keyNodes.length;if(numberOfNodes!=0)
{dataRowNumber=this.m_model.getData().length;for(var i=numberOfNodes-1;i>=0;i--)
{var key=keyNodes[i];var keyText=XML.getNodeTextContent(key);var temp=this.m_model.getDataRowNumberByKey(keyText);if(temp<dataRowNumber)
{dataRowNumber=temp;}}}}
if(dataRowNumber!=null)
{GridSelectionStrategy.prototype.scrollSelectedRowIntoView.call(this,dataRowNumber);}}
function DataRow(key,selected,cursor,submissible,cellData)
{this.m_key=key;this.m_selected=selected;this.m_cursor=cursor;this.m_submissible=submissible;this.m_additionalStylingClasses=null;this.m_cellData=cellData.slice(0);}
DataRow.create=function(row)
{var newRow=new DataRow(row.key,row.selected,row.cursor,row.submissible,row.slice(0));return newRow;}
DataRow.prototype.toString=function()
{var msg="[Row object: rowNumber="+this.m_rowNumber+", key="+this.m_key+", selected="+this.m_selected+", cursor="+this.m_cursor;msg+=", submissible="+this.m_submissible+", additionalStylingClasses="+this.m_additionalStylingClasses+"]";return msg;}
DataRow.prototype.getKey=function()
{return this.m_key;}
DataRow.prototype.getCursor=function()
{return this.m_cursor;}
DataRow.prototype.getSelected=function()
{return this.m_selected;}
DataRow.prototype.getSubmissible=function()
{return this.m_submissible;}
DataRow.prototype.getAdditionalStylingClasses=function()
{return this.m_additionalStylingClasses;}
DataRow.prototype.setAdditionalStylingClasses=function(additionalStylingClasses)
{this.m_additionalStylingClasses=additionalStylingClasses;}
DataRow.prototype.getCellData=function()
{return this.m_cellData;}
function ColumnHeader(model,columnNumber,xpath,sortComparator,defaultSort,additionalSortColumns,transformToDisplay,filterXPath,filterMode)
{this.m_sortComparator=null;this.m_model=model;this.m_columnNumber=columnNumber;this.m_xpath=xpath;this.m_sortComparator=sortComparator;this.m_defaultSort=defaultSort;this.m_additionalSortColumns=additionalSortColumns;this.m_transformToDisplay=transformToDisplay;this.m_filterXPath=filterXPath;if(filterMode==null)
{this.m_filterMode="caseInsensitive";}
else
{this.m_filterMode=filterMode;}}
ColumnHeader.create=function(model,columnNumber,column)
{return new ColumnHeader(model,columnNumber,column.xpath,column.sort,column.defaultSort,column.additionalSortColumns,column.transformToDisplay,column.filterXPath,column.filterMode);}
ColumnHeader.defaultColumnTransform=function(mV)
{return(null==mV?"":mV);}
ColumnHeader.prototype.getColumnNumber=function()
{return this.m_columnNumber;}
ColumnHeader.prototype.getXPath=function()
{return this.m_xpath;}
ColumnHeader.prototype.getSortComparator=function()
{return this.m_sortComparator;}
ColumnHeader.prototype.getSortDirection=function()
{return this.m_sortDirection;}
ColumnHeader.prototype.setSortDirection=function(sortDirection)
{this.m_sortDirection=sortDirection;var headerIcon=null;if(true==sortDirection)
{headerIcon=ColumnRenderer.SORT_ASC;}
else if(false==sortDirection)
{headerIcon=ColumnRenderer.SORT_DSC;}
var event=new ColumnSortEvent(this.m_columnNumber,headerIcon);this.m_model.publishColumnRenderEvent(event);}
ColumnHeader.prototype.getDefaultSort=function()
{return this.m_defaultSort;}
ColumnHeader.prototype.getAdditionalSortColumns=function()
{return this.m_additionalSortColumns;}
ColumnHeader.prototype.getTransformToDisplay=function()
{return this.m_transformToDisplay;}
ColumnHeader.prototype.getFilterXPath=function()
{return this.m_filterXPath;}
ColumnHeader.prototype.getFilterMode=function()
{return this.m_filterMode;}
function DataLoadingStrategy(model)
{}
DataLoadingStrategy.refreshSrcData=function(model,dataModelEvent)
{}
DataLoadingStrategy.pageData=function(model,pagingEvent)
{}
DataLoadingStrategy.loadDataForSort=function(model,sortingEvent)
{}
function LoadCompleteDataStrategy(model)
{this.m_model=model;}
LoadCompleteDataStrategy.prototype=new DataLoadingStrategy();LoadCompleteDataStrategy.prototype.constructor=LoadCompleteDataStrategy;LoadCompleteDataStrategy.prototype.loadDataForSort=function(sortEvent)
{}
LoadCompleteDataStrategy.prototype.refreshSrcData=function(dataModelEvent)
{if(GridGUIAdaptor.m_logger.isInfo())GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.refreshSrcData(), event = "+dataModelEvent);this.reloadAllSrcData();var adaptor=this.m_model.getAdaptor();var e=StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE,null,adaptor);adaptor.changeAdaptorState(e);}
LoadCompleteDataStrategy.prototype.applyDeltaToSrcData=function(dataModelEvent)
{var returnValue=false;try
{var eventType=dataModelEvent.getType();var eventXPath=String.trim(dataModelEvent.getXPath());if(eventXPath=="/")
{return returnValue;}
if(eventType==DataModelEvent.UPDATE||eventType==DataModelEvent.ADD)
{var key=this.getRowKeyFromEventXPath(eventXPath);if(key!=null)
{this.reloadRowFromSrcData(key);returnValue=true;}}
else if(eventType==DataModelEvent.REMOVE)
{}}
catch(e)
{if(GridGUIAdaptor.m_logger.isError())GridGUIAdaptor.m_logger.error("LoadCompleteDataStrategy.applyDeltaToSrcData() dataModelEvent = "+dataModelEvent.toString+", caught exception attempting to apply deltas to src data, reloading entire src data for grid");}
return returnValue;}
LoadCompleteDataStrategy.prototype.getRowKeyFromEventXPath=function(eventXPath)
{var model=this.m_model;var arr=new Array(model.getRowXPath(),"[");var rowXPath=String.trim(arr.join(""));var index=eventXPath.indexOf(String.trim(rowXPath));if(index!=-1)
{index=rowXPath.length;var xp=eventXPath.substring(0,index);var remainingXP=eventXPath.substring(index);var closePredicateIndex=remainingXP.indexOf("]");if(closePredicateIndex!=-1)
{rowXPath=eventXPath.substring(0,index+closePredicateIndex+1);var keyXPath=model.getKeyXPath();var rows=Services.getNodes(rowXPath);if(rows.length==1)
{var rowNode=rows[0];var keyNode=rowNode.selectSingleNode(keyXPath);var key=null;if(null!=keyNode)
{key=XML.getNodeTextContent(keyNode);return key;}}}}
return null;}
LoadCompleteDataStrategy.prototype.reloadRowFromSrcData=function(rowKey)
{if(GridGUIAdaptor.m_logger.isInfo())GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.reloadRowFromSrcData()");var model=this.m_model;var data=model.getData();var columns=model.getColumns();model.refreshAllViewRows();var dataRowNumber=model.getDataRowNumberByKey(rowKey);delete data["key:"+rowKey];var newData;if(null!=dataRowNumber)
{newData=new Array();var index=0;for(var i=0,l=data.length;i<l;i++)
{if(dataRowNumber!=i)
{newData[index]=data[i];newData["key:"+newData[index].key]=index;index++;}}}
else
{newData=data;}
var arr=new Array(model.getRowXPath(),"[",model.getKeyXPath()," = \'",rowKey,"\']");var currentSelectedRowXPath=String.trim(arr.join(""));var rows=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(currentSelectedRowXPath);if(rows!=null&&rows.length>0)
{newData=this.addRowsToData(columns,newData,rows);}
model.setData(newData);model.refreshAllViewRows();}
LoadCompleteDataStrategy.prototype.reloadAllSrcData=function()
{if(GridGUIAdaptor.m_logger.isInfo())GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.reloadAllSrcData()");var data=this.m_model.getData();var columns=this.m_model.getColumns();var model=this.m_model;model.refreshAllViewRows();for(var i=0,l=data.length;i<l;i++)
{data[i]=null;}
for(var i in data)
{delete data[i];}
data.length=0;var rows=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this.m_model.getRowXPath());if(rows!=null&&rows.length>0)
{data=this.addRowsToData(columns,data,rows);}
model.setData(data);model.refreshAllViewRows();}
LoadCompleteDataStrategy.prototype.addRowsToData=function(columns,data,rows)
{if(GridGUIAdaptor.m_logger.isInfo())GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.addRows(): adding "+rows.length+" rows to the existing data set");if(null!=rows)
{var nCols=columns.length;var aggregateState=this.m_model.getAdaptor().getAggregateState();var dom=FormController.getInstance().getDataModel().getInternalDOM();var columnFilters=new Array();var columnFilterModes=new Array();for(var j=0;j<nCols;j++)
{var currentColumn=columns[j];var filterXPath=currentColumn.getFilterXPath();var filterMode=currentColumn.getFilterMode();var filterValue=null;if(filterXPath!=null)
{var currentFilterNode=dom.selectSingleNode(currentColumn.getFilterXPath());if(null!=currentFilterNode)
{filterValue=XML.getNodeTextContent(currentFilterNode);}}
columnFilters[j]=filterValue;columnFilterModes[j]=filterMode;}
var filterOutRow=false;var currentColumn=null;var currentFilterValue=null;var currentFilterMode=null;var keyXPath=this.m_model.getKeyXPath();for(var i=0,rl=rows.length;i<rl;i++)
{var rowNode=rows[i];var keyNode=rowNode.selectSingleNode(keyXPath);var key=null;if(null!=keyNode)
{key=XML.getNodeTextContent(keyNode);}
var newRow=new Array();newRow.key=key;newRow.selected=false;newRow.cursor=false;newRow.hasFocus=false;newRow.submissible=aggregateState.isKeySubmissible(key);filterOutRow=false;currentColumn=null;currentFilterValue=null;currentFilterMode=null;for(var j=0;j<nCols;j++)
{var value=null;currentColumn=columns[j];currentFilterValue=columnFilters[j];currentFilterMode=columnFilterModes[j];var columnNode=rowNode.selectSingleNode(currentColumn.getXPath());if(null!=columnNode)
{value=XML.getNodeTextContent(columnNode);}
if(null!=currentColumn.m_transformToDisplay)
{value=currentColumn.m_transformToDisplay.call(currentColumn,value,key);}
else
{value=ColumnHeader.defaultColumnTransform(value);}
if(currentFilterValue!=null)
{if(currentFilterMode=="caseSensitive")
{if(value.indexOf(currentFilterValue)==-1)
{filterOutRow=true;break;}}
else
{if(value.toUpperCase().indexOf(currentFilterValue.toUpperCase())==-1)
{filterOutRow=true;break;}}}
newRow[j]=value;}
if(filterOutRow==false)
{data[data.length]=newRow;data["key:"+key]=data.length-1;}
else
{if(GridGUIAdaptor.m_logger.isInfo())GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.addRows(): filtered out row with key "+i+" due to filterValue of "+currentFilterValue+" on column "+currentColumn.getXPath()+" where the column value is "+value);}}}
return data;}
function GridRenderer()
{}
GridRenderer.prototype=new Renderer();GridRenderer.prototype.constructor=GridRenderer;GridRenderer.CSS_CLASS_NAME="grid";GridRenderer.createInline=function(id,columns,rows,groupSize)
{var e=Renderer.createInline(id,true);return GridRenderer._create(e,columns,rows,groupSize,null);}
GridRenderer.createAsInnerHTML=function(refElement,relativePos,id,columns,rows,groupSize)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,true);return GridRenderer._create(e,columns,rows,groupSize,null);}
GridRenderer.createAsChild=function(p,id,columns,rows,groupSize,ac)
{var e=Renderer.createAsChild(id);p.appendChild(e);return GridRenderer._create(e,columns,rows,groupSize,ac);}
GridRenderer.prototype.dispose=function()
{this.stopEventHandlers();if(this.m_verticalScrollbar!=null)this.m_verticalScrollbar.dispose();this.m_adaptor=null;this.m_gridModel=null;if(this.m_selectionChangeListeners!=null)
{this.m_selectionChangeListeners.dispose();this.m_selectionChangeListeners=null;}
if(this.m_dblclickListeners!=null)
{this.m_dblclickListeners.dispose();this.m_dblclickListeners=null;}
if(this.m_element!=null)
{unPreventSelection(this.m_element);this.m_element.__renderer=null;this.m_element=null;}
if(this.m_rows!=null)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{this.m_rows[i].dispose();this.m_rows[i]=null;}
this.m_rows=null;}
if(this.m_columns!=null)
{for(var i=0,l=this.m_columns.length;i<l;i++)
{this.m_columns[i].dispose();this.m_columns[i]=null;}
this.m_columns=null;}
this.m_gridForm=null;this.m_element=null;this.m_gridTable=null;this.m_gridTableBody=null;this.m_gridTableHeaderRow=null;this.m_gridTableHeaderCell=null;this.m_gridTableHeaderEmptyCell=null;this.m_gridTableBodyRow=null;this.m_gridTableBodyCell=null;this.m_gridTableVScrollbarCell=null;this.m_verticalScrollbar=null;this.m_headerRow=null;this.m_columns=null;this.m_rowContainer=null;this.m_rows=null;this.m_selectionChangeListeners=null;this.m_dblclickListeners=null;}
GridRenderer.prototype._getDebugInfo=function()
{var debug="GridRenderer id:"+this.m_adaptor.getId();debug+=" \nRows: length = "+this.m_rows.length;for(var i=0;i<this.m_rows.length;i++)
{debug+=", rows["+i+"] = "+this.m_rows[i].toString();}
return debug;}
GridRenderer._create=function(ge,columns,rows,groupSize,ac)
{Grid.determineBrowser();var g=new GridRenderer();var columnHeadersRequired=false;if((typeof columns=="object")&&(columns.constructor==Array))
{columnHeadersRequired=true;}
else if(typeof columns=="number")
{if(columns!=parseInt(columns.toString()))
{throw new ConfigurationException("Grid argument columns must be an integer value.");}
else
{if(columns<=0)
{throw new ConfigurationException("Number of columns in grid should be greater than zero.");}}}
else
{throw new ConfigurationException("Grid columns argument must contain an array of column names or the number of columns only.");}
var numberOfColumns;if(columnHeadersRequired)
{numberOfColumns=columns.length;}
else
{numberOfColumns=columns;}
g.m_rows=new Array(rows);g.setNumberOfRowsInView(rows);g.m_columns=new Array(numberOfColumns);g.m_groupSize=groupSize;g.m_sortColumn=0;g.m_hasFocus=false;g.m_topRow=0;g.m_headerRow=null;g._initRenderer(ge);g.m_element.className=GridRenderer.CSS_CLASS_NAME;preventSelection(ge);g.m_gridForm=document.createElement("form");g.m_element.appendChild(g.m_gridForm);var div=document.createElement("div");div.className="grid_table_border";g.m_gridForm.appendChild(div);g.m_gridTable=document.createElement("table");div.appendChild(g.m_gridTable);g.m_gridTableBody=document.createElement("tbody");g.m_gridTable.appendChild(g.m_gridTableBody);if(columnHeadersRequired)
{g.m_gridTableHeaderRow=document.createElement("tr");g.m_gridTableBody.appendChild(g.m_gridTableHeaderRow);g.m_gridTableHeaderCell=document.createElement("td");g.m_gridTableHeaderRow.appendChild(g.m_gridTableHeaderCell);g.m_gridTableHeaderEmptyCell=document.createElement("td");g.m_gridTableHeaderRow.appendChild(g.m_gridTableHeaderEmptyCell);g.m_headerRow=document.createElement("div");g.m_headerRow.className="grid_header_row";}
g.m_gridTableBodyRow=document.createElement("tr");g.m_gridTableBody.appendChild(g.m_gridTableBodyRow);g.m_gridTableBodyCell=document.createElement("td");g.m_gridTableBodyRow.appendChild(g.m_gridTableBodyCell);g.m_gridTableVScrollbarCell=document.createElement("td");g.m_gridTableVScrollbarCell.className="grid_vscroll_cell";g.m_gridTableBodyRow.appendChild(g.m_gridTableVScrollbarCell);g.m_verticalScrollbar=Scrollbar.createAsChild(g.m_gridTableVScrollbarCell,ge.id+"VerticalScrollbar",true,null);g.m_verticalScrollbar.addPositionChangeListener(function(){g._handleVerticalScroll();});for(var i=0;i<numberOfColumns;i++)
{if(columnHeadersRequired)
{g.m_columns[i]=new ColumnRenderer(g,i,columns[i]);}
else
{g.m_columns[i]=new ColumnRenderer(g,i,null);}}
if(columnHeadersRequired)
{g.m_gridTableHeaderCell.appendChild(g.m_headerRow);}
g.m_rowContainer=document.createElement("div");g.m_rowContainer.className="grid_row_container";for(var j=0;j<rows;j++)
{var rowElement=document.createElement("div");rowElement.className="grid_row hidden";var r=new RowRenderer(rowElement,numberOfColumns,g,j,groupSize);g.m_rows[j]=r;for(var i=0;i<numberOfColumns;i++)
{var gridCell=document.createElement("span");gridCell.className="grid_cell col"+i;gridCell.innerHTML="&nbsp;";rowElement.appendChild(gridCell);var cell=new CellRenderer(gridCell);var column=g.m_columns[i];g.m_rows[j].addCell(cell,i);}
g.m_rowContainer.appendChild(rowElement);}
g.m_gridTableBodyCell.appendChild(g.m_rowContainer);g.m_selectionChangeListeners=new CallbackList();g.m_dblclickListeners=new CallbackList();return g;}
GridRenderer.prototype.m_groupSize=0;GridRenderer.prototype.setNumberOfRowsInView=function(numberOfRowsInView)
{this.m_numberOfRowsInView=numberOfRowsInView;}
GridRenderer.prototype.getNumberOfRowsInView=function()
{return this.m_numberOfRowsInView;}
GridRenderer.prototype.setModel=function(model)
{this.m_gridModel=model;}
GridRenderer.prototype.setAdaptor=function(adaptor)
{this.m_adaptor=adaptor;}
GridRenderer.prototype.addDblclickListener=function(cb)
{this.m_dblclickListeners.addCallback(cb);}
GridRenderer.prototype.removeDblclickListener=function(cb)
{this.m_dblclickListeners.removeCallback(cb);}
GridRenderer.prototype._handleRowDblclick=function(row)
{this.m_dblclickListeners.invoke();}
GridRenderer.prototype.handleRowRenderEvent=function(event)
{var dataRowNumber=event.getDataRowNumber();var row=this.m_gridModel.getDataRowByDataRowNumber(dataRowNumber);this.m_rows[event.getViewRowNumber()].render(dataRowNumber,row);}
GridRenderer.prototype.handleColumnRenderEvent=function(event)
{this.m_columns[event.getColumnNumber()].render(event.getSortDirection());}
GridRenderer.prototype.getHasFocus=function()
{return this.m_hasFocus;}
GridRenderer.prototype.handleVerticalScrollbarRenderEvent=function(event)
{this.m_verticalScrollbar.setPosition(event.getPosition());this.m_verticalScrollbar.setScaling(0,this.m_numberOfRowsInView,event.getScale());}
GridRenderer.prototype.getReadOnly=function()
{return this.m_readOnly;}
GridRenderer.prototype.handleGridRenderEvent=function(event)
{this.m_valid=event.getValid();this.m_serverValid=event.getServerValid();this.m_enabled=event.getEnabled();this.m_readOnly=event.getReadOnly();this.m_hasFocus=event.getHasFocus();this.m_active=event.getActive();this.m_isSubmissible=event.getIsSubmissible();this.m_isServerValidationActive=event.getIsServerValidationActive();this._renderGridStyles();}
GridRenderer.prototype._renderGridStyles=function()
{var gridClass="grid";if(!this.m_enabled||!this.m_active)
{gridClass+=" disabled";}
else
{if(this.m_hasFocus)
{gridClass+=" grid_focus";}
if(this.m_readOnly)
{gridClass+=" grid_readOnly";}
if(!this.m_valid)
{if(!this.m_serverValid)
{if(this.m_isServerValidationActive)
{gridClass+=" grid_not_submissible";}
else
{gridClass+=" grid_invalid";}}
else
{gridClass+=" grid_invalid";}}
else
{if(!this.m_isSubmissible)
{gridClass+=" grid_not_submissible";}}}
this.m_element.className=gridClass;}
GridRenderer.prototype.startRowEventHandlers=function()
{for(var i=0,l=this.m_rows.length;i<l;i++)
{this.m_rows[i].startEventHandlers();}}
GridRenderer.prototype.stopRowEventHandlers=function()
{if(this.m_rows!=null)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{this.m_rows[i].stopEventHandlers();}}}
GridRenderer.prototype.startEventHandlers=function()
{this.startRowEventHandlers();for(var i=0,l=this.m_columns.length;i<l;i++)
{this.m_columns[i].startEventHandlers();}
this.m_verticalScrollbar.startEventHandlers();}
GridRenderer.prototype.stopEventHandlers=function()
{this.stopRowEventHandlers();if(this.m_columns!=null)
{for(var i=0,l=this.m_columns.length;i<l;i++)
{this.m_columns[i].stopEventHandlers();}}
if(this.m_verticalScrollbar!=null)this.m_verticalScrollbar.stopEventHandlers();}
GridRenderer.prototype._handleRowSelect=function(row)
{var viewRowNumber=row.getViewRowNumber();var selectEvent=new RowSelectionEvent(viewRowNumber);this.m_adaptor.handleSelectionChange(selectEvent);}
GridRenderer.prototype._handleVerticalScroll=function(pos,range,size)
{var scrollEvent=new VerticalScrollbarRenderEvent(this.m_verticalScrollbar.m_position);this.m_adaptor.handleVerticalScroll(scrollEvent);}
GridRenderer.prototype._handleColumnHeaderClick=function(columnNumber)
{var sortEvent=new ColumnSortEvent(columnNumber);this.m_adaptor.handleColumnHeaderClick(sortEvent);}
GridRenderer.prototype.configureHeaderSorting=function(i,sortComparator)
{var col=this.m_columns[i];if(col!=null)
{col.setSortEnabled(sortComparator!="disabled");col.render();}
else
{if(GridGUIAdaptor.m_logger.isWarn())GridGUIAdaptor.m_logger.warn("GridRenderer.configureHeaderSorting() unknown column number i = "+i+", sortComparator = "+sortComparator);}}
GridRenderer.prototype.getHeaderRow=function()
{return this.m_headerRow;}
function RowRenderer(element,numberOfColumns,grid,viewRowNumber,groupSize)
{this.m_element=element;this.m_numberOfColumns=numberOfColumns;this.m_cells=new Array(numberOfColumns);this.m_viewRowNumber=viewRowNumber;this.m_grid=grid;this.m_groupSize=groupSize;this.m_dataRowNumber=null;this.m_clickEventHandler=null;this.m_dblclickEventHandler=null;}
RowRenderer.prototype.toString=function()
{return"[Row: viewRowNumber:"+this.m_viewRowNumber+", this.m_element.className:"+this.m_element.className+"]";}
RowRenderer.prototype.startEventHandlers=function()
{var r=this;if(null==this.m_clickEventHandler)
{r.m_clickEventHandler=SUPSEvent.addEventHandler(this.m_element,"click",function(evt){r._handleClick(evt);},null);}
if(null==this.m_dblclickEventHandler)
{r.m_dblclickEventHandler=SUPSEvent.addEventHandler(this.m_element,"dblclick",function(evt){r._handleDblclick(evt);},null);}}
RowRenderer.prototype.dispose=function()
{for(var i=0,l=this.m_cells.length;i<l;i++)
{var cell=this.m_cells[i];cell.dispose();cell=null;}
this.m_element=null;this.m_grid=null;this.m_dataRowNumber=null;this.stopEventHandlers();this.m_clickEventHandler=null;this.m_dblclickEventHandler=null;}
RowRenderer.prototype.stopEventHandlers=function()
{if(null!=this.m_clickEventHandler)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventHandler);this.m_clickEventHandler=null;}
if(null!=this.m_dblclickEventHandler)
{SUPSEvent.removeEventHandlerKey(this.m_dblclickEventHandler);this.m_dblclickEventHandler=null;}}
RowRenderer.prototype.addCell=function(cell,columnNumber)
{this.m_cells[columnNumber]=cell;}
RowRenderer.prototype.getCell=function(columnNumber)
{return this.m_cells[columnNumber];}
RowRenderer.prototype._handleClick=function(evt)
{if(Grid.isIE)
{this.m_grid._handleRowSelect(this);}
else if(Grid.isMoz)
{if(evt.detail==1)
{this.m_grid._handleRowSelect(this);}}}
RowRenderer.prototype._handleDblclick=function(evt)
{this.m_grid._handleRowDblclick(this);}
RowRenderer.prototype.setDataRowNumber=function(no)
{this.m_dataRowNumber=no;}
RowRenderer.prototype.getDataRowNumber=function()
{return this.m_dataRowNumber;}
RowRenderer.prototype.getViewRowNumber=function()
{return this.m_viewRowNumber;}
RowRenderer.prototype.render=function(dataRowNumber,modelRow)
{this.m_dataRowNumber=dataRowNumber;this.applyRowStyling(modelRow);this.setCellData(modelRow);}
RowRenderer.prototype.applyRowStyling=function(modelRow)
{var cN="grid_row ";if(modelRow!=null)
{var isHigh=(this.m_dataRowNumber%(this.m_groupSize*2))>=this.m_groupSize;var key=modelRow.getKey();var submissible=modelRow.getSubmissible();var selected=modelRow.getSelected();var cursor=modelRow.getCursor();var additionalStylingClasses=modelRow.getAdditionalStylingClasses();if(cursor==true&&this.m_grid.getHasFocus())
{cN+="cursor ";}
if(!submissible)
{if(true==selected){if(cursor==true&&this.m_grid.getHasFocus())
{cN+="selected_and_cursor_and_not_submissible ";}
else
{cN+="selected_and_not_submissible ";}}else{cN+="grid_row_not_submissible "+(isHigh?"hi":"lo");}}
else
{if(true==selected){if(cursor==true&&this.m_grid.getHasFocus())
{cN+="selected_and_cursor ";}
else
{cN+="selected";}}else{cN+=(isHigh?"hi":"lo");}}
if(additionalStylingClasses!=null&&additionalStylingClasses!=Grid.BLANK)
{cN+=" "+additionalStylingClasses;}}
else
{cN+="hidden ";}
this.m_element.className=cN;}
RowRenderer.prototype.setCellData=function(modelRow)
{if(modelRow!=null)
{var rowData=modelRow.getCellData();for(var j=0,l=rowData.length;j<l;j++)
{var cell=this.getCell(j);var cE=cell.m_element;var cN=cE.childNodes;for(var k=cN.length-1;k>=0;k--)
{cE.removeChild(cN[k]);}
var content=rowData[j];if(null==content||""==content)
{content="\u00a0";}
var tn=document.createTextNode(rowData[j]);cE.appendChild(tn);}}
else
{for(var i=0;i<this.m_numberOfColumns;i++)
{var cell=this.getCell(i);var cE=cell.m_element;var cN=cE.childNodes;for(var k=cN.length-1;k>=0;k--)
{cE.removeChild(cN[k]);}
var tn=document.createTextNode("\u00a0");cE.appendChild(tn);}}}
function ColumnRenderer(grid,number,title)
{this.m_grid=grid;this.m_number=number;this.m_sortingEnabled=true;if(this.m_grid.m_headerRow!=null)
{var e=document.createElement("span");e.innerHTML=title;grid.m_headerRow.appendChild(e);this.m_headerElement=e;}
this.render();}
ColumnRenderer.prototype.dispose=function()
{this.stopEventHandlers();this.m_headerElement=null;this.m_grid=null;}
ColumnRenderer.prototype.setSortEnabled=function(enabled)
{this.m_sortingEnabled=enabled;}
ColumnRenderer.prototype.startEventHandlers=function()
{if(this.m_headerElement!=null)
{var c=this;this.m_clickHandler=SUPSEvent.addEventHandler(this.m_headerElement,'click',function(){c._handleHeaderClick();});}}
ColumnRenderer.prototype.stopEventHandlers=function()
{if(this.m_clickHandler!=null)
{SUPSEvent.removeEventHandlerKey(this.m_clickHandler);this.m_clickHandler=null;}}
ColumnRenderer.SORT_NONE=2;ColumnRenderer.SORT_ASC=3;ColumnRenderer.SORT_DSC=4;ColumnRenderer.prototype.render=function(sortDirection)
{if(this.m_headerElement!=null)
{var cN="grid_header_cell col"+this.m_number;if(sortDirection!=null&&this.m_sortingEnabled==true)
{if(ColumnRenderer.SORT_ASC==sortDirection)
{cN+=" sort_asc";}
else if(ColumnRenderer.SORT_DSC==sortDirection)
{cN+=" sort_dsc";}
else
{cN+=" sort_none";}}
this.m_headerElement.className=cN;}}
ColumnRenderer.prototype._handleHeaderClick=function(e)
{if(null==e)e=window.event;this.m_grid._handleColumnHeaderClick(this.m_number);}
function CellRenderer(element)
{this.m_element=element;}
CellRenderer.prototype.dispose=function()
{this.m_element=null;}
function GridRenderEvent(valid,serverValid,enabled,readOnly,hasFocus,active,isSubmissible,isServerValidationActive)
{this.m_valid=valid;this.m_serverValid=serverValid;this.m_enabled=enabled;this.m_readOnly=readOnly;this.m_hasFocus=hasFocus;this.m_active=active;this.m_isSubmissible=isSubmissible;this.m_isServerValidationActive=isServerValidationActive;}
GridRenderEvent.prototype.toString=function()
{var msg="[GridRenderEvent object: valid="+this.m_valid+", serverValid="+this.m_serverValid+", enabled="+this.m_enabled+", readOnly="+this.m_readOnly+", hasFocus="+this.m_hasFocus+", active="+this.m_active+", isSubmissible="+this.m_isSubmissible+", isServerValidationActive="+this.m_isServerValidationActive+"]";return msg;}
GridRenderEvent.prototype.getValid=function()
{return this.m_valid;}
GridRenderEvent.prototype.getServerValid=function()
{return this.m_serverValid;}
GridRenderEvent.prototype.getEnabled=function()
{return this.m_enabled;}
GridRenderEvent.prototype.getReadOnly=function()
{return this.m_readOnly;}
GridRenderEvent.prototype.getHasFocus=function()
{return this.m_hasFocus;}
GridRenderEvent.prototype.getActive=function()
{return this.m_active;}
GridRenderEvent.prototype.getIsSubmissible=function()
{return this.m_isSubmissible;}
GridRenderEvent.prototype.getIsServerValidationActive=function()
{return this.m_isServerValidationActive;}
function RowAggregateStateChangeEvent(rowKey,isSubmissible)
{this.m_key=rowKey;this.m_isSubmissible=isSubmissible;}
RowAggregateStateChangeEvent.prototype.toString=function()
{var msg="[RowAggregateStateChangeEvent object: key="+this.m_key+", isSubmissible="+this.m_isSubmissible+"]";return msg;}
RowAggregateStateChangeEvent.prototype.getKey=function()
{return this.m_key;}
RowAggregateStateChangeEvent.prototype.getIsSubmissible=function()
{return this.m_isSubmissible;}
function VerticalScrollbarRenderEvent(position,scale)
{this.m_position=position;this.m_scale=scale;}
VerticalScrollbarRenderEvent.prototype.equals=function(event)
{if(this.m_position==event.getPosition()&&this.m_scale==event.getScale())
return true;else
return false;}
VerticalScrollbarRenderEvent.prototype.toString=function()
{var msg="[VerticalScrollbarRenderEvent object: position="+this.m_position+", scale="+this.m_scale+"]";return msg;}
VerticalScrollbarRenderEvent.prototype.getPosition=function()
{return this.m_position;}
VerticalScrollbarRenderEvent.prototype.getScale=function()
{return this.m_scale;}
function RowRenderEvent(dataRowNumber,key,debug)
{this.m_dataRowNumber=dataRowNumber;this.m_key=key;this.m_viewRowNumber=null;this.m_debug=debug;}
RowRenderEvent.prototype.toString=function()
{var msg="[RowRenderEvent object: dataRowNumber="+this.m_dataRowNumber+", key="+this.m_key+", viewRowNumber="+this.m_viewRowNumber+", debug="+this.m_debug+"]";return msg;}
RowRenderEvent.prototype.getDataRowNumber=function()
{return this.m_dataRowNumber;}
RowRenderEvent.prototype.setViewRowNumber=function(viewRowNumber)
{this.m_viewRowNumber=viewRowNumber;}
RowRenderEvent.prototype.getViewRowNumber=function()
{return this.m_viewRowNumber;}
RowRenderEvent.prototype.getKey=function()
{return this.m_key;}
function RowSelectionEvent(viewRowNumber)
{this.m_viewRowNumber=viewRowNumber;}
RowSelectionEvent.prototype.toString=function()
{var msg="[RowSelectionEvent object: viewRowNumber="+this.m_viewRowNumber+"]";return msg;}
RowSelectionEvent.prototype.getViewRowNumber=function()
{return this.m_viewRowNumber;}
function ColumnSortEvent(columnNumber,sortDirection)
{this.m_columnNumber=columnNumber;this.m_sortDirection=sortDirection;}
ColumnSortEvent.prototype.toString=function()
{var msg="[ColumnSortEvent object: columnNumber="+this.m_columnNumber+", sortDirection="+this.m_sortDirection+"]";return msg;}
ColumnSortEvent.prototype.getColumnNumber=function()
{return this.m_columnNumber;}
ColumnSortEvent.prototype.getSortDirection=function()
{return this.m_sortDirection;}
var editor;var spellCheckURL="/jspelliframe2k4/JSpellIFrame.jsp";var checkWindow;var styleSheetURL="jspell.css";var jspellpopupurl="/jspelliframe2k4/jspellpopup.html";var disableLearn=true;var forceUpperCase=false;var ignoreIrregularCaps=false;var ignoreFirstCaps=false;var ignoreNumbers=true;var ignoreUpper=false;var ignoreDouble=false;var confirmAfterLearn=false;var supplementalDictionary="";var language="English (US)";var parseText;function highlight(position)
{var range=editor.document.body.createTextRange();range.move("word",position);range.moveEnd("word",1);text=range.text;text=text.replace(/\W+$/,'');if(text.length==range.text.length-1)
{range.moveEnd("character",-1);}
range.select();}
function replaceWord(word,position,validreplacement)
{var range=editor.document.body.createTextRange();range.move("word",position);range.moveEnd("word",1);text=range.text;text=text.replace(/\W+$/,'');if(text.length==range.text.length-1)
{range.moveEnd("character",-1);}
range.text=word;}
function replaceAll(word,position,errorWord,validReplacement)
{var range=editor.document.body.createTextRange();range.move("word",position);var moved=range.moveEnd("word",1);var count=0;while(moved>0)
{text=range.text;text=text.replace(/\W+$/,'');if(text.length==range.text.length-1)
{range.moveEnd("character",-1);}
if(range.text==errorWord)
{range.text=word;count++;}
range.moveStart("word",1);moved=range.moveEnd("word",1);}
return count;}
function nohighlight()
{var range=editor.document.body.createTextRange();range.move("word",0);range.select();editor.focus();}
function parse(position)
{var range=editor.document.body.createTextRange();range.move("word",position);var moved=range.moveEnd("word",1);var count=position;parseText="";var specialcase;if(position==0)
specialcase=" T";else
specialcase=" F";if(moved>0)
{text=range.text;text=text.replace(/[\ \n\r]+$/,'');if(text=="."||text=="!"||text=="?")
specialcase=" T";else
{if(moved!=0&&text.match("[A-Za-z]"))
parseText+=" "+count+" "+text+specialcase;specialcase=" F";}
while(true)
{range.moveStart("word",1);moved=range.moveEnd("word",1);count++;text=range.text;text=text.replace(/[\ \n\r]+$/,'');if(text=="."||text=="!"||text=="?")
specialcase=" T";else
{if(moved!=0&&text.match("[A-Za-z]"))
parseText+=" "+count+" "+text+specialcase;specialcase=" F";}
if(moved==0)
break;}}}
function getCookie(name){var dc=document.cookie;var prefix=name+"=";var begin=dc.indexOf("; "+prefix);if(begin==-1){begin=dc.indexOf(prefix);if(begin!=0)return null;}else
begin+=2;var end=document.cookie.indexOf(";",begin);if(end==-1)
end=dc.length;return unescape(dc.substring(begin+prefix.length,end));}
function ActionSpellCheck(objname,languageLabel)
{var ac=Services.getAppController();spellCheckURL=Services.getSpellCheckURL();jspellpopupurl=Services.getSpellCheckPopup();language=languageLabel;this.editor=objname;parse(0);var w=1024,h=768;if(document.all||document.layers)
{w=eval("scre"+"en.availWidth");h=eval("scre"+"en.availHeight");}
var leftPos=(w/2-260/2),topPos=(h/2-180/2);if((checkWindow==null||checkWindow.closed)&&navigator.appName=='Microsoft Internet Explorer')
checkWindow=window.open(jspellpopupurl,"checker","width=260,height=180,top="+topPos+",left="+leftPos+",toolbar=no,status=no,menubar=no,directories=no,resizable=no");checkWindow.focus();}
function EditorGetText()
{return editor.document.body.innerText;}
function EditorSetText(text)
{text=text.replace(/\n/g,"<br>");editor.document.body.innerHTML=text;}
function EditorGetHTML()
{if(this.tm){return editor.document.body.innerText;}
return editor.document.body.innerHTML;}
function EditorSetHTML(html)
{if(this.tm){editor.innerText=html;}
else{editor.innerHTML=html;}}
var FCKeditor=function(instanceName,width,height,toolbarSet,value)
{this.InstanceName=instanceName;this.Width=width||'100%';this.Height=height||'200';this.ToolbarSet=toolbarSet||'Default';this.Value=value||'';var ac=Services.getAppController();this.BasePath=Services.getEditorURL()+'/';this.CheckBrowser=true;this.DisplayErrors=true;this.Config=new Object();this.OnError=null;}
FCKeditor.prototype.Create=function()
{if(!this.InstanceName||this.InstanceName.length==0)
{this._ThrowError(701,'You must specify a instance name.');return;}
document.write('<div>');if(!this.CheckBrowser||this._IsCompatibleBrowser())
{document.write('<input type="hidden" id="'+this.InstanceName+'" name="'+this.InstanceName+'" value="'+this._HTMLEncode(this.Value)+'" />');document.write(this._GetConfigHtml());document.write(this._GetIFrameHtml());}
else
{var sWidth=this.Width.toString().indexOf('%')>0?this.Width:this.Width+'px';var sHeight=this.Height.toString().indexOf('%')>0?this.Height:this.Height+'px';document.write('<textarea name="'+this.InstanceName+'" rows="4" cols="40" style="WIDTH: '+sWidth+'; HEIGHT: '+sHeight+'" wrap="virtual">'+this._HTMLEncode(this.Value)+'<\/textarea>');}
document.write('</div>');}
FCKeditor.prototype.ReplaceTextarea=function()
{if(!this.CheckBrowser||this._IsCompatibleBrowser())
{var oTextarea=document.getElementById(this.InstanceName);if(!oTextarea)
oTextarea=document.getElementsByName(this.InstanceName)[0];if(!oTextarea||oTextarea.tagName!='TEXTAREA')
{alert('Error: The TEXTAREA id "'+this.InstanceName+'" was not found');return;}
oTextarea.style.display='none';this._InsertHtmlBefore(this._GetConfigHtml(),oTextarea);this._InsertHtmlBefore(this._GetIFrameHtml(),oTextarea);}}
FCKeditor.prototype._InsertHtmlBefore=function(html,element)
{if(element.insertAdjacentHTML)
element.insertAdjacentHTML('beforeBegin',html);else
{var oRange=document.createRange();oRange.setStartBefore(element);var oFragment=oRange.createContextualFragment(html);element.parentNode.insertBefore(oFragment,element);}}
FCKeditor.prototype._GetConfigHtml=function()
{var sConfig='';for(var o in this.Config)
{if(sConfig.length>0)sConfig+='&amp;';sConfig+=escape(o)+'='+escape(this.Config[o]);}
return'<input type="hidden" id="'+this.InstanceName+'___Config" value="'+sConfig+'" />';}
FCKeditor.prototype._GetIFrameHtml=function()
{var sLink=this.BasePath+'editor/fckeditor.html?InstanceName='+this.InstanceName;if(this.ToolbarSet)sLink+='&Toolbar='+this.ToolbarSet;return'<iframe id="'+this.InstanceName+'___Frame" src="'+sLink+'" width="'+this.Width+'" height="'+this.Height+'" frameborder="no" scrolling="no"></iframe>';}
FCKeditor.prototype._IsCompatibleBrowser=function()
{var sAgent=navigator.userAgent.toLowerCase();if(sAgent.indexOf("msie")!=-1&&sAgent.indexOf("mac")==-1&&sAgent.indexOf("opera")==-1)
{var sBrowserVersion=navigator.appVersion.match(/MSIE (.\..)/)[1];return(sBrowserVersion>=5.5);}
else if(navigator.product=="Gecko"&&navigator.productSub>=20030210)
return true;else
return false;}
FCKeditor.prototype._ThrowError=function(errorNumber,errorDescription)
{this.ErrorNumber=errorNumber;this.ErrorDescription=errorDescription;if(this.DisplayErrors)
{document.write('<div style="COLOR: #ff0000">');document.write('[ FCKeditor Error '+this.ErrorNumber+': '+this.ErrorDescription+' ]');document.write('</div>');}
if(typeof(this.OnError)=='function')
this.OnError(this,errorNumber,errorDescription);}
FCKeditor.prototype._HTMLEncode=function(text)
{if(typeof(text)!="string")
text=text.toString();text=text.replace(/&/g,"&amp;");text=text.replace(/"/g,"&quot;");text=text.replace(/</g,"&lt;");text=text.replace(/>/g,"&gt;");text=text.replace(/'/g,"&#39;");return text;}
function DropDownFieldRenderer()
{}
DropDownFieldRenderer.m_logger=new Category("DropDownFieldRenderer");DropDownFieldRenderer.prototype.m_element=null;DropDownFieldRenderer.prototype.m_inputField=null;DropDownFieldRenderer.prototype.m_popupLayer=null;DropDownFieldRenderer.prototype.m_button=null;DropDownFieldRenderer.prototype.m_dropdown=null;DropDownFieldRenderer.prototype.m_clickEventKey=null;DropDownFieldRenderer.prototype.m_inputFieldClickEventKey=null;DropDownFieldRenderer.prototype.m_dropDownPosition=null;DropDownFieldRenderer.prototype.m_hasMouseCapture=false;DropDownFieldRenderer.prototype.m_disabled=false;DropDownFieldRenderer.prototype.m_focussed=false;DropDownFieldRenderer.prototype.m_mandatory=false;DropDownFieldRenderer.prototype.m_invalid=false;DropDownFieldRenderer.prototype.m_readonly=false;DropDownFieldRenderer.CSS_CLASS_NAME="dropdown_container";DropDownFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME="dropdown_table_border";DropDownFieldRenderer.INPUT_FIELD_CSS_CLASS_NAME="dropdown_field";DropDownFieldRenderer.prototype.m_keyEventHandlerKey=null;DropDownFieldRenderer.prototype.m_showHideListeners=null;DropDownFieldRenderer.prototype.m_inputFieldReadOnly=false;DropDownFieldRenderer.createAsChild=function(p,inputFieldReadOnly)
{var e=document.createElement("div");p.appendChild(e);return DropDownFieldRenderer._create(e,inputFieldReadOnly);}
DropDownFieldRenderer._create=function(e,inputFieldReadOnly)
{var f=new DropDownFieldRenderer();if(inputFieldReadOnly==true)
{f.m_inputFieldReadOnly=true;}
f.m_element=e;f.m_element.className=DropDownFieldRenderer.CSS_CLASS_NAME;f.m_borderDiv=document.createElement("div");f.m_borderDiv.className=DropDownFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME;f.m_element.appendChild(f.m_borderDiv);var table=document.createElement("table");table.className="dropdown_table";table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");f.m_borderDiv.appendChild(table);var tbody=document.createElement("tbody");table.appendChild(tbody);var tr=document.createElement("tr");tbody.appendChild(tr);var inputFieldCell=document.createElement("td");inputFieldCell.className="dropdown_field_container";tr.appendChild(inputFieldCell);var buttonCell=document.createElement("td");buttonCell.className="dropdown_button_container";tr.appendChild(buttonCell);f.m_inputField=document.createElement("input");f.m_inputField.setAttribute("type","text");f.m_inputField.className=DropDownFieldRenderer.INPUT_FIELD_CSS_CLASS_NAME;var parentId=e.parentNode.id;if(null!=parentId&&""!=parentId)
{f.m_inputField.id=parentId+"_input";}
if(f.m_inputFieldReadOnly==true)
{f.m_inputField.readOnly=true;preventSelection(f.m_inputField);}
inputFieldCell.appendChild(f.m_inputField);f.m_button=Button.createAsChild(buttonCell,null,"dropdown_button");f.m_button.addClickListener(function(){f._handleButtonClick();});f.m_dropdown=document.createElement("div");f.m_dropdown.className="dropdown";f.m_element.appendChild(f.m_dropdown);f.m_showHideListeners=new CallbackList();f.startDropDownEventHandlers();f.m_offsetWidth=0;f.m_popupLayer=PopupLayer.create(f.m_dropdown);return f;}
DropDownFieldRenderer.prototype.dispose=function()
{this.m_element.__renderer=null;this.m_guiAdaptor=null;if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;}
this.m_element.onlosecapture=null;this.stopDropDownEventHandlers();if(this.m_inputFieldReadOnly)
{if(null!=this.m_inputFieldClickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_inputFieldClickEventKey);this.m_inputFieldClickEventKey=null;}
unPreventSelection(this.m_inputField);}
this.m_button.dispose();this.m_showHideListeners.dispose();this.m_showHideListeners=null;this.m_popupLayer._dispose();this.m_popupLayer=null;}
DropDownFieldRenderer.prototype.startDropDownEventHandlers=function()
{this.m_button.startEventHandlers();var dd=this;if(null==this.m_keyEventHandlerKey)
{this.m_keyEventHandlerKey=SUPSEvent.addEventHandler(this.m_inputField,"keydown",function(evt){dd._handleKeyEvents(evt);},false);}
if(this.m_inputFieldReadOnly==true)
{if(null==this.m_inputFieldClickEventKey)
{this.m_inputFieldClickEventKey=SUPSEvent.addEventHandler(this.m_inputField,"click",function(){dd._handleButtonClick();},false);}}}
DropDownFieldRenderer.prototype.stopDropDownEventHandlers=function()
{this.m_button.stopEventHandlers();if(null!=this.m_keyEventHandlerKey)SUPSEvent.removeEventHandlerKey(this.m_keyEventHandlerKey);this.m_keyEventHandlerKey=null;if(this.m_inputFieldReadOnly==true)
{if(null!=this.m_inputFieldClickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_inputFieldClickEventKey);this.m_inputFieldClickEventKey=null;}}}
DropDownFieldRenderer.prototype._handleKeyEvents=function(e)
{if(null==e)e=window.event;switch(e.keyCode)
{case Key.Tab.m_keyCode:case Key.ESC.m_keyCode:{this.hideDropDown();}}}
DropDownFieldRenderer.prototype._handleButtonClick=function()
{if(null==this.m_dropDownPosition)
{this.showDropDown();}
else
{this.hideDropDown();}}
DropDownFieldRenderer.prototype.isRaised=function()
{return(this.m_dropDownPosition!=null);}
DropDownFieldRenderer.prototype.showDropDown=function()
{if(null==this.m_dropDownPosition)
{var above=this._getDropDownPosition(this.m_dropdown);this.m_dropDownPosition=above;this.m_dropdown.className="dropdown "+(above?"above":"below");var container=this.m_element;var dd=this;if(container.attachEvent)
{container.setCapture(false);this.m_clickEventKey=SUPSEvent.addEventHandler(container,"click",function(){dd._handleClickIE();},false);container.onlosecapture=function(){dd._captureLostIE(container);return false};this.m_hasMouseCapture=true;}
else if(container.addEventListener)
{this.m_clickEventKey=SUPSEvent.addEventHandler(window,"click",function(evt){dd._handleClickMoz(evt);},true);}
else
{alert("Unsupported browser");}
this._focusInputField();this._render();this.m_popupLayer.show();this.m_showHideListeners.invoke(true);}}
DropDownFieldRenderer.prototype._handleClickIE=function()
{if(DropDownFieldRenderer.m_logger.isDebug())DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._handleClickIE()");var e=window.event.srcElement;if(!this.m_element.contains(e))
{this.m_element.releaseCapture();}
else
{this._focusDropDownControl(e);}}
DropDownFieldRenderer.prototype._handleClickMoz=function(evt)
{if(DropDownFieldRenderer.m_logger.isDebug())DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._handleClickMoz()");var e=evt.target;if(!this.m_element.contains(e))
{this.hideDropDown();}
else
{this._focusDropDownControl(e);}}
DropDownFieldRenderer.prototype._captureLostIE=function()
{this.m_hasMouseCapture=false;this.hideDropDown();this.m_element.onlosecapture=null;}
DropDownFieldRenderer.prototype._focusDropDownControl=function(e)
{if(!this._isElementNativeControl(e))
{this._focusInputField();}}
DropDownFieldRenderer.prototype._isElementNativeControl=function(e)
{var nN=e.nodeName;return(nN=="INPUT"||nN=="SELECT"||nN=="TEXTAREA");}
DropDownFieldRenderer.prototype.addShowHideListener=function(cb)
{this.m_showHideListeners.addCallback(cb);}
DropDownFieldRenderer.prototype.hideDropDown=function()
{if(null!=this.m_dropDownPosition)
{if(null!=this.m_clickEventKey)SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;this.m_dropDownPosition=null;this.m_element.className=this._getClassName();if(this.m_hasMouseCapture)
{this.m_element.releaseCapture();}
this.m_popupLayer.hide();this.m_showHideListeners.invoke(false);}}
DropDownFieldRenderer.prototype._focusInputField=function()
{if(DropDownFieldRenderer.m_logger.isDebug())DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._focusInputField(): focussing input field");this.m_inputField.focus();}
DropDownFieldRenderer.prototype._getDropDownElement=function()
{return this.m_dropdown;}
DropDownFieldRenderer.prototype._getInputFieldElement=function()
{return this.m_inputField;}
DropDownFieldRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isSubmissible,isServerValidationActive)
{this.m_disabled=disabled;this.m_focussed=focussed;this.m_mandatory=mandatory;this.m_invalid=invalid;this.m_serverInvalid=serverInvalid;this.m_readonly=readonly;this.m_inactive=inactive;this.m_isSubmissible=isSubmissible;this.m_isServerValidationActive=isServerValidationActive;this._render();}
DropDownFieldRenderer.DROPDOWN_NOT_SUBMISSIBLE_CSS_CLASS=" dropdownNotSubmissible";DropDownFieldRenderer.prototype._getClassName=function()
{var className=DropDownFieldRenderer.CSS_CLASS_NAME;if(this.m_disabled||this.m_inactive)
{className+=" disabled";}
else
{if(this.m_focussed)
{if(this.m_inputFieldReadOnly&&!this.isRaised())
{className+=" readOnlyInputField_and_dropdown_not_raised";}
else
{className+=" focus";}}
if(this.m_guiAdaptor.hasValue())
{if(this.m_invalid)
{if(this.m_serverInvalid)
{if(this.m_isServerValidationActive)
{className+=" notSubmissible";}
else
{className+=" invalid";}}
else
{className+=" invalid";}}}
else
{if(this.m_mandatory)
{className+=" mandatory";}}
if(this.m_readonly)
{className+=" readonly";}
if(this.m_isSubmissible==false)
{className+=DropDownFieldRenderer.DROPDOWN_NOT_SUBMISSIBLE_CSS_CLASS;}
if(this.m_dropDownPosition!=null)
{className+=" raised";}}
return className;}
DropDownFieldRenderer.prototype._render=function()
{if(!this.m_inputFieldReadOnly)
{if(this.m_offsetWidth==0&&this.m_inputField.parentNode.offsetWidth>0)
{var borderStyle=getCalculatedStyle(this.m_borderDiv);var borderLeftWidth=borderStyle.borderLeftWidth.slice(0,-2);borderLeftWidth=isNaN(borderLeftWidth)?2:Number(borderLeftWidth);var borderRightWidth=borderStyle.borderRightWidth.slice(0,-2);borderRightWidth=isNaN(borderRightWidth)?2:Number(borderRightWidth);var elementStyle=getCalculatedStyle(this.m_guiAdaptor.getElement());var elementWidth=elementStyle.width.slice(0,-2);elementWidth=isNaN(elementWidth)?160:Number(elementWidth);var buttonCellWidth=this.m_button.m_element.parentNode.offsetWidth;buttonCellWidth=isNaN(buttonCellWidth)?18:Number(buttonCellWidth);var inputFieldWidth=elementWidth-borderLeftWidth-buttonCellWidth-borderRightWidth;inputFieldWidth-=4;this.m_inputField.style.width=inputFieldWidth+"px";this.m_offsetWidth=this.m_inputField.style.width;}
else
{this.m_inputField.style.width=this.m_offsetWidth;}}
if(this.m_disabled||this.m_readonly||this.m_inactive)
{this.stopDropDownEventHandlers();}
else
{this.startDropDownEventHandlers();}
var disabled=this.m_disabled||this.m_inactive;this.m_inputField.disabled=disabled;if(!this.m_inputFieldReadOnly&&disabled==false)
{this.m_inputField.readOnly=this.m_readonly;}
if(this.m_disabled||this.m_inactive)
{if(this.m_guiAdaptor.getHelpText()!=null){this.m_guiAdaptor.unbindHelp();}}
else
{if(this.m_guiAdaptor.getHelpText()!=null){this.m_guiAdaptor.bindHelp();}}
this.m_element.className=this._getClassName();}
DropDownFieldRenderer.prototype._getDropDownPosition=function(dropdown)
{var container=this.m_element;var containerPos=getAbsolutePosition(container);var docEl=container.ownerDocument.documentElement;var dropdownHeight=dropdown.offsetHeight;var topOfDropdownAbove=containerPos.top-dropdownHeight;var bottomOfDropdownBelow=containerPos.top+container.offsetHeight+dropdownHeight;var gapAbove=topOfDropdownAbove-docEl.scrollTop;var gapBelow=(docEl.scrollTop+docEl.clientHeight)-bottomOfDropdownBelow;var above=false;if(gapBelow<0)
{if(gapAbove<0)
{above=(gapAbove>gapBelow);}
else
{above=true;}}
return above;}
function IAutoCompletionModel(){}
IAutoCompletionModel.prototype.setMatchString=function(match)
{}
IAutoCompletionModel.prototype.getMatch=function(matchNumber)
{}
IAutoCompletionModel.prototype.getMatchKey=function(matchNumber)
{}
function AutoCompletionRenderer()
{}
AutoCompletionRenderer.prototype=new Renderer();AutoCompletionRenderer.prototype.constructor=AutoCompletionRenderer;AutoCompletionRenderer.m_logger=new Category("AutoCompletionRenderer");AutoCompletionRenderer.prototype.m_handlersStarted=false;AutoCompletionRenderer.prototype.m_rows=null;AutoCompletionRenderer.prototype.m_highlightedRow=null;AutoCompletionRenderer.prototype.m_maxNumberOfRows=null;AutoCompletionRenderer.prototype.m_visibleRows=null;AutoCompletionRenderer.prototype.m_topRow=null;AutoCompletionRenderer.prototype.m_selectionMode=null;AutoCompletionRenderer.prototype.m_selectedRow=null;AutoCompletionRenderer.prototype.m_valueChangeListeners=null;AutoCompletionRenderer.showDropDown=true;AutoCompletionRenderer.prototype.m_tableRow=null;AutoCompletionRenderer.prototype.m_rowsCell=null;AutoCompletionRenderer.prototype.m_scrollbarCell=null;AutoCompletionRenderer.prototype.m_verticalScrollbar=null;AutoCompletionRenderer.prototype.m_selectsState=new Array(PopupLayer.m_allSelects.length);AutoCompletionRenderer.prototype.m_popupLayerCount=null;AutoCompletionRenderer.CSS_CLASS_NAME="autocomplete";AutoCompletionRenderer.TABLE_CSS_CLASS_NAME="autocomplete_table";AutoCompletionRenderer.TABLEROW_CSS_CLASS_NAME="autocomplete_tablerow";AutoCompletionRenderer.ROWCELL_CSS_CLASS_NAME="autocomplete_rowscell";AutoCompletionRenderer.SCROLLCELL_CSS_CLASS_NAME="autocomplete_scrollcell";AutoCompletionRenderer.ROW_CSS_CLASS_NAME="autocomplete_row";AutoCompletionRenderer.ROW_HIDDEN_CSS_CLASS_NAME=AutoCompletionRenderer.ROW_CSS_CLASS_NAME+" autocomplete_rowhidden";AutoCompletionRenderer.ROW_SELECTED_CSS_CLASS_NAME=AutoCompletionRenderer.ROW_CSS_CLASS_NAME+" autocomplete_rowselected";AutoCompletionRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME=AutoCompletionRenderer.ROW_CSS_CLASS_NAME+" autocomplete_rowSelectedNotSubmissible";AutoCompletionRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME=AutoCompletionRenderer.ROW_CSS_CLASS_NAME+" autocomplete_rowNotSubmissible";AutoCompletionRenderer.DEFAULT_NUMBER_OF_ROWS=8;AutoCompletionRenderer.REPEAT_INITIAL_DELAY=1000;AutoCompletionRenderer.REPEAT_INTERVAL=200;AutoCompletionRenderer.DONT_MATCH=2;AutoCompletionRenderer.MATCH=3;AutoCompletionRenderer.FOUND_MATCH=4;AutoCompletionRenderer.NO_CHANGE=5;AutoCompletionRenderer.ADDING_ROWS=6;AutoCompletionRenderer.REMOVING_ROWS=7;AutoCompletionRenderer.createInline=function(id,maxRows)
{var e=Renderer.createInline(id,false);return AutoCompletionRenderer._create(e,maxRows);}
AutoCompletionRenderer.createAsInnerHTML=function(refElement,relativePos,id,maxRows)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return AutoCompletionRenderer._create(e,maxRows);}
AutoCompletionRenderer.createAsChild=function(p,id,maxRows)
{var e=Renderer.createAsChild(id);p.appendChild(e);return AutoCompletionRenderer._create(e,maxRows);}
AutoCompletionRenderer._create=function(e,maxRows)
{e.className=AutoCompletionRenderer.CSS_CLASS_NAME;var ac=new AutoCompletionRenderer();ac._initRenderer(e);if(null==maxRows)
{ac.m_maxNumberOfRows=AutoCompletionRenderer.DEFAULT_NUMBER_OF_ROWS;}
else
{ac.m_maxNumberOfRows=maxRows;}
ac.m_dropDownField=DropDownFieldRenderer.createAsChild(e);ac.m_dropDownField.addShowHideListener(function(show){ac._handleDropDownShowHide(show);});var dropdown=ac.m_dropDownField._getDropDownElement();preventSelection(dropdown);var d=window.document;var table=d.createElement("table");table.className=AutoCompletionRenderer.TABLE_CSS_CLASS_NAME;table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");var tableBody=d.createElement("tbody");tableBody.setAttribute("align","left");var tableRow=d.createElement("tr");ac.m_tableRow=tableRow;tableRow.className=AutoCompletionRenderer.TABLEROW_CSS_CLASS_NAME;var rowsCell=d.createElement("td");ac.m_rowsCell=rowsCell;rowsCell.className=AutoCompletionRenderer.ROWCELL_CSS_CLASS_NAME;tableRow.appendChild(rowsCell);tableBody.appendChild(tableRow);table.appendChild(tableBody);dropdown.appendChild(table);ac.m_valueChangeListeners=new CallbackList();ac.m_model=null;return ac.m_dropDownField.m_element;}
AutoCompletionRenderer.prototype.startEventHandlers=function()
{if(!this.m_handlersStarted)
{this.m_handlersStarted=true;if(this.m_verticalScrollbar!=null)
{this.m_verticalScrollbar.startEventHandlers();}
var ac=this;this.m_keyupHndlr=SUPSEvent.addEventHandler(this.m_element,'keyup',function(evt){return ac._handleKeyUpEvent(evt);});this.m_keydownHndlr=SUPSEvent.addEventHandler(this.m_element,'keydown',function(evt){return ac._handleKeyDownEvent(evt);});this.m_rowsCell.onclick=function(evt){ac._handleClick(evt);};this.m_rowsCell.ondblclick=function(evt){ac._handleDoubleClick(evt);};this.m_rowsCell.onmouseover=function(evt){ac._handleMouseOver(evt);};}}
AutoCompletionRenderer.prototype.stopEventHandlers=function()
{if(this.m_handlersStarted)
{this.m_handlersStarted=false;if(this.m_verticalScrollbar!=null)
{this.m_verticalScrollbar.stopEventHandlers();}
SUPSEvent.removeEventHandlerKey(this.m_keyupHndlr);this.m_keyupHndlr=null;SUPSEvent.removeEventHandlerKey(this.m_keydownHndlr);this.m_keydownHndlr=null;this.m_rowsCell.onclick=null;this.m_rowsCell.ondblclick=null;this.m_rowsCell.onmouseover=null;}}
AutoCompletionRenderer.prototype.dispose=function()
{this.stopEventHandlers();unPreventSelection(this.m_dropDownField._getDropDownElement());this.m_model=null;if(this.m_verticalScrollbar!=null)
{this.m_verticalScrollbar.dispose();this.m_verticalScrollbar=null;}
if(this.m_rows!=null)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{this.m_rows[i]=null;}
this.m_rows=null;}
this.m_tableRow=null;this.m_rowsCell=null;if(this.m_scrollbarCell!=null)
{this.m_scrollbarCell=null;}
this.m_dropDownField.dispose();this.m_valueChangeListeners.dispose();delete this.m_valueChangeListeners;}
AutoCompletionRenderer.prototype.addValueChangeListener=function(callback)
{this.m_valueChangeListeners.addCallback(callback);}
AutoCompletionRenderer.prototype.setSelectionMode=function(mode)
{this.m_selectionMode=mode;}
AutoCompletionRenderer.prototype.setModel=function(model)
{this.m_model=model;}
AutoCompletionRenderer.prototype._handleVerticalScroll=function()
{if(this.m_topRow!=this.m_verticalScrollbar.m_position)
{this.m_topRow=this.m_verticalScrollbar.m_position;this._renderRows();}}
AutoCompletionRenderer.prototype._handleDropDownShowHide=function(show)
{if(show)
{if(null==this.m_model)
{this.m_verticalScrollbar.setScaling(0,100,100);}
else
{if(null==this.m_popupLayerCount)
{this.m_popupLayerCount=PopupLayer.m_popupCount-1;}
this._createDynamicDropDownContent();var hiddenSelects=this.m_dropDownField.m_popupLayer.m_hiddenSelects[this.m_popupLayerCount];if(hiddenSelects!=null)
{var container=this.m_rowsCell;for(var i=hiddenSelects.length-1;i>=0;i--)
{var s=hiddenSelects[i];var element=s.element;if(element.style.visibility=="hidden")
{var selectState=new Object();selectState.visibility=s.prevState;selectState.disabled=s.prevDisabled;this.m_selectsState[i]=selectState;if(!isContained(element,container))
{element.style.visibility=s.prevState;element.disabled=s.prevDisabled;}
selectState=null;}}}
this._showMatches();}}}
AutoCompletionRenderer.prototype._handleClick=function(evt)
{if(null==evt)evt=window.event;var target=SUPSEvent.getTargetElement(evt);if(evt.detail==undefined||evt.detail==1)
{if(this.m_selectionMode==AutocompletionGUIAdaptor.CLICK_MODE)
{this._useCurrentMatch();}}}
AutoCompletionRenderer.prototype._handleDoubleClick=function(evt)
{this._useCurrentMatch();}
AutoCompletionRenderer.prototype._handleMouseOver=function(evt)
{if(null==evt)evt=window.event;var target=SUPSEvent.getTargetElement(evt);for(var i=0,l=this.m_rows.length;i<l;i++)
{if(target==this.m_rows[i])
{break;}}
if(i<l)
{this.m_highlightedRow=i+this.m_topRow;this._renderRows();}}
AutoCompletionRenderer.prototype._handleKeyUpEvent=function(evt)
{evt=(null!=evt)?evt:window.event;var eventKeyCode=evt.keyCode;if(eventKeyCode==Key.ArrowUp.m_keyCode||eventKeyCode==Key.ArrowDown.m_keyCode)
{if(!this.m_dropDownField.isRaised())
{this._createDynamicDropDownContent();this.m_dropDownField.showDropDown();}}
else if(eventKeyCode==Key.Return.m_keyCode)
{this._useCurrentMatch();}
else if(eventKeyCode==Key.Tab.m_keyCode||eventKeyCode==Key.ESC.m_keyCode||eventKeyCode==Key.PageUp.m_keyCode||eventKeyCode==Key.PageDown.m_keyCode||eventKeyCode==Key.ScrollLock.m_keyCode||eventKeyCode==Key.PrintScreen.m_keyCode||eventKeyCode==Key.Insert.m_keyCode||eventKeyCode==Key.NumLock.m_keyCode||eventKeyCode==Key.Menu.m_keyCode||eventKeyCode==Key.Home.m_keyCode||eventKeyCode==Key.End.m_keyCode||eventKeyCode==Key.Windows.m_keyCode)
{}
else
{if(AutoCompletionRenderer.m_logger.isDebug())AutoCompletionRenderer.m_logger.debug("KeyHandler about to showMatches for key: "+eventKeyCode);var keyBindings=new Array();keyBindings.push(this.m_guiAdaptor.getKeyBindings());var fa=FormController.getInstance().getFormAdaptor();if(fa instanceof SubformElementGUIAdaptor)
{var cancelEventBinding=fa.m_lifeCycles.cancel.getEventBinding();var submitEventBinding=fa.m_lifeCycles.submit.getEventBinding();if(cancelEventBinding!=null)
{keyBindings=keyBindings.concat(cancelEventBinding.m_keyBindings);}
if(submitEventBinding!=null)
{keyBindings=keyBindings.concat(submitEventBinding.m_keyBindings);}}
var keyCodeString=''+eventKeyCode;var qualifiers=0;if(evt.ctrlKey)qualifiers|=ElementKeyBindings.CTRL_KEY_MASK;if(evt.altKey)qualifiers|=ElementKeyBindings.ALT_KEY_MASK;if(evt.shiftKey)qualifiers|=ElementKeyBindings.SHIFT_KEY_MASK;AutoCompletionRenderer.showDropDown=true;for(var i=0,l=keyBindings.length;i<l;i++)
{if(keyBindings[i].m_keys[keyCodeString]!=null&&keyBindings[i].m_qualifiers[keyCodeString]==qualifiers)
{AutoCompletionRenderer.showDropDown=false;}}
if(this.m_dropDownField.isRaised())
{if(!AutoCompletionRenderer.showDropDown)
{this.m_dropDownField.hideDropDown();}
else
{var change=this._createDynamicDropDownContent();if(change!=AutoCompletionRenderer.NO_CHANGE)
{this._refreshSelectElements(change);}
this._showMatches();}}
else if(AutoCompletionRenderer.showDropDown)
{if((Key.isPrintableKey(eventKeyCode)&&!evt.ctrlKey&&!evt.altKey&&!Key.isFunctionKey(eventKeyCode))||(eventKeyCode==Key.Backspace.m_keyCode))
{this._createDynamicDropDownContent();this.m_dropDownField.showDropDown();}}}
return true;}
AutoCompletionRenderer.prototype._handleKeyDownEvent=function(evt)
{evt=(null!=evt)?evt:window.event;var eventKeyCode=evt.keyCode;var propagateEvent=true;if(this.m_dropDownField.isRaised())
{switch(eventKeyCode)
{case Key.ArrowUp.m_keyCode:{this._selectPreviousMatch();break;}
case Key.ArrowDown.m_keyCode:{this._selectNextMatch();break;}
case Key.PageUp.m_keyCode:{this._selectPreviousPageMatch();SUPSEvent.preventDefault(evt);propagateEvent=false;break;}
case Key.PageDown.m_keyCode:{this._selectNextPageMatch();SUPSEvent.preventDefault(evt);propagateEvent=false;break;}
case Key.Home.m_keyCode:{this._selectFirstMatch();SUPSEvent.preventDefault(evt);propagateEvent=false;break;}
case Key.End.m_keyCode:{this._selectLastMatch();SUPSEvent.preventDefault(evt);propagateEvent=false;break;}}}
if(this.m_guiAdaptor.strictValidation)
{var currentSelection=document.selection.createRange();if(eventKeyCode==Key.Backspace.m_keyCode||(evt.ctrlKey&&(eventKeyCode==Key.CHAR_X.m_keyCode||eventKeyCode==Key.CHAR_x.m_keyCode)))
{this.m_matchSingle=AutoCompletionRenderer.DONT_MATCH;}
else if(currentSelection.text.length!=0)
{if(eventKeyCode==Key.Delete.m_keyCode)
{this.m_matchSingle=AutoCompletionRenderer.DONT_MATCH;}
else if(eventKeyCode!=Key.Tab.m_keyCode&&eventKeyCode!=Key.Home.m_keyCode&&eventKeyCode!=Key.End.m_keyCode&&eventKeyCode!=Key.PageUp.m_keyCode&&eventKeyCode!=Key.PageDown.m_keyCode&&eventKeyCode!=Key.ArrowLeft.m_keyCode&&eventKeyCode!=Key.ArrowRight.m_keyCode)
{this.m_matchSingle=AutoCompletionRenderer.MATCH;}}
else
{if(this.m_matchSingle==AutoCompletionRenderer.FOUND_MATCH)
{if(eventKeyCode!=Key.Home.m_keyCode&&eventKeyCode!=Key.End.m_keyCode&&eventKeyCode!=Key.PageUp.m_keyCode&&eventKeyCode!=Key.PageDown.m_keyCode&&eventKeyCode!=Key.ArrowLeft.m_keyCode&&eventKeyCode!=Key.ArrowRight.m_keyCode&&!(evt.ctrlKey&&(eventKeyCode==Key.CHAR_A.m_keyCode||eventKeyCode==Key.CHAR_a.m_keyCode||eventKeyCode==Key.CHAR_C.m_keyCode||eventKeyCode==Key.CHAR_c.m_keyCode||eventKeyCode==Key.CHAR_Z.m_keyCode||eventKeyCode==Key.CHAR_z.m_keyCode||eventKeyCode==Key.CHAR_Y.m_keyCode||eventKeyCode==Key.CHAR_y.m_keyCode)))
{SUPSEvent.preventDefault(evt);propagateEvent=false;}}
else if(Key.isPrintableKey(eventKeyCode)&&!Key.isFunctionKey(eventKeyCode)&&!evt.ctrlKey&&!evt.altKey)
{this.m_matchSingle=AutoCompletionRenderer.MATCH;}}}
return propagateEvent;}
AutoCompletionRenderer.prototype._useCurrentMatch=function()
{if(this.m_highlightedRow!=null)
{this.m_dropDownField._getInputFieldElement().value=this.m_model.getMatch(this.m_highlightedRow);this.m_selectedRow=this.m_highlightedRow;if(this.m_guiAdaptor.strictValidation)
{this.m_matchSingle=AutoCompletionRenderer.FOUND_MATCH;}}
this.m_dropDownField.hideDropDown();this.m_valueChangeListeners.invoke();}
AutoCompletionRenderer.prototype._showMatches=function()
{if(this.m_model!=null)
{this.m_numberOfMatches=this.m_model.setMatchString(this.getTextFieldValue());this.m_topRow=0;this.m_highlightedRow=null;this.m_selectedRow=null;var scale=null;if(this.m_rows.length>this.m_numberOfMatches)
{scale=this.m_rows.length;this.m_visibleRows=this.m_numberOfMatches;}
else
{scale=this.m_numberOfMatches;this.m_visibleRows=this.m_rows.length;}
if(this.m_verticalScrollbar!=null)
{this.m_verticalScrollbar.setScaling(0,this.m_rows.length,scale);}
this._renderRows();if(this.m_guiAdaptor.strictValidation&&this.m_guiAdaptor.m_singleMatchingEnabled)
{if(this.m_numberOfMatches==1&&this.m_matchSingle==AutoCompletionRenderer.MATCH)
{this.m_matchSingle=AutoCompletionRenderer.FOUND_MATCH;this.m_dropDownField._getInputFieldElement().value=this.m_model.getMatch(0);this.m_valueChangeListeners.invoke();}}}}
AutoCompletionRenderer.prototype._renderRows=function()
{var i;var topRow=this.m_topRow;for(i=0,l=this.m_visibleRows;i<l;i++)
{this._renderRow(i);}
var hiddenRowClass=AutoCompletionRenderer.ROW_HIDDEN_CSS_CLASS_NAME;for(i=this.m_visibleRows,l=this.m_rows.length;i<l;i++)
{this.m_rows[i].className=hiddenRowClass;}
if(this.m_verticalScrollbar!=null)
{this.m_verticalScrollbar.setPosition(this.m_topRow);this.m_verticalScrollbar._render();}}
AutoCompletionRenderer.prototype._renderRow=function(rowNumber)
{var dataRow=rowNumber+this.m_topRow;var r=this.m_rows[rowNumber];var text=this.m_model.getMatch(dataRow);this._setRowContent(r,text);var cN="";var isSubmissible=this.m_model.isKeyForMatchSubmissible(dataRow);var isSelected=this.m_highlightedRow==dataRow;if(isSubmissible==true)
{cN=isSelected?AutoCompletionRenderer.ROW_SELECTED_CSS_CLASS_NAME:AutoCompletionRenderer.ROW_CSS_CLASS_NAME;}
else
{cN=isSelected?AutoCompletionRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME:AutoCompletionRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME;}
r.className=cN;}
AutoCompletionRenderer.prototype._selectPreviousMatch=function()
{if(0==this.m_numberOfMatches)
{return;}
if(null==this.m_highlightedRow)
{this._moveSelection(0);}
else if(this.m_highlightedRow!=0)
{this._moveSelection(this.m_highlightedRow-1);}}
AutoCompletionRenderer.prototype._selectNextMatch=function()
{if(0==this.m_numberOfMatches)
{return;}
if(null==this.m_highlightedRow)
{this._moveSelection(0);}
else if(this.m_highlightedRow!=(this.m_numberOfMatches-1))
{this._moveSelection(this.m_highlightedRow+1);}}
AutoCompletionRenderer.prototype._selectPreviousPageMatch=function()
{var numberOfMatches=this.m_numberOfMatches;if(numberOfMatches!=0&&this.m_highlightedRow!=0)
{var rowsInDropDown=this.m_rows.length;var rowsToPage=(numberOfMatches<rowsInDropDown)?numberOfMatches:rowsInDropDown;var rowToSelect=this.m_highlightedRow-rowsToPage+1;if(rowToSelect<0)
{rowToSelect=0;}
this._moveSelection(rowToSelect);}}
AutoCompletionRenderer.prototype._selectNextPageMatch=function()
{var numberOfMatches=this.m_numberOfMatches;var lastRow=numberOfMatches-1;if(numberOfMatches!=0&&this.m_highlightedRow!=lastRow)
{var rowsInDropDown=this.m_rows.length;var rowsToPage=(numberOfMatches<rowsInDropDown)?numberOfMatches:rowsInDropDown;var rowToSelect=this.m_highlightedRow+rowsToPage-1;if(rowToSelect>lastRow)
{rowToSelect=lastRow;}
this._moveSelection(rowToSelect);}}
AutoCompletionRenderer.prototype._selectFirstMatch=function()
{if(this.m_numberOfMatches!=0&&this.m_highlightedRow!=0)
{this._moveSelection(0);}}
AutoCompletionRenderer.prototype._selectLastMatch=function()
{var numberOfMatches=this.m_numberOfMatches;var lastRow=numberOfMatches-1;if(numberOfMatches!=0&&this.m_highlightedRow!=lastRow)
{this._moveSelection(lastRow);}}
AutoCompletionRenderer.prototype._moveSelection=function(newSelectedRow)
{if(newSelectedRow<this.m_topRow)
{this.m_topRow=newSelectedRow;this.m_highlightedRow=newSelectedRow;this._renderRows();}
else if(newSelectedRow>(this.m_topRow+this.m_rows.length-1))
{this.m_topRow=newSelectedRow-(this.m_rows.length-1);this.m_highlightedRow=newSelectedRow;this._renderRows();}
else
{var csr=this.m_highlightedRow;if(null!=csr&&csr>=this.m_topRow&&csr<(this.m_topRow+this.m_rows.length))
{this.m_highlightedRow=null;this._renderRow(csr-this.m_topRow);}
this.m_highlightedRow=newSelectedRow;this._renderRow(newSelectedRow-this.m_topRow);}}
AutoCompletionRenderer.prototype.getTextFieldValue=function()
{return this.m_dropDownField._getInputFieldElement().value;}
AutoCompletionRenderer.prototype.resetSelectedMatch=function()
{this.m_selectedRow=null;}
AutoCompletionRenderer.prototype.getSelectedMatch=function()
{return this.m_selectedRow;}
AutoCompletionRenderer.prototype.setValue=function(value)
{if(value==null)value="";this.getInputElement().value=value;}
AutoCompletionRenderer.prototype.dataUpdate=function()
{var change=this._createDynamicDropDownContent();if(this.m_dropDownField.isRaised())
{if(change!=AutoCompletionRenderer.NO_CHANGE)
{this._refreshSelectElements(change);}
this._showMatches();}}
AutoCompletionRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isSubmissible,isServerValidationActive)
{if(disabled||readonly||inactive)
{this.stopEventHandlers();}
else
{this.startEventHandlers();}
this.m_dropDownField.render(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isSubmissible,isServerValidationActive);}
AutoCompletionRenderer.prototype.getInputElement=function()
{return this.m_dropDownField._getInputFieldElement();}
AutoCompletionRenderer.prototype._setRowWidth=function()
{var style=getCalculatedStyle(this.m_guiAdaptor.getElement());var elementWidth=style.width.slice(0,-2);elementWidth=isNaN(elementWidth)?180:Number(elementWidth);style=getCalculatedStyle(this.m_dropDownField._getDropDownElement());var borderLeftWidth=style.borderLeftWidth.slice(0,-2);borderLeftWidth=isNaN(borderLeftWidth)?1:Number(borderLeftWidth);var borderRightWidth=style.borderRightWidth.slice(0,-2);borderRightWidth=isNaN(borderRightWidth)?1:Number(borderRightWidth);var borderWidth=borderLeftWidth+borderRightWidth;var scrollBarWidth=0;if(this.m_verticalScrollbar!=null)
{scrollBarWidth=this.m_verticalScrollbar.m_element.clientWidth;}
var rowWidth=elementWidth-scrollBarWidth-borderWidth;var rows=this.m_rows;for(var i=0,l=rows.length;i<l;i++)
{rows[i].style.width=rowWidth;}
var dropDown=this.m_dropDownField._getDropDownElement();dropDown.style.width=elementWidth-borderWidth;}
AutoCompletionRenderer.prototype._createDynamicDropDownContent=function()
{var change=AutoCompletionRenderer.NO_CHANGE;if(this.m_model!=null)
{var maxRows=this.m_maxNumberOfRows;var requiredRows=this.m_model.setMatchString(this.getTextFieldValue());if(0==requiredRows)
{var srcDataRows=this.m_model.getSrcDataRowCount();requiredRows=(srcDataRows!=0&&srcDataRows<maxRows)?srcDataRows:maxRows;}
if(null==this.m_rows)
{this.stopEventHandlers();if(requiredRows>maxRows)
{this._createDynamicDropDownRows(maxRows);this._createDynamicDropDownScrollbar();}
else
{this._createDynamicDropDownRows(requiredRows);}
this._setRowWidth();this.startEventHandlers();}
else
{var currentDropdownRows=this.m_rows.length;this.stopEventHandlers();if(requiredRows==currentDropdownRows)
{if(null!=this.m_verticalScrollbar)
{this._removeDynamicDropDownScrollbar();}}
else if(requiredRows<currentDropdownRows)
{change=AutoCompletionRenderer.REMOVING_ROWS;this._removeDynamicDropDownRows();if(null!=this.m_verticalScrollbar)
{this._removeDynamicDropDownScrollbar();}
this._createDynamicDropDownRows(requiredRows);}
else
{change=AutoCompletionRenderer.ADDING_ROWS;if(requiredRows>maxRows)
{if(maxRows!=currentDropdownRows)
{this._removeDynamicDropDownRows();this._createDynamicDropDownRows(maxRows);}
if(null==this.m_verticalScrollbar)
{this._createDynamicDropDownScrollbar();}}
else
{this._removeDynamicDropDownRows();this._createDynamicDropDownRows(requiredRows);}}
this._setRowWidth();this.startEventHandlers();}}
return change;}
AutoCompletionRenderer.prototype._createDynamicDropDownRows=function(numberOfRows)
{this.m_rows=new Array(numberOfRows);var doc=window.document;for(var i=0;i<numberOfRows;i++)
{var r=doc.createElement("div");r.className=AutoCompletionRenderer.ROW_CSS_CLASS_NAME;this._setRowContent(r,"row "+i);this.m_rowsCell.appendChild(r);this.m_rows[i]=r;}}
AutoCompletionRenderer.prototype._removeDynamicDropDownRows=function()
{if(this.m_rows!=null)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{var r=this.m_rows[i];var childNodes=r.childNodes;for(var k=childNodes.length-1;k>=0;k--)
{r.removeChild(childNodes[k]);}
this.m_rowsCell.removeChild(r);this.m_rows[i]=null;}
this.m_rows=null;}}
AutoCompletionRenderer.prototype._createDynamicDropDownScrollbar=function()
{var doc=window.document;this.m_scrollbarCell=doc.createElement("td");this.m_scrollbarCell.className=AutoCompletionRenderer.SCROLLCELL_CSS_CLASS_NAME;this.m_verticalScrollbar=Scrollbar.createAsChild(this.m_scrollbarCell,this.getElement().id+"VerticalScrollbar",true,null,false);var thisObj=this;this.m_verticalScrollbar.addPositionChangeListener(function(){thisObj._handleVerticalScroll();});this.m_tableRow.appendChild(this.m_scrollbarCell);}
AutoCompletionRenderer.prototype._removeDynamicDropDownScrollbar=function()
{this.m_verticalScrollbar.dispose();this.m_verticalScrollbar=null;this._removeChildNodes(this.m_scrollbarCell);this.m_tableRow.removeChild(this.m_scrollbarCell);this.m_scrollbarCell=null;}
AutoCompletionRenderer.prototype._setRowContent=function(row,text)
{this._removeChildNodes(row);var textNodeContent=text;if(null==textNodeContent||""==textNodeContent)
{textNodeContent="\u00a0";}
var tn=window.document.createTextNode(textNodeContent);row.appendChild(tn);}
AutoCompletionRenderer.prototype._removeChildNodes=function(element)
{var childNodes=element.childNodes;for(var k=childNodes.length-1;k>=0;k--)
{element.removeChild(childNodes[k]);}}
AutoCompletionRenderer.prototype._hideSelectElements=function()
{var selects=PopupLayer.m_allSelects;var container=this.m_rowsCell;for(var i=selects.length-1;i>=0;i--)
{var s=selects[i];if(isContained(s,container))
{var visibility=s.style.visibility;if(visibility!="hidden")
{var selectState=new Object();selectState.visibility=visibility;selectState.disabled=s.disabled;this.m_selectsState[i]=selectState;s.disabled=true;s.style.visibility="hidden";selectState=null;}}}}
AutoCompletionRenderer.prototype._showSelectElements=function()
{var selects=this.m_selectsState;var container=this.m_rowsCell;for(var i=selects.length-1;i>=0;i--)
{var selectState=selects[i];if(selectState!=null)
{var element=PopupLayer.m_allSelects[i];if(!isContained(element,container))
{element.style.visibility=selectState.visibility;element.disabled=selectState.disabled;}}}}
AutoCompletionRenderer.prototype._refreshSelectElements=function(change)
{var dropDownField=this.m_dropDownField;var requiredPos=dropDownField._getDropDownPosition(this.m_rowsCell);if(requiredPos!=dropDownField.m_dropDownPosition)
{dropDownField.hideDropDown();this._showSelectElements();dropDownField.showDropDown();}
else
{if(change==AutoCompletionRenderer.ADDING_ROWS)
{this._hideSelectElements();}
else
{this._showSelectElements();}}}
AutoCompletionRenderer.prototype.setMatchSingle=function(matched)
{if(matched)
{this.m_matchSingle=AutoCompletionRenderer.FOUND_MATCH;}
else
{this.m_matchSingle=AutoCompletionRenderer.MATCH;}}
function FwSelectElementRenderer()
{}
FwSelectElementRenderer.prototype=new Renderer();FwSelectElementRenderer.prototype.constructor=FwSelectElementRenderer;FwSelectElementRenderer.m_logger=new Category("FwSelectElementRenderer");FwSelectElementRenderer.prototype.m_handlersStarted=false;FwSelectElementRenderer.prototype.m_rows=null;FwSelectElementRenderer.prototype.m_numberOfSelectDataRows=null;FwSelectElementRenderer.prototype.m_highlightedRow=null;FwSelectElementRenderer.prototype.m_maxNumberOfRows=null;FwSelectElementRenderer.prototype.m_topRow=null;FwSelectElementRenderer.prototype.m_selectedRow=null;FwSelectElementRenderer.prototype.m_hardcodedOptions=null;FwSelectElementRenderer.prototype.m_valueChangeListeners=null;FwSelectElementRenderer.showDropDown=true;FwSelectElementRenderer.prototype.m_dynamicRowWidth=null;FwSelectElementRenderer.prototype.m_maxRowWidth=null;FwSelectElementRenderer.prototype.m_tableRow=null;FwSelectElementRenderer.prototype.m_rowsCell=null;FwSelectElementRenderer.prototype.m_scrollbarCell=null;FwSelectElementRenderer.prototype.m_verticalScrollbar=null;FwSelectElementRenderer.CSS_CLASS_NAME="fwselectelement";FwSelectElementRenderer.TABLE_CSS_CLASS_NAME="fwselectelement_table";FwSelectElementRenderer.TEMP_TABLE_CSS_CLASS_NAME="fwselectelement_temp_table";FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME="fwselectelement_tablerow";FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME="fwselectelement_rowscell";FwSelectElementRenderer.SCROLLCELL_CSS_CLASS_NAME="fwselectelement_scrollcell";FwSelectElementRenderer.ROW_CSS_CLASS_NAME="fwselectelement_row";FwSelectElementRenderer.ROW_SELECTED_CSS_CLASS_NAME=FwSelectElementRenderer.ROW_CSS_CLASS_NAME+" fwselectelement_rowselected";FwSelectElementRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME=FwSelectElementRenderer.ROW_CSS_CLASS_NAME+" fwselectelement_rowSelectedNotSubmissible";FwSelectElementRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME=FwSelectElementRenderer.ROW_CSS_CLASS_NAME+" fwselectelement_rowNotSubmissible";FwSelectElementRenderer.DEFAULT_MAX_NUMBER_OF_ROWS=8;FwSelectElementRenderer.DEFAULT_INITIAL_WIDTH="180px";FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH=16;FwSelectElementRenderer.REPEAT_INITIAL_DELAY=1000;FwSelectElementRenderer.REPEAT_INTERVAL=200;FwSelectElementRenderer.createInline=function(id,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions)
{var e=Renderer.createInline(id,false);return FwSelectElementRenderer._create(e,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions);}
FwSelectElementRenderer.createAsInnerHTML=function(refElement,relativePos,id,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return FwSelectElementRenderer._create(e,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions);}
FwSelectElementRenderer.createAsChild=function(p,id,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions)
{var e=Renderer.createAsChild(id);p.appendChild(e);return FwSelectElementRenderer._create(e,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions);}
FwSelectElementRenderer._create=function(e,maxRows,dynamicRowWidth,initialWidth,hardcodedOptions)
{e.className=FwSelectElementRenderer.CSS_CLASS_NAME;var fse=new FwSelectElementRenderer();fse._initRenderer(e);if(null==maxRows)
{fse.m_maxNumberOfRows=FwSelectElementRenderer.DEFAULT_MAX_NUMBER_OF_ROWS;}
else
{fse.m_maxNumberOfRows=maxRows;}
if(null!=dynamicRowWidth)
{if(dynamicRowWidth==true)
{fse.m_dynamicRowWidth=true;}
else
{fse.m_dynamicRowWidth=false;}}
else
{fse.m_dynamicRowWidth=true;}
if(fse.m_dynamicRowWidth)
{if(null!=initialWidth)
{fse.m_element.style.width=initialWidth;}
else
{fse.m_element.style.width=FwSelectElementRenderer.DEFAULT_INITIAL_WIDTH;}}
if(null!=hardcodedOptions)
{fse.m_hardcodedOptions=hardcodedOptions;}
fse.m_dropDownField=DropDownFieldRenderer.createAsChild(e,true);fse.m_dropDownField.addShowHideListener(function(show){fse._handleDropDownShowHide(show);});var dropdown=fse.m_dropDownField._getDropDownElement();preventSelection(dropdown);var d=window.document;var table=d.createElement("table");table.className=FwSelectElementRenderer.TABLE_CSS_CLASS_NAME;table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");var tableBody=d.createElement("tbody");tableBody.setAttribute("align","left");var tableRow=d.createElement("tr");fse.m_tableRow=tableRow;tableRow.className=FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME;var rowsCell=d.createElement("td");fse.m_rowsCell=rowsCell;rowsCell.className=FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME;tableRow.appendChild(rowsCell);tableBody.appendChild(tableRow);table.appendChild(tableBody);dropdown.appendChild(table);fse.m_valueChangeListeners=new CallbackList();fse.m_model=null;return fse.m_dropDownField.m_element;}
FwSelectElementRenderer.prototype.startEventHandlers=function()
{if(!this.m_handlersStarted)
{this.m_handlersStarted=true;if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.startEventHandlers();}
var fse=this;this.m_keyupHndlr=SUPSEvent.addEventHandler(this.m_element,'keyup',function(evt){return fse._handleKeyUpEvent(evt);});this.m_keydownHndlr=SUPSEvent.addEventHandler(this.m_element,'keydown',function(evt){return fse._handleKeyDownEvent(evt);});this.m_rowsCell.onclick=function(evt){fse._handleClick(evt);};this.m_rowsCell.ondblclick=function(evt){fse._handleDoubleClick(evt);};this.m_rowsCell.onmouseover=function(evt){fse._handleMouseOver(evt);};}}
FwSelectElementRenderer.prototype.stopEventHandlers=function()
{if(this.m_handlersStarted)
{this.m_handlersStarted=false;if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.stopEventHandlers();}
SUPSEvent.removeEventHandlerKey(this.m_keyupHndlr);this.m_keyupHndlr=null;SUPSEvent.removeEventHandlerKey(this.m_keydownHndlr);this.m_keydownHndlr=null;this.m_rowsCell.onclick=null;this.m_rowsCell.ondblclick=null;this.m_rowsCell.onmouseover=null;}}
FwSelectElementRenderer.prototype.dispose=function()
{this.stopEventHandlers();unPreventSelection(this.m_dropDownField._getDropDownElement());this.m_model=null;if(null!=this.m_hardcodedOptions)
{this.m_hardcodedOptions=null;}
if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.dispose();this.m_verticalScrollbar=null;}
if(null!=this.m_rows)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{this.m_rows[i]=null;}
this.m_rows=null;}
this.m_rowsCell=null;if(null!=this.m_scrollbarCell)
{this.m_scrollbarCell=null;}
this.m_tableRow=null;this.m_dropDownField.dispose();this.m_valueChangeListeners.dispose();delete this.m_valueChangeListeners;this.m_element=null;}
FwSelectElementRenderer.prototype.addValueChangeListener=function(callback)
{this.m_valueChangeListeners.addCallback(callback);}
FwSelectElementRenderer.prototype.setModel=function(model)
{this.m_model=model;this.m_dropDownField.m_guiAdaptor=model;}
FwSelectElementRenderer.prototype._handleVerticalScroll=function()
{if(this.m_topRow!=this.m_verticalScrollbar.m_position)
{this.m_topRow=this.m_verticalScrollbar.m_position;this._renderRows();}}
FwSelectElementRenderer.prototype._handleDropDownShowHide=function(show)
{if(show)
{if(null==this.m_model)
{if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.setScaling(0,100,100);}}
else
{this._renderDropDown();}}}
FwSelectElementRenderer.prototype._handleClick=function(evt)
{if(null==evt)evt=window.event;if(evt.detail==undefined||evt.detail==1)
{this._useCurrentMatch(true);}}
FwSelectElementRenderer.prototype._handleDoubleClick=function(evt)
{this._useCurrentMatch(true);}
FwSelectElementRenderer.prototype._handleMouseOver=function(evt)
{if(null==evt)evt=window.event;var target=SUPSEvent.getTargetElement(evt);if(null!=this.m_rows)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{if(target==this.m_rows[i])
{break;}}
if(i<l)
{this.m_highlightedRow=i+this.m_topRow;this._renderRows();}}}
FwSelectElementRenderer.prototype._handleKeyUpEvent=function(evt)
{evt=(null!=evt)?evt:window.event;var eventKeyCode=evt.keyCode;if(eventKeyCode==Key.ArrowUp.m_keyCode||eventKeyCode==Key.ArrowDown.m_keyCode)
{}
else if(eventKeyCode==Key.Return.m_keyCode)
{this._useCurrentMatch(true);}
else if(!this._isPrintableChar(eventKeyCode))
{}
else
{if(FwSelectElementRenderer.m_logger.isDebug())FwSelectElementRenderer.m_logger.debug("KeyHandler about to showMatches for key: "+eventKeyCode);var keyBindings=new Array();keyBindings.push(this.m_model.getKeyBindings());var fa=FormController.getInstance().getFormAdaptor();if(fa instanceof SubformElementGUIAdaptor)
{var cancelEventBinding=fa.m_lifeCycles.cancel.getEventBinding();var submitEventBinding=fa.m_lifeCycles.submit.getEventBinding();if(cancelEventBinding!=null)
{keyBindings=keyBindings.concat(cancelEventBinding.m_keyBindings);}
if(submitEventBinding!=null)
{keyBindings=keyBindings.concat(submitEventBinding.m_keyBindings);}}
var keyCodeString=''+eventKeyCode;var qualifiers=0;if(evt.ctrlKey)qualifiers|=ElementKeyBindings.CTRL_KEY_MASK;if(evt.altKey)qualifiers|=ElementKeyBindings.ALT_KEY_MASK;if(evt.shiftKey)qualifiers|=ElementKeyBindings.SHIFT_KEY_MASK;FwSelectElementRenderer.showDropDown=true;for(var i=0,l=keyBindings.length;i<l;i++)
{if(keyBindings[i].m_keys[keyCodeString]!=null&&keyBindings[i].m_qualifiers[keyCodeString]==qualifiers)
{FwSelectElementRenderer.showDropDown=false;}}
if(this.m_dropDownField.isRaised())
{if(!FwSelectElementRenderer.showDropDown)
{this.m_dropDownField.hideDropDown();}
else
{this._matchInputCharacter(eventKeyCode,evt);}}
else if(FwSelectElementRenderer.showDropDown)
{this._matchInputCharacter(eventKeyCode,evt);}}
return true;}
FwSelectElementRenderer.prototype._handleKeyDownEvent=function(evt)
{evt=(null!=evt)?evt:window.event;var eventKeyCode=evt.keyCode;switch(eventKeyCode)
{case Key.ArrowUp.m_keyCode:{this._selectPreviousOption();break;}
case Key.ArrowDown.m_keyCode:{this._selectNextOption();break;}
case Key.PageUp.m_keyCode:{this._selectPreviousPageOption();break;}
case Key.PageDown.m_keyCode:{this._selectNextPageOption();break;}
case Key.Home.m_keyCode:{this._selectFirstOption();break;}
case Key.End.m_keyCode:{this._selectLastOption();break;}}
var returnValue=true;if(Key.isScrollKey(eventKeyCode))
{SUPSEvent.preventDefault(evt);returnValue=false;}
return returnValue;}
FwSelectElementRenderer.prototype._useCurrentMatch=function(hideDropDown)
{if(this.m_highlightedRow!=null)
{this.getInputElement().value=this.m_model.getMatch(this.m_highlightedRow);this.m_selectedRow=this.m_highlightedRow;}
if(hideDropDown)
{this.m_dropDownField.hideDropDown();}
this.m_valueChangeListeners.invoke();}
FwSelectElementRenderer.prototype._renderDropDown=function()
{if(this.m_model!=null)
{var currentRow=this.m_model.getRowNoFromDisplayValue(this.getTextFieldValue());this.m_highlightedRow=currentRow;var visibleRows=this.m_rows.length;if(null!=currentRow)
{if(currentRow<visibleRows)
{this.m_topRow=0;}
else
{this.m_topRow=currentRow;if(this.m_topRow+visibleRows>this.m_numberOfSelectDataRows)
{this.m_topRow=this.m_numberOfSelectDataRows-visibleRows;}}}
else
{this.m_topRow=0;}
if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.setScaling(0,visibleRows,this.m_numberOfSelectDataRows);}
this._renderRows();}}
FwSelectElementRenderer.prototype._renderRows=function()
{var i;for(i=0,l=this.m_rows.length;i<l;i++)
{this._renderRow(i);}
if(null!=this.m_verticalScrollbar)
{this.m_verticalScrollbar.setPosition(this.m_topRow);this.m_verticalScrollbar._render();}}
FwSelectElementRenderer.prototype._renderRow=function(rowNumber)
{var r=this.m_rows[rowNumber];var dataRow=rowNumber+this.m_topRow;var isSubmissible=this.m_model.isKeyForMatchSubmissible(dataRow);var isSelected=this.m_highlightedRow==dataRow;this._setRowContent(r,this.m_model.getMatch(dataRow));var cN="";if(isSubmissible==true)
{cN=isSelected?FwSelectElementRenderer.ROW_SELECTED_CSS_CLASS_NAME:FwSelectElementRenderer.ROW_CSS_CLASS_NAME;}
else
{cN=isSelected?FwSelectElementRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME:FwSelectElementRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME;}
r.className=cN;}
FwSelectElementRenderer.prototype._selectPreviousOption=function()
{if(this.m_highlightedRow!=null&&this.m_highlightedRow!=0)
{this._moveSelection(this.m_highlightedRow-1);}}
FwSelectElementRenderer.prototype._selectNextOption=function()
{if(0==this.m_numberOfSelectDataRows)
{return;}
if(null==this.m_highlightedRow)
{this._moveSelection(0);}
else if(this.m_highlightedRow!=(this.m_numberOfSelectDataRows-1))
{this._moveSelection(this.m_highlightedRow+1);}}
FwSelectElementRenderer.prototype._selectPreviousPageOption=function()
{if(this.m_numberOfSelectDataRows!=0&&this.m_highlightedRow!=0)
{var rowToSelect=this.m_highlightedRow-this.m_rows.length+1;if(rowToSelect<0)
{rowToSelect=0;}
this._moveSelection(rowToSelect);}}
FwSelectElementRenderer.prototype._selectNextPageOption=function()
{var numberOfSelectDataRows=this.m_numberOfSelectDataRows;var lastRow=numberOfSelectDataRows-1;if(numberOfSelectDataRows!=0&&this.m_highlightedRow!=lastRow)
{var rowToSelect=this.m_highlightedRow+this.m_rows.length-1;if(rowToSelect>lastRow)
{rowToSelect=lastRow;}
this._moveSelection(rowToSelect);}}
FwSelectElementRenderer.prototype._selectFirstOption=function()
{if(this.m_numberOfSelectDataRows!=0&&this.m_highlightedRow!=0)
{this._moveSelection(0);}}
FwSelectElementRenderer.prototype._selectLastOption=function()
{var numberOfSelectDataRows=this.m_numberOfSelectDataRows;var lastRow=numberOfSelectDataRows-1;if(numberOfSelectDataRows!=0&&this.m_highlightedRow!=lastRow)
{this._moveSelection(lastRow);}}
FwSelectElementRenderer.prototype._moveSelection=function(newSelectedRow)
{if(this.m_dropDownField.isRaised())
{if(newSelectedRow<this.m_topRow)
{this.m_topRow=newSelectedRow;this.m_highlightedRow=newSelectedRow;this._renderRows();}
else if(newSelectedRow>(this.m_topRow+this.m_rows.length-1))
{this.m_topRow=newSelectedRow-(this.m_rows.length-1);this.m_highlightedRow=newSelectedRow;this._renderRows();}
else
{var csr=this.m_highlightedRow;if(null!=csr&&csr>=this.m_topRow&&csr<(this.m_topRow+this.m_rows.length))
{this.m_highlightedRow=null;this._renderRow(csr-this.m_topRow);}
this.m_highlightedRow=newSelectedRow;this._renderRow(newSelectedRow-this.m_topRow);}}
else
{this.m_highlightedRow=newSelectedRow;}
this._useCurrentMatch(false);}
FwSelectElementRenderer.prototype.getTextFieldValue=function()
{return this.m_dropDownField._getInputFieldElement().value;}
FwSelectElementRenderer.prototype.resetSelectedMatch=function()
{this.m_selectedRow=null;this.m_highlightedRow=null;}
FwSelectElementRenderer.prototype.getSelectedMatch=function()
{return this.m_selectedRow;}
FwSelectElementRenderer.prototype.setSelectedRow=function(selectedRow)
{this.m_selectedRow=selectedRow;if(this.m_highlightedRow!=this.m_selectedRow)
{this.m_highlightedRow=this.m_selectedRow;}}
FwSelectElementRenderer.prototype.setValue=function(value)
{if(value==null)value="";this.getInputElement().value=value;}
FwSelectElementRenderer.prototype.dataUpdate=function()
{var raised=false;var dropDownField=this.m_dropDownField;if(dropDownField.isRaised())
{raised=true;dropDownField.hideDropDown();}
this._createDynamicDropDownContent();if(raised)
{dropDownField.showDropDown();}}
FwSelectElementRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isSubmissible,isServerValidationActive)
{if(disabled||readonly||inactive)
{this.stopEventHandlers();}
else
{this.startEventHandlers();}
this.m_dropDownField.render(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isSubmissible,isServerValidationActive);}
FwSelectElementRenderer.prototype.getInputElement=function()
{return this.m_dropDownField._getInputFieldElement();}
FwSelectElementRenderer.prototype._setRowWidth=function()
{var elementWidth=this.m_element.clientWidth;var scrollBarWidth=0;if(null!=this.m_verticalScrollbar)
{scrollBarWidth=this.m_verticalScrollbar.m_element.clientWidth;}
var dropDown=this.m_dropDownField._getDropDownElement();var borderWidth=this._getBorderWidth(dropDown);var rowPaddingWidth=this._getDropDownRowPaddingWidth();var rowWidth=elementWidth-scrollBarWidth-borderWidth-rowPaddingWidth;var rows=this.m_rows;for(var i=0,l=rows.length;i<l;i++)
{rows[i].style.width=rowWidth;}
dropDown.style.width=elementWidth-borderWidth;}
FwSelectElementRenderer.prototype._setDynamicRowWidth=function()
{var maxRowWidth=this.m_maxRowWidth;if(null!=maxRowWidth)
{if(null==this.m_verticalScrollbar)
{maxRowWidth+=FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH;}
var rows=this.m_rows;for(var i=0,l=rows.length;i<l;i++)
{rows[i].style.width=maxRowWidth+"px";}}}
FwSelectElementRenderer.prototype.getHardcodedOptions=function()
{return this.m_hardcodedOptions;}
FwSelectElementRenderer.prototype._isPrintableChar=function(keyCode)
{var printableCharacter;switch(keyCode)
{case Key.Tab.m_keyCode:case Key.ESC.m_keyCode:case Key.PageUp.m_keyCode:case Key.PageDown.m_keyCode:case Key.ScrollLock.m_keyCode:case Key.PrintScreen.m_keyCode:case Key.Insert.m_keyCode:case Key.NumLock.m_keyCode:case Key.Menu.m_keyCode:case Key.Home.m_keyCode:case Key.End.m_keyCode:case Key.Windows.m_keyCode:{printableCharacter=false;break;}
default:{printableCharacter=true;break;}}
return printableCharacter}
FwSelectElementRenderer.prototype._matchInputCharacter=function(eventKeyCode,evt)
{if(Key.isPrintableKey(eventKeyCode)&&!evt.ctrlKey&&!evt.altKey&&!Key.isFunctionKey(eventKeyCode))
{var matchedRow=this.m_model.matchFirstCharacter(String.fromCharCode(eventKeyCode));if(null!=matchedRow)
{this.getInputElement().value=this.m_model.getMatch(matchedRow);this.m_selectedRow=matchedRow;this.m_highlightedRow=this.m_selectedRow;if(this.m_dropDownField.isRaised())
{this._renderDropDown();}
this.m_valueChangeListeners.invoke();}}}
FwSelectElementRenderer.prototype._createDynamicDropDownContent=function()
{if(null!=this.m_model)
{var maxRows=this.m_maxNumberOfRows;this.m_numberOfSelectDataRows=this.m_model.getNumberOfSelectRows();var numberOfSelectDataRows=this.m_numberOfSelectDataRows;if(null==this.m_rows)
{if(numberOfSelectDataRows>=0)
{this.stopEventHandlers();if(this.m_dynamicRowWidth)
{this._setSelectElementWidth(numberOfSelectDataRows);}
if(numberOfSelectDataRows>maxRows)
{this._createDynamicDropDownRows(maxRows);if(null==this.m_verticalScrollbar)
{this._createDynamicDropDownScrollbar();}}
else
{this._createDynamicDropDownRows(numberOfSelectDataRows);}
if(!this.m_dynamicRowWidth)
{this._setRowWidth();}
else
{this._setDynamicRowWidth();}
this.startEventHandlers();}}
else
{if(!this.m_hardcodedOptions)
{this.stopEventHandlers();this._removeDynamicDropDownRows();if(numberOfSelectDataRows>=0)
{var scrollbarChange=false;if(this.m_dynamicRowWidth)
{this._setSelectElementWidth(numberOfSelectDataRows);}
if(numberOfSelectDataRows>maxRows)
{this._createDynamicDropDownRows(maxRows);if(null==this.m_verticalScrollbar)
{this._createDynamicDropDownScrollbar();scrollbarChange=true;}}
else
{if(null!=this.m_verticalScrollbar)
{this._removeDynamicDropDownScrollbar();scrollbarChange=true;}
this._createDynamicDropDownRows(numberOfSelectDataRows);}
if(!this.m_dynamicRowWidth)
{if(scrollbarChange)
{this._setRowWidth();}}
else
{this._setDynamicRowWidth();}}
this.startEventHandlers();}}}}
FwSelectElementRenderer.prototype._createDynamicDropDownRows=function(numberOfRows)
{if(numberOfRows>0)
{this.m_rows=new Array(numberOfRows);}
else
{this.m_rows=new Array();}
var doc=window.document;for(var i=0;i<numberOfRows;i++)
{var r=doc.createElement("div");r.className=FwSelectElementRenderer.ROW_CSS_CLASS_NAME;this.m_rowsCell.appendChild(r);this.m_rows[i]=r;}}
FwSelectElementRenderer.prototype._removeDynamicDropDownRows=function()
{if(null!=this.m_rows)
{for(var i=0,l=this.m_rows.length;i<l;i++)
{var r=this.m_rows[i];var childNodes=r.childNodes;for(var k=childNodes.length-1;k>=0;k--)
{r.removeChild(childNodes[k]);}
this.m_rowsCell.removeChild(r);this.m_rows[i]=null;}
this.m_rows=null;}}
FwSelectElementRenderer.prototype._createDynamicDropDownScrollbar=function()
{var doc=window.document;this.m_scrollbarCell=doc.createElement("td");this.m_scrollbarCell.className=FwSelectElementRenderer.SCROLLCELL_CSS_CLASS_NAME;this.m_verticalScrollbar=Scrollbar.createAsChild(this.m_scrollbarCell,this.getElement().id+"VerticalScrollbar",true,null,false);var thisObj=this;this.m_verticalScrollbar.addPositionChangeListener(function(){thisObj._handleVerticalScroll();});this.m_tableRow.appendChild(this.m_scrollbarCell);}
FwSelectElementRenderer.prototype._removeDynamicDropDownScrollbar=function()
{this.m_verticalScrollbar.dispose();this.m_verticalScrollbar=null;var childNodes=this.m_scrollbarCell.childNodes;for(var k=childNodes.length-1;k>=0;k--)
{this.m_scrollbarCell.removeChild(childNodes[k]);}
this.m_tableRow.removeChild(this.m_scrollbarCell);this.m_scrollbarCell=null;}
FwSelectElementRenderer.prototype._setSelectElementWidth=function(numberOfSelectDataRows)
{var rowProperties=this._determineRowProperties(numberOfSelectDataRows);this.m_maxRowWidth=rowProperties["maxWidth"];var rowPaddingWidth=rowProperties["rowPaddingWidth"];if(null!=this.m_maxRowWidth&&null!=rowPaddingWidth)
{var dropdownBorderWidth=this._getBorderWidth(this.m_dropDownField._getDropDownElement());var totalSelectElementWidth=this.m_maxRowWidth+
rowPaddingWidth+
dropdownBorderWidth+
FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH;this.getElement().style.width=totalSelectElementWidth+"px";this.m_dropDownField._getDropDownElement().style.width=(totalSelectElementWidth-
dropdownBorderWidth)+"px";}}
FwSelectElementRenderer.prototype._determineRowProperties=function(numberOfSelectDataRows)
{var doc=window.document;var container=doc.createElement("div");doc.appendChild(container)
var table=doc.createElement("table");table.className=FwSelectElementRenderer.TEMP_TABLE_CSS_CLASS_NAME;table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");container.appendChild(table);var tableBody=doc.createElement("tbody");tableBody.setAttribute("align","left");table.appendChild(tableBody);var tableRow=doc.createElement("tr");tableRow.className=FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME;tableBody.appendChild(tableRow);var rowsCell=doc.createElement("td");rowsCell.className=FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME;tableRow.appendChild(rowsCell);var row=doc.createElement("div");row.className=FwSelectElementRenderer.ROW_CSS_CLASS_NAME;rowsCell.appendChild(row);var rowWidth=0;var maxRowWidth=0;for(var i=0;i<numberOfSelectDataRows;i++)
{var text=this.m_model.getMatch(i);this._setRowContent(row,text);rowWidth=row.offsetWidth;if(null!=rowWidth)
{if(rowWidth>maxRowWidth)
{maxRowWidth=rowWidth;}}}
maxRowWidth+=this._getBorderWidth(this.m_dropDownField.m_borderDiv);var rowPaddingWidth=this._getPaddingWidth(row);var rowProperties=new Object();rowProperties["maxWidth"]=maxRowWidth;rowProperties["rowPaddingWidth"]=rowPaddingWidth;this._removeChildNodes(row);rowsCell.removeChild(row);row=null;tableRow.removeChild(rowsCell)
rowsCell=null;tableBody.removeChild(tableRow);tableRow=null;table.removeChild(tableBody);tableBody=null;container.removeChild(table);table=null;doc.removeChild(container);container=null;return rowProperties;}
FwSelectElementRenderer.prototype._setRowContent=function(row,text)
{this._removeChildNodes(row);var textNodeContent=text;if(null==textNodeContent||""==textNodeContent)
{textNodeContent="\u00a0";}
var tn=window.document.createTextNode(textNodeContent);row.appendChild(tn);}
FwSelectElementRenderer.prototype._removeChildNodes=function(element)
{var childNodes=element.childNodes;for(var k=childNodes.length-1;k>=0;k--)
{element.removeChild(childNodes[k]);}}
FwSelectElementRenderer.prototype._getBorderWidth=function(element)
{var borderWidth=0;var pixels="px";var elementStyle=getCalculatedStyle(element);var borderLeft=null;var borderLeftWidth=elementStyle.borderLeftWidth;if(borderLeftWidth.indexOf(pixels)!=-1)
{borderLeft=parseInt(borderLeftWidth);}
var borderRight=null;var borderRightWidth=elementStyle.borderRightWidth;if(borderRightWidth.indexOf(pixels)!=-1)
{borderRight=parseInt(borderRightWidth);}
if(null!=borderLeft)
{borderWidth+=borderLeft;}
if(null!=borderRight)
{borderWidth+=borderRight;}
return borderWidth;}
FwSelectElementRenderer.prototype._getDropDownRowPaddingWidth=function()
{var paddingWidth=0;if(null!=this.m_rows&&this.m_rows.length>0)
{var rows=this.m_rows;var row=null;for(var i=0,l=rows.length;i<l;i++)
{var r=rows[i];if(r.className.indexOf(FwSelectElementRenderer.ROW_CSS_CLASS_NAME)!=-1)
{row=r;break;}}
if(null!=row)
{paddingWidth=this._getPaddingWidth(row);}}
return paddingWidth;}
FwSelectElementRenderer.prototype._getPaddingWidth=function(element)
{var paddingWidth=0;var pixels="px";var elementStyle=getCalculatedStyle(element);var paddingLeft=elementStyle.paddingLeft;var paddingLeftWidth=null;if(paddingLeft.indexOf(pixels)!=-1)
{paddingLeftWidth=parseInt(paddingLeft);}
var paddingRight=elementStyle.paddingRight;var paddingRightWidth=null;if(paddingRight.indexOf(pixels)!=-1)
{paddingRightWidth=parseInt(paddingRight);}
if(null!=paddingLeftWidth)
{paddingWidth+=paddingLeftWidth;}
if(null!=paddingRightWidth)
{paddingWidth+=paddingRightWidth;}
return paddingWidth;}
function ActionBarRenderer(){}
ActionBarRenderer.prototype=new Renderer();ActionBarRenderer.prototype.constructor=ActionBarRenderer;ActionBarRenderer.CSS_CLASS_NAME="action_bar";ActionBarRenderer.prototype.m_buttons=null;ActionBarRenderer.createInline=function(id,buttons,statusBarId)
{ActionBarRenderer._createInline(id,buttons,null==statusBarId?"status_line":statusBarId);}
ActionBarRenderer.createInlineNoStatusBar=function(id,buttons)
{ActionBarRenderer._createInline(id,buttons,null);}
ActionBarRenderer.createAsInnerHTML=function(refElement,relativePos,id,buttons,statusBarId)
{ActionBarRenderer._createAsInnerHTML(refElement,relativePos,id,buttons,null==statusBarId?"status_line":statusBarId);}
ActionBarRenderer.createAsInnerHTMLNoStatusBar=function(refElement,relativePos,id,buttons)
{ActionBarRenderer._createAsInnerHTML(refElement,relativePos,id,buttons,null);}
ActionBarRenderer._createInline=function(id,buttons,statusBarId)
{var e=Renderer.createInline(id,false);return ActionBarRenderer._create(e,buttons,statusBarId);}
ActionBarRenderer._createAsInnerHTML=function(refElement,relativePos,id,buttons,statusBarId)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return ActionBarRenderer._create(e,buttons,statusBarId);}
ActionBarRenderer.createAsChild=function(p,id,buttons,statusBarId)
{var e=Renderer.createAsChild(id);p.appendChild(e);return ActionBarRenderer._create(e,buttons,statusBarId);}
ActionBarRenderer._create=function(e,buttons,statusBarId)
{e.className=ActionBarRenderer.CSS_CLASS_NAME;var b=new ActionBarRenderer();b.m_element=e;var d=document;var table=d.createElement("table");table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");table.className="action_bar_container";var tbody=d.createElement("tbody");table.appendChild(tbody);var tr=d.createElement("tr");tr.className="action_bar_container_row";tbody.appendChild(tr);if(statusBarId!=null)
{var statusLabelCell=d.createElement("td");statusLabelCell.className="status_label";tr.appendChild(statusLabelCell);var statusMessageCell=d.createElement("td");statusMessageCell.className="status_message";tr.appendChild(statusMessageCell);statusLabelCell.innerHTML="Status";var span=d.createElement("span");span.id=statusBarId;statusMessageCell.appendChild(span);}
if(null!=buttons&&buttons.length>0)
{var buttonsCell=d.createElement("td");tr.appendChild(buttonsCell);b.m_buttons=new Array(buttons.length);var buttonContainer=d.createElement("div");buttonContainer.className="button_container";for(var i=0;i<buttons.length;i++)
{var button=d.createElement("input");button.id=buttons[i].id;button.setAttribute("type","button");button.setAttribute("value",buttons[i].label);button.className=buttons[i].className;buttonContainer.appendChild(button);b.m_buttons[i]=button;}
buttonsCell.appendChild(buttonContainer);}
else
{b.m_buttons=null;}
e.appendChild(table);return b;}
ActionBarRenderer.prototype.getButtons=function()
{return this.m_buttons;}
function PopupRenderer()
{}
PopupRenderer.prototype=new Renderer();PopupRenderer.prototype.constructor=PopupRenderer;PopupRenderer.CSS_CLASS_NAME="popup";PopupRenderer.CSS_CLASS_NAME_FULLPAGE="popup popup_fullscreen";PopupRenderer.createAsChild=function(p,id,buttons,title)
{var popup=Renderer.createAsChild(id);var pr=PopupRenderer._create(popup,buttons,title);p.appendChild(popup);return pr;}
PopupRenderer._create=function(p,buttons,title)
{var pr=new PopupRenderer();pr._setElement(p);p.className=PopupRenderer.CSS_CLASS_NAME;var table=Renderer.createElementAsChild(p,"table");table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");table.className="popup_layout";var tbody=Renderer.createElementAsChild(table,"tbody");if(null!=title)
{var titleRow=Renderer.createElementAsChild(tbody,"tr");var titleCell=Renderer.createElementAsChild(titleRow,"td");pr.m_titleContainer=Renderer.createElementAsChild(titleCell,"div");pr.m_titleContainer.className="popupTitle";pr.m_titleContainer.innerHTML=title;}
var contentsRow=Renderer.createElementAsChild(tbody,"tr");pr.m_container=Renderer.createElementAsChild(contentsRow,"td");pr.m_container.className="popup_contents";var actionBarRow=Renderer.createElementAsChild(tbody,"tr");var actionBarCell=Renderer.createElementAsChild(actionBarRow,"td");actionBarCell.className="actionbar_container";pr.m_actionBar=ActionBarRenderer.createAsChild(actionBarCell,p.id+"_actionbar",buttons);return pr;}
PopupRenderer.prototype.getContentsContainerElement=function()
{return this.m_container;}
PopupRenderer.prototype.getActionBarRenderer=function()
{return this.m_actionBar;}
PopupRenderer.prototype.getTitleBarContainer=function()
{return this.m_titleContainer;}
function PopupLowerBusinessLifeCycle(){}
PopupLowerBusinessLifeCycle.prototype=new BusinessLifeCycle();PopupLowerBusinessLifeCycle.prototype.constructor=PopupLowerBusinessLifeCycle;PopupLowerBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_LOWER;}
PopupLowerBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_adaptor.show(false);}
function PopupRaiseBusinessLifeCycle(){}
PopupRaiseBusinessLifeCycle.prototype=new BusinessLifeCycle();PopupRaiseBusinessLifeCycle.prototype.constructor=PopupRaiseBusinessLifeCycle;PopupRaiseBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_RAISE;}
PopupRaiseBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var tm=FormController.getInstance().getTabbingManager();if(null!=tm)
{var currentFocussedAdaptor=tm.m_currentFocussedAdaptor;if(null!=currentFocussedAdaptor&&(currentFocussedAdaptor instanceof SelectElementGUIAdaptor))
{tm.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS,null));var adaptorId=this.m_adaptor.getId();var currentFocussedAdaptorId=currentFocussedAdaptor.getId();setTimeout(function(){Services.getAdaptorById(adaptorId).show(true,currentFocussedAdaptorId);},0);}
else
{this.m_adaptor.show(true);}}
else
{this.m_adaptor.show(true);}}
PopupRaiseBusinessLifeCycle.prototype._configure=function(config)
{if(null==this.m_eventBinding)
{var id=this.m_adaptor.getId()+"_"+
this.getName()+"_eventBinding";this.m_eventBinding=new EventBinding(id);this.m_eventBinding.configure(config);if(this.m_eventBinding.hasConfiguredProperty("isEnabled"))
{FormController.getInstance().addEnablementEventBinding(this.m_eventBinding);}
var thisObj=this;this.m_eventBinding.bind(function(){thisObj.dispatchEvent();});}}
function StandardDialogRenderer()
{}
StandardDialogRenderer.prototype=new Renderer();StandardDialogRenderer.prototype.constructor=StandardDialogRenderer;StandardDialogRenderer.CSS_CLASS_NAME="standard_dialog";StandardDialogRenderer.DEFAULT_WIDTH=500;StandardDialogRenderer.FULLSCREEN_GAP=10;StandardDialogRenderer.NUMBER_OF_BUTTONS=3;StandardDialogRenderer.prototype.m_popup=null;StandardDialogRenderer.prototype.m_messageContainer=null;StandardDialogRenderer.prototype.m_type=undefined;StandardDialogRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return StandardDialogRenderer._create(e);}
StandardDialogRenderer._create=function(e)
{e.className=StandardDialogRenderer.CSS_CLASS_NAME;var sdr=new StandardDialogRenderer();var id=e.id;var buttons=new Array(StandardDialogRenderer.NUMBER_OF_BUTTONS);for(var i=0,l=buttons.length;i<l;i++)
{buttons[i]={id:id+"_button_"+i,label:"button "+i};}
sdr.m_popup=PopupRenderer.createAsChild(e,id+"_popup",buttons,"standard_dialog_"+id);var contents=sdr.m_popup.getContentsContainerElement();var panel=Renderer.createElementAsChild(contents,"div");panel.className="panel";sdr.m_messageContainer=Renderer.createElementAsChild(panel,"div");sdr.m_messageContainer.className="message_container";sdr._initRenderer(sdr.m_popup.getElement());sdr.m_popup.getElement().__renderer=null;return sdr;}
StandardDialogRenderer.prototype.getButtons=function()
{return this.m_popup.getActionBarRenderer().getButtons();}
StandardDialogRenderer.prototype.setTitle=function(title)
{this.m_popup.getTitleBarContainer().innerHTML=title;}
StandardDialogRenderer.prototype.setMessage=function(message)
{this.m_messageContainer.innerHTML=message;}
StandardDialogRenderer.prototype.setType=function(type)
{if(this.m_type!=type)
{var buttons=this.getButtons();var buttonTypes=StandardDialogRenderer.BUTTON_MAP[type];var buttonCount=buttonTypes.length;var i=0;for(;i<buttonCount;i++)
{buttons[i].value=StandardDialogRenderer.BUTTON_LABELS[buttonTypes[i]];}
i=0;for(;i<buttonCount;i++)
{buttons[i].style.display="";}
for(l=buttons.length;i<l;i++)
{buttons[i].style.display="none";}
this.m_type=type;}}
StandardDialogRenderer.prototype.setWidth=function(width)
{width=Number(width);width=(isNaN(width)||0==width||width<0)?StandardDialogRenderer.DEFAULT_WIDTH:width;var e=this.getElement();var docEl=e.ownerDocument.documentElement;var windowWidth=window.innerWidth!=null?window.innerWidth:docEl.clientWidth;windowWidth-=(StandardDialogRenderer.FULLSCREEN_GAP*2);if(width>=windowWidth){width=windowWidth;}
e.style.width=width+"px";}
StandardDialogRenderer.prototype.positionPopup=function(top,left)
{var e=this.getElement();var docEl=e.ownerDocument.documentElement;var windowHeight=window.innerHeight!=null?window.innerHeight:docEl.clientHeight;var windowWidth=window.innerWidth!=null?window.innerWidth:docEl.clientWidth;var scrollY=window.pageYOffset!=null?window.pageYOffset:docEl.scrollTop;var popupWidth=e.offsetWidth;var popupHeight=e.offsetHeight;var x=(null==left||isNaN(left))?(windowWidth-popupWidth)/2:Number(left);var y=(null==top||isNaN(top))?(windowHeight-popupHeight)/2:Number(top);if(x+popupWidth>windowWidth)
{x=windowWidth-popupWidth;}
if(x<0){x=0;}
if(y+popupHeight>windowHeight+scrollY)
{y=windowHeight-popupHeight;}
if(y<0){y=0;}
e.style.position="absolute";e.style.left=x+"px";e.style.top=y+"px";}
StandardDialogRenderer.prototype.getButtonClicked=function(button)
{var buttonNumber=button.id.slice(-1);var buttonTypes=StandardDialogRenderer.BUTTON_MAP[this.m_type];var clickedButtonType=buttonTypes[buttonNumber];return clickedButtonType;}
StandardDialogRenderer.BUTTON_MAP=[[StandardDialogButtonTypes.OK],[StandardDialogButtonTypes.OK,StandardDialogButtonTypes.CANCEL],[StandardDialogButtonTypes.YES,StandardDialogButtonTypes.NO],[StandardDialogButtonTypes.YES,StandardDialogButtonTypes.NO,StandardDialogButtonTypes.CANCEL]];StandardDialogRenderer.BUTTON_LABELS=["OK","Cancel","Yes","No"];function StandardDialogManager()
{}
StandardDialogManager.m_instances=new Array();StandardDialogManager.m_allocatedCount=0;StandardDialogManager.DIALOG_ID_PREFIX="fw_standard_dialog_";StandardDialogManager._getInstance=function()
{if(StandardDialogManager.m_instances.length<=StandardDialogManager.m_allocatedCount)
{StandardDialogManager.m_instances[StandardDialogManager.m_instances.length]=StandardDialogManager._createInstance()}
var d=StandardDialogManager.m_instances[StandardDialogManager.m_allocatedCount++];return d;}
StandardDialogManager._createInstance=function()
{var fc=FormController.getInstance();var form=fc.getFormAdaptor();var formElement=form.getElement();var d=StandardDialogRenderer.createAsChild(formElement,StandardDialogManager.DIALOG_ID_PREFIX+StandardDialogManager.m_instances.length);var view=fc.getFormView();var cm=view.getConfigManager();var buttons=d.getButtons();for(var i=0,l=buttons.length;i<l;i++)
{StandardDialogManager._createActionBinding(cm,d,buttons[i]);}
var factory=view.getGUIAdaptorFactory();var popupAdaptors=factory.parseElement(d.getElement(),form)
fc.addAdaptors(popupAdaptors);return d;}
StandardDialogManager._createActionBinding=function(cm,sd,b)
{cm.setConfig(b.id,{actionBinding:function(){StandardDialogManager._handleButtonClick(sd,b);}});}
StandardDialogManager.showDialog=function(type,callback,message,title,width,top,left)
{var sd=StandardDialogManager._getInstance();if(null==title)
{title=StandardDialogManager._getProjectName();}
sd.setTitle(title);sd.setMessage(message);sd.setType(type);delete sd.callback;sd.callback=callback;sd.setWidth(width);sd.positionPopup(top,left);Services.dispatchEvent(sd.getElement().id,PopupGUIAdaptor.EVENT_RAISE);}
StandardDialogManager._handleButtonClick=function(sd,button)
{StandardDialogManager.m_allocatedCount--;Services.dispatchEvent(sd.getElement().id,PopupGUIAdaptor.EVENT_LOWER);var buttonClicked=sd.getButtonClicked(button);sd.callback.call(null,buttonClicked);}
StandardDialogManager._getProjectName=function()
{var ac=Services.getAppController();return ac.getProjectName();}
function LoginGUIAdaptor()
{this.successForm=null;this.failureForm=null;}
LoginGUIAdaptor.m_logger=new Category("LoginGUIAdaptor");LoginGUIAdaptor.USERNAME_DATA_BINDING="/ds/private/username";LoginGUIAdaptor.PASSWORD_DATA_BINDING="/ds/private/password";LoginGUIAdaptor.LOGIN_ERROR_MSG="Invalid Username or Password";LoginGUIAdaptor.prototype=new HTMLElementGUIAdaptor();LoginGUIAdaptor.prototype.constructor=LoginGUIAdaptor;GUIAdaptor._setUpProtocols('LoginGUIAdaptor');LoginGUIAdaptor.prototype._dispose=function()
{if(LoginGUIAdaptor.m_logger.isInfo())LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor.dispose()");this.m_element.__renderer=null;}
LoginGUIAdaptor.create=function(e)
{if(LoginGUIAdaptor.m_logger.isInfo())LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor.create()");var a=new LoginGUIAdaptor();a._initLoginGUIAdaptor(e);return a;}
LoginGUIAdaptor.prototype._initLoginGUIAdaptor=function(e)
{if(LoginGUIAdaptor.m_logger.isInfo())LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor._initLoginGUIAdaptor");this.m_element=e;}
LoginGUIAdaptor.DEFAULT_MAX_LENGTH=10;LoginGUIAdaptor.prototype._configure=function(cs)
{if(LoginGUIAdaptor.m_logger.isInfo())LoginGUIAdaptor.m_logger.info("LoginGUIAdaptor._configure()");var thisObj=this;var id=this.m_element.id;var ctor1=function(){};window[id+"_username"]=ctor1;ctor1.dataBinding=LoginGUIAdaptor.USERNAME_DATA_BINDING;ctor1.isMandatory=function(){return true;};var ctor2=function(){};window[id+"_password"]=ctor2;ctor2.dataBinding=LoginGUIAdaptor.PASSWORD_DATA_BINDING;ctor2.isMandatory=function(){return true;};for(var i=0;i<cs.length;i++)
{var c=cs[i];if(this.m_successForm==null&&c.successForm!=null)
{this.m_successForm=c.successForm;}}
if(this.m_successForm==null)
{throw new ConfigurationException("the successForm configuration is mandatory for Login adaptor");}
var ctor=function(){};window[id+"_button"]=ctor;ctor.actionBinding=function()
{var ue=document.getElementById(id+"_username");var pe=document.getElementById(id+"_password");var username=ue.value;var password=pe.value;if(null==username||""==username)
{thisObj._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG,id+"_username");}
else if(null==password||""==password)
{thisObj._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG,id+"_password");}
else
{var callback=new Object();callback.controller=thisObj;callback.method=thisObj.loginCallBack;Services.login(callback,username.toLowerCase(),password);}};ctor.additionalBindings={eventBinding:{keys:[{key:Key.Return,element:id+"_username"},{key:Key.Return,element:id+"_password"}]}};var ue=document.getElementById(id+"_username");ue.maxLength=LoginGUIAdaptor.DEFAULT_MAX_LENGTH;}
LoginGUIAdaptor.prototype.loginCallBack=function(SecurityContext,authenticationResult)
{var id=this.getId()+"_password";Services.setValue(LoginGUIAdaptor.PASSWORD_DATA_BINDING,"");if(null!=authenticationResult)
{if(true==authenticationResult.error)
{this._showAlert("An Error occurred calling the Login Service: "+authenticationResult.detail,id);}
else
{if(null!=authenticationResult.value&&authenticationResult.value.length>0)
{var ac=Services.getAppController();ac._showUser();var securityService=ac.getSecurityServiceByName("getHomeCourt");var serviceParams=LoginGUIAdaptor.getSecurityServiceParams("getHomeCourt");var username=Services.getValue(LoginGUIAdaptor.USERNAME_DATA_BINDING).toLowerCase();serviceParams.addSimpleParameter("userId",username);serviceParams.addSimpleParameter("getHomeCourt","true");LoginGUIAdaptor.m_successForm=this.m_successForm;var callback=new Object();callback.onSuccess=LoginGUIAdaptor.getCourtIdCallback;callback.onError=LoginGUIAdaptor.onGetCourtIdError;Services.callService(securityService.getName(),serviceParams,callback,true);}
else
{this._showAlert(LoginGUIAdaptor.LOGIN_ERROR_MSG,id);}}}
else
{this._showAlert("Error in calling Login Service",id);}}
LoginGUIAdaptor.prototype._showAlert=function(msg,fieldId)
{var ac=Services.getAppController();var thisObj=this;var callbackFunction=function(userResponse)
{setTimeout(function(){thisObj._setFocus(fieldId);},0);}
if(ac.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{Services.showAlert(msg,callbackFunction);}
else
{alert(msg);setTimeout(function(){thisObj._setFocus(fieldId);},0);}}
LoginGUIAdaptor.prototype._setFocus=function(fieldId)
{TabbingManager._processTabbingEvents();Services.setFocus(fieldId);}
LoginGUIAdaptor.onGetCourtIdError=function(ex)
{Services.showAlert("Error loading home court for user");}
LoginGUIAdaptor.getCourtIdCallback=function(resultDom)
{var ac=Services.getAppController();var securityService=ac.getSecurityServiceByName("getHomeCourt");Services.setValue(securityService.getDataBinding(),XML.selectNodeGetTextContent(resultDom,"//HomeCourt"));Services.setValue("/ds/var/app/StyleProfile",XML.selectNodeGetTextContent(resultDom,"//StyleProfile"));Services.setValue("/ds/var/app/DefaultPrinter",XML.selectNodeGetTextContent(resultDom,"//DefaultPrinter"));var styleName=Services.getValue("/ds/var/app/StyleProfile");if(null!=styleName&&""!=styleName)
{var result=ac.getStyleManager().setStyle(styleName);if(!result)
{Services.showAlert("Unrecognised style name '"+styleName+"' in user profile. Using default style instead.");ac.getStyleManager().setStyle(null);}}
var getRolesSecurityService=ac.getSecurityServiceByName("getRoles");var serviceParams=LoginGUIAdaptor.getSecurityServiceParams("getRoles");serviceParams.addSimpleParameter("userId",ac.getSecurityContext().getCurrentUser().getUserName());var callback=new Object();callback.onSuccess=LoginGUIAdaptor.getRolesCallback;callback.onError=LoginGUIAdaptor.onGetRolesError;Services.callService(getRolesSecurityService.getName(),serviceParams,callback,true);}
LoginGUIAdaptor.getRolesCallback=function(resultDom)
{var securityService=Services.getAppController().getSecurityServiceByName("getRoles");var db=securityService.getDataBinding();Services.removeNode(db);db=XPathUtils.removeTrailingNode(db);Services.addNode(resultDom,db);Services.navigate(LoginGUIAdaptor.m_successForm,false);}
LoginGUIAdaptor.onGetRolesError=function(ex)
{Services.showAlert("Error loading roles for user");}
LoginGUIAdaptor.getSecurityServiceParams=function(name)
{var service=Services.getAppController().getSecurityServiceByName(name);var params=new ServiceParams();var value=null;var serviceParams=service.getParameters();for(var i=0;i<serviceParams.length;i++)
{var serviceParam=serviceParams[i];value=Services.getValue(serviceParam.value);params.addSimpleParameter(serviceParam.name,value);}
return params;}
function LoginRenderer()
{this.m_successForm=null;}
LoginRenderer.prototype=new Renderer();LoginRenderer.prototype.constructor=LoginRenderer;LoginRenderer.m_logger=new Category("LoginRenderer");LoginRenderer.CSS_LOGIN_CLASS_NAME="login";LoginRenderer.createInline=function(id)
{var e=Renderer.createInline(id,false);return LoginRenderer._create(e);}
LoginRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return LoginRenderer._create(e);}
LoginRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return LoginRenderer._create(e);}
LoginRenderer._create=function(e)
{e.className=LoginRenderer.CSS_LOGIN_CLASS_NAME;var lr=new LoginRenderer();lr._initRenderer(e);var id=e.id;var userNameLabel=document.createElement("label");userNameLabel.innerHTML="Username ";userNameLabel.setAttribute("for",id+"_username");e.appendChild(userNameLabel);var userNameInput=document.createElement("input");userNameInput.id=id+"_username";userNameInput.setAttribute("type","text");userNameInput.setAttribute("size","8");e.appendChild(userNameInput);this.m_userNameInput=userNameInput;var break1=document.createElement("br");e.appendChild(break1);var passwordLabel=document.createElement("label");passwordLabel.innerHTML="Password ";passwordLabel.setAttribute("for",id+"_password");e.appendChild(passwordLabel);var passwordInput=document.createElement("input");passwordInput.id=id+"_password";passwordInput.setAttribute("type","password");passwordInput.setAttribute("size","8");e.appendChild(passwordInput);this.m_passwordInput=passwordInput;var break2=document.createElement("br");e.appendChild(break2);var loginButton=document.createElement("input");loginButton.value="Login";loginButton.id=id+"_button";loginButton.setAttribute("type","button");loginButton.setAttribute("size","8");e.appendChild(loginButton);this.m_loginButton=loginButton;return lr;}
function LOVProtocol()
{}
LOVProtocol.prototype.srcData=null;LOVProtocol.prototype.srcDataOn=null;LOVProtocol.prototype.dataBinding=null;LOVProtocol.prototype.rowXPath=null;LOVProtocol.prototype.columns=null;LOVProtocol.prototype.keyXPath=null;LOVProtocol.prototype.multipleSelection=null;LOVProtocol.prototype.configLOVProtocol=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.dataBinding&&this.dataBinding==null)
{this.dataBinding=c.dataBinding;}
if(c.srcData!=null&&this.srcData==null)
{this.srcData=c.srcData;}
if(c.srcDataOn!=null&&this.srcDataOn==null)
{this.srcDataOn=c.srcDataOn;}
if(c.rowXPath!=null&&this.rowXPath==null)
{this.rowXPath=c.rowXPath;}
if(c.keyXPath!=null&&this.keyXPath==null)
{this.keyXPath=c.keyXPath;}
if(c.columns!=null&&this.columns==null)
{this.columns=c.columns;}
if(c.multipleSelection!=null&&this.multipleSelection==null)
{this.multipleSelection=c.multipleSelection;}}}
LOVProtocol.prototype.disposeLOVProtocol=function()
{}
function LOVPopupRenderer(){};LOVPopupRenderer.prototype=new Renderer();LOVPopupRenderer.prototype.constructor=LOVPopupRenderer;LOVPopupRenderer.POPUP_CSS_CLASS="popup";LOVPopupRenderer.LOV_POPUP_CSS_CLASS="lovPopup popup";LOVPopupRenderer.LOV_POPUP_TABLE_CSS_CLASS="lovPopupTable";LOVPopupRenderer.createInline=function(id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createInline(id,false);return LOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVPopupRenderer.createAsInnerHTML=function(refElement,relativePos,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return LOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVPopupRenderer.createAsChild=function(p,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsChild(id);p.appendChild(e);return LOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVPopupRenderer._create=function(e,label,columns,rows,groupSize,isFiltered)
{e.className=LOVPopupRenderer.LOV_POPUP_CSS_CLASS;var lov=new LOVPopupRenderer();lov._initRenderer(e);lov.m_isFiltered=isFiltered;var id=e.id;var title=Renderer.createElementAsChild(e,"div");title.className="popupTitle";title.innerHTML=label;var panel=Renderer.createElementAsChild(e,"div");panel.className="panel";var gridId=id+"_grid";if(isFiltered==true)
{FilteredGrid.createAsInnerHTML(panel,Renderer.CHILD_ELEMENT,gridId,columns,rows,groupSize);}
else
{Grid.createAsInnerHTML(panel,Renderer.CHILD_ELEMENT,gridId,columns,rows,groupSize);}
ActionBarRenderer.createAsChild(e,id+"_actionbar",[{id:id+"_okButton",label:"OK"},{id:id+"_cancelButton",label:"Cancel"}],null);return lov;}
function MultiLOVPopupRenderer(){};MultiLOVPopupRenderer.prototype=new Renderer();MultiLOVPopupRenderer.prototype.constructor=MultiLOVPopupRenderer;MultiLOVPopupRenderer.POPUP_CSS_CLASS="popup";MultiLOVPopupRenderer.LOV_POPUP_CSS_CLASS="multiLOVPopup popup";MultiLOVPopupRenderer.LOV_POPUP_TABLE_CSS_CLASS="lovPopupTable";MultiLOVPopupRenderer.createInline=function(id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createInline(id,false);return MultiLOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
MultiLOVPopupRenderer.createAsInnerHTML=function(refElement,relativePos,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return MultiLOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
MultiLOVPopupRenderer.createAsChild=function(p,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsChild(id);p.appendChild(e);return MultiLOVPopupRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
MultiLOVPopupRenderer._create=function(e,label,columns,rows,groupSize,isFiltered)
{e.className=MultiLOVPopupRenderer.LOV_POPUP_CSS_CLASS;var lov=new MultiLOVPopupRenderer();lov._initRenderer(e);lov.m_isFiltered=isFiltered;var id=e.id;var title=Renderer.createElementAsChild(e,"div");title.className="popupTitle";title.innerHTML=label;var panel=Renderer.createElementAsChild(e,"div");panel.className="panel";var gridId=id+"_grid";if(isFiltered==true)
{FilteredGrid.createAsInnerHTML(panel,Renderer.CHILD_ELEMENT,gridId,columns,rows,groupSize);}
else
{Grid.createAsInnerHTML(panel,Renderer.CHILD_ELEMENT,gridId,columns,rows,groupSize);}
ActionBarRenderer.createAsChild(e,id+"_actionbar",[{id:id+"_okButton",label:"OK"},{id:id+"_cancelButton",label:"Cancel"}],null);return lov;}
function LOVSubformRenderer(){};LOVSubformRenderer.prototype=new Renderer();LOVSubformRenderer.prototype.constructor=LOVSubformRenderer;LOVSubformRenderer.LOV_SUBFORM_CSS_CLASS="popup lovsubform";LOVSubformRenderer.LOV_SUBFORM_CSS_CLASS_NAME_FULLPAGE="popup lovsubform popup_fullscreen";LOVSubformRenderer.createInline=function(id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createInline(id,false);return LOVSubformRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVSubformRenderer.createAsInnerHTML=function(refElement,relativePos,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return LOVSubformRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVSubformRenderer.createAsChild=function(p,id,label,columns,rows,groupSize,isFiltered)
{var e=Renderer.createAsChild(id);p.appendChild(e);return LOVSubformRenderer._create(e,label,columns,rows,groupSize,isFiltered);}
LOVSubformRenderer._create=function(e,label,columns,rows,groupSize,isFiltered)
{e.className=LOVSubformRenderer.LOV_SUBFORM_CSS_CLASS;var lov=new LOVSubformRenderer();lov._initRenderer(e);lov.m_label=label;lov.m_columns=columns;lov.m_rows=rows;lov.m_groupSize=groupSize;lov.m_isFiltered=isFiltered;return lov;}
function FramedFieldRenderer()
{}
FramedFieldRenderer.m_logger=new Category("FramedFieldRenderer");FramedFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME="framedfield_table_border"
FramedFieldRenderer.LAYOUT_TABLE_CSS_CLASS_NAME="framedfield_container"
FramedFieldRenderer.prototype.m_disabled=false;FramedFieldRenderer.prototype.m_focussed=false;FramedFieldRenderer.prototype.m_mandatory=false;FramedFieldRenderer.prototype.m_invalid=false;FramedFieldRenderer.prototype.m_serverInvalid=false;FramedFieldRenderer.prototype.m_readonly=false;FramedFieldRenderer.prototype.m_inactive=false;FramedFieldRenderer.createAsChild=function(p,className,multiline)
{var e=document.createElement("div");p.appendChild(e);return FramedFieldRenderer._create(e,className,multiline);}
FramedFieldRenderer._create=function(e,cN,multiline)
{var f=new FramedFieldRenderer();e.className=cN;f.m_className=cN;f.m_element=e;f.m_borderDiv=document.createElement("div");f.m_borderDiv.className=FramedFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME;f.m_element.appendChild(f.m_borderDiv);var table=document.createElement("table");table.className=FramedFieldRenderer.LAYOUT_TABLE_CSS_CLASS_NAME;table.setAttribute("cellspacing","0px");table.setAttribute("cellpadding","0px");f.m_borderDiv.appendChild(table);var tBody=document.createElement("tbody");table.appendChild(tBody);f.m_row=document.createElement("tr");tBody.appendChild(f.m_row);var inputCell=document.createElement("td");inputCell.className="framedfield_field_container";f.m_row.appendChild(inputCell);if(multiline){f.m_inputField=document.createElement("textarea");f.m_inputField.setAttribute("rows",1);f.m_inputField.setAttribute("cols",19);f.m_inputField.setAttribute("wrap","soft");}
else{f.m_inputField=document.createElement("input");f.m_inputField.setAttribute("type","text");}
f.m_inputField.className="framedfield_field";inputCell.appendChild(f.m_inputField);f.m_offsetWidth=0;return f;}
FramedFieldRenderer.prototype.dispose=function()
{this.m_guiAdaptor=null;}
FramedFieldRenderer.prototype._getInputFieldElement=function()
{return this.m_inputField;}
FramedFieldRenderer.prototype.addCellAfterField=function()
{var c=document.createElement("td");this.m_row.appendChild(c);return c;}
FramedFieldRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive)
{this.m_disabled=disabled;this.m_focussed=focussed;this.m_mandatory=mandatory;this.m_invalid=invalid;this.m_serverInvalid=serverInvalid;this.m_readonly=readonly;this.m_inactive=inactive;this.m_isServerValidationActive=isServerValidationActive;this._render();}
FramedFieldRenderer.prototype._getClassName=function()
{var className=this.m_className;if(this.m_disabled||this.m_inactive)
{className+=" framedfield_disabled";}
else
{if(this.m_focussed)
{className+=" framedfield_focus";}
if(this.m_guiAdaptor.hasValue())
{if(this.m_invalid)
{if(this.m_serverInvalid)
{if(this.m_isServerValidationActive)
{className+=" framedfield_server_invalid";}
else
{className+=" framedfield_invalid";}}
else
{className+=" framedfield_invalid";}}}
else
{if(this.m_mandatory)
{className+=" framedfield_mandatory";}}
if(this.m_readonly)
{className+=" framedfield_readonly";}}
return className;}
FramedFieldRenderer.prototype._render=function()
{if(this.m_offsetWidth==0&&this.m_inputField.parentNode.offsetWidth>0)
{var borderStyle=getCalculatedStyle(this.m_borderDiv);var borderLeftWidth=borderStyle.borderLeftWidth.slice(0,-2);borderLeftWidth=isNaN(borderLeftWidth)?2:Number(borderLeftWidth);var borderRightWidth=borderStyle.borderRightWidth.slice(0,-2);borderRightWidth=isNaN(borderRightWidth)?2:Number(borderRightWidth);var elementStyle=getCalculatedStyle(this.m_guiAdaptor.getElement());var elementWidth=elementStyle.width.slice(0,-2);elementWidth=isNaN(elementWidth)?160:Number(elementWidth);var buttonElement=this.m_guiAdaptor._getPopupButton().m_element;var buttonCellWidth=buttonElement.parentNode.offsetWidth;buttonCellWidth=isNaN(buttonCellWidth)?18:Number(buttonCellWidth);var inputFieldWidth=elementWidth-borderLeftWidth-buttonCellWidth-borderRightWidth;inputFieldWidth-=4;this.m_inputField.style.width=inputFieldWidth+"px";this.m_offsetWidth=this.m_inputField.style.width;}
else
{this.m_inputField.style.width=this.m_offsetWidth;}
this.m_inputField.disabled=this.m_disabled||this.m_inactive;this.m_inputField.readOnly=this.m_readonly;if(this.m_disabled||this.m_inactive)
{if(this.m_guiAdaptor.getHelpText()!=null){this.m_guiAdaptor.unbindHelp();}}
else
{if(this.m_guiAdaptor.getHelpText()!=null){this.m_guiAdaptor.bindHelp();}}
this.m_element.className=this._getClassName();}
function ButtonFieldRenderer()
{}
ButtonFieldRenderer.m_logger=new Category("ButtonFieldRenderer");ButtonFieldRenderer.prototype.m_button=null;ButtonFieldRenderer.CSS_CLASS_NAME="buttonfield";ButtonFieldRenderer.createAsChild=function(p,multiline)
{var f=new ButtonFieldRenderer();f.m_framedField=FramedFieldRenderer.createAsChild(p,ButtonFieldRenderer.CSS_CLASS_NAME,multiline);var buttonCell=f.m_framedField.addCellAfterField();buttonCell.className="buttonfield_button_container";f.m_button=Button.createAsChild(buttonCell,null,"buttonfield_button");return f;}
ButtonFieldRenderer.prototype.dispose=function()
{this.m_button.dispose();this.m_framedField.dispose();}
ButtonFieldRenderer.prototype.startEventHandlers=function()
{this.m_button.startEventHandlers();}
ButtonFieldRenderer.prototype.stopEventHandlers=function()
{this.m_button.stopEventHandlers();}
ButtonFieldRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive)
{if(disabled||inactive)
{this.stopEventHandlers();}
else
{this.startEventHandlers();}
this.m_framedField.render(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive);}
function ZoomFieldRenderer()
{}
ZoomFieldRenderer.prototype=new Renderer();ZoomFieldRenderer.prototype.constructor=ZoomFieldRenderer;ZoomFieldRenderer.m_logger=new Category("ZoomFieldRenderer");ZoomFieldRenderer.m_menuBarBottom=null;ZoomFieldRenderer.DEFAULT_NO_ROWS=20;ZoomFieldRenderer.DEFAULT_NO_COLS=80;ZoomFieldRenderer.CSS_CLASS_NAME="zoom_field";ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME="zoomfield_container";ZoomFieldRenderer.createInline=function(id,r,c,multiline)
{var e=Renderer.createInline(id,false);return ZoomFieldRenderer._create(e,r,c,multiline);}
ZoomFieldRenderer.createAsInnerHTML=function(refElement,relativePos,id,r,c,multiline)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return ZoomFieldRenderer._create(e,r,c,multiline);}
ZoomFieldRenderer.createAsChild=function(p,id,r,c,multiline)
{var e=Renderer.createAsChild(id);p.appendChild(e);return ZoomFieldRenderer._create(e,r,c,multiline);}
ZoomFieldRenderer._create=function(e,r,c,multiline)
{e.className=ZoomFieldRenderer.CSS_CLASS_NAME;var f=new ZoomFieldRenderer();f._initRenderer(e);var zoomId=e.id;if(null==r)
{r=ZoomFieldRenderer.DEFAULT_NO_ROWS;}
if(null==c)
{c=ZoomFieldRenderer.DEFAULT_NO_COLS;}
var container=document.createElement("div");container.className=ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME;e.appendChild(container);f.m_multiline=(null==multiline)?false:multiline;f.m_buttonField=ButtonFieldRenderer.createAsChild(container,f.m_multiline);f.m_popup=PopupRenderer.createAsChild(container,zoomId+"_popup",[{id:zoomId+"_ok",label:"OK"},{id:zoomId+"_cancel",label:"Cancel"}]);var popupContentsElement=f.m_popup.getContentsContainerElement();var panel=document.createElement("div");panel.className="panel";popupContentsElement.appendChild(panel);f.m_textarea=document.createElement("textarea");f.m_textarea.setAttribute("rows",r);f.m_textarea.setAttribute("cols",c);f.m_textarea.setAttribute("wrap","soft");f.m_textarea.id=zoomId+"_textarea";panel.appendChild(f.m_textarea);f.startEventHandlers();return f;}
ZoomFieldRenderer.prototype.dispose=function()
{this.m_buttonField.dispose();}
ZoomFieldRenderer.prototype.startEventHandlers=function()
{this.m_buttonField.startEventHandlers();}
ZoomFieldRenderer.prototype.stopEventHandlers=function()
{this.m_buttonField.stopEventHandlers();}
ZoomFieldRenderer.prototype.positionPopup=function()
{var p=this.m_popup.getElement();var zf=p.parentNode;var ph=p.offsetHeight;var pw=p.offsetWidth;var zfh=zf.offsetHeight;var zfw=zf.offsetWidth;var zfPos=getAbsolutePosition(zf);var docEl=zf.ownerDocument.documentElement;var windowHeight=window.innerHeight!=null?window.innerHeight:docEl.clientHeight;var windowWidth=window.innerWidth!=null?window.innerWidth:docEl.clientWidth;var scrollY=window.scrollY!=null?window.scrollY:docEl.scrollTop;var scrollX=window.scrollX!=null?window.scrollX:docEl.scrollLeft;var borderStyle=getCalculatedStyle(p);var borderLeftWidth=borderStyle.borderLeftWidth.slice(0,-2);borderLeftWidth=isNaN(borderLeftWidth)?2:Number(borderLeftWidth);if(null==ZoomFieldRenderer.m_menuBarBottom)
{var divs=docEl.getElementsByTagName("DIV");ZoomFieldRenderer.m_menuBarBottom=0;for(var i=0,l=divs.length;i<l;i++)
{var div=divs[i];if(div.className==MenuBarRenderer.MENU_BASE_DIV)
{var mbPos=getAbsolutePosition(div);ZoomFieldRenderer.m_menuBarBottom=mbPos.top+div.offsetHeight;break;}}}
var bottomOfPopupBelow=zfPos.top+zfh+ph;var popupTop=null;if(bottomOfPopupBelow<=(windowHeight+scrollY))
{popupTop=zfh;}
else
{var zfPos=getAbsolutePosition(zf);var topOfPopupAbove=ZoomFieldRenderer.m_menuBarBottom+ph;if(topOfPopupAbove<=(zfPos.top-scrollY))
{popupTop=p.offsetHeight;}
else
{var borderTopWidth=borderStyle.borderTopWidth.slice(0,-2);borderTopWidth=isNaN(borderTopWidth)?2:Number(borderTopWidth);var borderBottomWidth=borderStyle.borderBottomWidth.slice(0,-2);borderBottomWidth=isNaN(borderBottomWidth)?2:Number(borderBottomWidth);ph+=(borderTopWidth+borderBottomWidth);popupTop=(ph-zfh)/2;bottomOfPopupBelow=zfPos.top+zfh+popupTop;topOfPopupAbove=zfPos.top-popupTop;if(bottomOfPopupBelow>(windowHeight+scrollY)||topOfPopupAbove<ZoomFieldRenderer.m_menuBarBottom)
{var gap=(windowHeight+scrollY-ph)/2;popupTop=zfPos.top-gap-(ZoomFieldRenderer.m_menuBarBottom/2);}}
popupTop=-popupTop;}
var popupLeft=-borderLeftWidth;var gapToRight=scrollX+windowWidth-(zfPos.left+pw);if(gapToRight<0)
{popupLeft+=gapToRight;}
p.style.top=popupTop+"px";p.style.left=popupLeft+"px";zf.className=ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME+" raised";}
ZoomFieldRenderer.prototype.lowerPopup=function()
{this.m_popup.getElement().parentNode.className=ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME;}
ZoomFieldRenderer.prototype.getTextArea=function()
{return this.m_textarea;}
ZoomFieldRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive)
{this.m_buttonField.render(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive);}
ZoomFieldRenderer.prototype._setAdaptor=function(adaptor)
{this.m_buttonField.m_framedField.m_guiAdaptor=adaptor;}
ZoomFieldRenderer.prototype.getInputField=function()
{return this.m_buttonField.m_framedField.m_inputField;}
ZoomFieldRenderer.prototype.getPopupButton=function()
{return this.m_buttonField.m_button;}
ZoomFieldRenderer.prototype.getMultiline=function()
{return this.m_multiline;}
function ZoomFieldGUIAdaptor(){}
ZoomFieldGUIAdaptor.m_logger=new Category("ZoomFieldGUIAdaptor");ZoomFieldGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('ZoomFieldGUIAdaptor');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor','KeybindingProtocol');ZoomFieldGUIAdaptor.prototype.constructor=ZoomFieldGUIAdaptor;ZoomFieldGUIAdaptor.prototype.maxLength=null;ZoomFieldGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry=null;ZoomFieldGUIAdaptor.create=function(e,factory)
{if(ZoomFieldGUIAdaptor.m_logger.isTrace())ZoomFieldGUIAdaptor.m_logger.trace("create()");var a=new ZoomFieldGUIAdaptor();a._initialiseAdaptor(e);return a;}
ZoomFieldGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(ZoomFieldGUIAdaptor.m_logger.isTrace())ZoomFieldGUIAdaptor.m_logger.trace("_initialiseAdaptor()");HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_keyBindings=new Array();this.m_renderer._setAdaptor(this);}
ZoomFieldGUIAdaptor.prototype._dispose=function()
{if(ZoomFieldGUIAdaptor.m_logger.isTrace())ZoomFieldGUIAdaptor.m_logger.trace("ZoomFieldGUIAdaptor.dispose()");this.m_renderer.dispose();this.m_renderer=null;var cm=FormController.getInstance().getFormView().getConfigManager();var zoomId=this.getId();cm.removeConfig(zoomId+"_popup");cm.removeConfig(zoomId+"_ok");cm.removeConfig(zoomId+"_cancel");cm.removeConfig(zoomId+"_textarea");for(var i=0,l=this.m_keyBindings.length;i<l;i++)
this.m_keyBindings[i].dispose();}
ZoomFieldGUIAdaptor.prototype._configure=function(cs)
{if(ZoomFieldGUIAdaptor.m_logger.isTrace())ZoomFieldGUIAdaptor.m_logger.trace("_configure()");for(var i=0;i<cs.length;i++)
{var c=cs[i];if(null!=c.maxLength&&null==this.maxLength)
{this.maxLength=c.maxLength;this.validate=this._validateMaxLength;}
if(FormController.getValidateWhitespaceOnlyEntryActive())
{if(null!=c.validateWhitespaceOnlyEntry&&this.m_validateWhitespaceOnlyEntry==null)
{this.m_validateWhitespaceOnlyEntry=c.validateWhitespaceOnlyEntry;}}}
if(null!=this.maxLength)this._getInputField().maxLength=this.maxLength;if(FormController.getValidateWhitespaceOnlyEntryActive()&&this.m_validateWhitespaceOnlyEntry!=false)
{if(this.maxLength!=null)
{this._addWhitespaceOnlyEntryValidation();}
else
{this.validate=this._validateWhitespaceOnlyEntry;}}
var fc=FormController.getInstance();var cm=fc.getFormView().getConfigManager();var zoomId=this.getId();var thisObj=this;var popupId=zoomId+"_popup";cm.setConfig(zoomId+"_ok",{actionBinding:function(){thisObj._handleOk();}});cm.setConfig(zoomId+"_cancel",{actionBinding:function(){thisObj._handleCancel();},additionalBindings:{eventBinding:{keys:[{key:Key.F4,element:popupId}]}}});var textAreaId=zoomId+"_textarea";this.m_textAreaDataBinding=DataModel.DEFAULT_TMP_BINDING_ROOT+"/"+textAreaId;var textAreaConfigObj={includeInValidation:false,dataBinding:this.m_textAreaDataBinding,maxLength:this.maxLength};if(FormController.getValidateWhitespaceOnlyEntryActive())
{textAreaConfigObj["m_validateWhitespaceOnlyEntry"]=this.m_validateWhitespaceOnlyEntry;}
cm.setConfig(textAreaId,textAreaConfigObj);var a=fc.getAdaptorById(textAreaId);a._handleBlur=thisObj._handleTextAreaBlur;cm.setConfig(popupId,{nextFocusedAdaptorId:function(){return zoomId;}});this._getPopupButton().addClickListener(function(){thisObj._raisePopup();});var keyObj=new Object();var qualObj=new Object();qualObj.alt=true;if(HTMLView.isIE){keyObj.m_keyCode=Key.CHAR_Z.m_keyCode;}
else{keyObj.m_keyCode=Key.CHAR_z.m_keyCode;}
this.m_keyBindings[0]=new ElementKeyBindings(this);this.m_keyBindings[0].bindKey(keyObj,function(){thisObj._handleDefaultKey();},qualObj);}
ZoomFieldGUIAdaptor.prototype._handleOk=function()
{this._lowerPopup();var textAreaValue=this._getTextArea().value;if(!this._getMultiline())
{textAreaValue=textAreaValue.replace(new RegExp("[\\n\\r]","gm")," ");}
this._getInputField().value=textAreaValue;this.update();}
ZoomFieldGUIAdaptor.prototype._handleCancel=function()
{this._lowerPopup();}
ZoomFieldGUIAdaptor.prototype._lowerPopup=function()
{Services.dispatchEvent(this.getId()+"_popup",PopupGUIAdaptor.EVENT_LOWER);this.m_renderer.lowerPopup();}
ZoomFieldGUIAdaptor.prototype._raisePopup=function()
{Services.setValue(this.m_textAreaDataBinding,this._getInputField().value);this._prePopupPrepare();this.m_renderer.positionPopup();Services.dispatchEvent(this.getId()+"_popup",PopupGUIAdaptor.EVENT_RAISE);}
ZoomFieldGUIAdaptor.prototype._getValueFromView=function()
{return this._getInputField().value;}
ZoomFieldGUIAdaptor.prototype.onBlur=function()
{this.update();}
ZoomFieldGUIAdaptor.prototype.renderState=function()
{if(ZoomFieldGUIAdaptor.m_logger.isDebug())
{ZoomFieldGUIAdaptor.m_logger.debug(this.getId()+":ZoomFieldGUIAdaptor.renderState() this.m_enabled="+this.m_enabled+", this.m_readOnly="+this.m_readOnly+", this.getValid()="+this.getValid()+", this.m_mandatory="+this.m_mandatory+", this.isActive()="+this.isActive());}
if(this.m_valueChanged)
{this._getInputField().value=(null==this.m_value?"":this.m_value);this.m_valueChanged=false;}
if(this.m_focusChanged)
{if(this.m_focus)
{this._getInputField().select();}
this.m_focusChanged=false;}
this.m_renderer.render(!this.m_enabled,this.m_focus,this.m_mandatory,!this.getValid(),!this.getServerValid(),this.m_readOnly,!this.isActive(),this.isServerValidationActive());}
ZoomFieldGUIAdaptor.prototype.getFocusElement=function()
{return this._getInputField();}
ZoomFieldGUIAdaptor.prototype._getInputField=function()
{return this.m_renderer.getInputField();}
ZoomFieldGUIAdaptor.prototype._getTextArea=function()
{return this.m_renderer.getTextArea();}
ZoomFieldGUIAdaptor.prototype._getPopupButton=function()
{return this.m_renderer.getPopupButton();}
ZoomFieldGUIAdaptor.prototype._getMultiline=function()
{return this.m_renderer.getMultiline();}
ZoomFieldGUIAdaptor.prototype._handleDefaultKey=function()
{if(!AbstractPopupGUIAdaptor._isPopupRaised(this.getId()+"_popup"))
{this._raisePopup();}}
ZoomFieldGUIAdaptor.prototype._handleTextAreaBlur=function(evt)
{evt=(evt)?evt:((event)?event:null);var eventX=SUPSEvent.getPageX(evt);var eventY=SUPSEvent.getPageY(evt);var pointElement=document.elementFromPoint(eventX,eventY);if(pointElement!=null)
{var pointElementId=pointElement.id;var textAreaId=this.getId();var zoomFieldId=textAreaId.substring(0,textAreaId.lastIndexOf("_textarea"));if(pointElementId!=(zoomFieldId+"_ok")&&pointElementId!=(zoomFieldId+"_cancel"))
{var fc=FormController.getInstance();var dm=fc.getDataModel();var zf=fc.getAdaptorById(zoomFieldId);var db=zf.dataBinding;var origValue=dm.getValue(db);var mv=this._getValueFromView();dm.setValue(db,mv);this.update();this.setValid(zf.getValid());this.m_serverValid=zf.getServerValid();this.setMandatory(zf.getMandatory());this.setReadOnly(zf.getReadOnly());dm.setValue(db,origValue);}
else
{this.update();}}
else
{this.update();}}
ZoomFieldGUIAdaptor.prototype._prePopupPrepare=function()
{var zoomId=this.getId();var a=Services.getAdaptorById(zoomId+"_ok");var readOnly=this.getReadOnly();if(a.setEnabled(!readOnly))
{a.renderState();}
if(!readOnly)this.update();a=Services.getAdaptorById(zoomId+"_textarea");var validChanged=a.setValid(this.getValid());var mandatoryChanged=a.setMandatory(this.getMandatory());var readOnlyChanged=a.setReadOnly(readOnly);var serverValidChanged=a.m_serverValid;a.m_serverValid=this.getServerValid();serverValidChanged=!(serverValidChanged==a.m_serverValid);if(validChanged||mandatoryChanged||readOnlyChanged||serverValidChanged)
{a.renderState();}}
function FWDateUtil()
{}
FWDateUtil.m_logger=new Category("FWDateUtil");FWDateUtil.shortMonths=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];FWDateUtil.months=["January","February","March","April","May","June","July","August","September","October","November","December"];FWDateUtil.shortDays=["Su","Mo","Tu","We","Th","Fr","Sa"];FWDateUtil.NO_OF_MONTHS=12;FWDateUtil.NO_OF_WEEKDAYS=7;FWDateUtil.MILLISECONDS_PER_DAY=1000*60*60*24;FWDateUtil.dateParseRegex=/^\s*0?(\d|1\d|2\d|3[01])\s*?(\-|\s|\/)\s*?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*?(\-|\s|\/)\s*?([1-9]\d{3})\s*$/i;FWDateUtil.dateXSDParseRegex=/^(\d{4})\-(\d{2})\-(\d{2})$/;FWDateUtil.shortMonthLookup=function(month)
{var ms=FWDateUtil.shortMonths;var uMonth=month.toUpperCase();for(var i=0,l=ms.length;i<l;i++)
{if(ms[i].toUpperCase()==uMonth)
{return i;}}
return null;}
FWDateUtil.parseDate=function(dateString)
{if(FWDateUtil.m_logger.isDebug())
{FWDateUtil.m_logger.debug("FWDateUtil.parseDate("+dateString+")");}
if(FWDateUtil.dateParseRegex.exec(dateString))
{var day=parseInt(RegExp.$1);var month=FWDateUtil.shortMonthLookup(RegExp.$3);var year=RegExp.$5;var dateObj=new Date(year,month,day,0,0,0);if(dateObj.getDate()==day&&dateObj.getMonth()==month)
{return dateObj;}}
return null;}
FWDateUtil.parseXSDDate=function(dateString)
{if(FWDateUtil.m_logger.isDebug())FWDateUtil.m_logger.debug("FWDateUtil.parseXSDDate("+dateString+")");return FWDateUtil.dateXSDParseRegex.exec(dateString)?new Date(RegExp.$1,(RegExp.$2-1),RegExp.$3,0,0,0):null;}
FWDateUtil.datesEqual=function(d1,d2)
{return(d1.getDate()==d2.getDate())&&(d1.getMonth()==d2.getMonth())&&(d1.getFullYear()==d2.getFullYear());}
FWDateUtil.compareDates=function(d1,d2)
{return
(d1==null&&d2!=null)||(d1!=null&&d2==null)||(d1!=null&&d2!=null&&!FWDateUtil.datesEqual(d1,d2));}
FWDateUtil.getDaysDifference=function(d1,d2)
{var difference=d1-d2;return Math.round(difference/FWDateUtil.MILLISECONDS_PER_DAY);}
FWDateUtil.validateXSDDate=function(dateValue,weekends)
{var ec=null;var valid=false;var date=FWDateUtil.parseXSDDate(dateValue);if(null!=date)
{var day=date.getDay();if(weekends)
{valid=true;}
else
{if(day>=1&&day<=5)
{valid=true;}
else
{ec=ErrorCode.getErrorCode('InvalidFieldLength');ec.m_message="Cannot enter a weekend date as this field is configured for weekdays only";}}}
else
{ec=ErrorCode.getErrorCode('InvalidFieldLength');ec.m_message="The value does not conform to a valid date format of DD-MMM-YYYY, or is an invalid date";}
if(FWDateUtil.m_logger.isInfo())FWDateUtil.m_logger.info("FWDateUtils.validate() returning = "+ec);return ec;}
FWDateUtil.ConvertDateToXSDString=function(dateObj)
{var date=dateObj.getDate();date=(date<10)?"0"+date:date;var month=dateObj.getMonth()+1;month=(month<10)?"0"+month:month;var ret=dateObj.getFullYear()+"-"+month+"-"+date;return ret;}
FWDateUtil.ConvertDateToString=function(dateObj)
{var day=dateObj.getDate();day=(day<10)?"0"+day:day;var month=FWDateUtil.shortMonths[dateObj.getMonth()];var year=dateObj.getFullYear();return day+"-"+month+"-"+year;}
function DatePickerRenderer()
{}
DatePickerRenderer.prototype=new Renderer();DatePickerRenderer.prototype.constructor=DatePickerRenderer;DatePickerRenderer.m_logger=new Category("DatePickerRenderer");DatePickerRenderer.prototype.m_currentMonth=null;DatePickerRenderer.prototype.m_currentYear=null;DatePickerRenderer.prototype.m_startDay=1;DatePickerRenderer.prototype.m_selectedDate=null;DatePickerRenderer.prototype.m_selectedDatePosition=0;DatePickerRenderer.prototype.m_todayDatePosition=0;DatePickerRenderer.prototype.m_dropDownField=null;DatePickerRenderer.prototype.m_value=null;DatePickerRenderer.CSS_CLASS_NAME="datepicker";DatePickerRenderer.LOSE_FOCUS_MODE="loseFocusMode";DatePickerRenderer.CLICK_CELL_MODE="clickCellMode";DatePickerRenderer.createInline=function(id)
{var e=Renderer.createInline(id,false);return DatePickerRenderer._create(e);}
DatePickerRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return DatePickerRenderer._create(e);}
DatePickerRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return DatePickerRenderer._create(e);}
DatePickerRenderer._create=function(e)
{e.className=DatePickerRenderer.CSS_CLASS_NAME;var dp=new DatePickerRenderer();dp._initRenderer(e);dp.m_dropDownField=DropDownFieldRenderer.createAsChild(e);var dropdown=dp.m_dropDownField._getDropDownElement();var container=document.createElement("div");container.className="calendar_container";dropdown.appendChild(container);preventSelection(dropdown);var navTable=document.createElement("table");navTable.className="navtable";container.appendChild(navTable);var navTableBody=document.createElement("tbody");navTable.appendChild(navTableBody);var navRow=document.createElement("tr");navTableBody.appendChild(navRow);var prevMonth=document.createElement("td");prevMonth.className="calendar_prevmonth";dp.m_prevMonthClickHandler=SUPSEvent.addEventHandler(prevMonth,"click",function(){dp._handlePrevMonthClick();return true;});navRow.appendChild(prevMonth);dp.m_currentMonthCell=document.createElement("td");dp.m_currentMonthCell.className="calendar_controls";dp.m_currentMonthCell.innerHTML="&nbsp;";navRow.appendChild(dp.m_currentMonthCell);var nextMonth=document.createElement("td");nextMonth.className="calendar_nextmonth";dp.m_nextMonthClickHandler=SUPSEvent.addEventHandler(nextMonth,"click",function(){dp._handleNextMonthClick();return true;});navRow.appendChild(nextMonth);var calTable=document.createElement("table");calTable.className="caltable";container.appendChild(calTable);var calTableBody=document.createElement("tbody");calTable.appendChild(calTableBody);var dayRow=document.createElement("tr");calTableBody.appendChild(dayRow);for(var i=0,l=FWDateUtil.shortDays.length;i<l;i++)
{var dayCell=document.createElement("th");dayCell.innerHTML=FWDateUtil.shortDays[(i+dp.m_startDay)%l];dayRow.appendChild(dayCell);}
var noOfDayRows=6;var noOfCalendarDays=noOfDayRows*FWDateUtil.NO_OF_WEEKDAYS;dp.m_dayCells=new Array(noOfCalendarDays);var position=0;dp.m_cellClickEventHandler=SUPSEvent.addEventHandler(calTable,"click",function(BALLS){dp._handleCellClick(BALLS);return true;});for(var i=0;i<noOfDayRows;i++)
{var dayRow=document.createElement("tr");calTableBody.appendChild(dayRow);for(var j=0;j<FWDateUtil.NO_OF_WEEKDAYS;j++)
{var dayCell=document.createElement("td");dayCell.innerHTML="&nbsp;";dayCell.__position=position;dayRow.appendChild(dayCell);dp.m_dayCells[position++]=dayCell;}}
dp._showDateInDropDown(null);dp.m_keyEventUpHandlerKey=SUPSEvent.addEventHandler(dp.m_dropDownField._getInputFieldElement(),"keyup",function(){dp._handleInputFieldKeyUp();return true;},false);return dp;}
DatePickerRenderer.prototype.dispose=function()
{unPreventSelection(this.m_dropDownField._getDropDownElement());for(var i=0,l=this.m_dayCells.length;i<l;i++)
{delete this.m_dayCells[i];}
delete this.m_dayCells;SUPSEvent.removeEventHandlerKey(this.m_prevMonthClickHandler);this.m_prevMonthClickHandler=null;SUPSEvent.removeEventHandlerKey(this.m_nextMonthClickHandler);this.m_nextMonthClickHandler=null;SUPSEvent.removeEventHandlerKey(this.m_cellClickEventHandler);this.m_cellClickEventHandler=null;SUPSEvent.removeEventHandlerKey(this.m_keyEventUpHandlerKey);this.m_keyEventUpHandlerKey=null;this.m_dropDownField.dispose();this.m_guiAdaptor=null;}
DatePickerRenderer.prototype._setCellClass=function(cellPosition)
{var mappedDay=(cellPosition+this.m_startDay)%7;if(cellPosition>=this.m_dayCells.length)
{if(DatePickerRenderer.m_logger.isWarn())DatePickerRenderer.m_logger.warn("DatePickerRenderer._setCellClass() warning, cellPosition >= this.m_dayCells.length");}
else
{this.m_dayCells[cellPosition].className=(this.m_selectedDatePosition==cellPosition?"selected ":"")+
(this.m_todayDatePosition==cellPosition?"today ":"")+
((0==mappedDay||6==mappedDay)?"weekend":"");}}
DatePickerRenderer.prototype._handleInputFieldKeyUp=function()
{var value=this.m_dropDownField._getInputFieldElement().value;var date=FWDateUtil.parseDate(value);if(!FWDateUtil.compareDates(date,this.m_selectedDate))
{this._selectDate(date);}}
DatePickerRenderer.prototype._selectDate=function(date)
{this.m_selectedDate=date;var refreshed=this._showDateInDropDown(date);if(!refreshed)
{this._renderCurrentlySelectedDateUnselected();this._updateSelectedDatePosition();if(this.m_selectedDatePosition!=null)
{this._setCellClass(this.m_selectedDatePosition);}}}
DatePickerRenderer.prototype._showDateInField=function()
{var date=this.m_selectedDate;if(null!=date)
{var day=date.getDate();day=(day<10)?"0"+day:day;this.m_dropDownField._getInputFieldElement().value=day+"-"+
FWDateUtil.shortMonths[date.getMonth()]+"-"+
date.getFullYear();}
else
{this.m_dropDownField._getInputFieldElement().value=(null==this.m_value?'':this.m_value);}}
DatePickerRenderer.prototype._handleCellClick=function(evt)
{evt=(null==evt)?window.event:evt;var clickCell=SUPSEvent.getTargetElement(evt);var position=clickCell.__position;if(null!=position)
{if(this.m_selectedDatePosition!=position)
{this._renderCurrentlySelectedDateUnselected();var clickedDate=new Date(this.m_firstDate);clickedDate.setDate(clickedDate.getDate()+position);this._renderCurrentlySelectedDateUnselected();this.m_selectedDate=clickedDate;this.m_selectedDatePosition=position;this._setCellClass(position);this._showDateInField();}
this.m_dropDownField.hideDropDown();if(this.m_guiAdaptor.getUpdateMode()==DatePickerRenderer.CLICK_CELL_MODE)
{this.m_guiAdaptor._handleValueChange();}}}
DatePickerRenderer.prototype._renderCurrentlySelectedDateUnselected=function()
{var prevSelectedCell=this.m_selectedDatePosition;if(null!=prevSelectedCell)
{this.m_selectedDatePosition=null;this._setCellClass(prevSelectedCell);}}
DatePickerRenderer.prototype._handleNextMonthClick=function()
{this._changeMonth(1);}
DatePickerRenderer.prototype._handlePrevMonthClick=function()
{this._changeMonth(-1);}
DatePickerRenderer.prototype._changeMonth=function(delta)
{var month=new Date(this.m_currentYear,this.m_currentMonth,1);month.setMonth(month.getMonth()+delta);this._showDateInDropDown(month);}
DatePickerRenderer.prototype._showDateInDropDown=function(d)
{var refreshed=false;var today=new Date();today=new Date(today.getFullYear(),today.getMonth(),today.getDate());if(null==d)d=new Date(today);var month=d.getMonth();var year=d.getFullYear();if(this.m_currentMonth!=month||this.m_currentYear!=year)
{this.m_currentMonth=month;this.m_currentYear=year;this.m_firstDate=new Date(d);this.m_firstDate.setDate(1);this.m_firstDate.setDate(1-(7+this.m_firstDate.getDay()-this.m_startDay)%7);this.m_lastDate=new Date(this.m_firstDate);this.m_lastDate.setDate(this.m_lastDate.getDate()+this.m_dayCells.length);firstDateTime=this.m_firstDate.getTime();var lastDateTime=this.m_lastDate.getTime()+FWDateUtil.MILLISECONDS_PER_DAY;var todayTime=today.getTime();this.m_todayDatePosition=(todayTime>=firstDateTime&&todayTime<lastDateTime)?FWDateUtil.getDaysDifference(today,this.m_firstDate):null;this._updateSelectedDatePosition();this.m_currentMonthCell.innerHTML=FWDateUtil.months[month]+" "+year;var currentDay=new Date(this.m_firstDate);for(var i=0,l=this.m_dayCells.length;i<l;i++)
{var cell=this.m_dayCells[i];var date=currentDay.getDate();cell.innerHTML=date;this._setCellClass(i);cell.style.color=(currentDay.getMonth()==month)?"black":"gray";currentDay.setDate(date+1);}
refreshed=true;}
return refreshed;}
DatePickerRenderer.prototype._updateSelectedDatePosition=function()
{if(null==this.m_selectedDate)
{this.m_selectedDatePosition=null;}
else
{var selTime=this.m_selectedDate.getTime();firstDateTime=this.m_firstDate.getTime();var lastDateTime=this.m_lastDate.getTime()+FWDateUtil.MILLISECONDS_PER_DAY;if(DatePickerRenderer.m_logger.isTrace())DatePickerRenderer.m_logger.trace("DatePickerRenderer._updateSelectedDatePosition() this.m_firstDate="+this.m_firstDate.toString()+", this.m_selectedDate="+this.m_selectedDate.toString()+", days difference="+FWDateUtil.getDaysDifference(this.m_selectedDate,this.m_firstDate));this.m_selectedDatePosition=(selTime>=firstDateTime&&selTime<lastDateTime)?FWDateUtil.getDaysDifference(this.m_selectedDate,this.m_firstDate):null;}}
DatePickerRenderer.prototype._calculateFirstDisplayedDate=function(d)
{var firstDay=new Date(d);firstDay.setDate(1);firstDay.setDate(1-(7+firstDay.getDay()-this.m_startDay)%7);return firstDay;}
DatePickerRenderer.prototype.getSelectedDate=function()
{return this.m_selectedDate;}
DatePickerRenderer.prototype.getValue=function()
{return this.m_dropDownField._getInputFieldElement().value;}
DatePickerRenderer.prototype.setValue=function(value)
{this.m_value=value;var date=FWDateUtil.parseXSDDate(value);if(!FWDateUtil.compareDates(date,this.m_selectedDate))
{this._selectDate(date);}
this._showDateInField();}
DatePickerRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,isServerValidationActive)
{this.m_dropDownField.render(disabled,focussed,mandatory,invalid,serverInvalid,readonly,inactive,null,isServerValidationActive);}
function DatePickerGUIAdaptor()
{}
DatePickerGUIAdaptor.m_logger=new Category("DatePickerGUIAdaptor");DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH=11;DatePickerGUIAdaptor.prototype=new HTMLElementGUIAdaptor();DatePickerGUIAdaptor.prototype.constructor=DatePickerGUIAdaptor;GUIAdaptor._setUpProtocols('DatePickerGUIAdaptor');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('DatePickerGUIAdaptor','ValidationProtocol');DatePickerGUIAdaptor.prototype._dispose=function()
{if(DatePickerGUIAdaptor.m_logger.isTrace())DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor.dispose()");this.m_renderer.dispose();this.m_renderer=null;}
DatePickerGUIAdaptor.create=function(e,factory)
{if(DatePickerGUIAdaptor.m_logger.isTrace())DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor.create()");var a=new DatePickerGUIAdaptor();a._initDatePickerGUIAdaptor(e);return a;}
DatePickerGUIAdaptor.prototype._initDatePickerGUIAdaptor=function(e)
{if(DatePickerGUIAdaptor.m_logger.isTrace())DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor._initDatePickerGUIAdaptor()");this.m_element=e;this.m_renderer=e.__renderer;this.m_element.__renderer=null;this.m_renderer.m_guiAdaptor=this;this.m_renderer.m_dropDownField.m_guiAdaptor=this;}
DatePickerGUIAdaptor.prototype._handleValueChange=function()
{this.update();}
DatePickerGUIAdaptor.prototype.getUpdateMode=function()
{return this.updateMode;}
DatePickerGUIAdaptor.prototype._configure=function(cs)
{if(DatePickerGUIAdaptor.m_logger.isInfo())DatePickerGUIAdaptor.m_logger.info("DatePickerGUIAdaptor._configure()");for(var i=cs.length-1;i>=0;i--)
{var c=cs[i];if(null!=c.weekends&&null==this.weekends)
{this.weekends=c.weekends;}
if(null!=c.updateMode)
{this.updateMode=c.updateMode;if(this.updateMode!=DatePickerRenderer.LOSE_FOCUS_MODE&&this.updateMode!=DatePickerRenderer.CLICK_CELL_MODE)
{if(DatePickerGUIAdaptor.m_logger.isError())DatePickerGUIAdaptor.m_logger.error("DatePickerGUIAdaptor._configure() unknown updateMode in configuration for adaptor id="+this.getId()+", reverting to default of DatePickerRenderer.LOSE_FOCUS_MODE");this.updateMode=DatePickerRenderer.LOSE_FOCUS_MODE;}}
else
{this.updateMode=DatePickerRenderer.LOSE_FOCUS_MODE;}}
if(this.weekends==null)
{this.weekends="true";}
this.transformToModel=null;this.transformToDisplay=null;this._getInputField().maxLength=DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH;}
DatePickerGUIAdaptor.prototype._getValueFromView=function()
{var d=this.m_renderer.getSelectedDate();var ret=null;if(d!=null)
{ret=FWDateUtil.ConvertDateToXSDString(d);}
else
{ret=this.m_renderer.getValue();if(ret=="")ret=null;}
return ret;}
DatePickerGUIAdaptor.prototype.validate=function(event)
{var mV=FormController.getInstance().getDataModel().getValue(this.dataBinding);var val=this.invokeTransformToDisplay(mV);if(DatePickerGUIAdaptor.m_logger.isInfo())DatePickerGUIAdaptor.m_logger.info(this.m_element.id+":DatePickerGUIAdaptor.validate() data model value = "+mV+", transformed to display value = "+val);return FWDateUtil.validateXSDDate(val,this.weekends)}
DatePickerGUIAdaptor.prototype.onBlur=function()
{this.update();}
DatePickerGUIAdaptor.prototype.update=function()
{var db=this.dataBinding;if(null!=db)
{var fm=FormController.getInstance();var dm=fm.getDataModel();fm.startDataTransaction(this);var mV=this._getValueFromView();var dV=this.invokeTransformToModel(mV);var origValue=dm.getValue(db);var result=null;if(origValue==dV)
{this.m_valueChanged=true;this.renderState();result=false;}
else
{result=dm.setValue(db,dV);var e=StateChangeEvent.create(StateChangeEvent.VALUE_TYPE,dV,this);this.changeAdaptorState(e);}
fm.endDataTransaction(this);return result;}
else
{throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = "+this.getId());}}
DatePickerGUIAdaptor.prototype.renderState=function()
{if(DatePickerGUIAdaptor.m_logger.isDebug())
{DatePickerGUIAdaptor.m_logger.debug(this.getId()+":DatePickerGUIAdaptor.renderState() this.m_enabled="+this.m_enabled+", this.m_readOnly="+this.m_readOnly+", this.getValid()="+this.getValid()+", this.m_mandatory="+this.m_mandatory);}
if(this.m_focusChanged)
{this.m_focusChanged=false;if(this.m_focus)
{this.m_renderer.m_dropDownField._getInputFieldElement().select();}
else
{this.m_renderer.m_dropDownField.hideDropDown();}}
else
{if(this.m_valueChanged)
{if(this.getUpdateMode()==DatePickerRenderer.CLICK_CELL_MODE&&this.m_focus)
{FormController.getInstance().getFormAdaptor()._setCurrentFocusedField(this);}}}
if(this.m_valueChanged)
{this.m_renderer.setValue(this.m_value);this.m_valueChanged=false;}
this.m_renderer.render(!this.m_enabled,this.m_focus,this.m_mandatory,!this.getValid(),!this.getServerValid(),this.m_readOnly,!this.isActive(),this.isServerValidationActive());}
DatePickerGUIAdaptor.prototype.getFocusElement=function()
{return this._getInputField();}
DatePickerGUIAdaptor.prototype._getInputField=function()
{return this.m_renderer.m_dropDownField._getInputFieldElement();}
function WordProcessingGUIAdaptor()
{}
WordProcessingGUIAdaptor.m_logger=new Category("WordProcessingGUIAdaptor");WordProcessingGUIAdaptor.CSS_CLASS_NAME="wordProcessing";WordProcessingGUIAdaptor.TRANSPORT_TAG="p";WordProcessingGUIAdaptor.m_initialHTML="";WordProcessingGUIAdaptor.m_setHTMLCounter=0;WordProcessingGUIAdaptor.replacingContent=false;WordProcessingGUIAdaptor.prototype=new HTMLElementGUIAdaptor();WordProcessingGUIAdaptor.prototype.constructor=WordProcessingGUIAdaptor;GUIAdaptor._setUpProtocols('WordProcessingGUIAdaptor');GUIAdaptor._addProtocol('WordProcessingGUIAdaptor','BusinessLifeCycleProtocol');GUIAdaptor._addProtocol('WordProcessingGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('WordProcessingGUIAdaptor','ActiveProtocol');GUIAdaptor._addProtocol('WordProcessingGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('WordProcessingGUIAdaptor','EnablementProtocol');WordProcessingGUIAdaptor.prototype.m_mainIframe=null;WordProcessingGUIAdaptor.prototype.m_editableIframe=null;WordProcessingGUIAdaptor.prototype.m_FCKeditorLoadComplete=false;WordProcessingGUIAdaptor.createInline=function(id)
{document.write("<div id='"+id+"' class='"+WordProcessingGUIAdaptor.CSS_CLASS_NAME+"' tabindex='1' hideFocus='true'>");var inactiveGifURL=Services.getAppController().m_config.getAppBaseURL()+"/images/inactive.gif";document.write("<img id=\"wp_image"+id+"\" GALLERYIMG=\"no\" class=\"wordProcessing\" src="+inactiveGifURL+">");var wpId=id+"_wordprocessor";document.write("<textarea id=\""+wpId+"\"></textarea>");document.write("</div>");};WordProcessingGUIAdaptor.create=function(e)
{var a=new WordProcessingGUIAdaptor();a._initWordProcessingGUIAdaptor(e);return a;};WordProcessingGUIAdaptor.prototype.getFocusElement=function()
{if(this.m_editableIframe)
{return this.m_editableIframe.contentWindow.document.body;}
return this.m_element;};WordProcessingGUIAdaptor.prototype._initWordProcessingGUIAdaptor=function(e)
{if(WordProcessingGUIAdaptor.m_logger.isInfo())WordProcessingGUIAdaptor.m_logger.info(e.id+":WordProcessingGUIAdaptor._initWordProcessingGUIAdaptor");this.m_element=e;var a=this;a.m_eventHandlerKeys=new Array();FormController.getInstance().addWordProcessingGUIAdaptor(a);return a;};WordProcessingGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.toolBarSet&&this.m_toolBarSet==null)
{this.m_toolBarSet=c.toolBarSet;}
if(c.width&&this.m_width==null)
{this.m_width=c.width;}
if(c.height&&this.m_height==null)
{this.m_height=c.height;}
if(c.saveAction&&this.m_saveAction==null)
{this.m_saveAction=c.saveAction;}
if(c.printAction&&this.m_printAction==null)
{this.m_printAction=c.printAction;}
if(c.previewAction&&this.m_previewAction==null)
{this.m_previewAction=c.previewAction;}}
if(this.m_toolBarSet==null)
{this.m_toolBarSet="SUPSDefault";}
if(this.m_saveAction==null)
{this.m_saveAction=function()
{Services.showAlert("In default save action");};}
if(this.m_printAction==null)
{this.m_printAction=function()
{Services.showAlert("In default print action");};}
if(this.m_previewAction==null)
{this.m_previewAction=function()
{Services.showAlert("In default preview action");};}
var wpId=this.getId()+"_wordprocessor";var oFCKeditor=new FCKeditor(wpId,this.m_width,this.m_height,this.m_toolBarSet);var ac=Services.getAppController();var baseURL=ac.m_config.getAppBaseURL()+"/com/sups/client/gui/wordProcessing/fckeditor";oFCKeditor.Config["CustomConfigurationsPath"]=baseURL+"/WordProcessingConfig.js";oFCKeditor.ReplaceTextarea();this.m_mainIframe=document.getElementById(wpId+"___Frame");var thisObj=this;this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_mainIframe,"load",function(){thisObj._setupFCKEditor();},false));this.m_inactiveImage=document.getElementById("wp_image"+this.getId());this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_inactiveImage,"mousedown",function(evt){thisObj.stopPropagationHandler(evt);},false));var div=document.getElementById(this.getId());this.m_inactiveImage.style.width=div.offsetWidth;this.m_inactiveImage.style.height=div.offsetHeight;};WordProcessingGUIAdaptor.prototype._setupFCKEditor=function()
{var editorIframe=this.m_mainIframe.contentWindow.document.getElementById("xEditingArea");this.m_mainIframe.contentWindow.GUIAdaptorRef=this;if(editorIframe.firstChild!=null)
{var thisObj=this;this.m_editableIframe=editorIframe.firstChild;this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(editorIframe.firstChild,"load",function(){thisObj._setupFCKEditor2();},false));}};WordProcessingGUIAdaptor.prototype._setupFCKEditor2=function()
{this.checkEditableIFrame();this.addCSSToDocument();this.stopEventHandlers();this.startEventHandlers();};WordProcessingGUIAdaptor.prototype.addCSSToDocument=function()
{var ac=top.AppController.getInstance();var cssLoc=ac.m_config.getAppBaseURL()+"/fw_IE.css";this.checkEditableIFrame();this.m_editableIframe.contentWindow.document.createStyleSheet(cssLoc);};WordProcessingGUIAdaptor.prototype.checkEditableIFrame=function()
{if(this.m_editableIframe==null)
{this.m_editableIframe=this.m_mainIframe.contentWindow.document.getElementById("xEditingArea").firstChild;}};WordProcessingGUIAdaptor.prototype.addFCKConfig=function()
{var configObj=this.m_mainIframe.contentWindow.FCKConfig;if(this.m_toolBarSet=="custom")
{configObj.ToolbarSets["custom"]=this.m_toolBar;}
var plugins=WordProcessingPlugins.plugins;var i;if(plugins)
{for(i=0;i<plugins.length;i++)
{configObj.Plugins.Add(plugins[i],'en');}}
var toolBarSets=WordProcessingToolBarSets.toolBarSets;if(toolBarSets)
{for(i=0;i<toolBarSets.length;i++)
{configObj.ToolbarSets[toolBarSets[i][0]]=toolBarSets[i][1];}}
configObj.FullPage=true;};WordProcessingGUIAdaptor.prototype.startEventHandlers=function()
{var tm=FormController.getInstance().getTabbingManager();var thisObj=this;this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_mainIframe.contentWindow.document,"mousedown",function(evt){tm._handleComponentClick(thisObj,evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(this.m_inactiveImage,"mousedown",function(evt){thisObj.stopPropagationHandler(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,"keydown",function(evt){thisObj.processKeyDown(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,"keyup",function(evt){thisObj.processKeyUp(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,"click",function(evt){thisObj.processClick(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,"mousedown",function(evt){tm._handleComponentClick(thisObj,evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document.body,"paste",function(evt){thisObj.processPaste(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document.body,"drop",function(evt){thisObj.processPaste(evt);},false));this.m_eventHandlerKeys.push(SUPSEvent.addEventHandler(thisObj.m_editableIframe.contentWindow.document,"help",function(){return false;},false));};WordProcessingGUIAdaptor.prototype.setInitialState=function()
{try
{var fckEd=this.getFCKEditor();this.m_initialHTML=fckEd.GetData();this.m_setHTMLCounter=0;}
catch(exception)
{this.m_setHTMLCounter++;if(this.m_setHTMLCounter<=5)
{var thisObj=this;setTimeout(function(){thisObj.setInitialState();},100);}}};WordProcessingGUIAdaptor.prototype.hasContentChanged=function()
{return(this.m_initialHTML!=this.getHTML());};WordProcessingGUIAdaptor.prototype.stopPropagationHandler=function(e)
{SUPSEvent.stopPropagation(e);return false;};WordProcessingGUIAdaptor.prototype.stopEventHandlers=function()
{for(var i=0;i<this.m_eventHandlerKeys.length;i++)
{SUPSEvent.removeEventHandlerKey(this.m_eventHandlerKeys[i]);}
this.m_eventHandlerKeys=new Array();};WordProcessingGUIAdaptor.prototype.processKeyDown=function(e)
{if(null==e)
{e=window.event;}
if(e.srcElement.className=="SUPSVAR"||e.srcElement.className=="SUPSVAR_NONEDITABLE")
{WordProcessingGUIAdaptor.m_logger.info("className is: "+e.srcElement.className);SUPSEvent.stopPropagation(e);return false;}
if(e.keyCode==Key.Tab.m_keyCode)
{var fckEd=this.getFCKEditor();this.focus();fckEd.InsertHtml("&nbsp;&nbsp;&nbsp;&nbsp;");this.setRange();var thisObj=this;setTimeout(function(){thisObj.focus();},5);}
else
{}
if(e.keyCode!=Key.Backspace.m_keyCode)
{var keyCode=(HTMLView.isIE||e.altKey)?e.keyCode:e.which;if(e.altKey||HTMLView._isFunctionKey(keyCode)||e.ctrlKey&&(Key.CHAR_F.m_keyCode==keyCode||Key.CHAR_f.m_keyCode==keyCode||Key.CHAR_R.m_keyCode==keyCode||Key.CHAR_r.m_keyCode==keyCode||Key.CHAR_O.m_keyCode==keyCode||Key.CHAR_o.m_keyCode==keyCode||Key.CHAR_L.m_keyCode==keyCode||Key.CHAR_l.m_keyCode==keyCode||Key.CHAR_N.m_keyCode==keyCode||Key.CHAR_n.m_keyCode==keyCode||Key.CHAR_W.m_keyCode==keyCode||Key.CHAR_w.m_keyCode==keyCode||Key.CHAR_P.m_keyCode==keyCode||Key.CHAR_p.m_keyCode==keyCode||Key.CHAR_E.m_keyCode==keyCode||Key.CHAR_e.m_keyCode==keyCode||Key.CHAR_H.m_keyCode==keyCode||Key.CHAR_h.m_keyCode==keyCode))
{return HTMLView._cancelKeyPress(e);}}
SUPSEvent.stopPropagation(e);};WordProcessingGUIAdaptor.prototype.processKeyUp=function(e)
{if(null==e)
{e=window.event;}
if(e.srcElement.className=="SUPSVAR"||e.srcElement.className=="SUPSVAR_NONEDITABLE")
{WordProcessingGUIAdaptor.m_logger.info("className is: "+e.srcElement.className);SUPSEvent.stopPropagation(e);return false;}
if(e.keyCode!=Key.Tab.m_keyCode)
{this.setRange();}
SUPSEvent.stopPropagation(e);};WordProcessingGUIAdaptor.prototype.setRange=function()
{this.checkEditableIFrame();var selection=this.m_editableIframe.contentWindow.document.selection;this.m_textSelectRange=selection.createRange();};WordProcessingGUIAdaptor.prototype.processClick=function(e)
{if(null==e)
{e=window.event;}
if(e.srcElement.className=="SUPSVAR_NONEDITABLE")
{Services.showAlert("This variable type cannot be edited.");this.focus();}
else
{this.setRange();}};WordProcessingGUIAdaptor.prototype.processPaste=function()
{var fckEd=this.getFCKEditor();var thisObj=this;setTimeout(function(){var selection=fckEd.EditorDocument.selection;if(selection.type=="Control")
{return;}
thisObj.m_textSelectRange=selection.createRange();thisObj.m_textSelectRange.collapse(false);thisObj.focus();fckEd.InsertHtml("");},10);};WordProcessingGUIAdaptor.prototype._dispose=function()
{if(null!=this.m_invoke)
{this.m_invoke.dispose();this.m_invoke=null;}
this.stopEventHandlers();delete this.m_eventHandlerKeys;this.m_eventHandlerKeys=null;var configObj=this.m_mainIframe.contentWindow.FCKConfig;var i,j,l;for(i=0,l=configObj.Plugins.Items.length;i<l;i++)
{delete configObj.Plugins.Items[i];}
configObj.Plugins.Items=null;for(i in configObj.ToolbarSets)
{for(j=0,l=configObj.ToolbarSets[i].length;j<l;j++)
{delete configObj.ToolbarSets[i][j];}
configObj.ToolbarSets[i]=null;}
configObj.ToolbarSets=null;for(i in configObj)
{delete configObj[i];}
configObj=null;var fckEd=this.getFCKEditor();for(i in fckEd)
{delete fckEd[i];}
fckEd=null;delete this.m_toolBarSet;this.m_toolBarSet=null;this.m_mainIframe.contentWindow.GUIAdaptorRef=null;this.m_mainIframe=null;this.m_editableIframe=null;delete this.m_inactiveImage;this.m_inactiveImage=null;delete this.m_textSelectRange;this.m_textSelectRange=null;};WordProcessingGUIAdaptor.prototype.getHTML=function()
{var fckEd=this.getFCKEditor();return fckEd.GetData();};WordProcessingGUIAdaptor.prototype.setHTML=function(html)
{this.stopEventHandlers();this.m_textSelectRange=null;var fckEd=this.getFCKEditor();fckEd.SetData(html,true);if(html!="")
{var thisObj=this;if(!this.replacingContent)
{setTimeout(function(){thisObj.setInitialState();},300);this.replacingContent=true;}
this.m_editableIframe=null;this.checkEditableIFrame();this.addCSSToDocument();this.startEventHandlers();}};WordProcessingGUIAdaptor.prototype._getValueFromView=function()
{return this.getHTML();};WordProcessingGUIAdaptor.prototype.renderState=function()
{if(!this.checkFCKEditorReady("GetData","renderState"))
{return;}
if(this.m_valueChanged)
{this.m_valueChanged=false;if(this.getHTML()!=this.m_value)
{this.setHTML(this.m_value);}}
if(this.m_focusChanged)
{this.m_focusChanged=false;if(this.m_focus)
{this.focus();}
else
{this.update();}}
if((this.supportsProtocol("EnablementProtocol")&&!this.getEnabled())||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{this.m_inactiveImage.style.visibility="visible";}
else
{this.m_inactiveImage.style.visibility="hidden";}};WordProcessingGUIAdaptor.prototype.focus=function()
{if(this.m_textSelectRange)
{this.m_textSelectRange.select();}
else
{if(this.checkFCKEditorReady("Focus","focus")){this.getFCKEditor().Focus();}}};WordProcessingGUIAdaptor.prototype.checkFCKEditorReady=function(method,callbackMethod)
{if(window.FCKeditorAPI!==undefined&&this.getFCKEditor()[method]){return true;}
else
{var thisObj=this;setTimeout(function(){thisObj[callbackMethod]();},1500);return false;}};WordProcessingGUIAdaptor.prototype.getFCKEditor=function()
{return FCKeditorAPI.GetInstance(this.getId()+"_wordprocessor");};WordProcessingGUIAdaptor.prototype.setConfig=function(configItem,newValue)
{oFCKeditor.Config[configItem]=newValue;};WordProcessingGUIAdaptor.prototype.setFCKeditorLoadComplete=function(value)
{this.m_FCKeditorLoadComplete=value;};WordProcessingGUIAdaptor.prototype.getFCKeditorLoadComplete=function()
{return this.m_FCKeditorLoadComplete;};WordProcessingGUIAdaptor.prototype.doSpellCheck=function()
{var ac=Services.getAppController();var appConfig=ac.m_config;var courtXPath=appConfig.getSpellCheckCourtXPath();var dictionaryLabel=appConfig.getSpellCheckDictionaryLabel();var actualLabel=dictionaryLabel;if(dictionaryLabel!=null&&courtXPath!=null)
{if(Services.hasValue(courtXPath))
{var courtId=Services.getValue(courtXPath);if(courtId!=null)
{actualLabel=dictionaryLabel.replace("${court}",courtId);}}}
if(actualLabel==null)
{actualLabel="English (US)";}
this.checkEditableIFrame();parent.ActionSpellCheck(this.m_editableIframe.contentWindow,actualLabel);};WordProcessingGUIAdaptor.prototype.doSave=function()
{this.m_saveAction();};WordProcessingGUIAdaptor.prototype.doPreview=function()
{this.m_previewAction();};WordProcessingGUIAdaptor.prototype.doPrint=function()
{this.m_printAction();};WordProcessingGUIAdaptor.prototype.transformToDisplay=function(modelValue)
{if(modelValue==null)
{return null;}
var regexStr="< *span *class *= *\"SUPSVAR([^\"]*)\"";var regex=new RegExp(regexStr,"g");return modelValue.replace(regex,"<span class=\"SUPSVAR$1\" contenteditable=\"false\"");};WordProcessingGUIAdaptor.prototype.transformToModel=function(displayValue)
{if(displayValue==null)
{return null;}
var regexStr=" contenteditable=\"?false\"?";var regex=new RegExp(regexStr,"g");return displayValue.replace(regex,"");};function FCKeditor_OnComplete(editorInstance)
{var wordProcessingGUIAdaptorEditorInstanceName=null;var instanceName=editorInstance.Name;var wordProcessingGUIAdaptors=FormController.getInstance().getWordProcessingGUIAdaptors();for(var i=0,l=wordProcessingGUIAdaptors.length;i<l;i++)
{wordProcessingGUIAdaptorEditorInstanceName=wordProcessingGUIAdaptors[i].getId()+"_wordprocessor";if(wordProcessingGUIAdaptorEditorInstanceName==instanceName)
{wordProcessingGUIAdaptors[i].setFCKeditorLoadComplete(true);break;}}}
function AutocompletionGUIAdaptor()
{this.m_usingListEntry=true;};AutocompletionGUIAdaptor.m_logger=new Category("AutocompletionGUIAdaptor");AutocompletionGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('AutocompletionGUIAdaptor');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','ListSrcDataProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','RecordsProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('AutocompletionGUIAdaptor','MouseWheelBindingProtocol');AutocompletionGUIAdaptor.prototype.constructor=AutocompletionGUIAdaptor;AutocompletionGUIAdaptor.prototype.maxLength=null;AutocompletionGUIAdaptor.prototype.strictValidation=null;AutocompletionGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry=null;AutocompletionGUIAdaptor.prototype.m_selectionMode=null;AutocompletionGUIAdaptor.prototype.m_singleMatchingEnabled=null;AutocompletionGUIAdaptor.create=function(element)
{if(AutocompletionGUIAdaptor.m_logger.isTrace())
{AutocompletionGUIAdaptor.m_logger.trace("AutocompletionGUIAdaptor.create");}
var a=new AutocompletionGUIAdaptor();a._initAutocompletionGUIAdaptor(element);return a;}
AutocompletionGUIAdaptor.prototype._initAutocompletionGUIAdaptor=function(element)
{this.m_element=element;this.m_renderer=element.__renderer;element.__renderer=null;fc_assert(this.m_renderer!=null,"AutocompletionGUIAdaptor._initAutocompletionGUIAdaptor(): the renderer is not defined!");this.m_renderer.m_guiAdaptor=this;this.m_renderer.m_dropDownField.m_guiAdaptor=this;this.m_renderer.setModel(this);var thisObj=this;this.m_renderer.addValueChangeListener(function(){thisObj._valueChangeCallback()});}
AutocompletionGUIAdaptor.prototype._dispose=function()
{this.m_renderer.dispose();this.m_renderer=null;}
AutocompletionGUIAdaptor.prototype.setReadOnly=function(readOnly)
{if(readOnly)
{this.m_renderer.stopEventHandlers();}
else
{this.m_renderer.startEventHandlers();}
return ReadOnlyProtocol.prototype.setReadOnly.call(this.m_renderer.m_guiAdaptor,readOnly);}
AutocompletionGUIAdaptor.prototype.setMatchString=function(match)
{if(this.m_match!=match)
{this.m_match=match;this.m_matches=this._getMatchesFromDOM(this.m_match);}
return(this.m_matches==null)?0:this.m_matches.length;}
AutocompletionGUIAdaptor.prototype.isKeyForMatchSubmissible=function(matchNumber)
{var key=this.getKeyForMatch(matchNumber);var isSubmissible=this.getAggregateState().isKeySubmissible(key);if(AutocompletionGUIAdaptor.m_logger.isTrace())AutocompletionGUIAdaptor.m_logger.trace("AutocompletionGUIAdaptor.isKeyForMatchSubmissible() key="+key+", isSubmissible="+isSubmissible);return isSubmissible;}
AutocompletionGUIAdaptor.prototype.getKeyForMatch=function(matchNumber)
{var match=this.m_matches[matchNumber];var keyValueNode=null;if(match!=null)
{keyValueNode=match.selectSingleNode(this.keyXPath);}
return keyValueNode==null?"":XML.getNodeTextContent(keyValueNode);}
AutocompletionGUIAdaptor.prototype.getMatch=function(matchNumber)
{var match=this.m_matches[matchNumber];var displayValueNode=null;if(match!=null)
{displayValueNode=match.selectSingleNode(this.m_displayXPath);}
return displayValueNode==null?"":XML.getNodeTextContent(displayValueNode);}
AutocompletionGUIAdaptor.prototype._getMatchesFromDOM=function(matchString)
{matchString=matchString.toUpperCase();var predicateMatchString=Services.xPathToConcat(matchString);var matchDisplayXPath=((matchString==null||matchString=="")?"":"[starts-with("+this._translateXPathValueToUpperCase(this.m_displayXPath)+", "+predicateMatchString+")]");return this._getRowNodesFromDOM(matchDisplayXPath);}
AutocompletionGUIAdaptor.prototype._getExactMatchesFromDOM=function(matchString)
{var upperMatchString=matchString.toUpperCase();var predicateMatchString=Services.xPathToConcat(upperMatchString);var matchDisplayXPath="["+this._translateXPathValueToUpperCase(this.m_displayXPath)+" = "+predicateMatchString+"]";return this._getRowNodesFromDOM(matchDisplayXPath);}
AutocompletionGUIAdaptor.prototype._getRowNodesFromDOM=function(predicate)
{var xpath=this.getRowXPathWithSuffix(predicate);var nodeArray=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(xpath);if(nodeArray!=null&&nodeArray.length>0&&this.comparator!=null){var newArray=Array(nodeArray.length);for(var i=0,l=nodeArray.length;i<l;i++)
{newArray[i]=nodeArray[i];}
var displayXPath=this.m_displayXPath;var comparatorFn=this.comparator;newArray.sort(function(a,b){var aNode=a.selectSingleNode(displayXPath);var bNode=b.selectSingleNode(displayXPath);var aText=(aNode==null?"":XML.getNodeTextContent(aNode));var bText=(bNode==null?"":XML.getNodeTextContent(bNode));return comparatorFn(aText,bText);});nodeArray=newArray;}
return nodeArray;}
AutocompletionGUIAdaptor.prototype._sortDisplayValues=function(a,b)
{return 1;var aNode=a.selectSingleNode(displayXPath);var bNode=b.selectSingleNode(displayXPath);var aText=XML.getNodeTextContent(aNode);var bText=XML.getNodeTextContent(bNode);if(aText==bText){return 0;}
if(aText>bText){return 1;}
if(aText<bText){return-1;}}
AutocompletionGUIAdaptor.prototype._getMatchesForKeyFromDOM=function(key)
{var predicateMatchString=Services.xPathToConcat(key);var matchKeyXPath="["+this.keyXPath+" = "+predicateMatchString+"]";return this._getRowNodesFromDOM(matchKeyXPath);}
AutocompletionGUIAdaptor.prototype._valueChangeCallback=function()
{if(AutocompletionGUIAdaptor.m_logger.isDebug())
{AutocompletionGUIAdaptor.m_logger.debug("AutocompletionGUIAdaptor._valueChangeCallback()");}
this.update();}
AutocompletionGUIAdaptor.prototype._getValueFromView=function()
{var selectedMatch=this.m_renderer.getSelectedMatch();var matchNode=null;var keyNode=null;var ret=null;this.m_usingListEntry=true;if(null==selectedMatch)
{var enteredValue=this.m_renderer.getTextFieldValue();var matches=this._getExactMatchesFromDOM(enteredValue);if(0==matches.length)
{this.m_usingListEntry=false;}
else
{matchNode=matches[0];}}
else
{matchNode=this.m_matches[selectedMatch];}
if(matchNode==null)
{ret=this.m_renderer.getTextFieldValue();if(this.m_displayXPath!=this.keyXPath)
{var exactKeyNode=this._getCaseInsensitiveExactMatchForKeyFromDOM(ret);if(exactKeyNode.length==1)
{keyNode=exactKeyNode[0].selectSingleNode(this.keyXPath);if(null==keyNode)
{ret=null;}
else
{ret=XML.getNodeTextContent(keyNode);if(ret==this.m_value)
{var displayNode=exactKeyNode[0].selectSingleNode(this.m_displayXPath);if(null!=displayNode)
{var displayValue=XML.getNodeTextContent(displayNode);if(null!=displayValue)
{this.m_renderer.setValue(displayValue);}}}}}}}
else
{keyNode=matchNode.selectSingleNode(this.keyXPath);if(null==keyNode)
{ret=null;}
else
{ret=XML.getNodeTextContent(keyNode);}}
return ret;}
AutocompletionGUIAdaptor.prototype._getRowsMatchingKey=function(keyValue)
{var predicateMatchString=Services.xPathToConcat(keyValue);var matchKeyPredicate="["+this.keyXPath+" = "+predicateMatchString+"]";return this._getRowNodesFromDOM(matchKeyPredicate)}
AutocompletionGUIAdaptor.prototype.onBlur=function()
{this.update();}
AutocompletionGUIAdaptor.prototype.renderState=function()
{if(this.m_focusChanged)
{this.m_focusChanged=false;if(this.m_focus)
{this.m_renderer.m_dropDownField._getInputFieldElement().select();}
else
{this.m_renderer.m_dropDownField.hideDropDown();}}
if(this.m_valueChanged)
{this._refreshDisplayedValue();this.m_valueChanged=false;}
this.m_renderer.render(!this.m_enabled,this.m_focus,this.m_mandatory,!this.getValid(),!this.getServerValid(),this.m_readOnly,!this.isActive(),this.getAggregateState().areChildrenSubmissible(),this.isServerValidationActive());}
AutocompletionGUIAdaptor.prototype._refreshDisplayedValue=function()
{var val=this.m_value;var rowNodes=this._getRowsMatchingKey(val);var keyFound=false;if(rowNodes.length!=0)
{keyFound=true;var displayValueNode=rowNodes[0].selectSingleNode(this.m_displayXPath);if(null!=displayValueNode)
{val=XML.getNodeTextContent(displayValueNode);}}
if(true==this.strictValidation)
{this.m_renderer.setMatchSingle(keyFound);}
this.m_renderer.setValue(val);}
AutocompletionGUIAdaptor.CLICK_MODE="onClickMode";AutocompletionGUIAdaptor.DBL_CLICK_MODE="onDblClickMode";AutocompletionGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.displayXPath&&this.m_displayXPath==null)
{this.m_displayXPath=XPathUtils.removeLeadingSlash(c.displayXPath);}
if(c.strictValidation&&null==this.strictValidation)
{this.strictValidation=c.strictValidation;if(true==this.strictValidation)
{this.validate=this._strictValidate;}}
if(null!=c.selectionMode&&this.m_selectionMode==null)
{this.m_selectionMode=c.selectionMode;}
if(null!=cs[i].sortMode)
{if(cs[i].sortMode=="numerical")
{this.comparator=Comparators.numericalSort;}
else if(cs[i].sortMode=="alphabetical")
{this.comparator=Comparators.alphabeticalSort;}
else if(cs[i].sortMode=="alphabeticalLowToHigh")
{this.comparator=Comparators.alphabeticalSortLowToHigh;}
else if(cs[i].sortMode=="alphabeticalLocaleCompare")
{this.comparator=Comparators.alphabeticalLocaleCompareSort;}
else if(cs[i].sortMode=="alphanumerical")
{this.comparator=Comparators.alphanumerical;}
else if(cs[i].sortMode=="alphabeticalCaseInsensitive")
{this.comparator=Comparators.alphabeticalCaseInsensitiveSort;}
else
{this.comparator=null;}}
if(null!=c.maxLength&&this.maxLength==null)
{this.maxLength=c.maxLength;this.validate=this._validateMaxLength;this.m_renderer.getInputElement().maxLength=this.maxLength;}
if(null!=c.singleMatchingEnabled&&this.m_singleMatchingEnabled==null)
{this.m_singleMatchingEnabled=c.singleMatchingEnabled;}
if(FormController.getValidateWhitespaceOnlyEntryActive())
{if(null!=c.validateWhitespaceOnlyEntry&&this.m_validateWhitespaceOnlyEntry==null)
{this.m_validateWhitespaceOnlyEntry=c.validateWhitespaceOnlyEntry;}}}
this._checkConfiguration();this.m_renderer.setSelectionMode(this.m_selectionMode);var displayXPaths=this.getRowXPathArrayWithSuffix()
this.srcDataOn=(null==this.srcDataOn)?displayXPaths:this.srcDataOn.concat(displayXPaths);if(true==this.strictValidation)
{if(null!=this.validateOn)
{this.validateOn=this.validateOn.concat(this.srcDataOn);}
else
{this.validateOn=this.srcDataOn;}}
if(this.m_singleMatchingEnabled!=false)
{this.m_singleMatchingEnabled=true;}
if((this.strictValidation!=true)&&FormController.getValidateWhitespaceOnlyEntryActive()&&this.m_validateWhitespaceOnlyEntry!=false)
{if(this.maxLength!=null)
{this._addWhitespaceOnlyEntryValidation();}
else
{this.validate=this._validateWhitespaceOnlyEntry;}}}
AutocompletionGUIAdaptor.prototype._checkConfiguration=function()
{if(null==this.srcData)
{throw new ConfigurationException("srcData must be specified for adaptor: "+this.getId());}
if(null==this.keyXPath)
{throw new ConfigurationException("keyXPath must be specified for adaptor: "+this.getId());}
if(this.maxLength!=null&&true==this.strictValidation)
{throw new ConfigurationException("Cannot have both 'maxLength' and 'strictValidation' configured for adaptor: "+this.getId());}
if(null!=this.m_selectionMode)
{if(this.m_selectionMode!=AutocompletionGUIAdaptor.CLICK_MODE&&this.m_selectionMode!=AutocompletionGUIAdaptor.DBL_CLICK_MODE)
{if(AutocompletionGUIAdaptor.m_logger.isError())
{AutocompletionGUIAdaptor.m_logger.error("AutocompletionGUIAdaptor._configure() unknown selectionMode in configuration for adaptor id="+this.getId()+", reverting to default of AutocompletionGUIAdaptor.CLICK_MODE");}
this.m_selectionMode=AutocompletionGUIAdaptor.CLICK_MODE;}}
else
{this.m_selectionMode=AutocompletionGUIAdaptor.CLICK_MODE;}
this.m_absoluteRowXPath=this.rowXPath?this.srcData+'/'+this.rowXPath:this.srcData;this.m_displayXPath=this.m_displayXPath!=null?this.m_displayXPath:this.keyXPath;this.m_absoluteDisplayXPath=this.m_absoluteRowXPath+'/'+this.m_displayXPath;this.srcDataOn[this.srcDataOn.length]=this.m_absoluteDisplayXPath;}
AutocompletionGUIAdaptor.prototype._strictValidate=function(modelValue)
{if(this.m_reevaluateValidity)
{var enteredValue=this.m_value;var matches=this._getMatchesForKeyFromDOM(enteredValue);this.m_usingListEntry=true;if(0==matches.length)
{this.m_usingListEntry=false;}
this.m_reevaluateValidity=false;}
if(this.m_usingListEntry)
{return null;}
else
{var ec=ErrorCode.getErrorCode('InvalidFieldLength');ec.m_message="Field value not in source data";return ec;}}
AutocompletionGUIAdaptor.prototype.retrieve=function(event)
{this.m_reevaluateValidity=true;var db=this.dataBinding;if(null!=db)
{var mV=FormController.getInstance().getDataModel().getValue(db);var dV=this.invokeTransformToDisplay(mV);var valueChanged=this._setValue(dV);if(!this.m_valueChanged)this.m_valueChanged=valueChanged;if(valueChanged)
{this.m_renderer.resetSelectedMatch();var e=StateChangeEvent.create(StateChangeEvent.VALUE_TYPE,dV,this);this.changeAdaptorState(e);}
return valueChanged;}
else
{throw new DataBindingError("DataBindingProtocol.retrieve(), no dataBinding specified for adaptor id = "+this.getId());}}
AutocompletionGUIAdaptor.prototype.retrieveSrcData=function(event)
{if(AutocompletionGUIAdaptor.m_logger.isInfo())
{AutocompletionGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.retrieveSrcData()");}
var e=StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE,null,this);this.changeAdaptorState(e);this.m_match=null;this.m_renderer.dataUpdate();this.m_valueChanged=true;this.m_reevaluateValidity=true;return true;}
AutocompletionGUIAdaptor.prototype.getFocusElement=function()
{return this.m_renderer.getInputElement();}
AutocompletionGUIAdaptor.prototype._getCaseInsensitiveExactMatchForKeyFromDOM=function(keyMatch)
{var upperCaseKeyMatch=keyMatch.toUpperCase();var predicateKeyMatchString=Services.xPathToConcat(upperCaseKeyMatch);var matchKeyXPath="["+
this._translateXPathValueToUpperCase(this.keyXPath)+" = "+
predicateKeyMatchString+"]";return this._getRowNodesFromDOM(matchKeyXPath);}
AutocompletionGUIAdaptor.prototype._translateXPathValueToUpperCase=function(xpath)
{return"translate("+xpath+", 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')";}
AutocompletionGUIAdaptor.prototype._validateMaxLength=function()
{var ec=null;var value=this._getValue();var matches=this._getMatchesForKeyFromDOM(value);if(0==matches.length&&value!=null&&value.length>this.maxLength)
{ec=ErrorCode.getErrorCode('FW_TEXTINPUT_InvalidFieldLength');ec.m_message=ec.getMessage()+this.maxLength;}
return ec;}
AutocompletionGUIAdaptor.prototype.handleScrollMouse=function(evt)
{var propagateEvent=true;if(this.m_renderer.m_dropDownField.isRaised())
{if(evt.wheelDelta>0)
{this.m_renderer._selectPreviousMatch();}
else
{this.m_renderer._selectNextMatch();}
propagateEvent=false;}
return propagateEvent;}
AutocompletionGUIAdaptor.prototype.getSrcDataRowCount=function()
{return Services.countNodes(this.srcData+"/"+this.rowXPath);}
function InputElementGUIAdaptor()
{GUIAdaptor._setUpProtocols("HTMLElementGUIAdaptor");}
InputElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols("InputElementGUIAdaptor");GUIAdaptor._addProtocol('InputElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('InputElementGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('InputElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('InputElementGUIAdaptor','ValidationProtocol');InputElementGUIAdaptor.prototype.constructor=InputElementGUIAdaptor;InputElementGUIAdaptor.prototype._initInputElementGUIAdaptor=function(e)
{this.m_element=e;}
function ButtonInputElementGUIAdaptor()
{}
ButtonInputElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('ButtonInputElementGUIAdaptor');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','BusinessLifeCycleProtocol');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor','LabelProtocol');ButtonInputElementGUIAdaptor.prototype.constructor=ButtonInputElementGUIAdaptor;ButtonInputElementGUIAdaptor.m_logger=new Category("ButtonInputElementGUIAdaptor");ButtonInputElementGUIAdaptor.BUTTON_NOT_SUBMISSIBLE_CSS_CLASS="notSubmissible";ButtonInputElementGUIAdaptor.EVENT_ACTION=BusinessLifeCycleEvents.EVENT_ACTION;ButtonInputElementGUIAdaptor.prototype.m_clickEventHandler=null;ButtonInputElementGUIAdaptor.prototype.m_noOfActionBindings=0;ButtonInputElementGUIAdaptor.prototype.m_inactiveWhilstHandlingEvent=null;ButtonInputElementGUIAdaptor.prototype.m_deactivatedWhilstHandlingEvent=false;ButtonInputElementGUIAdaptor.create=function(e)
{var a=new ButtonInputElementGUIAdaptor();a.m_element=e;a.m_viewClass=e.className;return a;}
ButtonInputElementGUIAdaptor.prototype._dispose=function()
{if(null!=this.m_clickEventHandler)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventHandler);this.m_clickEventHandler=null;}
this.actionBinding=null;}
ButtonInputElementGUIAdaptor.prototype._configure=function(cs)
{var actionBusinessLifeCycle=new ButtonActionBusinessLifeCycle();actionBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(actionBusinessLifeCycle);var actionEventBinding=null;for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null!=c.actionBinding)
{this.m_noOfActionBindings++;}
if(c.additionalBindings&&null==actionEventBinding)
{actionBusinessLifeCycle.configure(c.additionalBindings);actionEventBinding=actionBusinessLifeCycle.getEventBinding();}
if(null!=c.inactiveWhilstHandlingEvent&&null==this.m_inactiveWhilstHandlingEvent)
{this.m_inactiveWhilstHandlingEvent=c.inactiveWhilstHandlingEvent;}}
if(this.m_noOfActionBindings>0)
{var thisObj=this;this.m_clickEventHandler=SUPSEvent.addEventHandler(this.m_element,"click",function(evt){return thisObj._handleClick();});}
if(this.m_inactiveWhilstHandlingEvent!=false)
{this.m_inactiveWhilstHandlingEvent=true;}
if(null!=actionEventBinding)actionEventBinding.start();}
ButtonInputElementGUIAdaptor.prototype._handleClick=function()
{Services.dispatchEvent(this.getId(),ButtonInputElementGUIAdaptor.EVENT_ACTION,null);}
ButtonInputElementGUIAdaptor.prototype._invokeActionBindings=function()
{if(this.getEnabled())
{var cs=this.getConfigs();for(var i=0,l=cs.length-1;i<l;i++)
{if(null!=cs[i].actionBinding)
{cs[i].actionBinding.call(this);}}}}
ButtonInputElementGUIAdaptor.prototype.renderState=function()
{if((this.supportsProtocol("EnablementProtocol")&&!this.m_enabled)||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{this.m_element.disabled=true;}
else
{this.m_element.disabled=false;}
var css=this.m_viewClass
if(!this.getAggregateState().isSubmissible())
{css=css+" "+ButtonInputElementGUIAdaptor.BUTTON_NOT_SUBMISSIBLE_CSS_CLASS;}
this.m_element.className=css;if(null!=this.m_label)
{this.m_element.value=this.m_label;}
this.m_labelChanged=false;}
ButtonInputElementGUIAdaptor.prototype.reactivate=function()
{var reactivate=true;var deactivatedButtonAdaptors=AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;if(null!=deactivatedButtonAdaptors)
{var deactivatedAdaptor=null;for(var i=0,l=deactivatedButtonAdaptors.length;i<l;i++)
{deactivatedAdaptor=deactivatedButtonAdaptors[i];if(this.getId()==deactivatedAdaptor.getId())
{reactivate=false;break;}}}
if(reactivate)
{this.setActive(true);this.renderState();}
if(this.m_inactiveWhilstHandlingEvent)
{this.m_deactivatedWhilstHandlingEvent=false;}}
ButtonInputElementGUIAdaptor.prototype.isDeactivatedWhilstHandlingEvent=function()
{return this.m_deactivatedWhilstHandlingEvent;}
ButtonInputElementGUIAdaptor.prototype.setDeactivatedWhilstHandlingEvent=function(deactivated)
{this.m_deactivatedWhilstHandlingEvent=deactivated;}
function ButtonActionBusinessLifeCycle(){}
ButtonActionBusinessLifeCycle.prototype=new BusinessLifeCycle();ButtonActionBusinessLifeCycle.prototype.constructor=ButtonActionBusinessLifeCycle;ButtonActionBusinessLifeCycle.prototype.getName=function()
{return BusinessLifeCycleEvents.EVENT_ACTION;}
ButtonActionBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{var buttonId=e.getComponentId();var button=FormController.getInstance().getAdaptorById(buttonId);if(null!=button)
{if(button.m_noOfActionBindings>0&&button.m_inactiveWhilstHandlingEvent&&button.isActive())
{button.setActive(false);button.renderState();button.setDeactivatedWhilstHandlingEvent(true);}
try
{button._invokeActionBindings();}
catch(ex)
{if(button.m_noOfActionBindings>0&&button.m_inactiveWhilstHandlingEvent)
{button.reactivate();}
throw ex;}
if(button.m_noOfActionBindings>0&&button.m_inactiveWhilstHandlingEvent)
{button.reactivate();}}}
function CheckboxInputElementGUIAdaptor()
{}
CheckboxInputElementGUIAdaptor.m_logger=new Category("CheckboxInputElementGUIAdaptor");CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS='invalid';CheckboxInputElementGUIAdaptor.READONLY_CSS_CLASS='readOnly';CheckboxInputElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('CheckboxInputElementGUIAdaptor');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor','ReadOnlyProtocol');CheckboxInputElementGUIAdaptor.prototype.constructor=CheckboxInputElementGUIAdaptor;CheckboxInputElementGUIAdaptor.prototype.modelValue={checked:"true",unchecked:"false"};CheckboxInputElementGUIAdaptor.create=function(e)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor.create");var a=new CheckboxInputElementGUIAdaptor();a._initCheckboxInputElementGUIAdaptor(e);return a;}
CheckboxInputElementGUIAdaptor.prototype.keyBindings=[{key:Key.CHAR_Y,action:function()
{if(!this.getReadOnly())
{Services.setValue(this.dataBinding,this.modelValue.checked);}}},{key:Key.CHAR_N,action:function()
{if(!this.getReadOnly())
{Services.setValue(this.dataBinding,this.modelValue.unchecked);}}},{key:Key.CHAR_y,action:function()
{if(!this.getReadOnly())
{Services.setValue(this.dataBinding,this.modelValue.checked);}}},{key:Key.CHAR_n,action:function()
{if(!this.getReadOnly())
{Services.setValue(this.dataBinding,this.modelValue.unchecked);}}}];CheckboxInputElementGUIAdaptor.prototype._initCheckboxInputElementGUIAdaptor=function(e)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._initCheckboxInputElementGUIAdaptor");this.m_element=e;this._registerEventHandlers();}
CheckboxInputElementGUIAdaptor.prototype._registerEventHandlers=function()
{var a=this;this.m_evtHandler=SUPSEvent.addEventHandler(this.m_element,"click",function(evt){return a._handleClick(evt);});}
CheckboxInputElementGUIAdaptor.prototype._dispose=function()
{SUPSEvent.removeEventHandlerKey(this.m_evtHandler);this.m_evtHandler=null;}
CheckboxInputElementGUIAdaptor.prototype._getValueFromView=function()
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace(this.getId()+":CheckboxInputElementGUIAdaptor._getValueFromView()");if(null==this.m_element)
{throw new GUIAdaptorError("CheckboxInputElementGUIAdaptor._getValueFromView(), this.m_element == null");}
return this.m_element.checked;}
CheckboxInputElementGUIAdaptor.prototype._handleClick=function(evt)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._handleClick");var propagateEvent=true;if(this.getReadOnly())
{evt=(null!=evt)?evt:window.event;SUPSEvent.preventDefault(evt);propagateEvent=false;}
else
{this.update();}
return propagateEvent;}
CheckboxInputElementGUIAdaptor.prototype._configure=function(cs)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor.init");for(var i=0,l=cs.length-1;i<l;i++)
{if(null!=cs[i].modelValue)
{this.modelValue=cs[i].modelValue;if(null==this.modelValue.checked||null==this.modelValue.unchecked)
{throw new ConfigurationException("Must define checked and unchecked for modelValue");}}
if(null!=cs[i].transformToModel)
{throw new ConfigurationException("Cannot define transformToModel function for checkbox");}
if(null!=cs[i].transformToDisplay)
{throw new ConfigurationException("Cannot define transformToDisplay function for checkbox");}}}
CheckboxInputElementGUIAdaptor.prototype.hasValidate=function()
{return true;}
CheckboxInputElementGUIAdaptor.prototype.validate=function()
{var val=FormController.getInstance().getDataModel().getValue(this.dataBinding);if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._validateModelValue");var ec=null;if(val!=this.modelValue.checked&&val!=this.modelValue.unchecked)
{ec=ErrorCode.getErrorCode('FW_CHECKBOX_InvalidFieldLength');}
return ec;}
CheckboxInputElementGUIAdaptor.prototype.isNoneEmptyValue=function(mV)
{return!(null==mV);}
CheckboxInputElementGUIAdaptor.prototype.transformToModel=function(dV)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._transformToModel");if(dV==true)
{return this.modelValue.checked;}
else
{return this.modelValue.unchecked;}}
CheckboxInputElementGUIAdaptor.prototype.transformToDisplay=function(mV)
{if(CheckboxInputElementGUIAdaptor.m_logger.isTrace())CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._transformToDisplay");if(mV==null)
{return;}
if(mV==this.modelValue.checked)
{return true;}
else
{return false;}}
CheckboxInputElementGUIAdaptor.prototype.renderState=function()
{var disabled=false;var className=null;if(this.m_valueChanged)
{this.m_element.checked=this.m_value;this.m_valueChanged=false;}
if((this.supportsProtocol("EnablementProtocol")&&!this.m_enabled)||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{disabled=true;}
else
{if(this.hasValue())
{if(!this.getValid())
{if(!this.getServerValid())
{if(this.isServerValidationActive())
{className+=" notSubmissible";}
else
{className+=" "+CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS;}}
else
{className+=" "+CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS;}}}
if(this.m_readOnly)
{className+=" "+CheckboxInputElementGUIAdaptor.READONLY_CSS_CLASS;}}
this.m_element.disabled=disabled;this.m_element.className=className;}
function SelectElementGUIAdaptor()
{}
SelectElementGUIAdaptor.m_logger=new Category("SelectElementGUIAdaptor");SelectElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();SelectElementGUIAdaptor.prototype.constructor=SelectElementGUIAdaptor;SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS="selectNotSubmissible";SelectElementGUIAdaptor.SELECT_OPTION_SUBMISSIBLE_CSS_CLASS="selectOptionSubmissible";SelectElementGUIAdaptor.SELECT_OPTION_NOT_SUBMISSIBLE_CSS_CLASS="selectOptionNotSubmissible";GUIAdaptor._setUpProtocols('SelectElementGUIAdaptor');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','ListSrcDataProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','RecordsProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('SelectElementGUIAdaptor','KeybindingProtocol');SelectElementGUIAdaptor.prototype.displayXPath=null;SelectElementGUIAdaptor.prototype.m_onChangeHandler=null;SelectElementGUIAdaptor.create=function(e)
{var a=new SelectElementGUIAdaptor();a._initSelectElementGUIAdaptor(e);return a;}
SelectElementGUIAdaptor.prototype._initSelectElementGUIAdaptor=function(e)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(e.id+":SelectElementGUIAdaptor._initSelectElementGUIAdaptor");this.m_element=e;}
SelectElementGUIAdaptor.prototype._handleChange=function()
{if(SelectElementGUIAdaptor.m_logger.isDebug())SelectElementGUIAdaptor.m_logger.debug(this.getId()+":SelectElementGUIAdaptor");this.update();}
SelectElementGUIAdaptor.prototype.getDisplayXPath=function()
{return XPathUtils.concatXPaths(this._getRowXPath(),this.displayXPath);return this.keyXPath;}
SelectElementGUIAdaptor.LOSE_FOCUS_MODE="loseFocusMode";SelectElementGUIAdaptor.ON_CHANGE_MODE="onChangeMode";SelectElementGUIAdaptor.prototype._configure=function(cs)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor._configure");for(var i=0;i<cs.length;i++)
{if(null!=cs[i].displayXPath)this.displayXPath=cs[i].displayXPath;if(null!=cs[i].validate)this.validate=cs[i].validate;if(null!=cs[i].nullDisplayValue)this.nullDisplayValue=cs[i].nullDisplayValue;if(null!=cs[i].updateMode)
{this.updateMode=cs[i].updateMode;if(this.updateMode!=SelectElementGUIAdaptor.LOSE_FOCUS_MODE&&this.updateMode!=SelectElementGUIAdaptor.ON_CHANGE_MODE)
{if(SelectElementGUIAdaptor.m_logger.isError())SelectElementGUIAdaptor.m_logger.error("SelectElementGUIAdaptor._configure() unknown updateMode in configuration for adaptor id="+this.getId()+", reverting to default of SelectElementGUIAdaptor.ON_CHANGE_MODE");this.updateMode=SelectElementGUIAdaptor.ON_CHANGE_MODE;}}
else
{this.updateMode=SelectElementGUIAdaptor.ON_CHANGE_MODE;}}
if(null==this.nullDisplayValue)
{this.nullDisplayValue="";}
if(null==this.displayXPath)
{this.displayXPath=this.keyXPath;}
this.displayXPath=XPathUtils.removeLeadingSlash(this.displayXPath);this.m_hardcodedOptions=!(this.srcData&&(""!=this.srcData));var a=this;if(this.updateMode==SelectElementGUIAdaptor.ON_CHANGE_MODE)
{this.m_onChangeHandler=SUPSEvent.addEventHandler(this.m_element,"change",function(evt){return a._handleChange();});}
else
{this.m_onChangeHandler=SUPSEvent.addEventHandler(this.m_element,"blur",function(evt){return a._handleChange();});}}
SelectElementGUIAdaptor.prototype._getValueFromView=function()
{if(SelectElementGUIAdaptor.m_logger.isTrace())SelectElementGUIAdaptor.m_logger.trace(this.getId()+":SelectElementGUIAdaptor._getValueFromView()");var value=null;if(null==this.m_element)
{throw new GUIAdaptorError("SelectElementGUIAdaptor._getValueFromView(), this.m_element == null");}
for(var i=0;i<this.m_element.options.length;i++)
{var option=this.m_element.options[i];if(option.selected)
{value=option.value;if(SelectElementGUIAdaptor.m_logger.isTrace())SelectElementGUIAdaptor.m_logger.trace(this.getId()+":SelectElementGUIAdaptor._getValueFromView(), value = "+value);break;}}
return value;}
SelectElementGUIAdaptor.prototype.retrieveSrcData=function(event)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.retrieveSrcData()");var e=StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE,null,this);this.changeAdaptorState(e);var changed=false;if(!this.m_hardcodedOptions)
{changed=true;var options=this.m_element.options;var length=options.length;for(var p=0;p<length;p++)
{options[p]=null;}
options.length=0;options[0]=new Option(this.nullDisplayValue,"");var rows=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this._getRowXPath());for(var i=0;i<rows.length;i++)
{var n=rows[i];var key=ListSrcDataProtocol.selectValueFromNodeByXPath(n,this.keyXPath);var displaySrc=ListSrcDataProtocol.selectValueFromNodeByXPath(n,this.displayXPath);display=this.invokeTransformToDisplay(displaySrc);options[i+1]=new Option(display,key);if(options[i+1].value==this.m_value)
{options[i+1].selected=true;}}}
return changed;}
SelectElementGUIAdaptor.prototype.areOptionsHardcoded=function()
{return this.m_hardcodedOptions;}
SelectElementGUIAdaptor.prototype.renderState=function()
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.renderState() this.m_value="+this.m_value+", this.m_enabled="+this.m_enabled+", this.m_readOnly="+this.m_readOnly+", this.getValid()="+this.getValid()+", this.m_mandatory="+this.m_mandatory);var disabled=false;var readOnly=false;var className=null;var length=this.m_element.options.length;var aggregateState=this.getAggregateState();var foundValue=false;for(var p=0;p<length;p++)
{var option=this.m_element.options[p];var optionValue=option.value;if(optionValue==this.m_value)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.renderState() setting selected=true at options["+p+"]");foundValue=true;option.selected=true;}
else
{option.selected=false;}
if(!aggregateState.isKeySubmissible(optionValue))
{option.className=SelectElementGUIAdaptor.SELECT_OPTION_NOT_SUBMISSIBLE_CSS_CLASS;}
else
{option.className="";}}
if(!foundValue&&this.m_value==null&&length>0)
{if(!this.m_hardcodedOptions)
{this.m_element.options[0].selected=true;}}
if(this.m_value&&(this.m_value!="")&&length>0&&(this.m_element.options[0].value!=""||length>1))
{if(!foundValue)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.renderState() could not match this.m_value to a valid option, setting the class to invalid")
this.setValid(false);if(length>0&&this.m_element.options[0].value=="")
{this.m_element.options[0].selected=true;}}
else
{if(!this.validate)
{if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.renderState() matched this.m_value to a valid option, setting the class to valid")
this.setValid(true);}}}
if(!aggregateState.isSubmissible())
{className=SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS;}
if((this.supportsProtocol("EnablementProtocol")&&!this.getEnabled())||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{className="disabled";disabled=true;}
else
{if(this.hasValue())
{if(!this.getValid())
{if(!this.getServerValid())
{if(this.isServerValidationActive())
{className=SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS;}
else
{className="invalid";}}
else
{className="invalid";}}}
else
{if(this.m_mandatory)
{className="mandatory";}}
if(this.m_readOnly)
{className="readOnly";disabled=true;}}
this.m_element.disabled=disabled;this.m_element.className=className;this.m_element.readOnly=readOnly;if(SelectElementGUIAdaptor.m_logger.isInfo())SelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.renderState() element className ="+className);}
SelectElementGUIAdaptor.prototype._dispose=function()
{if(this.m_onChangeHandler!=null)
{SUPSEvent.removeEventHandlerKey(this.m_onChangeHandler);}}
function FwSelectElementGUIAdaptor()
{};FwSelectElementGUIAdaptor.m_logger=new Category("FwSelectElementGUIAdaptor");FwSelectElementGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('FwSelectElementGUIAdaptor');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','ListSrcDataProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','RecordsProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','MandatoryProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','TemporaryProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor','MouseWheelBindingProtocol');FwSelectElementGUIAdaptor.CLICK_MODE="onClickMode";FwSelectElementGUIAdaptor.DBL_CLICK_MODE="onDblClickMode";FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE="loseFocusMode";FwSelectElementGUIAdaptor.ON_CHANGE_MODE="onChangeMode";FwSelectElementGUIAdaptor.prototype.constructor=FwSelectElementGUIAdaptor;FwSelectElementGUIAdaptor.prototype.m_selectDataRows=null;FwSelectElementGUIAdaptor.prototype.m_hardcodedOptions=false;FwSelectElementGUIAdaptor.prototype.nullDisplayValue=null;FwSelectElementGUIAdaptor.prototype.m_selectionMode=null;FwSelectElementGUIAdaptor.prototype.m_updateMode=null;FwSelectElementGUIAdaptor.create=function(element)
{if(FwSelectElementGUIAdaptor.m_logger.isTrace())
{FwSelectElementGUIAdaptor.m_logger.trace("FwSelectElementGUIAdaptor.create");}
var a=new FwSelectElementGUIAdaptor();a._initFwSelectElementGUIAdaptor(element);return a;}
FwSelectElementGUIAdaptor.prototype._initFwSelectElementGUIAdaptor=function(element)
{this.m_element=element;this.m_renderer=element.__renderer;element.__renderer=null;fc_assert(this.m_renderer!=null,"FwSelectElementGUIAdaptor._initFwSelectElementGUIAdaptor(): the renderer is not defined!");this.m_renderer.setModel(this);var hardcodedOptions=this.m_renderer.getHardcodedOptions();if(null!=hardcodedOptions)
{this.m_hardcodedOptions=true;this.m_selectDataRows=this._getAllRowsFromHardcodedOptions(hardcodedOptions);}
var thisObj=this;this.m_renderer.addValueChangeListener(function(){thisObj._valueChangeCallback()});}
FwSelectElementGUIAdaptor.prototype._dispose=function()
{this.m_renderer.dispose();this.m_renderer=null;this.m_selectDataRows=null;this.m_element=null;}
FwSelectElementGUIAdaptor.prototype.setReadOnly=function(readOnly)
{if(readOnly)
{this.m_renderer.stopEventHandlers();}
else
{this.m_renderer.startEventHandlers();}
return ReadOnlyProtocol.prototype.setReadOnly.call(this,readOnly);}
FwSelectElementGUIAdaptor.prototype.getNumberOfSelectRows=function()
{return(this.m_selectDataRows==null)?0:this.m_selectDataRows.length;}
FwSelectElementGUIAdaptor.prototype.selectOptionsLoaded=function()
{return this.getNumberOfSelectRows()>0;}
FwSelectElementGUIAdaptor.prototype.isKeyForMatchSubmissible=function(matchNumber)
{var key=this.getKeyForMatch(matchNumber);var isSubmissible=this.getAggregateState().isKeySubmissible(key);if(FwSelectElementGUIAdaptor.m_logger.isTrace())FwSelectElementGUIAdaptor.m_logger.trace("FwSelectElementGUIAdaptor.isKeyForMatchSubmissible() key="+key+", isSubmissible="+isSubmissible);return isSubmissible;}
FwSelectElementGUIAdaptor.prototype.getKeyForMatch=function(matchNumber)
{var keyValue=null;if(this.selectOptionsLoaded())
{var match=this.m_selectDataRows[matchNumber];keyValue=match.getKey();}
return keyValue==null?"":keyValue;}
FwSelectElementGUIAdaptor.prototype.getMatch=function(matchNumber)
{var match=null;if(this.selectOptionsLoaded())
{match=this.m_selectDataRows[matchNumber];}
return match==null?"":match.getDisplay();}
FwSelectElementGUIAdaptor.prototype._getAllRowNodesFromDOM=function()
{var xpath=this._getRowXPath();var nodeArray=FormController.getInstance().getDataModel().getInternalDOM().selectNodes(xpath);var selectElementArray=nodeArray;if(nodeArray!=null&&nodeArray.length>0)
{selectElementArray=new Array(nodeArray.length);for(var i=0,l=nodeArray.length;i<l;i++)
{selectElementArray[i]=this._createSelectElementArrayEntry(nodeArray[i]);}
if(null!=this.comparator)
{this._sortArray(selectElementArray);}
selectElementArray=this._addNothingSelected(selectElementArray);}
return selectElementArray;}
FwSelectElementGUIAdaptor.prototype._sortArray=function(array)
{var comparatorFn=this.comparator;array.sort(function(a,b){var aValue=a.getDisplay();var bValue=b.getDisplay();return comparatorFn(aValue,bValue);});}
FwSelectElementGUIAdaptor.prototype._valueChangeCallback=function()
{if(FwSelectElementGUIAdaptor.m_logger.isDebug())
{FwSelectElementGUIAdaptor.m_logger.debug("FwSelectElementGUIAdaptor._valueChangeCallback()");}
if(this.m_updateMode==FwSelectElementGUIAdaptor.ON_CHANGE_MODE)
{this.update();}}
FwSelectElementGUIAdaptor.prototype._getValueFromView=function()
{var selectedRow=null;var returnValue=null;var selectedRowNo=this.m_renderer.getSelectedMatch();if(null==selectedRowNo)
{selectedRowNo=this.getRowNoFromDisplayValue(this.m_renderer.getTextFieldValue());}
if(null!=selectedRowNo&&this.selectOptionsLoaded())
{selectedRow=this.m_selectDataRows[selectedRowNo];}
if(null==selectedRow)
{returnValue=this.m_renderer.getTextFieldValue();}
else
{returnValue=selectedRow.getKey();}
return returnValue;}
FwSelectElementGUIAdaptor.prototype.onBlur=function()
{if(this.m_updateMode==FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE)
{this.update();}}
FwSelectElementGUIAdaptor.prototype.renderState=function()
{if(this.m_focusChanged)
{this.m_focusChanged=false;if(!this.m_focus)
{this.m_renderer.m_dropDownField.hideDropDown();}}
else
{if(this.m_valueChanged)
{if(this.m_updateMode==FwSelectElementGUIAdaptor.ON_CHANGE_MODE&&this.m_focus)
{FormController.getInstance().getFormAdaptor()._setCurrentFocusedField(this);}}}
if(this.m_valueChanged)
{this._refreshDisplayedValue();this.m_valueChanged=false;}
if(this.m_value==null&&this.selectOptionsLoaded()&&this.m_renderer.getSelectedMatch()==null)
{this.m_renderer.setSelectedRow(0);this.m_renderer.setValue(this.m_selectDataRows[0].getDisplay());if(this.m_hardcodedOptions)
{this.update();}}
this.m_renderer.render(!this.m_enabled,this.m_focus,this.m_mandatory,!this.getValid(),!this.getServerValid(),this.m_readOnly,!this.isActive(),this.getAggregateState().areChildrenSubmissible(),this.isServerValidationActive());}
FwSelectElementGUIAdaptor.prototype._refreshDisplayedValue=function()
{var val=this.m_value;var rowNo=this._getRowNoFromKey(val);var currentSelectedRow=this.m_renderer.getSelectedMatch();if(null==rowNo)
{if(null!=currentSelectedRow)
{this.m_renderer.resetSelectedMatch();}}
else
{this.m_renderer.setSelectedRow(rowNo);val=this.m_selectDataRows[rowNo].getDisplay();}
this.m_renderer.setValue(val);}
FwSelectElementGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(!this.m_hardcodedOptions)
{if(c.displayXPath&&this.m_displayXPath==null)
{this.m_displayXPath=XPathUtils.removeLeadingSlash(c.displayXPath);}}
if(null!=c.selectionMode&&this.m_selectionMode==null)
{this.m_selectionMode=c.selectionMode;}
if(null!=c.updateMode&&this.m_updateMode==null)
{this.m_updateMode=c.updateMode;}
if(null!=cs[i].sortMode)
{if(cs[i].sortMode=="numerical")
{this.comparator=Comparators.numericalSort;}
else if(cs[i].sortMode=="alphabetical")
{this.comparator=Comparators.alphabeticalSort;}
else if(cs[i].sortMode=="alphabeticalLowToHigh")
{this.comparator=Comparators.alphabeticalSortLowToHigh;}
else if(cs[i].sortMode=="alphabeticalLocaleCompare")
{this.comparator=Comparators.alphabeticalLocaleCompareSort;}
else if(cs[i].sortMode=="alphanumerical")
{this.comparator=Comparators.alphanumerical;}
else if(cs[i].sortMode=="alphabeticalCaseInsensitive")
{this.comparator=Comparators.alphabeticalCaseInsensitiveSort;}
else
{this.comparator=null;}}
if(null!=c.nullDisplayValue&&this.nullDisplayValue==null)
{this.nullDisplayValue=c.nullDisplayValue;}}
if(null!=this.m_selectionMode)
{if(this.m_selectionMode!=FwSelectElementGUIAdaptor.CLICK_MODE&&this.m_selectionMode!=FwSelectElementGUIAdaptor.DBL_CLICK_MODE)
{if(FwSelectElementGUIAdaptor.m_logger.isError())
{FwSelectElementGUIAdaptor.m_logger.error("FwSelectElementGUIAdaptor._configure() unknown selectionMode in configuration for adaptor id="+this.getId()+", reverting to default of FwSelectElementGUIAdaptor.CLICK_MODE");}
this.m_selectionMode=FwSelectElementGUIAdaptor.CLICK_MODE;}}
else
{this.m_selectionMode=FwSelectElementGUIAdaptor.CLICK_MODE;}
if(null!=this.m_updateMode)
{if(this.m_updateMode!=FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE&&this.m_updateMode!=FwSelectElementGUIAdaptor.ON_CHANGE_MODE)
{if(FwSelectElementGUIAdaptor.m_logger.isError())
{FwSelectElementGUIAdaptor.m_logger.error("FwSelectElementGUIAdaptor._configure() unknown updateMode in configuration for adaptor id="+this.getId()+", reverting to default of FwSelectElementGUIAdaptor.ON_CHANGE_MODE");}
this.m_updateMode=FwSelectElementGUIAdaptor.ON_CHANGE_MODE;}}
else
{this.m_updateMode=FwSelectElementGUIAdaptor.ON_CHANGE_MODE;}
if(null==this.nullDisplayValue)
{this.nullDisplayValue="";}
if(!this.m_hardcodedOptions)
{this._checkConfiguration();var displayXPaths=this.getRowXPathArrayWithSuffix()
this.srcDataOn=(null==this.srcDataOn)?displayXPaths:this.srcDataOn.concat(displayXPaths);if(null!=this.validateOn)
{this.validateOn=this.validateOn.concat(this.srcDataOn);}
else
{this.validateOn=this.srcDataOn;}}}
FwSelectElementGUIAdaptor.prototype._checkConfiguration=function()
{if(null==this.srcData)
{throw new ConfigurationException("srcData must be specified for adaptor: "+this.getId());}
if(null==this.keyXPath)
{throw new ConfigurationException("keyXPath must be specified for adaptor: "+this.getId());}
if(null!=this.rowXPath)
{if(this.rowXPath.indexOf('/')==0)
{this.m_absoluteRowXPath=this.srcData+this.rowXPath;}
else
{this.m_absoluteRowXPath=this.srcData+'/'+this.rowXPath;}}
else
{this.m_absoluteRowXPath=this.srcData;}
this.m_displayXPath=this.m_displayXPath!=null?this.m_displayXPath:this.keyXPath;if(this.m_displayXPath.indexOf('/')==0)
{this.m_absoluteDisplayXPath=this.m_absoluteRowXPath+this.m_displayXPath;}
else
{this.m_absoluteDisplayXPath=this.m_absoluteRowXPath+'/'+this.m_displayXPath;}
this.srcDataOn[this.srcDataOn.length]=this.m_absoluteDisplayXPath;}
FwSelectElementGUIAdaptor.prototype.retrieve=function(event)
{var db=this.dataBinding;if(null!=db)
{var mV=FormController.getInstance().getDataModel().getValue(db);var dV=this.invokeTransformToDisplay(mV);var valueChanged=this._setValue(dV);if(!this.m_valueChanged)this.m_valueChanged=valueChanged;if(valueChanged)
{this.m_renderer.resetSelectedMatch();var e=StateChangeEvent.create(StateChangeEvent.VALUE_TYPE,dV,this);this.changeAdaptorState(e);}
return valueChanged;}
else
{throw new DataBindingError("DataBindingProtocol.retrieve(), no dataBinding specified for adaptor id = "+this.getId());}}
FwSelectElementGUIAdaptor.prototype.retrieveSrcData=function(event)
{if(FwSelectElementGUIAdaptor.m_logger.isInfo())
{FwSelectElementGUIAdaptor.m_logger.info(this.getId()+":SelectElementGUIAdaptor.retrieveSrcData()");}
var e=StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE,null,this);this.changeAdaptorState(e);var changed=false;if(!this.m_hardcodedOptions)
{changed=true;this.m_selectDataRows=this._getAllRowNodesFromDOM();this.m_renderer.dataUpdate();this.m_valueChanged=true;}
return changed;}
FwSelectElementGUIAdaptor.prototype.validate=function(event)
{var ec=null;var rowNo=this._getRowNoFromKey(this.m_value);if(null==rowNo)
{ec=ErrorCode.getErrorCode("FW_FWSELECT_InvalidKey");}
return ec;}
FwSelectElementGUIAdaptor.prototype.getFocusElement=function()
{return this.m_renderer.getInputElement();}
FwSelectElementGUIAdaptor.prototype._createSelectElementArrayEntry=function(node)
{var keyNode;var keyValue;var displayNode;var displaySrcValue;var displayValue;var upperCaseDisplayValue;keyNode=node.selectSingleNode(this.keyXPath);if(null!=keyNode)
{keyValue=XML.getNodeTextContent(keyNode);}
else
{keyValue=null;}
displayNode=node.selectSingleNode(this.m_displayXPath);if(null!=displayNode)
{displaySrcValue=XML.getNodeTextContent(displayNode);displayValue=this.invokeTransformToDisplay(displaySrcValue);upperCaseDisplayValue=this._convertToUpperCase(displayValue);}
else
{if(this.m_displayXPath!=this.keyXPath)
{displaySrcValue="";displayValue=this.invokeTransformToDisplay(displaySrcValue);upperCaseDisplayValue=this._convertToUpperCase(displayValue);}
else
{displaySrcValue=keyValue;displayValue=this.invokeTransformToDisplay(displaySrcValue);upperCaseDisplayValue=this._convertToUpperCase(displayValue);}}
return new FwSelectElementArrayEntry(keyValue,displayValue,upperCaseDisplayValue);}
FwSelectElementGUIAdaptor.prototype._addNothingSelected=function(selectElementArray)
{var newArray=Array(selectElementArray.length+1);var nothingSelectedValue=this.nullDisplayValue;var upperCaseValue=this._convertToUpperCase(nothingSelectedValue);newArray[0]=new FwSelectElementArrayEntry("",nothingSelectedValue,upperCaseValue);if(selectElementArray.length>0)
{for(var i=0,l=selectElementArray.length;i<l;i++)
{newArray[i+1]=selectElementArray[i];}}
return newArray;}
FwSelectElementGUIAdaptor.prototype._getRowNoFromKey=function(keyValue)
{var returnValue=null;if(this.selectOptionsLoaded()&&null!=keyValue)
{var selectArrayEntry=null;for(var i=0,l=this.m_selectDataRows.length;i<l;i++)
{selectArrayEntry=this.m_selectDataRows[i];if(keyValue==this.invokeTransformToDisplay(selectArrayEntry.getKey()))
{returnValue=i;break;}}}
return returnValue;}
FwSelectElementGUIAdaptor.prototype.getRowNoFromDisplayValue=function(displayValue)
{var returnValue=null;if(this.selectOptionsLoaded()&&null!=displayValue)
{var selectArrayEntry=null;for(var i=0,l=this.m_selectDataRows.length;i<l;i++)
{selectArrayEntry=this.m_selectDataRows[i];if(displayValue==selectArrayEntry.getDisplay())
{returnValue=i;break;}}}
return returnValue;}
FwSelectElementGUIAdaptor.prototype._getAllRowsFromHardcodedOptions=function(hardcodedOptions)
{var selectElementArray=hardcodedOptions;var length=hardcodedOptions.length;if(length>0)
{selectElementArray=new Array(length);for(var i=0;i<length;i++)
{selectElementArray[i]=this._createArrayEntryFromHardcodedOption(hardcodedOptions[i]);}
if(null!=this.comparator)
{this._sortArray(selectElementArray);}}
return selectElementArray;}
FwSelectElementGUIAdaptor.prototype._createArrayEntryFromHardcodedOption=function(hardcodedOption)
{var keyValue;if(null==hardcodedOption["key"])
{throw new ConfigurationException("Hard coded select option for select '"+
this.getId()+"'\n does not define value for key");}
else
{keyValue=hardcodedOption["key"];}
var displaySrcValue=hardcodedOption["display"];if(null==displaySrcValue)
{displaySrcValue=keyValue;}
var displayValue=this.invokeTransformToDisplay(displaySrcValue);var upperCaseDisplayValue=this._convertToUpperCase(displayValue);return new FwSelectElementArrayEntry(keyValue,displayValue,upperCaseDisplayValue);}
FwSelectElementGUIAdaptor.prototype._convertToUpperCase=function(value)
{var upperCaseValue;if(value!="")
{upperCaseValue=value.toUpperCase();}
else
{upperCaseValue="";}
return upperCaseValue;}
FwSelectElementGUIAdaptor.prototype.areOptionsHardcoded=function()
{return this.m_hardcodedOptions;}
FwSelectElementGUIAdaptor.prototype.matchFirstCharacter=function(firstChar)
{var matchedRow=null;var upperCaseFirstChar=firstChar.toUpperCase();var selectedDataRows=this.m_selectDataRows;if(null!=selectedDataRows)
{var selectArrayEntry;var upperCaseDisplayValue;var selectDataRowsLength=selectedDataRows.length;var matchedEntries=new Array();for(var i=0;i<selectDataRowsLength;i++)
{selectArrayEntry=selectedDataRows[i];upperCaseDisplayValue=selectArrayEntry.getUpperCaseDisplay();if(upperCaseFirstChar==upperCaseDisplayValue.charAt(0))
{matchedEntries[matchedEntries.length]=selectArrayEntry;matchedEntries[matchedEntries.length-1]["index"]=i;}}
var matchedEntriesLength=matchedEntries.length;if(matchedEntriesLength>0)
{var currentTextFieldValue=this.m_renderer.getTextFieldValue();var currentPosition=null;var entryDisplayValue=null;for(var j=0;j<matchedEntriesLength;j++)
{entryDisplayValue=matchedEntries[j].getDisplay();if(entryDisplayValue==currentTextFieldValue)
{currentPosition=j;break;}}
if(null==currentPosition)
{matchedRow=matchedEntries[0]["index"];}
else
{if(matchedEntriesLength>1)
{currentPosition+=1;if(currentPosition>matchedEntriesLength-1)
{currentPosition=0;}
matchedRow=matchedEntries[currentPosition]["index"];}}}}
return matchedRow;}
FwSelectElementGUIAdaptor.prototype.handleScrollMouse=function(evt)
{if(evt.wheelDelta>0)
{this.m_renderer._selectPreviousOption();}
else
{this.m_renderer._selectNextOption();}}
FwSelectElementGUIAdaptor.prototype.initialise=function()
{if(this.m_hardcodedOptions)
{this.m_renderer._createDynamicDropDownContent();}}
function FwSelectElementArrayEntry(key,display,upperCaseDisplay)
{this.m_key=key;this.m_display=display;this.m_upperCaseDisplay=upperCaseDisplay;}
FwSelectElementArrayEntry.prototype.getKey=function()
{return this.m_key;}
FwSelectElementArrayEntry.prototype.getDisplay=function()
{return this.m_display;}
FwSelectElementArrayEntry.prototype.getUpperCaseDisplay=function()
{return this.m_upperCaseDisplay;}
function TextInputElementGUIAdaptor()
{}
TextInputElementGUIAdaptor.m_logger=new Category("TextInputElementGUIAdaptor");TextInputElementGUIAdaptor.prototype=new InputElementGUIAdaptor();GUIAdaptor._setUpProtocols("TextInputElementGUIAdaptor");GUIAdaptor._addProtocol('TextInputElementGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('TextInputElementGUIAdaptor','ReadOnlyProtocol');TextInputElementGUIAdaptor.prototype.constructor=TextInputElementGUIAdaptor;TextInputElementGUIAdaptor.CSS_CLASS_NAME="textInputElementDefaultStyle";TextInputElementGUIAdaptor.prototype.maxLength=null;TextInputElementGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry=null;TextInputElementGUIAdaptor.create=function(e)
{var a=new TextInputElementGUIAdaptor();a._initTextInputElementGUIAdaptor(e);return a;}
TextInputElementGUIAdaptor.prototype._initTextInputElementGUIAdaptor=function(e)
{this._initInputElementGUIAdaptor(e);var a=this;this.m_changeEventKey=SUPSEvent.addEventHandler(e,"change",function(evt){return a._handleBlur(evt);});e.setAttribute("autocomplete","OFF");}
TextInputElementGUIAdaptor.prototype._dispose=function()
{SUPSEvent.removeEventHandlerKey(this.m_changeEventKey);this.m_changeEventKey=null;}
TextInputElementGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.additionalStylingClasses&&this.m_additionalStylingClasses==null)
{this.m_additionalStylingClasses=c.additionalStylingClasses;}
if(FormController.getValidateWhitespaceOnlyEntryActive())
{if(null!=c.validateWhitespaceOnlyEntry&&this.m_validateWhitespaceOnlyEntry==null)
{this.m_validateWhitespaceOnlyEntry=c.validateWhitespaceOnlyEntry;}}
if(null!=c.maxLength)
{this.maxLength=c.maxLength;this.validate=this._validateMaxLength;this.getElement().maxLength=this.maxLength;break;}}
if(FormController.getValidateWhitespaceOnlyEntryActive()&&this.m_validateWhitespaceOnlyEntry!=false)
{if(this.maxLength!=null)
{this._addWhitespaceOnlyEntryValidation();}
else
{this.validate=this._validateWhitespaceOnlyEntry;}}}
TextInputElementGUIAdaptor.prototype._handleBlur=function()
{if(TextInputElementGUIAdaptor.m_logger.isDebug())TextInputElementGUIAdaptor.m_logger.debug("TextInputElementGUIAdaptor._handleBlur(): performing update() for adaptor: "+this.getId());this.update();}
TextInputElementGUIAdaptor.prototype.renderState=function()
{this.m_element.value=null==this.m_value?"":this.m_value;var disabled=false;var readOnly=false;var className=TextInputElementGUIAdaptor.CSS_CLASS_NAME;if((this.supportsProtocol("EnablementProtocol")&&!this.getEnabled())||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{className="disabled";disabled=true;}
else
{if(this.hasValue())
{if(!this.getValid())
{if(!this.getServerValid())
{if(this.isServerValidationActive())
{className+=" notSubmissible";}
else
{className+=" invalid";}}
else
{className+=" invalid";}}}
else
{if(this.m_mandatory)
{className+=" mandatory";}}
if(this.m_readOnly)
{className+=" readOnly";readOnly=true;}
if(this.m_additionalStylingClasses!=null)
{className+=" "+this.m_additionalStylingClasses;}}
this.m_element.disabled=disabled;this.m_element.className=className;this.m_element.readOnly=readOnly;if(this.m_focusChanged)
{if(this.m_focus)
{this.m_element.select();}
this.m_focusChanged=false;}}
function TextAreaElementGUIAdaptor()
{}
TextAreaElementGUIAdaptor.m_logger=new Category("TextAreaElementGUIAdaptor");TextAreaElementGUIAdaptor.prototype=new TextInputElementGUIAdaptor();TextAreaElementGUIAdaptor.prototype.constructor=TextAreaElementGUIAdaptor;TextAreaElementGUIAdaptor.prototype.m_keyPressEventKey=null;TextAreaElementGUIAdaptor.create=function(e)
{var a=new TextAreaElementGUIAdaptor();a._initTextInputElementGUIAdaptor(e);return a;}
TextAreaElementGUIAdaptor.prototype._dispose=function()
{if(null!=this.maxLength)
{SUPSEvent.removeEventHandlerKey(this.m_keyPressEventKey);this.m_keyPressEventKey=null;if(HTMLView.isIE)
{SUPSEvent.removeEventHandlerKey(this.m_beforePasteEventKey);this.m_beforePasteEventKey=null;SUPSEvent.removeEventHandlerKey(this.m_pasteEventKey);this.m_pasteEventKey=null;}}
TextInputElementGUIAdaptor.prototype._dispose.call(this);}
TextAreaElementGUIAdaptor.prototype._configure=function(cs)
{TextInputElementGUIAdaptor.prototype._configure.call(this,cs);if(null!=this.maxLength)
{var thisObj=this;this.m_keyPressEventKey=SUPSEvent.addEventHandler(this.m_element,"keypress",function(evt){return thisObj._handleKeyPress(evt);});if(HTMLView.isIE)
{this.m_beforePasteEventKey=SUPSEvent.addEventHandler(this.m_element,"beforepaste",function(){return thisObj._handleBeforePaste();});this.m_pasteEventKey=SUPSEvent.addEventHandler(this.m_element,"paste",function(){return thisObj._handlePaste();});}}}
TextAreaElementGUIAdaptor.prototype._handleKeyPress=function(evt)
{evt=(evt)?evt:((event)?event:null);if(null!=evt)
{var currentSelection=document.selection.createRange();var currentLength=this.m_element.value.length-currentSelection.text.length;var maxLength=this.maxLength;if(currentLength>=maxLength)
{if(HTMLView.isIE)
{evt.returnValue=false;}
else
{if(evt.charCode==0)
{if(evt.keyCode==Key.Return)
{evt.preventDefault();}}
else
{var qualifier=evt.ctrlKey||evt.altKey;if(!qualifier)
{evt.preventDefault();}}}}}}
TextAreaElementGUIAdaptor.prototype._handleBeforePaste=function()
{var event=window.event;if(null!=event)
{event.returnValue=false;}}
TextAreaElementGUIAdaptor.prototype._handlePaste=function()
{var event=window.event;if(null!=event)
{event.returnValue=false;var clipboardText=window.clipboardData.getData("Text");this._insertText(clipboardText);}}
TextAreaElementGUIAdaptor.prototype._insertText=function(insertionText)
{var maxLength=this.maxLength;var currentLength=this.m_element.value.length;var currentSelection=document.selection.createRange();var currentSelectionLength=currentSelection.text.length;var insertionTextLength=insertionText.length;var lengthChange=insertionTextLength-currentSelectionLength;if(lengthChange>0)
{if(currentLength+lengthChange>maxLength)
{var modifiedInsertionTextLength=insertionTextLength-(currentLength+lengthChange-maxLength);if(modifiedInsertionTextLength>0)
{currentSelection.text=insertionText.substr(0,modifiedInsertionTextLength);}}
else
{currentSelection.text=insertionText;}}
else
{currentSelection.text=insertionText;}}
function TabSelectorGUIAdaptor(){};TabSelectorGUIAdaptor.m_logger=new Category("TabSelectorGUIAdaptor");TabSelectorGUIAdaptor.prototype=new HTMLElementGUIAdaptor();TabSelectorGUIAdaptor.prototype.constructor=TabSelectorGUIAdaptor;GUIAdaptor._setUpProtocols('TabSelectorGUIAdaptor');GUIAdaptor._addProtocol('TabSelectorGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('TabSelectorGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('TabSelectorGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('TabSelectorGUIAdaptor','KeybindingProtocol');TabSelectorGUIAdaptor.prototype.m_netEnablementState=true;TabSelectorGUIAdaptor.create=function(element)
{if(TabSelectorGUIAdaptor.m_logger.isTrace())TabSelectorGUIAdaptor.m_logger.trace("TabSelectorGUIAdaptor.create");var a=new TabSelectorGUIAdaptor();a._initialiseAdaptor(element);return a;}
TabSelectorGUIAdaptor.prototype._configure=function(cs)
{this.includeInValidation=false;}
TabSelectorGUIAdaptor.prototype._initialiseAdaptor=function(e)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);var thisObj=this;this.m_renderer.setTabClickHandler(function(clickedTab){thisObj._onTabClick(clickedTab);});var pagedAreaId=this.m_renderer._getAssociatedPagedArea().id;var cm=FormController.getInstance().getFormView().getConfigManager();var cs=cm.getConfig(pagedAreaId);for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if((null==this.isEnabled)&&(null!=c.isEnabled))this.isEnabled=c.isEnabled;if((null==this.enableOn)&&(null!=c.enableOn))this.enableOn=c.enableOn;}
this.m_renderer._setTabSelectorWidth();}
TabSelectorGUIAdaptor.prototype._dispose=function()
{this.m_renderer.dispose();this.m_renderer=null;this.m_element=null;}
TabSelectorGUIAdaptor.prototype.renderState=function()
{if(renderStateChanged(this,this.m_netEnablementState))
{this.m_netEnablementState=!this.m_netEnablementState;if(this.m_renderer.setEnabled(this.m_netEnablementState))
{this.m_renderer.renderState();}
this.m_enabledChanged=false;}
if(this.m_focusChanged)
{this.m_renderer.setFocus(this.m_focus);this.m_focusChanged=false;}}
TabSelectorGUIAdaptor.prototype._getAssociatedPagedAreaGUIAdaptor=function()
{if(null==this.m_associatedPagedArea)
{var pagedAreaDiv=this.m_renderer._getAssociatedPagedArea();if(null==pagedAreaDiv)
{throw new ConfigurationException("TabSelector '"+this.getId()+"' failed to find associated PagedArea div element");}
this.m_associatedPagedArea=Services.getAdaptorById(pagedAreaDiv.id);if(null==this.m_associatedPagedArea)
{throw new ConfigurationException("TabSelector '"+this.getId()+"' failed to find associated PagedAreaGUIAdaptor '"+pagedAreaDiv.id+"'");}}
if(this.m_focusChanged)
{var tab=this.m_renderer.getCurrentlySelectedTab();if(null!=tab)
{if(tab.setFocus(this.m_focus))
{tab.renderState();};}
this.m_focusChanged=false;}
return this.m_associatedPagedArea;}
TabSelectorGUIAdaptor.prototype._onTabClick=function(clickedTab)
{var pagedArea=this._getAssociatedPagedAreaGUIAdaptor();pagedArea.showPage(clickedTab.getPageId());}
TabSelectorGUIAdaptor.prototype._handlePagedAreaEnablementChanged=function(pageId,enabled)
{var tab=this.m_renderer._getTabForPageId(pageId);if(null!=tab)
{this.m_renderer.setTabEnablementState(tab,enabled);}}
TabSelectorGUIAdaptor.prototype._handlePagedAreaVisibilityChanged=function(pageId,visible)
{var tab=this.m_renderer._getTabForPageId(pageId);if(null!=tab)
{this.m_renderer.setTabSelectionState(tab,visible);}}
TabSelectorGUIAdaptor.prototype._handlePagedAreaLabelChanged=function(pageId,label)
{var tab=this.m_renderer._getTabForPageId(pageId);if(null!=tab)
{this.m_renderer.setTabLabel(tab,label)}}
TabSelectorGUIAdaptor.prototype.acceptFocus=function()
{return!this._getAllTabsDisabled();}
TabSelectorGUIAdaptor.prototype._getAllTabsDisabled=function()
{return this.m_renderer.getAllTabsDisabled();}
TabSelectorGUIAdaptor.prototype._handleKeyArrowLeft=function()
{this.m_renderer.selectPreviousTab();}
TabSelectorGUIAdaptor.prototype._handleKeyArrowRight=function()
{this.m_renderer.selectNextTab();}
TabSelectorGUIAdaptor.prototype._handleKeyArrowDown=function()
{var tab=this.m_renderer.getCurrentlySelectedTab();if(null!=tab)
{var pageId=tab.getPageId();var fc=FormController.getInstance();var pageAdaptor=fc.getAdaptorById(pageId);var focusAdaptorId=pageAdaptor.invokeFirstFocusedAdaptorId();if(null==focusAdaptorId)
{if(pageAdaptor.m_containedChildren.length>0)
{focusAdaptorId=pageAdaptor.m_containedChildren[0].getId();}}
if(null!=focusAdaptorId)
{Services.setFocus(focusAdaptorId);}}}
TabSelectorGUIAdaptor.prototype.keyBindings=[{key:Key.ArrowLeft,action:TabSelectorGUIAdaptor.prototype._handleKeyArrowLeft},{key:Key.ArrowRight,action:TabSelectorGUIAdaptor.prototype._handleKeyArrowRight},{key:Key.ArrowDown,action:TabSelectorGUIAdaptor.prototype._handleKeyArrowDown}];function PagedAreaGUIAdaptor(){};PagedAreaGUIAdaptor.m_logger=new Category("PagedAreaGUIAdaptor");PagedAreaGUIAdaptor.prototype=new HTMLElementGUIAdaptor();PagedAreaGUIAdaptor.prototype.constructor=PagedAreaGUIAdaptor;GUIAdaptor._setUpProtocols('PagedAreaGUIAdaptor');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','ComponentContainerProtocol');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('PagedAreaGUIAdaptor','DynamicLoadingProtocol');PagedAreaGUIAdaptor.CSS_CLASS_NAME="pagedArea";PagedAreaGUIAdaptor.DISABLED_CSS_CLASS_NAME="pagedAreaDisabled";PagedAreaGUIAdaptor.READONLY_CSS_CLASS_NAME="pagedAreaReadOnly";PagedAreaGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS="pagedAreaNotSubmissible";PagedAreaGUIAdaptor.prototype.m_selectedPageId=null;PagedAreaGUIAdaptor.prototype.m_dynamicPageConfigs=null
PagedAreaGUIAdaptor.create=function(e)
{if(PagedAreaGUIAdaptor.m_logger.isTrace())PagedAreaGUIAdaptor.m_logger.trace("PagedAreaGUIAdaptor.create");var a=new PagedAreaGUIAdaptor();a._initialiseAdaptor(e);return a;}
PagedAreaGUIAdaptor.prototype._initialiseAdaptor=function(e)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);}
PagedAreaGUIAdaptor.prototype._dispose=function()
{this.m_element=null;if(this.m_dynamicPageConfigs!=null)
{var cm=FormController.getInstance().getFormView().getConfigManager();for(var i in this.m_dynamicPageConfigs)
{cm.removeConfig(this.m_dynamicPageConfigs[i].id);for(var j in this.m_dynamicPageConfigs[i])
{delete j;}
delete this.m_dynamicPageConfigs[i];}
this.m_dynamicPageConfigs=null;}}
PagedAreaGUIAdaptor.prototype._configure=function(cs)
{this.includeInValidation=false;this._registerStaticPageListeners();var dps=new Object();for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];var _showProgress=false;if(c.showProgress!=null)_showProgress=c.showProgress;var dynamicPages=c.dynamicPages;if(dynamicPages!=null)
{for(var j=0,m=dynamicPages.length;j<m;j++)
{var dp=dynamicPages[j];this._checkMandatoryCfg(dp,"id");this._checkMandatoryCfg(dp,"viewURL");this._checkMandatoryCfg(dp,"configURL");if(dps[dp.id]!=null)throw new ConfigurationException("Duplicate dynamic page id: "+dp.id+" in Paged Area: "+this.getId());if(dp.showProgress==null)dp.showProgress=_showProgress;dps[dp.id]=dp;}}}
this.m_dynamicPageConfigs=dps;}
PagedAreaGUIAdaptor.prototype._checkMandatoryCfg=function(config,propertyName)
{var property=config[propertyName];if(null==property||""==property)throw new ConfigurationException(propertyName+" is a madatory configuration property for dynamic pages");}
PagedAreaGUIAdaptor.prototype._registerStaticPageListeners=function()
{var pageAdaptors=this._getPages();for(var i=0,l=pageAdaptors.length;i<l;i++)
{this._registerPageListeners(pageAdaptors[i]);}}
PagedAreaGUIAdaptor.prototype._registerPageListeners=function(pageAdaptor)
{var hasAssociatedTabSelector=(this._getAssociatedTabSelector()!=null);var thisObj=this;pageAdaptor.addVisibilityChangeListener(function(pageId,visible){thisObj._pageVisibilityCallback(pageId,visible);});if(hasAssociatedTabSelector)
{pageAdaptor.addEnablementChangeListener(function(pageId,enabled){thisObj._pageEnablementCallback(pageId,enabled);});pageAdaptor.addLabelChangeListener(function(pageId,label){thisObj._pageLabelCallback(pageId,label);});}}
PagedAreaGUIAdaptor.prototype.renderState=function()
{if(this.m_valueChanged)
{if(null!=this.m_currentPage)
{this.m_currentPage.show(false);this.m_currentPage=null;}
if(null!=this.m_value&&""!=this.m_value)
{this.m_currentPage=this._getPageById(this.m_value);if(null==this.m_currentPage)
{this.m_currentPage=this._findAndLoadDynamicPage(this.m_value);}
if(null!=this.m_currentPage)
{this.m_currentPage.show(true);}}
this.m_valueChanged=false;}
if(renderStateChanged(this,this.m_netEnablementState))
{this.m_netEnablementState=!this.m_netEnablementState;var className=PagedAreaGUIAdaptor.CSS_CLASS_NAME;if(this.m_netEnablementState)
{if(!this.getAggregateState().isSubmissible())
{className+=" "+PagedAreaGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;}
if(this.getReadOnly())
{className+=" "+PagedAreaGUIAdaptor.READONLY_CSS_CLASS_NAME;}}
else
{className+=" "+PagedAreaGUIAdaptor.DISABLED_CSS_CLASS_NAME;}
this.m_element.className=className;this.m_enabledChanged=false;}}
PagedAreaGUIAdaptor.prototype._getPageById=function(pageId)
{var page=null;var pageAdaptors=this._getPages();for(var i=0,l=pageAdaptors.length;i<l;i++)
{if(pageAdaptors[i].getId()==pageId)
{page=pageAdaptors[i];break;}}
return page;}
PagedAreaGUIAdaptor.prototype._findAndLoadDynamicPage=function(pageId)
{var dynamicPage=null;var pageConfig=this.m_dynamicPageConfigs[pageId];if(null!=pageConfig)
{var fc=FormController.getInstance();var pageDiv=document.createElement("div");pageDiv.id=pageId;pageDiv.className=DynamicPageGUIAdaptor.CSS_CLASS_NAME;pageDiv.innerHTML="Page Loading...";this.m_element.appendChild(pageDiv);var fv=fc.getFormView();var cm=fv.getConfigManager();cm.setConfig(pageId,pageConfig);var gaf=fv.getGUIAdaptorFactory();var adaptors=gaf._parseElement(pageDiv,this,true);fc_assert(null!=adaptors,"Failed to create DynamicPageGUIAdaptor");fc_assert(1==adaptors.length,"Unexpected number of adaptors created when parsing DynamicPageGUIAdaptor. Expected 1 adaptor, got "+adaptors.length);dynamicPage=adaptors[0];this.m_pages.push(dynamicPage);this._registerPageListeners(dynamicPage);fc.addAdaptors(adaptors);}
return dynamicPage;}
PagedAreaGUIAdaptor.prototype._destroyDynamicPage=function(pageId)
{var page=null;var pageAdaptors=this._getPages();var newPageAdaptors=[];var removedPage=null;for(var i=0,l=pageAdaptors.length;i<l;i++)
{var pa=pageAdaptors[i];if(pa.getId()!=pageId)
{newPageAdaptors.push(pa);}
else
{removedPage=pa;}}
this.m_pages=newPageAdaptors;if(removedPage!=null)
{var pageDiv=removedPage.getElement();var tabbedSelector=this._getAssociatedTabSelector();if(null!=tabbedSelector)
{tabbedSelector._handlePagedAreaVisibilityChanged(pageId,false);}
var fc=FormController.getInstance();fc.removeAdaptor(removedPage);pageDiv.parentNode.removeChild(pageDiv);if(removedPage==this.m_currentPage)
{this.m_currentPage=null;}}}
PagedAreaGUIAdaptor.prototype._getPages=function()
{if(null==this.m_pages)
{this.m_pages=new Array();var pageAreaChildren=this.m_element.childNodes;for(var i=0,l=pageAreaChildren.length;i<l;i++)
{var child=pageAreaChildren[i];if(child.nodeType==1)
{if(child.nodeName=="DIV"&&child.className.indexOf(PageGUIAdaptor.CSS_CLASS_NAME)==0)
{if(child.id.length>0)
{var pageAdaptor=Services.getAdaptorById(child.id)
this.m_pages.push(pageAdaptor);}}
else
{PagedAreaGUIAdaptor.m_logger.error("PageAreaGUIAdaptor._getPages(): PageArea '"+this.getId()+"' has children which are not pages!");}}}}
return this.m_pages;}
PagedAreaGUIAdaptor.prototype._getAssociatedTabSelector=function()
{if(null==this.m_associatedTabSelector)
{var kids=this.m_element.parentNode.childNodes;for(var i=0,l=kids.length;i<l;i++)
{var kid=kids[i];if(1==kid.nodeType&&"DIV"==kid.nodeName&&TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME==kid.className)
{if(kid.id.length>0)
{this.m_associatedTabSelector=Services.getAdaptorById(kid.id);}
else
{throw new ConfigurationException("TabSelector associated with PagedArea '"+this.getId()+"' must have an id");}
break;}}}
return this.m_associatedTabSelector;}
PagedAreaGUIAdaptor.prototype.showPage=function(pageId)
{this.m_selectedPageId=pageId;this.update();}
PagedAreaGUIAdaptor.prototype._getValueFromView=function()
{return this.m_selectedPageId;}
PagedAreaGUIAdaptor.prototype._pageVisibilityCallback=function(pageId,visible)
{if(visible)
{this.showPage(pageId);}
else
{if(this.m_currentPage.getId()==pageId)
{this.showPage(null);}}
var tabbedSelector=this._getAssociatedTabSelector();if(null!=tabbedSelector)
{tabbedSelector._handlePagedAreaVisibilityChanged(pageId,visible);}}
PagedAreaGUIAdaptor.prototype._pageEnablementCallback=function(pageId,enabled)
{var tabbedSelector=this._getAssociatedTabSelector();if(null!=tabbedSelector)
{tabbedSelector._handlePagedAreaEnablementChanged(pageId,enabled);}}
PagedAreaGUIAdaptor.prototype._pageLabelCallback=function(pageId,label)
{var tabbedSelector=this._getAssociatedTabSelector();if(null!=tabbedSelector)
{tabbedSelector._handlePagedAreaLabelChanged(pageId,label);}}
PagedAreaGUIAdaptor.prototype.getListenersForDynamicLoadingProtocol=function(db)
{var listenerArray=new Array();var cs=this.getConfigs();var dataBinding=this.getDataBinding();for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];var dynamicPages=c.dynamicPages;if(dynamicPages!=null)
{for(var j=0,m=dynamicPages.length;j<m;j++)
{var dp=dynamicPages[j];var on=dp.loadOn;if(null!=on&&on.length>0)
{var listener=FormControllerListener.create(this,FormController.LOAD,dp.id);for(var k=0,n=on.length;k<n;k++)
{listenerArray.push({xpath:on[k],listener:listener});}}
var listener=FormControllerListener.create(this,FormController.UNLOAD,dp.id);listenerArray.push({xpath:dataBinding,listener:listener});on=dp.unloadOn;if(null!=on&&on.length>0)
{for(var k=0,n=on.length;k<n;k++)
{listenerArray.push({xpath:on[k],listener:listener});}}}}}
return listenerArray;}
PagedAreaGUIAdaptor.prototype.handleLoad=function(d)
{var page=this._getPageById(d);if(null==page)
{page=this._findAndLoadDynamicPage(d);if(page!=null)
{this.showPage(d);}}}
PagedAreaGUIAdaptor.prototype.handleUnload=function(d)
{var page=this._getPageById(d);if(page!=null)
{this._destroyDynamicPage(d);}}
PagedAreaGUIAdaptor.prototype.getOnLoadConfigs=function(d)
{var cs=this.getConfigs();var configs=[];for(var i=0,l=cs.length;i<l;i++)
{var dynamicPages=cs[i].dynamicPages;if(null!=dynamicPages)
{for(var j=0,m=dynamicPages.length;j<m;j++)
{if(dynamicPages[j].id==d)
{if(null!=dynamicPages[j].load)configs.push(dynamicPages[j].load);}}}}
return configs;}
PagedAreaGUIAdaptor.prototype.getOnUnloadConfigs=function(d)
{var cs=this.getConfigs();var configs=[];for(var i=0,l=cs.length;i<l;i++)
{var dynamicPages=cs[i].dynamicPages;if(null!=dynamicPages)
{for(var j=0,m=dynamicPages.length;j<m;j++)
{if(dynamicPages[j].id==d)
{var thisObj=this;configs.push(function(d){return thisObj.m_value!=d;});if(null!=dynamicPages[j].unload)configs.push(dynamicPages[j].unload);}}}}
return configs;}
PagedAreaGUIAdaptor.prototype._getDynamicLoadingDetails=function()
{var cs=this.getConfigs();var details=[];for(var i=0,l=cs.length;i<l;i++)
{var dynamicPages=cs[i].dynamicPages;if(null!=dynamicPages)
{for(var j=0,m=dynamicPages.length;j<m;j++)
{details.push({m_detail:dynamicPages[j].id});}}}
return details;}
function PageGUIAdaptor(){};PageGUIAdaptor.prototype=new HTMLElementGUIAdaptor();PageGUIAdaptor.prototype.constructor=PageGUIAdaptor;GUIAdaptor._setUpProtocols('PageGUIAdaptor');GUIAdaptor._addProtocol('PageGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('PageGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('PageGUIAdaptor','LabelProtocol');GUIAdaptor._addProtocol('PageGUIAdaptor','ComponentContainerProtocol');GUIAdaptor._addProtocol('PageGUIAdaptor','ComponentVisibilityProtocol');PageGUIAdaptor.CSS_CLASS_NAME="page";PageGUIAdaptor.DISABLED_CSS_CLASS_NAME="pageDisabled";PageGUIAdaptor.READONLY_CSS_CLASS_NAME="pageReadOnly";PageGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS="pageNotSubmissible";PageGUIAdaptor.prototype.m_netEnablementState=true;PageGUIAdaptor.prototype.m_enablementCallbackList=null;PageGUIAdaptor.prototype.m_label_callbacklist=null;PageGUIAdaptor.prototype.m_visibility_callbacklist=null;PageGUIAdaptor.create=function(element)
{Logging.logMessage("PageGUIAdaptor.create",Logging.LOGGING_LEVEL_TRACE);var a=new PageGUIAdaptor();a._initialiseAdaptor(element);return a;}
PageGUIAdaptor.prototype._initialiseAdaptor=function(e)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_enablementCallbackList=new CallbackList();this.m_label_callbacklist=new CallbackList();this.m_visibility_callbacklist=new CallbackList();}
PageGUIAdaptor.prototype._dispose=function()
{this.m_enablementCallbackList.dispose();this.m_label_callbacklist.dispose();this.m_visibility_callbacklist.dispose();this.m_enablementCallbackList=null;this.m_label_callbacklist=null;this.m_visibility_callbacklist=null;}
PageGUIAdaptor.prototype._configure=function(cs)
{this.includeInValidation=false;}
PageGUIAdaptor.prototype.addEnablementChangeListener=function(callbackMethod)
{this.m_enablementCallbackList.addCallback(callbackMethod);}
PageGUIAdaptor.prototype.addLabelChangeListener=function(callbackMethod)
{this.m_label_callbacklist.addCallback(callbackMethod);}
PageGUIAdaptor.prototype.addVisibilityChangeListener=function(callbackMethod)
{this.m_visibility_callbacklist.addCallback(callbackMethod);}
PageGUIAdaptor.prototype.renderState=function()
{if(renderStateChanged(this,this.m_netEnablementState))
{this.m_netEnablementState=!this.m_netEnablementState;var className=PageGUIAdaptor.CSS_CLASS_NAME;if(this.m_netEnablementState)
{if(!this.getAggregateState().isSubmissible())
{className+=" "+PageGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;}
if(this.getReadOnly())
{className+=" "+PageGUIAdaptor.READONLY_CSS_CLASS_NAME;}}
else
{className+=" "+PageGUIAdaptor.DISABLED_CSS_CLASS_NAME;}
this.m_element.className=className;this.m_enablementCallbackList.invoke(this.getId(),this.m_netEnablementState);this.m_enabledChanged=false;}
if(true==this.m_labelChanged)
{this.m_label_callbacklist.invoke(this.getId(),this.m_label);this.m_labelChanged=false;}}
PageGUIAdaptor.prototype.show=function(showMe)
{this.m_element.style.visibility=showMe?TabSelector.VISIBILITY_INHERIT:TabSelector.VISIBILITY_HIDDEN;this.m_element.style.zIndex=showMe?1:0;this.m_visibility_callbacklist.invoke(this.m_element.id,showMe);}
function DynamicPageGUIAdaptor(){};DynamicPageGUIAdaptor.prototype=new PageGUIAdaptor();GUIAdaptor._setUpProtocols('DynamicPageGUIAdaptor');DynamicPageGUIAdaptor.prototype.constructor=DynamicPageGUIAdaptor;DynamicPageGUIAdaptor.CSS_CLASS_NAME="dynamicPage "+PageGUIAdaptor.CSS_CLASS_NAME;DynamicPageGUIAdaptor.STATE_CREATED=0;DynamicPageGUIAdaptor.STATE_LOADING=1;DynamicPageGUIAdaptor.STATE_LOADED=2;DynamicPageGUIAdaptor.SCRIPT_REWRITE_REGEX=new RegExp("createInline([^(]*)\\(");DynamicPageGUIAdaptor.prototype.m_loadingState=DynamicPageGUIAdaptor.STATE_CREATED;DynamicPageGUIAdaptor.prototype.m_viewURL=null;DynamicPageGUIAdaptor.prototype.m_configScript=null;DynamicPageGUIAdaptor.prototype.m_stylesheetLink=null;DynamicPageGUIAdaptor.prototype.m_onLoadHandlerKey=null;DynamicPageGUIAdaptor.prototype.m_pageCreationException=null;DynamicPageGUIAdaptor.create=function(e)
{Logging.logMessage("PageGUIAdaptor.create",Logging.LOGGING_LEVEL_TRACE);var a=new DynamicPageGUIAdaptor();a._initialiseAdaptor(e);return a;}
DynamicPageGUIAdaptor.prototype._initialiseAdaptor=function(e)
{PageGUIAdaptor.prototype._initialiseAdaptor.call(this,e);}
DynamicPageGUIAdaptor.prototype._dispose=function()
{if(null!=this.m_configScript)
{this.m_configScript.parentNode.removeChild(this.m_configScript);this.m_configScript=null;}
if(null!=this.m_stylesheetLink)
{this.m_stylesheetLink.parentNode.removeChild(this.m_stylesheetLink);this.m_stylesheetLink=null;}
this.m_viewURL=null;this.m_configURL=null;this.m_styleURL=null;this.m_cssLoaded=null;if(null!=this.m_onLoadHandlerKey)
{SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);this.m_onLoadHandlerKey=null;}
PageGUIAdaptor.prototype._dispose.call(this);}
DynamicPageGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null==this.m_viewURL&&null!=c.viewURL)this.m_viewURL=c.viewURL;if(null==this.m_configURL&&null!=c.configURL)this.m_configURL=c.configURL;if(null==this.m_styleURL&&null!=c.styleURL)this.m_styleURL=c.styleURL;if(null==this.m_showProgress&&null!=c.showProgress)this.m_showProgress=c.showProgress;}
if(null==this.m_styleURL)this.m_cssLoaded=true;if(null==this.m_showProgress)this.m_showProgress=false;}
DynamicPageGUIAdaptor.prototype.show=function(showMe)
{PageGUIAdaptor.prototype.show.call(this,showMe);if(showMe)
{if(this.m_loadingState==DynamicPageGUIAdaptor.STATE_CREATED)
{if(this.m_showProgress==true)
{var ac=FormController.getInstance().getAppController();ac._showProgress();}}
var thisObj=this;setTimeout(function(){thisObj._loadPage();},0);}}
DynamicPageGUIAdaptor.prototype._loadPage=function()
{if(DynamicPageGUIAdaptor.STATE_CREATED==this.m_loadingState)
{var thisObj=this;this.m_loadingState=DynamicPageGUIAdaptor.STATE_LOADING;this.m_configLoadingState=DynamicPageGUIAdaptor.STATE_LOADING;this.m_configScript=document.createElement("script");document.body.appendChild(this.m_configScript);this.m_configScript.src=this.m_configURL;if(this.m_styleURL!=null)
{var headElement=GUIUtils.getDocumentHeadElement(document);this.m_stylesheetLink=GUIUtils.createStyleLinkElement(headElement,this.m_styleURL,null);this.m_cssLoaded=false;if(HTMLView.isIE)
{this.m_onLoadHandlerKey=SUPSEvent.addEventHandler(this.m_stylesheetLink,"load",function(){thisObj._pageCSSLoaded();});}
else
{this._pageCSSLoaded();}}
var iframe=document.createElement("iframe");iframe.style.visibility="hidden";document.body.parentNode.appendChild(iframe);this.m_iframe=fwFrameManager.create(iframe);this.m_iframe.addLoadCompleteListener(function(errMsg){thisObj._iframeLoaded(errMsg);});this.m_iframe.load(this.m_viewURL);}}
DynamicPageGUIAdaptor.prototype._iframeLoaded=function(errorMessage)
{var destroyIframe=true;if(null==errorMessage)
{try
{var iframe=this.m_iframe.getFrame();var iframeDoc=getIframeDocument(iframe);var divs=iframeDoc.getElementsByTagName("DIV");var i=0;var l=divs.length;for(i=0;i<l;i++)
{if(DynamicPageGUIAdaptor.CSS_CLASS_NAME==divs[i].className)break;}
if(i<l)
{var innerHTML=divs[i].innerHTML;this.m_element.innerHTML=innerHTML;var scripts=this.m_element.getElementsByTagName("SCRIPT");for(i=0,l=scripts.length;i<l;i++)
{var script=scripts[i];var scriptText=script.innerHTML.replace(DynamicPageGUIAdaptor.SCRIPT_REWRITE_REGEX,"createAsInnerHTML$1(scriptTag, Renderer.AFTER_ELEMENT, ");var fn=new Function("scriptTag",scriptText);fn.call(null,script);}
this.m_loadingState=DynamicPageGUIAdaptor.STATE_LOADED;if(DynamicPageGUIAdaptor.STATE_LOADED==this.m_configLoadingState)
{this._pageAndConfigReady(true);}}
else
{throw new fwException("Failed to load page. Couldn't find DynamicPanel.");}}
catch(ex)
{if(FormController.getDebugMode()==false)
{this._hideProgressBar();destroyIframe=false;this.m_pageCreationException=ex;var thisObj=this;setTimeout(function(){thisObj._handlePageCreationException();},0);}
else
{throw ex;}}}
else
{this.m_element.innerHTML="Failed to load page. Error message was:<br>"+errorMessage;this._hideProgressBar();}
if(destroyIframe)
{var thisObj=this;setTimeout(function(){thisObj._destroyIframe();},0);}}
DynamicPageGUIAdaptor.prototype._configLoaded=function()
{this.m_configLoadingState=DynamicPageGUIAdaptor.STATE_LOADED;if(DynamicPageGUIAdaptor.STATE_LOADED==this.m_loadingState)
{this._pageAndConfigReady();}}
DynamicPageGUIAdaptor.prototype._pageAndConfigReady=function(exceptionsHandledExternally)
{if(this.m_cssLoaded)
{if(exceptionsHandledExternally==true)
{this._createAndConfigureAdaptors();this._hideProgressBar();}
else
{var progressBarHidden=false;try
{this._createAndConfigureAdaptors();this._hideProgressBar();progressBarHidden=true;}
catch(ex)
{if(!progressBarHidden)
{this._hideProgressBar();}
if(FormController.getDebugMode()==false)
{var fwEx=ex instanceof fwException?ex:new fwException(ex.message);fwException.invokeFatalExceptionHandler(fwEx);}
else
{this.m_element.innerHTML="Failed to load page. Error message was:<br>"+
ex.message;}}}}
else
{var thisObj=this;setTimeout(function(){thisObj._pageAndConfigReady();},50);}}
DynamicPageGUIAdaptor.configLoadComplete=function(pageId)
{Services.getAdaptorById(pageId)._configLoaded();}
DynamicPageGUIAdaptor.prototype._destroyIframe=function()
{var iframe=this.m_iframe.getFrame();this.m_iframe.dispose();this.m_iframe=null;iframe.parentNode.removeChild(iframe);}
DynamicPageGUIAdaptor.prototype._pageCSSLoaded=function()
{this.m_cssLoaded=true;if(null!=this.m_onLoadHandlerKey)
{SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);this.m_onLoadHandlerKey=null;}}
DynamicPageGUIAdaptor.prototype._handlePageCreationException=function()
{var ex=this.m_pageCreationException;this.m_pageCreationException=null;ex=ex instanceof fwException?ex:new fwException(ex.message);this._destroyIframe();fwException.invokeFatalExceptionHandler(ex);}
DynamicPageGUIAdaptor.prototype._createAndConfigureAdaptors=function()
{var fc=FormController.getInstance();var gaf=fc.getFormView().getGUIAdaptorFactory();var adaptors=gaf._parseElement(this.m_element,this,false);fc.addAdaptors(adaptors);fc.runInitialiseLifecycle(adaptors);}
DynamicPageGUIAdaptor.prototype._hideProgressBar=function()
{if(this.m_showProgress)
{var ac=FormController.getInstance().getAppController();ac._hideProgress();}}
function PanelGUIAdaptor(){};PanelGUIAdaptor.prototype=new HTMLElementGUIAdaptor();PanelGUIAdaptor.prototype.constructor=PanelGUIAdaptor;PanelGUIAdaptor.CSS_CLASS_NAME="panel";PanelGUIAdaptor.CSS_NO_MARGIN_CLASS_NAME="panel noMargin";PanelGUIAdaptor.DISABLED_CSS_CLASS_NAME="panel_disabled";GUIAdaptor._setUpProtocols('PanelGUIAdaptor');GUIAdaptor._addProtocol('PanelGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('PanelGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('PanelGUIAdaptor','ComponentContainerProtocol');PanelGUIAdaptor.prototype.m_cssClass=null;PanelGUIAdaptor.create=function(element)
{Logging.logMessage("PanelGUIAdaptor.create",Logging.LOGGING_LEVEL_TRACE);var a=new PanelGUIAdaptor();a._initPanelGUIAdaptor(element);return a;}
PanelGUIAdaptor.prototype._initPanelGUIAdaptor=function(element)
{this.m_cssClass=element.className;HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,element);}
PanelGUIAdaptor.prototype._dispose=function()
{this.m_element=null;}
PanelGUIAdaptor.prototype.renderState=function()
{var className=this.m_cssClass;if((this.supportsProtocol("EnablementProtocol")&&!this.getEnabled())||(this.supportsProtocol("ActiveProtocol")&&!this.isActive()))
{className+=(" "+PanelGUIAdaptor.DISABLED_CSS_CLASS_NAME);}
this.m_element.className=className;}
function GridGUIAdaptor()
{this.multipleSelection=false;this.isSortable=true;this.generateKeys=true;this.m_model=new GridModel(this);this.m_dataChangeListeners=new CallbackList();this.m_positionChangeListeners=new CallbackList();this.m_selectionChangeListeners=new CallbackList();this.m_scrollRowTimeout=null;}
GridGUIAdaptor.m_logger=new Category("GridGUIAdaptor");GridGUIAdaptor.SORT_ASC="ascending";GridGUIAdaptor.SORT_DESC="descending";GridGUIAdaptor.isGridAdaptor=function(adaptor)
{var isGrid=false;if((typeof adaptor=="object")&&(adaptor.constructor==GridGUIAdaptor||adaptor.constructor==FilteredGridGUIAdaptor))
{isGrid=true;}
return isGrid;}
GridGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols("GridGUIAdaptor");GUIAdaptor._addProtocol('GridGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','ListSrcDataProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','RecordsProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','ValidationProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('GridGUIAdaptor','HelpProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','HelpProtocolHTMLImpl');GUIAdaptor._addProtocol('GridGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','NameProtocol');GUIAdaptor._addProtocol('GridGUIAdaptor','MouseWheelBindingProtocol');GridGUIAdaptor.prototype.constructor=GridGUIAdaptor;GridGUIAdaptor.prototype.columns=null;GridGUIAdaptor.prototype.m_renderer=null;GridGUIAdaptor.prototype._getDebugInfo=function()
{GridGUIAdaptor.m_logger.info("GridGUIAdaptor._getDebugInfo() view info = "+this.m_view._getDebugInfo());GridGUIAdaptor.m_logger.info("GridGUIAdaptor._getDebugInfo() model info = "+this.m_model._getDebugInfo());}
GridGUIAdaptor.create=function(e)
{var a=new GridGUIAdaptor();a._initialiseAdaptor(e);return a;}
GridGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace("GridGUIAdaptor._initialiseAdaptor");HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);var renderer=this.m_renderer;this.setView(renderer);this.m_model.setView(renderer);renderer.setAdaptor(this);renderer.startEventHandlers();this.m_model.verticalScroll(new VerticalScrollbarRenderEvent(0));this.publishGridRenderEvent();}
GridGUIAdaptor.prototype.setView=function(renderer)
{this.m_view=renderer;}
GridGUIAdaptor.prototype.getView=function()
{return this.m_view;}
GridGUIAdaptor.prototype._configure=function(cs)
{var sortEvent=null;for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.columns&&this.columns==null)
{this.columns=c.columns;}
if(c.rowRenderingRule&&this.rowRenderingRule==null)
{this.rowRenderingRule=c.rowRenderingRule;}
if(c.multipleSelection!=null)this.multipleSelection=c.multipleSelection;if(c.isSortable!=null)this.isSortable=c.isSortable;if(c.updateSrcDataWithDeltas!=null)this.updateSrcDataWithDeltas=c.updateSrcDataWithDeltas;}
if(null!=this.columns)
{var sortDirection=null;var initialSortingColumn=0;for(var j=0,l=this.columns.length;j<l;j++)
{var col=this.columns[j];this.srcDataOn[this.srcDataOn.length]=XPathUtils.concatXPaths(this._getRowXPath(),col.xpath);if(this.isSortable&&col.defaultSort&&(col.defaultSort=="true"))
{initialSortingColumn=j;if(col.defaultSortOrder)
{sortDirection=(col.defaultSortOrder=="ascending")?false:true;}}
if(col.filterXPath!=null)
{if(this.srcDataFilterOn==null)
{this.srcDataFilterOn=new Array();}
this.srcDataFilterOn[this.srcDataFilterOn.length]=col.filterXPath;}}
sortEvent=new ColumnSortEvent(initialSortingColumn,sortDirection);}
this.m_model.setRowXPath(this._getRowXPath());this.m_model.setKeyXPath(this.keyXPath);this.m_model.setIsSortable(this.isSortable);this.m_model.setColumns(this.columns);this.m_model.setDataBinding(this.dataBinding);this.m_model.setMultipleSelectionMode(this.multipleSelection);this.m_model.setRowRenderingRule(this.rowRenderingRule);if(this.multipleSelection==true)
{if(this.retrieveOn==null)this.retrieveOn=new Array();this.retrieveOn[this.retrieveOn.length]=XPathUtils.concatXPaths(this.dataBinding,this.keyXPath);}
if(sortEvent!=null)
{this.m_model.setSelectedColumn(sortEvent.getColumnNumber());this.m_model.sortData(sortEvent);}}
GridGUIAdaptor.prototype._dispose=function()
{if(this.m_scrollRowTimeout!=null)
{clearTimeout(this.m_scrollRowTimeout);this.m_scrollRowTimeout=null;}
if(this.m_view!=null)
{this.m_view.dispose();this.m_view=null;}
if(this.m_model!=null)
{this.m_model.dispose();this.m_model=null;}
if(this.m_dataChangeListeners!=null)
{this.m_dataChangeListeners.dispose();this.m_dataChangeListeners=null;}
if(this.m_positionChangeListeners!=null)
{this.m_positionChangeListeners.dispose();this.m_positionChangeListeners=null;}
if(this.m_selectionChangeListeners!=null)
{this.m_selectionChangeListeners.dispose();this.m_selectionChangeListeners=null;}
if(this.m_renderer!=null)
{this.m_renderer=null;}
if(this.m_element!=null)
{this.m_element=null;}}
GridGUIAdaptor.prototype.addSelectionChangeListener=function(cb)
{this.m_selectionChangeListeners.addCallback(cb);}
GridGUIAdaptor.prototype.removeSelectionChangeListener=function(cb)
{this.m_selectionChangeListeners.removeCallback(cb);}
GridGUIAdaptor.prototype.addDataChangeListener=function(cb)
{this.m_dataChangeListeners.addCallback(cb);}
GridGUIAdaptor.prototype.removeDataChangeListener=function(cb)
{this.m_dataChangeListeners.removeCallback(cb);}
GridGUIAdaptor.prototype.addPositionChangeListener=function(cb)
{this.m_positionChangeListeners.addCallback(cb);}
GridGUIAdaptor.prototype.removePositionChangeListener=function(cb)
{this.m_positionChangeListeners.removeCallback(cb);}
GridGUIAdaptor.prototype.getRowRange=function()
{return this.m_model.getRowRange();}
GridGUIAdaptor.prototype.getCurrentSelectedRow=function()
{return this.m_model.getCurrentSelectedRow();}
GridGUIAdaptor.prototype.getSelectedRows=function()
{return this.m_model.getSelectedRows();}
GridGUIAdaptor.prototype.getMultipleSelection=function()
{return this.multipleSelection;}
GridGUIAdaptor.prototype.getRowDisplayEvent=function()
{var selectedRow=this.getCurrentSelectedRow();var rowRange=this.getRowRange();var startRowNumber=parseInt(rowRange.startRowNumber)+1;var numberOfRowsInView=rowRange.numberOfRowsInView;var maxNumberOfRows=rowRange.maxNumberOfRows;if(parseInt(numberOfRowsInView)>parseInt(maxNumberOfRows))
{numberOfRowsInView=maxNumberOfRows;}
if(maxNumberOfRows==0)
{startRowNumber=0;}
return{selectedRow:selectedRow,startRowNumber:startRowNumber,numberOfRowsInView:numberOfRowsInView,maxNumberOfRows:maxNumberOfRows}}
GridGUIAdaptor.prototype.retrieve=function(event)
{this.m_model.refreshDataBinding(event);var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);return true;}
GridGUIAdaptor.prototype.retrieveSrcData=function(event)
{GridGUIAdaptor.m_logger.info("GridGUIAdaptor.retrieveSrcData() data model event = "+event.toString());this.m_model.refreshSrcData(event);var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);if(null==this.m_scrollRowTimeout)
{var thisObj=this;this.m_scrollRowTimeout=setTimeout(function(){thisObj.scrollSelectedRowIntoView();},0);}
return true;}
GridGUIAdaptor.prototype.filterSrcData=function(event)
{this.m_model.filterSrcData(event);var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);return true;}
GridGUIAdaptor.prototype.update=function()
{}
GridGUIAdaptor.prototype.handleSelectionChange=function(selectEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleSelectionChange()");this.m_model.selectRow(selectEvent);this.renderState();var event=this.getRowDisplayEvent();this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype.handleVerticalScroll=function(scrollEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleVerticalScroll() scrollEvent = "+scrollEvent.toString());this.m_model.verticalScroll(scrollEvent);this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype.scrollSelectedRowIntoView=function()
{if(this.m_scrollRowTimeout!=null)
{this.m_scrollRowTimeout=null;}
if(null!=this.m_model)
{this.m_model.scrollSelectedRowIntoView();this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}}
GridGUIAdaptor.prototype.refreshKeyStates=function()
{if(!this.getMultipleSelection())
{this.m_model.refreshKeyStates();}}
GridGUIAdaptor.prototype.setFocus=function(f,wasClick)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug("FocusProtocol.setFocus() adaptor "+this.getId()+", focus = "+f);var r=false;if(f!=this.m_focus)
{this.m_focus=f;this.m_focusChanged=true;r=true;this.publishGridRenderEvent();}
else
{this.m_focusChanged=false;}
return r;}
GridGUIAdaptor.prototype.setEnabled=function(e)
{var changed=EnablementProtocol.prototype.setEnabled.call(this,e);if(changed==true)
{this.publishGridRenderEvent();if(e==true)
{this.m_view.startEventHandlers();}
else
{this.m_view.stopEventHandlers();}}
return changed;}
GridGUIAdaptor.prototype.setContainerEnabled=function(e)
{var changed=EnablementProtocol.prototype.setContainerEnabled.call(this,e);if(changed==true)
{if(e==true)
{this.m_view.startEventHandlers();}
else
{this.m_view.stopEventHandlers();}}
return changed;}
GridGUIAdaptor.prototype.hasValue=function()
{return(this.m_model.getRowRange().maxNumberOfRows>0);}
GridGUIAdaptor.prototype.setValid=function(v)
{var r=ValidationProtocol.prototype.setValid.call(this,v);this.publishGridRenderEvent();return r;}
GridGUIAdaptor.prototype.onServerValidationServerSuccess=function(dom)
{this.handleServerValidationSuccess(dom);this.publishGridRenderEvent();this.renderState();}
GridGUIAdaptor.prototype.onServerValidationAbort=function()
{this.handleServerValidationAbort();this.publishGridRenderEvent();this.renderState();}
GridGUIAdaptor.prototype.setActive=function(elementActive)
{if(elementActive!=this.m_active)
{this.m_active=elementActive;this.publishGridRenderEvent();if(elementActive==true)
{this.m_view.startEventHandlers();}
else
{this.m_view.stopEventHandlers();}}}
GridGUIAdaptor.prototype.invokeUpdateAdaptorState=function(event,refreshDisplay)
{var changed=false;var key=null;if(this.dataBinding)
{key=Services.getValue(this.dataBinding);}
var state=this.getAggregateState();changed=state.setState(event,key);var e=StateChangeEvent.create(StateChangeEvent.CHILD_TYPE,this.isSubmissible(),this);this.bubbleStateChangeEventToParents(e,changed);if(changed==true)
{this.handleStateChangeEvent(key,event);}
if(refreshDisplay!=null)
{this.renderState();}
if(SubmissibleState.m_logger.isTrace())SubmissibleState.m_logger.trace("StateChangeEventProtocol.invokeUpdateAdaptorState() adaptorId="+this.getId()+", this.isSubmissible()="+this.isSubmissible()+", changed="+changed);return changed;}
GridGUIAdaptor.prototype.receiveStateChangeEvent=function(event)
{var adaptorId=event.getAdaptor().getId();var key=null;if(this.dataBinding)
{key=Services.getValue(this.dataBinding);}
var state=this.getAggregateState();if(state.setState(event,key))
{var e=StateChangeEvent.create(StateChangeEvent.CHILD_TYPE,this.isSubmissible(),this);this.fireStateChangeEvent(e);this.handleStateChangeEvent(key,event);this.renderState();}}
GridGUIAdaptor.prototype.handleStateChangeEvent=function(key,event)
{this.publishGridRenderEvent();if(key!=null)
{if(event.getType()==StateChangeEvent.CHILD_TYPE&&this.multipleSelection==false)
{var rowEvent=new RowAggregateStateChangeEvent(key,event.getState());this.publishRowAggregateStateChangeEvent(rowEvent);}}}
GridGUIAdaptor.prototype.setReadOnly=function(ro)
{var changed=ReadOnlyProtocol.prototype.setReadOnly.call(this,ro);if(changed==true)
{this.publishGridRenderEvent();if(ro==true)
{this.m_view.stopRowEventHandlers();}
else
{this.m_view.startRowEventHandlers();}}
return changed;}
GridGUIAdaptor.prototype.setContainerReadOnly=function(ro)
{var changed=ReadOnlyProtocol.prototype.setContainerReadOnly.call(this,ro);if(changed==true)
{if(ro==true)
{this.m_view.stopRowEventHandlers();}
else
{this.m_view.startRowEventHandlers();}}
return changed;}
GridGUIAdaptor.prototype.publishRowAggregateStateChangeEvent=function(event)
{this.m_model.handleRowAggregateStateChangeEvent(event);}
GridGUIAdaptor.prototype.publishGridRenderEvent=function()
{var event=new GridRenderEvent(this.getValid(),this.getServerValid(),this.m_enabled,this.m_readOnly,this.m_focus,this.m_active,this.isSubmissible(),this.isServerValidationActive());this.m_model.publishGridRenderEvent(event);}
GridGUIAdaptor.prototype.publishColumnRenderEvent=function(column,sortDirection)
{var event=new ColumnSortEvent(column,sortDirection);this.m_model.publishColumnRenderEvent(event);}
GridGUIAdaptor.prototype.renderState=function()
{this.m_model.processRenderEvents();}
GridGUIAdaptor.prototype._handleKeyUp=function()
{this.m_model._handleKeyUp();this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype._handleKeyDown=function()
{this.m_model._handleKeyDown();this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype._handleKeyPageUp=function()
{this.m_model._handleKeyPageUp();this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype._handleKeyPageDown=function()
{this.m_model._handleKeyPageDown();this.renderState();var event=this.getRowDisplayEvent();this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype._handleKeySpace=function()
{this.m_model._handleKeySpace();this.renderState();}
GridGUIAdaptor.prototype._handleKeyLeft=function()
{if(this.isSortable&&this.m_view.getHeaderRow()!=null)
{this.m_model._handleKeyLeft();this.renderState();var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}}
GridGUIAdaptor.prototype._handleKeyRight=function()
{if(this.isSortable&&this.m_view.getHeaderRow()!=null)
{this.m_model._handleKeyRight();this.renderState();var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}}
GridGUIAdaptor.prototype._handleKeyShiftUp=function()
{if(this.isSortable&&this.m_view.getHeaderRow()!=null)
{if(this.m_model._handleKeyShiftUp())
{this.renderState();var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}}}
GridGUIAdaptor.prototype._handleKeyShiftDown=function()
{if(this.isSortable&&this.m_view.getHeaderRow()!=null)
{if(this.m_model._handleKeyShiftDown())
{this.renderState();var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}}}
GridGUIAdaptor.prototype.keyBindings=[{key:Key.ArrowUp,action:GridGUIAdaptor.prototype._handleKeyUp},{key:Key.ArrowDown,action:GridGUIAdaptor.prototype._handleKeyDown},{key:Key.PageUp,action:GridGUIAdaptor.prototype._handleKeyPageUp},{key:Key.PageDown,action:GridGUIAdaptor.prototype._handleKeyPageDown},{key:Key.Space,action:GridGUIAdaptor.prototype._handleKeySpace},{key:Key.ArrowLeft,action:GridGUIAdaptor.prototype._handleKeyLeft},{key:Key.ArrowRight,action:GridGUIAdaptor.prototype._handleKeyRight},{key:Key.ArrowUp,action:GridGUIAdaptor.prototype._handleKeyShiftUp,shift:true},{key:Key.ArrowDown,action:GridGUIAdaptor.prototype._handleKeyShiftDown,shift:true}];GridGUIAdaptor.prototype.handleColumnHeaderClick=function(sortEvent)
{if(GridGUIAdaptor.m_logger.isDebug())GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleColumnHeaderClick()");this.publishColumnRenderEvent(this.m_model.getSelectedColumn(),null);this.m_model.setSelectedColumn(sortEvent.getColumnNumber());this.m_model.sortData(sortEvent);this.renderState();var event=this.getRowDisplayEvent();this.m_dataChangeListeners.invoke(event);this.m_positionChangeListeners.invoke(event);this.m_selectionChangeListeners.invoke(event);}
GridGUIAdaptor.prototype.addDblclickListener=function(cb)
{this.m_view.addDblclickListener(cb);}
GridGUIAdaptor.prototype.removeDblclickListener=function(cb)
{if(this.m_view!=null)
{this.m_view.removeDblclickListener(cb);}}
GridGUIAdaptor.prototype.handleScrollMouse=function(evt)
{if(GridGUIAdaptor.m_logger.isTrace())GridGUIAdaptor.m_logger.trace("GridGUIAdaptor.handleScrollMouse() evt.wheelDelta = "+evt.wheelDelta);if(evt.wheelDelta>0)
{this._handleKeyUp();}
else
{this._handleKeyDown();}}
GridGUIAdaptor.prototype.setCursorRow=function(cursorRowNumber)
{this.m_model.setCursorRow(cursorRowNumber);this._handleKeyDown();this._handleKeyUp();}
GridGUIAdaptor.prototype.isSubmissible=function(key,checkValid)
{return this.getAggregateState().isSubmissible(key,checkValid);}
GridGUIAdaptor.prototype.getAggregateState=function()
{if(this.m_aggregateState==null)this.m_aggregateState=GridSubmissibleState.create(this);return this.m_aggregateState;}
function GridSubmissibleState(adaptor)
{SubmissibleState.prototype.constructor.call(this,adaptor);}
GridSubmissibleState.prototype=new SubmissibleState();GridSubmissibleState.prototype.constructor=GridSubmissibleState;GridSubmissibleState.create=function(adaptor)
{var state=new GridSubmissibleState(adaptor);return state;}
GridSubmissibleState.prototype.setState=function(stateChangeEvent,key)
{var changed=false;this.m_key=key;var originalAggregateState=this.isSubmissible(key,false);var originalValidState=this.m_valid;this.getAdaptorState();switch(stateChangeEvent.getType())
{case StateChangeEvent.SRCDATA_TYPE:changed=this.handleSrcDataEvent();break;case StateChangeEvent.CHILD_TYPE:this.handleChildEvent(stateChangeEvent,key);break;case StateChangeEvent.PARENT_TYPE:changed=this.handleParentEvent(stateChangeEvent,key);break;case StateChangeEvent.REMOVED_ADAPTOR_TYPE:changed=this.handleRemovedAdaptorEvent(stateChangeEvent);break;default:break;}
if(changed==false)
{var newAggregateState=this.isSubmissible(key,false);var newValidState=this.m_valid;changed=(originalAggregateState!=newAggregateState);if(changed==false)changed=(originalValidState!=newValidState);}
return(changed);}
GridSubmissibleState.prototype.isSubmissible=function(key,checkValid)
{var result=true;checkValid=(null==checkValid)?true:checkValid;if(!this.m_enabled||this.m_temporary)
{}
else
{if(key!=null)
{result=this.isKeySubmissible(key);}
else
{result=this.areChildrenSubmissible();}
if(result==true&&checkValid==true)
{if(this.m_adaptor.hasValue())
{if(this.m_valid==false)
{result=false;}}}}
return result;}
function FilteredGridGUIAdaptor()
{}
FilteredGridGUIAdaptor.prototype=new HTMLElementGUIAdaptor();FilteredGridGUIAdaptor.prototype.constructor=FilteredGridGUIAdaptor;GUIAdaptor._setUpProtocols('FilteredGridGUIAdaptor');FilteredGridGUIAdaptor.prototype._dispose=function()
{this._removeFilteredGridConfig();this.m_element.__renderer=null;this.m_element=null;}
FilteredGridGUIAdaptor.create=function(e,factory)
{Logging.logMessage("FilteredGridGUIAdaptor.create()",Logging.LOGGING_LEVEL_INFO);var a=new FilteredGridGUIAdaptor();a._initFilteredGridGUIAdaptor(e);return a;}
FilteredGridGUIAdaptor.prototype._initFilteredGridGUIAdaptor=function(e)
{Logging.logMessage("FilteredGridGUIAdaptor._initFilteredGridGUIAdaptor",Logging.LOGGING_LEVEL_INFO);this.m_element=e;}
FilteredGridGUIAdaptor.prototype._configure=function(cs)
{var id=this.m_element.id;var gridId=id+"_filtered_grid";var ctor=function(){};window[gridId]=ctor;var currentConfig=window[id];for(var i in currentConfig)
{ctor[i]=currentConfig[i];}
var columns=ctor.columns;if(null!=columns)
{for(var j=0,l=columns.length;j<l;j++)
{var col=columns[j];var filterXPath=this.createFilterFieldConfig(j,col);col.filterXPath=filterXPath;}}}
FilteredGridGUIAdaptor.prototype.addDblclickListener=function(cb)
{var id=this.m_element.id;var gridId=id+"_filtered_grid";var grid=Services.getAdaptorById(gridId);grid.addDblclickListener(cb);}
FilteredGridGUIAdaptor.prototype.removeDblclickListener=function(cb)
{var id=this.m_element.id;var gridId=id+"_filtered_grid";var grid=Services.getAdaptorById(gridId);grid.removeDblclickListener(cb);}
FilteredGridGUIAdaptor.prototype.createFilterFieldConfig=function(colNumber,column)
{var id=this.getId()+"_column_filter_col"+colNumber;var ctor=function(){};window[id]=ctor;var xpath=column.filterXPath;if(xpath==null)
{xpath=DataModel.DEFAULT_TMP_BINDING_ROOT+"/filtering/"+id;}
ctor.dataBinding=xpath;ctor.isTemporary=function(){return true;};ctor.additionalStylingClasses=" grid_filter_cell col"+colNumber;return xpath;}
FilteredGridGUIAdaptor.prototype._removeFilteredGridConfig=function()
{var id=this.m_element.id;var gridId=id+"_filtered_grid";var gridConfig=window[gridId];if(null!=gridConfig)
{var columns=gridConfig.columns;if(null!=columns)
{var columnId=null;var columnConfig=null;for(var i=0,l=columns.length;i<l;i++)
{columnId=this.getId()+"_column_filter_col"+i;columnConfig=window[columnId];if(null!=columnConfig)
{if(null!=columnConfig.dataBinding)columnConfig.dataBinding=null;if(null!=columnConfig.isTemporary)columnConfig.isTemporary=null;if(null!=columnConfig.additionalStylingClasses)columnConfig.additionalStylingClasses=null;columnConfig=null;window[columnId]=null;}
columnId=null;}}
for(var j in gridConfig)
{gridConfig[j]=null;}
gridConfig=null;window[gridId]=null;gridId=null;}}
function LogicGUIAdaptor()
{}
LogicGUIAdaptor.m_logger=new Category("LogicGUIAdaptor");LogicGUIAdaptor.LOGIC_CSS_CLASS_NAME="logic";LogicGUIAdaptor.prototype=new HTMLElementGUIAdaptor();LogicGUIAdaptor.prototype.constructor=LogicGUIAdaptor;GUIAdaptor._setUpProtocols('LogicGUIAdaptor');LogicGUIAdaptor.create=function(e)
{var a=new LogicGUIAdaptor();a._initLogicGUIAdaptor(e);return a;}
LogicGUIAdaptor.prototype._initLogicGUIAdaptor=function(e)
{if(LogicGUIAdaptor.m_logger.isInfo())LogicGUIAdaptor.m_logger.info(e.id+":LogicGUIAdaptor._initLogicGUIAdaptor");this.m_element=e;var a=this;}
function AbstractPopupGUIAdaptor(){};AbstractPopupGUIAdaptor.m_logger=new Category("AbstractPopupGUIAdaptor");AbstractPopupGUIAdaptor.m_deactivatedAdaptors=null;AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise=null;AbstractPopupGUIAdaptor.m_popups=new Array();AbstractPopupGUIAdaptor.prototype.m_popupLayer=null
AbstractPopupGUIAdaptor.prototype.onPopupClose=null;AbstractPopupGUIAdaptor.prototype=new HTMLElementGUIAdaptor();GUIAdaptor._setUpProtocols('AbstractPopupGUIAdaptor');GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor','InitialiseProtocol');GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor','ComponentVisibilityProtocol');GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor','BusinessLifeCycleProtocol');AbstractPopupGUIAdaptor.prototype.constructor=AbstractPopupGUIAdaptor;AbstractPopupGUIAdaptor.prototype.m_parentFocussedAdaptor=null;AbstractPopupGUIAdaptor.prototype._initialiseAdaptor=function(e)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_popupLayer=PopupLayer.create(e);}
AbstractPopupGUIAdaptor.prototype._dispose=function()
{this.m_raise=null;this.m_lower=null;this.m_popupLayer._dispose();this.m_popupLayer=null;}
AbstractPopupGUIAdaptor.prototype._configure=function(cs)
{var raiseBusinessLifeCycle=new PopupRaiseBusinessLifeCycle();raiseBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(raiseBusinessLifeCycle);var lowerBusinessLifeCycle=new PopupLowerBusinessLifeCycle();lowerBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(lowerBusinessLifeCycle);for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.raise&&this.m_raise==null)
{raiseBusinessLifeCycle.configure(c.raise);this.m_raise=raiseBusinessLifeCycle.getEventBinding();}
if(c.lower&&this.m_lower==null)
{lowerBusinessLifeCycle.configure(c.lower);this.m_lower=lowerBusinessLifeCycle.getEventBinding();}
if(c.prePopupPrepare!=null)
{this.m_prePopupPrepare=c.prePopupPrepare;}
if(null!=c.nextFocusedAdaptorId)
{this.nextFocusedAdaptorId=c.nextFocusedAdaptorId;}}
var raiseEventBinding=raiseBusinessLifeCycle.getEventBinding();var lowerEventBinding=lowerBusinessLifeCycle.getEventBinding();if(null!=raiseEventBinding)raiseEventBinding.start();if(null!=lowerEventBinding)lowerEventBinding.start();}
AbstractPopupGUIAdaptor.prototype.show=function(showMe,currentFocussedAdaptorId)
{if(showMe)
{if(AbstractPopupGUIAdaptor._isPopupRaised(this.getId()))
{if(AbstractPopupGUIAdaptor.m_logger.isWarn())AbstractPopupGUIAdaptor.m_logger.warn("Attempt to raise popup "+this.getId()+" which is already raised");}
else
{this._show(true,currentFocussedAdaptorId);Services.getAppController().modalState(true);}}
else
{var popupRaised=false;for(var i=0,l=AbstractPopupGUIAdaptor.m_popups.length;i<l;i++)
{if(AbstractPopupGUIAdaptor.m_popups[i]==this)
{popupRaised=true;break;}}
if(popupRaised)
{this._show(false);if(0==AbstractPopupGUIAdaptor.m_popups.length)
{Services.getAppController().modalState(false);}
var cs=this.getConfigs();for(var i=0;i<cs.length;i++)
{if(null!=cs[i].onPopupClose)
{cs[i].onPopupClose.call(this);}}}
else
{if(AbstractPopupGUIAdaptor.m_logger.isWarn())AbstractPopupGUIAdaptor.m_logger.warn("Attempt to lower popup "+this.getId()+" which is not raised");}}}
AbstractPopupGUIAdaptor.prototype._showPopupLayer=function(showMe)
{if(showMe==true)
{this.m_popupLayer.show();}
else
{this.m_popupLayer.hide();}}
AbstractPopupGUIAdaptor.prototype._show=function(showMe,currentFocussedAdaptorId)
{if(showMe)
{if(null!=currentFocussedAdaptorId)
{this.m_parentFocussedAdaptor=Services.getAdaptorById(currentFocussedAdaptorId);}
else
{this.m_parentFocussedAdaptor=FormController.getInstance().getTabbingManager().m_currentFocussedAdaptor;}
if(this.m_prePopupPrepare!=null&&typeof this.m_prePopupPrepare=="function")
{this.m_prePopupPrepare();}
if(AbstractPopupGUIAdaptor.m_popups.length>0)
{this._reactivateParent()}
this._deactivateParent();var cssClass=this.m_element.className;if(cssClass.lastIndexOf("popup_fullscreen")>0)
{var docEl=this.m_element.ownerDocument.documentElement;var screenHeight=window.innerHeight!=null?window.innerHeight:docEl.clientHeight;var screenWidth=window.innerWidth!=null?window.innerWidth:docEl.clientWidth;this.m_element.style.height=screenHeight+"px";this.m_element.style.width=screenWidth+"px";this.m_element.style.top="0px";this.m_element.style.left="0px";}
this._showPopupLayer(true);AbstractPopupGUIAdaptor.m_popups.push(this);}
else
{this._showPopupLayer(false);this._reactivateParent();var newPopupArray=[];var oldPopupArray=AbstractPopupGUIAdaptor.m_popups;for(var i=0,l=oldPopupArray.length;i<l;i++)
{var popup=oldPopupArray[i];if(popup!=this)
{newPopupArray.push(popup);}}
AbstractPopupGUIAdaptor.m_popups=newPopupArray;if(AbstractPopupGUIAdaptor.m_popups.length>0)
{var newTopLevelPopup=AbstractPopupGUIAdaptor.m_popups[AbstractPopupGUIAdaptor.m_popups.length-1];newTopLevelPopup._deactivateParent();}
var nextFocusAdaptorID=this.invokeNextFocusedAdaptorId();if(null==nextFocusAdaptorID&&this.m_parentFocussedAdaptor!=null)
{nextFocusAdaptorID=this.m_parentFocussedAdaptor.getId();}
Services.setFocus(nextFocusAdaptorID);}}
AbstractPopupGUIAdaptor._isPopupRaised=function(id)
{var raisedPopups=AbstractPopupGUIAdaptor.m_popups;for(var i=0,l=raisedPopups.length;i<l;i++)
{if(raisedPopups[i].getId()==id)
{return true;}}
return false;}
AbstractPopupGUIAdaptor.prototype._deactivateParent=function()
{var fc=FormController.getInstance();var adaptors=fc.m_adaptors;AbstractPopupGUIAdaptor.m_deactivatedAdaptors=new Array();AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise=new Array();var inActiveElements=AbstractPopupGUIAdaptor.m_deactivatedAdaptors;var deactivatedButtons=AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;for(var i=0,l=adaptors.length;i<l;i++)
{var a=adaptors[i];if(this._isAdaptorChildOfPopup(a)||!a.supportsProtocol("ActiveProtocol"))
{continue;}
if(a.isActive())
{a.setActive(false);a.renderState();inActiveElements.push(a);}
else
{if(a instanceof ButtonInputElementGUIAdaptor&&a.isDeactivatedWhilstHandlingEvent())
{deactivatedButtons.push(a);}}}}
AbstractPopupGUIAdaptor.prototype._isAdaptorChildOfPopup=null;AbstractPopupGUIAdaptor.prototype._reactivateParent=function()
{var a,i,l;var inActiveElements=AbstractPopupGUIAdaptor.m_deactivatedAdaptors;for(i=0,l=inActiveElements.length;i<l;i++)
{a=inActiveElements[i];a.setActive(true);a.renderState();}
AbstractPopupGUIAdaptor.m_deactivatedAdaptors=null;var deactivatedButtons=AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;for(i=0,l=deactivatedButtons.length;i<l;i++)
{a=deactivatedButtons[i];if(!(a.isDeactivatedWhilstHandlingEvent()))
{a.setActive(true);a.renderState();}}
AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise=null;}
AbstractPopupGUIAdaptor.prototype.getParentContainer=function()
{if(null==this.m_raise)
{return GUIAdaptor.prototype.getParentContainer.call(this);}
else
{var raisingAdaptors=this.m_raise.getSources();return raisingAdaptors[0].getParentContainer();}}
AbstractPopupGUIAdaptor.prototype.getSources=function()
{var raisingAdaptors=null;if(null!=this.m_raise)
{raisingAdaptors=this.m_raise.getSources();}
return raisingAdaptors;}
AbstractPopupGUIAdaptor.prototype.invokeNextFocusedAdaptorId=function()
{return(this.nextFocusedAdaptorId!=null)?this.nextFocusedAdaptorId.call(this):null;}
AbstractPopupGUIAdaptor.prototype.nextFocusedAdaptorId=function()
{var a=this.m_parentFocussedAdaptor;return(null!=a?a.getId():null);}
function PopupGUIAdaptor(){};PopupGUIAdaptor.m_logger=new Category("PopupGUIAdaptor");PopupGUIAdaptor.prototype=new AbstractPopupGUIAdaptor();GUIAdaptor._setUpProtocols('PopupGUIAdaptor');GUIAdaptor._addProtocol('PopupGUIAdaptor','ComponentContainerProtocol');GUIAdaptor._addProtocol('PopupGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('PopupGUIAdaptor','ReadOnlyProtocol');GUIAdaptor._addProtocol('PopupGUIAdaptor','KeybindingProtocol');PopupGUIAdaptor.prototype.constructor=PopupGUIAdaptor;PopupGUIAdaptor.EVENT_RAISE=BusinessLifeCycleEvents.EVENT_RAISE;PopupGUIAdaptor.EVENT_LOWER=BusinessLifeCycleEvents.EVENT_LOWER;PopupGUIAdaptor.create=function(e)
{if(PopupGUIAdaptor.m_logger.isTrace())PopupGUIAdaptor.m_logger.trace("PopupGUIAdaptor.create");var a=new PopupGUIAdaptor();a._initialiseAdaptor(e);return a;}
PopupGUIAdaptor.prototype._initialiseAdaptor=function(e)
{AbstractPopupGUIAdaptor.prototype._initialiseAdaptor.call(this,e);}
PopupGUIAdaptor.prototype._show=function(showMe,currentFocussedAdaptorId)
{if(showMe)
{AbstractPopupGUIAdaptor.prototype._show.call(this,showMe,currentFocussedAdaptorId);var firstFocusAdaptorID=this.invokeFirstFocusedAdaptorId();Services.setFocus(firstFocusAdaptorID);}
else
{AbstractPopupGUIAdaptor.prototype._show.call(this,showMe);}}
PopupGUIAdaptor.prototype._isAdaptorChildOfPopup=function(adaptor)
{return(adaptor.m_element==this.m_element)||isParentOf(adaptor.m_element,this.m_element);}
function LOVPopupGUIAdaptor(){};LOVPopupGUIAdaptor.prototype=new PopupGUIAdaptor();GUIAdaptor._setUpProtocols("LOVPopupGUIAdaptor");GUIAdaptor._addProtocol('LOVPopupGUIAdaptor','LOVProtocol');LOVPopupGUIAdaptor.prototype.constructor=LOVPopupGUIAdaptor;LOVPopupGUIAdaptor.m_logger=new Category("LOVPopupGUIAdaptor");LOVPopupGUIAdaptor.EVENT_OK='ok';LOVPopupGUIAdaptor.EVENT_CANCEL='cancel';LOVPopupGUIAdaptor.TMP_DATA_BINDING='/ds/var/popup_temporary';LOVPopupGUIAdaptor.OK_ENABLED=LOVPopupGUIAdaptor.TMP_DATA_BINDING+'/ok';LOVPopupGUIAdaptor.CANCEL_ENABLED=LOVPopupGUIAdaptor.TMP_DATA_BINDING+'/cancel';LOVPopupGUIAdaptor.create=function(e)
{var a=new LOVPopupGUIAdaptor();a._initialiseAdaptor(e);return a;}
LOVPopupGUIAdaptor.prototype._initialiseAdaptor=function(e)
{PopupGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_isFiltered=this.m_renderer.m_isFiltered;}
LOVPopupGUIAdaptor.prototype._dispose=function()
{var cm=FormController.getInstance().getFormView().getConfigManager();var lovId=this.getId();cm.removeConfig(lovId+"_grid");cm.removeConfig(lovId+"_okButton");cm.removeConfig(lovId+"_cancelButton");PopupGUIAdaptor.prototype._dispose.call(this);}
LOVPopupGUIAdaptor.prototype._configure=function(cs)
{PopupGUIAdaptor.prototype._configure.call(this,cs);for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.tmpDataBinding&&this.tmpDataBinding==null)
{this.tmpDataBinding=c.tmpDataBinding;}
if(c.ok&&this.ok==null)
{this.ok=c.ok;}
if(c.cancel&&this.cancel==null)
{this.cancel=c.cancel;}}
var lovId=this.getId();if(this.tmpDataBinding==null)
{this.tmpDataBinding=LOVPopupGUIAdaptor.TMP_DATA_BINDING+'/'+lovId;}
var gridId=lovId+"_grid";window[gridId]={srcData:this.srcData,srcDataOn:this.srcDataOn,dataBinding:this.tmpDataBinding,rowXPath:this.rowXPath,columns:this.columns,keyXPath:this.keyXPath};var okButtonId=lovId+"_okButton";window[okButtonId]={inactiveWhilstHandlingEvent:false};var cancelButtonId=lovId+"_cancelButton";window[cancelButtonId]={inactiveWhilstHandlingEvent:false};if(this.m_isFiltered==true)
{gridId+="_filtered_grid";}
var okBusinessLifeCycle=new LOVPopupOKBusinessLifeCycle();okBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(okBusinessLifeCycle);var thisObj=this;okBusinessLifeCycle.configure({eventBinding:{singleClicks:[{element:okButtonId}],doubleClicks:[{element:gridId}],enableOn:[LOVPopupGUIAdaptor.OK_ENABLED+"/"+lovId],isEnabled:function(){return thisObj._isOkLifeCycleEnabled();}}});var cancelBusinessLifeCycle=new LOVPopupCancelBusinessLifeCycle();cancelBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(cancelBusinessLifeCycle);cancelBusinessLifeCycle.configure({eventBinding:{singleClicks:[{element:cancelButtonId}],keys:[{key:Key.F4,element:lovId}],enableOn:[LOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+lovId],isEnabled:function(){return thisObj._isCancelLifeCycleEnabled();}}});var okEventBinding=okBusinessLifeCycle.getEventBinding();var cancelEventBinding=cancelBusinessLifeCycle.getEventBinding();if(null!=okEventBinding)okEventBinding.start();if(null!=cancelEventBinding)cancelEventBinding.start();}
LOVPopupGUIAdaptor.prototype._onOk=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(LOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId(),'false');var db=this.dataBinding;var tmpDb=this.tmpDataBinding;var value=dm.getValue(tmpDb);dm.setValue(db,value);var thisObj=this;setTimeout(function(){thisObj._dispatchLowerEvent();},0);}
LOVPopupGUIAdaptor.prototype._onCancel=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(LOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId(),'false');var thisObj=this;setTimeout(function(){thisObj._dispatchLowerEvent();},0);}
LOVPopupGUIAdaptor.prototype._dispatchLowerEvent=function()
{var fc=FormController.getInstance();fc.dispatchBusinessLifeCycleEvent(this.getId(),PopupGUIAdaptor.EVENT_LOWER);}
LOVPopupGUIAdaptor.prototype._isOkLifeCycleEnabled=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();var v=dm.getValue(LOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId());return(v==null||v=='true')?true:false;}
LOVPopupGUIAdaptor.prototype._isCancelLifeCycleEnabled=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();var v=dm.getValue(LOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId());return(v==null||v=='true')?true:false;}
LOVPopupGUIAdaptor.prototype._show=function(showMe,currentFocussedAdaptorId)
{if(showMe)
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(LOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId(),'true');dm.setValue(LOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId(),'true');}
PopupGUIAdaptor.prototype._show.call(this,showMe,currentFocussedAdaptorId);}
function LOVPopupOKBusinessLifeCycle(){}
LOVPopupOKBusinessLifeCycle.prototype=new BusinessLifeCycle();LOVPopupOKBusinessLifeCycle.prototype.constructor=LOVPopupOKBusinessLifeCycle;LOVPopupOKBusinessLifeCycle.prototype.getName=function()
{return LOVPopupGUIAdaptor.EVENT_OK;}
LOVPopupOKBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_adaptor._onOk();}
function LOVPopupCancelBusinessLifeCycle(){}
LOVPopupCancelBusinessLifeCycle.prototype=new BusinessLifeCycle();LOVPopupCancelBusinessLifeCycle.prototype.constructor=LOVPopupCancelBusinessLifeCycle;LOVPopupCancelBusinessLifeCycle.prototype.getName=function()
{return LOVPopupGUIAdaptor.EVENT_CANCEL;}
LOVPopupCancelBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_adaptor._onCancel();}
function MultiLOVPopupGUIAdaptor(){};MultiLOVPopupGUIAdaptor.prototype=new PopupGUIAdaptor();GUIAdaptor._setUpProtocols("MultiLOVPopupGUIAdaptor");GUIAdaptor._addProtocol('MultiLOVPopupGUIAdaptor','LOVProtocol');MultiLOVPopupGUIAdaptor.prototype.constructor=MultiLOVPopupGUIAdaptor;MultiLOVPopupGUIAdaptor.EVENT_OK='ok';MultiLOVPopupGUIAdaptor.EVENT_CANCEL='cancel';MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING='/ds/var/popup_temporary';MultiLOVPopupGUIAdaptor.OK_ENABLED=MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING+'/ok';MultiLOVPopupGUIAdaptor.CANCEL_ENABLED=MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING+'/cancel';MultiLOVPopupGUIAdaptor.create=function(e,factory)
{var a=new MultiLOVPopupGUIAdaptor();a._initialiseAdaptor(e);factory.parseChildren(e);return a;}
MultiLOVPopupGUIAdaptor.prototype._initialiseAdaptor=function(e)
{PopupGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_isFiltered=this.m_renderer.m_isFiltered;}
MultiLOVPopupGUIAdaptor.prototype._dispose=function()
{var cm=FormController.getInstance().getFormView().getConfigManager();var lovId=this.getId();cm.removeConfig(lovId);cm.removeConfig(lovId+"_grid");cm.removeConfig(lovId+"_okButton");cm.removeConfig(lovId+"_cancelButton");PopupGUIAdaptor.prototype._dispose.call(this);}
MultiLOVPopupGUIAdaptor.prototype._configure=function(cs)
{PopupGUIAdaptor.prototype._configure.call(this,cs);for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.tmpDataBinding&&this.tmpDataBinding==null)
{this.tmpDataBinding=c.tmpDataBinding;}
if(c.ok&&this.ok==null)
{this.ok=c.ok;}
if(c.cancel&&this.cancel==null)
{this.cancel=c.cancel;}}
var lovId=this.getId();if(this.tmpDataBinding==null)
{this.tmpDataBinding=MultiLOVPopupGUIAdaptor.TMP_DATA_BINDING+'/'+lovId;}
var gridId=lovId+"_grid";window[gridId]={srcData:this.srcData,srcDataOn:this.srcDataOn,dataBinding:this.tmpDataBinding,rowXPath:this.rowXPath,columns:this.columns,keyXPath:this.keyXPath,multipleSelection:true};var okButtonId=lovId+"_okButton";window[okButtonId]={inactiveWhilstHandlingEvent:false};var cancelButtonId=lovId+"_cancelButton";window[cancelButtonId]={inactiveWhilstHandlingEvent:false};if(this.m_isFiltered==true)
{gridId+="_filtered_grid";}
var okBusinessLifeCycle=new MultiLOVPopupOKBusinessLifeCycle();okBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(okBusinessLifeCycle);var thisObj=this;okBusinessLifeCycle.configure({eventBinding:{singleClicks:[{element:okButtonId}],enableOn:[MultiLOVPopupGUIAdaptor.OK_ENABLED+"/"+lovId],isEnabled:function(){return thisObj._isOkLifeCycleEnabled();}}});var cancelBusinessLifeCycle=new MultiLOVPopupCancelBusinessLifeCycle();cancelBusinessLifeCycle.initialise(this);this.addBusinessLifeCycle(cancelBusinessLifeCycle);cancelBusinessLifeCycle.configure({eventBinding:{singleClicks:[{element:cancelButtonId}],keys:[{key:Key.F4,element:lovId}],enableOn:[MultiLOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+lovId],isEnabled:function(){return thisObj._isCancelLifeCycleEnabled();}}});var okEventBinding=okBusinessLifeCycle.getEventBinding();var cancelEventBinding=cancelBusinessLifeCycle.getEventBinding();if(null!=okEventBinding)okEventBinding.start();if(null!=cancelEventBinding)cancelEventBinding.start();}
MultiLOVPopupGUIAdaptor.prototype._onOk=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId(),'false');var db=this.dataBinding;var tmpDb=this.tmpDataBinding;var value=dm.getNode(tmpDb);dm.replaceNode(db,value);var thisObj=this;setTimeout(function(){thisObj._dispatchLowerEvent();},0);}
MultiLOVPopupGUIAdaptor.prototype._onCancel=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(MultiLOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId(),'false');var thisObj=this;setTimeout(function(){thisObj._dispatchLowerEvent();},0);}
MultiLOVPopupGUIAdaptor.prototype._dispatchLowerEvent=function()
{var fc=FormController.getInstance();fc.dispatchBusinessLifeCycleEvent(this.getId(),PopupGUIAdaptor.EVENT_LOWER);}
MultiLOVPopupGUIAdaptor.prototype._isOkLifeCycleEnabled=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();var v=dm.getValue(MultiLOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId());return(v==null||v=='true')?true:false;}
MultiLOVPopupGUIAdaptor.prototype._isCancelLifeCycleEnabled=function()
{var fc=FormController.getInstance();var dm=fc.getDataModel();var v=dm.getValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId());return(v==null||v=='true')?true:false;}
MultiLOVPopupGUIAdaptor.prototype._show=function(showMe,currentFocussedAdaptorId)
{if(showMe)
{var fc=FormController.getInstance();var dm=fc.getDataModel();dm.setValue(MultiLOVPopupGUIAdaptor.OK_ENABLED+"/"+this.getId(),'true');dm.setValue(MultiLOVPopupGUIAdaptor.CANCEL_ENABLED+"/"+this.getId(),'true');}
PopupGUIAdaptor.prototype._show.call(this,showMe,currentFocussedAdaptorId);}
function MultiLOVPopupOKBusinessLifeCycle(){}
MultiLOVPopupOKBusinessLifeCycle.prototype=new BusinessLifeCycle();MultiLOVPopupOKBusinessLifeCycle.prototype.constructor=MultiLOVPopupOKBusinessLifeCycle;MultiLOVPopupOKBusinessLifeCycle.prototype.getName=function()
{return MultiLOVPopupGUIAdaptor.EVENT_OK;}
MultiLOVPopupOKBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_adaptor._onOk();}
function MultiLOVPopupCancelBusinessLifeCycle(){}
MultiLOVPopupCancelBusinessLifeCycle.prototype=new BusinessLifeCycle();MultiLOVPopupCancelBusinessLifeCycle.prototype.constructor=MultiLOVPopupCancelBusinessLifeCycle;MultiLOVPopupCancelBusinessLifeCycle.prototype.getName=function()
{return MultiLOVPopupGUIAdaptor.EVENT_CANCEL;}
MultiLOVPopupCancelBusinessLifeCycle.prototype.invokeBusinessLifeCycle=function(e)
{this.m_adaptor._onCancel();}
function DateTextInputElementGUIAdaptor()
{}
DateTextInputElementGUIAdaptor.prototype=new TextInputElementGUIAdaptor();DateTextInputElementGUIAdaptor.prototype.validate=function(event)
{var mV=FormController.getInstance().getDataModel().getValue(this.dataBinding);return FWDateUtil.validateXSDDate(mV,this.weekends);}
DateTextInputElementGUIAdaptor.create=function(e)
{var a=new DateTextInputElementGUIAdaptor();a._initTextInputElementGUIAdaptor(e);return a;}
DateTextInputElementGUIAdaptor.prototype._configure=function(cs)
{for(var i=cs.length-1;i>=0;i--)
{var c=cs[i];if(null!=c.weekends&&null==this.weekends)
{this.weekends=c.weekends;}}
if(this.weekends==null)
{this.weekends="true";}
this.transformToModel=null;this.transformToDisplay=null;this.m_element.maxLength=DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH;}
DateTextInputElementGUIAdaptor.prototype._getValueFromView=function()
{var dateString=this.m_element.value;var d=FWDateUtil.parseDate(dateString);var ret=null;if(d!=null)
{ret=FWDateUtil.ConvertDateToXSDString(d);}
else
{ret=dateString;}
return ret;}
DateTextInputElementGUIAdaptor.prototype.renderState=function()
{var mV=FormController.getInstance().getDataModel().getValue(this.dataBinding);var dateObj=FWDateUtil.parseXSDDate(mV);if(dateObj!=null)
{this.m_value=FWDateUtil.ConvertDateToString(dateObj);}
else
{this.m_value=mV;}
TextInputElementGUIAdaptor.prototype.renderState.call(this);}
function AsyncMonitorGUIAdaptor(){};AsyncMonitorGUIAdaptor.m_logger=new Category("AsyncMonitorGUIAdaptor");AsyncMonitorGUIAdaptor.prototype=new HTMLElementGUIAdaptor();AsyncMonitorGUIAdaptor.prototype.constructor=AsyncMonitorGUIAdaptor;GUIAdaptor._setUpProtocols('AsyncMonitorGUIAdaptor');AsyncMonitorGUIAdaptor.prototype.idXPath="Id";AsyncMonitorGUIAdaptor.prototype.stateXPath="State";AsyncMonitorGUIAdaptor.prototype.timeRemainingXPath="Eta";AsyncMonitorGUIAdaptor.prototype.responseXPath="Response";AsyncMonitorGUIAdaptor.prototype.minTimeout=1000;AsyncMonitorGUIAdaptor.prototype.maxTimeout=10000;AsyncMonitorGUIAdaptor.prototype.isCreateNode=true;AsyncMonitorGUIAdaptor.prototype.onComplete=function(){}
AsyncMonitorGUIAdaptor.prototype.onCancel=function(){}
AsyncMonitorGUIAdaptor.prototype.onError=function(exception)
{Services.showAlert("Error: "+exception.message);}
AsyncMonitorGUIAdaptor.prototype.onCancelError=function(exception)
{Services.showAlert("Error: "+exception.message);}
AsyncMonitorGUIAdaptor.prototype.m_timeoutId=null;AsyncMonitorGUIAdaptor.prototype._dispose=function()
{if(AsyncMonitorGUIAdaptor.m_logger.isInfo())AsyncMonitorGUIAdaptor.m_logger.info("AsyncMonitorGUIAdaptor.dispose()");this.m_element.__renderer=null;this._clearTimer();}
AsyncMonitorGUIAdaptor.create=function(e)
{if(AsyncMonitorGUIAdaptor.m_logger.isInfo())AsyncMonitorGUIAdaptor.m_logger.info("AsyncMonitorGUIAdaptor.create()");var a=new AsyncMonitorGUIAdaptor();a._initAsyncMonitorGUIAdaptor(e);return a;}
AsyncMonitorGUIAdaptor.prototype._initAsyncMonitorGUIAdaptor=function(e)
{if(AsyncMonitorGUIAdaptor.m_logger.isInfo())AsyncMonitorGUIAdaptor.m_logger.info("AsyncMonitorGUIAdaptor._initAsyncMonitorGUIAdaptor()");this.m_element=e;}
AsyncMonitorGUIAdaptor.prototype._configure=function(cs)
{for(var i=0;i<cs.length;i++)
{var c=cs[i];this._setAttribute(c,"asyncStateService");this._setAttribute(c,"asyncCancelService");this._setAttribute(c,"srcData");this._setAttribute(c,"idXPath");this._setAttribute(c,"stateXPath");this._setAttribute(c,"timeRemainingXPath");this._setAttribute(c,"responseXPath");this._setAttribute(c,"onComplete");this._setAttribute(c,"onCancel");this._setAttribute(c,"onError");this._setAttribute(c,"onCancelError");}
if(this.asyncStateService==null)
{throw new ConfigurationException("asyncStateService is a required configuration parameter");}
if(this.asyncCancelService==null)
{throw new ConfigurationException("asyncCancelService is a required configuration parameter");}
var id=this.m_element.id;if(this.isCreateNode)
{var dom=XML.createDOM(null,null,null);var eAsync=dom.createElement("Async");var eId=dom.createElement("Id");eAsync.appendChild(eId);var eState=dom.createElement("State");XML.replaceNodeTextContent(eState,"5");eAsync.appendChild(eState);var eEta=dom.createElement("Eta");XML.replaceNodeTextContent(eEta,"0");eAsync.appendChild(eEta);var eResponse=dom.createElement("Response");eAsync.appendChild(eResponse);Services.replaceNode(this.srcData,eAsync);}
var thisObj=this;var stateCtor=function(){};window[id+"_state"]=stateCtor;stateCtor.dataBinding=this._getStateXPath();stateCtor.isReadOnly=function(){return true;};stateCtor.transformToDisplay=function()
{var result="";if(Services.hasValue(this.dataBinding))
{var stateStr=Services.getValue(this.dataBinding);var state=parseInt(stateStr);result=AsyncMonitorGUIAdaptor.AsyncState[state].name;}
return result;};var remainingCtor=function(){};window[id+"_remaining"]=remainingCtor;remainingCtor.dataBinding=this._getTimeRemainingXPath();remainingCtor.isReadOnly=function(){return true;};remainingCtor.transformToDisplay=function()
{var result="";if(Services.hasValue(this.dataBinding))
{var timeStr=Services.getValue(this.dataBinding);var time=parseFloat(timeStr)/1000;var mins=Math.floor(time/60);var secs=Math.round(time%60);result=mins+":"+((secs)>9?secs:"0"+secs);}
return result;};var cancelCtor=function(){};window[id+"_cancel"]=cancelCtor;cancelCtor.actionBinding=function()
{thisObj._cancel();}
this.logicOn=new Array(stateCtor.dataBinding);}
AsyncMonitorGUIAdaptor.prototype._setAttribute=function(config,name)
{if(config[name]!=null)
{this[name]=config[name];}}
AsyncMonitorGUIAdaptor.prototype.logic=function()
{var timeRemaining=this._getTimeRemaining();var state=this._getAsyncState();if(state.isPollable)
{var interval=this._getInterval(timeRemaining);var thisObj=this;this.m_timeoutId=window.setTimeout(function(){thisObj._poll();},interval);}
else
{this._clearTimer();if(state.isComplete)
{this.onComplete();}}}
AsyncMonitorGUIAdaptor.prototype._clearTimer=function()
{if(this.m_timeoutId!=null)
{window.clearTimeout(this.m_timeoutId);}
this.m_timeoutId=null;}
AsyncMonitorGUIAdaptor.prototype._getInterval=function(timeRemaining)
{return Math.round(Math.min(this.maxTimeout,Math.max(this.minTimeout,timeRemaining/3)));}
AsyncMonitorGUIAdaptor.prototype._poll=function()
{var state=this._getAsyncState();if(state.isPollable)
{var thisObj=this;var params=new ServiceParams();params.addSimpleParameter("RequestId",this._getRequestId());var handler=new Object();handler.onSuccess=function(dom)
{Services.replaceNode(thisObj.srcData,dom);};handler.onError=this.onError;Services.callService(this.asyncStateService,params,handler,true,false);}}
AsyncMonitorGUIAdaptor.prototype._cancel=function()
{Services.setValue(this._getStateXPath(),AsyncMonitorGUIAdaptor.CANCELLED_STATE);var params=new ServiceParams();params.addSimpleParameter("RequestId",this._getRequestId());var handler=new Object();var thisObj=this;handler.onSuccess=function(dom){thisObj.onCancel();};handler.onError=this.onCancelError;Services.callService(this.asyncCancelService,params,handler);}
AsyncMonitorGUIAdaptor.prototype._getStateXPath=function()
{return this.srcData+"/"+this.stateXPath;}
AsyncMonitorGUIAdaptor.prototype._getTimeRemainingXPath=function()
{return this.srcData+"/"+this.timeRemainingXPath;}
AsyncMonitorGUIAdaptor.prototype._getAsyncState=function()
{var stateStr=Services.getValue(this._getStateXPath());var state=parseInt(stateStr);return AsyncMonitorGUIAdaptor.AsyncState[state];}
AsyncMonitorGUIAdaptor.prototype._getTimeRemaining=function()
{var timeStr=Services.getValue(this._getTimeRemainingXPath());return parseInt(timeStr);}
AsyncMonitorGUIAdaptor.prototype._getRequestId=function()
{var path=this.srcData+"/"+this.idXPath;return Services.getValue(path);}
AsyncMonitorGUIAdaptor.prototype.renderState=function(){}
AsyncMonitorGUIAdaptor.COMPLETED_STATE=0;AsyncMonitorGUIAdaptor.QUEUED_STATE=1;AsyncMonitorGUIAdaptor.PROCESSING_STATE=2;AsyncMonitorGUIAdaptor.ERROR_STATE=3;AsyncMonitorGUIAdaptor.CANCELLED_STATE=4;AsyncMonitorGUIAdaptor.AsyncState=new Array({name:"Completed",isPollable:false,isViewable:true,isComplete:true},{name:"Queued",isPollable:true,isViewable:false,isComplete:false},{name:"Processing",isPollable:true,isViewable:false,isComplete:false},{name:"Error",isPollable:false,isViewable:false,isComplete:false},{name:"Cancelled",isPollable:false,isViewable:false,isComplete:false},{name:"N/A",isPollable:false,isViewable:false,isComplete:false});function AsyncMonitorRenderer(){};AsyncMonitorRenderer.prototype=new Renderer();AsyncMonitorRenderer.prototype.constructor=AsyncMonitorRenderer;AsyncMonitorRenderer.m_logger=new Category("AsyncMonitorRenderer");AsyncMonitorRenderer.CSS_CLASS_NAME="asyncMonitor";AsyncMonitorRenderer.createInline=function(id,isHideable)
{var e=Renderer.createInline(id,false);return AsyncMonitorRenderer._create(e,isHideable);}
AsyncMonitorRenderer.createAsInnerHTML=function(refElement,relativePos,id,isHideable)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return AsyncMonitorRenderer._create(e,isHideable);}
AsyncMonitorRenderer.createAsChild=function(p,id,isHideable)
{var e=Renderer.createAsChild(id);p.appendChild(e);return AsyncMonitorRenderer._create(e,isHideable);}
AsyncMonitorRenderer._create=function(e,isHideable)
{e.className=AsyncMonitorRenderer.CSS_CLASS_NAME;var am=new AsyncMonitorRenderer();am._initRenderer(e);var id=e.id;var statusId=id+"_state";var remainingId=id+"_remaining";var viewId=id+"_view";var hideId=id+"_hide";var cancelId=id+"_cancel";var amTable=document.createElement("table");e.appendChild(amTable);var amTBody=document.createElement("tbody");amTable.appendChild(amTBody);var amNorthTr=document.createElement("tr");amTBody.appendChild(amNorthTr);var amNorthTd=document.createElement("td");amNorthTr.appendChild(amNorthTd);var amNorthTable=document.createElement("table");amNorthTd.appendChild(amNorthTable);var amNorthTBody=document.createElement("tbody");amNorthTable.appendChild(amNorthTBody);var amStateTr=document.createElement("tr");amNorthTBody.appendChild(amStateTr);var amStateLabelTd=document.createElement("td");amStateTr.appendChild(amStateLabelTd);var amStateLabel=document.createElement("label");amStateLabel.setAttribute("for",statusId);amStateLabel.innerHTML="Status";amStateLabelTd.appendChild(amStateLabel);var amStateInputTd=document.createElement("td");amStateTr.appendChild(amStateInputTd);var amStateInput=document.createElement("input");amStateInput.setAttribute("id",statusId);amStateInput.setAttribute("type","text");amStateInput.setAttribute("size","10");amStateInputTd.appendChild(amStateInput);var amRemainingTr=document.createElement("tr");amNorthTBody.appendChild(amRemainingTr);var amRemainingLabelTd=document.createElement("td");amRemainingTr.appendChild(amRemainingLabelTd);var amRemainingLabel=document.createElement("label");amRemainingLabel.setAttribute("for",remainingId);amRemainingLabel.innerHTML="Time Remaining";amRemainingLabelTd.appendChild(amRemainingLabel);var amRemainingInputTd=document.createElement("td");amRemainingTr.appendChild(amRemainingInputTd);var amRemainingInput=document.createElement("input");amRemainingInput.setAttribute("id",remainingId);amRemainingInput.setAttribute("type","text");amRemainingInput.setAttribute("size","10");amRemainingInputTd.appendChild(amRemainingInput);var amSouthTr=document.createElement("tr");amTBody.appendChild(amSouthTr);var amSouthTd=document.createElement("td");amSouthTd.align="center";amSouthTr.appendChild(amSouthTd);var amSouthTable=document.createElement("table");amSouthTd.appendChild(amSouthTable);var amSouthTBody=document.createElement("tbody");amSouthTable.appendChild(amSouthTBody);var amButtonTr=document.createElement("tr");amSouthTBody.appendChild(amButtonTr);var amCancelButtonTd=document.createElement("td");amCancelButtonTd.align="center";amButtonTr.appendChild(amCancelButtonTd);var amCancelButton=document.createElement("input");amCancelButton.setAttribute("id",cancelId);amCancelButton.setAttribute("type","button");amCancelButton.setAttribute("value","Cancel");amCancelButtonTd.appendChild(amCancelButton);}
switch(navigator.appName)
{case"Netscape":{MenuBarRenderer.isIE=false;MenuBarRenderer.isMoz=true;break;}
case"Microsoft Internet Explorer":{MenuBarRenderer.isIE=true;MenuBarRenderer.isMoz=false;break;}
default:{alert("Unknown browser type");break;}}
function MenuBarRenderer()
{}
MenuBarRenderer.prototype=new Renderer();MenuBarRenderer.prototype.constructor=MenuBarRenderer;MenuBarRenderer.MENU_BASE_DIV="MenuBaseDiv";MenuBarRenderer.MENU_BAR_DIV="MenuBarDiv";MenuBarRenderer.MENU_PANEL_DIV="MenuPanelDiv";MenuBarRenderer.MENU_BAR_BUTTON_DIV="MenuBarButtonDiv";MenuBarRenderer.DEFAULT_MENUBAR_ID="menubar";MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX="_navigationmenu";MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX="_quicklinksmenu";MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON="_quicklinkhiddenbutton";MenuBarRenderer.m_logger=new Category("MenuBarRenderer");MenuBarRenderer.prototype.m_menuBar=null;MenuBarRenderer.prototype.m_navigationMenu=null;MenuBarRenderer.prototype.m_quickLinkButtons=null;MenuBarRenderer.prototype.m_quickLinksMenu=null;MenuBarRenderer.createInline=function(id)
{if(id==null||id=="")
{id=MenuBarRenderer.DEFAULT_MENUBAR_ID;}
var e=Renderer.createInline(id,false);return MenuBarRenderer._create(e);}
MenuBarRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{if(id==null||id=="")
{id=MenuBarRenderer.DEFAULT_MENUBAR_ID;}
var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return MenuBarRenderer._create(e);}
MenuBarRenderer.createAsChild=function(p,id)
{if(id==null||id=="")
{id=MenuBarRenderer.DEFAULT_MENUBAR_ID;}
var e=Renderer.createAsChild(id);p.appendChild(e);return MenuBarRenderer._create(e);}
MenuBarRenderer._create=function(element)
{if(MenuBarRenderer.m_logger.isError())MenuBarRenderer.m_logger.error("Creating MenuBarRenderer");element.className=MenuBarRenderer.MENU_BASE_DIV;var mbr=new MenuBarRenderer();mbr._initRenderer(element);mbr.m_menuBar=document.createElement("div");mbr.m_menuBar.className=MenuBarRenderer.MENU_BAR_DIV;element.appendChild(mbr.m_menuBar);mbr.m_navigationMenu=null;mbr.m_quickLinksContainer=document.createElement("div");mbr.m_quickLinksContainer.className=MenuBarRenderer.MENU_BAR_BUTTON_DIV;mbr.m_menuBar.appendChild(mbr.m_quickLinksContainer);var button=document.createElement("input");button.id=element.id+MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON;button.type="button";button.style.width="0px";button.style.visibility="hidden";mbr.m_quickLinksContainer.appendChild(button);preventSelection(element);return mbr;}
MenuBarRenderer.prototype._dispose=function()
{unPreventSelection(this.m_element);this.m_quickLinksMenu=null;this.m_quickLinkButtons=null;this.m_navigationMenu=null;this.m_menuBar=null;this.m_element.__renderer=null;this.m_element=null;}
MenuBarRenderer.prototype.renderNavigationMenuButton=function(navigationButtonLabel)
{var navigationMenuId=this.m_element.id+MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX;if(null==navigationButtonLabel)
{navigationButtonLabel="Menu";}
this.m_navigationMenu=MenuRenderer.createAsInnerHTML(this.m_quickLinksContainer,Renderer.BEFORE_ELEMENT,navigationMenuId,navigationButtonLabel,true,MenuDataSourceFactory.NAVIGATION_MENU,true);}
MenuBarRenderer.prototype.renderQuickLinks=function(quickLinkButtons,quickLinkMenuItems,quickLinkMenuButtonLabel)
{var quickLinkButtonsLength=quickLinkButtons.length;var quicklinkMenuItemsLength=quickLinkMenuItems.length;if(quickLinkButtonsLength>0)
{var i;var button;var quickLinkButton;this.m_quickLinksButtons=new Array();for(i=0;i<quickLinkButtonsLength;i++)
{quickLinkButton=quickLinkButtons[i];button=document.createElement("input");button.type="button";button.id=quickLinkButton.id;button.value=quickLinkButton.label;this.m_quickLinksContainer.appendChild(button);this.m_quickLinksButtons[quickLinkButton.id]=button;}}
if(quicklinkMenuItemsLength>0)
{var quickLinksMenuId=this.m_element.id+MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX;if(null==quickLinkMenuButtonLabel)
{quickLinkMenuButtonLabel=">>";}
this.m_quickLinksMenu=MenuRenderer.createAsInnerHTML(this.m_quickLinksContainer,Renderer.AFTER_ELEMENT,quickLinksMenuId,quickLinkMenuButtonLabel,false,MenuDataSourceFactory.QUICK_LINK_MENU,false);}}
switch(navigator.appName)
{case"Netscape":{MenuRenderer.isIE=false;MenuRenderer.isMoz=true;break;}
case"Microsoft Internet Explorer":{MenuRenderer.isIE=true;MenuRenderer.isMoz=false;break;}
default:{alert("Unknown browser type");break;}}
function MenuRenderer()
{}
MenuRenderer.prototype=new Renderer();MenuRenderer.prototype.constructor=MenuRenderer;MenuRenderer.m_logger=new Category("MenuRenderer");MenuRenderer.MENU_BAR_BUTTON="MenuBarButton";MenuRenderer.MENU_BAR_BUTTON_INSET="MenuBarButton MenuBarButtonInset";MenuRenderer.MENU_BAR_BUTTON_OUTSET="MenuBarButton MenuBarButtonOutset";MenuRenderer.MENU_BAR_BUTTON_ACTIVE="MenuBarButtonActive";MenuRenderer.MENU_BAR_BUTTON_INACTIVE="MenuBarButtonInactive";MenuRenderer.prototype.m_baseMenuPanel=null;MenuRenderer.prototype.m_menuDataSourceId=null;MenuRenderer.prototype.m_menuOptionMouseOverHandler=null;MenuRenderer.prototype.m_menuOptionMouseOutHandler=null;MenuRenderer.prototype.m_menuOptionMouseDownHandler=null;MenuRenderer.prototype.m_hasMouseCapture=false;MenuRenderer.prototype.m_mouseCaptureLost=false;MenuRenderer.prototype.m_clickOnMenuPanelItem=null;MenuRenderer.prototype.m_lastClickEventSrcElement=null;MenuRenderer.prototype.m_clickOnMenuPanelId=null;MenuRenderer.prototype.m_clickOnMenuPanelItemPos=null;MenuRenderer.prototype.m_clickEventKey=null;MenuRenderer.prototype.m_menuOptionMouseOver_callbackList=null;MenuRenderer.prototype.m_menuOptionMouseOut_callbackList=null;MenuRenderer.prototype.m_menuOptionMouseDown_callbackList=null;MenuRenderer.prototype.m_menuPanelItemMouseOver_callbackList=null;MenuRenderer.prototype.m_menuPanelMouseOut_callbackList=null;MenuRenderer.prototype.m_checkEnabledActionComponent_callbackList=null;MenuRenderer.prototype.m_menuPanelItemMouseClick_callbackList=null;MenuRenderer.prototype.m_menuPanelLookup=null;MenuRenderer.prototype.m_baseMenuPanelLeftAlign=null;MenuRenderer.prototype.m_includeCoreMenuPanelItems=null;MenuRenderer.createAsInnerHTML=function(refElement,relativePos,id,label,baseMenuPanelLeftAlign,menuDataSourceId,includeCoreMenuPanelItems)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,true);return MenuRenderer._create(e,label,baseMenuPanelLeftAlign,menuDataSourceId,includeCoreMenuPanelItems);}
MenuRenderer._create=function(e,label,baseMenuPanelLeftAlign,menuDataSourceId,includeCoreMenuPanelItems)
{e.className=MenuRenderer.MENU_BAR_BUTTON;e.innerHTML=label;preventSelection(e);var mr=new MenuRenderer();mr._initRenderer(e);if(null!=baseMenuPanelLeftAlign)
{mr.m_baseMenuPanelLeftAlign=baseMenuPanelLeftAlign;}
else
{mr.m_baseMenuPanelLeftAlign=true;}
mr.m_menuDataSourceId=menuDataSourceId;if(true==includeCoreMenuPanelItems)
{mr.m_includeCoreMenuPanelItems=true;}
else
{mr.m_includeCoreMenuPanelItems=false;}
mr.m_menuOptionMouseOver_callbackList=new CallbackList();mr.m_menuOptionMouseOut_callbackList=new CallbackList();mr.m_menuOptionMouseDown_callbackList=new CallbackList();mr.m_menuPanelItemMouseOver_callbackList=new CallbackList();mr.m_menuPanelMouseOut_callbackList=new CallbackList();mr.m_checkEnabledActionComponent_callbackList=new CallbackList();mr.m_menuPanelItemMouseClick_callbackList=new CallbackList();return mr;}
MenuRenderer.prototype._dispose=function()
{unPreventSelection(this.m_element);for(var i in this.m_menuPanelLookup)
{this.m_menuPanelLookup[i]._dispose();}
this.stopMenuEventHandlers();this.m_menuOptionMouseOver_callbackList.dispose();this.m_menuOptionMouseOut_callbackList.dispose();this.m_menuOptionMouseDown_callbackList.dispose();this.m_menuPanelItemMouseOver_callbackList.dispose();this.m_menuPanelMouseOut_callbackList.dispose();this.m_checkEnabledActionComponent_callbackList.dispose();this.m_menuPanelItemMouseClick_callbackList.dispose();this.m_baseMenuPanel=null;this.m_menuPanelLookup=null;this.m_element.__renderer=null;this.m_element=null;}
MenuRenderer.prototype.renderBaseMenuPanel=function(menuPanelId,baseMenuPanelItems)
{this.m_menuPanelLookup=new Array();var baseMenuPanel=MenuPanelRenderer.createAsChild(this.m_element,this,menuPanelId,baseMenuPanelItems);this.m_baseMenuPanel=baseMenuPanel;this.m_menuPanelLookup[menuPanelId]=baseMenuPanel;var left=0;var top=this.m_element.offsetHeight;if(this.m_baseMenuPanelLeftAlign)
{left=this.m_element.offsetLeft;}
else
{if(MenuRenderer.isIE)
{var baseMenuStyle=getCalculatedStyle(baseMenuPanel.m_element);var baseMenuWidth=baseMenuPanel.m_element.offsetWidth+
parseInt(baseMenuStyle.borderLeftWidth)+
parseInt(baseMenuStyle.borderRightWidth);left=this.m_element.offsetLeft+(this.m_element.offsetWidth-baseMenuWidth);}
else if(MenuRenderer.isMoz)
{left=this.m_element.offsetLeft+(this.m_element.offsetWidth-baseMenuPanel.m_element.offsetWidth);}}
baseMenuPanel.setPosition(left,top);}
MenuRenderer.prototype.renderExtensionMenuPanel=function(parentMenuPanelId,parentMenuItemPos,menuPanelId,menuPanelItems)
{var parentMenuPanel=this.m_menuPanelLookup[parentMenuPanelId];var parentMenuItem=parentMenuPanel.getMenuPanelItem(parentMenuItemPos);var menuPanel=MenuPanelRenderer.createAsChild(parentMenuItem,this,menuPanelId,menuPanelItems);this.m_menuPanelLookup[menuPanelId]=menuPanel;var left;var top;if(MenuRenderer.isIE)
{var paddingLeft=parentMenuItem.currentStyle.paddingLeft;left=parentMenuItem.offsetWidth-parseInt(paddingLeft);left=left-4;var paddingTop=parentMenuItem.currentStyle.paddingTop;top=-parseInt(paddingTop);}
else if(MenuRenderer.isMoz)
{left=parentMenuItem.offsetWidth;var menuPanelStyle=getCalculatedStyle(menuPanel.m_element);top=-parseInt(menuPanelStyle.borderTopWidth);}
menuPanel.setPosition(left,top);}
MenuRenderer.prototype.renderMenuOption=function(className)
{this.m_element.className=className;}
MenuRenderer.prototype.showMenuPanel=function(menuPanelId)
{var menuPanelRenderer=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanelRenderer)
{menuPanelRenderer.show();}}
MenuRenderer.prototype.hideMenuPanel=function(menuPanelId)
{var menuPanelRenderer=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanelRenderer)
{menuPanelRenderer.hide();}}
MenuRenderer.prototype.registerMenuOptionMouseOverHandler=function(callbackListMethod)
{this.m_menuOptionMouseOver_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerMenuOptionMouseOutHandler=function(callbackListMethod)
{this.m_menuOptionMouseOut_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerMenuOptionMouseDownHandler=function(callbackListMethod)
{this.m_menuOptionMouseDown_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerMenuPanelItemMouseOverHandler=function(callbackListMethod)
{this.m_menuPanelItemMouseOver_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerMenuPanelMouseOutHandler=function(callbackListMethod)
{this.m_menuPanelMouseOut_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerCheckEnabledActionComponent=function(callbackListMethod)
{this.m_checkEnabledActionComponent_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype.registerMenuPanelItemMouseClickHandler=function(callbackListMethod)
{this.m_menuPanelItemMouseClick_callbackList.addCallback(callbackListMethod);}
MenuRenderer.prototype._handleMenuOptionMouseOver=function(evt)
{evt=(evt)?evt:((event)?event:null);var targetElement=SUPSEvent.getTargetElement(evt);if(targetElement.id==this.m_element.id)
{this.m_menuOptionMouseOver_callbackList.invoke(evt);}}
MenuRenderer.prototype._handleMenuOptionMouseOut=function(evt)
{evt=(evt)?evt:((event)?event:null);var targetElement=SUPSEvent.getTargetElement(evt);if(targetElement.id==this.m_element.id)
{this.m_menuOptionMouseOut_callbackList.invoke(evt);}}
MenuRenderer.prototype._handleMenuOptionMouseDown=function(evt)
{evt=(evt)?evt:((event)?event:null);var targetElement=SUPSEvent.getTargetElement(evt);if(null!=targetElement)
{if(targetElement.id==this.m_element.id)
{if(!this.m_hasMouseCapture)
{if(MenuRenderer.isIE)
{if(!this.m_mouseCaptureLost)
{this._captureMouseEvents();this.m_menuOptionMouseDown_callbackList.invoke(null);}
SUPSEvent.stopPropagation(evt);}
else if(MenuRenderer.isMoz)
{this._captureMouseEvents();this.m_menuOptionMouseDown_callbackList.invoke(null);}}
else
{if(MenuRenderer.isIE)
{this._handleClickIE();}}}}
if(MenuRenderer.isIE)
{this.m_mouseCaptureLost=false;}}
MenuRenderer.prototype.startMenuEventHandlers=function()
{this._startMenuButtonEventHandlers();}
MenuRenderer.prototype._startMenuButtonEventHandlers=function()
{var thisObj=this;if(null==this.m_menuOptionMouseOverHandler)
{this.m_menuOptionMouseOverHandler=SUPSEvent.addEventHandler(this.m_element,"mouseover",function(evt){return thisObj._handleMenuOptionMouseOver(evt);});}
if(null==this.m_menuOptionMouseOutHandler)
{this.m_menuOptionMouseOutHandler=SUPSEvent.addEventHandler(this.m_element,"mouseout",function(evt){return thisObj._handleMenuOptionMouseOut(evt);});}
if(null==this.m_menuOptionMouseDownHandler)
{this.m_menuOptionMouseDownHandler=SUPSEvent.addEventHandler(this.m_element,"click",function(evt){return thisObj._handleMenuOptionMouseDown(evt);});}}
MenuRenderer.prototype.stopMenuEventHandlers=function()
{this._stopMenuButtonEventHandlers();}
MenuRenderer.prototype._stopMenuButtonEventHandlers=function()
{if(null!=this.m_menuOptionMouseOverHandler)
{SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseOverHandler);this.m_menuOptionMouseOverHandler=null;}
if(null!=this.m_menuOptionMouseOutHandler)
{SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseOutHandler);this.m_menuOptionMouseOutHandler=null;}
if(null!=this.m_menuOptionMouseDownHandler)
{SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseDownHandler);this.m_menuOptionMouseDownHandler=null;}}
MenuRenderer.prototype.handleMenuPanelItemMouseOver=function(menuPanelId,menuItemPos)
{this.m_menuPanelItemMouseOver_callbackList.invoke(menuPanelId,menuItemPos);}
MenuRenderer.prototype.handleMenuPanelMouseOut=function(menuPanelId,targetMenuPanelId)
{this.m_menuPanelMouseOut_callbackList.invoke(menuPanelId,targetMenuPanelId);}
MenuRenderer.prototype._checkEnabledActionComponent=function(menuPanelId,menuPanelItemPos)
{return this.m_checkEnabledActionComponent_callbackList.invokeSelectedCallbackMethod(0,menuPanelId,menuPanelItemPos);}
MenuRenderer.prototype._handleMenuPanelItemMouseClick=function(menuPanelId,menuPanelItemPos)
{this.m_menuPanelItemMouseClick_callbackList.invoke(menuPanelId,menuPanelItemPos);}
MenuRenderer.prototype.handleKeyReturn=function(menuPanelId,menuPanelItemPos)
{if(MenuRenderer.isIE)
{this._handleKeyReturnIE(menuPanelId,menuPanelItemPos);}
else if(MenuRenderer.isMoz)
{this._handleKeyReturnMoz(menuPanelId,menuPanelItemPos);}}
MenuRenderer.prototype._handleKeyReturnMoz=function(menuPanelId,menuPanelItemPos)
{this.removeMouseEventCapture();this.m_menuOptionMouseDown_callbackList.invoke(null);this._handleMenuPanelItemMouseClick(menuPanelId,menuPanelItemPos);}
MenuRenderer.prototype._handleKeyReturnIE=function(menuPanelId,menuPanelItemPos)
{this.m_clickOnMenuPanelItem=true;this.m_clickOnMenuPanelId=menuPanelId;this.m_clickOnMenuPanelItemPos=menuPanelItemPos;this.m_element.releaseCapture();}
MenuRenderer.prototype._captureMouseEvents=function()
{var thisObj=this;var container=this.m_element;if(container.attachEvent)
{if(null==this.m_clickEventKey)
{container.setCapture(false);this.m_clickEventKey=SUPSEvent.addEventHandler(container,"click",function(){thisObj._handleClickIE();},false);container.onlosecapture=function(){thisObj._captureLostIE(container);return false;};this.m_hasMouseCapture=true;}}
else if(container.addEventListener)
{if(null==this.m_clickEventKey)
{this.m_clickEventKey=SUPSEvent.addEventHandler(window,"click",function(evt){thisObj._handleClickMoz(evt);},true);this.m_hasMouseCapture=true;}}}
MenuRenderer.prototype._handleClickMoz=function(evt)
{var e=evt.target;var menuPanelId=this._clickInsideMenuPanel(e);if(null!=menuPanelId)
{var cellElement=this._getCellElement(e);if(null!=cellElement)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{var menuPanelItemPos=menuPanel.getMenuPanelItemPosFromId(cellElement.id);if(null!=menuPanelItemPos)
{if(this._checkEnabledActionComponent(menuPanelId,menuPanelItemPos))
{if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;this.m_hasMouseCapture=false;}
this.m_menuOptionMouseDown_callbackList.invoke(null);this._handleMenuPanelItemMouseClick(menuPanelId,menuPanelItemPos);}}}}}
else
{if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;this.m_hasMouseCapture=false;}
var clickInsideMenuOption=false;if(e.id==this.m_element.id)
{clickInsideMenuOption=true;SUPSEvent.stopPropagation(evt);}
this.m_menuOptionMouseDown_callbackList.invoke(null);}}
MenuRenderer.prototype._handleClickIE=function()
{var event=window.event;var e=event.srcElement;var menuPanelId=this._clickInsideMenuPanel(e);if(null!=menuPanelId)
{var cellElement=this._getCellElement(e);if(null!=cellElement)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{var menuPanelItemPos=menuPanel.getMenuPanelItemPosFromId(cellElement.id);if(null!=menuPanelItemPos)
{if(this._checkEnabledActionComponent(menuPanelId,menuPanelItemPos))
{this.m_clickOnMenuPanelItem=true;this.m_clickOnMenuPanelId=menuPanelId;this.m_clickOnMenuPanelItemPos=menuPanelItemPos;this.m_element.releaseCapture();}}}}}
else
{this.m_clickOnMenuPanelItem=false;this.m_lastClickEventSrcElement=e;this.m_element.releaseCapture();}}
MenuRenderer.prototype._captureLostIE=function()
{if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;this.m_hasMouseCapture=false;}
if(null!=this.m_clickOnMenuPanelItem)
{if(!this.m_clickOnMenuPanelItem)
{var clickInsideMenuOption=false;if(null!=this.m_lastClickEventSrcElement)
{if(this.m_lastClickEventSrcElement.id==this.m_element.id)
{clickInsideMenuOption=true;this.m_mouseCaptureLost=true;}
this.m_lastClickEventSrcElement=null;}
else
{clickInsideMenuOption=null;}
this.m_menuOptionMouseDown_callbackList.invoke(null);}
else if(this.m_clickOnMenuPanelItem)
{this.m_menuOptionMouseDown_callbackList.invoke(null);this._handleMenuPanelItemMouseClick(this.m_clickOnMenuPanelId,this.m_clickOnMenuPanelItemPos);this.m_clickOnMenuPanelId=null;this.m_clickOnMenuPanelItemPos=null;}
this.m_clickOnMenuPanelItem=null;}
else
{this.m_menuOptionMouseDown_callbackList.invoke(null);}
this.m_element.onlosecapture=null;}
MenuRenderer.prototype.removeMouseEventCapture=function()
{if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);this.m_clickEventKey=null;this.m_hasMouseCapture=false;}}
MenuRenderer.prototype._clickInsideMenuPanel=function(targetElement)
{var menuPanelId=null;var exceptionOccurred=false;try
{if(targetElement.className==MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
{menuPanelId=targetElement.id;}}
catch(ex)
{exceptionOccurred=true;}
if(!exceptionOccurred)
{if(null==menuPanelId)
{menuPanelId=MenuPanelRenderer.getParentMenuPanelId(targetElement);}}
return menuPanelId;}
MenuRenderer.prototype._getCellElement=function(targetElement)
{var cellElement=null;if(targetElement.tagName==MenuPanelRenderer.CELL_TAG_NAME)
{cellElement=targetElement;}
else if(targetElement.tagName==MenuPanelRenderer.DIV_TAG_NAME)
{var parentElement=targetElement.parentNode;if(parentElement.tagName==MenuPanelRenderer.CELL_TAG_NAME)
{cellElement=parentElement;}}
return cellElement;}
MenuRenderer.prototype.setMenuPanelItemClass=function(menuPanelId,menuItemPos,className)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{menuPanel.setMenuPanelItemClass(menuItemPos,className);}}
MenuRenderer.prototype.handleLostFocusWhilstDisplayed=function()
{if(MenuRenderer.isIE)
{this._handleLostFocusWhilstDisplayedIE();}
else if(MenuRenderer.isMoz)
{this._handleLostFocusWhilstDisplayedMoz();}}
MenuRenderer.prototype._handleLostFocusWhilstDisplayedMoz=function()
{if(null!=this.m_clickEventKey)
{SUPSEvent.removeEventHandlerKey(this.m_clickEventKey)
this.m_clickEventKey=null;this.m_hasMouseCapture=false;}
this.m_menuOptionMouseDown_callbackList.invoke(null);}
MenuRenderer.prototype._handleLostFocusWhilstDisplayedIE=function()
{this.m_clickOnMenuPanelItem=false;this.m_lastClickEventSrcElement=null;this.m_element.releaseCapture();}
function MenuPanelRenderer(){}
MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS="MenuPanelDiv";MenuPanelRenderer.MENU_ITEM_CELL="menuItemCell";MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW_CSS_CLASS="DivisionsAboveAndBelow";MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS="divisionAbove";MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS="divisionBelow";MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS_CSS_CLASS="NoDivisions";MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS=0;MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE=1;MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW=2;MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW=3;MenuPanelRenderer.CELL_TAG_NAME="TD";MenuPanelRenderer.DIV_TAG_NAME="DIV";MenuPanelRenderer.m_logger=new Category("MenuPanelRenderer");MenuPanelRenderer.prototype.m_element=null;MenuPanelRenderer.prototype.m_menuRenderer=null;MenuPanelRenderer.prototype.m_menuPanelMouseOverHandler=null;MenuPanelRenderer.prototype.m_menuPanelMouseOutHandler=null;MenuPanelRenderer.prototype.m_popupLayer=null;MenuPanelRenderer.prototype.m_menuPanelItemPosLookup=null;MenuPanelRenderer.prototype.m_menuPanelItemElements=null;MenuPanelRenderer.prototype.m_menuPanelItemDivStatus=null;MenuPanelRenderer.createAsChild=function(parentElement,menuRenderer,menuPanelId,menuPanelItems)
{var menuPanelDiv=document.createElement("div");var menuPanelRenderer=MenuPanelRenderer._createMenuPanel(menuPanelDiv,menuRenderer,menuPanelId,menuPanelItems);parentElement.appendChild(menuPanelRenderer.m_element);return menuPanelRenderer;}
MenuPanelRenderer._createMenuPanel=function(menuPanelDiv,menuRenderer,menuPanelId,menuPanelItems)
{var mpr=new MenuPanelRenderer();mpr.m_element=menuPanelDiv;mpr.m_element.id=menuPanelId;mpr.m_element.className=MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS;mpr.m_menuRenderer=menuRenderer;mpr.m_menuPanelItemPosLookup=new Array();mpr.m_menuPanelItemElements=new Array();mpr.m_menuPanelItemDivStatus=new Array();var table=document.createElement("table");mpr.m_element.appendChild(table);table.cellPadding="0";table.cellSpacing="0";var tbody=document.createElement("tbody");table.appendChild(tbody);var row=null;var cell=null;var innerDiv=null;var menuPanelItem=null;var divisionAbove=null;var divisionBelow=null;var length=menuPanelItems.length;var menuItemPos=0;for(var i=0;i<length;i++)
{menuPanelItem=menuPanelItems[i];if(menuPanelItem.m_type!=MenuPanelItem.DIVISION)
{row=document.createElement("tr");tbody.appendChild(row);cell=document.createElement("td");row.appendChild(cell);innerDiv=document.createElement("div");cell.appendChild(innerDiv);cell.id=menuPanelItem.m_id;cell.className=MenuPanelRenderer.MENU_ITEM_CELL;innerDiv.className=menuPanelItem.m_class;divisionAbove=false;divisionBelow=false;if(i-1>0)
{if(menuPanelItems[i-1].m_type==MenuPanelItem.DIVISION)
{divisionAbove=true;}}
if(i+1<length-1)
{if(menuPanelItems[i+1].m_type==MenuPanelItem.DIVISION)
{divisionBelow=true;}}
if(divisionAbove==true&&divisionBelow==true)
{cell.className+=" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS+" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;innerDiv.className+=" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS+" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;mpr.m_menuPanelItemDivStatus[menuItemPos]=MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW;}
else if(divisionAbove==true&&divisionBelow==false)
{cell.className+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;innerDiv.className+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;mpr.m_menuPanelItemDivStatus[menuItemPos]=MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE;}
else if(divisionAbove==false&&divisionBelow==true)
{cell.className+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;innerDiv.className+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;mpr.m_menuPanelItemDivStatus[menuItemPos]=MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW;}
else
{mpr.m_menuPanelItemDivStatus[menuItemPos]=MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS;}
innerDiv.innerHTML=menuPanelItem.m_label;innerDiv.style.zIndex=(length-i);mpr.m_menuPanelItemElements[menuItemPos]=innerDiv;mpr.m_menuPanelItemPosLookup[menuPanelItem.m_id]=menuItemPos;menuItemPos++;}}
mpr.m_popupLayer=PopupLayer.create(mpr.m_element);mpr.startMenuPanelEventHandlers();return mpr;}
MenuPanelRenderer.getParentMenuPanelId=function(element)
{var menuPanelId=null;var className=null;var parent=element.parentNode;while(null!=parent)
{className=parent.className;if(className==MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
{menuPanelId=parent.id;break;}
parent=parent.parentNode;}
return menuPanelId;}
MenuPanelRenderer.prototype._dispose=function()
{this.stopMenuPanelEventHandlers();this.m_menuPanelItemPosLookup=null;this.m_menuPanelItemElements=null;this.m_menuPanelItemDivStatus=null;this.m_popupLayer._dispose();this.m_popupLayer=null;this.m_menuRenderer=null;this.m_element=null;}
MenuPanelRenderer.prototype.show=function()
{this.m_popupLayer.show();}
MenuPanelRenderer.prototype.hide=function()
{this.m_popupLayer.hide();}
MenuPanelRenderer.prototype.setMenuPanelItemClass=function(menuItemPos,className)
{if(menuItemPos>=0&&menuItemPos<this.m_menuPanelItemElements.length)
{var innerDiv=this.m_menuPanelItemElements[menuItemPos];var divClasses=className;var menuItemDivStatus=this.m_menuPanelItemDivStatus[menuItemPos];switch(menuItemDivStatus)
{case MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW:divClasses+=" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS+" "+
MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;break;case MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE:divClasses+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;break;case MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW:divClasses+=" "+MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;break;default:break;}
innerDiv.className=divClasses;}}
MenuPanelRenderer.prototype.startMenuPanelEventHandlers=function()
{var thisObj=this;if(null==this.m_menuPanelMouseOverHandler)
{this.m_menuPanelMouseOverHandler=SUPSEvent.addEventHandler(this.m_element,"mouseover",function(evt){return thisObj._handleMenuPanelMouseOver(evt);});}
if(null==this.m_menuPanelMouseOutHandler)
{this.m_menuPanelMouseOutHandler=SUPSEvent.addEventHandler(this.m_element,"mouseout",function(evt){return thisObj._handleMenuPanelMouseOut(evt);});}}
MenuPanelRenderer.prototype.stopMenuPanelEventHandlers=function()
{if(null!=this.m_menuPanelMouseOverHandler)
{SUPSEvent.removeEventHandlerKey(this.m_menuPanelMouseOverHandler);this.m_menuPanelMouseOverHandler=null;}
if(null!=this.m_menuPanelMouseOutHandler)
{SUPSEvent.removeEventHandlerKey(this.m_menuPanelMouseOutHandler);this.m_menuPanelMouseOutHandler=null;}}
MenuPanelRenderer.prototype._handleMenuPanelMouseOver=function(evt)
{evt=(evt)?evt:((event)?event:null);if(null!=evt)
{var srcElement=SUPSEvent.getTargetElement(evt);var cellElement=null;if(srcElement.tagName==MenuPanelRenderer.CELL_TAG_NAME)
{cellElement=srcElement;}
else if(srcElement.tagName==MenuPanelRenderer.DIV_TAG_NAME)
{var parentElement=srcElement.parentNode;if(parentElement.tagName==MenuPanelRenderer.CELL_TAG_NAME)
{cellElement=parentElement;}}
if(null!=cellElement)
{var menuItemPos=this.m_menuPanelItemPosLookup[cellElement.id];if(null!=menuItemPos)
{this.m_menuRenderer.handleMenuPanelItemMouseOver(this.m_element.id,menuItemPos);}}
SUPSEvent.stopPropagation(evt);}}
MenuPanelRenderer.prototype._handleMenuPanelMouseOut=function(evt)
{evt=(evt)?evt:((event)?event:null);if(null!=evt)
{var toElement=null;var srcElement=null;toElement=SUPSEvent.getRelatedElement(evt)
var targetMenuPanelId=null;if(null!=toElement)
{var className=null;var permissionExceptionOccurred=false;try
{className=toElement.className;}
catch(ex)
{permissionExceptionOccurred=true;}
if(!permissionExceptionOccurred)
{if(className==MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
{targetMenuPanelId=toElement.id;}
else
{targetMenuPanelId=MenuPanelRenderer.getParentMenuPanelId(toElement);}}}
if(targetMenuPanelId!=this.m_element.id)
{this.m_menuRenderer.handleMenuPanelMouseOut(this.m_element.id,targetMenuPanelId);}
SUPSEvent.stopPropagation(evt);}}
MenuPanelRenderer.prototype.getMenuPanelItemPosFromId=function(menuPanelItemId)
{return this.m_menuPanelItemPosLookup[menuPanelItemId];}
MenuPanelRenderer.prototype.getMenuPanelItem=function(menuItemPos)
{var innerDiv=this.m_menuPanelItemElements[menuItemPos];return innerDiv;}
MenuPanelRenderer.prototype.setPosition=function(left,top)
{if(null!=left)
{this.m_element.style.left=left+"px";}
if(null!=top)
{this.m_element.style.top=top+"px";}}
function MenuModel(menuAdaptor)
{this.m_adaptor=menuAdaptor;this.m_menuRenderer=menuAdaptor.m_renderer;this.m_menuDataSourceId=this.m_menuRenderer.m_menuDataSourceId;this.m_menuDataSource=MenuDataSourceFactory.getInstance(this.m_menuDataSourceId);this.m_functionalMenuItemTypes=new Array();}
MenuModel.MENU_PANEL_ID_PREFIX="_MenuPanel_";MenuModel.MENU_ITEM_ID_PREFIX="_MenuItem_";MenuModel.BASE_MENU_PANEL_XPATH="./panel";MenuModel.m_logger=new Category("MenuModel");MenuModel.prototype.m_menuPanel=null;MenuModel.prototype.m_menuDisplayed=false;MenuModel.prototype.m_baseMenuPanel=null;MenuModel.prototype.m_menuPanelCounter=0;MenuModel.prototype.m_menuPanelLookup=new Array();MenuModel.prototype.m_selectedMenuPanelId=null;MenuModel.prototype.m_mouseOverMenuOption=null;MenuModel.prototype._dispose=function()
{for(var i in this.m_menuPanelLookup)
{this.m_menuPanelLookup[i]._dispose();this.m_menuPanelLookup[i]=null;}
this.m_menuPanelLookup=null;this.m_baseMenuPanel=null;this.m_menuDataSource=null;this.m_menuRenderer=null;this.m_adaptor=null;}
MenuModel.prototype.handleMenuOptionMouseOver=function(evt)
{this.m_mouseOverMenuOption=true;if(this.m_adaptor.m_active)
{this.renderState();}}
MenuModel.prototype.handleMenuOptionMouseOut=function(evt)
{this.m_mouseOverMenuOption=false;if(this.m_adaptor.m_active)
{this.renderState();}}
MenuModel.prototype.handleMenuOptionMouseDown=function(clickInsideMenuOption)
{if(this.m_adaptor.m_active)
{if(!this.m_menuDisplayed)
{if(null==this.m_baseMenuPanel)
{var baseMenuItems=null;var menuComponentEnablement=null;if(this.m_menuDataSourceId==MenuDataSourceFactory.NAVIGATION_MENU)
{baseMenuItems=this.m_menuDataSource.getMenuPanelItems(MenuModel.BASE_MENU_PANEL_XPATH);if(this.m_menuRenderer.m_includeCoreMenuPanelItems)
{this._addCoreMenuPanelItems(baseMenuItems);}
menuComponentEnablement=false;}
else
{baseMenuItems=this.m_menuDataSource.getMenuPanelItems(this.m_adaptor);menuComponentEnablement=true;}
if(null!=baseMenuItems)
{var length=baseMenuItems.length;if(length>0)
{var menuPanelId=this.m_menuRenderer.getElement().id+
MenuModel.MENU_PANEL_ID_PREFIX+
this.m_menuPanelCounter;this.m_menuPanelCounter++;this.m_baseMenuPanel=this._createMenuPanel(menuPanelId,null,MenuModel.BASE_MENU_PANEL_XPATH,baseMenuItems,menuComponentEnablement);this.m_menuPanelLookup=new Array();this.m_menuPanelLookup[menuPanelId]=this.m_baseMenuPanel;this.m_menuRenderer.renderBaseMenuPanel(menuPanelId,baseMenuItems);this.m_baseMenuPanel.show();}}}
else
{this.m_baseMenuPanel.show();}
this.m_menuDisplayed=true;this.renderState();}
else
{this.m_baseMenuPanel.hide(false);this.m_selectedMenuPanelId=null;this.m_menuDisplayed=false;this.renderState();}}
else
{if(this.m_menuDisplayed)
{this.m_baseMenuPanel.hide(false);this.m_selectedMenuPanelId=null;this.m_menuDisplayed=false;this.renderState();}}}
MenuModel.prototype.createMenuPanel=function(parentMenuPanelId,parentMenuItemPos,panelXPath)
{var menuPanel=null;var menuPanelItems=null;if(this.m_menuDataSourceId==MenuDataSourceFactory.NAVIGATION_MENU)
{menuPanelItems=this.m_menuDataSource.getMenuPanelItems(panelXPath);}
if(null!=menuPanelItems)
{var length=menuPanelItems.length;if(length>0)
{var menuPanelId=this.m_menuRenderer.getElement().id+
MenuModel.MENU_PANEL_ID_PREFIX+
this.m_menuPanelCounter;this.m_menuPanelCounter++;menuPanel=this._createMenuPanel(menuPanelId,parentMenuPanelId,panelXPath,menuPanelItems,false);this.m_menuPanelLookup[menuPanelId]=menuPanel;this.m_menuRenderer.renderExtensionMenuPanel(parentMenuPanelId,parentMenuItemPos,menuPanelId,menuPanelItems);}}
return menuPanel;}
MenuModel.prototype.showMenuPanel=function(menuPanelId)
{var menuPanelDisplayed=false;this.m_menuRenderer.showMenuPanel(menuPanelId);}
MenuModel.prototype.hideMenuPanel=function(menuPanelId)
{this.m_menuRenderer.hideMenuPanel(menuPanelId);}
MenuModel.prototype._createMenuPanel=function(menuPanelId,parentMenuPanelId,menuPanelXPath,menuItems,menuComponentEnablement)
{var menuItemPrefix=menuPanelId+MenuModel.MENU_ITEM_ID_PREFIX;var menuPanel=new MenuPanel(menuPanelId,parentMenuPanelId,this,menuComponentEnablement);var menuPanelItem=null;var type=null;var userAllowedAccess=null;var destination=null;var functionRef=null;var subformId=null;var panelXPath=null;var navigationComponent=null;var subMenuComponent=null;var quickLinkComponent=null;var functionComponent=null;var menuItemCounter=0;for(var i=0,l=menuItems.length;i<l;i++)
{menuPanelItem=menuItems[i];type=menuPanelItem.m_type;if(type!=MenuPanelItem.DIVISION)
{if(type!=MenuPanelItem.QUICK_LINK)
{menuPanelItem.m_id=menuItemPrefix+menuItemCounter;}
if(type==MenuPanelItem.ITEM)
{destination=menuPanelItem.m_destination;userAllowedAccess=Services.hasAccessToForm(destination);if(userAllowedAccess)
{menuPanelItem.m_class=ActionComponent.ENABLED_ACTION_UNSELECTED;}
else
{menuPanelItem.m_class=ActionComponent.DISABLED_ACTION_UNSELECTED;}
navigationComponent=new NavigationComponent(menuItemCounter,menuPanel,destination,userAllowedAccess);menuPanel.addMenuComponent(navigationComponent);}
else if(type==MenuPanelItem.PANEL)
{panelXPath=menuPanelXPath+"/panel[@label='"+
menuPanelItem.m_label+"']";userAllowedAccess=this._hasAccessToSubMenu(panelXPath);if(userAllowedAccess)
{menuPanelItem.m_class=SubMenuComponent.ENABLED_SUBMENU_UNSELECTED;}
else
{menuPanelItem.m_class=SubMenuComponent.DISABLED_SUBMENU_UNSELECTED;}
subMenuComponent=new SubMenuComponent(menuItemCounter,menuPanel,userAllowedAccess,panelXPath);menuPanel.addMenuComponent(subMenuComponent);}
else if(type==MenuPanelItem.QUICK_LINK)
{destination=menuPanelItem.m_destination;subformId=menuPanelItem.m_subformId;if(null!=destination)
{userAllowedAccess=Services.hasAccessToForm(destination);}
else
{var subFormAdaptor=FormController.getInstance().getAdaptorById(subformId);if(null==subFormAdaptor)
{throw new ConfigurationException("Subform adaptor with identifier "+
subformId+" defined in menu quick link configuration does not exist.");}
var subformName=subFormAdaptor.subformName;userAllowedAccess=Services.hasAccessToForm(subformName);}
isEnabled=this.isMenuComponentEnabled(menuPanelItem.m_id);if(userAllowedAccess&&isEnabled)
{menuPanelItem.m_class=ActionComponent.ENABLED_ACTION_UNSELECTED;}
else
{menuPanelItem.m_class=ActionComponent.DISABLED_ACTION_UNSELECTED;}
quickLinkComponent=new QuickLinkComponent(menuPanelItem.m_id,menuPanel,destination,subformId,userAllowedAccess,isEnabled,menuPanelItem.m_guard,menuPanelItem.m_prepare);menuPanel.addMenuComponent(quickLinkComponent);}
else if(type==MenuPanelItem.FUNCTION)
{this._restrictFunctionalMenuPanelItemEntries(menuPanelItem.m_functionType);functionRef=this._defineMenuPanelItemFunctionRef(menuPanelItem);userAllowedAccess=true;if(userAllowedAccess)
{menuPanelItem.m_class=ActionComponent.ENABLED_ACTION_UNSELECTED;}
else
{menuPanelItem.m_class=ActionComponent.DISABLED_ACTION_UNSELECTED;}
functionComponent=new FunctionComponent(menuItemCounter,menuPanel,functionRef,menuPanelItem.getFunctionParamValuesAsArgumentArray(),userAllowedAccess);menuPanel.addMenuComponent(functionComponent);}
else
{throw new AppConfigError("Unexpected menu element type in node defined by xpath "+
menuPanelXPath);}
menuItemCounter++;}}
return menuPanel;}
MenuModel.prototype.handleMenuPanelItemMouseOver=function(menuPanelId,menuItemPos)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuItemMouseOver(menuItemPos);}}
MenuModel.prototype.handleMenuPanelMouseOut=function(menuPanelId,targetMenuPanelId)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuPanelMouseOut(targetMenuPanelId);}}
MenuModel.prototype.checkEnabledActionComponent=function(menuPanelId,menuPanelItemPos)
{var enabledActionComponent=false;var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{enabledActionComponent=menuPanel.isEnabledActionComponent(menuPanelItemPos);}
return enabledActionComponent;}
MenuModel.prototype.handleMenuPanelItemMouseClick=function(menuPanelId,menuPanelItemPos)
{var menuPanel=this.m_menuPanelLookup[menuPanelId];if(null!=menuPanel)
{menuPanel.invokeAction(menuPanelItemPos);}}
MenuModel.prototype.setMenuPanelItemClass=function(menuPanelId,menuItemPos,className)
{this.m_menuRenderer.setMenuPanelItemClass(menuPanelId,menuItemPos,className);}
MenuModel.prototype._hasAccessToSubMenu=function(subMenuPanelXPath)
{var userHasAccessToSubMenu=false;var ac=Services.getAppController();var menuPanelItems=ac.getMenuPanelItems(subMenuPanelXPath);if(null!=menuPanelItems)
{var length=menuPanelItems.length;if(length>0)
{var menuPanelItem=null;var type=null;var userAllowedAccess=null;var panelXPath=null;for(var i=0;i<length;i++)
{userAllowedAccess=false;menuPanelItem=menuPanelItems[i];type=menuPanelItem.m_type;if(type==MenuPanelItem.ITEM)
{userAllowedAccess=Services.hasAccessToForm(menuPanelItem.m_destination);}
else if(type==MenuPanelItem.PANEL)
{panelXPath=subMenuPanelXPath+"/panel[@label='"+
menuPanelItem.m_label+"']";userAllowedAccess=this._hasAccessToSubMenu(panelXPath);}
if(userAllowedAccess)
{userHasAccessToSubMenu=true;break;}}}}
return userHasAccessToSubMenu;}
MenuModel.prototype.isMenuComponentEnabled=function(menuPanelItemId)
{return this.m_adaptor.quickLinkEnabled(menuPanelItemId);}
MenuModel.prototype.setSelectedMenuPanelId=function(menuPanelId)
{this.m_selectedMenuPanelId=menuPanelId;}
MenuModel.prototype.getActiveMenuPanelId=function()
{var menuPanelId=null;if(null!=this.m_selectedMenuPanelId)
{menuPanelId=this.m_selectedMenuPanelId;}
else
{menuPanelId=this.m_baseMenuPanel.getId();}
return menuPanelId;}
MenuModel.prototype.handleKeyUp=function()
{if(this.m_menuDisplayed)
{var activeMenuPanelId=this.getActiveMenuPanelId();var menuPanel=this.m_menuPanelLookup[activeMenuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuPanelItemKeySelection(true);}}}
MenuModel.prototype.handleKeyDown=function()
{if(this.m_menuDisplayed)
{var activeMenuPanelId=this.getActiveMenuPanelId();var menuPanel=this.m_menuPanelLookup[activeMenuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuPanelItemKeySelection(false);}}}
MenuModel.prototype.handleKeyLeft=function()
{if(this.m_menuDisplayed)
{var activeMenuPanelId=this.getActiveMenuPanelId();if(activeMenuPanelId!=this.m_baseMenuPanel.getId())
{var menuPanel=this.m_menuPanelLookup[activeMenuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuPanelKeyLeft();}}}}
MenuModel.prototype.handleKeyRight=function()
{if(this.m_menuDisplayed)
{var activeMenuPanelId=this.getActiveMenuPanelId();var menuPanel=this.m_menuPanelLookup[activeMenuPanelId];if(null!=menuPanel)
{menuPanel.handleMenuPanelKeyRight();}}}
MenuModel.prototype.handleKeyReturn=function()
{if(this.m_menuDisplayed)
{var activeMenuPanelId=this.getActiveMenuPanelId();var menuPanel=this.m_menuPanelLookup[activeMenuPanelId];if(null!=menuPanel)
{menuPanel.handleKeyReturn();}}}
MenuModel.prototype.handleShortcutKey=function()
{var id=this.m_adaptor.getId();Services.setFocus(id);var evt=new Object();evt.srcElement=new Object();evt.srcElement.id=id;this.m_menuRenderer._handleMenuOptionMouseDown(evt);}
MenuModel.prototype.relayKeyReturn=function(menuPanelId,menuPanelItemPos)
{this.m_menuRenderer.handleKeyReturn(menuPanelId,menuPanelItemPos);}
MenuModel.prototype._defineMenuPanelItemFunctionRef=function(menuPanelItem)
{var funcRef=null;if(null!=menuPanelItem.m_functionClassName)
{var classRef=window[menuPanelItem.m_functionClassName];if(null==classRef)
{throw new ConfigurationException("Error : Unable to locate class "+
menuPanelItem.m_functionClassName+" associated with menu item "+
menuPanelItem.m_label);}
else
{funcRef=classRef[menuPanelItem.m_functionName];}}
else
{funcRef=window[menuPanelItem.m_functionName];}
if(null==funcRef)
{throw new ConfigurationException("Error : Unable to locate function "+
menuPanelItem.m_functionName+" associated with menu item "+
menuPanelItem.m_label);}
return funcRef;}
MenuModel.prototype._restrictFunctionalMenuPanelItemEntries=function(functionalType)
{var currentFunctionalTypes=this.m_functionalMenuItemTypes;for(var i=0,l=currentFunctionalTypes.length;i<l;i++)
{if(functionalType==currentFunctionalTypes[i])
{throw new ConfigurationException("Error : The menu configuration allows there to be one menu panel item of functional type "+
functionalType+" only.");}}
currentFunctionalTypes[currentFunctionalTypes.length]=functionalType;}
MenuModel.prototype._addCoreMenuPanelItems=function(baseMenuPanelItems)
{var i=null;var menuPanelItem=null;var length=baseMenuPanelItems.length;for(i=0;i<length;i++)
{if(baseMenuPanelItems[i].m_functionType=="logout")
{menuPanelItem=baseMenuPanelItems[i];break;}}
if(null!=menuPanelItem)
{if(null==menuPanelItem.m_functionName)
{menuPanelItem.m_functionClassName="Services";menuPanelItem.m_functionName="logoff";}}
else
{menuPanelItem=new MenuPanelItem();menuPanelItem.m_type=MenuPanelItem.FUNCTION;menuPanelItem.m_functionType="logout";menuPanelItem.m_label="Logout";menuPanelItem.m_functionClassName="Services";menuPanelItem.m_functionName="logoff";menuPanelItem.m_functionParams=new Array();var menuPanelItemFuncParam=new MenuPanelItemFunctionParam();menuPanelItemFuncParam.m_name="raiseWarningIfDOMDirty";menuPanelItemFuncParam.m_position=1;menuPanelItemFuncParam.m_type=MenuPanelItemFunctionParam.BOOLEAN;menuPanelItemFuncParam.m_value=true;menuPanelItem.m_functionParams[0]=menuPanelItemFuncParam;baseMenuPanelItems[baseMenuPanelItems.length]=menuPanelItem;menuPanelItem=new MenuPanelItem();menuPanelItem.m_type=MenuPanelItem.DIVISION;baseMenuPanelItems[baseMenuPanelItems.length]=menuPanelItem;}
menuPanelItem=null;for(i=0;i<length;i++)
{if(baseMenuPanelItems[i].m_functionType=="exit")
{menuPanelItem=baseMenuPanelItems[i];break;}}
if(null==menuPanelItem)
{menuPanelItem=new MenuPanelItem();menuPanelItem.m_type=MenuPanelItem.FUNCTION;menuPanelItem.m_functionType="exit";menuPanelItem.m_label="Exit";menuPanelItem.m_functionClassName="FormController";menuPanelItem.m_functionName="exitApplication";baseMenuPanelItems[baseMenuPanelItems.length]=menuPanelItem;}}
MenuModel.prototype.handleLostFocusWhilstDisplayed=function()
{if(this.m_menuDisplayed==true)
{this.m_menuRenderer.handleLostFocusWhilstDisplayed();}}
MenuModel.prototype.renderState=function()
{var menuClasses=null;if(this.m_menuDisplayed)
{menuClasses=MenuRenderer.MENU_BAR_BUTTON_INSET;}
else
{if(this.m_mouseOverMenuOption==true)
{menuClasses=MenuRenderer.MENU_BAR_BUTTON_OUTSET;}
else
{menuClasses=MenuRenderer.MENU_BAR_BUTTON;}}
menuClasses+=" ";if(this.m_adaptor.m_active)
{menuClasses+=MenuRenderer.MENU_BAR_BUTTON_ACTIVE;}
else
{menuClasses+=MenuRenderer.MENU_BAR_BUTTON_INACTIVE;}
this.m_menuRenderer.renderMenuOption(menuClasses);}
function MenuPanelItem(){}
MenuPanelItem.ITEM="item";MenuPanelItem.PANEL="panel";MenuPanelItem.DIVISION="division";MenuPanelItem.QUICK_LINK="quickLink";MenuPanelItem.FUNCTION="function";MenuPanelItem.prototype.m_id=null;MenuPanelItem.prototype.m_type=null;MenuPanelItem.prototype.m_label=null;MenuPanelItem.prototype.m_destination=null;MenuPanelItem.prototype.m_subformId=null;MenuPanelItem.prototype.m_class=null;MenuPanelItem.prototype.m_guard=null;MenuPanelItem.prototype.m_prepare=null;MenuPanelItem.prototype.m_functionClassName=null;MenuPanelItem.prototype.m_functionName=null;MenuPanelItem.prototype.m_functionParams=null;MenuPanelItem.prototype.m_functionType=null;MenuPanelItem.prototype.getFunctionParamValuesAsArgumentArray=function()
{var paramValueArray=null;if(null!=this.m_functionParams)
{var length=this.m_functionParams.length;if(length>0)
{var i;var functionParam;var maxPosition=0;for(i=0;i<length;i++)
{functionParam=this.m_functionParams[i];if(functionParam.m_position>maxPosition)
{maxPosition=functionParam.m_position;}}
paramValueArray=new Array(maxPosition+1);for(i=0;i<=maxPosition;i++)
{paramValueArray[i]=null;}
for(i=0;i<length;i++)
{functionParam=this.m_functionParams[i];paramValueArray[functionParam.m_position]=functionParam.m_value;}}}
return paramValueArray;}
function MenuPanelItemFunctionParam(){}
MenuPanelItemFunctionParam.BOOLEAN="boolean";MenuPanelItemFunctionParam.STRING="string";MenuPanelItemFunctionParam.FLOAT="float";MenuPanelItemFunctionParam.INT="int";MenuPanelItemFunctionParam.isValidType=function(type)
{var validType=null;var lowerCaseType=type.toLowerCase();switch(lowerCaseType)
{case MenuPanelItemFunctionParam.STRING:case MenuPanelItemFunctionParam.BOOLEAN:case MenuPanelItemFunctionParam.FLOAT:case MenuPanelItemFunctionParam.INT:{validType=true;break;}
default:{validType=false;break;}}
return validType;}
MenuPanelItemFunctionParam.prototype.m_name=null;MenuPanelItemFunctionParam.prototype.m_value=null;MenuPanelItemFunctionParam.prototype.m_position=null;MenuPanelItemFunctionParam.prototype.m_type=null;function MenuComponent(){}
MenuComponent.prototype.m_id=null;MenuComponent.prototype.m_hostMenuPanel=null;MenuComponent.prototype.m_userAllowedAccess=null;MenuComponent.prototype.getId=function()
{return this.m_id;}
MenuComponent.prototype.getUserAllowedAccess=function()
{return this.m_userAllowedAccess;}
function ActionComponent(){}
ActionComponent.prototype=new MenuComponent();ActionComponent.prototype.constructor=ActionComponent;ActionComponent.ENABLED_ACTION_SELECTED="menuItemDiv enabled_action_selected";ActionComponent.DISABLED_ACTION_SELECTED="menuItemDiv disabled_action_selected";ActionComponent.ENABLED_ACTION_UNSELECTED="menuItemDiv enabled_action_unselected";ActionComponent.DISABLED_ACTION_UNSELECTED="menuItemDiv disabled_action_unselected";ActionComponent.prototype.select=function()
{var className=null;if(this.m_userAllowedAccess)
{className=ActionComponent.ENABLED_ACTION_SELECTED;}
else
{className=ActionComponent.DISABLED_ACTION_SELECTED;}
return className;}
ActionComponent.prototype.deselect=function()
{var className=null;if(this.m_userAllowedAccess)
{className=ActionComponent.ENABLED_ACTION_UNSELECTED;}
else
{className=ActionComponent.DISABLED_ACTION_UNSELECTED;}
return className;}
ActionComponent.prototype.invokeAction=function()
{throw new ConfigurationException("ActionComponent.invokeAction(), please supply an implementation of this method in your sub class.");}
function NavigationComponent(id,hostMenuPanel,destination,userAllowedAccess)
{this.m_id=id;this.m_hostMenuPanel=hostMenuPanel;this.m_destination=destination;this.m_userAllowedAccess=userAllowedAccess;}
NavigationComponent.prototype=new ActionComponent();NavigationComponent.prototype.constructor=NavigationComponent;NavigationComponent.prototype.invokeAction=function()
{Services.navigate(this.m_destination);}
NavigationComponent.prototype._dispose=function()
{this.m_id=null;this.m_hostMenuPanel=null;this.m_destination=null;this.m_userAllowedAccess=null;}
function FunctionComponent(id,hostMenuPanel,functionRef,functionParams,userAllowedAccess)
{this.m_id=id;this.m_hostMenuPanel=hostMenuPanel;this.m_functionRef=functionRef;this.m_functionParams=functionParams;this.m_userAllowedAccess=userAllowedAccess;}
FunctionComponent.prototype=new ActionComponent();FunctionComponent.prototype.constructor=FunctionComponent;FunctionComponent.prototype.invokeAction=function()
{if(this.m_functionParams!=null&&this.m_functionParams.length>0)
{this.m_functionRef.apply(this,this.m_functionParams);}
else
{this.m_functionRef.call(this);}}
FunctionComponent.prototype._dispose=function()
{this.m_id=null;this.m_hostMenuPanel=null;this.m_functionRef=null;this.m_userAllowedAccess=null;}
function QuickLinkComponent(id,hostMenuPanel,destination,subformId,userAllowedAccess,isEnabled,guard,prepare)
{this.m_id=id;this.m_hostMenuPanel=hostMenuPanel;this.m_destination=destination;this.m_subformId=subformId,this.m_userAllowedAccess=userAllowedAccess;this.m_isEnabled=isEnabled;this.m_guard=guard;this.m_prepare=prepare;}
QuickLinkComponent.prototype=new ActionComponent();QuickLinkComponent.prototype.constructor=QuickLinkComponent;QuickLinkComponent.prototype.select=function()
{var className=null;if(this.m_userAllowedAccess&&this.m_isEnabled)
{className=ActionComponent.ENABLED_ACTION_SELECTED;}
else
{className=ActionComponent.DISABLED_ACTION_SELECTED;}
return className;}
QuickLinkComponent.prototype.deselect=function()
{var className=null;if(this.m_userAllowedAccess&&this.m_isEnabled)
{className=ActionComponent.ENABLED_ACTION_UNSELECTED;}
else
{className=ActionComponent.DISABLED_ACTION_UNSELECTED;}
return className;}
QuickLinkComponent.prototype.getUserAllowedAccess=function()
{var accessAllowed=false;if(this.m_userAllowedAccess&&this.m_isEnabled)
{accessAllowed=true;}
return accessAllowed;}
QuickLinkComponent.prototype.invokeAction=function()
{var guardResult=true;if(null!=this.m_guard)
{guardResult=this.m_guard.call(this);}
if(guardResult)
{if(null!=this.m_prepare)
{this.m_prepare.call(this);}
if(null!=this.m_destination)
{Services.navigate(this.m_destination);}
else if(null!=this.m_subformId)
{Services.dispatchEvent(this.m_subformId,BusinessLifeCycleEvents.EVENT_RAISE);}}}
QuickLinkComponent.prototype._dispose=function()
{this.m_id=null;this.m_hostMenuPanel=null;this.m_destination=null;this.m_subformId=null;this.m_userAllowedAccess=null;this.m_isEnabled=null;this.m_guard=null;this.m_prepare=null;}
function SubMenuComponent(id,hostMenuPanel,userAllowedAccess,panelXPath)
{this.m_id=id;this.m_hostMenuPanel=hostMenuPanel;this.m_userAllowedAccess=userAllowedAccess;this.m_panelXPath=panelXPath;}
SubMenuComponent.prototype=new MenuComponent();SubMenuComponent.prototype.constructor=SubMenuComponent;SubMenuComponent.ENABLED_SUBMENU_SELECTED="menuItemDiv submenu submenu_selected";SubMenuComponent.DISABLED_SUBMENU_SELECTED="menuItemDiv submenu submenu_disabled submenu_selected submenu_disabled_selected";SubMenuComponent.ENABLED_SUBMENU_UNSELECTED="menuItemDiv submenu";SubMenuComponent.DISABLED_SUBMENU_UNSELECTED="menuItemDiv submenu submenu_disabled";SubMenuComponent.SELECT_DELAY=750;SubMenuComponent.DESELECT_DELAY=500;SubMenuComponent.m_logger=new Category("SubMenuComponent");SubMenuComponent.prototype.m_menuPanel=null;SubMenuComponent.prototype.m_keyDeselection=null;SubMenuComponent.prototype.m_selectedTimeoutId=null;SubMenuComponent.prototype.m_deselectedTimeoutId=null;SubMenuComponent.prototype.getMenuPanel=function()
{return this.m_menuPanel;}
SubMenuComponent.prototype.select=function(keySelection)
{var className=null;if(this.m_userAllowedAccess)
{className=SubMenuComponent.ENABLED_SUBMENU_SELECTED;}
else
{className=SubMenuComponent.DISABLED_SUBMENU_SELECTED;}
if(this.m_userAllowedAccess)
{this.clearDeselectionTimeout();if(!keySelection)
{var displaySubMenu=true;if(null!=this.m_menuPanel)
{if(this.m_menuPanel.isVisible())
{displaySubMenu=false;}}
if(displaySubMenu)
{var thisObj=this;this.m_selectedTimeoutId=setTimeout(function(){thisObj.show();},SubMenuComponent.SELECT_DELAY);}}}
return className;}
SubMenuComponent.prototype.deselect=function(keyDeselection,delayDeselect)
{var className=null;if(this.m_userAllowedAccess)
{className=SubMenuComponent.ENABLED_SUBMENU_UNSELECTED;}
else
{className=SubMenuComponent.DISABLED_SUBMENU_UNSELECTED;}
if(this.m_userAllowedAccess)
{this.clearSelectionTimeout();if(!keyDeselection)
{if(null!=this.m_menuPanel)
{if(this.m_menuPanel.isVisible())
{if(delayDeselect)
{this.m_keyDeselection=keyDeselection;var thisObj=this;this.m_deselectedTimeoutId=setTimeout(function(){thisObj.hide();},SubMenuComponent.DESELECT_DELAY);}
else
{this.m_menuPanel.hide(keyDeselection);}}}}}
return className;}
SubMenuComponent.prototype.show=function()
{if(null==this.m_menuPanel)
{this.m_menuPanel=this.m_hostMenuPanel.createSubMenuMenuPanel(this.m_id,this.m_panelXPath);this.m_menuPanel.show();}
else
{if(!this.m_menuPanel.isVisible())
{this.m_menuPanel.show();}}
this.m_selectedTimeout=null;}
SubMenuComponent.prototype.hide=function()
{if(null!=this.m_menuPanel)
{if(this.m_menuPanel.isVisible())
{this.m_menuPanel.hide(this.m_keyDeselection);}}
this.m_keyDeselection=null;this.m_deselectedTimeoutId=null;}
SubMenuComponent.prototype.isMenuPanelVisible=function()
{var menuPanelIsVisible=false;if(null!=this.m_menuPanel)
{if(this.m_menuPanel.isVisible())
{menuPanelIsVisible=true;}}
return menuPanelIsVisible;}
SubMenuComponent.prototype.clearSelectionTimeout=function()
{if(null!=this.m_selectedTimeoutId)
{clearTimeout(this.m_selectedTimeoutId);this.m_selectedTimeoutId=null;}}
SubMenuComponent.prototype.clearDeselectionTimeout=function()
{if(null!=this.m_deselectedTimeoutId)
{clearTimeout(this.m_deselectedTimeoutId);this.m_deselectedTimeoutId=null;}}
SubMenuComponent.prototype._dispose=function()
{this.clearSelectionTimeout();this.clearDeselectionTimeout();this.m_id=null;this.m_hostMenuPanel=null;this.m_userAllowedAccess=null;this.m_panelXPath=null;this.m_menuPanel=null;}
function MenuPanel(id,parentMenuPanelId,menuModel,menuComponentEnablement)
{this.m_id=id;this.m_parentMenuPanelId=parentMenuPanelId;this.m_menuModel=menuModel;this.m_menuComponentEnablement=menuComponentEnablement;this.m_menuComponents=new Array();this.m_selectedComponent=-1;this.m_menuPanelDisplayed=false;}
MenuPanel.NO_COMPONENT_SELECTED=-1;MenuPanel.prototype.getId=function()
{return this.m_id;}
MenuPanel.prototype.getMenuModel=function()
{return this.m_menuModel;}
MenuPanel.prototype.isVisible=function()
{return this.m_menuPanelDisplayed;}
MenuPanel.prototype.addMenuComponent=function(menuComponent)
{this.m_menuComponents[this.m_menuComponents.length]=menuComponent;}
MenuPanel.prototype.show=function()
{if(this.m_menuComponentEnablement)
{this._updateMenuComponentStatus();}
this.m_menuModel.showMenuPanel(this.m_id);this.m_menuPanelDisplayed=true;}
MenuPanel.prototype.hide=function(keyDeselection)
{if(this.m_selectedComponent!=MenuPanel.NO_COMPONENT_SELECTED)
{var className=this.m_menuComponents[this.m_selectedComponent].deselect(keyDeselection,false);this.m_menuModel.setMenuPanelItemClass(this.m_id,this.m_selectedComponent,className);this.m_selectedComponent=MenuPanel.NO_COMPONENT_SELECTED;}
this.m_menuModel.hideMenuPanel(this.m_id);this.m_menuPanelDisplayed=false;}
MenuPanel.prototype.handleMenuPanelMouseOut=function(targetMenuPanelId)
{if(this.m_selectedComponent!=MenuPanel.NO_COMPONENT_SELECTED)
{var className=null;if(null==targetMenuPanelId)
{className=this.m_menuComponents[this.m_selectedComponent].deselect(false,true);this.m_menuModel.setMenuPanelItemClass(this.m_id,this.m_selectedComponent,className);this.m_selectedComponent=MenuPanel.NO_COMPONENT_SELECTED;}
else
{if(targetMenuPanelId!=this.m_id)
{if(!this._isChildMenuPanel(targetMenuPanelId))
{className=this.m_menuComponents[this.m_selectedComponent].deselect(false,true);this.m_menuModel.setMenuPanelItemClass(this.m_id,this.m_selectedComponent,className);this.m_selectedComponent=MenuPanel.NO_COMPONENT_SELECTED;}}}}}
MenuPanel.prototype.handleMenuItemMouseOver=function(menuItemPos)
{var className=null;var id=this.m_id;var menuModel=this.m_menuModel;menuModel.setSelectedMenuPanelId(id);if(this.m_selectedComponent==MenuPanel.NO_COMPONENT_SELECTED)
{this.m_selectedComponent=menuItemPos;className=this.m_menuComponents[menuItemPos].select(false);menuModel.setMenuPanelItemClass(id,menuItemPos,className);}
else
{if(this.m_selectedComponent!=menuItemPos)
{className=this.m_menuComponents[this.m_selectedComponent].deselect(false,true);menuModel.setMenuPanelItemClass(id,this.m_selectedComponent,className);this.m_selectedComponent=menuItemPos;className=this.m_menuComponents[menuItemPos].select(false);menuModel.setMenuPanelItemClass(id,menuItemPos,className);}}}
MenuPanel.prototype.handleMenuPanelItemKeySelection=function(keyArrowUp)
{var className=null;var menuPanelItemPos=null;var id=this.m_id;var menuModel=this.m_menuModel;var length=this.m_menuComponents.length;if(this.m_selectedComponent==MenuPanel.NO_COMPONENT_SELECTED)
{if(keyArrowUp)
{menuPanelItemPos=length-1;}
else
{menuPanelItemPos=0;}
this.m_selectedComponent=menuPanelItemPos;className=this.m_menuComponents[menuPanelItemPos].select(true);menuModel.setMenuPanelItemClass(id,menuPanelItemPos,className);menuModel.setSelectedMenuPanelId(id);}
else
{var selectNewComponent=true;var component=this.m_menuComponents[this.m_selectedComponent];if(component.constructor==SubMenuComponent)
{if(component.isMenuPanelVisible())
{component.getMenuPanel().handleMenuPanelItemKeySelection(keyArrowUp);selectNewComponent=false;}
else
{className=this.m_menuComponents[this.m_selectedComponent].deselect(true,false);menuModel.setMenuPanelItemClass(id,this.m_selectedComponent,className);}}
else
{className=component.deselect();menuModel.setMenuPanelItemClass(id,this.m_selectedComponent,className);}
if(selectNewComponent)
{if(keyArrowUp)
{menuPanelItemPos=this.m_selectedComponent-1;if(menuPanelItemPos<0)
{menuPanelItemPos=length-1;}}
else
{menuPanelItemPos=this.m_selectedComponent+1;if(menuPanelItemPos>length-1)
{menuPanelItemPos=0;}}
this.m_selectedComponent=menuPanelItemPos;component=this.m_menuComponents[menuPanelItemPos];if(component.constructor==SubMenuComponent)
{if(component.isMenuPanelVisible())
{component.clearDeselectionTimeout();component.getMenuPanel().handleMenuPanelItemKeySelection(keyArrowUp);}
else
{className=component.select(true);menuModel.setMenuPanelItemClass(id,menuPanelItemPos,className);}}
else
{className=component.select();menuModel.setMenuPanelItemClass(id,menuPanelItemPos,className);}}}}
MenuPanel.prototype.handleMenuPanelKeyRight=function()
{if(this.m_selectedComponent!=MenuPanel.NO_COMPONENT_SELECTED)
{var component=this.m_menuComponents[this.m_selectedComponent];if(component.constructor==SubMenuComponent)
{if(!component.isMenuPanelVisible())
{component.clearSelectionTimeout();component.show();}
component.getMenuPanel().handleMenuPanelItemKeySelection(false);}}}
MenuPanel.prototype.handleMenuPanelKeyLeft=function()
{if(this.m_selectedComponent!=MenuPanel.NO_COMPONENT_SELECTED)
{var component=this.m_menuComponents[this.m_selectedComponent];if(component.constructor==SubMenuComponent)
{if(component.isMenuPanelVisible())
{component.clearDeselectionTimeout();component.hide();}
else
{this.hide();this.m_menuModel.setSelectedMenuPanelId(this.m_parentMenuPanelId);}}
else
{this.hide();this.m_menuModel.setSelectedMenuPanelId(this.m_parentMenuPanelId);}}}
MenuPanel.prototype.handleKeyReturn=function()
{if(this.m_selectedComponent!=MenuPanel.NO_COMPONENT_SELECTED)
{var menuPanelItemPos=this.m_selectedComponent;if(this.isEnabledActionComponent(menuPanelItemPos))
{this.m_menuModel.relayKeyReturn(this.m_id,menuPanelItemPos);}}}
MenuPanel.prototype._isChildMenuPanel=function(menuPanelId)
{var isChild=false;var menuPanel=null;var component=null;for(var i=0,l=this.m_menuComponents.length;i<l;i++)
{component=this.m_menuComponents[i];if(component.constructor==SubMenuComponent)
{menuPanel=component.getMenuPanel();if(null!=menuPanel)
{if(menuPanel.getId()==menuPanelId)
{isChild=true;break;}}}}
return isChild;}
MenuPanel.prototype.createSubMenuMenuPanel=function(subMenuComponentId,subMenuPanelXPath)
{var menuPanel=this.m_menuModel.createMenuPanel(this.m_id,subMenuComponentId,subMenuPanelXPath);return menuPanel;}
MenuPanel.prototype.isEnabledActionComponent=function(menuPanelItemPos)
{var enabledActionComponent=false;var menuComponent=this.m_menuComponents[menuPanelItemPos];if(menuComponent.getUserAllowedAccess())
{if(null!=menuComponent.invokeAction)
{enabledActionComponent=true;}}
return enabledActionComponent;}
MenuPanel.prototype.invokeAction=function(menuPanelItemPos)
{var menuComponent=this.m_menuComponents[menuPanelItemPos];if(menuComponent.getUserAllowedAccess())
{if(null!=menuComponent.invokeAction)
{menuComponent.invokeAction();}}}
MenuPanel.prototype._updateMenuComponentStatus=function()
{var className=null;var isEnabled=null;var component=null;for(var i=0,l=this.m_menuComponents.length;i<l;i++)
{component=this.m_menuComponents[i];isEnabled=this.m_menuModel.isMenuComponentEnabled(component.m_id);if(isEnabled!=component.m_isEnabled)
{component.m_isEnabled=isEnabled;className=component.deselect(false);this.m_menuModel.setMenuPanelItemClass(this.m_id,i,className);}}}
MenuPanel.prototype._dispose=function()
{for(var i=0,l=this.m_menuComponents.length;i<l;i++)
{this.m_menuComponents[i]._dispose();}
this.m_menuComponents=null;this.m_id=null;this.m_parentMenuPanelId=null;this.m_menuModel=null;this.m_menuComponentEnablement=null;}
function MenuDataSourceFactory(){}
MenuDataSourceFactory.NAVIGATION_MENU=1;MenuDataSourceFactory.QUICK_LINK_MENU=2;MenuDataSourceFactory.m_navigationMenuDataSource=null;MenuDataSourceFactory.m_quickLinkMenuDataSource=null;MenuDataSourceFactory.getInstance=function(factoryType)
{var dataSource;if(factoryType==MenuDataSourceFactory.NAVIGATION_MENU)
{if(null==MenuDataSourceFactory.m_navigationMenuDataSource)
{MenuDataSourceFactory.m_navigationMenuDataSource=new NavigationMenuDataSource();}
dataSource=MenuDataSourceFactory.m_navigationMenuDataSource;}
else if(factoryType==MenuDataSourceFactory.QUICK_LINK_MENU)
{if(null==MenuDataSourceFactory.m_quickLinkMenuDataSource)
{MenuDataSourceFactory.m_quickLinkMenuDataSource=new QuickLinkMenuDataSource();}
dataSource=MenuDataSourceFactory.m_quickLinkMenuDataSource;}
return dataSource;}
function MenuDataSource(){}
MenuDataSource.prototype.getMenuPanelItems=function()
{throw new ConfigurationException("MenuDataSource.getMenuPanelItems(), please supply an implementation of this method in your sub-class");}
function NavigationMenuDataSource(){}
NavigationMenuDataSource.prototype=new MenuDataSource();NavigationMenuDataSource.prototype.constructor=NavigationMenuDataSource;NavigationMenuDataSource.prototype.getMenuPanelItems=function(panelXPath)
{var ac=Services.getAppController();return ac.getMenuPanelItems(panelXPath);}
function QuickLinkMenuDataSource(){}
QuickLinkMenuDataSource.prototype=new MenuDataSource();QuickLinkMenuDataSource.prototype.constructor=QuickLinkMenuDataSource;QuickLinkMenuDataSource.prototype.getMenuPanelItems=function(quickLinksMenuButtonGUIAdaptor)
{var menuPanelItems=null;if(null!=quickLinksMenuButtonGUIAdaptor)
{var quickLinkMenuItems=quickLinksMenuButtonGUIAdaptor.m_quickLinksConfig;menuPanelItems=new Array();var menuPanelItem=null;var quickLinkMenuItem=null;var formName=null;var subformId=null;for(var i=0,l=quickLinkMenuItems.length;i<l;i++)
{quickLinkMenuItem=quickLinkMenuItems[i];menuPanelItem=new MenuPanelItem();menuPanelItem.m_type=MenuPanelItem.QUICK_LINK;menuPanelItem.m_id=quickLinkMenuItem.id;menuPanelItem.m_label=quickLinkMenuItem.label;formName=quickLinkMenuItem.formName;subformId=quickLinkMenuItem.subformId;if(null!=formName&&null!=subformId)
{throw new ConfigurationException("Both formName and subformId defined for quick link "+
quickLinkMenuItem.id);}
else if(null!=formName&&null==subformId)
{menuPanelItem.m_destination=formName;}
else if(null==formName&&null!=subformId)
{menuPanelItem.m_subformId=subformId;}
else
{throw new ConfigurationException("Neither formName nor subformId defined for quick link "+
quickLinkMenuItem.id);}
if(null!=quickLinkMenuItem.guard)
{menuPanelItem.m_guard=quickLinkMenuItem.guard;}
if(null!=quickLinkMenuItem.prepare)
{menuPanelItem.m_prepare=quickLinkMenuItem.prepare;}
menuPanelItems[menuPanelItems.length]=menuPanelItem;}}
return menuPanelItems;}
function MenuBarGUIAdaptor(){};MenuBarGUIAdaptor.prototype=new HTMLElementGUIAdaptor();MenuBarGUIAdaptor.prototype.constructor=MenuBarGUIAdaptor;GUIAdaptor._setUpProtocols('MenuBarGUIAdaptor');MenuBarGUIAdaptor.isIE=(document.attachEvent!=null);MenuBarGUIAdaptor.prototype.m_quickLinksConfig=null;MenuBarGUIAdaptor.prototype.m_quickLinkButtons=null;MenuBarGUIAdaptor.prototype.m_quickLinksMenuItems=null;MenuBarGUIAdaptor.create=function(element)
{var a=new MenuBarGUIAdaptor();a._initialiseAdaptor(element);return a;}
MenuBarGUIAdaptor.prototype._initialiseAdaptor=function(element)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,element);var cm=FormController.getInstance().getFormView().getConfigManager();var navigationButtonConfig=this._getNavigationButtonConfig(cm);var navigationButtonLabel=null;if(navigationButtonConfig!=null)
{navigationButtonLabel=navigationButtonConfig.label;}
this.m_renderer.renderNavigationMenuButton(navigationButtonLabel);this.m_quickLinksConfig=this._getQuickLinksConfig(cm);if(null!=this.m_quickLinksConfig)
{var length=this.m_quickLinksConfig.length;if(length>0)
{var i;var quickLinkConfig;for(i=0;i<length;i++)
{quickLinkConfig=this.m_quickLinksConfig[i];if(null==quickLinkConfig.id)
{throw new ConfigurationException("Quicklink "+(i+1)+" does not have mandatory id configuration specified");}
if(null==quickLinkConfig.formName&&null==quickLinkConfig.subformId)
{throw new ConfigurationException("Quicklink "+(i+1)+" does not have mandatory formName or subformId configuration specified");}}
this.m_quickLinkButtons=new Array();this.m_quickLinkMenuItems=new Array();for(i=0;i<length;i++)
{quickLinkConfig=this.m_quickLinksConfig[i];if(true==quickLinkConfig.onMenuBar)
{this.m_quickLinkButtons[this.m_quickLinkButtons.length]=quickLinkConfig;this._createQuickLinkConfig(cm,quickLinkConfig);}
else
{this.m_quickLinkMenuItems[this.m_quickLinkMenuItems.length]=quickLinkConfig;}}
var quickLinksMenuButtonLabel=null;if(this.m_quickLinkMenuItems.length>0)
{var quickLinksMenuButtonConfig=this._getQuickLinksMenuButtonConfig(cm);if(quickLinksMenuButtonConfig!=null&&quickLinksMenuButtonConfig.label!=null)
{quickLinksMenuButtonLabel=quickLinksMenuButtonConfig.label;}}
this.m_renderer.renderQuickLinks(this.m_quickLinkButtons,this.m_quickLinkMenuItems,quickLinksMenuButtonLabel);}}}
MenuBarGUIAdaptor.prototype._createQuickLinkConfig=function(cm,config)
{var thisObj=this;cm.setConfig(config.id,{actionBinding:function(){thisObj._handleQuickLinkClick(config);},enableOn:config.enableOn,isEnabled:config.isEnabled,additionalBindings:{eventBinding:config.eventBinding}});}
MenuBarGUIAdaptor.prototype._handleQuickLinkClick=function(config)
{var guardResult=true;if(null!=config.guard)
{guardResult=config.guard.call(this);}
if(true==guardResult)
{if(null!=config.prepare)
{config.prepare.call(this);}
if(null!=config.formName)
{Services.navigate(config.formName);}
else if(null!=config.subformId)
{Services.dispatchEvent(config.subformId,BusinessLifeCycleEvents.EVENT_RAISE);}
else
{throw new ConfigurationException("Quicklink "+(i+1)+" does not have mandatory formName or subformId configuration specified");}}}
MenuBarGUIAdaptor.prototype._dispose=function()
{this.m_renderer._dispose();}
MenuBarGUIAdaptor.prototype._configure=function(cs)
{var fc=FormController.getInstance();var cm=fc.getFormView().getConfigManager();var eventBindingConfig=null;var buttonConfig;var keyObj;buttonConfig=this._getNavigationButtonConfig(cm);if(buttonConfig!=null)
{eventBindingConfig=buttonConfig.eventBinding;}
if(null==eventBindingConfig)
{keyObj=(MenuBarGUIAdaptor.isIE)?Key.CHAR_M:Key.CHAR_m;eventBindingConfig={keys:[{key:keyObj,alt:true}]};}
cm.setConfig(this.getId()+MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX,{eventBinding:eventBindingConfig});if(this.m_quickLinkMenuItems!=null&&this.m_quickLinkMenuItems.length>0)
{eventBindingConfig=null;buttonConfig=this._getQuickLinksMenuButtonConfig(cm);if(buttonConfig!=null)
{eventBindingConfig=buttonConfig.eventBinding;}
if(null==eventBindingConfig)
{keyObj=(MenuBarGUIAdaptor.isIE)?Key.CHAR_Q:Key.CHAR_q;eventBindingConfig={keys:[{key:keyObj,alt:true}]};}
cm.setConfig(this.getId()+MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX,{quickLinks:this.m_quickLinkMenuItems,eventBinding:eventBindingConfig});}
cm.setConfig(this.getId()+MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON,{isEnabled:function(){return false;}});}
MenuBarGUIAdaptor.prototype.renderState=function()
{}
MenuBarGUIAdaptor.prototype._getQuickLinksConfig=function(cm)
{var quickLinks=null;var cs=cm.getConfig(this.getId());for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null!=c.quickLinks)
{quickLinks=c.quickLinks;break;}}
return quickLinks;}
MenuBarGUIAdaptor.prototype._getNavigationButtonConfig=function(cm)
{var navigationButtonConfig=null;var cs=cm.getConfig(this.getId());for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null!=c.navigationMenuButton)
{navigationButtonConfig=c.navigationMenuButton;break;}}
return navigationButtonConfig;}
MenuBarGUIAdaptor.prototype._getQuickLinksMenuButtonConfig=function(cm)
{var quickLinksMenuButtonConfig=null;var cs=cm.getConfig(this.getId());for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(null!=c.quickLinksMenuButton)
{quickLinksMenuButtonConfig=c.quickLinksMenuButton;break;}}
return quickLinksMenuButtonConfig;}
MenuBarGUIAdaptor.prototype.getQuickLinksButtonContainer=function()
{return this.m_renderer.m_quickLinksContainer;}
function MenuGUIAdaptor(){};MenuGUIAdaptor.prototype=new HTMLElementGUIAdaptor();MenuGUIAdaptor.prototype.constructor=MenuGUIAdaptor;GUIAdaptor._setUpProtocols('MenuGUIAdaptor');GUIAdaptor._addProtocol('MenuGUIAdaptor','FocusProtocol');GUIAdaptor._addProtocol('MenuGUIAdaptor','FocusProtocolHTMLImpl');GUIAdaptor._addProtocol('MenuGUIAdaptor','KeybindingProtocol');GUIAdaptor._addProtocol('MenuGUIAdaptor','EnablementProtocol');MenuGUIAdaptor.m_logger=new Category("MenuGUIAdaptor");MenuGUIAdaptor.isIE=(document.attachEvent!=null);MenuGUIAdaptor.prototype.m_menuModel=null;MenuGUIAdaptor.prototype.tabIndex=-1;MenuGUIAdaptor.prototype.m_shortCutKeyPressed=false;MenuGUIAdaptor.prototype.m_keyObj=null;MenuGUIAdaptor.prototype.m_keyUpEventHandler=null;MenuGUIAdaptor.create=function(element)
{var a=new MenuGUIAdaptor();a._initialiseAdaptor(element);return a;}
MenuGUIAdaptor.prototype._initialiseAdaptor=function(element)
{HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,element);this.m_menuModel=new MenuModel(this);this.m_keyBindings=new Array();}
MenuGUIAdaptor.prototype._dispose=function()
{var i;this.m_renderer._dispose();this.m_menuModel._dispose();var bindingsLength=this.m_keyBindings.length;if(bindingsLength>0)
{if(MenuGUIAdaptor.isIE)
{SUPSEvent.removeEventHandlerKey(this.m_keyUpEventHandler);this.m_keyUpEventHandler=null;}
for(i=0;i<bindingsLength;i++)
this.m_keyBindings[i].dispose();}
if(null!=this.m_shortCutKeyConfig)
{for(i in this.m_shortCutKeyConfig)
this.m_shortCutKeyConfig[i]=null;this.m_shortCutKeyConfig=null;}
if(null!=this.m_keyObj)this.m_keyObj=null;}
MenuGUIAdaptor.prototype._configure=function(cs)
{this._registerMenuButtonEventHandlers();this._registerMenuPanelEventHandlers();this._registerCheckEnabledActionComponent();this.m_renderer.startMenuEventHandlers();this.isEnabled=function()
{return true;}
for(var i=0;i<cs.length;i++)
{if(null!=cs[i].quickLinks)
{this.m_quickLinksConfig=cs[i].quickLinks;}
if(null!=cs[i].eventBinding)
{this.m_shortCutKeyConfig=cs[i].eventBinding.keys[0];}}
this.m_quickLinksEnabled=new Array();if(this.m_quickLinksConfig)
{for(var i=0;i<this.m_quickLinksConfig.length;i++)
{this.m_quickLinksEnabled[this.m_quickLinksConfig[i].id]=true;}}
var shortCutKeyConfig=this.m_shortCutKeyConfig;if(null!=shortCutKeyConfig)
{var keyCode=shortCutKeyConfig.key.m_keyCode;var adaptor;this.m_keyObj=new Key(keyCode);var qualObj=new Object();qualObj.ctrl=(shortCutKeyConfig.ctrl==true)?true:false;qualObj.alt=(shortCutKeyConfig.alt==true)?true:false;qualObj.shift=(shortCutKeyConfig.shift==true)?true:false;if(null==shortCutKeyConfig.element)
{adaptor=FormController.getInstance().getFormAdaptor();}
else
{adaptor=FormController.getInstance().getAdaptorById(shortCutKeyConfig.element);}
this.m_keyBindings[0]=new ElementKeyBindings(adaptor);var thisObj=this;this.m_keyBindings[0].bindKey(this.m_keyObj,function(){thisObj._handleShortcutKey();},qualObj);if(MenuGUIAdaptor.isIE)
{this.m_keyUpEventHandler=SUPSEvent.addEventHandler(this.m_element,"keyup",function(evt){return thisObj._handleKeyUpEvent(evt);});}}}
MenuGUIAdaptor.prototype.renderState=function()
{if(this.m_focusChanged)
{this.m_focusChanged=false;if(this.m_focus)
{if(MenuGUIAdaptor.isIE)
{this.m_element.focus();}}}
this.m_menuModel.renderState();}
MenuGUIAdaptor.prototype._registerMenuButtonEventHandlers=function()
{var thisObj=this;var renderer=this.m_renderer;renderer.registerMenuOptionMouseOverHandler(function(evt){thisObj._handleMenuOptionMouseOver(evt)});renderer.registerMenuOptionMouseOutHandler(function(evt){thisObj._handleMenuOptionMouseOut(evt)});renderer.registerMenuOptionMouseDownHandler(function(clickInsideMenuOption){thisObj._handleMenuOptionMouseDown(clickInsideMenuOption)});}
MenuGUIAdaptor.prototype._registerMenuPanelEventHandlers=function()
{var thisObj=this;var renderer=this.m_renderer;renderer.registerMenuPanelItemMouseOverHandler(function(menuPanelId,menuItemPos){thisObj._handleMenuPanelItemMouseOver(menuPanelId,menuItemPos);});renderer.registerMenuPanelMouseOutHandler(function(menuPanelId,targetMenuPanelId){thisObj._handleMenuPanelMouseOut(menuPanelId,targetMenuPanelId);});renderer.registerMenuPanelItemMouseClickHandler(function(menuPanelId,menuPanelItemPos){thisObj._handleMenuPanelItemMouseClick(menuPanelId,menuPanelItemPos);});}
MenuGUIAdaptor.prototype._registerCheckEnabledActionComponent=function()
{var thisObj=this;var renderer=this.m_renderer;renderer.registerCheckEnabledActionComponent(function(menuPanelId,menuPanelItemPos){return thisObj._checkEnabledActionComponent(menuPanelId,menuPanelItemPos);});}
MenuGUIAdaptor.prototype._handleMenuOptionMouseOver=function(evt)
{this.m_menuModel.handleMenuOptionMouseOver(evt);}
MenuGUIAdaptor.prototype._handleMenuOptionMouseOut=function(evt)
{this.m_menuModel.handleMenuOptionMouseOut(evt);}
MenuGUIAdaptor.prototype._handleMenuOptionMouseDown=function(clickInsideMenuOption)
{this.m_menuModel.handleMenuOptionMouseDown(clickInsideMenuOption);}
MenuGUIAdaptor.prototype._handleMenuPanelItemMouseOver=function(menuPanelId,menuItemPos)
{this.m_menuModel.handleMenuPanelItemMouseOver(menuPanelId,menuItemPos);}
MenuGUIAdaptor.prototype._handleMenuPanelMouseOut=function(menuPanelId,targetMenuPanelId)
{this.m_menuModel.handleMenuPanelMouseOut(menuPanelId,targetMenuPanelId);}
MenuGUIAdaptor.prototype._handleMenuPanelItemMouseClick=function(menuPanelId,menuPanelItemPos)
{this.m_menuModel.handleMenuPanelItemMouseClick(menuPanelId,menuPanelItemPos);}
MenuGUIAdaptor.prototype._checkEnabledActionComponent=function(menuPanelId,menuPanelItemPos)
{return this.m_menuModel.checkEnabledActionComponent(menuPanelId,menuPanelItemPos);}
MenuGUIAdaptor.prototype.getListenersForEnablementProtocol=function()
{var listenerArray=new Array();if(!this.m_quickLinksConfig)
{return listenerArray;}
var dm=FormController.getInstance().getDataModel();var currentEnableOn;for(var i=0;i<this.m_quickLinksConfig.length;i++)
{currentEnableOn=this.m_quickLinksConfig[i].enableOn;if(currentEnableOn==null)
{continue;}
for(var j=0;j<currentEnableOn.length;j++)
{var listener=FormControllerListener.create(this,FormController.ENABLEMENT,this.m_quickLinksConfig[i].id)
listenerArray.push({xpath:currentEnableOn[j],listener:listener});}}
return listenerArray;}
MenuGUIAdaptor.prototype.setEnabled=function(value,listener)
{if(!this.m_quickLinksConfig)
{return;}
if(!listener)
{for(var i=0;i<this.m_quickLinksConfig.length;i++)
{if(null!=this.m_quickLinksConfig[i].isEnabled)
{this.m_quickLinksEnabled[this.m_quickLinksConfig[i].id]=this.m_quickLinksConfig[i].isEnabled();}
else
{this.m_quickLinksEnabled[quickLinkId]=true;}}
return;}
var quickLinkId=listener.m_detail;for(var i=0;i<this.m_quickLinksConfig.length;i++)
{if(this.m_quickLinksConfig[i].id==quickLinkId)
{this.m_quickLinksEnabled[quickLinkId]=this.m_quickLinksConfig[i].isEnabled();}}}
MenuGUIAdaptor.prototype.setFocus=function(f,wasClick)
{if(MenuGUIAdaptor.m_logger.isDebug())MenuGUIAdaptor.m_logger.debug("MenuGUIAdaptor.setFocus() adaptor "+this.getId()+", focus = "+f);var r=false;if(f!=this.m_focus)
{this.m_focus=f;this.m_focusChanged=true;r=true;if(!this.m_focus)
{this.m_menuModel.handleLostFocusWhilstDisplayed();if(this.m_shortCutKeyPressed)
{this.m_shortCutKeyPressed=false;}}}
else
{this.m_focusChanged=false;}
return r;}
MenuGUIAdaptor.prototype.quickLinkEnabled=function(quickLinkId)
{return this.m_quickLinksEnabled[quickLinkId];}
MenuGUIAdaptor.prototype._handleKeyUp=function()
{this.m_menuModel.handleKeyUp();}
MenuGUIAdaptor.prototype._handleKeyDown=function()
{this.m_menuModel.handleKeyDown();}
MenuGUIAdaptor.prototype._handleKeyLeft=function()
{this.m_menuModel.handleKeyLeft();}
MenuGUIAdaptor.prototype._handleKeyRight=function()
{this.m_menuModel.handleKeyRight();}
MenuGUIAdaptor.prototype._handleKeyReturn=function()
{this.m_menuModel.handleKeyReturn();}
MenuGUIAdaptor.prototype._handleShortcutKey=function()
{if(MenuGUIAdaptor.isIE)
{if(!this.m_shortCutKeyPressed)
{this.m_shortCutKeyPressed=true;this.m_menuModel.handleShortcutKey();}}
else
{this.m_menuModel.handleShortcutKey();}}
MenuGUIAdaptor.prototype._handleKeyUpEvent=function(evt)
{if(this.m_shortCutKeyPressed)
{evt=(evt)?evt:((event)?event:null);var kc=evt.keyCode;if(kc==this.m_keyObj.m_keyCode)
{this.m_shortCutKeyPressed=false;}}}
MenuGUIAdaptor.prototype.keyBindings=[{key:Key.ArrowUp,action:MenuGUIAdaptor.prototype._handleKeyUp},{key:Key.ArrowDown,action:MenuGUIAdaptor.prototype._handleKeyDown},{key:Key.ArrowLeft,action:MenuGUIAdaptor.prototype._handleKeyLeft},{key:Key.ArrowRight,action:MenuGUIAdaptor.prototype._handleKeyRight},{key:Key.Return,action:MenuGUIAdaptor.prototype._handleKeyReturn}];function MenuHelp(){}
MenuHelp.help=function()
{var callbackFunction=function(userResponse)
{}
var fc=FormController.getInstance();var title="Help";var message="Framework help test example. Function: MenuHelp.help";Services.showDialog(StandardDialogTypes.OK,callbackFunction,message,title);}
function help()
{var callbackFunction=function(userResponse)
{}
var fc=FormController.getInstance();var title="Help";var message="Framework help text example. Function : help";Services.showDialog(StandardDialogTypes.OK,callbackFunction,message,title);}
function MenuBack(){}
MenuBack.back=function()
{var callbackFunction=function(userResponse)
{switch(userResponse)
{case StandardDialogButtonTypes.OK:Services.navigate("TestPageNavigation");break;default:break;}}
var fc=FormController.getInstance();var title=null;var message="Framework back test example. Select OK to go back.";Services.showDialog(StandardDialogTypes.OK_CANCEL,callbackFunction,message,title);}
function MenuLogout(){}
MenuLogout.logoff=function(formName,raiseWarningIfDOMDirty)
{var localFormName=formName;var localRaiseWarningIfDOMDirty=raiseWarningIfDOMDirty;var callbackFunction=function(userResponse)
{switch(userResponse)
{case StandardDialogButtonTypes.OK:Services.logoff(localFormName,localRaiseWarningIfDOMDirty);break;default:break;}}
var title=null;var message="Framework logout test example. Select OK to logout.";Services.showDialog(StandardDialogTypes.OK_CANCEL,callbackFunction,message,title);}
function MenuExit(){}
MenuExit.exit=function()
{var callbackFunction=function(userResponse)
{switch(userResponse)
{case StandardDialogButtonTypes.OK:Services.getAppController().exit();break;default:break;}}
var title=null;var message="Framework exit test example. Select OK to exit.";Services.showDialog(StandardDialogTypes.OK_CANCEL,callbackFunction,message,title);}
function PopupSubformGUIAdaptor(){}
PopupSubformGUIAdaptor.CSS_CLASS_NAME="popup popupsubform";PopupSubformGUIAdaptor.CSS_CLASS_NAME_FULLPAGE="popup popupsubform popup_fullscreen";PopupSubformGUIAdaptor.m_currentPrecompilationSubformId=null;PopupSubformGUIAdaptor.m_logger=new Category("PopupSubformGUIAdaptor");PopupSubformGUIAdaptor.prototype=new AbstractPopupGUIAdaptor();GUIAdaptor._setUpProtocols('PopupSubformGUIAdaptor');PopupSubformGUIAdaptor.prototype.constructor=PopupSubformGUIAdaptor;PopupSubformGUIAdaptor.prototype.subformName=null;PopupSubformGUIAdaptor.prototype.destroyOnClose=null;PopupSubformGUIAdaptor.prototype.m_returnedDOM=null;PopupSubformGUIAdaptor.prototype.m_subformView=null;PopupSubformGUIAdaptor.prototype.m_httpRequest=null;PopupSubformGUIAdaptor.prototype.m_subformInitialised=false;PopupSubformGUIAdaptor.create=function(e)
{if(PopupSubformGUIAdaptor.m_logger.isTrace())PopupSubformGUIAdaptor.m_logger.trace("create()");var a=new PopupSubformGUIAdaptor();a._initialiseAdaptor(e);return a;}
PopupSubformGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(PopupSubformGUIAdaptor.m_logger.isTrace())PopupSubformGUIAdaptor.m_logger.trace("_initialiseAdaptor()");AbstractPopupGUIAdaptor.prototype._initialiseAdaptor.call(this,e);}
PopupSubformGUIAdaptor.prototype._dispose=function()
{this._destroySubForm();AbstractPopupGUIAdaptor.prototype._dispose.call(this);}
PopupSubformGUIAdaptor.prototype._configure=function(cs)
{AbstractPopupGUIAdaptor.prototype._configure.call(this,cs);for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.subformName!=null&&this.subformName==null)
{this.subformName=c.subformName;}
if(c.styleURL!=null&&this.styleURL==null)
{this.m_styleURL=c.styleURL;}
if(c.processReturnedData!=null&&this.processReturnedData==null)
{this.m_processReturnedData=c.processReturnedData;}
if(c.replaceTargetNode!=null&&this.replaceTargetNode==null)
{this.replaceTargetNode=c.replaceTargetNode;}
if(c.addTargetNode!=null&&this.addTargetNode==null)
{this.addTargetNode=c.addTargetNode;}
if(c.destroyOnClose!=null&&this.destroyOnClose==null)
{this.destroyOnClose=c.destroyOnClose;}}
if(null==this.destroyOnClose||typeof this.destroyOnClose!='boolean')
{this.destroyOnClose=true;}
if(null==this.subformName)
{throw new ConfigurationException("PopupSubformGUIAdaptor, no subformName specified for adaptor id = "+this.getId()+", this is a mandatory configuration property!");}}
PopupSubformGUIAdaptor.prototype._show=function(showMe,currentFocussedAdaptorId)
{var ac=null;if(showMe)
{ac=Services.getAppController();ac._showProgress();}
this.getElement().style.visibility="hidden";AbstractPopupGUIAdaptor.prototype._show.call(this,showMe,currentFocussedAdaptorId);if(showMe)
{if(null==this.m_subformView)
{this.invokeLoad();}
else
{ac.setCurrentFormByName(this.subformName);this._initialiseSubForm();}}
else
{this.invokeUnload();}}
PopupSubformGUIAdaptor.prototype._isAdaptorChildOfPopup=function(adaptor)
{return false;}
PopupSubformGUIAdaptor.prototype._createFormView=function()
{this._createIFrame();}
PopupSubformGUIAdaptor.prototype._createIFrame=function()
{var ac=Services.getAppController();this.m_previousFormName=ac.getCurrentForm().getName();ac.setCurrentFormByName(this.subformName);var e=this.getElement();this.m_subformView=HTMLFrameFormViewManager.createManagedIFrame(e,"popupsubformframe");this.registerViewAndFormReadyListeners();var subformURL=this._getSubformURL();var styleSheets=ac.getCSSDefinitionsForForm(this.subformName);this.m_subformView.loadView(subformURL,styleSheets);}
PopupSubformGUIAdaptor.prototype.registerViewAndFormReadyListeners=function()
{var thisObj=this;this.m_subformView.registerViewReadyListener(function(){thisObj._viewLoaded();});this.m_subformView.registerFormReadyListener(function(){thisObj._formReadyHandler();});}
PopupSubformGUIAdaptor.prototype._getSubformURL=function()
{var ac=Services.getAppController();return ac.getURLForForm(this.subformName);}
PopupSubformGUIAdaptor.prototype._initialiseSubForm=function()
{var initialData=Services.getNodes("/ds/var/app | /ds/var/form");if(this.m_subformInitialised)
{var fc=this._getSubformFormController();fc.reinitialise(initialData);}
else
{this.m_subformView._startFormController(initialData,this,false);this.m_subformInitialised=true;}
this.m_returnedDOM=null;}
PopupSubformGUIAdaptor.prototype._formReadyHandler=function()
{var cssClass=this.getElement().className;if(cssClass.lastIndexOf("popup_fullscreen")==-1)
{var iframeDoc=this.m_subformView._getDocument();var style=getCalculatedStyle(this.getElement());var contentHeight;if(style.height!="auto")
{contentHeight=Number(style.height.slice(0,-2));iframeDoc.body.style.height=contentHeight;}
else
{contentHeight=iframeDoc.body.clientHeight;this.getElement().style.height=contentHeight+"px";}
var iframe=this.m_subformView.m_frame.getFrame();iframe.style.height=contentHeight+"px";}
this.getElement().style.visibility="inherit";var ac=FormController.getInstance().getAppController();ac._hideProgress();}
PopupSubformGUIAdaptor.prototype.setReturnedDOM=function(nodes)
{this.m_returnedDOM=nodes;if(this.m_returnedDOM!=null)
{Services.replaceNode("/ds/var/app",this.m_returnedDOM["app"]);Services.replaceNode("/ds/var/form",this.m_returnedDOM["form"]);}}
PopupSubformGUIAdaptor.prototype.setReturnedData=function(returnSourceNodes)
{var ac=Services.getAppController();ac.setCurrentFormByName(this.m_previousFormName);var targetNode;var returnedNode;if(returnSourceNodes==null)
{return;}
if(this.replaceTargetNode!=null)
{for(var i=0;i<this.replaceTargetNode.length;i++)
{targetNode=this.replaceTargetNode[i];returnedNode=returnSourceNodes[targetNode.sourceNodeIndex];Services.replaceNode(targetNode.dataBinding,returnedNode);}}
if(this.addTargetNode!=null)
{for(var i=0;i<this.addTargetNode.length;i++)
{targetNode=this.addTargetNode[i];returnedNode=returnSourceNodes[targetNode.sourceNodeIndex];Services.addNode(returnedNode,targetNode.dataBinding);}}
if(this.m_processReturnedData!=null&&typeof this.m_processReturnedData=="function")
{this.m_processReturnedData();}
FormController.getInstance().processEvents();ac.setCurrentFormByName(this.subformName);}
PopupSubformGUIAdaptor.prototype._destroySubForm=function()
{if(null!=this.m_subformView)
{this.getElement().style.visibility="hidden";this.m_subformView._disposeFormController();this.m_subformView.dispose();this.m_subformView=null;var e=this.getElement();e.innerHTML=""
this.m_subformInitialised=false;}}
PopupSubformGUIAdaptor.prototype._getSubformFormController=function()
{return this.m_subformView.getFormController();}
PopupSubformGUIAdaptor.prototype.invokeLoad=function()
{this._createFormView();}
PopupSubformGUIAdaptor.prototype.invokeUnload=function()
{if(this.destroyOnClose)
{this._destroySubForm()}
var ac=Services.getAppController();ac.setCurrentFormByName(this.m_previousFormName);}
PopupSubformGUIAdaptor.prototype.subformViewFormControllerExists=function()
{var formControllerExists=false;if(null!=this.m_subformView)
{if(null!=this.m_subformView.getFormController())
{formControllerExists=true;}}
return formControllerExists;}
PopupSubformGUIAdaptor.prototype.setSubformViewFormControllerBusinessLifeCycleEventSubmission=function(allowEventSubmission)
{this.m_subformView.getFormController().setAllowBusinessLifeCycleEventSubmission(allowEventSubmission);}
PopupSubformGUIAdaptor.prototype._viewLoaded=function()
{if(this.m_styleURL!=null)
{var headElement=GUIUtils.getDocumentHeadElement(this.m_subformView._getDocument());GUIUtils.createStyleLinkElement(headElement,this.m_styleURL,null);}
this._loadPrecompile();}
PopupSubformGUIAdaptor.prototype._loadPrecompile=function()
{var ac=Services.getAppController();var subformDetails=ac.getCurrentForm();if(ac.m_config.getPrecompileEnabled()&&(subformDetails.getPrecompile()!="no"))
{PopupSubformGUIAdaptor.m_currentPrecompilationSubformId=this.getId();var url=ac.m_rootURL+
ac.m_config.getAppBaseURL()+"/precompile/"+
subformDetails.getName()+".js";var async=false;this.m_httpRequest=new XMLHttpServiceRequest();this.m_httpRequest.initialise(this,url,async,null,handleSubformPrecompileReadyStateChange);this.m_httpRequest.sendGET("loadPrecompiled");}
else
{this._loadPrecompileComplete();}}
function handleSubformPrecompileReadyStateChange()
{var fc=FormController.getInstance();var adaptor=fc.getAdaptorById(PopupSubformGUIAdaptor.m_currentPrecompilationSubformId);var request=adaptor.m_httpRequest.getRequest();if(request.readyState==4)
{if(request.status==200)
{var javascript=request.responseText;adaptor.m_subformView.m_frame.m_frame.contentWindow.eval(javascript);}
adaptor.m_httpRequest.dispose();adaptor.m_httpRequest=null;PopupSubformGUIAdaptor.m_currentPrecompilationSubformId=null;adaptor._loadPrecompileComplete();}
request=null;adaptor=null;fc=null;}
PopupSubformGUIAdaptor.prototype._loadPrecompileComplete=function()
{this._initialiseSubForm();}
function LOVSubformGUIAdaptor(){}
LOVSubformGUIAdaptor.m_logger=new Category("LOVSubformGUIAdaptor");LOVSubformGUIAdaptor.prototype=new PopupSubformGUIAdaptor();GUIAdaptor._setUpProtocols('LOVSubformGUIAdaptor');GUIAdaptor._addProtocol('LOVSubformGUIAdaptor','LOVProtocol');LOVSubformGUIAdaptor.prototype.constructor=LOVSubformGUIAdaptor;LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT="/ds/lovSubFormModel";LOVSubformGUIAdaptor.LOV_SUBFORM_VIEW_URL="/com/sups/client/gui/lov_subform/LOVSubform.html";LOVSubformGUIAdaptor.LOV_FILTERS_DATABINDING_ROOT=DataModel.DEFAULT_FORM_BINDING_ROOT+"/tmp/filtering";LOVSubformGUIAdaptor.SUBMIT_ENABLED=LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT+"/submit";LOVSubformGUIAdaptor.CANCEL_ENABLED=LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT+"/cancel";LOVSubformGUIAdaptor.create=function(e)
{if(LOVSubformGUIAdaptor.m_logger.isTrace())LOVSubformGUIAdaptor.m_logger.trace("create()");var a=new LOVSubformGUIAdaptor();a._initialiseAdaptor(e);return a;}
LOVSubformGUIAdaptor.prototype._initialiseAdaptor=function(e)
{PopupSubformGUIAdaptor.prototype._initialiseAdaptor.call(this,e);var r=this.m_renderer;this.m_label=r.m_label;this.m_headerColumns=r.m_columns;this.m_rows=r.m_rows;this.m_groupSize=r.m_groupSize;this.m_isFiltered=r.m_isFiltered;this.m_enableLifeCyclesTimeout=null;}
LOVSubformGUIAdaptor.prototype._configure=function(cs)
{for(var i=0,l=cs.length;i<l;i++)
{var c=cs[i];if(c.subformName!=null&&this.subformName==null)
{this.subformName=c.subformName;}
if(c.refDataServices!=null)
{this.refDataServices=c.refDataServices;}
if(c.styleURL!=null)
{c.styleURL=this._convertURLForSubForm(c.styleURL);}}
if(this.dataBinding!=null)
{this.replaceTargetNode=[{sourceNodeIndex:"0",dataBinding:this.dataBinding}];}
else
{throw new ConfigurationException("LOVSubformGUIAdaptor, no dataBinding specified for adaptor id = "+this.getId()+", this is a mandatory configuration property!");}
if(null==this.subformName)
{var ac=Services.getAppController();this.subformName=ac.getCurrentForm().getName();}
if(this.m_isFiltered&&this.columns!=null)
{var db=LOVSubformGUIAdaptor.LOV_FILTERS_DATABINDING_ROOT+"/"+this.getId()+"_grid_column_filter_col";for(var i=0,l=this.columns.length;i<l;i++)
{var col=this.columns[i];if(null==col.filterXPath)
{col.filterXPath=db+i;}}}
PopupSubformGUIAdaptor.prototype._configure.call(this,cs);}
LOVSubformGUIAdaptor.prototype._viewLoaded=function()
{if(this.m_styleURL!=null)
{var headElement=GUIUtils.getDocumentHeadElement(this.m_subformView._getDocument());GUIUtils.createStyleLinkElement(headElement,this.m_styleURL,null);}
this._initialiseSubForm();}
LOVSubformGUIAdaptor.prototype._initialiseSubForm=function()
{if(!this.m_subformInitialised)
{this._copyConfigToSubForm();}
PopupSubformGUIAdaptor.prototype._initialiseSubForm.call(this);if(!this.destroyOnClose)
{var iframeWindow=this.m_subformView._getWindow();var thisObj=this;this.m_enableLifeCyclesTimeout=iframeWindow.setTimeout(function(){thisObj._enableLifeCycles();},0);}}
LOVSubformGUIAdaptor.prototype._getSubformURL=function()
{var ac=Services.getAppController();return subformURL=ac.getURLForFrameworkSubForm(LOVSubformGUIAdaptor.LOV_SUBFORM_VIEW_URL)+"?cols="+this._convertColumnConfigToEvalString()+"&label="+this.m_label+"&rows="+this.m_rows+"&groupSize="+this.m_groupSize+"&isFiltered="+this.m_isFiltered;}
LOVSubformGUIAdaptor.prototype._copyConfigToSubForm=function()
{var iframeWindow=this.m_subformView._getWindow();var thisObj=this;var gridDataBinding=LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT+"/"+XPathUtils.getTrailingNode(this.dataBinding);var subFormConfig={cancelLifeCycle:{eventBinding:{keys:[{key:Key.F4,element:"subform"}],enableOn:[LOVSubformGUIAdaptor.CANCEL_ENABLED],isEnabled:function(){return thisObj._isCancelLifeCycleEnabled();}},raiseWarningIfDOMDirty:false},submitLifeCycle:{eventBinding:{doubleClicks:[{element:"frameworkLOVSubFormGrid"}],enableOn:[LOVSubformGUIAdaptor.SUBMIT_ENABLED],isEnabled:function(){return thisObj._isSubmitLifeCycleEnabled();}},returnSourceNodes:[gridDataBinding],postSubmitAction:{close:{}}},modifyLifeCycle:{dataBinding:LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT,srcXPath:this.dataBinding,initialise:{dataBinding:LOVSubformGUIAdaptor.LOV_DATABINDING_ROOT,srcXPath:this.dataBinding,markAsDirty:true}},startupState:{mode:FormLifeCycleStates.FORM_MODIFY}};if(this.refDataServices!=null)
{var refDataServices=new Array(this.refDataServices.length);for(var i=0,l=this.refDataServices.length;i<l;i++)
{refDataServices[i]=this.refDataServices[i];var fileName=refDataServices[i].fileName;if(fileName!=null)
{refDataServices[i].fileName=this._convertURLForSubForm(fileName);}}
subFormConfig.refDataServices=refDataServices;}
iframeWindow["subform"]=subFormConfig;iframeWindow["frameworkLOVSubFormGrid"]={dataBinding:gridDataBinding,srcData:this.srcData,srcDataOn:this.srcDataOn,rowXPath:this.rowXPath,keyXPath:this.keyXPath,columns:this.columns,multipleSelection:this.multipleSelection};iframeWindow["submit_button"]={inactiveWhilstHandlingEvent:false,actionBinding:function(){thisObj._handleSubmit();}}
iframeWindow["cancel_button"]={inactiveWhilstHandlingEvent:false,actionBinding:function(){thisObj._handleCancel();}}}
LOVSubformGUIAdaptor.prototype._isSubmitLifeCycleEnabled=function()
{var fc=this.m_subformView.getFormController();var dm=fc.getDataModel();var v=dm.getValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED);return(v==null||v=="true")?true:false;}
LOVSubformGUIAdaptor.prototype._isCancelLifeCycleEnabled=function()
{var fc=this.m_subformView.getFormController();var dm=fc.getDataModel();var v=dm.getValue(LOVSubformGUIAdaptor.CANCEL_ENABLED);return(v==null||v=="true")?true:false;}
LOVSubformGUIAdaptor.prototype._handleSubmit=function()
{var fc=this.m_subformView.getFormController();var dm=fc.getDataModel();dm.setValue(LOVSubformGUIAdaptor.CANCEL_ENABLED,"false");var thisObj=this;setTimeout(function(){thisObj._dispatchSubmitEvent();},0);}
LOVSubformGUIAdaptor.prototype._dispatchSubmitEvent=function()
{if(this.m_subformView!=null)
{var fc=this.m_subformView.getFormController();fc.dispatchBusinessLifeCycleEvent("subform",BusinessLifeCycleEvents.EVENT_SUBMIT);}}
LOVSubformGUIAdaptor.prototype._handleCancel=function()
{var fc=this.m_subformView.getFormController();var dm=fc.getDataModel();dm.setValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED,"false");var thisObj=this;setTimeout(function(){thisObj._dispatchCancelEvent();},0);}
LOVSubformGUIAdaptor.prototype._dispatchCancelEvent=function()
{if(this.m_subformView!=null)
{var fc=this.m_subformView.getFormController();fc.dispatchBusinessLifeCycleEvent("subform",BusinessLifeCycleEvents.EVENT_CANCEL);}}
LOVSubformGUIAdaptor.prototype._enableLifeCycles=function()
{var iframeWindow=this.m_subformView._getWindow();var fc=this.m_subformView.getFormController();if(this.m_enableLifeCyclesTimeout!=null)
{iframeWindow.clearTimeout(this.m_enableLifeCyclesTimeout);this.m_enableLifeCyclesTimeout=null;}
if(fc!=null)
{var dm=fc.getDataModel();dm.setValue(LOVSubformGUIAdaptor.SUBMIT_ENABLED,"true");dm.setValue(LOVSubformGUIAdaptor.CANCEL_ENABLED,"true");}
else
{var thisObj=this;this.m_enableLifeCyclesTimeout=iframeWindow.setTimeout(function(){thisObj._enableLifeCycles();},0);}}
LOVSubformGUIAdaptor.prototype._getColumnHeaderTitle=function(column,columnNumber)
{if(column&&column!="")
{if(column.indexOf("&nbsp;")==-1)
{return column;}
else
{return column.replace(/&nbsp;/g," ");}}
else
{return"col"+columnNumber;}}
LOVSubformGUIAdaptor.prototype._convertColumnConfigToEvalString=function()
{var evalString="new Array(";for(var i=0,l=this.m_headerColumns.length;i<l;i++)
{evalString+="\""+this._getColumnHeaderTitle(this.m_headerColumns[i],i)+"\"";if(i+1<l)
{evalString+=", ";}}
evalString+=")";return evalString;}
LOVSubformGUIAdaptor.prototype._convertURLForSubForm=function(fileURL)
{var ac=Services.getAppController();if(this.m_formURL==null)
{var formURL=ac.getURLForForm(ac.getCurrentForm().getName());this.m_formURL=formURL.substring(0,formURL.lastIndexOf('/'));}
if(fileURL.indexOf(this.m_formURL)==-1)
{if(fileURL.indexOf('/')==0)
{fileURL=this.m_formURL+fileURL;}
else if(fileURL.indexOf('./')==0)
{fileURL=this.m_formURL+fileURL.substring(1,fileURL.length);}
else if(fileURL.indexOf('../')==0)
{var formURLFolders=this.m_formURL.split('/');var re=/(\.\.\/)/gm;var fileURLMatches=fileURL.match(re);var count=formURLFolders.length-fileURLMatches.length-1;if(count>1)
{baseURL='/';for(var i=1;i<=count;i++)
{baseURL+=(formURLFolders[i]+"/");}}
else
{baseURL=ac.m_config.getAppBaseURL()+'/';}
var index=fileURL.lastIndexOf('../');fileURL=baseURL+fileURL.slice(index+3);}
else
{fileURL=this.m_formURL+'/'+fileURL;}}
return fileURL;}
LOVSubformGUIAdaptor.prototype._dispose=function()
{this.m_renderer=null;PopupSubformGUIAdaptor.prototype._dispose.call(this);}
LOVSubformGUIAdaptor.prototype._destroySubForm=function()
{this._removeConfigFromSubForm();PopupSubformGUIAdaptor.prototype._destroySubForm.call(this);}
LOVSubformGUIAdaptor.prototype._removeConfigFromSubForm=function()
{if(null!=this.m_subformView)
{var iframeWindow=this.m_subformView._getWindow();var subformConfig=iframeWindow["subform"];if(null!=subformConfig)
{for(var i in subformConfig)
{subformConfig[i]=null;}
subformConfig=null;iframeWindow["subform"]=null;}
var gridConfig=iframeWindow["frameworkLOVSubFormGrid"];if(null!=gridConfig)
{for(var j in gridConfig)
{gridConfig[j]=null;}
gridConfig=null;iframeWindow["frameworkLOVSubFormGrid"]=null;}
var submitConfig=iframeWindow["submit_button"];if(null!=submitConfig)
{for(var j in submitConfig)
{submitConfig[j]=null;}
submitConfig=null;iframeWindow["submit_button"]=null;}
var cancelConfig=iframeWindow["cancel_button"];if(null!=cancelConfig)
{for(var j in cancelConfig)
{cancelConfig[j]=null;}
cancelConfig=null;iframeWindow["cancel_button"]=null;}
iframeWindow=null;}}
function ManageUsersGUIAdaptor(){}
ManageUsersGUIAdaptor.m_logger=new Category("ManageUsersGUIAdaptor");ManageUsersGUIAdaptor.SAVE="_Save";ManageUsersGUIAdaptor.CLOSE="_Close";ManageUsersGUIAdaptor.prototype=new HTMLElementGUIAdaptor();ManageUsersGUIAdaptor.prototype.constructor=ManageUsersGUIAdaptor;GUIAdaptor._setUpProtocols('ManageUsersGUIAdaptor');GUIAdaptor._addProtocol('ManageUsersGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('ManageUsersGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('ManageUsersGUIAdaptor','ReadOnlyProtocol');ManageUsersGUIAdaptor.create=function(e)
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("create()");var a=new ManageUsersGUIAdaptor();a._initialiseAdaptor(e);return a;}
ManageUsersGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_initialiseAdaptor()");HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_adminRoles=null;this.m_closeForm=null;}
ManageUsersGUIAdaptor.prototype._dispose=function()
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("dispose()");this.m_renderer.dispose();this.m_renderer=null;}
ManageUsersGUIAdaptor.prototype._configure=function(cs)
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_configure()");var fc=FormController.getInstance();var cm=fc.getFormView().getConfigManager();var muId=this.getId();var epId=muId+ManageUsersRenderer.EP_ADAPTOR;var thisObj=this;var a=fc.getAdaptorById(muId+ManageUsersRenderer.SP_ADAPTOR);a._setAdaptorDataBinding(this.dataBinding);a=fc.getAdaptorById(epId);a._setAdaptorDataBinding(this.dataBinding);this.m_adminRoles=cm.getConfig(muId)[0].adminRoles;if(null==this.m_adminRoles)
{throw new ConfigurationException("No administrator role(s) specified for: "+muId);}
a=fc.getAdaptorById(muId+ManageUsersRenderer.EDIT_PANEL);cm.setConfig(a.getId(),{readOnlyOn:["/"],isReadOnly:function(){return(thisObj._isEditPanelReadOnly());}});cm.setConfig(epId,{adminRoles:this.m_adminRoles});cm.setConfig(muId+ManageUsersGUIAdaptor.SAVE,{actionBinding:function(){thisObj._handleSave();},enableOn:[this.dataBinding+"/"+EditPanelGUIAdaptor.MODIFIED_FLAG],isEnabled:function(){return(thisObj._isSaveEnabled());}});this.m_closeForm=cm.getConfig(muId)[0].closeForm;if(null==this.m_closeForm)
{throw new ConfigurationException("No form specified for Close button navigation: "+muId);}
cm.setConfig(muId+ManageUsersGUIAdaptor.CLOSE,{actionBinding:function(){thisObj._handleClose();}});}
ManageUsersGUIAdaptor.prototype._isEditPanelReadOnly=function()
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_isEditPanelReadOnly()");return(!Services.hasAccessToRoles(this.m_adminRoles));}
ManageUsersGUIAdaptor.prototype._handleClose=function()
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_handleClose()");var v=Services.getValue(this.dataBinding+"/"+EditPanelGUIAdaptor.MODIFIED_FLAG);if(v=="true")
{var thisObj=this;var msg="Changes have been made but not saved. Do you wish to continue?";Services.showDialog(StandardDialogTypes.YES_NO,function(b){thisObj._handleContinue(b)},msg,"Information");}
else
{Services.navigate(this.m_closeForm,false);}}
ManageUsersGUIAdaptor.prototype._handleContinue=function(b)
{switch(b)
{case StandardDialogButtonTypes.YES:{Services.navigate(this.m_closeForm,false);break;}
case StandardDialogButtonTypes.NO:{break;}}}
ManageUsersGUIAdaptor.prototype._isSaveEnabled=function()
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_isSaveEnabled()");var v=Services.getValue(this.dataBinding+"/"+EditPanelGUIAdaptor.MODIFIED_FLAG);return(v=="false"||v==null?false:true);}
ManageUsersGUIAdaptor.prototype._handleSave=function()
{if(ManageUsersGUIAdaptor.m_logger.isTrace())ManageUsersGUIAdaptor.m_logger.trace("_handleSave()");var userId=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.USER_ID);var courtCode=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.COURT_CODE);EditPanelGUIAdaptor.updateRoles(userId,courtCode,this.dataBinding);}
function ManageUsersRenderer(){}
ManageUsersRenderer.prototype=new Renderer();ManageUsersRenderer.prototype.constructor=ManageUsersRenderer;ManageUsersRenderer.m_logger=new Category("ManageUsersRenderer");ManageUsersRenderer.CSS_CLASS_NAME="manage_users";ManageUsersRenderer.SEARCH_PANEL="_spPanel";ManageUsersRenderer.EDIT_PANEL="_epPanel";ManageUsersRenderer.SP_ADAPTOR="_spAdaptor";ManageUsersRenderer.EP_ADAPTOR="_epAdaptor";ManageUsersRenderer.createInline=function(id)
{var e=Renderer.createInline(id,false);return ManageUsersRenderer._create(e);}
ManageUsersRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return ManageUsersRenderer._create(e);}
ManageUsersRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return ManageUsersRenderer._create(e);}
ManageUsersRenderer._create=function(e)
{e.className=ManageUsersRenderer.CSS_CLASS_NAME;var mu=new ManageUsersRenderer();mu._initRenderer(e);var muId=e.id;var panel=Renderer.createElementAsChild(e,"div");panel.className=PanelGUIAdaptor.CSS_CLASS_NAME;panel.setAttribute("align","center");panel.id=muId+ManageUsersRenderer.SEARCH_PANEL;SearchPanelRenderer.createAsChild(panel,muId+ManageUsersRenderer.SP_ADAPTOR);panel=Renderer.createElementAsChild(e,"div");panel.className=PanelGUIAdaptor.CSS_CLASS_NAME;panel.setAttribute("align","center");panel.id=muId+ManageUsersRenderer.EDIT_PANEL;EditPanelRenderer.createAsChild(panel,muId+ManageUsersRenderer.EP_ADAPTOR);ActionBarRenderer.createAsChild(e,muId+"_actionbar",[{id:muId+ManageUsersGUIAdaptor.SAVE,label:"Save"},{id:muId+ManageUsersGUIAdaptor.CLOSE,label:"Close"}],"status_line");return mu;}
ManageUsersRenderer.prototype.dispose=function()
{}
ManageUsersRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,readonly,inactive)
{}
function SearchPanelGUIAdaptor(){}
SearchPanelGUIAdaptor.m_logger=new Category("SearchPanelGUIAdaptor");SearchPanelGUIAdaptor.USER_ID="UserId";SearchPanelGUIAdaptor.COURT_CODE="CourtCode";SearchPanelGUIAdaptor.SEARCH="_Search";SearchPanelGUIAdaptor.prototype=new HTMLElementGUIAdaptor();SearchPanelGUIAdaptor.prototype.constructor=SearchPanelGUIAdaptor;GUIAdaptor._setUpProtocols('SearchPanelGUIAdaptor');GUIAdaptor._addProtocol('SearchPanelGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('SearchPanelGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('SearchPanelGUIAdaptor','ReadOnlyProtocol');SearchPanelGUIAdaptor.create=function(e)
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("create()");var a=new SearchPanelGUIAdaptor();a._initialiseAdaptor(e);return a;}
SearchPanelGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_initialiseAdaptor()");HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);this.m_rolesAdaptorId=null;}
SearchPanelGUIAdaptor.prototype._dispose=function()
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("dispose()");this.m_renderer.dispose();this.m_renderer=null;}
SearchPanelGUIAdaptor.prototype._configure=function(cs)
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_configure()");var cm=FormController.getInstance().getFormView().getConfigManager();var spId=this.getId();var userId=spId+"_"+SearchPanelGUIAdaptor.USER_ID;var userIdDataBinding=this.dataBinding+"/"+SearchPanelGUIAdaptor.USER_ID;cm.setConfig(userId,{dataBinding:userIdDataBinding,validateOn:[userIdDataBinding],validate:function(){return(thisObj._isUserIdValid());}});cm.setConfig(spId+"_"+SearchPanelGUIAdaptor.COURT_CODE,{dataBinding:this.dataBinding+"/"+SearchPanelGUIAdaptor.COURT_CODE});var thisObj=this;cm.setConfig(spId+SearchPanelGUIAdaptor.SEARCH,{actionBinding:function(){thisObj._handleSearch();},enableOn:[userIdDataBinding],isEnabled:function(){return(thisObj._isSearchEnabled());}});var ac=Services.getAppController();var securityService=ac.getSecurityServiceByName("getHomeCourt");var homeCourt=Services.getValue(securityService.getDataBinding());Services.setValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.COURT_CODE,homeCourt);}
SearchPanelGUIAdaptor.prototype._setAdaptorDataBinding=function(db)
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_setAdaptorDataBinding()");this.dataBinding=db;}
SearchPanelGUIAdaptor.prototype._isSearchEnabled=function()
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_isSearchEnabled()");var v=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.USER_ID);return((v==null||v.length==0||this._isUserIdValid()!=null)?false:true);}
SearchPanelGUIAdaptor.prototype._isUserIdValid=function()
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_isUserIdValid()");var v=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.USER_ID);var ec=null;return ec;}
SearchPanelGUIAdaptor.prototype._handleSearch=function()
{if(SearchPanelGUIAdaptor.m_logger.isTrace())SearchPanelGUIAdaptor.m_logger.trace("_handleSearch()");var userId=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.USER_ID);var courtCode=Services.getValue(this.dataBinding+"/"+SearchPanelGUIAdaptor.COURT_CODE);EditPanelGUIAdaptor.getRoles(userId,courtCode,this.dataBinding);}
function SearchPanelRenderer(){}
SearchPanelRenderer.prototype=new Renderer();SearchPanelRenderer.prototype.constructor=SearchPanelRenderer;SearchPanelRenderer.m_logger=new Category("SearchPanelRenderer");SearchPanelRenderer.CSS_CLASS_NAME="search_panel";SearchPanelRenderer.createInline=function(id)
{var e=Renderer.createInline(id,false);return SearchPanelRenderer._create(e);}
SearchPanelRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return SearchPanelRenderer._create(e);}
SearchPanelRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return SearchPanelRenderer._create(e);}
SearchPanelRenderer._create=function(e)
{e.className=SearchPanelRenderer.CSS_CLASS_NAME;var sp=new SearchPanelRenderer();sp._initRenderer(e);var spId=e.id;var table=Renderer.createElementAsChild(e,"table");var tBody=Renderer.createElementAsChild(table,"tbody");var tRow=Renderer.createElementAsChild(tBody,"tr");var tCell=Renderer.createElementAsChild(tRow,"td");var userId=spId+"_"+SearchPanelGUIAdaptor.USER_ID;var label=Renderer.createElementAsChild(tCell,"label");label.setAttribute("for",userId);label.innerHTML="User ID";tCell=Renderer.createElementAsChild(tRow,"td");var textBox=Renderer.createElementAsChild(tCell,"input");textBox.setAttribute("type","text");textBox.setAttribute("size","10");textBox.id=userId;tCell=Renderer.createElementAsChild(tRow,"td");courtCodeId=spId+"_"+SearchPanelGUIAdaptor.COURT_CODE;label=Renderer.createElementAsChild(tCell,"label");label.setAttribute("for",courtCodeId);label.innerHTML="Court Code";tCell=Renderer.createElementAsChild(tRow,"td");textBox=Renderer.createElementAsChild(tCell,"input");textBox.setAttribute("type","text");textBox.setAttribute("size","4");textBox.id=courtCodeId;tCell=Renderer.createElementAsChild(tRow,"td");tCell.setAttribute("width","25px");tCell=Renderer.createElementAsChild(tRow,"td");var button=document.createElement("input");button.setAttribute("type","button");button.setAttribute("value","Search");button.id=spId+SearchPanelGUIAdaptor.SEARCH;tCell.appendChild(button);return sp;}
SearchPanelRenderer.prototype.dispose=function()
{}
SearchPanelRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,readonly,inactive)
{}
function EditPanelGUIAdaptor(){}
EditPanelGUIAdaptor.m_logger=new Category("EditPanelGUIAdaptor");EditPanelGUIAdaptor.LEFT_ARROW="_LeftArrow";EditPanelGUIAdaptor.RIGHT_ARROW="_RightArrow";EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW="_DoubleLeftArrow";EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW="_DoubleRightArrow";EditPanelGUIAdaptor.ASSIGNED_ROLES="AssignedRoles";EditPanelGUIAdaptor.AVAILABLE_ROLES="AvailableRoles";EditPanelGUIAdaptor.ALL_ROLES="AllRoles";EditPanelGUIAdaptor.MODIFIED_FLAG="modified";EditPanelGUIAdaptor.prototype=new HTMLElementGUIAdaptor();EditPanelGUIAdaptor.prototype.constructor=EditPanelGUIAdaptor;GUIAdaptor._setUpProtocols('EditPanelGUIAdaptor');GUIAdaptor._addProtocol('EditPanelGUIAdaptor','DataBindingProtocol');GUIAdaptor._addProtocol('EditPanelGUIAdaptor','EnablementProtocol');GUIAdaptor._addProtocol('EditPanelGUIAdaptor','ReadOnlyProtocol');EditPanelGUIAdaptor.create=function(e)
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("create()");var a=new EditPanelGUIAdaptor();a._initialiseAdaptor(e);return a;}
EditPanelGUIAdaptor.prototype._initialiseAdaptor=function(e)
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_initialiseAdaptor()");HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this,e);}
EditPanelGUIAdaptor.prototype._dispose=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("dispose()");this.m_renderer.dispose();this.m_renderer=null;}
EditPanelGUIAdaptor.prototype._configure=function(cs)
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_configure()");var fc=FormController.getInstance();var cm=fc.getFormView().getConfigManager();var epId=this.getId();this._setModified(false);var gSrcData=this.dataBinding+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES;var gDataBinding=gSrcData+"Selected";var thisObj=this;cm.setConfig(epId+"_"+EditPanelGUIAdaptor.ASSIGNED_ROLES,{dataBinding:gDataBinding,srcData:gSrcData,rowXPath:"role",keyXPath:"id",columns:[{xpath:"."}],multipleSelection:true});cm.setConfig(epId+EditPanelRenderer.BUTTON_PANEL,{enableOn:["/"],isEnabled:function(){return(thisObj._isButtonPanelEnabled());}});cm.setConfig(epId+EditPanelGUIAdaptor.RIGHT_ARROW,{actionBinding:function(){thisObj._handleRightArrow();},enableOn:[gDataBinding+"//*"],isEnabled:function(){return(thisObj._isRightArrowEnabled());}});cm.setConfig(epId+EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW,{actionBinding:function(){thisObj._handleDoubleRightArrow();},enableOn:[gSrcData+"//*"],isEnabled:function(){return(thisObj._isDoubleRightArrowEnabled());}});gSrcData=this.dataBinding+"/"+EditPanelGUIAdaptor.AVAILABLE_ROLES;gDataBinding=gSrcData+"Selected";cm.setConfig(epId+EditPanelGUIAdaptor.LEFT_ARROW,{actionBinding:function(){thisObj._handleLeftArrow();},enableOn:[gDataBinding+"//*"],isEnabled:function(){return(thisObj._isLeftArrowEnabled());}});cm.setConfig(epId+EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW,{actionBinding:function(){thisObj._handleDoubleLeftArrow();},enableOn:[gSrcData+"//*"],isEnabled:function(){return(thisObj._isDoubleLeftArrowEnabled());}});cm.setConfig(epId+"_"+EditPanelGUIAdaptor.AVAILABLE_ROLES,{dataBinding:gDataBinding,srcData:gSrcData,rowXPath:"role",keyXPath:"id",columns:[{xpath:"."}],multipleSelection:true});var availableRoles=Services.getAppController().getAppRoles().getRolesNode();var dom=XML.createDOM(null,null,null);var allRolesNode=dom.createElement(EditPanelGUIAdaptor.ALL_ROLES);var roleNodes=availableRoles.selectNodes("/Roles/Role");for(var i=0,l=roleNodes.length;i<l;i++)
{var node=roleNodes[i].selectSingleNode(".");var roleNode=dom.createElement("role");var textNode=dom.createTextNode(node.getAttribute("name"));roleNode.appendChild(textNode);var text=node.getAttribute("id");if(text!=null){roleNode.setAttribute("id",text);}
text=node.getAttribute("parent");if(text!=null){roleNode.setAttribute("parent",text);}
allRolesNode.appendChild(roleNode);}
Services.replaceNode(this.dataBinding+"/"+EditPanelGUIAdaptor.ALL_ROLES,allRolesNode);}
EditPanelGUIAdaptor.prototype._setAdaptorDataBinding=function(db)
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_setAdaptorDataBinding()");this.dataBinding=db;}
EditPanelGUIAdaptor.prototype._setModified=function(flag)
{Services.setValue(this.dataBinding+"/"+EditPanelGUIAdaptor.MODIFIED_FLAG,flag.toString());}
EditPanelGUIAdaptor.prototype._handleRightArrow=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_handleRightArrow()");this._moveGridValues(EditPanelGUIAdaptor.ASSIGNED_ROLES,EditPanelGUIAdaptor.AVAILABLE_ROLES);}
EditPanelGUIAdaptor.prototype._handleLeftArrow=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_handleLeftArrow()");this._moveGridValues(EditPanelGUIAdaptor.AVAILABLE_ROLES,EditPanelGUIAdaptor.ASSIGNED_ROLES);}
EditPanelGUIAdaptor.prototype._handleDoubleRightArrow=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_handleDoubleRightArrow()");this._moveAllGridValues(EditPanelGUIAdaptor.ASSIGNED_ROLES,EditPanelGUIAdaptor.AVAILABLE_ROLES);}
EditPanelGUIAdaptor.prototype._handleDoubleLeftArrow=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_handleDoubleLeftArrow()");this._moveAllGridValues(EditPanelGUIAdaptor.AVAILABLE_ROLES,EditPanelGUIAdaptor.ASSIGNED_ROLES);}
EditPanelGUIAdaptor.prototype._isButtonPanelEnabled=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_isButtonPanelEnabled()");var cm=FormController.getInstance().getFormView().getConfigManager();var ar=cm.getConfig(this.getId())[0].adminRoles;if(ar!=null){return(Services.hasAccessToRoles(ar));}
else{return(true);}}
EditPanelGUIAdaptor.prototype._isRightArrowEnabled=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_isRightArrowEnabled()");var n=Services.countNodes(this.dataBinding+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES+"Selected/id");return(n>0);}
EditPanelGUIAdaptor.prototype._isLeftArrowEnabled=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_isLeftArrowEnabled()");var n=Services.countNodes(this.dataBinding+"/"+EditPanelGUIAdaptor.AVAILABLE_ROLES+"Selected/id");return(n>0);}
EditPanelGUIAdaptor.prototype._isDoubleRightArrowEnabled=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_isDoubleRightArrowEnabled()");var n=Services.countNodes(this.dataBinding+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES+"/role");return(n>0);}
EditPanelGUIAdaptor.prototype._isDoubleLeftArrowEnabled=function()
{if(EditPanelGUIAdaptor.m_logger.isTrace())EditPanelGUIAdaptor.m_logger.trace("_isDoubleLeftArrowEnabled()");var n=Services.countNodes(this.dataBinding+"/"+EditPanelGUIAdaptor.AVAILABLE_ROLES+"/role");return(n>0);}
EditPanelGUIAdaptor.prototype._moveGridValues=function(from,to)
{var dataBinding=this.dataBinding+"/"+from+"Selected"+"//*";var selectedNodes=Services.getNodes(dataBinding);Services.startTransaction();for(var i=0,l=selectedNodes.length;i<l;i++)
{var roleId=selectedNodes[i].text;dataBinding=this.dataBinding+"/"+from+"/role[./id="+roleId+"]";var value=Services.getValue(dataBinding);if(value!=null)
{var roleNode=Services.getNode(dataBinding);var id=roleNode.selectSingleNode("id");roleNode.removeChild(id);Services.removeNode(dataBinding);Services.addNode(roleNode,this.dataBinding+"/"+to);}}
Services.endTransaction();Services.replaceNode(this.dataBinding+"/"+from+"Selected",null);this._setModified(true);}
EditPanelGUIAdaptor.prototype._moveAllGridValues=function(from,to)
{var nodes=Services.getNodes(this.dataBinding+"/"+from+"/*/id");for(var i=0,l=nodes.length;i<l;i++)
{Services.setValue(this.dataBinding+"/"+from+"Selected/id[position()="+(i+1)+"]",nodes[i].text);}
this._moveGridValues(from,to);}
EditPanelGUIAdaptor.getRoles=function(userId,courtCode,db)
{var params=new ServiceParams();params.addSimpleParameter("userId",userId);params.addSimpleParameter("courtId",courtCode);var callback=new Object();callback.userId=userId;callback.dataBinding=db;callback.onSuccess=EditPanelGUIAdaptor.ongetRolesSuccess;callback.onError=EditPanelGUIAdaptor.ongetRolesError;Services.callService("getRoles",params,callback,true);}
EditPanelGUIAdaptor.ongetRolesSuccess=function(dom)
{var assignedNode=dom.createElement(EditPanelGUIAdaptor.ASSIGNED_ROLES);var roleNodes=dom.selectNodes("/roles/role");for(var i=0,l=roleNodes.length;i<l;i++)
{var node=roleNodes[i].selectSingleNode(".");assignedNode.appendChild(node);}
Services.replaceNode(this.dataBinding+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES,assignedNode);var availableNode=dom.createElement(EditPanelGUIAdaptor.AVAILABLE_ROLES);var roleNodes=Services.getNodes(this.dataBinding+"/"+EditPanelGUIAdaptor.ALL_ROLES+"/role");for(var i=0,l=roleNodes.length;i<l;i++)
{var node=roleNodes[i].selectSingleNode(".");var value=Services.getValue(this.dataBinding+"/"+
EditPanelGUIAdaptor.ASSIGNED_ROLES+"/role[text()=\""+node.childNodes(0).text+"\"]");if(null==value)
{availableNode.appendChild(node);}}
Services.replaceNode(this.dataBinding+"/"+EditPanelGUIAdaptor.AVAILABLE_ROLES,availableNode);}
EditPanelGUIAdaptor.ongetRolesError=function(ex)
{Services.showDialog(StandardDialogTypes.OK,function(b){},"Error getting assigned roles from server: "+ex.message,"Error");}
EditPanelGUIAdaptor.updateRoles=function(userId,courtCode,db)
{var noOfRoles=Services.countNodes(db+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES+"/role");if(0==noOfRoles)
{throw new ConfigurationException("No assigned roles to update, check data binding");}
var dom=XML.createDOM(null,null,null);var rolesNode=dom.createElement("roles");for(var i=0;i<noOfRoles;i++)
{var roleNode=dom.createElement("role");var value=Services.getValue(db+"/"+EditPanelGUIAdaptor.ASSIGNED_ROLES+"/role[position()="+(i+1)+"]");var roleText=dom.createTextNode(value);roleNode.appendChild(roleText);rolesNode.appendChild(roleNode);}
dom.appendChild(rolesNode);var params=new ServiceParams();params.addSimpleParameter("userId",userId);params.addSimpleParameter("courtId",courtCode);params.addDOMParameter("roles",dom);var callback=new Object();callback.dataBinding=db;callback.onSuccess=EditPanelGUIAdaptor.onupdateUserRolesSuccess;callback.onError=EditPanelGUIAdaptor.onupdateUserRolesError;Services.callService("updateUserRoles",params,callback,true);}
EditPanelGUIAdaptor.onupdateUserRolesSuccess=function(dom)
{Services.setValue(this.dataBinding+"/"+EditPanelGUIAdaptor.MODIFIED_FLAG,"false");}
EditPanelGUIAdaptor.onupdateUserRolesError=function(ex)
{Services.showDialog(StandardDialogTypes.OK,function(b){},"Error saving assigned roles: "+ex.message,"Error");}
function EditPanelRenderer(){}
EditPanelRenderer.prototype=new Renderer();EditPanelRenderer.prototype.constructor=EditPanelRenderer;EditPanelRenderer.m_logger=new Category("EditPanelRenderer");EditPanelRenderer.CSS_CLASS_NAME="edit_panel";EditPanelRenderer.BUTTON_PANEL="_epButtonPanel";EditPanelRenderer.createInline=function(id)
{var e=Renderer.createInline(id,false);return EditPanelRenderer._create(e);}
EditPanelRenderer.createAsInnerHTML=function(refElement,relativePos,id)
{var e=Renderer.createAsInnerHTML(refElement,relativePos,id,false);return EditPanelRenderer._create(e);}
EditPanelRenderer.createAsChild=function(p,id)
{var e=Renderer.createAsChild(id);p.appendChild(e);return EditPanelRenderer._create(e);}
EditPanelRenderer._create=function(e)
{e.className=EditPanelRenderer.CSS_CLASS_NAME;var ep=new EditPanelRenderer();ep._initRenderer(e);var epId=e.id;table=Renderer.createElementAsChild(e,"table");table.className="roles_layout";tBody=Renderer.createElementAsChild(table,"tbody");tRow=Renderer.createElementAsChild(tBody,"tr");tCell=Renderer.createElementAsChild(tRow,"th");tCell.setAttribute("align","center");tCell.innerHTML="Assigned Roles";tCell=Renderer.createElementAsChild(tRow,"td");tCell=Renderer.createElementAsChild(tRow,"th");tCell.setAttribute("align","center");tCell.innerHTML="Available Roles";tRow=Renderer.createElementAsChild(tBody,"tr");tCell=Renderer.createElementAsChild(tRow,"td");var gridId=epId+"_"+EditPanelGUIAdaptor.ASSIGNED_ROLES;Grid.createAsChild(tCell,gridId,["Role Name"],10,1);tCell=Renderer.createElementAsChild(tRow,"td");var panel=Renderer.createElementAsChild(tCell,"div");panel.className=PanelGUIAdaptor.CSS_CLASS_NAME;panel.id=epId+EditPanelRenderer.BUTTON_PANEL;button=document.createElement("input");button.setAttribute("type","button");button.setAttribute("value",">");button.id=epId+EditPanelGUIAdaptor.RIGHT_ARROW;button.className="arrow_button";panel.appendChild(button);Renderer.createElementAsChild(panel,"br");button=document.createElement("input");button.setAttribute("type","button");button.setAttribute("value",">>");button.id=epId+EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW;button.className="arrow_button";panel.appendChild(button);Renderer.createElementAsChild(panel,"br");Renderer.createElementAsChild(panel,"br");button=document.createElement("input");button.setAttribute("type","button");button.setAttribute("value","<");button.id=epId+EditPanelGUIAdaptor.LEFT_ARROW;button.className="arrow_button";panel.appendChild(button);Renderer.createElementAsChild(panel,"br");button=document.createElement("input");button.setAttribute("type","button");button.setAttribute("value","<<");button.id=epId+EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW;button.className="arrow_button";panel.appendChild(button);tCell=Renderer.createElementAsChild(tRow,"td");gridId=epId+"_"+EditPanelGUIAdaptor.AVAILABLE_ROLES;Grid.createAsChild(tCell,gridId,["Role Name"],10,1);return ep;}
EditPanelRenderer.prototype.dispose=function()
{}
EditPanelRenderer.prototype.render=function(disabled,focussed,mandatory,invalid,readonly,inactive)
{}
function GUIAdaptorFactory()
{this._initGUIAdaptorFactory();}
GUIAdaptorFactory.m_logger=new Category("GUIAdaptorFactory");GUIAdaptorFactory.prototype.m_adaptors=null;GUIAdaptorFactory.prototype.m_externalComponents=null;GUIAdaptorFactory.prototype._initGUIAdaptorFactory=function()
{this.m_externalComponents=new Array();this.m_adaptors=null;}
GUIAdaptorFactory.prototype.bindView=function(htmlDoc)
{return this._parseElement(htmlDoc.body,null,false);}
GUIAdaptorFactory.prototype.parseElement=function(e,initialContainer)
{return this._parseElement(e,initialContainer,true);}
GUIAdaptorFactory.prototype._parseElement=function(e,initialContainer,parseSelf)
{this.m_adaptors=new Array();this.m_containerStack=new Array();if(null!=initialContainer)
{this.m_containerStack.push(initialContainer);}
if(parseSelf)
{this._handleElement(e);}
else
{this.parseChildren(e);}
var adaptors=this.m_adaptors;this.m_adaptors=null;this.m_containerStack=null;return adaptors;}
GUIAdaptorFactory.prototype.register=function(registration)
{if(GUIAdaptorFactory.m_logger.isInfo())GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory.register("+registration+")");var className=""+registration.getClassName();this.m_externalComponents[className]=registration;}
GUIAdaptorFactory.prototype.parseChildren=function(p)
{var cNs=p.childNodes;for(var i=0,l=cNs.length;i<l;i++)
{var containerAtStart=this.m_containerStack[this.m_containerStack.length-1];var n=cNs[i];if(1==n.nodeType)
{this._handleElement(n);}
var containerAtEnd=this.m_containerStack[this.m_containerStack.length-1];if(containerAtStart!=containerAtEnd)
{this.m_containerStack.pop();}}}
GUIAdaptorFactory.prototype._handleElement=function(e)
{if(e.id.length==0)
{this.parseChildren(e);}
else
{switch(e.nodeName)
{case'FORM':{if(e.className!=SubformElementGUIAdaptor.CSS_CLASS)
{this._addAdaptor(FormElementGUIAdaptor.create(e));}
else
{this._addAdaptor(SubformElementGUIAdaptor.create(e));}
this.parseChildren(e);break;}
case'INPUT':{this._handleInput(e);break;}
case'TEXTAREA':{this._addAdaptor(TextAreaElementGUIAdaptor.create(e));break;}
case'SELECT':{this._addAdaptor(SelectElementGUIAdaptor.create(e));break;}
case'DIV':{this._handleDiv(e);break;}
default:{this.parseChildren(e);}}}}
GUIAdaptorFactory.prototype._handleInput=function(e)
{switch(e.type)
{case'button':{this._addAdaptor(ButtonInputElementGUIAdaptor.create(e));break;}
case'checkbox':{this._addAdaptor(CheckboxInputElementGUIAdaptor.create(e));break;}
case'text':{if(e.className=="datetext")
{this._addAdaptor(DateTextInputElementGUIAdaptor.create(e));}
else
{this._addAdaptor(TextInputElementGUIAdaptor.create(e));}
break;}
case'password':{this._addAdaptor(TextInputElementGUIAdaptor.create(e));break;}
case'radio':{this._addAdaptor(RadioInputElementGUIAdaptor.create(e));break;}
case'reset':case'submit':{fc_assertAlways("Input element of type "+e.type+" not allowed on forms");break;}
default:{fc_assertAlways("Input element of type "+e.type+" not supported");break;}}}
GUIAdaptorFactory.prototype._handleDiv=function(e)
{var cN=e.className
if(cN!="")
{switch(cN)
{case PanelGUIAdaptor.CSS_NO_MARGIN_CLASS_NAME:case PanelGUIAdaptor.CSS_CLASS_NAME:{this._addAdaptor(PanelGUIAdaptor.create(e));this.parseChildren(e);break;}
case FilteredGrid.CSS_CLASS_NAME:{this._addAdaptor(FilteredGridGUIAdaptor.create(e));this.parseChildren(e);break;}
case GridRenderer.CSS_CLASS_NAME:{this._addAdaptor(GridGUIAdaptor.create(e));break;}
case TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME:{this._addAdaptor(TabSelectorGUIAdaptor.create(e));break;}
case PagedAreaGUIAdaptor.CSS_CLASS_NAME:{this._addAdaptor(PagedAreaGUIAdaptor.create(e));this.parseChildren(e);break;}
case PageGUIAdaptor.CSS_CLASS_NAME:{this._addAdaptor(PageGUIAdaptor.create(e));this.parseChildren(e);break;}
case DynamicPageGUIAdaptor.CSS_CLASS_NAME:{this._addAdaptor(DynamicPageGUIAdaptor.create(e));break;}
case LOVPopupRenderer.LOV_POPUP_CSS_CLASS:{this._addAdaptor(LOVPopupGUIAdaptor.create(e));this.parseChildren(e);break;}
case DatePickerRenderer.CSS_CLASS_NAME:{this._addAdaptor(DatePickerGUIAdaptor.create(e));break;}
case LogicGUIAdaptor.LOGIC_CSS_CLASS_NAME:{this._addAdaptor(LogicGUIAdaptor.create(e));break;}
case AutoCompletionRenderer.CSS_CLASS_NAME:{this._addAdaptor(AutocompletionGUIAdaptor.create(e));break;}
case FwSelectElementRenderer.CSS_CLASS_NAME:{this._addAdaptor(FwSelectElementGUIAdaptor.create(e));break;}
case PopupRenderer.CSS_CLASS_NAME:case PopupRenderer.CSS_CLASS_NAME_FULLPAGE:{this._addAdaptor(PopupGUIAdaptor.create(e));this.parseChildren(e);break;}
case LoginRenderer.CSS_LOGIN_CLASS_NAME:{this._addAdaptor(LoginGUIAdaptor.create(e));this.parseChildren(e);break;}
case ZoomFieldRenderer.CSS_CLASS_NAME:{this._addAdaptor(ZoomFieldGUIAdaptor.create(e));this.parseChildren(e);break;}
case WordProcessingGUIAdaptor.CSS_CLASS_NAME:{this._addAdaptor(WordProcessingGUIAdaptor.create(e));break;}
case PopupSubformGUIAdaptor.CSS_CLASS_NAME:case PopupSubformGUIAdaptor.CSS_CLASS_NAME_FULLPAGE:{this._addAdaptor(PopupSubformGUIAdaptor.create(e));break;}
case LOVSubformRenderer.LOV_SUBFORM_CSS_CLASS:case LOVSubformGUIAdaptor.LOV_SUBFORM_CSS_CLASS_NAME_FULLPAGE:{this._addAdaptor(LOVSubformGUIAdaptor.create(e));break;}
case ManageUsersRenderer.CSS_CLASS_NAME:{this._addAdaptor(ManageUsersGUIAdaptor.create(e));this.parseChildren(e);break;}
case EditPanelRenderer.CSS_CLASS_NAME:{this._addAdaptor(EditPanelGUIAdaptor.create(e));this.parseChildren(e);break;}
case SearchPanelRenderer.CSS_CLASS_NAME:{this._addAdaptor(SearchPanelGUIAdaptor.create(e));this.parseChildren(e);break;}
case TabSelector.TABBED_AREA_CSS_CLASS_NAME:case ActionBarRenderer.CSS_CLASS_NAME:{this.parseChildren(e);break;}
case AsyncMonitorRenderer.CSS_CLASS_NAME:{this._addAdaptor(AsyncMonitorGUIAdaptor.create(e));this.parseChildren(e);break;}
case MenuBarRenderer.MENU_BASE_DIV:{var a=MenuBarGUIAdaptor.create(e);this._addAdaptor(a);this.parseChildren(e);break;}
case MenuRenderer.MENU_BAR_BUTTON:{var a=MenuGUIAdaptor.create(e);this._addAdaptor(a);break;}
default:{var ret=this._handleExternalAdaptor(e);if(!ret)
{this.parseChildren(e);}
break;}}}
else
{this.parseChildren(e);}}
GUIAdaptorFactory.prototype._handleExternalAdaptor=function(e)
{if(GUIAdaptorFactory.m_logger.isInfo())GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor(id: "+e.id+") looking for externally registered component "+e.className);fc_assert(e.nodeName=='DIV',"Can only handle external adaptors of type DIV");var cN=e.className;if(null!=cN)
{var a=null;var r=this.m_externalComponents[cN];if(null!=r)
{var f=r.getFactory();if(GUIAdaptorFactory.m_logger.isInfo())GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor() found externally registered component, factory = "+f);var index=this._reserveAdaptorPosition(function(){});var a=f.call(null,e,this);if(GUIAdaptorFactory.m_logger.isInfo())GUIAdaptorFactory.m_logger.info("GUIAdaptorFactory._handleExternalAdaptor() factory created the following adaptor = "+a);this._addAdaptor(a,index);}}
return a!=null;}
GUIAdaptorFactory.prototype._reserveAdaptorPosition=function(f)
{var index=this.m_adaptors.length;this.m_adaptors[this.m_adaptors.length]=f;return index;}
GUIAdaptorFactory.prototype._addAdaptor=function(a,index)
{a.setParentContainer(this.m_containerStack[this.m_containerStack.length-1]);if(null==index||index<0||index>this.m_adaptors.length)
{this.m_adaptors[this.m_adaptors.length]=a;}
else
{this.m_adaptors[index]=a;}
var id=a.getId();this.m_adaptors[id]=a;if(a.isAContainer)
{this.m_containerStack.push(a);}}
GUIAdaptorFactory.prototype.dispose=function()
{for(var i in this.m_externalComponents)
{this.m_externalComponents[i].dispose();this.m_externalComponents[i]=null;}
delete this.m_externalComponents;}
function ErrorCode(errorId,message)
{this.m_message=message;this.m_errorId=errorId;}
ErrorCode.getErrorCode=function(errorId)
{var message=Services.getAppController().getErrorMsgForCode(errorId);var arguments=ErrorCode.getErrorCode.arguments;for(var i=1,l=arguments.length,index=0;i<l;i++)
{index=message.indexOf("${"+String(i)+"}",index);if(index!=-1)
{var re=new RegExp("\\$\\{"+String(i)+"\\}","i");message=message.replace(re,String(arguments[i]));}}
return new ErrorCode(errorId,message);}
ErrorCode.prototype.getMessage=function()
{return this.m_message;}
function EventQueue()
{}
EventQueue.m_logger=new Category("EventQueue");EventQueue.prototype.m_queue=null;EventQueue.prototype.m_processingQueue=null;EventQueue.prototype._initEventQueue=function()
{this.m_queue=new Array();}
EventQueue.prototype.addEventToQueue=function(a,e,d)
{if(EventQueue.m_logger.isDebug())EventQueue.m_logger.debug(this.getName()+" check queued for GUIAdaptor: "+a.getId());this.m_queue.push({adaptor:a,event:e,detail:d});}
EventQueue.prototype.hasEvents=function()
{return this.m_queue.length>0;}
EventQueue.prototype.processEvents=function(repaintQueue)
{var name=this.getName()+"_EventQueue_processEvents";var q=this.m_queue;this.m_queue=new Array();if(EventQueue.m_logger.isInfo())
{EventQueue.m_logger.info(this.getName()+".processEvents() number of events = "+q.length);}
repaintQueue=this._processEvents(q,repaintQueue);return repaintQueue;}
EventQueue.prototype._processEvents=function(q,repaintQueue)
{for(var i=0,l=q.length;i<l;i++)
{this._processEvent(q[i],repaintQueue);}
return repaintQueue;}
EventQueue.prototype._processEvent=function(queuedItem,repaintQueue)
{var adaptor=queuedItem.adaptor;var event=queuedItem.event;var detail=queuedItem.detail;var id=adaptor.getId();var debug=EventQueue.m_logger.isDebug();if(debug)EventQueue.m_logger.debug(this.getName()+" event not previously processed for field: "+id);if(this.processEvent(adaptor,event,detail))
{if(debug)EventQueue.m_logger.debug(this.getName()+" requires repaint for field: "+id);repaintQueue[id]=adaptor;}
else
{if(debug)EventQueue.m_logger.debug(this.getName()+" no repaint required for field: "+id);}}
EventQueue.prototype.processEvent=function(adaptor,event,detail)
{return false;}
EventQueue.prototype.getName=function()
{return null;}
EventQueue.prototype.removeEventsForAdaptor=function(a)
{var nq=[];for(var i=0,q=this.m_queue,l=q.length;i<l;i++)
{var qi=q[i];if(qi.adaptor!=a)
{nq.push(qi);}}
this.m_queue=nq;}
function CompressedEventQueue()
{}
CompressedEventQueue.prototype=new EventQueue();CompressedEventQueue.prototype.constructor=CompressedEventQueue;CompressedEventQueue.prototype._processEvents=function(q,repaintQueue)
{var processedEvents=new Object();for(var i=0,l=q.length;i<l;i++)
{var qi=q[i];var eventId=this._createEventId(qi);if(null==processedEvents[eventId])
{processedEvents[eventId]=true;if(EventQueue.m_logger.isDebug())EventQueue.m_logger.debug(this.getName()+" event not previously processed for field: "+qi.adaptor.getId());this._processEvent(qi,repaintQueue);}
else
{if(EventQueue.m_logger.isDebug())EventQueue.m_logger.debug(this.getName()+" event already processed for field: "+qi.adaptor.getId());}}
return repaintQueue;}
CompressedEventQueue.prototype._createEventId=function(queuedItem)
{return queuedItem.adaptor.getId();}
function ValidationEventQueue()
{this._initEventQueue();}
ValidationEventQueue.prototype=new CompressedEventQueue();ValidationEventQueue.prototype.constructor=ValidationEventQueue;ValidationEventQueue.prototype.getName=function()
{return FormController.VALIDATION;}
ValidationEventQueue.prototype.processEvent=function(a,e)
{var error=a.invokeValidate(e);a.setLastError(error);return a.setValid(error==null);}
function ServerValidationEventQueue()
{this._initEventQueue();}
ServerValidationEventQueue.prototype=new CompressedEventQueue();ServerValidationEventQueue.prototype.constructor=ServerValidationEventQueue;ServerValidationEventQueue.prototype.getName=function()
{return FormController.SERVER_VALIDATION;}
ServerValidationEventQueue.prototype.processEvent=function(a,e)
{var repaint=a.invokeServerValidate(e);if(repaint==false)
{if(a.m_valid)
{a.setLastError(null);}
a.setServerValid(true);}
return repaint;}
function ReadOnlyEventQueue()
{this._initEventQueue();}
ReadOnlyEventQueue.prototype=new CompressedEventQueue();ReadOnlyEventQueue.prototype.constructor=ReadOnlyEventQueue;ReadOnlyEventQueue.prototype.getName=function()
{return FormController.READONLY;}
ReadOnlyEventQueue.prototype.processEvent=function(a,e)
{return a.setReadOnly(a.invokeIsReadOnly(e));}
function SrcDataEventQueue()
{this._initEventQueue();}
SrcDataEventQueue.prototype=new CompressedEventQueue();SrcDataEventQueue.prototype.constructor=SrcDataEventQueue;SrcDataEventQueue.prototype.getName=function()
{return FormController.SRCDATA;}
SrcDataEventQueue.prototype.processEvent=function(a,e)
{return a.invokeRetrieveSrcData(e);}
function SrcDataFilterEventQueue()
{this._initEventQueue();}
SrcDataFilterEventQueue.prototype=new CompressedEventQueue();SrcDataFilterEventQueue.prototype.constructor=SrcDataFilterEventQueue;SrcDataFilterEventQueue.prototype.getName=function()
{return FormController.FILTER;}
SrcDataFilterEventQueue.prototype.processEvent=function(a,e)
{return a.invokeFilterSrcData(e);}
function LogicEventQueue()
{this._initEventQueue();}
LogicEventQueue.prototype=new CompressedEventQueue();LogicEventQueue.prototype.constructor=LogicEventQueue;LogicEventQueue.prototype.getName=function()
{return FormController.LOGIC}
LogicEventQueue.prototype.processEvent=function(a,e)
{a.invokeLogic(e);return false;}
function MandatoryEventQueue()
{this._initEventQueue();}
MandatoryEventQueue.prototype=new CompressedEventQueue();MandatoryEventQueue.prototype.constructor=MandatoryEventQueue;MandatoryEventQueue.prototype.getName=function()
{return FormController.MANDATORY;}
MandatoryEventQueue.prototype.processEvent=function(a,e)
{var mandatory=a.invokeIsMandatory(e);return a.setMandatory(mandatory);}
function RefreshEventQueue()
{this._initEventQueue();}
RefreshEventQueue.prototype=new CompressedEventQueue();RefreshEventQueue.prototype.constructor=RefreshEventQueue;RefreshEventQueue.prototype.getName=function()
{return FormController.REFRESH;}
RefreshEventQueue.prototype.processEvent=function(a,e)
{return a.invokeRetrieve(e);}
function EnablementEventQueue()
{this._initEventQueue();}
EnablementEventQueue.prototype=new CompressedEventQueue();EnablementEventQueue.prototype.constructor=EnablementEventQueue;EnablementEventQueue.prototype.getName=function()
{return FormController.ENABLEMENT;}
EnablementEventQueue.prototype.processEvent=function(a,e,detail)
{return a.setEnabled(a.invokeIsEnabled(e),detail);}
EnablementEventQueue.prototype._createEventId=function(queuedItem)
{var id=queuedItem.adaptor.getId();var enablementSubComponentId=queuedItem.detail.m_detail;if(null!=enablementSubComponentId)
{id+="_"+enablementSubComponentId;}
return id;}
function LabelEventQueue()
{this._initEventQueue();}
LabelEventQueue.prototype=new CompressedEventQueue();LabelEventQueue.prototype.constructor=LabelEventQueue;LabelEventQueue.prototype.getName=function()
{return FormController.LABEL;}
LabelEventQueue.prototype.processEvent=function(a,e)
{return a.setLabel(a.invokeLabel(e));}
function DefaultEventQueue()
{this._initEventQueue();}
DefaultEventQueue.prototype=new CompressedEventQueue();DefaultEventQueue.prototype.constructor=DefaultEventQueue;DefaultEventQueue.prototype.getName=function()
{return FormController.DEFAULT;}
DefaultEventQueue.prototype.processEvent=function(a,e)
{a.invokeSetDefault(e);return false;}
function StateChangeEventQueue()
{this._initEventQueue();}
StateChangeEventQueue.prototype=new EventQueue();StateChangeEventQueue.prototype.constructor=StateChangeEventQueue;StateChangeEventQueue.prototype.getName=function()
{return FormController.STATECHANGE;}
StateChangeEventQueue.prototype.processEvent=function(a,e)
{return a.invokeUpdateAdaptorState(e);}
function FormDirtyEventQueue()
{this._initEventQueue();}
FormDirtyEventQueue.prototype=new CompressedEventQueue();FormDirtyEventQueue.prototype.constructor=FormDirtyEventQueue;FormDirtyEventQueue.prototype.getName=function()
{return FormController.FORMDIRTY;}
FormDirtyEventQueue.prototype.processEvent=function(a,e)
{return a.formDirtyUpdate(e);}
FormDirtyEventQueue.prototype.addEventToQueue=function(a,e,d)
{if(EventQueue.m_logger.isDebug())EventQueue.m_logger.debug(this.getName()+" check queued for GUIAdaptor: "+a.getId());if(!a.dirtyEventsSuspended())
{this.m_queue.push({adaptor:a,event:e,detail:d});}}
FormDirtyEventQueue.prototype._createEventId=function(queuedItem)
{var id=queuedItem.adaptor.getId();var eventXPath=queuedItem.event.getXPath();if(null!=eventXPath)
{id+="_"+eventXPath;}
return id;}
function LoadEventQueue()
{this._initEventQueue();}
LoadEventQueue.prototype=new CompressedEventQueue();LoadEventQueue.prototype.constructor=LoadEventQueue;LoadEventQueue.prototype.getName=function()
{return FormController.LOAD;}
LoadEventQueue.prototype._createEventId=function(queuedItem)
{var id=queuedItem.adaptor.getId();var loadSubComponentId=queuedItem.detail.m_detail;if(null!=loadSubComponentId)
{id+="_"+loadSubComponentId;}
return id;}
LoadEventQueue.prototype.processEvent=function(a,e,d)
{a.invokeLoad(e,d);return false;}
function UnloadEventQueue()
{this._initEventQueue();}
UnloadEventQueue.prototype=new CompressedEventQueue();UnloadEventQueue.prototype.constructor=UnloadEventQueue;UnloadEventQueue.prototype.getName=function()
{return FormController.UNLOAD;}
UnloadEventQueue.prototype._createEventId=function(queuedItem)
{var id=queuedItem.adaptor.getId();var unloadSubComponentId=queuedItem.detail.m_detail;if(null!=unloadSubComponentId)
{id+="_"+unloadSubComponentId;}
return id;}
UnloadEventQueue.prototype.processEvent=function(a,e,d)
{a.invokeUnload(e,d);return false;}
function DirtyRecordsEventQueue()
{this._initEventQueue();}
DirtyRecordsEventQueue.prototype=new CompressedEventQueue();DirtyRecordsEventQueue.prototype.constructor=DirtyRecordsEventQueue;DirtyRecordsEventQueue.prototype.getName=function()
{return FormController.DIRTY_RECORD;}
DirtyRecordsEventQueue.prototype.addEventToQueue=function(a,e,d)
{if(EventQueue.m_logger.isDebug())EventQueue.m_logger.debug(this.getName()+" check queued for GUIAdaptor: "+a.getId());if(this.m_formAdaptor==null)
{this.m_formAdaptor=FormController.getInstance().getFormAdaptor();}
if(!this.m_formAdaptor.dirtyEventsSuspended())
{this.m_queue.push({adaptor:a,event:e,detail:d});}}
DirtyRecordsEventQueue.prototype.processEvent=function(a,e,d)
{return a.invokeMarkRecordDirty(e,d);}
function LazyFetchEventQueue()
{this._initEventQueue();}
LazyFetchEventQueue.prototype=new CompressedEventQueue();LazyFetchEventQueue.prototype.constructor=LazyFetchEventQueue;LazyFetchEventQueue.prototype.getName=function()
{return FormController.LAZY_FETCH_RECORD;}
LazyFetchEventQueue.prototype.processEvent=function(a,e,d)
{return a.invokeLazyFetchRecord(e,d);}
function EventQueueMap()
{this.m_queues=new Array();}
EventQueueMap.prototype.addEventQueue=function(q,qName)
{this.m_queues[qName]=q;}
EventQueueMap.prototype.addEventToNamedQueue=function(queueName,field,event,detail)
{this.m_queues[queueName].addEventToQueue(field,event,detail);}
EventQueueMap.prototype.processEventsForQueue=function(queueName,repaintQueue)
{repaintQueue=this.m_queues[queueName].processEvents(repaintQueue);return repaintQueue;}
EventQueueMap.prototype.queuesHaveEvents=function(queues)
{var queueEventsExist=false;for(var i=0,l=queues.length;i<l;i++)
{if(this.queueHasEvents(queues[i]))
{queueEventsExist=true;break;}}
return queueEventsExist;}
EventQueueMap.prototype.queueHasEvents=function(queueName)
{return this.m_queues[queueName].hasEvents();}
EventQueueMap.prototype.getNamedQueue=function(queueName)
{return this.m_queues[queueName];}
EventQueueMap.prototype.removeEventsForAdaptor=function(adaptor)
{for(var i in this.m_queues)
{this.m_queues[i].removeEventsForAdaptor(adaptor);}}
function FCTransactionListener()
{}
FCTransactionListener.prototype=new DataModelTransactionListener();FCTransactionListener.prototype.constructor=FCTransactionListener;FCTransactionListener.m_logger=new Category("FCTransactionListener");FCTransactionListener.prototype.m_nested=false;FCTransactionListener.prototype.start=function()
{var i=0;}
FCTransactionListener.prototype.end=function()
{if(false==this.m_nested)
{this.m_nested=true;FormController.getInstance().processEvents();this.m_nested=false;}}
function FormControllerListener()
{}
FormControllerListener.create=function(adaptor,eventType,detail)
{var l=new FormControllerListener();l.m_adaptor=adaptor;l.m_eventType=eventType;l.m_detail=detail;l.m_uniqueRef=l.m_adaptor.getId()+":"+l.m_eventType;return l}
FormControllerListener.prototype=new DataModelListener();FormControllerListener.prototype.constructor=FormControllerListener;FormControllerListener.prototype.m_adaptor;FormControllerListener.prototype.m_eventType;FormControllerListener.prototype.dispose=function()
{this.m_adaptor=null;}
FormControllerListener.prototype._getUniqueRef=function()
{return this.m_uniqueRef;}
FormControllerListener.prototype.toString=function()
{if(null==this._getXPath())
return"["+this._getUniqueRef()+"]";else
return"["+this._getUniqueRef()+" bound to "+this._getXPath()+"]";}
FormControllerListener.prototype._setAdaptor=function(a)
{this.m_adaptor=a;}
FormControllerListener.prototype._setEventType=function(e)
{this.m_eventType=e;}
FormControllerListener.prototype._queueEvent=function(n,e)
{if(this.m_eventType==FormController.DEFAULT)
{if(e.getType()==DataModelEvent.ADD)
{FormController.getInstance().queueEvent(n,this.m_adaptor,e,this);}}
else
{FormController.getInstance().queueEvent(n,this.m_adaptor,e,this);}}
FormControllerListener.prototype.invoke=function(e)
{this._queueEvent(this.m_eventType,e);}
FormControllerListener.prototype._setXPath=function(xp)
{this.m_xp=xp;}
FormControllerListener.prototype._getXPath=function()
{return this.m_xp;}
FormControllerListener._sortFormControllerListeners=function(a,b)
{if(a._getUniqueRef()>b._getUniqueRef())
{return 1;}
else if(a._getUniqueRef()==b._getUniqueRef())
{return 0;}
return-1;}
FormControllerListener.prototype.serialise=function()
{var str="";str+="FormControllerListener.deserialise('"+this.m_adaptor.getId()
+"','"+this.m_eventType
+"','"+this.m_uniqueRef;if(null!=this.m_detail)
{str+="','"+this.m_detail;}
str+="')\n";return str;}
FormControllerListener.deserialise=function(adaptorId,eventType,uniqueRef,detailStr)
{var list=new FormControllerListener();list.m_adaptorId=adaptorId;list.m_eventType=eventType;list.m_uniqueRef=uniqueRef;if(null!=detailStr)
{list.m_detail=detailStr;}
return list;}
function FormController(formViewManager,initialData)
{this.m_formView=HTMLFormView.create();this.m_formViewManager=formViewManager;formViewManager.setFormController(this);if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController()");this.m_firstStageInitialisationComplete=false;this.m_adaptors=null;this.m_containerAdaptors=new Array();this.m_runningDataServices=new Array();this.m_dataModel=new DataModel();this.m_isReinitialise=false;if(initialData==null)
{initialData=this.getAppController().getSessionDataFromPreviousForm();}
if(null!=initialData)
{if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController() about to load the following app scoped data into the dom:"+XML.showDom(initialData));for(var i=0;i<initialData.length;i++)
{this.m_dataModel.addNodeSet(initialData[i],"/ds/var");}}
this.m_dataModel.registerTransactionListener(new FCTransactionListener());this.m_dataTransactionAdaptor=null;this.m_tabbingManager=new TabbingManager();this.m_tabbingManager.initialise();this.m_eventQueueMap=new EventQueueMap();this.m_eventQueueMap.addEventQueue(new DefaultEventQueue(),FormController.DEFAULT);this.m_eventQueueMap.addEventQueue(new ValidationEventQueue(),FormController.VALIDATION);this.m_eventQueueMap.addEventQueue(new EnablementEventQueue(),FormController.ENABLEMENT);this.m_eventQueueMap.addEventQueue(new MandatoryEventQueue(),FormController.MANDATORY);this.m_eventQueueMap.addEventQueue(new SrcDataEventQueue(),FormController.SRCDATA);this.m_eventQueueMap.addEventQueue(new SrcDataFilterEventQueue(),FormController.FILTER);this.m_eventQueueMap.addEventQueue(new RefreshEventQueue(),FormController.REFRESH);this.m_eventQueueMap.addEventQueue(new ReadOnlyEventQueue(),FormController.READONLY);this.m_eventQueueMap.addEventQueue(new LogicEventQueue(),FormController.LOGIC);this.m_eventQueueMap.addEventQueue(new DirtyRecordsEventQueue(),FormController.DIRTY_RECORD);this.m_eventQueueMap.addEventQueue(new LazyFetchEventQueue(),FormController.LAZY_FETCH_RECORD);this.m_eventQueueMap.addEventQueue(new FormDirtyEventQueue(),FormController.FORMDIRTY);this.m_eventQueueMap.addEventQueue(new LabelEventQueue(),FormController.LABEL);this.m_eventQueueMap.addEventQueue(new StateChangeEventQueue(),FormController.STATECHANGE);this.m_eventQueueMap.addEventQueue(new ServerValidationEventQueue(),FormController.SERVER_VALIDATION);this.m_eventQueueMap.addEventQueue(new LoadEventQueue(),FormController.LOAD);this.m_eventQueueMap.addEventQueue(new UnloadEventQueue(),FormController.UNLOAD);this.m_businessLifeCycleEventQueue=new Array();this.m_allowBusinessLifeCycleEventSubmission=true;this.m_pollDataServiceCompletion=null;this.m_wordProcessingGUIAdaptors=new Array();this.m_FCKeditorLoadCompletion=null;this.m_enablementEventBindings=new Array();}
FormController.m_logger=new Category("FormController");FormController.DEFAULT="default";FormController.SRCDATA="srcData";FormController.DIRTY_RECORD="dirtyRecords";FormController.LAZY_FETCH_RECORD="lazyFetch";FormController.FILTER="srcDataFilter";FormController.VALIDATION="validate";FormController.ENABLEMENT="enable";FormController.MANDATORY="mandatory";FormController.REFRESH="refresh";FormController.READONLY="readOnly";FormController.LOGIC="logic";FormController.LABEL="label";FormController.STATECHANGE="statechange";FormController.FORMDIRTY="formdirty";FormController.LOAD="load";FormController.UNLOAD="unload";FormController.m_formController=null;FormController.getDebugMode=function()
{if(FormController.m_debugMode==null)
{FormController.m_debugMode=top.AppController.getInstance().getDebugMode();}
return FormController.m_debugMode;}
FormController.getValidateWhitespaceOnlyEntryActive=function()
{if(FormController.m_validateWhitespaceOnlyEntryActive==null)
{FormController.m_validateWhitespaceOnlyEntryActive=top.AppController.getInstance().getValidateWhitespaceOnlyEntryActive();}
return FormController.m_validateWhitespaceOnlyEntryActive;}
FormController.initialise=function(formViewManager,initialData,invokingAdaptor)
{var fc=null;if(FormController.getDebugMode()==false)
{try
{FormController._initialise(formViewManager,initialData,invokingAdaptor);}
catch(exception)
{fc=FormController.m_formController;if(null!=fc)
{if(null!=fc.m_pollDataServiceCompletion)
{clearTimeout(fc.m_pollDataServiceCompletion);fc.m_pollDataServiceCompletion=null;}
if(null!=fc.m_FCKeditorLoadCompletion)
{clearTimeout(fc.m_FCKeditorLoadCompletion);fc.m_FCKeditorLoadCompletion=null;}}
FormController.handleFatalException(exception);}}
else
{FormController._initialise(formViewManager,initialData,invokingAdaptor);}}
FormController._initialise=function(formViewManager,initialData,invokingAdaptor)
{var fc=null;if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.initialise() started");Logging.initialise(top.window);fc_assert(FormController.m_formController==null,"FormController.initialise() called multiple times");fc=new FormController(formViewManager,initialData);FormController.m_formController=fc;fc.setInvokingAdaptor(invokingAdaptor);fc.initElements();fc._pollForSecondStageInitialisationStart();var form=fc.getFormAdaptor();fc.getTabbingManager().setFormElementGUIAdaptor(form);fc.m_firstStageInitialisationComplete=true;if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.initialise() completed");}
FormController.prototype._pollForSecondStageInitialisationStart=function()
{this.m_pollDataServiceCompletion=setTimeout("FormController.pollDataServiceCompletion()",100);}
FormController.prototype._pollForFCKeditorLoadCompletionStart=function()
{this.m_FCKeditorLoadCompletion=setTimeout("FormController.pollFCKeditorLoadCompletion()",100);}
FormController.prototype.reinitialise=function(nodes)
{this.m_isReinitialise=true;var dm=this.m_dataModel;var form=this.getFormAdaptor();dm._startTransaction();form.suspendDirtyEvents(true);if(null!=nodes)
{if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController() about to load the following initial data into the DataModel:"+XML.showDom(nodes));for(var i=0;i<nodes.length;i++)
{var node=nodes[i];var rootNodeName=node.nodeName;dm.replaceNode("/ds/var/"+rootNodeName,node);}}
form.reinitialise();this._pollForSecondStageInitialisationStart();}
FormController.prototype.dispose=function()
{var i,l;for(i=0,l=this.m_wordProcessingGUIAdaptors.length;i<l;i++)
{this.m_wordProcessingGUIAdaptors[i]=null;}
delete this.m_wordProcessingGUIAdaptors;for(var j in this.m_enablementEventBindings)
{this.m_enablementEventBindings[j]=null;}
var doc=window.document;if(null!=doc.framework_expando_progressBarVisible)
{doc.framework_expando_progressBarVisible=null;}
this.m_enablementEventBindings=null;if(null!=this.m_formAdaptor)
{this.m_formAdaptor=null;}
for(i=0,l=this.m_adaptors.length;i<l;i++)
{this.m_adaptors[i].dispose();delete this.m_adaptors[i];}
delete this.m_adaptors;this.m_tabbingManager.dispose();delete this.m_tabbingManager;this.m_dataModel.dispose();delete this.m_dataModel;this.m_formView.dispose();delete this.m_formView;this.m_formViewManager=null;if(null!=this.getInvokingAdaptor())
{this.setInvokingAdaptor(null);}
if(null!=FormController.m_debugMode)
{FormController.m_debugMode=null;}
if(null!=FormController.m_validateWhitespaceOnlyEntryActive)
{FormController.m_validateWhitespaceOnlyEntryActive=null;}
delete this.m_formController;}
FormController.getInstance=function()
{return FormController.m_formController;}
FormController.prototype.getDataModel=function()
{return this.m_dataModel;}
FormController.prototype.getTabbingManager=function()
{return this.m_tabbingManager;}
FormController.prototype.getFormView=function()
{return this.m_formView;}
FormController.prototype.getAppController=function()
{return top.AppController.getInstance();}
FormController.prototype.getAdaptorById=function(id)
{return this.m_adaptors[id];}
FormController.prototype.getFormAdaptor=function()
{if(this.m_formAdaptor==null)
{var adaptors=this.m_adaptors;var length=adaptors.length;for(var i=0;i<length;i++)
{var adaptor=adaptors[i];if(adaptor.constructor==FormElementGUIAdaptor||adaptor.constructor==SubformElementGUIAdaptor)
{this.m_formAdaptor=adaptor;break;}}}
return this.m_formAdaptor;}
FormController.prototype.getInvokingAdaptor=function()
{return FormController.prototype.m_invokingAdaptor;}
FormController.prototype.setInvokingAdaptor=function(adaptor)
{FormController.prototype.m_invokingAdaptor=adaptor;}
FormController.prototype.registerExternalAdaptors=function(adaptorFactory)
{var registered=this.getAppController().getExternalComponents();for(var i=0;i<registered.length;i++)
{var cssClassName=registered[i].getCSSClassName();if(FormController.m_logger.isInfo())FormController.m_logger.info("FormController.registerExternalAdaptors() cssClassName = "+cssClassName);var className=registered[i].getClassName();var factoryMethodName=registered[i].getFactoryMethod();if(null==factoryMethodName)
{factoryMethodName="create";}
var a=window[className];if(null!=a)
{if(FormController.m_logger.isInfo())FormController.m_logger.info("FormController.registerExternalAdaptors() found adaptor = "+a);var factoryMethod=a[factoryMethodName];if(FormController.m_logger.isInfo())FormController.m_logger.info("FormController.registerExternalAdaptors() found factory method on adaptor = "+factoryMethod);var gar=GUIAdaptorRegistration.create(cssClassName,factoryMethod);adaptorFactory.register(gar);}
else
{if(FormController.m_logger.isWarn())FormController.m_logger.warn("FormController.registerExternalAdaptors() external component configured in app config, but the corresponding javascript object does not exist in the window. It may not be needed in the current form.");}}
return adaptorFactory;}
FormController.pollDataServiceCompletion=function()
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.pollDataServiceCompletion()");var oneMinute=1000*60;var pollDelay=100;if(FormController.pollDataServiceCompletion.count==undefined)
{FormController.pollDataServiceCompletion.count=0;}
else
{FormController.pollDataServiceCompletion.count++;}
if(FormController.pollDataServiceCompletion.count*pollDelay>oneMinute)
{var fc=FormController.getInstance();var ac=fc.getAppController();var message="The following services have failed to complete after "+oneMinute/1000+" seconds\n\n";for(var k in fc.m_runningDataServices)
{if(true==fc.m_runningDataServices[k])
{message+=(k+"\n");}}
message+="\nPress Ok to continue to wait or Cancel to abort the application";if(window.confirm(message))
{FormController.pollDataServiceCompletion.count=0;}
else
{ac.shutdown();}}
var fc=FormController.getInstance();if(!fc.isRunningDataServices()&&fc.m_firstStageInitialisationComplete)
{fc.m_pollDataServiceCompletion=null;FormController.pollDataServiceCompletion.count=0;var wordProcessingGUIAdaptors=fc.getWordProcessingGUIAdaptors();if(wordProcessingGUIAdaptors.length>0)
{fc._pollForFCKeditorLoadCompletionStart();}
else
{fc.referenceDataLoaded();}}
else
{fc.m_pollDataServiceCompletion=setTimeout("FormController.pollDataServiceCompletion()",pollDelay);}}
FormController.pollFCKeditorLoadCompletion=function()
{if(FormController.m_logger.isDebug())
{FormController.m_logger.debug("FormController.pollFCKeditorLoadCompletion()");}
var oneMinute=1000*60;var pollDelay=100;if(FormController.pollFCKeditorLoadCompletion.count==undefined)
{FormController.pollFCKeditorLoadCompletion.count=0;}
else
{FormController.pollFCKeditorLoadCompletion.count++;}
var fc=FormController.getInstance();if(fc.FCKeditorLoadingComplete())
{fc.m_FCKeditorLoadCompletion=null;FormController.pollFCKeditorLoadCompletion.count=0;fc.referenceDataLoaded();}
else
{if(FormController.pollFCKeditorLoadCompletion.count*pollDelay>oneMinute)
{var message="The instance(s) of FCKeditor used for word processing"+"\nhave failed to load completely. Press OK to continue"+"\nto wait or Cancel to abort the application.";if(window.confirm(message))
{FormController.pollFCKeditorLoadCompletion.count=0;fc.m_FCKeditorLoadCompletion=setTimeout("FormController.pollFCKeditorLoadCompletion()",pollDelay);}
else
{fc.getAppController().shutdown();}}
else
{fc.m_FCKeditorLoadCompletion=setTimeout("FormController.pollFCKeditorLoadCompletion()",pollDelay);}}}
FormController.prototype.registerRunningDataService=function(key)
{this.m_runningDataServices[key]=true;}
FormController.prototype.runningDataServiceComplete=function(key)
{this.m_runningDataServices[key]=false;}
FormController.prototype.isRunningDataServices=function()
{var result=false;for(var k in this.m_runningDataServices)
{if(true==this.m_runningDataServices[k])
{result=true;break;}}
return result;}
FormController.prototype.referenceDataLoaded=function()
{if(FormController.getDebugMode()==false)
{try
{this._referenceDataLoaded();}
catch(exception)
{FormController.handleFatalException(exception);}}
else
{this._referenceDataLoaded();}}
FormController.prototype._referenceDataLoaded=function()
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.referenceDataLoaded()");var form=this.getFormAdaptor();if(form.prepareModelData)
{form.prepareModelData();}
if(!this.m_isReinitialise)
{this._initialiseAdaptorsStates(this.m_adaptors);}
form._setDirty(form.isDirtyOnInit());if(!this.m_isReinitialise)
{this.m_tabbingManager.addAdaptors(this.m_adaptors);this.runInitialiseLifecycle(this.m_adaptors);}
else
{form.suspendDirtyEvents(false);this.m_dataModel._endTransaction();}
this.m_formViewManager.formControllerInitialised();var firstFocusAdaptorID=form.invokeFirstFocusedAdaptorId();Services.setFocus(firstFocusAdaptorID);this.m_ready=true;}
FormController.prototype.initElements=function()
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.initElements()");var f=this.getFormView().getGUIAdaptorFactory();f=this.registerExternalAdaptors(f);var as=f.bindView(document);this.manage(as);}
FormController.prototype.addAdaptors=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.addAdaptors()");this.m_adaptors=this.m_adaptors.concat(as);this._rebuildAdaptorMap();this._configureAdaptors(as);this._maintainContainerMap(as,true);for(var j=0,al=as.length;j<al;j++)
{this._bindLifeCycles(as[j],true);this._determineDataDependencies(as[j]);}
this._initialiseAdaptorsStates(as);this.m_tabbingManager.addAdaptors(as);}
FormController.prototype.removeAdaptor=function(removeAdaptor)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.removeAdaptor() adaptor = "+removeAdaptor.getDisplayName());var newAdaptors=new Array();var disposeAdaptors=new Array();var disposeAdaptorIds=new Array();var as=this.m_adaptors;var removeId=removeAdaptor.getId();for(var i=0,l=as.length;i<l;i++)
{var a=as[i];if(removeAdaptor!=a&&!a.isChildOf(removeAdaptor))
{newAdaptors.push(a);}
else
{disposeAdaptors.push(a);disposeAdaptorIds.push(a.getId());}}
this.m_adaptors=newAdaptors;this._rebuildAdaptorMap();this.getTabbingManager().removeAdaptors(disposeAdaptors);this.removeAdaptorsFromDataModel(disposeAdaptors);this.removeAdaptorsFromStateChange(disposeAdaptorIds);this._maintainContainerMap(disposeAdaptors,false);for(var i=0,l=disposeAdaptors.length;i<l;i++)
{var a=disposeAdaptors[i];this.m_eventQueueMap.removeEventsForAdaptor(a);a.dispose();}}
FormController.prototype._rebuildAdaptorMap=function()
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._rebuildAdaptorMap()");var as=this.m_adaptors;for(var i=0,l=as.length;i<l;i++)
{var a=as[i];var id=a.getId();if(as[id]!=null)throw new ConfigurationException("Attempt to add duplicate adaptor with id: "+id);as[id]=a;}}
FormController.prototype.manage=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.manage(): started");var fc=FormController.getInstance();this.m_adaptors=as;this._configureAdaptors(as);this._maintainContainerMap(as,true);for(var j=0,al=as.length;j<al;j++)
{this._bindLifeCycles(as[j]);}
if(FormController.regNodes!=null)
{var nodes=FormController.regNodes;for(var a in nodes)
{var node=nodes[a];node.m_childNodes=new Object();for(var i=0,l=node.m_childRefArray.length;i<l;i++)
{var childNode=nodes[node.m_childRefArray[i]];node.m_childNodes[childNode.m_value]=childNode;}
node.m_childRefArray=null;node.m_predicates=new Object();for(var i=0,l=node.m_predicateRefArray.length;i<l;i++)
{var predicateNode=nodes[node.m_predicateRefArray[i]];node.m_predicates[predicateNode.m_value]=predicateNode;}
node.m_predicateRefArray=null;for(var i=0,l=node.m_listeners.length;i<l;i++)
{var listener=node.m_listeners[i];var adaptor=fc.getAdaptorById(listener.m_adaptorId);if(null!=adaptor)
{listener.m_adaptor=adaptor;}
else
{listener.m_adaptor=fc.getEnablementEventBindingById(listener.m_adaptorId);}}}
FormController.getInstance().getDataModel().m_root=nodes[0];}
var dataDepArray=FormController.dataDepPreCompArray;if(!dataDepArray)
{for(var j=0,al=as.length;j<al;j++)
{this._determineDataDependencies(as[j]);}}
else
{for(var i=0,l=dataDepArray.length;i<l;i++)
{var preComp=dataDepArray[i];var adaptor=fc.m_adaptors[preComp[0]];adaptor.m_parents=SerialisationUtils.convertStringArrayToAdaptorObject(preComp[1]);adaptor.m_children=SerialisationUtils.convertStringArrayToAdaptorArray(preComp[2]);adaptor.m_containedChildren=SerialisationUtils.convertStringArrayToAdaptorArray(preComp[3]);adaptor.m_parentContainer=fc.m_adaptors[preComp[4]];}}
if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.manage(): completed");}
FormController.prototype._maintainContainerMap=function(as,addingAdaptors)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._maintainContainerMap(): addingAdaptors = "+addingAdaptors);if(addingAdaptors==true)
{for(var i=0,al=as.length;i<al;i++)
{var a=as[i];var id=a.getId();if(StateChangeEventProtocol._isContainerAdaptor(a))
{this.m_containerAdaptors[id]=a;}}
this._addStaticContainerDependencies(as);}
else
{for(var i=0,al=as.length;i<al;i++)
{var a=as[i];var id=a.getId();if(this.m_containerAdaptors[id]!=null)
{delete this.m_containerAdaptors[id];}}
this._removeStaticContainerDependencies(as);}}
FormController.prototype._addParentContainer=function(a,form)
{if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController._addParentContainer(): adaptor = "+a.getDisplayName());var parent=a.getParentContainer()
if(null!=parent)
{a.addDataDependency(parent);}
else
{var parents=a.getParents();if(parents==null||parents.length==0)
{a.addDataDependency(form);}}}
FormController.prototype._addStaticContainerDependencies=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._addStaticContainerDependencies()");var form=this.getFormAdaptor();var parents=null;var parent=null;for(var j=0,al=as.length;j<al;j++)
{var a=as[j];if(a.getId()!=form.getId())
{if(a instanceof PopupGUIAdaptor)
{var raisingAdaptors=a.getSources();if(raisingAdaptors!=null)
{for(var i=raisingAdaptors.length-1;i>=0;i--)
{a.addDataDependency(raisingAdaptors[i]);}}
else
{this._addParentContainer(a,form);}}
else
{this._addParentContainer(a,form);}}}}
FormController.prototype._removeStaticContainerDependencies=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._removeStaticContainerDependencies()");var adaptors=this.m_adaptors;var staticContainers=new Array();for(var i=0,asl=as.length;i<asl;i++)
{var a=as[i];if(a instanceof PopupGUIAdaptor)
{staticContainers[staticContainers.length]=a;}}
for(var k=0,scl=staticContainers.length;k<scl;k++)
{for(var j=0,al=adaptors.length;j<al;j++)
{var a=adaptors[j];a.removeDataDependency(staticContainers[k]);}}}
FormController.prototype._initialiseAdaptorsStates=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._initialiseAdaptorsStates()");var e=DataModelEvent.create('/',DataModelEvent.ADD);for(var i=0,al=as.length;i<al;i++)
{var adaptor=as[i];adaptor.initialiseStates(e);adaptor.renderState();}}
FormController.prototype.removeAdaptorsFromDataModel=function(adaptors)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.removeAdaptorsFromDataModel()");for(var i=0,l=adaptors.length;i<l;i++)
{adaptors[i].deRegisterListeners();}}
FormController.prototype.removeAdaptorsFromStateChange=function(adaptorIds)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.removeAdaptorsFromStateChange()");var as=this.m_adaptors;for(var i=0,l=this.m_adaptors.length;i<l;i++)
{var e=StateChangeEvent.create(StateChangeEvent.REMOVED_ADAPTOR_TYPE,adaptorIds,null);this.m_adaptors[i].changeAdaptorState(e);}}
FormController.prototype.runInitialiseLifecycle=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController.runInitialiseLifecycle()");for(var i=0,l=as.length;i<l;i++)
{var a=as[i];if(a.hasInitialise!=null)
{a.invokeInitialise();}}}
FormController.prototype._configureAdaptors=function(as)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController._configureAdaptors()");var cm=this.getFormView().getConfigManager();for(var j=0,al=as.length;j<al;j++)
{var a=as[j];var cs=cm.getConfig(a.getId());a.configure(cs);}}
FormController.prototype.determineDataDependencies=function(adaptor,value,dataDependencyOnCheck)
{if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController.determineDataDependencies() adaptor = "+adaptor.getDisplayName());if(value!=null&&value!="")
{var containerAdaptors=this.m_containerAdaptors;for(var i in containerAdaptors)
{var container=containerAdaptors[i];var containerDb=container.dataBinding;var index=value.indexOf(containerDb);if(index!=-1&&(adaptor.getId()!=container.getId()))
{var sub=String.trim(value.substring(index+containerDb.length));var firstChar=null;if(sub.length>0)
{firstChar=sub.charAt(0);if(firstChar=="="||firstChar=="]")
{container.addChild(adaptor);adaptor.addDataDependency(container);}
else
{}}
else
{if(dataDependencyOnCheck==true)
{container.addChild(adaptor);adaptor.addDataDependency(container);}
else if(value==containerDb&&container.constructor==TabSelectorGUIAdaptor&&(adaptor.constructor==PagedAreaGUIAdaptor||adaptor.constructor==PageGUIAdaptor))
{container.addChild(adaptor);adaptor.addDataDependency(container);}}}}}}
FormController.prototype._bindLifeCycles=function(a,ignorePrecompile)
{if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController._bindLifeCycles() adaptor = "+a.getDisplayName());if(ignorePrecompile==null)
{ignorePrecompile=false;}
a.register(FormControllerListener.create(a,FormController.STATECHANGE));if(!FormController.regNodes||ignorePrecompile==true)
{a.registerListeners();}}
FormController.prototype._determineDataDependencies=function(a)
{var dm=this.m_dataModel;var db=null;if(null!=a.getDataBinding)
{db=a.getDataBinding();if(null!=db)
{this.determineDataDependencies(a,db);}
var on=a.getRetrieveOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{this.determineDataDependencies(a,on[i]);}}}
if(a.getSrcData&&(null!=a.getSrcData()))
{var srcDataOn=a.getSrcDataOn();if(null!=srcDataOn)
{for(var i=srcDataOn.length-1;i>=0;i--)
{this.determineDataDependencies(a,srcDataOn[i]);}}}
var on=a.getDataDependencyOn();if(null!=on)
{for(var i=on.length-1;i>=0;i--)
{this.determineDataDependencies(a,on[i],true);}}}
FormController.prototype.startDataTransaction=function(a)
{if(FormController.m_logger.isError()&&null!=this.m_dataTransactionAdaptor)
{FormController.m_logger.error("FormController.startDataTransaction(): second data transaction started before previous transaction completed."
+" Current transaction adaptor: "+((this.m_dataTransactionAdaptor==null)?"null":this.m_dataTransactionAdaptor.getId())
+" new transaction adaptor: "+((a==null)?"null":a.getId()));}
this.m_dataTransactionAdaptor=a;if(a.supportsProtocol("ValidationProtocol")&&(a.hasValidate()||a.hasServerValidate()))
{this.m_dataTransactionAdaptorValidState=a.getValid();this.m_dataTransactionAdaptorValue=Services.getValue(a.dataBinding);}}
FormController.prototype.endDataTransaction=function(a)
{if(FormController.m_logger.isError()&&a!=this.m_dataTransactionAdaptor)
{FormController.m_logger.error("FormController.endDataTransaction(): previous transaction did not complete before this transaction completed."
+" Current transaction adaptor: "+((this.m_dataTransactionAdaptor==null)?"null":this.m_dataTransactionAdaptor.getId())
+" new transaction adaptor: "+((a==null)?"null":a.getId()));}
if(a.supportsProtocol("ValidationProtocol")&&(a.hasValidate()||a.hasServerValidate()))
{var validStateChanged=false;var valueChanged=false;var validState=a.getValid();var value=Services.getValue(a.dataBinding);if(validState==false&&this.m_dataTransactionAdaptorValidState==true)validStateChanged=true;if(this.m_dataTransactionAdaptorValue!=value)valueChanged=true;if(validStateChanged==true||(validStateChanged==false&&valueChanged==true&&validState==false))
{if((a instanceof TextInputElementGUIAdaptor)||(a instanceof TextAreaElementGUIAdaptor)||(a instanceof DateTextInputElementGUIAdaptor))
{this.m_tabbingManager._unfocusCurrentFocussedAdaptor(null,false);}
if(FormController.m_logger.isDebug())FormController.m_logger.debug("endDataTransaction(): Value of invalid field changed so resetting focus to invalid field.");this.m_tabbingManager.setValidationFailedAdaptor(a);}
else
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("endDataTransaction(): Value of invalid field has not changed - not resetting focus.");}}
else
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("endDataTransaction(): Updated field does not support validation - not resetting focus.");}
this.m_dataTransactionAdaptor=null;}
FormController.prototype.processEvents=function()
{if(FormController.getDebugMode()==false)
{try
{this._processEvents();}
catch(exception)
{FormController.handleFatalException(exception);}}
else
{this._processEvents();}}
FormController.prototype._processEvents=function()
{if(FormController.m_logger.isInfo())FormController.m_logger.info("FormController.processEvents(). Starting processing events");var recheckQueue=false;var repaintQueue=new Array();var queues=[FormController.DEFAULT,FormController.DIRTY_RECORD,FormController.SRCDATA,FormController.LAZY_FETCH_RECORD,FormController.FILTER,FormController.REFRESH,FormController.VALIDATION,FormController.ENABLEMENT,FormController.MANDATORY,FormController.READONLY,FormController.LOGIC,FormController.FORMDIRTY,FormController.LABEL,FormController.STATECHANGE,FormController.LOAD,FormController.UNLOAD];do
{do
{recheckQueue=false;for(var i=0,l=queues.length;i<l;i++)
{repaintQueue=this.m_eventQueueMap.processEventsForQueue(queues[i],repaintQueue);}
recheckQueue=this.m_eventQueueMap.queuesHaveEvents(queues);}
while(recheckQueue);if(this._processBusinessLifeCycleEvents()==true)recheckQueue=true;}
while(recheckQueue);repaintQueue=this._processServerValidationEvents(repaintQueue);this.m_tabbingManager.updateFocus();for(var i in repaintQueue)
{repaintQueue[i].renderState();}
if(this.m_eventQueueMap.queuesHaveEvents(queues))
{this._processEvents();}
if(FormController.m_logger.isInfo())FormController.m_logger.info("Finished processing events");}
FormController.prototype._processServerValidationEvents=function(repaintQueue)
{repaintQueue=this.m_eventQueueMap.processEventsForQueue(FormController.SERVER_VALIDATION,repaintQueue);return repaintQueue;}
FormController.prototype._processBusinessLifeCycleEvents=function()
{if(FormController.m_logger.isDebug())
{FormController.m_logger.debug("Processing business life cycle events size: "+this.m_businessLifeCycleEventQueue.length);}
if(this.m_businessLifeCycleEventTimeout!=null)
{clearTimeout(this.m_businessLifeCycleEventTimeout);this.m_businessLifeCycleEventTimeout=null;}
var eventsProcessed=false;if(this.m_businessLifeCycleEventQueue.length>0)
{eventsProcessed=true;do
{var q=this.m_businessLifeCycleEventQueue;this.m_businessLifeCycleEventQueue=new Array();if(q.length>1)
{q=this._filterDuplicateActionBusinessLifeCycleEvents(q);}
for(var i=0,l=q.length;i<l;i++)
{var e=q[i];var id=e.getComponentId();var a=this.getAdaptorById(id);if(null!=a)
{if(a.supportsProtocol(BusinessLifeCycleProtocol.PROTOCOL_NAME))
{if(e.getType()==BusinessLifeCycleEvents.EVENT_NAVIGATE&&this.getAppController().getServiceRequestCount()>0)
{this.m_pendingNavigationBusinessLifeCycleEvent=e;this.startNavigationTimeout();}
else
{a.handleBusinessLifeCycleEvent(e);}}
else
{if(FormController.m_logger.isError())FormController.m_logger.error("FormController::_processBusinessLifeCycleEvents(): adaptor with id '"+id+"' does not support "+BusinessLifeCycleProtocol.PROTOCOL_NAME);}}
else
{if(FormController.m_logger.isError())FormController.m_logger.error("FormController::_processBusinessLifeCycleEvents(): adaptor with id '"+id+"' not found");}}}
while(0!=this.m_businessLifeCycleEventQueue.length);}
return eventsProcessed;}
FormController.prototype._filterDuplicateActionBusinessLifeCycleEvents=function(originalQueue)
{var refStore=new Object();var filteredQueue=new Array();for(var i=0,l=originalQueue.length;i<l;i++)
{var event=originalQueue[i];if(event.getType()==BusinessLifeCycleEvents.EVENT_ACTION)
{var uniqueEventRef=event.getComponentId()+"_"+
event.getType();if(null==refStore[uniqueEventRef])
{refStore[uniqueEventRef]=true;filteredQueue[filteredQueue.length]=event;}}
else
{filteredQueue[filteredQueue.length]=event;}}
if(filteredQueue.length!=originalQueue.length)
{if(FormController.m_logger.isDebug())
{FormController.m_logger.debug("Duplicate business life cycle events removed by queue processing");}}
refStore=null;return filteredQueue}
FormController.prototype.startNavigationTimeout=function()
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController::startNavigationTimeout(): this.getAppController().getServiceRequestCount() =  "+this.getAppController().getServiceRequestCount()+", therefore pending navigation event until all requests complete");if(this.m_navigationBusinessLifeCycleEventTimeout!=null)
{clearTimeout(this.m_navigationBusinessLifeCycleEventTimeout);this.m_navigationBusinessLifeCycleEventTimeout=null;}
this.m_navigationBusinessLifeCycleEventTimeout=setTimeout("FormController.getInstance()._processNavigationBusinessLifeCycleEvent()",100);}
FormController.prototype._processNavigationBusinessLifeCycleEvent=function()
{if(this.m_navigationBusinessLifeCycleEventTimeout!=null)
{clearTimeout(this.m_navigationBusinessLifeCycleEventTimeout);this.m_navigationBusinessLifeCycleEventTimeout=null;}
if(this.getAppController().getServiceRequestCount()>0)
{if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController::_processNavigationBusinessLifeCycleEvent(): this.getAppController().getServiceRequestCount() =  "+this.getAppController().getServiceRequestCount()+", therefore still pending navigation event until all requests complete");this.startNavigationTimeout();}
else
{var e=this.m_pendingNavigationBusinessLifeCycleEvent;var id=e.getComponentId();if(FormController.m_logger.isDebug())FormController.m_logger.debug("FormController::_processNavigationBusinessLifeCycleEvent(): all service requests now completed, sending navigation event to adaptor "+id);var a=this.getAdaptorById(id);a.handleBusinessLifeCycleEvent(e);}}
FormController.prototype.validateForm=function(showErrorDialog,showFirstInvalidField,ignoreSubmissibility)
{if(ignoreSubmissibility==true)
{return this.validateFormIgnoringSubmissibility(showErrorDialog,showFirstInvalidField);}
var invalidFields=new Array();Services.startTransaction();var as=this.m_adaptors;for(var i=0,l=as.length;i<l;i++)
{var a=as[i];if(a.invokeIsTemporary)
{a.invokeIsTemporary();}}
Services.endTransaction();var submissible=this.getFormAdaptor().isSubmissible();if(false==submissible)
{var as=this.m_adaptors;for(var i=0,l=as.length;i<l;i++)
{var a=as[i];if(a.getDataBinding&&!a.isSubmissible()&&a.includeInValidation==true)
{invalidFields[invalidFields.length]=a;}}
if(invalidFields.length>0)
{this.showInvalidFields(invalidFields,showErrorDialog,showFirstInvalidField);}}
return invalidFields;}
FormController.prototype.validateFormIgnoringSubmissibility=function(showErrorDialog,showFirstInvalidField)
{var invalidFields=new Array();var as=this.m_adaptors;for(var i=0,l=as.length;i<l;i++)
{var a=as[i];var supportsTemporary=(a.hasTemporary!=null);if(!supportsTemporary||(supportsTemporary&&!a.invokeIsTemporary()))
{if(a.getDataBinding)
{if(a.hasValue())
{if(a.hasValidate&&(a.getLastError()!=null)&&a.includeInValidation==true)
{invalidFields[invalidFields.length]=a;}}
else
{if(a.hasIsMandatory&&a.getMandatory()&&a.includeInValidation==true)
{invalidFields[invalidFields.length]=a;}}}}}
if(invalidFields.length>0)
{this.showInvalidFields(invalidFields,showErrorDialog,showFirstInvalidField);}
return invalidFields;}
FormController.prototype.showInvalidFields=function(invalidFields,showErrorDialog,showFirstInvalidField)
{if(showErrorDialog)
{var dialogStyle=this.getAppController().getDialogStyle();var lineBreak=(AppConfig.FRAMEWORK_DIALOG_STYLE==dialogStyle)?"<br>":"\n";var msg="Form cannot be submitted as it has invalid values. The following fields have invalid values: ";for(var i=0;i<invalidFields.length;i++)
{var a=invalidFields[i];msg+=lineBreak+a.getDisplayName();}
if(AppConfig.FRAMEWORK_DIALOG_STYLE==dialogStyle)
{var thisObj=this;var _showFirstInvalidField=showFirstInvalidField;var callbackFunction=function(userResponse)
{if(_showFirstInvalidField)
{setTimeout(function(){thisObj.showFirstInvalidField(invalidFields,false);},0);}}
Services.showDialog(StandardDialogTypes.OK,callbackFunction,msg);showFirstInvalidField=false;}
else
{alert(msg);}}
if(showFirstInvalidField)
{this.showFirstInvalidField(invalidFields,false);}}
FormController.prototype._getFirstInvalidField=function()
{return this.m_firstInvalidField;}
FormController.prototype.showFirstInvalidField=function(invalidFields,focusOnGrids)
{if(focusOnGrids==null)focusOnGrids=false;var foundField=false;var formAdaptor=this.getFormAdaptor();mainloop:for(var i=0;i<invalidFields.length;i++)
{var field=invalidFields[i];if(focusOnGrids==true||!(field instanceof GridGUIAdaptor))
{try
{this.showInvalidField(field);foundField=true;break mainloop;}
catch(exception)
{if(exception.constructor!=ConfigurationException)
{throw exception;}}}}
if(foundField==false&&focusOnGrids==false&&invalidFields.length>0)
{this.showFirstInvalidField(invalidFields,true);}}
FormController.prototype.showInvalidField=function(field)
{var containers=this._getParentContainers(field);while(containers.length>0)
{var container=containers.pop();if(container.configComponentVisibilityProtocol)
{container.show(true);}}
field.showNonSubmissibleParents();this.getTabbingManager().setFocusOnAdaptor(field);this.m_firstInvalidField=field;}
FormController.prototype._getParentContainers=function(adaptor)
{var parent=adaptor.getParentContainer();if(null==parent)
{return[];}
else
{var containers=[parent];return containers.concat(this._getParentContainers(parent));}}
FormController.prototype.dispatchBusinessLifeCycleEvent=function(id,type,detail)
{var eventAdaptor=null;if(type==BusinessLifeCycleEvents.EVENT_RAISE)
{eventAdaptor=FormController.getInstance().getAdaptorById(id);if(eventAdaptor instanceof PopupSubformGUIAdaptor)
{if(eventAdaptor.subformViewFormControllerExists())
{eventAdaptor.setSubformViewFormControllerBusinessLifeCycleEventSubmission(true);}}}
if(this.m_allowBusinessLifeCycleEventSubmission!=false)
{if(FormController.m_logger.isDebug())
{FormController.m_logger.debug("Dispath business life cycle event id: "+id+", type: "+type+", detail: "+detail);}
var q=this.m_businessLifeCycleEventQueue;q[q.length]=BusinessLifeCycleEvent.create(id,type,detail);if(this.m_businessLifeCycleEventTimeout==null)
{var thisObj=this;this.m_businessLifeCycleEventTimeout=setTimeout(function(){thisObj.processEvents();},0);}
if(type==BusinessLifeCycleEvents.EVENT_LOWER)
{eventAdaptor=FormController.getInstance().getAdaptorById(id);if(eventAdaptor instanceof PopupSubformGUIAdaptor)
{if(eventAdaptor.subformViewFormControllerExists())
{eventAdaptor.setSubformViewFormControllerBusinessLifeCycleEventSubmission(false);}}}}}
FormController.prototype.setAllowBusinessLifeCycleEventSubmission=function(allowEventSubmission)
{this.m_allowBusinessLifeCycleEventSubmission=allowEventSubmission;}
FormController.prototype.queueEvent=function(n,a,e,detail)
{this.m_eventQueueMap.addEventToNamedQueue(n,a,e,detail);}
FormController.prototype.removeXPathsBeforeFormNavigation=function()
{var formAdaptor=this.getFormAdaptor();var removeXPaths=formAdaptor.m_removeXPaths;formAdaptor.removeSelectedXPaths(removeXPaths);}
FormController.exitApplication=function()
{var fc=FormController.getInstance();fc.getAppController().exit();}
FormController.handleFatalException=function(exception)
{fwException.invokeFatalExceptionHandler(exception);}
FormController.setFatalExceptionHandler=function(func)
{fwException.setFatalExceptionHandler(func);}
FormController.prototype.getWordProcessingGUIAdaptors=function()
{return this.m_wordProcessingGUIAdaptors;}
FormController.prototype.addWordProcessingGUIAdaptor=function(adaptor)
{this.m_wordProcessingGUIAdaptors[this.m_wordProcessingGUIAdaptors.length]=adaptor;}
FormController.prototype.FCKeditorLoadingComplete=function()
{var loadingComplete=true;var wordProcessingGUIAdaptors=this.m_wordProcessingGUIAdaptors;for(var i=0,l=wordProcessingGUIAdaptors.length;i<l;i++)
{if(wordProcessingGUIAdaptors[i].getFCKeditorLoadComplete()==false)
{loadingComplete=false;break;}}
return loadingComplete;}
FormController.prototype.showAlert=function(msg,callback)
{var ac=this.getAppController();callback=(null==callback)?function(userResponse){}:callback;if(ac.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{Services.showDialog(StandardDialogTypes.OK,callback,msg);}
else
{alert(msg);}}
FormController.prototype.addEnablementEventBinding=function(eventBinding)
{var id=eventBinding.getId();if(null==this.m_enablementEventBindings[id])
{this.m_enablementEventBindings[id]=eventBinding;}}
FormController.prototype.getEnablementEventBindingById=function(id)
{return this.m_enablementEventBindings[id];}
FormController.prototype.showFormExtensionPopup=function(elementId)
{if(FormController.m_logger.isError())FormController.m_logger.error("showFormExtensionPopup is deprecated - use Services.dispatchEvent(popup_id, PopupGUIAdaptor.EVENT_RAISE); to show popups");Services.dispatchEvent(elementId,PopupGUIAdaptor.EVENT_RAISE);}
FormController.prototype.hideFormExtensionPopup=function()
{if(FormController.m_logger.isError())FormController.m_logger.error("hideFormExtensionPopup is deprecated - use Services.dispatchEvent(popup_id, PopupGUIAdaptor.EVENT_LOWER); to show popups");if(AbstractPopupGUIAdaptor.m_popups.length>0)
{Services.dispatchEvent(AbstractPopupGUIAdaptor.m_popups[AbstractPopupGUIAdaptor.m_popups.length-1].getId(),PopupGUIAdaptor.EVENT_LOWER);}}
FormController.prototype._setDOM=function(dom)
{alert("FormController._setDOM() is deprecated and is scheduled to be removed in the next Framework release.\nUsing it _will_ break your form and application!");if(FormController.m_logger.isError())FormController.m_logger.error("_setForm is deprecated!");fc_assert(null!=dom,"DOM cannot be null");this.m_dataModel.setInternalDOM(dom);}
FormController.prototype.getDOM=function(dom)
{alert("FormController.getDOM() is deprecated and is scheduled to be removed in the next Framework release.\nUsing it _will_ break your form and application!");if(FormController.m_logger.isError())FormController.m_logger.error("getDOM is deprecated!");return this.m_dataModel.getInternalDOM();}
function BusinessException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='BusinessException';}
BusinessException.prototype=new fwException()
BusinessException.prototype.constructor=BusinessException;function TestBusinessException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','TestBusinessException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='TestBusinessException';}
TestBusinessException.prototype=new BusinessException()
TestBusinessException.prototype.constructor=TestBusinessException;function SystemException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='SystemException';}
SystemException.prototype=new fwException()
SystemException.prototype.constructor=SystemException;function UpdateLockedException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','UpdateLockedException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='UpdateLockedException';}
UpdateLockedException.prototype=new BusinessException()
UpdateLockedException.prototype.constructor=UpdateLockedException;function ConfigurationException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','ConfigurationException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='ConfigurationException';}
ConfigurationException.prototype=new SystemException()
ConfigurationException.prototype.constructor=ConfigurationException;function SecurityException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','SecurityException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='SecurityException';}
SecurityException.prototype=new SystemException()
SecurityException.prototype.constructor=SecurityException;function RetryableException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','RetryableException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='RetryableException';}
RetryableException.prototype=new SystemException()
RetryableException.prototype.constructor=RetryableException;function DataException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','DataException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='DataException';}
DataException.prototype=new SystemException()
DataException.prototype.constructor=DataException;function ServiceLocatorException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','ServiceLocatorException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='ServiceLocatorException';}
ServiceLocatorException.prototype=new SystemException()
ServiceLocatorException.prototype.constructor=ServiceLocatorException;function FiltrationException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','FiltrationException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='FiltrationException';}
FiltrationException.prototype=new SystemException()
FiltrationException.prototype.constructor=FiltrationException;function AuthorisationException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','AuthorisationException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='AuthorisationException';}
AuthorisationException.prototype=new BusinessException()
AuthorisationException.prototype.constructor=AuthorisationException;function ExistenceCheckException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','ExistenceCheckException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='ExistenceCheckException';}
ExistenceCheckException.prototype=new BusinessException()
ExistenceCheckException.prototype.constructor=ExistenceCheckException;function ValidationException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','ValidationException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='ValidationException';}
ValidationException.prototype=new BusinessException()
ValidationException.prototype.constructor=ValidationException;function ConfigurationItemException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','ConfigurationItemException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='ConfigurationItemException';}
ConfigurationItemException.prototype=new SystemException()
ConfigurationItemException.prototype.constructor=ConfigurationItemException;function LockingException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','LockingException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='LockingException';}
LockingException.prototype=new SystemException()
LockingException.prototype.constructor=LockingException;function LockUnavailableException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','LockUnavailableException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='LockUnavailableException';}
LockUnavailableException.prototype=new BusinessException()
LockUnavailableException.prototype.constructor=LockUnavailableException;function SQLStatementException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','SQLStatementException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='SQLStatementException';}
SQLStatementException.prototype=new SystemException()
SQLStatementException.prototype.constructor=SQLStatementException;function QueryEngineException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','QueryEngineException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='QueryEngineException';}
QueryEngineException.prototype=new SystemException()
QueryEngineException.prototype.constructor=QueryEngineException;function AuthenticationException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','AuthenticationException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='AuthenticationException';}
AuthenticationException.prototype=new BusinessException()
AuthenticationException.prototype.constructor=AuthenticationException;function EncodingException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','EncodingException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='EncodingException';}
EncodingException.prototype=new BusinessException()
EncodingException.prototype.constructor=EncodingException;function InvalidUserSessionException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','BusinessException','InvalidUserSessionException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='InvalidUserSessionException';}
InvalidUserSessionException.prototype=new BusinessException()
InvalidUserSessionException.prototype.constructor=InvalidUserSessionException;function SecurityFactoryException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','SecurityFactoryException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='SecurityFactoryException';}
SecurityFactoryException.prototype=new SystemException()
SecurityFactoryException.prototype.constructor=SecurityFactoryException;function HttpConnectionException(message,causedBy,exceptionHierarchy)
{this.message=message;this.m_rootCause=causedBy;if(undefined==exceptionHierarchy)
{this.exceptionHierarchy=new Array('Error','SystemException','HttpConnectionException');}
else
{this.exceptionHierarchy=exceptionHierarchy;}
this.name='HttpConnectionException';this.m_responseStatus=null;}
HttpConnectionException.prototype=new SystemException()
HttpConnectionException.prototype.constructor=HttpConnectionException;HttpConnectionException.prototype.setResponseStatus=function(responseStatus)
{this.m_responseStatus=responseStatus;}
HttpConnectionException.prototype.getResponseStatus=function()
{return this.m_responseStatus;}
function User(userName,sessionKey)
{this.m_userName=userName;this.m_sessionKey=sessionKey;}
User.prototype.getUserName=function()
{return this.m_userName;}
User.prototype.getSessionKey=function()
{return this.m_sessionKey;}
var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz));}
function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz));}
function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz));}
function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data));}
function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data));}
function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data));}
function md5_vm_test()
{return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72";}
function core_md5(x,len)
{x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16)
{var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}
return Array(a,b,c,d);}
function md5_cmn(q,a,b,x,s,t)
{return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
function md5_ff(a,b,c,d,x,s,t)
{return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}
function md5_gg(a,b,c,d,x,s,t)
{return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}
function md5_hh(a,b,c,d,x,s,t)
{return md5_cmn(b^c^d,a,b,x,s,t);}
function md5_ii(a,b,c,d,x,s,t)
{return md5_cmn(c^(b|(~d)),a,b,x,s,t);}
function core_hmac_md5(key,data)
{var bkey=str2binl(key);if(bkey.length>16)bkey=core_md5(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128);}
function safe_add(x,y)
{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
function bit_rol(num,cnt)
{return(num<<cnt)|(num>>>(32-cnt));}
function str2binl(str)
{var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)
bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);return bin;}
function binl2str(bin)
{var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)
str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);return str;}
function binl2hex(binarray)
{var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="{";for(var i=0;i<binarray.length*4;i++)
{if(i>0)
{str+=":";}
str+="0x"+hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+
hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);}
str+="}";return str;}
function binl2b64(binarray)
{var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3)
{var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++)
{if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F);}}
return str;}
function SecurityContext(sessionKey,user,appController)
{this.sessionKey=sessionKey;this.user=user;this.m_appController=appController;}
SecurityContext.prototype.hasAccess=function(formRequiredRoles)
{if(formRequiredRoles==null||formRequiredRoles.length==0)
{return true;}
var appRoles=this.m_appController.getAppRoles();var getRolesService=this.m_appController.getSecurityServiceByName("getRoles");if(getRolesService==null)
{throw new AppConfigError("No Service found for getRoles security service - can't verify user roles for form access");}
var fc=this.m_appController.getFormController();var userRolesNode=fc.getDataModel().getNode(getRolesService.getDataBinding());var usersRoles=new Array();if(userRolesNode!=null)
{var userRoleNodes=userRolesNode.selectNodes("//role");for(var j=0;j<userRoleNodes.length;j++)
{var userRole=XML.getNodeTextContent(userRoleNodes[j]);usersRoles[usersRoles.length]=userRole;var parents=appRoles.getParentsOfRole(userRole);usersRoles=usersRoles.concat(parents);}}
var foundRole=false;for(var i=0;i<formRequiredRoles.length;i++)
{for(var k=0;k<usersRoles.length;k++)
{if(formRequiredRoles[i]==usersRoles[k])
{foundRole=true;break;}}
if(foundRole==true)
{break;}}
return foundRole;}
SecurityContext.prototype.getCurrentUser=function()
{return this.user;}
SecurityContext.prototype.getSessionKey=function()
{return this.sessionKey;}
SecurityContext.prototype.generateMac=function(params)
{var macString=params+this.user.getUserName()+this.sessionKey;return hex_md5(macString);}
function initAppController(contentFrameId,configURL,wsElement,headerLeft,headerTitle,headerRight,loggingConfigURL,rolesURL)
{LoggingImpl.initialise(loggingConfigURL);Logging.initialise(window);AppController.initialise(contentFrameId,configURL,rolesURL,headerLeft,headerTitle,headerRight);}
function AppController()
{}
AppController.prototype._initialise=function(contentFrameId,configURL,rolesURL,headerLeft,headerTitle,headerRight)
{this.startLoad=new Date();if(AppController.m_logger.isTrace())AppController.m_logger.trace("Application Controller Constructor.");HTMLView.blockEventsForDocument(window.document);fc_assert(null!=headerLeft&&""!=headerLeft,"AppController(): headerLeft was null or empty: "+headerLeft);fc_assert(null!=headerTitle&&""!=headerTitle,"AppController(): headerTitle was null or empty: "+headerTitle);fc_assert(null!=headerRight&&""!=headerRight,"AppController(): headerRight was null or empty: "+headerRight);this.m_rootURL=getBaseURL(document);this.m_requestTimeout=null;this.m_requestCount=0;this.m_requestProgress=0;this.m_progressBarVisible=null;this.m_currentForm=null;this.m_headerLeft=document.getElementById(headerLeft);this.m_headerTitle=document.getElementById(headerTitle);this.m_headerRight=document.getElementById(headerRight);this.m_sessionData=null;this.m_errorMessages=new Array();this.m_modalCallbackList=new CallbackList();this.m_modal=false;this.m_config=new AppConfig(configURL);if(AppController.m_logger.isTrace())AppController.m_logger.trace("ApplicationController() got the m_config for the specified url("+configURL+") "+this.m_config);this.m_mainFormView=HTMLFrameFormViewManager.manageExistingFrame(document.getElementById(contentFrameId));var ac=this;this.m_mainFormView.registerViewReadyListener(function(){ac._loadFormComplete();});this.m_mainFormView.registerFormReadyListener(function(){ac._formReady();});this.m_appRoles=new AppRoles(rolesURL);if(AppController.m_logger.isTrace())AppController.m_logger.trace("ApplicationController() got the m_appRoles for the specified url("+rolesURL+") "+this.m_appRoles);this.m_serviceRequestCount=0;this._setSecurityContext("Empty Session Key","anonymous");this.m_styleManager=new StyleManager();this.m_styleManager.setConfiguration(this.m_config);this.m_appView=HTMLFormViewManager.create();this.m_appView._waitForFrameworkToLoad();this._loadInitialPage();this._showDate();}
AppController.m_logger=new Category("AppController");AppController.m_instance=null;AppController.prototype.m_navigateToForm=null;AppController.prototype.m_userLoggingOut=null;AppController.prototype.m_eventProcessingTimeout=null;AppController.prototype.m_httpRequest=null;AppController.prototype.m_refDataCache=new Array();AppController.SESSION_DATA_XPATH="/ds/var/app";AppController.initialise=function(contentFrameId,configURL,rolesURL,headerLeft,headerTitle,headerRight)
{fc_assert(null==AppController.m_instance,"ApplicationController.initialise(): instance already exists");if(AppController.m_logger.isTrace())AppController.m_logger.trace("ApplicationController.initialise()");AppController.m_instance=new AppController();AppController.m_instance._initialise(contentFrameId,configURL,rolesURL,headerLeft,headerTitle,headerRight);if(AppController.m_logger.isTrace())AppController.m_logger.trace("ApplicationController.initialise() finished");AppController.m_errorMessages=AppController.buildErrorMessageDOMList(AppController.m_instance.m_config.m_errorMessagesNode);}
AppController.prototype.getSecurityContext=function()
{return this.m_securityContext;}
AppController.getInstance=function()
{fc_assert(null!=AppController.m_instance,"ApplicationController.getInstance() ApplicationController not initialised");return AppController.m_instance;}
AppController.shutdown=function()
{var ac=AppController.getInstance();ac.dispose();ac.shutdown();}
AppController.prototype.dispose=function()
{this.m_mainFormView.dispose();this.m_appView.dispose();this.m_styleManager.dispose();this.m_styleManager=null;this.m_securityContext=null;this.m_appRoles=null;this.m_config=null;this.m_modalCallbackList=null;this.m_errorMessages=null;this.m_sessionData=null;this.m_session=null;this.m_headerRight=null;this.m_headerTitle=null;this.m_headerLeft=null;this.m_currentForm=null;this.m_rootURL=null;}
AppController.prototype.getRootURL=function()
{return this.m_rootURL;}
AppController.prototype.getPerformanceMonitor=function()
{return this.m_perfMonitor;}
AppController.prototype.getDebugMode=function()
{return this.m_config.m_debugMode;}
AppController.prototype.getWaitForConfigLoadingMode=function()
{return this.m_config.m_waitForConfigLoadingMode;}
AppController.prototype._loadInitialPage=function()
{var initialForm=this.m_config.getInitialPage();this.navigate(initialForm.getName());}
AppController.prototype.getInitialFormName=function()
{return this.m_config.getInitialPage().getName();}
AppController.prototype.addModalCallback=function(callback)
{this.m_modalCallbackList.addCallback(callback);}
AppController.prototype.modalState=function(modal)
{if(this.m_modal!=modal)
{this.m_modalCallbackList.invoke(modal);this.m_modal=modal;}}
AppController.prototype.getFormController=function()
{return this.m_mainFormView.getFormController();}
AppController.prototype.navigate=function(name,mode)
{if(mode==NavigateFormBusinessLifeCycle.EXIT)
{if(null==this.m_eventProcessingTimeout)
{this.m_eventProcessingTimeout=setTimeout("AppController.getInstance()._exit()",0);}}
else
{this.m_navigateToForm=name;if(mode==NavigateFormBusinessLifeCycle.LOGOUT)
{this.m_userLoggingOut=true;}
else
{this.m_userLoggingOut=false;}
if(null==this.m_eventProcessingTimeout)
{this.m_eventProcessingTimeout=setTimeout("AppController.getInstance()._loadForm()",0);}}}
AppController.prototype._setSecurityContext=function(sessionKey,user)
{var userObj=new User(user);this.m_securityContext=new SecurityContext(sessionKey,userObj,this);this._showUser();}
AppController.prototype._loadForm=function()
{this.startLoad=new Date();this.m_eventProcessingTimeout=null;var name=this.m_navigateToForm;var userLoggingOut=this.m_userLoggingOut;var fc=this.m_mainFormView.getFormController();if(userLoggingOut)
{if(null!=fc)
{var securityService=this.getSecurityServiceByName("getRoles");var db=securityService.getDataBinding();var dataModel=fc.getDataModel();if(dataModel.exists(db))
{dataModel.removeNode(db);}
if(dataModel.exists(AppController.SESSION_DATA_XPATH))
{dataModel.removeNode(AppController.SESSION_DATA_XPATH);}
if(null!=this.m_sessionData)
{this.m_sessionData=null;}}
this._setSecurityContext("Empty Session Key","anonymous");}
var form=this.m_config.getForm(name);if(null!=form)
{if(this.m_securityContext.hasAccess(form.getRoles()))
{if(!userLoggingOut&&(fc!=null))
{fc.removeXPathsBeforeFormNavigation();var node=fc.getDataModel().getNode(AppController.SESSION_DATA_XPATH);this.m_sessionData=(null!=node)?node.cloneNode(true):null;}
this._showProgress();var pageURL=this.getURLForForm(name);this.m_currentForm=form;var styleSheets=this.getCSSDefinitionsForForm(name);this.m_mainFormView.loadView(pageURL,styleSheets);}
else
{var formTitle=form.getTitle();if(null==formTitle||formTitle=="")
{formTitle=name;}
var msg="You do not have the appropriate role to access form "+formTitle;if(fc!=null&&this.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{fc.showAlert(msg);}
else
{alert(msg);}}}
else
{if(AppController.m_logger.isError())AppController.m_logger.error("AppController._loadForm() form not found: "+this.m_navigateToForm);}
this.m_navigateToForm=null;this.m_userLoggingOut=null;}
AppController.prototype._formReady=function()
{this._hideProgress();}
AppController.prototype._loadFormComplete=function()
{this.loadPrecompile();}
AppController.prototype.loadPrecompile=function()
{if(top.AppController.getInstance().m_config.getPrecompileEnabled()&&(this.m_currentForm.getPrecompile()!="no"&&this.m_currentForm.getPrecompile()!="static")){Logging.logMessage("Creating and loading Precompile for form",Logging.LOGGING_LEVEL_INFO);var url=this.m_rootURL+this.m_config.getAppBaseURL()+"/precompile/"
+this.m_currentForm.getName()+".js";var async=false;if(null==this.m_httpRequest)
{this.m_httpRequest=new XMLHttpServiceRequest();}
this.m_httpRequest.initialise(this,url,async,null,handlePrecompileReadyStateChange);this.m_httpRequest.sendGET("loadPrecompiled");}
else{top.AppController.getInstance()._loadPrecompileComplete();}}
function handlePrecompileReadyStateChange(handlerArgs)
{var ac=top.AppController.getInstance();var httpRequest=ac.m_httpRequest;var request=httpRequest.getRequest();if(request.readyState==4)
{if(request.status==200)
{var javascript=request.responseText;ac.m_mainFormView.m_frame.m_frame.contentWindow.eval(javascript);}
ac.m_httpRequest.dispose();ac.m_httpRequest=null;ac._loadPrecompileComplete();}}
AppController.prototype._loadPrecompileComplete=function()
{this.m_mainFormView._startFormController(this.getSessionDataFromPreviousForm(),null,this.m_currentForm.isFUnit());this.m_headerTitle.innerHTML=this.m_currentForm.getTitle();if(AppController.m_logger.isTrace())AppController.m_logger.trace("AppController.loadContentComplete() callback function invoked by the m_contenFrame.onload handler");}
AppController.prototype._exit=function()
{this.m_eventProcessingTimeout=null;AppController.shutdown();}
AppController.prototype.getCurrentForm=function()
{return this.m_currentForm;}
AppController.prototype.setCurrentFormByName=function(formName)
{this.m_currentForm=this.m_config.getForm(formName);}
AppController.prototype.getURLForForm=function(name)
{var form=this.m_config.getForm(name);var pageRelativeURL=form.getPageURL();var pageURL=this.m_config.getAppBaseURL();if(pageRelativeURL.indexOf('/')!=0)
{pageURL+=this.m_config.getFormsBaseURL()+'/';}
pageURL+=pageRelativeURL;return pageURL;}
AppController.prototype.getURLForFrameworkSubForm=function(pageRelativeURL)
{var pageURL=this.m_config.getAppBaseURL();pageURL+=pageRelativeURL;return pageURL;}
AppController.prototype.getCSSDefinitionsForForm=function(name)
{var form=this.m_config.getForm(name);var ss1=this.m_config.getCommonCSS();var ss2=form.getFormCSS();var ss=[];if(null!=ss1)
{ss=ss.concat(ss1);}
if(null!=ss2)
{ss=ss.concat(ss2);}
return ss;}
AppController.prototype.getSessionDataFromPreviousForm=function()
{if(this.m_sessionData)
{var returnArray=new Array();returnArray.push(this.m_sessionData);return returnArray;}
else
{return null;}}
AppController.prototype.getStyleManager=function()
{return this.m_styleManager;}
AppController.prototype.shutdown=function()
{window.close();}
AppController.prototype.getSecurityServices=function()
{return this.m_config.getSecurityServices();}
AppController.prototype.getSecurityServiceByName=function(name)
{return this.m_config.getSecurityServiceByName(name);}
AppController.prototype.getAppRoles=function()
{return this.m_appRoles;}
AppController.prototype.setRefDataRootNodeForCurrentForm=function(serviceName,rootNodeName)
{this.m_refDataCache[serviceName]=rootNodeName;}
AppController.prototype.getRefDataRootNodeForCurrentForm=function(serviceName)
{return this.m_refDataCache[serviceName];}
AppController.prototype.logoff=function(formName,raiseWarningIfDOMDirty)
{if(raiseWarningIfDOMDirty!=true)
{raiseWarningIfDOMDirty=false;}
var fc=this.m_mainFormView.getFormController();if(!raiseWarningIfDOMDirty)
{var securityService=this.getSecurityServiceByName("getRoles");var db=securityService.getDataBinding();fc.getDataModel().removeNode(db);fc.getDataModel().removeNode(AppController.SESSION_DATA_XPATH);this.m_sessionData=null;}
if(formName==null)
{formName=this.getInitialFormName();}
var adaptor=fc.getFormAdaptor();var details={formName:formName,raiseWarningIfDOMDirty:raiseWarningIfDOMDirty,mode:NavigateFormBusinessLifeCycle.LOGOUT};fc.dispatchBusinessLifeCycleEvent(adaptor.getId(),BusinessLifeCycleEvents.EVENT_NAVIGATE,details);}
AppController.prototype.exit=function()
{var fc=this.m_mainFormView.getFormController();var adaptor=fc.getFormAdaptor();var details={mode:NavigateFormBusinessLifeCycle.EXIT,raiseWarningIfDOMDirty:(adaptor._getState()!=null)};fc.dispatchBusinessLifeCycleEvent(adaptor.getId(),BusinessLifeCycleEvents.EVENT_NAVIGATE,details);}
AppController.prototype.getServiceRequestCount=function()
{return this.m_serviceRequestCount;}
AppController.prototype._showProgress=function()
{this.m_requestCount++;if(1==this.m_requestCount)
{document.body.style.cursor='wait';this.m_requestProgress=0;var progress=document.getElementById("progress");if(null!=progress)
{progress.style.visibility="visible";this.m_progressBarVisible=true;this.m_requestTimeout=window.setTimeout("AppController._updateProgress()",100);}}}
AppController.prototype._hideProgress=function(fc)
{this.m_requestCount--;if(0>=this.m_requestCount)
{document.body.style.cursor='default';this.m_requestCount=0;if(null!=this.m_requestTimeout)window.clearTimeout(this.m_requestTimeout);var progress=document.getElementById("progress");if(null!=progress)
{if(window.attachEvent)
{if(null!=fc)
{var tm=fc.getTabbingManager();if(null!=tm)
{tm.resetBrowserFocusOnCurrentFocussedAdaptor();tm=null;}}}
progress.style.visibility="hidden";this.m_progressBarVisible=false;}}
fc=null;}
AppController._updateProgress=function()
{var ac=AppController.getInstance();var progressIFrameElement=document.getElementById("progressFrame");if(null!=progressIFrameElement)
{var frameDoc=getIframeDocument(progressIFrameElement);if(null!=frameDoc)
{var bar=frameDoc.getElementById("progress_bar");if(null!=bar)
{ac.m_requestProgress++;if(ac.m_requestProgress>100)
{ac.m_requestProgress=0;}
bar.style.width=ac.m_requestProgress+"%";}}}
ac.m_requestTimeout=window.setTimeout("AppController._updateProgress()",100);}
AppController.prototype.handlePageError=function()
{var fc=this.m_mainFormView.getFormController();var msg="Page reported an error";if(fc!=null&&this.getDialogStyle()==AppConfig.FRAMEWORK_DIALOG_STYLE)
{var callbackFunction=function(userResponse)
{var ac=Services.getAppController();if(ac!=null)ac._loadInitialPage();}
fc.showAlert(msg,callbackFunction);}
else
{alert(msg);this._loadInitialPage();}}
AppController.prototype._showUser=function()
{var userName=null;if(null!=this.m_securityContext&&this.m_securityContext.getCurrentUser().getUserName()!="anonymous"){var user=this.m_securityContext.getCurrentUser();userName=user.getUserName();}
else
{userName="<i>Not logged in</i>";}
this.m_headerLeft.innerHTML="<b>User: </b>"+userName;}
AppController.prototype._showDate=function()
{var t=new Date();var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var month=months[t.getMonth()];var day=t.getDate();if(t.getDate()<10)day="0"+t.getDate();this.m_headerRight.innerHTML="<b>Date: </b>"+day+"-"+month+"-"+t.getFullYear();}
AppController.prototype.getExternalComponents=function()
{if(AppController.m_logger.isInfo())AppController.m_logger.info("AppController.getExternalComponents()");var result=new Array();if(null!=this.m_config.m_externalComponentsNode)
{var nodes=this.m_config.m_externalComponentsNode.selectNodes('externalComponent');if(AppController.m_logger.isInfo())AppController.m_logger.info("AppController.getExternalComponents() nodes.length = "+nodes.length);for(var i=0;i<nodes.length;i++)
{var c=new ExternalComponentConfig(nodes[i]);result[i]=c;if(AppController.m_logger.isInfo())AppController.m_logger.info("AppController.getExternalComponents() found external component: "+c);}}
return result;}
AppController.buildErrorMessageDOMList=function(node)
{if(AppController.m_logger.isInfo())AppController.m_logger.info("AppController.getErrorMessages()");var messageFiles=new Array();var nodes=node.selectNodes('file');if(AppController.m_logger.isInfo())AppController.m_logger.info("AppController.getErrorMessages() nodes.length = "+nodes.length);var filePathNode=null;var dom=null;for(var i=0;i<nodes.length;i++)
{filePathNode=nodes[i].getAttribute('path');if(null==filePathNode)
{if(AppController.m_logger.isError())AppController.m_logger.error("No path attribute found for error message file node from app configuration");}
dom=Services.loadDOMFromURL(filePathNode);if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig():buildErrorMessageDOMList() loaded dom for URL: "+path);messageFiles[messageFiles.length]=dom;}
return messageFiles;}
AppController.prototype.getErrorMsgForCode=function(errorId)
{var dom=null;var messageNode=null;var tempErrorNode=null;var url="";for(var i=0;i<AppController.m_errorMessages.length&&null==messageNode;i++)
{dom=AppController.m_errorMessages[i];url="/errors/error[@id='"+errorId+"']";messageNode=dom.selectSingleNode(url);}
if(null==messageNode)
{if(AppController.m_logger.isWarn())AppController.m_logger.warn("AppController.getErrorMsgForNode() No Error Message found for code: "+errorId);}
return(null==messageNode)?"":XML.getNodeTextContent(messageNode);}
AppController.prototype.getMenuPanelItems=function(menuPanelXPath)
{return this.m_config.getMenuPanelItems(menuPanelXPath);}
AppController.prototype.getProjectName=function()
{return this.m_config.getProjectName();}
AppController.prototype.getDialogStyle=function()
{return this.m_config.getDialogStyle();}
AppController.prototype.getValidateWhitespaceOnlyEntryActive=function()
{return this.m_config.getValidateWhitespaceOnlyEntryActive();}
AppController.prototype.getExceptionHandlers=function()
{return this.m_config.getExceptionHandlers();}
AppController.prototype.getHttpConnectionErrorRetryLimit=function()
{return this.m_config.getHttpConnectionErrorRetryLimit();}
AppController.prototype.getHttpConnectionErrorRetryResponses=function()
{return this.m_config.getHttpConnectionErrorRetryResponses();}
AppController.prototype.isProgressBarVisible=function()
{return this.m_progressBarVisible==true;}
function ExternalComponentConfig(node)
{var classNameNode=node.getAttribute('className');if(null==classNameNode)
{if(AppController.m_logger.isError())AppController.m_logger.error("No class name attribute found for external component node from app configuration");}
this.m_className=classNameNode;var factoryMethodNode=node.getAttribute('factoryMethod');if(null==factoryMethodNode)
{if(AppController.m_logger.isError())AppController.m_logger.error("No factory method attribute found for external component node from app configuration");}
this.m_factoryMethod=factoryMethodNode
var cssClassNameNode=node.getAttribute('cssClassName');if(null==cssClassNameNode)
{if(AppController.m_logger.isError())AppController.m_logger.error("No cssClassName attribute found for external component node from app configuration");}
this.m_cssClassName=cssClassNameNode;}
ExternalComponentConfig.prototype.getClassName=function()
{return this.m_className;}
ExternalComponentConfig.prototype.getCSSClassName=function()
{return this.m_cssClassName;}
ExternalComponentConfig.prototype.getFactoryMethod=function()
{return this.m_factoryMethod;}
ExternalComponentConfig.prototype.toString=function()
{return"[ExternalComponentConfig className: "+this.m_className+", factoryMethod: "+this.m_factoryMethod+", cssClassName:"+this.m_cssClassName+"]"}
function AppRole(name,parent)
{this.m_name=name;this.m_parent=parent;}
AppRole.prototype.getName=function()
{return this.m_name;}
AppRole.prototype.getParent=function()
{return this.m_parent;}
function AppRoles(rolesURL)
{if(AppController.m_logger.isTrace())AppController.m_logger.trace("AppRoles("+rolesURL+") constructor starts");var dom=Services.loadDOMFromURL(rolesURL);if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppRoles() loading roles configuration: "+rolesURL);this.m_rolesConfig=dom;if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig() storing dom (<font size=1>"+XML.showDom(this.m_rolesConfig)+"</font>)as m_rolesConfig of this AppRoles instance");this.m_rolesDocNode=dom.selectSingleNode('/Roles');if(null==this.m_rolesDocNode)
{throw new AppConfigError("No roles node specified for the application");}
this.m_roleNodes=this.m_rolesDocNode.selectNodes('./Role');this.m_roles=new Array();var roleNodes=this.m_roleNodes;var roleNodesLength=roleNodes.length;for(var i=0;i<roleNodesLength;i++)
{var roleNode=roleNodes[i];var name=roleNode.getAttribute('name');var parent=null;var parentId=roleNode.getAttribute('parent')
if(parentId!=null)
{var parentNode=this.m_rolesDocNode.selectSingleNode('./Role[./@id = \''+parentId+'\']');parent=parentNode.getAttribute('name');}
this.m_roles[name]=new AppRole(name,parent);}}
AppRoles.prototype.getRoles=function()
{return this.m_roles;}
AppRoles.prototype.getRolesNode=function()
{return this.m_rolesDocNode;}
AppRoles.prototype.getChildrenOfRole=function(roleName)
{var children=new Array();children=this.getChildren(roleName,children);return children;}
AppRoles.prototype.getChildren=function(roleName,children)
{var roles=this.m_roles;for(var i in roles)
{var role=roles[i];var parent=role.getParent();if(parent==roleName)
{children[children]=i;this.getChildren(i,children);}}
return children;}
AppRoles.prototype.getParentsOfRole=function(roleName)
{var parents=new Array();parents=this.getParents(roleName,parents);return parents;}
AppRoles.prototype.getParents=function(roleName,parents)
{var role=this.m_roles[roleName];if(role!=null)
{var parent=role.getParent();if(parent!=null)
{parents[parents.length]=parent;this.getParents(parent,parents);}}
return parents;}
function AppConfig(configURL)
{if(AppController.m_logger.isTrace())AppController.m_logger.trace("AppConfig("+configURL+") constructor starts");this.m_loadedForms=new Array();var dom=Services.loadDOMFromURL(configURL);if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig() loading application configuration: "+configURL);this.m_config=dom;if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig() storing dom (<font size=1>"+XML.showDom(this.m_config)+"</font>)as m_config of this AppConfig instance");this.m_configDocNode=dom.selectSingleNode('/application-config');fc_assert((null!=this.m_configDocNode),"Problem using Application Configuration - no /application-config found.");var debugNode=this.m_configDocNode.getAttribute('debug');this.m_debugMode=((null!=debugNode)&&(debugNode=="true"));var waitForConfigLoadingNode=this.m_configDocNode.getAttribute('waitForConfigLoading');this.m_waitForConfigLoadingMode=true;if((null!=waitForConfigLoadingNode)&&(waitForConfigLoadingNode=="false"))
{this.m_waitForConfigLoadingMode=false;}
this.m_formsNode=this.m_configDocNode.selectSingleNode('./forms');this.m_externalComponentsNode=this.m_configDocNode.selectSingleNode('./externalComponents');this.m_errorMessagesNode=this.m_configDocNode.selectSingleNode('./error_msg_files');this.m_servicesNode=this.m_configDocNode.selectSingleNode('services');if(null==this.m_servicesNode)
{throw new AppConfigError("No services node specified for the application");}
var servicesBaseURLNode=this.m_servicesNode.getAttribute('baseURL');if(null==servicesBaseURLNode)
{throw new AppConfigError("No services baseURL specified for the application");}
this.m_servicesBaseURL=servicesBaseURLNode;if(null==this.m_servicesBaseURL)
{this.m_servicesBaseURL="";}
var servicesSecurePortNode=this.m_servicesNode.getAttribute('securePort');if(null==servicesSecurePortNode)
{this.m_servicesSecurePort="";}
else
{this.m_servicesSecurePort=servicesSecurePortNode;if(null==this.m_servicesSecurePort)
{this.m_servicesSecurePort="";}}
var commonParametersNode=this.m_servicesNode.selectSingleNode('./commonParameters');if(commonParametersNode!=null)
{this.m_commonParameters=AppConfig.getParametersFromNode(commonParametersNode);}
else
{this.m_commonParameters=new Array();}
this.m_httpConnectionErrorRetryResponseNode=this.m_servicesNode.selectSingleNode('./httpConnectionErrorRetryResponse');var appBaseURLNode=this.m_configDocNode.getAttribute('baseURL');if(null==appBaseURLNode)
{throw new AppConfigError("No application baseURL specified for the application");}
this.m_appBaseURL=appBaseURLNode;if(AppController.m_logger.isDebug())AppController.m_logger.debug("Application baseURL set to: "+this.m_appBaseURL);var editorUrlNode=this.m_configDocNode.getAttribute('editorURL');if(null==editorUrlNode)
{this.m_editorURL="/";}
else
{this.m_editorURL=editorUrlNode;}
if(AppController.m_logger.isDebug())AppController.m_logger.debug("Application editor prefix set to: "+this.m_editorURL);var spellCheckNode=this.m_configDocNode.selectSingleNode('./spell-check');this.m_spellCheckURL="/jspelliframe/JSpellIFrame.jsp";this.m_spellCheckPopup="/jspelliframe/jspellpopup.html";if(spellCheckNode!=null)
{var courtXPathNode=spellCheckNode.selectSingleNode('./court-xpath');if(courtXPathNode!=null)
{this.m_courtXPath=XML.getNodeTextContent(courtXPathNode);}}
if(spellCheckNode!=null)
{var dictionaryLabelNode=spellCheckNode.selectSingleNode('./dictionary-label');if(dictionaryLabelNode!=null)
{this.m_dictionaryLabel=XML.getNodeTextContent(dictionaryLabelNode);}}
if(spellCheckNode!=null)
{var urlNode=spellCheckNode.selectSingleNode('./url');if(urlNode!=null)
{this.m_spellCheckURL=XML.getNodeTextContent(urlNode);}}
if(spellCheckNode!=null)
{var popupNode=spellCheckNode.selectSingleNode('./popup-url');if(popupNode!=null)
{this.m_spellCheckPopup=XML.getNodeTextContent(popupNode);}}
var formsBaseURLNode=this.m_formsNode.getAttribute('baseURL');if(null==formsBaseURLNode)
{throw new AppConfigError("No forms baseURL specified for the application");}
this.m_formsBaseURL=formsBaseURLNode;if(AppController.m_logger.isDebug())AppController.m_logger.debug("Forms baseURL set to: "+this.m_formsBaseURL);this.m_menuBarNode=this.m_configDocNode.selectSingleNode('./menuBar');if(null==this.m_menuBarNode)
{throw new AppConfigError("No navigation menu bar configuration specified for the application");}
this.m_projectNode=this.m_configDocNode.selectSingleNode('./project');this.m_projectName=null;this.m_dialogStyle=null;this.m_validateWhitespaceOnlyEntryActive=null;this.m_exceptionHandlers=null;var ac=Services.getAppController();var baseStyleSheetURL=this.m_appBaseURL+this.m_formsBaseURL;this.m_appCSS=AppCSS.createFromChildren(this.m_formsNode,baseStyleSheetURL);var precompileNode=this.m_configDocNode.getAttribute('enablePrecompile');this.m_precompileEnabled=((null==precompileNode)||(precompileNode!="no"));}
AppConfig.NAVIGATION_MENU_FUNCTIONAL_COMPONENT_TYPES=["help","back","logout","exit"];AppConfig.FRAMEWORK_DIALOG_STYLE="framework";AppConfig.BROWSER_DIALOG_STYLE="browser";AppConfig.prototype.getCommonCSS=function()
{return this.m_appCSS;}
AppConfig.prototype.getCommonParameters=function()
{return this.m_commonParameters;}
AppConfig.prototype.getInitialPage=function()
{var initialFormName=this.m_configDocNode.getAttribute('initialForm');if(null==initialFormName)
{throw new AppConfigError("No initial form specified for applicaiton");}
if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig.getInitialPage(): initialForm name: "+initialFormName);return this.getForm(initialFormName);}
AppConfig.prototype.getDefaultStyleSheetName=function()
{var defaultStyleSheetNode=this.m_configDocNode.selectSingleNode('./stylesheets/@default');var defaultStyleSheetName=(null==defaultStyleSheetNode)?null:XML.getNodeTextContent(defaultStyleSheetNode);if(AppController.m_logger.isDebug())AppController.m_logger.debug("AppConfig.getDefaultStyleSheetName(): defaultStyleSheetName: "+defaultStyleSheetName);return defaultStyleSheetName;}
AppConfig.prototype.getAvailableStyleSheets=function()
{var styleSheetNodes=this.m_configDocNode.selectNodes("./stylesheets/stylesheet");var styleSheets=new Array(styleSheetNodes.length);for(var i=0,l=styleSheetNodes.length;i<l;i++)
{styleSheets[i]=new AppStyleSheet(styleSheetNodes[i]);}
return styleSheets;}
AppConfig.prototype.getAppBaseURL=function()
{return this.m_appBaseURL;}
AppConfig.prototype.getEditorURL=function()
{return this.m_editorURL;}
AppConfig.prototype.getFormsBaseURL=function()
{return this.m_formsBaseURL;}
AppConfig.prototype.getForm=function(formName)
{fc_assert(null!=formName,"AppConfig.getFormURL(): null formName argument");var form=this.m_loadedForms[formName];if(null==form)
{var formNode=this.m_formsNode.selectSingleNode('form[@name = "'+formName+'"]');if(null==formNode)
{throw new AppConfigError("Form with name '"+formName+"' not found in configuration file");}
form=new AppForm(formNode,this);this.m_loadedForms[formName]=form;}
return form;}
AppConfig.prototype.getServiceBaseURL=function()
{return this.m_servicesBaseURL;}
AppConfig.prototype.getPrecompileEnabled=function()
{return this.m_precompileEnabled;}
AppConfig.prototype.setServiceBaseURL=function(serviceBaseURL)
{this.m_servicesBaseURL=serviceBaseURL;}
AppConfig.prototype.getSecurityServiceByName=function(name)
{if(this.m_securityServicesByName==null)
{this.m_securityServicesByName=new Array();}
if(this.m_securityServicesByName[name]!=null)
{return this.m_securityServicesByName[name];}
var sessionSecurityNode=this.m_servicesNode.selectSingleNode("./service[./@security = \'true\' and ./@name = \'"+name+"\']");if(sessionSecurityNode!=null)
{this.m_securityServicesByName[name]=new AppService(sessionSecurityNode);return this.m_securityServicesByName[name];}
return null;}
AppConfig.prototype.getSecurityServices=function()
{if(this.m_securityServices==null)
{var sessionSecurityNodes=this.m_servicesNode.selectNodes("./service[@security = 'true']");this.m_securityServices=new Array();for(var i=0;i<sessionSecurityNodes.length;i++)
{this.m_securityServices[this.m_securityServices.length]=new AppService(sessionSecurityNodes[i]);}
this.m_securityServices.sort(AppConfig._sortSecurityServices);}
return this.m_securityServices;}
AppConfig._sortSecurityServices=function(a,b)
{if(a.getOrder()>b.getOrder())
{return 1;}
else if(a.getOrder()==b.getOrder())
{return 0;}
return-1;}
AppConfig.prototype.getServiceForFormMapping=function(formName,mappingName)
{var form=this.getForm(formName);var serviceName=form.getServiceNameForMapping(mappingName);var serviceNode=form.getLocalServiceNode(serviceName);if(null==serviceNode)
{serviceNode=this.m_servicesNode.selectSingleNode("./service[@name = '"+serviceName+"']");}
if(null==serviceNode)
{return null;}
return new AppService(serviceNode);}
AppConfig.prototype.getMenuPanelItems=function(menuPanelXPath)
{var menuPanelItems=null;var menuPanelNode=this.m_menuBarNode.selectSingleNode(menuPanelXPath);if(null!=menuPanelNode)
{var menuPanelNodeChildren=menuPanelNode.childNodes;if(null!=menuPanelNodeChildren)
{var noOfChildren=menuPanelNodeChildren.length;if(noOfChildren>0)
{var menuPanelChildNode=null;var nodeName=null;var menuPanelItem=null;var labelNode=null;var destinationNode=null;menuPanelItems=new Array();for(var i=0;i<noOfChildren;i++)
{menuPanelChildNode=menuPanelNodeChildren[i];if(menuPanelChildNode.nodeType==XML.ELEMENT_NODE)
{menuPanelItem=new MenuPanelItem();nodeName=menuPanelChildNode.nodeName;if(nodeName!=MenuPanelItem.DIVISION)
{var labelNode=menuPanelChildNode.getAttribute('label');if(null==labelNode)
{throw new AppConfigError("No label attribute found for menu panel item #"+i);}
menuPanelItem.m_label=labelNode;if(nodeName==MenuPanelItem.ITEM)
{menuPanelItem.m_type=MenuPanelItem.ITEM;destinationNode=menuPanelChildNode.getAttribute('destination');if(null==destinationNode)
{throw new AppConfigError("No destination attribute found for menu bar node: "+
nodeName+" with label "+
menuPanelItem.m_label);}
menuPanelItem.m_destination=destinationNode;}
else if(nodeName==MenuPanelItem.PANEL)
{menuPanelItem.m_type=MenuPanelItem.PANEL;}
else
{if(this._isFunctionalMenuPanelItem(nodeName))
{menuPanelItem.m_type=MenuPanelItem.FUNCTION;menuPanelItem.m_functionType=nodeName;var classNameNode=null;var functionNameNode=null;var className=null;var functionName=null;classNameNode=menuPanelChildNode.getAttribute('className');if(null!=classNameNode)
{className=classNameNode;if(null==className||className=="")
{throw new AppConfigError("ClassName attribute is incorrectly defined for menu bar node : "+
nodeName+" with label "+
menuPanelItem.m_label);}
menuPanelItem.m_functionClassName=className;}
functionNameNode=menuPanelChildNode.getAttribute('functionName');if(null==functionNameNode)
{if(nodeName!="logout")
{throw new AppConfigError("No functionName attribute found for menu bar node : "+
nodeName+" with label "+
menuPanelItem.m_label);}}
else
{functionName=functionNameNode;if(null==functionName||functionName=="")
{throw new AppConfigError("FunctionName attribute incorrectly defined for menu bar node : "+
nodeName+" with label "+
menuPanelItem.m_label);}
menuPanelItem.m_functionName=functionName;}
menuPanelItem.m_functionParams=this._getMenuPanelItemFunctionParams(menuPanelChildNode,menuPanelItem);}}}
else
{menuPanelItem.m_type=MenuPanelItem.DIVISION;}
menuPanelItems[menuPanelItems.length]=menuPanelItem;}}}}}
return menuPanelItems;}
AppConfig.prototype._isFunctionalMenuPanelItem=function(nodeName)
{var isFunctionalMenuPanelItem=false;var functionalItemTypes=AppConfig.NAVIGATION_MENU_FUNCTIONAL_COMPONENT_TYPES;for(var i=0,l=functionalItemTypes.length;i<l;i++)
{if(nodeName==functionalItemTypes[i])
{isFunctionalMenuPanelItem=true;break;}}
return isFunctionalMenuPanelItem;}
AppConfig.prototype._getMenuPanelItemFunctionParams=function(menuPanelItemNode,menuPanelItem)
{var menuPanelItemFuncParams=null;var paramNodes=menuPanelItemNode.selectNodes('./param');if(paramNodes!=null)
{var paramNodesLength=paramNodes.length;if(paramNodesLength>0)
{menuPanelItemFuncParams=new Array();var paramNode;var nameNode;var positionNode;var positionStr;var positionInt;var typeNode;var type;var valueNode;var value;var menuPanelItemFuncParam;for(var i=0;i<paramNodesLength;i++)
{paramNode=null;nameNode=null;positionNode=null;positionStr=null;positionInt=null;typeNode=null;type=null;valueNode=null;value=null;menuPanelItemFuncParam=null;menuPanelItemFuncParam=new MenuPanelItemFunctionParam();paramNode=paramNodes[i];nameNode=paramNode.getAttribute('name');if(nameNode!=null)
{menuPanelItemFuncParam.m_name=nameNode;}
positionNode=paramNode.getAttribute('position');if(null==positionNode)
{if(paramNodesLength>1)
{throw new AppConfigError("No position attribute found for parameter "+
i+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
else
{menuPanelItemFuncParam.m_position=0;}}
else
{positionStr=positionNode;positionInt=parseInt(positionStr);if(isNaN(positionInt)||positionInt<0)
{throw new AppConfigError("Invalid position attribute defined for parameter "+
i+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
menuPanelItemFuncParam.m_position=positionInt;}
typeNode=paramNode.getAttribute('type');if(null==typeNode)
{menuPanelItemFuncParam.m_type=MenuPanelItemFunctionParam.STRING;}
else
{type=typeNode;if(!MenuPanelItemFunctionParam.isValidType(type))
{throw new AppConfigError("Invalid type attribute defined for parameter "+
i+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
menuPanelItemFuncParam.m_type=type;}
valueNode=paramNode.getAttribute('value');if(null==valueNode)
{throw new AppConfigError("No value attribute found for parameter "+
i+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
value=valueNode;if(value=="")
{throw new AppConfigError("Empty value attribute defined for parameter "+
i+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
menuPanelItemFuncParam.m_value=this._getMenuPanelItemFunctionParamValue(value,menuPanelItemFuncParam.m_type,i,menuPanelItem);menuPanelItemFuncParams[menuPanelItemFuncParams.length]=menuPanelItemFuncParam;}}}
return menuPanelItemFuncParams;}
AppConfig.prototype._getMenuPanelItemFunctionParamValue=function(xmlValue,type,paramPosition,menuPanelItem)
{var returnValue=null;switch(type)
{case MenuPanelItemFunctionParam.BOOLEAN:{var lowerCaseXmlValue=xmlValue.toLowerCase();if(lowerCaseXmlValue=="true")
{returnValue=true;}
else if(lowerCaseXmlValue=="false")
{returnValue=false;}
else
{throw new AppConfigError("Invalid value for boolean attribute defined for parameter "+
paramPosition+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
break;}
case MenuPanelItemFunctionParam.INT:{returnValue=parseInt(xmlValue);if(isNaN(returnValue))
{throw new AppConfigError("Invalid value for integer attribute defined for parameter "+
paramPosition+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
break;}
case MenuPanelItemFunctionParam.FLOAT:{returnValue=parseFloat(xmlValue);if(isNaN(returnValue))
{throw new AppConfigError("Invalid value for attribute of type float defined for parameter "+
paramPosition+" for menu bar node : "+
menuPanelItem.m_functionType+" with label "+
menuPanelItem.m_label);}
break;}
default:{returnValue=xmlValue;break;}}
return returnValue;}
AppConfig.prototype.getProjectName=function()
{if(null==this.m_projectName)
{this.m_projectName="";if(null!=this.m_projectNode)
{var projectName=this.m_projectNode.getAttribute('name');if(null!=projectName)
{this.m_projectName=projectName;}}}
return this.m_projectName;}
AppConfig.prototype.getDialogStyle=function()
{if(null==this.m_dialogStyle)
{this.m_dialogStyle=AppConfig.FRAMEWORK_DIALOG_STYLE;if(null!=this.m_projectNode)
{var dialogStyle=this.m_projectNode.getAttribute('dialog-style');if(null!=dialogStyle)
{dialogStyle=dialogStyle.toLowerCase();if(dialogStyle!=AppConfig.FRAMEWORK_DIALOG_STYLE&&dialogStyle!=AppConfig.BROWSER_DIALOG_STYLE)
{if(AppController.m_logger.isWarn())AppController.m_logger.warn("<project dialog-style/> attribute '"+dialogStyle+"' is not a valid dialog style, using default");}
else
{this.m_dialogStyle=dialogStyle;}}}}
return this.m_dialogStyle;}
AppConfig.prototype.getValidateWhitespaceOnlyEntryActive=function()
{if(null==this.m_validateWhitespaceOnlyEntryActive)
{this.m_validateWhitespaceOnlyEntryActive=true;if(null!=this.m_projectNode)
{var validateWhitespaceOnlyEntryActive=this.m_projectNode.getAttribute('validateWhitespaceOnlyEntryActive');if(null!=validateWhitespaceOnlyEntryActive)
{validateWhitespaceOnlyEntryActive=validateWhitespaceOnlyEntryActive.toLowerCase();if(validateWhitespaceOnlyEntryActive=="false")
{this.m_validateWhitespaceOnlyEntryActive=false;}}}}
return this.m_validateWhitespaceOnlyEntryActive;}
AppConfig.prototype.getExceptionHandlers=function()
{if(null==this.m_exceptionHandlers)
{var exceptionObj=new Object();var exceptionHandlers=new Array();exceptionObj.useDefault=true;exceptionObj.message="Not logged in";exceptionHandlers["InvalidUserSession"]=exceptionObj;exceptionObj=null;exceptionObj=new Object();exceptionObj.useDefault=false;exceptionObj.message=null;exceptionHandlers["Authorization"]=exceptionObj;exceptionObj=null;var exceptionsNode=this.m_configDocNode.selectSingleNode('./exception-handlers');if(null!=exceptionsNode)
{var exceptionsNodeChildren=exceptionsNode.childNodes;for(var i=exceptionsNodeChildren.length-1;i>=0;i--)
{var exceptionNode=exceptionsNodeChildren[i];var nodeName=exceptionNode.nodeName;if(nodeName!="InvalidUserSession"&&nodeName!="Authorization")
{if(AppController.m_logger.isWarn())AppController.m_logger.warn("Framework does not provide a default handler for '"+nodeName+"' exception");}
else
{exceptionObj=new Object();exceptionObj.useDefault=true;exceptionObj.message=null;var useDefault=exceptionNode.getAttribute('use-default');if(useDefault!=null)
{useDefault=useDefault.toLowerCase();if(useDefault!="yes"&&useDefault!="no")
{if(AppController.m_logger.isWarn())AppController.m_logger.warn("<"+nodeName+" use-default/> attribute '"+useDefault+"' is not a valid value, using default");useDefault="yes";}
exceptionObj.useDefault=(useDefault=="yes")?true:false;if(useDefault=="yes")
{var messageNode=exceptionNode.getAttribute('message');if(messageNode!=null)
{exceptionObj.message=messageNode;}}}
exceptionHandlers[exceptionNode.nodeName]=exceptionObj;exceptionObj=null;}}}
this.m_exceptionHandlers=exceptionHandlers;}
return this.m_exceptionHandlers;}
AppConfig.prototype.getSpellCheckCourtXPath=function()
{return this.m_courtXPath;}
AppConfig.prototype.getSpellCheckDictionaryLabel=function()
{return this.m_dictionaryLabel;}
AppConfig.prototype.getSpellCheckURL=function()
{return this.m_spellCheckURL;}
AppConfig.prototype.getSpellCheckPopup=function()
{return this.m_spellCheckPopup;}
AppConfig.prototype.getHttpConnectionErrorRetryLimit=function()
{var retryLimit=null;if(null!=this.m_httpConnectionErrorRetryResponseNode)
{var retryLimitNode=this.m_httpConnectionErrorRetryResponseNode.selectSingleNode('./retryLimit');if(null!=retryLimitNode)
{var retryLimitStr=XML.getNodeTextContent(retryLimitNode);if(null!=retryLimitStr&&retryLimitStr!="")
{retryLimit=parseInt(retryLimitStr);if(isNaN(retryLimit)||retryLimit<0)
{throw new AppConfigError("Http connection error retry limit is not a valid number : "+retryLimit);}}}}
return retryLimit;}
AppConfig.prototype.getHttpConnectionErrorRetryResponses=function()
{var errorRetryResponses=null;if(null!=this.m_httpConnectionErrorRetryResponseNode)
{var errorRetryResponsesNode=this.m_httpConnectionErrorRetryResponseNode.selectSingleNode('./errorRetryResponses');if(null!=errorRetryResponsesNode)
{var errorRetryResponsesNodeChildren=errorRetryResponsesNode.childNodes;if(null!=errorRetryResponsesNodeChildren)
{var noOfChildren=errorRetryResponsesNodeChildren.length;if(noOfChildren>0)
{var errorRetryResponseNode;var responseStatusNode;var responseStatus;var retryNode;var retryStr;var retry;for(var i=0;i<noOfChildren;i++)
{errorRetryResponseNode=null;responseStatusNode=null;responseStatus=null;retryNode=null;retryStr=null;retry=null;errorRetryResponseNode=errorRetryResponsesNodeChildren[i];if(errorRetryResponseNode.nodeType==XML.ELEMENT_NODE)
{responseStatusNode=errorRetryResponseNode.getAttribute('responseStatus');if(null==responseStatusNode)
{throw new AppConfigError("No response status attribute defined for HTTP connection error retry response node #"+i);}
responseStatus=responseStatusNode;if(null==responseStatus||responseStatus=="")
{throw new AppConfigError("Invalid value defined for HTTP connection error retry attribute response status in node #"+i);}
retryNode=errorRetryResponseNode.getAttribute('retry');if(null==retryNode)
{throw new AppConfigError("No retry attribute defined for HTTP connection error retry response node #"+i);}
retryStr=retryNode;if(null==retryStr||retryStr=="")
{throw new AppConfigError("Invalid value defined for HTTP connection error retry attribute retry in node #"+i);}
retryStr=retryStr.toLowerCase();if(retryStr=="true")
{retry=true;}
else if(retryStr=="false")
{retry=false;}
else
{throw new AppConfigError("Invalid value defined for HTTP connection error retry attribute retry in node #"+i);}
if(null==errorRetryResponses)
{errorRetryResponses=new Object();}
errorRetryResponses[responseStatus]=retry;}}}}}}
return errorRetryResponses;}
AppConfig.getParametersFromNode=function(node)
{var paramNodes=node.selectNodes('./param');var parameters=new Array();for(var i=0;i<paramNodes.length;i++)
{var paramNameNode=paramNodes[i].getAttribute('name');if(null==paramNameNode)
{throw new AppConfigError("No name attribute found for parameter "+(i+1));}
var paramValueNode=paramNodes[i].getAttribute('value');if(null==paramValueNode)
{throw new AppConfigError("No value attribute found for parameter "+(i+1));}
var nameAtt=paramNameNode;var valueAtt=paramValueNode;parameters[parameters.length]={name:nameAtt,value:valueAtt}}
return parameters;}
AppConfig.prototype.getFormsNode=function()
{return this.m_formsNode;}
function AppConfigError(message)
{this.message=message;}
AppConfigError.prototype=new Error();AppConfigError.prototype.constructor=AppConfigError;function AppStyleSheet(node)
{var nameNode=node.getAttribute('name');if(null==nameNode)
{throw new AppConfigError("No name attribute found for stylesheet node: "+node.xml);}
var titleNode=node.getAttribute('title');if(null==titleNode)
{throw new AppConfigError("No title attribute found for stylesheet node: "+node.xml);}
this.m_name=nameNode;if(null==this.m_name)
{throw new AppConfigError("Empty name attribute found for stylesheet node: "+node.xml);}
this.m_title=titleNode;if(null==this.m_title)
{throw new AppConfigError("Empty title attribute found for stylesheet node: "+node.xml);}}
AppStyleSheet.prototype.getName=function()
{return this.m_name;}
AppStyleSheet.prototype.getTitle=function()
{return this.m_title;}
function AppCSS(node)
{}
AppCSS.createFromChildren=function(parentNode,parentURL)
{var cssNodes=parentNode.selectNodes('css');var appCSSs=[];for(var i=0,l=cssNodes.length;i<l;i++)
{appCSSs.push(AppCSS.createFromNode(cssNodes[i],parentURL));}
return appCSSs;}
AppCSS.createFromNode=function(node,parentURL)
{var n=node.getAttribute('baseURL');if(null==n)
{throw new AppConfigError("No baseURL attribute found for css node");}
var baseURL=parentURL+"/"+n;n=node.getAttribute('browserDependant');var browserDependant=((null!=n)&&(n=="true"));n=node.getAttribute('colourSchemeDependant');var colourSchemeDependant=((null!=n)&&(n=="true"));return AppCSS.create(baseURL,browserDependant,colourSchemeDependant);}
AppCSS.create=function(baseURL,browserDependant,colourSchemeDependant)
{var css=new AppCSS();css.m_baseURL=baseURL;css.m_browserDependant=browserDependant;css.m_colourSchemeDependant=colourSchemeDependant;return css;}
AppCSS.prototype.getBaseURL=function()
{return this.m_baseURL;}
AppCSS.prototype.getColourSchemeDependant=function()
{return this.m_colourSchemeDependant;}
AppCSS.prototype.getBrowserDependant=function()
{return this.m_browserDependant;}
function AppForm(node,appConfig)
{this.m_node=node;var nameNode=node.getAttribute('name');if(null==nameNode)
{throw new AppConfigError("No name attribute found for form node");}
this.m_name=nameNode;var urlNode=node.getAttribute('pageURL');if(null==urlNode)
{throw new AppConfigError("No pageURL attribute found for form with name: "+this.m_name);}
this.m_pageURL=urlNode;var titleNode=node.getAttribute('title');if(null==titleNode)
{throw new AppConfigError("No title attribute found for form with name: "+this.m_name);}
this.m_title=titleNode;var precompileNode=node.getAttribute('precompile');if(null!=precompileNode)
{this.m_precompile=precompileNode;}
else{this.m_precompile="yes";}
var funitNode=node.getAttribute('funit');this.m_isFUnit=(null!=funitNode&&funitNode=="true");this.m_mappings=new Array();this.m_services=new Array();this.m_roles=new Array();var accessNode=node.selectSingleNode('./access');if(accessNode!=null)
{var roleNodes=accessNode.selectNodes('./role');for(var i=0;i<roleNodes.length;i++)
{var idNode=roleNodes[i].getAttribute('name');var role=idNode;this.m_roles[this.m_roles.length]=role;}}
var ac=Services.getAppController();var baseStyleSheetURL=appConfig.m_appBaseURL+appConfig.m_formsBaseURL;this.m_formCSS=AppCSS.createFromChildren(node,baseStyleSheetURL);}
AppForm.prototype.getFormCSS=function()
{return this.m_formCSS;}
AppForm.prototype.getPrecompile=function()
{return this.m_precompile;}
AppForm.prototype.getName=function()
{return this.m_name;}
AppForm.prototype.getTitle=function()
{return this.m_title;}
AppForm.prototype.isFUnit=function()
{return this.m_isFUnit;}
AppForm.prototype.getPageURL=function()
{return this.m_pageURL;}
AppForm.prototype.getRoles=function()
{return this.m_roles;}
AppForm.prototype.getServiceNameForMapping=function(mappingName)
{var serviceNameNode=this.m_node.selectSingleNode("./mapping[@name = '"+mappingName+"']/@serviceName");return(null==serviceNameNode)?mappingName:XML.getNodeTextContent(serviceNameNode);}
AppForm.prototype.getLocalServiceNode=function(serviceName)
{var serviceNode=this.m_node.selectSingleNode("./service[@name = '"+serviceName+"']");return serviceNode;}
function AppService(node)
{var nameNode=node.getAttribute('name');if(null==nameNode)
{throw new AppConfigError("No name attribute found for service node");}
this.m_name=nameNode;var orderNode=node.getAttribute('order');if(null!=orderNode)
{this.m_order=orderNode;}
this.m_cacheStrategy=null;var cacheNode=node.getAttribute('cache');if(null!=cacheNode)
{this.m_cacheStrategy=cacheNode;}
var urlNode=node.getAttribute('url');if(null==urlNode)
{throw new AppConfigError("No url attribute found for service with name: "+this.m_name);}
this.m_url=urlNode;var componentNode=node.getAttribute('component');this.m_componentName=(null==componentNode)?this.m_url:componentNode;var methodNode=node.getAttribute('method');if(null==methodNode)
{throw new AppConfigError("No method attribute found for service with name: "+this.m_name);}
this.m_method=methodNode;var dataBindingNode=node.getAttribute('dataBinding');if(null!=dataBindingNode)
{this.m_dataBinding=dataBindingNode;}
var paramNodes=node.selectNodes('./param');this.m_parameters=new Array(paramNodes.length);for(var i=0;i<paramNodes.length;i++)
{var paramNameNode=paramNodes[i].getAttribute('name');if(null==paramNameNode)
{throw new AppConfigError("No name attribute found for parameter "+(i+1)+" for service: "+this.m_name);}
this.m_parameters[i]=paramNameNode;}}
AppService.prototype.getName=function()
{return this.m_name;}
AppService.prototype.getOrder=function()
{return this.m_order;}
AppService.prototype.getParameters=function()
{return this.m_parameters;}
AppService.prototype.getDataBinding=function()
{return this.m_dataBinding;}
AppService.prototype.getURL=function()
{return this.m_url;}
AppService.prototype.getComponentName=function()
{return this.m_componentName;}
AppService.prototype.getMethod=function()
{return this.m_method;}
function TabbingEvent(type,detail)
{this.m_type=type;this.m_detail=detail;this.m_acceptFocusOnClick=null;}
TabbingEvent.EVENTS={TAB_FORWARD:{priority:1},TAB_BACKWARD:{priority:1},VALIDATION_FAILURE:{priority:2},CLICK_FOCUS:{priority:3},PROGRAMMATIC_FOCUS:{priority:4},INITIAL_FOCUS:{priority:5}}
TabbingEvent.prototype.setAcceptFocusOnClick=function(acceptFocusOnClick)
{this.m_acceptFocusOnClick=acceptFocusOnClick;}
TabbingEvent.prototype.getType=function()
{return this.m_type;}
TabbingEvent.prototype.getDetail=function()
{return this.m_detail;}
TabbingEvent.prototype.getPriority=function()
{return this.m_type.priority;}
TabbingEvent.prototype.getAcceptFocusOnClick=function()
{return this.m_acceptFocusOnClick;}
function TabbingManager()
{}
TabbingManager.m_logger=new Category("TabbingManager");TabbingManager.prototype.m_keyDownHandler=null;TabbingManager.prototype.m_formElementGUIAdaptor=null;TabbingManager.NON_NATIVE_FOCUS_ID="_fwNonNativeFocusID";TabbingManager.m_timeout=null;TabbingManager.prototype.initialise=function()
{this.m_clickEventHandlers=new Array();this.m_tabOrder=[];this.m_captureSet=false;var tm=this;this.m_clickHandler=SUPSEvent.addEventHandler(document,"mousedown",function(evt){tm._documentClickEventHandler(evt);},false);this.m_mouseWheelEventHandler=SUPSEvent.addEventHandler(document,"mousewheel",function(evt){tm.handleScrollMouse(evt);},null);if(window.addEventListener)
{var tm=this;this.m_keyDownHandler=SUPSEvent.addEventHandler(window,"keydown",function(evt){tm._tabKeyEventHandler(evt);},true);this.m_hiddenField=document.createElement("input");this.m_hiddenField.setAttribute("type","hidden");document.body.appendChild(this.m_hiddenField);}
else
{this.m_keyDownHandler=SUPSEvent.addEventHandler(window.document,"keydown",function(evt){tm._tabKeyEventHandler(evt);},false);}
this.m_currentFocussedAdaptor=null;}
TabbingManager.prototype._produceTabbingOrder=function(adaptors)
{var ordered=new Array();var unordered=new Array();for(var i=0,l=adaptors.length;i<l;i++)
{var a=adaptors[i];if(null!=a.configFocusProtocol)
{var index=a.getTabIndex();if(0==index)
{unordered.push(a);}
else
{if(index>0)
{ordered.push(a);}
else
{this._bindEventHandlers(a);}
var focusElement=a.getFocusElement();focusElement.setAttribute("tabIndex",index.toString());}}}
ordered.sort(TabbingManager._comparableTabs);var lastAdaptor=ordered[ordered.length-1];var index=(null==lastAdaptor)?"1":String(lastAdaptor.getTabIndex()+1);for(i=unordered.length-1;i>=0;i--)
{var focusElement=unordered[i].getFocusElement();focusElement.setAttribute("tabIndex",index);}
ordered=ordered.concat(unordered);return ordered;}
TabbingManager._comparableTabs=function(a,b)
{return a.getTabIndex()-b.getTabIndex();}
TabbingManager.prototype.addAdaptors=function(as)
{var adaptors=this.m_tabOrder.concat(as);this.m_tabOrder=this._produceTabbingOrder(adaptors);this._bindEventHandlersToAdaptors(this.m_tabOrder);}
TabbingManager.prototype._bindEventHandlersToAdaptors=function(adaptors)
{for(var i=0,l=adaptors.length;i<l;i++)
{this._bindEventHandlers(adaptors[i]);}}
TabbingManager.prototype._bindEventHandlers=function(a)
{var id=a.getId();if(null==this.m_clickEventHandlers[id])
{var tm=this;this.m_clickEventHandlers[id]=SUPSEvent.addEventHandler(a.getElement(),"mousedown",function(evt){tm._handleComponentClick(a,evt);},false);}}
TabbingManager.prototype._unbindEventHandlers=function(adaptors)
{for(var i=0,l=adaptors.length;i<l;i++)
{var a=adaptors[i];var id=a.getId();var clickEventKey=this.m_clickEventHandlers[id];if(null!=clickEventKey)
{SUPSEvent.removeEventHandlerKey(clickEventKey);delete this.m_clickEventHandlers[id];}}}
TabbingManager.prototype.removeAdaptors=function(as)
{var newTabOrder=new Array();var currentTabOrder=this.m_tabOrder;var currentFocussedAdaptorRemoved=false
var currentFocussedAdaptor=this.m_currentFocussedAdaptor;var currentFocussedAdaptorTabPosition=null;var removedAdaptors=new Array();for(var j=0,m=as.length;j<m;j++)
{var a=as[j];for(var i=0,l=currentTabOrder.length;i<l;i++)
{if(currentTabOrder[i]==a)
{if(a==currentFocussedAdaptor)
{currentFocussedAdaptorRemoved=true;currentFocussedAdaptorTabPosition=i;}
currentTabOrder[i]=null;removedAdaptors.push(a);break;}}}
this._unbindEventHandlers(removedAdaptors);if(currentFocussedAdaptorRemoved)
{var moveFocusAdaptor=null;for(var i=currentFocussedAdaptorTabPosition;i>=0;i--)
{if(currentTabOrder[i]!=null)
{moveFocusAdaptor=currentTabOrder[i];break;}}
if(null==moveFocusAdaptor)
{for(var i=currentFocussedAdaptorTabPosition,l=currentTabOrder.length;i<l;i++)
{if(currentTabOrder[i]!=null)
{moveFocusAdaptor=currentTabOrder[i];break;}}}
this.setFocusOnAdaptor(moveFocusAdaptor);}
for(var i=0,l=currentTabOrder.length;i<l;i++)
{var a=currentTabOrder[i];if(a!=null)
{newTabOrder.push(a);}}
this.m_tabOrder=newTabOrder;}
TabbingManager.prototype.dispose=function()
{if(this.m_timeout!=null)
{window.clearTimeout(this.m_timeout);this.m_timeout=null;}
SUPSEvent.removeEventHandlerKey(this.m_keyDownHandler);this.m_keyDownHandler=null;if(null!=this.m_clickEventHandlers)
{var clickEventHandlerKeys=this.m_clickEventHandlers;for(var adaptorId in clickEventHandlerKeys)
{var clickEventHandlerKey=clickEventHandlerKeys[adaptorId];SUPSEvent.removeEventHandlerKey(clickEventHandlerKey);delete clickEventHandlerKeys[adaptorId];}
var clickEventHandlerKeys=this.m_clickEventHandlers;for(var i=0,l=clickEventHandlerKeys.length;i<l;i++)
{SUPSEvent.removeEventHandlerKey(clickEventHandlerKeys[i])
this.m_clickEventHandlers[i]=null;}}
if(null!=this.m_clickHandler)
{SUPSEvent.removeEventHandlerKey(this.m_clickHandler);this.m_clickHandler=null;}
if(null!=this.m_mouseWheelEventHandler)
{SUPSEvent.removeEventHandlerKey(this.m_mouseWheelEventHandler);this.m_mouseWheelEventHandler=null;}}
TabbingManager.prototype.setFormElementGUIAdaptor=function(formElementGUIAdaptor)
{this.m_formElementGUIAdaptor=formElementGUIAdaptor;}
TabbingManager.prototype.focusFirstAvailableField=function()
{this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.INITIAL_FOCUS));}
TabbingManager.prototype.setValidationFailedAdaptor=function(a)
{this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.VALIDATION_FAILURE,a));}
TabbingManager.prototype.setFocusOnAdaptor=function(a)
{this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS,a));}
TabbingManager.prototype._tabKeyEventHandler=function(e)
{if(null==e)e=window.event;if(e.keyCode==Key.Tab.m_keyCode)
{this.queueTabbingEvent(new TabbingEvent(e.shiftKey?TabbingEvent.EVENTS.TAB_BACKWARD:TabbingEvent.EVENTS.TAB_FORWARD));SUPSEvent.stopPropagation(e);}}
TabbingManager.prototype._handleComponentClick=function(a,evt)
{if(TabbingManager.m_logger.isDebug())
{if(null==evt)evt=window.event;if(null!=evt)
{var targetElement=SUPSEvent.getTargetElement(evt);TabbingManager.m_logger.debug("TabbingManager._handleComponentClick() adaptor = "+((a==null)?a:a.getId())
+" target element was of type: "+targetElement.nodeName+" and has id: "+targetElement.id);}}
var tabbingEvent=new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS,a);tabbingEvent.setAcceptFocusOnClick(this._canAdaptorAcceptFocus(a));this.queueTabbingEvent(tabbingEvent);}
TabbingManager.prototype._documentClickEventHandler=function(evt)
{var focussedOnAdaptor=false;var clickedComponent=null;if(this.m_tabbingEvent!=null&&this.m_tabbingEvent.getType()==TabbingEvent.EVENTS.CLICK_FOCUS)
{clickedComponent=this.m_tabbingEvent.getDetail();focussedOnAdaptor=true;}
if(null==clickedComponent)
{if(null==evt)evt=window.event;var targetElement=SUPSEvent.getTargetElement(evt);var targetForId=targetElement.htmlFor;if(targetElement.nodeName=="LABEL"&&targetForId!=null&&targetForId!="")
{var adaptorId=targetForId;if(targetElement.fwNonNativeFocus)
{var index=targetForId.indexOf(TabbingManager.NON_NATIVE_FOCUS_ID);adaptorId=targetForId.substr(0,index);}
var targetAdaptor=FormController.getInstance().getAdaptorById(adaptorId);if(null!=targetAdaptor)
{if(this._canAdaptorAcceptFocus(targetAdaptor))
{var adaptorElement=targetAdaptor.getElement();if(!targetElement.fwNonNativeFocus&&!this._isHTMLNativeControl(adaptorElement)&&this._redirectClickOnLabel(targetAdaptor))
{var focusElement=targetAdaptor.getFocusElement();if(adaptorElement!=focusElement)
{focusElement.id=targetAdaptor.getId()+TabbingManager.NON_NATIVE_FOCUS_ID;targetElement.htmlFor=focusElement.id;targetElement.fwNonNativeFocus=true;}}
var tabbingEvent=new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS,targetAdaptor);tabbingEvent.setAcceptFocusOnClick(true);this.queueTabbingEvent(tabbingEvent);focussedOnAdaptor=true;}}
else
{if(TabbingManager.m_logger.isError())TabbingManager.m_logger.error("TabbingManager._documentClickEventHandler(): NO Adaptor found for label for html id: "+adaptorId);}}
else if(this._isHTMLNativeControl(targetElement))
{if(targetElement.type!="checkbox")
{if(targetElement.id&&targetElement.id!="")
{var targetAdaptor=FormController.getInstance().getAdaptorById(targetElement.id);if(null!=targetAdaptor)
{var tabbingEvent=new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS,targetAdaptor);tabbingEvent.setAcceptFocusOnClick(false);this.queueTabbingEvent(tabbingEvent);focussedOnAdaptor=true;}}}}
else
{}
if(!focussedOnAdaptor&&null!=this.m_currentFocussedAdaptor)
{this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS,null));}}}
TabbingManager.prototype._redirectClickOnLabel=function(a)
{var redirectClick=true;if(a instanceof FwSelectElementGUIAdaptor)
{redirectClick=false;}
return redirectClick;}
TabbingManager.prototype._canAcceptFocusNatively=function(a)
{if(window.addEventListener)
{var e=a.getFocusElement();var isNativeControl=this._isHTMLNativeControl(e);return isNativeControl;}
else if(window.attachEvent)
{return true;}
else
{fc_assertAlways("TabbingManager._canAcceptFocusNatively: cannot determine browser type");}}
TabbingManager.prototype._isHTMLNativeControl=function(e)
{return("INPUT"==e.nodeName||"SELECT"==e.nodeName||"TEXTAREA"==e.nodeName);}
TabbingManager.prototype._unfocusCurrentFocussedAdaptor=function(moveToAdaptor,forceFocus,acceptFocusOnClick)
{if(null!=this.m_currentFocussedAdaptor)
{if(this.m_captureSet)
{window.onkeydown=null;window.releaseEvents(Event.KEYDOWN);this.m_captureSet=false;}
if(this.m_currentFocussedAdaptor.setFocus(false))
{this.m_currentFocussedAdaptor.renderState();}
if(null!=this.m_currentFocussedAdaptor.onBlur)this.m_currentFocussedAdaptor.onBlur();if(forceFocus)
{if(null==moveToAdaptor)
{this._determineBackgroundFocus();}}
else
{if(null!=moveToAdaptor)
{if(!this._canAdaptorAcceptFocus(moveToAdaptor)&&acceptFocusOnClick!=true)
{this._determineBackgroundFocus();}}
else
{this._determineBackgroundFocus();}}
this.m_currentFocussedAdaptor=null;}}
TabbingManager.handleNonNativeComponentKeyEvents=function(evt)
{var tm=FormController.getInstance().getTabbingManager();var adaptor=tm.m_currentFocussedAdaptor;if(adaptor.configKeybindingProtocol&&adaptor.m_keys)
{adaptor.m_keys.handleKeyEvent(evt);}}
TabbingManager.prototype.handleScrollMouse=function(evt)
{var propagateEvent=true;var adaptor=this.m_currentFocussedAdaptor;if(adaptor&&adaptor.configMouseWheelBindingProtocol)
{if(null==evt){evt=window.event;}
propagateEvent=adaptor.handleScrollMouse(evt);if(propagateEvent!=true)
{SUPSEvent.preventDefault(evt);}}
return propagateEvent;}
TabbingManager.prototype.updateFocus=function()
{if((null==this.m_tabbingEvent)&&(null!=this.m_currentFocussedAdaptor)&&!this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
{if(!(this.m_currentFocussedAdaptor instanceof ButtonInputElementGUIAdaptor&&this.m_currentFocussedAdaptor.m_inactiveWhilstHandlingEvent))
{this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.TAB_FORWARD));}}}
TabbingManager._getAdaptorDisplayName=function(adaptor)
{return(null==adaptor?"null":adaptor.getDisplayName());}
TabbingManager.prototype.queueTabbingEvent=function(evt)
{if(null==this.m_tabbingEvent)
{this.m_tabbingEvent=evt;}
else
{if(this.m_tabbingEvent.getPriority()<evt.getPriority())
{this.m_tabbingEvent=evt;}}
if(null==this.m_timeout)
{this.m_timeout=setTimeout("TabbingManager._processTabbingEvents()",0);}}
TabbingManager.prototype._getEventType=function(evt)
{for(i in TabbingEvent.EVENTS)
{if(evt==TabbingEvent.EVENTS[i])
{return i;}}
return null;}
TabbingManager._processTabbingEvents=function()
{var fc=FormController.getInstance();if(null!=fc)
{var tm=fc.getTabbingManager();tm.m_timeout=null;tm.processTabbingEvents();}}
TabbingManager.prototype._tabFromAdaptor=function(adaptor,forward)
{var startAdaptor=adaptor;var moveToAdaptor=null;if(null!=adaptor)
{moveToAdaptor=this._checkForProgrammaticMove(adaptor,forward);}
if(null!=moveToAdaptor&&!this._canAdaptorAcceptFocus(moveToAdaptor))
{startAdaptor=moveToAdaptor;moveToAdaptor=null;}
if(null==moveToAdaptor)
{moveToAdaptor=forward?this._searchTabbingOrderForward(startAdaptor):this._searchTabbingOrderBackward(startAdaptor);}
if(null==moveToAdaptor)
{if(TabbingManager.m_logger.isError())TabbingManager.m_logger.error("TabbingManager._tabFromAdaptor(): No adaptor available which can accept the focus");}
return moveToAdaptor;}
TabbingManager.prototype._checkForProgrammaticMove=function(adaptor,forward)
{var moveToAdaptor=null;moveToAdaptorId=adaptor.invokeMoveFocus(forward);for(var i=0,l=this.m_tabOrder.length;i<l;i++)
{if(this.m_tabOrder[i].getId()==moveToAdaptorId)
{moveToAdaptor=this.m_tabOrder[i];break;}}
return moveToAdaptor;}
TabbingManager.prototype._searchTabbingOrderForward=function(startAdaptor)
{var moveToAdaptor=null;var startPosition=this.m_tabOrder.length-1;if(null!=startAdaptor)
{var currentPosition=this._getTabPositionOfAdaptor(startAdaptor);if(currentPosition!=null)
{startPosition=currentPosition;}}
var position=startPosition;var found=false;if(this.m_tabOrder.length>0)
{do
{position++;if(position>this.m_tabOrder.length-1)
{position=0;}
found=this._canAdaptorAcceptFocus(this.m_tabOrder[position]);}
while(position!=startPosition&&!found)}
if(found)
{moveToAdaptor=this.m_tabOrder[position];}
return moveToAdaptor;}
TabbingManager.prototype._searchTabbingOrderBackward=function(startAdaptor)
{var moveToAdaptor=null;var startPosition=0;if(null!=startAdaptor)
{var currentPosition=this._getTabPositionOfAdaptor(startAdaptor);if(currentPosition!=null)
{startPosition=currentPosition;}}
var position=startPosition;var found=false;if(this.m_tabOrder.length>0)
{do
{position--;if(position<0)
{position=this.m_tabOrder.length-1;}
found=this._canAdaptorAcceptFocus(this.m_tabOrder[position]);}
while(position!=startPosition&&!found)}
if(found)
{moveToAdaptor=this.m_tabOrder[position];}
return moveToAdaptor;}
TabbingManager.prototype._getTabPositionOfAdaptor=function(a)
{var id=a.getId();for(var i=0,l=this.m_tabOrder.length;i<l;i++)
{if(this.m_tabOrder[i].getId()==id)
{return i;}}
return null;}
TabbingManager.prototype._handleProgrammaticEvent=function(a)
{if(a!=null&&this._canAdaptorAcceptFocus(a))
{return a;}
else
{return this._tabFromAdaptor(a,true);}}
TabbingManager.prototype._canAdaptorAcceptFocus=function(a)
{var accept=a.acceptFocus();var enabled=false;var active=false;var readonly=false;if(false==a.supportsProtocol("EnablementProtocol"))
{enabled=true;}
else
{enabled=a.getEnabled();}
if(false==a.supportsProtocol("ActiveProtocol"))
{active=true;}
else
{active=a.isActive();}
if(false==a.supportsProtocol("ReadOnlyProtocol"))
{readonly=false;}
else
{readonly=a.getReadOnly();}
var result=accept&&enabled&&active&&!readonly&&isElementVisible(a.getElement());return result;}
TabbingManager.prototype.resetBrowserFocusOnCurrentFocussedAdaptor=function()
{if(null!=this.m_currentFocussedAdaptor)
{if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
{this.m_currentFocussedAdaptor.getFocusElement().focus();}}}
TabbingManager.prototype.processTabbingEvents=function()
{if(null!=this.m_tabbingEvent)
{var tabForward=null;var moveToAdaptor=null;var forceFocus=true;var clearTabEvent=true;var tabbingEvent=this.m_tabbingEvent;switch(this.m_tabbingEvent.getType())
{case TabbingEvent.EVENTS.TAB_FORWARD:{moveToAdaptor=this._tabFromAdaptor(this.m_currentFocussedAdaptor,true);tabForward=true;break;}
case TabbingEvent.EVENTS.TAB_BACKWARD:{moveToAdaptor=this._tabFromAdaptor(this.m_currentFocussedAdaptor,false);tabForward=false;break;}
case TabbingEvent.EVENTS.VALIDATION_FAILURE:{moveToAdaptor=this.m_tabbingEvent.getDetail();break;}
case TabbingEvent.EVENTS.CLICK_FOCUS:{moveToAdaptor=this.m_tabbingEvent.getDetail()
forceFocus=false;break;}
case TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS:{moveToAdaptor=this._handleProgrammaticEvent(this.m_tabbingEvent.getDetail());break;}
case TabbingEvent.EVENTS.INITIAL_FOCUS:{moveToAdaptor=this._tabFromAdaptor(null,true);break;}}
var previousFocussedAdaptor=null;if(null!=tabForward)
{previousFocussedAdaptor=this.m_currentFocussedAdaptor;}
if(moveToAdaptor!=this.m_currentFocussedAdaptor)
{this._unfocusCurrentFocussedAdaptor(moveToAdaptor,forceFocus,tabbingEvent.getAcceptFocusOnClick());}
if(this.m_tabbingEvent!=tabbingEvent)
{this.processTabbingEvents();}
else
{if(!forceFocus&&(null!=moveToAdaptor)&&(tabbingEvent.getAcceptFocusOnClick()!=true))
{if(!this._canAdaptorAcceptFocus(moveToAdaptor))
{moveToAdaptor=null;}}
if(null!=moveToAdaptor)
{if(null!=tabForward)
{if(null==this.m_currentFocussedAdaptor)
{var newMoveToAdaptor=this._tabFromAdaptor(previousFocussedAdaptor,tabForward);if(newMoveToAdaptor&&newMoveToAdaptor!=moveToAdaptor)
{moveToAdaptor=newMoveToAdaptor;newMoveToAdaptor=null;}}
previousFocussedAdaptor=null;}
var focusDetails=this._focusAdaptor(moveToAdaptor,!forceFocus,tabbingEvent.getAcceptFocusOnClick());if(!focusDetails["focusSetOnAdaptor"])
{var focusAdaptor=focusDetails["focusAdaptor"];var newFocusAdaptor=this._tabFromAdaptor(focusAdaptor,true);if(null!=newFocusAdaptor)
{clearTabEvent=false;if((!forceFocus)&&(focusAdaptor instanceof SelectElementGUIAdaptor))
{window.focus();}
this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS,newFocusAdaptor));}
else
{window.focus();}}}}
if(clearTabEvent)
{this.m_tabbingEvent=null;}}}
TabbingManager.prototype._focusAdaptor=function(a,wasClick,acceptFocusOnClick)
{var focusSetOnAdaptor=true;if(this.m_currentFocussedAdaptor!=a)
{if(window.attachEvent&&a!=null&&wasClick!=true)
{var range=document.body.createTextRange();range.moveToElementText(a.m_element);range.moveStart("textedit",1);}
if(null!=this.m_servicesSetFocusAdaptor)
{a=this.m_servicesSetFocusAdaptor;this.m_servicesSetFocusAdaptor=null;}
if(null!=a)
{focusSetOnAdaptor=this._moveFocusToAdaptor(a,wasClick,acceptFocusOnClick);}
else
{}}
else
{if(this._canAcceptFocusNatively(this.m_currentFocussedAdaptor))
{if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
{if(!wasClick)
{this.m_currentFocussedAdaptor.getFocusElement().focus();}}}
else
{this.m_hiddenField.focus();this.m_captureSet=true;}
if(!wasClick)
{if(null!=this.m_currentFocussedAdaptor.onBlur)this.m_currentFocussedAdaptor.onBlur();if(null!=this.m_currentFocussedAdaptor.onFocus)this.m_currentFocussedAdaptor.onFocus();}}
this.m_formElementGUIAdaptor._setCurrentFocusedField(this.m_currentFocussedAdaptor);var returnProperties=new Object();returnProperties["focusSetOnAdaptor"]=focusSetOnAdaptor;returnProperties["focusAdaptor"]=a;return returnProperties;}
TabbingManager.prototype._moveFocusToAdaptor=function(adaptor,wasClick,acceptFocusOnClick)
{var focusMovedToAdaptor=true;if(this._canAcceptFocusNatively(adaptor))
{if(this._canAdaptorAcceptFocus(adaptor))
{this.m_currentFocussedAdaptor=adaptor;if(null!=this.m_currentFocussedAdaptor.onFocus)
{this.m_currentFocussedAdaptor.onFocus();}
if(!wasClick)
{this.m_currentFocussedAdaptor.getFocusElement().focus();}
else
{if(!acceptFocusOnClick)
{if(this.m_currentFocussedAdaptor instanceof SelectElementGUIAdaptor)
{this.m_currentFocussedAdaptor.getFocusElement().focus();}}}
if(this.m_currentFocussedAdaptor.setFocus(true,wasClick))
{this.m_currentFocussedAdaptor.renderState();}}
else
{focusMovedToAdaptor=false;}}
else
{this.m_currentFocussedAdaptor=adaptor;if(null!=this.m_currentFocussedAdaptor.onFocus)
{this.m_currentFocussedAdaptor.onFocus();}
this.m_hiddenField.focus();window.captureEvents(Event.KEYDOWN);window.onkeydown=TabbingManager.handleNonNativeComponentKeyEvents;this.m_captureSet=true;if(this.m_currentFocussedAdaptor.setFocus(true,wasClick))
{this.m_currentFocussedAdaptor.renderState();}}
return focusMovedToAdaptor;}
TabbingManager.prototype._determineBackgroundFocus=function()
{if(this.m_currentFocussedAdaptor!=null)
{var parentContainer=this.m_currentFocussedAdaptor.getParentContainer();if(parentContainer!=null)
{var focusElement=parentContainer.supportsProtocol("FocusProtocolHTMLImpl")?parentContainer.getFocusElement():parentContainer.getElement();if(focusElement.tagName=='FORM')
{var parent=focusElement.parentNode;while(parent!=null)
{if(parent.tagName=='BODY')
{focusElement=parent;break;}
parent=parent.parentNode;}}
if(!focusElement.disabled&&isElementVisible(focusElement)&&focusElement.focus)
{focusElement.focus();}
else
{window.focus();}}
else
{window.focus();}}
else
{window.focus();}}
function ServicesInternal()
{}
ServicesInternal.getPerformanceMonitor=function()
{return top["AppController"].getInstance().getPerformanceMonitor();}
function ValidationHelper()
{}
ValidationHelper.m_logger=new Category("ValidationHelper");ValidationHelper.MONTHS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];ValidationHelper.validateCrestCaseNo=function(value)
{var caseNumberPattern=/^[a-zA-Z]{1}\d{8}$/;var errorCode=null;var valid=value.search(caseNumberPattern);if(value.length>0&&0!=valid)
{return ErrorCode.getErrorCode('InvalidCaseNumberFormat');}
return null;}
ValidationHelper.validateYorN=function(value)
{var errorCode=null;if(value.length>0&&'Y'!=value&&'N'!=value&&'y'!=value&&'n'!=value)
{return ErrorCode.getErrorCode('BooleanFieldValueNotYorN');}else{value=value.toUpperCase();return null;}}
ValidationHelper.validateDate=function(value)
{var caseNumberPattern=/^\d{1,2}(\-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(\-)\d{4}$/;var valid=value.search(caseNumberPattern);var errorCode=null;if(value.length>0&&0!=valid)
{errorCode=ErrorCode.getErrorCode('InvalidDateFormat');}
if(ValidationHelper.m_logger.isDebug())ValidationHelper.m_logger.debug('Error code is :'+errorCode);return errorCode;}
ValidationHelper.validateNumber=function(value)
{return(value.length>0&&isNaN(parseInt(value)))?ErrorCode.getErrorCode('NotInteger'):null;}
ValidationHelper.validateFloatNumber=function(value)
{return(value.length>0&&isNaN(parseFloat(value)))?ErrorCode.getErrorCode('NotNumber'):null;}
ValidationHelper.validateCurrency=function(value)
{var currencyPattern=/^[0-9]*(\.[0-9]{2})?$/;return(value.length>0&&(0!=value.search(currencyPattern)))?ErrorCode.getErrorCode('NotCurrency'):null;}
ValidationHelper.compareDates=function(firstValue,secondValue)
{return ValidationHelper.compareParsedDates(ValidationHelper.parseDate(firstValue),ValidationHelper.parseDate(secondValue));}
ValidationHelper.compareParsedDates=function(firstDate,secondDate)
{var res=null;if(firstDate>secondDate){res=1;}
else if(firstDate<secondDate){res=-1;}
else{res=0;}
return res;}
ValidationHelper.todaysDate=function()
{var currentTime=new Date();return new Date(currentTime.getYear(),currentTime.getMonth(),currentTime.getDate());}
ValidationHelper.getTodayFormatted=function()
{var today=new Date();var dd=today.getDate();if(dd.length==1){"0"+dd;}
var mm=today.getMonth();var mon=ValidationHelper.MONTHS[mm];var yyyy=today.getFullYear();var todayFormated=dd+"-"+mon+"-"+yyyy;return todayFormated}
ValidationHelper._createDate=function(value)
{if(value==null||value.length<1)
{return null;}
var day,month,year;day=value.substring(0,1);year=value.slice(value.length-4,value.length);for(var i=0;i<ValidationHelper.MONTHS.length;i++)
{var temp=value.slice(value.length-8,value.length-5);if(ValidationHelper.MONTHS[i]==temp)
{month=i;return new Date(year,month-1,day);}}
return null;}
ValidationHelper.parseCaseManDate=function(dateString)
{var dateElements=dateString.split('-');if(3!=dateElements.length)return null;var day=parseInt(dateElements[0]);if(isNaN(day))return null;var month=-1;for(var i=0;i<ValidationHelper.MONTHS.length;i++)
{if(ValidationHelper.MONTHS[i]==dateElements[1])
{month=i;break;}}
if(-1==month)return null;if(dateElements[2].length!=4)return null;var year=parseInt(dateElements[2]);if(isNaN(year))return null;return new Date(year,month,day);}
ValidationHelper.validateTime=function(value)
{var timePattern=/^[0-2][0-9](\:[0-5][0-9])?$/;var valid=value.search(timePattern);var errorCode=null;if(value.length>0&&0!=valid)
{errorCode=ErrorCode.getErrorCode('InvalidTimeFormat');}
return errorCode;}
ValidationHelper.validateDateWithinOneMonth=function(value)
{var res=ValidationHelper.validateDate(value);if(res!=null){return res;}
var oneMonthAgo=oneMonthEarlier(new Date());var testDate=ValidationHelper.parseCaseManDate(value);if(testDate.getTime()<oneMonthAgo.getTime())
{Services.showAlert("Warning: This Date is more than one month in the past");}}
function oneMonthEarlier(date)
{var lastMonth=date.getMonth();var lastYear=date.getYear();if(0==lastMonth)
{lastMonth=11;lastYear--;}
else
{lastMonth--;}
return new Date(lastYear,lastMonth,date.getDate());}
ValidationHelper.capitalize=function(theString)
{theString=theString.substr(0,1).toUpperCase()+theString.substring(1,theString.length);var i=0;var j=0;while((j=theString.indexOf(" ",i))&&(j!=-1))
{theString=theString.substring(0,j+1)+
theString.substr(j+1,1).toUpperCase()+
theString.substring(j+2,theString.length);i=j+1;}
return theString}
ValidationHelper.superInitCaps=function(theString)
{var res=theString;if(res==res.toUpperCase())res=res.toLowerCase();if(res==res.toLowerCase())
{res=ValidationHelper.capitalize(res);}
return res;}
function Services()
{}
Services.getAppController=function()
{return top.AppController.getInstance();}
Services.hasAccessToForm=function(formName)
{var form=Services.getAppController().m_config.getForm(formName);return Services.getAppController().m_securityContext.hasAccess(form.getRoles());}
Services.hasAccessToRoles=function(requiredRoles)
{return Services.getAppController().m_securityContext.hasAccess(requiredRoles);}
Services.callService=function(mappingName,parameters,handler,async,showProgress)
{var _async=(null==async)?true:async;var _showProgress=(null==showProgress)?true:showProgress;var ds=fwServiceCallDataLoader.create(mappingName,parameters,handler,_async,_showProgress);ds.load();}
Services.login=function(handler,username,password)
{var config=new Object();config.handler=handler;config.username=username;config.password=password;config.async=true;var ds=fwLoginDataLoader.create(config);ds.load();}
Services.logoff=function(formName,raiseWarningIfDOMDirty)
{Services.getAppController().logoff(formName,raiseWarningIfDOMDirty);}
Services.setFocus=function(adaptorId)
{var fc=FormController.getInstance();var adaptor=null;if(adaptorId!=null)
{adaptor=fc.getAdaptorById(adaptorId);}
var tm=fc.getTabbingManager();tm.setFocusOnAdaptor(adaptor);}
Services.navigate=function(formName,raiseWarningIfDOMDirty)
{if(false!=raiseWarningIfDOMDirty)
{raiseWarningIfDOMDirty=true;}
var fc=FormController.getInstance();var adaptor=fc.getFormAdaptor();var details=new Object();details["formName"]=formName;details["raiseWarningIfDOMDirty"]=raiseWarningIfDOMDirty;Services.dispatchEvent(adaptor.getId(),BusinessLifeCycleEvents.EVENT_NAVIGATE,details);}
Services.setValue=function(xp,v)
{var dm=FormController.getInstance().getDataModel();var changed=dm.setValue(xp,v);return changed;}
Services.getValue=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.getValue(xp);}
Services.removeNode=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.removeNode(xp);}
Services.addNode=function(fromDom,toXPath)
{var dm=FormController.getInstance().getDataModel();return dm.addNodeSet(fromDom,toXPath);}
Services.replaceNode=function(xp,node)
{var dm=FormController.getInstance().getDataModel();return dm.replaceNode(xp,node);}
Services.startTransaction=function()
{var dm=FormController.getInstance().getDataModel();return dm._startTransaction();}
Services.endTransaction=function()
{var dm=FormController.getInstance().getDataModel();return dm._endTransaction();}
Services.exists=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.exists(xp);}
Services.countNodes=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.countNodes(xp);}
Services.getNode=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.getNode(xp);}
Services.getNodes=function(xp)
{var dm=FormController.getInstance().getDataModel();return dm.getNodes(xp);}
Services.hasValue=function(xpath)
{var dm=FormController.getInstance().getDataModel();return dm.hasValue(xpath);}
Services.dispatchEvent=function(id,type,detail)
{FormController.getInstance().dispatchBusinessLifeCycleEvent(id,type,detail);}
Services.setTransientStatusBarMessage=function(message)
{var fc=FormController.getInstance();var formAdaptor=fc.getFormAdaptor();formAdaptor.setTransientMessage(message);}
Services.getAdaptorById=function(id)
{return FormController.getInstance().getAdaptorById(id);}
Services.showDialog=function(type,callback,message,title,width,top,left)
{StandardDialogManager.showDialog(type,callback,message,title,width,top,left);}
Services.getEditorURL=function(){return Services.getAppController().m_config.getEditorURL();}
Services.getSpellCheckURL=function(){return Services.getAppController().m_config.getSpellCheckURL();}
Services.getSpellCheckPopup=function(){return Services.getAppController().m_config.getSpellCheckPopup();}
Services.showDocument=function(reportName,id,screenX,screenY,width,height)
{var ac=Services.getAppController();var screenX=screenX!=null?screenX:100;var screenY=screenY!=null?screenY:60;var width=width!=null?width:800;var height=height!=null?height:600;var SERVLET=ac.m_config.getServiceBaseURL()+"_invoker/InvokerServlet";var USER_PARAM="?user=";var MAC_PARAM="&mac=";var DOCUMENTID_PARAM="&DocumentId=";var CONTENT_REQUEST="&content=document";var securityContext=ac.m_securityContext;var username=securityContext.getCurrentUser().getUserName();var mac=securityContext.generateMac(id);var urlArr=new Array();urlArr.push(SERVLET);urlArr.push(USER_PARAM);urlArr.push(username);urlArr.push(CONTENT_REQUEST);urlArr.push(MAC_PARAM);urlArr.push(mac);urlArr.push(DOCUMENTID_PARAM);urlArr.push(id);var url=urlArr.join("");var featureArr=new Array();featureArr.push("left="+screenX);featureArr.push("top="+screenY);featureArr.push("screenX="+screenX);featureArr.push("screenY="+screenY);featureArr.push("width="+width);featureArr.push("height="+height);featureArr.push("resizable=yes");var feature=featureArr.join(",");window.open(url,reportName,feature);}
Services.getCurrentUser=function()
{return Services.getAppController().m_securityContext.getCurrentUser().getUserName();}
Services.xPathToConcat=function(s)
{if(s==null||s=="")
{return"\"\"";}
var c;var cs="concat(\"\"";var ci=0;for(var i=0,l=s.length;i<l;i++)
{c=s.charAt(i);if(c=='"')
{cs=cs.concat(",'"+s.substring(ci,i+1)+"'");ci=i+1;}
else if(c=="'")
{cs=cs.concat(',"'+s.substring(ci,i+1)+'"');ci=i+1;}}
return cs.concat(',"'+s.substring(ci)+'")');}
Services.compareStringValues=function(a,b)
{return((a==null||a=="")&&(b==null||b==""))?true:a==b;}
var XMLDOMRequestQueue=new Array();Services.loadDOMFromURL=function(url,callbackHandler,async,showProgress)
{var _async;var _showProgress;if(arguments.length==1)
{_async=false;_showProgress=false;var index;var domInfo=new Object();index=XMLDOMRequestQueue.length;XMLDOMRequestQueue.push(domInfo);var defaultHandler=new Object();defaultHandler.onSuccess=function(dom,name)
{if(null!=XMLDOMRequestQueue[index])
{XMLDOMRequestQueue[index]["DOM"]=dom;}}
Services.loadDOMFromURL(url,defaultHandler,_async,_showProgress);var dom=null;if(null!=XMLDOMRequestQueue[index])
{dom=XMLDOMRequestQueue[index]["DOM"];XMLDOMRequestQueue[index]["DOM"]=null;XMLDOMRequestQueue[index]=null;}
domInfo=null;return dom;}
else if(arguments.length>1)
{_async=(null==async)?false:async;_showProgress=(null==showProgress)?false:showProgress;var fdl=fwFileDataLoader.create(url,callbackHandler,_async,_showProgress);fdl.load();}}
Services.showAlert=function(message,callback)
{var fc=FormController.getInstance();if(fc!=null)fc.showAlert(message,callback);}
Services.getFormsNode=function()
{return Services.getAppController().m_config.getFormsNode();}
Services.frameworkLoaded=true;