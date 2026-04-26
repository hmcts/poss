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

package uk.gov.dca.utils.tests.shakedown;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;

/**
 * Automated tests for the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class ForeignWarrantsTest extends AbstractCmTestBase
{
    
    /** The my UC 030 create foreign warrant utils. */
    // Private member variables for the screen utils
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;

    /**
     * Constructor.
     */
    public ForeignWarrantsTest ()
    {
        super (ForeignWarrantsTest.class.getName ());
        this.nav = new Navigator (this);
        myUC030CreateForeignWarrantUtils = new UC030CreateForeignWarrantUtils (this);
    }

    /**
     * Test to create a new foreign warrant record.
     */
    public void testCreateForeignWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Foreign Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("170");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("9CH00001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("X0000009");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepName ("Party For Rep Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline1 ("Party For Rep Adline1");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline2 ("Party For Rep Adline2");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline3 ("Party For Rep Adline3");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline4 ("Party For Rep Adline4");
            myUC030CreateForeignWarrantUtils.setPartyForRepAdline5 ("Party For Rep Adline5");
            myUC030CreateForeignWarrantUtils.setPartyForRepPostcode ("TF3 4NT");
            myUC030CreateForeignWarrantUtils.setPartyForRepDX ("Party For Rep DX");
            myUC030CreateForeignWarrantUtils.setPartyForRepTelephone ("11111 111111");
            myUC030CreateForeignWarrantUtils.setPartyForRepFax ("22222 222222");
            myUC030CreateForeignWarrantUtils.setPartyForRepEmail ("partyforrep@email.com");
            myUC030CreateForeignWarrantUtils.setPartyForRepReference ("Party For Rep Reference");

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline3 ("Party Against One Adline3");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline4 ("Party Against One Adline4");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline5 ("Party Against One Adline5");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOnePostcode ("TF3 5NT");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoName ("Party Against Two Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline1 ("Party Against Two Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline2 ("Party Against Two Adline2");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline3 ("Party Against Two Adline3");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline4 ("Party Against Two Adline4");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoAdline5 ("Party Against Two Adline5");
            myUC030CreateForeignWarrantUtils.setPartyAgainstTwoPostcode ("TF3 6NT");

            // Set the footer fields
            myUC030CreateForeignWarrantUtils.setBailiffAreaNumber ("1");
            myUC030CreateForeignWarrantUtils.setAdditionalDetails ("Additional Details");

            // Set the Warrant Details Popup fields
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantButton (); // Raise popup
            myUC030CreateForeignWarrantUtils.setBalanceOfDebt ("500.00");
            myUC030CreateForeignWarrantUtils.setAmountOfWarrant ("450.00");
            myUC030CreateForeignWarrantUtils.setWarrantFee ("50.00");
            myUC030CreateForeignWarrantUtils.setSolicitorsCosts ("100.00");
            myUC030CreateForeignWarrantUtils.setLandRegistryFee ("25.00");
            myUC030CreateForeignWarrantUtils.clickDetailsOfWarrantPopupOk (); // Close popup

            myUC030CreateForeignWarrantUtils.clickSaveButton ();
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