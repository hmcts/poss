/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.utils.common;

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.log4j.Logger;
import org.dbunit.database.DatabaseConfig;
import org.dbunit.database.DatabaseConnection;
import org.dbunit.database.IDatabaseConnection;
import org.dbunit.dataset.IDataSet;
import org.dbunit.dataset.xml.FlatXmlDataSet;
import org.dbunit.ext.oracle.OracleDataTypeFactory;
import org.dbunit.operation.DatabaseOperation;

import uk.gov.dca.utils.ConfigException;
import uk.gov.dca.utils.SupsClientTestBase;
import uk.gov.dca.utils.navigate.NavigationProperties;
import uk.gov.dca.utils.navigate.Navigator;
import uk.gov.dca.utils.perf.Timer;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.AutoCompleteAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.CheckboxInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.DatePickerAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FilteredGridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.FrameworkDialogAdaptor;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;
import uk.gov.dca.utils.selenium.adaptors.LoginGUIAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PanelSelectorAdaptor;
import uk.gov.dca.utils.selenium.adaptors.PopupAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SelectElementAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TabbedAreaAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;
import uk.gov.dca.utils.selenium.adaptors.ZoomFieldAdaptor;

/**
 * Created by Chris Vincent. Abstract classs that exposes protected session object functionality to children
 * in other packages in a standard fashion. Anything requiring the session object directly must reside here.
 * The session object is a member of SupsClientTestBase. This is a set of utilty functions to perform basic
 * operations such as retrieving an adaptor or logging in. This provides Framework functionality to the test.
 */
public abstract class AbstractCmTestBase extends SupsClientTestBase implements ITestProperties, NavigationProperties
{
    
    /** The nav. */
    public Navigator nav; // Public navigator object for navigating around the application
    
    /** The timer. */
    public Timer timer = new Timer (); // used when testing SLAs

    /** The Constant LOG. */
    private static final Logger LOG = Logger.getLogger (AbstractCmTestBase.class); // Private loggger

    /** The Constant COURT_NORTHAMPTON. */
    // Static constants representing the courts with users available for tests
    public static final int COURT_NORTHAMPTON = 282;
    
    /** The Constant COURT_COVENTRY. */
    public static final int COURT_COVENTRY = 180;
    
    /** The Constant COURT_WOLVERHAMPTON. */
    public static final int COURT_WOLVERHAMPTON = 378;
    
    /** The Constant COURT_CCBC. */
    public static final int COURT_CCBC = 335;

    /** The Constant ROLE_ADMIN. */
    // Static constants representing the user roles available for tests
    public static final String ROLE_ADMIN = "Admin";
    
    /** The Constant ROLE_SUPERADMIN. */
    public static final String ROLE_SUPERADMIN = "sAdmin";
    
    /** The Constant ROLE_HELPDESK. */
    public static final String ROLE_HELPDESK = "Helpdesk";
    
    /** The Constant ROLE_VIEW. */
    public static final String ROLE_VIEW = "ViewOnly";
    
    /** The Constant ROLE_MEDIUM. */
    public static final String ROLE_MEDIUM = "Medium";
    
    /** The Constant ROLE_HIGH. */
    public static final String ROLE_HIGH = "High";
    
    /** The Constant ROLE_SUITORS. */
    public static final String ROLE_SUITORS = "SuitorsCash";
    
    /** The Constant ROLE_WARRANT. */
    public static final String ROLE_WARRANT = "Warrant";
    
    /** The Constant ROLE_BMS. */
    public static final String ROLE_BMS = "BMS";
    
    /** The Constant ROLE_CODED. */
    public static final String ROLE_CODED = "CodedParty";
    
    /** The Constant ROLE_DIARY. */
    public static final String ROLE_DIARY = "DiaryManager";
    
    /** The Constant ROLE_AE. */
    public static final String ROLE_AE = "AESuper";
    
    /** The Constant ROLE_CCBC_MANAGER. */
    public static final String ROLE_CCBC_MANAGER = "CCBCManager";
    
    /** The Constant ROLE_CCBC_USER. */
    public static final String ROLE_CCBC_USER = "CCBCUser";
    
    /** The Constant ROLE_CCBC_SGB. */
    public static final String ROLE_CCBC_SGB = "CCBCSGB2";
    
