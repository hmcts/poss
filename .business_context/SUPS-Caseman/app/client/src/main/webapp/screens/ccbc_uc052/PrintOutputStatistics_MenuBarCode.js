/** 
 * @fileoverview PrintOutputStatistics_MenuBarCode.js:
 * Configurations for the CCBC UC092 (Print Output Statistics) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 08/01/2007 - Chris Vincent, added National Coded Parties screen to the Quicklinks menu 
 * 				(UCT_Group2 Defect 1098)
 */

menubar = {
	quickLinks: [
		{
			id: "Log_Received_Tapes_Btn",
			formName: "ReceivedRecords",
			label: "Log Received Tapes",
			onMenuBar: true
		},
		{
			id: "Log_Returned_Tapes_Btn",
			formName: "ReturnedRecords",
			label: "Log Returned Tapes",
			onMenuBar: true
		},
		{
			id: "View_Rejected_Cases_Btn",
			formName: "QueryRejectedCases",
			label: "Rejected Cases",
			onMenuBar: true
		},
		{
			id: "View_Rejected_Judgments_Btn",
			formName: "QueryRejectedJudgments",
			label: "Rejected Judgments",
			onMenuBar: true
		},
		{
			id: "View_Rejected_Warrants_Btn",
			formName: "QueryRejectedWarrants",
			label: "Rejected Warrants",
			onMenuBar: false
		},
		{
			id: "View_Rejected_Paid_Btn",
			formName: "QueryRejectedPaid",
			label: "Rejected Paid / Written Off Details",
			onMenuBar: false
		},
		{
			id: "Print_Customer_File_Reports_Btn",
			formName: "ProduceCustomerFileReports",
			label: "Print Customer File Reports",
			onMenuBar: false
		},
		{
			id: "NavBar_CodedPartiesButton",
			formName: "MaintainNationalCodedParties",
			label: " Maintain National Coded Parties ",
			onMenuBar: false						
		}
	]
}