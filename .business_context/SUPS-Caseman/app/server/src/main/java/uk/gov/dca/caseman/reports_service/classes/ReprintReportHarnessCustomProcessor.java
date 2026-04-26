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
package uk.gov.dca.caseman.reports_service.classes;

import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Change History:
 * 16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Anoop Sehdev
 * 
 *         Change History:
 *         08-Feb-2008 Chris Vincent: CaseMan Defect 6181. Changed the method getCourtFAPId() to use a different
 *         retrieval service to lookup the user printer court instead of the fap id associated with the
 *         user's home court.
 */
public class ReprintReportHarnessCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ReprintReportHarnessCustomProcessor.class);

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
        Element reportIdElement = null;
        String reportId = null;

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());

        try
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("ReprintReportCustomProcessor.process received following XML : " +
                        outputter.outputString (params));
            }
            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId'")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            reportIdElement = (Element) XPath.selectSingleNode (params, "params/param[@name='reportId'");
            reportId = reportIdElement.getText ();

            final Element printElement = getPrintElement (courtId, userId, reportId);
            if (log.isDebugEnabled ())
            {
                log.debug ("ReprintReportCustomProcessor.process Print Element : " +
                        outputter.outputString (printElement));
            }
            final Element reportReferenceElement = new Element ("ReportReference");
            XMLBuilder.add (reportReferenceElement, "Id", reportId);

            resetPrintStatus (reportId);

            final Element oracleReportElement = new Element ("OracleReportRequest");
            oracleReportElement.addContent (printElement);
            oracleReportElement.addContent (reportReferenceElement);

            final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
            final Element fwElement = (Element) ((Element) oracleReportElement.clone ()).detach ();
            XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
            final String requestReprintParams = outputter.outputString (requestReportParamsElement);
            log.debug ("FW Print XML : " + requestReprintParams);

            final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

            log.info ("Submitting Report Reprint Request to Framework Reporting Service...");
            final Document requestReprintResponseDoc =
                    proxy.getJDOM ("ejb/ReportsServiceLocal", "reportAndPrintLocal", requestReprintParams);
            if (log.isDebugEnabled ())
            {
                log.debug ("Response from FW Printing Service : " + outputter.outputString (requestReprintResponseDoc));
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return params;
    }

    /**
     * (non-Javadoc)
     * Create a framework print options element.
     *
     * @param courtCode the court code
     * @param courtUser the court user
     * @param reportId the report id
     * @return the prints the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private Element getPrintElement (final String courtCode, final String courtUser, final String reportId)
        throws SystemException, BusinessException, JDOMException, IOException
    {
        final String reportNameFromDB = getReportName (courtCode, courtUser, reportId);

        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", reportNameFromDB);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String reportPrintParams = outputter.outputString (reportPrintParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling ReportsServiceLocal.getReportPrintInformationLocal to get report information");
        final Document reportPrintResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getReportPrintInformationLocal", reportPrintParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Report Information returned : " + outputter.outputString (reportPrintResponseDoc));
        }
        final Element reportPrintRootElement = reportPrintResponseDoc.getRootElement ();

        final Element rowElement = reportPrintRootElement.getChild ("row");
        String printerType = "P";
        String noOfCopies = "1";
        String tray = "1";

        if (rowElement != null)
        {
            printerType = rowElement.getChild ("PRINTER_TYPE").getText ();
            noOfCopies = rowElement.getChild ("NO_OF_COPIES").getText ().equals ("") ? "1"
                    : rowElement.getChild ("NO_OF_COPIES").getText ();
            tray = rowElement.getChild ("TRAY").getText ();
            tray = Integer.toString (Integer.parseInt (tray) - 1);
        }

        String printer = null;
        final Element userInformationParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (userInformationParamsElement, "userId", courtUser);
        XMLBuilder.addParam (userInformationParamsElement, "courtId", courtCode);
        final String userInformationParams = outputter.outputString (userInformationParamsElement);

        log.debug ("Calling ReportsServiceLocal.getUserInformationLocal to get printer information");
        final Document userInformationResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getUserInformationLocal", userInformationParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("User Information returned : " + outputter.outputString (userInformationResponseDoc));
        }

        final Element userInformationRootElement = userInformationResponseDoc.getRootElement ();
        final Element userInfoRowElement = userInformationRootElement.getChild ("row");
        if (userInfoRowElement != null)
        {
            printer = userInfoRowElement.getChild ("PRINTER").getText ();
            log.debug ("User Printer : " + printer);
            if (printer.length () < 1)
            {
                throw new SystemException (
                        "Report Not generated. User does not have a default printer allocated : " + courtUser);
            }
        }

        final Element printElement = new Element ("Print");
        XMLBuilder.add (printElement, "Type", "pdf2ps");

        final Element destinationElement = new Element ("Destination");
        XMLBuilder.add (destinationElement, "Server", getCourtFAPId (courtUser, courtCode));
        XMLBuilder.add (destinationElement, "Printer", printer);

        printElement.addContent (destinationElement);

        final Element optionsElement = new Element ("Options");
        XMLBuilder.add (optionsElement, "Tray", tray);
        XMLBuilder.add (optionsElement, "NumCopies", noOfCopies);
        if (printerType.equals ("D"))
        {
            XMLBuilder.add (optionsElement, "Duplex", "true");
        }
        else
        {
            XMLBuilder.add (optionsElement, "Duplex", "false");
        }

        printElement.addContent (optionsElement);

        return printElement;
    }

    /**
     * (non-Javadoc)
     * Get the report name.
     *
     * @param courtCode the court code
     * @param courtUser the court user
     * @param reportId the report id
     * @return the report name
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    private String getReportName (final String courtCode, final String courtUser, final String reportId)
        throws SystemException, BusinessException, JDOMException, IOException
    {
        String reportName = null;
        final String paramXML = getParamXML (reportId);
        final SAXBuilder builder = new SAXBuilder ();
        final StringReader reader = new StringReader (paramXML);
        final Document paramDoc = builder.build (reader);
        final Element paramRootElement = paramDoc.getRootElement ();
        reportName = paramRootElement.getChild ("report").getText ();
        reportName = reportName.substring (0, reportName.lastIndexOf ("."));
        log.debug ("Report Name : " + reportName);
        return reportName;
    }

    /**
     * (non-Javadoc)
     * Get the reports params xml from the database.
     *
     * @param reportId the report id
     * @return the param XML
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getParamXML (final String reportId) throws SystemException, BusinessException
    {
        String paramXML = null;
        final Element paramXMLParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramXMLParamsElement, "reportId", reportId);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String paramXMLParams = outputter.outputString (paramXMLParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.trace ("Calling ReportsServiceLocal.getReportQueueInfoLocal...");
        final Document reportQueueInfoRespDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getReportQueueInfoLocal", paramXMLParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Report Queue Returned : " + outputter.outputString (reportQueueInfoRespDoc));
        }

        final Element reportQueueInfoRootElement = reportQueueInfoRespDoc.getRootElement ();
        paramXML = reportQueueInfoRootElement.getChild ("Report").getChild ("PARAM_XML").getText ();
        return decodeXML (paramXML);
    }

    /**
     * (non-Javadoc)
     * Decode the params xml.
     *
     * @param paramXML the param XML
     * @return the string
     * @throws SystemException the system exception
     */
    private String decodeXML (final String paramXML) throws SystemException
    {
        String decodedXML = null;
        try
        {
            decodedXML = URLDecoder.decode (paramXML, "UTF-8");
        }
        catch (final UnsupportedEncodingException e)
        {
            throw new SystemException ("Unable to get Decoded Parameter XML", e);
        }
        log.debug ("Decoded PARAM XML : " + decodedXML);
        return decodedXML;
    }

    /**
     * (non-Javadoc)
     * Get the courts fap id.
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

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());

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

    /**
     * Resets the print status.
     *
     * @param reportId The report id.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void resetPrintStatus (final String reportId) throws SystemException, BusinessException
    {
        final Element resetPrintStatusParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (resetPrintStatusParamsElement, "reportId", reportId);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String resetPrintStatusParams = outputter.outputString (resetPrintStatusParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling ReportsServiceLocal.resetStatusForReprintLocal to reset Print Status...");
        final Document resetPrintStatusResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "resetStatusForReprintLocal", resetPrintStatusParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Print Status Returned : " + outputter.outputString (resetPrintStatusResponseDoc));
        }

        final Element reportPrintRootElement = resetPrintStatusResponseDoc.getRootElement ();
    }
}