    /** The Constant ROLE_CCBC_TAPE. */
    public static final String ROLE_CCBC_TAPE = "CCBCTape";

    /**
     * Constructor.
     *
     * @param testName String representing the name of the Selenium test being run
     */
    public AbstractCmTestBase (final String testName)
    {
        super (testName);
    }

    /**
     * Overidden function adds the reference data common to all tests to the database.
     *
     * @throws Exception If there is an issue
     */
    protected void setUp () throws Exception
    {
        super.setUp ();
        try
        {
            LOG.info ("Initialising CaseMan Reference Data");

            final File theDTD = new File (testProperties.getProperty ("db.dtd"));
            final Reader dtdReader = new FileReader (theDTD);
            final File refDataFile = new File ("./test/java/uk/gov/dca/utils/common/RefData.xml");
            final IDataSet refDataSet = new FlatXmlDataSet (new FileReader (refDataFile), dtdReader);

            final Connection dbConn = getDbConnection ();
            final IDatabaseConnection dbUnitConn = new DatabaseConnection (dbConn, dbUser.toUpperCase ());

            // set features/properties
            // Batched statements speed up loading of large datasets.
            final DatabaseConfig config = dbUnitConn.getConfig ();
            config.setFeature (DatabaseConfig.FEATURE_BATCHED_STATEMENTS, false);
            config.setProperty (DatabaseConfig.PROPERTY_DATATYPE_FACTORY, new OracleDataTypeFactory ());

            ResultSet rs = null;
            try
            {
                LOG.debug ("dbUser: " + dbUser);

                // We need to disable the audit triggers - this should be over-ridden because it is specific
                // to SUPS apps
                // need to disable because the audit generates a lot of data which isn't necessary for test
                // setup. It also makes the whole process run a lot faster.
                disableTriggers (dbConn);

                // this StoredProc call is necessary so that the process can delete data
                final String storedProcCmd = testProperties.getProperty ("db.setctx.cmd").trim ();
                final CallableStatement cs = dbConn.prepareCall (storedProcCmd);
                rs = cs.executeQuery ();

                LOG.info ("Building reference data");
                DatabaseOperation.INSERT.execute (dbUnitConn, refDataSet);

                // Now we need to enable the audit triggers
                enableTriggers (dbConn);
            }
            finally
            {
                if (rs != null)
                {
                    rs.close ();
                }
                if (dbUnitConn != null)
                {
                    dbUnitConn.close ();
                }
                if (dbConn != null)
                {
                    dbConn.close ();
                }
            }
        }
        catch (final Exception e)
        {
            LOG.error (e);
        }
        LOG.info ("Completed Initialisation CaseMan Reference Data");
    }

    /**
     * Over-ridden method to disable CaseMan triggers.
     *
     * @param dbConn The Database connection.
     * @throws SQLException the SQL exception
     */
    protected void disableTriggers (final Connection dbConn) throws SQLException
    {
        LOG.info ("Disabling Audit triggers");
        Statement s = null;
        try
        {
            s = dbConn.createStatement ();
            s.executeUpdate ("ALTER TRIGGER AUD_AE_APPLICATIONS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_AE_EVENTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_ALLOWED_DEBTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASE_EVENTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASE_PARTY_ROLES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CODED_PARTIES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CONSOLIDATED_ORDERS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_COURTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CO_EVENTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CPR_TO_CPR_RELATIONSHIP DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_DCA_USER DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_GIVEN_ADDRESSES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_HEARINGS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_JUDGMENTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_NATIONAL_CODED_PARTIES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_OBLIGATIONS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PARTIES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PARTY_ROLES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PAYEES DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PAYMENTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PERSONALISE DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_USER_COURT DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_USER_ROLE DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WARRANTS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WARRANT_RETURNS DISABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WINDOW_FOR_TRIAL DISABLE");
        }
        finally
        {
            if (s != null)
            {
                s.close ();
            }
        }
    }

