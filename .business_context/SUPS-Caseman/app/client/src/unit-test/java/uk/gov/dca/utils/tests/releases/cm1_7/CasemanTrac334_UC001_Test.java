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

package uk.gov.dca.utils.tests.releases.cm1_7;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;

/**
 * Automated tests for Insolvency Number UC001.
 *
 * @author Sandeep Mullangi
 */
public class CasemanTrac334_UC001_Test extends AbstractCmTestBase
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
     * Instantiates a new caseman trac 334 UC 001 test.
     */
    public CasemanTrac334_UC001_Test ()
    {
        super (CasemanTrac334_UC001_Test.class.getName ());
        this.nav = new Navigator (this);
    }

    /**
     * Test Case when the page is initially loaded.
     */
    public void testCaseManLoadScreen ()
    {

        try
        {
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // nav to create case
            this.nav.navigateFromMainMenu (MAINMENU_CREATE_CASE_PATH);

            session.type ("mg140509");
            session.tabKey ();

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
        catch (final Exception e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * Test Case to load an Insolvency Case
     */
    /* public void CaseManLoadInsolvencyCase(){
     * //open CaseMan
     * try
     * {
     * //assert the following
     * TextInputAdaptor caseNumberTextBox = (TextInputAdaptor) session.getTopForm().getAdaptor(CASE_NUMBER_ID);
     * TextInputAdaptor inslovNoTextBox = (TextInputAdaptor) session.getTopForm().getAdaptor(INSOLVENCY_NUMBER_ID);
     * TextInputAdaptor insolvYearTextBox = (TextInputAdaptor) session.getTopForm().getAdaptor(INSOLVENCY_YEAR_ID);
     * 
     * session.type("Header_InsolvNo", "0001");
     * session.tabKey();
     * session.type("Header_InsolvYear", "2008");
     * session.tabKey();
     * session.waitForPageToLoad();
     * 
     * //assert the case has been loaded
     * assertNotNull("Case could not be loaded", caseNumberTextBox.getValue());
     * 
     * 
     * }
     * catch(FrameworkException e)
     * {
     * fail(e.getMessage());
     * }
     * 
     * } */
}