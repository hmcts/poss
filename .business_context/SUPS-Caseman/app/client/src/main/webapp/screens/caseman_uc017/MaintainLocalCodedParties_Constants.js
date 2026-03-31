/** 
 * @fileoverview MaintainLocalCodedPartiesConstants.js:
 * This file contains the constants used for UC17 - Maintain Local Coded Parties screen
 *
 * @author Chris Vincent
 * @version 0.1
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.QUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Query";
XPathConstants.CODE_EXISTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/temp/CodeExists";
XPathConstants.DELETE_PARTYDATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/temp/DeletePartyData/CodedParties";
XPathConstants.SEARCH_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
XPathConstants.SEARCH_TEMPQUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/temp/SearchCriteria";
XPathConstants.SUBFORM_ROOT_XPATH = XPathConstants.VAR_FORM_XPATH + "/SubformData";
XPathConstants.SUBFORM_CODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Code";
XPathConstants.SUBFORM_COURTCODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/CourtCode";
XPathConstants.SUBFORM_MODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Mode";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/CodedParties/CodedParty";

/**
 * Popup Mode Constants
 * @author rzxd7g
 * 
 */
function PopupModes() {};
PopupModes.MODE_MODIFY = "modify";
PopupModes.MODE_CREATE = "create";
