/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.utils.screens;

import java.util.Iterator;
import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.EventConfig;
import uk.gov.dca.utils.eventconfig.EventManager;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Manage Case Events screen.
 *
 * Date: 30-Jun-2009
 */
public class UC002CaseEventUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_INVALID_EVENT_ID. */
    // Public Error Messages
    public static final String ERR_INVALID_EVENT_ID = "You have entered an invalid value - please re-enter.";
    
    /** The Constant ERR_NO_TRACK_SET. */
    public static final String ERR_NO_TRACK_SET =
            "Event cannot be entered, the case is not currently allocated to a track.";
    
    /** The Constant ERR_MAGS_CASE_ENTERED. */
    public static final String ERR_MAGS_CASE_ENTERED = "Please enter a non MAGS ORDER Case.";
    
    /** The Constant ERR_INVALID_CASENUMBER. */
    public static final String ERR_INVALID_CASENUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_NOT_FAMILY_CASE. */
    public static final String ERR_NOT_FAMILY_CASE = "This event can only be created on Family Enforcement cases.";

    /** The text case number. */
    // Private text field identifiers
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The text insolv number. */
    private String TEXT_INSOLV_NUMBER = "Header_InsolvSeqNo";
    
    /** The text insolv year. */
    private String TEXT_INSOLV_YEAR = "Header_InsolvYear";
    
    /** The text court code. */
    private String TEXT_COURT_CODE = "Header_OwningCourtCode";
    
    /** The text judge. */
    private String TEXT_JUDGE = "Header_DefaultJudge";
    
    /** The text amountclaimed. */
    private String TEXT_AMOUNTCLAIMED = "Header_AmountClaimed";
    
    /** The text preferredcourt code. */
    private String TEXT_PREFERREDCOURT_CODE = "Header_PreferredCourtCode";
    
    /** The text preferredcourt name. */
    private String TEXT_PREFERREDCOURT_NAME = "Header_PreferredCourtName";
    
    /** The sel track. */
    private String SEL_TRACK = "Header_CaseAllocatedTo";
    
    /** The text new event id. */
    private String TEXT_NEW_EVENT_ID = "Master_EventId";
    
    /** The text event id. */
    private String TEXT_EVENT_ID = "EventDetails_EventId";
    
    /** The chk error flag. */
    private String CHK_ERROR_FLAG = "EventDetails_ErrorFlag";
    
    /** The text subject no. */
    private String TEXT_SUBJECT_NO = "EventDetails_SubjectNumber";
    
    /** The text subject type. */
    private String TEXT_SUBJECT_TYPE = "EventDetails_SubjectType";
    
    /** The text subject name. */
    private String TEXT_SUBJECT_NAME = "EventDetails_SubjectName";
    
    /** The text applicant. */
    private String TEXT_APPLICANT = "EventDetails_Applicant";
    
    /** The text result. */
    private String TEXT_RESULT = "EventDetails_Result";
    
    /** The date event receipt date. */
    private String DATE_EVENT_RECEIPT_DATE = "EventDetails_DateReceived";
    
    /** The zoom event details. */
    private String ZOOM_EVENT_DETAILS = "EventDetails_Details";
    
    /** The text event bmstask. */
    private String TEXT_EVENT_BMSTASK = "EventDetails_BMSTask";
    
    /** The text event description. */
    private String TEXT_EVENT_DESCRIPTION = "EventDetails_EventDescription";
    
    /** The date event date. */
    private String DATE_EVENT_DATE = "EventDetails_Date";
    
    /** The text new event event date. */
    private String TEXT_NEW_EVENT_EVENT_DATE = "AddEvent_Date";
    
    /** The text new event receipt date. */
    private String TEXT_NEW_EVENT_RECEIPT_DATE = "AddEvent_DateReceived";
    
    /** The text new event instig label. */
    private String TEXT_NEW_EVENT_INSTIG_LABEL = "AddEvent_InstigatorLabel";
    
    /** The text new event details. */
    private String TEXT_NEW_EVENT_DETAILS = "AddEvent_Details";
    
    /** The text new event subject. */
    private String TEXT_NEW_EVENT_SUBJECT = "AddEvent_Subject";
    
    /** The chk new event produce output. */
    private String CHK_NEW_EVENT_PRODUCE_OUTPUT = "AddEvent_WPCall";
    
    /** The text created by. */
    private String TEXT_CREATED_BY = "EventDetails_CreatedBy";
    
    /** The auto new case type. */
    private String AUTO_NEW_CASE_TYPE = "ChangeCaseType_NewCaseType";

    /** The grid parties header. */
    // Private grid identifiers
    private String GRID_PARTIES_HEADER = "Header_PartyTypeListGrid";
    
    /** The grid existing events. */
    private String GRID_EXISTING_EVENTS = "Master_EventGrid";
    
    /** The grid lov newevent details. */
    private String GRID_LOV_NEWEVENT_DETAILS = "AddEvent_DetailsLOVGrid_grid";
    
    /** The grid newevent instigator. */
    private String GRID_NEWEVENT_INSTIGATOR = "AddEvent_InstigatorGrid";
    
    /** The grid lov bms options. */
    private String GRID_LOV_BMS_OPTIONS = "AddEvent_BMSTaskLOVGrid_grid";
    
    /** The grid lov statsmod options. */
    private String GRID_LOV_STATSMOD_OPTIONS = "AddEvent_StatsModLOVGrid_grid";

    /** The popup lov new event. */
    // Private popup identifiers
    private String POPUP_LOV_NEW_EVENT = "Master_EventLOVGrid";
    
    /** The popup lov bms options. */
    private String POPUP_LOV_BMS_OPTIONS = "AddEvent_BMSTaskLOVGrid";
    
    /** The popup lov statsmod options. */
    private String POPUP_LOV_STATSMOD_OPTIONS = "AddEvent_StatsModLOVGrid";
    
    /** The popup lov subject field. */
    private String POPUP_LOV_SUBJECT_FIELD = "SubjectLOV_Popup";
    
    /** The popup add event. */
    private String POPUP_ADD_EVENT = "AddEvent_Popup";
    
    /** The popup details claim. */
    private String POPUP_DETAILS_CLAIM = "Details_Of_Claim_Popup";
    
    /** The popup reset case status. */
    private String POPUP_RESET_CASE_STATUS = "resetCaseStatus_subform";
    
    /** The popup reset case type. */
    private String POPUP_RESET_CASE_TYPE = "changeCaseType_subform";

    /** The btn add new event. */
    // Private button identifiers
    private String BTN_ADD_NEW_EVENT = "Master_AddEventButton";
    
    /** The btn new event lov. */
    private String BTN_NEW_EVENT_LOV = "Master_EventLOVButton";
    
    /** The btn new event subject lov. */
    private String BTN_NEW_EVENT_SUBJECT_LOV = "AddEvent_SubjectLOVButton";
    
    /** The btn new event subject case. */
    private String BTN_NEW_EVENT_SUBJECT_CASE = "SubjectPopup_CaseButton";
    
    /** The btn new event details lov. */
    private String BTN_NEW_EVENT_DETAILS_LOV = "AddEvent_DetailsLOVButton";
    
    /** The btn new event save. */
    private String BTN_NEW_EVENT_SAVE = "AddEvent_SaveButton";
    
    /** The btn new event cancel. */
    private String BTN_NEW_EVENT_CANCEL = "AddEvent_CancelButton";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn details claim close. */
    private String BTN_DETAILS_CLAIM_CLOSE = "DetailsOfClaim_CloseButton";
    
    /** The btn reset case status ok. */
    private String BTN_RESET_CASE_STATUS_OK = "ResetCaseStatus_OkButton";
    
    /** The btn reset case type ok. */
    private String BTN_RESET_CASE_TYPE_OK = "ChangeCaseType_OkButton";

    /** The reset case status subform. */
    // Private subform objects
    private SubFormAdaptor resetCaseStatusSubform = null;
    
    /** The reset case type subform. */
    private SubFormAdaptor resetCaseTypeSubform = null;

    /** The Constant BTN_NAV_CASES_SCREEN. */
    // Static constants representing the navigation buttons on the Case Events screen
    public static final String BTN_NAV_CASES_SCREEN = "NavBar_CasesButton";
    
    /** The Constant BTN_NAV_JUDG_SCREEN. */
    public static final String BTN_NAV_JUDG_SCREEN = "NavBar_JudgmentsButton";
    
    /** The Constant BTN_NAV_HEARINGS_SCREEN. */
    public static final String BTN_NAV_HEARINGS_SCREEN = "NavBar_HearingsButton";
    
    /** The Constant BTN_NAV_WARRANT_RETURNS_SCREEN. */
    public static final String BTN_NAV_WARRANT_RETURNS_SCREEN = "NavBar_WarrantReturnsButton";
    
    /** The Constant BTN_NAV_WARRANTS_SCREEN. */
    public static final String BTN_NAV_WARRANTS_SCREEN = "NavBar_WarrantsButton";

    // Static constants representing the additional navigation quicklinks on the
    /** The Constant QUICKLINK_QBP. */
    // Case Events screen
    public static final String QUICKLINK_QBP = "Query";
    
    /** The Constant QUICKLINK_TRANSFER_CASE. */
    public static final String QUICKLINK_TRANSFER_CASE = "Transfer Case";
    
    /** The Constant QUICKLINK_AE_EVENTS. */
    public static final String QUICKLINK_AE_EVENTS = "AE Events";
    
    /** The Constant QUICKLINK_BAR_JUDG. */
    public static final String QUICKLINK_BAR_JUDG = "Bar Judgment/Enforcement";
    
    /** The Constant QUICKLINK_VIEW_PAYMENTS. */
    public static final String QUICKLINK_VIEW_PAYMENTS = "View Payments";
    
    /** The Constant QUICKLINK_WFT. */
    public static final String QUICKLINK_WFT = "Window For Trial";
    
    /** The Constant QUICKLINK_OBLIGATIONS. */
    public static final String QUICKLINK_OBLIGATIONS = "Active Obligations";
    
    /** The Constant QUICKLINK_HRA. */
    public static final String QUICKLINK_HRA = "HRA Details";
    
    /** The Constant QUICKLINK_REISSUE. */
    public static final String QUICKLINK_REISSUE = "Re-Issue Warrant";
    
    /** The Constant QUICKLINK_CASE_STATUS. */
    public static final String QUICKLINK_CASE_STATUS = "Reset Case Status";
    
    /** The Constant QUICKLINK_CASE_TYPE. */
    public static final String QUICKLINK_CASE_TYPE = "Reset Case Type";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC002CaseEventUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Enter/Query Details of Case Event";
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        tA.type (pCaseNumber);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Checks if is case number valid.
     *
     * @return true, if is case number valid
     * @throws FrameworkException the framework exception
     */
    public boolean isCaseNumberValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).isValid ();
    }

    /**
     * Sets the cursor focus in the Case Number field.
     */
    public void setCaseNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).focus ();
    }

    /**
     * Sets the court code.
     *
     * @param pCourtCode the new court code
     */
    public void setCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_COURT_CODE, pCourtCode);
    }

    /**
     * Enters the case number specified and tabs off the field (assumes that focus is already
     * set on the Case Number field) to load the desired case.
     *
     * @param caseNumber The identifier of the Case to be loaded
     */
    public void loadCaseByCaseNumber (final String caseNumber)
    {
        cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).type (caseNumber);
        if ( cMB.isAlertPresent() )
        {
            cMB.getAlert();
        }
        cMB.waitForPageToLoad ();
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
        cMB.waitForPageToLoad ();
        if ( cMB.isAlertPresent() )
        {
            cMB.getAlert();
        }
    }

    /**
     * Enters the Insolvency Number specified and tabs off the field (assumes that focus is already
     * set on the first Insolvency Number field) to load the desired record.
     *
     * @param insolvNumber The insolvency sequence number
     * @param insolvYear The insolvency year number
     */
    public void loadCaseByInsolvencyNumber (final String insolvNumber, final String insolvYear)
    {
        setTextFieldValue (TEXT_INSOLV_NUMBER, insolvNumber);
        setTextFieldValue (TEXT_INSOLV_YEAR, insolvYear);
        cMB.waitForPageToLoad ();
    }

    /**
     * Gets the judge.
     *
     * @return the judge
     */
    public String getJudge ()
    {
        return cMB.getTextInputAdaptor (TEXT_JUDGE).getValue ();
    }

    /**
     * Sets the judge.
     *
     * @param pJudge the new judge
     */
    public void setJudge (final String pJudge)
    {
        setTextFieldValue (TEXT_JUDGE, pJudge);
    }

    /**
     * Checks if is judge enabled.
     *
     * @return true, if is judge enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isJudgeEnabled () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_JUDGE).isEnabled ();
    }

    /**
     * Checks if is judge valid.
     *
     * @return true, if is judge valid
     * @throws FrameworkException the framework exception
     */
    public boolean isJudgeValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_JUDGE).isValid ();
    }

    /**
     * Gets the amount claimed.
     *
     * @return the amount claimed
     */
    public String getAmountClaimed ()
    {
        return cMB.getTextInputAdaptor (TEXT_AMOUNTCLAIMED).getValue ();
    }

    /**
     * Checks if is amount claimed read only.
     *
     * @return true, if is amount claimed read only
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountClaimedReadOnly () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_AMOUNTCLAIMED).isReadOnly ();
    }

    /**
     * Checks if is amount claimed enabled.
     *
     * @return true, if is amount claimed enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountClaimedEnabled () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_AMOUNTCLAIMED).isEnabled ();
    }

    /**
     * Gets the preferred court code.
     *
     * @return the preferred court code
     */
    public String getPreferredCourtCode ()
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).getValue ();
    }

    /**
     * Checks if is preferred court code read only.
     *
     * @return true, if is preferred court code read only
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtCodeReadOnly () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).isReadOnly ();
    }

    /**
     * Checks if is preferred court code enabled.
     *
     * @return true, if is preferred court code enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtCodeEnabled () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_CODE).isEnabled ();
    }

    /**
     * Checks if is preferred court name read only.
     *
     * @return true, if is preferred court name read only
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtNameReadOnly () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_NAME).isReadOnly ();
    }

    /**
     * Checks if is preferred court name enabled.
     *
     * @return true, if is preferred court name enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isPreferredCourtNameEnabled () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_PREFERREDCOURT_NAME).isEnabled ();
    }

    /**
     * Gets the track.
     *
     * @return the track
     */
    public String getTrack ()
    {
        return cMB.getSelectElementAdaptor (SEL_TRACK).getSelectedLabel ();
    }

    /**
     * Sets the track.
     *
     * @param pTrack the new track
     */
    public void setTrack (final String pTrack)
    {
        setSelectFieldValue (SEL_TRACK, pTrack);
    }

    /**
     * Checks if is track enabled.
     *
     * @return true, if is track enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isTrackEnabled () throws FrameworkException
    {
        return cMB.getSelectElementAdaptor (SEL_TRACK).isEnabled ();
    }

    /**
     * Gets the event id.
     *
     * @return the event id
     */
    public String getEventId ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_EVENT_ID);
        return tA.getValue ();
    }

    /**
     * Gets the subject number.
     *
     * @return the subject number
     */
    public String getSubjectNumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SUBJECT_NO);
        return tA.getValue ();
    }

    /**
     * Sets the event error flag.
     *
     * @param pChecked the new event error flag
     */
    public void setEventErrorFlag (final boolean pChecked)
    {
        setCheckboxFieldValue (CHK_ERROR_FLAG, pChecked);
        cMB.waitForPageToLoad ();
    }

    /**
     * Gets the subject type.
     *
     * @return the subject type
     */
    public String getSubjectType ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SUBJECT_TYPE);
        return tA.getValue ();
    }

    /**
     * Gets the subject name.
     *
     * @return the subject name
     */
    public String getSubjectName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SUBJECT_NAME);
        return tA.getValue ();
    }

    /**
     * Gets the applicant.
     *
     * @return the applicant
     */
    public String getApplicant ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_APPLICANT);
        return tA.getValue ();
    }

    /**
     * Gets the result.
     *
     * @return the result
     */
    public String getResult ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_RESULT);
        return tA.getValue ();
    }

    /**
     * Gets the event BMS task.
     *
     * @return the event BMS task
     */
    public String getEventBMSTask ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_EVENT_BMSTASK);
        return tA.getValue ();
    }

    /**
     * Gets the event description.
     *
     * @return the event description
     */
    public String getEventDescription ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_EVENT_DESCRIPTION);
        return tA.getValue ();
    }

    /**
     * Gets the event details.
     *
     * @return the event details
     */
    public String getEventDetails ()
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_EVENT_DETAILS);
        return zA.getText ();
    }

    /**
     * Gets the event receipt date.
     *
     * @return the event receipt date
     */
    public String getEventReceiptDate ()
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_EVENT_RECEIPT_DATE);
        return dA.getDate ();
    }

    /**
     * Gets the event date.
     *
     * @return the event date
     */
    public String getEventDate ()
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_EVENT_DATE);
        return dA.getDate ();
    }

    /**
     * Gets the created by.
     *
     * @return the created by
     */
    public String getCreatedBy ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CREATED_BY);
        return tA.getValue ();
    }

    /**
     * Selects a new event from the LOV Subform by clicking the LOV button, filtering
     * the Description column with the value supplied and double clicking the first row
     * available.
     *
     * @param eventDescription Event description to filter on
     */
    public void selectNewEventFromLOV (final String eventDescription)
    {
        clickLOVSelect (BTN_NEW_EVENT_LOV, POPUP_LOV_NEW_EVENT, "Description", eventDescription);
    }

    /**
     * Clicks the Save button in the status bar.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE_SCREEN);
    }

    /**
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR_SCREEN);
    }

    /**
     * Clicks the specified navigation button to navigate to another screen.
     *
     * @param navButtonId Identifier of the navigation button to be clicked
     */
    public void clickNavigationButton (final String navButtonId)
    {
        mClickButton (navButtonId);
    }

    /**
     * Resets the case status via the Reset Case Status subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void resetCaseStatus () throws FrameworkException
    {
        // Select Reset Case Status from quicklinks menu
        cMB.quickLinkNavigate (QUICKLINK_CASE_STATUS);
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();

        // COnfigure object
        if (null == resetCaseStatusSubform)
        {
            resetCaseStatusSubform = cMB.getSubFormAdaptor (POPUP_RESET_CASE_STATUS);
        }

        // Select ok to reset status
        if (null != resetCaseStatusSubform && resetCaseStatusSubform.isVisible ())
        {
            ((ButtonAdaptor) resetCaseStatusSubform.getAdaptor (BTN_RESET_CASE_STATUS_OK)).click ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Resets the case type via the Reset Case Type subform.
     *
     * @param newCaseType The New Case Type to set
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void resetCaseType (final String newCaseType) throws FrameworkException
    {
        // Select Reset Case Status from quicklinks menu
        cMB.quickLinkNavigate (QUICKLINK_CASE_TYPE);
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();

        // Configure object
        if (null == resetCaseTypeSubform)
        {
            resetCaseTypeSubform = cMB.getSubFormAdaptor (POPUP_RESET_CASE_TYPE);
        }

        // Set the new case type and click Ok
        if (null != resetCaseTypeSubform && resetCaseTypeSubform.isVisible ())
        {
            ((AutoCompleteAdaptor) resetCaseTypeSubform.getAdaptor (AUTO_NEW_CASE_TYPE)).setText (newCaseType);
            ((ButtonAdaptor) resetCaseTypeSubform.getAdaptor (BTN_RESET_CASE_TYPE_OK)).click ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Returns a value from the header parties grid.
     *
     * @param col Column index (starts from 1)
     * @param row Row index (starts from 1)
     * @return String representing the value in the grid cell specified
     */
    public String getPartiesHeaderGridValue (final int col, final int row)
    {
        return getValueFromGrid (GRID_PARTIES_HEADER, row, col);
    }

    /**
     * Selects a row in the events grid based upon a Row Number specified.
     *
     * @param rowNumber The row number to click (starts from 1)
     */
    public void selectCaseEventByRowNumber (final int rowNumber)
    {
        final GridAdaptor eventsGrid = cMB.getGridAdaptor (GRID_EXISTING_EVENTS);
        eventsGrid.clickRow (rowNumber);
    }

    /**
     * Selects the row in the events grid that matches the event id specified.
     *
     * @param pEventId The Event Id to search for
     */
    public void selectCaseEventByEventId (final String pEventId)
    {
        selectValueFromGrid (GRID_EXISTING_EVENTS, pEventId, 3);
    }

    /**
     * Selects the row in the events grid that matches the event id specified
     * and double click it.
     *
     * @param pEventId The Event Id to search for
     */
    public void doubleClickCaseEventByEventId (final String pEventId)
    {
        doubleClickValueFromGrid (GRID_EXISTING_EVENTS, pEventId, 3);
        cMB.waitForPageToLoad ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Sets the new event id.
     *
     * @param pEventId the new new event id
     */
    public void setNewEventId (final String pEventId)
    {
        setTextFieldValue (TEXT_NEW_EVENT_ID, pEventId);
    }

    /**
     * Checks if is new event id field valid.
     *
     * @return true, if is new event id field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewEventIdFieldValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_NEW_EVENT_ID).isValid ();
    }

    /**
     * Sets the cursor focus in the New Case Event Id field.
     */
    public void setNewCaseEventIdFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_NEW_EVENT_ID).focus ();
    }

    /**
     * Function opens the Add Case Event popup by entering a case event number
     * and clicking the Add button.
     *
     * @param pEventId The event id to open the popup with
     */
    public void openAddEventPopup (final String pEventId)
    {
        // Enter the event id and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_EVENT_ID, pEventId);
        mClickButton (BTN_ADD_NEW_EVENT);
    }

    /**
     * Sets the event subject.
     *
     * @param pSubject the new event subject
     */
    public void setEventSubject (final String pSubject)
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (TEXT_NEW_EVENT_SUBJECT);
        subjectField.setText (pSubject);
    }

    /**
     * Checks if is new event subject valid.
     *
     * @return true, if is new event subject valid
     * @throws FrameworkException the framework exception
     */
    public boolean isNewEventSubjectValid () throws FrameworkException
    {
        return cMB.getAutoCompleteAdaptor (TEXT_NEW_EVENT_SUBJECT).isValid ();
    }

    /**
     * Sets the cursor focus in the New Case Event Subject field.
     */
    public void setNewCaseSubjectFocus ()
    {
        cMB.getAutoCompleteAdaptor (TEXT_NEW_EVENT_SUBJECT).focus ();
    }

    /**
     * Selects a party in the instigator grid in the new event popup.
     *
     * @param pPartyName The name of the party to select in the grid
     */
    public void selectInstigatorParty (final String pPartyName)
    {
        selectValueFromGrid (GRID_NEWEVENT_INSTIGATOR, pPartyName, 3);
    }

    /**
     * Gets the event instigator label.
     *
     * @return the event instigator label
     */
    public String getEventInstigatorLabel ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NEW_EVENT_INSTIG_LABEL);
        return tA.getValue ();
    }

    /**
     * Sets the new event details.
     *
     * @param pDetails the new new event details
     */
    public void setNewEventDetails (final String pDetails)
    {
        final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (TEXT_NEW_EVENT_DETAILS);
        detailsField.setText (pDetails);
    }

    /**
     * Checks if is new event details mandatory.
     *
     * @return true, if is new event details mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isNewEventDetailsMandatory () throws FrameworkException
    {
        final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (TEXT_NEW_EVENT_DETAILS);
        return detailsField.isMandatory ();
    }

    /**
     * Sets the new event produce output.
     *
     * @param pTicked the new new event produce output
     */
    public void setNewEventProduceOutput (final boolean pTicked)
    {
        setCheckboxFieldValue (CHK_NEW_EVENT_PRODUCE_OUTPUT, pTicked);
    }

    /**
     * Clicks the Add Event Save Button in the Add Event popup.
     */
    public void clickAddEventSaveButton ()
    {
        cMB.clickButton (BTN_NEW_EVENT_SAVE);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the Add Event Cancel Button in the Add Event popup.
     */
    public void clickAddEventCancelButton ()
    {
        cMB.clickButton (BTN_NEW_EVENT_CANCEL);
        cMB.waitForPageToLoad ();
    }

    /**
     * Checks if is adds the event popup visible.
     *
     * @return true, if is adds the event popup visible
     */
    public boolean isAddEventPopupVisible ()
    {
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_EVENT);
        return addEventPopup.isVisible ();
    }

    /**
     * Function handles the creation of a new case event from raising the add event
     * popup, setting the correct fields, navigating to other screens and word processing.
     *
     * @param pNewEvent NewStandardEvent object with the event configuration
     * @param pQuestionList LinkedList of variable data screen questions
     * @throws Exception Thrown if any problems creating the event
     */
    public void addNewEvent (final NewStandardEvent pNewEvent, final LinkedList<VariableDataQuestion> pQuestionList) throws Exception
    {
        // Get the EventConfig object for the event passed in
        final EventManager eventConfigManager = EventManager.getInstance ();
        final EventConfig eventConfig = eventConfigManager.getEventConfig (pNewEvent.getEventId ());
        boolean wpNavigation;
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;
        final UC024MaintainWFTUtils myUC024MaintainWFTUtils;
        final UC003TransferCaseUtils myUC003TransferCaseUtils;
        final UC008MaintainHearingsUtils myUC008MaintainHearingsUtils;
        String pageTitle;

        // Enter the event id and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_EVENT_ID, pNewEvent.getEventId ());
        mClickButton (BTN_ADD_NEW_EVENT);

        // Check add event popup is raised
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_EVENT);
        if ( !addEventPopup.isVisible ())
        {
            throw new Exception ("Add Event Popup is not visible.");
        }

        // Handle the Details of Claim Popup
        if (eventConfig.getDetailsOfClaim ())
        {
            final PopupAdaptor detailsClaimPopup = cMB.getPopupAdaptor (POPUP_DETAILS_CLAIM);
            if (detailsClaimPopup.isVisible ())
            {
                // Click Close button in popup
                mClickButton (BTN_DETAILS_CLAIM_CLOSE);
            }
        }

        if (eventConfig.getHasSubject () && !pNewEvent.getSubjectParty ().equals (""))
        {
            // User must enter a subject
            if (pNewEvent.getSubjectParty ().equals ("CASE"))
            {
                // Subject is CASE, launch the Subject LOV Popup
                mClickButton (BTN_NEW_EVENT_SUBJECT_LOV);
                final PopupAdaptor subjectLOVPopup = cMB.getPopupAdaptor (POPUP_LOV_SUBJECT_FIELD);
                if (subjectLOVPopup.isVisible ())
                {
                    // Click Close button in popup
                    mClickButton (BTN_NEW_EVENT_SUBJECT_CASE);
                }
            }
            else
            {
                // Single party is the subject
                final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (TEXT_NEW_EVENT_SUBJECT);
                subjectField.setText (pNewEvent.getSubjectParty ());
            }
        }

        // Sometimes setting the subject field can produce a JavaScript alert dialogue
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        if (eventConfig.getHasInstigator () && !pNewEvent.getInstigatorParty ().equals (""))
        {
            // Set the instigator party
            selectInstigatorParty (pNewEvent.getInstigatorParty ());
        }

        if (eventConfig.getDetailsMandatory () || pNewEvent.getEventDetails ().equals (""))
        {
            // User must enter a value in the Details field
            final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_NEW_EVENT_DETAILS_LOV);
            if (bA.isEnabled () && pNewEvent.getEventDetails ().equals (""))
            {
                // Details field has LOV, open LOV and select first value in grid
                bA.click ();
                cMB.waitForPageToLoad ();
                final GridAdaptor detailsLOVGrid = cMB.getGridAdaptor (GRID_LOV_NEWEVENT_DETAILS);
                detailsLOVGrid.doubleClickRow (1);
                cMB.waitForPageToLoad ();
            }
            else
            {
                // No LOV, just set the field
                final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (TEXT_NEW_EVENT_DETAILS);
                detailsField.setText (pNewEvent.getEventDetails ());
            }
        }

        if (eventConfig.getProduceOutputEnabled ())
        {
            // Produce Output field enabled, set the checkbox accordingly
            setCheckboxFieldValue (CHK_NEW_EVENT_PRODUCE_OUTPUT, pNewEvent.getProduceOutputFlag ());
            wpNavigation = pNewEvent.getProduceOutputFlag ();
            if ( !pNewEvent.getProduceOutputFlag () && eventConfig.getOutputORProduced ())
            {
                // No WP output, but there is an OR output
                wpNavigation = true;
            }
        }
        else
        {
            // Produce Output field not enabled, but can still go to the Oracle Reports variable data
            wpNavigation = eventConfig.getVariableDataScreen ();
        }

        if (eventConfig.getLovOnSave () && !pNewEvent.getBypassBMSPopup ())
        {
            // Can expect to get an LOV raised when click Save the first time
            mClickButton (BTN_NEW_EVENT_SAVE);

            // Handle the BMS LOV Popup
            final PopupAdaptor bmsPopup = cMB.getPopupAdaptor (POPUP_LOV_BMS_OPTIONS);
            if (bmsPopup != null && bmsPopup.isVisible ())
            {
                // Select the first option in the BMS LOV Popup
                final GridAdaptor bmsLOVGrid = cMB.getGridAdaptor (GRID_LOV_BMS_OPTIONS);
                bmsLOVGrid.doubleClickRow (1);
                cMB.waitForPageToLoad ();
            }

            // Handle the Stats Mod LOV Popup
            final PopupAdaptor statsModPopup = cMB.getPopupAdaptor (POPUP_LOV_STATSMOD_OPTIONS);
            if (statsModPopup != null && statsModPopup.isVisible ())
            {
                // Select the first option in the Stats Mod LOV Popup
                final GridAdaptor statsLOVGrid = cMB.getGridAdaptor (GRID_LOV_STATSMOD_OPTIONS);
                statsLOVGrid.doubleClickRow (1);
                cMB.waitForPageToLoad ();
            }
        }

        // Set the Receipt and Event Date for the event
        if ( !pNewEvent.getReceiptDate ().equals (""))
        {
            final DatePickerAdaptor rDate = cMB.getDatePickerAdaptor (TEXT_NEW_EVENT_RECEIPT_DATE);
            rDate.setDate (pNewEvent.getReceiptDate ());
        }
        if ( !pNewEvent.getEventDate ().equals (""))
        {
            final DatePickerAdaptor eDate = cMB.getDatePickerAdaptor (TEXT_NEW_EVENT_EVENT_DATE);
            eDate.setDate (pNewEvent.getEventDate ());
        }

        // Click Save Button to add the event
        cMB.clickButton (BTN_NEW_EVENT_SAVE);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        // Handle Optional navigation to Obligations
        if (eventConfig.getObligationsOption ().equals ("OPTIONAL") && !pNewEvent.getNavigateObligations ())
        {
            cMB.chooseCancelOnNextConfirmation ();
        }
        else if (eventConfig.getObligationsOption ().equals ("OPTIONAL") && pNewEvent.getNavigateObligations ())
        {
            while (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }
        }

        if (eventConfig.getObligationsOption ().equals ("MANDATORY") || pNewEvent.getNavigateObligations ())
        {
            // Initialise the Obligations screen object
            myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (cMB);

            // Loop until are in Obligations screen
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                cMB.waitForPageToLoad ();
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }
                pageTitle = cMB.getPageTitle ();
            }

            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            if (myUC009MaintainObligationsUtils.isNewObligationPopupVisible ())
            {
                // New Obligation Popup raised
                // Set the Days field to the value passed in - will fail at this point if the expiry date falls
                // on a non working day
                myUC009MaintainObligationsUtils.handleAddObligationPopup ("7", pNewEvent.getObligationNotes ());

                // If not navigating to word processing, close screen to return to events
                pageTitle = cMB.getPageTitle ();
                if (pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()) &&
                        ( !wpNavigation || eventConfig.getNavWFT () || pNewEvent.getForceObligationExit ()))
                {
                    myUC009MaintainObligationsUtils.closeScreen ();
                }
            }
            else
            {
                // No New Obligation Popup, close screen
                myUC009MaintainObligationsUtils.closeScreen ();
            }
        }

        // Handle Navigation to the Maintain Window for Trial screen
        if (eventConfig.getNavWFT ())
        {
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            // Initialise the WFT screen object and exit
            myUC024MaintainWFTUtils = new UC024MaintainWFTUtils (cMB);

            // Loop until are in screen
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (myUC024MaintainWFTUtils.getScreenTitle ()))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }
            }

            myUC024MaintainWFTUtils.closeScreen ();
        }

        // Handle Navigation to the Transfer Cases screen (CCBC Cases only)
        if (pNewEvent.getCCBCCase () && eventConfig.getCCBCTransfer ())
        {
            // Initialise the WFT screen object and exit
            myUC003TransferCaseUtils = new UC003TransferCaseUtils (cMB);

            // Loop until are in screen
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (myUC003TransferCaseUtils.getScreenTitle ()))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            myUC003TransferCaseUtils.closeScreen ();
        }
        
        // Handle Navigation to the Maintain Hearings screen
        if ( eventConfig.getNavHearings() )
        {
            if ( cMB.isConfirmationPresent() )
            {
                cMB.getConfirmation();
            }
            
            // Initialise the WFT screen object and exit
            myUC008MaintainHearingsUtils = new UC008MaintainHearingsUtils(cMB);

            // Loop until are in screen
            pageTitle = cMB.getPageTitle();
            while ( !pageTitle.equals( myUC008MaintainHearingsUtils.getScreenTitle() ) )
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle();
                if ( cMB.isConfirmationPresent() )
                {
                    cMB.getConfirmation();
                }
            }

            myUC008MaintainHearingsUtils.closeScreen();
        }

        // Handle WP Navigation if the Produce Output checkbox is ticked or if the event
        // causes navigation to the variable data screen (Oracle Report events don't use the
        // Produce Output checkbox).
        if (wpNavigation)
        {
            // User performing Word Processing
            if (eventConfig.getVariableDataScreen ())
            {
                // Event wants to do WP and is navigating to the Variable Data screen
                // Loop until have arrived on the variable data screen
                pageTitle = cMB.getPageTitle ();
                while (pageTitle.indexOf (eventConfig.getVariableDataScreenTitle ()) == -1)
                {
                    cMB.waitForPageToLoad ();
                    pageTitle = cMB.getPageTitle ();
                }

                // When on variable data screen, deal with the question list passed in
                VariableDataQuestion vdQuestion;
                for (Iterator<VariableDataQuestion> i = pQuestionList.iterator (); i.hasNext ();)
                {
                    vdQuestion = (VariableDataQuestion) i.next ();
                    vdQuestion.setQuestionValue ();
                }

                // Click Save on the Variable Data screen
                mClickButton (VARIABLE_DATA_SAVE_BUTTON);
                if (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                    cMB.waitForPageToLoad ();
                }
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                    cMB.waitForPageToLoad ();
                }
            }

            // Non CCBC Case and output needs to go to the FCK Editor or CCBC case that needs to go the FCK Editor
            // and no CCBC specific rules preventing navigation to FCK Editor.
            if (!pNewEvent.getCCBCCase () && eventConfig.getFckEditor () ||
                    pNewEvent.getCCBCCase () && eventConfig.getFckEditor () && !eventConfig.getCCBCNoFckEditor ())
            {
                // Event wants to navigate to the WP FCK Editor screen
                pageTitle = cMB.getPageTitle ();
                while ( !pageTitle.equals (FCK_EDITOR_TITLE))
                {
                    cMB.waitForPageToLoad ();
                    pageTitle = cMB.getPageTitle ();
                }

                // The Final Output flag is unchecked by default, check it if specified
                if (pNewEvent.getOutputFinal ())
                {
                    final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
                    cA.click ();
                }

                // Click Ok/Cancel on FCK Editor screen
                if (pNewEvent.getCancelFCK ())
                {
                    mClickButton (FCK_EDITOR_CANCEL_BUTTON);
                }
                else
                {
                    mClickButton (FCK_EDITOR_OK_BUTTON);
                }
            }
        }

        // Loop until are back in Case Events screen
        pageTitle = cMB.getPageTitle ();
        while ( !pageTitle.equals (mScreenTitle))
        {
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }
    }
}