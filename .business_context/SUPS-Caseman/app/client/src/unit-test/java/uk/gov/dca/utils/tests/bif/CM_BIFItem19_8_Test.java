/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11427 $
 * $Author: vincentcp $
 * $Date: 2014-11-17 15:16:10 +0000 (Mon, 17 Nov 2014) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan BIF Item #19 for various BMS changes.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem19_8_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem19_8_Test ()
    {
        super (CM_BIFItem19_8_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase1 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_SPEC_ONLY, false);
           
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase2 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_MULTI_OTHER, false);
            
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase3 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber, UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_UNSPEC,
                    false);
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase4 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_ARBITRATION, false);
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase5 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_PRE_ACTION, false);
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase6 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_TCC_ADJUDICATION, false);
            assertEquals("DR13", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase7 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_MERC_SPEC_ONLY, false);
            assertEquals("DR26", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase8 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_MERC_MULTI_OTHER, false);
            assertEquals("DR26", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase9 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_MERC_UNSPEC, false);
            assertEquals("DR26", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase10 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_MERC_ARBITRATION, false);
            assertEquals("DR26", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase11 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_MERC_PRE_ACTION, false);
            assertEquals("DR26", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase12 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_SPEC_ONLY, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase13 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_MULTI_OTHER, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase14 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCase2 (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_UNSPEC, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase15 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_ARBITRATION, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase16 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_PRE_ACTION, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a case and the BMS task associated with event 1.
     */
    public void testCreateCase17 ()
    {
        try
        {
            final String caseNumber = "A15NN001";

            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default case record (case number entered must not exist)
            myUC001CreateUpdateCaseUtils.createDefaultCaseVD (caseNumber,
                    UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_TCC_ADJUDICATION, false);
            assertEquals("IS25", DBUtil.getCaseEventBMS(caseNumber, "1"));
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