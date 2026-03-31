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
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Mark Groen
 * Date: 17-Feb-2010
 * Time: 15:45:30.
 */
public class UC108MaintainDebtUtils extends AbstractBaseScreenUtils
{

    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";

    /** The sel debt status. */
    // Private Text Field Identifiers Maintain Debt
    private String SEL_DEBT_STATUS = "MaintainDebt_Status";
    
    /** The txt debt amount. */
    private String TXT_DEBT_AMOUNT = "MaintainDebt_AmountAllowed";
    
    /** The txt debt cred code. */
    private String TXT_DEBT_CRED_CODE = "MaintainDebt_CreditorCode";
    
    /** The txt debt cred name. */
    private String TXT_DEBT_CRED_NAME = "MaintainDebt_CreditorName";
    
    /** The txt debt payee code. */
    private String TXT_DEBT_PAYEE_CODE = "MaintainDebt_PayeeCode";
    
    /** The txt debt payee name. */
    private String TXT_DEBT_PAYEE_NAME = "MaintainDebt_PayeeName";

    /** The sel add debt status. */
    // Private text field identifiers Add Debt
    private String SEL_ADD_DEBT_STATUS = "AddDebt_Status";
    
    /** The txt add debt amount. */
    private String TXT_ADD_DEBT_AMOUNT = "AddDebt_AmountAllowed";
    
    /** The txt add debt caseno. */
    private String TXT_ADD_DEBT_CASENO = "AddDebt_CaseNumber";
    
    /** The txt add debt cred code. */
    private String TXT_ADD_DEBT_CRED_CODE = "AddDebt_CreditorCode";
    
    /** The txt add debt cred name. */
    private String TXT_ADD_DEBT_CRED_NAME = "AddDebt_CreditorName";
    
    /** The txt add debt cred adline1. */
    private String TXT_ADD_DEBT_CRED_ADLINE1 = "AddDebt_Creditor_Address_Line1";
    
    /** The txt add debt cred adline2. */
    private String TXT_ADD_DEBT_CRED_ADLINE2 = "AddDebt_Creditor_Address_Line2";
    
    /** The txt add debt cred adline3. */
    private String TXT_ADD_DEBT_CRED_ADLINE3 = "AddDebt_Creditor_Address_Line3";
    
    /** The txt add debt cred adline4. */
    private String TXT_ADD_DEBT_CRED_ADLINE4 = "AddDebt_Creditor_Address_Line4";
    
    /** The txt add debt cred adline5. */
    private String TXT_ADD_DEBT_CRED_ADLINE5 = "AddDebt_Creditor_Address_Line5";
    
    /** The txt add debt cred postcode. */
    private String TXT_ADD_DEBT_CRED_POSTCODE = "AddDebt_Creditor_Address_Postcode";
    
    /** The txt add debt payee code. */
    private String TXT_ADD_DEBT_PAYEE_CODE = "AddDebt_PayeeCode";
    
    /** The txt add debt payee name. */
    private String TXT_ADD_DEBT_PAYEE_NAME = "AddDebt_PayeeName";
    
    /** The txt add debt payee adline1. */
    private String TXT_ADD_DEBT_PAYEE_ADLINE1 = "AddDebt_Payee_Address_Line1";
    
    /** The txt add debt payee adline2. */
    private String TXT_ADD_DEBT_PAYEE_ADLINE2 = "AddDebt_Payee_Address_Line2";
    
    /** The txt add debt payee adline3. */
    private String TXT_ADD_DEBT_PAYEE_ADLINE3 = "AddDebt_Payee_Address_Line3";
    
    /** The txt add debt payee adline4. */
    private String TXT_ADD_DEBT_PAYEE_ADLINE4 = "AddDebt_Payee_Address_Line4";
    
    /** The txt add debt payee adline5. */
    private String TXT_ADD_DEBT_PAYEE_ADLINE5 = "AddDebt_Payee_Address_Line5";
    
    /** The txt add debt payee postcode. */
    private String TXT_ADD_DEBT_PAYEE_POSTCODE = "AddDebt_Payee_Address_Postcode";

    /** The txt newaddress adline1. */
    // Add CO Address Subform Fields
    private String TXT_NEWADDRESS_ADLINE1 = "AddCoAddress_Subform_Address_Line1";
    
    /** The txt newaddress adline2. */
    private String TXT_NEWADDRESS_ADLINE2 = "AddCoAddress_Subform_Address_Line2";
    
    /** The txt newaddress adline3. */
    private String TXT_NEWADDRESS_ADLINE3 = "AddCoAddress_Subform_Address_Line3";
    
