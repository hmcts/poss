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
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain Local Coded Parties screen.
 *
 * Date: 28-Sept-2011
 */
public class UC017MaintainLocalCodedPartiesUtils extends AbstractBaseScreenUtils
{
    
    /** The text party code. */
    // Private text field identifiers
    private String TEXT_PARTY_CODE = "Header_PartyCode";
    
    /** The text party name. */
    private String TEXT_PARTY_NAME = "Header_PartyName";

    /** The text pop party code. */
    private String TEXT_POP_PARTY_CODE = "MaintainCodedParty_Code";
    
    /** The text pop party name. */
    private String TEXT_POP_PARTY_NAME = "MaintainCodedParty_Name";
    
    /** The text pop address line1. */
    private String TEXT_POP_ADDRESS_LINE1 = "MaintainCodedParty_AddressLine1";
    
    /** The text pop address line2. */
    private String TEXT_POP_ADDRESS_LINE2 = "MaintainCodedParty_AddressLine2";
    
    /** The text pop address line3. */
    private String TEXT_POP_ADDRESS_LINE3 = "MaintainCodedParty_AddressLine3";
    
    /** The text pop address line4. */
    private String TEXT_POP_ADDRESS_LINE4 = "MaintainCodedParty_AddressLine4";
    
    /** The text pop address line5. */
    private String TEXT_POP_ADDRESS_LINE5 = "MaintainCodedParty_AddressLine5";
    
    /** The text pop postcode. */
    private String TEXT_POP_POSTCODE = "MaintainCodedParty_PostCode";
    
    /** The text pop dx. */
    private String TEXT_POP_DX = "MaintainCodedParty_DXNumber";
    
    /** The text pop telephone. */
    private String TEXT_POP_TELEPHONE = "MaintainCodedParty_Telephone";
    
    /** The text pop fax. */
    private String TEXT_POP_FAX = "MaintainCodedParty_FaxNumber";
    
    /** The text pop email. */
    private String TEXT_POP_EMAIL = "MaintainCodedParty_Email";

    /** The btn search parties. */
    // Private button identifiers
    private String BTN_SEARCH_PARTIES = "Header_Search";
    
    /** The btn previous page. */
    private String BTN_PREVIOUS_PAGE = "Results_PreviousButton";
    
    /** The btn next page. */
    private String BTN_NEXT_PAGE = "Results_NextButton";
    
    /** The btn add. */
    private String BTN_ADD = "Results_AddButton";
    
    /** The btn update. */
    private String BTN_UPDATE = "Results_UpdateButton";
    
    /** The btn popup save. */
    private String BTN_POPUP_SAVE = "MaintainLocalCodedPartySubform_SaveButton";
    
    /** The btn popup cancel. */
    private String BTN_POPUP_CANCEL = "MaintainLocalCodedPartySubform_CancelButton";

    /** The grid query results. */
    // Private grid identifiers
    private String GRID_QUERY_RESULTS = "Results_ResultsGrid";

    /** The pop coded party detail. */
    // Private Popup identifiers
    private String POP_CODED_PARTY_DETAIL = "maintainLocalCodedParty_subform";

