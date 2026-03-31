/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2009
 *
 * $Revision: 1 $
 * $Author: vincentc $
 * $Date: 2009-06-26 $
 *
 *****************************************/

package uk.gov.dca.utils.tests.scalability;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC092AEEventUtils;
import uk.gov.dca.utils.screens.UC201QueryByPartyAEUtils;

/**
 * Automated tests for the scalabililty change to the Query By Party AE screen.
 *
 * @author Chris Vincent
 */
public class CaseManScalability_QueryByPartyAETest extends AbstractCmTestBase
{

    /** The my UC 092 AE event utils. */
    // Private member variables for the screen utils
    private UC092AEEventUtils myUC092AEEventUtils;

    /** The my UC 201 query by party AE utils. */
    private UC201QueryByPartyAEUtils myUC201QueryByPartyAEUtils;

    /**
     * Constructor.
     */
    public CaseManScalability_QueryByPartyAETest ()
    {
        super (CaseManScalability_QueryByPartyAETest.class.getName ());
        this.nav = new Navigator (this);
        this.myUC092AEEventUtils = new UC092AEEventUtils (this);
        this.myUC201QueryByPartyAEUtils = new UC201QueryByPartyAEUtils (this);
    }

    /**
     * Basic test that enters the Query By Party AE screen from the AE Events screen,
     * searches, selects a record and returns to the AE screen with that record.
     */
    public void testQueryByPartyAEFunctionality ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the AE Events screen
            this.nav.navigateFromMainMenu (MAINMENU_AE_EVENTS_PATH);

            // Check in AE Events screen
            mCheckPageTitle (myUC092AEEventUtils.getScreenTitle ());

            // Navigate to the Query By Party AE screen
            myUC092AEEventUtils.clickNavigationButton (UC092AEEventUtils.BTN_NAV_QUERY_SCREEN);

            // Check in Query By Party AE screen
            mCheckPageTitle (myUC201QueryByPartyAEUtils.getScreenTitle ());

            // Test partial case number query
            myUC201QueryByPartyAEUtils.setCaseNumber ("9NN0003");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            int results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 10", results == 10);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record 9NN00034 not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("9NN00034", 1));

            // Test partial AE number query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("282X001");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 10", results == 10);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record 282X0011 not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("282X0011", 2));

            // Test partial Judgment Debtor query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("");
            myUC201QueryByPartyAEUtils.setPartyName ("taylor");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 3", results == 3);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record MARTIN TAYLOR not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("MARTIN TAYLOR", 3));

            // Test partial address line 1 query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("");
            myUC201QueryByPartyAEUtils.setPartyName ("");
            myUC201QueryByPartyAEUtils.setAddressLine1 ("4");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 8", results == 8);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record 64 D1 ADLINE1 not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("64 D1 ADLINE1", 4));

            // Test partial employer name query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("");
            myUC201QueryByPartyAEUtils.setPartyName ("");
            myUC201QueryByPartyAEUtils.setAddressLine1 ("");
            myUC201QueryByPartyAEUtils.setEmployerName ("judea");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 3", results == 3);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record 9NN00038 not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("9NN00038", 1));

            // Test partial AE number, partial Judgment Debtor and partial employer name query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("2");
            myUC201QueryByPartyAEUtils.setPartyName ("z");
            myUC201QueryByPartyAEUtils.setAddressLine1 ("");
            myUC201QueryByPartyAEUtils.setEmployerName ("ben");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 1", results == 1);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record BOAZ MYHILL not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("BOAZ MYHILL", 3));

            // Test partial AE number, partial Judgment Debtor, partial address line 1 and partial employer name query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("82");
            myUC201QueryByPartyAEUtils.setPartyName ("b");
            myUC201QueryByPartyAEUtils.setAddressLine1 ("3");
            myUC201QueryByPartyAEUtils.setEmployerName ("t");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 1", results == 1);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record 9NN00012 not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("9NN00012", 1));

            // Test partial address line 1 and partial address line 2 query
            myUC201QueryByPartyAEUtils.setCaseNumber ("");
            myUC201QueryByPartyAEUtils.setAENumber ("");
            myUC201QueryByPartyAEUtils.setPartyName ("");
            myUC201QueryByPartyAEUtils.setAddressLine1 ("11");
            myUC201QueryByPartyAEUtils.setAddressLine2 ("mouth");
            myUC201QueryByPartyAEUtils.setEmployerName ("");
            myUC201QueryByPartyAEUtils.clickSearchButton ();

            // Check correct number of rows returned
            results = myUC201QueryByPartyAEUtils.getNumberMatchingRecords ();
            assertTrue (results + " rows returned when expected 2", results == 2);

            // Check one of the rows returned is as expected
            assertTrue ("Expected record MONMOUTH not present in results grid",
                    myUC201QueryByPartyAEUtils.isValueInResultsGrid ("MONMOUTH", 5));
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