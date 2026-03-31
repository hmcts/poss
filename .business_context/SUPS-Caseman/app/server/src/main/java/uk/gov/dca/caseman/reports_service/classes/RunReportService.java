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
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.StringTokenizer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Requests a report using SUPSReporting.
 * <p>
 * Parameters are derived from the input dom and from static configuration. A
 * new entry is made in the PRINT_JOB table to hold a basic audit trail and a
 * unique printJobId.
 * <p>
 * The input DOM is mapped to a DOM expected by SUPSReporting. Refers to
 * ReportConfig.xml for extra requirements like Creating/Updating System Data
 * table with specific items Polling is dones for only those reports that
 * require it in ReportConfig.xml. For other reports there is either no polling
 * or polling is on the client
 * 
 * @author Anoop Sehdev
 *
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         22-Jun-2006 Kevin Gichohi (EDS): Re-inserted the 'reportId' variable as it's used in the main process method.
 *         22-Jun-2006 MGG : Removed two unused variables that were causing a build problem
 *         16-Aug-2006 Kevin Gichohi (EDS): TD 367 On UCT_CASEMAN. Change the default tray from tray 1 to tray 2
 *         so as to print A5 documents to tray 1.
 * 
 *         04-Dec-2006 Mark Groen (EDS): UAT 811 - Warrants of execution should print from tray three on the printer.
 *         08-Feb-2008 Chris Vincent: CaseMan Defect 6181. Changed the method getCourtFAPId() to use another param
 *         to indicate if the fapid used should be associated with the user's home court or the user's
 *         printer court.
 *         11-Jun-2012 Chris Vincent: Trac 3407. Added method getCVERNo and change to storeReprintsRecord to reference
 *         the new method.
 *         25/11/2015 Chris Vincent: Added bulk printing changes to allow some of the outputs generated
 *         to be sent to bulk print instead of printing locally. Trac 5725.
 *         12/10/2016 Chris Vincent: bulk printing chanegs to ensure outputs on Family Enforcement cases are not
 *         bulk printed. Trac 5883
 */
public class RunReportService extends AbstractComponent implements IGenerator
{

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (RunReportService.class);

    /** The Constant bundle. */
    private static final ResourceBundle bundle =
            ResourceBundle.getBundle ("uk/gov/dca/caseman/reports_service/classes/reportservice");
    
    /** The Constant OUTPUT_TYPE. */
    private static final String OUTPUT_TYPE = bundle.getString ("outputType");
    
    /** The Constant DESTYPE_FW. */
    private static final String DESTYPE_FW = bundle.getString ("desTypeFW");

    /** The Constant TRIES. */
    private static final int TRIES = Integer.parseInt (bundle.getString ("completionAttempts"));
    
    /** The Constant TRY_INTERVAL. */
    private static final long TRY_INTERVAL = Long.parseLong (bundle.getString ("completionAttemptInterval"));
    /**
     * The report storage duration string.
     */
    public static final String REPORT_STORAGE_DURATION = bundle.getString ("report_storage_duration");

