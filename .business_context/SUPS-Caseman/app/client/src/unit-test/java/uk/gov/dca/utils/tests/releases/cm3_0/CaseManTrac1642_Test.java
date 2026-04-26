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

package uk.gov.dca.utils.tests.releases.cm3_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;

/**
 * Automated tests for the Warrant Returns screen.
 *
 * @author Chris Vincent
 */
public class CaseManTrac1642_Test extends AbstractCmTestBase
{
    
    /** The my UC 045 warrant returns utils. */
    // Private member variables for the screen utils
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;

    /** The warrant number. */
    private String warrantNumber = "00001/09";
    
    /** The case number. */
    private String caseNumber = "9QX00001";
    
    /** The local number. */
    private String localNumber = "FWX00002";

    /**
     * Constructor.
     */
    public CaseManTrac1642_Test ()
    {
        super (CaseManTrac1642_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
    }

    /**
     * Tests that when an 8 digit Reissued Foreign Warrant has a final return added
     * to it, the MCOL_DATA row is not created as it will crash (MCOL_DATA row can only
     * store 7 digit warrant numbers).
     */
    public void testCreateWarrantReturnOnMCOLCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Warrant Returns screen
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            /**
             * Create Warrant Return 121 (Home & Foreign)
             * Notice field editable (defaults to checked)
             * Appointment fields read only
             * No associated output.
             */

            // Load Foreign Warrant linked to CO
            myUC045WarrantReturnsUtils.setExecutingCourtCode ("180");
            myUC045WarrantReturnsUtils.setWarrantNumber (warrantNumber);
            myUC045WarrantReturnsUtils.setCaseNumber (caseNumber);
            myUC045WarrantReturnsUtils.setLocalNumber (localNumber);
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