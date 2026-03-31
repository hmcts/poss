/** 
 * @fileoverview MaintainPerDetailsConstants.js:
 * This file contains the constants used for UC126 - Maintain PER Details screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 15/06/2006 - Chris Vincent, changed global variables to static variables.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/PerDetails"
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DIRTYFLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DirtyFlag";
XPathConstants.SEARCH_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SearchCriteria/PerDetail";
XPathConstants.GRID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Grid/SelectedPERDetail";
XPathConstants.SELECTED_PERDETAIL_XPATH = XPathConstants.DATA_XPATH + "/PerDetail[./OrderNumber = " + XPathConstants.GRID_XPATH + "]";
XPathConstants.ADD_PERDETAIL_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NewPerRecord/PerDetail";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ActionAfterSave";
XPathConstants.FORM_STATE_XPATH = XPathConstants.VAR_FORM_XPATH + "/CurrentForm/state"

/**
 * Form Status constants
 * @author rzxd7g
 * 
 */
function FormStates() {};
FormStates.STATE_BLANK = "blank";
FormStates.STATE_MODIFY = "modify";

/**
 * Flag for actions to perform following a save
 * @author rzxd7g
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";