    /**
     * Over-ridden method to enable CaseMan triggers.
     *
     * @param dbConn The Database connection.
     * @throws SQLException If there is an error executing the commands.
     */
    protected void enableTriggers (final Connection dbConn) throws SQLException
    {
        LOG.info ("Enabling Audit triggers");
        Statement s = null;
        try
        {
            s = dbConn.createStatement ();
            s.executeUpdate ("ALTER TRIGGER AUD_AE_APPLICATIONS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_AE_EVENTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_ALLOWED_DEBTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASE_EVENTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CASE_PARTY_ROLES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CODED_PARTIES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CONSOLIDATED_ORDERS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_COURTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CO_EVENTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_CPR_TO_CPR_RELATIONSHIP ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_DCA_USER ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_GIVEN_ADDRESSES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_HEARINGS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_JUDGMENTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_NATIONAL_CODED_PARTIES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_OBLIGATIONS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PARTIES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PARTY_ROLES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PAYEES ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PAYMENTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_PERSONALISE ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_USER_COURT ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_USER_ROLE ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WARRANTS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WARRANT_RETURNS ENABLE");
            s.executeUpdate ("ALTER TRIGGER AUD_WINDOW_FOR_TRIAL ENABLE");
        }
        finally
        {
            if (s != null)
            {
                s.close ();
            }
        }
    }

    /**
     * Gets the page title.
     *
     * @return the page title
     */
    public String getPageTitle ()
    {
        return session.getPageTitle ();
    }

    /**
     * Overloaded function which determines a username to log into the application with
     * based upon a court code and role specified.
     *
     * @param pCourtCode The court code for the user
     * @param pRole The role for the user
     */
    protected void logOn (final int pCourtCode, final String pRole)
    {
        String username = null;
        final String password = testProperties.getProperty ("caseman.default.password").trim ();

        switch (pCourtCode)
        {
            case COURT_NORTHAMPTON:
                if (pRole.equals (ROLE_ADMIN))
                {
                    username = "azann1";
                }
                else if (pRole.equals (ROLE_VIEW))
                {
                    username = "azvnn1";
                }
                else if (pRole.equals (ROLE_MEDIUM))
                {
                    username = "azmnn1";
                }
                else if (pRole.equals (ROLE_HIGH))
                {
                    username = "azhnn1";
                }
                else if (pRole.equals (ROLE_SUITORS))
                {
                    username = "azsnn1";
                }
                else if (pRole.equals (ROLE_WARRANT))
                {
                    username = "azwnn1";
                }
                else if (pRole.equals (ROLE_BMS))
                {
                    username = "azbnn1";
                }
                else if (pRole.equals (ROLE_CODED))
                {
                    username = "azcnn1";
                }
                else if (pRole.equals (ROLE_DIARY))
                {
                    username = "azdnn1";
                }
                else if (pRole.equals (ROLE_AE))
                {
                    username = "azenn1";
                }
                else if (pRole.equals (ROLE_HELPDESK))
                {
                    username = "azmcv1";
                }
                break;
            case COURT_COVENTRY:
                if (pRole.equals (ROLE_ADMIN))
                {
                    username = "azacv1";
                }
                else if (pRole.equals (ROLE_SUPERADMIN))
                {
                    username = "azvcv1";
                }
                else if (pRole.equals (ROLE_HIGH))
                {
                    username = "azhcv1";
                }
                else if (pRole.equals (ROLE_SUITORS))
                {
                    username = "azscv1";
                }
                else if (pRole.equals (ROLE_WARRANT))
                {
                    username = "azwcv1";
                }
                else if (pRole.equals (ROLE_BMS))
                {
                    username = "azbcv1";
                }
                else if (pRole.equals (ROLE_CODED))
                {
                    username = "azccv1";
                }
                else if (pRole.equals (ROLE_DIARY))
                {
                    username = "azdcv1";
                }
                else if (pRole.equals (ROLE_AE))
                {
                    username = "azecv1";
                }
                else if (pRole.equals (ROLE_HELPDESK))
                {
                    username = "azmcv1";
                }
                break;
            case COURT_WOLVERHAMPTON:
                if (pRole.equals (ROLE_ADMIN))
                {
                    username = "azawv1";
                }
                break;
            case COURT_CCBC:
                if (pRole.equals (ROLE_ADMIN))
                {
                    username = "azaxx1";
                }
                else if (pRole.equals (ROLE_CCBC_MANAGER))
                {
                    username = "azvxx1";
                }
                else if (pRole.equals (ROLE_CCBC_USER))
                {
                    username = "azmxx1";
                }
                else if (pRole.equals (ROLE_CCBC_SGB))
                {
                    username = "azhxx1";
                }
                else if (pRole.equals (ROLE_CCBC_TAPE))
                {
                    username = "azwxx1";
                }
                break;
        }

        logOn (username, password);
    }

