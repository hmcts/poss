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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.common.ITestProperties;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * An abstract class that all ScreenUtil classes extend. Used to hold the common
 * elements of all screens, for example getScreenTitle() and closeScreen().
 *
 * Date: 09-Jun-2009
 */
public abstract class AbstractBaseScreenUtils extends AbstractBaseUtils
{
    
    /** The m screen title. */
    // Screen Title
    protected String mScreenTitle;

    /** The m BT N CLOS E SCREEN. */
    // Common Button Field Identifiers (can be overridden in child classes if are different)
    protected String mBTN_CLOSE_SCREEN = "Status_CloseButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public AbstractBaseScreenUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
    }

    /**
     * Gets the screen title.
     *
     * @return the screen title
     */
    public String getScreenTitle ()
    {
        return this.mScreenTitle;
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - Need to overwrite this function in child class if Close Button variable is different
     * to the one defined in this base class.
     */
    public void closeScreen ()
    {
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

    /**
     * Protected utility function used for clicking buttons.
     *
     * @param buttonId The identifier of the button to be clicked
     */
    protected void mClickButton (final String buttonId)
    {
        cMB.getButtonAdaptor (buttonId).click ();
        cMB.waitForPageToLoad ();
    }

    /**
     * Protected utility function used for checking the status of a specified
     * text field.
     *
     * @param fieldId String identifier of the text field
     * @param mode Mode to check for
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    protected boolean checkTextFieldStatus (final String fieldId, final int mode) throws FrameworkException
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (fieldId);
        boolean blnFieldStatus = false;
        switch (mode)
        {
            case ITestProperties.FIELD_STATUS_READONLY:
                blnFieldStatus = tA.isReadOnly ();
                break;
            case ITestProperties.FIELD_STATUS_ENABLED:
                blnFieldStatus = tA.isEnabled ();
                break;
            case ITestProperties.FIELD_STATUS_MANDATORY:
                blnFieldStatus = tA.isMandatory ();
                break;
            case ITestProperties.FIELD_STATUS_VALID:
                blnFieldStatus = tA.isValid ();
                break;
        }
        return blnFieldStatus;
    }

    /**
     * Protected utility function used for checking the status of a specified
     * autocomplete field.
     *
     * @param fieldId String identifier of the autocomplete field
     * @param mode Mode to check for
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    protected boolean checkAutoCompleteFieldStatus (final String fieldId, final int mode) throws FrameworkException
    {
        final AutoCompleteAdaptor tA = cMB.getAutoCompleteAdaptor (fieldId);
        boolean blnFieldStatus = false;
        switch (mode)
        {
            case ITestProperties.FIELD_STATUS_READONLY:
                blnFieldStatus = tA.isReadOnly ();
                break;
            case ITestProperties.FIELD_STATUS_ENABLED:
                blnFieldStatus = tA.isEnabled ();
                break;
            case ITestProperties.FIELD_STATUS_MANDATORY:
                blnFieldStatus = tA.isMandatory ();
                break;
            case ITestProperties.FIELD_STATUS_VALID:
                blnFieldStatus = tA.isValid ();
                break;
        }
        return blnFieldStatus;
    }

    /**
     * Protected utility function used for checking the status of a specified
     * text field.
     *
     * @param field TextInputAdaptor Object for the text field
     * @param mode Mode to check for
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    protected boolean checkTextFieldStatus (final TextInputAdaptor field, final int mode) throws FrameworkException
    {
        boolean blnFieldStatus = false;
        switch (mode)
        {
            case ITestProperties.FIELD_STATUS_READONLY:
                blnFieldStatus = field.isReadOnly ();
                break;
            case ITestProperties.FIELD_STATUS_ENABLED:
                blnFieldStatus = field.isEnabled ();
                break;
            case ITestProperties.FIELD_STATUS_MANDATORY:
                blnFieldStatus = field.isMandatory ();
                break;
            case ITestProperties.FIELD_STATUS_VALID:
                blnFieldStatus = field.isValid ();
                break;
        }
        return blnFieldStatus;
    }
}