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

package uk.gov.dca.utils.tests.releases.cm12_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC030CreateForeignWarrantUtils;

/**
 * Automated tests for the Coded Party range changes on the Create Foreign Warrants screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_CreateForeignWarrants_Test extends AbstractCmTestBase
{
    
    /** The my UC 030 create foreign warrant utils. */
    // Private member variables for the screen utils
    private UC030CreateForeignWarrantUtils myUC030CreateForeignWarrantUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_CreateForeignWarrants_Test ()
    {
        super (CaseMan_NCP_CreateForeignWarrants_Test.class.getName ());
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
            final String[] ccbcNCPCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] nonCCBCNCPCodes = {"7000", "8500"};
            final String[] localCPCodes = {"100", "400", "500"};

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Foreign Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_FOREIGN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC030CreateForeignWarrantUtils.getScreenTitle ());

            // Set the Header fields
            myUC030CreateForeignWarrantUtils.setIssuingCourtCode ("335");
            myUC030CreateForeignWarrantUtils.setCaseNumber ("1QX00001");
            myUC030CreateForeignWarrantUtils.setWarrantNumber ("ZZ00001");
            myUC030CreateForeignWarrantUtils
                    .setHomeIssueDate (AbstractBaseUtils.getFutureDate ( -50, AbstractBaseUtils.DATE_FORMAT_NOW, false));

            // Party For CCBC NCP Tests
            for (int i = 0, l = ccbcNCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For CCBC NCP Test - Coded Party Code: " + ccbcNCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForCode (ccbcNCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForName (),
                        "CCBC NCP " + ccbcNCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable", myUC030CreateForeignWarrantUtils.isPartyForNameReadOnly ());
            }

            // Party For Non-CCBC NCP Tests
            for (int i = 0, l = nonCCBCNCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For Non-CCBC NCP Test - Coded Party Code: " + nonCCBCNCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForCode (nonCCBCNCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForName (),
                        "NON CPC CODED PARTY " + nonCCBCNCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable", myUC030CreateForeignWarrantUtils.isPartyForNameReadOnly ());
            }

            // Party For LCP Tests
            for (int i = 0, l = localCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For LCP Test - Coded Party Code: " + localCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForCode (localCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForName (),
                        "NN LOCAL CODED PARTY " + localCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable", myUC030CreateForeignWarrantUtils.isPartyForNameReadOnly ());
            }

            // Clear the code field and enter non coded name
            myUC030CreateForeignWarrantUtils.setPartyForCode ("");
            myUC030CreateForeignWarrantUtils.setPartyForName ("Party For Name");

            // Party For Rep LCP Tests
            for (int i = 0, l = localCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For LCP Test - Coded Party Code: " + localCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForRepCode (localCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForRepCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForRepName (),
                        "NN LOCAL CODED PARTY " + localCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable",
                        myUC030CreateForeignWarrantUtils.isPartyForRepNameReadOnly ());
            }

            // Party For Rep Non-CCBC NCP Tests
            for (int i = 0, l = nonCCBCNCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For Non-CCBC NCP Test - Coded Party Code: " + nonCCBCNCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForRepCode (nonCCBCNCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForRepCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForRepName (),
                        "NON CPC CODED PARTY " + nonCCBCNCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable",
                        myUC030CreateForeignWarrantUtils.isPartyForRepNameReadOnly ());
            }

            // Party For Rep CCBC NCP Tests
            for (int i = 0, l = ccbcNCPCodes.length; i < l; i++)
            {
                System.out.println ("Party For CCBC NCP Test - Coded Party Code: " + ccbcNCPCodes[i]);
                myUC030CreateForeignWarrantUtils.setPartyForRepCode (ccbcNCPCodes[i]);
                assertTrue ("Party For Code " + ccbcNCPCodes[i] + " is invalid",
                        myUC030CreateForeignWarrantUtils.isPartyForRepCodeValid ());
                assertEquals (myUC030CreateForeignWarrantUtils.getPartyForRepName (),
                        "CCBC NCP " + ccbcNCPCodes[i] + " NAME");
                assertTrue ("Party For Name is editable",
                        myUC030CreateForeignWarrantUtils.isPartyForRepNameReadOnly ());
            }

            // Set the Party Against fields
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneName ("Party Against One Name");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline1 ("Party Against One Adline1");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline2 ("Party Against One Adline2");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline3 ("Party Against One Adline3");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline4 ("Party Against One Adline4");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOneAdline5 ("Party Against One Adline5");
            myUC030CreateForeignWarrantUtils.setPartyAgainstOnePostcode ("TF3 5NT");

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

            // Save and exit screen
            myUC030CreateForeignWarrantUtils.clickSaveButton ();
            myUC030CreateForeignWarrantUtils.closeScreen ();
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