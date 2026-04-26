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
 * Screen utility class representing the Diary Monitoring Reports screen.
 *
 * Date: 31-Jan-2013
 */
public class UC023DiaryMonitoringReportsUtils extends AbstractBaseScreenUtils
{

    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close_Btn";

    /** The btn cm obl r1. */
    // Private button identifiers
    private String BTN_CM_OBL_R1 = "PRINT_CM_OBL_R1_Btn";
    
    /** The btn cm wft r1. */
    private String BTN_CM_WFT_R1 = "PRINT_WFT_R1_Btn";
    
    /** The btn cm wft r2. */
    private String BTN_CM_WFT_R2 = "PRINT_WFT_R2_Btn";

    /** The popup progress ind. */
    // Private popup identifiers
    private String POPUP_PROGRESS_IND = "ProgressIndicator_Popup";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC023DiaryMonitoringReportsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Diary Monitoring Reports";
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
     * Clicks the Print Overdue Obligations Report Button.
     */
    public void printOverdueObligations ()
    {
        runReport (BTN_CM_OBL_R1);
    }

    /**
     * Clicks the Print WFT Required to be Fixed Report Button.
     */
    public void printWFTToBeFixed ()
    {
        runReport (BTN_CM_WFT_R1);
    }

    /**
     * Clicks the Print WFT Overdue CMC Report Button.
     */
    public void printWFTOverdueCMC ()
    {
        runReport (BTN_CM_WFT_R2);
    }

    /**
     * Clicks the Run Report Button.
     *
     * @param buttonId Identifier of the button to click
     */
    private void runReport (final String buttonId)
    {
        // Click the Run Report Button
        cMB.getButtonAdaptor (buttonId).click ();

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