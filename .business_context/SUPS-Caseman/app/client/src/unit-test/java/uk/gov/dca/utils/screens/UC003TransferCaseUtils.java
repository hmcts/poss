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
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Transfer Case screen.
 *
 * Date: 09-Jun-2009
 */
public class UC003TransferCaseUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant TRANSREASON_ADMISSION. */
    // Static constants representing transfer reasons
    public static final String TRANSREASON_ADMISSION = "ADMISSION";
    
    /** The Constant TRANSREASON_ALLOCATION. */
    public static final String TRANSREASON_ALLOCATION = "ALLOCATION";
    
    /** The Constant TRANSREASON_APP_FOR_RECON. */
    public static final String TRANSREASON_APP_FOR_RECON = "APP FOR RECON";
    
    /** The Constant TRANSREASON_APP_LIFT_STAY. */
    public static final String TRANSREASON_APP_LIFT_STAY = "APP TO LIFT STAY";
    
    /** The Constant TRANSREASON_APP_SET_ASIDE. */
    public static final String TRANSREASON_APP_SET_ASIDE = "APP TO SET ASIDE";
    
    /** The Constant TRANSREASON_AE. */
    public static final String TRANSREASON_AE = "ATTACH EARNINGS";
    
    /** The Constant TRANSREASON_SOL_NOT_ACT. */
    public static final String TRANSREASON_SOL_NOT_ACT = "CCBC SOL NOT ACTING";
    
    /** The Constant TRANSREASON_CHARGING_ORD. */
    public static final String TRANSREASON_CHARGING_ORD = "CHARGING ORDER";
    
    /** The Constant TRANSREASON_DEFENCE_FILED. */
    public static final String TRANSREASON_DEFENCE_FILED = "DEFENCE FILED";
    
    /** The Constant TRANSREASON_DIRCTNS_AFTER_ALLOC. */
    public static final String TRANSREASON_DIRCTNS_AFTER_ALLOC = "DIRCTNS AFTER ALLOC";
    
    /** The Constant TRANSREASON_DJ_ORD. */
    public static final String TRANSREASON_DJ_ORD = "DISTRICT JUDG ORDER";
    
    /** The Constant TRANSREASON_FIXING_TRIAL. */
    public static final String TRANSREASON_FIXING_TRIAL = "FIXING FOR TRIAL";
    
    /** The Constant TRANSREASON_FOR_DIRECTIONS. */
    public static final String TRANSREASON_FOR_DIRECTIONS = "FOR DIRECTIONS";
    
    /** The Constant TRANSREASON_HIGH_CRT_ENF. */
    public static final String TRANSREASON_HIGH_CRT_ENF = "HIGH CT ENFCMENT";
    
    /** The Constant TRANSREASON_JDGMT_SUMMONS. */
    public static final String TRANSREASON_JDGMT_SUMMONS = "JUDGMT SUMMONS";
    
    /** The Constant TRANSREASON_ORD_QUESTION. */
    public static final String TRANSREASON_ORD_QUESTION = "ORD FOR QUESTIONING";
    
    /** The Constant TRANSREASON_CLAIM_INCREASE. */
    public static final String TRANSREASON_CLAIM_INCREASE = "PLTF APP TO INCREASE";
    
    /** The Constant TRANSREASON_CLAIM_REFUSE. */
    public static final String TRANSREASON_CLAIM_REFUSE = "PLTF REFUSES AMOUNT";
    
    /** The Constant TRANSREASON_REDETERMINATION. */
    public static final String TRANSREASON_REDETERMINATION = "REDETERMINATION";
    
    /** The Constant TRANSREASON_SPECIALIST. */
    public static final String TRANSREASON_SPECIALIST = "SPECIALIST LIST";
    
    /** The Constant TRANSREASON_THIRD_PARTY. */
    public static final String TRANSREASON_THIRD_PARTY = "THIRD PARTY DEBT ORD";
    
    /** The Constant TRANSREASON_INTERLOC_JUDGE. */
    public static final String TRANSREASON_INTERLOC_JUDGE = "INTERLOC JUDGMT";

    /** The text trans court code. */
    // Private field identifiers
    private String TEXT_TRANS_COURT_CODE = "TransferCase_TransferCourtCode";
    
    /** The auto trans reason. */
    private String AUTO_TRANS_REASON = "TransferCase_TransferReason";
    
    /** The date trans req date. */
    private String DATE_TRANS_REQ_DATE = "TransferCase_TransferRequestDate";
    
    /** The auto new case type. */
    private String AUTO_NEW_CASE_TYPE = "TransferCase_NewCaseType";
    
    /** The chk produce notice. */
    private String CHK_PRODUCE_NOTICE = "TransferCase_ProduceNotice";

    /** The btn save details. */
    // Private button identifiers
    private String BTN_SAVE_DETAILS = "Status_SaveButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC003TransferCaseUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Transfer Case";
    }

    /**
     * Sets the transfer court code.
     *
     * @param pCourtCode the new transfer court code
     */
    public void setTransferCourtCode (final String pCourtCode)
    {
        cMB.type (TEXT_TRANS_COURT_CODE, pCourtCode);

        // Handle alerts and confirms
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }

        // Wait in case service called
        cMB.waitForPageToLoad ();
    }

    /**
     * Sets the transfer reason.
     *
     * @param pTransferReason the new transfer reason
     * @throws FrameworkException the framework exception
     */
    public void setTransferReason (final String pTransferReason) throws FrameworkException
    {
        final AutoCompleteAdaptor transReason = cMB.getAutoCompleteAdaptor (AUTO_TRANS_REASON);
        if (transReason.isEnabled () && !transReason.isReadOnly ())
        {
            // Field is enabled and editable, set the field
            transReason.setText (pTransferReason);
        }
    }

    /**
     * Sets the transfer request date.
     *
     * @param pDate the new transfer request date
     * @throws FrameworkException the framework exception
     */
    public void setTransferRequestDate (final String pDate) throws FrameworkException
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_TRANS_REQ_DATE);
        if (dA.isEnabled () && !dA.isReadOnly ())
        {
            dA.setDate (pDate);
        }
    }

    /**
     * Sets the new case type.
     *
     * @param pCaseType the new new case type
     * @throws FrameworkException the framework exception
     */
    public void setNewCaseType (final String pCaseType) throws FrameworkException
    {
        final AutoCompleteAdaptor transReason = cMB.getAutoCompleteAdaptor (AUTO_NEW_CASE_TYPE);
        if (transReason.isEnabled () && !transReason.isReadOnly ())
        {
            // Field is enabled and editable, set the field
            transReason.setText (pCaseType);
        }
    }

    /**
     * Checks if is new case type enabled.
     *
     * @return true, if is new case type enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isNewCaseTypeEnabled () throws FrameworkException
    {
        final AutoCompleteAdaptor transReason = cMB.getAutoCompleteAdaptor (AUTO_NEW_CASE_TYPE);
        return transReason.isEnabled ();
    }

    /**
     * Sets the produce notice checkbox.
     *
     * @param pChecked the new produce notice checkbox
     */
    public void setProduceNoticeCheckbox (final boolean pChecked)
    {
        setCheckboxFieldValue (CHK_PRODUCE_NOTICE, pChecked);
    }

    /**
     * Clicks the Save button. This version will not handle any navigation to
     * Word Processing screens.
     */
    public void clickSaveButton ()
    {
        cMB.getButtonAdaptor (BTN_SAVE_DETAILS).click ();

        // Handle alerts and confirms
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }

        // Wait in case service called
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the save button and handles navigation to Obligations, Variable Data screen
     * and FCK Editor if specified.
     *
     * @param navObligations If true, will handle navigation to obligations
     * @param vdScreen If true, will handle navigation to variable data screen
     * @param fckEditor If true, will handle navigation to the FCK Editor
     * @param pQuestionList LinkedList of VariableDataQuestions for variable data screen
     */
    public void clickSaveButton (final boolean navObligations, final boolean vdScreen, final boolean fckEditor,
                                 final LinkedList<VariableDataQuestion> pQuestionList)
    {
        final UC009MaintainObligationsUtils myUC009MaintainObligationsUtils;

        clickSaveButton ();

        if (navObligations)
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

            myUC009MaintainObligationsUtils.closeScreen ();
        }

        if (vdScreen)
        {
            // Loop until are in Variable Data screen
            String pageTitle = cMB.getPageTitle ();
            while (pageTitle.indexOf ("Enter Variable Data") == -1)
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

        if (fckEditor)
        {
            // Event wants to navigate to the WP FCK Editor screen
            String pageTitle = cMB.getPageTitle ();
            while ( !pageTitle.equals (FCK_EDITOR_TITLE))
            {
                cMB.waitForPageToLoad ();
                pageTitle = cMB.getPageTitle ();
            }

            // Click Ok on FCK Editor screen
            mClickButton (FCK_EDITOR_OK_BUTTON);
        }
    }
}