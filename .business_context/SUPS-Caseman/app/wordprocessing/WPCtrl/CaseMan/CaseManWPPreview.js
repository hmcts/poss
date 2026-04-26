/**
 * SUPS CaseMan Word Processing Preview - For previewing outputs.
 * Creates and processes necessary Word Processing steps outside of the current Word Processing Controller -
 * this allows it to be invoked anytime providing the WPState.wps_DOM is set up.
 * @constructor
 */
function CaseManWPPreview(wpctrl)
{
	this.m_wpctrl = wpctrl;
	this.m_status = CaseManWPPreview.STATUS_READY;
}

/**
 * SUPS CaseMan Word Processing Preview - Ready to process
 */
CaseManWPPreview.STATUS_READY = 0;
/**
 * SUPS CaseMan Word Processing Preview - Report generation started
 */
CaseManWPPreview.STATUS_CREATE_REPORT_STARTED = 1;
/**
 * SUPS CaseMan Word Processing Preview - Report generation completed
 */
CaseManWPPreview.STATUS_CREATE_REPORT_FINISHED = 2;
/**
 * SUPS CaseMan Word Processing Preview - Poll of the report started
 */
CaseManWPPreview.STATUS_POLL_REPORT_STARTED = 3;
/**
 * SUPS CaseMan Word Processing Preview - Poll of the report finished
 */
CaseManWPPreview.STATUS_POLL_REPORT_FINISHED = 4;

/**
 * SUPS CaseMan Word Processing Preview - Frequency interval to check status
 */
CaseManWPPreview.INTERVAL = 500;

/**
 * SUPS CaseMan Word Processing Preview - Wordprocessing control
 */
 
CaseManWPPreview.prototype.m_wpctrl = null;

/**
 * SUPS CaseMan Word Processing Preview - Current status
 */
CaseManWPPreview.prototype.m_status = CaseManWPPreview.STATUS_READY;

/**
 * SUPS CaseMan Word Processing Preview - Current process step being executed
 */
CaseManWPPreview.prototype.m_currentStep = null;

/**
 * SUPS CaseMan Word Processing Preview - Current process step completion condition
 */
CaseManWPPreview.prototype.m_currentStepCondition = null;

/**
 * SUPS CaseMan Word Processing Preview - executes the print preview
 */
CaseManWPPreview.prototype.runPreview = function()
{
	if (this.m_status == CaseManWPPreview.STATUS_READY)
	{
		// Create Report
		this.m_currentStep = new CaseManWPProcessStep__CreateReport();
		WP.SetState(this.m_wpctrl.getScreenProcess(), WPState.Preview, "true");
		this.m_currentStepCondition = this.m_currentStep.process(this.m_wpctrl, this.m_wpctrl.getScreenProcess());
		WP.SetState(this.m_wpctrl.getScreenProcess(), WPState.Preview, "false");
		this.m_status = CaseManWPPreview.STATUS_CREATE_REPORT_STARTED;
	}
	else if(this.m_status == CaseManWPPreview.STATUS_CREATE_REPORT_STARTED)
	{
		// Wait for Create Report
		if (this.m_currentStepCondition.apply(this.m_currentStep, []))
		{
			this.m_status = CaseManWPPreview.STATUS_CREATE_REPORT_FINISHED;
		}
	}
	else if(this.m_status == CaseManWPPreview.STATUS_CREATE_REPORT_FINISHED)
	{
		// Poll Report
		this.m_currentStep = new CaseManWPProcessStep__PollReport();
		this.m_currentStepCondition = this.m_currentStep.process(this.m_wpctrl, this.m_wpctrl.getScreenProcess());
		this.m_status = CaseManWPPreview.STATUS_POLL_REPORT_STARTED;
	}
	else if(this.m_status == CaseManWPPreview.STATUS_POLL_REPORT_STARTED)
	{
		// Wait for Poll Report
		if (this.m_currentStepCondition.apply(this.m_currentStep, []))
		{
			this.m_status = CaseManWPPreview.STATUS_POLL_REPORT_FINISHED;
		}
	}
	
	if (this.m_status < CaseManWPPreview.STATUS_POLL_REPORT_FINISHED)
	{
		var thisObj = this;
		setTimeout(function() {thisObj.runPreview();}, CaseManWPPreview.INTERVAL);
	}
}