    /**
     * Private function which does the actual logging into the application. Is passed a username
     * and password
     *
     * @param userName The username to log in with
     * @param password The password to log in with
     */
    private void logOn (final String userName, final String password)
    {
        // Open the session
        session.open (HOMEPAGE);

        // Login to CaseMan
        getLoginGUIAdaptor ("LoginComponent").login (userName, password);

        int attempts = 0;
        String pageTitle = session.getPageTitle ();
        while ( !pageTitle.equals (WARNING_SCREEN_TITLE))
        {
            // Loop until are in the Warning screen (has 3 attempts before will continue to
            // assert test and thus failure)
            session.waitForPageToLoad ();
            pageTitle = session.getPageTitle ();
            attempts++;
            if (attempts > 3)
            {
                break;
            }
        }

        // Check are in the Warning screen
        assertTrue ("HTML does not contain token '" + WARNING_SCREEN_TITLE + "'",
                session.getPageTitle ().indexOf (WARNING_SCREEN_TITLE) != -1);

        // Click 'continue'
        session.click (WARNING_SCREEN_CONTINUE);
        session.waitForPageToLoad ();

        // Assert main menu is displayed
        assertTrue ("HTML does not contain token '" + MAIN_MENU_TITLE + "'",
                session.getPageTitle ().indexOf (MAIN_MENU_TITLE) != -1);
    }

    /**
     * Stops queue processing.
     */
    public void startTransaction ()
    {
        session.getTopForm ().startTransaction ();
    }

    /**
     * restarts queue processing.
     */
    public void endTransaction ()
    {
        session.getTopForm ().endTransaction ();
    }

    /**
     * Clicks a specified button.
     *
     * @param buttonName String identifier for the button to be clicked
     */
    public void clickButton (final String buttonName)
    {
        session.click (buttonName);
    }

    /**
     * The tests need to wait for services to finish or page elements to load. This provides the
     * appropriate wait.
     */
    public void waitForPageToLoad ()
    {
        session.waitForPageToLoad ();
    }

    /**
     * Exposes tab key functionality.
     */
    public void tab ()
    {
        session.tabKey ();
    }

    /**
     * Exposes the return key functionality.
     */
    public void returnKey ()
    {
        session.returnKey ();
    }

    /**
     * Type text into the input element with id. Wraps Selenium.type().
     *
     * @param id The id of the element.
     * @param input The input to be added.
     */
    public void type (final String id, final String input)
    {
        session.type (id, input);
    }

    /**
     * Exposes the drop down navigation menu functionality (About CaseMan, logout, exit).
     *
     * @param navLocation Path to navigate the menu
     */
    public void navigateMenu (final String[] navLocation)
    {
        session.navigationMenuNavigate (navLocation);
    }

    /**
     * Opens pages via a url.
     *
     * @param RelativePageURL The url to open
     */
    public void openPage (final String RelativePageURL)
    {
        session.open (RelativePageURL);
    }

    /**
     * Selects an option from the navigation quicklinks menu.
     *
     * @param itemLabel The label of the quicklinks item as it appears to the user (not id)
     */
    public void quickLinkNavigate (final String itemLabel)
    {
        session.quickLinkNavigate (itemLabel);
    }

    /**
     * Gets the top form.
     *
     * @return the top form
     */
    public FormAdaptor getTopForm ()
    {
        return session.getTopForm ();
    }

    /**
     * Equivalent to clicking Ok on a JavaScript confirm popup.
     */
    public void getConfirmation ()
    {
        session.getConfirmation ();
    }

    /**
     * Selects Ok the next time a JavaScript confirm popup appears.
     */
    public void chooseOkOnNextConfirmation ()
    {
        session.chooseOkOnNextConfirmation ();
    }

    /**
     * Selects Cancel the next time a JaavScript confirm popup appears.
     */
    public void chooseCancelOnNextConfirmation ()
    {
        session.chooseCancelOnNextConfirmation ();
    }

    /**
     * Equivalent to clicking Ok on a JavaScript alert popup.
     */
    public void getAlert ()
    {
        session.getAlert ();
    }

