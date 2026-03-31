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
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the CCBC View Rejected Cases screen.
 *
 * Date: 20-Jun-2013
 */
public class CCBCUC008RejectedCasesUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "Case Number must consist of alphabetic and numeric characters only.";

    /** The text case number. */
    // Private text field identifiers
    private String TEXT_CASE_NUMBER = "Query_Case_Number_Txt";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Main_Back_Btn";

    /**
     * Constructor.
     *
     * @param theCMTestBase CaseMan Test Base Object
     */
    public CCBCUC008RejectedCasesUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "View Rejected Cases";
    }

    /**
     * Sets the case number.
     *
     * @param pCaseNumber the new case number
     */
    public void setCaseNumber (final String pCaseNumber)
    {
        // Enter Case Number value then wait (makes server side validation call)
        setTextFieldValue (TEXT_CASE_NUMBER, pCaseNumber);
        cMB.waitForPageToLoad ();
    }

    /**
     * Checks if is case number valid.
     *
     * @return true, if is case number valid
     * @throws FrameworkException the framework exception
     */
    public boolean isCaseNumberValid () throws FrameworkException
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
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        mClickButton (mBTN_CLOSE_SCREEN);
    }
}