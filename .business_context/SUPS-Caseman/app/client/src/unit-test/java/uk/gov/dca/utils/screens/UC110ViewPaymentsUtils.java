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
package uk.gov.dca.utils.screens;

import uk.gov.dca.utils.common.AbstractCmTestBase;
import uk.gov.dca.utils.selenium.FrameworkException;
import uk.gov.dca.utils.selenium.adaptors.ButtonAdaptor;
import uk.gov.dca.utils.selenium.adaptors.SubFormAdaptor;
import uk.gov.dca.utils.selenium.adaptors.TextInputAdaptor;

/**
 * Created by Chris Vincent.
 * Screen utility class representing the View Payments screen.
 *
 * Date: 09-Jun-2009
 */
public class UC110ViewPaymentsUtils extends AbstractBaseScreenUtils
{
    
    /** The text payee code. */
    // Text Field identifiers
    private String TEXT_PAYEE_CODE = "PaymentDetails_Payee_Code";
    
    /** The text payee name. */
    private String TEXT_PAYEE_NAME = "PaymentDetails_Payee_Name";
    
    /** The text payee adline1. */
    private String TEXT_PAYEE_ADLINE1 = "PaymentDetails_Payee_Address_Line1";
    
    /** The text payee adline2. */
    private String TEXT_PAYEE_ADLINE2 = "PaymentDetails_Payee_Address_Line2";
    
    /** The text payee adline3. */
    private String TEXT_PAYEE_ADLINE3 = "PaymentDetails_Payee_Address_Line3";
    
    /** The text payee adline4. */
    private String TEXT_PAYEE_ADLINE4 = "PaymentDetails_Payee_Address_Line4";
    
    /** The text payee adline5. */
    private String TEXT_PAYEE_ADLINE5 = "PaymentDetails_Payee_Address_Line5";
    
    /** The text payee postcode. */
    private String TEXT_PAYEE_POSTCODE = "PaymentDetails_Payee_Address_PostCode";

    /** The btn view details. */
    // Button identifiers
    private String BTN_VIEW_DETAILS = "Master_ViewPaymentDetailsButton";
    
    /** The btn close popup. */
    private String BTN_CLOSE_POPUP = "PaymentDetails_CloseButton";
    
    /** The btn close screen. */
    private String BTN_CLOSE_SCREEN = "Status_CloseButton";

    /** The pop view payment. */
    // Private Popup/Subform identifiers
    private String POP_VIEW_PAYMENT = "viewPaymentDetails_subform";

    /** The view payment subform. */
    // Private subform objects
    private SubFormAdaptor viewPaymentSubform = null;

    /**
     * Constructor.
     *
     * @param theCMTestBase The CaseMan Test Base object
     */
    public UC110ViewPaymentsUtils (final AbstractCmTestBase theCMTestBase)
    {
        super (theCMTestBase);
        mScreenTitle = "View Payments";
    }

    /**
     * Clicks the View Details button to load details of the currently selected Payment in a subform.
     */
    public void clickViewDetailsButton ()
    {
        mClickButton (BTN_VIEW_DETAILS);

        if (null == viewPaymentSubform)
        {
            viewPaymentSubform = cMB.getSubFormAdaptor (POP_VIEW_PAYMENT);
        }
    }

    /**
     * Gets the payee code.
     *
     * @return the payee code
     * @throws FrameworkException the framework exception
     */
    public String getPayeeCode () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_CODE);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee name.
     *
     * @return the payee name
     * @throws FrameworkException the framework exception
     */
    public String getPayeeName () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_NAME);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee address line 1.
     *
     * @return the payee address line 1
     * @throws FrameworkException the framework exception
     */
    public String getPayeeAddressLine1 () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_ADLINE1);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee address line 2.
     *
     * @return the payee address line 2
     * @throws FrameworkException the framework exception
     */
    public String getPayeeAddressLine2 () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_ADLINE2);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee address line 3.
     *
     * @return the payee address line 3
     * @throws FrameworkException the framework exception
     */
    public String getPayeeAddressLine3 () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_ADLINE3);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee address line 4.
     *
     * @return the payee address line 4
     * @throws FrameworkException the framework exception
     */
    public String getPayeeAddressLine4 () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_ADLINE4);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee address line 5.
     *
     * @return the payee address line 5
     * @throws FrameworkException the framework exception
     */
    public String getPayeeAddressLine5 () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_ADLINE5);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Gets the payee postcode.
     *
     * @return the payee postcode
     * @throws FrameworkException the framework exception
     */
    public String getPayeePostcode () throws FrameworkException
    {
        String returnValue = null;
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            final TextInputAdaptor tA = (TextInputAdaptor) viewPaymentSubform.getAdaptor (TEXT_PAYEE_POSTCODE);
            returnValue = tA.getValue ();
        }
        return returnValue;
    }

    /**
     * Clicks the Close Button in the View Payments Subform.
     *
     * @throws FrameworkException Exception thrown if unable to access the subform object
     */
    public void clickViewPaymentCloseButton () throws FrameworkException
    {
        if (null != viewPaymentSubform && viewPaymentSubform.isVisible ())
        {
            ((ButtonAdaptor) viewPaymentSubform.getAdaptor (BTN_CLOSE_POPUP)).click ();
        }
    }

    /**
     * Clicks the Close Button in the View Payments screen.
     */
    public void clickCloseButton ()
    {
        mClickButton (BTN_CLOSE_SCREEN);
    }
}