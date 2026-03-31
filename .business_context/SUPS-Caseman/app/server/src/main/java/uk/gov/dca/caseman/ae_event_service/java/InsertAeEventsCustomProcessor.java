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
package uk.gov.dca.caseman.ae_event_service.java;

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
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: Warrant Method: addWarrant Class:
 * InsertAeEventCustomProcessor.java
 *
 * Change History
 * --------------
 * 
 * 04/07/2005 Chris Hutt
 * 02/03/2006 Chris Hutt defect 2358: Events for xfer to CAPS .... Processdate = Sysdate.
 * 11/07/2006 Chris Hutt TD3870: no case event if ae is a mags order type.
 * 
 * @author Chris Hutt
 */
public class InsertAeEventsCustomProcessor implements ICustomProcessor
{
    
    /** The out. */
    private final XMLOutputter out;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (InsertAeEventsCustomProcessor.class);

    /**
     * Constructor.
     */
    public InsertAeEventsCustomProcessor ()
    {
        out = new XMLOutputter (Format.getPrettyFormat ());

    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        AeEventUpdateHelper aeEventUpdateHelper = null;

        try
        {

            final Element aeEventElement = (Element) XPath.selectSingleNode (params, "/params/param/AEEvent");

            aeEventUpdateHelper = new AeEventUpdateHelper ();

            final String aeType = aeEventElement.getChildText ("AEType");

            if ( !aeType.equals ("MG"))
            {

                // Add a Case Event
                final String caseEventSeq = aeEventUpdateHelper.InsertCaseEventonAeEventInsert (aeEventElement);

                // update the doc with the caseeventSeq
                XMLBuilder.setXPathValue (params.getRootElement (), "/params/param/AEEvent/CaseEventSeq", caseEventSeq);
            }

            // get the process date for the AE event
            final String eventId = aeEventElement.getChildText ("StandardEventId");
            final String processDate = aeEventUpdateHelper.GetProcessDate (eventId);

            // update the doc with the processDate
            XMLBuilder.setXPathValue (params.getRootElement (), "/params/param/AEEvent/ProcessDate", processDate);

            final String s = getXMLString (params.getRootElement ());
            log.debug ("InsertAeEventsCustomProcessor Response: " + s);
            writer.write (s);
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
     * Utility function to convert XML to string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
}