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

package uk.gov.dca.utils.tests.releases.cm6_0;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC039MaintainWarrantUtils;
import uk.gov.dca.utils.screens.UC110ViewPaymentsUtils;

/**
 * Automated tests for the CaseMan Defect 3818. This defect prevents the user from navigating
 * from Maintain/Query Warrants to the View Payments screen when there is a single Payment on the
 * Warrant loaded, but it is either Referred to Drawer or marked as Errored.
 *
 * @author Chris Vincent
 */
public class CaseManTrac3818_Test extends AbstractCmTestBase
{
    
    /** The my UC 039 maintain warrant utils. */
    // Private member variables for the screen utils
    private UC039MaintainWarrantUtils myUC039MaintainWarrantUtils;
    
    /** The my UC 110 view payments utils. */
    private UC110ViewPaymentsUtils myUC110ViewPaymentsUtils;

    /** The home warrant no payments. */
    // Test Case/Warrant Numbers
    private String homeWarrantNoPayments = "X0000001";
    
    /** The home warrant RD payment. */
    private String homeWarrantRDPayment = "X0000002";
    
    /** The home warrant errored payment. */
    private String homeWarrantErroredPayment = "X0000003";
    
    /** The home warrant valid payment. */
    private String homeWarrantValidPayment = "X0000004";
    
    /** The foreign warrant no payments. */
    private String foreignWarrantNoPayments = "FWY00001";
    
    /** The foreign warrant RD payment. */
    private String foreignWarrantRDPayment = "FWY00002";
    
    /** The foreign warrant errored payment. */
    private String foreignWarrantErroredPayment = "FWY00003";
    
    /** The foreign warrant valid payment. */
    private String foreignWarrantValidPayment = "FWY00004";

    /**
     * Constructor.
     */
    public CaseManTrac3818_Test ()
    {
        super (CaseManTrac3818_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC039MaintainWarrantUtils = new UC039MaintainWarrantUtils (this);
        myUC110ViewPaymentsUtils = new UC110ViewPaymentsUtils (this);
    }

    /**
     * Tests that when no Warrant loaded, the user cannot navigate to View Payments
     * and are given an appropriate Error Message.
     */
    public void testNavigationNoWarrant ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Create Home Warrants screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Navigate to the View Payments screen without loading a Warrant
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that still in Maintain Warrants screen and appropriate error message displayed
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());
            mCheckStatusBarText ("A warrant must first be selected before PAYMENTS screen can be called.");
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Warrant is updated and the user asks to navigate after saving, the
     * user does Save first and then navigates.
     */
    public void testNavigationAfterSave ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Make a change to set the dirty flag
            myUC039MaintainWarrantUtils.setAdditionalDetails ("NOTES");

            // Navigate to the View Payments screen without saving
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that following the Save, the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant with no Payments is loaded, the user is unable to
     * navigate to View Payments and are given an appropriate Error Message.
     */
    public void testNavigationHomeWarrantNoPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_VIEW);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad (homeWarrantNoPayments, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that still in Maintain Warrants screen and appropriate error message displayed
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());
            mCheckStatusBarText ("Payments do not exist for this Warrant.");
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant with no Payments is loaded, the user is unable to
     * navigate to View Payments and are given an appropriate Error Message.
     */
    public void testNavigationForeignWarrantNoPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_VIEW);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad ("", foreignWarrantNoPayments);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that still in Maintain Warrants screen and appropriate error message displayed
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());
            mCheckStatusBarText ("Payments do not exist for this Warrant.");
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant with a single Payment referred to drawer is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationHomeWarrantRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_MEDIUM);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad (homeWarrantRDPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant with a single Payment referred to drawer is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationForeignWarrantRDPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_MEDIUM);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad ("", foreignWarrantRDPayment);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant with a single Payment marked in error is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationHomeWarrantErroredPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad (homeWarrantErroredPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant with a single Payment marked in error is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationForeignWarrantErroredPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_HIGH);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad ("", foreignWarrantErroredPayment);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Home Warrant with a single valid Payment is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationHomeWarrantValidPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Foreign Warrant with a single valid Payment is loaded, the user is able to
     * navigate to View Payments screen without issue.
     */
    public void testNavigationForeignWarrantValidPayment ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_WARRANT);

            // Navigate to the Maintain/Query Warrants screen and load Warrant
            mNavigateToWarrantsAndLoad ("", foreignWarrantValidPayment);

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Suitors Cash Supervisor user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationSuitorsCashSupervisor ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_SUITORS);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a BMS Supervisor user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationBMSSupervisor ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_BMS);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a AE Supervisor user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationAESupervisor ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_AE);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Diary Manager Supervisor user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationDiaryManagerSupervisor ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_DIARY);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a Coded Party Supervisor user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationCodedPartySupervisor ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_NORTHAMPTON, AbstractCmTestBase.ROLE_CODED);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC Manager user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationCCBCManager ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_MANAGER);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC User user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationCCBCUser ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_USER);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that when a CCBC SGB2 user is able to load a Warrant and call the
     * new service method to check if Payments exist.
     */
    public void testNavigationCCBCSGB2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_CCBC, AbstractCmTestBase.ROLE_CCBC_SGB);

            // Navigate to the Maintain/Query Warrants screen and load Home Warrant
            mNavigateToWarrantsAndLoad (homeWarrantValidPayment, "");

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());

            // Exit View Payments and return to Maintain/Query Warrants
            myUC110ViewPaymentsUtils.closeScreen ();
            mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

            // Now load a Foreign Warrant
            myUC039MaintainWarrantUtils.clickClearButton ();
            myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (foreignWarrantValidPayment);
            myUC039MaintainWarrantUtils.clickSearchButton ();

            // Navigate to the View Payments screen
            this.nav.selectQuicklinksMenuItem (UC039MaintainWarrantUtils.QUICKLINK_VIEW_PAYMENTS);

            // Check that the user is taken to the View Payments screen
            mCheckPageTitle (myUC110ViewPaymentsUtils.getScreenTitle ());
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

    /**
     * Private function which checks the current status bar text against an expected string.
     *
     * @param control The expected text
     */
    private void mCheckStatusBarText (final String control)
    {
        assertTrue ("Page title does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Utility function used to navigate to the Maintain/Query Warrants screen and load a Warrant.
     *
     * @param pWarrantNo Home Warrant Number
     * @param pLocalNo Foreign Warrant Number
     */
    private void mNavigateToWarrantsAndLoad (final String pWarrantNo, final String pLocalNo)
    {
        // Navigate to the Create Home Warrants screen
        this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_WARRANTS_PATH);

        // Check in correct screen
        mCheckPageTitle (myUC039MaintainWarrantUtils.getScreenTitle ());

        // Retrieve the Warrant record
        myUC039MaintainWarrantUtils.setHeaderExecutingCourtCode ("282");
        if (pLocalNo.equals (""))
        {
            // Home Warrant
            myUC039MaintainWarrantUtils.setWarrantNumber (pWarrantNo);
        }
        else
        {
            // Foreign Warrant
            myUC039MaintainWarrantUtils.setLocalWarrantNumber (pLocalNo);
        }
        myUC039MaintainWarrantUtils.clickSearchButton ();
    }

}