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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the CaseMan Defect 2050. This covers the creation of final Warrant
 * returns on Warrants issued by Courts not in service.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2050_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The sups issued home warrant no. */
    private String supsIssuedHomeWarrantNo = "X0000001";
    
    /** The sups issued case no. */
    private String supsIssuedCaseNo = "9NN00001";
    
    /** The pcol issued foreign warrant no. */
    private String pcolIssuedForeignWarrantNo = "FWY00001";
    
    /** The non sups issued foreign warrant no. */
    private String nonSupsIssuedForeignWarrantNo = "FWY00002";

    /**
     * Constructor.
     */
    public CaseManTrac2050_Test ()
    {
        super (CaseManTrac2050_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);

    }

    /**
     * Tests that a final return added to a SUPS Issued Home Warrant doesn't cause a screen
     * crash.
     */
    public void testSUPSIssuedWarrant ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 121 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Home Warrant
            myUC045WarrantReturnsUtils.setWarrantNumber (supsIssuedHomeWarrantNo);
            myUC045WarrantReturnsUtils.setCaseNumber (supsIssuedCaseNo);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent121 = new NewStandardEvent ("WarrantReturn-121");
            testEvent121.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent121.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent121, null);
            myUC045WarrantReturnsUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a final return added to a Non-SUPS Issued Foreign Warrant doesn't cause a screen
     * crash.
     */
    public void testNonSUPSIssuedWarrant ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 121 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Foreign Warrant
            myUC045WarrantReturnsUtils.setLocalNumber (nonSupsIssuedForeignWarrantNo);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent121 = new NewStandardEvent ("WarrantReturn-121");
            testEvent121.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent121.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent121, null);
            myUC045WarrantReturnsUtils.closeScreen ();

        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that a final return added to a PCOL (Not in service) Issued Foreign Warrant doesn't
     * cause a screen crash.
     */
    public void testPCOLIssuedWarrant ()
    {
        try
        {
            // Log in and navigate to Warrant Returns
            mLoginAndNavigateToScreen ();

            /**
             * Create Warrant Return 121 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Foreign Warrant
            myUC045WarrantReturnsUtils.setLocalNumber (pcolIssuedForeignWarrantNo);
            myUC045WarrantReturnsUtils.clickSearchButton ();

            // Configure the event
            final NewStandardEvent testEvent121 = new NewStandardEvent ("WarrantReturn-121");
            testEvent121.setSubjectParty ("DEFENDANT ONE NAME");
            testEvent121.setCheckNotice (true);

            // Add the event and clear screen down afterwards
            myUC045WarrantReturnsUtils.addNewEvent (testEvent121, null);
            myUC045WarrantReturnsUtils.closeScreen ();

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
     * Private function that logs the user into CaseMan and navigates to Warrant Returns screen.
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