    /** The coded party subform. */
    // Private subform objects
    private SubFormAdaptor codedPartySubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC017MaintainLocalCodedPartiesUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Local Coded Parties";
    }

    /**
     * Sets the query party code.
     *
     * @param pPartyCode the new query party code
     */
    public void setQueryPartyCode (final String pPartyCode)
    {
        setTextFieldValue (TEXT_PARTY_CODE, pPartyCode);
    }

    /**
     * Sets the query party name.
     *
     * @param pPartyName the new query party name
     */
    public void setQueryPartyName (final String pPartyName)
    {
        setTextFieldValue (TEXT_PARTY_NAME, pPartyName);
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
     * Clicks the Add button to launch the Coded Party subform.
     */
    public void clickAddButton ()
    {
        mClickButton (BTN_ADD);
        if (null == codedPartySubform)
        {
            codedPartySubform = cMB.getSubFormAdaptor (POP_CODED_PARTY_DETAIL);
        }
    }

    /**
     * Clicks the Update button to launch the Coded Party subform.
     */
    public void clickUpdateButton ()
    {
        mClickButton (BTN_UPDATE);
        if (null == codedPartySubform)
        {
            codedPartySubform = cMB.getSubFormAdaptor (POP_CODED_PARTY_DETAIL);
        }
    }

    /**
     * Checks if is update button enabled.
     *
     * @return true, if is update button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isUpdateButtonEnabled () throws FrameworkException
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_UPDATE);
        return bA.isEnabled ();
    }

    /**
     * Sets the popup party code.
     *
     * @param pCode the new popup party code
     * @throws FrameworkException the framework exception
     */
    public void setPopupPartyCode (final String pCode) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_PARTY_CODE);
            tA.type (pCode);
        }
    }

    /**
     * Checks if is popup party code valid.
     *
     * @return true, if is popup party code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPopupPartyCodeValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_PARTY_CODE);
            blnValid = tA.isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the cursor focus in the Code field in the Coded Party subform.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setPopupPartyCodeFocus () throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_PARTY_CODE);
            tA.focus ();
        }
    }

    /**
     * Sets the popup party name.
     *
     * @param pName the new popup party name
     * @throws FrameworkException the framework exception
     */
    public void setPopupPartyName (final String pName) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_PARTY_NAME);
            tA.type (pName);
        }
    }

    /**
     * Sets the popup address line 1.
     *
     * @param pAddLine the new popup address line 1
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddressLine1 (final String pAddLine) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_ADDRESS_LINE1);
            tA.type (pAddLine);
        }
    }

    /**
     * Sets the popup address line 2.
     *
     * @param pAddLine the new popup address line 2
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddressLine2 (final String pAddLine) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_ADDRESS_LINE2);
            tA.type (pAddLine);
        }
    }

    /**
     * Sets the popup address line 3.
     *
     * @param pAddLine the new popup address line 3
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddressLine3 (final String pAddLine) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_ADDRESS_LINE3);
            tA.type (pAddLine);
        }
    }

    /**
     * Sets the popup address line 4.
     *
     * @param pAddLine the new popup address line 4
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddressLine4 (final String pAddLine) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_ADDRESS_LINE4);
            tA.type (pAddLine);
        }
    }

    /**
     * Sets the popup address line 5.
     *
     * @param pAddLine the new popup address line 5
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddressLine5 (final String pAddLine) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_ADDRESS_LINE5);
            tA.type (pAddLine);
        }
    }

    /**
     * Sets the popup post code.
     *
     * @param pPostCode the new popup post code
     * @throws FrameworkException the framework exception
     */
    public void setPopupPostCode (final String pPostCode) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_POSTCODE);
            tA.type (pPostCode);
        }
    }

    /**
     * Sets the popup DX number.
     *
     * @param pDX the new popup DX number
     * @throws FrameworkException the framework exception
     */
    public void setPopupDXNumber (final String pDX) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_DX);
            tA.type (pDX);
        }
    }

    /**
     * Sets the popup telephone.
     *
     * @param pTelNo the new popup telephone
     * @throws FrameworkException the framework exception
     */
    public void setPopupTelephone (final String pTelNo) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_TELEPHONE);
            tA.type (pTelNo);
        }
    }

    /**
     * Sets the popup fax number.
     *
     * @param pFax the new popup fax number
     * @throws FrameworkException the framework exception
     */
    public void setPopupFaxNumber (final String pFax) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_FAX);
            tA.type (pFax);
        }
    }

    /**
     * Sets the popup email address.
     *
     * @param pEmail the new popup email address
     * @throws FrameworkException the framework exception
     */
    public void setPopupEmailAddress (final String pEmail) throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) codedPartySubform.getAdaptor (TEXT_POP_EMAIL);
            tA.type (pEmail);
        }
    }

    /**
     * Click the Save button in the Coded Party subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void popupClickSave () throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            ((ButtonAdaptor) codedPartySubform.getAdaptor (BTN_POPUP_SAVE)).click ();
        }
    }

    /**
     * Clicks the Cancel button in the Coded Party subform.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void popupClickCancel () throws FrameworkException
    {
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            ((ButtonAdaptor) codedPartySubform.getAdaptor (BTN_POPUP_CANCEL)).click ();
        }
    }

    /**
     * Gets the coded party subform status bar text.
     *
     * @return the coded party subform status bar text
     */
    public String getCodedPartySubformStatusBarText ()
    {
        String statusBarText = "";
        if (null != codedPartySubform && codedPartySubform.isVisible ())
        {
            // Retrieve the status bar text from the subform
            statusBarText = cMB.getSubFormAdaptor (POP_CODED_PARTY_DETAIL).getStatusBarText ();
        }
        return statusBarText;
    }

    /**
     * Selects the row in the results grid that matches the Party Code specified.
     *
     * @param pCode The Code to search for
     */
    public void selectRecordByCode (final String pCode)
    {
        selectValueFromGrid (GRID_QUERY_RESULTS, pCode, 1);
    }

    /**
     * Selects the row in the results grid that matches the Party Name specified.
     *
     * @param pPartyName The Party Name to search for
     */
    public void selectRecordByPartyName (final String pPartyName)
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