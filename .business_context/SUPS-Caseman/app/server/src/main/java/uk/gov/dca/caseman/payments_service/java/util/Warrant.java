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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class Warrant.
 *
 * @author Steve Blair
 */
public class Warrant extends Enforcement
{

    /** The Constant EJB_WARRANT_RETURNS_SERVICE. */
    private static final String EJB_WARRANT_RETURNS_SERVICE = "ejb/WarrantReturnsServiceLocal";

    /** The Constant FULLY_PAID_RETURN_CODE. */
    private static final String FULLY_PAID_RETURN_CODE = "101";

    /** The warrant returns. */
    private List<WarrantReturn> warrantReturns;

    /**
     * Instantiates a new warrant.
     *
     * @param warrant the warrant
     * @param services the services
     */
    Warrant (final Element warrant, final ServiceAdaptor services)
    {
        super (warrant, services);
    }

    /**
     * Gets the fully paid warrant returns.
     *
     * @return the fully paid warrant returns
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private List<WarrantReturn> getFullyPaidWarrantReturns () throws SystemException, BusinessException
    {
        final Element warrantReturnParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (warrantReturnParams, "warrantID", getWarrantId ());

        final Element results =
                services.callService (EJB_WARRANT_RETURNS_SERVICE, "getWarrantReturnsLocal2", warrantReturnParams)
                        .getRootElement ();

        final List<WarrantReturn> warrantReturns = new ArrayList<>();
        final List<Element> warrantReturnNodes =
                results.getChild ("WarrantReturns").getChild ("WarrantEvents").getChildren ("WarrantEvent");
        for (Iterator<Element> it = warrantReturnNodes.iterator (); it.hasNext ();)
        {
            final WarrantReturn warrantReturn = new WarrantReturn ((Element) it.next (), services);
            final boolean isFullyPaidReturn = warrantReturn.getCode ().equals (FULLY_PAID_RETURN_CODE);
            if (isFullyPaidReturn && !warrantReturn.isError ())
            {
                warrantReturns.add (warrantReturn);
            }
        }
        return warrantReturns;
    }

    /**
     * If warrant is paid then creates a warrant return for each defendant on
     * the warrant.
     *
     * @param warrantReturn warrant return to create
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void createFullyPaidWarrantReturns (final WarrantReturn warrantReturn)
        throws SystemException, BusinessException
    {
        if (warrantReturn == null)
        {
            throw new NullPointerException ();
        }

        if (getOutstandingBalance () <= 0)
        {
            for (int i = 0; i < getNumberDefendants (); ++i)
            {
                warrantReturn.setDefendantNumber (i + 1);
                warrantReturn.save ();
            }
        }
    }

    /**
     * Sets the error flag of any 'Fully Paid' warrant returns attached to this
     * warrant to true.
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public void errorFullyPaidWarrantReturns () throws SystemException, BusinessException
    {
        warrantReturns = getFullyPaidWarrantReturns ();
        errorOffPaidWarrantReturns ();
        updateWarrantReturns ();
    }

    /**
     * Iterates through a List of warrant returns and sets the error fields to
     * true.
     */
    private void errorOffPaidWarrantReturns ()
    {
        for (Iterator<WarrantReturn> it = warrantReturns.iterator (); it.hasNext ();)
        {
            final WarrantReturn warrantReturn = (WarrantReturn) it.next ();
            warrantReturn.setError (true);
        }
    }

    /**
     * Commits warrant returns to the database.
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void updateWarrantReturns () throws BusinessException, SystemException
    {
        Element returnsDom = null;
        Element returnNode = null;
        for (Iterator<WarrantReturn> it = warrantReturns.iterator (); it.hasNext ();)
        {
            final WarrantReturn warrantReturn = (WarrantReturn) it.next ();
            if (returnsDom == null)
            {
                returnsDom = warrantReturn.toParamsElement ();
            }
            else
            {
                if (returnNode == null)
                {
                    returnNode = returnsDom.getChild ("WarrantReturns").getChild ("WarrantEvents");
                }
                returnNode.addContent (warrantReturn.toElement ());
            }
        }

        if (returnsDom == null)
        {
            return;
        }

        final Element warrantReturnParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (warrantReturnParams, "NewReturn", returnsDom);

        services.callService (EJB_WARRANT_RETURNS_SERVICE, "updateWarrantReturnsLocal2", warrantReturnParams);
    }

    /**
     * Retrieves a Warrant from the database.
     *
     * @param warrantId ID of the warrant to retrieve
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return Warrant object representing warrant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static Warrant getInstance (final String warrantId, final ServiceAdaptor services)
        throws SystemException, BusinessException
    {
        final Element warrantSummary = getWarrantSummary (warrantId, services);
        if (warrantSummary == null)
        {
            return new NullWarrant ();
        }
        return getWarrant (warrantSummary, services);
    }

    /**
     * Gets a summary of a warrant.
     *
     * @param warrantId warrant ID of the warrant
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return summary of a warrant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element getWarrantSummary (final String warrantId, final ServiceAdaptor services)
        throws SystemException, BusinessException
    {
        final Element coWarrantParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coWarrantParams, "warrantID", warrantId);

        return services.callService ("ejb/WarrantServiceLocal", "getWarrantSummaryLocal2", coWarrantParams)
                .getRootElement ().getChild ("Warrant");
    }

    /**
     * Gets a warrant and returns details in a DOM matching map_enforcement.xml.
     *
     * @param warrantSummary warrant summary DOM matching
     *            map_get_warrant_summary.xml structure
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return warrant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Warrant getWarrant (final Element warrantSummary, final ServiceAdaptor services)
        throws SystemException, BusinessException
    {
        final Element enforcementParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (enforcementParams, "issuingCourt", warrantSummary.getChildText ("IssuedBy"));
        XMLBuilder.addParam (enforcementParams, "owningCourt", warrantSummary.getChildText ("OwnedBy"));

        final String localWarrantNumber = warrantSummary.getChildTextTrim ("LocalNumber");
        if (localWarrantNumber.length () > 0)
        {
            XMLBuilder.addParam (enforcementParams, "enforcementNumber", localWarrantNumber);
            XMLBuilder.addParam (enforcementParams, "enforcementType", "FOREIGN WARRANT");
        }
        else
        {
            XMLBuilder.addParam (enforcementParams, "enforcementNumber", warrantSummary.getChildText ("WarrantNumber"));
            XMLBuilder.addParam (enforcementParams, "enforcementType", "HOME WARRANT");
        }

        final Element result = services.callService (EJB_PAYMENTS_SERVICE, GET_ENFORCEMENT_SERVICE, enforcementParams)
                .getRootElement ();
        return new Warrant (result, services);
    }

}