    /** The txt newaddress adline4. */
    private String TXT_NEWADDRESS_ADLINE4 = "AddCoAddress_Subform_Address_Line4";
    
    /** The txt newaddress adline5. */
    private String TXT_NEWADDRESS_ADLINE5 = "AddCoAddress_Subform_Address_Line5";
    
    /** The txt newaddress postcode. */
    private String TXT_NEWADDRESS_POSTCODE = "AddCoAddress_Subform_Address_Postcode";
    
    /** The btn newaddress ok. */
    private String BTN_NEWADDRESS_OK = "AddAddress_OKBtn";

    /** The sub add debt. */
    // Private subform identifiers
    private String SUB_ADD_DEBT = "AddDebt_SubForm";
    
    /** The pop new address. */
    private String POP_NEW_ADDRESS = "addCoAddress_subform";

    /** The btn add debt. */
    // Private Button Field Identifiers
    private String BTN_ADD_DEBT = "MaintainDebt_AddDebtBtn";
    
    /** The btn maintain debt ok. */
    private String BTN_MAINTAIN_DEBT_OK = "Status_MaintainDebtOk";
    
    /** The btn maintain debt cancel. */
    private String BTN_MAINTAIN_DEBT_CANCEL = "Status_MaintainDebtCancel";
    
    /** The btn add debt ok. */
    private String BTN_ADD_DEBT_OK = "AddDebt_OKBtn";
    
    /** The btn add creditor address. */
    private String BTN_ADD_CREDITOR_ADDRESS = "MaintainDebt_CreditorAddAddressBtn";
    
    /** The btn add payee address. */
    private String BTN_ADD_PAYEE_ADDRESS = "MaintainDebt_PayeeAddAddressBtn";
    
    /** The btn select creditor ok. */
    private String BTN_SELECT_CREDITOR_OK = "AddCreditorFromCase_Popup_OKBtn";

    /** The grid maintain debts. */
    // Private grid identifiers
    private String GRID_MAINTAIN_DEBTS = "MaintainDebt_DebtGrid";
    
    /** The grid select creditor. */
    private String GRID_SELECT_CREDITOR = "AddDebt_SelectCreditorFromCaseGrid";

    /** The add debt tabbed area id. */
    // Tabbed Page Identifiers
    private String ADD_DEBT_TABBED_AREA_ID = "COAddDebtTabbedArea";
    
    /** The add debt tab creditor page. */
    private String ADD_DEBT_TAB_CREDITOR_PAGE = "TabAddDebtCreditor";
    
    /** The add debt tab payee page. */
    private String ADD_DEBT_TAB_PAYEE_PAGE = "TabAddDebtPayee";

    /** The debt tabbed area id. */
    private String DEBT_TABBED_AREA_ID = "CODebtTabbedArea";
    
    /** The debt tab creditor page. */
    private String DEBT_TAB_CREDITOR_PAGE = "TabCreditorAdd";
    
    /** The debt tab payee page. */
    private String DEBT_TAB_PAYEE_PAGE = "TabPayeeAdd";

    /** The pop select creditor. */
    // Private popup identifiers
    private String POP_SELECT_CREDITOR = "MaintainDebt_AddCreditorFromCasePopup";

    /** The new add debt subform. */
    // Private subform objects
    private SubFormAdaptor newAddDebtSubform = null;
    
    /** The new address subform. */
    private SubFormAdaptor newAddressSubform = null;

    /** The Constant DEBT_STATUS_PENDING. */
    // Static constants representing different Debt Status
    public static final String DEBT_STATUS_PENDING = "PENDING";
    
    /** The Constant DEBT_STATUS_LIVE. */
    public static final String DEBT_STATUS_LIVE = "LIVE";
    
    /** The Constant DEBT_STATUS_SCHEDULE_TWO. */
    public static final String DEBT_STATUS_SCHEDULE_TWO = "SCHEDULE2";

    /** The Constant DEBT_TABBED_PAGE_CREDITOR. */
    // Static constants representing different Debt tabbed pages
    public static final int DEBT_TABBED_PAGE_CREDITOR = 1;
    
