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
package uk.gov.dca.caseman.noticeofissue_service.classes;

import java.io.IOException;
import java.io.Writer;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class DataProcessorStore.
 *
 * @author Frederik Vandendriessche
 * 
 *         Change History
 *         Chris Hutt : 22Nov2007 : TD Caseman 6065
 *         CO event 968 has no output but an associated Q&A screen. This results in a 'broken icon' being displayed on
 *         the
 *         CO Events screen. Amended to test for output X01 (no ouput) and NOT write to WP_OUTPUT in such circumstances
 *         Chris Vincent: 26 Jul 2010 : Trac 3489
 *         Update to storeData method to encode the output string in UTF8.
 */
public class DataProcessorStore implements ICustomProcessor
{
    
    /** Serializer/. */
    private final XMLOutputter out;
    /**
     * Logger.
     */
    private static final Log log = SUPSLogFactory.getLogger (DataProcessorStore.class);

    /**
     * Constructor.
     */
    public DataProcessorStore ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
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
        final String msg = "DataProcessorStore ";
        String orderTitle = "";
        boolean maintainWpOutput;

        log.trace (msg + "starts " + new Date ());
        try
        {

            maintainWpOutput = true; // default is the insert/update of WP_OUTPUT (ie associate doutput)

            // Orders where the title begins with 'X01' have Q&A screens but no associated output
            final Element orderTitleElement = (Element) XPath.selectSingleNode (inputParameters,
                    "/params/param[@name='xml']/variabledata/EnterVariableData/OrderTitle");
            if (null != orderTitleElement)
            {
                orderTitle = orderTitleElement.getText ();
                if (orderTitle.length () > 2)
                {
                    orderTitle = orderTitle.substring (0, 3);
                    if (orderTitle.equals ("X01"))
                    {
                        // X01 output doesnt require storing in WP_OUTPUT, so only call the method storeData when X01
                        // isn't involved.
                        maintainWpOutput = false;
                    }
                }
            }

            // Having run all the tests we are now know whether WP_OUTPUT should be maintained.
            if (maintainWpOutput)
            {
                storeData (inputParameters, output, log);
            }
            else
            {
                output.write ("<noOutput/>");
            }
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final SQLException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final NamingException e)
        {
            throw new SystemException (e);
        }

