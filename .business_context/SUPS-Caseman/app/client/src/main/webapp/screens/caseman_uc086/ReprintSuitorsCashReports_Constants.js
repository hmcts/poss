/** 
 * @fileoverview ReprintSuitorsCashReports_Constants.js:
 * This file contains the constants used for UC086 - Reprint Suitors' Cash Reports screen.
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 21/08/2006 - Chris Vincent, Added the Page Number constant for the paging mechanism
 * 				due to performance issues with the screen (Defect 4458).
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.ROOT_XPATH = "/ds";
XPathConstants.VAR_PAGE_XPATH = XPathConstants.ROOT_XPATH + "/var/page";
XPathConstants.DATA_XPATH = XPathConstants.ROOT_XPATH + "/SuitorsCashReports";
XPathConstants.PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
