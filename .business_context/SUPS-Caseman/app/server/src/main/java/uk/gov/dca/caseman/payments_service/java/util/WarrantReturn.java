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
package uk.gov.dca.caseman.payments_service.java.util;

import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class WarrantReturn.
 *
 * @author Steve Blair
 */
public class WarrantReturn
{

    /** The Constant ERROR_NODE. */
    private static final String ERROR_NODE = "Error";
    
    /** The Constant BASE_NODE. */
    private static final String BASE_NODE = "ds";
    
    /** The Constant EVENT_NODE. */
    private static final String EVENT_NODE = "WarrantEvent";

    /** The Constant TRUE_INDICATOR. */
    private static final String TRUE_INDICATOR = "Y";
    
    /** The Constant FALSE_INDICATOR. */
    private static final String FALSE_INDICATOR = "N";

    /** The dom. */
    private Element dom;
    
    /** The warrant return. */
    private Element warrantReturn;
    
    /** The services. */
    private ServiceAdaptor services;

    /**
     * Instantiates a new warrant return.
     *
     * @param warrantReturnDom the warrant return dom
     * @param services the services
     */
    public WarrantReturn (final Element warrantReturnDom, final ServiceAdaptor services)
    {
        if (services == null)
        {
            throw new NullPointerException ();
        }

        this.services = services;
        if (warrantReturnDom.getName ().equals (BASE_NODE))
        {
            dom = warrantReturnDom;
            try
            {
                warrantReturn = dom.getChild ("WarrantReturns").getChild ("WarrantEvents").getChild (EVENT_NODE);
                if (warrantReturn == null)
                {
                    throw new NullPointerException ();
                }
            }
            catch (final NullPointerException e)
            {
                throw new IllegalArgumentException (
                        "Corrupt warrantReturnDom passed to WarrantReturn " + "constructor.");
            }
        }
        else if (warrantReturnDom.getName ().equals (EVENT_NODE))
        {
            warrantReturn = warrantReturnDom;
        }
        else
        {
            throw new IllegalArgumentException ("Corrupt warrantReturnDom passed to WarrantReturn " + "constructor.");
        }
    }

    /**
     * Saves the warrant return to the database.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void save () throws SystemException, BusinessException
    {
        final Element warrantReturnParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (warrantReturnParams, "NewReturn", toParamsElement ());

        services.callService ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal2", warrantReturnParams);
    }

    /**
     * To element.
     *
     * @return the element
     */
    public Element toElement ()
    {
        return (Element) warrantReturn.clone ();
    }

    /**
     * To params element.
     *
     * @return the element
     */
    public Element toParamsElement ()
    {
        if (dom != null)
        {
            return (Element) dom.clone ();
        }

        final Element warrantEvents = new Element ("WarrantEvents").addContent (toElement ());
        final Element warrantReturns = new Element ("WarrantReturns").addContent (warrantEvents);
        return new Element (BASE_NODE).addContent (warrantReturns);
    }

    /**
     * Sets the defendant number.
     *
     * @param defendantNumber the new defendant number
     */
    public void setDefendantNumber (final int defendantNumber)
    {
        warrantReturn.getChild ("Defendant").setText (Integer.toString (defendantNumber));
    }

    /**
     * Gets the code.
     *
     * @return the code
     */
    public String getCode ()
    {
        return warrantReturn.getChildTextTrim ("Code");
    }

    /**
     * Sets the error.
     *
     * @param isError the new error
     */
    public void setError (final boolean isError)
    {
        if (isError)
        {
            warrantReturn.getChild (ERROR_NODE).setText (TRUE_INDICATOR);
        }
        else
        {
            warrantReturn.getChild (ERROR_NODE).setText (FALSE_INDICATOR);
        }
    }

    /**
     * Checks if is error.
     *
     * @return true, if is error
     */
    public boolean isError ()
    {
        return warrantReturn.getChildText (ERROR_NODE).equals (TRUE_INDICATOR);
    }

}