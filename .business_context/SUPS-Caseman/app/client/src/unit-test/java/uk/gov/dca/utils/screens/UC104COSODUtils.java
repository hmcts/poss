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
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the CO Start of Day (SOD) screen.
 *
 * Date: 30-Nov-2015
 */
public class UC104COSODUtils extends AbstractBaseScreenUtils
{
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The btn run report. */
    // Private button identifiers
    private String BTN_RUN_REPORT = "Status_RunReportButton";

    /** The popup progress ind. */
    // Private popup identifiers
    private String POPUP_PROGRESS_IND = "CaseMan_AsyncMonitorPopup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC104COSODUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Run Start of Day Reports";
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
     * Clicks the Run Report Button.
     */
    public void runReport ()
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (BTN_RUN_REPORT).click ();

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
            // Might get alerts after checks have been made
            while (cMB.isAlertPresent ())
            {
                cMB.getAlert ();
                cMB.waitForPageToLoad ();
            }

            cMB.waitForPageToLoad ();
            popupVisible = progressPopup.isVisible ();
        }

        while (cMB.isAlertPresent ())
        {
            cMB.getAlert ();
            cMB.waitForPageToLoad ();
        }
    }
}