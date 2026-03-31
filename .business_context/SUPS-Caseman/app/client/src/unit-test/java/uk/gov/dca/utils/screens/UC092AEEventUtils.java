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
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Manage AE Events screen.
 *
 * Date: 09-Jun-2009
 */
public class UC092AEEventUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_AE_NUMBER. */
    public static final String ERR_MSG_INVALID_AE_NUMBER =
            "The AE Number entered does not match any recognised pattern.";
    
    /** The Constant ERR_MSG_MN_EVENT_ONLY. */
    public static final String ERR_MSG_MN_EVENT_ONLY =
            "Event only allowed for AE application type Maintenance Arrears.";
    
    /** The Constant ERR_MSG_PM_EVENT_ONLY. */
    public static final String ERR_MSG_PM_EVENT_ONLY =
            "Event only allowed for AE application type Priority Maintenance.";

    /** The text case number. */
    // Private Text Field Identifiers
    private String TEXT_CASE_NUMBER = "Query_CaseNumber";
    
    /** The text ae number. */
    private String TEXT_AE_NUMBER = "Query_AENumber";
    
    /** The text court code. */
    private String TEXT_COURT_CODE = "Query_OwningCourtCode";
    
    /** The text new event id. */
    private String TEXT_NEW_EVENT_ID = "Master_AEEventId";
    
    /** The zoom new event details. */
    private String ZOOM_NEW_EVENT_DETAILS = "AddEvent_Details";
    
    /** The sel new event issue stage. */
    private String SEL_NEW_EVENT_ISSUE_STAGE = "AddEvent_Stage";
    
    /** The sel new event service. */
    private String SEL_NEW_EVENT_SERVICE = "AddEvent_Service";
    
    /** The text new event bailiff. */
    private String TEXT_NEW_EVENT_BAILIFF = "AddEvent_BailiffId";
    
    /** The text existing event id. */
    private String TEXT_EXISTING_EVENT_ID = "EventDetails_EventId";
    
    /** The zoom existing event details. */
    private String ZOOM_EXISTING_EVENT_DETAILS = "EventDetails_Details";
    
    /** The chk error flag. */
    private String CHK_ERROR_FLAG = "EventDetails_ErrorFlag";

    /** The sel existing event service. */
    private String SEL_EXISTING_EVENT_SERVICE = "EventDetails_Service";

    /** The btn search ae. */
    // Private Button Field Identifiers
    private String BTN_SEARCH_AE = "Query_SearchButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn add event. */
    private String BTN_ADD_EVENT = "Master_AddAEEventButton";
    
    /** The btn new event details lov. */
    private String BTN_NEW_EVENT_DETAILS_LOV = "AddEvent_DetailsLOVButton";
    
    /** The btn new event save. */
    private String BTN_NEW_EVENT_SAVE = "AddEvent_SaveButton";
    
    /** The btn new event cancel. */
    private String BTN_NEW_EVENT_CANCEL = "AddEvent_CancelButton";

    /** The grid master events. */
    // Private grid identifiers
    private String GRID_MASTER_EVENTS = "Master_AEEventGrid";
    
    /** The grid lov newevent details. */
    private String GRID_LOV_NEWEVENT_DETAILS = "AddEvent_DetailsLOVGrid_grid";

    /** The popup add event. */
    // Private Popup adaptor Identifiers
    private String POPUP_ADD_EVENT = "AddEvent_Popup";

    /** The Constant BTN_NAV_AE_SCREEN. */
    // Static variables representing the Navigation Buttons
    public static final String BTN_NAV_AE_SCREEN = "NavBar_AEButton";
    
    /** The Constant BTN_NAV_CASES_SCREEN. */
    public static final String BTN_NAV_CASES_SCREEN = "NavBar_CasesButton";
    
    /** The Constant BTN_NAV_EVENTS_SCREEN. */
    public static final String BTN_NAV_EVENTS_SCREEN = "NavBar_CaseEventsButton";
    
    /** The Constant BTN_NAV_PER_SCREEN. */
    public static final String BTN_NAV_PER_SCREEN = "NavBar_PERCalculatorButton";
    
    /** The Constant BTN_NAV_QUERY_SCREEN. */
    public static final String BTN_NAV_QUERY_SCREEN = "NavBar_QueryButton";

    /** The Constant QUICKLINK_TRANSFER_CASE. */
    // Static variables representing the Additional Navigation Quicklinks
    public static final String QUICKLINK_TRANSFER_CASE = "Transfer Case";
    
    /** The Constant QUICKLINK_VIEW_PAYMENTS. */
    public static final String QUICKLINK_VIEW_PAYMENTS = "View Payments";
    
    /** The Constant QUICKLINK_HEARINGS. */
    public static final String QUICKLINK_HEARINGS = "Hearings";
    
    /** The Constant QUICKLINK_PER. */
    public static final String QUICKLINK_PER = "PER Report";
    
    /** The Constant QUICKLINK_OBLIGATIONS. */
    public static final String QUICKLINK_OBLIGATIONS = "Active Obligations";
    
    /** The Constant QUICKLINK_AE_FEES. */
    public static final String QUICKLINK_AE_FEES = "Maintain Fees/Refunds";

    /** The Constant ISSUE_STAGE_ISSUE. */
    // Static constants for the Issue Stages
    public static final String ISSUE_STAGE_ISSUE = "ISSUE";
    
    /** The Constant ISSUE_STAGE_REISSUE. */
    public static final String ISSUE_STAGE_REISSUE = "REISSUE";
    
    /** The Constant ISSUE_STAGE_SUBSERVICE. */
    public static final String ISSUE_STAGE_SUBSERVICE = "SUBSTITUTED SERVICE";

    /** The Constant SERVICE_STATUS_BAILIFF. */
    // Static constants for the Service Statuses
    public static final String SERVICE_STATUS_BAILIFF = "BAILIFF";
    
    /** The Constant SERVICE_STATUS_POSTAL. */
    public static final String SERVICE_STATUS_POSTAL = "POSTAL";
    
    /** The Constant SERVICE_STATUS_PERSONAL. */
    public static final String SERVICE_STATUS_PERSONAL = "PERSONAL";
    
    /** The Constant SERVICE_STATUS_NOTSERVED. */
    public static final String SERVICE_STATUS_NOTSERVED = "NOT SERVED";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC092AEEventUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Enter/Query AE Events";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        setTextFieldValue (TEXT_CASE_NUMBER, pCaseNumber);
    }

    /**
     * Gets the case number field value.
     *
     * @return the case number field value
     */
    public String getCaseNumberFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Checks if is case number valid.
     *
     * @return true, if is case number valid
     * @throws Exception the exception
     */
    public boolean isCaseNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Case Number field.
     */
    public void setCaseNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_CASE_NUMBER).focus ();
    }

    /**
     * Sets the AE number.
     *
     * @param pAENumber the new AE number
     */
    public void setAENumber (final String pAENumber)
    {
        setTextFieldValue (TEXT_AE_NUMBER, pAENumber);
    }

    /**
     * Gets the AE number field value.
     *
     * @return the AE number field value
     */
    public String getAENumberFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Checks if is AE number valid.
     *
     * @return true, if is AE number valid
     * @throws Exception the exception
     */
    public boolean isAENumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the AE Number field.
     */
    public void setAENumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_AE_NUMBER).focus ();
    }

    /**
     * Gets the owning court field value.
     *
     * @return the owning court field value
     */
    public String getOwningCourtFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_COURT_CODE);
        return tA.getValue ();
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
     * Sets the master event id.
     *
     * @param pEventId the new master event id
     */
    public void setMasterEventId (final String pEventId)
    {
        setTextFieldValue (TEXT_NEW_EVENT_ID, pEventId);
    }

    /**
     * Sets focus in the Event Id field.
     */
    public void setFocusInMasterEventId ()
    {
        cMB.setFocus (TEXT_NEW_EVENT_ID);
    }

    /**
     * Checks if is master event id valid.
     *
     * @return true, if is master event id valid
     * @throws Exception the exception
     */
    public boolean isMasterEventIdValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NEW_EVENT_ID);
        return tA.isValid ();
    }

    /**
     * Gets the event id field value.
     *
     * @return the event id field value
     */
    public String getEventIdFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_EXISTING_EVENT_ID);
        return tA.getValue ();
    }

    /**
     * Gets the existing event details.
     *
     * @return the existing event details
     */
    public String getExistingEventDetails ()
    {
        final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (ZOOM_EXISTING_EVENT_DETAILS);
        return detailsField.getText ();
    }

    /**
     * Sets the existing event details.
     *
     * @param pDetails the new existing event details
     */
    public void setExistingEventDetails (final String pDetails)
    {
        final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (ZOOM_EXISTING_EVENT_DETAILS);
        detailsField.setText (pDetails);
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
     * Selects the row in the master AE Events grid that matches the Event Id specified.
     *
     * @param pEventId The Event Id to search for
     */
    public void selectGridRowByEventId (final String pEventId)
    {
        selectValueFromGrid (GRID_MASTER_EVENTS, pEventId, 3);
    }

    /**
     * Selects the row in the events grid that matches the event id specified
     * and double click it.
     *
     * @param pEventId The Event Id to search for
     */
    public void doubleClickAEEventByEventId (final String pEventId)
    {
        doubleClickValueFromGrid (GRID_MASTER_EVENTS, pEventId, 3);
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
     * Enters the case number specified and tabs off the field (assumes that focus is already
     * set on the Case Number field to trigger onChange event) and clicks Search Button
     * to load the desired record.
     *
     * @param caseNumber The identifier of the Case linked to the AE to be loaded
     */
    public void loadAEByCaseNumber (final String caseNumber)
    {
        setTextFieldValue (TEXT_CASE_NUMBER, caseNumber);
        setTextFieldValue (TEXT_COURT_CODE, "");
        mClickButton (BTN_SEARCH_AE);

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Enters the AE number specified and tabs off the field (assumes that focus is already
     * set on the AE Number field to trigger onChange event) and clicks Search Button
     * to load the desired record.
     *
     * @param aeNumber The identifier of the AE record to be loaded
     */
    public void loadAEByAENumber (final String aeNumber)
    {
        setTextFieldValue (TEXT_AE_NUMBER, aeNumber);
        mClickButton (BTN_SEARCH_AE);

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Add Event button to launch the Add AE Event popup.
     */
    public void clickAddEventButton ()
    {
        mClickButton (BTN_ADD_EVENT);

        // Loop through any alerts
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save button on the Add AE Event popup.
     */
    public void clickSaveNewEventButton ()
    {
        mClickButton (BTN_NEW_EVENT_SAVE);
    }

    /**
     * Clicks the Add Event Cancel Button in the Add Event popup.
     */
    public void clickAddEventCancelButton ()
    {
        mClickButton (BTN_NEW_EVENT_CANCEL);
    }

    /**
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR_SCREEN);
    }

    /**
     * Clicks the Save Screen Button.
     */
    public void saveScreen ()
    {
        mClickButton (BTN_SAVE_SCREEN);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the specified navigation button to navigate to another screen.
     *
     * @param navButtonId String identifier of the navigation button to click
     */
    public void clickNavigationButton (final String navButtonId)
    {
        mClickButton (navButtonId);
    }

    /**
     * Clicks the Case Events button to navigate to Case Events screen.
     */
    public void clickCaseEventsButton ()
    {
        mClickButton (BTN_NAV_EVENTS_SCREEN);
    }

    /**
     * Function sets the Service Status of the currently selected AE Event to NOT SERVED.
     * This will then navigate to a variable data screen where a Notice of Non Service
     * is produced before returning to the AE Events screen.
     *
     * @throws FrameworkException Thrown if cannot find the select element adaptor
     */
    public void markEventAsNotServed () throws FrameworkException
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_EXISTING_EVENT_SERVICE);
        if (sA.isEnabled ())
        {
            // Set the Service Status field to NOT SERVED if field enabled
            sA.clickLabel (UC092AEEventUtils.SERVICE_STATUS_NOTSERVED);

            // Setup the variable data screen questions
            final LinkedList<VariableDataQuestion> notifNotServedQuestions = new LinkedList<> ();
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ReasonOfNonService",
                    VariableDataQuestion.VD_FIELD_TYPE_ZOOM, "CASEMAN IS GREAT.", cMB);
            notifNotServedQuestions.add (vdQ1);

            // Loop until have arrived on the variable data screen
            String pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf ("Notification of Non-Service") == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // When on variable data screen, deal with the question list provided in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = notifNotServedQuestions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);

            // Loop until are back in AE Events screen
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (mScreenTitle))
            {
                if (cMB.isAlertPresent ())
                {
                    cMB.getAlert ();
                }

                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }

                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }
        }

    }

    /**
     * Function opens the Add AE Event popup by entering a case event number
     * and clicking the Add button.
     *
     * @param pEventId The event id to open the popup with
     */
    public void openAddEventPopup (final String pEventId)
    {
        // Enter the event id and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_EVENT_ID, pEventId);
        mClickButton (BTN_ADD_EVENT);
    }

    /**
     * Adds the new event.
     *
     * @param pNewEvent the new event
     * @param pQuestionList the question list
     * @throws Exception the exception
     */
    public void addNewEvent (final NewStandardEvent pNewEvent, final LinkedList<VariableDataQuestion> pQuestionList) throws Exception
    {
        // Get the EventConfig object for the event passed in
        final EventManager eventConfigManager = EventManager.getInstance ();
        final EventConfig eventConfig = eventConfigManager.getEventConfig (pNewEvent.getEventId ());
        boolean wpNavigation = false;
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

        // Enter the event id and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_EVENT_ID, pNewEvent.getEventId ());
        mClickButton (BTN_ADD_EVENT);

        // Loop through any alerts
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        // Check add event popup is raised
        cMB.waitForPageToLoad();
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_EVENT);
        if ( !addEventPopup.isVisible ())
        {
            throw new Exception ("Add AE Event Popup is not visible.");
        }

        if (eventConfig.getHasIssueStage ())
        {
            // Set the Issue Stage field which will enable the Service Status field and populate
            // with a default value (usually either BAILIFF or POSTAL)
            final SelectElementAdaptor isA = cMB.getSelectElementAdaptor (SEL_NEW_EVENT_ISSUE_STAGE);
            isA.clickLabel (pNewEvent.getIssueStage ());

            final SelectElementAdaptor ssA = cMB.getSelectElementAdaptor (SEL_NEW_EVENT_SERVICE);
            if (pNewEvent.getServiceStatus ().length () > 0)
            {
                // User specified a Service Status other than the default, set the field
                ssA.clickLabel (pNewEvent.getServiceStatus ());
            }

            if (ssA.getSelectedValue ().equals (SERVICE_STATUS_BAILIFF) && pNewEvent.getBailiffId ().length () > 0)
            {
                // Service Status is set to BAILIFF and user has specified a Bailiff Id, set the field
                setTextFieldValue (TEXT_NEW_EVENT_BAILIFF, pNewEvent.getBailiffId ());
            }
        }

        if (eventConfig.getDetailsMandatory () || !pNewEvent.getEventDetails ().equals (""))
        {
            // User must enter a value in the Details field
            final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_NEW_EVENT_DETAILS_LOV);
            if (bA.isEnabled ())
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
                final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (ZOOM_NEW_EVENT_DETAILS);
                detailsField.setText (pNewEvent.getEventDetails ());
            }
        }

        if (eventConfig.getVariableDataScreen () || eventConfig.getFckEditor ())
        {
            wpNavigation = true;
        }

        // Click Save Button to add the event
        cMB.clickButton (BTN_NEW_EVENT_SAVE);
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
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

        // Handle mandatory navigation to Obligations screen
        if (eventConfig.getObligationsOption ().equals ("MANDATORY") || pNewEvent.getNavigateObligations ())
        {
            // Initialise the Obligations screen object
            myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils (cMB);

            // Loop until are in Obligations screen
            String pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (myUC009MaintainObligationsUtils.getScreenTitle ()))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            if (myUC009MaintainObligationsUtils.isNewObligationPopupVisible ())
            {
                // New Obligation Popup raised
                // Set the Days field to the value passed in - will fail at this point if the expiry date falls
                // on a non working day
                myUC009MaintainObligationsUtils.handleAddObligationPopup ("7", "NOTES");

                // If not navigating to word processing, close screen to return to events
                if ( !wpNavigation)
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

        // Handle WP Navigation if the event causes navigation to the variable data screen or FCK Editor
        if (wpNavigation)
        {
            // User performing Word Processing
            if (eventConfig.getVariableDataScreen ())
            {
                // Event wants to do WP and is navigating to the Variable Data screen
                // Loop until have arrived on the variable data screen
                String pageTitle = cMB.getPageTitle ();
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
            }

            if (eventConfig.getFckEditor ())
            {
                // Event wants to navigate to the WP FCK Editor screen
                String pageTitle = cMB.getPageTitle ();
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

                // Click Ok on FCK Editor screen
                mClickButton (FCK_EDITOR_OK_BUTTON);
            }
        }

        // Loop until are back in AE Events screen
        String pageTitle = cMB.getPageTitle ();
        while ( !pageTitle.equals (mScreenTitle))
        {
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }

            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }

    }

}