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

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;

/**
 * Automated tests for the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac4206_Test extends AbstractCmTestBase
{
    
    /** The my UC 030 create foreign warrant utils. */
    // Private member variables for the screen utils
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4206_Test ()
    {
        super (CaseManTrac4206_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC030CreateForeignWarrantUtils = new UC030CreateForeignWarrantUtils (this);
    }

    /**
     * Test to create a new foreign warrant record issued by CCBC with a 7 digit Warrant Number.
     */
    public void testCreateCCBCForeignWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Foreign Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());

            // Set the Header fields, note Issued By is NULL
            myUC030CreateForeignWarrantUtils.setCaseNumber ("0XY50108");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("ZH51129");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Test that when Issued By is NULL, a 7 Digit Warrant Number is acceptable
            assertTrue ("Error 1 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Issued By to a Non CCBC Court Code and Test that a 7 Digit Warrant Number is not acceptable
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("180");
            assertFalse ("Error 2 - Warrant Number field valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Issued By to CCBC Court Code and Test that 7 Digit Warrant Number is acceptable
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("335");
            assertTrue ("Error 3 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Warrant Number to standard 8 digit Warrant Number with CCBC Issued By and test is acceptable
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("X0000001");
            assertTrue ("Error 4 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Warrant Number to standard 8 digit Reissued Warrant Number with CCBC Issued By and test is
            // acceptable
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("00001/11");
            assertTrue ("Error 5 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Issued By to a Non CCBC Court Code and Test that the Reissued Warrant Number is acceptable
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("180");
            assertTrue ("Error 6 - Warrant Number field valid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Change Warrant Number to standard 8 digit Warrant Number with Non CCBC Issued By and test is acceptable
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("X0000001");
            assertTrue ("Error 7 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Setup 7 digit Warrant Number Issued by CCBC again and continue with creation of Foreign Warrant
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("335");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("ZH51129");
            assertTrue ("Error 8 - Warrant Number field invalid",
                    myUC030CreateForeignWarrantUtils.isWarrantNumberValid ());

            // Set the Party For fields
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");
            myUC030CreateForeignWarrantUtils.setPartyForRepCode ("1501");
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