    /**
     * Gets the alert string.
     *
     * @return the alert string
     */
    public String getAlertString ()
    {
        return session.getAlert ();
    }

    /**
     * Checks if is alert present.
     *
     * @return true, if is alert present
     */
    public boolean isAlertPresent ()
    {
        return session.isAlertPresent ();
    }

    /**
     * Checks if is confirmation present.
     *
     * @return true, if is confirmation present
     */
    public boolean isConfirmationPresent ()
    {
        return session.isConfirmationPresent ();
    }

    /**
     * Accesses the pressKey method on the session to replicate a keyboard key press.
     *
     * @param keycode String representing the key to be pressed, typically \ followed by the ascii code
     */
    public void pressKey (final String keycode)
    {
        session.pressKey (keycode);
    }

    /**
     * Sets the focus.
     *
     * @param fieldId the new focus
     */
    public void setFocus (final String fieldId)
    {
        session.setFocusInField (fieldId);
    }

    /**
     * Retrieve a LoginGUIAdaptor adaptor object.
     *
     * @param loginGUIAdaptorName String identifier of the login adaptor
     * @return LoginGUIAdaptor The LoginGUIAdaptor object specified
     */
    public LoginGUIAdaptor getLoginGUIAdaptor (final String loginGUIAdaptorName)
    {
        return (LoginGUIAdaptor) getAdaptor (loginGUIAdaptorName);
    }

    /**
     * Retrieve a ButtonAdaptor adaptor object.
     *
     * @param buttonAdaptorName String identifier of the button adaptor
     * @return ButtonAdaptor The ButtonAdaptor object specified
     */
    public ButtonAdaptor getButtonAdaptor (final String buttonAdaptorName)
    {
        return (ButtonAdaptor) getAdaptor (buttonAdaptorName);
    }

    /**
     * Retrieve a GridAdaptor adaptor object.
     *
     * @param gridAdaptorName String identifier of the grid adaptor
     * @return GridAdaptor The GridAdaptor object specified
     */
    public GridAdaptor getGridAdaptor (final String gridAdaptorName)
    {
        return (GridAdaptor) getAdaptor (gridAdaptorName);
    }

    /**
     * Retrieve a TextInputAdaptor adaptor object.
     *
     * @param textInputAdaptorName String identifier of the text field adaptor
     * @return TextInputAdaptor The TextInputAdaptor object specified
     */
    public TextInputAdaptor getTextInputAdaptor (final String textInputAdaptorName)
    {
        return (TextInputAdaptor) getAdaptor (textInputAdaptorName);
    }

    /**
     * Retrieve a ZoomFieldAdaptor adaptor object.
     *
     * @param zoomFieldAdaptorName String identifier of the zoom field adaptor
     * @return ZoomFieldAdaptor The ZoomFieldAdaptor object specified
     */
    public ZoomFieldAdaptor getZoomFieldAdaptor (final String zoomFieldAdaptorName)
    {
        return (ZoomFieldAdaptor) getAdaptor (zoomFieldAdaptorName);
    }

    /**
     * Retrieve a FilteredGridAdaptor adaptor object.
     *
     * @param filteredGridAdaptorName String identifier of the filtered grid adaptor
     * @return FilteredGridAdaptor The FilteredGridAdaptor object specified
     */
    public FilteredGridAdaptor getFilteredGridInputAdaptor (final String filteredGridAdaptorName)
    {
        return (FilteredGridAdaptor) getAdaptor (filteredGridAdaptorName);
    }

    /**
     * Retrieve a SubFormAdaptor adaptor object.
     *
     * @param subFormAdaptorName String identifier of the subform adaptor
     * @return SubFormAdaptor The SubFormAdaptor object specified
     */
    public SubFormAdaptor getSubFormAdaptor (final String subFormAdaptorName)
    {
        return (SubFormAdaptor) getAdaptor (subFormAdaptorName);
    }

    /**
     * Retrieve a PopupAdaptor adaptor object.
     *
     * @param popupAdaptorName String identifier of the popup adaptor
     * @return PopupAdaptor The PopupAdaptor object specified
     */
    public PopupAdaptor getPopupAdaptor (final String popupAdaptorName)
    {
        return (PopupAdaptor) getAdaptor (popupAdaptorName);
    }

