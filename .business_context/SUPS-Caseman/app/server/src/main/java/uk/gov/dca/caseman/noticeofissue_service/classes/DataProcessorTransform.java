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

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.transform.JDOMResult;
import org.jdom.xpath.XPath;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * See log near bottom of file for file modifications.
 */

/**
 * Class: DataProcessorTransform.java
 * Change History:
 * 05/10/2009 Chris Vincent: change to processData to include the outputs L_BLANK_AX and L_BLANK_AY
 * in the list of outputs to add Warrant data. TRAC 1641.
 * 09/10/2009 Chris Vincent: added method addWarrantExecutingCourtData() which adds warrant executing
 * court data for all warrant based outputs. Also added Welh court data to addCourtData(). TRAC 1640.
 * 10/02/2010 Chris Vincent: added Welsh High Court Name and Welsh County Court Name to the queries used in
 * addWarrantExecutingCourtData() and addCourtData(). TRAC 2629. Trac 2818 will always be fixed as
 * a consequence.
 * 07/04/2010 Chris Vincent: added population of <courtcode> to addUserCourtData() and addWarrantExecutingCourtData()
 * Trac 2662.
 * 11/08/2010 Mark Groen/Chris Vincent TRAC 3023 - Take into account past payments for certain outputs. Add detail to
 * calculateConsolidatedOrderTotal()
 * 12/12/2011 Chris Vincent: changed the CFO address hard coded in here. Trac 4621.
 * 11/06/2012 Chris Vincent: added coevent/receiptdate to the fixDates() method. Trac 2481.
 * 30/08/2012 Chris Vincent: updated addWarrantExecutingCourtData and addCourtData to retrieve the court opening hours
 * from the database. Trac 4714.
 * 05/09/2012 Chris Vincent: updated addWarrantExecutingCourtData and addCourtData to retrieve the new court DR fields
 * from the database.
 * addTransferCourtData also updated to include DR telephone number. Trac 4718.
 * 11/01/2013 Chris Vincent: added claim/receiptdate (Trac 4766) and bill return date (Trac 4762) to the fixDates()
 * method.
 * 03/12/2015 Chris Vincent: for AE Event 332, overwrite the court data (which represents case owning court) with the
 * user court details instead for centralisation of AEs. Trac 5717
 */
public class DataProcessorTransform implements ICustomProcessor
{
    
    /** The date format. */
    private SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
    
    /** The date format in. */
    private SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

    /**
     * Case service name.
     */
    public static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    /**
     * Get case local method name.
     */
    public static final String GET_CASE_SUMMARY = "getCaseLocal";
    /**
     * Court service name.
     */
    public static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    /**
     * Get court method name.
     */
    public static final String GET_COURT = "getCourtLongLocal";
    /**
     * Window for trial service name.
     */
    public static final String WINDOW_FOR_TRIAL_SERVICE = "ejb/WindowForTrialServiceLocal";
    /**
     * Get wfts local method name.
     */
    public static final String GET_WFT = "getCaseWftsLocal";
    /**
     * System data service name.
     */
    public static final String SYSTEM_DATA_SERVICE = "ejb/SystemDataServiceLocal";
    /**
     * Get cfo method name.
     */
    public static final String GET_CFO = "getSystemDataFilteredLocal";
    /**
     * Case event service name.
     */
    public static final String CASE_EVENT_SERVICE = "ejb/CaseEventServiceLocal";
    /**
     * Get events summary method name.
     */
    public static final String GET_EVENTS_SUMMARY = "getCaseEventsLocal";
    /**
     * The none working day service name.
     */
    public static final String NON_WORKING_DAY_SERVICE = "ejb/NonWorkingDayServiceLocal";
    /**
     * Get none working days method name.
     */
    public static final String GET_NON_WORKING_DAYS = "getNonWorkingDaysLocal";

    /** Calculate working day. */
    public static final String CALCULATE_WORKING_DAY = "calculateWorkingDayLocal";

    /** The Constant mapPartyRole. */
    private static final HashMap<String, String> mapPartyRole = new HashMap<>();

    /** The out. */
    private final XMLOutputter out;

    /** The non working day. */
    private static ArrayList<Date> nonWorkingDay = null;

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (DataProcessorTransform.class);

    static
    {
        mapPartyRole.put ("CLAIMANT", "claimant");
        mapPartyRole.put ("DEFENDANT", "defendant");
        mapPartyRole.put ("PT 20 CLMT", "part20claimant");
        mapPartyRole.put ("PT 20 DEF", "part20defendant");
        mapPartyRole.put ("DEBTOR", "debtor");
        mapPartyRole.put ("CREDITOR", "creditor");
        mapPartyRole.put ("COMPANY", "company");
        mapPartyRole.put ("APPLICANT", "applicant");
        mapPartyRole.put ("PETITIONER", "petitioner");
        mapPartyRole.put ("TRUSTEE", "trustee");
        mapPartyRole.put ("INS PRAC", "insolvencypractitioner");
        mapPartyRole.put ("OFF REC", "officialreceiver");
    }

    /**
     * Constructor.
     */
    public DataProcessorTransform () // throws JDOMException
    {
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
        final String msg = "DataProcessorTransform ";
        if (log.isTraceEnabled ())
        {
            log.trace (msg + "starts ");
        }
        processData (inputParameters, output);
        if (log.isTraceEnabled ())
        {
            log.trace (msg + "finished process ");
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
        return e != null ? out.outputString (e) : null;
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final uk.gov.dca.db.pipeline.IComponentContext ctx)
    {

    }

    /**
     * Gets the input stream.
     *
     * @param fileName the file name
     * @param log the log
     * @return the input stream
     */
    private InputStream getInputStream (final String fileName, final Log log)
    {
        return this.getClass ().getResourceAsStream (fileName);
    }

    /**
     * (non-Javadoc)
     * Process the incoming document.
     *
     * @param doc the doc
     * @param output the output
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void processData (final org.jdom.Document doc, final Writer output)
        throws SystemException, BusinessException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("Starting processData() in DataProcessorTransform");
            log.trace ("INCOMING : " + out.outputString (doc));
        }

        try
        {
            final Element n_output = (Element) XPath.selectSingleNode (doc, "/params/param[@name='output']");
            final Element n_xml = (Element) XPath.selectSingleNode (doc, "/params/param[@name='xml']");

            final Element n_xml2 = (Element) XPath.selectSingleNode (doc, "/params/param[@name='vardata']");

            final String p_output = n_output.getValue ();// outputter.outputString(n_output);
            if (log.isTraceEnabled ())
            {
                final String p_xml = out.outputString (n_xml);
                final String p_xml2 = null == n_xml2 ? "<noVarDataFound/>" : out.outputString (n_xml2);

                log.trace ("INCOMING /params/param[@name='output']: " + p_output);
                log.trace ("INCOMING /params/param[@name='xml']: " + p_xml);
                log.trace ("INCOMING /params/param[@name='vardata']: " + p_xml2);
            }
            final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();

            String warrantId = ""; // TRAC 1640 - moved variable out of if statement so can be used below.
            // TRAC 1641 - Added L_BLANK_AX and L_BLANK_AY to the list of outputs that should retrieve Warrant data
            if (p_output.equals ("N246A") || p_output.equals ("EX96") || p_output.equals ("N54") ||
                    p_output.equals ("L_13_1") || p_output.equals ("L_13_2") || p_output.equals ("L_13_3") ||
                    p_output.equals ("O_1_3_4") || p_output.equals ("CJR065_DO") || p_output.equals ("L_BLANK_AX") ||
                    p_output.equals ("L_BLANK_AY"))
            {
                final Element wid_node =
                        (Element) XPath.selectSingleNode (doc, "/params/param[@name='xml']/ds/Warrant/WarrantId");
                warrantId = wid_node.getValue ();
                final Element wrt_node = (Element) XPath.selectSingleNode (doc,
                        "/params/param[@name='xml']/ds/Warrant/WarrantReturnsId");
                final String warrantReturnsId = wrt_node.getValue ();

                // TD 5229
                final Element selectedPartyAgainst_node = (Element) XPath.selectSingleNode (doc,
                        "/params/param[@name='xml']/ds/Warrant/PartyAgainstNumber");
                final String selectedPartyAgainst = selectedPartyAgainst_node.getValue ();

                // TD 5229 : Added selectedPartyAgainst to signature.
                addWarrant (warrantId, selectedPartyAgainst, proxy, doc);
                addWarrantReturn (warrantId, warrantReturnsId, proxy, doc);
            }

            final DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance ();
            final TransformerFactory transformerFactory = TransformerFactory.newInstance ();

            final DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder ();

            if (log.isDebugEnabled ())
            {
                log.debug ("XML BEFORE CONVERT DS2WP = " + out.outputString (doc));
            }

            final InputSource xmlSource2 = new InputSource (new StringReader (out.outputString (doc)));
            final Document document2 = documentBuilder.parse (xmlSource2);
            final Source domSource2 = new DOMSource (document2);

            // Use convertDsToWpData.xsl file to transform incoming xml.
            // convertDsToWpData.xsl is actually generated during server build using src_convertDsToWpData.xsl.
            // Refer to build-convertDsToWpData_xsl target in server/wp_build.xml.
            final Source xslSource = new StreamSource (getInputStream ("convertDsToWpData.xsl", log));

            final JDOMResult xmlResult = new JDOMResult ();

            final Transformer transformer2 = TransformerFactory.newInstance ().newTransformer (xslSource);
            transformer2.transform (domSource2, xmlResult);

            final org.jdom.Document doc2 = xmlResult.getDocument ();
            if (log.isDebugEnabled ())
            {
                log.debug ("XML AFTER CONVERT DS2WP = " + out.outputString (doc2));
            }

            if ("CJR002".equals (p_output) || "CJR003".equals (p_output) || "CJR179".equals (p_output) ||
                    "CJR185".equals (p_output) || "CJR183".equals (p_output) || "CJR186".equals (p_output) ||
                    "CJR186A".equals (p_output))
            {
                calculateServiceReplyDate (doc2);

                if ("CJR186".equals (p_output) || "CJR186A".equals (p_output))
                {
                    calculateFirstClassPostedDate (doc2);
                }
                else
                {
                    calculatePostedDate (doc2);
                }
            }

            if ("CJR093".equals (p_output))
            {
                calculateInterimChargingOrderDeadlineDate (doc2);
            }

            if ("CJR020".equals (p_output) || "CJR060".equals (p_output))
            {
                // Add window for trial dates. Must be done before fixDates.
                addWindowForTrialDate (doc2);
            }

            if (log.isTraceEnabled ())
            {
                log.trace ("begin CFOData");
            }
            if ("CJR201".equals (p_output) || "CJR202".equals (p_output) || "O_9_2".equals (p_output) ||
                    "O_9_1".equals (p_output))
            {
                addCFOData (doc2);
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("end CFOData");
            }

            if (log.isTraceEnabled ())
            {
                log.trace ("begin CO13, CO14, CO15, CO16, CO17, CO18, CO22, CO25, CO28, CO29, CO30,  CO44, CO52");
            }
            if ("CO13".equals (p_output) || "CO14".equals (p_output) || "CO15".equals (p_output) ||
                    "CO16".equals (p_output) || "CO17".equals (p_output) || "CO18".equals (p_output) ||
                    "CO22".equals (p_output) || "CO25".equals (p_output) || "CO28".equals (p_output) ||
                    "CO29".equals (p_output) || "CO30".equals (p_output) || "CO44".equals (p_output) ||
                    "CO52".equals (p_output))
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("enter Method");
                }
                calculateConsolidatedOrderTotal (doc2, p_output);
                if (log.isTraceEnabled ())
                {
                    log.trace ("exit Method");
                }
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("end CO13, CO14, CO15, CO16, CO17, CO18, CO22, CO25, CO28, CO29, CO30,  CO44, CO52");
            }

            if (log.isTraceEnabled ())
            {
                log.trace ("begin CO22");
            }
            if ("CO22".equals (p_output))
            {
                if (log.isTraceEnabled ())
                {
                    log.trace ("enter Method");
                }
                addObjectionDate (doc2);
                if (log.isTraceEnabled ())
                {
                    log.trace ("exit Method");
                }
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("end CO22");
            }

            final Element el_aeEventId =
                    (Element) XPath.selectSingleNode (doc2, "/params/param/variabledata/aeeventid");
            if (el_aeEventId != null && el_aeEventId.getValue ().equals ("332"))
            {
                // Add user data
                addUserCourtData (doc2);

                // Overwrite the court data with user court data
                updateCourtData (doc2);
            }

            fixDates (doc2);
            addCourtData (doc2);
            addTransferCourtData (doc2);
            if ("O_8_5".equals (p_output))
            {
                addUserCourtData (doc2);
            }

            if (p_output.equals ("N246A") || p_output.equals ("EX96") || p_output.equals ("N54") ||
                    p_output.equals ("L_13_1") || p_output.equals ("L_13_2") || p_output.equals ("L_13_3") ||
                    p_output.equals ("O_1_3_4") || p_output.equals ("CJR065_DO") || p_output.equals ("L_BLANK_AX") ||
                    p_output.equals ("L_BLANK_AY"))
            {
                // TD5232 Add user court data for the warrant outputs
                addUserCourtData (doc2);

                // TRAC 1640 - add warrant executing court code data
                if ( !warrantId.equals (""))
                {
                    addWarrantExecutingCourtData (doc2, warrantId);
                }
            }

            // TD5232
            // Add CaseNumber so that it can get printed in output if Foreign Warrant is to be produced.
            if ("EX96".equals (p_output))
            {
                addWarrantCaseData (doc2);
            }
            else if ("N246A".equals (p_output))
            {
                addWarrantCaseData (doc2);
            }
            else if ("N54".equals (p_output))
            {
                addWarrantCaseData (doc2);
            }
            else if ("CJR065_DO".equals (p_output))
            {
                addWarrantCaseData (doc2);
            }

            addTodaysDate (doc2);
            addHearingAtData (doc2);
            maintainEventSubjectInstigator (doc2);
            addPrevious659Instigator (doc2);
            addOutputStrapline (doc2);

            if ("CJR187".equals (p_output) || "CJR189".equals (p_output) || "CJR190".equals (p_output))
            {
                addHearingData (doc2);
            }
            if ("CJR070".equals (p_output) || "CJR069".equals (p_output))
            {
                addFDExiryDate (doc2);
            }
            addHearingCourtData (doc2);

            final InputSource xmlSource = new InputSource (new StringReader (out.outputString (doc2)));
            final Document document = documentBuilder.parse (xmlSource);
            final Transformer transformer = transformerFactory.newTransformer ();
            final Source domSource = new DOMSource (document);
            final Result resultStream = new StreamResult (output);
            transformer.transform (domSource, resultStream);

            if (log.isDebugEnabled ())
            {
                log.debug ("XML FINAL = " + out.outputString (doc2));
            }
            if (log.isTraceEnabled ())
            {
                log.trace ("FINISHING processData in DataProcessoTransform");
            }

        }
        catch (final ParserConfigurationException e)
        {
            throw new SystemException (e);
        }
        catch (final SAXException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final TransformerConfigurationException e)
        {
            throw new SystemException (e);
        }
        catch (final TransformerException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final ParseException e)
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
    }

    /**
     * (non-Javadoc)
     * Add hearing at data via a call to the court service.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void addHearingAtData (final org.jdom.Document doc) throws JDOMException, SystemException, BusinessException
    {
        final Element el_courtcode =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/hearing/court/atcourtcode");
        final Element el_hearingcourt =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/hearing/court");
        if (el_courtcode != null && el_hearingcourt != null)
        {
            final String courtcode = el_courtcode.getText ();
            if (courtcode != null && courtcode.length () > 0)
            {
                final String caseParams = callServiceParam ("courtId", courtcode);
                final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
                final Element el_courtxml = proxy.getJDOM (COURT_SERVICE, GET_COURT, caseParams).getRootElement ();
                if (log.isDebugEnabled ())
                {
                    log.debug ("court xml : " + getXMLString (el_courtxml));
                }
                final Element el_courtdr =
                        (Element) XPath.selectSingleNode (el_courtxml, "/Courts/Court/ContactDetails/DistrictRegistry");
                if (el_courtdr != null)
                {
                    final Element el_courtdistrictregistry = new Element ("atdistrictregistry");
                    el_courtdistrictregistry.setText (el_courtdr.getTextTrim ());
                    el_hearingcourt.addContent (el_courtdistrictregistry);
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Add hearing data via a call to the court service.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void addHearingCourtData (final org.jdom.Document doc)
        throws JDOMException, SystemException, BusinessException
    {
        final Element el_courtcode =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/hearing/court/courtcode");
        final Element el_hearingcourt =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/hearing/court");
        if (el_courtcode != null && el_hearingcourt != null)
        {
            final String courtcode = el_courtcode.getText ();
            if (courtcode != null && courtcode.length () > 0)
            {
                final String caseParams = callServiceParam ("courtId", courtcode);
                final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
                final Element el_courtxml = proxy.getJDOM (COURT_SERVICE, GET_COURT, caseParams).getRootElement ();
                if (log.isDebugEnabled ())
                {
                    log.debug ("court xml : " + getXMLString (el_courtxml));
                }
                final Element el_courtdr =
                        (Element) XPath.selectSingleNode (el_courtxml, "/Courts/Court/ContactDetails/DistrictRegistry");
                if (el_courtdr != null)
                {
                    final Element el_courtdistrictregistry = new Element ("districtregistry");
                    el_courtdistrictregistry.setText (el_courtdr.getTextTrim ());
                    el_hearingcourt.addContent (el_courtdistrictregistry);
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Get the WFT data via a service call.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void addWindowForTrialDate (final org.jdom.Document doc)
        throws JDOMException, SystemException, BusinessException
    {
        final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
        final Element el_casenumber = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/number");
        final Element el_transferdateflag = (Element) XPath.selectSingleNode (doc,
                "/params/param/variabledata/claim/hearing/fasttrack/transferdateflag");
        if (null != el_transferdateflag)
        {
            final String transferdateflag = el_transferdateflag.getText ();
            if (transferdateflag != null && transferdateflag.equals ("TBF"))
            {
                final String caseParams = callServiceParam ("caseNumber", el_casenumber.getText ());
                final Element wftxml = proxy.getJDOM (WINDOW_FOR_TRIAL_SERVICE, GET_WFT, caseParams).getRootElement ();
                final Element el_startdate = (Element) XPath.selectSingleNode (wftxml,
                        "/WindowsForTrial/WindowForTrial[position() = last()]/StartDate");
                final Element el_enddate = (Element) XPath.selectSingleNode (wftxml,
                        "/WindowsForTrial/WindowForTrial[position() = last()]/EndDate");
                final Element parent = el_transferdateflag.getParentElement ();
                final Element wftstartdate = new Element ("wftstartdate");
                final Element wftenddate = new Element ("wftenddate");
                if (el_startdate != null)
                {
                    wftstartdate.addContent (el_startdate.detach ());
                }
                if (el_enddate != null)
                {
                    wftenddate.addContent (el_enddate.detach ());
                }
                parent.addContent (wftstartdate);
                parent.addContent (wftenddate);
            }
        }
    }

    /**
     * (non-Javadoc)
     * temp method to fill out the missing info in the court information.
     *
     * @param document the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException             Change History:
     *             18/01/2008 - Chris Vincent, search for courts by court code and not court name, CaseMan Defect 6484
     */
    private void addTransferCourtData (final org.jdom.Document document)
        throws SystemException, BusinessException, JDOMException, SQLException, NamingException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addTransferCourtData()");
        }

