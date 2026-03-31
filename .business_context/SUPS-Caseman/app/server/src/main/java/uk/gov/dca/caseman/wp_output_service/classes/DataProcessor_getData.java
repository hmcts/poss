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
package uk.gov.dca.caseman.wp_output_service.classes;

import java.io.IOException;
import java.io.Writer;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 26-Oct-2004.
 *
 * @author Frederik Vandendriessche
 * 
 *         Change History
 *         26-Jul-2010 Chris Vincent, Trac 3489. Update to process to encode the Blob string in UTF8.
 */
public class DataProcessor_getData implements ICustomProcessor
{
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DataProcessor_getData.class);

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
        log.trace ("Starting process in DataProcessor getData");

        final XMLOutputter outputter = new XMLOutputter ();
        if (log.isErrorEnabled ())
        {
            log.error (outputter.outputString (inputParameters));
        }
        try
        {
            final Element outputIdNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='outputId']");
            String outputId = null;
            String caEvent = "";
            String coEvent = "";
            String aeEvent = "";
            String warRetn = "";
            String s = "not loaded";
            if (null != outputIdNode)
            {
                outputId = outputIdNode.getValue ();
                log.trace ("Loading data:  Output:" + outputId);
            }
            else
            {
                final Element context = (Element) XPath.selectSingleNode (inputParameters, "params/param[@name='xml']");
                final Element caEventNode =
                        (Element) XPath.selectSingleNode (context, "//WordProcessing/Event/CaseEventSeq");
                final Element coEventNode =
                        (Element) XPath.selectSingleNode (context, "//WordProcessing/Event/COEventSeq");
                final Element aeEventNode =
                        (Element) XPath.selectSingleNode (context, "//WordProcessing/Event/AEEventSeq");
                final Element warRetnNode =
                        (Element) XPath.selectSingleNode (context, "//WordProcessing/Event/WarrantReturnsId");
                if (null != caEventNode)
                {
                    caEvent = caEventNode.getValue ();
                }
                if (null != coEventNode)
                {
                    coEvent = coEventNode.getValue ();
                }
                if (null != aeEventNode)
                {
                    aeEvent = aeEventNode.getValue ();
                    log.error ("Loading data:  setting Case Event :" + caEvent + "to '' as we have an AEEventSeq...");
                    caEvent = "";
                }
                if (null != warRetnNode)
                {
                    warRetn = warRetnNode.getValue ();
                    log.error ("Loading data:  setting Case Event :" + caEvent +
                            "to '' as we have an WarrantReturnsId...");
                    caEvent = "";
                }
                log.error ("Loading data:  Case Event :" + caEvent);
                log.error ("Loading data:  CO Event :" + coEvent);
                log.error ("Loading data:  AE Event :" + aeEvent);
                log.error ("Loading data:  Warrant Return :" + warRetn);
            }
            final Context ctx = new InitialContext ();
            if (ctx == null)
            {
                throw new SystemException ("Could not retrieve Context.");
            }
            final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
            if (ds != null)
            {
                final Connection conn = ds.getConnection ();
                PreparedStatement ps2 = null;
                ResultSet rs2 = null;
                if (conn != null)
                {
                    try
                    {
                        if (null != outputId)
                        {
                            ps2 = conn.prepareStatement (
                                    "SELECT PDF_SOURCE, OUTPUT_ID FROM WP_OUTPUT WHERE OUTPUT_ID = ?");
                            ps2.setString (1, outputId);
                        }
                        else
                        {
                            ps2 = conn.prepareStatement (
                                    "SELECT PDF_SOURCE, OUTPUT_ID FROM WP_OUTPUT WHERE EVENT_SEQ = ? OR CO_EVENT_SEQ = ? OR AE_EVENT_SEQ = ? OR WARRANT_RETURNS_ID = ?");
                            ps2.setString (1, caEvent);
                            ps2.setString (2, coEvent);
                            ps2.setString (3, aeEvent);
                            ps2.setString (4, warRetn);

                        }
                        ps2.execute ();
                        rs2 = ps2.getResultSet ();
                        if (rs2.next ())
                        {
                            final Blob blob = rs2.getBlob (1);
                            outputId = rs2.getString (2);
                            final long l = 1;
                            final int i = new Long (blob.length ()).intValue ();
                            s = new String (blob.getBytes (l, i), "UTF8");
                        }
                    }
                    finally
                    {
                        rs2.close ();
                        ps2.close ();
                        conn.close ();
                    }
                }
                else
                {
                    log.error ("DataProcessor_getData.process():Connection is null");
                }
            }
            else
            {
                log.error ("DataProcessor_getData.process():DataSource is null");
            }

            final StringBuffer sb = new StringBuffer ();
            sb.append ("<getdata output=\"" + outputId + "\">" + s + "</getdata>");
            final String ss = sb.toString ();
            log.trace ("returning " + ss);
            output.write (ss);
            log.trace ("Finished process in DataProcessor getData");
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final SQLException e)
        {
            throw new SystemException (e);
        }
        catch (final NamingException e)
        {
            throw new SystemException (e);
        }
    }
}
