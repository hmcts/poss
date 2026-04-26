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
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 3485.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3485_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The county court case. */
    // Northampton Case
    private String countyCourtCase = "9NN00001";
    
    /** The district registry case. */
    private String districtRegistryCase = "9NN00003";

    /**
     * Constructor.
     */
    public CaseManTrac3485_Test ()
    {
        super (CaseManTrac3485_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);

    }

    /**
     * Tests that when Case Event 20 is created on a County Court Case, the correct BMS Task
     * is created against the Case Event.
     */
    public void testCountyCourtCaseEvent20BMS ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a County Court Case
            myUC002CaseEventUtils.loadCaseByCaseNumber (countyCourtCase);

            // Create Case Event 20
            final NewStandardEvent testEvent20 = new NewStandardEvent ("20");
            testEvent20.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent20.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent20, null);

            // Check BMS Task
            assertEquals ("BMS Task is not the expected value", "IS6", myUC002CaseEventUtils.getEventBMSTask ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when Case Event 20 is created on a District Registry Case, the correct BMS Task
     * is created against the Case Event.
     */
    public void testDistrictRegistryCaseEvent20BMS ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load a District Registry Case
            myUC002CaseEventUtils.loadCaseByCaseNumber (districtRegistryCase);

            // Create Case Event 20
            final NewStandardEvent testEvent20 = new NewStandardEvent ("20");
            testEvent20.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent20.setProduceOutputFlag (false);
            myUC002CaseEventUtils.addNewEvent (testEvent20, null);

            // Check BMS Task
            assertEquals ("BMS Task is not the expected value", "DR17", myUC002CaseEventUtils.getEventBMSTask ());
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