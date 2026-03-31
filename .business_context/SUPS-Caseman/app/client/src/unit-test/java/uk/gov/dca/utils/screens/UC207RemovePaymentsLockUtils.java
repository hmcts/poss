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
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the Remove Payments Lock screen.
 *
 * Date: 16-Mar-2011
 */
public class UC207RemovePaymentsLockUtils extends AbstractBaseScreenUtils
{
    
    /** The m BT N CLOS E SCREEN. */
    // Overwrites the base class close screen button (is Cancel button in this screen)
    private String mBTN_CLOSE_SCREEN = "Status_CloseBtn";

    /** The btn remove lock. */
    // Private button identifiers
    private String BTN_REMOVE_LOCK = "Status_RemoveBtn";

    /** The grid lock records. */
    // Private grid identifiers
    private String GRID_LOCK_RECORDS = "Records_Grid";

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC207RemovePaymentsLockUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "Remove Payments Lock";
    }

    /**
     * Clicks the Remove button which removes the currently selected Lock record.
     */
    public void clickRemoveButton ()
    {
        cMB.getButtonAdaptor (BTN_REMOVE_LOCK).click ();
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }

        // Wait in case service called
        cMB.waitForPageToLoad ();
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
     * Gets the number lock records.
     *
     * @return the number lock records
     */
    public int getNumberLockRecords ()
    {
        return countGridRows (GRID_LOCK_RECORDS);
    }

    /**
     * Indicates whether or not a specified value exists in a specified column
     * in the locks grid.
     *
     * @param pValue The String to search for in the grid
     * @param pCol The column number to search
     * @return True if the value is in the grid column, else false
     */
    public boolean isValueInResultsGrid (final String pValue, final int pCol)
    {
        return isValueInGridColumn (GRID_LOCK_RECORDS, pValue, pCol);
    }

    /**
     * Selects a row in the locks grid by row number specified.
     *
     * @param rowNumber The row number to select (starts from 1)
     */
    public void selectRecordByRowNumber (final int rowNumber)
    {
        final GridAdaptor locksGrid = cMB.getGridAdaptor (GRID_LOCK_RECORDS);
        locksGrid.clickRow (rowNumber);
    }

}