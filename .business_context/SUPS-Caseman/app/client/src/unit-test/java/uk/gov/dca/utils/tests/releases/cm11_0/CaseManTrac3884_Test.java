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
import uk.gov.dca.utils.screens.UC116COEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the TRAC 3884.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3884_Test extends AbstractCmTestBase
{
    
    /** The my UC 116 CO event utils. */
    // Private member variables for the screen utils
    private UC116COEventUtils myUC116COEventUtils;

    /** The test AO no money. */
    // Private enforcement numbers
    private String testAONoMoney = "100001NN";

    /**
     * Constructor.
     */
    public CaseManTrac3884_Test ()
    {
        super (CaseManTrac3884_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC116COEventUtils = new UC116COEventUtils (this);
    }

    /**
     * Tests that a Consolidated Order which has a Lapsed Date populated is correctly updated to have a
     * lapsed date of NULL when a CO Event 858 is created.
     */
    public void testAOTransfer ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the CO Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CO_EVENTS_PATH);
            mCheckPageTitle (myUC116COEventUtils.getScreenTitle ());

            final String query = "SELECT DECODE(ATTACHMENT_LAPSED_DATE, NULL, 'true', 'false') " +
                    "FROM CONSOLIDATED_ORDERS " + "WHERE CO_NUMBER = '" + testAONoMoney + "'";

            // Load Consolidated Order
            myUC116COEventUtils.loadCOByCONumberAndCourt (testAONoMoney, "282");

            // Check CO Lapsed Date is NOT NULL
            assertFalse ("CO Lapsed Date is NULL.", DBUtil.runDecodeTrueFalseQuery (query));

            /**
             * Create Event 858 (AO & CAEO)
             * No Issue Stage / Service Status
             * Mandatory Details field
             * No Creditor
             * No Variable Data Screen / FCK Editor
             */
            final NewStandardEvent testEvent858 = new NewStandardEvent ("858");
            myUC116COEventUtils.addNewEvent (testEvent858, null);

            // Check CO Lapsed Date is NULL
            assertTrue ("CO Lapsed Date is not NULL.", DBUtil.runDecodeTrueFalseQuery (query));
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