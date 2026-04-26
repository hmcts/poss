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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class PrintEX77ReportCustomProcessor.
 */
public class PrintEX77ReportCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The out. */
    private final XMLOutputter out;

    /** The Constant REPORTS_SERVICE. */
    // Services.
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "runReportLocal";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (PrintEX77ReportCustomProcessor.class);

    /**
     * Constructor.
     */
    public PrintEX77ReportCustomProcessor ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
    }

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
        RequestReportXMLBuilder requestReportBuilder = null;
        String userId = null;
        String courtId = null;
        String returnDate = null;
        int countEX77 = 0;
        int countWelshEX77 = 0;

        try
        {

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId']")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId']")).getText ();
            returnDate = ((Element) XPath.selectSingleNode (params, "params/param[@name='returnDate']")).getText ();
            countEX77 = Integer.parseInt (
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='countEX77']")).getText ());
            countWelshEX77 = Integer.parseInt (
                    ((Element) XPath.selectSingleNode (params, "params/param[@name='countWelshEX77']")).getText ());

            // Create to requestReportBuilder (a object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    courtId, // String pCourtCode
                    userId // String pCourtUser
            );

            requestReportBuilder.addSpecificParameter ("P_START_DATE", returnDate);

            Document runReportResponseDoc = null;
            if (countWelshEX77 > 0)
            {
                runReportResponseDoc = mRunReport ("CM_EX77_WE.rdf", requestReportBuilder);
            }

            if (countEX77 > 0)
            {
                runReportResponseDoc = null;
                runReportResponseDoc = mRunReport ("CM_EX77.rdf", requestReportBuilder);
            }

            /* Framework dictates that something must be returned to the client */
            return runReportResponseDoc;

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Runs Report.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document mRunReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {

        Element RequestReportElement = null;
        Element paramsElement = null;
        Document reportParamsDoc = null;

        Document runReportResponseDoc = null;

        pRequestReportXMLBuilder.setReportModule (pReport);
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        reportParamsDoc = new Document ();

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());
        // reportParams = getXMLString(paramsElement);
        reportParamsDoc.addContent (((Element) paramsElement.clone ()).detach ());
        if (log.isDebugEnabled ())
        {
            log.debug ("Bailiff Report DOM" + out.outputString (reportParamsDoc));
        }
        runReportResponseDoc = invokeLocalServiceProxy (REPORTS_SERVICE, REQUEST_REPORT, reportParamsDoc);

        return runReportResponseDoc;

    }

}