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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

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

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 26-Oct-2004.
 *
 * @author Frederik Vandendriessche
 * 
 *         Change History
 *         05/12/2012 Chris Vincent : Bulk Printing (Trac 4761)
 *         Restructured file so that the WP_OUTPUT update has been moved into a method
 *         and various bulk printing methods added culminating in the insert of a new
 *         REPORT_MAP row.
 *         06/11/2015 Chris Vincent : Further bulk printing changes to enable SPS to differentiate
 *         between CCMCC, CCBC and County Court outputs.
 */
public class DataProcessor_setDocument implements ICustomProcessor
{
    
    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The Constant WP_OUTPUT_SERVICE. */
    private static final String WP_OUTPUT_SERVICE = "ejb/WpOutputServiceLocal";
    
    /** The Constant GET_REPORT_QUEUE_ID_METHOD. */
    private static final String GET_REPORT_QUEUE_ID_METHOD = "getReportQueueIdLocal";
    
    /** The Constant GET_CASE_EVENT_COURT_CODE_METHOD. */
    private static final String GET_CASE_EVENT_COURT_CODE_METHOD = "getN271CourtCodeLocal";
    
    /** The Constant GET_AE_EVENT_COURT_CODE_METHOD. */
    private static final String GET_AE_EVENT_COURT_CODE_METHOD = "getAeOutputCourtCodeLocal";
    
    /** The Constant GET_WP_OUTPUT_DETAILS_METHOD. */
    private static final String GET_WP_OUTPUT_DETAILS_METHOD = "getWpOutputDetailsLocal";

    /** The Constant ENFORCEMENT_CASE. */
    private static final String ENFORCEMENT_CASE = "CASE";
    
    /** The Constant ENFORCEMENT_AE. */
    private static final String ENFORCEMENT_AE = "AE";
    
    /** The Constant ENFORCEMENT_CO. */
    private static final String ENFORCEMENT_CO = "CO";
    
