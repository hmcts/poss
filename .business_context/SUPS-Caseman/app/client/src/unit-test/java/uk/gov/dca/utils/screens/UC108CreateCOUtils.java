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
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Mark Groen
 * Date: 17-Feb-2010
 * Time: 15:06:36
 * To change this template use File | Settings | File Templates.
 */
public class UC108CreateCOUtils extends AbstractBaseScreenUtils
{

    /** The text co number. */
    // Private Text Field Identifiers
    private String TEXT_CO_NUMBER = "Header_CONumber";
    
    /** The text owning court. */
    private String TEXT_OWNING_COURT = "Header_OwningCourtCode";
    
    /** The sel co type. */
    private String SEL_CO_TYPE = "Header_Type";
    
    /** The text co status. */
    private String TEXT_CO_STATUS = "Header_Status";
    
    /** The text debtor name. */
    private String TEXT_DEBTOR_NAME = "Header_Debtor";
    
    /** The text target div. */
    private String TEXT_TARGET_DIV = "CODetails_Target";
    
    /** The text employer name. */
    private String TEXT_EMPLOYER_NAME = "CO_EmploymentDetails_Employer";
    
    /** The text namedperson name. */
    private String TEXT_NAMEDPERSON_NAME = "CO_EmploymentDetails_Address_NamedPerson";
    
    /** The text occupation. */
    private String TEXT_OCCUPATION = "CO_EmploymentDetailsOccupation";
    
    /** The text works pay ref. */
    private String TEXT_WORKS_PAY_REF = "CO_EmploymentDetailsPayRef";

    /** The btn create co. */
    // Private Button Field Identifiers
    private String BTN_CREATE_CO = "CreateCOBtn";
    
    /** The btn maintain debt. */
    private String BTN_MAINTAIN_DEBT = "CO_MaintainDebtBtn";
    
    /** The btn add debtor address. */
    private String BTN_ADD_DEBTOR_ADDRESS = "CO_DebtorAddAddressBtn";
    
    /** The btn add employer address. */
    private String BTN_ADD_EMPLOYER_ADDRESS = "CO_EmployerAddAddressBtn";
    
    /** The btn add workplace address. */
    private String BTN_ADD_WORKPLACE_ADDRESS = "CO_WorkplaceAddAddressBtn";
    
    /** The btn status save. */
    private String BTN_STATUS_SAVE = "Status_Save";
    
    /** The btn status clear. */
    private String BTN_STATUS_CLEAR = "Status_Clear";
    
    /** The m BT N CLOS E SCREEN. */
    private String mBTN_CLOSE_SCREEN = "Status_Close"; // Overwrites the base class close screen button

    /** The pop new address. */
    // Private popup identifiers
    private String POP_NEW_ADDRESS = "addCoAddress_subform";
    
    /** The pop trans co. */
    private String POP_TRANS_CO = "transferCO_subform";

    /** The tabbed area id. */
    // Tabbed Page Identifiers
    private String TABBED_AREA_ID = "COTabbedArea";
    
    /** The tab debtor page. */
    private String TAB_DEBTOR_PAGE = "TabDebtorAddress";
    
    /** The tab employer page. */
    private String TAB_EMPLOYER_PAGE = "TabEmploymentDetails";
    
    /** The tab work page. */
    private String TAB_WORK_PAGE = "TabWorkplaceDetails";

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

    /** The txt transco court code. */
    // Transfer CO Subform Fields
    private String TXT_TRANSCO_COURT_CODE = "TransferCO_Court_Code";
    
    /** The txt transco court name. */
    private String TXT_TRANSCO_COURT_NAME = "TransferCO_Court_Name";
    
    /** The txt transco transfer btn. */
    private String TXT_TRANSCO_TRANSFER_BTN = "TransferCO_TransferButton";

    /** The new address subform. */
    // Private subform adaptor objects
    private SubFormAdaptor newAddressSubform = null;
    
    /** The transfer CO subform. */
    private SubFormAdaptor transferCOSubform = null;

    /** The Constant CO_TYPE_AO. */
    // Static constants representing different CO types
    public static final String CO_TYPE_AO = "AO";
    
    /** The Constant CO_TYPE_CAEO. */
    public static final String CO_TYPE_CAEO = "CAEO";

    /** The Constant CO_TABBED_PAGE_DEBTOR. */
    // Static constants representing different CO tabbed pages
    public static final int CO_TABBED_PAGE_DEBTOR = 1;
    
    /** The Constant CO_TABBED_PAGE_EMPLOYER. */
    public static final int CO_TABBED_PAGE_EMPLOYER = 2;
    
    /** The Constant CO_TABBED_PAGE_WORK. */
    public static final int CO_TABBED_PAGE_WORK = 3;

    /** The Constant QUICKLINK_TRANSFER. */
    // Additional navigation quicklinks on the CO screen
    public static final String QUICKLINK_TRANSFER = "Transfer CO";
    
