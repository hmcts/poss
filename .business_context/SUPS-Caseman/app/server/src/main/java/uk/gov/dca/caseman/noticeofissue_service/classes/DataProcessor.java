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

import java.io.FileWriter;
import java.io.StringReader;
import java.io.Writer;

import javax.xml.transform.Result;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
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
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The XML passed through the integration point with the Case screen (UC001) is 'unstable'.
 * This class complements the XML data with data we read from the database.
 * See log near bottom of file for file modifications
 * 
 * @author Christopher Vincent
 * 
 *         Change History:
 *         08-Feb-2008 Chris Vincent: CaseMan Defect 6181. Changed the method getCourtFAPId() to use a different
 *         retrieval service to lookup the user printer court instead of the fap id associated with the
 *         user's home court.
 */
public class DataProcessor implements ICustomProcessor
{
    /**
     * Case service method name.
     */
    public static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    /**
     * Get case summary method name.
     */
    public static final String GET_CASE_SUMMARY = "getCaseLocal";
    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * Get case event summary method name.
     */
    public static final String GET_CASE_EVENT_SUMMARY = "getCaseEventLocal";
    /**
     * CO service name.
     */
    public static final String CO_SERVICE = "ejb/CoServiceLocal";
    /**
     * Get CO local method name.
     */
    public static final String GET_CO = "getCoLocal";
    /**
     * Get CO debt list method name.
     */
    public static final String GET_CO_DEBT_LIST = "getCoDebtListLocal";
    /**
     * CO event service name.
     */
    public static final String CO_EVENT_SERVICE = "ejb/CoEventServiceLocal";
    /**
     * Get CO events method name.
     */
    public static final String GET_CO_EVENTS = "getCoEventsLocal";
    /**
     * Judgment service name.
     */
    public static final String JUDGMENT_SERVICE = "ejb/JudgmentServiceLocal";
    /**
     * Get judgment summary method name.
     */
    public static final String GET_JUDGMENT_SUMMARY = "getJudgmentLocal";
    /**
     * Obligation service name.
     */
    public static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    /**
     * Get obligation summary method name.
     */
    public static final String GET_OBLIGATION_SUMMARY = "getObligationsLocal";
    /**
     * Hearing service name.
     */
    public static final String HEARING_SERVICE = "ejb/HearingServiceLocal";
    /**
     * Get hearing local method name.
     */
    public static final String GET_HEARING = "getHearingLocal";
    /**
     * Transfer case service name.
     */
    public static final String TRANSFER_CASE_SERVICE = "ejb/TransferCaseServiceLocal";
    /**
     * Get transfer case method name.
     */
    public static final String GET_TRANSFER_CASE = "getTransferCaseLocal";
    /**
     * Warrant service name.
     */
    public static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    /**
     * Get warrant method name.
     */
    public static final String GET_WARRANT = "getWarrantLocal";
    /**
     * Warrant retuens service name.
     */
    public static final String WARRANT_RETURNS_SERVICE = "ejb/WarrantReturnsServiceLocal";
    /**
     * Get warrant returns method name.
     */
    public static final String GET_WARRANT_RETURNS = "getWarrantReturnsLocal";
    /**
     * User service name.
     */
    public static final String USER_SERVICE = "ejb/UserServiceLocal";
    /**
     * Get user method name.
     */
    public static final String GET_USER = "getUserLocal";
    /**
     * Court service name.
     */
    public static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    /**
     * Get court fap method name.
     */
    public static final String GET_COURT_FAP = "getCourtFapByUserLocal";
    
    /** All Court Information. */
    public static final String GET_COURT_LONG = "getCourtLongLocal";
    
    /** WPOutput Service Name. */
    public static final String WPOUTPUT_SERVICE = "ejb/WpOutputServiceLocal";
    
    /** Get WPOutputData method. */
    public static final String GET_WPOUTPUT_DATA = "getDataLocal";
    
    /** SUPS Application Logger. */
    private static final Log log = SUPSLogFactory.getLogger (DataProcessor.class);

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;
    
