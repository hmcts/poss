/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9911 $
 * $Author: vincentcp $
 * $Date: 2013-07-04 08:26:54 +0100 (Thu, 04 Jul 2013) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.central_ae;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.AbstractSuitorsCashScreenUtils;
import uk.gov.dca.utils.screens.UC001CreateUpdateCaseUtils;
import uk.gov.dca.utils.screens.UC059BailiffPaymentUtils;
import uk.gov.dca.utils.screens.UC059CounterPaymentUtils;
import uk.gov.dca.utils.screens.UC059PassthroughPaymentUtils;
import uk.gov.dca.utils.screens.UC059PostalPaymentUtils;
import uk.gov.dca.utils.screens.UC061MaintainPaymentUtils;
import uk.gov.dca.utils.screens.UC063ResolveOverpaymentUtils;
import uk.gov.dca.utils.screens.UC067AdhocPayoutsUtils;
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the AE Number format changes in the Centralisation of AE release.
 *
 * @author Chris Vincent
 */
public class CaseMan_Trac5719_Test extends AbstractCmTestBase
{
    
    /** The my UC 067 adhoc payouts utils. */
    // Private member variables for the screen utils
    private UC067AdhocPayoutsUtils myUC067AdhocPayoutsUtils;
    
    /** The my UC 059 bailiff payment utils. */
    private UC059BailiffPaymentUtils myUC059BailiffPaymentUtils;
    
    /** The my UC 059 counter payment utils. */
    private UC059CounterPaymentUtils myUC059CounterPaymentUtils;
    
    /** The my UC 061 maintain payment utils. */
    private UC061MaintainPaymentUtils myUC061MaintainPaymentUtils;
    
    /** The my UC 059 passthrough payment utils. */
    private UC059PassthroughPaymentUtils myUC059PassthroughPaymentUtils;
    
    /** The my UC 059 postal payment utils. */
    private UC059PostalPaymentUtils myUC059PostalPaymentUtils;
    
    /** The my UC 063 resolve overpayment utils. */
    private UC063ResolveOverpaymentUtils myUC063ResolveOverpaymentUtils;
    
    /** The my UC 092 AE event utils. */
    private UC092AEEventUtils myUC092AEEventUtils;
    
    /** The my UC 091 create update AE utils. */
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;
    
    /** The my UC 001 create update case utils. */
    private UC001CreateUpdateCaseUtils myUC001CreateUpdateCaseUtils;

