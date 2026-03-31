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

package uk.gov.dca.utils.tests.releases.cm4_0;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Defect 2651. This covers a change to the BMSHelper
 * to correctly determine BMS Age Category by including non working days (bank holidays)
 * in the calculation.
 *
 * @author Chris Vincent
 */
public class CaseManTrac2651_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /** The test case number. */
    // Case Number to use
    private String testCaseNumber = "9NN00001";

    /**
     * Constructor.
     */
    public CaseManTrac2651_Test ()
    {
        super (CaseManTrac2651_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests case event 19 with receipt date set to current date so event will have
     * an age category of 0-5 Days.
     */
    public void testBMSTaskAge1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            /**
             * Create Event 19
             * Has Subject
             * No Navigation to the Obligations screen
             * No Word Processing / Oracle Report
             * Don't set receipt date
             */
            final NewStandardEvent testEvent19 = new NewStandardEvent ("19");
            testEvent19.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent19, null);

            // Check that the BMS age category of the event is correct
            assertTrue ("Case Event Age Category is not equal to: " + BMS_TASK_AGE_5,
                    DBUtil.getCaseEventBMSAgeCategory (testCaseNumber, "19").equals (BMS_TASK_AGE_5));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 19 with receipt date set to 5 days in past so event will have
     * an age category of 0-5 Days. NOTE - will potentially cause problems if run in a
     * period with a real non working day registered.
     */
    public void testBMSTaskAge2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            /**
             * Create Event 19
             * Has Subject
             * No Navigation to the Obligations screen
             * No Word Processing / Oracle Report
             * Set receipt date to 5 working days in past
             */
            final NewStandardEvent testEvent19 = new NewStandardEvent ("19");
            testEvent19.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent19.setReceiptDate (AbstractBaseUtils.getFutureDate ( -5, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent19, null);

            // Check that the BMS age category of the event is correct
            assertTrue ("Case Event Age Category is not equal to: " + BMS_TASK_AGE_5,
                    DBUtil.getCaseEventBMSAgeCategory (testCaseNumber, "19").equals (BMS_TASK_AGE_5));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests case event 19 with receipt date set to 9 days in past with 2 bank holidays
     * between then and now so event will have an age category of 0-5 Days. NOTE - will
     * potentially cause problems if run in a period with a real non working day registered.
     */
    public void testBMSTaskAge3 ()
    {
        // Determine when the two non working days should be
        final String nwd1 = AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true);
        final String nwd2 = AbstractBaseUtils.getFutureDate ( -4, AbstractBaseUtils.DATE_FORMAT_NOW, true);

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Setup the two non working days
            DBUtil.insertNonWorkingDay (nwd1);
            DBUtil.insertNonWorkingDay (nwd2);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            /**
             * Create Event 19
             * Has Subject
             * No Navigation to the Obligations screen
             * No Word Processing / Oracle Report
             * Set receipt date to 9 working days in past
             */
            final NewStandardEvent testEvent19 = new NewStandardEvent ("19");
            testEvent19.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent19.setReceiptDate (AbstractBaseUtils.getFutureDate ( -9, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent19, null);

            // Check that the BMS age category of the event is correct
            assertTrue ("Case Event Age Category is not equal to: " + BMS_TASK_AGE_5,
                    DBUtil.getCaseEventBMSAgeCategory (testCaseNumber, "19").equals (BMS_TASK_AGE_5));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
        finally
        {
            // Delete the non working days from the database
            DBUtil.deleteNonWorkingDay (nwd1);
            DBUtil.deleteNonWorkingDay (nwd2);
        }
    }

    /**
     * Tests case event 19 with receipt date set to 11 days in past with 1 bank holiday
     * between then and now so event will have an age category of 6-10 Days. NOTE - will
     * potentially cause problems if run in a period with a real non working day registered.
     */
    public void testBMSTaskAge4 ()
    {
        // Determine when the non working day should be
        final String nwd1 = AbstractBaseUtils.getFutureDate ( -1, AbstractBaseUtils.DATE_FORMAT_NOW, true);

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Setup the non working day
            DBUtil.insertNonWorkingDay (nwd1);

            // Navigate to the Case Events screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Enter a valid case number
            myUC002CaseEventUtils.loadCaseByCaseNumber (testCaseNumber);

            /**
             * Create Event 19
             * Has Subject
             * No Navigation to the Obligations screen
             * No Word Processing / Oracle Report
             * Set receipt date to 11 working days in past
             */
            final NewStandardEvent testEvent19 = new NewStandardEvent ("19");
            testEvent19.setSubjectParty ("Claimant 1 - CLAIMANT ONE NAME");
            testEvent19.setReceiptDate (AbstractBaseUtils.getFutureDate ( -11, AbstractBaseUtils.DATE_FORMAT_NOW, true));

            // Add the event
            myUC002CaseEventUtils.addNewEvent (testEvent19, null);

            // Check that the BMS age category of the event is correct
            assertTrue ("Case Event Age Category is not equal to: " + BMS_TASK_AGE_6,
                    DBUtil.getCaseEventBMSAgeCategory (testCaseNumber, "19").equals (BMS_TASK_AGE_6));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
        finally
        {
            // Delete the non working day from the database
            DBUtil.deleteNonWorkingDay (nwd1);
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