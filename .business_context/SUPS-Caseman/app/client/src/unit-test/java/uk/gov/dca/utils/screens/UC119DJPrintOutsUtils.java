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
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the District Judges Print Outs screen.
 *
 * Date: 06-Aug-2009
 */
public class UC119DJPrintOutsUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_CASE_NOT_EXIST. */
    // Public error messages
    public static final String ERR_MSG_CASE_NOT_EXIST = "The case number entered does not exist.";
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";

    /** The text case number. */
    // Private text field identifiers
    private String TEXT_CASE_NUMBER = "EnterCaseNumber";
    
    /** The date hearing date. */
    private String DATE_HEARING_DATE = "HearingDate";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The btn run report. */
    // Private button identifiers
    private String BTN_RUN_REPORT = "Status_RunReportButton";

    /**
     * Constructor.
     *
     * @param theCMTestBase CaseMan Test Base Object
     */
    public UC119DJPrintOutsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "District Judges Print Outs";
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
     * Checks if is case number field valid.
     *
     * @return true, if is case number field valid
     * @throws FrameworkException the framework exception
     */
    public boolean isCaseNumberFieldValid () throws FrameworkException
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
     * Sets the hearing date.
     *
     * @param pHearingDate the new hearing date
     */
    public void setHearingDate (final String pHearingDate)
    {
        // Enter Hearing Date value
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_HEARING_DATE);
        dA.setDate (pHearingDate);
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

    /**
     * Clicks the Run Report button which will only be enabled if the form is
     * valid.
     *
     * @throws FrameworkException Framework exception thrown if problem checking enablement
     */
    public void runReport () throws FrameworkException
    {
        // Click the Run Report Button
        final ButtonAdaptor bA = cMB.getButtonAdaptor (BTN_RUN_REPORT);
        if (bA.isEnabled ())
        {
            bA.click ();
            cMB.waitForPageToLoad ();
        }
    }
}