    /**
     * Constructor.
     */
    public CaseMan_Trac5719_Test ()
    {
        super (CaseMan_Trac5719_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC067AdhocPayoutsUtils = new UC067AdhocPayoutsUtils (this);
        myUC059BailiffPaymentUtils = new UC059BailiffPaymentUtils (this);
        myUC059CounterPaymentUtils = new UC059CounterPaymentUtils (this);
        myUC061MaintainPaymentUtils = new UC061MaintainPaymentUtils (this);
        myUC059PassthroughPaymentUtils = new UC059PassthroughPaymentUtils (this);
        myUC059PostalPaymentUtils = new UC059PostalPaymentUtils (this);
        myUC063ResolveOverpaymentUtils = new UC063ResolveOverpaymentUtils (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
        myUC092AEEventUtils = new UC092AEEventUtils (this);
        myUC001CreateUpdateCaseUtils = new UC001CreateUpdateCaseUtils (this);
    }

    /**
     * Checks that AE Number field validation is as expected on the Record Adhoc Payouts screen.
     */
    public void testAdhocPayout ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC067AdhocPayoutsUtils.bypassStartOfDay ("282");

            // Navigate to the Record Adhoc Payouts screen
            this.nav.navigateFromMainMenu (MAINMENU_ADHOC_PAYOUT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC067AdhocPayoutsUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC067AdhocPayoutsUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
                myUC067AdhocPayoutsUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC067AdhocPayoutsUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC067AdhocPayoutsUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Create Bailiff Payments screen.
     */
    public void testCreateBailiffPayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059BailiffPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Bailiff Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_BAILIFF_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059BailiffPaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC059BailiffPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC059BailiffPaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC059BailiffPaymentUtils.isEnforcementNumberValid ());
                myUC059BailiffPaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC059BailiffPaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC059BailiffPaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Create Counter Payments screen.
     */
    public void testCreateCounterPayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059CounterPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Counter Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_COUNTER_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059CounterPaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC059CounterPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC059CounterPaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC059CounterPaymentUtils.isEnforcementNumberValid ());
                myUC059CounterPaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC059CounterPaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC059CounterPaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Maintain Payments screen.
     */
    public void testMaintainPayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC061MaintainPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Maintain Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC061MaintainPaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC061MaintainPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC061MaintainPaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC061MaintainPaymentUtils.isEnforcementNumberValid ());
                myUC061MaintainPaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC061MaintainPaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC061MaintainPaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Create Passthrough Payments screen.
     */
    public void testCreatePassthroughPayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059PassthroughPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Passthrough Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_PASSTHROUGH_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059PassthroughPaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC059PassthroughPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC059PassthroughPaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC059PassthroughPaymentUtils.isEnforcementNumberValid ());
                myUC059PassthroughPaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC059PassthroughPaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC059PassthroughPaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Create Postal Payments screen.
     */
    public void testCreatePostalPayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC059PostalPaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Create Postal Payments screen
            this.nav.navigateFromMainMenu (MAINMENU_POSTAL_PAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC059PostalPaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC059PostalPaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC059PostalPaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC059PostalPaymentUtils.isEnforcementNumberValid ());
                myUC059PostalPaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC059PostalPaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC059PostalPaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Resolve Overpayments screen.
     */
    public void testResolveOverpayments ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Handle Suitor's Cash Start of Day
            myUC063ResolveOverpaymentUtils.bypassStartOfDay ("282");

            // Navigate to the Resolve Overpayments screen
            this.nav.navigateFromMainMenu (MAINMENU_RESOLVE_OVERPAYMENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC063ResolveOverpaymentUtils.getScreenTitle ());

            // Set Enforcement Type to AE
            myUC063ResolveOverpaymentUtils.setEnforcementType (AbstractSuitorsCashScreenUtils.ENFORCEMENT_TYPE_AE);

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "28200001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC063ResolveOverpaymentUtils.setEnforcementNumber (invalidArray[i]);
                assertFalse ("AE Number is valid when should be invalid",
                        myUC063ResolveOverpaymentUtils.isEnforcementNumberValid ());
                myUC063ResolveOverpaymentUtils.setEnforcementNumberFocus ();
                mCheckStatusBarText (AbstractSuitorsCashScreenUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC063ResolveOverpaymentUtils.setEnforcementNumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid",
                        myUC063ResolveOverpaymentUtils.isEnforcementNumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Checks that AE Number field validation is as expected on the Enter/Query AE Events screen.
     */
    public void testAEEvents ()
    {
        try
        {
            // Login
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "001NN001", "A0000001", "A01B01A0", "3NN00001"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC092AEEventUtils.setAENumber (invalidArray[i]);
                assertFalse ("AE Number " + invalidArray[i] + " is valid when should be invalid",
                        myUC092AEEventUtils.isAENumberValid ());
                myUC092AEEventUtils.setAENumberFocus ();
                mCheckStatusBarText (UC092AEEventUtils.ERR_MSG_INVALID_AE_NUMBER);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "AA000001", "282X0001", "NN/00001", "28200001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC092AEEventUtils.setAENumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid", myUC092AEEventUtils.isAENumberValid ());
            }
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new AE record with the new number format.
     */
    public void testCreateAE_1 ()
    {
        try
        {
            // Set the next AE number database sequence to a specific value
            DBUtil.setNextAENumberSequenceNextVal (1999999);

            // Get to the Create Home Warrants screen
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber ("9NN00012");
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase ("9NN00012");
            // Check that the AE number is the expected next number from the Database sequence
            assertEquals ("AC999999", tmpAeNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new MAGS ORDER AE record.
     */
    public void testCreateAE_2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create/Update Cases screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC001CreateUpdateCaseUtils.getScreenTitle ());

            // Create a default MAGS ORDER case
            myUC001CreateUpdateCaseUtils.createMAGSCase ("NN/00002");

            final String tmpAeNumber = DBUtil.getAENumberOnCase ("NN/00002");
            // Check that the AE number is the expected next number from the Database sequence
            assertEquals ("NN/00002", tmpAeNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new AE record where the user manually enters the AE Number.
     */
    public void testCreateAE_3 ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber ("9NN00011");
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setExistingCaseCheckbox (true);
            myUC091CreateUpdateAEUtils.setCAPSId ("123456");
            myUC091CreateUpdateAEUtils.setCheckDigit ("5");
            myUC091CreateUpdateAEUtils.setDateOfIssue (AbstractBaseUtils.now ());

            // Check invalid AE patterns
            final String[] invalidArray = {"AA00001", "001NN001", "A0000001", "A01B01A0", "3NN00001", "NN/00013"};
            for (int i = 0, l = invalidArray.length; i < l; i++)
            {
                myUC091CreateUpdateAEUtils.setAENumber (invalidArray[i]);
                assertFalse ("AE Number " + invalidArray[i] + " is valid when should be invalid",
                        myUC091CreateUpdateAEUtils.isAENumberValid ());
                myUC091CreateUpdateAEUtils.setFocusInAENumber ();
                mCheckStatusBarText (UC091CreateUpdateAEUtils.ERR_MSG_INVALID_AE_NUMBER_1);
            }

            // Check valid AE patterns
            final String[] validArray = {"NN000001", "282F0001", "28200001"};
            for (int i = 0, l = validArray.length; i < l; i++)
            {
                myUC091CreateUpdateAEUtils.setAENumber (validArray[i]);
                assertTrue ("AE Number is invalid when should be valid", myUC091CreateUpdateAEUtils.isAENumberValid ());
            }

            // Check specific format error message that first three characters must be a court in service
            myUC091CreateUpdateAEUtils.setAENumber ("99900001");
            assertFalse ("AE Number 99900001 is valid when should be invalid",
                    myUC091CreateUpdateAEUtils.isAENumberValid ());
            myUC091CreateUpdateAEUtils.setFocusInAENumber ();
            mCheckStatusBarText (UC091CreateUpdateAEUtils.ERR_MSG_INVALID_AE_NUMBER_2);

            // Check that an existing AE Number is not entered
            myUC091CreateUpdateAEUtils.setAENumber ("AA000001");
            assertFalse ("AE Number AA000001 is valid when should be invalid",
                    myUC091CreateUpdateAEUtils.isAENumberValid ());
            myUC091CreateUpdateAEUtils.setFocusInAENumber ();
            mCheckStatusBarText (UC091CreateUpdateAEUtils.ERR_MSG_INVALID_AE_NUMBER_3);

            myUC091CreateUpdateAEUtils.setAENumber ("282F0001");
            myUC091CreateUpdateAEUtils.saveScreen ();

            final String tmpAeNumber = DBUtil.getAENumberOnCase ("9NN00011");
            // Check that the AE number is the expected next number from the Database sequence
            assertEquals ("282F0001", tmpAeNumber);
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test to create a new AE record with the new number format.
     */
    public void testloadAE ()
    {
        try
        {
            // Get to the Create Home Warrants screen
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Create/Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Check first AE Number with old format
            myUC091CreateUpdateAEUtils.setCaseNumber ("9NN00001");
            myUC091CreateUpdateAEUtils.loadExistingAE ();
            assertEquals ("282X0001", myUC091CreateUpdateAEUtils.getAENumber ());
            assertTrue ("AE Number is invalid when should be valid", myUC091CreateUpdateAEUtils.isAENumberValid ());
            myUC091CreateUpdateAEUtils.clearScreen ();

            // Check second AE Number with new format
            myUC091CreateUpdateAEUtils.setCaseNumber ("9NN00010");
            myUC091CreateUpdateAEUtils.loadExistingAE ();
            assertEquals ("AA000001", myUC091CreateUpdateAEUtils.getAENumber ());
            assertTrue ("AE Number is invalid when should be valid", myUC091CreateUpdateAEUtils.isAENumberValid ());
            myUC091CreateUpdateAEUtils.clearScreen ();

            // Check third AE Number with MAGS ORDER format
            myUC091CreateUpdateAEUtils.setCaseNumber ("NN/00001");
            myUC091CreateUpdateAEUtils.loadExistingAE ();
            assertEquals ("NN/00001", myUC091CreateUpdateAEUtils.getAENumber ());
            assertTrue ("AE Number is invalid when should be valid", myUC091CreateUpdateAEUtils.isAENumberValid ());
            myUC091CreateUpdateAEUtils.clearScreen ();
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
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }
}