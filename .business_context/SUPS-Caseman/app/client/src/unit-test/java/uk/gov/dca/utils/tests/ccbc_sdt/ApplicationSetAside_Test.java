/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9980 $
 * $Author: vincentcp $
 * $Date: 2013-10-18 10:47:34 +0100 (Fri, 18 Oct 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.ccbc_sdt;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC002CaseEventUtils;
import uk.gov.dca.utils.screens.UC004MaintainJudgmentUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Application to Set Aside functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class ApplicationSetAside_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case number 1. */
    // Test cases with no applications to set aside
    private String caseNumber1 = "3NN00031"; // Northampton owned non-MCOL case
    
    /** The case number 2. */
    private String caseNumber2 = "3NN00032"; // CCBC owned MCOL case
    
    /** The case number 3. */
    private String caseNumber3 = "3NN00033"; // Northampton owned MCOL case
    
    /** The case number 4. */
    private String caseNumber4 = "3NN00034"; // Northampton owned CCBC case
    
    /** The case number 5. */
    private String caseNumber5 = "3NN00035"; // CCBC owned CCBC case

    /** The case number 6. */
    // Test cases with applications to set aside to be completed
    private String caseNumber6 = "3NN00011"; // Northampton owned non-MCOL case
    
    /** The case number 7. */
    private String caseNumber7 = "3NN00012"; // CCBC owned MCOL case
    
    /** The case number 8. */
    private String caseNumber8 = "3NN00013"; // Northampton owned MCOL case
    
    /** The case number 9. */
    private String caseNumber9 = "3NN00014"; // Northampton owned CCBC case
    
    /** The case number 10. */
    private String caseNumber10 = "3NN00015"; // CCBC owned CCBC case

    /** The case number 11. */
    private String caseNumber11 = "3NN00016"; // CCBC Case with Judgment against claimant and app set aside
    
    /** The case number 12. */
    private String caseNumber12 = "3NN00036"; // CCBC Case with Judgment against claimant

    /** The event 160. */
    // Event codes
    private String EVENT_160 = "160";
    
    /** The event 170. */
    private String EVENT_170 = "170";

    /** The mcol code1. */
    // MCOL codes
    private String MCOL_CODE1 = "X1";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "X0";
    
    /** The mcol code3. */
    private String MCOL_CODE3 = "XG";
    
    /** The mcol code4. */
    private String MCOL_CODE4 = "XR";

    /**
     * Constructor.
     */
    public ApplicationSetAside_Test ()
    {
        super (ApplicationSetAside_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Tests that when an application to set aside is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber1, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber3, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber4, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber5, "DEFENDANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is created on a CCBC owned CCBC case, where the judgment
     * is against the claimant, no notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAside_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber12, "CLAIMANT NAME");

            // Create application set aside
            createApplicationToSetAside ();

            // Check that an MCOL_DATA row has not been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE1));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 160 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a Northampton owned non-MCOL, non-CCBC case,
     * that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to GRANTED on a CCBC owned case, where the judgment is
     * against the claimantthat no notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultGranted_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a Northampton owned non-MCOL, non-CCBC case,
     * that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to IN ERROR on a CCBC owned case, where the judgment is
     * against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultInError_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Error off the Case Event 170
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_170);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 170 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a Northampton owned non-MCOL, non-CCBC case,
     * that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has not been removed
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has not been removed
            assertEquals (2, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to REFUSED on a CCBC owned case, where the judgment is
     * against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultRefused_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_REFUSED, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE2));

            // Error off the Case Event 160
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_160);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has not been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a Northampton owned non-MCOL, non-CCBC case,
     * that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, false);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, true);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, false);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, false);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT TWO NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, true);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to set aside is set to TRANSFERRED on a CCBC owned case, where the judgment is
     * against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppSetAsideResultTransferred_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application set aside
            setExistingApplicationToSetAsideResult (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_TRANSFERRED, true);

            // Check that no MCOL_DATA rows have been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE2));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Private method to log into CaseMan, navigate to the Case Events screen
     * and load a case.
     *
     * @param caseNumber The case number to load
     * @param judgmentAgainstPartyName The judgment against party name
     */
    private void loginAndLoadCaseJudgment (final String caseNumber, final String judgmentAgainstPartyName)
    {
        // Log into SUPS CaseMan
        logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

        // Navigate to the Case Events screen
        this.nav.navigateFromMainMenu (MAINMENU_CASE_EVENTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());

        // Enter a Case
        myUC002CaseEventUtils.loadCaseByCaseNumber (caseNumber);

        // Navigate to the Judgments screen
        myUC002CaseEventUtils.clickNavigationButton (UC002CaseEventUtils.BTN_NAV_JUDG_SCREEN);
        mCheckPageTitle (myUC004MaintainJudgmentUtils.getScreenTitle ());

        // Select appropriate judgment
        myUC004MaintainJudgmentUtils.selectPartyAgainstByName (judgmentAgainstPartyName);
    }

    /**
     * Private method to handle the creation of can application to set aside. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     */
    private void createApplicationToSetAside ()
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.raiseAddNewSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideApplicant (UC004MaintainJudgmentUtils.APPLICANT_PARTY_FOR);
        myUC004MaintainJudgmentUtils.clickAddSetAsidePopupOkButton ();
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

        // Save and exit
        myUC004MaintainJudgmentUtils.clickSaveButton ();
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to set the result field on an existing application to set aside. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     *
     * @param result The result to set
     * @param ccbcCase True if a CCBC case, else false
     */
    private void setExistingApplicationToSetAsideResult (final String result, final boolean ccbcCase)
    {
        // Set application to set aside result and result date
        myUC004MaintainJudgmentUtils.raiseSetAsidePopup ();
        myUC004MaintainJudgmentUtils.setSetAsideResult (result);
        myUC004MaintainJudgmentUtils.setSetAsideResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.clickSetAsideOkButton ();

        // Save and handle word processing/obligations then exit
        if ( !ccbcCase && (result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_GRANTED) ||
                result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR)))
        {
            // Non CCBC cases with result of GRANTED or IN ERROR so word processing screens to handle
            final boolean inerror = result.equals (UC004MaintainJudgmentUtils.SET_ASIDE_RESULT_ERROR);
            myUC004MaintainJudgmentUtils.saveFollowingNewSetAsideGranted (inerror);
        }
        else
        {
            // No word processing screens to handle
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
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