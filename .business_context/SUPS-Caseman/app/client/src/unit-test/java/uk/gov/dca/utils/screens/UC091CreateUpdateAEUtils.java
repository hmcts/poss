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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Manage AE screen.
 *
 * Date: 09-Jun-2009
 */
public class UC091CreateUpdateAEUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_AE_NUMBER_1. */
    public static final String ERR_MSG_INVALID_AE_NUMBER_1 =
            "The AE Number entered does not match any recognised pattern.";
    
    /** The Constant ERR_MSG_INVALID_AE_NUMBER_2. */
    public static final String ERR_MSG_INVALID_AE_NUMBER_2 = "The court referred to in AE Number is not in service";
    
    /** The Constant ERR_MSG_INVALID_AE_NUMBER_3. */
    public static final String ERR_MSG_INVALID_AE_NUMBER_3 = "AE number already exists.";

    /** The text case number. */
    // Private Text Field Identifiers
    private String TEXT_CASE_NUMBER = "Header_Case_Number";
    
    /** The sel judgment creditor. */
    private String SEL_JUDGMENT_CREDITOR = "Header_Party_For";
    
    /** The sel judgment debtor. */
    private String SEL_JUDGMENT_DEBTOR = "Header_Party_Against";
    
    /** The chk existing case. */
    private String CHK_EXISTING_CASE = "AEDetails_Exisiting_Case";
    
    /** The text ae number. */
    private String TEXT_AE_NUMBER = "AEDetails_AENumber";
    
    /** The text ae type code. */
    private String TEXT_AE_TYPE_CODE = "AEDetails_Application_Type_Code";
    
    /** The text amount of ae. */
    private String TEXT_AMOUNT_OF_AE = "Fee_Amount_Of_AE";
    
    /** The text ae fee. */
    private String TEXT_AE_FEE = "Fee_Fee";
    
    /** The text ae fee total. */
    private String TEXT_AE_FEE_TOTAL = "Fee_Total";
    
    /** The text ae other fees. */
    private String TEXT_AE_OTHER_FEES = "Fee_Other_Fees";
    
    /** The text payments to date. */
    private String TEXT_PAYMENTS_TO_DATE = "Fee_Payment_To_Date";
    
    /** The text total remaining. */
    private String TEXT_TOTAL_REMAINING = "Fee_Total_Remaining";
    
    /** The text caps id. */
    private String TEXT_CAPS_ID = "AEDetails_Caps_Id";
    
    /** The text check digit. */
    private String TEXT_CHECK_DIGIT = "AEDetails_Caps_Check";
    
    /** The date of issue. */
    private String DATE_OF_ISSUE = "AEDetails_Date_Of_Issue";

    /** The text occupation. */
    private String TEXT_OCCUPATION = "Employer_Occupation";
    
    /** The text payroll number. */
    private String TEXT_PAYROLL_NUMBER = "Employer_Payroll_No";
    
    /** The text named person. */
    private String TEXT_NAMED_PERSON = "Employer_Named_Person";
    
    /** The text employer name. */
    private String TEXT_EMPLOYER_NAME = "Employer_Name";
    
    /** The chk employer welsh. */
    private String CHK_EMPLOYER_WELSH = "Employer_TranslationToWelsh";

    /** The btn existing aes. */
    // Private Button Field Identifiers
    private String BTN_EXISTING_AES = "AEDetails_ExistingAEsLovBtn";
    
    /** The btn add address. */
    private String BTN_ADD_ADDRESS = "Add_AddressBtn";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveBtn";
    
    /** The btn clear screen. */
    private String BTN_CLEAR_SCREEN = "Status_ClearBtn";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The sub add address. */
    // Private Popup adaptor Identifiers
    private String SUB_ADD_ADDRESS = "addNewAddress_subform";
    
    /** The sub add emp address. */
    private String SUB_ADD_EMP_ADDRESS = "addNewEmpAddress_subform";

    /** The tabbed area id. */
    // Tabbed Page Identifiers
    private String TABBED_AREA_ID = "Address_Tabbed_Area";
    
    /** The tab service page. */
    private String TAB_SERVICE_PAGE = "SERVICE";
    
    /** The tab sub service page. */
    private String TAB_SUB_SERVICE_PAGE = "SUBSERV";
    
    /** The tab employer page. */
    private String TAB_EMPLOYER_PAGE = "EMPLOYER";
    
    /** The tab work page. */
    private String TAB_WORK_PAGE = "WORKPLACE";

    /** The txt newaddress adline1. */
    // Add AE Address Subform Fields
    private String TXT_NEWADDRESS_ADLINE1 = "AddAddress_ContactDetails_Address_Line1";
    
    /** The txt newaddress adline2. */
    private String TXT_NEWADDRESS_ADLINE2 = "AddAddress_ContactDetails_Address_Line2";
    
    /** The txt newaddress adline3. */
    private String TXT_NEWADDRESS_ADLINE3 = "AddAddress_ContactDetails_Address_Line3";
    
    /** The txt newaddress adline4. */
    private String TXT_NEWADDRESS_ADLINE4 = "AddAddress_ContactDetails_Address_Line4";
    
    /** The txt newaddress adline5. */
    private String TXT_NEWADDRESS_ADLINE5 = "AddAddress_ContactDetails_Address_Line5";
    
    /** The txt newaddress postcode. */
    private String TXT_NEWADDRESS_POSTCODE = "AddAddress_ContactDetails_Address_Postcode";
    
    /** The btn newaddress ok. */
    private String BTN_NEWADDRESS_OK = "AddAddress_OkButton";

    /** The txt emp newaddress adline1. */
    // Add AE Employer Address Subform Fields
    private String TXT_EMP_NEWADDRESS_ADLINE1 = "AddAddress_ContactDetails_Address_Line1";
    
    /** The txt emp newaddress adline2. */
    private String TXT_EMP_NEWADDRESS_ADLINE2 = "AddAddress_ContactDetails_Address_Line2";
    
    /** The txt emp newaddress adline3. */
    private String TXT_EMP_NEWADDRESS_ADLINE3 = "AddAddress_ContactDetails_Address_Line3";
    
    /** The txt emp newaddress adline4. */
    private String TXT_EMP_NEWADDRESS_ADLINE4 = "AddAddress_ContactDetails_Address_Line4";
    
    /** The txt emp newaddress adline5. */
    private String TXT_EMP_NEWADDRESS_ADLINE5 = "AddAddress_ContactDetails_Address_Line5";
    
    /** The txt emp newaddress postcode. */
    private String TXT_EMP_NEWADDRESS_POSTCODE = "AddAddress_ContactDetails_Address_Postcode";
    
    /** The txt emp newaddress reference. */
    private String TXT_EMP_NEWADDRESS_REFERENCE = "AddAddress_ContactDetails_Address_Reference";
    
    /** The btn emp newaddress ok. */
    private String BTN_EMP_NEWADDRESS_OK = "AddAddress_OkButton";

    /** The Constant BTN_NAV_AE_SCREEN. */
    // Static variables representing the Navigation Buttons
    public static final String BTN_NAV_AE_SCREEN = "NavBar_AeEventsButton";
    
    /** The Constant BTN_NAV_CASES_SCREEN. */
    public static final String BTN_NAV_CASES_SCREEN = "NavBar_CaseEventsButton";
    
    /** The Constant BTN_NAV_EVENTS_SCREEN. */
    public static final String BTN_NAV_EVENTS_SCREEN = "NavBar_ManageCaseButton";
    
    /** The Constant BTN_NAV_PER_SCREEN. */
    public static final String BTN_NAV_PER_SCREEN = "NavBar_JudgmentsButton";
    
    /** The Constant BTN_NAV_QUERY_SCREEN. */
    public static final String BTN_NAV_QUERY_SCREEN = "NavBar_QueryAEButton";

    /** The Constant AE_TABBED_PAGE_SERVICE. */
    // Static constants representing different AE tabbed pages
    public static final int AE_TABBED_PAGE_SERVICE = 1;
    
    /** The Constant AE_TABBED_PAGE_SUB_SERVICE. */
    public static final int AE_TABBED_PAGE_SUB_SERVICE = 2;
    
    /** The Constant AE_TABBED_PAGE_EMPLOYER. */
    public static final int AE_TABBED_PAGE_EMPLOYER = 3;
    
    /** The Constant AE_TABBED_PAGE_WORK. */
    public static final int AE_TABBED_PAGE_WORK = 4;

    /** The Constant AE_TYPE_JD. */
    // Static constants representing different AE Types
    public static final String AE_TYPE_JD = "JD";
    
    /** The Constant AE_TYPE_MN. */
    public static final String AE_TYPE_MN = "MN";
    
    /** The Constant AE_TYPE_PM. */
    public static final String AE_TYPE_PM = "PM";

    /** The new address subform. */
    // Private subform adaptor objects
    private SubFormAdaptor newAddressSubform = null;
    
    /** The new emp address subform. */
    private SubFormAdaptor newEmpAddressSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC091CreateUpdateAEUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create and Update Application Details";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CASE_NUMBER);
        tA.type (pCaseNumber);
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
     * Sets the judgment creditor.
     *
     * @param pJudgCred the new judgment creditor
     */
    public void setJudgmentCreditor (final String pJudgCred)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_JUDGMENT_CREDITOR);
        sA.clickLabel (pJudgCred);
    }

    /**
     * Sets the judgment debtor.
     *
     * @param pJudgDebtor the new judgment debtor
     */
    public void setJudgmentDebtor (final String pJudgDebtor)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_JUDGMENT_DEBTOR);
        sA.clickLabel (pJudgDebtor);
    }

    /**
     * Sets the existing case checkbox.
     *
     * @param checked the new existing case checkbox
     */
    public void setExistingCaseCheckbox (final boolean checked)
    {
        setCheckboxFieldValue (CHK_EXISTING_CASE, checked);
    }

    /**
     * Sets the AE number.
     *
     * @param aeNumber the new AE number
     */
    public void setAENumber (final String aeNumber)
    {
        setTextFieldValue (TEXT_AE_NUMBER, aeNumber);
    }

    /**
     * Checks if is AE number valid.
     *
     * @return true, if is AE number valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAENumberValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_NUMBER);
        return tA.isValid ();
    }

    /**
     * Gets the AE number.
     *
     * @return the AE number
     */
    public String getAENumber ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_NUMBER);
        return tA.getValue ();
    }

    /**
     * Sets focus in the AE Number field.
     */
    public void setFocusInAENumber ()
    {
        cMB.setFocus (TEXT_AE_NUMBER);
    }

    /**
     * Gets the AE type value.
     *
     * @return the AE type value
     */
    public String getAETypeValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_TYPE_CODE);
        return tA.getValue ();
    }

    /**
     * Sets the AE type.
     *
     * @param pAEType the new AE type
     */
    public void setAEType (final String pAEType)
    {
        setTextFieldValue (TEXT_AE_TYPE_CODE, pAEType);
    }

    /**
     * Sets the amount of AE.
     *
     * @param pAmount the new amount of AE
     */
    public void setAmountOfAE (final String pAmount)
    {
        setTextFieldValue (TEXT_AMOUNT_OF_AE, pAmount);
    }

    /**
     * Gets the amount of AE.
     *
     * @return the amount of AE
     */
    public String getAmountOfAE ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_AE);
        return tA.getValue ();
    }

    /**
     * Checks if is amount of AE valid.
     *
     * @return true, if is amount of AE valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAmountOfAEValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AMOUNT_OF_AE);
        return tA.isValid ();
    }

    /**
     * Sets the AE fee.
     *
     * @param pFee the new AE fee
     */
    public void setAEFee (final String pFee)
    {
        cMB.type (TEXT_AE_FEE, pFee);

        // Handle any warning messages
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Gets the AE fee.
     *
     * @return the AE fee
     */
    public String getAEFee ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_FEE);
        return tA.getValue ();
    }

    /**
     * Checks if is AE fee valid.
     *
     * @return true, if is AE fee valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAEFeeValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_FEE);
        return tA.isValid ();
    }

    /**
     * Gets the AE balance total.
     *
     * @return the AE balance total
     */
    public String getAEBalanceTotal ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_FEE_TOTAL);
        return tA.getValue ();
    }

    /**
     * Checks if is AE balance valid.
     *
     * @return true, if is AE balance valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAEBalanceValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_FEE_TOTAL);
        return tA.isValid ();
    }

    /**
     * Gets the other fees.
     *
     * @return the other fees
     */
    public String getOtherFees ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_OTHER_FEES);
        return tA.getValue ();
    }

    /**
     * Checks if is other fees valid.
     *
     * @return true, if is other fees valid
     * @throws FrameworkException the framework exception
     */
    public boolean isOtherFeesValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_AE_OTHER_FEES);
        return tA.isValid ();
    }

    /**
     * Gets the payments to date.
     *
     * @return the payments to date
     */
    public String getPaymentsToDate ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PAYMENTS_TO_DATE);
        return tA.getValue ();
    }

    /**
     * Checks if is payments to date valid.
     *
     * @return true, if is payments to date valid
     * @throws FrameworkException the framework exception
     */
    public boolean isPaymentsToDateValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_PAYMENTS_TO_DATE);
        return tA.isValid ();
    }

    /**
     * Gets the total remaining.
     *
     * @return the total remaining
     */
    public String getTotalRemaining ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_TOTAL_REMAINING);
        return tA.getValue ();
    }

    /**
     * Checks if is total remaining valid.
     *
     * @return true, if is total remaining valid
     * @throws FrameworkException the framework exception
     */
    public boolean isTotalRemainingValid () throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_TOTAL_REMAINING);
        return tA.isValid ();
    }

    /**
     * Sets the CAPS id.
     *
     * @param pId the new CAPS id
     */
    public void setCAPSId (final String pId)
    {
        setTextFieldValue (TEXT_CAPS_ID, pId);
    }

    /**
     * Sets the check digit.
     *
     * @param pDigit the new check digit
     */
    public void setCheckDigit (final String pDigit)
    {
        setTextFieldValue (TEXT_CHECK_DIGIT, pDigit);
    }

    /**
     * Sets the date of issue.
     *
     * @param pDate the new date of issue
     */
    public void setDateOfIssue (final String pDate)
    {
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_OF_ISSUE);
        dA.setDate (pDate);
    }

    /**
     * Sets the occupation.
     *
     * @param pOccupation the new occupation
     */
    public void setOccupation (final String pOccupation)
    {
        setTextFieldValue (TEXT_OCCUPATION, pOccupation);
    }

    /**
     * Sets the named person.
     *
     * @param pName the new named person
     */
    public void setNamedPerson (final String pName)
    {
        setTextFieldValue (TEXT_NAMED_PERSON, pName);
    }

    /**
     * Sets the payroll number.
     *
     * @param pPayrollNo the new payroll number
     */
    public void setPayrollNumber (final String pPayrollNo)
    {
        setTextFieldValue (TEXT_PAYROLL_NUMBER, pPayrollNo);
    }

    /**
     * Sets the employer name.
     *
     * @param pName the new employer name
     * @throws FrameworkException the framework exception
     */
    public void setEmployerName (final String pName) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_EMPLOYER);

        setTextFieldValue (TEXT_EMPLOYER_NAME, pName);
    }

    /**
     * Sets the employer trans welsh.
     *
     * @param checked the new employer trans welsh
     * @throws FrameworkException the framework exception
     */
    public void setEmployerTransWelsh (final boolean checked) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_EMPLOYER);
        setCheckboxFieldValue (CHK_EMPLOYER_WELSH, checked);
    }

    /**
     * Selects a specified tabbed page on the Maintain AE screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void selectTabbedPage (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (TABBED_AREA_ID);
        switch (page)
        {
            case AE_TABBED_PAGE_SUB_SERVICE:
                tAA.showPage (TAB_SUB_SERVICE_PAGE);
                break;
            case AE_TABBED_PAGE_EMPLOYER:
                tAA.showPage (TAB_EMPLOYER_PAGE);
                break;
            case AE_TABBED_PAGE_WORK:
                tAA.showPage (TAB_WORK_PAGE);
                break;
            case AE_TABBED_PAGE_SERVICE:
            default:
                tAA.showPage (TAB_SERVICE_PAGE);
                break;
        }
    }

    /**
     * Clicks the Save Screen Button.
     */
    public void saveScreen ()
    {
        mClickButton (BTN_SAVE_SCREEN);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the Clear Screen Button.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR_SCREEN);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the AE Exists Button.
     */
    public void loadExistingAE ()
    {
        mClickButton (BTN_EXISTING_AES);
        cMB.waitForPageToLoad ();
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
     * Clicks the Add Servuce Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addServiceAddress (final String adline1, final String adline2, final String adline3,
                                   final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_SERVICE);

        // Click the Add Service Address button
        mClickButton (BTN_ADD_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * Clicks the Add Substituted Service Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addSubServiceAddress (final String adline1, final String adline2, final String adline3,
                                      final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_SUB_SERVICE);

        // Click the Add Substituted Service Address button
        mClickButton (BTN_ADD_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * Clicks the Add Work Place Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addWorkplaceAddress (final String adline1, final String adline2, final String adline3,
                                     final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_WORK);

        // Click the Add Workplace Address button
        mClickButton (BTN_ADD_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * The add address subform is used for several different addresses (e.g. Debtor, Employer).
     * This private method allows the different Add Address buttons to call a common method to
     * set the address fields in the subform.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    private void addGenericNewAddress (final String adline1, final String adline2, final String adline3,
                                       final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Set the subform adaptor object
        if (null == newAddressSubform)
        {
            newAddressSubform = cMB.getSubFormAdaptor (SUB_ADD_ADDRESS);
        }

        if (newAddressSubform.isVisible ())
        {
            // If the subform is visible, set the address lines and click Ok
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_ADLINE1)).type (adline1);
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_ADLINE2)).type (adline2);
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_ADLINE3)).type (adline3);
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_ADLINE4)).type (adline4);
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_ADLINE5)).type (adline5);
            ((TextInputAdaptor) newAddressSubform.getAdaptor (TXT_NEWADDRESS_POSTCODE)).type (postcode);
            ((ButtonAdaptor) newAddressSubform.getAdaptor (BTN_NEWADDRESS_OK)).click ();
        }
    }

    /**
     * Clicks the Add Amployer Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @param reference Address Reference
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void addNewEmployerAddress (final String adline1, final String adline2, final String adline3,
                                       final String adline4, final String adline5, final String postcode,
                                       final String reference)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC091CreateUpdateAEUtils.AE_TABBED_PAGE_EMPLOYER);

        // Click the Add Employer Address button
        mClickButton (BTN_ADD_ADDRESS);

        // Set the subform adaptor object
        if (null == newEmpAddressSubform)
        {
            newEmpAddressSubform = cMB.getSubFormAdaptor (SUB_ADD_EMP_ADDRESS);
        }

        if (newEmpAddressSubform.isVisible ())
        {
            // If the subform is visible, set the address lines and click Ok
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_ADLINE1)).type (adline1);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_ADLINE2)).type (adline2);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_ADLINE3)).type (adline3);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_ADLINE4)).type (adline4);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_ADLINE5)).type (adline5);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_POSTCODE)).type (postcode);
            ((TextInputAdaptor) newEmpAddressSubform.getAdaptor (TXT_EMP_NEWADDRESS_REFERENCE)).type (reference);
            ((ButtonAdaptor) newEmpAddressSubform.getAdaptor (BTN_EMP_NEWADDRESS_OK)).click ();
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

    /**
     * Clicks the Save button to add a new AE. This then handles the AE created alert popup
     * and then navigates to the Variable Data screen for the Oracle Report which can be one
     * of two different reports (and variable data screens) based upon the AE Type.
     */
    public void saveAndHandleVariableDataScreen ()
    {
        // Get the AE Type before click Save
        final String aeType = getAETypeValue ();

        // Click Save Button
        mClickButton (BTN_SAVE_SCREEN);

        // Handle AE created alert
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }

        final String vdScreenTitle;
        final LinkedList<VariableDataQuestion> vdScreenQuestions = new LinkedList<VariableDataQuestion> ();
        if (aeType.equals (UC091CreateUpdateAEUtils.AE_TYPE_JD))
        {
            // Judgment Debt variable data screen
            // Setup the variable data screen questions
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("IsDebtorMaleOrFemale",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "MALE", cMB);
            vdScreenQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 = new VariableDataQuestion ("JudgementOrOrder",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "JUDGMENT", cMB);
            vdScreenQuestions.add (vdQ2);

            vdScreenTitle = "Notice of Application for Attachment of Earnings Order";
        }
        else if (aeType.equals (UC091CreateUpdateAEUtils.AE_TYPE_MN) ||
                aeType.equals (UC091CreateUpdateAEUtils.AE_TYPE_PM))
        {
            // Maintenance AE variable data screen
            // Setup the variable data screen questions
            final VariableDataQuestion vdQ1 = new VariableDataQuestion ("IsDebtorMaleOrFemale",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "MALE", cMB);
            vdScreenQuestions.add (vdQ1);

            final VariableDataQuestion vdQ2 =
                    new VariableDataQuestion ("DateOfHearing", VariableDataQuestion.VD_FIELD_TYPE_DATEPICKER,
                            AbstractBaseUtils.getFutureDate (7, AbstractBaseUtils.DATE_FORMAT_NOW, false), cMB);
            vdScreenQuestions.add (vdQ2);

            final VariableDataQuestion vdQ3 =
                    new VariableDataQuestion ("TimeOfHearing", VariableDataQuestion.VD_FIELD_TYPE_TEXT, "12:00", cMB);
            vdScreenQuestions.add (vdQ3);

            final VariableDataQuestion vdQ4 = new VariableDataQuestion ("HearingAtThisOfficeAddress",
                    VariableDataQuestion.VD_FIELD_TYPE_SELECT, "YES", cMB);
            vdScreenQuestions.add (vdQ4);

            vdScreenTitle = "N55A Notice Of Application (Maintenance)";
        }
        else
        {
            // MAGISTRATES AE, navigates back to Create Cases screen, no variable data
            return;
        }

        // Loop until have arrived on the variable data screen
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
        String pageTitle = cMB.getPageTitle ();
        while (pageTitle.indexOf (vdScreenTitle) == -1)
        {
            cMB.waitForPageToLoad ();
            if (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
            }
            pageTitle = cMB.getPageTitle ();
        }

        // When on variable data screen, deal with the question list provided in
        VariableDataQuestion vdQuestion;
        for (Iterator<VariableDataQuestion> i = vdScreenQuestions.iterator (); i.hasNext ();)
        {
            vdQuestion = (VariableDataQuestion) i.next ();
            vdQuestion.setQuestionValue ();
        }

        // Click Save on the Variable Data screen
        mClickButton (VARIABLE_DATA_SAVE_BUTTON);

        // Loop until are back in Maintain AE screen
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