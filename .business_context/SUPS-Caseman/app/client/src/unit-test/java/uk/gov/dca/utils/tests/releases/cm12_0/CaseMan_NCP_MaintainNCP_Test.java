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

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC121MaintainNationalCodedPartiesUtils;
import uk.gov.dca.utils.tests.shakedown.CreateUpdateCaseTest;

/**
 * Automated tests for the Coded Party range changes on the Maintain National Coded Parties screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_MaintainNCP_Test extends AbstractCmTestBase
{
    
    /** The my UC 121 maintain national coded parties utils. */
    // Private member variables for the screen utils
    private UC121MaintainNationalCodedPartiesUtils myUC121MaintainNationalCodedPartiesUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_MaintainNCP_Test ()
    {
        super (CreateUpdateCaseTest.class.getName ());
        this.nav = new Navigator (this);
        myUC121MaintainNationalCodedPartiesUtils = new UC121MaintainNationalCodedPartiesUtils (this);
    }

    /**
     * Tests that only national coded parties are returned in the results grid.
     */
    public void testNationalCodedPartyQuery ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            final String[] negativeCodes = {"100", "400", "500"};
            final String[] positiveCodes = {"1500", "7000", "7600", "7800", "8500"};

            // Navigate to the Maintain National Coded Parties screen
            this.nav.navigateFromMainMenu (MAINMENU_NATIONAL_CODED_PARTIES_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC121MaintainNationalCodedPartiesUtils.getScreenTitle ());

            // Enter search criteria and click Search
            myUC121MaintainNationalCodedPartiesUtils.setQueryPartyName ("NAME");
            myUC121MaintainNationalCodedPartiesUtils.clickSearchButton ();

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - Coded Party Code: " + positiveCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.selectRecordByCode (positiveCodes[i]);
                assertTrue ("Update button is disabled",
                        myUC121MaintainNationalCodedPartiesUtils.isUpdateButtonEnabled ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                assertFalse ("Update button is enabled",
                        myUC121MaintainNationalCodedPartiesUtils.isValueInResultsGrid (negativeCodes[i], 1));
            }
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that only National Coded Parties can be added.
     */
    public void testNationalCodedPartyAdd ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            final String[] negativeCodes = {"100", "400", "500", "1499", "2000", "6999"};

            final String[] inUseCodes = {"1500", "7000"};

            final String[] ccbcCodes = {"1550", "7455", "7585", "7588", "7675", "7720", "7772", "7791", "7828", "7835",
                    "7894", "7909", "7977", "8247", "8298", "8334", "8361", "8636", "8674", "8678", "8724", "8825",
                    "8854", "8930", "8964", "9530", "9632", "9634", "9666", "9668", "9755", "9790", "9822", "9907",
                    "9960"};

            final String[] nonCcbcCodes = {"7001", "7354", "7456", "7516", "7587", "7676", "7719", "7773", "7790",
                    "7829", "7834", "7895", "7908", "7978", "8246", "8299", "8333", "8362", "8635", "8676", "8725",
                    "8824", "8855", "8929", "8965", "9529", "9633", "9667", "9756", "9789", "9823", "9906", "9961"};

            // Navigate to the Maintain National Coded Parties screen
            this.nav.navigateFromMainMenu (MAINMENU_NATIONAL_CODED_PARTIES_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC121MaintainNationalCodedPartiesUtils.getScreenTitle ());

            // Click Add to raise the Coded Party subform
            myUC121MaintainNationalCodedPartiesUtils.clickAddButton ();

            myUC121MaintainNationalCodedPartiesUtils.setPopupPartyName ("NEW NCP NAME");
            myUC121MaintainNationalCodedPartiesUtils.setPopupAddressLine1 ("NEW NCP ADLINE1");
            myUC121MaintainNationalCodedPartiesUtils.setPopupAddressLine2 ("NEW NCP ADLINE2");

            // Negative tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCode (negativeCodes[i]);
                assertFalse ("Popup Code Field is valid",
                        myUC121MaintainNationalCodedPartiesUtils.isPopupPartyCodeValid ());
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCodeFocus ();
                assertEquals (myUC121MaintainNationalCodedPartiesUtils.getCodedPartySubformStatusBarText (),
                        "National Coded Parties must be in the range 1500-1999 or 7000-9999.");
            }

            // In Use tests
            for (int i = 0, l = inUseCodes.length; i < l; i++)
            {
                System.out.println ("In Use Test - Coded Party Code: " + inUseCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCode (inUseCodes[i]);
                assertFalse ("Popup Code Field is valid",
                        myUC121MaintainNationalCodedPartiesUtils.isPopupPartyCodeValid ());
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCodeFocus ();
                assertEquals (myUC121MaintainNationalCodedPartiesUtils.getCodedPartySubformStatusBarText (),
                        "This code is already in use, please re-enter.");
            }

            // CCBC National Coded Party tests
            for (int i = 0, l = ccbcCodes.length; i < l; i++)
            {
                System.out.println ("CCBC National Coded Party Test - Coded Party Code: " + ccbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCode (ccbcCodes[i]);
                assertTrue ("Popup Code Field is invalid",
                        myUC121MaintainNationalCodedPartiesUtils.isPopupPartyCodeValid ());
                assertTrue ("Payee tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_PAYEE));
                assertTrue ("CCBC Details tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CCBC));
                assertTrue ("Default Claimant tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CLAIMANT));
            }

            // Non CCBC National Coded Party tests
            for (int i = 0, l = nonCcbcCodes.length; i < l; i++)
            {
                System.out.println ("Non-CCBC National Coded Party Test - Coded Party Code: " + nonCcbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.setPopupPartyCode (nonCcbcCodes[i]);
                assertTrue ("Popup Code Field is invalid",
                        myUC121MaintainNationalCodedPartiesUtils.isPopupPartyCodeValid ());
                assertFalse ("Payee tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_PAYEE));
                assertFalse ("CCBC Details tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CCBC));
                assertFalse ("Default Claimant tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CLAIMANT));
            }

            myUC121MaintainNationalCodedPartiesUtils.popupClickSave ();

            myUC121MaintainNationalCodedPartiesUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that only National Coded Parties can be updated.
     */
    public void testNationalCodedPartyUpdate ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            final String[] ccbcCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250", "8360",
                    "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};

            final String[] nonCcbcCodes = {"7000", "8500"};

            // Navigate to the Maintain National Coded Parties screen
            this.nav.navigateFromMainMenu (MAINMENU_NATIONAL_CODED_PARTIES_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC121MaintainNationalCodedPartiesUtils.getScreenTitle ());

            // CCBC National Coded Party tests
            for (int i = 0, l = ccbcCodes.length; i < l; i++)
            {
                System.out.println ("CCBC National Coded Party Test - Coded Party Code: " + ccbcCodes[i]);

                // Search for and select the National Coded Party
                myUC121MaintainNationalCodedPartiesUtils.setQueryPartyCode (ccbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.clickSearchButton ();
                myUC121MaintainNationalCodedPartiesUtils.selectRecordByCode (ccbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.clickUpdateButton ();

                // Check the tabbed pages are correctly enabled/disabled
                assertTrue ("Payee tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_PAYEE));
                assertTrue ("CCBC Details tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CCBC));
                assertTrue ("Default Claimant tabbed page is disabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CLAIMANT));

                myUC121MaintainNationalCodedPartiesUtils.popupClickCancel ();
            }

            // Non CCBC National Coded Party tests
            for (int i = 0, l = nonCcbcCodes.length; i < l; i++)
            {
                System.out.println ("Non-CCBC National Coded Party Test - Coded Party Code: " + nonCcbcCodes[i]);

                // Search for and select the National Coded Party
                myUC121MaintainNationalCodedPartiesUtils.setQueryPartyCode (nonCcbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.clickSearchButton ();
                myUC121MaintainNationalCodedPartiesUtils.selectRecordByCode (nonCcbcCodes[i]);
                myUC121MaintainNationalCodedPartiesUtils.clickUpdateButton ();

                // Check the tabbed pages are correctly enabled/disabled
                assertFalse ("Payee tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_PAYEE));
                assertFalse ("CCBC Details tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CCBC));
                assertFalse ("Default Claimant tabbed page is enabled", myUC121MaintainNationalCodedPartiesUtils
                        .isTabbedPageEnabled (UC121MaintainNationalCodedPartiesUtils.TABBED_PAGE_CLAIMANT));

                myUC121MaintainNationalCodedPartiesUtils.popupClickCancel ();
            }

            myUC121MaintainNationalCodedPartiesUtils.closeScreen ();
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
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