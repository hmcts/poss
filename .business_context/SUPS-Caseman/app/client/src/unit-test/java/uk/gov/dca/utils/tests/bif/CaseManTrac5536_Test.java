/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 10265 $
 * $Author: vincentcp $
 * $Date: 2014-01-27 11:51:30 +0000 (Mon, 27 Jan 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the interim returns reference data update.
 *
 * @author Chris Vincent
 */
public class CaseManTrac5536_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The home control warrant. */
    private String homeControlWarrant = "1A000003";
    
    /** The home control case. */
    private String homeControlCase = "A04NN003";

    /**
     * Constructor.
     */
    public CaseManTrac5536_Test ()
    {
        super (CaseManTrac5536_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Tests that the interim return AB can be created and it has the right description.
     */
    public void testABInterimReturn ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAB = new NewStandardEvent ("WarrantReturn-AB");
            testEventAB.setSubjectParty ("DEFENDANT NAME");
            testEventAB.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAB, null);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AB");
            assertEquals ("TAKING CONTROL (WITH THE BAILIFF)", myUC045WarrantReturnsUtils.getReturnCodeDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return AD can be created and it has the right description.
     */
    public void testADInterimReturn ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAD = new NewStandardEvent ("WarrantReturn-AD");
            testEventAD.setSubjectParty ("DEFENDANT NAME");
            testEventAD.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAD, null);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AD");
            assertEquals ("TAKING CONTROL/APPLICATION TO SET ASIDE JUDGMENT: CONTROL WARRANT",
                    myUC045WarrantReturnsUtils.getReturnCodeDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return AD can be created and it has the right description.
     */
    public void testAEInterimReturn ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEventAE = new NewStandardEvent ("WarrantReturn-AE");
            testEventAE.setSubjectParty ("DEFENDANT NAME");
            testEventAE.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEventAE, null);

            // Ensure the correct return code description is used
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AE");
            assertEquals ("LEVY/APPLICATION TO SUSPEND OR VARY: CONTROL WARRANT",
                    myUC045WarrantReturnsUtils.getReturnCodeDescription ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the interim return AG can no longer be created, but existing returns are still visible.
     */
    public void testAGInterimReturn ()
    {
        try
        {
            // Get to the Warrant Returns screen
            mLoginAndNavigateToScreen ();

            // Set the Header fields
            myUC045WarrantReturnsUtils.setCaseNumber (homeControlCase);
            myUC045WarrantReturnsUtils.setWarrantNumber (homeControlWarrant);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Check existing AG events are still visible
            myUC045WarrantReturnsUtils.selectGridRowByEventId ("AG");
            assertEquals ("INDEMNITY REQUIRED: BREAKING INTO PREMISES",
                    myUC045WarrantReturnsUtils.getReturnCodeDescription ());

            // Check a new AG return cannot be created
            myUC045WarrantReturnsUtils.setNewReturnCode ("AG");
            assertFalse ("Return code field valid when should be invalid",
                    myUC045WarrantReturnsUtils.isNewReturnCodeValid ());
            myUC045WarrantReturnsUtils.setNewReturnCodeFocus ();
            mCheckStatusBarText ("Invalid return entered.");
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
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Private function that logs the user into CaseMan and navigates to the Warrant Returns screen.
     */
    private void mLoginAndNavigateToScreen ()
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

        // Navigate to the Warrant Returns screen
        this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());
    }
}