    /** The btn co events. */
    public String BTN_CO_EVENTS = "NavBar_COEventsButton";

    /** The Constant ERROR_TRANS_MONEY_IN_COURT. */
    public static final String ERROR_TRANS_MONEY_IN_COURT = "Cannot transfer CO if Monies In Court exist.";
    
    /** The Constant ERROR_TRANSCO_TRANS_TO_SELF. */
    public static final String ERROR_TRANSCO_TRANS_TO_SELF = "Please select a Court different to the current Court.";
    
    /** The Constant ERROR_TRANSCO_TRANS_TO_CCBC. */
    public static final String ERROR_TRANSCO_TRANS_TO_CCBC = "Consolidated Orders cannot be transferred to CCBC.";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC108CreateCOUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create/Maintain COs";
    }

    /**
     * Sets the CO number.
     *
     * @param coNumber the new CO number
     */
    public void setCONumber (final String coNumber)
    {
        setTextFieldValue (TEXT_CO_NUMBER, coNumber);
        cMB.waitForPageToLoad ();
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Gets the owning court.
     *
     * @return the owning court
     */
    public String getOwningCourt ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_OWNING_COURT);
        return tA.getValue ();
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
     * Sets the CO type.
     *
     * @param pCOType the new CO type
     */
    public void setCOType (final String pCOType)
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_CO_TYPE);
        sA.clickValue (pCOType);
    }

    /**
     * Gets the CO status.
     *
     * @return the CO status
     */
    public String getCOStatus ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_CO_STATUS);
        return tA.getValue ();
    }

    /**
     * Sets the debtor name.
     *
     * @param pName the new debtor name
     */
    public void setDebtorName (final String pName)
    {
        setTextFieldValue (TEXT_DEBTOR_NAME, pName);
    }

    /**
     * Sets the target dividend.
     *
     * @param pTarget the new target dividend
     */
    public void setTargetDividend (final String pTarget)
    {
        setTextFieldValue (TEXT_TARGET_DIV, pTarget);
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
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_EMPLOYER);

        setTextFieldValue (TEXT_EMPLOYER_NAME, pName);
    }

    /**
     * Sets the employer named person.
     *
     * @param pName the new employer named person
     * @throws FrameworkException the framework exception
     */
    public void setEmployerNamedPerson (final String pName) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_EMPLOYER);

        setTextFieldValue (TEXT_NAMEDPERSON_NAME, pName);
    }

    /**
     * Sets the occupation.
     *
     * @param pOccupation the new occupation
     * @throws FrameworkException the framework exception
     */
    public void setOccupation (final String pOccupation) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_EMPLOYER);

        setTextFieldValue (TEXT_OCCUPATION, pOccupation);
    }

    /**
     * Sets the pay ref.
     *
     * @param pPayRef the new pay ref
     * @throws FrameworkException the framework exception
     */
    public void setPayRef (final String pPayRef) throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_EMPLOYER);

        setTextFieldValue (TEXT_WORKS_PAY_REF, pPayRef);
    }

    /**
     * Clicks the Create Co Buttonn Button.
     */
    public void clickCreateCOButton ()
    {
        mClickButton (BTN_CREATE_CO);
    }

    /**
     * Clicks the specified navigation button to navigate to another screen.
     *
     * @param navButtonId Identifier of the navigation button to be clicked
     */
    public void clickNavigationButton (final String navButtonId)
    {
        mClickButton (navButtonId);
    }

    /**
     * Clicks the Maintain Debts Button.
     */
    public void clickMaintainDebtButton ()
    {
        mClickButton (BTN_MAINTAIN_DEBT);
    }

    /**
     * Selects a specified tabbed page on the Consolidated Order screen.
     *
     * @param page The tabbed page to display
     * @throws FrameworkException Exception thrown if problem showing page
     */
    public void selectTabbedPage (final int page) throws FrameworkException
    {
        final TabbedAreaAdaptor tAA = cMB.getTabbedAreaAdaptor (TABBED_AREA_ID);
        switch (page)
        {
            case CO_TABBED_PAGE_EMPLOYER:
                tAA.showPage (TAB_EMPLOYER_PAGE);
                break;
            case CO_TABBED_PAGE_WORK:
                tAA.showPage (TAB_WORK_PAGE);
                break;
            case CO_TABBED_PAGE_DEBTOR:
            default:
                tAA.showPage (TAB_DEBTOR_PAGE);
                break;
        }
    }

    /**
     * Clicks the Add Debtor Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addDebtorAddress (final String adline1, final String adline2, final String adline3,
                                  final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_DEBTOR);

        // Click the Add Debtor Address button
        mClickButton (BTN_ADD_DEBTOR_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * Clicks the Add Employer Address button and sets the address fields before clicking Ok.
     *
     * @param adline1 Address Line 1
     * @param adline2 Address Line 2
     * @param adline3 Address Line 3
     * @param adline4 Address Line 4
     * @param adline5 Address Line 5
     * @param postcode Address Post Code
     * @throws FrameworkException Thrown if thrown from the addGenericNewAddress method
     */
    public void addEmployerAddress (final String adline1, final String adline2, final String adline3,
                                    final String adline4, final String adline5, final String postcode)
        throws FrameworkException
    {
        // Ensure are on the correct tabbed page
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_EMPLOYER);

        // Click the Add Employer Address button
        mClickButton (BTN_ADD_EMPLOYER_ADDRESS);
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
        selectTabbedPage (UC108CreateCOUtils.CO_TABBED_PAGE_WORK);

        // Click the Add Employer Address button
        mClickButton (BTN_ADD_WORKPLACE_ADDRESS);
        addGenericNewAddress (adline1, adline2, adline3, adline4, adline5, postcode);
    }

    /**
     * Sets the transfer CO court code.
     *
     * @param courtCode the new transfer CO court code
     * @throws FrameworkException the framework exception
     */
    public void setTransferCOCourtCode (final String courtCode) throws FrameworkException
    {
        if (null == transferCOSubform)
        {
            transferCOSubform = cMB.getSubFormAdaptor (POP_TRANS_CO);
        }

        if (transferCOSubform.isVisible ())
        {
            // If the subform is visible, set the Court Code field
            ((TextInputAdaptor) transferCOSubform.getAdaptor (TXT_TRANSCO_COURT_CODE)).type (courtCode);
        }
    }

    /**
     * Sets the focus on the Court Code field on the Transfer CO Popup.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void setTransferCOCourtCodeFocus () throws FrameworkException
    {
        if (null == transferCOSubform)
        {
            transferCOSubform = cMB.getSubFormAdaptor (POP_TRANS_CO);
        }

        if (transferCOSubform.isVisible ())
        {
            // If the subform is visible, set the Court Code field
            transferCOSubform.getAdaptor (TXT_TRANSCO_COURT_CODE).focus ();
        }
    }

    /**
     * Sets the transfer CO court name.
     *
     * @param courtName the new transfer CO court name
     * @throws FrameworkException the framework exception
     */
    public void setTransferCOCourtName (final String courtName) throws FrameworkException
    {
        if (null == transferCOSubform)
        {
            transferCOSubform = cMB.getSubFormAdaptor (POP_TRANS_CO);
        }

        if (transferCOSubform.isVisible ())
        {
            // If the subform is visible, set the Court Name field
            ((AutoCompleteAdaptor) transferCOSubform.getAdaptor (TXT_TRANSCO_COURT_NAME)).typeText (courtName);
        }
    }

    /**
     * Clicks the Transfer Button on the Transfer CO Popup.
     *
     * @throws FrameworkException Thrown if problem getting the subform field
     */
    public void clickTransferCOButton () throws FrameworkException
    {
        if (null == transferCOSubform)
        {
            transferCOSubform = cMB.getSubFormAdaptor (POP_TRANS_CO);
        }

        if (transferCOSubform.isVisible ())
        {
            // If the subform is visible, click the Transfer Button
            ((ButtonAdaptor) transferCOSubform.getAdaptor (TXT_TRANSCO_TRANSFER_BTN)).click ();
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * Gets the transfer CO status bar text.
     *
     * @return the transfer CO status bar text
     */
    public String getTransferCOStatusBarText ()
    {
        String statusBarText = "";
        if (null == transferCOSubform)
        {
            transferCOSubform = cMB.getSubFormAdaptor (POP_TRANS_CO);
        }

        if (transferCOSubform.isVisible ())
        {
            // Retrieve the status bar text from the subform
            statusBarText = cMB.getSubFormAdaptor (POP_TRANS_CO).getStatusBarText ();
        }
        return statusBarText;
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

    /**
     * Clicks the Save button.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_STATUS_SAVE);

        // Handle CO created alert
        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
        }
    }

    /**
     * Clicks the Save button and returns the CO Number produced.
     *
     * @return The CO Number created
     */
    public String saveAndReturnCONumber ()
    {
        String coNumber = "";
        mClickButton (BTN_STATUS_SAVE);

        // Handle CO created alert
        if (cMB.isAlertPresent ())
        {
            final String tempString = cMB.getAlertString ();
            final String searchString = "CO Number is ";
            final int startIndex = tempString.indexOf (searchString) + searchString.length ();
            coNumber = tempString.substring (startIndex, startIndex + 8);
        }

        return coNumber;
    }

    /**
     * Clicks the Clear button.
     */
    public void clickClearButton ()
    {
        mClickButton (BTN_STATUS_CLEAR);
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button.
     */
    public void closeScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

}
