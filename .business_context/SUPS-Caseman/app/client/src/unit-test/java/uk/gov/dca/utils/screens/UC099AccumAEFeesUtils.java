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
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Accumulative AE Fees screen.
 *
 * Date: 20-Aug-2009
 */
public class UC099AccumAEFeesUtils extends AbstractBaseScreenUtils
{
    
    /** The date start date. */
    // Private text field identifiers
    private String DATE_START_DATE = "StartDate";
    
    /** The date end date. */
    private String DATE_END_DATE = "EndDate";

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The btn run report. */
    // Private button identifiers
    private String BTN_RUN_REPORT = "Status_RunReportButton";

    /** The popup progress ind. */
    // Private popup identifiers
    private String POPUP_PROGRESS_IND = "ProgressIndicator_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase CaseMan Test Base Object
     */
    public UC099AccumAEFeesUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Accumulative AE Fees";
    }

    /**
     * Sets the start date.
     *
     * @param pStartDate the new start date
     */
    public void setStartDate (final String pStartDate)
    {
        // Enter Start Date value
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_START_DATE);
        dA.setDate (pStartDate);
    }

    /**
     * Sets the end date.
     *
     * @param pEndDate the new end date
     */
    public void setEndDate (final String pEndDate)
    {
        // Enter End Date value
        final DatePickerAdaptor dA = cMB.getDatePickerAdaptor (DATE_END_DATE);
        dA.setDate (pEndDate);
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
     * Clicks the Run Report button which will launch the oracle report
     * progress bar popup, generate the report, then close the popup.
     */
    public void runReport ()
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (BTN_RUN_REPORT).click ();
        if (cMB.isAlertPresent ())
        {
            // Handle form invalid alert
            cMB.getAlert ();
        }
        else
        {
            // Handle the progress bar popup
            final PopupAdaptor progressPopup = cMB.getPopupAdaptor (POPUP_PROGRESS_IND);

            // Loop until popup loads
            boolean popupVisible = progressPopup.isVisible ();
            while ( !popupVisible)
            {
                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
            }

            // Loop until popup has closed
            popupVisible = progressPopup.isVisible ();
            while (popupVisible)
            {
                cMB.waitForPageToLoad ();
                popupVisible = progressPopup.isVisible ();
            }
        }
    }
}