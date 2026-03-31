/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11604 $
 * $Author: vincentcp $
 * $Date: 2015-02-11 15:22:12 +0000 (Wed, 11 Feb 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm19_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TCE changes to the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class TCE_ForeignWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 030 create foreign warrant utils. */
    // Private member variables for the screen utils
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;

    /**
     * Constructor.
     */
    public TCE_ForeignWarrants_Test ()
    {
        super (TCE_ForeignWarrants_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC030CreateForeignWarrantUtils = new UC030CreateForeignWarrantUtils (this);
    }

    /**
     * Tests the behaviour of the Create Foreign Warrants screen following the TCE changes
     * EXECUTION Warrants have been removed and replaced with CONTROL warrants.
     */
    public void testForeignWarrantBehaviour ()
    {
        try
        {
            // Get to the Create Foreign Warrants screen
            mLoginAndNavigateToScreen ();

            // Ensure when enter the screen, the default value is CONTROL
            assertEquals (UC030CreateForeignWarrantUtils.WARRANT_TYPE_CONTROL,
                    myUC030CreateForeignWarrantUtils.getWarrantType ());

            // Set the Foreign Warrant header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("390");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("3NN00001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("A0000001");
            myUC030CreateForeignWarrantUtils.setHomeIssueDate (AbstractBaseUtils.now ());

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");
            myUC030CreateForeignWarrantUtils.setPartyForRepReference ("Party For Rep Reference");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");

            // Ensure Balance of Debt and Amount of Warrant fields are optional for COMMITTAL warrants
            myUC030CreateForeignWarrantUtils.setWarrantType (UC030CreateForeignWarrantUtils.WARRANT_TYPE_COMMITTAL);
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isAmountOfWarrantMandatory ());
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupCancel (); // Close popup

            // Ensure Balance of Debt and Amount of Warrant fields are optional for DELIVERY warrants
            myUC030CreateForeignWarrantUtils.setWarrantType (UC030CreateForeignWarrantUtils.WARRANT_TYPE_DELIVERY);
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isAmountOfWarrantMandatory ());
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupCancel (); // Close popup

            // Ensure Balance of Debt and Amount of Warrant fields are optional for POSSESSION warrants
            myUC030CreateForeignWarrantUtils.setWarrantType (UC030CreateForeignWarrantUtils.WARRANT_TYPE_POSSESSION);
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            assertFalse ("Balance of Debt field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isBalanceOfDebtMandatory ());
            assertFalse ("Amount of Warrant field is mandatory when should be optional",
                    myUC030CreateForeignWarrantUtils.isAmountOfWarrantMandatory ());
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupCancel (); // Close popup

            // Ensure Balance of Debt and Amount of Warrant fields are mandatorty for CONTROL warrants
            myUC030CreateForeignWarrantUtils.setWarrantType (UC030CreateForeignWarrantUtils.WARRANT_TYPE_CONTROL);
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            assertTrue ("Balance of Debt field is optional when should be mandatory",
                    myUC030CreateForeignWarrantUtils.isBalanceOfDebtMandatory ());
            assertTrue ("Amount of Warrant field is optional when should be mandatory",
                    myUC030CreateForeignWarrantUtils.isAmountOfWarrantMandatory ());

            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("500.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC030CreateForeignWarrantUtils.clickSaveButton ();

            // Check the BMS Task Counts
            assertTrue ("BMS Task EN67 for Northampton expected but not created",
                    DBUtil.getBMSTaskCount ("EN67", "282") == 1);
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

    /**
     * Private function that logs the user into CaseMan and navigates to the Create Foreign Warrants screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Create Foreign Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());
    }

}