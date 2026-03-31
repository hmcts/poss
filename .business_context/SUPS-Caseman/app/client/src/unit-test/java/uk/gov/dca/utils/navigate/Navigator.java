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
package uk.gov.dca.utils.navigate;

import uk.gov.dca.utils.common.AbstractBaseUtils;
import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.common.ITestProperties;
import uk.gov.dca.utils.selenium.adaptors.GridAdaptor;

/**
 * Created by Chris Vincent 09-Jun-2009
 * Class implents a number of the CaseMan navigation functions.
 */
public class Navigator extends AbstractBaseUtils implements ITestProperties, NavigationProperties
{
    
    /** The c MB. */
    // Private member variables
    private AbstractCmTestBase cMB;
    
    /** The main menu. */
    private GridAdaptor mainMenu = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public Navigator (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        cMB = theCMTestBase;
    }

    /**
     * Initialise the main menu on the menu page.
     */
    private void initMainMenu ()
    {
        mainMenu = null == mainMenu ? cMB.getGridAdaptor ("Detail_FormsGrid") : mainMenu;
    }

    /**
     * method to handle navigation from Main Menu.
     *
     * @param page The index of the page to navigate to
     */
    public void navigateFromMainMenu (final int page)
    {
        initMainMenu ();
        mainMenu.doubleClickRow (page);
        cMB.waitForPageToLoad ();
    }

    /**
     * method to handle navigation from Main Menu.
     *
     * @param menuPath An array of page indexes in the main menu
     */
    public void navigateFromMainMenu (final int[] menuPath)
    {
        initMainMenu ();
        for (int i = 0, l = menuPath.length; i < l; i++)
        {
            mainMenu.doubleClickRow (menuPath[i]);
            cMB.waitForPageToLoad ();
        }
    }

    /**
     * method to handle inter screen navigation via the nav bar buttons.
     *
     * @param menuButton String identifier of the button to be clicked
     */
    public void clickNavigationMenu (final String menuButton)
    {
        cMB.getButtonAdaptor (menuButton).click ();
        cMB.waitForPageToLoad ();
    }

    /**
     * Method to handle selecting options via the drop down menu
     * including Show Keys, Logout and Exit.
     *
     * @param navLocation Array representing the path to follow in the menu
     */
    public void clickDropDownNavigationMenu (final String[] navLocation)
    {
        cMB.navigateMenu (navLocation);
        cMB.waitForPageToLoad ();
    }

    /**
     * Selects a particular audit panel from the Aduit button dropdown.
     *
     * @param auditButton String identifier of the audit button in the navigation bar
     * @param rowNumber Index of the audit panel to select
     */
    public void selectFromAuditButton (final String auditButton, final int rowNumber)
    {
        cMB.clickButton (auditButton);
        cMB.getPanelSelectorAdaptor (AUDIT_PANEL).clickRow (rowNumber);
        cMB.waitForPageToLoad ();
    }

    /**
     * Selects an option from the navigation quicklinks menu.
     *
     * @param itemLabel The label of the quicklinks item as it appears to the user (not id)
     */
    public void selectQuicklinksMenuItem (final String itemLabel)
    {
        cMB.quickLinkNavigate (itemLabel);
        if (cMB.isConfirmationPresent ())
        {
            cMB.getConfirmation ();
        }
        cMB.waitForPageToLoad ();
    }

    /**
     * Replicates a keyboard key press.
     *
     * @param keycode String representing the key to be pressed, typically \ followed by the ascii code
     */
    public void pressKey (final String keycode)
    {
        cMB.pressKey (keycode);
        cMB.waitForPageToLoad ();
    }

}
