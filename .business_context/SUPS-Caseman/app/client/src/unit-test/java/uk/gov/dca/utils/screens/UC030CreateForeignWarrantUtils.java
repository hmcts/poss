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
 * Screen utility class representing the Create Foreign Warrants screen.
 *
 * Date: 08-Sep-2009
 */
public class UC030CreateForeignWarrantUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_WARRANT_NUMBER1. */
    public static final String ERR_MSG_INVALID_WARRANT_NUMBER1 =
            "Warrant number must be 8 characters. Ensure format is Xnnnnnnn or nnnnn/nn.";
    
    /** The Constant ERR_MSG_INVALID_WARRANT_NUMBER2. */
    public static final String ERR_MSG_INVALID_WARRANT_NUMBER2 =
            "The warrant number entered does not match a valid format.";
    
    /** The Constant ERR_MSG_WARRANT_EXISTS. */
    public static final String ERR_MSG_WARRANT_EXISTS =
            "Foreign warrant cannot be entered, a foreign warrant with the same warrant number already exists on this case, owned by this court.";

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

    /** The date date req received. */
    // Private field identifiers
    private String DATE_DATE_REQ_RECEIVED = "Header_DateRequestReceived";
    
    /** The sel warrant type. */
    private String SEL_WARRANT_TYPE = "Header_WarrantType";
    
    /** The text issuing court. */
    private String TEXT_ISSUING_COURT = "Header_IssuedByCourtCode";
    
    /** The text case number. */
    private String TEXT_CASE_NUMBER = "Header_CaseNumber";
    
    /** The text warrant number. */
    private String TEXT_WARRANT_NUMBER = "Header_WarrantNumber";
    
    /** The date home issue date. */
    private String DATE_HOME_ISSUE_DATE = "Header_IssueDate";
    
    /** The text party for code. */
    private String TEXT_PARTY_FOR_CODE = "Claimant_Code";
    
    /** The text party for name. */
    private String TEXT_PARTY_FOR_NAME = "Claimant_Name";
    
    /** The text party for rep code. */
    private String TEXT_PARTY_FOR_REP_CODE = "Solicitor_Code";
    
    /** The text party for rep name. */
    private String TEXT_PARTY_FOR_REP_NAME = "Solicitor_Name";
    
    /** The text party for rep adline1. */
    private String TEXT_PARTY_FOR_REP_ADLINE1 = "Solicitor_Address_Line1";
    
    /** The text party for rep adline2. */
    private String TEXT_PARTY_FOR_REP_ADLINE2 = "Solicitor_Address_Line2";
    
    /** The text party for rep adline3. */
    private String TEXT_PARTY_FOR_REP_ADLINE3 = "Solicitor_Address_Line3";
    
    /** The text party for rep adline4. */
    private String TEXT_PARTY_FOR_REP_ADLINE4 = "Solicitor_Address_Line4";
    
    /** The text party for rep adline5. */
    private String TEXT_PARTY_FOR_REP_ADLINE5 = "Solicitor_Address_Line5";
    
    /** The text party for rep postcode. */
    private String TEXT_PARTY_FOR_REP_POSTCODE = "Solicitor_Address_PostCode";
    
    /** The text party for rep dx. */
    private String TEXT_PARTY_FOR_REP_DX = "Solicitor_DX";
    
    /** The text party for rep tel. */
    private String TEXT_PARTY_FOR_REP_TEL = "Solicitor_TelephoneNumber";
    
    /** The text party for rep fax. */
    private String TEXT_PARTY_FOR_REP_FAX = "Solicitor_FaxNumber";
    
    /** The text party for rep email. */
    private String TEXT_PARTY_FOR_REP_EMAIL = "Solicitor_EmailAddress";
    
    /** The text party for rep reference. */
    private String TEXT_PARTY_FOR_REP_REFERENCE = "Solicitor_Reference";
    
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

    /** The btn save screen. */
    // Private button identifiers (Close defined in parent class)
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearButton";
    
    /** The btn details of warrant. */
    private String BTN_DETAILS_OF_WARRANT = "Footer_DetailsOfWarrantButton";
    
    /** The btn dets of warrant ok. */
    private String BTN_DETS_OF_WARRANT_OK = "WarrantDetails_OkButton";
    
    /** The btn dets of warrants cancel. */
    private String BTN_DETS_OF_WARRANTS_CANCEL = "WarrantDetails_CancelButton";

    /** The pop details of warrant. */
    // Private popup adaptor identifiers
    private String POP_DETAILS_OF_WARRANT = "Warrant_Details_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC030CreateForeignWarrantUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create Foreign Warrants";
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
     * Sets the warrant type.
     *
     * @param pWarrantType the new warrant type
     */
    public void setWarrantType (final String pWarrantType)
    {
        setSelectFieldValue (SEL_WARRANT_TYPE, pWarrantType);
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
     * Sets the issuing court code.
     *
     * @param pCourtCode the new issuing court code
     */
    public void setIssuingCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_ISSUING_COURT, pCourtCode);
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        setTextFieldValue (TEXT_CASE_NUMBER, pCaseNumber);
        cMB.waitForPageToLoad ();
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
     * Sets the warrant number.
     *
     * @param pWarrantNumber the new warrant number
     */
    public void setWarrantNumber (final String pWarrantNumber)
    {
        setTextFieldValue (TEXT_WARRANT_NUMBER, pWarrantNumber);
        cMB.waitForPageToLoad ();
    }

    /**
     * Checks if is warrant number valid.
     *
     * @return true, if is warrant number valid
     * @throws FrameworkException the framework exception
     */
    public boolean isWarrantNumberValid () throws FrameworkException
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
     * Sets the home issue date.
     *
     * @param pDate the new home issue date
     */
    public void setHomeIssueDate (final String pDate)
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_HOME_ISSUE_DATE);
        dA.setDate (pDate);
    }

    /**
     * Sets the party for code.
     *
     * @param pCode the new party for code
     */
    public void setPartyForCode (final String pCode)
    {
        setTextFieldValue (TEXT_PARTY_FOR_CODE, pCode);
    }

    /**
     * Checks if is party for code valid.
     *
     * @return true, if is party for code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPartyForCodeValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the party for name.
     *
     * @param pName the new party for name
     */
    public void setPartyForName (final String pName)
    {
        setTextFieldValue (TEXT_PARTY_FOR_NAME, pName);
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
     * Checks if is party for name read only.
     *
     * @return true, if is party for name read only
     * @throws FrameworkException the framework exception
     */
    public boolean isPartyForNameReadOnly () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_NAME);
        return tA.isReadOnly ();
    }

    /**
     * Sets the party for rep code.
     *
     * @param pCode the new party for rep code
     */
    public void setPartyForRepCode (final String pCode)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_CODE, pCode);
    }

    /**
     * Checks if is party for rep code valid.
     *
     * @return true, if is party for rep code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPartyForRepCodeValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the party for rep name.
     *
     * @param pName the new party for rep name
     */
    public void setPartyForRepName (final String pName)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_NAME, pName);
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
     * Checks if is party for rep name read only.
     *
     * @return true, if is party for rep name read only
     * @throws FrameworkException the framework exception
     */
    public boolean isPartyForRepNameReadOnly () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_NAME);
        return tA.isReadOnly ();
    }

    /**
     * Sets the party for rep adline 1.
     *
     * @param pAdline the new party for rep adline 1
     */
    public void setPartyForRepAdline1 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_ADLINE1, pAdline);
    }

    /**
     * Gets the party for rep adline 1.
     *
     * @return the party for rep adline 1
     */
    public String getPartyForRepAdline1 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_ADLINE1);
        return tA.getValue ();
    }

    /**
     * Sets the party for rep adline 2.
     *
     * @param pAdline the new party for rep adline 2
     */
    public void setPartyForRepAdline2 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_ADLINE2, pAdline);
    }

    /**
     * Gets the party for rep adline 2.
     *
     * @return the party for rep adline 2
     */
    public String getPartyForRepAdline2 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_ADLINE2);
        return tA.getValue ();
    }

    /**
     * Sets the party for rep adline 3.
     *
     * @param pAdline the new party for rep adline 3
     */
    public void setPartyForRepAdline3 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_ADLINE3, pAdline);
    }

    /**
     * Gets the party for rep adline 3.
     *
     * @return the party for rep adline 3
     */
    public String getPartyForRepAdline3 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_ADLINE3);
        return tA.getValue ();
    }

    /**
     * Sets the party for rep adline 4.
     *
     * @param pAdline the new party for rep adline 4
     */
    public void setPartyForRepAdline4 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_ADLINE4, pAdline);
    }

    /**
     * Gets the party for rep adline 4.
     *
     * @return the party for rep adline 4
     */
    public String getPartyForRepAdline4 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_ADLINE4);
        return tA.getValue ();
    }

    /**
     * Sets the party for rep adline 5.
     *
     * @param pAdline the new party for rep adline 5
     */
    public void setPartyForRepAdline5 (final String pAdline)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_ADLINE5, pAdline);
    }

    /**
     * Gets the party for rep adline 5.
     *
     * @return the party for rep adline 5
     */
    public String getPartyForRepAdline5 ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PARTY_FOR_REP_ADLINE5);
        return tA.getValue ();
    }

    /**
     * Sets the party for rep postcode.
     *
     * @param pPostcode the new party for rep postcode
     */
    public void setPartyForRepPostcode (final String pPostcode)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_POSTCODE, pPostcode);
    }

    /**
     * Sets the party for rep DX.
     *
     * @param pDX the new party for rep DX
     */
    public void setPartyForRepDX (final String pDX)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_DX, pDX);
    }

    /**
     * Sets the party for rep telephone.
     *
     * @param pTel the new party for rep telephone
     */
    public void setPartyForRepTelephone (final String pTel)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_TEL, pTel);
    }

    /**
     * Sets the party for rep fax.
     *
     * @param pFax the new party for rep fax
     */
    public void setPartyForRepFax (final String pFax)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_FAX, pFax);
    }

    /**
     * Sets the party for rep email.
     *
     * @param pEmail the new party for rep email
     */
    public void setPartyForRepEmail (final String pEmail)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_EMAIL, pEmail);
    }

    /**
     * Sets the party for rep reference.
     *
     * @param pReference the new party for rep reference
     */
    public void setPartyForRepReference (final String pReference)
    {
        setTextFieldValue (TEXT_PARTY_FOR_REP_REFERENCE, pReference);
    }

    /**
     * Sets the party against one name.
     *
     * @param pName the new party against one name
     */
    public void setPartyAgainstOneName (final String pName)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST1_NAME, pName);
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
     * Sets the party against two name.
     *
     * @param pName the new party against two name
     */
    public void setPartyAgainstTwoName (final String pName)
    {
        setTextFieldValue (TEXT_PARTY_AGAINST2_NAME, pName);
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
     * Clicks the Cancel button on the Details of Warrant popup.
     */
    public void clickDetailsOfWarrantPopupCancel ()
    {
        mClickButton (BTN_DETS_OF_WARRANTS_CANCEL);
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
            warrantNumber = tempString.substring (tempString.length () - 9, tempString.length () - 1).trim ();
        }

        return warrantNumber;
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