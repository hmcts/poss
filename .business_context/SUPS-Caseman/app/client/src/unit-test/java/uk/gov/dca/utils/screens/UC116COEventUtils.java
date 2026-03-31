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
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Manage CO Events screen.
 *
 * Date: 04-Sep-2009
 */
public class UC116COEventUtils extends AbstractBaseScreenUtils
{
    
    /** The text co number. */
    // Private Text Field Identifiers
    private String TEXT_CO_NUMBER = "Query_CONumber";
    
    /** The text court code. */
    private String TEXT_COURT_CODE = "Query_OwningCourtCode";
    
    /** The text new event id. */
    private String TEXT_NEW_EVENT_ID = "Master_COEventId";
    
    /** The zoom event details. */
    private String ZOOM_EVENT_DETAILS = "EventDetails_Details";
    
    /** The zoom new event details. */
    private String ZOOM_NEW_EVENT_DETAILS = "AddEvent_Details";
    
    /** The sel new event issue stage. */
    private String SEL_NEW_EVENT_ISSUE_STAGE = "AddEvent_Stage";
    
    /** The sel new event service. */
    private String SEL_NEW_EVENT_SERVICE = "AddEvent_Service";
    
    /** The text new event bailiff. */
    private String TEXT_NEW_EVENT_BAILIFF = "AddEvent_BailiffId";
    
    /** The auto new event creditor. */
    private String AUTO_NEW_EVENT_CREDITOR = "AddEvent_CreditorName";
    
    /** The chk error flag. */
    private String CHK_ERROR_FLAG = "EventDetails_ErrorFlag";

    /** The btn search co. */
    // Private Button Field Identifiers
    private String BTN_SEARCH_CO = "Query_SearchButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn add event. */
    private String BTN_ADD_EVENT = "Master_AddCOEventButton";
    
    /** The btn new event details lov. */
    private String BTN_NEW_EVENT_DETAILS_LOV = "AddEvent_DetailsLOVButton";
    
    /** The btn new event save. */
    private String BTN_NEW_EVENT_SAVE = "AddEvent_SaveButton";

    /** The grid co events. */
    // Private grid identifiers
    private String GRID_CO_EVENTS = "Master_COEventGrid";
    
    /** The grid lov newevent details. */
    private String GRID_LOV_NEWEVENT_DETAILS = "AddEvent_DetailsLOVGrid_grid";

    /** The popup add event. */
    // Private Popup adaptor Identifiers
    private String POPUP_ADD_EVENT = "AddEvent_Popup";

    /** The Constant BTN_NAV_CO_SCREEN. */
    // Static variables representing the Navigation Buttons
    public static final String BTN_NAV_CO_SCREEN = "NavBar_MaintainCOButton";
    
    /** The Constant BTN_NAV_VIEW_CREDITORS_SCREEN. */
    public static final String BTN_NAV_VIEW_CREDITORS_SCREEN = "NavBar_ViewCreditorsButton";
    
    /** The Constant BTN_NAV_VIEW_PAYMENTS_SCREEN. */
    public static final String BTN_NAV_VIEW_PAYMENTS_SCREEN = "NavBar_ViewPaymentsButton";
    
    /** The Constant BTN_NAV_VIEW_DIVIDENDS_SCREEN. */
    public static final String BTN_NAV_VIEW_DIVIDENDS_SCREEN = "NavBar_ViewDividendsButton";
    
    /** The Constant BTN_NAV_QUERY_SCREEN. */
    public static final String BTN_NAV_QUERY_SCREEN = "NavBar_QueryButton";

    /** The Constant QUICKLINK_DOM_CALCULATOR. */
    // Static variables representing the Additional Navigation Quicklinks
    public static final String QUICKLINK_DOM_CALCULATOR = "DoM Calculator";
    
    /** The Constant QUICKLINK_PER_CALCULATOR. */
    public static final String QUICKLINK_PER_CALCULATOR = "PER Calculator";
    
