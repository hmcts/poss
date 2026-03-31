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
package uk.gov.dca.caseman.dom_service.java;

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

/**
 * Created on 26-Sep-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author kznwpr
 */
public class Event907CountCustomProcessor implements ICustomProcessor
{

    /** The Constant DOM_SERVICE. */
    private static final String DOM_SERVICE = "ejb/DomServiceLocal";
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /**
     * Constructor.
     */
    public Event907CountCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        try
        {
            final Element root = document.getRootElement ();
            // Get the co number out of the xml
            final String coNumber = XMLBuilder.getXPathValue (root, "/ds/DeterminationOfMeans/CONumber");

            final int event907Count = getEvent907Count (coNumber);

            // Locate the total debts node and set its contents
            final Element event907CountNode =
                    (Element) XPath.newInstance ("/ds/DeterminationOfMeans/Event907Count").selectSingleNode (root);
            // The node will be null if the co does not exist
            if (event907CountNode != null)
            {
                event907CountNode.setText (String.valueOf (event907Count));
            }

            // Write the resulting xml which contains the entire dom to be sent to the client
            final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            final String xmlString = xmlOutputter.outputString (root);
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
        // not implemented.
    }

    /**
     * Method to return the number of 907 events exist for the consolidated order.
     *
     * @param coNumber the co number
     * @return The event 907 count.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private int getEvent907Count (final String coNumber) throws SystemException, BusinessException, JDOMException
    {
        // Create the params element that contains the co number
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "coNumber", coNumber);

        // Turn it into string format
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String xmlParams = xmlOutputter.outputString (paramsElement);

        // Invoke the service
        final String methodName = "getEvent907CountLocal";
        final Element resultsElement = localServiceProxy.getJDOM (DOM_SERVICE, methodName, xmlParams).getRootElement ();

        // Get the value out of the returned xml
        final String returnValueXPath = "/ResultSet/Row/Count";
        final String value = XMLBuilder.getXPathValue (resultsElement, returnValueXPath);

        // Convert to primitive and return
        return Integer.parseInt (value);
    }
}
