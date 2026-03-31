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
package uk.gov.dca.caseman.printedoutput_service.classes;

import java.io.IOException;
import java.io.StringReader;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: PrintedOutput
 * Method: runOrderPrinting
 * Class: RunOrderPrintingCustomProcessor.java
 * Description:
 * Java class to prepare each output for printing on UC012 Run Order Printing
 * and then print it.
 *
 * Change History:
 * 03/07/2007 Chris Vincent - Improved efficiency. The user's printer is now retrieved on the client side and passed
 * to the service as is the reportId which were previously retrieved in here. To cope with multiple outputs
 * being passed in for print, a DOM node is passed in /Outputs/Output under which is the DocumentId, OutputId
 * and ReportId. CaseMan Defect 6213.
 * 08-Feb-2008 Chris Vincent: CaseMan Defect 6181. Changed the method getCourtFAPId() to use a different
 * retrieval service to lookup the user printer court instead of the fap id associated with the
 * user's home court.
 * 26-Jul-2010 Chris Vincent: Trac 3489. Update to getPrintOptionsElement so blobstring variable is encoded with UTF8.
 * 
 * @author Chris Vincent
 */
public class RunOrderPrintingCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Reports service name.
     */
    public static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    /**
     * Request report method name.
     */
    public static final String REQUEST_REPORT = "requestReportLocal";
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (RunOrderPrintingCustomProcessor.class);

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws BusinessException, SystemException
    {
        String courtId = null;
        String userId = null;
        String documentID = null;
        String outputID = null;
        String reportID = null;
        String printer = null;
        String courtFAPId = null;
        Document runOrderPrintingResponseDoc = params;

        final XMLOutputter outputter = new XMLOutputter (Format.getCompactFormat ());

        try
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("RunOrderPrintingCustomProcessor.process received following XML : " +
                        outputter.outputString (params));
            }
            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();
            printer = ((Element) XPath.selectSingleNode (params, "params/param[@name='printer'")).getText ();
            courtFAPId = getCourtFAPId (userId, courtId);

            final Element outputsElement =
                    (Element) XPath.selectSingleNode (params, "/params/param[@name='outputs']/Outputs");
            final List<Element> outputList = outputsElement.getChildren ("Output");
            for (Iterator<Element> it = outputList.iterator (); it.hasNext ();)
            {
                final Element output = (Element) it.next ();
                documentID = output.getChildTextTrim ("DocumentId");
                outputID = output.getChildTextTrim ("OutputId");
                reportID = output.getChildTextTrim ("ReportId");

                final Element printElement = getPrintElement (outputID, printer, courtFAPId);
                runOrderPrintingResponseDoc = requestPrint (reportID, outputID, printElement);
            }
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
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return runOrderPrintingResponseDoc;
    }

    /**
     * (non-Javadoc)
     * Creats a framework PrintOptions element.
     *
     * @param outputID the output ID
     * @param printer the printer
     * @param courtFAPId the court FAP id
     * @return the prints the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws NamingException the naming exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private Element getPrintElement (final String outputID, final String printer, final String courtFAPId)
        throws SystemException, BusinessException, NamingException, SQLException, JDOMException, IOException
    {
        final Element printOptionsElement = getPrintOptionsElement (outputID);

        String printDuplex = "false";
        String noOfCopies = "1";
        String tray = "";

        if (printOptionsElement != null)
        {
            printDuplex = printOptionsElement.getChild ("duplex").getText ();
            noOfCopies = printOptionsElement.getChild ("copies").getText ();
            tray = printOptionsElement.getChild ("tray").getText ();
            if ( !tray.equals ("0"))
            {
                tray = "";
            }
        }

        final XMLOutputter outputter = new XMLOutputter (Format.getCompactFormat ());

        final Element printElement = new Element ("Print");
        XMLBuilder.add (printElement, "Type", "pdf2ps");

        final Element destinationElement = new Element ("Destination");
        XMLBuilder.add (destinationElement, "Server", courtFAPId);
        XMLBuilder.add (destinationElement, "Printer", printer);

        printElement.addContent (destinationElement);

        final Element optionsElement = new Element ("Options");
        XMLBuilder.add (optionsElement, "Tray", tray);
        XMLBuilder.add (optionsElement, "NumCopies", noOfCopies);
        XMLBuilder.add (optionsElement, "Duplex", printDuplex);

        printElement.addContent (optionsElement);
        if (log.isDebugEnabled ())
        {
            log.debug ("RunOrderPrintingCustomProcessor.getPrintElement Print Element : " +
                    outputter.outputString (printElement));
        }
        return printElement;
    }

    /**
     * Gets the prints the options element.
     *
     * @param outputID The output id.
     * @return The print options element.
     * @throws SystemException the system exception
     * @throws NamingException the naming exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private Element getPrintOptionsElement (final String outputID)
        throws SystemException, NamingException, SQLException, JDOMException, IOException
    {
        Element printOptionsElement = null;
        SAXBuilder builder = null;
        Document printOptionsDocument = null;

        final Context ctx = new InitialContext ();
        Connection conn = null;
        Statement statement = null;
        try
        {
            if (ctx == null)
            {
                throw new SystemException ("Boom - No Context while trying to get PrintOptions");
            }
            final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
            if (ds != null)
            {
                conn = ds.getConnection ();
                if (conn != null)
                {
                    statement = conn.createStatement ();
                    statement.execute ("SELECT PDF_SOURCE FROM WP_OUTPUT WHERE OUTPUT_ID = " + outputID);
                    final ResultSet rs = statement.getResultSet ();
                    if (rs.next ())
                    {
                        final Blob blob = rs.getBlob (1);
                        // InputStream is = blob.getBinaryStream();

                        final long length = blob.length ();
                        final byte[] buffer = blob.getBytes (1, (int) length);
                        final String blobString = new String (buffer, "UTF8");
                        final InputSource source = new InputSource (new StringReader (blobString));
                        builder = new SAXBuilder ();
                        printOptionsDocument = builder.build (source);
                        printOptionsElement = printOptionsDocument.getRootElement ().getChild ("printOptions");
                    }
                }
            }
        }
        finally
        {
            if (statement != null)
            {
                statement.close ();
            }
            if (conn != null)
            {
                conn.close ();
            }
        }

        return printOptionsElement;
    }

    /**
     * Request print.
     *
     * @param reportID the report ID
     * @param outputID the output ID
     * @param printElement the print element
     * @return The response document.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document requestPrint (final String reportID, final String outputID, final Element printElement)
        throws SystemException, BusinessException
    {

        final XMLOutputter outputter = new XMLOutputter (Format.getCompactFormat ());

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Element reportReferenceElement = new Element ("ReportReference");
        XMLBuilder.add (reportReferenceElement, "Id", reportID);

        final Element xslFOReportElement = new Element ("XSLFOReportRequest");
        xslFOReportElement.addContent (printElement);
        xslFOReportElement.addContent (reportReferenceElement);

        final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
        final Element fwElement = (Element) ((Element) xslFOReportElement.clone ()).detach ();
        XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
        final String requestReprintParams = outputter.outputString (requestReportParamsElement);
        log.debug ("FW Print XML : " + requestReprintParams);

        log.info ("Submitting Report Print Request to Framework Reporting Service...");
        final Document runOrderPrintingResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "reportAndPrintLocal", requestReprintParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Response from FW Printing Service : " + outputter.outputString (runOrderPrintingResponseDoc));
        }

        // Now update WP_OUTPUT table to mark it as printed.
        markOutputAsPrinted (outputID);

        return runOrderPrintingResponseDoc;
    }

    /**
     * Mark output as printed.
     *
     * @param outputID the output ID
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void markOutputAsPrinted (final String outputID) throws SystemException, BusinessException
    {
        final XMLOutputter outputter = new XMLOutputter (Format.getCompactFormat ());

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Element markOutputAsPrintedtParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (markOutputAsPrintedtParamsElement, "outputID", outputID);
        final String markOutputAsPrintedtParams = outputter.outputString (markOutputAsPrintedtParamsElement);

        proxy.getJDOM ("ejb/PrintedoutputServiceLocal", "markOutputAsPrintedLocal", markOutputAsPrintedtParams);
    }

    /**
     * (non-Javadoc)
     * Gets the court fap id.
     *
     * @param courtUser the court user
     * @param courtCode the court code
     * @return the court FAP id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getCourtFAPId (final String courtUser, final String courtCode)
        throws SystemException, BusinessException
    {
        String fapId = null;

        final XMLOutputter outputter = new XMLOutputter (Format.getCompactFormat ());

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Element fapParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (fapParamsElement, "userId", courtUser);
        XMLBuilder.addParam (fapParamsElement, "courtId", courtCode);
        final String fapParams = outputter.outputString (fapParamsElement);

        log.debug ("Calling Court.getCourtFapByUserLocal to get fap server for court : " + courtCode);
        final Document fapResponseDoc = proxy.getJDOM ("ejb/CourtServiceLocal", "getCourtFapByUserLocal", fapParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("FAP Response : " + outputter.outputString (fapResponseDoc));
        }

        final Element fapResponseRootElement = fapResponseDoc.getRootElement ();
        final Element courtDetailsElement = fapResponseRootElement.getChild ("CourtDetails");
        if (courtDetailsElement != null)
        {
            final Element fapIDElement = courtDetailsElement.getChild ("FAPId");
            if (fapIDElement == null)
            {
                throw new SystemException ("FAP ID is not allocated to Court : " + courtCode);
            }
            fapId = fapIDElement.getText ();
            log.debug ("FAP ID : " + fapId);
            if (fapId.length () < 1)
            {
                throw new SystemException (
                        "Report Not generated. Print Server ID is not allocated to Court : " + courtCode);
            }
        }

        return fapId;
    }

}
