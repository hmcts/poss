/** 
 * @fileoverview DeterminationOfMeans_MenuBarCode.js:
 * Configurations for the UC114 (DOM Calculator) Navigation Buttons
 *
 * @author Ian Stainer
 */

menubar = {
	quickLinks: [
	{
		id: "NavBar_PrintBtn",
		formName: NavigationController.DOM_CALC_FORM,
		label: "Print ex120a",
/**
 * @author kznwpr
 * @return boolean 
 */
		guard:   function() 
				 {
						var CONumber = Services.getValue(Header_CONumber.dataBinding);
						var dom = Reports.createReportDom("CM_DOM_R1.rdf");			
						Reports.setValue(dom, "P_CO_NUMBER", CONumber );
						Reports.setValue(dom, "P_SUBMITTED_BY", Services.getValue(CaseManFormParameters.USERNAME_XPATH) );
						Reports.runReport(dom);					 
						return false;
				 },			 
		onMenuBar: true
	}]
}
