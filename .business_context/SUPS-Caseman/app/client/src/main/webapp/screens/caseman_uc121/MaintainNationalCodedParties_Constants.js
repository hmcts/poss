/** 
 * @fileoverview MaintainNationalCodedParties_Constants.js:
 * This file contains the constants used for UC121 - Maintain National
 * Coded Parties screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, changed global variables to static variables.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.QUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Query";
XPathConstants.CODE_EXISTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/temp/CodeExists";
XPathConstants.SEARCH_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
XPathConstants.SEARCH_TEMPQUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/temp/SearchCriteria";
XPathConstants.SUBFORM_ROOT_XPATH = XPathConstants.VAR_FORM_XPATH + "/SubformData";
XPathConstants.SUBFORM_CODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Code";
XPathConstants.SUBFORM_COURTCODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/CourtCode";
XPathConstants.SUBFORM_MODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Mode";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/CodedParty";

/**
 * Enumeration of Form States
 * @author rzxd7g
 * 
 */
function FormStates() {};
FormStates.MODE_MODIFY = "modify";
FormStates.MODE_CREATE = "create";
