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
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the View Court Data screen.
 *
 * Date: 15-Feb-2010
 */
public class UC016ViewCourtDataUtils extends AbstractBaseScreenUtils
{
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The text court code. */
    // Private field identifiers
    private String TEXT_COURT_CODE = "Header_Court_Code";
    
    /** The auto court name. */
    private String AUTO_COURT_NAME = "Header_Court_Name";
    
    /** The text court id. */
    private String TEXT_COURT_ID = "Header_Id";
    
    /** The chk district registry. */
    private String CHK_DISTRICT_REGISTRY = "Header_District_Registry";
    
    /** The text welsh hc name. */
    private String TEXT_WELSH_HC_NAME = "Results_Welsh_HighCourt_Name";
    
    /** The text welsh cc name. */
    private String TEXT_WELSH_CC_NAME = "Results_Welsh_CountyCourt_Name";
    
    /** The text dm court. */
    private String TEXT_DM_COURT = "Results_DMCourt";

    /** The btn search court. */
    // Private button identifiers
    private String BTN_SEARCH_COURT = "Header_SearchBtn";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC016ViewCourtDataUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "View Court Data";
    }

    /**
     * Sets the court code.
     *
     * @param pCourtCode the new court code
     */
    public void setCourtCode (final String pCourtCode)
    {
        setTextFieldValue (TEXT_COURT_CODE, pCourtCode);
    }

    /**
     * Sets the court name.
     *
     * @param pCourtName the new court name
     */
    public void setCourtName (final String pCourtName)
    {
        final AutoCompleteAdaptor subjectField = cMB.getAutoCompleteAdaptor (AUTO_COURT_NAME);
        subjectField.typeText (pCourtName);
    }

    /**
     * Sets the court id.
     *
     * @param pCourtId the new court id
     */
    public void setCourtId (final String pCourtId)
    {
        setTextFieldValue (TEXT_COURT_ID, pCourtId);
    }

    /**
     * Sets the court district registry.
     *
     * @param pDistrictRegistry the new court district registry
     */
    public void setCourtDistrictRegistry (final boolean pDistrictRegistry)
    {
        setCheckboxFieldValue (CHK_DISTRICT_REGISTRY, pDistrictRegistry);
    }

    /**
     * Clicks the Search Button.
     */
    public void clickSearchButton ()
    {
        // Click the Search button to load Court details
        mClickButton (BTN_SEARCH_COURT);
    }

    /**
     * Function returns the status of the Welsh High Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    public boolean checkWelshHighCourtNameStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_WELSH_HC_NAME, mode);
    }

    /**
     * Function returns the status of the Welsh County Court Name field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    public boolean checkWelshCountyCourtNameStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_WELSH_CC_NAME, mode);
    }

    /**
     * Function returns the status of the Diary Manager Court field depending upon
     * the mode passed in.
     *
     * @param mode The mode to check for, e.g. Read Only, Mandatory, Enablement or Valid
     * @return True if the field is read only/enabled/mandatory/valid depending upon mode
     * @throws FrameworkException The framework exception thrown
     */
    public boolean checkDMCourtStatus (final int mode) throws FrameworkException
    {
        return checkTextFieldStatus (TEXT_DM_COURT, mode);
    }

    /**
     * Clicks the Close Screen Button
     * NOTE - overwrites the AbstractBaseScreenUtils version as the close button is different
     * to the standard.
     */
    public void closeScreen ()
    {
        // Click the close button to exit the screen
        mClickButton (this.mBTN_CLOSE_SCREEN);
    }

}