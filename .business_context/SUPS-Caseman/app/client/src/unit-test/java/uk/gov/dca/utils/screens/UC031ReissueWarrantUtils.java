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
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Reissue Warrants screen.
 *
 * Date: 09-Sep-2009
 */
public class UC031ReissueWarrantUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_WARRANT_NUMBER. */
    public static final String ERR_MSG_INVALID_WARRANT_NUMBER =
            "The warrant number entered does not match a valid format.";

    /** The text warrant number. */
    // Private field identifiers
    private String TEXT_WARRANT_NUMBER = "Header_WarrantNumber";
    
    /** The text case number. */
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The text co number. */
    private String TEXT_CO_NUMBER = "Header_CONumber";
    
    /** The date issue date. */
    private String DATE_ISSUE_DATE = "Header_IssueDate";
    
    /** The text owning court. */
    private String TEXT_OWNING_COURT = "Header_IssuedByCourtCode";
    
    /** The text warrant type. */
    private String TEXT_WARRANT_TYPE = "Header_WarrantType";
    
    /** The text party against1 adline1. */
    private String TEXT_PARTY_AGAINST1_ADLINE1 = "Defendant1_Address_Line1";
    
    /** The text party against1 adline2. */
    private String TEXT_PARTY_AGAINST1_ADLINE2 = "Defendant1_Address_Line2";
    
    /** The text party against1 adline3. */
    private String TEXT_PARTY_AGAINST1_ADLINE3 = "Defendant1_Address_Line3";
    
    /** The text party against1 adline4. */
    private String TEXT_PARTY_AGAINST1_ADLINE4 = "Defendant1_Address_Line4";
    
    /** The text party against1 adline5. */
    private String TEXT_PARTY_AGAINST1_ADLINE5 = "Defendant1_Address_Line5";
    
    /** The text party against1 postcode. */
    private String TEXT_PARTY_AGAINST1_POSTCODE = "Defendant1_Address_PostCode";
    
    /** The text party against2 adline1. */
    private String TEXT_PARTY_AGAINST2_ADLINE1 = "Defendant2_Address_Line1";
    
    /** The text party against2 adline2. */
    private String TEXT_PARTY_AGAINST2_ADLINE2 = "Defendant2_Address_Line2";
    
    /** The text party against2 adline3. */
    private String TEXT_PARTY_AGAINST2_ADLINE3 = "Defendant2_Address_Line3";
    
    /** The text party against2 adline4. */
    private String TEXT_PARTY_AGAINST2_ADLINE4 = "Defendant2_Address_Line4";
    
    /** The text party against2 adline5. */
    private String TEXT_PARTY_AGAINST2_ADLINE5 = "Defendant2_Address_Line5";
    
    /** The text party against2 postcode. */
    private String TEXT_PARTY_AGAINST2_POSTCODE = "Defendant2_Address_PostCode";
    
    /** The text executing court code. */
    private String TEXT_EXECUTING_COURT_CODE = "ExecutingCourtCode";
    
    /** The text bailiff area. */
    private String TEXT_BAILIFF_AREA = "BailiffAreaNo";
    
    /** The zoom additional details. */
    private String ZOOM_ADDITIONAL_DETAILS = "Additional_Notes";
    
    /** The date date req received. */
    private String DATE_DATE_REQ_RECEIVED = "DateRequestReceived";
    
    /** The text balance of debt. */
    private String TEXT_BALANCE_OF_DEBT = "WarrantDetails_BalanceOfDebt";
    
    /** The text amount of warrant. */
    private String TEXT_AMOUNT_OF_WARRANT = "WarrantDetails_AmountOfWarrant";
    
    /** The text reissue fee. */
    private String TEXT_REISSUE_FEE = "WarrantDetails_Fee";
    
    /** The text land registry fee. */
    private String TEXT_LAND_REGISTRY_FEE = "WarrantDetails_LandRegistryFee";

    /** The btn search warrant. */
    // Private button identifiers (Close defined in parent class)
    private String BTN_SEARCH_WARRANT = "SearchButton";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CancelButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC031ReissueWarrantUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Re-issue Warrant";
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
     * Sets the issue date.
     *
     * @param pDate the new issue date
     */
    public void setIssueDate (final String pDate)
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_ISSUE_DATE);
        dA.setDate (pDate);
    }

    /**
     * Sets the owning court code.
     *
     * @param pCourtCode the new owning court code
     */
    public void setOwningCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_OWNING_COURT, pCourtCode);
    }

    /**
     * Gets the warrant type.
     *
     * @return the warrant type
     */
    public String getWarrantType ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_WARRANT_TYPE);
        return tA.getValue ();
    }

    /**
     * Sets the party against one adline 1.
     *
     * @param pAdline the new party against one adline 1
     */
    public void setPartyAgainstOneAdline1 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_ADLINE1, pAdline);
    }

    /**
     * Sets the party against one adline 2.
     *
     * @param pAdline the new party against one adline 2
     */
    public void setPartyAgainstOneAdline2 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_ADLINE2, pAdline);
    }

    /**
     * Sets the party against one adline 3.
     *
     * @param pAdline the new party against one adline 3
     */
    public void setPartyAgainstOneAdline3 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_ADLINE3, pAdline);
    }

    /**
     * Sets the party against one adline 4.
     *
     * @param pAdline the new party against one adline 4
     */
    public void setPartyAgainstOneAdline4 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_ADLINE4, pAdline);
    }

    /**
     * Sets the party against one adline 5.
     *
     * @param pAdline the new party against one adline 5
     */
    public void setPartyAgainstOneAdline5 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_ADLINE5, pAdline);
    }

    /**
     * Sets the party against one postcode.
     *
     * @param pPostcode the new party against one postcode
     */
    public void setPartyAgainstOnePostcode (final String pPostcode)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_POSTCODE, pPostcode);
    }

    /**
     * Sets the party against two adline 1.
     *
     * @param pAdline the new party against two adline 1
     */
    public void setPartyAgainstTwoAdline1 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_ADLINE1, pAdline);
    }

    /**
     * Sets the party against two adline 2.
     *
     * @param pAdline the new party against two adline 2
     */
    public void setPartyAgainstTwoAdline2 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_ADLINE2, pAdline);
    }

    /**
     * Sets the party against two adline 3.
     *
     * @param pAdline the new party against two adline 3
     */
    public void setPartyAgainstTwoAdline3 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_ADLINE3, pAdline);
    }

    /**
     * Sets the party against two adline 4.
     *
     * @param pAdline the new party against two adline 4
     */
    public void setPartyAgainstTwoAdline4 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_ADLINE4, pAdline);
    }

    /**
     * Sets the party against two adline 5.
     *
     * @param pAdline the new party against two adline 5
     */
    public void setPartyAgainstTwoAdline5 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_ADLINE5, pAdline);
    }

    /**
     * Sets the party against two postcode.
     *
     * @param pPostcode the new party against two postcode
     */
    public void setPartyAgainstTwoPostcode (final String pPostcode)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_POSTCODE, pPostcode);
    }

    /**
     * Sets the executing court code.
     *
     * @param pCourtCode the new executing court code
     */
    public void setExecutingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_EXECUTING_COURT_CODE, pCourtCode);
    }

    /**
     * Sets the bailiff area number.
     *
     * @param pBailiffArea the new bailiff area number
     */
    public void setBailiffAreaNumber (final String pBailiffArea)
    {
        setTextFieldValue (TEXT_BAILIFF_AREA, pBailiffArea);
    }

    /**
     * Sets the date request received.
     *
     * @param pDate the new date request received
     */
    public void setDateRequestReceived (final String pDate)
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_DATE_REQ_RECEIVED);
        dA.setDate (pDate);
    }

    /**
     * Sets the additional details.
     *
     * @param pDetails the new additional details
     */
    public void setAdditionalDetails (final String pDetails)
    {
        final ZoomFieldAdaptor zA = cMB.getZoomFieldAdaptor (ZOOM_ADDITIONAL_DETAILS);
        zA.setText (pDetails);
    }

    /**
     * Sets the balance of debt.
     *
     * @param pAmount the new balance of debt
     */
    public void setBalanceOfDebt (final String pAmount)
    {
        setTextFieldValue (TEXT_BALANCE_OF_DEBT, pAmount);
    }

    /**
     * Checks if is balance of debt mandatory.
     *
     * @return true, if is balance of debt mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isBalanceOfDebtMandatory () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_BALANCE_OF_DEBT);
        return tA.isMandatory ();
    }

    /**
     * Checks if is balance of debt valid.
     *
     * @return true, if is balance of debt valid
     * @throws FrameworkException the framework exception
     */
    public boolean isBalanceOfDebtValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_BALANCE_OF_DEBT);
        return tA.isValid ();
    }

    /**
     * Sets the amount of warrant.
     *
     * @param pAmount the new amount of warrant
     */
    public void setAmountOfWarrant (final String pAmount)
    {
        setTextFieldValue (TEXT_AMOUNT_OF_WARRANT, pAmount);
    }

    /**
     * Checks if is amount of warrant mandatory.
     *
     * @return true, if is amount of warrant mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountOfWarrantMandatory () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_WARRANT);
        return tA.isMandatory ();
    }

    /**
     * Checks if is amount of warrant valid.
     *
     * @return true, if is amount of warrant valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountOfWarrantValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_WARRANT);
        return tA.isValid ();
    }

    /**
     * Sets the warrant fee.
     *
     * @param pAmount the new warrant fee
     */
    public void setWarrantFee (final String pAmount)
    {
        setTextFieldValue (TEXT_REISSUE_FEE, pAmount);
    }

    /**
     * Sets the land registry fee.
     *
     * @param pAmount the new land registry fee
     */
    public void setLandRegistryFee (final String pAmount)
    {
        setTextFieldValue (TEXT_LAND_REGISTRY_FEE, pAmount);
    }

    /**
     * Clicks the Search button to load a warrant record.
     */
    public void clickSearchButton ()
    {
        mClickButton (BTN_SEARCH_WARRANT);

        // Handle warrant created alert
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save button.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE_SCREEN);

        // Handle warrant created alert
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save button and returns the Alert popup message.
     *
     * @return The Alert popup message
     */
    public String saveAndReturnAlertString ()
    {
        String tempString = "";
        mClickButton (BTN_SAVE_SCREEN);

        // Handle warrant created alert
        if (cMB.isAlertPresent ())
        {
            tempString = cMB.getAlertString ();
        }

        return tempString;
    }

    /**
     * Clicks the Clear button.
     */
    public void clickClearButton ()
    {
        cMB.getButtonAdaptor (BTN_CLEAR_SCREEN).click ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

}