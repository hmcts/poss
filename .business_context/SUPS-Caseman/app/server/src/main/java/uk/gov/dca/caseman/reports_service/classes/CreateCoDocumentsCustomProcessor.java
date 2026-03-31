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
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

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
 * Service: Reports Method: CreateDocuments
 * Class: CreateCoDocumentsCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 5 dec 2005
 * 
 *         version history
 *         ---------------
 *         v1.0 chris hutt 5/12/2005
 * 
 *         Description: Runs the Co Start of Day Reports
 * 
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class CreateCoDocumentsCustomProcessor implements ICustomProcessor
{

    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The out. */
    private final XMLOutputter out;

    /**
     * Start of day service name.
     */
    public static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";
    /**
     * Get order type details method name.
     */
    public static final String GET_ORDER_TYPE_DETAILS = "getOrderTypeDetailsLocal";
    /**
     * Reports service name.
     */
    public static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    /**
     * Request report method name.
     */
    public static final String REQUEST_REPORT = "runReportLocal";

    /**
     * Constructor.
     */
    public CreateCoDocumentsCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getPrettyFormat ());

    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {

        Element coEventDetailsElement = null;
        Element coEventDetailElement = null;
        final Element elementReturned = null;
        final Element generatedDocsElement = null;
        List<Element> coEventDetailsList = null;

        final boolean outputsProduced = false;

        String coEventSeq = null;
        String coOrderTypeId = null;
        String userId = null;
        String courtId = null;
        String printNow = null;

        XMLOutputter xmlOutputter = null;
        String sXml = null;

        final boolean tickBox = false;

        final RequestReportXMLBuilder requestReportBuilder = null;
        final Element RequestReportElement = null;
        final Element paramsElement = null;

        try
        {

            coEventDetailsElement =
                    (Element) XPath.selectSingleNode (params, "params/param[@name='coEventDetails']/CoEventDetails");
            printNow = ((Element) XPath.selectSingleNode (params, "params/param[@name='printNow']")).getText ();
            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId']")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            /* loop through the events */
            coEventDetailsList = coEventDetailsElement.getChildren ("CoEventDetail");
            final Iterator<Element> it = coEventDetailsList.iterator ();
            // while (it.hasNext())
            if (it.hasNext ())
            {
                /* Now we have the CoEventDetails. */
                coEventDetailElement = (Element) it.next ();
                coEventSeq = coEventDetailElement.getChildText ("CoEventSeq");
                coOrderTypeId = coEventDetailElement.getChildText ("CoOrderTypeId");

                log.debug ("coEventSeq: " + coEventSeq);
                log.debug ("coOrderTypeId: " + coOrderTypeId);

                /* Produce Documents associated with this event */
                mGenerateDocsForEvent (coEventSeq, printNow, userId, courtId, log, coOrderTypeId);
            }

            /* Return details of next report to be run to the client */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (new Element ("ds"));
            writer.write (sXml);

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

    /* Run Document creates appropriate to the event being processed */

    /**
     * M generate docs for event.
     *
     * @param pcoEventSeq the pco event seq
     * @param pPrintNow the print now
     * @param pSubmittedBy the submitted by
     * @param pCourtId the court id
     * @param pLog the log
     * @param pOrderType the order type
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mGenerateDocsForEvent (final String pcoEventSeq, final String pPrintNow, final String pSubmittedBy,
                                        final String pCourtId, final Log pLog, final String pOrderType)
        throws BusinessException, SystemException
    {

        Element orderTypesDetailElement = null;
        final String orderType = null;
        RequestReportXMLBuilder requestReportBuilder = null;

        // Create to requestReportBuilder (an object holding params which can be easily
        // converted into XML for submission to report service) and load with common properties
        requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                "", // String pPrintJobId
                "", // String pJobId
                pCourtId, // String pCourtCode
                pSubmittedBy // String pCourtUser
        );

        orderTypesDetailElement = mGetOrderTypeDetails (pOrderType);
        if (null != orderTypesDetailElement)
        {
            requestReportBuilder.addSpecificParameter ("P_DOCUMENT_ID", pOrderType);
            requestReportBuilder.addSpecificParameter ("P_EVENT_SEQ", pcoEventSeq);
            requestReportBuilder.addSpecificParameter ("P_PRINT_NOW", pPrintNow);
            // requestReportBuilder.addSpecificParameter("P_SUBMITTED_BY", pSubmittedBy); //not required anymore for
            // SUPs
            // requestReportBuilder.addSpecificParameter("MODE", "BITMAP"); //not required anymore for SUPs
            requestReportBuilder.setReportModuleGroup ("CO");
            mRunReport (orderTypesDetailElement.getChildText ("ModuleName"), requestReportBuilder);
            pLog.debug ("About to run report :" + orderTypesDetailElement.getChildText ("ModuleName"));
        }
    }

    /**
     * M get order type details.
     *
     * @param pOrderType the order type
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetOrderTypeDetails (final String pOrderType) throws BusinessException, SystemException
    {

        Element resultElement = null;
        Element orderTypeElement = null;
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element orderTypeParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (orderTypeParamsElement, "orderType", pOrderType);

            resultElement = localServiceProxy
                    .getJDOM (START_OF_DAY_SERVICE, GET_ORDER_TYPE_DETAILS, getXMLString (orderTypeParamsElement))
                    .getRootElement ();

            orderTypeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/OrderType");
            // orderTypeElement.detach();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return orderTypeElement;
    }

    /**
     * M run report.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void mRunReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {

        Element RequestReportElement = null;
        Element paramsElement = null;
        String reportParams = null;

        pRequestReportXMLBuilder.setReportModule (pReport + ".rdf");
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        reportParams = getXMLString (paramsElement);

        localServiceProxy.getJDOM (REPORTS_SERVICE, REQUEST_REPORT, reportParams).getRootElement ();
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * Gets the XML string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Element e)
    {
        return out.outputString (e);
    }

}