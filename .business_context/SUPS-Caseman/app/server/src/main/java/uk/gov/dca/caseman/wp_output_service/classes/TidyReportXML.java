/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: 4523 $
 * $Author: bonnettp $
 * $Date: 2009-10-30 11:44:48 +0000 (Fri, 30 Oct 2009) $
 * $Id: TidyReportXML.java 4523 2009-10-30 11:44:48Z bonnettp $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.wp_output_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class TidyReportXML.
 */
public class TidyReportXML implements ICustomProcessor
{
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (TidyReportXML.class);

    /**
     * {@inheritDoc}
     */
    public void setContext (final uk.gov.dca.db.pipeline.IComponentContext ctx)
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param inputParameters the input parameters
     * @param output the output
     * @param pLog the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final org.jdom.Document inputParameters, final Writer output, final Log pLog)
        throws SystemException
    {
        try
        {
            final XMLOutputter xml = new XMLOutputter (Format.getPrettyFormat ());
            final String xmlStr = xml.outputString (inputParameters);
            output.write (xmlStr.substring (xmlStr.indexOf ("\n") + 1));

        }
        catch (final IOException ioe)
        {
            log.error ("Error parsing input XML", ioe);
            throw new SystemException ("Error parsing input XML", ioe);
        }
    }
}
