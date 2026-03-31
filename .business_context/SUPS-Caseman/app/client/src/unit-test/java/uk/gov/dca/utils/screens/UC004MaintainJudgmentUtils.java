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
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain Judgment screen.
 *
 * Date: 10-Jun-2009
 */
public class UC004MaintainJudgmentUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant APPLICANT_CONSENT. */
    // Static constants for application to vary/application to set aside applicants
    public static final String APPLICANT_CONSENT = "BY CONSENT";
    
    /** The Constant APPLICANT_PARTY_AGAINST. */
    public static final String APPLICANT_PARTY_AGAINST = "PARTY AGAINST";
    
    /** The Constant APPLICANT_PARTY_FOR. */
    public static final String APPLICANT_PARTY_FOR = "PARTY FOR";
    
    /** The Constant APPLICANT_PROPER_OFFICER. */
    public static final String APPLICANT_PROPER_OFFICER = "PROPER OFFICER";
    
    /** The Constant APPLICANT_THIRD_PARTY. */
    public static final String APPLICANT_THIRD_PARTY = "THIRD_PARTY";

    /** The Constant SET_ASIDE_RESULT_GRANTED. */
    // Static constants representing different Set Aside Result Types
    public static final String SET_ASIDE_RESULT_GRANTED = "GRANTED";
    
    /** The Constant SET_ASIDE_RESULT_ERROR. */
    public static final String SET_ASIDE_RESULT_ERROR = "IN ERROR";
    
    /** The Constant SET_ASIDE_RESULT_REFUSED. */
    public static final String SET_ASIDE_RESULT_REFUSED = "REFUSED";
    
    /** The Constant SET_ASIDE_RESULT_TRANSFERRED. */
    public static final String SET_ASIDE_RESULT_TRANSFERRED = "TRANSFERRED";

    /** The Constant APP_VARY_RESULT_DETERMINED. */
    // Static constants for application to vary results
    public static final String APP_VARY_RESULT_DETERMINED = "DETERMINED";
    
    /** The Constant APP_VARY_RESULT_GRANTED. */
    public static final String APP_VARY_RESULT_GRANTED = "GRANTED";
    
    /** The Constant APP_VARY_RESULT_REFERREDJUDGE. */
    public static final String APP_VARY_RESULT_REFERREDJUDGE = "REFERRED TO JUDGE";
    
    /** The Constant APP_VARY_RESULT_REFUSED. */
    public static final String APP_VARY_RESULT_REFUSED = "REFUSED";

    /** The Constant APP_VARY_RESPONSE_ACCEPTED. */
    // Static constants for application to vary responses
    public static final String APP_VARY_RESPONSE_ACCEPTED = "APPLICATION ACCEPTED";
    
    /** The Constant APP_VARY_RESPONSE_NORESPONSE. */
    public static final String APP_VARY_RESPONSE_NORESPONSE = "NO RESPONSE WITHIN 16 DAYS";
    
    /** The Constant APP_VARY_RESPONSE_REFUSED. */
    public static final String APP_VARY_RESPONSE_REFUSED = "TERMS REFUSED";

    /** The Constant FREQUENCY_FORTHWITH. */
    // Static constants for application to vary frequencies
    public static final String FREQUENCY_FORTHWITH = "FORTHWITH";
    
    /** The Constant FREQUENCY_FORTNIGHTLY. */
    public static final String FREQUENCY_FORTNIGHTLY = "FORTNIGHTLY";
    
    /** The Constant FREQUENCY_INFULL. */
    public static final String FREQUENCY_INFULL = "IN FULL";
    
    /** The Constant FREQUENCY_MONTHLY. */
    public static final String FREQUENCY_MONTHLY = "MONTHLY";
    
    /** The Constant FREQUENCY_WEEKLY. */
    public static final String FREQUENCY_WEEKLY = "WEEKLY";

    /** The btn nav trans case screen. */
    // Private button field identifiers
    private String BTN_NAV_TRANS_CASE_SCREEN = "NavBar_TransferCaseButton";
    
    /** The btn print judg order. */
    private String BTN_PRINT_JUDG_ORDER = "NavBar_PrintJudgOrdersButton";
    
    /** The btn save. */
    private String BTN_SAVE = "Status_Save";
    
    /** The btn set aside. */
    private String BTN_SET_ASIDE = "Master_SetAsideButton";
    
    /** The btn add set aside. */
    private String BTN_ADD_SET_ASIDE = "AppToSetAside_AddBtn";
    
    /** The btn set aside ok. */
    private String BTN_SET_ASIDE_OK = "AppToSetAside_OKBtn";
    
    /** The btn add set aside ok. */
    private String BTN_ADD_SET_ASIDE_OK = "AddSetAside_OKBtn";
    
    /** The btn vary judgment. */
    private String BTN_VARY_JUDGMENT = "Master_VaryButton";
    
    /** The btn add app vary. */
    private String BTN_ADD_APP_VARY = "AppToVary_AddBtn";
    
    /** The btn app vary ok. */
    private String BTN_APP_VARY_OK = "AppToVary_OKBtn";
    
    /** The btn add app vary ok. */
    private String BTN_ADD_APP_VARY_OK = "AddVary_OKBtn";

    /** The text date paid in full. */
    // Private text field identifiers
    private String TEXT_DATE_PAID_IN_FULL = "JudgmentDetails_PaidInFullDate";
    
    /** The text notif receipt date. */
    private String TEXT_NOTIF_RECEIPT_DATE = "JudgmentDetails_NotReceiptDate";
    
    /** The select addsetaside applicant. */
    private String SELECT_ADDSETASIDE_APPLICANT = "AddSetAside_Applicant";
    
    /** The select setaside result. */
    private String SELECT_SETASIDE_RESULT = "AppToSetAside_Result";
    
    /** The date setaside result date. */
    private String DATE_SETASIDE_RESULT_DATE = "AppToSetAside_ResultDate";
    
    /** The select addvary applicant. */
    private String SELECT_ADDVARY_APPLICANT = "AddVary_Applicant";
    
    /** The text addvary amount offered. */
    private String TEXT_ADDVARY_AMOUNT_OFFERED = "AddVary_InstAmount";
    
    /** The select addvary frequency. */
    private String SELECT_ADDVARY_FREQUENCY = "AddVary_Per";
    
    /** The select appvary response. */
    private String SELECT_APPVARY_RESPONSE = "AppToVary_ClaimResp";
    
    /** The date appvary response date. */
    private String DATE_APPVARY_RESPONSE_DATE = "AppToVary_RespDate";
    
    /** The select appvary result. */
    private String SELECT_APPVARY_RESULT = "AppToVary_Result";
    
    /** The date appvary result date. */
    private String DATE_APPVARY_RESULT_DATE = "AppToVary_ResultDate";
    
    /** The date appvary payment date. */
    private String DATE_APPVARY_PAYMENT_DATE = "AppToVary_PayDate";
    
    /** The text appvary amount. */
    private String TEXT_APPVARY_AMOUNT = "AppToVary_ResultAmount";
    
    /** The select appvary frequency. */
    private String SELECT_APPVARY_FREQUENCY = "AppToVary_ResultPer";

    /** The grid party against. */
    // Private grid identifiers
    private String GRID_PARTY_AGAINST = "Master_AgainstGrid";
    
    private String GRID_APPTOVARY = "AppToVary_Grid";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close";

    /** The pop set aside judgment. */
    private String POP_SET_ASIDE_JUDGMENT = "AppToSetAside";
    
    /** The pop add new set aside. */
    private String POP_ADD_NEW_SET_ASIDE = "AddSetAside";
    
    /** The pop vary judgment. */
    private String POP_VARY_JUDGMENT = "AppToVary";
    
    /** The pop add new app vary. */
    private String POP_ADD_NEW_APP_VARY = "AddVary";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC004MaintainJudgmentUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Judgment";
    }

    /**
     * Sets the date paid in full.
     *
     * @param pDate the new date paid in full
     */
    public void setDatePaidInFull (final String pDate)
    {
        // Set the date field
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (TEXT_DATE_PAID_IN_FULL);
        dA.setDate (pDate);
    }

    /**
     * Sets the notification receipt date.
     *
     * @param pDate the new notification receipt date
     */
    public void setNotificationReceiptDate (final String pDate)
    {
        // Set the date field
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (TEXT_NOTIF_RECEIPT_DATE);
        dA.setDate (pDate);
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

    /**
     * Navigates the the Transfer Cases screen via the navigation button.
     */
    public void navigateTransferCaseScreen ()
    {
        mClickButton (BTN_NAV_TRANS_CASE_SCREEN);
    }

    /**
     * Handles the clicking of the Produce Judgment Orders button.
     *
     * @param pFCKNavigation True if we expect the judgment to navigate to the editor screen
     */
    public void clickProduceJudgmentOrders (final boolean pFCKNavigation)
    {
        mClickButton (BTN_PRINT_JUDG_ORDER);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();

        String pageTitle = null;

        if (pFCKNavigation)
        {
            // Loop until have arrived on the WP FCK Editor screen
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
            cA.click ();

            // Click Ok on FCK Editor screen
            mClickButton (FCK_EDITOR_OK_BUTTON);
        }

        // Loop until are back in Maintain Judgments screen
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

    /**
     * Clicks the Save Button.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE);
    }

    /**
     * Selects the row in the Party Against grid that matches the Party Name specified.
     *
     * @param pPartyName The Party Name to search for
     */
    public void selectPartyAgainstByName (final String pPartyName)
    {
        selectValueFromGrid (GRID_PARTY_AGAINST, pPartyName, 4);
    }

    /**
     * Selects the row in the Party Against grid that matches the Judgment Date specified.
     *
     * @param pJudgmentDate The Judgment Date e.g. 17-OCT-2013
     */
    public void selectPartyAgainstByDate (final String pJudgmentDate)
    {
        selectValueFromGrid (GRID_PARTY_AGAINST, pJudgmentDate, 1);
    }

    /**
     * Raises the Application To Vary Popup via clicking the Applications Vary button
     * in the main Judgments screen.
     */
    public void raiseAppVaryPopup ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if ( !pA.isVisible ())
        {
            // Popup not already visible, click button to raise
            mClickButton (BTN_VARY_JUDGMENT);
        }
    }
    
    /**
     * Selects the row in the Applications to Vary grid that matches the Applicant specified
     *
     * @param pApplicant   The Applicant
     */
    public void selectAppToVaryByApplicant(final String pApplicant)
    {
        selectValueFromGrid(GRID_APPTOVARY, pApplicant, 2);
    }
    
    /**
     * Sets the app vary response.
     *
     * @param pValue the new app vary response
     */
    public void setAppVaryResponse (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_APPVARY_RESPONSE, pValue);
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Sets the app vary response date.
     *
     * @param pDate the new app vary response date
     */
    public void setAppVaryResponseDate (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_APPVARY_RESPONSE_DATE);
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the app vary result.
     *
     * @param pValue the new app vary result
     */
    public void setAppVaryResult (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_APPVARY_RESULT, pValue);
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Sets the app vary result date.
     *
     * @param pDate the new app vary result date
     */
    public void setAppVaryResultDate (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_APPVARY_RESULT_DATE);
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the app vary payment date.
     *
     * @param pDate the new app vary payment date
     */
    public void setAppVaryPaymentDate (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_APPVARY_PAYMENT_DATE);
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the app vary amount.
     *
     * @param pValue the new app vary amount
     */
    public void setAppVaryAmount (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setTextFieldValue (TEXT_APPVARY_AMOUNT, pValue);
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Sets the app vary frequency.
     *
     * @param pValue the new app vary frequency
     */
    public void setAppVaryFrequency (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_APPVARY_FREQUENCY, pValue);
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Clicks the Ok Button in the Application To Vary popup.
     */
    public void clickAppVaryOkButton ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup visible, click Ok button to close
            mClickButton (BTN_APP_VARY_OK);
        }
    }

    /**
     * Raises the Add Application To Vary Popup via clicking the Add Application button
     * in the Application To Vary Popup.
     */
    public void raiseAddNewAppVaryPopup ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_VARY_JUDGMENT);
        if (pA.isVisible ())
        {
            // Application To Vary Popup is visible so raise the Add popup
            final PopupAdaptor pA2 = cMB.getPopupAdaptor (POP_ADD_NEW_APP_VARY);
            if ( !pA2.isVisible ())
            {
                // Popup not already visible, click button to raise
                mClickButton (BTN_ADD_APP_VARY);
            }
        }
    }

    /**
     * Sets the adds the app vary applicant.
     *
     * @param pValue the new adds the app vary applicant
     */
    public void setAddAppVaryApplicant (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_APP_VARY);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_ADDVARY_APPLICANT, pValue);
        }
    }

    /**
     * Sets the adds the app vary amount offered.
     *
     * @param pValue the new adds the app vary amount offered
     */
    public void setAddAppVaryAmountOffered (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_APP_VARY);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setTextFieldValue (TEXT_ADDVARY_AMOUNT_OFFERED, pValue);
        }
    }

    /**
     * Sets the adds the app vary frequency.
     *
     * @param pValue the new adds the app vary frequency
     */
    public void setAddAppVaryFrequency (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_APP_VARY);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_ADDVARY_FREQUENCY, pValue);
        }
    }

    /**
     * Clicks the Ok Button on the Add Application To Vary popup.
     */
    public void clickAddAppVaryPopupOkButton ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_APP_VARY);
        if (pA.isVisible ())
        {
            // Popup visible, click Ok button to close
            mClickButton (BTN_ADD_APP_VARY_OK);
        }
    }

    /**
     * Raises the Application To Set Aside Popup via clicking the Applications Set Aside button
     * in the main Judgments screen.
     */
    public void raiseSetAsidePopup ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_SET_ASIDE_JUDGMENT);
        if ( !pA.isVisible ())
        {
            // Popup not already visible, click button to raise
            mClickButton (BTN_SET_ASIDE);
        }
    }

    /**
     * Sets the sets the aside result.
     *
     * @param pValue the new sets the aside result
     */
    public void setSetAsideResult (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_SET_ASIDE_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_SETASIDE_RESULT, pValue);
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Sets the sets the aside result date.
     *
     * @param pDate the new sets the aside result date
     */
    public void setSetAsideResultDate (final String pDate)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_SET_ASIDE_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_SETASIDE_RESULT_DATE);
            dA.setDate (pDate);
        }
    }

    /**
     * Clicks the Ok Button in the Application To Set Aside popup.
     */
    public void clickSetAsideOkButton ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_SET_ASIDE_JUDGMENT);
        if (pA.isVisible ())
        {
            // Popup visible, click Ok button to close
            mClickButton (BTN_SET_ASIDE_OK);
        }
    }

    /**
     * Raises the Add Application To Set Aside Popup via clicking the Add Application button
     * in the Application To Set Aside Popup.
     */
    public void raiseAddNewSetAsidePopup ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_SET_ASIDE_JUDGMENT);
        if (pA.isVisible ())
        {
            // Application To Set Aside Popup is visible so raise the Add popup
            final PopupAdaptor pA2 = cMB.getPopupAdaptor (POP_ADD_NEW_SET_ASIDE);
            if ( !pA2.isVisible ())
            {
                // Popup not already visible, click button to raise
                mClickButton (BTN_ADD_SET_ASIDE);
            }
        }
    }

    /**
     * Sets the sets the aside applicant.
     *
     * @param pValue the new sets the aside applicant
     */
    public void setSetAsideApplicant (final String pValue)
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_SET_ASIDE);
        if (pA.isVisible ())
        {
            // Popup is visible, set the value
            setSelectFieldValue (SELECT_ADDSETASIDE_APPLICANT, pValue);
        }
    }

    /**
     * Clicks the Ok Button on the Add Application To Set Aside popup.
     */
    public void clickAddSetAsidePopupOkButton ()
    {
        final PopupAdaptor pA = cMB.getPopupAdaptor (POP_ADD_NEW_SET_ASIDE);
        if (pA.isVisible ())
        {
            // Popup visible, click Ok button to close
            mClickButton (BTN_ADD_SET_ASIDE_OK);
        }
    }

    /**
     * Clicks the Save button following the creation of a new Application to Set Aside which
     * has been immediately Granted. This will take the user to the Obligations screen, to
     * two variable data screens and finally the FCK Editor before returning to the Judgments
     * screen.
     *
     * @param inError true if the set aside result is IN ERROR, else false
     */
    public void saveFollowingNewSetAsideGranted (final boolean inError)
    {
        String pageTitle;
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

        // Click Save Button
        clickSaveButton ();

        if ( !inError)
        {
            /*********** OBLIGATIONS SCREEN ***************/

            // Navigate to Obligations screen
            while (cMB.isConfirmationPresent ())
            {
                cMB.getConfirmation ();
            }

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
            myUC009MaintainObligationsUtils.closeScreen ();
        }

        // Variable Data screen configurations
        final String vdScreenTitle1 = "Enter Variable Data N441A";

        final String vdScreenTitle2 = "Enter Variable Data O_3_1_2_5_1";
        final LinkedList<VariableDataQuestion> vdScreen2Questions = new LinkedList<VariableDataQuestion> ();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion ("ReasonSetAside",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Non-service of claim", cMB);
        vdScreen2Questions.add (vdQ1);

        // Loop until have arrived on the first variable data screen
        if ( !inError)
        {
            /*********** N441A VARIABLE DATA SCREEN ***************/
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle1) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);
        }
        else
        {
            /*********** O_3_1_2_5_1 VARIABLE DATA SCREEN ***************/
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle2) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // When on variable data screen, deal with the question list provided in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = vdScreen2Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);
            cMB.waitForPageToLoad ();

            /*********** FCK EDITOR SCREEN ***************/

            // Loop until have arrived on the WP FCK Editor screen
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
            cA.click ();

            // Click Ok on FCK Editor screen
            mClickButton (FCK_EDITOR_OK_BUTTON);
        }

        // Loop until have arrived on the second variable data screen
        if ( !inError)
        {
            /*********** O_3_1_2_5_1 VARIABLE DATA SCREEN ***************/
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle2) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // When on variable data screen, deal with the question list provided in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = vdScreen2Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);
            cMB.waitForPageToLoad ();

            /*********** FCK EDITOR SCREEN ***************/

            // Loop until have arrived on the WP FCK Editor screen
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
            cA.click ();

            // Click Ok on FCK Editor screen
            mClickButton (FCK_EDITOR_OK_BUTTON);
        }
        else
        {
            /*********** N441A VARIABLE DATA SCREEN ***************/
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle1) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);
        }

        /*********** JUDGMEMTS SCREEN ***************/

        // Loop until are back in Maintain Judgments screen
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
    
    /**
     * Clicks the Save button following the creation of a new Application to Set Aside which
     * has been immediately Granted.  This will take the user to the Obligations screen, to
     * two variable data screens and finally the FCK Editor before returning to the Judgments
     * screen.
     *
     */
    public void saveFollowingNewSetAsideGrantedNotRegistered()
    {
        String pageTitle;
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

        // Click Save Button
        clickSaveButton();

        /*********** OBLIGATIONS SCREEN ***************/

        // Navigate to Obligations screen
        while ( cMB.isConfirmationPresent() )
        {
            cMB.getConfirmation();
        }

        // Initialise the Obligations screen object
        myUC009MaintainObligationsUtils = new UC009MaintainObligationsUtils(cMB);

        // Loop until are in Obligations screen
        pageTitle = cMB.getPageTitle();
        while ( !pageTitle.equals( myUC009MaintainObligationsUtils.getScreenTitle() ) )
        {
            cMB.waitForPageToLoad ();
            if ( cMB.isConfirmationPresent() )
            {
                cMB.getConfirmation();
            }
            pageTitle = cMB.getPageTitle();
        }
        myUC009MaintainObligationsUtils.closeScreen();

        // Variable Data screen configurations

        final String vdScreenTitle2 = "Enter Variable Data O_3_1_2_5_1";
        final LinkedList<VariableDataQuestion> vdScreen2Questions = new LinkedList<VariableDataQuestion>();
        final VariableDataQuestion vdQ1 = new VariableDataQuestion("ReasonSetAside",
                VariableDataQuestion.VD_FIELD_TYPE_SELECT,
                "Non-service of claim",
                cMB);
        vdScreen2Questions.add(vdQ1);

        /*********** O_3_1_2_5_1 VARIABLE DATA SCREEN ***************/
        cMB.waitForPageToLoad();
        pageTitle = cMB.getPageTitle();
        while ( pageTitle.indexOf( vdScreenTitle2 ) == -1 )
        {
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle();
        }

        // When on variable data screen, deal with the question list provided in
        VariableDataQuestion vdQuestion;
        for(Iterator<VariableDataQuestion> i = vdScreen2Questions.iterator(); i.hasNext();) {
            vdQuestion = (VariableDataQuestion) i.next();
            vdQuestion.setQuestionValue();
        }

        // Click Save on the Variable Data screen
        mClickButton( VARIABLE_DATA_SAVE_BUTTON );
        cMB.waitForPageToLoad();

        /*********** FCK EDITOR SCREEN ***************/

        // Loop until have arrived on the WP FCK Editor screen
        cMB.waitForPageToLoad();
        pageTitle = cMB.getPageTitle();
        while ( !pageTitle.equals( FCK_EDITOR_TITLE ) )
        {
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle();
        }

        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor( FCK_EDITOR_OUTPUT_FINAL );
        cA.click();

        // Click Ok on FCK Editor screen
        mClickButton( FCK_EDITOR_OK_BUTTON );

        /*********** JUDGMEMTS SCREEN ***************/

        // Loop until are back in Maintain Judgments screen
        pageTitle = cMB.getPageTitle();
        while ( !pageTitle.equals( mScreenTitle ) )
        {
            if ( cMB.isAlertPresent() )
            {
                cMB.getAlert();
            }

            if ( cMB.isConfirmationPresent() )
            {
                cMB.getConfirmation();
            }

            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle();
        }
    }
    
    /**
     * Clicks the Save button following the setting of an aplication to vary result which
     * has been Granted or Determined.
     *
     * @param determined true if the app vary result is DETERMINED, else false
     */
    public void saveFollowingAppVaryResultSet (final boolean determined)
    {
        String pageTitle;

        // Click Save Button
        clickSaveButton ();

        // Loop until have arrived on the first variable data screen
        if (determined)
        {
            /*********** N35A VARIABLE DATA SCREEN ***************/
            final String vdScreenTitle2 = "Enter Variable Data N35A";
            final LinkedList<VariableDataQuestion> vdScreen2Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("PartyFor", VariableDataQuestion.VD_FIELD_TYPE_GRID, "CLAIMANT", 1, cMB);
            vdScreen2Questions.add (vdQ1);

            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle2) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // When on variable data screen, deal with the question list provided in
            VariableDataQuestion vdQuestion;
            for (Iterator<VariableDataQuestion> i = vdScreen2Questions.iterator (); i.hasNext ();)
            {
                vdQuestion = (VariableDataQuestion) i.next ();
                vdQuestion.setQuestionValue ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);
            if ( cMB.isConfirmationPresent() )
            {
                cMB.getConfirmation();
            }
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
            cMB.waitForPageToLoad ();
        }
        else
        {
            /*********** N35 VARIABLE DATA SCREEN ***************/
            final String vdScreenTitle1 = "Enter Variable Data N35";
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf (vdScreenTitle1) == -1)
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // Click Save on the Variable Data screen
            mClickButton (VARIABLE_DATA_SAVE_BUTTON);

            /*********** FCK EDITOR SCREEN ***************/

            // Loop until have arrived on the WP FCK Editor screen
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
            cA.click ();

            // Click Ok on FCK Editor screen
            mClickButton (FCK_EDITOR_OK_BUTTON);
        }

        /*********** JUDGMEMTS SCREEN ***************/

        // Loop until are back in Maintain Judgments screen
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

    /**
     * Handles the save following the creation of an application to vary (no result set) which navigates
     * to the word processing screens (non-CCBC cases only).
     */
    public void saveFollowingAppVary ()
    {
        String pageTitle;
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

        // Click Save Button
        clickSaveButton ();

        /*********** OBLIGATIONS SCREEN ***************/

        // Navigate to Obligations screen
        while (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }

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
        myUC009MaintainObligationsUtils.closeScreen ();

        // Variable Data screen configurations
        final String vdScreenTitle1 = "Enter Variable Data O_7_12_5";

        /*********** O_7_12_5 VARIABLE DATA SCREEN ***************/
        cMB.waitForPageToLoad ();
        pageTitle = cMB.getPageTitle ();
        while (pageTitle.indexOf (vdScreenTitle1) == -1)
        {
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }

        // Click Save on the Variable Data screen
        mClickButton (VARIABLE_DATA_SAVE_BUTTON);
        cMB.waitForPageToLoad ();

        /*********** FCK EDITOR SCREEN ***************/

        // Loop until have arrived on the WP FCK Editor screen
        cMB.waitForPageToLoad ();
        pageTitle = cMB.getPageTitle ();
        while ( !pageTitle.equals (FCK_EDITOR_TITLE))
        {
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }

        final CheckboxInputAdaptor cA = cMB.getCheckBoxInputAdaptor (FCK_EDITOR_OUTPUT_FINAL);
        cA.click ();

        // Click Ok on FCK Editor screen
        mClickButton (FCK_EDITOR_OK_BUTTON);

        /*********** JUDGMEMTS SCREEN ***************/

        // Loop until are back in Maintain Judgments screen
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

    /**
     * Handles the save following the setting of the date paid in full which navigates
     * to the word processing screens (non-CCBC cases only).
     */
    public void saveFollowingPaidInFull ()
    {
        String pageTitle;

        // Click Save Button
        clickSaveButton ();

        // Variable Data screen configurations
        final String vdScreenTitle1 = "Enter Variable Data N441A";

        /*********** N441A VARIABLE DATA SCREEN ***************/
        cMB.waitForPageToLoad ();
        pageTitle = cMB.getPageTitle ();
        while (pageTitle.indexOf (vdScreenTitle1) == -1)
        {
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }

        // Click Save on the Variable Data screen
        mClickButton (VARIABLE_DATA_SAVE_BUTTON);
        cMB.waitForPageToLoad ();

        /*********** JUDGMEMTS SCREEN ***************/

        // Loop until are back in Maintain Judgments screen
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