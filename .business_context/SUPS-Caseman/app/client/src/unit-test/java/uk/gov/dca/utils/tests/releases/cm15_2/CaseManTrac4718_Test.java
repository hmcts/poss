/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 9660 $
 * $Author: vincentcp $
 * $Date: 2012-09-26 15:34:54 +0100 (Wed, 26 Sep 2012) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.releases.cm15_2;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC120MaintainCourtDataUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan Enhancement 4718. This includes a change to the Maintain Court
 * Data screen to include four new fields: DR Telephone Number, DR Open From, DR Closed At and a
 * By Appointment Flag
 *
 * @author Chris Vincent
 */
public class CaseManTrac4718_Test extends AbstractCmTestBase
{
    
    /** The my UC 120 maintain court data utils. */
    // Private member variables for the screen utils
    private UC120MaintainCourtDataUtils myUC120MaintainCourtDataUtils;

    /**
     * Constructor.
     */
    public CaseManTrac4718_Test ()
    {
        super (CaseManTrac4718_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC120MaintainCourtDataUtils = new UC120MaintainCourtDataUtils (this);
    }

    /**
     * Tests the enablement, validation and commital rules of the new columns in
     * the Maintain Court Data screen, concentrating mainly on the Add New Court
     * popup.
     */
    public void testNewFields1 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Physically delete court 888 as about to be created
            DBUtil.deleteCourtData ("888");

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Check new fields are disabled when first enter the screen
            assertFalse ("DR Telephone Number enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDRTelephoneNumberEnabled ());
            assertFalse ("DR Open From enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDROpenFromEnabled ());
            assertFalse ("DR Closed At enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isDRClosedAtEnabled ());
            assertFalse ("By Appointment field enabled, when should be disabled",
                    myUC120MaintainCourtDataUtils.isCourtByAppointmentEnabled ());

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");

            // Set the new fields
            myUC120MaintainCourtDataUtils.setNewDRTelephone ("0181 505050");
            myUC120MaintainCourtDataUtils.setNewByAppointment (true);
            myUC120MaintainCourtDataUtils.setNewDROpenFrom ("AAAA");
            myUC120MaintainCourtDataUtils.setNewDRClosedAt ("BBBB");

            assertFalse ("New Court DR Open From field is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isNewDROpenFromValid ());
            assertFalse ("New Court DR Closed At field is valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isNewDRClosedAtValid ());

            myUC120MaintainCourtDataUtils.setNewDROpenFrom ("10:00");
            myUC120MaintainCourtDataUtils.setNewDRClosedAt ("16:00");

            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Check new fields are enabled now the new court details are loaded
            assertTrue ("DR Telephone Number disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDRTelephoneNumberEnabled ());
            assertTrue ("DR Open From disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDROpenFromEnabled ());
            assertTrue ("DR Closed At disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDRClosedAtEnabled ());
            assertTrue ("By Appointment field disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isCourtByAppointmentEnabled ());

            // Check value and validity of the the new fields following commit
            assertTrue ("DR Open From invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isDROpenFromValid ());
            assertTrue ("DR Closed At invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isDRClosedAtValid ());
            assertEquals (myUC120MaintainCourtDataUtils.getDRTelephoneNumber (), "0181 505050");
            assertEquals (myUC120MaintainCourtDataUtils.getDROpenFrom (), "10:00");
            assertEquals (myUC120MaintainCourtDataUtils.getDRClosedAt (), "16:00");
            assertTrue ("By Appointment unticked when should be ticked",
                    myUC120MaintainCourtDataUtils.getCourtByAppointment ());

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests the enablement, validation and commital rules of the new columns in
     * the Maintain Court Data screen, concentrating mainly on the fields in the
     * main screen (as opposed to the popup).
     */
    public void testNewFields2 ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_HELPDESK);

            // Physically delete court 888 as about to be created
            DBUtil.deleteCourtData ("888");

            // Navigate to the Maintain Courts screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_COURT_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC120MaintainCourtDataUtils.getScreenTitle ());

            // Add a new court
            myUC120MaintainCourtDataUtils.clickAddCourtButton ();
            myUC120MaintainCourtDataUtils.setNewCourtCode ("888");
            myUC120MaintainCourtDataUtils.setNewCourtName ("Court 888 Name");
            myUC120MaintainCourtDataUtils.setNewCourtId ("ZZ");
            myUC120MaintainCourtDataUtils.setNewCourtAccountType (UC120MaintainCourtDataUtils.ACCOUNT_TYPE_COUNTY);
            myUC120MaintainCourtDataUtils.setNewCourtAccountCode ("1");

            // Set the new fields (leave the By Appointment flag blank)
            myUC120MaintainCourtDataUtils.setNewDRTelephone ("0181 505050");
            myUC120MaintainCourtDataUtils.setNewDROpenFrom ("10:00");
            myUC120MaintainCourtDataUtils.setNewDRClosedAt ("16:00");

            myUC120MaintainCourtDataUtils.newCourtClickOk ();

            // Clear details down and load Court record
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("888");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Check new fields are enabled now the new court details are loaded
            assertTrue ("DR Telephone Number disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDRTelephoneNumberEnabled ());
            assertTrue ("DR Open From disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDROpenFromEnabled ());
            assertTrue ("DR Closed At disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isDRClosedAtEnabled ());
            assertTrue ("By Appointment field disabled, when should be enabled",
                    myUC120MaintainCourtDataUtils.isCourtByAppointmentEnabled ());

            // Check value and validity of the the new fields following commit
            assertTrue ("DR Open From invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isDROpenFromValid ());
            assertTrue ("DR Closed At invalid when should be valid",
                    myUC120MaintainCourtDataUtils.isDRClosedAtValid ());
            assertEquals (myUC120MaintainCourtDataUtils.getDRTelephoneNumber (), "0181 505050");
            assertEquals (myUC120MaintainCourtDataUtils.getDROpenFrom (), "10:00");
            assertEquals (myUC120MaintainCourtDataUtils.getDRClosedAt (), "16:00");
            assertFalse ("By Appointment ticked when should be unticked",
                    myUC120MaintainCourtDataUtils.getCourtByAppointment ());

            // Set the new fields on the main screen test validation rules and click Save
            myUC120MaintainCourtDataUtils.setDRTelephoneNumber ("01283 123456");
            myUC120MaintainCourtDataUtils.setDROpenFrom ("AAAA");
            myUC120MaintainCourtDataUtils.setDRClosedAt ("BBBB");
            myUC120MaintainCourtDataUtils.setCourtByAppointment (true);

            assertFalse ("DR Open From valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isDROpenFromValid ());
            assertFalse ("DR Closed At valid when should be invalid",
                    myUC120MaintainCourtDataUtils.isDRClosedAtValid ());

            myUC120MaintainCourtDataUtils.setDROpenFrom ("11:15");
            myUC120MaintainCourtDataUtils.setDRClosedAt ("13:45");
            myUC120MaintainCourtDataUtils.clickSaveButton ();

            // Clear details down and load Court record
            myUC120MaintainCourtDataUtils.clickClearButton ();
            myUC120MaintainCourtDataUtils.setCourtCode ("888");
            myUC120MaintainCourtDataUtils.clickSearchButton ();

            // Check that changes have been committed
            assertEquals (myUC120MaintainCourtDataUtils.getDRTelephoneNumber (), "01283 123456");
            assertEquals (myUC120MaintainCourtDataUtils.getDROpenFrom (), "11:15");
            assertEquals (myUC120MaintainCourtDataUtils.getDRClosedAt (), "13:45");
            assertTrue ("By Appointment unticked when should be ticked",
                    myUC120MaintainCourtDataUtils.getCourtByAppointment ());

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

}