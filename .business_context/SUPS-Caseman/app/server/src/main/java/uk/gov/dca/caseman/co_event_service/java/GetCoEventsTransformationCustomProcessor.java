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
package uk.gov.dca.caseman.co_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.text.ParseException;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.EventHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Service: CoEvent
 * Method: getCoEvents
 * Class: GetCoEventsTransformationCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 29-Apr-2006
 * 
 *         Description:
 *         This class implements a step in the pipeline for the getCoEvents method.
 *         Tasks
 *         1. Associated event descriptions substituted with those in existence at time when
 *         each event was created (CHANGED_EVENTS table)
 * 
 *         Change History:
 *         v1.0 29/04/2006 Chris Hutt
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class GetCoEventsTransformationCustomProcessor implements ICustomProcessor
{
    
    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public GetCoEventsTransformationCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        Element coEventsElement = null;
        String coNumber = null;
        Element changedEventListElement = null;
        final EventHelper eventHelper = new EventHelper ();

        try
        {

            final Element coElement = (Element) XPath.selectSingleNode (params, "/ManageCOEvents");

            coNumber = coElement.getChildText ("CONumber");

            // Get the event descriptions relavent at time of each event
            changedEventListElement = mGetChangedEventList (coNumber);

            coEventsElement = coElement.getChild ("COEvents");

            // Loop through each Co event
            final List<Element> coEventList = coEventsElement.getChildren ("COEvent");
            Element coEventElement = null;

            final Iterator<Element> it = coEventList.iterator ();

            while (it.hasNext ())
            {
                // Now we have the Co Event.
                coEventElement = (Element) it.next ();

                // Substitute the event description
                eventHelper.SubstituteChangedEventDescription (coEventElement, changedEventListElement);
            }

            // Output the resulting XML.
            final Element paramsElement = params.getRootElement ();
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            final String sXml = xmlOutputter.outputString (paramsElement);
            writer.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final ParseException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * method: mGetChangedEventList
     * 
     * Retrieves list of CHANGED_EVENTS rows associated with events on the CO where the
     * EVENT_DATE falls within the effective period for CHANGED_EVENTS row.
     *
     * @param pCoNumber The co number.
     * @return The changed events element.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetChangedEventList (final String pCoNumber) throws BusinessException, SystemException
    {
        Element changedEventListElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();

            XMLBuilder.addParam (paramsElement, "coNumber", pCoNumber);

            // Translate to String
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service
            changedEventListElement = localServiceProxy
                    .getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.GET_CHANGED_CO_EVENT_LIST_METHOD, sXmlParams)
                    .getRootElement ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return changedEventListElement;
    } // mGetChangedEventList(

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
}