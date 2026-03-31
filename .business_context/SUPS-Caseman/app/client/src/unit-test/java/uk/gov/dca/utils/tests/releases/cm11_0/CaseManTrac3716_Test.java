/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mistryn $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm11_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC029CreateHomeWarrantUtils;

/**
 * Automated tests for the CaseMan Defect TRAC 3716.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3716_Test extends AbstractCmTestBase
{
    
    /** The my UC 029 create home warrant utils. */
    // Private member variables for the screen utils
    private UC029CreateHomeWarrantUtils myUC029CreateHomeWarrantUtils;

    /** The home warrant case number. */
    // Case numbers to use in the tests
    private String homeWarrantCaseNumber = "9NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac3716_Test ()
    {
        super (CaseManTrac3716_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC029CreateHomeWarrantUtils = new UC029CreateHomeWarrantUtils (this);
    }

    /**
     * Tests that a Warrant can be created on a Case where the party for representative
     * has a reference of 25 characters in length.
     */
    public void testWarrantReferenceMaxLength ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_HOME_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC029CreateHomeWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC029CreateHomeWarrantUtils.setCaseNumber (homeWarrantCaseNumber);

            // Set the Warrant Details Popup fields
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC029CreateHomeWarrantUtils.setBalanceOfDebt ("500.00");
            myUC029CreateHomeWarrantUtils.setAmountOfWarrant ("450.00");
            myUC029CreateHomeWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            // Save to create Warrant and exit screen
            final String popupMessage = myUC029CreateHomeWarrantUtils.saveAndReturnAlertString ();

            assertFalse ("Problem with Save - Warrant not created.", popupMessage.equals (
                    "There was a problem with the save. Changes have not been saved. Returning to the calling screen"));

            myUC029CreateHomeWarrantUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Private function which checks the current screen title against the expected screen title.
     *
     * @param control The expected screen title
     */
    private void mCheckPageTitle (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getPageTitle ().indexOf (control) != -1);
    }

}