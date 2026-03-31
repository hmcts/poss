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
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Des Johnston.
 * Screen utility class representing the Mainatin Warrant Fees and Refunds screen.
 *
 * Date: 18-June-2012
 */
public class UC040WarrantFeesRefundsUtils extends AbstractBaseScreenUtils
{
    
    /** The text issuing court. */
    // Private Text Field Identifiers
    private String TEXT_ISSUING_COURT = "Header_OwningCourtCode";
    
    /** The sel fee type. */
    private String SEL_FEE_TYPE = "AmountPopup_AmountType";
    
    /** The text new amount. */
    private String TEXT_NEW_AMOUNT = "AmountPopup_Amount";

    /** The btn add fee. */
    // Private Button Field Identifiers
    private String BTN_ADD_FEE = "Query_SearchButton";
    
    /** The btn remove fee. */
    private String BTN_REMOVE_FEE = "Master_RemoveAmountButton";
    
    /** The btn save screen. */
    private String BTN_SAVE_SCREEN = "Status_SaveButton";
    
    /** The btn pop add amount. */
    private String BTN_POP_ADD_AMOUNT = "AmountPopup_AddButton";
    
    /** The btn pop ok. */
    private String BTN_POP_OK = "AmountPopup_OkButton";

    /** The popup add fee. */
    // Private Popup adaptor Identifiers
    private String POPUP_ADD_FEE = "NewAmountPopup";

    /** The Constant AMOUNT_TYPE_FEE. */
    // Static variables representing the Amount Types
    public static final String AMOUNT_TYPE_FEE = "FEE";
    
    /** The Constant AMOUNT_TYPE_REFUND. */
    public static final String AMOUNT_TYPE_REFUND = "REFUND";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC040WarrantFeesRefundsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Warrant Refunds and Fees";
    }

    /**
     * Gets the issuing court field value.
     *
     * @return the issuing court field value
     */
    public String getIssuingCourtFieldValue ()
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (TEXT_ISSUING_COURT);
        return tA.getValue ();
    }

    /**
     * Adds a new amount to the Attachment of Earnings record.
     *
     * @param amountType The Amount Type
     * @param amount The Amount
     */
    public void addNewAmount (final String amountType, final String amount)
    {
        // Click add button to raise the popup
        mClickButton (BTN_ADD_FEE);

        // Check add amount popup is raised
        final PopupAdaptor addEventPopup = cMB.getPopupAdaptor (POPUP_ADD_FEE);
        if (addEventPopup.isVisible ())
        {
            setSelectFieldValue (SEL_FEE_TYPE, amountType);
            setTextFieldValue (TEXT_NEW_AMOUNT, amount);
            mClickButton (BTN_POP_ADD_AMOUNT);
            mClickButton (BTN_POP_OK);
        }
    }

    /**
     * Clicks the Remove Amount Button (if enabled).
     *
     * @throws Exception Exception thrown if problem determining enablement status
     */
    public void removeFee () throws Exception
    {
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_REMOVE_FEE);
        if (bA.isEnabled ())
        {
            bA.click ();
        }
    }

    /**
     * Clicks the Save Button.
     */
    public void saveScreen ()
    {
        mClickButton (BTN_SAVE_SCREEN);
    }

    /**
     * {@inheritDoc}
     */
    public String getScreenTitle ()
    {
        return this.mScreenTitle;
    }
}