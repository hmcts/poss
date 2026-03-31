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
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Remove Maintain Admin Users screen.
 *
 * Date: 01-Oct-2014
 */
public class UC208MaintainAdminUsersUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ADMIN_ROLE_NONE. */
    // Static constants representing different party types
    public static final String ADMIN_ROLE_NONE = "None";
    
    /** The Constant ADMIN_ROLE_COURT_ADMINISTRATOR. */
    public static final String ADMIN_ROLE_COURT_ADMINISTRATOR = "Court Administrator";
    
    /** The Constant ADMIN_ROLE_SUPER_ADMINISTRATOR. */
    public static final String ADMIN_ROLE_SUPER_ADMINISTRATOR = "Super Administrator";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The text user id. */
    // Field adaptors
    private String TEXT_USER_ID = "Header_UserId";
    
    /** The text owning court. */
    private String TEXT_OWNING_COURT = "Main_CourtCode";
    
    /** The sel admin role. */
    private String SEL_ADMIN_ROLE = "Main_AdminRole";

    /** The btn search. */
    private String BTN_SEARCH = "Header_SearchButton";
    
    /** The btn save. */
    private String BTN_SAVE = "Status_SaveBtn";
    
    /** The btn clear. */
    private String BTN_CLEAR = "Status_ClearBtn";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC208MaintainAdminUsersUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Maintain Admin Users";
    }

    /**
     * Sets the user id.
     *
     * @param pUserId the new user id
     */
    public void setUserId (final String pUserId)
    {
        setTextFieldValue (TEXT_USER_ID, pUserId);
    }

    /**
     * Gets the user id.
     *
     * @return the user id
     */
    public String getUserId ()
    {
        return cMB.getTextInputAdaptor (TEXT_USER_ID).getValue ();
    }

    /**
     * Checks if is user id valid.
     *
     * @return true, if is user id valid
     * @throws FrameworkException the framework exception
     */
    public boolean isUserIdValid () throws FrameworkException
    {
        return cMB.getTextInputAdaptor (TEXT_USER_ID).isValid ();
    }

    /**
     * Sets the cursor focus in the User Id field.
     */
    public void setUserIdFocus ()
    {
        cMB.getTextInputAdaptor (TEXT_USER_ID).focus ();
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
     * Gets the admin role.
     *
     * @return the admin role
     */
    public String getAdminRole ()
    {
        final SelectElementAdaptor sA = cMB.getSelectElementAdaptor (SEL_ADMIN_ROLE);
        return sA.getSelectedLabel ();
    }

    /**
     * Sets the admin role.
     *
     * @param pAdminRole the new admin role
     */
    public void setAdminRole (final String pAdminRole)
    {
        setSelectFieldValue (SEL_ADMIN_ROLE, pAdminRole);
    }

    /**
     * Loads a user's details and indicates whether was successful or not.
     *
     * @param pUserId The user id to load
     * @return true if the data has been loaded, else false
     */
    public boolean loadUserDetails (final String pUserId)
    {
        boolean dataLoaded = true;
        setUserId (pUserId);
        mClickButton (BTN_SEARCH);
        if (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            dataLoaded = false;
        }

        return dataLoaded;
    }

    /**
     * Clicks the clear button in the status bar.
     */
    public void clickSaveButton ()
    {
        mClickButton (BTN_SAVE);
    }

    /**
     * Clicks the Close Button in the status bar to return to the main menu
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }

    /**
     * Clicks the clear button in the status bar.
     */
    public void clearScreen ()
    {
        mClickButton (BTN_CLEAR);
    }

}