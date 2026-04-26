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
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * Service: CoEvent
 * Method: insertCoEventsAuto
 * Class: InsertAutoCoEventsCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 16 Aug 2005
 * 
 *         Description:
 *         This CustomProcessor class provides a facility for the creation of 'AUTO'
 *         CO_EVENTS. A pipeline process document will be perused for a //COEvents node.
 *         Any child nodes will be submitted to the appropriate insert CO_EVENT service.
 *         The CoEventUpdateHelper class will then be used to perform any updates
 *         associated with the standard event.
 * 
 *         Change History :-
 *         03/10/2005 Phil Haferer: Added a condition so that if the COEvents doesn't exist the code will not fall over.
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 *         08-Jun-2006 Phil Haferer (EDS): In response to changes to CoEventUpdateHelper for TD 3527: "Deleting CO debts
 *         does not recalculate CO fee", changed the class definition to extend AbstractCustomProcessor, so that
 *         the context could passed CoEventUpdateHelper.
 */
public class InsertAutoCoEventsCustomProcessor extends AbstractCustomProcessor
{
    
    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public InsertAutoCoEventsCustomProcessor ()
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
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        Element parentElement = null;
        try
        {

            parentElement = (Element) XPath.selectSingleNode (params, "//COEvents");
            if (parentElement != null)
            {
                // Loop through each Co event submitted for creation
                final List<Element> coEventList = parentElement.getChildren ("COEvent");
                Element coEventElement = null;

                final Iterator<Element> it = coEventList.iterator ();
                while (it.hasNext ())
                {

                    // Now we have the CO Event.
                    coEventElement = (Element) it.next ();

                    // Insert a row in CO_EVENTS
                    mInsertCoEventRow (coEventElement);

                    // Perform any updates associated with this event
                    mUpdateCo (coEventElement);

                }
            } // if (parentElement != null)

            /* Output the resulting XML. */
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
    }

    /**
     * (non-Javadoc)
     * Insert a co event into the database.
     *
     * @param pCoEventElement the co event element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mInsertCoEventRow (final Element pCoEventElement) throws SystemException, BusinessException
    {
        XMLOutputter out = null;
        Element paramsElement = null;
        Element insertCoEventRowElement = null;
        Element coEventElement = null;

        coEventElement = (Element) pCoEventElement.clone ();
        coEventElement.detach ();

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coEvent", coEventElement);

        out = new XMLOutputter (Format.getCompactFormat ());

        final String sXmlParams = out.outputString (paramsElement);

        insertCoEventRowElement = localServiceProxy
                .getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.INSERT_CO_EVENT_AUTO, sXmlParams).getRootElement ();

        return insertCoEventRowElement;
    } // mInsertCoEventRow()

    /**
     * update the consolidated order associated with the event (as per the configuration definition).
     *
     * @param pCoEventElement the corresponding co Event
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCo (final Element pCoEventElement) throws BusinessException, SystemException
    {
        CoEventUpdateHelper coEventUpdateHelper = null;

        try
        {
            /* Perform any update operations associated with the Event. */
            coEventUpdateHelper = new CoEventUpdateHelper ();
            coEventUpdateHelper.PostInsertProcessing (pCoEventElement, this.m_context);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

    }

}