/**
	This OracleReportXPath class is a holder for XPaths into XML snippets returned by FormController/webservices.	
	Some of these XML snippets (and their syntax specifically) are under our (wp) ownership,
	Some of them aren't. Specifically the latter category makes this class a must to have.
**/
function OracleReportXPath() 
{
}

OracleReportXPath.prototype = new WPXPath();

OracleReportXPath.prototype.constructor = OracleReportXPath;

OracleReportXPath.ds = new Object();

OracleReportXPath.rel2 = new Object();
OracleReportXPath.rel2.caseNumber 			= "WordProcessing/Case/CaseNumber";
OracleReportXPath.rel2.eventNumber 			= "WordProcessing/Event/StandardEventId";
OracleReportXPath.rel2.eventPK    			= "WordProcessing/Event/CaseEventSeq";

OracleReportXPath.rel5 = new Object();
OracleReportXPath.rel5.eventDetails 		= "WordProcessing/Event/EventDetails";

