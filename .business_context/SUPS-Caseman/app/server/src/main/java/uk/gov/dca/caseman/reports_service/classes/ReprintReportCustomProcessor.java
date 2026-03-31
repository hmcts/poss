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

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
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
public class ReprintReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ReprintReportCustomProcessor.class);

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
        Element reportData = null;
        String reportId = null;
        String reportName = null;
        String aeSODEventsInd = "false";

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

            reportData = (Element) XPath.selectSingleNode (params, "params/param[@name='ReprintReport'");
            final Element moduleNameElement = reportData.getChild ("SuitorsCashReport").getChild ("ModuleName");
            if (moduleNameElement != null)
            {
                // Coming from Suitor's Cash Reprint screen
                reportName = reportData.getChild ("SuitorsCashReport").getChild ("ModuleName").getText ();
                final Element aeSODEventsIndElement =
                        reportData.getChild ("SuitorsCashReport").getChild ("ReprintEvents");
                if (null != aeSODEventsIndElement)
                {
                    aeSODEventsInd = aeSODEventsIndElement.getText ();
                }
            }
            else
            {
                // Coming from Events screen
                reportName = reportData.getChild ("SuitorsCashReport").getChild ("OrderId").getText ();
            }

            reportId = reportData.getChild ("SuitorsCashReport").getChild ("FWReportId").getText ();

            final Element printElement = getPrintElement (reportName, courtId, userId);
            if (log.isDebugEnabled ())
            {
                log.debug ("ReprintReportCustomProcessor.process Print Element : " +
                        outputter.outputString (printElement));
            }
            final Element reportReferenceElement = new Element ("ReportReference");
            XMLBuilder.add (reportReferenceElement, "Id", reportId);

            final Element oracleReportElement = new Element ("OracleReportRequest");
            oracleReportElement.addContent (printElement);
            oracleReportElement.addContent (reportReferenceElement);

            final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
            final Element fwElement = (Element) ((Element) oracleReportElement.clone ()).detach ();
            XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
            final String requestReprintParams = outputter.outputString (requestReportParamsElement);
            log.debug ("FW Print XML : " + requestReprintParams);

            final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

            log.debug ("Submitting Report Reprint Request to Framework Reporting Service...");
            final Document requestReprintResponseDoc =
                    proxy.getJDOM ("ejb/ReportsServiceLocal", "reportAndPrintLocal", requestReprintParams);

            if (reportName.equals ("CM_AUTH_LST") && aeSODEventsInd.equals ("true"))
            {
                // User has requested to reprint the individual AE Events associated with the AE Start of Day
                Element aeEventOutputElement = null; // The returned element.
                final Element aeEventOutputsElement = getAESODEventOutputs (reportId, userId, courtId);

                /* loop through the AE Event outputs created in the AE Start of Day */
                final List<Element> aeEventOutputList = aeEventOutputsElement.getChildren ("AeEventOutput");
                final Iterator<Element> it = aeEventOutputList.iterator ();
                while (it.hasNext ())
                {
                    aeEventOutputElement = (Element) it.next ();
                    reprintAEEventOutputs (aeEventOutputElement, userId);
                }
            }

            if (log.isDebugEnabled ())
            {
                log.debug ("Response from FW Printing Service : " + outputter.outputString (requestReprintResponseDoc));
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        /* Framework dictates that something must be returned to the client */
        return params;
    }

    /**
     * Reprints an AE Event Output associated with the AE Start of Day.
     *
     * @param aeEventOutputElement AE Event Output Element
     * @param userId User Id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void reprintAEEventOutputs (final Element aeEventOutputElement, final String userId)
        throws SystemException, BusinessException
    {

        final String reportId = aeEventOutputElement.getChildText ("ReportId");
        final Element reportReferenceElement = new Element ("ReportReference");
        XMLBuilder.add (reportReferenceElement, "Id", reportId);

        String printerType = "P";
        String noOfCopies = "1";
        String tray = "";
        String printer = null;
        String fap = null;

        if (aeEventOutputElement != null)
        {
            printerType = aeEventOutputElement.getChild ("PrinterType").getText ();
            noOfCopies = aeEventOutputElement.getChild ("Copies").getText ().equals ("") ? "1"
                    : aeEventOutputElement.getChild ("Copies").getText ();
            tray = aeEventOutputElement.getChild ("Tray").getText ();
            tray = Integer.toString (Integer.parseInt (tray) - 1);
            if ( !tray.equals ("0"))
            {
                tray = "";
            }
            printer = aeEventOutputElement.getChild ("Printer").getText ();
            fap = aeEventOutputElement.getChild ("FAPId").getText ();

            if (printer.length () < 1)
            {
                throw new SystemException (
                        "Report Not generated. User does not have a default printer allocated : " + userId);
            }
        }

        final Element printElement = new Element ("Print");
        XMLBuilder.add (printElement, "Type", "pdf2ps");
        final Element destinationElement = new Element ("Destination");
        XMLBuilder.add (destinationElement, "Server", fap);
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

        final Element oracleReportElement = new Element ("OracleReportRequest");
        oracleReportElement.addContent (printElement);
        oracleReportElement.addContent (reportReferenceElement);

        final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
        final Element fwElement = (Element) ((Element) oracleReportElement.clone ()).detach ();
        XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();
        final String requestReprintParams = outputter.outputString (requestReportParamsElement);
        final Document requestReprintResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "reportAndPrintLocal", requestReprintParams);

        if (log.isDebugEnabled ())
        {
            log.debug ("Response from FW Printing Service : " + outputter.outputString (requestReprintResponseDoc));
        }
    }

    /**
     * (non-Javadoc)
     * Create a print options framework element.
     *
     * @param reportName the report name
     * @param courtCode the court code
     * @param courtUser the court user
     * @return the prints the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getPrintElement (final String reportName, final String courtCode, final String courtUser)
        throws SystemException, BusinessException
    {
        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", reportName);

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
        String tray = "";

        if (rowElement != null)
        {
            printerType = rowElement.getChild ("PRINTER_TYPE").getText ();
            noOfCopies = rowElement.getChild ("NO_OF_COPIES").getText ().equals ("") ? "1"
                    : rowElement.getChild ("NO_OF_COPIES").getText ();
            tray = rowElement.getChild ("TRAY").getText ();
            tray = Integer.toString (Integer.parseInt (tray) - 1);
            if ( !tray.equals ("0"))
            {
                tray = "";
            }
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
     * Get the fap id for the court.
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
     * Retrieves information on the AE Start of Day Event outputs.
     *
     * @param pParentId Parent Id of the AUTH_LST report
     * @param pUserId User Id
     * @param pCourtId Court Code
     * @return the AESOD event outputs
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element getAESODEventOutputs (final String pParentId, final String pUserId, final String pCourtId)
        throws BusinessException, SystemException
    {
        final AbstractSupsServiceProxy mProxy = new SupsLocalServiceProxy ();
        final XMLOutputter mOutputter = new XMLOutputter (Format.getCompactFormat ());

        Element aeEventOutputsElement = null;
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element aeEventOuputsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (aeEventOuputsParamsElement, "authLstId", pParentId);
            XMLBuilder.addParam (aeEventOuputsParamsElement, "userId", pUserId);
            XMLBuilder.addParam (aeEventOuputsParamsElement, "courtId", pCourtId);

            final Element resultElement = mProxy.getJDOM ("ejb/StartOfDayServiceLocal", "getAeSodChildOutputsLocal",
                    mOutputter.outputString (aeEventOuputsParamsElement)).getRootElement ();

            aeEventOutputsElement = (Element) XPath.selectSingleNode (resultElement, "/AeEventOutputs");
            aeEventOutputsElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeEventOutputsElement;
    }// End getEventOutputs()

}