    /** The Constant ENFORCEMENT_WARRANT. */
    private static final String ENFORCEMENT_WARRANT = "WARRANT";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DataProcessor_setDocument.class);

    /**
     * Constructor.
     */
    public DataProcessor_setDocument ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

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
     * @throws BusinessException the business exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final org.jdom.Document inputParameters, final Writer output, final Log pLog)
        throws SystemException, BusinessException
    {
        log.debug ("Starting process in DataProcessor");
        final XMLOutputter outputter = new XMLOutputter ();
        if (log.isDebugEnabled ())
        {
            log.debug (outputter.outputString (inputParameters));
        }
        try
        {
            final Element outputIdNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='outputId']");
            String outputId = null;
            if (null != outputIdNode)
            {
                outputId = outputIdNode.getValue ();
            }
            final Element docoIdNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='documentId']");
            String docoId = null;
            if (null != docoIdNode)
            {
                docoId = docoIdNode.getValue ();
            }
            final Element finalNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='final']");
            String fienal = null;
            if (null != finalNode)
            {
                fienal = finalNode.getValue ();
            }
            if ( !("Y".equals (fienal) || "N".equals (fienal)))
            {
                log.trace ("final was: [" + fienal + "], now Y");
                fienal = "Y";
            }
            log.trace ("Set Document:  Output:" + outputId + ", Document: " + docoId + ", final: " + fienal);

            final Element printNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='printed']");
            String print = null;
            if (null != printNode)
            {
                print = printNode.getValue ();
            }
            if ( !("Y".equals (print) || "N".equals (print)))
            {
                log.trace ("print was: [" + print + "], now N");
                print = "N";
            }
            log.trace ("Set Document:  Output:" + outputId + ", Document: " + docoId + ", print: " + print);

            final Element nRefNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='nreference']");
            String nRef = null;
            if (null != nRefNode)
            {
                nRef = nRefNode.getValue ();
            }
            final Element bulkPrintNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='bulkprint']");
            String bulkPrintInd = "false";
            if (null != bulkPrintNode)
            {
                // If marked for bulk printing and output is final, set Print to Y (even though not printed locally) to
                // prevent
                // output from appearing in Run Order Printing screen.
                bulkPrintInd = bulkPrintNode.getValue ();
                if ("true".equals (bulkPrintInd) && "Y".equals (fienal))
                {
                    print = "Y";
                }
            }
            final Element cjrRefNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='cjrRef']");
            String cjrRef = null;
            if (null != cjrRefNode)
            {
                cjrRef = cjrRefNode.getValue ();
            }

            // Update the WP_OUTPUT row
            updateWPOutputTable (docoId, fienal, print, outputId);

            // Insert a REPORT_MAP row providing output marked for bulk printing and output marked as final
            if ("true".equals (bulkPrintInd) && "Y".equals (fienal))
            {
                if ("N30(1)".equals (nRef))
                {
                    nRef = "N30";
                }
                else if ("N30(2)".equals (nRef))
                {
                    nRef = "N30_2";
                }
                else if ("N24".equals (nRef))
                {
                    if ("CJR065C".equals (cjrRef) || "CJR065A".equals (cjrRef))
                    {
                        nRef = "N24_65";
                    }
                    else if ("CJR069".equals (cjrRef))
                    {
                        nRef = "N24_69";
                    }
                    else if ("CJR070".equals (cjrRef))
                    {
                        nRef = "N24_70";
                    }
                }

                // Retrieve the REPORT_QUEUE Id
                final String reportQueueId = mGetOutputReportQueueId (outputId);

                // Handle N271 Exception
                String courtCode = "0";
                if ("N271".equals (nRef) || "N24_69".equals (nRef) || "N24_70".equals (nRef) || "N30".equals (nRef) ||
                        "N30_2".equals (nRef))
                {
                    courtCode = mGetCaseEventCourtCode (outputId);
                }
                else if ("N24_65".equals (nRef))
                {
                    // This output can be associated with either an AE event or a Case event
                    // so the court code will need to be sourced differently
                    final String enforcementType = mDetermineEnforcementType (outputId);
                    if (enforcementType.equals (ENFORCEMENT_CASE))
                    {
                        courtCode = mGetCaseEventCourtCode (outputId);
                    }
                    else if (enforcementType.equals (ENFORCEMENT_AE))
                    {
                        courtCode = mGetAeEventCourtCode (outputId);
                    }
                }

                // Write REPORT_MAP row to the database
                insertReportMapRow (reportQueueId, nRef, courtCode);
            }

            final StringBuffer sb = new StringBuffer ();
            sb.append ("<setdocument output=\"" + outputId + "\">" + docoId + "</setdocument>");
            final String s = sb.toString ();
            log.trace ("returning " + s);
            output.write (s);
            log.trace ("Finished process in DataProcessor");
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
        catch (final BusinessException e)
        {
            throw new BusinessException (e);
        }
    }

    /**
     * Updates the WP_OUTPUT record for the output.
     *
     * @param pDocId Document Id for the output (DOCUMENT_STORE.ID)
     * @param pFinalInd Indicates whether or not the output if final (Y or N)
     * @param pPrint Indicates whether or not the output has been printed (Y or N)
     * @param pOutputId The primary key of the WP_OUTPUT record
     * @throws IOException IOException exception
     * @throws JDOMException JDOMException exception
     * @throws SQLException SQLException exception
     * @throws NamingException NamingException exception
     * @throws SystemException SystemException exception
     */
    private void updateWPOutputTable (final String pDocId, final String pFinalInd, final String pPrint,
                                      final String pOutputId)
        throws IOException, JDOMException, SQLException, NamingException, SystemException
    {
        PreparedStatement ps2 = null;
        Connection conn = null;
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
                    // Update the WP_OUTPUT row
                    ps2 = conn.prepareStatement (
                            "UPDATE WP_OUTPUT SET XMLSOURCE = ?, FINAL_IND = ?, PRINTED = ? WHERE OUTPUT_ID = ?");
                    ps2.setString (1, pDocId);
                    ps2.setString (2, pFinalInd);
                    ps2.setString (3, pPrint);
                    ps2.setString (4, pOutputId);
                    ps2.execute ();
                }
                else
                {
                    log.error ("Connection is null");
                }
            }
            else
            {
                log.error ("DataSource is null");
            }
        }
        finally
        {
            if (ps2 != null)
            {
                ps2.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }
    }

    /**
     * Inserts a REPORT_MAP row for outputs marked for bulk printing.
     *
     * @param pReportQueueId Report Queue Id for the output (REPORT_QUEUE.ID)
     * @param pNReference 'N' Reference of the output e.g. N271
     * @param pCourtCode Court code of the case the output was generated for
     * @throws IOException IOException exception
     * @throws JDOMException JDOMException exception
     * @throws SQLException SQLException exception
     * @throws NamingException NamingException exception
     * @throws SystemException SystemException exception
     */
    private void insertReportMapRow (final String pReportQueueId, final String pNReference, final String pCourtCode)
        throws IOException, JDOMException, SQLException, NamingException, SystemException
    {
        PreparedStatement ps2 = null;
        Connection conn = null;

        /* For the transfer notice (N271), need to determine if transfer court was CCBC or not and append the reportName
         * accordingly */
        String reportName = pNReference.toUpperCase ();
        if ("N271".equals (pNReference))
        {
            if ("335".equals (pCourtCode))
            {
                reportName = reportName + "_CC";
            }
            else
            {
                reportName = reportName + "_CM";
            }
        }
        else if ("N24_65".equals (pNReference) || "N24_69".equals (pNReference) || "N24_70".equals (pNReference) ||
                "N30".equals (pNReference) || "N30_2".equals (pNReference))
        {
            // For these bulk printed outputs, CCBC or CCMCC specific suffixes are required
            if ("335".equals (pCourtCode))
            {
                reportName = reportName + "_CC";
            }
            else if ("390".equals (pCourtCode) || "391".equals (pCourtCode))
            {
                reportName = reportName + "_MC";
            }
        }

        final String legacyPath = reportName + "/input";
        final String fileName = reportName + "_" + pReportQueueId + ".pdf";

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
                    // Insert the REPORT_MAP row
                    ps2 = conn.prepareStatement (
                            "INSERT INTO REPORT_MAP (REPORT_QUEUE_ID, REPORT_NAME, LEGACY_PATH, FILE_NAME) " +
                                    "VALUES (?, ?, ?, ?)");
                    ps2.setString (1, pReportQueueId);
                    ps2.setString (2, reportName);
                    ps2.setString (3, legacyPath);
                    ps2.setString (4, fileName);
                    ps2.execute ();
                }
                else
                {
                    log.error ("Connection is null");
                }
            }
            else
            {
                log.error ("DataSource is null");
            }
        }
        finally
        {
            if (ps2 != null)
            {
                ps2.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }
    }

    /**
     * Retrieves a REPORT_QUEUE row id for a given WP_OUTPUT row.
     *
     * @param pOutputId WP_OUTPUT record identifier
     * @return String representing the REPORT_QUEUE Id for the given WP_OUTPUT record
     * @throws SystemException SystemException exception
     * @throws JDOMException JDOMException exception
     * @throws BusinessException BusinessException exception
     */
    private String mGetOutputReportQueueId (final String pOutputId)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element OutputElement = null;
        String reportQueueId = null;
        String sXmlParams = null;
        XMLOutputter xmlOutputter = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "outputId", pOutputId);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            OutputElement = localServiceProxy.getJDOM (WP_OUTPUT_SERVICE, GET_REPORT_QUEUE_ID_METHOD, sXmlParams)
                    .getRootElement ();

            if (null != OutputElement)
            {
                reportQueueId = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/ReportQueueId");
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return reportQueueId;
    }

    /**
     * Retrieves the CASE_EVENTS.CRT_CODE for the case event associated with the output
     * required for determining the correct Report Name for the REPORT_MAP table.
     *
     * @param pOutputId WP_OUTPUT record identifier
     * @return String representing the original transferring court of the transfer out event
     * @throws SystemException SystemException exception
     * @throws JDOMException JDOMException exception
     * @throws BusinessException BusinessException exception
     */
    private String mGetCaseEventCourtCode (final String pOutputId)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element OutputElement = null;
        String courtCode = null;
        String sXmlParams = null;
        XMLOutputter xmlOutputter = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "outputId", pOutputId);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            OutputElement = localServiceProxy.getJDOM (WP_OUTPUT_SERVICE, GET_CASE_EVENT_COURT_CODE_METHOD, sXmlParams)
                    .getRootElement ();

            if (null != OutputElement)
            {
                courtCode = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/CourtCode");
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return courtCode;
    }

    /**
     * Retrieves the CASE_EVENTS.CRT_CODE for the case event linked to the AE event that is
     * associated with the output required for determining the correct Report Name for
     * the REPORT_MAP table.
     *
     * @param pOutputId WP_OUTPUT record identifier
     * @return String representing the original transferring court of the transfer out event
     * @throws SystemException SystemException exception
     * @throws JDOMException JDOMException exception
     * @throws BusinessException BusinessException exception
     */
    private String mGetAeEventCourtCode (final String pOutputId)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element OutputElement = null;
        String courtCode = null;
        String sXmlParams = null;
        XMLOutputter xmlOutputter = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "outputId", pOutputId);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            OutputElement = localServiceProxy.getJDOM (WP_OUTPUT_SERVICE, GET_AE_EVENT_COURT_CODE_METHOD, sXmlParams)
                    .getRootElement ();

            if (null != OutputElement)
            {
                courtCode = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/CourtCode");
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return courtCode;
    }

    /**
     * Determines the enforcement type associated with the output in question (e.g.
     * Case, AE, CO or Warrant
     *
     * @param pOutputId WP_OUTPUT record identifier
     * @return String representing the enforcement type associated with the output
     * @throws SystemException SystemException exception
     * @throws JDOMException JDOMException exception
     * @throws BusinessException BusinessException exception
     */
    private String mDetermineEnforcementType (final String pOutputId)
        throws SystemException, JDOMException, BusinessException
    {
        Element paramsElement = null;
        Element OutputElement = null;
        String enforcementType = ENFORCEMENT_CASE;
        String sXmlParams = null;
        XMLOutputter xmlOutputter = null;

        try
        {
            // Build the Parameter XML for passing to the service.
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "outputId", pOutputId);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            OutputElement = localServiceProxy.getJDOM (WP_OUTPUT_SERVICE, GET_WP_OUTPUT_DETAILS_METHOD, sXmlParams)
                    .getRootElement ();

            if (null != OutputElement)
            {
                final String caseEventSeq = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/CaseEventSeq");
                final String aeEventSeq = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/AeEventSeq");
                final String coEventSeq = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/CoEventSeq");
                final String warrantRetId = XMLBuilder.getXPathValue (OutputElement, "/ds/Output/WarrantReturnId");
                if ( !caseEventSeq.equals ("-1"))
                {
                    enforcementType = ENFORCEMENT_CASE;
                }
                else if ( !aeEventSeq.equals ("-1"))
                {
                    enforcementType = ENFORCEMENT_AE;
                }
                else if ( !coEventSeq.equals ("-1"))
                {
                    enforcementType = ENFORCEMENT_CO;
                }
                else if ( !warrantRetId.equals ("-1"))
                {
                    enforcementType = ENFORCEMENT_WARRANT;
                }
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return enforcementType;
    }
}
