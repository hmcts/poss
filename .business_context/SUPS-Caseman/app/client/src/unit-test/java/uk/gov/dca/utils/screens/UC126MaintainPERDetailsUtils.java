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
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Remove Maintain Admin Users screen.
 *
 * Date: 01-Oct-2014
 */
public class UC126MaintainPERDetailsUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant QUERY_DETAIL_CODE. */
    // Field adaptors
    private static final String QUERY_DETAIL_CODE = "Query_DetailCode";

    /** The Constant PERDETAIL_AMOUNT_ALLOWED_EDITABLE. */
    private static final String PERDETAIL_AMOUNT_ALLOWED_EDITABLE = "PERDetail_AmountAllowedEditable";

    /** The Constant POPUP_ADD_NEW_PER_DETAIL_DETAIL_CODE. */
    private static final String POPUP_ADD_NEW_PER_DETAIL_DETAIL_CODE = "AddNewPerDetailPopup_DetailCode";
    
    /** The Constant POPUP_ADD_NEW_PER_DETAIL_PER_GROUP. */
    private static final String POPUP_ADD_NEW_PER_DETAIL_PER_GROUP = "AddNewPerDetailPopup_PERGroup";
    
    /** The Constant POPUP_ADD_NEW_PER_DETAIL_PROMPT. */
    private static final String POPUP_ADD_NEW_PER_DETAIL_PROMPT = "AddNewPerDetailPopup_Prompt";
    
    /** The Constant POPUP_ADD_NEW_PER_DETAIL_AMOUNT_ALLOWED_EDITABLE. */
    private static final String POPUP_ADD_NEW_PER_DETAIL_AMOUNT_ALLOWED_EDITABLE =
            "AddNewPerDetailPopup_AmountAllowedEditable";

    /** The Constant SUB_ADD_PER_DETAIL. */
    // Private subform identifiers
    private static final String SUB_ADD_PER_DETAIL = "AddNewPerDetail_SubForm";

    /** The Constant BTN_ADD_PER_DETAIL. */
    private static final String BTN_ADD_PER_DETAIL = "Query_AddPERDetailButton";
    
    /** The Constant BTN_SEARCH. */
    private static final String BTN_SEARCH = "Query_SearchButton";
    
    /** The Constant BTN_SAVE. */
    private static final String BTN_SAVE = "Status_SaveButton";
    
    /** The Constant BTN_CLEAR. */
    private static final String BTN_CLEAR = "Status_ClearButton";

    /** The Constant POPUP_BTN_SAVE. */
    private static final String POPUP_BTN_SAVE = "AddNewPerDetailPopup_SaveButton";

    /** The new per detail subform. */
    // Private subform objects
    private SubFormAdaptor newPerDetailSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC126MaintainPERDetailsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain PER Details";
    }

    /**
     * Checks if is search button enabled.
     *
     * @return true, if is search button enabled
     * @throws FrameworkException the framework exception
     */
    public boolean isSearchButtonEnabled () throws FrameworkException
    {
        return cMB.getButtonAdaptor (BTN_SEARCH).isEnabled ();
    }

    /**
     * Gets the query detail code.
     *
     * @return the query detail code
     */
    public String getQueryDetailCode ()
    {
        return QUERY_DETAIL_CODE;
    }

    /**
     * Sets the query detail code.
     *
     * @param query_DetailCode the new query detail code
     */
    public void setQueryDetailCode (final String query_DetailCode)
    {
        setTextFieldValue (getQueryDetailCode (), query_DetailCode);
    }

    /**
     * Sets the popup add new per detail detail code.
     *
     * @param detail_code the new popup add new per detail detail code
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddNewPerDetailDetailCode (final String detail_code) throws FrameworkException
    {
        if (null != newPerDetailSubform && newPerDetailSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newPerDetailSubform.getAdaptor (POPUP_ADD_NEW_PER_DETAIL_DETAIL_CODE);
            tA.type (detail_code);
        }
    }

    /**
     * Sets the popup add new per detail per group.
     *
     * @param per_group the new popup add new per detail per group
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddNewPerDetailPerGroup (final String per_group) throws FrameworkException
    {
        if (null != newPerDetailSubform && newPerDetailSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newPerDetailSubform.getAdaptor (POPUP_ADD_NEW_PER_DETAIL_PER_GROUP);
            tA.type (per_group);
        }
    }

    /**
     * Sets the popup add new per detail prompt.
     *
     * @param prompt the new popup add new per detail prompt
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddNewPerDetailPrompt (final String prompt) throws FrameworkException
    {
        if (null != newPerDetailSubform && newPerDetailSubform.isVisible ())
        {
            final TextInputAdaptor tA =
                    (TextInputAdaptor) newPerDetailSubform.getAdaptor (POPUP_ADD_NEW_PER_DETAIL_PROMPT);
            tA.type (prompt);
        }
    }

    /**
     * Sets the popup add new per detail amount allowed editable.
     *
     * @param amountAllowedEditable the new popup add new per detail amount allowed editable
     * @throws FrameworkException the framework exception
     */
    public void setPopupAddNewPerDetailAmountAllowedEditable (final boolean amountAllowedEditable)
        throws FrameworkException
    {
        if (null != newPerDetailSubform && newPerDetailSubform.isVisible ())
        {
            final CheckboxInputAdaptor cA = (CheckboxInputAdaptor) newPerDetailSubform
                    .getAdaptor (POPUP_ADD_NEW_PER_DETAIL_AMOUNT_ALLOWED_EDITABLE);
            // tick checkbox if true
            if (amountAllowedEditable)
            {
                cA.click ();
            }
        }
    }

    /**
     * Loads a user's details and indicates whether was successful or not.
     *
     * @param query_DetailCode the query detail code
     * @return true if the data has been loaded, else false
     */
    public boolean loadPERDetails (final String query_DetailCode)
    {
        boolean dataLoaded = true;
        setQueryDetailCode (query_DetailCode);
        mClickButton (BTN_SEARCH);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            dataLoaded = false;
        }

        return dataLoaded;
    }

    /**
     * Indicates whether or not the Amount Allowed Editable field is read only.
     *
     * @param addNew the add new
     * @return True if read only, else false
     * @throws FrameworkException Exception thrown if unable to access object
     */
    public boolean isAmountAllowedEditableReadOnly (final boolean addNew) throws FrameworkException
    {
        if (addNew)
        {

            final CheckboxInputAdaptor adaptor = (CheckboxInputAdaptor) newPerDetailSubform
                    .getAdaptor (POPUP_ADD_NEW_PER_DETAIL_AMOUNT_ALLOWED_EDITABLE);
            return adaptor.isReadOnly ();
        }
        else
        {
            return cMB.getCheckBoxInputAdaptor (PERDETAIL_AMOUNT_ALLOWED_EDITABLE).isReadOnly ();
        }

    }

    /**
     * Clicks the clear button in the status bar.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE);
    }

    /**
     * Clicks the clear button in the status bar.
     *
     * @throws FrameworkException the framework exception
     */
    public void clickPopupSaveButton () throws FrameworkException
    {
        if (null != newPerDetailSubform && newPerDetailSubform.isVisible ())
        {
            ((ButtonAdaptor) newPerDetailSubform.getAdaptor (POPUP_BTN_SAVE)).click ();
        }
    }

    /**
     * Clicks the Add PER Detail button.
     *
     * @throws FrameworkException the framework exception
     */
    public void clickAddPerDetailButton () throws FrameworkException
    {
        mClickButton (BTN_ADD_PER_DETAIL);
        if (null == newPerDetailSubform)
        {
            // already in subform
            newPerDetailSubform = cMB.getSubFormAdaptor (SUB_ADD_PER_DETAIL);
        }
    }

    /**
     * Clicks the Close Button in the status bar to return to the main menu
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
        cMB.waitForPageToLoad ();
    }

    /**
     * Clicks the clear button in the status bar.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR);
        cMB.waitForPageToLoad ();
    }

}
