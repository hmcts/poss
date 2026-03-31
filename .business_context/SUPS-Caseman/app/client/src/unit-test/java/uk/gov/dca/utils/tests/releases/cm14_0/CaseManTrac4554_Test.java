/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9403 $
 * $Author: vincentcp $
 * $Date: 2012-01-25 10:02:02 +0000 (Wed, 25 Jan 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm14_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC032WarrantDailyFeeSheetUtils;
import uk.gov.dca.utils.screens.UC045WarrantReturnsUtils;
import uk.gov.dca.utils.screens.UC091CreateUpdateAEUtils;

/**
 * Automated tests for the CaseMan Defect 4554. This covers the stored Oracle Report Court Code being cleared
 * down correctly in certain circumstances so that other Oracle Reports are subsequently run against the correct
 * owning court.
 *
 * @author Des Johnston
 */
public class CaseManTrac4554_Test extends AbstractCmTestBase
{
    
    /** The my UC 032 warrant daily fee sheet utils. */
    // Private member variables for the screen utils
    private UC032WarrantDailyFeeSheetUtils myUC032WarrantDailyFeeSheetUtils;
    
    /** The my UC 045 warrant returns utils. */
    private UC045WarrantReturnsUtils myUC045WarrantReturnsUtils;
    
    /** The my UC 091 create update AE utils. */
    private UC091CreateUpdateAEUtils myUC091CreateUpdateAEUtils;

    /** The case number. */
    private String caseNumber = "2CV00001";

    /**
     * Constructor.
     */
    public CaseManTrac4554_Test ()
    {
        super (CaseManTrac4554_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC032WarrantDailyFeeSheetUtils = new UC032WarrantDailyFeeSheetUtils (this);
        myUC045WarrantReturnsUtils = new UC045WarrantReturnsUtils (this);
        myUC091CreateUpdateAEUtils = new UC091CreateUpdateAEUtils (this);
    }

    /**
     * Court A user loads a Warrant owned by Court B in the Warrant Returns screen and runs the Warrant Returns Report
     * This generates an output which is correctly linked to Court B
     * Court A user exits the screen
     * Court A user enters the Warrant Daily Fee Sheet screen
     * Tests that the court code on the screen is that of Court A and not of Court B.
     */
    public void testWarrantReturnScenario ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Warrant Returns screen
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_RETURNS_PATH);

            mCheckPageTitle (myUC045WarrantReturnsUtils.getScreenTitle ());

            // Load a foreign owned Warrant and run the Warrant Returns Report, then exit screen
            myUC045WarrantReturnsUtils.setExecutingCourtCode ("180");
            myUC045WarrantReturnsUtils.setCaseNumber (caseNumber);
            myUC045WarrantReturnsUtils.clickSearchButton ();
            myUC045WarrantReturnsUtils.runWarrantReturnsReport ();
            myUC045WarrantReturnsUtils.closeScreen ();

            // Navigate to the Warrant Daily Fee Sheet screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_DAILY_FEE_SHEET_PATH);

            mCheckPageTitle (myUC032WarrantDailyFeeSheetUtils.getScreenTitle ());

            // Check owning court displayed in the screen
            assertEquals ("282", myUC032WarrantDailyFeeSheetUtils.getOwningCourtCode ());
        }
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Court A user creates an Attachment of Earnings record on a Case owned by Court B
     * This generates an output which is correctly linked to Court B
     * Court A user exits the screen
     * Court A user enters the Warrant Daily Fee Sheet screen
     * Tests that the court code on the screen is that of Court A and not of Court B.
     */
    public void testCreateAEScenario ()
    {
        try
        {
            // Log into CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain AE screen
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_AE_PATH);

            mCheckPageTitle (myUC091CreateUpdateAEUtils.getScreenTitle ());

            // Add AE Details and Click Save
            myUC091CreateUpdateAEUtils.setCaseNumber (caseNumber);
            myUC091CreateUpdateAEUtils.setAmountOfAE ("1000");
            myUC091CreateUpdateAEUtils.setAEFee ("65");
            myUC091CreateUpdateAEUtils.setOccupation ("REFRESHMENTS TECHNICIAN");
            myUC091CreateUpdateAEUtils.setPayrollNumber ("123456");
            myUC091CreateUpdateAEUtils.setNamedPerson ("NAMED PERSON NAME");
            myUC091CreateUpdateAEUtils.addNewEmployerAddress ("EMP ADLINE1", "EMP ADLINE2", "EMP ADLINE3",
                    "EMP ADLINE4", "EMP ADLINE5", "TF3 4NT", "EMP REFERENCE");
            myUC091CreateUpdateAEUtils.setEmployerName ("EMPLOYER NAME");
            myUC091CreateUpdateAEUtils.saveAndHandleVariableDataScreen ();
            myUC091CreateUpdateAEUtils.closeScreen ();

            // Navigate to the Warrant Daily Fee Sheet screen
            this.nav.navigateFromMainMenu (MAINMENU_RESET);
            this.nav.navigateFromMainMenu (MAINMENU_WARRANT_DAILY_FEE_SHEET_PATH);

            mCheckPageTitle (myUC032WarrantDailyFeeSheetUtils.getScreenTitle ());

            // Check owning court displayed in the screen
            assertEquals ("282", myUC032WarrantDailyFeeSheetUtils.getOwningCourtCode ());
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