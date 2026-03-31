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
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Created by Chris Vincent.
 * Abstract class that all Suitors Cash screen util classes inherit from.
 * Contains static variables for enforcement types, payment types,
 * retention types etc. and also functions common to all Suitors Cash screens
 * e.g. handleStartOfDayProcess().
 *
 * Date: 25-Jun-2009
 */
public abstract class AbstractSuitorsCashScreenUtils extends AbstractBaseScreenUtils
{
    
    /** The Constant ERR_MSG_INVALID_CASE_NUMBER. */
    // Public error messages
    public static final String ERR_MSG_INVALID_CASE_NUMBER =
            "The case number entered does not match a valid 8 character format.";
    
    /** The Constant ERR_MSG_INVALID_WARRANT_NUMBER. */
    public static final String ERR_MSG_INVALID_WARRANT_NUMBER =
            "The warrant number entered does not match a valid format.";
    
    /** The Constant ERR_MSG_INVALID_LCL_WARRANT_NUMBER. */
    public static final String ERR_MSG_INVALID_LCL_WARRANT_NUMBER =
            "The local warrant number entered does not match a valid format.";
    
    /** The Constant ERR_MSG_INVALID_AE_NUMBER. */
    public static final String ERR_MSG_INVALID_AE_NUMBER =
            "AE number must be 8 characters. Ensure format is XXnnnnnn, nnnXnnnn or XX/nnnnn.";

    /** The Constant ENFORCEMENT_TYPE_CASE. */
    // Enforcement Types
    public static final String ENFORCEMENT_TYPE_CASE = "CASE";
    
    /** The Constant ENFORCEMENT_TYPE_AE. */
    public static final String ENFORCEMENT_TYPE_AE = "AE";
    
    /** The Constant ENFORCEMENT_TYPE_CO. */
    public static final String ENFORCEMENT_TYPE_CO = "CO";
    
    /** The Constant ENFORCEMENT_TYPE_HOMEWARRANT. */
    public static final String ENFORCEMENT_TYPE_HOMEWARRANT = "HOME WARRANT";
    
    /** The Constant ENFORCEMENT_TYPE_FOREIGNWARRANT. */
    public static final String ENFORCEMENT_TYPE_FOREIGNWARRANT = "FOREIGN WARRANT";

    /** The Constant PAYMENT_TYPE_CASH. */
    // Payment types
    public static final String PAYMENT_TYPE_CASH = "CASH";
    
    /** The Constant PAYMENT_TYPE_CHQ_NOT_RET. */
    public static final String PAYMENT_TYPE_CHQ_NOT_RET = "CHEQUE";
    
    /** The Constant PAYMENT_TYPE_CHQ_RET. */
    public static final String PAYMENT_TYPE_CHQ_RET = "CHQ RT";
    
    /** The Constant PAYMENT_TYPE_POSTAL. */
    public static final String PAYMENT_TYPE_POSTAL = "PO";

    /** The Constant RETENTION_TYPE_AO_CAEO. */
    // Retention Types
    public static final String RETENTION_TYPE_AO_CAEO = "AO/CAEO";
    
    /** The Constant RETENTION_TYPE_CHEQUE. */
    public static final String RETENTION_TYPE_CHEQUE = "CHEQUE";
    
    /** The Constant RETENTION_TYPE_JGMT1000. */
    public static final String RETENTION_TYPE_JGMT1000 = "JUDGMENT(1000+)";
    
    /** The Constant RETENTION_TYPE_MISC. */
    public static final String RETENTION_TYPE_MISC = "MISCELLANEOUS";
    
    /** The Constant RETENTION_TYPE_ORDINARY. */
    public static final String RETENTION_TYPE_ORDINARY = "ORDINARY";

    /** The Constant PASSRETENTION_TYPE_CAPS. */
    // Passthrough Retention Types
    public static final String PASSRETENTION_TYPE_CAPS = "CAPS";
    
    /** The Constant PASSRETENTION_TYPE_JUDGMENT. */
    public static final String PASSRETENTION_TYPE_JUDGMENT = "THE JUDGMENT COURT";
    
    /** The Constant PASSRETENTION_TYPE_CLAIMANT. */
    public static final String PASSRETENTION_TYPE_CLAIMANT = "THE CLAIMANT";

    /** The m BT N SO D RU N REPORT. */
    // Start of Day Screen Constants
    protected final String mBTN_SOD_RUN_REPORT = "Status_Proceed_Button";
    
    /** The m SO D PAG E TITLE. */
    protected final String mSOD_PAGE_TITLE = "Suitors Cash Start Of Day";

    /** The m TEX T EN F NUMBER. */
    protected String mTEXT_ENF_NUMBER = "Header_EnforcementNumber";
    
    /** The m SE L EN F TYPE. */
    protected String mSEL_ENF_TYPE = "Header_EnforcementType";
    
    /** The m TEX T E X COUR T CODE. */
    protected String mTEXT_EX_COURT_CODE = "Header_ExecutingCourtCode";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public AbstractSuitorsCashScreenUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
    }

    /**
     * Sets the enforcement number.
     *
     * @param pEnforcementNumber the new enforcement number
     */
    public void setEnforcementNumber (final String pEnforcementNumber)
    {
        setTextFieldValue (mTEXT_ENF_NUMBER, pEnforcementNumber);
    }

    /**
     * Sets the cursor focus in the Enforcement Number field.
     */
    public void setEnforcementNumberFocus ()
    {
        cMB.getTextInputAdaptor (mTEXT_ENF_NUMBER).focus ();
    }

    /**
     * Checks if is enforcement number valid.
     *
     * @return true, if is enforcement number valid
     * @throws Exception the exception
     */
    public boolean isEnforcementNumberValid () throws Exception
    {
        final TextInputAdaptor tA = cMB.getTextInputAdaptor (mTEXT_ENF_NUMBER);
        return tA.isValid ();
    }

    /**
     * Sets the enforcement type.
     *
     * @param pEnforcemenType the new enforcement type
     */
    public void setEnforcementType (final String pEnforcemenType)
    {
        setSelectFieldValue (mSEL_ENF_TYPE, pEnforcemenType);
    }

    /**
     * Function handles the suitor's cash start of day process. An original screen title
     * is passed in to check whether the SOD screen has completed and returned to the
     * original screen.
     */
    public void handleStartOfDayProcess ()
    {
        boolean blnSODStarted = false;
        String pageTitle = cMB.getPageTitle ();

        while ( !pageTitle.equals (mScreenTitle))
        {
            // Check if in Start of Day screen
            if (pageTitle.equals (mSOD_PAGE_TITLE) && !blnSODStarted)
            {
                // In start of Day screen, but start of day not initiated yet. Start SOD
                mClickButton (mBTN_SOD_RUN_REPORT);
                blnSODStarted = true;
            }
            cMB.waitForPageToLoad ();
            pageTitle = cMB.getPageTitle ();
        }

        cMB.waitForPageToLoad ();
    }

    /**
     * This function sets the CFO RUNDATE (Suitors Cash Start of Day Last Ran) System Data value
     * to todays date to prevent the Suitors Cash Start of Day from being activated.
     *
     * @param pCourtCode String for the Court Code
     */
    public void bypassStartOfDay (final String pCourtCode)
    {
        // Set the Suitors Cash Start of Day Run Date to today
        DBUtil.setSystemDataItem ("CFO RUNDATE", pCourtCode,
                AbstractBaseUtils.getFutureDate (0, AbstractBaseUtils.DATE_FORMAT_SYSDATA, false));
    }
}