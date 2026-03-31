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

import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class Enforcement.
 *
 * @author Steve Blair
 * 
 *         Change History
 *         27/06/2007 - Chris Vincent: Added courtId param to getInstance() method for service call
 *         CaseMan Defect 6334.
 */
public class Enforcement
{

    /** The Constant GET_ENFORCEMENT_SERVICE. */
    static final String GET_ENFORCEMENT_SERVICE = "getEnforcementLocal2";
    
    /** The Constant EJB_PAYMENTS_SERVICE. */
    static final String EJB_PAYMENTS_SERVICE = "ejb/PaymentsServiceLocal";

    /** The enforcement. */
    Element enforcement;
    
    /** The services. */
    ServiceAdaptor services;

    /**
     * Instantiates a new enforcement.
     *
     * @param enforcement the enforcement
     * @param services the services
     */
    Enforcement (final Element enforcement, final ServiceAdaptor services)
    {
        this.enforcement = enforcement;
        this.services = services;
    }

    /**
     * Creates a new Enforcement object.
     *
     * @param payment a payment for the enforcement required
     * @param services ServiceAdaptor wrapping the CustomProcessor context
     * @return Enforcement object corresponding to the requested enforcement
     *         or a NullEnforcement if enforcement doesn't exist
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public static Enforcement getInstance (final Payment payment, final ServiceAdaptor services)
        throws BusinessException, SystemException
    {
        final String court = payment.getEnforcementCourt ();

        final Element enforcementParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (enforcementParams, "issuingCourt", court);
        XMLBuilder.addParam (enforcementParams, "owningCourt", court);
        XMLBuilder.addParam (enforcementParams, "enforcementNumber", payment.getEnforcementNumber ());
        XMLBuilder.addParam (enforcementParams, "enforcementType", payment.getEnforcementType ());
        XMLBuilder.addParam (enforcementParams, "courtId", payment.getServiceCourtId ());

        final Document result = services.callService (EJB_PAYMENTS_SERVICE, GET_ENFORCEMENT_SERVICE, enforcementParams);

        if (result == null)
        {
            return new NullEnforcement ();
        }

        final Element resultEl = result.getRootElement ();

        if (payment.isWarrantPayment ())
        {
            return new Warrant (resultEl, services);
        }

        return new Enforcement (resultEl, services);
    }

    /**
     * Gets the outstanding balance.
     *
     * @return the outstanding balance
     */
    public double getOutstandingBalance ()
    {
        final String balance = enforcement.getChildTextTrim ("OutstandingBalance");
        return balance.length () > 0 ? Double.parseDouble (balance) : 0;
    }

    /**
     * Gets the warrant id.
     *
     * @return the warrant id
     */
    public String getWarrantId ()
    {
        return enforcement.getChildTextTrim ("WarrantID");
    }

    /**
     * Gets the number events.
     *
     * @return the number events
     */
    public int getNumberEvents ()
    {
        final String numberEvents = enforcement.getChildTextTrim ("NumberEvents");
        return numberEvents.length () > 0 ? Integer.parseInt (numberEvents) : 0;
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return enforcement.getChildTextTrim ("CaseNumber");
    }

    /**
     * Gets the warrant type.
     *
     * @return the warrant type
     */
    public String getWarrantType ()
    {
        return enforcement.getChildTextTrim ("WarrantType");
    }

    /**
     * Gets the number defendants.
     *
     * @return the number defendants
     */
    public int getNumberDefendants ()
    {
        final List<Element> parties = enforcement.getChild ("Parties").getChildren ("Party");
        int i = 0;
        for (Iterator<Element> it = parties.iterator (); it.hasNext ();)
        {
            final Element party = (Element) it.next ();
            if (party.getChildTextTrim ("Role").equals ("PARTY AGAINST"))
            {
                ++i;
            }
        }
        return i;
    }

    /**
     * Gets the warrant executing court.
     *
     * @return the warrant executing court
     */
    public String getWarrantExecutingCourt ()
    {
        return enforcement.getChildTextTrim ("WarrantExecutingCourt");
    }

    /**
     * Gets the warrant issuing court.
     *
     * @return the warrant issuing court
     */
    public String getWarrantIssuingCourt ()
    {
        return enforcement.getChildTextTrim ("WarrantIssuingCourt");
    }

    /**
     * Gets the co type.
     *
     * @return the co type
     */
    public String getCoType ()
    {
        return enforcement.getChildTextTrim ("COType");
    }

    /**
     * Gets the enforcement type.
     *
     * @return the enforcement type
     */
    public String getEnforcementType ()
    {
        return enforcement.getChildTextTrim ("Type");
    }

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ()
    {
        return enforcement.getChildTextTrim ("CourtCode");
    }

    /**
     * Gets the enforcement number.
     *
     * @return the enforcement number
     */
    public String getEnforcementNumber ()
    {
        return enforcement.getChildTextTrim ("Number");
    }

}