    /** The Constant QUICKLINK_HEARINGS. */
    public static final String QUICKLINK_HEARINGS = "Hearings";
    
    /** The Constant QUICKLINK_WARRANTS. */
    public static final String QUICKLINK_WARRANTS = "Warrants";
    
    /** The Constant QUICKLINK_WARRANT_RETURNS. */
    public static final String QUICKLINK_WARRANT_RETURNS = "Warrant Returns";

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
    public UC116COEventUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create/Maintain CO Events";
    }

    /**
     * Gets the CO number field value.
     *
     * @return the CO number field value
     */
    public String getCONumberFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CO_NUMBER);
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
     * Enters the CO number specified and tabs off the field then clicks Search Button
     * to load the desired record.
     *
     * @param coNumber The identifier of the Consolidated Order to be loaded
     */
    public void loadCOByCONumber (final String coNumber)
    {
        setTextFieldValue (TEXT_CO_NUMBER, coNumber);
        mClickButton (BTN_SEARCH_CO);
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Enters the CO number and Owning Court specified and then clicks Search Button
     * to load the desired record.
     *
     * @param coNumber The identifier of the Consolidated Order to be loaded
     * @param courtCode The court code of the Consolidated Order to be loaded
     */
    public void loadCOByCONumberAndCourt (final String coNumber, final String courtCode)
    {
        setTextFieldValue (TEXT_CO_NUMBER, coNumber);
        setTextFieldValue (TEXT_COURT_CODE, courtCode);
        mClickButton (BTN_SEARCH_CO);
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
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
     * Sets the cursor focus in the New CO Event Id field.
     */
    public void setNewEventIdFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_NEW_EVENT_ID).focus ();
    }

    /**
     * Function opens the Add CO Event popup by entering a case event number
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
     * Selects the row in the CO Events grid with the Event Id specified.
     *
     * @param pEventId The Event Id to search for
     */
    public void selectRecordByEventId (final String pEventId)
    {
        selectValueFromGrid (GRID_CO_EVENTS, pEventId, 3);
    }

    /**
     * Gets the CO event details.
     *
     * @return the CO event details
     */
    public String getCOEventDetails ()
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_EVENT_DETAILS);
        return zA.getText ();
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
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR_SCREEN);
    }

    /**
     * Selects the row in the master CO Events grid that matches the Event Id specified.
     *
     * @param pEventId The Event Id to search for
     */
    public void selectGridRowByEventId (final String pEventId)
    {
        selectValueFromGrid (GRID_CO_EVENTS, pEventId, 3);
    }

    /**
     * Selects the row in the events grid that matches the event id specified
     * and double click it.
     *
     * @param pEventId The Event Id to search for
     */
    public void doubleClickCOEventByEventId (final String pEventId)
    {
        doubleClickValueFromGrid (GRID_CO_EVENTS, pEventId, 3);
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
     * Clicks the specified navigation button to navigate to another screen.
     *
     * @param navButtonId String identifier of the navigation button to click
     */
    public void clickNavigationButton (final String navButtonId)
    {
        mClickButton (navButtonId);
    }

    /**
     * Checks if is adds the event popup open.
     *
     * @return true, if is adds the event popup open
     */
    public boolean isAddEventPopupOpen ()
    {
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_EVENT);
        return addEventPopup.isVisible ();
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

        // Enter the event id and click the add button to launch the popup
        setTextFieldValue (TEXT_NEW_EVENT_ID, pNewEvent.getCOEventId ());
        mClickButton (BTN_ADD_EVENT);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }

        // Check add event popup is raised
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_EVENT);
        if ( !addEventPopup.isVisible ())
        {
            throw new Exception ("Add CO Event Popup is not visible.");
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

        if (eventConfig.getHasCreditor ())
        {
            // User must enter a Creditor
            final AutoCompleteAdaptor creditorField = cMB.getAutoCompleteAdaptor (AUTO_NEW_EVENT_CREDITOR);
            creditorField.setText (pNewEvent.getCreditor ());
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

        // Loop until are back in CO Events screen
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
    }
}