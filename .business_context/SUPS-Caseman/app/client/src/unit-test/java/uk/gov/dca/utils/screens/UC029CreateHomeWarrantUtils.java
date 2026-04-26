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
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Create Home Warrants screen.
 *
 * Date: 02-Jul-2009
 */
public class UC029CreateHomeWarrantUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_MAGS_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_MAGS_CASE_NUMBER = "Cannot create warrants for MAGS ORDER cases.";
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";

    /** The Constant WARRANT_TYPE_COMMITTAL. */
    // Static constants representing different warrant types
    public static final String WARRANT_TYPE_COMMITTAL = "COMMITTAL";
    
    /** The Constant WARRANT_TYPE_DELIVERY. */
    public static final String WARRANT_TYPE_DELIVERY = "DELIVERY";
    
    /** The Constant WARRANT_TYPE_EXECUTION. */
    public static final String WARRANT_TYPE_EXECUTION = "EXECUTION";
    
    /** The Constant WARRANT_TYPE_POSSESSION. */
    public static final String WARRANT_TYPE_POSSESSION = "POSSESSION";
    
    /** The Constant WARRANT_TYPE_CONTROL. */
    public static final String WARRANT_TYPE_CONTROL = "CONTROL";

    /** The text case number. */
    // Private field identifiers
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The sel warrant type. */
    private String SEL_WARRANT_TYPE = "Header_WarrantType";
    
    /** The date date req received. */
    private String DATE_DATE_REQ_RECEIVED = "Header_DateRequestReceived";
    
    /** The text party for name. */
    private String TEXT_PARTY_FOR_NAME = "Claimant_Name";
    
    /** The text party for rep name. */
    private String TEXT_PARTY_FOR_REP_NAME = "Solicitor_Name";
    
    /** The text party against1 name. */
    private String TEXT_PARTY_AGAINST1_NAME = "Defendant1_Name";
    
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
    
    /** The text party against2 name. */
    private String TEXT_PARTY_AGAINST2_NAME = "Defendant2_Name";
    
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
    
    /** The text balance of debt. */
    private String TEXT_BALANCE_OF_DEBT = "WarrantDetails_BalanceOfDebt";
    
    /** The text amount of warrant. */
    private String TEXT_AMOUNT_OF_WARRANT = "WarrantDetails_AmountOfWarrant";
    
    /** The text warrant fee. */
    private String TEXT_WARRANT_FEE = "WarrantDetails_Fee";
    
    /** The text solicitor costs. */
    private String TEXT_SOLICITOR_COSTS = "WarrantDetails_SolicitorsCosts";
    
    /** The text land registry fee. */
    private String TEXT_LAND_REGISTRY_FEE = "WarrantDetails_LandRegistryFee";

    /** The grid party for. */
    // Private grid adaptor identifiers
    private String GRID_PARTY_FOR = "ClaimantsGrid";
    
    /** The grid parties against. */
    private String GRID_PARTIES_AGAINST = "DefendantsGrid";

    /** The btn save screen. */
    // Private button identifiers (Close defined in parent class)
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn details of warrant. */
    private String BTN_DETAILS_OF_WARRANT = "Footer_DetailsOfWarrantButton";
    
    /** The btn dets of warrant ok. */
    private String BTN_DETS_OF_WARRANT_OK = "WarrantDetails_OkButton";

    /** The pop details of warrant. */
    // Private popup adaptor identifiers
    private String POP_DETAILS_OF_WARRANT = "Warrant_Details_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC029CreateHomeWarrantUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create Home Warrants";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        cMB.type (TEXT_CASE_NUMBER, pCaseNumber);
        cMB.waitForPageToLoad ();

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
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
     * Sets the warrant type.
     *
     * @param pWarrantType the new warrant type
     */
    public void setWarrantType (final String pWarrantType)
    {
        setSelectFieldValue (SEL_WARRANT_TYPE, pWarrantType);

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Gets the warrant type.
     *
     * @return the warrant type
     */
    public String getWarrantType ()
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_WARRANT_TYPE);
        return sA.getSelectedLabel ();
    }

    /**
     * Checks if is warrant type valid.
     *
     * @return true, if is warrant type valid
     * @throws FrameworkException the framework exception
     */
    public boolean isWarrantTypeValid () throws FrameworkException
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_WARRANT_TYPE);
        return sA.isValid ();
    }

    /**
     * Sets focus in the Warrant Type field.
     */
    public void setFocusOnWarrantType ()
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_WARRANT_TYPE);
        sA.focus ();
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
     * Selects a row in the Party For grid which will populate the Party For
     * details on the screen. Function searches for a party name.
     *
     * @param pPartyName The party for name to search for in the grid.
     */
    public void clickPartyForGridRow (final String pPartyName)
    {
        selectValueFromGrid (GRID_PARTY_FOR, pPartyName, 3);
    }

    /**
     * Selects a row in the Party Against grid which will populate the Party Against
     * details on the screen. Function searches for a party name.
     *
     * @param pPartyName The party for name to search for in the grid.
     */
    public void clickPartyAgainstGridRow (final String pPartyName)
    {
        selectValueFromGrid (GRID_PARTIES_AGAINST, pPartyName, 3);
    }

    /**
     * Gets the party for name.
     *
     * @return the party for name
     */
    public String getPartyForName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_NAME);
        return tA.getValue ();
    }

    /**
     * Gets the party for rep name.
     *
     * @return the party for rep name
     */
    public String getPartyForRepName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_NAME);
        return tA.getValue ();
    }

    /**
     * Gets the party against 1 name.
     *
     * @return the party against 1 name
     */
    public String getPartyAgainst1Name ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_AGAINST1_NAME);
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
     * Gets the party against 2 name.
     *
     * @return the party against 2 name
     */
    public String getPartyAgainst2Name ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_AGAINST2_NAME);
        return tA.getValue ();
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
        if (isWarrantDetailsPopupVisible ())
        {
            setTextFieldValue (TEXT_BALANCE_OF_DEBT, pAmount);
        }
    }

    /**
     * Checks if is balance of debt mandatory.
     *
     * @return true, if is balance of debt mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isBalanceOfDebtMandatory () throws FrameworkException
    {
        boolean isMand = false;
        if (isWarrantDetailsPopupVisible ())
        {
            final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_BALANCE_OF_DEBT);
            isMand = tA.isMandatory ();
        }
        return isMand;
    }

    /**
     * Checks if is balance of debt valid.
     *
     * @return true, if is balance of debt valid
     * @throws FrameworkException the framework exception
     */
    public boolean isBalanceOfDebtValid () throws FrameworkException
    {
        boolean isValid = false;
        if (isWarrantDetailsPopupVisible ())
        {
            final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_BALANCE_OF_DEBT);
            isValid = tA.isValid ();
        }
        return isValid;
    }

    /**
     * Sets the cursor focus in the Balance Of Debt field.
     */
    public void setBalanceOfDebtFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_BALANCE_OF_DEBT).focus ();
    }

    /**
     * Sets the amount of warrant.
     *
     * @param pAmount the new amount of warrant
     */
    public void setAmountOfWarrant (final String pAmount)
    {
        if (isWarrantDetailsPopupVisible ())
        {
            setTextFieldValue (TEXT_AMOUNT_OF_WARRANT, pAmount);
        }
    }

    /**
     * Checks if is amount of warrant mandatory.
     *
     * @return true, if is amount of warrant mandatory
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountOfWarrantMandatory () throws FrameworkException
    {
        boolean isMand = false;
        if (isWarrantDetailsPopupVisible ())
        {
            final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_WARRANT);
            isMand = tA.isMandatory ();
        }
        return isMand;
    }

    /**
     * Checks if is amount of warrant valid.
     *
     * @return true, if is amount of warrant valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountOfWarrantValid () throws FrameworkException
    {
        boolean isValid = false;
        if (isWarrantDetailsPopupVisible ())
        {
            final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_WARRANT);
            isValid = tA.isValid ();
        }
        return isValid;
    }

    /**
     * Sets the cursor focus in the Amount Of Warrant field.
     */
    public void setAmountOfWarrantFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_WARRANT).focus ();
    }

    /**
     * Sets the warrant fee.
     *
     * @param pAmount the new warrant fee
     */
    public void setWarrantFee (final String pAmount)
    {
        if (isWarrantDetailsPopupVisible ())
        {
            setTextFieldValue (TEXT_WARRANT_FEE, pAmount);
        }
    }

    /**
     * Sets the solicitors costs.
     *
     * @param pAmount the new solicitors costs
     */
    public void setSolicitorsCosts (final String pAmount)
    {
        if (isWarrantDetailsPopupVisible ())
        {
            setTextFieldValue (TEXT_SOLICITOR_COSTS, pAmount);
        }
    }

    /**
     * Gets the solicitors costs.
     *
     * @return the solicitors costs
     */
    public String getSolicitorsCosts ()
    {
        String returnValue = "";
        if (isWarrantDetailsPopupVisible ())
        {
            final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_SOLICITOR_COSTS);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Sets the land registry fee.
     *
     * @param pAmount the new land registry fee
     */
    public void setLandRegistryFee (final String pAmount)
    {
        if (isWarrantDetailsPopupVisible ())
        {
            setTextFieldValue (TEXT_LAND_REGISTRY_FEE, pAmount);
        }
    }

    /**
     * Clicks the Details of Warrant button to launch the popup.
     */
    public void clickDetailsOfWarrantButton ()
    {
        mClickButton (BTN_DETAILS_OF_WARRANT);
    }

    /**
     * Clicks the Ok button on the Details of Warrant popup.
     */
    public void clickDetailsOfWarrantPopupOk ()
    {
        mClickButton (BTN_DETS_OF_WARRANT_OK);
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
     * Clicks the Save button and returns the Warrant number produced.
     *
     * @return The Warrant number created
     */
    public String saveAndReturnWarrantNumber ()
    {
        String warrantNumber = "";
        mClickButton (BTN_SAVE_SCREEN);

        // Handle warrant created alert
        if (cMB.isAlertPresent ())
        {
            final String tempString = cMB.getAlertString ();
            final String searchString = "Warrant number is ";
            final int startIndex = tempString.indexOf (searchString) + searchString.length ();
            warrantNumber = tempString.substring (startIndex, startIndex + 8);
        }

        return warrantNumber;
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
        mClickButton (BTN_CLEAR_SCREEN);
    }

    /**
     * Checks if is warrant details popup visible.
     *
     * @return true, if is warrant details popup visible
     */
    private boolean isWarrantDetailsPopupVisible ()
    {
        final PopupAdaptor popup = cMB.getPopupAdaptor (POP_DETAILS_OF_WARRANT);
        return popup.isVisible ();
    }

}