/** 
 * @fileoverview MaintainSystemDataConstants.js:
 * This file contains the constants used for UC125 - Maintain System Data screen
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
XPathConstants.DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/SystemData"
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.COURTSELECTED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CourtSelected";
XPathConstants.PERSELECTED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/PERSelected";
XPathConstants.TEMP_ITEM_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SystemDataItem";
XPathConstants.SUBFORM_ROOT_XPATH = XPathConstants.VAR_FORM_XPATH + "/SubformData";
XPathConstants.SUBFORM_COURT_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/CourtCode";
XPathConstants.SUBFORM_MODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Mode";
XPathConstants.SUBFORM_TYPE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/Type";
XPathConstants.SUBFORM_NODE_XPATH = XPathConstants.SUBFORM_ROOT_XPATH + "/SystemDataItem";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/SystemDataItem";
XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Subform/Validation/ItemExists";

/**
 * Enumeration of System Data Types
 * @author rzxd7g
 * 
 */
function SystemDataTypes() {};
SystemDataTypes.TYPE_PER = "PerItem";
SystemDataTypes.TYPE_COURT = "CourtItem";
SystemDataTypes.TYPE_NONPER = "NonPerItem";

/**
 * Enumeration of Form States
 * @author rzxd7g
 * 
 */
function FormStates() {};
FormStates.MODE_MODIFY = "modify";
FormStates.MODE_CREATE = "create";
