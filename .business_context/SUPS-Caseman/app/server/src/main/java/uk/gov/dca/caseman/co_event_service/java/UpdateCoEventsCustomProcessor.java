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
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Service: CoEvent Method: updateCoEvents Class:
 * updateCoEventsCustomProcessor.java
 * 
 * @author Chris Hutt Created:
 *         28-July-2005 Description:
 * 
 *         Change History:
 *         17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 */
public class UpdateCoEventsCustomProcessor implements ICustomProcessor
{
    
    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public UpdateCoEventsCustomProcessor ()
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
        try
        {

            final Element coElement = (Element) XPath.selectSingleNode (params, "/params/param/ManageCOEvents");
            // Retrieve 'header' details
            final String coNumber = coElement.getChildText ("CONumber");
            final Element coEventsElement = coElement.getChild ("COEvents");

            boolean updateCoEvent;
            boolean updateCo;
            boolean errorRulesRelevant;
            boolean statusRulesRelevant;

            XMLOutputter xmlOutputter = null;
            String sXml = null;

            // Loop through each Co event
            final List<Element> coEventList = coEventsElement.getChildren ("COEvent");
            Element coEventElement = null;
            int status;

            final Iterator<Element> it = coEventList.iterator ();
            while (it.hasNext ())
            {

                // Now we have the CO Event.
                coEventElement = (Element) it.next ();

                // reset ACTION flags
                updateCoEvent = false;
                updateCo = false;
                errorRulesRelevant = false;
                statusRulesRelevant = false;

                /* Extract the status to work out required updates
                 * Combinations of the following are supported
                 * 0: no update
                 * 1: simple updates to event
                 * 2: marked as being in error
                 * 4: unmarked as being in error
                 * 8: service status cahnged to not served
                 * 
                 * The following 'cumulative' codes can be expected:
                 * 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13 */

                status = Integer.parseInt (coEventElement.getChildText ("Status"));

                switch (status)
                {
                    case 0:
                        break;
                    case 1:
                    case 4:
                    case 5:
                        updateCoEvent = true;
                        break;
                    case 2:
                    case 3:
                        updateCoEvent = true;
                        updateCo = true;
                        errorRulesRelevant = true;
                        break;
                    case 8:
                    case 9:
                    case 12:
                    case 13:
                        updateCoEvent = true;
                        updateCo = true;
                        statusRulesRelevant = true;
                        break;

                    case 10:
                    case 11:
                        updateCoEvent = true;
                        updateCo = true;
                        statusRulesRelevant = true;
                        errorRulesRelevant = true;
                        break;

                }

                if (updateCoEvent || updateCo)
                {

                    // Now perform appropriate updates according to ACTION FLAG settings
                    if (updateCo)
                    {
                        mUpdateCo (coEventElement, coNumber, statusRulesRelevant, errorRulesRelevant);
                    }
                    if (updateCoEvent)
                    {
                        mUpdateCoEvent (coEventElement, coNumber);
                    }
                }

            }

            /* Framework dictates that something must be returned to the client */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (new Element ("ds"));
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
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * updare a co event.
     *
     * @param pCoEventElement the corresponding Ae Event
     * @param pCoNumber The co number.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCoEvent (final Element pCoEventElement, final String pCoNumber)
        throws BusinessException, SystemException
    {
        XMLOutputter xmlOutputter = null;
        Element coEventElement = null;
        // Wrap the 'CoEvent' XML in the 'params/param' structure.
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        coEventElement = (Element) pCoEventElement.clone ();
        coEventElement.detach ();

        // add CoNumber to the event
        XMLBuilder.add (coEventElement, "CONumber", pCoNumber);

        XMLBuilder.addParam (paramsElement, "coEvent", coEventElement);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        localServiceProxy.getJDOM (CoEventDefs.CO_EVENT_SERVICE, CoEventDefs.UPDATE_CO_EVENT, sXmlParams);
    }

    /**
     * update the consolidated order associated with the event (as per the configuration definition)
     * This will be required when the corresponding AE event has been marked in error.
     *
     * @param pCoEventElement the corresponding co Event
     * @param pCoNumber The co number
     * @param pStatusRulesRelevant Determines whether status rules are relevant.
     * @param pErrorRulesRelevant Determines whether error rules are relevant.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mUpdateCo (final Element pCoEventElement, final String pCoNumber, final boolean pStatusRulesRelevant,
                            final boolean pErrorRulesRelevant)
        throws BusinessException, SystemException
    {
        CoEventUpdateHelper coEventUpdateHelper = null;

        try
        {

            /* Perform any update operations associated with the Event. */
            coEventUpdateHelper = new CoEventUpdateHelper ();
            coEventUpdateHelper.PostUpdateProcessing (pCoEventElement, pCoNumber, pStatusRulesRelevant,
                    pErrorRulesRelevant);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }
}