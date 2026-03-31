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

package uk.gov.dca.utils.tests.rfc0521;

import uk.gov.dca.utils.SupsClientTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Automated tests for RFC 521.
 *
 * @author Nilesh Mistry
 */
public class CaseManRFC521Test extends SupsClientTestBase
{

    /**
     * Instantiates a new case man RFC 521 test.
     */
    public CaseManRFC521Test ()
    {
        super (CaseManRFC521Test.class.getName ());
    }

    /* Login as non-admin user and make sure that the user can only change their extension, printer, etc
     * Also, change their printer details */

    /**
     * Test case man maintain users 01.
     */
    public void testCaseManMaintainUsers01 ()
    {
        // open CaseMan
        try
        {
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            // values should be read-only
            final TextInputAdaptor userIDTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Header_UserId");
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            final SelectElementAdaptor roleTextSelect =
                    (SelectElementAdaptor) session.getTopForm ().getAdaptor ("Main_Role");
            final TextInputAdaptor extensionTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Main_Extension");
            final TextInputAdaptor printerCourtTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Main_PrinterCourtCode");
            final TextInputAdaptor printoutSectionTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Main_SectionForPrintouts");
            final AutoCompleteAdaptor printerAutoComplete =
                    (AutoCompleteAdaptor) session.getTopForm ().getAdaptor ("Main_DefaultPrinter");

            // assert User ID and Role should be read-only
            assertTrue ("User ID field is read-only", userIDTextBox.isReadOnly ());
            assertTrue ("Role field is read-only", roleTextSelect.isReadOnly ());

            // assert Extension and Printer Court Text Box should be read-only
            assertTrue ("Extension text box is enabled", extensionTextBox.isEnabled ());
            assertFalse ("Extension text box is not read-only", extensionTextBox.isReadOnly ());
            assertTrue ("Printer Court text box is enabled", printerCourtTextBox.isEnabled ());
            assertFalse ("Printer Court text box is not read-only", printerCourtTextBox.isReadOnly ());
            assertTrue ("Printer Section text box is enabled", printoutSectionTextBox.isEnabled ());
            assertFalse ("Printer Section text box is not read-only", printoutSectionTextBox.isReadOnly ());

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertTrue ("Admin Check Box is read-only", adminCheckBox.isReadOnly ());

            session.type ("Main_PrinterCourtCode", "282");
            session.tabKey ();
            session.waitForPageToLoad ();
            session.tabKey ();
            session.tabKey ();

            assertFalse ("Printer AutoComplete is not read-only", printerAutoComplete.isReadOnly ());
            printerAutoComplete.setText ("CSP00001");
            session.tabKey ();
            assertTrue ("Printer Auto Complete is valid", printerAutoComplete.isValid ());

            final ButtonAdaptor saveButton = (ButtonAdaptor) session.getTopForm ().getAdaptor ("Status_SaveBtn");
            saveButton.click ();
        }
        catch (final FrameworkException e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * This test logs into the application as an admin user. They can retrieve their own profile and it checks that the
     * admin checkbox is checked and read-only
     */

    public void testCaseManMaintainUsers02 ()
    {
        // open CaseMan
        try
        {
            session.open (testProperties.getProperty ("caseman.url"));

            session.type (testProperties.getProperty ("caseman.admin.user").trim ());
            session.tabKey ();
            session.type (testProperties.getProperty ("caseman.admin.pass").trim ());
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            // assert system admin checkbox is disabled and not checked
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            assertTrue ("Admin Check Box is disabled", !adminCheckBox.isEnabled ());
            assertTrue ("Admin Check Box is not checked", !adminCheckBox.isChecked ());

            // type user with admin and business role in
            session.type (testProperties.getProperty ("caseman.admin.user"));
            session.tabKey ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertTrue ("Admin Check Box is checked", adminCheckBox.isChecked ());
            assertTrue ("Admin Check Box is read-only", adminCheckBox.isReadOnly ());
        }
        catch (final FrameworkException e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * This test logs into the application as an admin user. They can retrieve another user's profile, add the admin
     * functionality and then take it away.
     */

    public void testCaseManMaintainUsers03 ()
    {
        // open CaseMan
        try
        {
            session.open (testProperties.getProperty ("caseman.url"));

            session.type (testProperties.getProperty ("caseman.admin.user").trim ());
            session.tabKey ();
            session.type (testProperties.getProperty ("caseman.admin.pass").trim ());
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            final TextInputAdaptor userIDTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Header_UserId");
            // assert User ID test box is enabled and not read-only
            assertTrue ("User ID Text Box is enabled", userIDTextBox.isEnabled ());
            assertFalse ("User ID Text Box is not read-only", userIDTextBox.isReadOnly ());
            // assert system admin checkbox is disabled and not checked
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            assertTrue ("Admin Check Box is disabled", !adminCheckBox.isEnabled ());
            assertTrue ("Admin Check Box is not checked", !adminCheckBox.isChecked ());

            // type user with just business role in
            session.type (testProperties.getProperty ("caseman.nonadmin2.user"));
            session.tabKey ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            final SelectElementAdaptor roleTextSelect =
                    (SelectElementAdaptor) session.getTopForm ().getAdaptor ("Main_Role");
            // assert User ID and Role should be read-only
            assertTrue ("User ID field is read-only", userIDTextBox.isReadOnly ());
            assertFalse ("Role field is not read-only", roleTextSelect.isReadOnly ());

            session.click ("Main_SystemAdminIndicator");
            session.click ("Status_SaveBtn");
            session.waitForPageToLoad ();

            session.type ("Header_UserId", testProperties.getProperty ("caseman.nonadmin2.user"));
            session.tabKey ();
            session.waitForPageToLoad ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertTrue ("Admin Check Box is checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            session.click ("Main_SystemAdminIndicator");
            session.click ("Status_SaveBtn");
            session.waitForPageToLoad ();
        }
        catch (final FrameworkException e)
        {
            fail (e.getMessage ());
        }
    }

    /**
     * This test logs into the application as an admin user. They can deactivate another user's profile, and then
     * reactivate them.
     */
    public void testCaseManMaintainUsers04 ()
    {
        // open CaseMan
        try
        {
            session.open (testProperties.getProperty ("caseman.url"));

            session.type (testProperties.getProperty ("caseman.admin.user").trim ());
            session.tabKey ();
            session.type (testProperties.getProperty ("caseman.admin.pass").trim ());
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            final TextInputAdaptor userIDTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Header_UserId");
            // assert User ID test box is enabled and not read-only
            assertTrue ("User ID Text Box is enabled", userIDTextBox.isEnabled ());
            assertFalse ("User ID Text Box is not read-only", userIDTextBox.isReadOnly ());
            // assert system admin checkbox is disabled and not checked
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            assertFalse ("Admin Check Box is disabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());

            // type user with just business role in
            session.type ("Header_UserId", testProperties.getProperty ("caseman.nonadmin2.user"));
            session.tabKey ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            final SelectElementAdaptor roleTextSelect =
                    (SelectElementAdaptor) session.getTopForm ().getAdaptor ("Main_Role");
            // assert User ID and Role should be read-only
            assertTrue ("User ID field is read-only", userIDTextBox.isReadOnly ());
            assertFalse ("Role field is not read-only", roleTextSelect.isReadOnly ());

            session.click ("Status_DeactivateBtn");
            // Click yes to confirmation that you want to deactivate user
            session.getConfirmation ();
            session.waitForPageToLoad ();

            session.type ("Header_UserId", testProperties.getProperty ("caseman.nonadmin2.user"));
            session.waitForPageToLoad ();
            session.getConfirmation ();
            session.waitForPageToLoad ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            // navigate to Printer AutoComplete
            session.tabKey ();
            session.tabKey ();
            session.tabKey ();
            session.tabKey ();
            session.tabKey ();
            session.tabKey ();
            session.tabKey ();

            // reactivate the user
            final AutoCompleteAdaptor printerAutoComplete =
                    (AutoCompleteAdaptor) session.getTopForm ().getAdaptor ("Main_DefaultPrinter");
            printerAutoComplete.setText ("CSP00001");

            // navigate to section select
            session.tabKey ();
            session.tabKey ();

            session.select ("Main_SectionForBMS", "CASEMAN TEAM 1");

            // navigate to role select
            session.tabKey ();

            session.select ("Main_Role", "Attachment of Earnings Supervisor");
            session.click ("Status_SaveBtn");

        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * This test logs into the application as an admin user. They add a user with no admin rights
     */
    public void testCaseManMaintainUsers05 ()
    {
        // open CaseMan
        try
        {
            session.open (testProperties.getProperty ("caseman.url"));

            session.type (testProperties.getProperty ("caseman.admin.user").trim ());
            session.tabKey ();
            session.type (testProperties.getProperty ("caseman.admin.pass").trim ());
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            final TextInputAdaptor userIDTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Header_UserId");
            // assert User ID test box is enabled and not read-only
            assertTrue ("User ID Text Box is enabled", userIDTextBox.isEnabled ());
            assertFalse ("User ID Text Box is not read-only", userIDTextBox.isReadOnly ());
            // assert system admin checkbox is disabled and not checked
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            assertFalse ("Admin Check Box is disabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());

            // type user to be added in
            session.type ("Header_UserId", testProperties.getProperty ("caseman.test.user"));
            session.waitForPageToLoad ();
            session.getConfirmation ();
            session.waitForPageToLoad ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            // populate form
            session.tabKey ();
            session.type ("Main_Title", "Mr");
            session.tabKey ();
            session.type ("Main_UserShortName", "Gwyn Jensen");
            session.tabKey ();
            session.type ("Main_Extension", "456429");
            session.tabKey ();
            session.type ("Main_PrinterCourtCode", "282");
            session.tabKey ();
            session.waitForPageToLoad ();
            session.tabKey ();
            session.tabKey ();
            final AutoCompleteAdaptor printerAutoComplete =
                    (AutoCompleteAdaptor) session.getTopForm ().getAdaptor ("Main_DefaultPrinter");
            printerAutoComplete.setText ("CSP00001");
            session.tabKey ();
            session.tabKey ();
            session.select ("Main_SectionForBMS", "CASEMAN TEAM 1");
            session.tabKey ();
            session.select ("Main_Role", "High");
            session.click ("Status_SaveBtn");
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }

    /**
     * This test logs into the application as an admin user. They add a user with admin rights
     */
    public void testCaseManMaintainUsers06 ()
    {
        // open CaseMan
        try
        {
            session.open (testProperties.getProperty ("caseman.url"));

            session.type (testProperties.getProperty ("caseman.admin.user").trim ());
            session.tabKey ();
            session.type (testProperties.getProperty ("caseman.admin.pass").trim ());
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

            // double-click on the 2nd link in the main grid: 'MaintainUserProfiles'
            final GridAdaptor grid = (GridAdaptor) session.getTopForm ().getAdaptor ("Detail_FormsGrid");

            grid.doubleClickRow (2);
            session.waitForPageToLoad ();

            // Blank maintain user detail screen displayed
            pattern = "Maintain User Profiles";
            final String s = session.getText ("header_title");
            assertTrue ("Page title does not contain pattern '" + pattern + "'", s.indexOf (pattern) != -1);

            final TextInputAdaptor userIDTextBox =
                    (TextInputAdaptor) session.getTopForm ().getAdaptor ("Header_UserId");
            // assert User ID test box is enabled and not read-only
            assertTrue ("User ID Text Box is enabled", userIDTextBox.isEnabled ());
            assertFalse ("User ID Text Box is not read-only", userIDTextBox.isReadOnly ());
            // assert system admin checkbox is disabled and not checked
            final CheckboxInputAdaptor adminCheckBox =
                    (CheckboxInputAdaptor) session.getTopForm ().getAdaptor ("Main_SystemAdminIndicator");
            assertFalse ("Admin Check Box is disabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());

            // type user to be added in
            session.type ("Header_UserId", testProperties.getProperty ("caseman.test.user"));
            session.waitForPageToLoad ();
            session.getConfirmation ();
            session.waitForPageToLoad ();

            // assert system admin checkbox is enabled, read-only and not checked
            assertTrue ("Admin Check Box is enabled", adminCheckBox.isEnabled ());
            assertFalse ("Admin Check Box is not checked", adminCheckBox.isChecked ());
            assertFalse ("Admin Check Box is not read-only", adminCheckBox.isReadOnly ());

            // populate form
            session.tabKey ();
            session.type ("Main_Title", "Mr");
            session.tabKey ();
            session.type ("Main_UserShortName", "Gwyn Jensen");
            session.tabKey ();
            session.type ("Main_Extension", "456429");
            session.tabKey ();
            session.type ("Main_PrinterCourtCode", "282");
            session.tabKey ();
            session.waitForPageToLoad ();
            session.tabKey ();
            session.tabKey ();
            final AutoCompleteAdaptor printerAutoComplete =
                    (AutoCompleteAdaptor) session.getTopForm ().getAdaptor ("Main_DefaultPrinter");
            printerAutoComplete.setText ("CSP00001");
            session.tabKey ();
            session.tabKey ();
            session.select ("Main_SectionForBMS", "CASEMAN TEAM 1");
            session.tabKey ();
            session.select ("Main_Role", "High");
            session.tabKey ();
            session.click ("Main_SystemAdminIndicator");
            session.click ("Status_SaveBtn");
        }
        catch (final FrameworkException e)
        {
            e.printStackTrace ();
            fail (e.getMessage ());
        }
    }
}