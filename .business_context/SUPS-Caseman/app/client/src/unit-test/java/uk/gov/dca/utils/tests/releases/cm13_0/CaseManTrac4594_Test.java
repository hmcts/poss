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

package uk.gov.dca.utils.tests.releases.cm13_0;

import java.util.LinkedList;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.eventconfig.NewStandardEvent;
import uk.gov.dca.utils.eventconfig.VariableDataQuestion;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;

/**
 * Automated tests for the CaseMan Defect 4594. This covers a change to create a new case
 * type of Company Admin Order
 *
 * @author Nilesh Mistry
 */
public class CaseManTrac4594_Test extends AbstractCmTestBase
{

    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /** The my UC 002 case event utils. */
    private UC002CaseEventUtils myUC002CaseEventUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4594_Test ()
    {
        super (CaseManTrac4594_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
    }

    /**
     * Tests creation of the case type COMPANY ADMIN ORDER and the correct BMS
     * assigned to case event 1.
     */
    public void testCompanyAdminOrder1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a new COMPANY ADMIN ORDER case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A11CV051");

            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_COMPANY_ADMIN_ORDER);

            myUC001CreateUpdateCaseUtils.setInsolvencyNumber ("0001");

            myUC001CreateUpdateCaseUtils.setInsolvencyYear ("2011");

            // Create Company party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_COMPANY);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("COMPANY NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("COMPANY ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("COMPANY ADLINE2");

            // Create Creditor party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CREDITOR);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CREDITOR NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("CRED ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("CRED ADLINE2");

            // Create Insolvency Practitioner party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_INSOLV_PRACT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("INS PRAC NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("INS PRAC ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("INS PRAC ADLINE2");

            // Create Petitioner party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_PETITIONER);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("PETITIONER NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("PETITIONER ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("PETITIONER ADLINE2");

            // Create Official Receiver party
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_OFF_REC);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("OFF REC NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("OFF REC ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("OFF REC ADLINE2");

            // Raise Details of Claim Popup
            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();

            // Close Details of Claim Popup
            myUC001CreateUpdateCaseUtils.setAmountClaimed ("1000");

            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            // Click Save and handle WP processing
            myUC001CreateUpdateCaseUtils.saveCase (false);
            session.waitForPageToLoad ();

            myUC001CreateUpdateCaseUtils.setCaseNumber ("A11CV051");

            // Navigate to case events screen
            this.nav.clickNavigationMenu ("NavBar_EventsButton");
            session.waitForPageToLoad ();
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Check correct BMS task has been given to case event 1
            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 1 is IN6", bmsTask.equals ("IN6"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests creation of the case event 100 and ensures that the correct BMS code is assigned to it
     * for the new case type
     * To run this test, you need to set LOVSave to false for StandardEventId 100 in eventconfig.xml
     */
    public void testCompanyAdminOrder2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load an existing COMPANY ADMIN ORDER case record (case number entered must exist)
            myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");

            final NewStandardEvent testEvent100 = new NewStandardEvent ("100");
            testEvent100.setSubjectParty ("The Company 1 - THE COMPANY 1");
            testEvent100.setProduceOutputFlag (true);
            testEvent100.setNavigateObligations (true);
            testEvent100.setBypassBMSPopup (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event100Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event100Questions.add (vdQ1);

            myUC002CaseEventUtils.addNewEvent (testEvent100, event100Questions);

            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);

            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 100 is IN25", bmsTask.equals ("IN25"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests creation of the case event 111 and ensures that the correct BMS code is assigned to it
     * for the new case type
     * To run this test, you need to set LOVSave to false for StandardEventId 111 in eventconfig.xml
     */
    public void testCompanyAdminOrder3 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load an existing COMPANY ADMIN ORDER case record (case number entered must exist)
            myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");

            final NewStandardEvent testEvent111 = new NewStandardEvent ("111");
            testEvent111.setSubjectParty ("The Company 1 - THE COMPANY 1");
            testEvent111.setProduceOutputFlag (true);
            testEvent111.setNavigateObligations (true);
            testEvent111.setBypassBMSPopup (true);

            // Setup any variable data screen questions
            final LinkedList<VariableDataQuestion> event111Questions = new LinkedList<VariableDataQuestion> ();
            final VariableDataQuestion vdQ1 =
                    new VariableDataQuestion ("Salutation", VariableDataQuestion.VD_FIELD_TYPE_SELECT, "Sir", this);
            event111Questions.add (vdQ1);

            myUC002CaseEventUtils.addNewEvent (testEvent111, event111Questions);

            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);

            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 111 is CO9", bmsTask.equals ("CO9"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /*    *//**
             * Tests creation of the case event 120 and ensures that the correct BMS code is assigned to it
             * for the new case type
             * To run this test, you need to set LOVSave to false for StandardEventId 120 in eventconfig.xml
             */
    public void testCompanyAdminOrder4 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load an existing COMPANY ADMIN ORDER case record (case number entered must exist)
            myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");

            final NewStandardEvent testEvent120 = new NewStandardEvent ("120");
            testEvent120.setSubjectParty ("The Company 1 - THE COMPANY 1");
            testEvent120.setProduceOutputFlag (false);
            testEvent120.setNavigateObligations (true);
            testEvent120.setBypassBMSPopup (true);
            myUC002CaseEventUtils.addNewEvent (testEvent120, null);

            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);

            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 120 is IN24", bmsTask.equals ("IN24"));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests creation of the case event 671 and ensures that the correct BMS code is assigned to it
     * for the new case type.
     */
    public void testCompanyAdminOrder5 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load an existing COMPANY ADMIN ORDER case record (case number entered must exist)
            myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");

            final NewStandardEvent testEvent671 = new NewStandardEvent ("671");
            testEvent671.setSubjectParty ("The Company 1 - THE COMPANY 1");
            myUC002CaseEventUtils.addNewEvent (testEvent671, null);

            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);

            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 671 is IN7", bmsTask.equals ("IN7"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests creation of the case event 710 and ensures that the correct BMS code is assigned to it
     * for the new case type.
     */
    public void testCompanyAdminOrder6 ()
    {
        try
        {
            // Log into SUPS CaseMan
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

            // Load an existing COMPANY ADMIN ORDER case record (case number entered must exist)
            myUC002CaseEventUtils.loadCaseByCaseNumber ("0NN00001");

            final NewStandardEvent testEvent710 = new NewStandardEvent ("710");
            testEvent710.setSubjectParty ("The Company 1 - THE COMPANY 1");
            myUC002CaseEventUtils.addNewEvent (testEvent710, null);

            myUC002CaseEventUtils.selectCaseEventByRowNumber (1);

            final String bmsTask = myUC002CaseEventUtils.getEventBMSTask ();

            assertTrue ("BMS Task number for case event 710 is IN23", bmsTask.equals ("IN23"));

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