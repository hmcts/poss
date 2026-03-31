/* Copyrights and Licenses
 * 
 * Copyright (c) 2017 by the Ministry of Justice. All rights reserved.
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

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Create and Update Hearing Details.
 *
 * Date: 20-Dec-2016
 */
public class UC008MaintainHearingsUtils extends AbstractBaseScreenUtils
{
    
    /** The btn save details. */
    // Private field identifiers
    private String BTN_SAVE_DETAILS = "Status_Save";
    
    /** The close screen button. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_Close";

    /**
	 * Constructor.
	 *
	 * @param theCMTestBase
	 *            The CaseMan Test Base object
	 */
    public UC008MaintainHearingsUtils(final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Create and Update Hearing Details";
    }
    
    /**
	 * Clicks the Close Screen Button NOTE - overwrites the BaseScreenUtils
	 * version as the close button is different to the standard.
	 */
    public void closeScreen()
    {
        cMB.clickButton(this.mBTN_CLOSE_SCREEN);
        if ( cMB.isAlertPresent() )
        {
            cMB.getAlert();
        }
        cMB.waitForPageToLoad ();
        if ( cMB.isAlertPresent() )
        {
            cMB.getAlert();
        }
    }

    /**
	 * Clicks the Save Button in the Maintain Bar Judg/ENF screen.
	 */
    public void clickSaveButton()
    {
        mClickButton(BTN_SAVE_DETAILS);
    }

}