        log.trace (msg + "Finished process " + new Date ());
    }

    /**
     * Store word processing data.
     *
     * @param doc the doc
     * @param output the output
     * @param log the log
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private void storeData (final org.jdom.Document doc, final Writer output, final Log log)
        throws SQLException, JDOMException, NamingException, SystemException, IOException
    {
        final String msg = "DataProcessor.storeData() ";
        if (log.isTraceEnabled ())
        {
            log.trace (msg + "starts");
            log.trace (msg + "recieved params: " + out.outputString (doc));
        }
        /** WP Process Context **/
        final Element context = (Element) XPath.selectSingleNode (doc, "/params/param[@name='context']");
        /** WP Process Variable Data **/
        final Element variableData = (Element) XPath.selectSingleNode (doc, "/params/param[@name='xml']/variabledata");

        final byte[] content = out.outputString (variableData).getBytes ("UTF8");
        /** WP Process Context Case Number **/
        final Element ctxCaseNumberNode = (Element) XPath.selectSingleNode (context, "WordProcessing/Case/CaseNumber");
        String ctxCaseNumber = "";
        if (null != ctxCaseNumberNode)
        {
            ctxCaseNumber = ctxCaseNumberNode.getText ().trim ();
        }
        /** WP Process Context Standard Event ID **/
        final Element ctxStandardEventIdNode =
                (Element) XPath.selectSingleNode (context, "WordProcessing/Event/StandardEventId");
        String ctxStandardEventId = "";
        if (null != ctxStandardEventIdNode)
        {
            ctxStandardEventId = ctxStandardEventIdNode.getText ().trim ();
        }
        /** WP Process Context Case Event Sequence / PK **/
        final Element ctxCaseEventPKNode =
                (Element) XPath.selectSingleNode (context, "WordProcessing/Event/CaseEventSeq");
        String ctxCaseEventPK = "";
        if (null != ctxCaseEventPKNode)
        {
            ctxCaseEventPK = ctxCaseEventPKNode.getText ().trim ();
        }
        /** WP Process Context AE Event Sequence / PK **/
        // Element ctxAEEventPKNode = (Element)XPath.selectSingleNode(variableData, "//aeeventseq");
        final Element ctxAEEventPKNode = (Element) XPath.selectSingleNode (context, "WordProcessing/Event/AEEventSeq");
        String ctxAEEventPK = "";
        if (null != ctxAEEventPKNode)
        {
            ctxAEEventPK = ctxAEEventPKNode.getText ().trim ();
        }
        /** WP Process Context AE Number **/
        final Element ctxAENumnerNode = (Element) XPath.selectSingleNode (context, "WordProcessing/Event/AENumber");
        String ctxAENumber = "";
        if (null != ctxAENumnerNode)
        {
            ctxAENumber = ctxAENumnerNode.getText ().trim ();
        }
        /** WP Process Context CO Event Sequence / PK **/
        final Element ctxCOEventPKNode = (Element) XPath.selectSingleNode (context, "WordProcessing/Event/COEventSeq");
        String ctxCOEventPK = "";
        if (null != ctxCOEventPKNode)
        {
            ctxCOEventPK = ctxCOEventPKNode.getText ().trim ();
        }
        /** WP Process Context Warrant Return Sequence / PK **/
        Element ctxWarrantReturnPKNode = (Element) XPath.selectSingleNode (variableData, "//warrantreturnsequence");
        if (null == ctxWarrantReturnPKNode)
        {
            /** defensive code - warrantreturnsequence is now (always???) WarrantReturnsId **/
            ctxWarrantReturnPKNode =
                    (Element) XPath.selectSingleNode (context, "WordProcessing/Event/WarrantReturnsId");
        }
        String ctxWarrantReturnPK = "";
        if (null != ctxWarrantReturnPKNode)
        {
            ctxWarrantReturnPK = ctxWarrantReturnPKNode.getText ().trim ();
        }
        /** WP Process - Application User **/
        final Element prmUserNameNode = (Element) XPath.selectSingleNode (doc, "/params/param[@name='storingUser']");
        String prmUserName = "";
        if (null != prmUserNameNode)
        {
            prmUserName = prmUserNameNode.getText ().trim ();
        }
        /** WP Process Final Flag **/
        final Element vdFinalNode = (Element) XPath.selectSingleNode (variableData, "//outputIsFinal");
        String vdFinal = "Y";
        if (null != vdFinalNode)
        {
            final String tmpVdFinal = vdFinalNode.getText ().trim ();
            if ("Y".equals (tmpVdFinal) || "N".equals (tmpVdFinal))
            {
                vdFinal = tmpVdFinal;
            }
        }
        /** Log the context for storig this WP_OUTPUT **/
        if (log.isTraceEnabled ())
        {
            log.trace ("About to store WordProcessing Data for");
            log.trace ("WordProcessing Data User: [" + prmUserName + "]");
            log.trace ("WordProcessing Data Standard Event ID: [" + ctxStandardEventId + "]");
            log.trace ("WordProcessing Data Case: [" + ctxCaseNumber + "]");
            log.trace ("WordProcessing Data Case Event PK: [" + ctxCaseEventPK + "]");
            log.trace ("WordProcessing Data AE : [" + ctxAENumber + "]");
            log.trace ("WordProcessing Data AE Event PK: [" + ctxAEEventPK + "]");
            log.trace ("WordProcessing Data CO Event PK: [" + ctxCOEventPK + "]");
            log.trace ("WordProcessing Data Warrant Return PK: [" + ctxWarrantReturnPK + "]");
            log.trace ("WordProcessing Data Final Flag: [" + vdFinal + "]");
            log.trace ("WordProcessing Data Final vdFinalNode: " +
                    (null == vdFinalNode ? "null " : vdFinalNode.toString ()));
            log.trace ("WordProcessing Data Doc: " + out.outputString (doc) + "\n");
        }
        /** Start Storing **/
        Connection conn = null;
        Statement statement = null;
        PreparedStatement stmt = null, ps = null, ps2 = null;
        ResultSet rs = null, rs2 = null;
        try
        {
            final Context ctx = new InitialContext ();
            if (ctx == null)
            {
                throw new SystemException ("Could not retrieve Context.");
            }
            final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
            if (ds != null)
            {
                conn = ds.getConnection ();
                if (conn != null)
                {
                    int wpPK = 0;
                    boolean isWarrantReturn = false, isAEEvent = false, isCOEvent = false, isCaseEvent = false;
                    String cmd = "SELECT OUTPUT_ID FROM WP_OUTPUT WHERE ";
                    if ( !"".equals (ctxWarrantReturnPK))
                    {
                        cmd += "WARRANT_RETURNS_ID = '" + ctxWarrantReturnPK + "'";
                        isWarrantReturn = true;
                    }
                    else if ( !"".equals (ctxAENumber))
                    {
                        if ("" != ctxAEEventPK)
                        {
                            cmd += "AE_EVENT_SEQ = " + ctxAEEventPK;
                        }
                        else
                        {
                            cmd += "AE_EVENT_SEQ = " + ctxCaseEventPK;
                        }
                        isAEEvent = true;
                    }
                    else if ( !"".equals (ctxCOEventPK))
                    {
                        cmd += "CO_EVENT_SEQ = " + ctxCOEventPK;
                        isCOEvent = true;
                    }
                    else if ( !"".equals (ctxCaseEventPK))
                    {
                        cmd += "EVENT_SEQ = " + ctxCaseEventPK;
                        isCaseEvent = true;
                    }
                    else
                    {
                        log.error ("No Case Event, NOR CO Event, NOR AE Event, NOR Warrant Return detected.");
                    }
                    log.trace (msg + " cmd: " + cmd);
                    stmt = conn.prepareStatement (cmd);
                    rs = stmt.executeQuery ();
                    if ( !rs.next ())
                    { /** Create new WP_OUTPUT record **/
                        rs.close ();
                        stmt.close ();
                        cmd = "SELECT WP_OUTPUT_SEQUENCE.NEXTVAL FROM DUAL";
                        stmt = conn.prepareStatement (cmd);
                        rs = stmt.executeQuery ();
                        if (rs.next ())
                        {
                            wpPK = rs.getInt (1);
                            /**
                             * ps = conn.prepareStatement("INSERT INTO WP_OUTPUT (OUTPUT_ID, PDF_SOURCE, DATE_CREATED,
                             * PRINTED, CO_EVENT_SEQ, EVENT_SEQ, AE_EVENT_SEQ, FINAL_IND, XMLSOURCE, USER_ID) values (?,
                             * empty_blob(), SYSDATE, ?, ?, ? , ?, ? , ?, ?)");
                             **/
                            ps = conn.prepareStatement (
                                    "INSERT INTO WP_OUTPUT (OUTPUT_ID, PDF_SOURCE, DATE_CREATED, PRINTED, CO_EVENT_SEQ, EVENT_SEQ, AE_EVENT_SEQ, FINAL_IND, XMLSOURCE, USER_ID, WARRANT_RETURNS_ID) values (?, empty_blob(), SYSDATE, ?, ?, ? , ?, ? , ?, ?, ?)");
                            ps.setInt (1, wpPK);
                            ps.setString (2, "N");
                            ps.setObject (3, isCOEvent ? ctxCOEventPK : null);
                            ps.setObject (4, isCaseEvent ? ctxCaseEventPK : null);
                            ps.setObject (5, isAEEvent ? ctxAEEventPK : null);
                            ps.setString (6, vdFinal);
                            ps.setString (7, null);
                            ps.setString (8, prmUserName);
                            ps.setObject (9, isWarrantReturn ? ctxWarrantReturnPK : null);
                            ps.executeUpdate ();
                        }
                        else
                        {
                            log.error ("FAILED TO retrieve result from " + cmd);
                        }
                    }
                    else
                    { /** Found WP_OUTPUT record, updating blob only **/
                        wpPK = rs.getInt (1);
                    }
                    if (wpPK != 0)
                    { /** In Create, or Update, if wpPK is populated, update its blob **/
                        statement = conn.createStatement ();
                        statement
                                .execute ("SELECT PDF_SOURCE FROM WP_OUTPUT WHERE OUTPUT_ID = " + wpPK + " FOR UPDATE");
                        rs2 = statement.getResultSet ();
                        if (rs2.next ())
                        {
                            ps2 = conn.prepareStatement (
                                    "UPDATE WP_OUTPUT SET PDF_SOURCE = empty_blob() WHERE OUTPUT_ID = ?");
                            ps2.setInt (1, wpPK);
                            ps2.execute ();
                            // Close statement before re-assigning
                            rs2.close ();
                            statement.close ();
                            statement = conn.createStatement ();
                            statement.execute (
                                    "SELECT PDF_SOURCE FROM WP_OUTPUT WHERE OUTPUT_ID = " + wpPK + " FOR UPDATE");
                            rs2 = statement.getResultSet ();
                            rs2.next ();
                            final Blob blob = rs2.getBlob (1);
                            blob.setBytes (1, content);
                            // Close prepared statement before re-assigning
                            ps2.close ();
                            ps2 = conn.prepareStatement ("UPDATE WP_OUTPUT SET PDF_SOURCE = ? WHERE OUTPUT_ID = ?");
                            ps2.setInt (2, wpPK);
                            ps2.setBlob (1, blob);
                            ps2.execute ();
                        }
                        output.write ("<savedOutput>" + wpPK + "</savedOutput>");
                    }
                    else
                    {
                        log.trace ("no wpPK found for the new wp_output record");
                    }
                }
                else
                {
                    log.error ("FAILURE: DataSource returned null Connection object.");
                }
            }
            else
            {
                log.error ("FAILURE: Context returned null DataSource object");
            }
        }
        finally
        {
            if (rs2 != null)
            {
                rs2.close ();
            }
            if (rs != null)
            {
                rs.close ();
            }
            if (ps2 != null)
            {
                ps2.close ();
            }
            if (statement != null)
            {
                statement.close ();
            }
            if (ps != null)
            {
                ps.close ();
            }
            if (stmt != null)
            {
                stmt.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }
        conn = null;
        stmt = null;
        ps = null;
        ps2 = null;
        statement = null;
        rs = null;
        rs2 = null;

        log.trace (msg + "ends");
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final uk.gov.dca.db.pipeline.IComponentContext ctx)
    {
    }
}