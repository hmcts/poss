/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 781 $
 * $Author: mullangisa $
 * $Date: 2008-10-07 18:19:47 +0100 (Tue, 07 Oct 2008) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.rfc0486;

import uk.gov.dca.utils.SupsClientTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Automated tests for Insolvency Number UC001.
 *
 * @author Sandeep Mullangi
 */
public class CaseManRFC486_UC001Test extends SupsClientTestBase
{

    /** The case number id. */
    final String CASE_NUMBER_ID = "Header_CaseNumber";
    
    /** The insolvency number id. */
    final String INSOLVENCY_NUMBER_ID = "Header_InsolvNo";
    
    /** The insolvency year id. */
    final String INSOLVENCY_YEAR_ID = "Header_InsolvYear";
    
    /** The court code id. */
    final String COURT_CODE_ID = "Header_OwningCourtCode";
    
    /** The court name id. */
    final String COURT_NAME_ID = "Header_OwningCourtName";

    /**
     * Instantiates a new case man RFC 486 UC 001 test.
     */
    public CaseManRFC486_UC001Test ()
    {
        super (CaseManRFC486_UC001Test.class.getName ());
    }

    /**
     * {@inheritDoc}
     */
    protected void setUp () throws Exception
    {

        super.setUp ();
        session.open (testProperties.getProperty ("caseman.url"));

        session.type (testProperties.getProperty ("caseman.nonadmin1.user").trim ());
        session.tabKey ();
        session.type (testProperties.getProperty ("caseman.nonadmin1.pass").trim ());
        session.tabKey ();
        session.returnKey ();

        // assert warning screen is displayed
        session.waitForPageToLoad ();
        String pattern = "WARNING";
        assertTrue ("HTML does not contain token '" + pattern + "'", session.isTextPresent (pattern));

        // click 'continue'
        session.click ("Status_ContinueButton");
        session.waitForPageToLoad ();

        // assert main menu is displayed
        pattern = "Welcome to CaseMan";
        assertTrue ("HTML does not contain pattern '" + pattern + "'", session.isTextPresent (pattern));

        // double-click on the 3nd link in the main grid: 'Case Maintenance Menu'
        final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

        grid.doubleClickRow (3);
        session.waitForPageToLoad ();

        // After expansion click 'Create and Update Case Details' Screen
        grid.doubleClickRow (4);
        session.waitForPageToLoad ();

    }

    /**
     * Test Case when the page is initially loaded.
     */
    public void testCaseManLoadScreen ()
    {

        try
        {
            final TextInputAdaptor caseNumberTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor (CASE_NUMBER_ID);
            final TextInputAdaptor inslovNoTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor (INSOLVENCY_NUMBER_ID);
            final TextInputAdaptor insolvYearTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor (INSOLVENCY_YEAR_ID);
            final TextInputAdaptor courtCodeTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor (COURT_CODE_ID);

            // assert default fields
            assertTrue ("Case Number Box is disabled", caseNumberTextBox.isEnabled ());
            assertTrue ("Insolvency Number Box is disabled", inslovNoTextBox.isEnabled ());
            assertTrue ("Insolvency Year Number Box is disabled", insolvYearTextBox.isEnabled ());
            assertNotNull ("Court Code is not pre-populated", courtCodeTextBox.getValue ());

            // verifying tabbing sequence
            session.tabKey ();
            assertTrue ("Tabbing order incorrect, focus should be on Owning Court Code",
                    COURT_CODE_ID.equalsIgnoreCase (session.getCurrentFocusId ()));
            session.tabKey ();
            assertTrue ("Tabbing order incorrect, focus should be on Owning Court name",
                    COURT_NAME_ID.equalsIgnoreCase (session.getCurrentFocusId ()));
            session.tabKey ();
            session.tabKey ();
            assertTrue ("Tabbing order incorrect, focus should be on Insolvency Number Part 1 field",
                    INSOLVENCY_NUMBER_ID.equalsIgnoreCase (session.getCurrentFocusId ()));
            session.tabKey ();
            assertTrue ("Tabbing order incorrect, focus should be on Insolvency Number Part ",
                    CASE_NUMBER_ID.equalsIgnoreCase (session.getCurrentFocusId ()));

        }
        catch (final FrameworkException e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test Case to load an Insolvency Case.
     */
    public void CaseManLoadInsolvencyCase ()
    {
        // open CaseMan
        try
        {
            // assert the following
            final TextInputAdaptor caseNumberTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor (CASE_NUMBER_ID);

            session.type ("Header_InsolvNo", "0001");
            session.tabKey ();
            session.type ("Header_InsolvYear", "2008");
            session.tabKey ();
            session.waitForPageToLoad ();

            // assert the case has been loaded
            assertNotNull ("Case could not be loaded", caseNumberTextBox.getValue ());

        }
        catch (final FrameworkException e)
        {
            fail (e.getMessage ());
        }

    }
}