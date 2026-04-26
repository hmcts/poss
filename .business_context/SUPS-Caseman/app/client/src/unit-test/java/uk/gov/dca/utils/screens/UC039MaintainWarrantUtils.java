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
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Maintain/Query Warrants screen.
 *
 * Date: 01-Oct-2009
 */
public class UC039MaintainWarrantUtils extends AbstractBaseScreenUtils
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

    /** The text header executing court code. */
    // Private field identifiers
    private String TEXT_HEADER_EXECUTING_COURT_CODE = "Header_ExecutingCourtCode";
    
    /** The text warrant number. */
    private String TEXT_WARRANT_NUMBER = "Header_WarrantNumber";
    
    /** The text case number. */
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The text issuing court code. */
    private String TEXT_ISSUING_COURT_CODE = "Header_IssuedByCourtCode";
    
    /** The text local warrant number. */
    private String TEXT_LOCAL_WARRANT_NUMBER = "Header_LocalNumber";
    
    /** The text co number. */
    private String TEXT_CO_NUMBER = "Header_CONumber";
    
    /** The date issue date. */
    private String DATE_ISSUE_DATE = "Header_IssueDate";
    
    /** The text warrant type. */
    private String TEXT_WARRANT_TYPE = "Header_WarrantType";
    
    /** The text party for sol name. */
    private String TEXT_PARTY_FOR_SOL_NAME = "Solicitor_Name";
    
    /** The text party for sol adline1. */
    private String TEXT_PARTY_FOR_SOL_ADLINE1 = "Solicitor_Address_Line1";
    
    /** The text party for sol adline2. */
    private String TEXT_PARTY_FOR_SOL_ADLINE2 = "Solicitor_Address_Line2";
    
    /** The text party for sol adline3. */
    private String TEXT_PARTY_FOR_SOL_ADLINE3 = "Solicitor_Address_Line3";
    
    /** The text party for sol adline4. */
    private String TEXT_PARTY_FOR_SOL_ADLINE4 = "Solicitor_Address_Line4";
    
    /** The text party for sol adline5. */
    private String TEXT_PARTY_FOR_SOL_ADLINE5 = "Solicitor_Address_Line5";
    
    /** The text party for sol postcode. */
    private String TEXT_PARTY_FOR_SOL_POSTCODE = "Solicitor_Address_PostCode";
    
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
    
    /** The text balance of debt. */
    private String TEXT_BALANCE_OF_DEBT = "WarrantDetails_BalanceOfDebt";
    
    /** The text amount of warrant. */
    private String TEXT_AMOUNT_OF_WARRANT = "WarrantDetails_AmountOfWarrant";
    
    /** The text warrant fee. */
    private String TEXT_WARRANT_FEE = "WarrantDetails_Fee";
    
    /** The text solicitors costs. */
    private String TEXT_SOLICITORS_COSTS = "WarrantDetails_SolicitorsCosts";
    
    /** The text land registry fee. */
    private String TEXT_LAND_REGISTRY_FEE = "WarrantDetails_LandRegistryFee";
    
    /** The text payments to date. */
    private String TEXT_PAYMENTS_TO_DATE = "WarrantDetails_PaymentsToDate";
    
    /** The text total remaining. */
    private String TEXT_TOTAL_REMAINING = "WarrantDetails_TotalRemaining";
    
    /** The text additional fees. */
    private String TEXT_ADDITIONAL_FEES = "WarrantDetails_AdditionalFees";

    /** The btn search warrant. */
    // Private button identifiers (Close defined in parent class)
    private String BTN_SEARCH_WARRANT = "SearchButton";
    
    /** The btn details of warrant. */
    private String BTN_DETAILS_OF_WARRANT = "Footer_DetailsOfWarrantButton";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn dets of warrant ok. */
    private String BTN_DETS_OF_WARRANT_OK = "WarrantDetails_OkButton";

    /** The pop details of warrant. */
    // Warrant Details Popup identifier
    private String POP_DETAILS_OF_WARRANT = "Warrant_Details_Popup";

    /** The pop lov search. */
    // Search popup identifiers
    private String POP_LOV_SEARCH = "SearchResultsLOVGrid";
    
    /** The grid lov search. */
    private String GRID_LOV_SEARCH = "SearchResultsLOVGrid_grid";

    // Static constants representing the additional navigation quicklinks on the
    /** The Constant QUICKLINK_VIEW_PAYMENTS. */
    // Maintain/Query Warrants screen
    public static final String QUICKLINK_VIEW_PAYMENTS = "View Payments";
    
    /** The Constant QUICKLINK_VIEW_FEES. */
    public static final String QUICKLINK_VIEW_FEES = "Maintain Fees";

    /** The Constant BTN_NAV_WARRANT_RETURNS_SCREEN. */
    // Static variables representing the Navigation Buttons
    public static final String BTN_NAV_WARRANT_RETURNS_SCREEN = "NavBar_ReturnsButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC039MaintainWarrantUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain / Query Warrants";
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
     * Sets the header executing court code.
     *
     * @param pCourtCode the new header executing court code
     */
    public void setHeaderExecutingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_HEADER_EXECUTING_COURT_CODE, pCourtCode);
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
     * Sets the issuing court code.
     *
     * @param pCourtCode the new issuing court code
     */
    public void setIssuingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_ISSUING_COURT_CODE, pCourtCode);
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
     * Sets the local warrant number.
     *
     * @param pLocalNumber the new local warrant number
     */
    public void setLocalWarrantNumber (final String pLocalNumber)
    {
        setTextFieldValue (TEXT_LOCAL_WARRANT_NUMBER, pLocalNumber);
    }

    /**
     * Checks if is local warrant number valid.
     *
     * @return true, if is local warrant number valid
     * @throws Exception the exception
     */
    public boolean isLocalWarrantNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_LOCAL_WARRANT_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Local Warrant Number field.
     */
    public void setLocalWarrantNumberFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_LOCAL_WARRANT_NUMBER).focus ();
    }

    /**
     * Gets the issue date.
     *
     * @return the issue date
     */
    public String getIssueDate ()
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_ISSUE_DATE);
        return dA.getDate ();
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
     * Gets the party for sol name.
     *
     * @return the party for sol name
     */
    public String getPartyForSolName ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_NAME);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol adline 1.
     *
     * @return the party for sol adline 1
     */
    public String getPartyForSolAdline1 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_ADLINE1);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol adline 2.
     *
     * @return the party for sol adline 2
     */
    public String getPartyForSolAdline2 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_ADLINE2);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol adline 3.
     *
     * @return the party for sol adline 3
     */
    public String getPartyForSolAdline3 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_ADLINE3);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol adline 4.
     *
     * @return the party for sol adline 4
     */
    public String getPartyForSolAdline4 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_ADLINE4);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol adline 5.
     *
     * @return the party for sol adline 5
     */
    public String getPartyForSolAdline5 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_ADLINE5);
        return tA.getValue ();
    }

    /**
     * Gets the party for sol postcode.
     *
     * @return the party for sol postcode
     */
    public String getPartyForSolPostcode ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_SOL_POSTCODE);
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
            setTextFieldValue (TEXT_SOLICITORS_COSTS, pAmount);
        }
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
     * Gets the payments to date.
     *
     * @return the payments to date
     */
    public String getPaymentsToDate ()
    {
        String returnValue = null;
        if (isWarrantDetailsPopupVisible ())
        {
            returnValue = cMB.getTextInputAdaptor (TEXT_PAYMENTS_TO_DATE).getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the total remaining.
     *
     * @return the total remaining
     */
    public String getTotalRemaining ()
    {
        String returnValue = null;
        if (isWarrantDetailsPopupVisible ())
        {
            returnValue = cMB.getTextInputAdaptor (TEXT_TOTAL_REMAINING).getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the additional fees.
     *
     * @return the additional fees
     */
    public String getAdditionalFees ()
    {
        String returnValue = null;
        if (isWarrantDetailsPopupVisible ())
        {
            returnValue = cMB.getTextInputAdaptor (TEXT_ADDITIONAL_FEES).getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the warrant fee.
     *
     * @return the warrant fee
     */
    public String getWarrantFee ()
    {
        String returnValue = null;
        if (isWarrantDetailsPopupVisible ())
        {
            returnValue = cMB.getTextInputAdaptor (TEXT_WARRANT_FEE).getValue ();
        }
        return returnValue;
    }

    /**
     * Clicks the Search button to load a warrant record.
     */
    public void clickSearchButton ()
    {
        mClickButton (BTN_SEARCH_WARRANT);
        cMB.waitForPageToLoad ();

        // Handle the search results popup if multiple results
        final PopupAdaptor searchPopup = cMB.getPopupAdaptor (POP_LOV_SEARCH);
        if (searchPopup.isVisible ())
        {
            // Multiple records returned and displayed in a popup, select the enforcement number requested
            final GridAdaptor resultsGrid = cMB.getGridAdaptor (GRID_LOV_SEARCH);
            resultsGrid.doubleClickRow (1);
            cMB.waitForPageToLoad ();
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

        cMB.waitForPageToLoad ();

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