        String transferCourtId = new String ();

        final Element el_courtCode =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/transfer/court/code");
        if (el_courtCode != null && !el_courtCode.getValue ().equals (""))
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("addTransferCourtData el_courtId:" + out.outputString (el_courtCode));
            }

            final String courtCode = el_courtCode.getValue ();
            Connection conn = null;
            PreparedStatement stmntCourtHouse = null;
            PreparedStatement stmntOffice = null;
            ResultSet rs = null;
            ResultSet rsTest = null;
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
                        stmntCourtHouse = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.CODE, C.DR_TEL_NO FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE = " +
                                        courtCode +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'COURTHOUSE' AND GA.VALID_TO IS NULL");
                        stmntOffice = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.CODE, C.DR_TEL_NO FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE = " +
                                        courtCode +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'OFFICE' AND GA.VALID_TO IS NULL");

                        rsTest = stmntOffice.executeQuery ();

                        // PR - 1044: when the court doesn't have a courthouse address find the office address
                        // Defect 5266: Supercedes previous defect. The address should be the office address.
                        // Previously, it was courthouse address. When absent it looked at office address.
                        // Now, it looks at office address if absent looks at courthouse address.

                        final boolean outcome = rsTest.next ();
                        if (log.isDebugEnabled ())
                        {
                            log.debug ("********There is a courthouse address: " + outcome);
                        }

                        if (outcome)
                        {
                            rs = stmntOffice.executeQuery ();
                        }
                        else
                        {
                            rs = stmntCourtHouse.executeQuery ();
                        }

                        while (rs.next ())
                        {
                            final String dxNo = rs.getString (2);
                            final String telNo = rs.getString (3);
                            final String faxNo = rs.getString (4);
                            final String add1 = rs.getString (5);
                            final String add2 = rs.getString (6);
                            final String add3 = rs.getString (7);
                            final String add4 = rs.getString (8);
                            final String add5 = rs.getString (9);
                            final String pc = rs.getString (10);
                            transferCourtId = rs.getString (12);
                            final String drTel = rs.getString (13);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND TEL NO " + telNo);
                            }
                            final Element el_courtTel = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/telephonenumber");
                            el_courtTel.setText (telNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND fax NO " + faxNo);
                            }
                            final Element el_courtFax = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/faxnumber");
                            el_courtFax.setText (faxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND dx NO " + dxNo);
                            }
                            final Element el_courtDx = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/dx");
                            el_courtDx.setText (dxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 1 " + add1);
                            }
                            final Element el_courtLine1 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/line1");
                            el_courtLine1.setText (add1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 2 " + add2);
                            }
                            final Element el_courtLine2 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/line2");
                            el_courtLine2.setText (add2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 3 " + add3);
                            }
                            final Element el_courtLine3 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/line3");
                            el_courtLine3.setText (add3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 4 " + add4);
                            }
                            final Element el_courtLine4 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/line4");
                            el_courtLine4.setText (add4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 5 " + add5);
                            }
                            final Element el_courtLine5 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/line5");
                            el_courtLine5.setText (add5);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND pc " + pc);
                            }
                            final Element el_courtPC = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/address/postcode");
                            el_courtPC.setText (pc);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR TEL NO " + drTel);
                            }
                            final Element el_courtDRTel = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/drtelnumber");
                            el_courtDRTel.setText (drTel);
                        }
                    }
                }
            }
            finally
            {
                if (rsTest != null)
                {
                    rsTest.close ();
                }
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmntOffice != null)
                {
                    stmntOffice.close ();
                }
                if (stmntCourtHouse != null)
                {
                    stmntCourtHouse.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_courtId found in the incoming xml");
            }
        }

        // now get the Chancery Div/ Queens Bench setting
        final Element el_caseType =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/transfer/court/newcasetype");
        if (el_caseType != null)
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("el_caseType:" + out.outputString (el_caseType));
            }
            final String caseType = el_caseType.getValue ();
            Connection conn = null;
            PreparedStatement stmnt = null;
            ResultSet rs = null;
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
                        stmnt = conn.prepareStatement (
                                "SELECT C.RV_IIT_CODE_1, C.RV_IIT_CODE_2 FROM CCBC_REF_CODES C WHERE C.RV_LOW_VALUE ='" +
                                        caseType + "' AND C.RV_DOMAIN = 'CURRENT_CASE_TYPE'");
                        rs = stmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String division = rs.getString (1);
                            final String subdivision = rs.getString (2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND division " + division);
                            }
                            final Element el_division = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/division");
                            el_division.setText (division);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND subdivision " + subdivision);
                            }
                            final Element el_subdivision = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/transfer/court/subdivision");
                            el_subdivision.setText (subdivision);
                        }
                    }
                }
            }
            finally
            {
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmnt != null)
                {
                    stmnt.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_caseType found in the incomming xml");
            }
        }

        // add extra information about the transfer court e.x. SUPSCourt
        if (transferCourtId != null)
        {
            final Element el_CaseNumber =
                    (Element) XPath.selectSingleNode (document, "/params/param/variabledata/claim/number");
            final Element el_IsManualTransfer =
                    (Element) XPath.selectSingleNode (document, "/params/param/variabledata/transfer/ismanualtransfer");

            el_IsManualTransfer.setText (getOutstandingAE (el_CaseNumber.getTextTrim ()));

            final Element el_TransferCourtIsSups =
                    (Element) XPath.selectSingleNode (document, "/params/param/variabledata/transfer/court/issups");

            final String caseParams = callServiceParam ("courtId", transferCourtId);
            final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
            final Element el_courtxml = proxy.getJDOM (COURT_SERVICE, GET_COURT, caseParams).getRootElement ();

            final Element el_SUPSCourt = (Element) XPath.selectSingleNode (el_courtxml, "/Courts/Court/SUPSCourt");
            if (el_SUPSCourt != null)
            {
                final StringBuffer boolFlag = new StringBuffer ();
                if (el_SUPSCourt.getTextTrim ().equalsIgnoreCase ("Y"))
                {
                    boolFlag.append ("false");
                }
                else
                {
                    boolFlag.append ("true");
                }
                el_TransferCourtIsSups.setText (boolFlag.toString ());
                boolFlag.delete (0, boolFlag.capacity ());
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end addTransferCourtData ");
        }
    }

    /**
     * (non-Javadoc)
     * temp method to fill out the missing info in the court information.
     *
     * @param document The document to calculate the posted date for.
     * 
     *            Change History:
     *            18/01/2008 - Chris Vincent, added constraint of GA.VALID_TO IS NULL, CaseMan Defect 6484
     *            07/04/2010 - Chris Vincent, populated <courtcode> node for usercourt. Trac 2662.
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     */
    private void addUserCourtData (final org.jdom.Document document)
        throws JDOMException, SQLException, NamingException, SystemException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addUserCourtData");
        }

        boolean hasId = false;
        final Element elementCourtId = (Element) XPath.selectSingleNode (document, "/params/param[@name='courtId']");
        if (elementCourtId != null)
        {
            if (elementCourtId.getValue () != null)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Found ID: " + elementCourtId.getValue ());
                }
            }
            hasId = true;
        }

        if (hasId)
        {
            final String courtId = elementCourtId.getValue ();
            if (log.isDebugEnabled ())
            {
                log.debug ("addUserCourtData el_courtId.....:" + courtId);
            }
            Connection conn = null;
            PreparedStatement stmnt = null;
            PreparedStatement stmntOffice = null;
            ResultSet rs = null;
            ResultSet rsTest = null;
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
                        stmnt = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.NAME FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE =" +
                                        courtId +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'COURTHOUSE' AND GA.VALID_TO IS NULL");
                        stmntOffice = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.NAME FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE =" +
                                        courtId +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'OFFICE' AND GA.VALID_TO IS NULL");
                        rsTest = stmntOffice.executeQuery ();

                        // PR - 5557: when the court doesn't have an office address find the courthouse address
                        final boolean outcome = rsTest.next ();
                        if (log.isDebugEnabled ())
                        {
                            log.debug ("********There is a courthouse address: " + outcome);
                        }

                        if (outcome)
                        {
                            rs = stmntOffice.executeQuery ();
                        }
                        else
                        {
                            rs = stmnt.executeQuery ();
                        }

                        while (rs.next ())
                        {
                            final String dxNo = rs.getString (2);
                            final String telNo = rs.getString (3);
                            final String faxNo = rs.getString (4);
                            final String add1 = rs.getString (5);
                            final String add2 = rs.getString (6);
                            final String add3 = rs.getString (7);
                            final String add4 = rs.getString (8);
                            final String add5 = rs.getString (9);
                            final String pc = rs.getString (10);
                            final String name = rs.getString (12);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND TEL NO " + telNo);
                            }
                            final Element el_courtTel = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/telephonenumber");
                            el_courtTel.setText (telNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND fax NO " + faxNo);
                            }
                            final Element el_courtFax = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/faxnumber");
                            el_courtFax.setText (faxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND dx NO " + dxNo);
                            }
                            final Element el_courtDx = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/dx");
                            el_courtDx.setText (dxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 1 " + add1);
                            }
                            final Element el_courtLine1 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/line1");
                            el_courtLine1.setText (add1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 2 " + add2);
                            }
                            final Element el_courtLine2 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/line2");
                            el_courtLine2.setText (add2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 3 " + add3);
                            }
                            final Element el_courtLine3 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/line3");
                            el_courtLine3.setText (add3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 4 " + add4);
                            }
                            final Element el_courtLine4 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/line4");
                            el_courtLine4.setText (add4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 5 " + add5);
                            }
                            final Element el_courtLine5 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/line5");
                            el_courtLine5.setText (add5);

                            final Element el_courtPC = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/address/postcode");
                            el_courtPC.setText (pc);

                            final Element el_courtNameR = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/name");
                            el_courtNameR.setText (name);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND name " + name);
                            }
                            final Element el_courtCode = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/usercourt/courtcode");
                            el_courtCode.setText (courtId);
                        }
                    }
                }
            }
            finally
            {
                if (rsTest != null)
                {
                    rsTest.close ();
                }
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmntOffice != null)
                {
                    stmntOffice.close ();
                }
                if (stmnt != null)
                {
                    stmnt.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_courtId found in the incoming xml");
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end addCourtData");
        }
    }

    /**
     * temp method to fill out Court data for the executing court of the warrant. Created for Trac 1640
     *
     * @param document The document to manipulate
     * @param warrantId The identifier of the warrant being processed
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException             Change History:
     *             10/02/2010 - Chris Vincent, added Welsh High Court and County Court names to the Welsh Court queries.
     *             Trac 2629.
     *             07/04/2010 - Chris Vincent, populated <courtcode> node for executingcourt. Trac 2662.
     *             30/08/2012 - Chris Vincent, added retrieval of the court opening hours. Trac 4714.
     *             05/09/2012 - Chris Vincent, added retrieval of new court DR fields. Trac 4718.
     */
    private void addWarrantExecutingCourtData (final org.jdom.Document document, final String warrantId)
        throws JDOMException, SQLException, NamingException, SystemException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addWarrantExecutingCourtData");
        }

        Connection conn = null;
        PreparedStatement stmnt = null;
        PreparedStatement persStmnt = null;
        PreparedStatement stmntOffice = null;
        PreparedStatement stmntWOffice = null;
        PreparedStatement wIdstmnt = null;
        ResultSet rs = null;
        ResultSet rsTest = null;
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
                    String courtId = "";
                    wIdstmnt = conn.prepareStatement (
                            "SELECT EXECUTED_BY FROM WARRANTS WHERE WARRANT_ID = '" + warrantId + "'");
                    rs = wIdstmnt.executeQuery ();
                    while (rs.next ())
                    {
                        courtId = rs.getString (1);
                    }
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("********WARRANT ID: " + warrantId);
                    }
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("********FOUND TEL NO " + courtId);
                    }

                    if ( !courtId.equals (""))
                    {
                        String welshCourt = "N"; // Default value for Welsh Court indicator
                        final String exCtXPath = "/params/param/variabledata/executingcourt/";

                        stmnt = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.NAME, C.DR_TEL_NO FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE =" +
                                        courtId +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'COURTHOUSE' AND GA.VALID_TO IS NULL");
                        stmntOffice = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.NAME, C.DR_TEL_NO FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE =" +
                                        courtId +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'OFFICE' AND GA.VALID_TO IS NULL");
                        stmntWOffice = conn.prepareStatement (
                                "SELECT GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, C.WELSH_HIGH_COURT_NAME, C.WELSH_COUNTY_COURT_NAME, C.WELSH_COURT_NAME FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE = " +
                                        courtId +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'WELSH_OFFICE' AND GA.VALID_TO IS NULL");
                        persStmnt = conn.prepareStatement (
                                "SELECT LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.OPEN_FROM,'SSSSS'),'HH:MI am'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.CLOSED_AT,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.DR_OPEN_FROM,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.DR_CLOSED_AT,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), NVL(P.BY_APPOINTMENT_IND,'N') FROM PERSONALISE P WHERE P.CRT_CODE = " +
                                        courtId);
                        rsTest = stmntOffice.executeQuery ();

                        // When the court doesn't have an office address find the courthouse address
                        final boolean outcome = rsTest.next ();
                        if (log.isDebugEnabled ())
                        {
                            log.debug ("********There is a courthouse address: " + outcome);
                        }

                        if (outcome)
                        {
                            rs = stmntOffice.executeQuery ();
                        }
                        else
                        {
                            rs = stmnt.executeQuery ();
                        }

                        while (rs.next ())
                        {
                            final String dxNo = rs.getString (2);
                            final String telNo = rs.getString (3);
                            final String faxNo = rs.getString (4);
                            final String add1 = rs.getString (5);
                            final String add2 = rs.getString (6);
                            final String add3 = rs.getString (7);
                            final String add4 = rs.getString (8);
                            final String add5 = rs.getString (9);
                            final String pc = rs.getString (10);
                            final String name = rs.getString (12);
                            final String drTelNo = rs.getString (13);

                            // Add the normal court data
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND TEL NO " + telNo);
                            }
                            final Element el_courtTel =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "telephonenumber");
                            el_courtTel.setText (telNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND fax NO " + faxNo);
                            }
                            final Element el_courtFax =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "faxnumber");
                            el_courtFax.setText (faxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND dx NO " + dxNo);
                            }
                            final Element el_courtDx = (Element) XPath.selectSingleNode (document, exCtXPath + "dx");
                            el_courtDx.setText (dxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 1 " + add1);
                            }
                            final Element el_courtLine1 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/line1");
                            el_courtLine1.setText (add1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 2 " + add2);
                            }
                            final Element el_courtLine2 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/line2");
                            el_courtLine2.setText (add2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 3 " + add3);
                            }
                            final Element el_courtLine3 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/line3");
                            el_courtLine3.setText (add3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 4 " + add4);
                            }
                            final Element el_courtLine4 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/line4");
                            el_courtLine4.setText (add4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 5 " + add5);
                            }
                            final Element el_courtLine5 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/line5");
                            el_courtLine5.setText (add5);
                            final Element el_courtPC =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "address/postcode");
                            el_courtPC.setText (pc);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND name " + name);
                            }
                            final Element el_courtNameR =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "name");
                            el_courtNameR.setText (name);
                            final Element el_courtDRTel =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "drtelnumber");
                            el_courtDRTel.setText (drTelNo);

                            final Element el_courtCode =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "courtcode");
                            el_courtCode.setText (courtId);
                        }

                        // Trac 4714 - retrieve the court opening hours from the database
                        // Trac 4718 - retrieve DR opening hours and by appointment flags
                        rs = persStmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String openFrom = rs.getString (1);
                            final String openTo = rs.getString (2);
                            final String drOpenFrom = rs.getString (3);
                            final String drOpenTo = rs.getString (4);
                            final String byAppointment = rs.getString (5);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND OPEN FROM " + openFrom);
                            }
                            final Element el_courtOpenFrom =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "openfrom");
                            el_courtOpenFrom.setText (openFrom);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND OPEN TO " + openTo);
                            }
                            final Element el_courtOpenTo =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "opento");
                            el_courtOpenTo.setText (openTo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR OPEN FROM " + drOpenFrom);
                            }
                            final Element el_courtDROpenFrom =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "dropenfrom");
                            el_courtDROpenFrom.setText (drOpenFrom);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR OPEN TO " + drOpenTo);
                            }
                            final Element el_courtDROpenTo =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "dropento");
                            el_courtDROpenTo.setText (drOpenTo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND BY APPOINTMENT " + byAppointment);
                            }
                            final Element el_courtByAppointment =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "byappointment");
                            el_courtByAppointment.setText (byAppointment);
                        }

                        // Add Welsh Office address details if court has any
                        rs = stmntWOffice.executeQuery ();
                        while (rs.next ())
                        {
                            welshCourt = "Y";
                            final String wadd1 = rs.getString (1);
                            final String wadd2 = rs.getString (2);
                            final String wadd3 = rs.getString (3);
                            final String wadd4 = rs.getString (4);
                            final String wadd5 = rs.getString (5);
                            final String wpc = rs.getString (6);
                            final String whighcrtname = rs.getString (7);
                            final String wcntycrtname = rs.getString (8);
                            final String wcrtname = rs.getString (9);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 1 " + wadd1);
                            }
                            final Element el_courtLine1 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/line1");
                            el_courtLine1.setText (wadd1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 2 " + wadd2);
                            }
                            final Element el_courtLine2 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/line2");
                            el_courtLine2.setText (wadd2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 3 " + wadd3);
                            }
                            final Element el_courtLine3 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/line3");
                            el_courtLine3.setText (wadd3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 4 " + wadd4);
                            }
                            final Element el_courtLine4 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/line4");
                            el_courtLine4.setText (wadd4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 5 " + wadd5);
                            }
                            final Element el_courtLine5 =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/line5");
                            el_courtLine5.setText (wadd5);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh pc " + wpc);
                            }
                            final Element el_courtPC =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshaddress/postcode");
                            el_courtPC.setText (wpc);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh high court name " + whighcrtname);
                            }
                            final Element el_courtWHCN =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshhighcourtname");
                            el_courtWHCN.setText (whighcrtname);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh county court name " + wcntycrtname);
                            }
                            final Element el_courtWCCN =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshcountycourtname");
                            el_courtWCCN.setText (wcntycrtname);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh court name " + wcrtname);
                            }
                            final Element el_courtWCN =
                                    (Element) XPath.selectSingleNode (document, exCtXPath + "welshcourtname");
                            el_courtWCN.setText (wcrtname);
                        }

                        // Set the Welsh Court indicator
                        final Element el_welshCourtInd =
                                (Element) XPath.selectSingleNode (document, exCtXPath + "welshcourt");
                        el_welshCourtInd.setText (welshCourt);
                    }
                }
            }
        }
        finally
        {
            if (rsTest != null)
            {
                rsTest.close ();
            }
            if (rs != null)
            {
                rs.close ();
            }
            if (stmntOffice != null)
            {
                stmntOffice.close ();
            }
            if (stmnt != null)
            {
                stmnt.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end addWarrantExecutingCourtData");
        }
    }

    /**
     * Get CaseNumber from Warrant and populate the claim/number element in xmlfinal.
     *
     * @param document the document
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     */
    private void addWarrantCaseData (final org.jdom.Document document)
        throws JDOMException, SQLException, NamingException, SystemException
    {
        final Element caseNumberElement =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/claim/number");
        final Element warrantCaseNumberElement =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/warrant/warrantcasenumber");
        final String warrantCaseNumber = warrantCaseNumberElement.getText ();
        caseNumberElement.setText (warrantCaseNumber);
    }

    /**
     * (non-Javadoc)
     * Add todays date to the variabledata.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     */
    private void addTodaysDate (final org.jdom.Document doc) throws JDOMException
    {
        final Element el_vardata = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata");
        if (el_vardata != null)
        {
            final Element today = new Element ("today");
            today.setText (dateFormat.format (new Date ()));
            el_vardata.addContent (today);

            if (log.isDebugEnabled ())
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Added todays date " + getXMLString (el_vardata));
                }
                if (log.isDebugEnabled ())
                {
                    log.debug ("xml now " + getXMLString (doc.getRootElement ()));
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("Could not put todays date in /variabledata/today");
            }
        }
    }

    /**
     * (non-Javadoc)
     * Add expirydate to variabledata/obligation.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void addFDExiryDate (final org.jdom.Document doc) throws JDOMException, ParseException
    {
        final Element el_obldate =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/datestayeduntil");
        if (log.isDebugEnabled ())
        {
            log.debug ("/params/param/variabledata/order/datestayeduntil = " + el_obldate.getValue ());
        }
        final Date obldate = dateFormat.parse (el_obldate.getValue ());

        final Calendar expDate = new GregorianCalendar ();
        expDate.setTime (obldate);
        expDate.add (Calendar.DATE, -14);

        final Element el_expdate =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/obligation/expirydate");
        el_expdate.setText (dateFormat.format (expDate.getTime ()));

        if (log.isDebugEnabled ())
        {
            log.debug ("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  Added /obligation/expirydate date " + getXMLString (el_expdate));
            log.debug ("xml now " + getXMLString (doc.getRootElement ()));
        }
    }

    /**
     * Adds 2 working days to the given date.
     *
     * @param date the date
     * @return the first class posted date
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws ParseException the parse exception
     */
    private Date getFirstClassPostedDate (final Date date)
        throws JDOMException, BusinessException, SystemException, ParseException
    {
        final StringBuffer params = new StringBuffer ("<params>");
        params.append ("<param name=\"serviceDate\">" + dateFormatIn.format (date) + "</param>");
        params.append ("<param name=\"reqWorkingDays\">" + 2 + "</param>");
        params.append ("<param name=\"inFuture\">" + "true" + "</param>");
        params.append ("</params>");

        // get 2 working days in future using the Service calculateworkingDay
        final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
        final org.jdom.Document response =
                proxy.getJDOM (NON_WORKING_DAY_SERVICE, CALCULATE_WORKING_DAY, params.toString ());

        final String strWorkingDay = ((Element) XPath.selectSingleNode (response, "/ds/workingDay")).getText ();

        return dateFormatIn.parse (strWorkingDay);
    }

    /**
     * For CJR186 and CJR186A the first class post date is calculated with reference to
     * system date.
     *
     * @param document the document
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws ParseException the parse exception
     */
    private void calculateFirstClassPostedDate (final org.jdom.Document document)
        throws JDOMException, BusinessException, SystemException, ParseException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start calculateFirstClassPostedDate");
        }

        final Date date = new Date ();
        // UCT 572 request change for CJR186 and CJR186A to use system date instead of event date
        /**
         * Element el_eventDate = (Element)XPath.selectSingleNode(document, "/params/param/variabledata/event/date");
         * Element el_issueDate = (Element)XPath.selectSingleNode(document,
         * "/params/param/variabledata/claim/dateofissue");
         * 
         * try
         * {
         * 
         * if(el_eventDate != null && el_eventDate.getValue() != "") {
         * date = dateFormatIn.parse(el_eventDate.getValue());
         * } else if(el_issueDate != null && el_issueDate.getValue() != "") {
         * date = dateFormatIn.parse(el_issueDate.getValue());
         * }
         * }
         * catch (ParseException e)
         * {
         * if (log.isDebugEnabled()) {log.debug("Exception whilst parsing" + e.getMessage());}
         * }
         */
        final Date postedDate = getFirstClassPostedDate (date);
        Element el_postedDate =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice/posteddate");
        if (null != el_postedDate)
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("Found not null posteddate element, updating text with date " + postedDate.toString ());
            }
            el_postedDate.setText (dateFormat.format (postedDate));
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("Not found not null posteddate element - creating new one and adding it with date " +
                        postedDate.toString ());
            }
            el_postedDate = new Element ("posteddate");
            el_postedDate.setText (dateFormatIn.format (postedDate));
            final Element p = (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice");
            p.addContent (el_postedDate);
            if (log.isDebugEnabled ())
            {
                log.debug ("Document now: " + out.outputString (document));
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end calculateFirstClassPostedDate");
        }
    }

    /**
     * Returns the date on which the notice was posted. This is calculated as
     * being 2 days before the service date.
     *
     * @param serviceDate The service date.
     * @return The posted date.
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws ParseException the parse exception
     */
    private Date getPostedDate (final Date serviceDate)
        throws JDOMException, BusinessException, SystemException, ParseException
    {
        final StringBuffer params = new StringBuffer ("<params>");
        params.append ("<param name=\"serviceDate\">" + dateFormatIn.format (serviceDate) + "</param>");
        params.append ("<param name=\"reqWorkingDays\">" + 2 + "</param>");
        params.append ("<param name=\"inFuture\">" + "false" + "</param>");
        params.append ("</params>");

        // get 2 working days in past using the Service calculateworkingDay
        final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
        final org.jdom.Document response =
                proxy.getJDOM (NON_WORKING_DAY_SERVICE, CALCULATE_WORKING_DAY, params.toString ());

        final String strWorkingDay = ((Element) XPath.selectSingleNode (response, "/ds/workingDay")).getText ();

        return dateFormatIn.parse (strWorkingDay);

    }

    /**
     * Calculates the date on which the notice was posted and inserts a
     * 'posteddate' element.
     *
     * @param document The document to calculate the posted date for.
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws ParseException the parse exception
     */
    private void calculatePostedDate (final org.jdom.Document document)
        throws JDOMException, BusinessException, SystemException, ParseException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start calculatePostedDate");
        }

        final Element el_serviceDate =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice/servicedate");
        if (el_serviceDate != null)
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("serviceDateEl:" + out.outputString (el_serviceDate));
            }
            try
            {
                final Date serviceDate = dateFormatIn.parse (el_serviceDate.getValue ());
                final Date postedDate = getPostedDate (serviceDate);
                Element el_serviceReplyDate =
                        (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice/posteddate");// (Element)document.createElement("servicereplydate");
                if (null != el_serviceReplyDate)
                {
                    if (log.isDebugEnabled ())
                    {
                        log.debug (
                                "Found not null posteddate element, updating text with date " + postedDate.toString ());
                    }
                    el_serviceReplyDate.setText (dateFormat.format (postedDate));
                }
                else
                {
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Not found not null posteddate element - creating new one and adding it with date " +
                                postedDate.toString ());
                    }
                    el_serviceReplyDate = new Element ("posteddate");
                    // el_serviceReplyDate.setText(dateFormat.format(postedDate));
                    el_serviceReplyDate.setText (dateFormatIn.format (postedDate));
                    final Element p = (Element) el_serviceDate.getParent ();
                    p.addContent (el_serviceReplyDate);
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Document now: " + out.outputString (document));
                    }
                }
            }
            catch (final ParseException e)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Exception whilst parsing " + el_serviceDate.getValue ());
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no serviceDateElement found in the incomming xml");
            }
        }
        if (log.isTraceEnabled ())
        {
            log.trace ("end calculatePostedDate");
        }
    }

    /**
     * Calculates a service reply date from the service date in
     * the document and inserts a 'servicereplydate' element.
     *
     * @param document The document to calculate the service reply date for.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     * @throws JDOMException the JDOM exception
     */
    private void calculateServiceReplyDate (final org.jdom.Document document)
        throws SystemException, BusinessException, ParseException, JDOMException
    {
        final SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");
        final Element n_output = (Element) XPath.selectSingleNode (document, "/params/param[@name='output']");

        if (log.isTraceEnabled ())
        {
            log.trace ("start calculateServiceReplyDate");
        }

        if (n_output.getValue ().equals ("CJR186") || n_output.getValue ().equals ("CJR186A"))
        {
            final Date tmpDate = new Date ();
            final Element tmp_Date = new Element ("servicedate");
            tmp_Date.setText (dateFormatIn.format (tmpDate));
            final Element p = (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice");
            p.addContent (tmp_Date);
        }
        final Element el_serviceDate =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice/servicedate");
        if (el_serviceDate != null)
        {
            if (log.isDebugEnabled ())
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("serviceDateNode:" + out.outputString (el_serviceDate));
                }
            }
            try
            {
                Date serviceDate = dateFormatIn.parse (el_serviceDate.getValue ());
                Date serviceReplyDate = new Date ();

                if (n_output != null &&
                        (n_output.getValue ().equals ("CJR186") || n_output.getValue ().equals ("CJR186A")))
                {

                    serviceDate = new Date ();
                    // UCT 572 request change for CJR186 and CJR186A to use system date instead of event date and
                    // not to take into account the non working days

                    /**
                     * Element el_eventDate = (Element)XPath.selectSingleNode(document,
                     * "/params/param/variabledata/event/date");
                     * Element el_issueDate = (Element)XPath.selectSingleNode(document,
                     * "/params/param/variabledata/claim/dateofissue");
                     * 
                     * 
                     * try
                     * {
                     * 
                     * if(el_eventDate != null && el_eventDate.getValue() != "") {
                     * serviceDate = dateFormatIn.parse(el_eventDate.getValue());
                     * } else if(el_issueDate != null && el_issueDate.getValue() != "") {
                     * serviceDate = dateFormatIn.parse(el_issueDate.getValue());
                     * }
                     * }
                     * catch (ParseException e)
                     * {
                     * if (log.isDebugEnabled()) {log.debug("Exception whilst parsing" + e.getMessage());}
                     * }
                     */
                    final Calendar calServiceReplyDate = new GregorianCalendar ();
                    calServiceReplyDate.setTime (serviceDate);
                    calServiceReplyDate.add (Calendar.DATE, 16);

                    serviceReplyDate = calServiceReplyDate.getTime ();

                }
                else
                {
                    serviceReplyDate = getServiceReplyDate (serviceDate);
                }

                Element el_serviceReplyDate = (Element) XPath.selectSingleNode (document,
                        "/params/param/variabledata/notice/servicereplydate");// (Element)document.createElement("servicereplydate");
                if (null != el_serviceReplyDate)
                {
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Found not null serviceReplyDate element, updating text with date " +
                                serviceReplyDate.toString ());
                    }
                    el_serviceReplyDate.setText (dateFormat.format (serviceReplyDate));
                }
                else
                {
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Not found not null serviceReplyDate element - creating new one and adding it...");
                    }
                    el_serviceReplyDate = new Element ("servicereplydate");
                    el_serviceReplyDate.setText (dateFormatIn.format (serviceReplyDate));
                    final Element p = (Element) el_serviceDate.getParent ();
                    p.addContent (el_serviceReplyDate);
                    if (log.isDebugEnabled ())
                    {
                        log.debug ("Document now: " + out.outputString (document));
                    }
                }
            }
            catch (final ParseException e)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Exception whilst parsing " + el_serviceDate.getValue ());
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("No serviceDateNode found in incomming xml.");
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end calculateServiceReplyDate");
        }
    }

    /**
     * Calculates the deadline date for the interim charging order which is calculated
     * as the Interim Order date + 49 days.
     *
     * @param document The document to calculate the date for.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     * @throws JDOMException the JDOM exception
     */
    private void calculateInterimChargingOrderDeadlineDate (final org.jdom.Document document)
        throws SystemException, BusinessException, ParseException, JDOMException
    {
        final SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");
        final Element n_output = (Element) XPath.selectSingleNode (document, "/params/param[@name='output']");

        final Element el_orderDate =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/notice/dateorder2");
        if (el_orderDate != null)
        {
            try
            {
                final Date orderDate = dateFormatIn.parse (el_orderDate.getValue ());
                final Calendar orderDeadlineDate = new GregorianCalendar ();
                orderDeadlineDate.setTime (orderDate);
                orderDeadlineDate.add (Calendar.DATE, 49);

                Element el_orderDeadlineDate = (Element) XPath.selectSingleNode (document,
                        "/params/param/variabledata/notice/interimorderdeadline");
                if (null != el_orderDeadlineDate)
                {
                    el_orderDeadlineDate.setText (dateFormat.format (orderDeadlineDate.getTime ()));
                }
                else
                {
                    el_orderDeadlineDate = new Element ("interimorderdeadline");
                    el_orderDeadlineDate.setText (dateFormatIn.format (orderDeadlineDate.getTime ()));
                    final Element p = (Element) el_orderDate.getParent ();
                    p.addContent (el_orderDeadlineDate);
                }
            }
            catch (final ParseException e)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Exception whilst parsing " + el_orderDate.getValue ());
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("No serviceDateNode found in incomming xml.");
            }
        }
    }

    /**
     * temp method to fill out the missing info in the court information.
     *
     * @param document The document to calculate the posted date for.
     * 
     *            Change History:
     *            18/01/2008 - Chris Vincent, search for courts by court code and not court name, CaseMan Defect 6484
     *            08/10/2009 - Chris Vincent, added Welsh Office address details for court if the court has any. Trac
     *            1640.
     *            10/02/2010 - Chris Vincent, added Welsh High Court and County Court names to the Welsh Court queries.
     *            Trac 2629.
     *            30/08/2012 - Chris Vincent, added retrieval of the court opening hours. Trac 4714.
     *            05/09/2012 - Chris Vincent, added retrieval of new court DR fields. Trac 4718
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     */
    private void addCourtData (final org.jdom.Document document)
        throws SystemException, SQLException, JDOMException, NamingException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("start addCourtData");
        }

        final Element el_courtCode =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/court/courtcode");
        if (el_courtCode != null && !el_courtCode.getValue ().equals (""))
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("el_courtId:" + out.outputString (el_courtCode));
            }

            final String courtCode = el_courtCode.getValue ();
            Connection conn = null;
            PreparedStatement stmnt = null;
            PreparedStatement persStmnt = null;
            PreparedStatement welshStmnt = null;
            ResultSet rs = null;
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
                        String welshCourt = "N"; // Default value for Welsh Court indicator
                        final String ct = "/params/param/variabledata/court/";
                        stmnt = conn.prepareStatement (
                                "SELECT C.DISTRICT_REGISTRY, C.DX_NUMBER, C.TEL_NO, C.FAX_NO, GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE, C.DR_TEL_NO FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE = " +
                                        courtCode +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'OFFICE' AND GA.VALID_TO IS NULL");
                        rs = stmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String dxNo = rs.getString (2);
                            final String telNo = rs.getString (3);
                            final String faxNo = rs.getString (4);
                            final String add1 = rs.getString (5);
                            final String add2 = rs.getString (6);
                            final String add3 = rs.getString (7);
                            final String add4 = rs.getString (8);
                            final String add5 = rs.getString (9);
                            final String pc = rs.getString (10);
                            final String drTelNo = rs.getString (12);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND TEL NO " + telNo);
                            }
                            final Element el_courtTel =
                                    (Element) XPath.selectSingleNode (document, ct + "telephonenumber");
                            el_courtTel.setText (telNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND fax NO " + faxNo);
                            }
                            final Element el_courtFax = (Element) XPath.selectSingleNode (document, ct + "faxnumber");
                            el_courtFax.setText (faxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND dx NO " + dxNo);
                            }
                            final Element el_courtDx = (Element) XPath.selectSingleNode (document, ct + "dx");
                            el_courtDx.setText (dxNo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 1 " + add1);
                            }
                            final Element el_courtLine1 =
                                    (Element) XPath.selectSingleNode (document, ct + "address/line1");
                            el_courtLine1.setText (add1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 2 " + add2);
                            }
                            final Element el_courtLine2 =
                                    (Element) XPath.selectSingleNode (document, ct + "address/line2");
                            el_courtLine2.setText (add2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 3 " + add3);
                            }
                            final Element el_courtLine3 =
                                    (Element) XPath.selectSingleNode (document, ct + "address/line3");
                            el_courtLine3.setText (add3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 4 " + add4);
                            }
                            final Element el_courtLine4 =
                                    (Element) XPath.selectSingleNode (document, ct + "address/line4");
                            el_courtLine4.setText (add4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 5 " + add5);
                            }
                            final Element el_courtLine5 =
                                    (Element) XPath.selectSingleNode (document, ct + "address/line5");
                            el_courtLine5.setText (add5);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND pc " + pc);
                            }
                            final Element el_courtPC =
                                    (Element) XPath.selectSingleNode (document, ct + "address/postcode");
                            el_courtPC.setText (pc);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR TEL NO " + drTelNo);
                            }
                            final Element el_courtDRTel =
                                    (Element) XPath.selectSingleNode (document, ct + "drtelnumber");
                            el_courtDRTel.setText (drTelNo);
                        }

                        // Trac 4714 - retrieve the court opening hours from the database
                        // Trac 4718 - retrieve DR opening hours and by appointment flags
                        persStmnt = conn.prepareStatement (
                                "SELECT LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.OPEN_FROM,'SSSSS'),'HH:MI am'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.CLOSED_AT,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.DR_OPEN_FROM,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), LOWER(REPLACE(LTRIM(TO_CHAR(TO_DATE(P.DR_CLOSED_AT,'SSSSS'),'HH:MI pm'),'0'),'M','.M.')), NVL(P.BY_APPOINTMENT_IND,'N') FROM PERSONALISE P WHERE P.CRT_CODE = " +
                                        courtCode);
                        rs = persStmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String openFrom = rs.getString (1);
                            final String openTo = rs.getString (2);
                            final String drOpenFrom = rs.getString (3);
                            final String drOpenTo = rs.getString (4);
                            final String byAppointment = rs.getString (5);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND OPEN FROM " + openFrom);
                            }
                            final Element el_courtOpenFrom =
                                    (Element) XPath.selectSingleNode (document, ct + "openfrom");
                            el_courtOpenFrom.setText (openFrom);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND OPEN TO " + openTo);
                            }
                            final Element el_courtOpenTo = (Element) XPath.selectSingleNode (document, ct + "opento");
                            el_courtOpenTo.setText (openTo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR OPEN FROM " + drOpenFrom);
                            }
                            final Element el_courtDROpenFrom =
                                    (Element) XPath.selectSingleNode (document, ct + "dropenfrom");
                            el_courtDROpenFrom.setText (drOpenFrom);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND DR OPEN TO " + drOpenTo);
                            }
                            final Element el_courtDROpenTo =
                                    (Element) XPath.selectSingleNode (document, ct + "dropento");
                            el_courtDROpenTo.setText (drOpenTo);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND BY APPOINTMENT " + byAppointment);
                            }
                            final Element el_courtByAppointment =
                                    (Element) XPath.selectSingleNode (document, ct + "byappointment");
                            el_courtByAppointment.setText (byAppointment);
                        }

                        // Trac 1640 - Add Welsh Office address details if court has any
                        welshStmnt = conn.prepareStatement (
                                "SELECT GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, C.WELSH_HIGH_COURT_NAME, C.WELSH_COUNTY_COURT_NAME, C.WELSH_COURT_NAME FROM COURTS C, GIVEN_ADDRESSES GA WHERE C.CODE = " +
                                        courtCode +
                                        " AND C.CODE = GA.COURT_CODE AND GA.ADDRESS_TYPE_CODE = 'WELSH_OFFICE' AND GA.VALID_TO IS NULL");
                        rs = welshStmnt.executeQuery ();
                        while (rs.next ())
                        {
                            welshCourt = "Y";
                            final String wadd1 = rs.getString (1);
                            final String wadd2 = rs.getString (2);
                            final String wadd3 = rs.getString (3);
                            final String wadd4 = rs.getString (4);
                            final String wadd5 = rs.getString (5);
                            final String wpc = rs.getString (6);
                            final String whighcrtname = rs.getString (7);
                            final String wcntycrtname = rs.getString (8);
                            final String wcrtname = rs.getString (9);

                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 1 " + wadd1);
                            }
                            final Element el_courtLine1 =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/line1");
                            el_courtLine1.setText (wadd1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 2 " + wadd2);
                            }
                            final Element el_courtLine2 =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/line2");
                            el_courtLine2.setText (wadd2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 3 " + wadd3);
                            }
                            final Element el_courtLine3 =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/line3");
                            el_courtLine3.setText (wadd3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 4 " + wadd4);
                            }
                            final Element el_courtLine4 =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/line4");
                            el_courtLine4.setText (wadd4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh add 5 " + wadd5);
                            }
                            final Element el_courtLine5 =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/line5");
                            el_courtLine5.setText (wadd5);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh pc " + wpc);
                            }
                            final Element el_courtPC =
                                    (Element) XPath.selectSingleNode (document, ct + "welshaddress/postcode");
                            el_courtPC.setText (wpc);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh high court name " + whighcrtname);
                            }
                            final Element el_courtWHCN =
                                    (Element) XPath.selectSingleNode (document, ct + "welshhighcourtname");
                            el_courtWHCN.setText (whighcrtname);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh county court name " + wcntycrtname);
                            }
                            final Element el_courtWCCN =
                                    (Element) XPath.selectSingleNode (document, ct + "welshcountycourtname");
                            el_courtWCCN.setText (wcntycrtname);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND welsh court name " + wcrtname);
                            }
                            final Element el_courtWCN =
                                    (Element) XPath.selectSingleNode (document, ct + "welshcourtname");
                            el_courtWCN.setText (wcrtname);
                        }

                        // Set the Welsh Court indicator
                        final Element el_welshCourtInd = (Element) XPath.selectSingleNode (document, ct + "welshcourt");
                        el_welshCourtInd.setText (welshCourt);
                    }
                }
            }
            finally
            {
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmnt != null)
                {
                    stmnt.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_courtId found in the incoming xml");
            }
        }

        // now get the Chancery Div/ Queens Bench setting
        final Element el_caseType =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/claim/type");
        if (el_caseType != null)
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("el_caseType:" + out.outputString (el_caseType));
            }
            final String caseType = el_caseType.getValue ();
            Connection conn = null;
            PreparedStatement stmnt = null;
            ResultSet rs = null;
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
                        stmnt = conn.prepareStatement (
                                "SELECT C.RV_IIT_CODE_1 FROM CCBC_REF_CODES C WHERE C.RV_LOW_VALUE ='" + caseType +
                                        "' AND C.RV_DOMAIN = 'CURRENT_CASE_TYPE'");
                        rs = stmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String division = rs.getString (1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND division " + division);
                            }
                            final Element el_division =
                                    (Element) XPath.selectSingleNode (document, "/params/param/variabledata/division");
                            el_division.setText (division);
                        }
                    }
                }
            }
            finally
            {
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmnt != null)
                {
                    stmnt.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_courtId found in the incoming xml");
            }
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end addCourtData");
        }
    }

    /**
     * (non-Javadoc)
     * Overwrites the Court Data code and name with the User court equivalent values.
     *
     * @param document the document
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     */
    private void updateCourtData (final org.jdom.Document document)
        throws SystemException, SQLException, JDOMException, NamingException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start updateCourtData");
        }

        final Element el_ucourtName =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/usercourt/name");
        final Element el_ucourtCode =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/usercourt/courtcode");

        if (el_ucourtName != null && el_ucourtCode != null)
        {
            final String userCourtName = el_ucourtName.getText ();
            final String userCourtCode = el_ucourtCode.getText ();

            if ( !userCourtName.equals ("") && !userCourtCode.equals (""))
            {
                final Element el_ccourtName =
                        (Element) XPath.selectSingleNode (document, "/params/param/variabledata/court/name");
                el_ccourtName.setText (userCourtName);
                final Element el_ccourtCode =
                        (Element) XPath.selectSingleNode (document, "/params/param/variabledata/court/courtcode");
                el_ccourtCode.setText (userCourtCode);
            }
        }

        if (log.isDebugEnabled ())
        {
            log.debug ("end updateCourtData");
        }
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     */
    private void addHearingData (final org.jdom.Document document)
        throws SystemException, SQLException, JDOMException, NamingException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addHearingData");
        }

        final Element el_addressId = (Element) XPath.selectSingleNode (document,
                "/params/param/variabledata/claim/hearing/court/address/id");
        if (el_addressId != null)
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("el_courtId:" + out.outputString (el_addressId));
            }

            final String addressId = el_addressId.getValue ();
            Connection conn = null;
            PreparedStatement stmnt = null;
            ResultSet rs = null;
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
                        stmnt = conn.prepareStatement (
                                "SELECT GA.ADDRESS_LINE1, GA.ADDRESS_LINE2, GA.ADDRESS_LINE3, GA.ADDRESS_LINE4, GA.ADDRESS_LINE5, GA.POSTCODE, GA.REFERENCE FROM GIVEN_ADDRESSES GA WHERE GA.ADDRESS_ID = " +
                                        addressId);
                        rs = stmnt.executeQuery ();
                        while (rs.next ())
                        {
                            final String add1 = rs.getString (1);
                            final String add2 = rs.getString (2);
                            final String add3 = rs.getString (3);
                            final String add4 = rs.getString (4);
                            final String add5 = rs.getString (5);
                            final String pc = rs.getString (6);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 1 " + add1);
                            }
                            final Element el_courtLine1 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/line1");
                            el_courtLine1.setText (add1);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 2 " + add2);
                            }
                            final Element el_courtLine2 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/line2");
                            el_courtLine2.setText (add2);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 3 " + add3);
                            }
                            final Element el_courtLine3 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/line3");
                            el_courtLine3.setText (add3);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 4 " + add4);
                            }
                            final Element el_courtLine4 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/line4");
                            el_courtLine4.setText (add4);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND add 5 " + add5);
                            }
                            final Element el_courtLine5 = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/line5");
                            el_courtLine5.setText (add5);
                            if (log.isDebugEnabled ())
                            {
                                log.debug ("********FOUND pc " + pc);
                            }
                            final Element el_courtPC = (Element) XPath.selectSingleNode (document,
                                    "/params/param/variabledata/claim/hearing/court/address/postcode");
                            el_courtPC.setText (pc);
                        }
                    }
                }
            }
            finally
            {
                if (rs != null)
                {
                    rs.close ();
                }
                if (stmnt != null)
                {
                    stmnt.close ();
                }
                if (null != conn && !conn.isClosed ())
                {
                    conn.close ();
                }
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("no el_courtId found in the incomming xml");
            }
        }

        if (log.isDebugEnabled ())
        {
            log.debug ("end addHearingData");
        }
    }

    /**
     * (non-Javadoc)
     * Method adds the output footer strapline to the document model.
     *
     * @param document the document
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     */
    private void addOutputStrapline (final org.jdom.Document document)
        throws SystemException, SQLException, JDOMException, NamingException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start addOutputStrapline");
        }

        Connection conn = null;
        PreparedStatement stmnt = null;
        ResultSet rs = null;
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
                    stmnt = conn.prepareStatement (
                            "SELECT RV_MEANING FROM CCBC_REF_CODES WHERE RV_DOMAIN = 'OUTPUT_STRAPLINE'");
                    rs = stmnt.executeQuery ();
                    while (rs.next ())
                    {
                        final String straplineText = rs.getString (1);
                        if (log.isDebugEnabled ())
                        {
                            log.debug ("********FOUND straplineText " + straplineText);
                        }
                        final Element el_strapline = (Element) XPath.selectSingleNode (document,
                                "/params/param/variabledata/outputstrapline");
                        el_strapline.setText (straplineText);
                    }
                }
            }
        }
        finally
        {
            if (rs != null)
            {
                rs.close ();
            }
            if (stmnt != null)
            {
                stmnt.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }

        if (log.isDebugEnabled ())
        {
            log.debug ("end addOutputStrapline");
        }
    }

    /**
     * (non-Javadoc)
     * Set time string format.
     *
     * @param xpath the xpath
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     */
    private void fixTime (final String xpath, final org.jdom.Document doc) throws JDOMException
    {
        final SimpleDateFormat dateFormatTime = new SimpleDateFormat ("h:mm a");

        final Calendar cal = new GregorianCalendar (0, 1, 0, 0, 0);
        final Element el_time = (Element) XPath.selectSingleNode (doc, xpath);
        if (el_time != null && el_time.getValue () != null && el_time.getValue ().trim ().length () > 0)
        {
            cal.set (Calendar.SECOND, Integer.parseInt (el_time.getValue ()));
            final Date time_In = cal.getTime ();
            el_time.setText (dateFormatTime.format (time_In));
            if (log.isDebugEnabled ())
            {
                log.debug ("Changed " + xpath + " format to " + el_time.getValue ());
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("Change " + xpath + " format failed. Perhaps there was none.");
            }
        }
    }

    /**
     * Fix time from HHMM.
     *
     * @param xpath the xpath
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     */
    private void fixTimeFromHHMM (final String xpath, final org.jdom.Document doc) throws JDOMException
    {
        final SimpleDateFormat dateFormatTime = new SimpleDateFormat ("h:mm a");

        final Calendar cal = new GregorianCalendar (0, 1, 0, 0, 0);
        final Element el_time = (Element) XPath.selectSingleNode (doc, xpath);
        if (el_time != null && el_time.getValue () != null && el_time.getValue ().trim ().length () > 0)
        {
            final String time = el_time.getValue ();
            final int hr = Integer.parseInt (time.substring (0, time.indexOf (":")));
            final int mn = Integer.parseInt (time.substring (time.indexOf (":") + 1, time.length ()));
            cal.set (1970, 1, 1, hr, mn, 0);
            final Date time_In = cal.getTime ();
            el_time.setText (dateFormatTime.format (time_In));
            if (log.isDebugEnabled ())
            {
                log.debug ("Changed " + xpath + " format to " + el_time.getValue ());
            }
        }
        else
        {
            if (log.isDebugEnabled ())
            {
                log.debug ("Change " + xpath + " format failed. Perhaps there was none!!!!");
            }
        }
    }

    /**
     * (non-Javadoc)
     * Set date string format.
     *
     * @param xpath the xpath
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void fixDate (final String xpath, final org.jdom.Document doc) throws JDOMException, ParseException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("fixDate: xpath=" + xpath);
        }
        final SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

        final Element el_issueDate = (Element) XPath.selectSingleNode (doc, xpath);
        if (log.isDebugEnabled ())
        {
            log.debug ("el_issueDate=" + el_issueDate);
        }

        if (el_issueDate != null && null != el_issueDate.getValue ())
        {
            String issueDateString = el_issueDate.getValue ();
            issueDateString = issueDateString.trim ();
            if (null != issueDateString && issueDateString.length () > 0)
            {
                final Date issueDate_In = dateFormatIn.parse (issueDateString);
                el_issueDate.setText (dateFormat.format (issueDate_In));
            }
        }
    }

    /**
     * (non-Javadoc)
     * Format date of birth data.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void fixDateofBirth (final org.jdom.Document doc) throws JDOMException, ParseException
    {
        // Xpath to retrieve all date of birth elements within the variabledata node
        final String DOB_XPATH = "/params/param/variabledata//dateofbirth";
        final SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

        if (log.isTraceEnabled ())
        {
            log.trace ("start fixDateofBirth");
        }
        // Get all of the dateofbirth elements and format them
        final List<Element> dobList = XPath.selectNodes (doc, DOB_XPATH);
        for (Iterator<Element> i = dobList.iterator (); i.hasNext ();)
        {
            final Element dobElement = (Element) i.next ();
            final String dobValue = dobElement.getValue ();
            if (dobValue != null && !dobValue.equals (""))
            {
                final Date dobInElement = dateFormatIn.parse (dobElement.getValue ());
                dobElement.setText (dateFormat.format (dobInElement));
                if (log.isDebugEnabled ())
                {
                    log.debug ("Changed " + DOB_XPATH + " format to " + dobElement.getValue ());
                }
            }
        }

    }

    /**
     * (non-Javadoc)
     * Format visit dates.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void fixVisitDates (final org.jdom.Document doc) throws JDOMException, ParseException
    {
        // Xpath to retrieve all date of birth elements within the variabledata node
        final String VISIT_DATE_XPATH = "/params/param/variabledata/notice/visits//visitdate";
        final SimpleDateFormat dateFormat = new SimpleDateFormat ("dd-MMM-yyyy");
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

        if (log.isTraceEnabled ())
        {
            log.trace ("start fixVisitDates");
        }
        // Get all of the dateofbirth elements and format them
        final List<Element> visitDateList = XPath.selectNodes (doc, VISIT_DATE_XPATH);
        for (Iterator<Element> i = visitDateList.iterator (); i.hasNext ();)
        {
            final Element visitDateElement = (Element) i.next ();
            final String visitDateValue = visitDateElement.getValue ();
            if (visitDateValue != null && !visitDateValue.equals (""))
            {
                final Date visitDateInElement = dateFormatIn.parse (visitDateElement.getValue ());
                visitDateElement.setText (dateFormat.format (visitDateInElement));
                if (log.isDebugEnabled ())
                {
                    log.debug ("Changed " + VISIT_DATE_XPATH + " format to " + visitDateElement.getValue ());
                }
            }
        }
    }

    /**
     * temp method to fix date formats.
     *
     * @param document The document to calculate the posted date for.
     * @throws JDOMException the JDOM exception
     * @throws ParseException the parse exception
     */
    private void fixDates (final org.jdom.Document document) throws JDOMException, ParseException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("start fixDates");
        }
        final ArrayList<String> datesToFix = new ArrayList<>();

        datesToFix.add ("/params/param/variabledata/letter/date");
        datesToFix.add ("/params/param/variabledata/letter/sentdate");
        datesToFix.add ("/params/param/variabledata/letter/originalpayableorderdate");
        datesToFix.add ("/params/param/variabledata/letter/collectedbydate");
        datesToFix.add ("/params/param/variabledata/letter/correspondencedate");
        datesToFix.add ("/params/param/variabledata/letter/dateserved");
        datesToFix.add ("/params/param/variabledata/letter/appealdate");
        datesToFix.add ("/params/param/variabledata/order/adjourneddate");
        datesToFix.add ("/params/param/variabledata/order/petitiondate2");
        datesToFix.add ("/params/param/variabledata/order/apppresenteddate");
        datesToFix.add ("/params/param/variabledata/order/bankruptcydischargedate");
        datesToFix.add ("/params/param/variabledata/order/bankruptcydate");
        datesToFix.add ("/params/param/variabledata/order/meetingdate");
        datesToFix.add ("/params/param/variabledata/order/interimextendeddate");
        datesToFix.add ("/params/param/variabledata/order/interimdate");
        datesToFix.add ("/params/param/variabledata/order/nomineereportdate");
        datesToFix.add ("/params/param/variabledata/order/petitiondate");
        datesToFix.add ("/params/param/variabledata/order/awarddate");
        datesToFix.add ("/params/param/variabledata/order/arrestdate");
        datesToFix.add ("/params/param/variabledata/order/arrestexpirydate");
        datesToFix.add ("/params/param/variabledata/order/originalpayableorderdate");
        datesToFix.add ("/params/param/variabledata/order/lettersentdate");
        datesToFix.add ("/params/param/variabledata/order/collectiondate");
        datesToFix.add ("/params/param/variabledata/order/letterdate");
        datesToFix.add ("/params/param/variabledata/order/hearingdate365");
        datesToFix.add ("/params/param/variabledata/order/presentationpetitiondate");
        datesToFix.add ("/params/param/variabledata/order/proceedingsissuedate");
        datesToFix.add ("/params/param/variabledata/order/datesuspend");
        datesToFix.add ("/params/param/variabledata/order/coorderdate");
        datesToFix.add ("/params/param/variabledata/order/fileddate");
        datesToFix.add ("/params/param/variabledata/order/orderdate");
        datesToFix.add ("/params/param/variabledata/order/goodsreturndate");
        datesToFix.add ("/params/param/variabledata/order/returngoodsdate");
        datesToFix.add ("/params/param/variabledata/order/instalmentdate");
        datesToFix.add ("/params/param/variabledata/order/allocationquestionairefiledate");
        datesToFix.add ("/params/param/variabledata/order/datestayeduntil");
        datesToFix.add ("/params/param/variabledata/order/fdexpirydate");
        datesToFix.add ("/params/param/variabledata/order/paymentdate");
        datesToFix.add ("/params/param/variabledata/order/originalorderdate");
        datesToFix.add ("/params/param/variabledata/order/coorder/finedate");
        datesToFix.add ("/params/param/variabledata/order/coorder/daten61a");
        datesToFix.add ("/params/param/variabledata/order/coorder/firstpaymentdate");
        datesToFix.add ("/params/param/variabledata/order/coorder/sumpaydate");
        datesToFix.add ("/params/param/variabledata/order/coorder/orderdate");
        datesToFix.add ("/params/param/variabledata/letter/letservdate");
        // Following line commented as this is not required. already handled in FixDateOfBirth call.
        // datesToFix.add("/params/param/variabledata/order/beneficiary/dateofbirth");
        datesToFix.add ("/params/param/variabledata/order/settlement/investdate");
        datesToFix.add ("/params/param/variabledata/order/settlement/receiverapplicationdate");
        datesToFix.add ("/params/param/variabledata/order/settlement/paiddiretdate");
        datesToFix.add ("/params/param/variabledata/order/settlement/applicationdate");
        datesToFix.add ("/params/param/variabledata/notice/letterdate");
        datesToFix.add ("/params/param/variabledata/notice/letterleftdate");
        // datesToFix.add("/params/param/variabledata/notice/visits/visit/visitdate");
        datesToFix.add ("/params/param/variabledata/notice/paymentdate");
        datesToFix.add ("/params/param/variabledata/notice/forcedate");
        datesToFix.add ("/params/param/variabledata/notice/paymoneydate");
        datesToFix.add ("/params/param/variabledata/notice/dateorder2");
        datesToFix.add ("/params/param/variabledata/notice/arrestdate");
        datesToFix.add ("/params/param/variabledata/notice/warrantorderdate");
        datesToFix.add ("/params/param/variabledata/notice/dateorderexpires");
        datesToFix.add ("/params/param/variabledata/notice/datecease");
        // Commenting as this field is a Text field.
        // datesToFix.add("/params/param/variabledata/notice/specificquesdetail");
        datesToFix.add ("/params/param/variabledata/notice/dateexpensespaid");
        datesToFix.add ("/params/param/variabledata/notice/servicedateofn79a");
        datesToFix.add ("/params/param/variabledata/notice/dateofn79aorder");
        datesToFix.add ("/params/param/variabledata/notice/dateofn39");
        datesToFix.add ("/params/param/variabledata/notice/dateofevidence");
        datesToFix.add ("/params/param/variabledata/notice/intmorderdate");
        datesToFix.add ("/params/param/variabledata/notice/interimdate");
        datesToFix.add ("/params/param/variabledata/notice/injunctdate");
        datesToFix.add ("/params/param/variabledata/notice/breachorderdate");
        datesToFix.add ("/params/param/variabledata/notice/lqfiledate");
        datesToFix.add ("/params/param/variabledata/notice/paymentinfulldate");
        datesToFix.add ("/params/param/variabledata/notice/firstpaymentdate");
        datesToFix.add ("/params/param/variabledata/notice/initialdate");
        datesToFix.add ("/params/param/variabledata/notice/costsdate");
        datesToFix.add ("/params/param/variabledata/notice/intrimsumpayablewithin");
        datesToFix.add ("/params/param/variabledata/notice/intrimcostscrtdate");
        datesToFix.add ("/params/param/variabledata/notice/amtpaiddate");
        datesToFix.add ("/params/param/variabledata/notice/ccfiledate");
        datesToFix.add ("/params/param/variabledata/notice/dateworkdone");
        datesToFix.add ("/params/param/variabledata/notice/dailystartdate");
        datesToFix.add ("/params/param/variabledata/notice/datelist");
        // Commented as the screen sets this value to either 'GD' or 'FD'
        // datesToFix.add("/params/param/variabledata/notice/docsfiledate");
        datesToFix.add ("/params/param/variabledata/notice/qreturndate");
        datesToFix.add ("/params/param/variabledata/notice/claimantintdate");
        // Commented as the screen sets this value to either 'GD' or 'FD'
        // datesToFix.add("/params/param/variabledata/notice/sumpayablewithin");
        datesToFix.add ("/params/param/variabledata/notice/possessiondate");
        datesToFix.add ("/params/param/variabledata/notice/servicedate");
        datesToFix.add ("/params/param/variabledata/notice/servicedate1");
        datesToFix.add ("/params/param/variabledata/notice/posteddate");
        datesToFix.add ("/params/param/variabledata/notice/servicereplydate");
        datesToFix.add ("/params/param/variabledata/notice/receiptdate");
        datesToFix.add ("/params/param/variabledata/notice/formreturndate");
        datesToFix.add ("/params/param/variabledata/notice/questionairereturndate");
        datesToFix.add ("/params/param/variabledata/notice/formcompletedate");
        datesToFix.add ("/params/param/variabledata/notice/dateofhearingn39");
        datesToFix.add ("/params/param/variabledata/notice/servicedateofn39");
        datesToFix.add ("/params/param/variabledata/notice/affofservdate");
        datesToFix.add ("/params/param/variabledata/notice/dateaffofexpense");
        datesToFix.add ("/params/param/variabledata/notice/costpaymentdate");
        datesToFix.add ("/params/param/variabledata/notice/dateofnotattcert");
        datesToFix.add ("/params/param/variabledata/notice/dateconsidered");
        datesToFix.add ("/params/param/variabledata/notice/dateofacts");
        datesToFix.add ("/params/param/variabledata/notice/interimorderdeadline");
        datesToFix.add ("/params/param/variabledata/notice/fee/paydate");
        datesToFix.add ("/params/param/variabledata/notice/fee/listeddate");
        datesToFix.add ("/params/param/variabledata/notice/fee/filedate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/hrgdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/hrgenddate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/hrgstartdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/lqdirecfiledate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/orderfiledate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/meetingdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/agreementdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/exchangeservedatefor");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/exchangeservedatefor2");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/exchangedate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/exchangeservedate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/filereportdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/libertyagreedate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/ptyinformcrtdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/latestrequestdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/latestdeliverydate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/doscdateservicecopy");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/furtherinfodealdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/furtherinfofiledate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/docsserveddate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/fthrgdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/wftenddate/EndDate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/wftstartdate/StartDate");
        datesToFix.add ("/params/param/variabledata/order/demandissuedate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/infofiledate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/date");
        datesToFix.add ("/params/param/variabledata/claim/dateofissue");
        datesToFix.add ("/params/param/variabledata/claim/receiptdate");
        datesToFix.add ("/params/param/variabledata/claim/hearing/court/atdate");
        datesToFix.add ("/params/param/variabledata/certificateofservice/dateserved");
        datesToFix.add ("/params/param/variabledata/event/date");
        datesToFix.add ("/params/param/variabledata/coevent/date");
        datesToFix.add ("/params/param/variabledata/coevent/receiptdate");
        datesToFix.add ("/params/param/variabledata/obligation/expirydate");
        datesToFix.add ("/params/param/variabledata/order/settlement/paiddirectdate");
        datesToFix.add ("/params/param/variabledata/transfer/orderdate");
        datesToFix.add ("/params/param/variabledata/judgment/goodspaymentdate");
        datesToFix.add ("/params/param/variabledata/judgment/judgmentdate");
        datesToFix.add ("/params/param/variabledata/judgment/finaldateofpayment");
        datesToFix.add ("/params/param/variabledata/judgment/firstpaymentdate");
        datesToFix.add ("/params/param/variabledata/judgment/paymentinfulldate");
        datesToFix.add ("/params/param/variabledata/judgment/dateofgoodsreturned");
        datesToFix.add ("/params/param/variabledata/judgment/goodsfirstpaymentdate");
        datesToFix.add ("/params/param/variabledata/judgment/agreementdate");
        datesToFix.add ("/params/param/variabledata/judgment/resultdate");
        datesToFix.add ("/params/param/variabledata/judgment/variations/variation[position()=last()]/appdate");
        datesToFix.add ("/params/param/variabledata/judgment/variations/variation[position()=last()]/dateresult");
        datesToFix.add ("/params/param/variabledata/judgment/variations/variation[position()=last()]/paydate");
        datesToFix.add ("/params/param/variabledata/judgment/setaside/appdate");
        datesToFix.add ("/params/param/variabledata/thirdparty/orderdate");
        datesToFix.add ("/params/param/variabledata/warrant/paymentdate");
        datesToFix.add ("/params/param/variabledata/warrant/returndate");
        datesToFix.add ("/params/param/variabledata/warrant/receiptdate");
        datesToFix.add ("/params/param/variabledata/transfer/dateoftransfer");
        datesToFix.add ("/params/param/variabledata/order/registrationdate");
        datesToFix.add ("/params/param/variabledata/order/judgmentorderdate");
        datesToFix.add ("/params/param/variabledata/order/dateofextension");
        datesToFix.add ("/params/param/variabledata/judgment/datedefencefiled");
        datesToFix.add ("/params/param/variabledata/order/proceedingsdate");
        datesToFix.add ("/params/param/variabledata/order/reportdeliveredby");
        datesToFix.add ("/params/param/variabledata/judgment/judgmentdateout");
        datesToFix.add ("/params/param/variabledata/order/registrationwritsdate");
        datesToFix.add ("/params/param/variabledata/order/reportdate");
        datesToFix.add ("/params/param/variabledata/judgment/paidinfulldate");
        datesToFix.add ("/params/param/variabledata/judgment/setaside/dateresult");
        datesToFix.add ("/params/param/variabledata/order/statutorydemanddate");
        datesToFix.add ("/params/param/variabledata/order/affidavitsupportdate");
        datesToFix.add ("/params/param/variabledata/order/datemade");
        datesToFix.add ("/params/param/variabledata/letter/selectdate");
        datesToFix.add ("/params/param/variabledata/warrant/appointmentdate");
        datesToFix.add ("/params/param/variabledata/bailiff/visitdate");
        datesToFix.add ("/params/param/variabledata/lqandhearing/payablebydate");
        // datesToFix.add("/params/param/variabledata/notice/billreturndate");

        fixDateofBirth (document);
        fixVisitDates (document);
        while (datesToFix.size () > 0)
        {
            final String dateXPath = (String) datesToFix.get (0);
            fixDate (dateXPath, document);
            datesToFix.remove (0);
        }

        final ArrayList<String> timesToFix = new ArrayList<>();

        timesToFix.add ("/params/param/variabledata/claim/hearing/time");
        timesToFix.add ("/params/param/variabledata/claim/hearing/court/attime");
        timesToFix.add ("/params/param/variabledata/certificateofservice/servicetimesent");
        timesToFix.add ("/params/param/variabledata/notice/forcetime");
        timesToFix.add ("/params/param/variabledata/claim/hearing/fasttrack/fthrgtime");
        timesToFix.add ("/params/param/variabledata/order/meetingtime");
        timesToFix.add ("/params/param/variabledata/order/petitionadjournedtime");
        timesToFix.add ("/params/param/variabledata/warrant/appointmenttime");

        while (timesToFix.size () > 0)
        {
            final String timeXPathc = (String) timesToFix.get (0);
            fixTime (timeXPathc, document);
            timesToFix.remove (0);
        }

        if (log.isDebugEnabled ())
        {
            log.debug ("end fixDates");
        }
    }

    /**
     * Returns the service reply date given the service date.
     * This is calculated as the service date plus 16 days. If
     * this falls on a weekend or non working day, the next
     * working day is returned.
     *
     * @param serviceDate The service date.
     * @return The service reply date.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     */
    private Date getServiceReplyDate (final Date serviceDate) throws SystemException, BusinessException, ParseException
    {
        final Calendar serviceReplyDate = new GregorianCalendar ();
        serviceReplyDate.setTime (serviceDate);
        serviceReplyDate.add (Calendar.DATE, 14);
        return serviceReplyDate.getTime ();
    }

    /**
     * Returns the next working day after the given date, or
     * returns the supplied date if it is already a working day.
     *
     * @param date The date to check.
     * @return The next working day.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     */
    private Date nextWorkingDay (final Date date) throws SystemException, BusinessException, ParseException
    {
        log.trace ("start nextWorkingDay" + date);

        final Calendar serviceReplyDate = new GregorianCalendar ();

        serviceReplyDate.setTime (date);
        isWeekEnd (serviceReplyDate);
        log.debug ("First Weekend Instance:" + serviceReplyDate.getTime ());

        while (isNonWorkingDay (serviceReplyDate.getTime ()))
        {
            log.debug ("Non Working Day Instance:" + serviceReplyDate.getTime ());
            serviceReplyDate.add (Calendar.DATE, 1);
            isWeekEnd (serviceReplyDate);
            log.debug ("Weekend Instance:" + serviceReplyDate.getTime ());
        }

        log.trace ("end nextWorkingDay" + date);
        return serviceReplyDate.getTime ();
    }

    /**
     * Checks if is week end. Moves the given day to the next non weekend day.
     *
     * @param calendar the calendar
     */
    private void isWeekEnd (final Calendar calendar)
    {
        if (calendar.get (Calendar.DAY_OF_WEEK) == Calendar.SATURDAY)
        {
            calendar.add (Calendar.DATE, 2);
        }
        if (calendar.get (Calendar.DAY_OF_WEEK) == Calendar.SUNDAY)
        {
            calendar.add (Calendar.DATE, 1);
        }
    }

    /**
     * Checks to see if the given date is a non working day stored in the database.
     *
     * @param date The date to check.
     * @return true if the date is a non working day, otherwise false.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     */
    private boolean isNonWorkingDay (final Date date) throws SystemException, BusinessException, ParseException
    {
        if (nonWorkingDay == null)
        {
            getNonWorkingDays ();
            log.debug ("nonWorkingDay Array" + nonWorkingDay.toArray ());
        }
        log.debug ("nonWorkingDay returns " + nonWorkingDay.contains (date));
        return nonWorkingDay.contains (date);
    }

    /**
     * Adds the CFO data to the dom.
     *
     * @param doc the doc
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     * @throws JDOMException the JDOM exception
     * @throws NamingException the naming exception
     */
    private void addCFOData (final org.jdom.Document doc)
        throws SystemException, SQLException, JDOMException, NamingException
    {
        final String queryString =
                "select SD.ITEM,SD.ITEM_VALUE from SYSTEM_DATA SD where SD.ITEM='CFO AREA CODE' or SD.ITEM='CFO DIALING CODE' or SD.ITEM='CFO EXTENSION'";
        String caseParamsArea = null;
        String caseParamsDial = null;
        String caseParamsExten = null;
        Connection conn = null;
        PreparedStatement stmnt = null;
        ResultSet rs = null;
        try
        {
            final Context ctx = new InitialContext ();
            if (ctx == null)
            {
                throw new SystemException ("Could not retrieve Context.");
            }
            final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
            log.trace ("Grabbed dataSource!! from CFOData, source is: " + ds);
            if (ds != null)
            {
                conn = ds.getConnection ();
                if (conn != null)
                {
                    stmnt = conn.prepareStatement (queryString);
                    rs = stmnt.executeQuery ();
                    while (rs.next ())
                    {
                        final String itemName = rs.getString (1);
                        final String itemValue = rs.getString (2);
                        if (itemName.equals ("CFO AREA CODE"))
                        {
                            caseParamsArea = itemValue;
                        }
                        else if (itemName.equals ("CFO DIALING CODE"))
                        {
                            caseParamsDial = itemValue;
                        }
                        else if (itemName.equals ("CFO EXTENSION"))
                        {
                            caseParamsExten = itemValue;
                        }
                    }
                }
            }
        }
        finally
        {
            if (rs != null)
            {
                rs.close ();
            }
            if (stmnt != null)
            {
                stmnt.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }

        // This looks redundant
        if (caseParamsArea != null && caseParamsDial != null && caseParamsExten != null)
        {
            final String tel = new String ("0" + caseParamsDial + " " + caseParamsArea + " " + caseParamsExten);
            final Element el =
                    (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/cfotelephonenumber");
            if (log.isTraceEnabled ())
            {
                log.trace ("CFO Telephone Number : " + tel);
            }
            el.setText (tel);
        }

        // this bit is cool
        final Element cfoName = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/cfo/name");
        cfoName.setText ("Court Funds Office");
        final Element cfoAddr1 =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/cfo/address/line1");
        cfoAddr1.setText ("Glasgow");
        final Element cfoAddrPostCode =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/cfo/address/postcode");
        cfoAddrPostCode.setText ("G58 1AB");
        final Element cfoDX = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/order/cfo/address/dx");
        cfoDX.setText ("DX 501757 Cowglen");
        if (log.isTraceEnabled ())
        {
            log.trace ("Finished creating CFO");
        }
    }

    /**
     * This method will add up all the debt values and costs to insert the
     * calculation to XPath /params/param/variabledata/order/coorder/debts/totalamount
     * 
     * TRAC 3023 - Take into account past payments for certain outputs.
     *
     * @param document the document
     * @param output the output
     * @throws JDOMException the JDOM exception
     */
    private void calculateConsolidatedOrderTotal (final org.jdom.Document document, final String output)
        throws JDOMException
    {

        if (log.isTraceEnabled ())
        {
            log.trace ("enter calculateConsolidatedOrderTotal");
        }
        ArrayList<Element> el_debt = null;
        Element el_debtTotal = null;
        Element el_feeRate = null;
        Element el_feeAmount = null;
        Element el_outstandingDebt = null;
        double total = 0.00;
        double outstandingBalanceTotal = 0.00;

        if ( !"CO28".equals (output))
        {
            el_debt = (ArrayList<Element>) XPath.selectNodes (document,
                    "/params/param/variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']");
        }
        else
        {

            el_debt = (ArrayList<Element>) XPath.selectNodes (document,
                    "/params/param/variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or (isnew!='Y' and isnew!='') ]");
        }
        el_debtTotal = (Element) XPath.selectSingleNode (document,
                "/params/param/variabledata/order/coorder/debts/totalamount");
        el_feeRate = (Element) XPath.selectSingleNode (document, "/params/param/variabledata/order/coorder/feerate");
        el_feeAmount =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/order/coorder/feeamount");
        el_outstandingDebt = (Element) XPath.selectSingleNode (document,
                "/params/param/variabledata/order/coorder/cooutstandingdebt");

        if (log.isDebugEnabled ())
        {
            log.debug ("el_debt=" + el_debt);
            if (el_debtTotal != null)
            {
                log.debug ("el_debtTotal=" + el_debtTotal.getText ());
            }
            if (el_feeAmount != null)
            {
                log.debug ("el_feeAmount=" + el_feeAmount.getText ());
            }
        }

        final ArrayList<Element> listDebt = el_debt;
        final Iterator<Element> iter = listDebt.iterator ();

        while (iter.hasNext ())
        {
            final Element value = (Element) iter.next ();
            final Element debtamntNode = (Element) XPath.selectSingleNode (value, "debtamountallowed");
            final Element passThroughNode = (Element) XPath.selectSingleNode (value, "passthrough");
            final Element dividendsNode = (Element) XPath.selectSingleNode (value, "divends");
            final String status = ((Element) XPath.selectSingleNode (value, "debtstatus")).getText ();

            if ( !status.equalsIgnoreCase ("DELETED"))
            {
                final double debtamountallowed = Double.parseDouble (debtamntNode.getValue ());
                final double passthrough = Double.parseDouble (passThroughNode.getValue ());
                final double dividends = Double.parseDouble (dividendsNode.getValue ());
                total += debtamountallowed - passthrough;
                // TRAC 3023 - added figure to take into account dividends
                outstandingBalanceTotal += debtamountallowed - (passthrough + dividends);
            }
        }

        final double feeAmount = Math.ceil (total) / 100 * Double.parseDouble (el_feeRate.getText ());
        el_feeAmount.setText (Double.toString (feeAmount));
        total = total + feeAmount;
        el_debtTotal.setText (Double.toString (total));
        el_outstandingDebt.setText (Double.toString (outstandingBalanceTotal));

        if (log.isTraceEnabled ())
        {
            log.trace ("exit calculateConsolidatedOrderTotal");
        }
    }

    /**
     * Fills out the calculated date to the
     * xpath variabledata/order/coorder/objectiondate.
     *
     * @param document the document
     * @throws JDOMException the JDOM exception
     */
    private void addObjectionDate (final org.jdom.Document document) throws JDOMException
    {
        final Calendar objectionDate = new GregorianCalendar ();
        objectionDate.setTime (new Date ());
        objectionDate.add (Calendar.DATE, 16);

        Element el_objectionDate = null;

        el_objectionDate =
                (Element) XPath.selectSingleNode (document, "/params/param/variabledata/order/coorder/objectiondate");
        el_objectionDate.setText (dateFormat.format (objectionDate.getTime ()));
    }

    /**
     * O_10_8 and O_10 requires the instigator for O_10_10 that is used in the outputs.
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void addPrevious659Instigator (final org.jdom.Document doc)
        throws JDOMException, BusinessException, SystemException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("enter addPrevious659Instigator");
        }

        final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
        final Element el_casenumber =
                (Element) XPath.selectSingleNode (doc, "/params/param[@name='xml']/variabledata/claim/number");

        if (null != el_casenumber)
        {
            final String casenumber = el_casenumber.getText ();

            final String caseParams = callServiceParam ("caseNumber", casenumber);

            final Element eventsxml =
                    proxy.getJDOM (CASE_EVENT_SERVICE, GET_EVENTS_SUMMARY, caseParams).getRootElement ();

            final Element event659InstigatorNumber = (Element) XPath.selectSingleNode (eventsxml,
                    "/ds/ManageCaseEvents/CaseEvents/CaseEvent[StandardEventId = 659]/InstigatorList/Instigator/CasePartyNumber");

            final Element event659InstigatorCode = (Element) XPath.selectSingleNode (eventsxml,
                    "/ds/ManageCaseEvents/CaseEvents/CaseEvent[StandardEventId = 659]/InstigatorList/Instigator/PartyRoleCode");

            if (null != event659InstigatorCode)
            {
                final String subjectNumber = event659InstigatorNumber.getText ();
                if (log.isDebugEnabled ())
                {
                    log.debug ("/params/param/variabledata/claim/" + mapPartyRole.get (event659InstigatorCode) +
                            "[number =" + subjectNumber + "]" + "/number");
                }
                final String subjectName = event659InstigatorNumber.getText ();

                final Element el_659 = new Element ("e659");
                final Element instigator = new Element ("instigator");
                final Element name = new Element ("name");
                name.setText (subjectName);

                instigator.addContent (name);
                el_659.addContent (instigator);
            }
        }
        if (log.isTraceEnabled ())
        {
            log.trace ("exit addPrevious659Instigator");
        }
    }

    /**
     * This method organizes the "variabledata/event" elements to include "subjects" and "instigators"
     * element which concat all the relevant information from the parties involved. This information includes:
     * id, number, name, reference, partyrole
     * 
     * No new information is added to the XML DOM.
     * /variabledata/event/SubjectCasePartyNumber
     * /variabledata/event/SubjectPartyRoleCode
     * 
     * /variabledata/event/InstigatorList/Instigator/CasePartyNumber
     * /variabledata/event/InstigatorList/Instigator/CasePartyRoleCode
     * 
     * The reference is either the parties reference or if present the parties' representitives reference
     *
     * @param doc the doc
     * @throws JDOMException the JDOM exception
     */
    private void maintainEventSubjectInstigator (final org.jdom.Document doc) throws JDOMException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("enter maintainEventSubjectInstigator");
        }

        final Element element = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/event");

        final Element subjectNumber =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/event/SubjectCasePartyNumber");
        final Element subjectRole =
                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/event/SubjectPartyRoleCode");

        if (element != null && subjectNumber != null && subjectRole != null)
        {

            final String subjectNo = subjectNumber.getText ();
            final String subjectRo = subjectRole.getText ();

            if (subjectNo != "" && mapPartyRole.get (subjectRo) != null)
            {

                final Element subjectID = (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/" +
                        mapPartyRole.get (subjectRo) + "[number =" + subjectNo + "]" + "/id");
                if (subjectID != null)
                {
                    final String subjectId = subjectID.getText ();

                    final Element subject = new Element ("subject");
                    final Element sNumber = new Element ("number");
                    final Element sPartyrole = new Element ("partyrole");
                    final Element sId = new Element ("id");

                    // get the subject name defect UCT_603
                    final Element sName = new Element ("name");
                    final Element subjectName = (Element) XPath.selectSingleNode (doc,
                            "/params/param/variabledata/claim/*[id=" + subjectId + "]/name");
                    final String sNameStg = subjectName.getText ();

                    sNumber.setText (subjectNo);
                    sPartyrole.setText (subjectRo);
                    sId.setText (subjectId);
                    sName.setText (sNameStg);

                    subject.addContent (sNumber);
                    subject.addContent (sPartyrole);
                    subject.addContent (sId);
                    subject.addContent (sName);

                    final Element subjects = new Element ("subjects");
                    subjects.addContent (subject);
                    element.addContent (subjects);
                }
            }
        }

        if (element != null)
        {

            final Element instigators = new Element ("instigators");

            final List<Element> el_instigators =
                    XPath.selectNodes (doc, "/params/param/variabledata/event/InstigatorList/Instigator");
            final Iterator<Element> iter = el_instigators.iterator ();
            while (iter.hasNext ())
            {
                final Element object = (Element) iter.next ();
                final Element instigatorNumber = (Element) XPath.selectSingleNode (object, "CasePartyNumber");
                final Element instigatorRole = (Element) XPath.selectSingleNode (object, "CasePartyRoleCode");

                if (instigatorNumber != null && instigatorRole != null)
                {
                    final String instigatorNo = instigatorNumber.getText ();
                    final String instigatorRo = instigatorRole.getText ();

                    if (instigatorNo != "" && mapPartyRole.get (instigatorRo) != null)
                    {
                        final Element instigatorName =
                                (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/" +
                                        mapPartyRole.get (instigatorRo) + "[number =" + instigatorNo + "]" + "/name");

                        if (instigatorName != null)
                        {
                            final String instigatorNm = instigatorName.getText ();

                            final Element instigatorID =
                                    (Element) XPath.selectSingleNode (doc, "/params/param/variabledata/claim/" +
                                            mapPartyRole.get (instigatorRo) + "[number =" + instigatorNo + "]" + "/id");

                            if (instigatorID != null)
                            {
                                final String instigatorId = instigatorID.getText ();

                                final Element instigatorReference = (Element) XPath.selectSingleNode (doc,
                                        "/params/param/variabledata/claim/" + mapPartyRole.get (instigatorRo) +
                                                "[number =" + instigatorNo + "]" + "/reference");

                                if (instigatorReference != null)
                                {
                                    final String instigatorRef = instigatorReference.getText ();

                                    final Element instigator = new Element ("instigator");

                                    final Element number = new Element ("number");
                                    final Element partyrole = new Element ("partyrole");
                                    final Element name = new Element ("name");
                                    final Element id = new Element ("id");
                                    final Element reference = new Element ("reference");

                                    number.setText (instigatorNo);
                                    partyrole.setText (instigatorRo);
                                    name.setText (instigatorNm);
                                    id.setText (instigatorId);
                                    reference.setText (instigatorRef);

                                    instigator.addContent (number);
                                    instigator.addContent (partyrole);
                                    instigator.addContent (name);
                                    instigator.addContent (id);
                                    instigator.addContent (reference);

                                    instigators.addContent (instigator);
                                }
                            }
                        }
                    }
                }
            }

            element.addContent (instigators);
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("exit maintainEventSubjectInstigator");
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

    /**
     * (non-Javadoc)
     * Add warrant.
     *
     * @param warrantId the warrant id
     * @param selectedPartyAgainst the selected party against
     * @param proxy the proxy
     * @param document the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException             TD 5229 : Added selectedPartyAgainst to signature.
     */
    private void addWarrant (final String warrantId, final String selectedPartyAgainst,
                             final SupsLocalServiceProxy proxy, final org.jdom.Document document)
        throws SystemException, BusinessException, JDOMException
    {
        final Element warrantNode = WarrantData.getWarrant (warrantId, proxy);
        final Element dsNode = (Element) XPath.selectSingleNode (document, "/params/param[@name='xml']/ds");
        Element evdNode = dsNode.getChild ("EnterVariableData");
        // Element newWarrNode = (Element)XPath.selectSingleNode(warrantNode, "//Warrant");
        final Element newWarrNode = (Element) ((Element) XPath.selectSingleNode (warrantNode, "//Warrant")).detach ();

        if (evdNode == null)
        {
            evdNode = new Element ("EnterVariableData");
            dsNode.addContent (evdNode);
        }
        // TD 5229
        final Element partyAgainstNumberNode = new Element ("PartyAgainstNumber");
        partyAgainstNumberNode.setText (selectedPartyAgainst);
        newWarrNode.addContent (partyAgainstNumberNode);
        // TD 5229

        // evdNode.addContent( newWarrNode.detach());
        evdNode.addContent (newWarrNode);

    }

    /**
     * Add warrant return.
     *
     * @param warrantId the warrant id
     * @param warrantReturnsId the warrant returns id
     * @param proxy the proxy
     * @param document the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    private void addWarrantReturn (final String warrantId, final String warrantReturnsId,
                                   final SupsLocalServiceProxy proxy, final org.jdom.Document document)
        throws SystemException, BusinessException, JDOMException
    {
        final Element warrantReturnNode = WarrantReturnData.getWarrantReturn (warrantId, warrantReturnsId, proxy);

        final Element warAppTimNod = (Element) XPath.selectSingleNode (warrantReturnNode, "xpath to time");
        if (null != warAppTimNod)
        {
            final String time = warAppTimNod.getValue ();

            final String timeInSec = time;

            warAppTimNod.removeContent ();
            warAppTimNod.addContent (timeInSec);
        }

        final Element dsNode = (Element) XPath.selectSingleNode (document, "/params/param[@name='xml']/ds");
        dsNode.addContent (warrantReturnNode.detach ());
    }

    /**
     * Returns a list of none working days (no it doesn't).
     *
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws ParseException the parse exception
     */
    public static void getNonWorkingDays () throws SystemException, BusinessException, ParseException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start getNonWorkingDays()");
        }

        final String params = "<params></params>";
        final SimpleDateFormat dateFormatIn = new SimpleDateFormat ("yyyy-MM-dd");

        final SupsLocalServiceProxy proxy = new SupsLocalServiceProxy ();
        final Element holsRoot =
                proxy.getJDOM (NON_WORKING_DAY_SERVICE, GET_NON_WORKING_DAYS, params).getRootElement ();

        nonWorkingDay = new ArrayList<Date>();

        final List<Element> holsList = holsRoot.getChildren ();
        final Iterator<Element> it = holsList.iterator ();

        while (it.hasNext ())
        {
            final Element holday = (Element) it.next ();
            final Element dateNode = holday.getChild ("Date");

            if (dateNode != null)
            {
                final String dateStr = dateNode.getText ();
                nonWorkingDay.add (dateFormatIn.parse (dateStr));
            }
        }

        final Object[] days = nonWorkingDay.toArray ();
        for (int i = 0; i < days.length; i++)
        {
            log.debug ("nonWorkingDay[" + i + "] = " + ((Date) days[i]).getTime ());
        }

        if (log.isTraceEnabled ())
        {
            log.trace ("end getNonWorkingDays()");
        }
    }

    /**
     * Returns Outstanding AE details.
     *
     * @param case_number the case number
     * @return the outstanding AE
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     * @throws SQLException the SQL exception
     */
    public static String getOutstandingAE (final String case_number)
        throws NamingException, SystemException, SQLException
    {
        if (log.isTraceEnabled ())
        {
            log.trace ("start getOutstandingAE()");
        }
        String rtn = new String ("N");
        // DB Call Begin
        Connection conn = null;
        PreparedStatement stmntOutstandingAE = null;
        ResultSet rs = null;

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

                    stmntOutstandingAE =
                            conn.prepareStatement ("SELECT DECODE(COUNT(*),0,'N','Y') AS \"OUTSTANDING_AE\"" +
                                    " FROM AE_APPLICATIONS AE " + "WHERE AE.CASE_NUMBER  = '" + case_number +
                                    "' AND (AE.PARTY_FOR_PARTY_ROLE_CODE = 'PT 20 CLMT'" +
                                    "OR AE.PARTY_FOR_PARTY_ROLE_CODE = 'PT 20 DEF'" +
                                    "OR AE.PARTY_AGAINST_PARTY_ROLE_CODE = 'PT 20 CLMT'" +
                                    "OR AE.PARTY_AGAINST_PARTY_ROLE_CODE = 'PT 20 DEF'" +
                                    " OR (AE.PARTY_FOR_PARTY_ROLE_CODE = 'CLAIMANT' " +
                                    "AND AE.PARTY_FOR_CASE_PARTY_NO > 1)" +
                                    "OR (AE.PARTY_FOR_PARTY_ROLE_CODE = 'DEFENDANT'" +
                                    "AND AE.PARTY_FOR_CASE_PARTY_NO > 9)" +
                                    "OR (AE.PARTY_AGAINST_PARTY_ROLE_CODE = 'CLAIMANT'" +
                                    "AND AE.PARTY_AGAINST_CASE_PARTY_NO   > 1)" +
                                    "OR (AE.PARTY_AGAINST_PARTY_ROLE_CODE = 'DEFENDANT'" +
                                    "AND AE.PARTY_AGAINST_CASE_PARTY_NO > 9))");

                    rs = stmntOutstandingAE.executeQuery ();

                    while (rs.next ())
                    {
                        rtn = rs.getString (1);

                    }
                }
            }
        }
        finally
        {
            if (rs != null)
            {
                rs.close ();
            }
            if (stmntOutstandingAE != null)
            {
                stmntOutstandingAE.close ();
            }
            if (null != conn && !conn.isClosed ())
            {
                conn.close ();
            }
        }
        if (log.isDebugEnabled ())
        {
            log.debug ("return " + rtn);
        }
        // DB Call End
        if (log.isTraceEnabled ())
        {
            log.trace ("end getOutstandingAE()");
        }
        return rtn;
    }
}