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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Query By Party Case screen.
 *
 * Date: 14-Sept-2009
 */
public class UC006QueryByPartyCaseUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant PARTY_TYPE_APPLICANT. */
    // Public party type constants for use in the select list
    public static final String PARTY_TYPE_APPLICANT = "Applicant";
    
    /** The Constant PARTY_TYPE_CLAIMANT. */
    public static final String PARTY_TYPE_CLAIMANT = "Claimant";
    
    /** The Constant PARTY_TYPE_COMPANY. */
    public static final String PARTY_TYPE_COMPANY = "The Company";
    
    /** The Constant PARTY_TYPE_CREDITOR. */
    public static final String PARTY_TYPE_CREDITOR = "Creditor";
    
    /** The Constant PARTY_TYPE_DEBTOR. */
    public static final String PARTY_TYPE_DEBTOR = "Debtor";
    
    /** The Constant PARTY_TYPE_DEFENDANT. */
    public static final String PARTY_TYPE_DEFENDANT = "Defendant";
    
    /** The Constant PARTY_TYPE_INSOLV_PRAC. */
    public static final String PARTY_TYPE_INSOLV_PRAC = "Insolvency Practitioner";
    
    /** The Constant PARTY_TYPE_OFF_REC. */
    public static final String PARTY_TYPE_OFF_REC = "Official Receiver";
    
    /** The Constant PARTY_TYPE_PETITIONER. */
    public static final String PARTY_TYPE_PETITIONER = "Petitioner";
    
    /** The Constant PARTY_TYPE_PT20_CLAIM. */
    public static final String PARTY_TYPE_PT20_CLAIM = "Part 20 Claimant";
    
    /** The Constant PARTY_TYPE_PT20_DEF. */
    public static final String PARTY_TYPE_PT20_DEF = "Part 20 Defendant";
    
    /** The Constant PARTY_TYPE_SOLICITOR. */
    public static final String PARTY_TYPE_SOLICITOR = "Solicitor";

    /** The text owning court. */
    // Private text field identifiers
    private String TEXT_OWNING_COURT = "Header_OwningCourtCode";
    
    /** The text case number. */
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The text insolvency number. */
    private String TEXT_INSOLVENCY_NUMBER = "Header_InsolvNo";
    
    /** The text insolvency year. */
    private String TEXT_INSOLVENCY_YEAR = "Header_InsolvYear";
    
    /** The text party name. */
    private String TEXT_PARTY_NAME = "Header_PartyName";
    
    /** The sel party type. */
    private String SEL_PARTY_TYPE = "Header_PartyType_Sel";
    
    /** The text addr line1. */
    private String TEXT_ADDR_LINE1 = "Header_Address1";
    
    /** The text addr line2. */
    private String TEXT_ADDR_LINE2 = "Header_Address1";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button (is Cancel button in this screen)
    private String mBTN_CLOSE_SCREEN = "Status_CancelBtn";

    /** The btn search parties. */
    // Private button identifiers
    private String BTN_SEARCH_PARTIES = "Header_SearchBtn";
    
    /** The btn previous page. */
    private String BTN_PREVIOUS_PAGE = "Status_PreviousButton";
    
    /** The btn next page. */
    private String BTN_NEXT_PAGE = "Status_NextButton";
    
    /** The btn status ok. */
    private String BTN_STATUS_OK = "Status_OKBtn";

    /** The grid query results. */
    // Private grid identifiers
    private String GRID_QUERY_RESULTS = "Results_ResultsGrid";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC006QueryByPartyCaseUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Query By Party Case";
    }

    /**
     * Sets the owning court.
     *
     * @param pCourtCode the new owning court
     */
    public void setOwningCourt (final String pCourtCode)
    {
        setTextFieldValue (TEXT_OWNING_COURT, pCourtCode);
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     * @throws FrameworkException the framework exception
     */
    public void setCaseNumber (final String pCaseNumber) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        if (tA.isEnabled ())
        {
            tA.type (pCaseNumber);
        }
    }

    /**
     * Sets the insolvency number.
     *
     * @param pInsNumber the new insolvency number
     * @throws FrameworkException the framework exception
     */
    public void setInsolvencyNumber (final String pInsNumber) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_INSOLVENCY_NUMBER);
        if (tA.isEnabled ())
        {
            tA.type (pInsNumber);
        }
    }

    /**
     * Sets the insolvency year.
     *
     * @param pInsYear the new insolvency year
     * @throws FrameworkException the framework exception
     */
    public void setInsolvencyYear (final String pInsYear) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_INSOLVENCY_YEAR);
        if (tA.isEnabled ())
        {
            tA.type (pInsYear);
        }
    }

    /**
     * Sets the party name.
     *
     * @param pPartyName the new party name
     * @throws FrameworkException the framework exception
     */
    public void setPartyName (final String pPartyName) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_NAME);
        if (tA.isEnabled ())
        {
            tA.type (pPartyName);
        }
    }

    /**
     * Sets the party type.
     *
     * @param pPartyType the new party type
     * @throws FrameworkException the framework exception
     */
    public void setPartyType (final String pPartyType) throws FrameworkException
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_PARTY_TYPE);
        if (sA.isEnabled () && !sA.isReadOnly ())
        {
            sA.clickLabel (pPartyType);
        }
    }

    /**
     * Sets the address line 1.
     *
     * @param pAddr the new address line 1
     * @throws FrameworkException the framework exception
     */
    public void setAddressLine1 (final String pAddr) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_ADDR_LINE1);
        if (tA.isEnabled ())
        {
            tA.type (pAddr);
        }
    }

    /**
     * Sets the address line 2.
     *
     * @param pAddr the new address line 2
     * @throws FrameworkException the framework exception
     */
    public void setAddressLine2 (final String pAddr) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_ADDR_LINE2);
        if (tA.isEnabled ())
        {
            tA.type (pAddr);
        }
    }

    /**
     * Clicks the Search Button provided it is enabled to return matching
     * parties to the results grid.
     *
     * @throws FrameworkException the framework exception
     */
    public void clickSearchButton () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_SEARCH_PARTIES);
        if (bA.isEnabled ())
        {
            // Click the button if enabled
            bA.click ();
            cMB.waitForPageToLoad ();

            // Handle scenario where search results in no matching results
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
        }
    }

    /**
     * Clicks the Previous button which returns the previous page of
     * 50 records.
     *
     * @throws FrameworkException the framework exception
     */
    public void clickPreviousButton () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_PREVIOUS_PAGE);
        if (bA.isEnabled ())
        {
            // Click the button if enabled
            bA.click ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Clicks the Next button which returns the next page of 50 records.
     *
     * @throws FrameworkException the framework exception
     */
    public void clickNextButton () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_NEXT_PAGE);
        if (bA.isEnabled ())
        {
            // Click the button if enabled
            bA.click ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Clicks the Ok button which returns the user to the previous screen
     * and loads the currently selected Case record in the results grid.
     */
    public void clickOkButton ()
    {
        mClickButton (BTN_STATUS_OK);
    }

    /**
     * Clicks the Cancel Button in the status bar to return to the previous screen
     * without a record to load.
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Selects the row in the results grid that matches the Case Number specified.
     *
     * @param pCaseNumber The Case Number to search for
     */
    public void selectRecordByCaseNumber (final String pCaseNumber)
    {
        selectValueFromGrid (GRID_QUERY_RESULTS, pCaseNumber);
    }

    /**
     * Selects the row in the results grid that matches the Party Name specified.
     *
     * @param pPartyName The Party Name to search for
     */
    public void selectRecordByPartyName (final String pPartyName)
    {
        selectValueFromGrid (GRID_QUERY_RESULTS, pPartyName, 4);
    }

    /**
     * Selects a row in the results grid by row number specified.
     *
     * @param rowNumber The row number to select (starts from 1)
     */
    public void selectRecordByRowNumber (final int rowNumber)
    {
        final GridAdaptor outputsGrid = cMB.getGridAdaptor (GRID_QUERY_RESULTS);
        outputsGrid.clickRow (rowNumber);
    }

}