    /** The Constant DEBT_TABBED_PAGE_PAYEE. */
    public static final int DEBT_TABBED_PAGE_PAYEE = 2;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC108MaintainDebtUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Debt";
    }

    /**
     * Clicks the Create Co Buttonn Button.
     */
    public void clickAddDebtButton ()
    {
        if (null == newAddDebtSubform)
        {
            newAddDebtSubform = cMB.getSubFormAdaptor (SUB_ADD_DEBT);
        }
        mClickButton (BTN_ADD_DEBT);

    }

    /**
     * Clicks the Maintain Debts Ok Button.
     */
    public void clickOkMaintainDebtButton ()
    {
        mClickButton (BTN_MAINTAIN_DEBT_OK);
    }

    /**
     * Clicks the Maintain Debts Cancel Button.
     */
    public void clickCancelMaintainDebtButton ()
    {
        mClickButton (BTN_MAINTAIN_DEBT_CANCEL);
    }

    /**
     * Sets the adds the debt status.
     *
     * @param pStatus the new adds the debt status
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtStatus (final String pStatus) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            ((SelectElementAdaptor) newAddDebtSubform.getAdaptor (SEL_ADD_DEBT_STATUS)).clickValue (pStatus);
        }
    }

    /**
     * Sets the adds the debt amount.
     *
     * @param pAmount the new adds the debt amount
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtAmount (final String pAmount) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_AMOUNT)).type (pAmount);
        }
    }

    /**
     * Sets the Add Debt Case Number field and then selects a party from the case to be a creditor
     * on the Debt.
     *
     * @param pCaseNo The new value for the Add Debt Case Number field
     * @param pCredName The name of the party on the Case to be selected as Creditor
     * @throws FrameworkException Exception thrown if problem accessing the subform adaptor
     */
    public void setAddDebtCaseNumber (final String pCaseNo, final String pCredName) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Set the Case Number
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CASENO)).type (pCaseNo);
            cMB.waitForPageToLoad ();

            final PopupAdaptor pA = (PopupAdaptor) newAddDebtSubform.getAdaptor (POP_SELECT_CREDITOR);
            if (pA.isVisible ())
            {
                // Popup visible, select the Creditor specified in the grid
                selectValueFromSubformGrid (newAddDebtSubform, GRID_SELECT_CREDITOR, pCredName, 3);
                ((ButtonAdaptor) newAddDebtSubform.getAdaptor (BTN_SELECT_CREDITOR_OK)).click ();
                cMB.waitForPageToLoad ();
            }
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
        boolean blnValid = false;
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            blnValid = ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CASENO)).isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the cursor focus in the Case Number field.
     *
     * @throws FrameworkException Thrown if problem accessing the object
     */
    public void setCaseNumberFocus () throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CASENO);
            tA.focus ();
        }
    }

    /**
     * Gets the debt status.
     *
     * @return the debt status
     */
    public String getDebtStatus ()
    {
        // return value
        String status = "";

        try
        {

            if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
            {
                final SelectElementAdaptor sA =
                        (SelectElementAdaptor) newAddDebtSubform.getAdaptor (SEL_ADD_DEBT_STATUS);
                status = sA.getSelectedValue ();
            }

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
        }

        return status;
    }

    /**
     * Selects a specified tabbed page on the Consolidated Order screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException the framework exception
     */
    public void selectAddDebtTabbedPage (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = (TabbedAreaAdaptor) newAddDebtSubform.getAdaptor (ADD_DEBT_TABBED_AREA_ID);
        switch (page)
        {
            case DEBT_TABBED_PAGE_PAYEE:
                tAA.showPage (ADD_DEBT_TAB_PAYEE_PAGE);
                break;
            case DEBT_TABBED_PAGE_CREDITOR:
            default:
                tAA.showPage (ADD_DEBT_TAB_CREDITOR_PAGE);
                break;
        }
    }

    /**
     * Selects a specified tabbed page on the Consolidated Order screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void selectDebtTabbedPage (final int page) throws FrameworkException
    {

        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (DEBT_TABBED_AREA_ID);
        switch (page)
        {
            case DEBT_TABBED_PAGE_PAYEE:
                tAA.showPage (DEBT_TAB_PAYEE_PAGE);
                break;
            case DEBT_TABBED_PAGE_CREDITOR:
            default:
                tAA.showPage (DEBT_TAB_CREDITOR_PAGE);
                break;
        }
    }

    /**
     * Sets the adds the debt creditor code.
     *
     * @param pCode the new adds the debt creditor code
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorCode (final String pCode) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_CODE)).type (pCode);
        }
    }

    /**
     * Checks if is adds the debt creditor code valid.
     *
     * @return true, if is adds the debt creditor code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAddDebtCreditorCodeValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            blnValid = ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_CODE)).isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the cursor focus in the Add Debt creditor Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setAddDebtCreditorCodeFocus () throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            final TextInputAdaptor tA = (TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_CODE);
            tA.focus ();
        }
    }

    /**
     * Sets the adds the debt creditor name.
     *
     * @param pName the new adds the debt creditor name
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorName (final String pName) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_NAME)).type (pName);
        }
    }

    /**
     * Gets the adds the debt creditor name.
     *
     * @return the adds the debt creditor name
     * @throws FrameworkException the framework exception
     */
    public String getAddDebtCreditorName () throws FrameworkException
    {
        String retValue = "";
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            final TextInputAdaptor tA = (TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_NAME);
            retValue = tA.getValue ();
        }
        return retValue;
    }

    /**
     * Sets the adds the debt creditor add line 1.
     *
     * @param pLine the new adds the debt creditor add line 1
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorAddLine1 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_ADLINE1)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt creditor add line 2.
     *
     * @param pLine the new adds the debt creditor add line 2
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorAddLine2 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_ADLINE2)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt creditor add line 3.
     *
     * @param pLine the new adds the debt creditor add line 3
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorAddLine3 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_ADLINE3)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt creditor add line 4.
     *
     * @param pLine the new adds the debt creditor add line 4
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorAddLine4 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_ADLINE4)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt creditor add line 5.
     *
     * @param pLine the new adds the debt creditor add line 5
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorAddLine5 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_ADLINE5)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt creditor postcode.
     *
     * @param pPostcode the new adds the debt creditor postcode
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtCreditorPostcode (final String pPostcode) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_CRED_POSTCODE)).type (pPostcode);
        }
    }

    /**
     * Sets the adds the debt payee code.
     *
     * @param pCode the new adds the debt payee code
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeCode (final String pCode) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_CODE)).type (pCode);
        }
    }

    /**
     * Checks if is adds the debt payee code valid.
     *
     * @return true, if is adds the debt payee code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isAddDebtPayeeCodeValid () throws FrameworkException
    {
        boolean blnValid = false;
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            blnValid = ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_CODE)).isValid ();
        }
        return blnValid;
    }

    /**
     * Sets the cursor focus in the Add Debt Payee Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setAddDebtPayeeCodeFocus () throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            final TextInputAdaptor tA = (TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_CODE);
            tA.focus ();
        }
    }

    /**
     * Gets the adds the debt payee name.
     *
     * @return the adds the debt payee name
     * @throws FrameworkException the framework exception
     */
    public String getAddDebtPayeeName () throws FrameworkException
    {
        String retValue = "";
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            final TextInputAdaptor tA = (TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_NAME);
            retValue = tA.getValue ();
        }
        return retValue;
    }

    /**
     * Sets the adds the debt payee name.
     *
     * @param pName the new adds the debt payee name
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeName (final String pName) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_NAME)).type (pName);
        }
    }

    /**
     * Sets the adds the debt payee add line 1.
     *
     * @param pLine the new adds the debt payee add line 1
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeAddLine1 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_ADLINE1)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt payee add line 2.
     *
     * @param pLine the new adds the debt payee add line 2
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeAddLine2 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_ADLINE2)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt payee add line 3.
     *
     * @param pLine the new adds the debt payee add line 3
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeAddLine3 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_ADLINE3)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt payee add line 4.
     *
     * @param pLine the new adds the debt payee add line 4
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeAddLine4 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_ADLINE4)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt payee add line 5.
     *
     * @param pLine the new adds the debt payee add line 5
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeeAddLine5 (final String pLine) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_ADLINE5)).type (pLine);
        }
    }

    /**
     * Sets the adds the debt payee postcode.
     *
     * @param pPostcode the new adds the debt payee postcode
     * @throws FrameworkException the framework exception
     */
    public void setAddDebtPayeePostcode (final String pPostcode) throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            selectAddDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
            ((TextInputAdaptor) newAddDebtSubform.getAdaptor (TXT_ADD_DEBT_PAYEE_POSTCODE)).type (pPostcode);
        }
    }

    /**
     * Clicks the Ok Button on the Add Debt Subform.
     *
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void clickAddDebtOkButton () throws FrameworkException
    {
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Ensure are on the correct tabbed page
            ((ButtonAdaptor) newAddDebtSubform.getAdaptor (BTN_ADD_DEBT_OK)).click ();
        }
    }

    /**
     * Gets the adds the debt status bar text.
     *
     * @return the adds the debt status bar text
     */
    public String getAddDebtStatusBarText ()
    {
        String statusBarText = "";
        if (null != newAddDebtSubform && newAddDebtSubform.isVisible ())
        {
            // Retrieve the status bar text from the subform
            statusBarText = cMB.getSubFormAdaptor (SUB_ADD_DEBT).getStatusBarText ();
        }
        return statusBarText;
    }

    /**
     * Selects the row in the Debts grid that matches the Creditor Name specified.
     *
     * @param pPartyName The Creditor Name to search for
     */
    public void selectRecordByCreditorName (final String pPartyName)
    {
        selectValueFromGrid (GRID_MAINTAIN_DEBTS, pPartyName, 1);
    }

    /**
     * Selects the row in the Debts grid that matches the Creditor Name specified.
     *
     * @param pRowNumber The row index to select from the grid (start from 1)
     */
    public void selectRecordByRowNumber (final int pRowNumber)
    {
        selectValueFromGrid (GRID_MAINTAIN_DEBTS, pRowNumber);
    }

    /**
     * Sets the debt amount allowed.
     *
     * @param pAmount the new debt amount allowed
     */
    public void setDebtAmountAllowed (final String pAmount)
    {
        setTextFieldValue (TXT_DEBT_AMOUNT, pAmount);
    }

    /**
     * Sets the debt status.
     *
     * @param pStatus the new debt status
     */
    public void setDebtStatus (final String pStatus)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_DEBT_STATUS);
        sA.clickValue (pStatus);
    }

    /**
     * Gets the debt creditor code.
     *
     * @return the debt creditor code
     * @throws FrameworkException the framework exception
     */
    public String getDebtCreditorCode () throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_CRED_CODE);
        return tA.getValue ();
    }

    /**
     * Sets the debt creditor code.
     *
     * @param pCode the new debt creditor code
     * @throws FrameworkException the framework exception
     */
    public void setDebtCreditorCode (final String pCode) throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
        setTextFieldValue (TXT_DEBT_CRED_CODE, pCode);
    }

    /**
     * Checks if is debt creditor code valid.
     *
     * @return true, if is debt creditor code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isDebtCreditorCodeValid () throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_CRED_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Debt creditor Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setDebtCreditorCodeFocus () throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_CRED_CODE);
        tA.focus ();
    }

    /**
     * Gets the debt creditor name.
     *
     * @return the debt creditor name
     * @throws FrameworkException the framework exception
     */
    public String getDebtCreditorName () throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_CRED_NAME);
        return tA.getValue ();
    }

    /**
     * Sets the debt creditor name.
     *
     * @param pName the new debt creditor name
     * @throws FrameworkException the framework exception
     */
    public void setDebtCreditorName (final String pName) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);

        setTextFieldValue (TXT_DEBT_CRED_NAME, pName);
    }

    /**
     * Gets the debt payee code.
     *
     * @return the debt payee code
     * @throws FrameworkException the framework exception
     */
    public String getDebtPayeeCode () throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_PAYEE_CODE);
        return tA.getValue ();
    }

    /**
     * Sets the debt payee code.
     *
     * @param pCode the new debt payee code
     * @throws FrameworkException the framework exception
     */
    public void setDebtPayeeCode (final String pCode) throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
        setTextFieldValue (TXT_DEBT_PAYEE_CODE, pCode);
    }

    /**
     * Checks if is debt payee code valid.
     *
     * @return true, if is debt payee code valid
     * @throws FrameworkException the framework exception
     */
    public boolean isDebtPayeeCodeValid () throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_PAYEE_CODE);
        return tA.isValid ();
    }

    /**
     * Sets the cursor focus in the Debt Payee Code field.
     *
     * @throws FrameworkException Thrown if problem determining the validation
     */
    public void setDebtPayeeCodeFocus () throws FrameworkException
    {
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_PAYEE_CODE);
        tA.focus ();
    }

    /**
     * Gets the debt payee name.
     *
     * @return the debt payee name
     * @throws FrameworkException the framework exception
     */
    public String getDebtPayeeName () throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TXT_DEBT_PAYEE_NAME);
        return tA.getValue ();
    }

    /**
     * Sets the debt payee name.
     *
     * @param pName the new debt payee name
     * @throws FrameworkException the framework exception
     */
    public void setDebtPayeeName (final String pName) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);

        setTextFieldValue (TXT_DEBT_PAYEE_NAME, pName);
    }

    /**
     * Clicks the Add Creditor Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addCreditorAddress (final String adline1, final String adline2, final String adline3,
                                    final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_CREDITOR);

        // Click the Add Employer Address button
        mClickButton (BTN_ADD_CREDITOR_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * Clicks the Add Payee Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addPayeeAddress (final String adline1, final String adline2, final String adline3, final String adline4,
                                 final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectDebtTabbedPage (UC108MaintainDebtUtils.DEBT_TABBED_PAGE_PAYEE);

        // Click the Add Employer Address button
        mClickButton (BTN_ADD_PAYEE_ADDRESS);
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
            newAddressSubform = cMB.getSubFormAdaptor (POP_NEW_ADDRESS);
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

}
