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
package uk.gov.dca.caseman.payments_service.java.util.events;

import java.util.Iterator;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * The Class CoEvent.
 *
 * @author Steve Blair
 */
public class CoEvent extends AbstractEvent
{

    /** The Constant EJB_PAYMENTS_SERVICES. */
    private static final String EJB_PAYMENTS_SERVICES = "ejb/PaymentsServiceLocal";

    /** The existing event. */
    private Element existingEvent;

    /**
     * Instantiates a new co event.
     *
     * @param services the services
     */
    CoEvent (final ServiceAdaptor services)
    {
        super ("ejb/CoEventServiceLocal", "insertCoEventAutoExtLocal2", services);
    }

    /**
     * {@inheritDoc}
     */
    void initParams ()
    {
        params.put ("CONumber", null);
        params.put ("StandardEventDescription", "StandardEventDescription");
        params.put ("EventDetails", null);
        params.put ("EventDate", null);
        params.put ("UserName", null);
        params.put ("ReceiptDate", null);
        params.put ("IssueStage", null);
        params.put ("Service", null);
        params.put ("BailiffId", null);
        params.put ("ServiceDate", null);
        params.put ("ErrorInd", "N");
        params.put ("OwningCourtCode", null);
        params.put ("DebtSeqNumber", null);
        params.put ("COEventSeq", null);
        params.put ("BMSTask", null);
        params.put ("StatsModule", null);
        params.put ("AgeCategory", null);
        params.put ("WarrantId", null);
        params.put ("ProcessDate", null);
        params.put ("CreatingCourt", null);
        params.put ("CreatingSection", null);
        params.put ("ProcessStage", null);
        params.put ("HrgSeq", null);
    }

    /**
     * {@inheritDoc}
     */
    void setupParams ()
    {
        final Element coEvent = new Element ("COEvent");
        for (Iterator<String> it = params.keySet ().iterator (); it.hasNext ();)
        {
            final String key = (String) it.next ();
            coEvent.addContent (new Element (key).setText ((String) params.get (key)));
        }

        coEvent.addContent (new Element ("StandardEventId").setText (Integer.toString (eventId)));

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coEvent", coEvent);
    }

    /**
     * {@inheritDoc}
     */
    public void createEvent () throws SystemException, BusinessException
    {
        super.createEvent ();
        existingEvent = null;
    }

    /**
     * {@inheritDoc}
     */
    public boolean exists () throws SystemException, BusinessException, JDOMException
    {
        if (existingEvent != null)
        {
            return existingEvent.getChild ("COEvent") != null;
        }

        final String coNumber = (String) params.get ("CONumber");
        if (coNumber == null || coNumber.trim ().length () == 0)
        {
            throw new IllegalStateException ("Call to exists with no CONumber parameter set.");
        }

        final String debtSeq = (String) params.get ("DebtSeqNumber");

        final Element coEventParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coEventParams, "coNumber", coNumber);
        XMLBuilder.addParam (coEventParams, "debtSeq", debtSeq);
        XMLBuilder.addParam (coEventParams, "coEventId", Integer.toString (eventId));

        final Document event =
                services.callService (EJB_PAYMENTS_SERVICES, "getPassthroughCoEventLocal2", coEventParams);
        existingEvent = event.getRootElement ();

        return existingEvent.getChild ("COEvent") == null ? false : true;
    }

    /**
     * {@inheritDoc}
     */
    public void saveErrorStatus (final boolean isErrored) throws SystemException, BusinessException, JDOMException
    {
        if ( !exists ())
        {
            throw new IllegalStateException ("No Event " + eventId + " exists for CONumber \"" +
                    params.get ("CONumber") + "\", DebtSeqNumber \"" + params.get ("DebtSeqNumber") + "\".");
        }

        final Element coEvent = existingEvent.getChild ("COEvent");

        if (coEvent.getChildText ("ErrorInd").equals ("Y") && isErrored)
        {
            return;
        }

        if ( !coEvent.getChildText ("ErrorInd").equals ("Y") && !isErrored)
        {
            return;
        }

        if (isErrored)
        {
            coEvent.getChild ("ErrorInd").setText ("Y");
        }
        else
        {
            coEvent.getChild ("ErrorInd").setText ("N");
        }

        final Element coEventParams = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (coEventParams, "eventSeq", coEvent.getChildText ("COEventSeq"));
        XMLBuilder.addParam (coEventParams, "errorInd", coEvent.getChildText ("ErrorInd"));

        final Document results =
                services.callService (EJB_PAYMENTS_SERVICES, "updatePassthroughCoEventLocal2", coEventParams);
        existingEvent = results.getRootElement ();
    }

}