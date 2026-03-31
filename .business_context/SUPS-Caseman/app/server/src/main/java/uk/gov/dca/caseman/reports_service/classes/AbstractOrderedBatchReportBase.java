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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.SystemDateHelper;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Base class to be used for creating a framework batch report request and submitting it.
 * 
 * @author Paul Roberts
 *
 *         Change History:
 *         08-Feb-2008 Chris Vincent: CaseMan Defect 6181. Changed the method getCourtFAPId() to use a different
 *         retrieval service to lookup the user printer court instead of the fap id associated with the
 *         user's home court.
 *         25/11/2015 Chris Vincent: Added bulk printing changes to allow some of the outputs generated during the
 *         start of day to be sent to bulk print instead of printing locally. Trac 5725.
 *         12/10/2016 Chris Vincent: bulk printing chanegs to ensure outputs on Family Enforcement cases are not
 *         bulk printed. Trac 5883
 */
public abstract class AbstractOrderedBatchReportBase extends AbstractCasemanCustomProcessor
{

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (AbstractOrderedBatchReportBase.class);
    
    /** The Constant REPORTS_SERVICE. */
    // Services.
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant SYSTEM_DATA_SERVICE. */
    private static final String SYSTEM_DATA_SERVICE = "ejb/SystemDataServiceLocal";
    
    /** The Constant START_OF_DAY_SERVICE. */
    protected static final String START_OF_DAY_SERVICE = "ejb/StartOfDayServiceLocal";

    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "runReportLocal";
    
    /** The Constant GET_SYSTEM_DATA_ITEM. */
    private static final String GET_SYSTEM_DATA_ITEM = "getSystemDataItemLocal";
    
    /** The Constant REPORT_AND_PRINT. */
    private static final String REPORT_AND_PRINT = "reportAndPrintLocal";
    
    /** The Constant GET_USER_INFO. */
    private static final String GET_USER_INFO = "getUserInformationLocal";
    
    /** The Constant GET_REPORT_PRINT_INFO. */
    private static final String GET_REPORT_PRINT_INFO = "getReportPrintInformationLocal";
    
    /** The Constant UPDATE_PRINT_JOB. */
    private static final String UPDATE_PRINT_JOB = "updatePrintJobLocal";
    
    /** The Constant GET_FAP_ID. */
    private static final String GET_FAP_ID = "getCourtFapByUserLocal";
    
    /** The Constant GET_UPDATE_SEQUENCE_NO. */
    private static final String GET_UPDATE_SEQUENCE_NO = "getSequenceNumberForUpdateLocal";
    
    /** The Constant INCREMENT_SEQUENCE_NO. */
    private static final String INCREMENT_SEQUENCE_NO = "incrementSequenceNumberLocal";
    
    /** The Constant CREATE_SEQUENCE_NO. */
    private static final String CREATE_SEQUENCE_NO = "createSequenceNumberLocal";
    
    /** The Constant INSERT_REPORT_OUTPUT. */
    private static final String INSERT_REPORT_OUTPUT = "insertReportOutputLocal";
    
    /** The Constant INSERT_REPRINT_RECORD. */
    private static final String INSERT_REPRINT_RECORD = "insertReportReprintsLocal";
    
    /** The Constant GET_ORDER_TYPE_DETAILS. */
    private static final String GET_ORDER_TYPE_DETAILS = "getOrderTypeDetailsLocal";
    
    /** The Constant INSERT_REPORT_MAP. */
    private static final String INSERT_REPORT_MAP = "insertReportMapLocal";

    /** The Constant bundle. */
    // Constants
    private static final ResourceBundle bundle =
            ResourceBundle.getBundle ("uk/gov/dca/caseman/reports_service/classes/reportservice");
    
    /** The Constant OUTPUT_TYPE. */
    private static final String OUTPUT_TYPE = bundle.getString ("outputType");
    
    /** The Constant DESTYPE_FW. */
    private static final String DESTYPE_FW = bundle.getString ("desTypeFW");
    
    /** The Constant REPORT_STORAGE_DURATION. */
    private static final String REPORT_STORAGE_DURATION = bundle.getString ("report_storage_duration");
    
    /** The Constant TRIES. */
    private static final int TRIES = Integer.parseInt (bundle.getString ("completionAttempts"));
    
    /** The Constant TRY_INTERVAL. */
    private static final long TRY_INTERVAL = Long.parseLong (bundle.getString ("completionAttemptInterval"));
    
    /** The Constant BATCH_REF. */
    private static final String BATCH_REF = "BATCH";

    /** The m user id. */
    // Variables
    protected String mUserId = "";
    
    /** The m court id. */
    protected String mCourtId = "";
    
    /** The m report module group. */
    protected String mReportModuleGroup = "";
    
    /** The m proxy. */
    protected AbstractSupsServiceProxy mProxy;
    
    /** The m outputter. */
    protected final XMLOutputter mOutputter;
    
    /** The m batch size. */
    private int mBatchSize = 0;
    
    /** The m current sequences list. */
    private ArrayList<String> mCurrentSequencesList = new ArrayList<>();

