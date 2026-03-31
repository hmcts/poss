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
package uk.gov.dca.caseman.per_service.java;

import java.io.IOException;
import java.io.Writer;

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
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class AddCoEvent857CustomProcessor.
 *
 * @author kznwpr
 * 
 *         This class determines whether or not to add an event 857 based on the contents of the dom
 * 
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         25-Jul-2006 Paul Roberts: Logging.
 */
public class AddCoEvent857CustomProcessor implements ICustomProcessor
{

    /** The Constant CO_EVENT_SERVICE. */
    private static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (AddCoEvent857CustomProcessor.class);

    /**
     * Constructor.
     */
    public AddCoEvent857CustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {
            final Element root = document.getRootElement ();

            // Test to see if the <COEvents> element is present
            Element eventElement = (Element) XPath.selectSingleNode (root, "/ds/CalculatePER/COEvents");
            if (null != eventElement)
            {
                // Detach the AEEvents branch from its containing document
                eventElement = (Element) eventElement.detach ();

                log.debug ("Will need to create event 857 because the event data is in the document");

                // Add the event
                addEvent857 (eventElement);
            }
            else
            {
                log.debug ("No need to create event 857 because the event data is not in the document");
            }

            final Element outputRoot = new Element ("ds");

            // Write a document that just contains the ds element. This is returned to the client
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String xmlString = xmlOutputter.outputString (outputRoot);
            writer.write (xmlString);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
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
     * Method to add a new event 857 for the co. The data to add is contained in the branch that passed to this method.
     *
     * @param eventElement The event element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void addEvent857 (final Element eventElement) throws SystemException, BusinessException
    {
        // Create the params element that contains the co number
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "COEvents", eventElement);

        // Turn it into string format
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String xmlParams = xmlOutputter.outputString (paramsElement);

        // Invoke the service
        final String methodName = "insertCoEventsAutoLocal";
        localServiceProxy.getJDOM (CO_EVENT_SERVICE, methodName, xmlParams);
    }
}
