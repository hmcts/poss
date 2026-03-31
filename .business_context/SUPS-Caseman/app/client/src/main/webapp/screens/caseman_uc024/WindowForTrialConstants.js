/** 
 * @fileoverview WindowForTrialConstants.js:
 * This file contains the constants used for UC024 - Maintain Window for Trial screen
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
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/MaintainWindowForTrial";
XPathConstants.TEMP_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp";
XPathConstants.NEWWFT_XPATH = XPathConstants.TEMP_XPATH + "/WindowForTrial";
XPathConstants.CASE_XPATH = XPathConstants.DATA_XPATH + "/Case";
XPathConstants.WFT_XPATH = XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[./WFTId = " + XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedWFT]";
XPathConstants.EVENT_XPATH = XPathConstants.DATA_XPATH + "/CaseEvent";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.DATES_ENTERED_XPATH = XPathConstants.WFT_XPATH + "/StartAndEndDatesSet";
XPathConstants.EXCLUDED_DATES_GEN_XPATH = XPathConstants.WFT_XPATH + "/ExcludedDatesGenerated";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.NAVIGATE_AFTER_SAVE_IND_XPATH = XPathConstants.TEMP_XPATH + "/NavigateAfterSave";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/WindowForTrial";

function FormConstants() {};

/**
 * Default number of days to add to start date depending on Track
 */
FormConstants.FAST_TRACK_ENDDATE = 18;
FormConstants.MULTI_TRACK_ENDDATE = 4;

/**
 * Constants for Window for Trial <Status> nodes
 */
FormConstants.STATUS_UPDATED = "UPDATED";
FormConstants.STATUS_NEW = "NEW";

/**
 * Define ranges for the Days, Hours and Minutes fields
 */
FormConstants.MIN_DAYS = 1;
FormConstants.MIN_HOURS = 1;
FormConstants.MAX_HOURS = 5;
FormConstants.MIN_MINS = 1;
FormConstants.MAX_MINS = 59;

/**
 * Dirty Flag for navigating away after saving
 */
var NAVIGATE_AFTER_SAVE = false;

/**
 * Enumeration of window for trial statuses
 * @author rzxd7g
 * 
 */
function WFTStatusesEnum() {};
WFTStatusesEnum.ADJOURNED = "ADJOURNED";
WFTStatusesEnum.FIXED = "FIXED";
WFTStatusesEnum.INERROR = "IN ERROR";
WFTStatusesEnum.OUTSTANDING = "OUTSTANDING";
WFTStatusesEnum.SETWBHD = "SETWBHD";
WFTStatusesEnum.SETWODHC = "SETWODHC";
WFTStatusesEnum.SETWODNH = "SETWODNH";
WFTStatusesEnum.STAYED = "STAYED";
WFTStatusesEnum.STRUCKOUT = "STRUCK OUT";
WFTStatusesEnum.TRANSFERRED = "TRANSFERRED";