    /**
     * Instantiates a new abstract ordered batch report base.
     *
     * @throws JDOMException the JDOM exception
     */
    public AbstractOrderedBatchReportBase () throws JDOMException
    {
        mProxy = new SupsLocalServiceProxy ();
        mOutputter = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * process needs to be implemented by any class extending this.
     *
     * @param pDocParams the doc params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public abstract Document process (Document pDocParams, Log pLog) throws SystemException, BusinessException;

    /**
     * Sends batch report request to the framework and returns the framework response.
     *
     * @param fwDom the fw dom
     * @return requestReportResponseDoc or null if no reports were run
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    protected Document invokeReport (final Document fwDom) throws SystemException, BusinessException, JDOMException
    {
        final int numberRequests = XPath.selectNodes (fwDom, "/OracleReportRequest/OracleReport").size ();
        if (numberRequests == 0)
        {
            return null;
        }

        log.info ("Submitting batch report request to Framework Reporting Service...");
        // Wrap dom in a params/param element and send to framework
        final Element fwElement = (Element) ((Element) fwDom.getRootElement ().clone ()).detach ();
        final Element requestReportParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (requestReportParamsElement, "ReportRequest", fwElement);
        final String requestReportParams = mOutputter.outputString (requestReportParamsElement);
        log.debug ("Report invoke request:" + requestReportParams);
        final Document requestReportResponseDoc =
                mProxy.getJDOM (REPORTS_SERVICE, REPORT_AND_PRINT, requestReportParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Response from FW Reporting Service : " + mOutputter.outputString (requestReportResponseDoc));
        }

        // Do any update tasks required after reports are generated
        // such as storing reprint records.
        performAfterReportTasks (requestReportResponseDoc, fwDom);
        return requestReportResponseDoc;
    }

    /**
     * Populates the REPORT_OUTPUT and REPORT_REPRINTS tables for all reports in the batch.
     * Waits for the batch to finish before populating REPORT_REPRINTS.
     *
     * @param fwResponseDom the fw response dom
     * @param fwDom the fw dom
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void performAfterReportTasks (final Document fwResponseDom, final Document fwDom)
        throws SystemException, BusinessException
    {
        try
        {
            // Get list of reports run.
            List<Element> idsList = null;
            // Next bit needed as the framework wraps 2 or more reports in a batch reportreference element
            if (mBatchSize == 1)
            {
                idsList = XPath.selectNodes (fwResponseDom, "/ReportReference");
            }
            else
            {
                idsList = XPath.selectNodes (fwResponseDom, "/ReportReference/ReportReference");
            }

            final Iterator<Element> it = idsList.iterator ();
            while (it.hasNext ())
            {
                String reference = ""; // Needed to map between fwDom and the framework response doc.
                String fwId = "";
                String orderId = "";
                String eventSeq = "";
                String reportName = "";
                String currentSequence = "";
                String welshTranslation = "";
                String jurisdiction = "";
                // Need the document Id, framework print Id, and event sequence.
                // First get framework print id and caseman print job (reference). These always exist.
                final Element reportEl = (Element) it.next ();
                final Element elReference = reportEl.getChild ("Reference");
                reference = elReference.getTextTrim ();
                if ( !reference.equals (BATCH_REF))
                {
                    final Element elFwId = reportEl.getChild ("Id");
                    fwId = elFwId.getTextTrim ();

                    final Element elOrderId = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/params/param[name = 'P_DOCUMENT_ID']/value");
                    if (elOrderId != null)
                    {
                        orderId = elOrderId.getTextTrim ();
                    }
                    final Element elEventSeq = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/params/param[name = 'P_EVENT_SEQ']/value");
                    if (elEventSeq != null)
                    {
                        eventSeq = elEventSeq.getTextTrim ();
                    }

                    final Element elWelshInd = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/params/param[name = 'WELSH_TRANS']/value");
                    if (elWelshInd != null)
                    {
                        welshTranslation = elWelshInd.getTextTrim ();
                    }
                    final Element elJurisdiction = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/params/param[name = 'JURISDICTION']/value");
                    if (elJurisdiction != null)
                    {
                        jurisdiction = elJurisdiction.getTextTrim ();
                    }

                    final Element elReportName = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/report");
                    reportName = elReportName.getTextTrim ();
                    reportName = reportName.substring (0, reportName.lastIndexOf (".rdf"));

                    storeReportLink (fwId, orderId, eventSeq);

                    // Wait for completion for certain reports which require clearing of
                    // some data after report is finished.
                    waitForCompletion (reportName, fwId, reference);

                    // Store certain reports for reprinting in REPORT_REPRINTS table.
                    final Element elCurrentSequence = (Element) XPath.selectSingleNode (fwDom,
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference + "']/CurrentSequence");

                    currentSequence = elCurrentSequence.getTextTrim ();
                    if (currentSequence.equals (""))
                    {// storeReprintsRecords looks for nulls...
                        currentSequence = null;
                    }
                    storeReprintsRecord (reportName, fwDom, currentSequence, fwId, reference);

                    boolean eventBased = false;
                    if ( !eventSeq.equals (""))
                    {
                        eventBased = true;
                    }

                    // Store REPORT_MAP (bulk print) if no Welsh Translation and the case does not have a family
                    // enforcement jurisdiction
                    if ( !welshTranslation.equals ("Y") && !jurisdiction.equals ("F"))
                    {
                        storeReportMapRecord (orderId, fwId, eventBased);
                    }
                }
            }

            // Defect 5815 - Parent ID causes issues with reprinting. Set parent
            // ID to own ID after batch as workaround.
            if (mBatchSize > 1)
            {
                final String parentId =
                        ((Element) XPath.selectSingleNode (fwResponseDom, "/ReportReference/Id")).getText ();
                waitForCompletion ("", parentId, BATCH_REF);
                divorceChildReports (parentId);
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to write REPORT_OUTPUT", e);
        }
    }

    /**
     * Modifies all rows in REPORT_QUEUE table with given parent_id so that
     * parent_id = id of the given row.
     *
     * @param parentId the value of the parent ID column of the rows to be
     *            updated
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void divorceChildReports (final String parentId) throws SystemException, BusinessException
    {
        final Element params = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (params, "parentId", parentId);

        invokeLocalServiceProxy ("ejb/ReportsServiceLocal", "divorceChildReportsLocal", new Document (params));
    }

    /**
     * Writes to report_output table after a report is printed.
     *
     * @param fwId the fw id
     * @param orderId the order id
     * @param eventSeq the event seq
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReportLink (final String fwId, final String orderId, final String eventSeq)
        throws JDOMException, SystemException, BusinessException
    {
        final Element storeReportElement = new Element ("insert_report_output");

        if (mReportModuleGroup.equals ("AE"))
        {
            XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", eventSeq);
        }
        else if (mReportModuleGroup.equals ("CO"))
        {
            XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", eventSeq);
            XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
        }
        else if (mReportModuleGroup.equals ("CJR"))
        {
            XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "EVENT_SEQ", eventSeq);
            XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
        }
        else
        {
            XMLBuilder.add (storeReportElement, "CO_EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "EVENT_SEQ", "");
            XMLBuilder.add (storeReportElement, "AE_EVENT_SEQ", "");
        }

        XMLBuilder.add (storeReportElement, "OUTPUT_ID", "");
        XMLBuilder.add (storeReportElement, "USERNAME", mUserId);
        XMLBuilder.add (storeReportElement, "PRINTED", "Y");
        XMLBuilder.add (storeReportElement, "ORDER_ID", orderId);
        XMLBuilder.add (storeReportElement, "REPORT_ID", fwId);

        final Element storeReportParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (storeReportParamsElement, "ReportOutputUpdate", storeReportElement);
        final String storeReportParams = mOutputter.outputString (storeReportParamsElement);
        log.debug ("Storing report output for event " + eventSeq);

        final Document storeReportResponseDoc =
                mProxy.getJDOM (REPORTS_SERVICE, INSERT_REPORT_OUTPUT, storeReportParams);
    }

    /**
     * Stores report details after printing to enable reprint in future.
     *
     * @param thisReportName the this report name
     * @param fwDom the fw dom
     * @param currentSequence the current sequence
     * @param fwReportId the fw report id
     * @param reference the reference
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReprintsRecord (final String thisReportName, final Document fwDom, String currentSequence,
                                      final String fwReportId, final String reference)
        throws JDOMException, SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        if (reportConfigDO != null && reportConfigDO.isReprint ())
        {
            log.debug ("Storing in Reprints Table : " + thisReportName);

            String reportDescription = null;
            String reportModuleGroup = null;
            String reportModule = null;

            Element reportInfo = null;
            if (thisReportName.equals ("CM_PREC"))
            {
                final Element reportNoElement = (Element) XPath.selectSingleNode (fwDom.getRootElement (),
                        "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                "']/OracleParameters/params/param[name = 'P_REPORT_NO']/value");
                if (reportNoElement != null)
                {
                    currentSequence = reportNoElement.getText ();
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
                final Element callingOptionElement =
                        (Element) XPath.selectSingleNode (fwDom, "/OracleReportRequest/OracleReport[./Reference = '" +
                                reference + "']/OracleParameters/params/param[@name='P_CALLING_OPTION']/value");
                String callingOption = "";
                if (callingOptionElement != null)
                {
                    callingOption = callingOptionElement.getText ();
                }
                final String modifiedReportName = getModifiedReportName (callingOption, thisReportName);

                reportInfo = getDetailedReportInformation (modifiedReportName);
                reportDescription = reportInfo.getChild ("ORDER_DESCRIPTION").getText ();
                reportModuleGroup = reportInfo.getChild ("MODULE_GROUP").getText ();
                reportModule = reportInfo.getChild ("MODULE_NAME").getText ();
                if (currentSequence != null)
                {
                    currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + currentSequence;
                }
            }

            if (currentSequence == null)
            {
                final String systemDataItemValue = getReportNo (reportInfo.getChild ("FILE_PREFIX").getText ());
                if (systemDataItemValue != null)// Possible for CM_CVER
                {
                    currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + systemDataItemValue;
                }
                if (currentSequence == null)
                {
                    // looks like CM_CTR_RCPT is coming in
                    final Element tranNoElement = (Element) XPath.selectSingleNode (fwDom.getRootElement (),
                            "/OracleReportRequest/OracleReport[./Reference = '" + reference +
                                    "']/OracleParameters/params/param[name = 'P_TRAN_NO']/value");

                    if (tranNoElement != null)
                    {
                        currentSequence = reportInfo.getChild ("FILE_PREFIX").getText () + tranNoElement.getText ();
                    }
                }
            }

            final Element reportReprintsElement = new Element ("insert_report_reprints");

            XMLBuilder.add (reportReprintsElement, "USERNAME", mUserId);
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

            final Document storeRepormProxyonseDoc =
                    mProxy.getJDOM (REPORTS_SERVICE, INSERT_REPRINT_RECORD, reportReprintsParams);
        }
        else
        {
            log.debug ("Reprints Table Storage is not Required : " + thisReportName);
        }
    }

    /**
     * Store REPORT_MAP record for outputs that are bulk printed. Driven by ReportConfig.xml
     *
     * @param thisReportName the this report name
     * @param fwReportId the fw report id
     * @param eventBased the event based
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void storeReportMapRecord (String thisReportName, final String fwReportId, final boolean eventBased)
        throws JDOMException, SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();

        // Event based, removed the -I or -X after the report name
        if (eventBased && thisReportName.indexOf ("-") != -1)
        {
            thisReportName = thisReportName.substring (0, thisReportName.indexOf ("-"));
        }

        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        // Special behaviour for N64 - only want to bulk print for AEs, not for COs
        if (thisReportName.equals ("N64") && mReportModuleGroup.equals ("CO"))
        {
            reportConfigDO.setBulkPrint (false);
        }

        // Handle
        if (reportConfigDO != null && reportConfigDO.isBulkPrint ())
        {
            log.trace ("Storing in REPORT_MAP Table : " + thisReportName);

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
            final Document storeReportResponseDoc = proxy.getJDOM (REPORTS_SERVICE, INSERT_REPORT_MAP, reportMapParams);
        }
        else
        {
            log.debug ("REPORT_MAP Table Storage is not Required : " + thisReportName);
        }
    }

    /**
     * Gets the sequence number for the report.
     *
     * @param prefix the prefix
     * @return the report no
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getReportNo (final String prefix) throws SystemException, BusinessException
    {
        String value = null;
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "courtCode", mCourtId);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final String getSystemDataInfoParams = mOutputter.outputString (getSystemDataInfoParamsElement);

        final Document getSystemDataInfoResponseDoc =
                mProxy.getJDOM ("ejb/SystemDataServiceLocal", "getSystemDataItemLocal", getSystemDataInfoParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Sequence returned from getReportNo: " + mOutputter.outputString (getSystemDataInfoResponseDoc));
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
     * Waits for a report to complete.
     *
     * @param thisReportName the this report name
     * @param fwReportId the fw report id
     * @param casemanReportRef the caseman report ref
     * @return the string
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String waitForCompletion (final String thisReportName, final String fwReportId,
                                      final String casemanReportRef)
        throws JDOMException, SystemException, BusinessException
    {
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        // BATCH_REF should be completed last so we can wait until the whole batch is finished by passing in BATCH as
        // reference
        if (reportConfigDO != null && reportConfigDO.isWaitForCompletion () || casemanReportRef.equals (BATCH_REF))
        {
            log.debug ("Waiting for Report Completion : " + thisReportName);

            boolean finished = isReportFinished (thisReportName, fwReportId, casemanReportRef);

            if (finished)
            {
                return "success"; // Just return.
            }
            else
            {
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
        }
        else
        {
            log.debug ("Wait Not required for : " + thisReportName);
            return "success";
        }
    }

    /**
     * Checks to see if a report has been printed or failed.
     *
     * @param thisReportName the this report name
     * @param fwReportId the fw report id
     * @param casemanReportRef the caseman report ref
     * @return true, if is report finished
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean isReportFinished (final String thisReportName, final String fwReportId,
                                      final String casemanReportRef)
        throws JDOMException, SystemException, BusinessException
    {
        log.debug ("isReportFinished():Waiting for Report to Finish : " + thisReportName);

        final Element getReportsElement = new Element ("ReportReference");

        XMLBuilder.add (getReportsElement, "Id", fwReportId);
        XMLBuilder.add (getReportsElement, "Reference", casemanReportRef);

        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());
        final Element getReportParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getReportParamsElement, "ReportReference", getReportsElement);
        final String getReportParams = outputter.outputString (getReportParamsElement);

        final Document getReportResponseDoc =
                mProxy.getJDOM ("ejb/ReportsServiceLocal", "getReportLocal", getReportParams);

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
     * Adds a report request to the batch passed in by fwDom.
     * Ensure that addRequestElement has been called first to create the required parent nodes.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @param fwDom the fw dom
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public void addReportToRequest (String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder,
                                    final Document fwDom)
        throws BusinessException, SystemException
    {
        Element RequestReportElement = null;
        Element paramsElement = null;
        Document reportParams = null;
        mBatchSize++; // Keeps track of number of reports in batch.

        reportParams = new Document ();
        if (pReport.lastIndexOf (".rdf") == -1)
        {
            pReport = pReport + ".rdf";
        }
        pRequestReportXMLBuilder.setReportModule (pReport);
        RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        paramsElement = XMLBuilder.getNewParamsElement (reportParams);
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        try
        {
            // Add record to print job table--------------------------------------------------
            // Call the updatePrintJob method to generate a unique sequence id
            // and to add audit information to the print job table:
            // Needs to be a seperate transaction so that the update is
            // committed.
            // The returned document is stripped down to only the Report node
            // from the original input, but it now contains additional data.

            final String requestReportParams = mOutputter.outputString (paramsElement);
            final Document pipelinedDoc = mProxy.getJDOM (REPORTS_SERVICE, UPDATE_PRINT_JOB, requestReportParams);

            final Element reportEl = pipelinedDoc.getRootElement ();

            final String printJobId = reportEl.getChild ("PrintJobId").getTextTrim ();

            final Element inputReportElement =
                    (Element) XPath.selectSingleNode (paramsElement, "/params/param[@name='reportRequest']/Report");

            final String reportModule = inputReportElement.getChild ("ReportModule").getText ();

            final String thisReportID = reportModule.substring (0, reportModule.lastIndexOf (".rdf"));

            final ArrayList<String> retVal = generateSystemData (thisReportID, paramsElement);

            String prefix = null;
            String currentSequence = null;

            if (retVal != null && retVal.size () == 2)
            {
                prefix = (String) retVal.get (0);
                currentSequence = (String) retVal.get (1);
            }
            // Had to buffer these sequences - used in after report tasks.
            mCurrentSequencesList.add (currentSequence);

            // Map CaseMan Report Dom (inputDoc) to SUPSReporting DOM
            mapToFWDom (paramsElement, reportModule, printJobId, currentSequence, prefix, thisReportID, fwDom);

            log.debug ("Report added to request : " + reportModule);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to build JDOM from source in addReportToRequest", e);
        }

    } // End addReportToRequest()

    /**
     * Gets system data.
     *
     * @param pItem the item
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected String systemDataItemValue (final String pItem) throws BusinessException, SystemException
    {

        Element resultElement = null;
        Element valueElement = null;
        String itemValue = "0";
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element systemdataParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (systemdataParamsElement, "courtCode", "0");
            XMLBuilder.addParam (systemdataParamsElement, "item", pItem);

            resultElement = mProxy.getJDOM (SYSTEM_DATA_SERVICE, GET_SYSTEM_DATA_ITEM,
                    mOutputter.outputString (systemdataParamsElement)).getRootElement ();

            valueElement = (Element) XPath.selectSingleNode (resultElement, "/ds/SystemData/ItemValue");
            if (null != valueElement)
            {
                itemValue = ((Element) XPath.selectSingleNode (resultElement, "/ds/SystemData/ItemValue"))
                        .getText ();
                ;
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return itemValue;
    }

    /**
     * Gets the court FAP id.
     *
     * @return the court FAP id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String getCourtFAPId () throws SystemException, BusinessException
    {
        String fapId = null;

        final Element fapParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (fapParamsElement, "userId", mUserId);
        XMLBuilder.addParam (fapParamsElement, "courtId", mCourtId);

        final Document fapResponseDoc =
                mProxy.getJDOM (COURT_SERVICE, GET_FAP_ID, mOutputter.outputString (fapParamsElement));

        final Element fapResponseRootElement = fapResponseDoc.getRootElement ();
        final Element courtDetailsElement = fapResponseRootElement.getChild ("CourtDetails");
        if (courtDetailsElement != null)
        {
            final Element fapIDElement = courtDetailsElement.getChild ("FAPId");
            if (fapIDElement == null)
            {
                throw new SystemException ("FAP ID is not allocated to Court : " + mCourtId);
            }
            else
            {
                fapId = fapIDElement.getText ();
                log.debug ("FAP ID : " + fapId);
                if (fapId.length () < 1)
                {
                    throw new SystemException (
                            "Report not generated. Print Server ID is not allocated to Court : " + mCourtId);
                }
            }
        }
        return fapId;
    }

    /**
     * Generates system data for a report.
     *
     * @param thisReportName the this report name
     * @param inputDoc the input doc
     * @return the array list
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private ArrayList<String> generateSystemData (final String thisReportName, final Element inputDoc)
        throws SystemException, BusinessException, JDOMException
    {
        final ArrayList<String> retVal = new ArrayList<>();
        String currentSequence = "0";
        String modifiedReportName = thisReportName;
        final ReportConfigManager reportConfigManager = ReportConfigManager.getInstance ();
        final ReportConfigDO reportConfigDO = reportConfigManager.getReportConfigDO (thisReportName);

        if (reportConfigDO != null && reportConfigDO.isUpdateSystemData ())
        {
            final Element callingOptionElement = (Element) XPath.selectSingleNode (inputDoc,
                    "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='P_CALLING_OPTION']");
            String callingOption = "";
            if (callingOptionElement != null)
            {
                callingOption = callingOptionElement.getText ();
            }
            modifiedReportName = getModifiedReportName (callingOption, thisReportName);

            log.debug ("System Data Update Required For Report Prefix : " + modifiedReportName);
            final Element detailedReportInfo = getDetailedReportInformation (modifiedReportName);

            final String prefix = detailedReportInfo.getChild ("FILE_PREFIX").getText ();
            final Element systemDataElement = getSystemDataInformation (prefix);
            retVal.add (prefix);

            if (systemDataElement != null)
            {
                final Element currentSequenceElement = systemDataElement.getChild ("ItemValue");
                currentSequence = currentSequenceElement.getText ();
                log.debug ("Current Sequence : " + currentSequence + " for Prefix : " + prefix);
                incrementSystemDataInformation (prefix);
            }
            else
            {
                createSystemDataInformation (prefix);
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
     * Changes the report name for CM_PLL in some circumstances.
     * callingOption is the value of the oracle report parameter P_CALLING_OPTION for the report.
     *
     * @param callingOption the calling option
     * @param thisReportName the this report name
     * @return the modified report name
     */
    private String getModifiedReportName (final String callingOption, final String thisReportName)
    {
        String modifiedReportName = thisReportName;
        if (thisReportName.equals ("CM_PPL"))
        {
            if (callingOption != null && callingOption.equals ("D"))
            {
                modifiedReportName = "CM_DIV";
            }
        }
        return modifiedReportName;
    }

    /**
     * Gets information for a report.
     *
     * @param reportName the report name
     * @return the detailed report information
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getDetailedReportInformation (final String reportName) throws SystemException, BusinessException
    {
        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", reportName);

        final String reportPrintParams = mOutputter.outputString (reportPrintParamsElement);

        log.trace ("Calling ReportsServiceLocal.getReportPrintInformationLocal to get Detailed report Information");
        final Document reportPrintResponseDoc =
                mProxy.getJDOM (REPORTS_SERVICE, GET_REPORT_PRINT_INFO, reportPrintParams);

        final Element reportPrintRootElement = reportPrintResponseDoc.getRootElement ();
        final Element rowElement = reportPrintRootElement.getChild ("row");

        return rowElement;
    }

    /**
     * Gets system information for the current court.
     *
     * @param prefix the prefix
     * @return the system data information
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getSystemDataInformation (final String prefix) throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", mCourtId);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final String getSystemDataInfoParams = mOutputter.outputString (getSystemDataInfoParamsElement);

        log.debug ("Calling SystemDataServiceLocal.getSequenceNumberForUpdateLocal to get Next Sequence Number for : " +
                prefix + " and Court : " + mCourtId);
        final Document getSystemDataInfoResponseDoc =
                mProxy.getJDOM (SYSTEM_DATA_SERVICE, GET_UPDATE_SEQUENCE_NO, getSystemDataInfoParams);

        final Element reportPrintRootElement = getSystemDataInfoResponseDoc.getRootElement ();
        final Element systemDataElement = reportPrintRootElement.getChild ("SystemData");

        return systemDataElement;
    }

    /**
     * Increments system data info for the current court and report.
     *
     * @param prefix the prefix
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void incrementSystemDataInformation (final String prefix) throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", mCourtId);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final String getSystemDataInfoParams = mOutputter.outputString (getSystemDataInfoParamsElement);

        log.debug (
                "Calling SystemDataServiceLocal.incrementSequenceNumberLocal : " + prefix + " and Court : " + mCourtId);
        final Document getSystemDataInfoResponseDoc =
                mProxy.getJDOM (SYSTEM_DATA_SERVICE, INCREMENT_SEQUENCE_NO, getSystemDataInfoParams);

    }

    /**
     * Creates system data info for the current court and report.
     *
     * @param prefix the prefix
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void createSystemDataInformation (final String prefix) throws SystemException, BusinessException
    {
        final Element getSystemDataInfoParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "adminCourtCode", mCourtId);
        XMLBuilder.addParam (getSystemDataInfoParamsElement, "item", prefix);

        final String getSystemDataInfoParams = mOutputter.outputString (getSystemDataInfoParamsElement);

        log.debug ("Calling SystemDataServiceLocal.createSequenceNumberLocal : " + prefix + " and Court : " + mCourtId);
        final Document getSystemDataInfoResponseDoc =
                mProxy.getJDOM (SYSTEM_DATA_SERVICE, CREATE_SEQUENCE_NO, getSystemDataInfoParams);

    }

    /**
     * Converts input parameters about a report into a dom fragment for a framework report request.
     *
     * @param inputDoc the input doc
     * @param reportName the report name
     * @param printJobId the print job id
     * @param currentSequence the current sequence
     * @param prefix the prefix
     * @param thisReportName the this report name
     * @param fwDom the fw dom
     * @return the document
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document mapToFWDom (final Element inputDoc, final String reportName, final String printJobId,
                                 final String currentSequence, final String prefix, final String thisReportName,
                                 final Document fwDom)
        throws JDOMException, SystemException, BusinessException
    {
        final Element oracleReportElement = new Element ("OracleReport");

        final Element inputReportElement =
                (Element) XPath.selectSingleNode (inputDoc, "/params/param[@name='reportRequest']/Report");
        final Element paramsElement = new Element ("params");
        final Element inputParameters = inputReportElement.getChild ("specificParameters");
        final List<Element> inputParamElementList = inputParameters.getChildren ("Parameter");

        String welshTrans = "N";
        final Element welshTransElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='WELSH_TRANS']");
        if (welshTransElement != null)
        {
            // Turn off bulk printing if the Welsh Translation flag returns with Y
            welshTrans = welshTransElement.getText ();
        }

        String jurisdiction = "ALL";
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

        for (Iterator<Element> iter = inputParamElementList.iterator (); iter.hasNext ();)
        {
            final Element inputParamElement = (Element) iter.next ();
            final String name = inputParamElement.getAttributeValue ("name");
            final String value = inputParamElement.getTextTrim ();
            final Element paramElement = new Element ("param");
            XMLBuilder.add (paramElement, "name", name);

            XMLBuilder.add (paramElement, "value", value);
            paramsElement.addContent (paramElement);
        }
        String orderId = null;

        Element orderIdElement = (Element) XPath.selectSingleNode (inputDoc,
                "/params/param[@name='reportRequest']/Report/specificParameters/Parameter[@name='P_DOCUMENT_ID']");
        if (orderIdElement != null)
        {
            orderIdElement = (Element) orderIdElement.detach ();
            if (log.isDebugEnabled ())
            {
                log.debug ("OrderID Element : " + mOutputter.outputString (orderIdElement));
            }
            orderId = orderIdElement.getText ();
        }

        if (orderId == null)
        {
            orderId = reportName.substring (0, reportName.indexOf ("."));
        }

        Element printElement = null;

        printElement = getPrintOptionsElement (orderId, welshTrans, jurisdiction, reportModuleGroup);
        if (printElement != null)
        {
            oracleReportElement.addContent (printElement);
        }

        Element paramElement = new Element ("param");
        XMLBuilder.add (paramElement, "name", "P_COURT_CODE");
        XMLBuilder.add (paramElement, "value", mCourtId);
        paramsElement.addContent (paramElement);

        paramElement = new Element ("param");
        XMLBuilder.add (paramElement, "name", "P_SUBMITTED_BY");
        XMLBuilder.add (paramElement, "value", mUserId);
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

        XMLBuilder.add (oracleReportElement, "MimeType", "application/pdf");
        XMLBuilder.add (oracleReportElement, "CurrentSequence", currentSequence);
        final String duration = getStorageDuration (thisReportName);

        XMLBuilder.add (oracleReportElement, "StorageDuration", duration);
        XMLBuilder.add (oracleReportElement, "Reference", printJobId);
        oracleReportElement.addContent (oracleParametersElement);

        Element oracleReportRequestElement = null;
        oracleReportRequestElement = fwDom.getRootElement ();
        oracleReportRequestElement.addContent (oracleReportElement);

        return fwDom;
    }

    /**
     * Creates a framework batch report request domm.
     *
     * @param fwDom the fw dom
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    protected void addRequestElement (final Document fwDom) throws SystemException, BusinessException
    {
        String userPrinter = "";

        // Get printer for user
        final Element userInfoRowElement = getUserInformation ();
        if (userInfoRowElement != null)
        {
            userPrinter = userInfoRowElement.getChild ("PRINTER").getText ();
            log.debug ("User Printer : " + userPrinter);
            if (userPrinter.length () < 1)
            {
                throw new SystemException (
                        "Report not generated. User does not have a default printer allocated : " + mUserId);
            }
        }
        else
        {
            throw new SystemException ("Report not generated. User does not exist in DCA_USER table : " + mUserId);
        }

        final Element oracleReportRequestElement = new Element ("OracleReportRequest");
        final Element idElement = new Element ("Id");
        oracleReportRequestElement.addContent (idElement);

        XMLBuilder.add (oracleReportRequestElement, "Reference", BATCH_REF);
        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", "CM_AUTH_LST.rdf");

        final Element printElement = new Element ("Print");
        XMLBuilder.add (printElement, "Type", "pdf2ps");

        final Element destinationElement = new Element ("Destination");
        XMLBuilder.add (destinationElement, "Server", getCourtFAPId ());
        XMLBuilder.add (destinationElement, "Printer", userPrinter);
        printElement.addContent (destinationElement);

        // Default print options.
        final Element optionsElement = new Element ("Options");
        XMLBuilder.add (optionsElement, "Tray", "");
        XMLBuilder.add (optionsElement, "NumCopies", "1");
        XMLBuilder.add (optionsElement, "Duplex", "false");

        printElement.addContent (optionsElement);
        oracleReportRequestElement.addContent (printElement);
        fwDom.addContent (oracleReportRequestElement);
    }

    /**
     * Creates a print options element with default parameters for a specific report.
     *
     * @param reportName the report name
     * @param welshTrans the welsh trans
     * @param jurisdiction the jurisdiction
     * @param reportModuleGroup the report module group
     * @return the prints the options element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getPrintOptionsElement (final String reportName, final String welshTrans, final String jurisdiction,
                                            final String reportModuleGroup)
        throws SystemException, BusinessException
    {

        /* Need to return nodes in the following format...
         * <PrintOptions>
         * <Tray></Tray> Numeric
         * <Duplex></Duplex> true or false
         * <NumCopies></NumCopies> Numeric
         * </PrintOptions> */

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

        // Bulk Printed outputs should not be printed locally
        if (isBulkPrint)
        {
            log.debug ("Printing not enabled for : " + reportName);
            return null;
        }

        // First find out how many copies etc the report requires.
        final Element reportPrintParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (reportPrintParamsElement, "reportId", reportName);
        final String reportPrintParams = mOutputter.outputString (reportPrintParamsElement);

        log.trace ("Calling ReportsServiceLocal.getReportPrintInformationLocal to get report information");
        final Document reportPrintResponseDoc =
                mProxy.getJDOM (REPORTS_SERVICE, GET_REPORT_PRINT_INFO, reportPrintParams);
        if (log.isDebugEnabled ())
        {
            log.debug ("Report Information returned : " + mOutputter.outputString (reportPrintResponseDoc));
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
        else
        {
            log.warn ("The report does not have any record in ORDER_TYPES table : " + reportName);
            log.warn ("Report will be printed to Tray 1");
        }

        final Element printOptionsElement = new Element ("PrintOptions");

        XMLBuilder.add (printOptionsElement, "Tray", tray);
        XMLBuilder.add (printOptionsElement, "NumCopies", noOfCopies);
        if (printerType.equals ("D"))
        {
            XMLBuilder.add (printOptionsElement, "Duplex", "true");
        }
        else
        {
            XMLBuilder.add (printOptionsElement, "Duplex", "false");
        }

        return printOptionsElement;
    }

    /**
     * Gets the user information.
     *
     * @return the user information
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element getUserInformation () throws SystemException, BusinessException
    {
        final Element userInformationParamsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (userInformationParamsElement, "userId", mUserId);
        XMLBuilder.addParam (userInformationParamsElement, "courtId", mCourtId);
        final String userInformationParams = mOutputter.outputString (userInformationParamsElement);

        log.trace ("Calling ReportsServiceLocal.getUserInformationLocal to get printer information");
        final Document userInformationResponseDoc =
                mProxy.getJDOM (REPORTS_SERVICE, GET_USER_INFO, userInformationParams);

        final Element userInformationRootElement = userInformationResponseDoc.getRootElement ();
        final Element userInfoRowElement = userInformationRootElement.getChild ("row");

        return userInfoRowElement;
    }

    /**
     * Adds report and number to a request dom.
     * Example is adding
     * <param>
     * <name>P_REPORT_NO</name>
     * <value>AUTH_98</value>
     * </param>
     *
     * @param thisReportName the this report name
     * @param currentSequence the current sequence
     * @param prefix the prefix
     * @param paramsElement the params element
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void addReportNoToParams (final String thisReportName, final String currentSequence, final String prefix,
                                      final Element paramsElement)
        throws JDOMException, SystemException, BusinessException
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
     * Gets the storage duration for the report.
     *
     * @param thisReportName the this report name
     * @return the storage duration
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
        }
        log.debug ("Storage Duration for Report : " + thisReportName + " is : " + storageDuration);
        return storageDuration;
    }

    /**
     * Allows a report to be run outside of a batch.
     * Used for CM_AUTH_LST in ae sod for example. Halts processing until report is complete.
     *
     * @param pReport the report
     * @param pRequestReportXMLBuilder the request report XML builder
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected void runIndividualReport (final String pReport, final RequestReportXMLBuilder pRequestReportXMLBuilder)
        throws BusinessException, SystemException
    {
        log.trace ("Running report out of batch: " + pReport);
        final Document reportParams = new Document ();
        pRequestReportXMLBuilder.setReportModule (pReport);
        final Element RequestReportElement = pRequestReportXMLBuilder.getXMLElement ("Report");
        final Element paramsElement = XMLBuilder.getNewParamsElement (reportParams);
        XMLBuilder.addParam (paramsElement, "reportRequest", (Element) RequestReportElement.clone ());

        // Call the request report service via a proxy
        invokeLocalServiceProxy (REPORTS_SERVICE, REQUEST_REPORT, reportParams).getRootElement ();
    }

    /**
     * Gets details for the order that is to be printed.
     *
     * @param pOrderType the order type
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected Element mGetOrderTypeDetails (final String pOrderType) throws BusinessException, SystemException
    {

        Element orderTypeElement = null;
        try
        {
            /* get list of output definitions associated with this AeEvent */
            final Element orderTypeParamsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (orderTypeParamsElement, "orderType", pOrderType);

            final Element resultElement = mProxy.getJDOM (START_OF_DAY_SERVICE, GET_ORDER_TYPE_DETAILS,
                    mOutputter.outputString (orderTypeParamsElement)).getRootElement ();

            orderTypeElement = (Element) XPath.selectSingleNode (resultElement, "/ds/OrderType");

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        return orderTypeElement;
    }
}
