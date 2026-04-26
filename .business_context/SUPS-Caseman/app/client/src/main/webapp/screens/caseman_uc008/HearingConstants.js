/** 
 * @fileoverview HearingConstants.js:
 * This file contains the commonly used constants used for UC008
 * (Hearings/Hearings CO) screens and the Add Hearing Subform
 *
 * @author Chris Vincent
 * @version 0.1
 */

/**
 * Generic XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/MaintainHearing";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.HEARING_PATH = XPathConstants.DATA_XPATH + "/Hearings/Hearing";
XPathConstants.NEW_HEARING_TMP_PATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/Hearing";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.ADD_HEARING_SUBFORM_PATH = XPathConstants.VAR_FORM_XPATH + "/Subforms/addHearingSubform";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NextSurrogateKey";
XPathConstants.NAVIGATE_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NavigateAfterSave";
