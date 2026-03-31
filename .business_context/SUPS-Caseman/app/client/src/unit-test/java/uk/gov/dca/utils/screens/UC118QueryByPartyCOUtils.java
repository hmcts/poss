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
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Query By Party CO screen.
 *
 * Date: 14-Sep-2009
 */
public class UC118QueryByPartyCOUtils extends AbstractBaseScreenUtils
{
    
    /** The text owning court. */
    // Private text field identifiers
    private String TEXT_OWNING_COURT = "Header_OwningCourtCode";
    
    /** The text co number. */
    private String TEXT_CO_NUMBER = "Header_CONumber";
    
    /** The text debtor name. */
    private String TEXT_DEBTOR_NAME = "Header_PartyName";
    
    /** The text addr line1. */
    private String TEXT_ADDR_LINE1 = "Header_Address1";
    
    /** The text addr line2. */
    private String TEXT_ADDR_LINE2 = "Header_Address2";
    
    /** The text emp name. */
    private String TEXT_EMP_NAME = "Header_EmployerName";

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
    public UC118QueryByPartyCOUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Query By Party CO";
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
     * Sets the CO number.
     *
     * @param pCONumber the new CO number
     * @throws FrameworkException the framework exception
     */
    public void setCONumber (final String pCONumber) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CO_NUMBER);
        if (tA.isEnabled ())
        {
            tA.type (pCONumber);
        }
    }

    /**
     * Sets the debtor name.
     *
     * @param pPartyName the new debtor name
     * @throws FrameworkException the framework exception
     */
    public void setDebtorName (final String pPartyName) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_DEBTOR_NAME);
        if (tA.isEnabled ())
        {
            tA.type (pPartyName);
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
     * Sets the employer name.
     *
     * @param pEmpName the new employer name
     * @throws FrameworkException the framework exception
     */
    public void setEmployerName (final String pEmpName) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_EMP_NAME);
        if (tA.isEnabled ())
        {
            tA.type (pEmpName);
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
     * and loads the currently selected CO record in the results grid.
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
     * Selects the row in the results grid that matches the CO Number specified.
     *
     * @param pCONumber The CO Number to search for
     */
    public void selectRecordByCONumber (final String pCONumber)
    {
        selectValueFromGrid (GRID_QUERY_RESULTS, pCONumber);
    }

    /**
     * Selects the row in the results grid that matches the Debtor Name specified.
     *
     * @param pPartyName The Party Name to search for
     */
    public void selectRecordByDebtorName (final String pPartyName)
    {
        selectValueFromGrid (GRID_QUERY_RESULTS, pPartyName, 2);
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