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

package uk.gov.dca.utils.tests.releases.cm12_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.tests.shakedown.CreateUpdateCaseTest;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the Coded Party range changes on the Case Creation screen.
 *
 * @author Chris Vincent
 */
public class CaseMan_NCP_CreateUpdateCase_Test extends AbstractCmTestBase
{
    
    /** The my UC 001 create update case utils. */
    // Private member variables for the screen utils
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /**
     * Constructor.
     */
    public CaseMan_NCP_CreateUpdateCase_Test ()
    {
        super (CreateUpdateCaseTest.class.getName ());
        this.nav = new Navigator (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Tests Code field validation on a CCBC Case.
     */
    public void testCCBCCasePartyValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            final String[] positiveCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] negativeCodes = {"100", "7000", "7354", "7456", "7516", "7587", "7587", "7676", "7719",
                    "7773", "7790", "7829", "7895", "7908", "7978", "8246", "8299", "8333", "8362", "8635", "8676",
                    "8725", "8824", "8855", "8929", "8965", "9529", "9633", "9667", "9756", "9789", "9823", "9906",
                    "9961", "1499", "2000"};
            final String[] limitCodes = {"7455", "7517", "7588", "7675", "7720", "7772", "7791", "7828", "7835", "7894",
                    "7909", "7977", "8247", "8298", "8334", "8361", "8636", "8724", "8825", "8854", "8930", "8964",
                    "9530", "9632", "9634", "9666", "9668", "9755", "9790", "9822", "9907", "9960"};

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("A15QA001");
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE1");

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - Coded Party Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (positiveCodes[i]);
                assertTrue ("Solcitor Code " + positiveCodes[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorName (),
                        "CCBC NCP " + positiveCodes[i] + " NAME");
                assertTrue ("Solcitor Name is editable",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorNameFieldReadOnly ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (negativeCodes[i]);
                assertFalse ("Solcitor Code " + negativeCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNewSolicitorCodeFocus ();
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorStatusBarText (),
                        "The solicitor must be a national coded party.");
            }

            // Limit Tests
            for (int i = 0, l = limitCodes.length; i < l; i++)
            {
                System.out.println ("Limit Test - Coded Party Code: " + limitCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (limitCodes[i]);
                assertFalse ("Solcitor Code " + limitCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNewSolicitorCodeFocus ();
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorStatusBarText (),
                        "This coded party does not exist.");
            }

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode ("1852");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            // Select the Solicitor and check validation on main screen
            myUC001CreateUpdateCaseUtils.selectPartyByName ("CCBC NCP 1852 NAME");

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test 2 - Coded Party Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (positiveCodes[i]);
                assertTrue ("Solcitor Code " + positiveCodes[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getSolicitorName (),
                        "CCBC NCP " + positiveCodes[i] + " NAME");
                assertTrue ("Solcitor Name is editable", myUC001CreateUpdateCaseUtils.isSolicitorNameFieldReadOnly ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test 2 - Coded Party Code: " + negativeCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (negativeCodes[i]);
                assertFalse ("Solcitor Code " + negativeCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setSolicitorCodeFocus ();
                mCheckStatusBarText ("The solicitor must be a national coded party.");
            }

            // Limit Tests
            for (int i = 0, l = limitCodes.length; i < l; i++)
            {
                System.out.println ("Limit Test 2 - Coded Party Code: " + limitCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (limitCodes[i]);
                assertFalse ("Solcitor Code " + limitCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setSolicitorCodeFocus ();
                mCheckStatusBarText ("This coded party does not exist.");
            }

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests Code field validation on a non CCBC Case.
     */
    public void testNonCCBCCasePartyValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            final String[] positiveCodes = {"400", "500"};
            final String[] positiveCodes2 = {"7000", "8500"};
            final String[] negativeCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] limitCodes = {"1499", "2000", "7354", "7456", "7516", "7587", "7676", "7719", "7773", "7790",
                    "7829", "7834", "7895", "7908", "7978", "8246", "8299", "8333", "8362", "8635", "8676", "8725",
                    "8824", "8855", "8929", "8965", "9529", "9633", "9667", "9756", "9789", "9823", "9906", "9961"};

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("1NN00001");
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE1");

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - LCP Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.setNonSolPartyCode (positiveCodes[i]);
                assertTrue ("Claimant Code " + positiveCodes[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getNonSolPartyName (),
                        "NN LOCAL CODED PARTY " + positiveCodes[i] + " NAME");
                assertTrue ("Claimant Name is editable",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyNameFieldReadOnly ());
            }

            // Positive tests
            for (int i = 0, l = positiveCodes2.length; i < l; i++)
            {
                System.out.println ("Positive Test - Non CPC NCP Code: " + positiveCodes2[i]);
                myUC001CreateUpdateCaseUtils.setNonSolPartyCode (positiveCodes2[i]);
                assertTrue ("Claimant Code " + positiveCodes2[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getNonSolPartyName (),
                        "NON CPC CODED PARTY " + positiveCodes2[i] + " NAME");
                assertTrue ("Claimant Name is editable",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyNameFieldReadOnly ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                myUC001CreateUpdateCaseUtils.setNonSolPartyCode (negativeCodes[i]);
                assertFalse ("Claimant Code " + negativeCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNonSolPartyCodeFocus ();
                mCheckStatusBarText ("Nationally coded party code is not allowed.");
            }

            // Limit Tests
            for (int i = 0, l = limitCodes.length; i < l; i++)
            {
                System.out.println ("Limit Test - Coded Party Code: " + limitCodes[i]);
                myUC001CreateUpdateCaseUtils.setNonSolPartyCode (limitCodes[i]);
                assertFalse ("Claimant Code " + limitCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNonSolPartyCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNonSolPartyCodeFocus ();
                mCheckStatusBarText ("This coded party does not exist.");
            }

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNonSolPartyCode ("");
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - LCP Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (positiveCodes[i]);
                assertTrue ("Solcitor Code " + positiveCodes[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorName (),
                        "NN LOCAL CODED PARTY " + positiveCodes[i] + " NAME");
                assertTrue ("Solcitor Name is editable",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorNameFieldReadOnly ());
            }

            // Positive tests
            for (int i = 0, l = positiveCodes2.length; i < l; i++)
            {
                System.out.println ("Positive Test - Non CPC NCP Code: " + positiveCodes2[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (positiveCodes2[i]);
                assertTrue ("Solicitor Code " + positiveCodes2[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorName (),
                        "NON CPC CODED PARTY " + positiveCodes2[i] + " NAME");
                assertTrue ("Solicitor Name is editable",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorNameFieldReadOnly ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (negativeCodes[i]);
                assertFalse ("Solcitor Code " + negativeCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNewSolicitorCodeFocus ();
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorStatusBarText (),
                        "Nationally coded party code is not allowed.");
            }

            // Limit Tests
            for (int i = 0, l = limitCodes.length; i < l; i++)
            {
                System.out.println ("Limit Test - Coded Party Code: " + limitCodes[i]);
                myUC001CreateUpdateCaseUtils.setNewSolicitorCode (limitCodes[i]);
                assertFalse ("Solcitor Code " + limitCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isNewSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setNewSolicitorCodeFocus ();
                assertEquals (myUC001CreateUpdateCaseUtils.getNewSolicitorStatusBarText (),
                        "This coded party does not exist.");
            }

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode ("100");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            // Select the Solicitor and check validation on main screen
            myUC001CreateUpdateCaseUtils.selectPartyByName ("NN LOCAL CODED PARTY 100 NAME");

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test 2 - Coded Party Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (positiveCodes[i]);
                assertTrue ("Solcitor Code " + positiveCodes[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getSolicitorName (),
                        "NN LOCAL CODED PARTY " + positiveCodes[i] + " NAME");
                assertTrue ("Solcitor Name is editable", myUC001CreateUpdateCaseUtils.isSolicitorNameFieldReadOnly ());
            }

            // Positive tests
            for (int i = 0, l = positiveCodes2.length; i < l; i++)
            {
                System.out.println ("Positive Test - Non CPC NCP Code: " + positiveCodes2[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (positiveCodes2[i]);
                assertTrue ("Solicitor Code " + positiveCodes2[i] + " is invalid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                assertEquals (myUC001CreateUpdateCaseUtils.getSolicitorName (),
                        "NON CPC CODED PARTY " + positiveCodes2[i] + " NAME");
                assertTrue ("Solicitor Name is editable", myUC001CreateUpdateCaseUtils.isSolicitorNameFieldReadOnly ());
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test 2 - Coded Party Code: " + negativeCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (negativeCodes[i]);
                assertFalse ("Solcitor Code " + negativeCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setSolicitorCodeFocus ();
                mCheckStatusBarText ("Nationally coded party code is not allowed.");
            }

            // Limit Tests
            for (int i = 0, l = limitCodes.length; i < l; i++)
            {
                System.out.println ("Limit Test 2 - Coded Party Code: " + limitCodes[i]);
                myUC001CreateUpdateCaseUtils.setSolicitorCode (limitCodes[i]);
                assertFalse ("Solcitor Code " + limitCodes[i] + " is valid",
                        myUC001CreateUpdateCaseUtils.isSolicitorCodeFieldValid ());
                myUC001CreateUpdateCaseUtils.setSolicitorCodeFocus ();
                mCheckStatusBarText ("This coded party does not exist.");
            }

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Coded Party Search Subform returns the correct results on a CCBC case.
     */
    public void testCCBCCodedPartySearchSubform ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            final String[] positiveCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950", "7000"};
            final String[] negativeCodes = {"100", "400", "500"};

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("0QX00001");

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode ("1852");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            // Select the Solicitor and check validation on main screen
            myUC001CreateUpdateCaseUtils.selectPartyByName ("CCBC NCP 1852 NAME");
            myUC001CreateUpdateCaseUtils.clickSolicitorLOVButton ();

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - Coded Party Code: " + positiveCodes[i]);
                myUC001CreateUpdateCaseUtils.enterCPSearchCriteria (positiveCodes[i]);
                assertTrue ("Code not in results grid ",
                        myUC001CreateUpdateCaseUtils.isValueInCPSearchResultsGrid (positiveCodes[i], 1));
            }

            // Negative Tests
            myUC001CreateUpdateCaseUtils.enterCPSearchCriteria ("NAME");
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                assertFalse ("Code is in results grid ",
                        myUC001CreateUpdateCaseUtils.isValueInCPSearchResultsGrid (negativeCodes[i], 1));
            }
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that the Coded Party Search Subform returns the correct results on a non CCBC case.
     */
    public void testNonCCBCCodedPartySearchSubform ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            final String[] negativeCodes = {"1500", "7355", "7586", "7600", "7770", "7800", "7850", "7975", "8250",
                    "8360", "8675", "8677", "8850", "8950", "9600", "9650", "9750", "9800", "9950"};
            final String[] positiveCodes = {"100", "400", "500", "7000"};

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("1NN00001");
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.clickNonSolLOVButton ();
            myUC001CreateUpdateCaseUtils.enterCPSearchCriteria ("NAME");

            // Positive tests
            for (int i = 0, l = positiveCodes.length; i < l; i++)
            {
                System.out.println ("Positive Test - Coded Party Code: " + positiveCodes[i]);
                assertTrue ("Code not in results grid ",
                        myUC001CreateUpdateCaseUtils.isValueInCPSearchResultsGrid (positiveCodes[i], 1));
            }

            // Negative Tests
            for (int i = 0, l = negativeCodes.length; i < l; i++)
            {
                System.out.println ("Negative Test - Coded Party Code: " + negativeCodes[i]);
                assertFalse ("Code is in results grid ",
                        myUC001CreateUpdateCaseUtils.isValueInCPSearchResultsGrid (negativeCodes[i], 1));
            }
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a CCBC case. Case Number entered must not already exist or will fail
     */
    public void testCreateCCBCCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("0QX00001");
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE1");

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode ("7850");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            myUC001CreateUpdateCaseUtils.saveCase (true);
            assertEquals (DBUtil.getCaseCredCode ("0QX00001"), "7850");
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the creation of a Non CCBC case. Case Number entered must not already exist or will fail
     */
    public void testCreateNonCCBCCase ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Start creating a new case, add a claimant and load the new solicitor popup
            myUC001CreateUpdateCaseUtils.setCaseNumber ("1NN00001");
            myUC001CreateUpdateCaseUtils.setCaseType (UC001CreateUpdateCaseUtils.CASE_TYPE_CLAIM_SPEC_ONLY);
            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_DEFENDANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("DEFENDANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("D1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("D1 ADLINE1");

            myUC001CreateUpdateCaseUtils.addNewParty (UC001CreateUpdateCaseUtils.PARTY_TYPE_CLAIMANT);
            myUC001CreateUpdateCaseUtils.setNonSolPartyName ("CLAIMANT ONE NAME");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine1 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.setNonSolAddrLine2 ("C1 ADLINE1");
            myUC001CreateUpdateCaseUtils.addNewSolicitor ();

            // Set a valid code and click Ok
            myUC001CreateUpdateCaseUtils.setNewSolicitorCode ("7000");
            myUC001CreateUpdateCaseUtils.newSolicitorClickOk ();

            myUC001CreateUpdateCaseUtils.raiseDetailsOfClaimPopup ();
            myUC001CreateUpdateCaseUtils.clickDetailsOfClaimOk ();

            myUC001CreateUpdateCaseUtils.saveCase (true);
            assertEquals (DBUtil.getCaseCredCode ("1NN00001"), "0");
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
        assertTrue ("Status bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }
}