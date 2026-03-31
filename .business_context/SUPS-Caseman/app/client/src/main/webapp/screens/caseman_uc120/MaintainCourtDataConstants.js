/** 
 * @fileoverview MaintainCourtDataConstants.js:
 * This file contains the constants used for UC120 - Maintain Court Data screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, changed global variables to static variables.
 * 08/11/2011 - Chris Vincent, added RELOADREFDATA_XPATH for Trac 4591
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Court"
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/Court";
XPathConstants.RESULTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SearchResults/Courts";
XPathConstants.COURT_GRID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedCourt";
XPathConstants.ADDRESS_GRID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedAddress";
XPathConstants.SELECTED_ADDRESS_XPATH = XPathConstants.DATA_XPATH + "/ContactDetails/Addresses/Address[./SurrogateId=" + XPathConstants.ADDRESS_GRID_XPATH + "]";
XPathConstants.DIRTYFLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DirtyFlag";
XPathConstants.RELOADREFDATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ReloadRefData";
XPathConstants.COURT_OPENTIMEVALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/CourtOpenTimeValid";
XPathConstants.COURT_CLOSETIMEVALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/CourtOpenTimeValid";
XPathConstants.BAILIFF_OPENTIMEVALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/CourtOpenTimeValid";
XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/CourtOpenTimeValid";
XPathConstants.FORM_STATE_XPATH = XPathConstants.VAR_FORM_XPATH + "/CurrentForm/state";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NextSurrogateKey";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ActionAfterSave";
XPathConstants.DM_CRT_ENABLED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DMCourtFieldsEnabled";

/**
 * Enumeration of Form States
 * @author rzxd7g
 * 
 */
function FormStates() {};
FormStates.STATE_BLANK = "blank";
FormStates.STATE_MODIFY = "modify";

/**
 * Actions After Saving
 * @author rzxd7g
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";
ActionAfterSave.ACTION_LOADNEWCOURT = "LOAD_NEW_COURT";