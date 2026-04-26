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
 * Automated tests for the Application to Vary functionality in the CCBC SDT release.
 *
 * @author Chris Vincent
 */
public class ApplicationVaryJudgment_Test extends AbstractCmTestBase
{
    
    /** The my UC 002 case event utils. */
    // Private member variables for the screen utils
    private UC002CaseEventUtils myUC002CaseEventUtils;
    
    /** The my UC 004 maintain judgment utils. */
    private UC004MaintainJudgmentUtils myUC004MaintainJudgmentUtils;

    /** The case number 1. */
    // Test cases with no applications to vary
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
    // Test cases with applications to vary to be completed
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
    private String caseNumber11 = "3NN00016"; // CCBC Case with Judgment against claimant and app to vary
    
    /** The case number 12. */
    private String caseNumber12 = "3NN00036"; // CCBC Case with Judgment against claimant

    /** The event 140. */
    // Event codes
    private String EVENT_140 = "140";
    
    /** The event 150. */
    private String EVENT_150 = "150";
    
    /** The event 155. */
    private String EVENT_155 = "155";

    /** The mcol code1. */
    // MCOL codes
    private String MCOL_CODE1 = "V1";
    
    /** The mcol code2. */
    private String MCOL_CODE2 = "V0";
    
    /** The mcol code3. */
    private String MCOL_CODE3 = "VG";
    
    /** The mcol code4. */
    private String MCOL_CODE4 = "VR";

