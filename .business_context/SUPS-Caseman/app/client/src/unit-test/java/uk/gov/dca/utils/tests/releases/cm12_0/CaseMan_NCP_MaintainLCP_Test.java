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
import uk.gov.dca.utils.screens.UC017MaintainLocalCodedPartiesUtils;
import uk.gov.dca.utils.tests.shakedown.CreateUpdateCaseTest;

/**
 * Automated tests for the Coded Party range changes on the Maintain Local Coded Parties screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_MaintainLCP_Test extends AbstractCmTestBase
{
    
    /** The my UC 017 maintain local coded parties utils. */
    // Private member variables for the screen utils
    private UC017MaintainLocalCodedPartiesUtils myUC017MaintainLocalCodedPartiesUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_MaintainLCP_Test ()
    {
        super (CreateUpdateCaseTest.class.getName ());
        this.nav = new Navigator (this);
        myUC017MaintainLocalCodedPartiesUtils = new UC017MaintainLocalCodedPartiesUtils (this);
    }

    /**
     * Tests that only local coded parties can be updated.
     */
    public void testLocalCodedPartyQuery ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_CODED);

            final String[] positiveCodes = {"100", "400", "500"};
            final String[] negativeCodes = {"1500", "7000", "7600", "7800"};

            // Navigate to the Maintain Local Coded Parties screen
            this.nav.navigateFromMainMenu (MAINMENU_LOCAL_CODED_PARTIES_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC017MaintainLocalCodedPartiesUtils.getScreenTitle ());

            // Enter search criteria and click Search
            myUC017MaintainLocalCodedPartiesUtils.setQueryPartyName ("NAME");
            myUC017MaintainLocalCodedPartiesUtils.clickSearchButton ();

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - Coded Party Code: " + positiveCodes[i]);
                myUC017MaintainLocalCodedPartiesUtils.selectRecordByCode (positiveCodes[i]);
                assertTrue ("Update button is disabled",
                        myUC017MaintainLocalCodedPartiesUtils.isUpdateButtonEnabled ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                myUC017MaintainLocalCodedPartiesUtils.selectRecordByCode (negativeCodes[i]);
                assertFalse ("Update button is enabled",
                        myUC017MaintainLocalCodedPartiesUtils.isUpdateButtonEnabled ());
            }
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that only Local Coded Parties can be added.
     */
    public void testLocalCodedPartyAdd ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_CODED);

            final String[] inUseCodes = {"100", "400", "500"};
            final String[] freeCodes = {"200", "1499", "2000", "5000", "6999"};
            final String[] nationalCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "7000", "9999"};

            // Navigate to the Maintain Local Coded Parties screen
            this.nav.navigateFromMainMenu (MAINMENU_LOCAL_CODED_PARTIES_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC017MaintainLocalCodedPartiesUtils.getScreenTitle ());

            // Click Add to raise the Coded Party subform
            myUC017MaintainLocalCodedPartiesUtils.clickAddButton ();

            // In Use tests
            for (int i = 0, l = inUseCodes.length; i < l; i++)
            {
                System.out.println ("In Use Test - Coded Party Code: " + inUseCodes[i]);
                myUC017MaintainLocalCodedPartiesUtils.setPopupPartyCode (inUseCodes[i]);
                assertFalse ("Popup Code Field is valid",
                        myUC017MaintainLocalCodedPartiesUtils.isPopupPartyCodeValid ());
                myUC017MaintainLocalCodedPartiesUtils.setPopupPartyCodeFocus ();
                assertEquals (myUC017MaintainLocalCodedPartiesUtils.getCodedPartySubformStatusBarText (),
                        "This code is already in use, please re-enter.");
            }

            // National Coded Party tests
            for (int i = 0, l = nationalCodes.length; i < l; i++)
            {
                System.out.println ("In Use Test - Coded Party Code: " + nationalCodes[i]);
                myUC017MaintainLocalCodedPartiesUtils.setPopupPartyCode (nationalCodes[i]);
                assertFalse ("Popup Code Field is valid",
                        myUC017MaintainLocalCodedPartiesUtils.isPopupPartyCodeValid ());
                myUC017MaintainLocalCodedPartiesUtils.setPopupPartyCodeFocus ();
                assertEquals (myUC017MaintainLocalCodedPartiesUtils.getCodedPartySubformStatusBarText (),
                        "National Coded Parties can only be created by Helpdesk.");
            }

            // National Coded Party tests
            for (int i = 0, l = freeCodes.length; i < l; i++)
            {
                System.out.println ("In Use Test - Coded Party Code: " + freeCodes[i]);
                myUC017MaintainLocalCodedPartiesUtils.setPopupPartyCode (freeCodes[i]);
                assertTrue ("Popup Code Field is invalid",
                        myUC017MaintainLocalCodedPartiesUtils.isPopupPartyCodeValid ());
            }

            myUC017MaintainLocalCodedPartiesUtils.setPopupPartyName ("NEW LCP NAME");
            myUC017MaintainLocalCodedPartiesUtils.setPopupAddressLine1 ("NEW LCP ADLINE1");
            myUC017MaintainLocalCodedPartiesUtils.setPopupAddressLine2 ("NEW LCP ADLINE2");
            myUC017MaintainLocalCodedPartiesUtils.popupClickSave ();
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