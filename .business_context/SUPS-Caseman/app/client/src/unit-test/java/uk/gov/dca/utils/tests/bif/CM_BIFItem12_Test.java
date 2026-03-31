/****************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 11720 $
 * $Author: vincentcp $
 * $Date: 2015-03-04 21:15:55 +0000 (Wed, 04 Mar 2015) $
 *
 *****************************************/

package uk.gov.dca.utils.tests.bif;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.screens.UC208MaintainAdminUsersUtils;
import uk.gov.dca.utils.velo.db.DBUtil;

/**
 * Automated tests for the CaseMan BIF Item #12 for a new Super Admin Screen
 * certain reports in the reprint reports screen.
 *
 * @author Chris Vincent
 */
public class CM_BIFItem12_Test extends AbstractCmTestBase
{
    
    /** The my UC 208 maintain admin users utils. */
    // Private member variables for the screen utils
    private UC208MaintainAdminUsersUtils myUC208MaintainAdminUsersUtils;

    /**
     * Constructor.
     */
    public CM_BIFItem12_Test ()
    {
        super (CM_BIFItem12_Test.class.getName ());
        this.nav = new Navigator (this);
        myUC208MaintainAdminUsersUtils = new UC208MaintainAdminUsersUtils (this);
    }

    /**
     * Tests screen validation and behaviour.
     */
    public void testUserIdFieldValidation ()
    {
        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUPERADMIN);

            // Navigate to the Maintain Admin Users screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_ADMINS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC208MaintainAdminUsersUtils.getScreenTitle ());

            // Check the Search button is initially disabled
            assertFalse ("Search button enabled when sbould be disabled",
                    myUC208MaintainAdminUsersUtils.isSearchButtonEnabled ());

            // Enter an invalid value and check screen behaviour
            myUC208MaintainAdminUsersUtils.setUserId ("a%a");
            assertFalse ("User Id is valid when should be invalid", myUC208MaintainAdminUsersUtils.isUserIdValid ());
            myUC208MaintainAdminUsersUtils.setUserIdFocus ();
            mCheckStatusBarText ("Legal characters are a-z, 0-9.");
            assertFalse ("Search button enabled when sbould be disabled",
                    myUC208MaintainAdminUsersUtils.isSearchButtonEnabled ());

            // Enter a valid value and check screen behaviour
            myUC208MaintainAdminUsersUtils.setUserId ("azhnn1");
            assertTrue ("User Id is invalid when should be valid", myUC208MaintainAdminUsersUtils.isUserIdValid ());
            assertTrue ("Search button disabled when sbould be enabled",
                    myUC208MaintainAdminUsersUtils.isSearchButtonEnabled ());

            // Clear screen to ensure
            myUC208MaintainAdminUsersUtils.clearScreen ();
            assertEquals ("", myUC208MaintainAdminUsersUtils.getUserId ());
            assertFalse ("Search button enabled when sbould be disabled",
                    myUC208MaintainAdminUsersUtils.isSearchButtonEnabled ());

            // Try loading a user that does not exist
            boolean dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails ("rubbish");
            assertFalse ("Invalid user was loaded", dataLoaded);

            // Try loading a user that does exist
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails ("azhnn1");
            assertTrue ("valid user was not loaded", dataLoaded);
            assertFalse ("Search button enabled when sbould be disabled",
                    myUC208MaintainAdminUsersUtils.isSearchButtonEnabled ());
        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that changes made in the screen are committed correctly.
     */
    public void testCommit ()
    {
        final String userId = "azhnn1";

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUPERADMIN);

            // Navigate to the Maintain Admin Users screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_ADMINS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC208MaintainAdminUsersUtils.getScreenTitle ());

            // Try loading a user that does not exist
            boolean dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Tests that the user is currently not setup as an administrator
            assertEquals ("282", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE, myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "1"));

            // Update user so is now a Court Administrator
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_COURT_ADMINISTRATOR);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("282", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_COURT_ADMINISTRATOR,
                    myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "2"));

            // Update user so is not an Administrator anymore
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("282", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE, myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "1"));

            // Update user so is now a Super Administrator
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_SUPER_ADMINISTRATOR);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("282", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_SUPER_ADMINISTRATOR,
                    myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "2"));

        }
        catch (final Exception e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * Tests that changes made in the screen are committed correctly when updating a user based at another court.
     */
    public void testForeignCommit ()
    {
        final String userId = "azecv1";

        try
        {
            // Log into SUPS CaseMan
            logOn (AbstractCmTestBase.COURT_COVENTRY, AbstractCmTestBase.ROLE_SUPERADMIN);

            // Navigate to the Maintain Admin Users screen
            this.nav.navigateFromMainMenu (MAINMENU_MAINTAIN_ADMINS_PATH);

            // Check in correct screen
            mCheckPageTitle (myUC208MaintainAdminUsersUtils.getScreenTitle ());

            // Try loading a user that does not exist
            boolean dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Tests that the user is currently not setup as an administrator
            assertEquals ("180", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE, myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "1"));

            // Update user so is now a Court Administrator
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_COURT_ADMINISTRATOR);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("180", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_COURT_ADMINISTRATOR,
                    myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "2"));

            // Update user so is not an Administrator anymore
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("180", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_NONE, myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "1"));

            // Update user so is now a Super Administrator
            myUC208MaintainAdminUsersUtils.setAdminRole (UC208MaintainAdminUsersUtils.ADMIN_ROLE_SUPER_ADMINISTRATOR);
            myUC208MaintainAdminUsersUtils.clickSaveButton ();
            myUC208MaintainAdminUsersUtils.clearScreen ();

            // Load user again
            dataLoaded = myUC208MaintainAdminUsersUtils.loadUserDetails (userId);
            assertTrue ("valid user was not loaded", dataLoaded);

            // Check the user is setup as expected
            assertEquals ("180", myUC208MaintainAdminUsersUtils.getOwningCourt ());
            assertEquals (UC208MaintainAdminUsersUtils.ADMIN_ROLE_SUPER_ADMINISTRATOR,
                    myUC208MaintainAdminUsersUtils.getAdminRole ());
            assertTrue ("Unexpected number of USER_ROLE rows for user", checkNumberRolesForUser (userId, "2"));

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
        assertTrue ("Status Bar does not contain pattern '" + control + "'",
                session.getTopForm ().getStatusBarText ().indexOf (control) != -1);
    }

    /**
     * Checks the number of rows for a given user in the USER_ROLE table are as expected.
     *
     * @param pUserId The user id
     * @param pExpectedRows Expected number of rows
     * @return True if the number of rows are as expected, else false
     */
    private boolean checkNumberRolesForUser (final String pUserId, final String pExpectedRows)
    {
        final String query = "SELECT DECODE(COUNT(*), " + pExpectedRows + ", 'true', 'false') FROM user_role WHERE " +
                "user_id = '" + pUserId + "'";
        return DBUtil.runDecodeTrueFalseQuery (query);
    }

}