    /**
     * Retrieve a AutoCompleteAdaptor adaptor object.
     *
     * @param autoCompleteAdaptorName String identifier of the autocomplete field adaptor
     * @return AutoCompleteAdaptor The AutoCompleteAdaptor object specified
     */
    public AutoCompleteAdaptor getAutoCompleteAdaptor (final String autoCompleteAdaptorName)
    {
        return (AutoCompleteAdaptor) getAdaptor (autoCompleteAdaptorName);
    }

    /**
     * Retrieve a DatePickerAdaptor adaptor object.
     *
     * @param datePickerAdaptorName String identifier of the date picker field adaptor
     * @return DatePickerAdaptor The DatePickerAdaptor object specified
     */
    public DatePickerAdaptor getDatePickerAdaptor (final String datePickerAdaptorName)
    {
        return (DatePickerAdaptor) getAdaptor (datePickerAdaptorName);
    }

    /**
     * Retrieve a SelectElementAdaptor adaptor object.
     *
     * @param selectElementAdaptorName String identifier of the select field adaptor
     * @return SelectElementAdaptor The SelectElementAdaptor object specified
     */
    public SelectElementAdaptor getSelectElementAdaptor (final String selectElementAdaptorName)
    {
        return (SelectElementAdaptor) getAdaptor (selectElementAdaptorName);
    }

    /**
     * Retrieve a FrameworkDialogAdaptor adaptor object.
     *
     * @param frameworkDialogAdaptorName String identifier of the framework dialog popup adaptor
     * @return FrameworkDialogAdaptor The FrameworkDialogAdaptor object specified
     */
    public FrameworkDialogAdaptor getFrameworkDialogAdaptor (final String frameworkDialogAdaptorName)
    {
        return (FrameworkDialogAdaptor) getAdaptor (frameworkDialogAdaptorName);
    }

    /**
     * Retrieve a CheckboxInputAdaptor adaptor object.
     *
     * @param checkboxInputAdaptorName String identifier of the checkbox field adaptor
     * @return CheckboxInputAdaptor The CheckboxInputAdaptor object specified
     */
    public CheckboxInputAdaptor getCheckBoxInputAdaptor (final String checkboxInputAdaptorName)
    {
        return (CheckboxInputAdaptor) getAdaptor (checkboxInputAdaptorName);
    }

    /**
     * Retrieve a PanelSelectorAdaptor adaptor object.
     *
     * @param panelSelectorAdaptorName String identifier of the panel selector adaptor
     * @return PanelSelectorAdaptor The PanelSelectorAdaptor object specified
     */
    public PanelSelectorAdaptor getPanelSelectorAdaptor (final String panelSelectorAdaptorName)
    {
        return (PanelSelectorAdaptor) getAdaptor (panelSelectorAdaptorName);
    }

    /**
     * Retrieve a TabbedAreaAdaptor adaptor object.
     *
     * @param tabbedAreaAdaptorName String identifier of the tabbed area adaptor
     * @return TabbedAreaAdaptor The TabbedAreaAdaptor object specified
     */
    public TabbedAreaAdaptor getTabbedAreaAdaptor (final String tabbedAreaAdaptorName)
    {
        return (TabbedAreaAdaptor) getAdaptor (tabbedAreaAdaptorName);
    }

    /**
     * Retrieve a generic adaptor by specific name.
     *
     * @param adaptorName String identifier of the adaptor
     * @return The adaptor object specified
     */
    private Object getAdaptor (final String adaptorName)
    {
        Object theAdaptor = null;
        try
        {
            theAdaptor = session.getTopForm ().getAdaptor (adaptorName);
        }
        catch (final FrameworkException e)
        {
            e.getMessage ();
        }
        return theAdaptor;
    }

    /**
     * Getter which wraps SupsTestBase.getRequiredProperty(String), to provide
     * read-only access to the config file.
     *
     * @param name The name of the property.
     * @return The property value as a String.
     * @throws ConfigException If there is an exception.
     */
    public String getRequiredProperty (final String name) throws ConfigException
    {
        return super.getRequiredProperty (name);
    }

    /**
     * Gets the db connection.
     *
     * @return the db connection
     * @throws Exception the exception
     */
    private Connection getDbConnection () throws Exception
    {
        Class.forName (getRequiredProperty ("db.driver").trim ());
        return DriverManager.getConnection (dbURL, dbUser, dbPass);
    }
}