    /**
     * (non-Javadoc).
     *
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
     */
    protected void process () throws BusinessException, SystemException
    {
        String printJobId = null; // unique identifier for this request.
        String courtCode = null; // originating court.
        String courtUser = null; // originating user logged in.

        Element reportEl = null;
        Document inputDoc = null;

        // EXAMPLE INPUT DOM:
        // <params>
        // <param name="reportRequest">
        // <Report>
        // <ReportModule>CM_BMS_ALL.rdf</ReportModule>
        // <PrintJobId />
        // <JobId />
        // <CourtCode>111</CourtCode>
        // <CourtUser>Freddie</CourtUser>
        // <specificParameters>
        // <Parameter name="P_REPORT_START_DATE">04-APR-2005</Parameter>
        // <Parameter name="P_REPORT_END_DATE">04-JUN-2005</Parameter>
        // <Parameter name="P_SECTION" />
        // </specificParameters>
        // </Report>
        // </param>
        // <param name="SUPS.userID">anonymousUser</param>
        // </params>

        try
        {
            // Get the input parameters as a JDom:
            // This may be needed in order to retain information at levels above
            // the Report Node.
            // This is because the original dom is processed and cut down by
            // framework pipeline operations.
            final String inputParams = m_dataSrc.toString ();
            final SAXBuilder builder = new SAXBuilder ();
            inputDoc = builder.build (new StringReader (inputParams));
            final Element rootEl = inputDoc.getRootElement ();

            final String standardParamsXpath = "/params/param[@name='reportRequest']/Report";
            final Object standardParams = XPath.selectSingleNode (rootEl, standardParamsXpath);

            if (standardParams == null || !(standardParams instanceof Element))
            {
                throw new SystemException (
                        "The XPath " + standardParamsXpath + " did not identify an element on the incoming message.");
            }

            // Call the updatePrintJob method to generate a unique sequence id
            // and to add audit information to the print job table:
            // Needs to be a seperate transaction so that the update is
            // committed.
            // The returned document is stripped down to only the Report node
            // from the original input, but it now contains additional data.
            final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
            final Document pipelinedDoc =
                    localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "updatePrintJobLocal", inputParams);

            // Log the various versions of the incoming XML
            if (log.isDebugEnabled ()) // save time if don't need to log
            {
                final XMLOutputter outputter = new XMLOutputter ();
                outputter.setFormat (Format.getPrettyFormat ());
                final StringWriter sw1 = new StringWriter ();
                final StringWriter sw2 = new StringWriter ();
                outputter.output (inputDoc, sw1);
                log.debug ("Incoming XML: " + sw1.getBuffer ().toString ());
                outputter.output (pipelinedDoc, sw2);
                log.debug ("Pre-processed XML: " + sw2.getBuffer ().toString ());
            }

            // Extract the standard parameters:
            // if necessary, parameters are available from the original input
            // dom:
            // reportModule =
            // standardParamsEl.getChild("ReportModule").getTextTrim();

            reportEl = pipelinedDoc.getRootElement ();

            // 22-Jun-2006 Kevin Gichohi (EDS): reportModule and reportId don't appear to be used after retrieval.

            // 22-Jun-2006 Kevin Gichohi (EDS): as well as inputDoc, they are used when invoking the report.
            printJobId = reportEl.getChild ("PrintJobId").getTextTrim ();
            courtCode = reportEl.getChild ("CourtCode").getTextTrim ();
            courtUser = reportEl.getChild ("CourtUser").getTextTrim ();
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to read input", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to build JDOM from source", e);
        }

        try
        {
            // Invoke report
            invokeReport (inputDoc, courtCode, courtUser, printJobId);
        }
        catch (final JDOMException e2)
        {
            throw new SystemException ("Unable to Send Job for Reporting or Printing", e2);
        }

    }

    /**
     * Invoke report.
     *
     * @param inputDoc CaseMan Input DOM
     * @param courtCode CourtCode of the loggin user e.g. 282
     * @param courtUser Logged in User e.g. azmnn1
     * @param printJobId Local ID allocated in PrintJob table. Becomes Reference for SUPSReporting
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void invokeReport (final Document inputDoc, final String courtCode, final String courtUser,
                               final String printJobId)
        throws JDOMException, SystemException, BusinessException
    {
        log.debug ("Executing invokeReport...");
        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());

        final Element inputReportElement =
                (Element) XPath.selectSingleNode (inputDoc, "/params/param[@name='reportRequest']/Report");
        final String reportModule = inputReportElement.getChild ("ReportModule").getText ();
        final StringTokenizer token = new StringTokenizer (reportModule, ",");

        while (token.hasMoreTokens ())
        {
            String thisReportModule = null;
            String thisReportOrderId = null;
            final String thisReportModuleAndOrderId = token.nextToken ().trim ();
            final int isOrderIDpresent = thisReportModuleAndOrderId.indexOf (":");
            if (isOrderIDpresent != -1)
            {
                log.debug ("Replacing OrderId for report : " + thisReportModuleAndOrderId);
                thisReportModule = thisReportModuleAndOrderId.substring (0, isOrderIDpresent);
                thisReportOrderId = thisReportModuleAndOrderId.substring (isOrderIDpresent + 1);

            }
            else
            {
                thisReportModule = thisReportModuleAndOrderId;
            }
            final String thisReportID = thisReportModule.substring (0, thisReportModule.lastIndexOf (".rdf"));

            final ArrayList<String> retVal = generateSystemData (courtCode, thisReportID, inputDoc);

            String prefix = null;
            String currentSequence = null;

            if (retVal != null && retVal.size () == 2)
            {
                prefix = (String) retVal.get (0);
                currentSequence = (String) retVal.get (1);
            }

            // Map CaseMan Report Dom (inputDoc) to SUPSReporting DOM
            final Document fwDom = mapToFWDom (inputDoc, courtCode, courtUser, thisReportModule, thisReportOrderId,
                    printJobId, currentSequence, prefix, thisReportID);

            // Wrap SUPSReporting DOM in Parameter XML and send to
            // reportAndPrintLocal service method
            final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
            final Element fwElement = (Element) ((Element) fwDom.getRootElement ().clone ()).detach ();
            XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
            final String requestReportParams = outputter.outputString (requestReportParamsElement);
            log.debug ("FW Report and Print XML : " + requestReportParams);

            final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

            log.debug ("Submitting Report Request to Framework Reporting Service...");
            final Document requestReportResponseDoc =
                    proxy.getJDOM ("ejb/ReportsServiceLocal", "reportAndPrintLocal", requestReportParams);

            if (log.isDebugEnabled ())
            {
                log.debug ("Response from FW Reporting Service : " + outputter.outputString (requestReportResponseDoc));
            }

            // Store FW Report id returned from SUPSReporting in REPORT_OUTPUT
            // table for later retrieval on Events screens
            boolean eventBasedOutput = false;
            final Element reportModuleGroupElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/ReportModuleGroup");
            if (reportModuleGroupElement != null)
            {
                final String reportModuleGroup = reportModuleGroupElement.getText ();
                if (reportModuleGroup != null && (reportModuleGroup.equals ("AE") || reportModuleGroup.equals ("CO") ||
                        reportModuleGroup.equals ("CJR")))
                {
                    storeReportLink (inputDoc, courtCode, courtUser, requestReportResponseDoc, fwDom);
                    eventBasedOutput = true;
                }
            }
            // Wait for completion for certain reports which require clearing of
            // some data after report is finished.
            waitForCompletion (thisReportID, requestReportResponseDoc);

            // Store certain reports for reprinting in REPORT_REPRINTS table.
            storeReprintsRecord (courtCode, courtUser, thisReportID, requestReportResponseDoc, fwDom, currentSequence,
                    inputDoc);

            // Add REPORT_MAP row for outputs to be bulk printed
            if (eventBasedOutput)
            {
                storeReportMapRecord (inputDoc, thisReportOrderId, requestReportResponseDoc, true);
            }
            else
            {
                storeReportMapRecord (inputDoc, thisReportID, requestReportResponseDoc, false);
            }

            if ( !token.hasMoreTokens ())
            {
                try
                {
                    outputter.output (requestReportResponseDoc, m_dataSink);
                }
                catch (final IOException e)
                {
                    throw new SystemException ("Unable to return result from invokeFWReport method", e);
                }
            }

        }
        log.trace ("invokeReport Ends");
    }

    /**
     * Generate System Data value for report after getting it's prefix. If does not exist, create it else encrement it
     * by 1.
     *
     * @param courtCode CourtCode of Logged in user
     * @param thisReportName Report name e.g. CM_CTR_RCPT.
     * @param inputDoc The input document.
     * @return ArrayList item 0 is prefix and item 1 is it's value
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private ArrayList<String> generateSystemData (final String courtCode, final String thisReportName, final Document inputDoc)
        throws SystemException, BusinessException, JDOMException
    {
        final ArrayList<String> retVal = new ArrayList<>();
        String currentSequence = "0";

        String modifiedReportName = thisReportName;

        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);
        if (reportConfigDO != null && reportConfigDO.isUpdateSystemData ())
        {
            modifiedReportName = getModifiedReportName (inputDoc, thisReportName);

            log.debug ("System Data Update Required For Report Prefix : " + modifiedReportName);
            final Element detailedReportInfo = getDetailedReportInformation (modifiedReportName);

            final String prefix = detailedReportInfo.getChild ("FILE_PREFIX").getText ();
            final Element systemDataElement = getSystemDataInformation (courtCode, prefix);
            retVal.add (prefix);

            if (systemDataElement != null)
            {
                final Element currentSequenceElement = systemDataElement.getChild ("ItemValue");
                currentSequence = currentSequenceElement.getText ();
                log.debug ("Current Sequence : " + currentSequence + " for Prefix : " + prefix);
                incrementSystemDataInformation (courtCode, prefix);
            }
            else
            {
                createSystemDataInformation (courtCode, prefix);
            }
        }
        else
        {
            log.debug ("System Data Update not Required : " + modifiedReportName);
        }
        retVal.add (currentSequence);
        return retVal;
    }

    /**
     * Used mainly when CM_PPL report is called. If 'P_CALLING_OPTION' DOM paramter is passed as 'D',
     * then return CM_DIV is used as a report name.
     * CM_DIV is then used to search the ORDER_TYPES table to retrieve prefix which is used to update SYSTEM_DATA table.
     *
     * @param inputDoc RequestReport DOM passed by the client.
     * @param thisReportName Name of Report to be executed.
     * @return String : either thisReportName or CM_DIV (if thisReportName == PPL and P_CALLING_OPTION == D)
     * @throws JDOMException the JDOM exception
     */
    private String getModifiedReportName (final Document inputDoc, final String thisReportName) throws JDOMException
    {
        String modifiedReportName = thisReportName;
        if (thisReportName.equals ("CM_PPL"))
        {
            final Element callingOptionElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='P_CALLING_OPTION']");
            if (callingOptionElement != null)
            {
                final String callingOption = callingOptionElement.getText ();
                if (callingOption != null && callingOption.equals ("D"))
                {
                    modifiedReportName = "CM_DIV";
                    log.debug ("Strange Behaviour : " + modifiedReportName);
                }
            }
        }
        return modifiedReportName;
    }

    /**
     * Get System Data value for UPDATE.
     *
     * @param courtCode CourtCode of the logged in user
     * @param prefix Prefix for SYSTEM_DATA.item field
     * @return The system data info element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getSystemDataInformation (final String courtCode, final String prefix)
        throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", courtCode);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String getSystemDataInfoParams = outputter.outputString (getSystemDataInfoParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling SystemDataServiceLocal.getSequenceNumberForUpdateLocal to get Next Sequence Number for : " +
                prefix + " and Court : " + courtCode);
        final Document getSystemDataInfoResponseDoc = proxy.getJDOM ("ejb/SystemDataServiceLocal",
                "getSequenceNumberForUpdateLocal", getSystemDataInfoParams);

        if (log.isDebugEnabled ())
        {
            log.debug ("Item Value returned : " + outputter.outputString (getSystemDataInfoResponseDoc));
        }
        final Element reportPrintRootElement = getSystemDataInfoResponseDoc.getRootElement ();

        final Element systemDataElement = reportPrintRootElement.getChild ("SystemData");

        return systemDataElement;
    }

    /**
     * Increment the value of System Data identified by prefix and courtCode.
     *
     * @param courtCode CourtCode of the logged in user
     * @param prefix Prefix for SYSTEM_DATA.item field
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void incrementSystemDataInformation (final String courtCode, final String prefix)
        throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", courtCode);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String getSystemDataInfoParams = outputter.outputString (getSystemDataInfoParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling SystemDataServiceLocal.incrementSequenceNumberLocal : " + prefix + " and Court : " +
                courtCode);
        final Document getSystemDataInfoResponseDoc =
                proxy.getJDOM ("ejb/SystemDataServiceLocal", "incrementSequenceNumberLocal", getSystemDataInfoParams);
    }

    /**
     * Create System Data entry identified by Prefix and CourtCode.
     *
     * @param courtCode CourtCode of the logged in user
     * @param prefix Prefix for SYSTEM_DATA.item field
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void createSystemDataInformation (final String courtCode, final String prefix)
        throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", courtCode);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String getSystemDataInfoParams = outputter.outputString (getSystemDataInfoParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug (
                "Calling SystemDataServiceLocal.createSequenceNumberLocal : " + prefix + " and Court : " + courtCode);
        final Document getSystemDataInfoResponseDoc =
                proxy.getJDOM ("ejb/SystemDataServiceLocal", "createSequenceNumberLocal", getSystemDataInfoParams);
    }

    /**
     * Convert CaseMan InputDom to SUPSReporting DOM.
     *
     * @param inputDoc the input doc
     * @param courtCode the court code
     * @param courtUser the court user
     * @param reportName the report name
     * @param orderId the order id
     * @param printJobId the print job id
     * @param currentSequence the current sequence
     * @param prefix the prefix
     * @param thisReportName the this report name
     * @return The sups reporting document.
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document mapToFWDom (final Document inputDoc, final String courtCode, final String courtUser,
                                 final String reportName, String orderId, final String printJobId,
                                 final String currentSequence, final String prefix, final String thisReportName)
        throws JDOMException, SystemException, BusinessException
    {

        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());

        final Element inputReportElement =
                (Element) XPath.selectSingleNode (inputDoc, "/params/param[@name='reportRequest']/Report");

        final Document fwDom = new Document ();

        final Element paramsElement = new Element ("params");
        final Element inputParameters = inputReportElement.getChild ("specificParameters");
        final List<Element> inputParamElementList = inputParameters.getChildren ("Parameter");

        for (Iterator<Element> iter = inputParamElementList.iterator (); iter.hasNext ();)
        {
            final Element inputParamElement = (Element) iter.next ();
            final String name = inputParamElement.getAttributeValue ("name");
            final String value = inputParamElement.getTextTrim ();
            final Element paramElement = new Element ("param");
            XMLBuilder.add (paramElement, "name", name);
            if (orderId != null && name.equals ("P_DOCUMENT_ID")) // Case I :
            // Order id is
            // specified in
            // screen xml
            {
                XMLBuilder.add (paramElement, "value", orderId);
            }
            else
            {
                XMLBuilder.add (paramElement, "value", value);
            }
            paramsElement.addContent (paramElement);
        }
        if (orderId == null)
        {
            Element orderIdElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='P_DOCUMENT_ID']");
            if (orderIdElement != null)
            {
                orderIdElement = (Element) orderIdElement.detach ();
                if (log.isDebugEnabled ())
                {
                    log.debug ("OrderID Element : " + outputter.outputString (orderIdElement));
                }
                orderId = orderIdElement.getText ();
            }
        }

        if (orderId == null)
        {
            orderId = reportName.substring (0, reportName.indexOf ("."));
        }

        final Element oracleReportRequestElement = new Element ("OracleReportRequest");
        Element printElement = null;

        String welshTrans = "N";
        final Element welshTransElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='WELSH_TRANS']");
        if (welshTransElement != null)
        {
            // Turn off bulk printing if the Welsh Translation flag returns with Y
            welshTrans = welshTransElement.getText ();
        }

        String jurisdiction = "";
        final Element jurisdictionElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='JURISDICTION']");
        if (jurisdictionElement != null)
        {
            // Turn off bulk printing if the case has a family enforcement jurisdiction
            jurisdiction = jurisdictionElement.getText ();
        }

        // Get the module group e.g. AE/CO/CJR
        String reportModuleGroup = "";
        final Element reportModuleGroupElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/ReportModuleGroup");
        if (reportModuleGroupElement != null)
        {
            reportModuleGroup = reportModuleGroupElement.getText ();
        }

        printElement = getPrintElement (orderId, courtCode, courtUser, welshTrans, jurisdiction, reportModuleGroup);
        if (printElement != null)
        {
            oracleReportRequestElement.addContent (printElement);
        }

        Element paramElement = new Element ("param");
        XMLBuilder.add (paramElement, "name", "P_COURT_CODE");
        XMLBuilder.add (paramElement, "value", courtCode);
        paramsElement.addContent (paramElement);

        paramElement = new Element ("param");
        XMLBuilder.add (paramElement, "name", "P_SUBMITTED_BY");
        XMLBuilder.add (paramElement, "value", courtUser);
        paramsElement.addContent (paramElement);

        paramElement = new Element ("param");
        XMLBuilder.add (paramElement, "name", "COLLATE");
        XMLBuilder.add (paramElement, "value", "YES");
        paramsElement.addContent (paramElement);

        addReportNoToParams (thisReportName, currentSequence, prefix, paramsElement);

        final Element oracleParametersElement = new Element ("OracleParameters");
        XMLBuilder.add (oracleParametersElement, "report", reportName);
        XMLBuilder.add (oracleParametersElement, "desformat", OUTPUT_TYPE);
        XMLBuilder.add (oracleParametersElement, "destype", DESTYPE_FW);
        XMLBuilder.add (oracleParametersElement, "desname",
                reportName.substring (0, reportName.indexOf (".")) + "_" + printJobId);

        oracleParametersElement.addContent (paramsElement);

        final Element oracleReportElement = new Element ("OracleReport");
        XMLBuilder.add (oracleReportElement, "MimeType", "application/pdf");

        final String duration = getStorageDuration (thisReportName);

        XMLBuilder.add (oracleReportElement, "StorageDuration", duration);
        XMLBuilder.add (oracleReportElement, "Reference", printJobId);
        oracleReportElement.addContent (oracleParametersElement);

        XMLBuilder.add (oracleReportRequestElement, "Reference", printJobId);

        oracleReportRequestElement.addContent (oracleReportElement);

        fwDom.addContent (oracleReportRequestElement);

        return fwDom;
    }

    /**
     * Gets the storage duration.
     *
     * @param thisReportName the this report name
     * @return The storage duration.
     * @throws SystemException the system exception
     */
    private String getStorageDuration (final String thisReportName) throws SystemException
    {
        String storageDuration = "-1";
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        if (reportConfigDO != null && reportConfigDO.isReprint ())
        {
            storageDuration = REPORT_STORAGE_DURATION;
            log.debug ("Storage Duration for Report : " + thisReportName + " is : " + storageDuration);
        }
        return storageDuration;
    }

    /**
     * Store the report in REPORT_OUTPUT table for Event Driven reports like CM_STD_DOC_CJR, CM_STD_DOC, CM_CO_STD_DOC,
     * CM_ORD_?, CM_CO_ORD_? etc.
     *
     * @param inputDoc CaseMan Input DOM
     * @param courtCode CourtCode of logged in user
     * @param courtUser Logged in User *
     * @param requestReportResponseDoc the request report response doc
     * @param fwDom the fw dom
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReportLink (final Document inputDoc, final String courtCode, final String courtUser,
                                  final Document requestReportResponseDoc, final Document fwDom)
        throws JDOMException, SystemException, BusinessException
    {

        String orderId = null;
        String reportId = null;
        String reportModuleGroup = null;
        String eventSeq = null;

        final Element orderIdElement = (Element) XPath.selectSingleNode (fwDom,
                "/OracleReportRequest/OracleReport/OracleParameters/params/param[name = 'P_DOCUMENT_ID']/value");
        log.debug ("Order Element : " + orderIdElement);
        if (orderIdElement != null)
        {
            orderId = orderIdElement.getText ();
            log.debug ("Order ID : " + orderId);
        }

        final Element reportIdElement =
                (Element) XPath.selectSingleNode (requestReportResponseDoc, "/ReportReference/Id");
        if (reportIdElement != null)
        {
            reportId = reportIdElement.getText ();
        }

        final Element storeReportElement = new Element ("insert_report_output");

        final Element reportModuleGroupElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/ReportModuleGroup");
        if (reportModuleGroupElement != null)
        {
            reportModuleGroup = reportModuleGroupElement.getText ();
            final Element eventSeqElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='P_EVENT_SEQ']");
            if (eventSeqElement != null)
            {
                eventSeq = eventSeqElement.getText ();
            }
            if (reportModuleGroup.equals ("CJR"))
            {
                XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "EVENT_SEQ", eventSeq);
                XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
            }
            if (reportModuleGroup.equals ("AE"))
            {
                XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", eventSeq);
            }
            if (reportModuleGroup.equals ("CO"))
            {
                XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", eventSeq);
                XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
            }
            if (reportModuleGroup.equals ("NONE"))
            {
                XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
                XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
            }

        }
        else
        {
            XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
        }

        XMLBuilder.add (storeReportElement, "OUTPUT_ID", "");
        XMLBuilder.add (storeReportElement, "USERNAME", courtUser);
        XMLBuilder.add (storeReportElement, "PRINTED", "Y");
        XMLBuilder.add (storeReportElement, "ORDER_ID", orderId);
        XMLBuilder.add (storeReportElement, "REPORT_ID", reportId);

        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());
        final Element storeReportParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (storeReportParamsElement, "ReportOutputUpdate", storeReportElement);
        final String storeReportParams = outputter.outputString (storeReportParamsElement);
        log.debug ("Report Output Store XML : " + storeReportParams);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.trace ("Updating REPORT_OUTPUT table...");
        final Document storeReportResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "insertReportOutputLocal", storeReportParams);
    }

    /**
     * Store report links in REPORT_REPRINTS table for cetain reports. Driven by ReprotConfig.xml
     *
     * @param courtCode the court code
     * @param courtUser the court user
     * @param thisReportName the this report name
     * @param requestReportResponseDoc the request report response doc
     * @param fwDom the fw dom
     * @param currentSequence the current sequence
     * @param inputDoc the input doc
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReprintsRecord (final String courtCode, final String courtUser, final String thisReportName,
                                      final Document requestReportResponseDoc, final Document fwDom,
                                      String currentSequence, final Document inputDoc)
        throws JDOMException, SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        if (reportConfigDO != null && reportConfigDO.isReprint ())
        {
            log.trace ("Storing in Reprints Table : " + thisReportName);

            String reportDescription = null;
            String reportModuleGroup = null;
            String reportModule = null;

            Element reportInfo = null;
            if (thisReportName.equals ("CM_PREC"))
            {
                final Element reportNoElement = (Element) XPath.selectSingleNode (fwDom.getRootElement (),
                        "/OracleReportRequest/OracleReport/OracleParameters/params/param[name = 'P_REPORT_NO']/value");
                if (reportNoElement != null)
                {
                    currentSequence = reportNoElement.getText ();
                    log.debug ("Report Number Passed in PREC/BVER is : " + currentSequence);
                    if (currentSequence.startsWith ("PREC"))
                    {
                        reportInfo = getDetailedReportInformation (thisReportName);
                        reportDescription = reportInfo.getChild ("ORDER_DESCRIPTION").getText ();
                        reportModuleGroup = reportInfo.getChild ("MODULE_GROUP").getText ();
                        reportModule = reportInfo.getChild ("MODULE_NAME").getText ();
                    }
                    else
                    {
                        // Must be BVER
                        reportDescription = "Bailiff Verification Report";
                        reportModuleGroup = "CASH";
                        reportModule = "CM_PREC";
                    }
                }
                else
                {
                    throw new SystemException ("P_REPORT_NO was null for report : " + thisReportName);
                }
            }
            else
            {
                final String modifiedReportName = getModifiedReportName (inputDoc, thisReportName);

                reportInfo = getDetailedReportInformation (modifiedReportName);
                reportDescription = reportInfo.getChild ("ORDER_DESCRIPTION").getText ();
                reportModuleGroup = reportInfo.getChild ("MODULE_GROUP").getText ();
                reportModule = reportInfo.getChild ("MODULE_NAME").getText ();
                if (currentSequence != null)
                {
                    currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + currentSequence;
                }
            }

            // Added for Trac 3407
            if (thisReportName.equals ("CM_CVER"))
            {
                currentSequence = getCVERNo (courtCode, courtUser);
            }

            String fwReportId = null;

            final Element reportIdElement =
                    (Element) XPath.selectSingleNode (requestReportResponseDoc, "/ReportReference/Id");
            if (reportIdElement != null)
            {
                fwReportId = reportIdElement.getText ();
            }

            if (currentSequence == null)
            {
                final String systemDataItemValue =
                        getReportNo (courtCode, reportInfo.getChild ("FILE_PREFIX").getText ());
                if (systemDataItemValue != null)// Possible for CM_CVER
                {
                    currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + systemDataItemValue;
                }
                if (currentSequence == null)
                {
                    // looks like CM_CTR_RCPT is coming in
                    final Element tranNoElement = (Element) XPath.selectSingleNode (fwDom.getRootElement (),
                            "/OracleReportRequest/OracleReport/OracleParameters/params/param[name = 'P_TRAN_NO']/value");
                    log.debug ("Transaction Number Element Passed : " + tranNoElement);
                    if (tranNoElement != null)
                    {
                        currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + tranNoElement.getText ();
                        log.debug ("Transaction Number Passed : " + currentSequence);
                    }
                }
            }

            final Element reportReprintsElement = new Element ("insert_report_reprints");

            XMLBuilder.add (reportReprintsElement, "USERNAME", courtUser);
            XMLBuilder.add (reportReprintsElement, "REPORT_NAME", reportDescription);
            XMLBuilder.add (reportReprintsElement, "PRINTED", "Y");
            XMLBuilder.add (reportReprintsElement, "REPORT_ID", currentSequence);
            XMLBuilder.add (reportReprintsElement, "REPORT_DATE", SystemDateHelper.getSystemDate ());
            XMLBuilder.add (reportReprintsElement, "MODULE_GROUP", reportModuleGroup);
            XMLBuilder.add (reportReprintsElement, "ORDER_ID", reportModule);
            XMLBuilder.add (reportReprintsElement, "FW_REPORT_ID", fwReportId);

            final XMLOutputter outputter = new XMLOutputter ();
            outputter.setFormat (Format.getPrettyFormat ());
            final Element reportReprintsParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (reportReprintsParamsElement, "ReportReprintsInsert", reportReprintsElement);
            final String reportReprintsParams = outputter.outputString (reportReprintsParamsElement);
            log.debug ("Report Reprints Store XML : " + reportReprintsParams);

            final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

            final Document storeReportResponseDoc =
                    proxy.getJDOM ("ejb/ReportsServiceLocal", "insertReportReprintsLocal", reportReprintsParams);
        }
        else
        {
            log.debug ("Reprints Table Storage is not Required : " + thisReportName);
        }
    }

    /**
     * Store REPORT_MAP record for outputs that are bulk printed. Driven by ReportConfig.xml
     *
     * @param inputDoc the input doc
     * @param thisReportName the this report name
     * @param requestReportResponseDoc the request report response doc
     * @param eventBased the event based
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReportMapRecord (final Document inputDoc, String thisReportName,
                                       final Document requestReportResponseDoc, final boolean eventBased)
        throws JDOMException, SystemException, BusinessException
    {
        String welshTrans = null;
        String jurisdiction = null;
        String reportModuleGroup = "";
        if (thisReportName != null)
        {
            final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();

            // Event based, removed the -I or -X after the report name
            if (eventBased && thisReportName.indexOf ("-") != -1)
            {
                thisReportName = thisReportName.substring (0, thisReportName.indexOf ("-"));
            }

            final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

            // Get the module group e.g. AE/CO/CJR
            final Element reportModuleGroupElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/ReportModuleGroup");
            if (reportModuleGroupElement != null)
            {
                reportModuleGroup = reportModuleGroupElement.getText ();
            }

            // Special behaviour for N64 - only want to bulk print for AEs, not for COs
            if (thisReportName.equals ("N64") && reportModuleGroup.equals ("CO"))
            {
                reportConfigDO.setBulkPrint (false);
            }

            // Handle
            if (reportConfigDO != null && reportConfigDO.isBulkPrint ())
            {
                log.trace ("Storing in REPORT_MAP Table : " + thisReportName);

                final Element welshTransElement = (Element) XPath.selectSingleNode (inputDoc,
                        "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='WELSH_TRANS']");
                if (welshTransElement != null)
                {
                    // Turn off bulk printing if the Welsh Translation flag returns with Y
                    welshTrans = welshTransElement.getText ();
                    if (welshTrans.equals ("Y"))
                    {
                        return;
                    }
                }

                final Element jurisdictionElement = (Element) XPath.selectSingleNode (inputDoc,
                        "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='JURISDICTION']");
                if (jurisdictionElement != null)
                {
                    // Turn off bulk printing if the case has a family enforcement jurisdiction
                    jurisdiction = jurisdictionElement.getText ();
                    if (jurisdiction.equals ("F"))
                    {
                        return;
                    }
                }

                String fwReportId = null;
                final Element reportIdElement =
                        (Element) XPath.selectSingleNode (requestReportResponseDoc, "/ReportReference/Id");
                if (reportIdElement != null)
                {
                    fwReportId = reportIdElement.getText ();
                }

                String reportName = thisReportName;
                if ( !eventBased)
                {
                    reportName = thisReportName.substring (3); // Remove the first three characters e.g. CM_
                }

                final String path = reportName + "/input";
                final String filename = reportName + "_" + fwReportId + ".pdf";

                final Element reportMapElement = new Element ("insert_report_map");

                XMLBuilder.add (reportMapElement, "ReportId", fwReportId);
                XMLBuilder.add (reportMapElement, "ReportName", reportName);
                XMLBuilder.add (reportMapElement, "LegacyPath", path);
                XMLBuilder.add (reportMapElement, "FileName", filename);

                final XMLOutputter outputter = new XMLOutputter ();
                outputter.setFormat (Format.getPrettyFormat ());
                final Element reportMapParamsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (reportMapParamsElement, "ReportMapInsert", reportMapElement);
                final String reportMapParams = outputter.outputString (reportMapParamsElement);
                log.debug ("REPORT_MAP Store XML : " + reportMapParams);

                final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();
                final Document storeReportResponseDoc =
                        proxy.getJDOM ("ejb/ReportsServiceLocal", "insertReportMapLocal", reportMapParams);
            }
            else
            {
                log.debug ("REPORT_MAP Table Storage is not Required : " + thisReportName);
            }

        }
    }

    /**
     * Wait for certain reports to finish. Driven by ReportConfig.xml
     *
     * @param thisReportName the this report name
     * @param requestReportResponseDoc the request report response doc
     * @return Success/fail string.
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String waitForCompletion (final String thisReportName, final Document requestReportResponseDoc)
        throws JDOMException, SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        if (reportConfigDO != null && reportConfigDO.isWaitForCompletion ())
        {
            log.trace ("Waiting for Report Completion : " + thisReportName);
            String fwReportId = null;
            final Element reportIdElement =
                    (Element) XPath.selectSingleNode (requestReportResponseDoc, "/ReportReference/Id");
            if (reportIdElement != null)
            {
                fwReportId = reportIdElement.getText ();
            }

            String casemanReportRef = null;
            final Element casemanReportRefElement =
                    (Element) XPath.selectSingleNode (requestReportResponseDoc, "/ReportReference/Reference");
            if (reportIdElement != null)
            {
                casemanReportRef = casemanReportRefElement.getText ();
            }

            boolean finished = isReportFinished (thisReportName, fwReportId, casemanReportRef);

            if (finished)
            {
                return "success"; // Just return.
            }
            // Start Polling
            for (int i = 0; i < TRIES; i++)
            {
                log.debug ("Polling loop for Report Finish : " + i);
                finished = isReportFinished (thisReportName, fwReportId, casemanReportRef);
                if (finished)
                {
                    return "success"; // Just return.
                }
                // Wait for interval period
                try
                {
                    Thread.sleep (TRY_INTERVAL);
                }
                catch (final InterruptedException x)
                {
                }
            }
            return null;
        }
        log.debug ("Wait Not required for : " + thisReportName);
        return "success";
    }

    /**
     * Check if report is finished. Calls GetReport Method on framework.
     *
     * @param thisReportName the this report name
     * @param fwReportId the fw report id
     * @param casemanReportRef the caseman report ref
     * @return True if report is finished, false if not.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean isReportFinished (final String thisReportName, final String fwReportId,
                                      final String casemanReportRef)
        throws SystemException, BusinessException
    {
        log.trace ("isReportFinished : " + thisReportName);

        final Element getReportsElement = new Element ("ReportReference");

        XMLBuilder.add (getReportsElement, "Id", fwReportId);
        XMLBuilder.add (getReportsElement, "Reference", casemanReportRef);

        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());
        final Element getReportParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getReportParamsElement, "ReportReference", getReportsElement);
        final String getReportParams = outputter.outputString (getReportParamsElement);
        log.debug ("Sending following XML to get report status : " + getReportParams);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Document getReportResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getReportLocal", getReportParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Get Report Response : " + outputter.outputString (getReportResponseDoc));
        }

        final Element getReportResponseElement = getReportResponseDoc.getRootElement ();
        final String statusStr = getReportResponseElement.getChild ("Status").getText ();
        final int status = Integer.parseInt (statusStr);
        switch (status)
        {
            case 0: // Just submitted.
                return false;
            case 1: // In Process
                return false;
            case 2: // PDF Successfully generated
                return true;
            case 4: // Error
                String errorStr = "";
                final Element errorElement = getReportResponseElement.getChild ("Error");
                if (errorElement != null)
                {
                    errorStr = errorElement.getText ();
                }
                final String errorMessage =
                        "Error while Generating Document with ID : " + fwReportId + ", Error is : " + errorStr;
                throw new SystemException (errorMessage);
            default:
                break;
        }
        return true;
    }

    /**
     * Get Report Number for System Data for prefix and courtCode.
     *
     * @param courtCode the court code
     * @param prefix the prefix
     * @return The report no.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getReportNo (final String courtCode, final String prefix) throws SystemException, BusinessException
    {
        String value = null;
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "courtCode", courtCode);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String getSystemDataInfoParams = outputter.outputString (getSystemDataInfoParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling SystemDataServiceLocal.getSystemDataItemLocal to get Current Sequence Number for : " +
                prefix + " and Court : " + courtCode);
        final Document getSystemDataInfoResponseDoc =
                proxy.getJDOM ("ejb/SystemDataServiceLocal", "getSystemDataItemLocal", getSystemDataInfoParams);

        if (log.isDebugEnabled ())
        {
            log.debug ("Item Value returned : " + outputter.outputString (getSystemDataInfoResponseDoc));
        }

        final Element reportPrintRootElement = getSystemDataInfoResponseDoc.getRootElement ();

        final Element systemDataElement = reportPrintRootElement.getChild ("SystemData");
        if (systemDataElement != null)
        {
            value = systemDataElement.getChildText ("ItemValue");
            value = new Integer (Integer.parseInt (value) - 1).toString ();
        }
        return value;
    }

    /**
     * Get Report related information from ORDER_TYPES table.
     *
     * @param reportName the report name
     * @return The report info element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getDetailedReportInformation (final String reportName) throws SystemException, BusinessException
    {
        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", reportName);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String reportPrintParams = outputter.outputString (reportPrintParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling ReportsServiceLocal.getReportPrintInformationLocal to get Detailed report Information");
        final Document reportPrintResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getReportPrintInformationLocal", reportPrintParams);

        if (log.isDebugEnabled ())
        {
            log.debug ("Report Information returned for Detailed report Information : " +
                    outputter.outputString (reportPrintResponseDoc));
        }

        final Element reportPrintRootElement = reportPrintResponseDoc.getRootElement ();

        final Element rowElement = reportPrintRootElement.getChild ("row");

        return rowElement;
    }

    /**
     * For certain reports, add a parameter to XML sent to SUPSReporting. Driven by ReportConfig.xml
     *
     * @param thisReportName the this report name
     * @param currentSequence the current sequence
     * @param prefix the prefix
     * @param paramsElement the params element
     * @throws SystemException the system exception
     */
    private void addReportNoToParams (final String thisReportName, final String currentSequence, final String prefix,
                                      final Element paramsElement)
        throws SystemException
    {
        String reportNo = null;

        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);
        if (reportConfigDO != null && reportConfigDO.isSendReportSequence ())
        {
            final Element paramElement = new Element ("param");
            XMLBuilder.add (paramElement, "name", "P_REPORT_NO");
            if (prefix.length () == 3)
            {
                reportNo = prefix + "_";
            }
            else
            {
                reportNo = prefix;
            }
            XMLBuilder.add (paramElement, "value", reportNo + currentSequence);
            paramsElement.addContent (paramElement);
        }

    }

    /**
     * Get the Print element in SUPSReporting Request XML.
     *
     * @param reportName the report name
     * @param courtCode the court code
     * @param courtUser the court user
     * @param welshTrans the welsh trans
     * @param jurisdiction the jurisdiction
     * @param reportModuleGroup the report module group
     * @return The print element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getPrintElement (final String reportName, final String courtCode, final String courtUser,
                                     final String welshTrans, final String jurisdiction, final String reportModuleGroup)
        throws SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();

        String tmpReportName = reportName;
        // Removed the -I or -X after the report name
        if (tmpReportName.indexOf ("-") != -1)
        {
            tmpReportName = tmpReportName.substring (0, tmpReportName.indexOf ("-"));
        }

        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (tmpReportName);
        boolean isBulkPrint = false;
        if (reportConfigDO != null && welshTrans.equals ("N") && !jurisdiction.equals ("F"))
        {
            // Special behaviour for N64 - only want to bulk print for AEs, not for COs
            if (tmpReportName.equals ("N64") && reportModuleGroup.equals ("CO"))
            {
                reportConfigDO.setBulkPrint (false);
            }

            isBulkPrint = reportConfigDO.isBulkPrint ();
        }

        // CM_LINEUP and CM_PYORd are not printed automatically. Bulk Printed outputs also should not be printed locally
        if (reportName.equalsIgnoreCase ("CM_LINEUP") || reportName.equals ("CM_PYORD") || isBulkPrint)
        {
            log.debug ("Printing not enabled for : " + reportName);
            return null;
        }

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
        // TD 367 On UCT_CASEMAN. Kevin Gichohi (EDS)- Change the default tray from tray 0 to what the framework calls
        // tray 1. (We call it tray 2.)
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
        else // TD 367 On UCT_CASEMAN. Kevin Gichohi (EDS)- Change the default tray from tray 1 to tray 2.
        {
            log.debug ("The report does not have any record in ORDER_TYPES table : " + reportName);
            log.debug ("Report will be printed to Tray 2");
        }

        String printer = null;
        boolean fapIdByUser = true;
        if (reportName.equals ("CM_WAREX")) // Print to Courts' default printer
        {
            log.trace ("Getting default Printer for Court...");
            printer = getCourtDefaultPrinter (courtUser, courtCode);
            fapIdByUser = false;

            // uat defect 811. Warrants should print from tray 3 (code wise this "2").
            tray = "2";
        }
        else
        // Print to Users' printer
        {
            final Element userInfoRowElement = getUserInformation (courtCode, courtUser);
            if (userInfoRowElement != null)
            {
                printer = userInfoRowElement.getChild ("PRINTER").getText ();
                log.debug ("User Printer : " + printer);
                if (printer.length () < 1)
                {
                    log.debug ("Report not generated. User does not have a default printer allocated : " + courtUser);
                    throw new SystemException (
                            "Report not generated. User does not have a default printer allocated : " + courtUser);
                }
            }
            else
            {
                log.debug ("Report not generated. User does not exist in DCA_USER table : " + courtUser);
                throw new SystemException (
                        "Report not generated. User does not exist in DCA_USER table : " + courtUser);
            }
        }

        final Element printElement = new Element ("Print");
        XMLBuilder.add (printElement, "Type", "pdf2ps");

        final Element destinationElement = new Element ("Destination");
        XMLBuilder.add (destinationElement, "Server", getCourtFAPId (courtUser, courtCode, fapIdByUser));
        XMLBuilder.add (destinationElement, "Printer", printer);

        printElement.addContent (destinationElement);

        final Element optionsElement = new Element ("Options");
        XMLBuilder.add (optionsElement, "Tray", tray);
        XMLBuilder.add (optionsElement, "NumCopies", noOfCopies); // numCopies not used at the moment.
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
     * Get user related information required for printing.
     *
     * @param courtCode the court code
     * @param courtUser the court user
     * @return The user info element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getUserInformation (final String courtCode, final String courtUser)
        throws SystemException, BusinessException
    {
        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final Element userInformationParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (userInformationParamsElement, "userId", courtUser);
        XMLBuilder.addParam (userInformationParamsElement, "courtId", courtCode);
        final String userInformationParams = outputter.outputString (userInformationParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling ReportsServiceLocal.getUserInformationLocal to get printer information");
        final Document userInformationResponseDoc =
                proxy.getJDOM ("ejb/ReportsServiceLocal", "getUserInformationLocal", userInformationParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("User Information returned : " + outputter.outputString (userInformationResponseDoc));
        }

        final Element userInformationRootElement = userInformationResponseDoc.getRootElement ();
        final Element userInfoRowElement = userInformationRootElement.getChild ("row");

        return userInfoRowElement;
    }

    /**
     * Get Court Default Printer for WAREX report.
     *
     * @param courtUser the court user
     * @param courtCode the court code
     * @return The court default printer.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getCourtDefaultPrinter (final String courtUser, final String courtCode)
        throws SystemException, BusinessException
    {
        String courtPrinter = null;

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Element courtPrinterParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (courtPrinterParamsElement, "userId", courtUser);
        XMLBuilder.addParam (courtPrinterParamsElement, "courtId", courtCode);
        final String courtPrinterParams = outputter.outputString (courtPrinterParamsElement);

        log.debug ("Calling Court.getCourtDefaultPrinter to get Default Printer for court : " + courtCode);
        final Document courtPrinterResponseDoc =
                proxy.getJDOM ("ejb/CourtServiceLocal", "getCourtDefaultPrinterLocal", courtPrinterParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Default Court Printer Response : " + outputter.outputString (courtPrinterResponseDoc));
        }

        final Element courtPrinterResponseRootElement = courtPrinterResponseDoc.getRootElement ();
        final Element courtDetailsElement = courtPrinterResponseRootElement.getChild ("CourtDetails");
        if (courtDetailsElement != null)
        {
            final Element defaultPrinterElement = courtDetailsElement.getChild ("DefaultPrinter");
            if (defaultPrinterElement == null)
            {
                throw new SystemException ("Default Printer is not allocated to Court : " + courtCode);
            }
            courtPrinter = defaultPrinterElement.getText ();
            log.debug ("Court Printer : " + courtPrinter);
            if (courtPrinter.length () < 1)
            {
                throw new SystemException (
                        "Report not generated. Default Printer is not allocated to Court : " + courtCode);
            }
        }
        return courtPrinter;
    }

    /**
     * Get Court's FAP id to be sent in SUPSReporting request XML.
     *
     * @param courtUser the court user
     * @param courtCode the court code
     * @param byUser the by user
     * @return The court fap id.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getCourtFAPId (final String courtUser, final String courtCode, final boolean byUser)
        throws SystemException, BusinessException
    {
        String fapId = null;

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        final Element fapParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (fapParamsElement, "userId", courtUser);
        XMLBuilder.addParam (fapParamsElement, "courtId", courtCode);
        final String fapParams = outputter.outputString (fapParamsElement);

        final String serviceMethod = byUser == false ? "getCourtFapLocal" : "getCourtFapByUserLocal";

        log.debug ("Calling Court.getCourtFapByUserLocal to get fap server for court : " + courtCode);
        final Document fapResponseDoc = proxy.getJDOM ("ejb/CourtServiceLocal", serviceMethod, fapParams);
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
                        "Report not generated. Print Server ID is not allocated to Court : " + courtCode);
            }
        }

        return fapId;
    }

    /**
     * Get Report Number for CVER for court code and user ID.
     *
     * @param courtCode the court code
     * @param userID the user ID
     * @return The report no.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getCVERNo (final String courtCode, final String userID) throws SystemException, BusinessException
    {
        String value = null;
        final Element getReportDataParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getReportDataParamsElement, "courtId", courtCode);
        XMLBuilder.addParam (getReportDataParamsElement, "inputBy", userID);

        final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
        final String getReportDataParams = outputter.outputString (getReportDataParamsElement);

        final AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy ();

        log.debug ("Calling CounterVerificationServiceLocal.getReportData to get Current Sequence Number for : " +
                userID + " and Court : " + courtCode);
        final Document getReportDataResponseDoc =
                proxy.getJDOM ("ejb/CounterVerificationServiceLocal", "getReportDataLocal", getReportDataParams);

        if (log.isDebugEnabled ())
        {
            log.debug ("Item Value returned : " + outputter.outputString (getReportDataResponseDoc));
        }

        final Element reportPrintRootElement = getReportDataResponseDoc.getRootElement ();

        final Element reportReprintElement = reportPrintRootElement.getChild ("ReportData");
        if (reportReprintElement != null)
        {
            value = reportReprintElement.getChildText ("reportId");
        }
        return value;
    }

    /**
     * (non-Javadoc).
     *
     * @param methodId the method id
     * @param handler the handler
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String,
     *      uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
     */
    public void validate (final String methodId, final QueryEngineErrorHandler handler,
                          final Element processingInstructions, final Map<String, Object> preloadCache)
    {
        // not implmented.
    }

    /**
     * (non-Javadoc).
     *
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
     */
    public void preloadCache (final Element processingInstructions, final Map<String, Object> preloadCache)
    {
        // not implemented.
    }

    /**
     * (non-Javadoc).
     *
     * @param config the config
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
     */
    public void prepare (final Element config, final Map<String, Object> preloadCache)
    {
        // not implemented.
    }

}