    /** The fw. */
    FileWriter fw = null;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public DataProcessor () throws JDOMException
    {
        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * (non-Javadoc).
     *
     * @param inputParameters the input parameters
     * @param output the output
     * @param pLog the log
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final org.jdom.Document inputParameters, final Writer output, final Log pLog)
        throws SystemException, BusinessException
    {
        // Note that this class now uses its own logger instead of the one passed to it as a parameter
        if (log.isDebugEnabled ())
        {
            log.debug ("DataProcessor starts process");
        }
        fetchData (inputParameters, output);
        if (log.isDebugEnabled ())
        {
            log.debug ("DataProcessor finished process");
        }
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

    /**
     * (non-Javadoc)
     * Load and process word processing data.
     *
     * @param doc the doc
     * @param output the output
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void fetchData (final org.jdom.Document doc, final Writer output) throws SystemException, BusinessException
    {
        final String msg = "DataProcessor.fetchData() ";
        if (log.isTraceEnabled ())
        {
            log.trace (msg + "starts");
        }
        try
        {
            if (log.isDebugEnabled ())
            {
                log.debug (msg + "incoming document: \n" + getXMLString (doc.getRootElement ()));
            }

            final Element courtIdNode = (Element) XPath.selectSingleNode (doc, "/params/param[@name='courtId']");
            String courtId = "111";
            if (courtIdNode != null)
            {
                courtId = courtIdNode.getValue ();
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("courtId = " + courtId);
            }

            final Element userIdNode = (Element) XPath.selectSingleNode (doc, "/params/param[@name='userId']");
            String userId = "NOBODY";
            if (userIdNode != null)
            {
                userId = userIdNode.getValue ();
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("userId = " + userId);
            }

            final Element newXMLParam = (Element) XPath.selectSingleNode (doc, "/params/param[@name='xml']");

            final Element caseEventPkNode =
                    (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/CaseEventSeq");
            if (log.isDebugEnabled ())
            {
                log.debug ("caseEventPkNode = " + caseEventPkNode);
            }

            String eventNumber = "";
            String eventPK = "";
            String eventCode = "";
            String caseNumber = "";
            String judgmentId = "";
            String warrantId = "";
            String warrantReturnsId = "";
            String partyAgainstNumber = "";

            String CONumber = "";
            String COEventPK = "";
            String DebtSequence = "";

            String AENumber = null;

            final Element duplicateElem = new Element ("DuplicateEvent");
            Element aeNumberElem = null;

            if (null != caseEventPkNode)
            {
                final String caseEventPkNodeText = caseEventPkNode.getText ();
                if (log.isDebugEnabled ())
                {
                    log.debug ("caseEventPkNode.getText()= " + caseEventPkNodeText);
                }

                // Get the duplicate event node. The client sets this in the context xml to inform
                // word processing that it is dealing with a duplicate event and the output needs
                // to include "duplicate" in the title
                final Element duplicateEventNode =
                        (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/Duplicate");

                String duplicateEventNodeText = "";
                if (duplicateEventNode != null)
                {
                    duplicateEventNodeText = duplicateEventNode.getText ();
                }

                String isDuplicate = "false";
                if (duplicateEventNodeText.equals ("true"))
                {
                    isDuplicate = "true";
                }
                duplicateElem.addContent (isDuplicate);

                eventNumber = ((Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/StandardEventId"))
                        .getValue ();
                eventPK = ((Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/CaseEventSeq"))
                        .getValue ();
                eventCode = "1";
                caseNumber =
                        ((Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Case/CaseNumber")).getValue ();

                Element warElem = (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Case/WarrantId");
                if (null == warElem)
                {
                    warElem = (Element) XPath.selectSingleNode (newXMLParam,
                            "WordProcessing/Event/WarrantID"); /** co05 **/
                }
                if (warElem != null)
                {
                    warrantId = warElem.getValue ();
                }
                Element warRetElem =
                        (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Case/WarrantReturnsId");
                if (null == warRetElem)
                {
                    warRetElem = (Element) XPath.selectSingleNode (newXMLParam,
                            "WordProcessing/Event/WarrantReturnsId"); /** co05 **/
                }
                if (warRetElem != null)
                {
                    warrantReturnsId = warRetElem.getValue ();
                }
                log.debug ("warrantReturnsId = " + warrantReturnsId);
                final Element pAgainstElem =
                        (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Case/PartyAgainstNumber");
                if (pAgainstElem != null)
                {
                    partyAgainstNumber = pAgainstElem.getValue ();
                }
                if (log.isDebugEnabled ())
                {
                    log.debug ("partyAgainstNumber=" + partyAgainstNumber);
                }

                aeNumberElem = (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/AENumber");
                if (aeNumberElem != null)
                {
                    AENumber = aeNumberElem.getValue ();
                }
            }
            else
            {
                COEventPK =
                        ((Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/COEventSeq")).getValue ();
                CONumber =
                        ((Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/CONumber")).getValue ();
                final Element debtSeqEle =
                        (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/DebtSeqNumber");
                if (null != debtSeqEle)
                {
                    DebtSequence = debtSeqEle.getValue ();
                }

                final Element warElem =
                        (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Event/WarrantID"); /** co05 **/
                if (warElem != null)
                {
                    warrantId = warElem.getValue ();
                }
                final Element warRetElem = (Element) XPath.selectSingleNode (newXMLParam,
                        "WordProcessing/Event/WarrantReturnsId"); /** co05 **/
                if (warRetElem != null)
                {
                    warrantReturnsId = warRetElem.getValue ();
                }
                log.debug ("warrantReturnsId = " + warrantReturnsId);
            }

            Element casexml = new Element ("Case");
            Element eventxml2 = new Element ("Event");
            Element transferxml2 = new Element ("Transfer");
            Element judgmentxml2 = new Element ("Judgment");
            Element obligationsxml2 = new Element ("Obligation");
            Element coxml2 = new Element ("CO");
            Element coxml3 = new Element ("CODEBTS");
            Element coexml2 = new Element ("COE");
            // Element userxml = new Element("User");
            final Element userDetailsXML = new Element ("UserDetails");
            Element warrantxml = null; // new Element("Warrant");
            final Element warRetXml = new Element ("WarrantReturn");
            Element WarRetEventXml = new Element ("WarrantEvent");
            Element courtFapXml = new Element ("CourtFap");
            final Element courtLongXml = new Element ("CourtLong");
            final Element aexml = new Element ("AE");
            Element WPData = new Element ("WPOutput");

            if (AENumber != null && !AENumber.equals (""))
            {
                final Element aedata = AEData.getAE (AENumber, caseNumber, proxy);
                if (log.isTraceEnabled ())
                {
                    log.trace ("===================Defect 4041========================");
                    log.trace ("AENumber = " + AENumber);
                    log.trace ("eventPK = " + eventPK);
                }
                try
                {
                    final Element aeEventData = AEData.getAEEvent (AENumber, eventPK, proxy);
                    aexml.addContent (aedata.detach ());
                    aexml.addContent (aeEventData.detach ());
                }
                catch (final NullPointerException ex)
                {
                    log.trace ("AEData.getAEEvent returns Null", ex.getCause ());
                }
            }

            Element userDetailsxml = new Element ("UserDetails");
            final String userParams = "<params><param name='userBeingEdited'>" + userId +
                    "</param><param name='courtId'>" + courtId + "</param></params>";
            Document dom = proxy.getJDOM (USER_SERVICE, GET_USER, userParams);
            if (null != dom)
            {
                userDetailsxml = dom.getRootElement ();
                if (log.isTraceEnabled ())
                {
                    log.trace ("======= USER DETAILS ======");
                    log.trace (getXMLString (userDetailsxml));
                    log.trace ("===========================");
                }
            }
            else
            {
                if (log.isInfoEnabled ())
                {
                    log.info ("No data read from " + USER_SERVICE + "/" + GET_USER);
                }
            }

            final String WPOutputDataParams = "<params>" + getXMLString (newXMLParam) + "</params>";
            log.trace ("Going to load WP data using params: " + WPOutputDataParams);
            dom = proxy.getJDOM (WPOUTPUT_SERVICE, GET_WPOUTPUT_DATA, WPOutputDataParams);
            if (null != dom)
            {
                WPData = dom.getRootElement ();
                if (log.isTraceEnabled ())
                {
                    log.trace ("===== WPOUTPUT_DATA =======");
                    log.trace (getXMLString (WPData));
                    log.trace ("===========================");
                }
            }
            else
            {
                if (log.isInfoEnabled ())
                {
                    log.info ("No data read from " + WPOUTPUT_SERVICE + "/" + GET_WPOUTPUT_DATA);
                }
            }

            final String courtFapParams = "<params><param name='userId'>" + userId + "</param><param name='courtId'>" +
                    courtId + "</param></params>";
            dom = proxy.getJDOM (COURT_SERVICE, GET_COURT_FAP, courtFapParams);
            if (null != dom)
            {
                courtFapXml = dom.getRootElement ();
                if (log.isTraceEnabled ())
                {
                    log.trace ("======= COURT FAP =========");
                    log.trace (getXMLString (courtFapXml));
                    log.trace ("===========================");
                }
            }
            else
            {
                if (log.isInfoEnabled ())
                {
                    log.info ("No data read from " + COURT_SERVICE + "/" + GET_COURT_FAP);
                }
            }

            if (partyAgainstNumber.length () > 0)
            {
                warRetXml.addContent (new Element ("PartyAgainstNumber").setText (partyAgainstNumber));
            }

            Element judgSeqEl = (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Judgment/JudgSeq");
            if (null != judgSeqEl)
            {
                judgmentId = judgSeqEl.getValue ();
            }
            else
            {
                judgSeqEl = (Element) XPath.selectSingleNode (newXMLParam, "WordProcessing/Judgment/JudgmentId");
                if (null != judgSeqEl)
                {
                    judgmentId = judgSeqEl.getValue ();
                }
            }

            if (log.isTraceEnabled ())
            {
                log.trace ("About to load WordProcessing Data for Case: " + caseNumber + " - Event " + eventNumber +
                        "-" + eventCode + " - judgumentId: " + judgmentId);
                log.trace (getXMLString (doc.getRootElement ()));
            }

            final Element oldXMLParam = (Element) newXMLParam.clone ();
            oldXMLParam.removeAttribute ("name");
            oldXMLParam.setAttribute (new Attribute ("name", "old-xml"));

            if ( !"".equals (caseNumber))
            {
                final String caseParams = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";
                dom = proxy.getJDOM (CASE_SERVICE, GET_CASE_SUMMARY, caseParams);
                if (null != dom)
                {
                    casexml = dom.getRootElement ();
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("====== CASE DETAILS =======");
                        log.trace (getXMLString (casexml));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + CASE_SERVICE + "/" + GET_CASE_SUMMARY);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No CaseNumber supplied - no case data loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !"".equals (eventPK))
            {
                final String eventParams = "<params><param name='caseNumber'>" + caseNumber +
                        "</param><param name='caseEventSeq'>" + eventPK + "</param></params>";
                dom = proxy.getJDOM (CASE_EVENT_SERVICE, GET_CASE_EVENT_SUMMARY, eventParams);
                if (null != dom)
                {
                    final Element eventxml = dom.getRootElement ();
                    eventxml2 = new Element ("eventxml");
                    eventxml2.addContent (((Element) eventxml.clone ()).detach ());
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("=== CASE EVENT DETAILS ====");
                        log.trace (getXMLString (eventxml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + CASE_EVENT_SERVICE + "/" + GET_CASE_EVENT_SUMMARY);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No eventSeq/PK supplied - no event data loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !"".equals (caseNumber))
            {
                final String judgParams = "<params><param name='CaseNumber'>" + caseNumber + "</param></params>";
                dom = proxy.getJDOM (JUDGMENT_SERVICE, GET_JUDGMENT_SUMMARY, judgParams);
                if (null != dom)
                {
                    final Element judgmentxml = dom.getRootElement ();
                    judgmentxml2 = new Element ("judgementxml");
                    judgmentxml2.addContent (((Element) judgmentxml.clone ()).detach ());
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("==== JUDGMENT DETAILS =====");
                        log.trace (getXMLString (judgmentxml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + JUDGMENT_SERVICE + "/" + GET_JUDGMENT_SUMMARY);
                    }
                }
            }
            else
            {
                if (log.isInfoEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No caseNumber supplied - no judgments loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !"".equals (caseNumber))
            {
                final String caseParams = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";
                dom = proxy.getJDOM (OBLIGATION_SERVICE, GET_OBLIGATION_SUMMARY, caseParams);
                if (null != dom)
                {
                    final Element obligationsxml = dom.getRootElement ();
                    obligationsxml2 = new Element ("obligationxml");
                    obligationsxml2.addContent (((Element) obligationsxml.clone ()).detach ());
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("=== OBLIGATION DETAILS ====");
                        log.trace (getXMLString (obligationsxml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + OBLIGATION_SERVICE + "/" + GET_OBLIGATION_SUMMARY);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No caseNumber supplied - no obligations loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !"".equals (caseNumber))
            {
                final String caseParams = "<params><param name='caseNumber'>" + caseNumber + "</param></params>";
                dom = proxy.getJDOM (TRANSFER_CASE_SERVICE, GET_TRANSFER_CASE, caseParams);
                if (null != dom)
                {
                    final Element transferxml = dom.getRootElement ();
                    transferxml2 = new Element ("transferxml");
                    transferxml2.addContent (((Element) transferxml.clone ()).detach ());
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("== TRANSFER CASE DETAILS ==");
                        log.trace (getXMLString (transferxml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + TRANSFER_CASE_SERVICE + "/" + GET_TRANSFER_CASE);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No caseNumber supplied - no transfer data loaded.");
                    log.trace ("===========================");
                }
            }

            Element coxml = new Element ("NoCo");
            Element coxml22 = new Element ("NoCodEBTS");

            if ( !"".equals (CONumber))
            {
                final String caseParams = "<params><param name='coNumber'>" + CONumber + "</param></params>";
                dom = proxy.getJDOM (CO_SERVICE, GET_CO, caseParams);
                if (null != dom)
                {
                    coxml = dom.getRootElement ();
                    coxml2 = new Element ("CO");
                    coxml2.addContent (((Element) coxml.clone ()).detach ());
                    dom = proxy.getJDOM (CO_SERVICE, GET_CO_DEBT_LIST, caseParams);
                    if (null != dom)
                    {
                        coxml22 = dom.getRootElement ();
                        coxml3 = new Element ("DEBT");
                        coxml3.addContent (((Element) coxml22.clone ()).detach ());
                    }
                    else
                    {
                        if (log.isInfoEnabled ())
                        {
                            log.info ("No data read from " + CO_SERVICE + "/" + GET_CO_DEBT_LIST);
                        }
                    }
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("====== CO DETAILS =========");
                        log.trace (getXMLString (coxml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + CO_SERVICE + "/" + GET_CO);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No CO Number supplied - no CO data loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !"".equals (COEventPK))
            {
                final Element paramsElement = XMLBuilder.getNewParamsElement ();
                XMLBuilder.addParam (paramsElement, "coNumber", CONumber);
                XMLBuilder.addParam (paramsElement, "pageSize", "100");
                XMLBuilder.addParam (paramsElement, "pageNumber", "1");
                final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
                final String caseParams = xmlOutputter.outputString (paramsElement);
                dom = proxy.getJDOM (CO_EVENT_SERVICE, GET_CO_EVENTS, caseParams);
                if (null != dom)
                {
                    final Element coexml = dom.getRootElement ();
                    coexml2 = new Element ("COES");
                    coexml2.addContent (((Element) coexml.clone ()).detach ());
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("==== CO EVENT DETAILS =====");
                        log.trace (getXMLString (coexml2));
                        log.trace ("===========================");
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No data read from " + CO_EVENT_SERVICE + "/" + GET_CO_EVENTS);
                    }
                }
            }
            else
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("===========================");
                    log.trace ("No COeventPK supplied - no COEvent  data loaded.");
                    log.trace ("===========================");
                }
            }

            if ( !warrantId.equals (""))
            {
                final String warrantParams = "<params><param name='warrantID'>" + warrantId + "</param></params>";
                log.debug ("warrantParams=" + warrantParams);
                dom = proxy.getJDOM (WARRANT_SERVICE, GET_WARRANT, warrantParams);
                if (null != dom)
                {
                    final Element warxml = dom.getRootElement ();
                    warrantxml = (Element) ((Element) warxml.clone ()).detach ();
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Get warrant returned okay");
                    }
                }
                if ( !"".equals (warrantReturnsId))
                {
                    final String warrantRetParams =
                            "<params><param name='warrantID'>" + warrantId + "</param></params>";
                    log.debug ("warrantRetParams=" + warrantRetParams);
                    dom = proxy.getJDOM (WARRANT_RETURNS_SERVICE, GET_WARRANT_RETURNS, warrantRetParams);
                    if (null != dom)
                    {
                        log.debug (msg + "warxml doc: " + getXMLString (dom.getRootElement ()));
                        final Element warxml = dom.getRootElement ();
                        WarRetEventXml = (Element) XPath.selectSingleNode (warxml,
                                "/ds/WarrantReturns/WarrantEvents/WarrantEvent[WarrantReturnsID = " + warrantReturnsId +
                                        "]");
                        // WarRetEventXml
                        if (log.isDebugEnabled ())
                        {
                            log.debug ("warRetXml = " + WarRetEventXml);
                        }
                    }
                    else
                    {
                        if (log.isInfoEnabled ())
                        {
                            log.info ("No data read from " + WARRANT_SERVICE + "/" + GET_WARRANT);
                        }
                    }
                }
                else
                {
                    if (log.isInfoEnabled ())
                    {
                        log.info ("No warrant event/returns data read as no warrantReturnID found");
                    }
                }
            }
            else
            {
                if (log.isInfoEnabled ())
                {
                    log.info ("No WarrantId found!!!!\n\nNo WarrantId found\n\n");
                }
            }

            final Element whatJudgment = new Element ("JudgementId");
            whatJudgment.addContent (judgmentId);

            final Element whichCOE = new Element ("COEventSeq");
            whichCOE.addContent (COEventPK);

            final Element whatDebt = new Element ("DebtSequence");
            whatDebt.addContent (DebtSequence);

            final Element whatAE = new Element ("AENumber");
            whatAE.addContent (AENumber);

            final Element whatFAP = new Element ("FAP");
            whatFAP.addContent (((Element) courtFapXml.clone ()).detach ());

            newXMLParam.removeContent ();
            newXMLParam.addContent (duplicateElem);
            newXMLParam.addContent (whatJudgment);
            newXMLParam.addContent (whatDebt);
            newXMLParam.addContent (whichCOE);
            newXMLParam.addContent (whatAE);
            newXMLParam.addContent (((Element) casexml.clone ()).detach ());
            newXMLParam.addContent (eventxml2);
            newXMLParam.addContent (judgmentxml2);
            newXMLParam.addContent (obligationsxml2);
            if (null != transferxml2)
            {
                newXMLParam.addContent (transferxml2);
            }
            newXMLParam.addContent (((Element) coxml.clone ()).detach ());
            newXMLParam.addContent (coexml2);
            newXMLParam.addContent (coxml3);
            if (null != warrantxml)
            {
                newXMLParam.addContent (warrantxml);
            }
            if (null != warRetXml)
            {
                newXMLParam.addContent (((Element) warRetXml.clone ()).detach ());
            }
            if (null != WarRetEventXml)
            {
                newXMLParam.addContent (((Element) WarRetEventXml.clone ()).detach ());
            }
            userDetailsXML.addContent (((Element) userDetailsxml.clone ()).detach ());
            newXMLParam.addContent (whatFAP);
            newXMLParam.addContent (userDetailsXML);
            newXMLParam.addContent (((Element) WPData.clone ()).detach ());

            if (AENumber != null && !AENumber.equals (""))
            {
                newXMLParam.addContent (aexml);
            }

            if (log.isDebugEnabled ())
            {
                log.debug (msg + "replacing new xml parameter : " + getXMLString (newXMLParam));
                log.debug (msg + "replacing old xml parameter : " + getXMLString (oldXMLParam));
                log.debug (msg + "now have doc: " + getXMLString (doc.getRootElement ()));
            }
            addConsolidatedOrderCourtData (doc);

            final TransformerFactory transformerFactory = TransformerFactory.newInstance ();

            final XMLOutputter outputter = new XMLOutputter ();
            if (log.isDebugEnabled ())
            {
                log.debug ("INCOMING : " + outputter.outputString (doc));
            }

            final StreamSource src = new StreamSource (new StringReader (getXMLString (doc.getRootElement ())));
            final Result resultStream = new StreamResult (output);
            final Templates xslTemplates = transformerFactory.newTemplates (new StreamSource (new StringReader (
                    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:output method=\"xml\" version=\"1.0\" encoding=\"UTF-8\" /><xsl:strip-space elements=\"*\"/><xsl:template match=\"/\"><xsl:copy-of select=\".\" /></xsl:template></xsl:stylesheet>")));
            final Transformer transformer = xslTemplates.newTransformer ();
            transformer.transform (src, resultStream);
        }
        catch (final TransformerException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        if (log.isTraceEnabled ())
        {
            log.trace (msg + "ends");
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final uk.gov.dca.db.pipeline.IComponentContext ctx)
    {
    }

    /**
     * /params/param/ds/MaintainCO/OwningCourt.
     *
     * @param document the document
     * @throws SystemException the system exception
     */
    private void addConsolidatedOrderCourtData (final org.jdom.Document document) throws SystemException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addConsolidatedOrderCourtData()");
        }
        final Element el_courtId;
        try
        {
            el_courtId = (Element) XPath.selectSingleNode (document, "/params/param/ds/MaintainCO/OwningCourtCode");
            if (el_courtId != null)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("addConsolidatedOrderCourtData el_courtId: " + out.outputString (el_courtId));
                }
                final String courtId = el_courtId.getValue ();
                final Document dom =
                        proxy.getJDOM (COURT_SERVICE, GET_COURT_LONG, callServiceParam ("courtId", courtId));
                if (null != dom)
                {
                    final Element courtLongXml = dom.getRootElement ();
                    if (log.isTraceEnabled ())
                    {
                        log.trace ("======= COURT LONG =========");
                        log.trace (getXMLString (courtLongXml));
                        log.trace ("===========================");
                    }
                    final Element el_co = (Element) XPath.selectSingleNode (document, "/params/param/ds/MaintainCO");
                    el_co.addContent (((Element) courtLongXml.clone ()).detach ());
                }
            }
            else
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("no el_courtName found in the incoming xml");
                }
            }
        }
        catch (final JDOMException e)
        {
            log.error (e.getMessage ());
            throw new SystemException (e);
        }
        catch (final BusinessException e)
        {
            log.error (e.getMessage ());
            throw new SystemException (e);
        }
        catch (final SystemException e)
        {
            log.error (e.getMessage ());
            throw new SystemException (e);
        }
    }

    /**
     * XML formatted parameter generation for Service Call.
     *
     * @param parameterKey the parameter key
     * @param parameterValue the parameter value
     * @return the string
     */
    private String callServiceParam (final String parameterKey, final String parameterValue)
    {
        String rtn = new String ();
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, parameterKey, parameterValue);
        rtn = out.outputString (paramsElement);
        return rtn;
    }
}