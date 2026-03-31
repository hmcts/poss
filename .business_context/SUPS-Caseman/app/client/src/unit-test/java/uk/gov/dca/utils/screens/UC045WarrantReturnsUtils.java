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
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Warrant Returns screen.
 *
 * Date: 07-Sep-2009
 */
public class UC045WarrantReturnsUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_WARRANT_NUMBER. */
    public static final String ERR_MSG_INVALID_WARRANT_NUMBER =
            "The warrant number entered does not match a valid format.";
    
    /** The Constant ERR_MSG_INVALID_LCL_WARRANT_NUMBER. */
    public static final String ERR_MSG_INVALID_LCL_WARRANT_NUMBER =
            "The local warrant number entered does not match a valid format.";

    /** The text case number. */
    // Private Text Field Identifiers
    private String TEXT_CASE_NUMBER = "Header_CaseNumber_Txt";
    
    /** The text ex court code. */
    private String TEXT_EX_COURT_CODE = "Header_ExecutingCourtId_Txt";
    
    /** The text warrant number. */
    private String TEXT_WARRANT_NUMBER = "Header_WarrantNumber_Txt";
    
    /** The text local number. */
    private String TEXT_LOCAL_NUMBER = "Header_LocalNumber_Txt";
    
    /** The text co number. */
    private String TEXT_CO_NUMBER = "Header_CO_Txt";
    
    /** The text new return id. */
    private String TEXT_NEW_RETURN_ID = "Details_ReturnCode_Txt";
    
    /** The zoom new return details. */
    private String ZOOM_NEW_RETURN_DETAILS = "Add_AdditionalDetails_Txt";
    
    /** The chk new return notice. */
    private String CHK_NEW_RETURN_NOTICE = "Add_Notice_Check";
    
    /** The sel new return party against. */
    private String SEL_NEW_RETURN_PARTY_AGAINST = "Add_Defendant_Sel";
    
    /** The date new return appointment date. */
    private String DATE_NEW_RETURN_APPOINTMENT_DATE = "Add_Appointment_Date";
    
    /** The text new return appointment time. */
    private String TEXT_NEW_RETURN_APPOINTMENT_TIME = "Add_AppointmentTime_Txt";
    
    /** The chk error flag. */
    private String CHK_ERROR_FLAG = "Details_Error_Check";
    
    /** The zoom return description. */
    private String ZOOM_RETURN_DESCRIPTION = "Details_Return_Txt";

    /** The btn search warrants. */
    // Private Button Field Identifiers
    private String BTN_SEARCH_WARRANTS = "Header_Search_Btn";
    
    /** The btn add return. */
    private String BTN_ADD_RETURN = "Details_AddReturn_Btn";
    
    /** The btn new return save. */
    private String BTN_NEW_RETURN_SAVE = "Add_Save_Btn";
    
    /** The btn new event cancel. */
    private String BTN_NEW_EVENT_CANCEL = "Add_Cancel_Btn";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_Clear_Btn";
    
    /** The btn run warrant returns report. */
    private String BTN_RUN_WARRANT_RETURNS_REPORT = "NavBar_WarrantReturnsReportButton";
    
    /** The m BT N CLOS E SCREEN. */
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn"; // Overwrites the base class close screen button

    /** The popup add return. */
    // Private Popup adaptor Identifiers
    private String POPUP_ADD_RETURN = "Warrant_Returns_Popup";
    
    /** The popup progress ind. */
    private String POPUP_PROGRESS_IND = "ProgressBar_SubForm";
    
    /** The ora popup progress ind. */
    private String ORA_POPUP_PROGRESS_IND = "ProgressIndicator_Popup";
    
    /** The popup lov search. */
    private String POPUP_LOV_SEARCH = "SearchResultsLOVGrid";

    /** The grid master events. */
    // Private grid identifiers
    private String GRID_MASTER_EVENTS = "Details_Results_Grid";
    
    /** The grid lov search. */
    private String GRID_LOV_SEARCH = "SearchResultsLOVGrid_grid";

    /** The Constant BTN_NAV_WARRANTS_SCREEN. */
    // Static variables representing the Navigation Buttons
    public static final String BTN_NAV_WARRANTS_SCREEN = "NavBar_MaintainWarrantsButton";
    
    /** The Constant BTN_NAV_REISSUE_SCREEN. */
    public static final String BTN_NAV_REISSUE_SCREEN = "NavBar_ReissueButton";
    
    /** The Constant BTN_NAV_CASE_EVENTS_SCREEN. */
    public static final String BTN_NAV_CASE_EVENTS_SCREEN = "NavBar_ManageEventsButton";
    
    /** The Constant BTN_NAV_VIEW_PAYMENTS_SCREEN. */
    public static final String BTN_NAV_VIEW_PAYMENTS_SCREEN = "NavBar_ViewPaymentsButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC045WarrantReturnsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Warrant Returns";
    }

    /**
     * Sets the executing court code.
     *
     * @param pCourtCode the new executing court code
     */
    public void setExecutingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_EX_COURT_CODE, pCourtCode);
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
     * Sets the CO number.
     *
     * @param pCONumber the new CO number
     */
    public void setCONumber (final String pCONumber)
    {
        setTextFieldValue (TEXT_CO_NUMBER, pCONumber);
    }

    /**
     * Sets the warrant number.
     *
     * @param pWarrantNumber the new warrant number
     */
    public void setWarrantNumber (final String pWarrantNumber)
    {
        setTextFieldValue (TEXT_WARRANT_NUMBER, pWarrantNumber);
    }

    /**
     * Checks if is warrant number valid.
     *
     * @return true, if is warrant number valid
     * @throws Exception the exception
     */
    public boolean isWarrantNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_WARRANT_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Warrant Number field.
     */
    public void setWarrantNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_WARRANT_NUMBER).focus ();
    }

    /**
     * Sets the local number.
     *
     * @param pLocalNumber the new local number
     */
    public void setLocalNumber (final String pLocalNumber)
    {
        setTextFieldValue (TEXT_LOCAL_NUMBER, pLocalNumber);
    }

    /**
     * Gets the local number.
     *
     * @return the local number
     */
    public String getLocalNumber ()
    {
        return cMB.getTextInputAdaptor (TEXT_LOCAL_NUMBER).getValue ();
    }

    /**
     * Sets the cursor focus in the Local Warrant Number field.
     */
    public void setLocalNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_LOCAL_NUMBER).focus ();
    }

    /**
     * Checks if is local number valid.
     *
     * @return true, if is local number valid
     * @throws Exception the exception
     */
    public boolean isLocalNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_LOCAL_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the new return code.
     *
     * @param pReturnCode the new new return code
     */
    public void setNewReturnCode (final String pReturnCode)
    {
        setTextFieldValue (TEXT_NEW_RETURN_ID, pReturnCode);
    }

    /**
     * Sets the cursor focus in the New Return Code field.
     */
    public void setNewReturnCodeFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_NEW_RETURN_ID).focus ();
    }

    /**
     * Checks if is new return code valid.
     *
     * @return true, if is new return code valid
     * @throws Exception the exception
     */
    public boolean isNewReturnCodeValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_NEW_RETURN_ID);
        return tA.isValid ();
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
     * Determines if the Error field is enabled or not
     * @return true if enabled, else false
     * @throws Exception Thrown if problem determining the enablement
     */
    public boolean isErrorFlagEnabled() throws Exception
    {
    	final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor(CHK_ERROR_FLAG);
    	return cA.isEnabled();
    }
    
    /**
     * Gets the return code description.
     *
     * @return the return code description
     */
    public String getReturnCodeDescription ()
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_RETURN_DESCRIPTION);
        return zA.getText ();
    }

    /**
     * Clicks the Search button to load a warrant record
     * TO DO - Handle the popup for multiple matching warrant records.
     */
    public void clickSearchButton ()
    {
        mClickButton (BTN_SEARCH_WARRANTS);
    }

    /**
     * Handles the search results popup (if multiple warrant records found) by double clicking a particular row to
     * load that record.
     *
     * @param rowId The row id to double click (start from 1)
     */
    public void doubleClickSearchPopupRow (final int rowId)
    {
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (POPUP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            // Multiple enforcements returned and displayed in a popup, select the enforcement number requested
            final GridAdaptor resultsGrid = cMB.getGridAdaptor (GRID_LOV_SEARCH);
            resultsGrid.doubleClickRow (rowId);
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Function opens the Add Warrant Return popup by entering an event id
     * and clicking the Add button.
     *
     * @param pEventId The event id to open the popup with
     */
    public void openAddEventPopup (final String pEventId)
    {
        // Enter the event id and click the add button to launch the popup
        setNewReturnCode (pEventId);
        mClickButton (BTN_ADD_RETURN);
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
        cMB.getButtonAdaptor (BTN_CLEAR_SCREEN).click ();
        while (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button.
     */
    public void closeScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

    /**
     * Selects the row in the master Warrant Returns grid that matches the Event Id specified.
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
    public void doubleClickWarrantReturnByCode (final String pEventId)
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
     * Runs the Warrant Returns Report button from the navigation bar.
     */
    public void runWarrantReturnsReport ()
    {
        mClickButton (BTN_RUN_WARRANT_RETURNS_REPORT);

        // Handle the oracle report progress bar popup
        final PopupAdaptor progressPopup = cMB.getPopupAdaptor (ORA_POPUP_PROGRESS_IND);

        // Loop until popup loads
        boolean popupVisible = progressPopup.isVisible ();
        while ( !popupVisible)
        {
            cMB.waitForPageToLoad ();
            popupVisible = progressPopup.isVisible ();
        }

        // Loop until popup has closed
        popupVisible = progressPopup.isVisible ();
        while (popupVisible)
        {
            cMB.waitForPageToLoad ();
            popupVisible = progressPopup.isVisible ();
        }
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

        // Enter the return code and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_RETURN_ID, pNewEvent.getWarrantReturnCode ());
        mClickButton (BTN_ADD_RETURN);

        // Check add event popup is raised
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_RETURN);
        if ( !addEventPopup.isVisible ())
        {
            throw new Exception ("Add Warrant Return Popup is not visible.");
        }

        // Check if the Details field is mandatory and set if it is
        if (eventConfig.getDetailsMandatory ())
        {
            final ZoomFieldAdaptor detailsField = cMB.getZoomFieldAdaptor (ZOOM_NEW_RETURN_DETAILS);
            detailsField.setText (pNewEvent.getEventDetails ());
        }

        // Check if Notice field is editable, set the value accordingly
        if (eventConfig.getHasNotice ())
        {
            setCheckboxFieldValue (CHK_NEW_RETURN_NOTICE, pNewEvent.getCheckNotice ());
        }

        // Check the Party Against field. If one party against on warrant, will be automatically
        // populated, but if two parties on the warrant, will be blank so must select one.
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_NEW_RETURN_PARTY_AGAINST);
        if (sA.getSelectedValue ().equals (""))
        {
            sA.clickLabel (pNewEvent.getSubjectParty ());
        }

        // Check if the Appointment Date and Appointment Time fields are editable and set accordingly
        if (eventConfig.getHasAppointment ())
        {
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_NEW_RETURN_APPOINTMENT_DATE);
            dA.setDate (pNewEvent.getAppointmentDate ());

            setTextFieldValue (TEXT_NEW_RETURN_APPOINTMENT_TIME, pNewEvent.getAppointmentTime ());
        }

        if (eventConfig.getVariableDataScreen () || eventConfig.getFckEditor ())
        {
            wpNavigation = true;
        }

        // Click Save Button to add the event
        cMB.clickButton (BTN_NEW_RETURN_SAVE);
        cMB.waitForPageToLoad ();

        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        // Handle WP Navigation if the event causes navigation to the variable data screen or FCK Editor
        if (wpNavigation)
        {
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }
            cMB.waitForPageToLoad ();

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
            }

            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }
            cMB.waitForPageToLoad ();

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
        else if ( !wpNavigation && eventConfig.getOutputProduced ())
        {
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            // Output will be produced but no navigation
            final SubFormAdaptor progressPopup = cMB.getSubFormAdaptor (POPUP_PROGRESS_IND);

            // Loop until popup loads
            int tries = 1;
            boolean popupVisible = progressPopup.isVisible ();
            while ( !popupVisible)
            {
                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
                tries++;
                if (tries == 5)
                {
                    popupVisible = true;
                }
            }

            // Loop until popup has closed, checking for confirm
            tries = 1;
            popupVisible = progressPopup.isVisible ();
            while (popupVisible)
            {
                cMB.waitForPageToLoad ();
                if (cMB.isConfirmationPresent ())
                {
                    cMB.getConfirmation ();
                }

                popupVisible = progressPopup.isVisible ();
                tries++;
                if (tries == 5)
                {
                    popupVisible = false;
                }
            }

            cMB.waitForPageToLoad ();
        }

        // Loop until are back in Warrant Returns screen
        String pageTitle = cMB.getPageTitle ();
        while ( !pageTitle.equals (mScreenTitle))
        {
            if (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }
        cMB.waitForPageToLoad ();
    }

}