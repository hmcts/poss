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
 * Class: CreateAeDocumentsCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 5 dec 2005
 * 
 *         version history
 *         ---------------
 *         v1.0 chris hutt 5/12/2005
 * 
 *         Description: Runs the Ae Start of Day Reports
 * 
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689
 * 
 *         22/06/06 Chris Hutt - system data lookup - now looks for a global item
 */
public class CreateAeDocumentsCustomProcessor implements ICustomProcessor
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
     * Is event for ae on date method name.
     */
    public static final String IS_EVENT_FOR_AE_ON_DATE = "isEventForAeOnDateLocal";
    /**
     * get ae event outputs method name.
     */
    public static final String GET_AE_EVENT_OUTPUTS = "getAeEventOutputsLocal";
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
     * System data service name.
     */
    public static final String SYSTEM_DATA_SERVICE = "ejb/SystemDataServiceLocal";
    /**
     * Get system data item method name.
     */
    public static final String GET_SYSTEM_DATA_ITEM = "getSystemDataItemLocal";

    /**
     * Constructor.
     */
    public CreateAeDocumentsCustomProcessor ()
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

        Element aeEventSeqsElement = null;
        Element aeEventSeqElement = null;
        final Element elementReturned = null;
        Element generatedDocsElement = null;
        List<Element> aeEventList = null;

        boolean outputsProduced = false;

        String aeEventSeq = null;
        String printNow = null;
        String dailyReports = null;
        String submittedBy = null;
        final String userId = null;
        String courtId = null;

        XMLOutputter xmlOutputter = null;
        String sXml = null;

        String firstRptValue = null;
        final String lastRptValue = null;
        String tickBoxValue = null;

        boolean tickBox = false;

        final RequestReportXMLBuilder requestReportBuilder = null;
        final Element RequestReportElement = null;
        final Element paramsElement = null;

        try
        {

            aeEventSeqsElement = (Element) XPath.selectSingleNode (params,
                    "params/param[@name='aeEventSequences']/AeEventSequences");
            printNow = ((Element) XPath.selectSingleNode (params, "params/param[@name='printNow']")).getText ();
            dailyReports = ((Element) XPath.selectSingleNode (params, "params/param[@name='dailyReports']")).getText ();
            submittedBy = ((Element) XPath.selectSingleNode (params, "params/param[@name='submittedBy']")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId'")).getText ();

            /* get tick box option for this court */

            tickBoxValue = mSystemDataItemValue ("TICK BOX", "0");
            if (tickBoxValue.equals ("1"))
            {
                tickBox = true;
            }
            else
            {
                tickBox = false;
            }

            /* loop through the events */
            aeEventList = aeEventSeqsElement.getChildren ("AeEventSeq");
            final Iterator<Element> it = aeEventList.iterator ();
            while (it.hasNext ())
            {
                /* Now we have the AeEventSeq. */
                aeEventSeqElement = (Element) it.next ();
                aeEventSeq = aeEventSeqElement.getText ();

                log.debug ("aeEventSeq: " + aeEventSeq);

                /* Produce Documents associated with this event */
                generatedDocsElement =
                        mGenerateDocsForEvent (aeEventSeq, printNow, dailyReports, submittedBy, courtId, tickBox, log);

                if ( !outputsProduced)
                {
                    if (generatedDocsElement.getChildText ("OutputsToProduce").equals ("true"))
                    {

                        log.debug ("firstRptValue" + firstRptValue);
                        firstRptValue = generatedDocsElement.getChildText ("ModuleName");
                        outputsProduced = true;
                    }
                }
                if (generatedDocsElement.getChildText ("Update").equals ("true"))
                {
                    break;
                }
            }

            /* This run has generated some output.
             * Run the appropriate final report */

            /* This is no longer required in SUPs. In lagacy, the final was directly invoked without any order Id's
             * and event sequences. This isn't possible in SUPs. The module name is always the same as the previous
             * report.
             * 
             * if (outputsProduced){
             * 
             * lastRptValue = generatedDocsElement.getChildText("ModuleName");
             * 
             * log.debug("lastRptValue" + lastRptValue);
             * 
             * mGenerateFinalReport( dailyReports,
             * submittedBy,
             * courtId,
             * lastRptValue,
             * firstRptValue,
             * log);
             * } */

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

    /* Generate documents appropriate to the event being processed */

    /**
     * M generate docs for event.
     *
     * @param pAeEventSeq the ae event seq
     * @param pPrintNow the print now
     * @param pDailyReports the daily reports
     * @param pSubmittedBy the submitted by
     * @param pCourtId the court id
     * @param pTickBox the tick box
     * @param pLog the log
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGenerateDocsForEvent (final String pAeEventSeq, final String pPrintNow, final String pDailyReports,
                                           final String pSubmittedBy, final String pCourtId, final boolean pTickBox,
                                           final Log pLog)
        throws BusinessException, SystemException
    {

        Element rtnElement = null;
        Element outputsToProduceElement = null;
        Element initialOrderTypeElement = null;
        Element lastOrderTypeElement = null;
        Element updateElement = null;
        Element orderTypesDetailElement = null;
        Element moduleNameElement = null;

        Element aeEventOutputsElement = null;
        Element aeEventOutputElement = null;
        List<Element> aeEventOutputList = null;

        boolean outputToProduce = false;
        boolean runReport = false;
        boolean updateFlag = false;

        String orderType = null;
        String documentType = null;

        RequestReportXMLBuilder requestReportBuilder = null;

        rtnElement = new Element ("OutputDetail");
        outputsToProduceElement = new Element ("OutputsToProduce");
        initialOrderTypeElement = new Element ("InitialOrderType");
        lastOrderTypeElement = new Element ("LastOrderType");
        updateElement = new Element ("Update");
        moduleNameElement = new Element ("ModuleName");

        moduleNameElement.setText ("");

        outputsToProduceElement.setText ("false");
        updateElement.setText ("false");

        // Create to requestReportBuilder (an object holding params which can be easily
        // converted into XML for submission to report service) and load with common properties
        /* // Moved creation of a new object into the while loop so that a fresh object is always created
         * requestReportBuilder = new RequestReportXMLBuilder(
         * "", //String pReportModule
         * "", //String pPrintJobId
         * "", //String pJobId
         * pCourtId, //String pCourtCode
         * pSubmittedBy //String pCourtUser
         * ); */
        /* get output definitions associated with this AeEvent */
        aeEventOutputsElement = mGetEventOutputs (pAeEventSeq);

        /* loop through the output definitions for this event */
        aeEventOutputList = aeEventOutputsElement.getChildren ("AeEventOutput");
        final Iterator<Element> it = aeEventOutputList.iterator ();
        while (it.hasNext ())
        {
            // Moved creation of a new object into the while loop so that a fresh object is always created
            requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    pCourtId, // String pCourtCode
                    pSubmittedBy // String pCourtUser
            );
            /* Now we have the output definition. */
            aeEventOutputElement = (Element) it.next ();

            /* Capture detail of first output */
            if ( !outputToProduce)
            {
                outputToProduce = true;
                outputsToProduceElement.setText ("true");
                initialOrderTypeElement.setText (aeEventOutputElement.getChildText ("OrderType"));
            }

            runReport = true;

            if (pDailyReports.equals ("U")) // This will never happen as pDailyReports will always be Y or T
            {
                orderType = "P_NS"; // Hence this is not required for SUPS
                updateFlag = true;
            }
            else if (pDailyReports.equals ("T")) // For tickbox forms (event ID 174.)
            {

                orderType = aeEventOutputElement.getChildText ("ReportValue1");
                // orderType = aeEventOutputElement.getChildText("OrderType"); // TD388 Revert back to reportValue1 and
                // if it is null or empty, do not print any report.

                if (null == orderType || "".equals (orderType))
                {
                    continue;
                }

                updateFlag = true;
            }
            else
            {
                orderType = aeEventOutputElement.getChildText ("OrderType");
            }

            pLog.debug ("Standard Event:" + aeEventOutputElement.getChildText ("StandardEventId"));
            pLog.debug ("Process Stage:" + aeEventOutputElement.getChildText ("ProcessStage"));

            if (aeEventOutputElement.getChildText ("StandardEventId").equals ("852") &&
                    aeEventOutputElement.getChildText ("ProcessStage").equals ("AUTO") && orderType.startsWith ("P852"))
            {

                /* if processing event 852 and an 871 exists for same Ae and on same day then
                 * suppress production of the P852 */

                if (mEventExists ("871", aeEventOutputElement.getChildText ("AeNumber"),
                        aeEventOutputElement.getChildText ("EventDate")).equals ("true"))
                {
                    runReport = false;

                }
            }
            else if (aeEventOutputElement.getChildText ("StandardEventId").equals ("871") &&
                    aeEventOutputElement.getChildText ("ProcessStage").equals ("AUTO") && orderType.startsWith ("P871"))
            {

                /* if processing an 871 and an 852 exists for same Ae and on same day then
                 * produce a P871-X rather than a P871 */
                if (mEventExists ("852", aeEventOutputElement.getChildText ("AeNumber"),
                        aeEventOutputElement.getChildText ("EventDate")).equals ("true"))
                {
                    orderType = "P871-X";

                }
            }
            pLog.debug ("Order Type: " + orderType);

            if (runReport)
            {
                orderTypesDetailElement = mGetOrderTypeDetails (orderType);
                if (null != orderTypesDetailElement)
                {

                    // Should be a test in here about tick box!
                    documentType = orderTypesDetailElement.getChildText ("DocumentType");
                    pLog.debug ("Document Type = " + documentType);
                    if (documentType.equals ("T") && pTickBox || !documentType.equals ("T"))
                    {

                        pLog.debug ("Report Type = " + orderTypesDetailElement.getChildText ("ReportType"));
                        if (orderTypesDetailElement.getChildText ("ReportType").equals ("R25"))
                        {
                            // addSpecificParameter
                            requestReportBuilder.addSpecificParameter ("P_DOCUMENT_ID", orderType);
                            requestReportBuilder.addSpecificParameter ("P_EVENT_SEQ", pAeEventSeq);
                            requestReportBuilder.addSpecificParameter ("P_PRINT_NOW", pPrintNow);
                            // requestReportBuilder.addSpecificParameter("P_SUBMITTED_BY", pSubmittedBy); //not required
                            // anymore for SUPs
                            // requestReportBuilder.addSpecificParameter("MODE", "BITMAP" ); //not required anymore for
                            // SUPs
                            requestReportBuilder.setReportModuleGroup ("AE");
                            mRunReport (orderTypesDetailElement.getChildText ("ModuleName"), requestReportBuilder);
                            pLog.debug ("About to run report :" + orderTypesDetailElement.getChildText ("ModuleName"));
                            moduleNameElement.setText (orderTypesDetailElement.getChildText ("ModuleName"));

                        }
                    }
                }
            }
            if (updateFlag)
            {
                updateElement.setText ("true");
            }

            // TD388 if report type is T or U, then break out of the while loop after printing one report instead of 12.
            if (pDailyReports.equals ("T") || pDailyReports.equals ("U"))
            {
                break;
            }

        }

        /* Capture detail of last output */
        if (outputToProduce)
        {
            lastOrderTypeElement.setText (aeEventOutputElement.getChildText ("OrderType"));
        }

        rtnElement.addContent (outputsToProduceElement);
        rtnElement.addContent (initialOrderTypeElement);
        rtnElement.addContent (lastOrderTypeElement);
        rtnElement.addContent (updateElement);
        rtnElement.addContent (moduleNameElement);

        return rtnElement;
    }

    /* Get outputs associated with the event */

    /**
     * M get event outputs.
     *
     * @param pAeEventSeq the ae event seq
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Element mGetEventOutputs (final String pAeEventSeq) throws BusinessException, SystemException
    {

        Element resultElement = null;
        Element aeEventOutputsElement = null;
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element aeEventOuputsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (aeEventOuputsParamsElement, "aeEventSeq", pAeEventSeq);

            resultElement = localServiceProxy
                    .getJDOM (START_OF_DAY_SERVICE, GET_AE_EVENT_OUTPUTS, getXMLString (aeEventOuputsParamsElement))
                    .getRootElement ();

            aeEventOutputsElement = (Element) XPath.selectSingleNode (resultElement, "/AeEventOutputs");
            aeEventOutputsElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeEventOutputsElement;
    }

    /* Does an AeEvent of specified type exist on the application with date specified? */

    /**
     * M event exists.
     *
     * @param pAeEventId the ae event id
     * @param pAeNumber the ae number
     * @param pAeEventDate the ae event date
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String mEventExists (final String pAeEventId, final String pAeNumber, final String pAeEventDate)
        throws BusinessException, SystemException
    {

        Element resultElement = null;
        Element rtnElement = null;
        String rtnElementText = null;

        try
        {
            final Element existParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (existParamsElement, "eventId", pAeEventId);
            XMLBuilder.addParam (existParamsElement, "eventDate", pAeEventDate);
            XMLBuilder.addParam (existParamsElement, "aeNumber", pAeNumber);

            resultElement = localServiceProxy
                    .getJDOM (START_OF_DAY_SERVICE, IS_EVENT_FOR_AE_ON_DATE, getXMLString (existParamsElement))
                    .getRootElement ();

            rtnElement = (Element) XPath.selectSingleNode (resultElement, "/ds/AeEvent/AeEventExists");
            rtnElementText = rtnElement.getText ();
            rtnElement.detach ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return rtnElementText;
    }

    /* Get details from OrderTypes */

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

    /* Get details for system_data item */

    /**
     * M system data item value.
     *
     * @param pItem the item
     * @param pCourtId the court id
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String mSystemDataItemValue (final String pItem, final String pCourtId)
        throws BusinessException, SystemException
    {

        Element resultElement = null;
        Element valueElement = null;
        String itemValue = "0";
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element systemdataParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (systemdataParamsElement, "courtCode", pCourtId);
            XMLBuilder.addParam (systemdataParamsElement, "item", pItem);

            resultElement = localServiceProxy
                    .getJDOM (SYSTEM_DATA_SERVICE, GET_SYSTEM_DATA_ITEM, getXMLString (systemdataParamsElement))
                    .getRootElement ();

            valueElement = (Element) XPath.selectSingleNode (resultElement, "/ds/SystemData/ItemValue");
            if (null != valueElement)
            {
                itemValue = ((Element) XPath.selectSingleNode (resultElement, "/ds/SystemData/ItemValue")).getText ();
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return itemValue;
    }

    /**
     * M generate final report. Run the final report associated with this run.
     *
     * @param pDailyReports the daily reports
     * @param pSubmittedBy the submitted by
     * @param pCourtId the court id
     * @param pLastRptValue the last rpt value
     * @param pFirstRptValue the first rpt value
     * @param pLog the log
     * @return true, if successful
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private boolean mGenerateFinalReport (final String pDailyReports, final String pSubmittedBy, final String pCourtId,
                                          final String pLastRptValue, final String pFirstRptValue, final Log pLog)
        throws BusinessException, SystemException
    {

        RequestReportXMLBuilder requestReportBuilder = null;
        String finalRpt = null;

        if ( !pDailyReports.equals ("Y"))
        {
            // Removed running of the CM_DR_F1 "report".

            if (pDailyReports.equals ("U"))
            { // This will never happen as pDailyReports will always be Y or T
                finalRpt = "P_NS"; // Hence this is not required for SUPS
            }
            else if (pDailyReports.equals ("T"))
            {
                finalRpt = pLastRptValue;
            }
            else
            {
                finalRpt = pFirstRptValue;
            }

            // Create to requestReportBuilder (an object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            requestReportBuilder = new RequestReportXMLBuilder (finalRpt, // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    pCourtId, // String pCourtCode
                    pSubmittedBy // String pCourtUser
            );

            pLog.debug ("About to run report :" + finalRpt);

            mRunReport (finalRpt, requestReportBuilder);
        }

        return true;
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

        if (pReport != null && !pReport.equals (""))
        {
            pRequestReportXMLBuilder.setReportModule (pReport + ".rdf");
            RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
            paramsElement = XMLBuilder.getNewParamsElement (new Document ());
            XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

            reportParams = getXMLString (paramsElement);

            localServiceProxy.getJDOM (REPORTS_SERVICE, REQUEST_REPORT, reportParams).getRootElement ();
        }
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