    /**
     * Constructor.
     */
    public ApplicationVaryJudgment_Test ()
    {
        super (ApplicationVaryJudgment_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC002CaseEventUtils = new UC002CaseEventUtils (this);
        myUC004MaintainJudgmentUtils = new UC004MaintainJudgmentUtils (this);
    }

    /**
     * Tests that when an application to vary is created on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber1, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber1, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is created on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber2, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary (true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber2, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is created on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber3, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber3, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is created on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber4, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary (false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber4, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is created on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber5, "DEFENDANT NAME");

            // Create application vary
            createApplicationToVary (true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber5, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is created on a CCBC owned case, where the judgment is against the
     * claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppVary_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber12, "CLAIMANT NAME");

            // Create application vary
            createApplicationToVary (true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE1));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE1));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 140 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber12, MCOL_CODE2));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to GRANTED on a CCBC owned case, where the judgment is against
     * the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultGranted_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Error off the Case Event 150
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_150);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 150 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a Northampton owned non-MCOL, non-CCBC case, that
     * no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has NOT created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has created a new MCOL_DATA row
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to DETERMINED on a CCBC owned case, where the judgment is
     * against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultDetermined_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Error off the Case Event 155
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_155);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the MCOL_DATA row has been removed
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE3));

            // Unerror event and then error again which should trigger the creation of another MCOL_DATA row for CCBC
            myUC002CaseEventUtils.setEventErrorFlag (false);
            myUC002CaseEventUtils.setEventErrorFlag (true);

            // Check that the event 155 errored off has not created a new MCOL_DATA row
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE4));
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when an application to vary is set to REFUSED on a Northampton owned non-MCOL, non-CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber6, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFUSED on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber7, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFUSED on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber8, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFUSED on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, false);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber9, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFUSED on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, true);

            // Check that an MCOL_DATA row has been written
            assertEquals (1, DBUtil.getCountMCOLDataRowsForCase (caseNumber10, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFUSED on a CCBC owned case, where the judgment is
     * against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultRefused_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFUSED, true);

            // Check that no MCOL_DATA row has been written
            assertEquals (0, DBUtil.getCountMCOLDataRowsForCase (caseNumber11, MCOL_CODE2));

            // Error off the Case Event 140
            myUC002CaseEventUtils.selectCaseEventByEventId (EVENT_140);
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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a Northampton owned non-MCOL, non-CCBC
     * case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_1 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber6, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, false);

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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a CCBC owned MCOL case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_2 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber7, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, true);

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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a Northampton owned MCOL case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_3 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber8, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, false);

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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a Northampton owned CCBC case, that no
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_4 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber9, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, false);

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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a CCBC owned CCBC case, that a
     * notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_5 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber10, "DEFENDANT ONE NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, true);

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
     * Tests that when an application to vary is set to REFERRED TO JUDGE on a CCBC owned case, where the judgment
     * is against the claimant that no notification is written to the MCOL_DATA table.
     */
    public void testNewAppVaryResultReferredJudge_6 ()
    {
        try
        {
            // Log into SUPS CaseMan and load judgment
            loginAndLoadCaseJudgment (caseNumber11, "CLAIMANT NAME");

            // Create application vary
            setExistingApplicationToVaryResult (UC004MaintainJudgmentUtils.APP_VARY_RESULT_REFERREDJUDGE, true);

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
     * Private method to handle the creation of can application to vary. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     * 
     * @param ccbcCase True if a CCBC case, else false
     */
    private void createApplicationToVary (final boolean ccbcCase)
    {
        // Create new Application to Set Aside
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup ();
        myUC004MaintainJudgmentUtils.raiseAddNewAppVaryPopup ();
        myUC004MaintainJudgmentUtils.setAddAppVaryApplicant (UC004MaintainJudgmentUtils.APPLICANT_PARTY_AGAINST);
        myUC004MaintainJudgmentUtils.setAddAppVaryAmountOffered ("10");
        myUC004MaintainJudgmentUtils.setAddAppVaryFrequency (UC004MaintainJudgmentUtils.FREQUENCY_WEEKLY);
        myUC004MaintainJudgmentUtils.clickAddAppVaryPopupOkButton ();
        myUC004MaintainJudgmentUtils.clickAppVaryOkButton ();

        // Save and exit
        if (ccbcCase)
        {
            // No special behaviour for CCBC owned cases
            myUC004MaintainJudgmentUtils.clickSaveButton ();
        }
        else
        {
            // Handle word processing screens for non-CCBC cases
            myUC004MaintainJudgmentUtils.saveFollowingAppVary ();
        }
        myUC004MaintainJudgmentUtils.closeScreen ();

        // Check in correct screen
        mCheckPageTitle (myUC002CaseEventUtils.getScreenTitle ());
    }

    /**
     * Private method to set the result field on an existing application to vary. After clicking Save, exits the
     * Maintain Judgments screen and returns to the Case Events screen
     *
     * @param result The result to set
     * @param ccbcCase True if a CCBC case, else false
     */
    private void setExistingApplicationToVaryResult (final String result, final boolean ccbcCase)
    {
        final String response;
        // Set the Response value accordingly based on the result
        if (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED))
        {
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_ACCEPTED;
        }
        else
        {
            // Result = Referred to Judge, Determined or Refused
            response = UC004MaintainJudgmentUtils.APP_VARY_RESPONSE_REFUSED;
        }

        // Set application to vary result and result date
        myUC004MaintainJudgmentUtils.raiseAppVaryPopup ();
        myUC004MaintainJudgmentUtils.setAppVaryResult (result);
        myUC004MaintainJudgmentUtils.setAppVaryResultDate (AbstractBaseUtils.now ());
        myUC004MaintainJudgmentUtils.setAppVaryResponse (response);
        myUC004MaintainJudgmentUtils.setAppVaryResponseDate (AbstractBaseUtils.now ());

        if (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED))
        {
            // Set Amount and Frequency fields too
            myUC004MaintainJudgmentUtils.setAppVaryAmount ("5");
            myUC004MaintainJudgmentUtils.setAppVaryFrequency (UC004MaintainJudgmentUtils.FREQUENCY_FORTNIGHTLY);
        }

        myUC004MaintainJudgmentUtils.clickAppVaryOkButton ();

        // Save and handle word processing then exit
        if ( !ccbcCase && (result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_GRANTED) ||
                result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED)))
        {
            // Non CCBC cases with result of GRANTED or IN ERROR so word processing screens to handle
            final boolean determined = result.equals (UC004MaintainJudgmentUtils.APP_VARY_RESULT_DETERMINED);
            myUC004MaintainJudgmentUtils.saveFollowingAppVaryResultSet (determined);
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