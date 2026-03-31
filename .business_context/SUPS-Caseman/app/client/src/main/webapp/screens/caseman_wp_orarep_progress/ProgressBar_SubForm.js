/** 
 * @fileoverview ProgressBar_SubForm.js:
 * This file contains the configurations for the ProgressBar Subform for WP and ORAR
 * @author Frederik Vandendriessche Chris Vincent
 */
/****************************** CONSTANTS ******************************************/
/**************************** HELPER FUNCTIONS **************************************/
/************************** FORM CONFIGURATIONS *************************************/

function progressBarSubForm() {}
/**
 * @author nz5zpz
 * 
 */
progressBarSubForm.initialise = function() {
	var process = top.WP.GetScreenProcess();
	top.WP.SetState(process, "ProgressBarUp", true); }
	
progressBarSubForm.cancelLifeCycle = {
	eventBinding: {	keys: [ { key: Key.F4, element: "progressBarSubForm" } ],
					singleClicks: [ {element: "ProgressBarPopup_CancelButton"} ],
					doubleClicks: [] } }

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/var/subform/progressBarSubForm/progresbarvalue";
Progress_Bar.isReadOnly = function() {	return true; }	
Progress_Bar.transformToDisplay = function(value) {
	return value; }

function ProgressBarPopup_CancelButton() {};
ProgressBarPopup_CancelButton.dataBinding = "/ds/var/subform/progressBarSubForm/cancel";
/**
 * @author nz5zpz
 * 
 */
ProgressBarPopup_CancelButton.actionBinding = function() {
	var process = top.WP.GetScreenProcess();
	top.WPError.FinishProcess(process); }
