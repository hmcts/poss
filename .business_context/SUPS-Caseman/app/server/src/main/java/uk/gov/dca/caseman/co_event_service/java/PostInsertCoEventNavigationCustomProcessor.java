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
package uk.gov.dca.caseman.co_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

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
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: COEvent
 * Class: PostInsertCoEventNavigationCustomProcessor.java
 * Created: chris hutt 25 july 2005
 * Description:
 * Java class to support navigation form the "Manage Co Events" screen post Co Event insert.
 *
 *
 * Change History:
 * 
 * v1.1 Chris Hutt 21/11/05
 * StandardEvent returned as part of the word processing navigation (node name correction!)
 * 
 * v1.2 Chris Hutt 1/12/05
 * Details of new CO status returned in navigation data
 * 17-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * 22Nov2007 Chris Hutt : TD Caseman 6065
 * CO event 968 has no output but an associated Q&A screen. This results in a 'broken icon' being displayed on the
 * CO Events screen. Amended to test for event 968 and NOT write to WP_OUTPUT in such circumstances
 * 
 * @author cjh
 */
public class PostInsertCoEventNavigationCustomProcessor implements ICustomProcessor
{

    /** The local service proxy. */
    private final AbstractSupsServiceProxy localServiceProxy;
    /**
     * co service name.
     */
    public static final String CO_SERVICE = "ejb/CoServiceLocal";
    /**
     * Get co method name.
     */
    public static final String GET_CO = "getCoLocal";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (PostInsertCoEventNavigationCustomProcessor.class);

    /**
     * Post insert processor.
     */
    public PostInsertCoEventNavigationCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param pInsertCOEventDoc the insert CO event doc
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pInsertCOEventDoc, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element CoEventNavigationListElement = null;
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {

            // Build a Navigation XML Document for the Client.
            CoEventNavigationListElement = mBuildNavigationXMLElement (pInsertCOEventDoc.getRootElement ());

            // Insert the WP_OUTPUT record if appropriate
            final Element userIdElement = (Element) XPath.selectSingleNode (pInsertCOEventDoc, "/COEvent/UserName");
            final Element stdEventId = (Element) XPath.selectSingleNode (pInsertCOEventDoc, "/COEvent/StandardEventId");
            if (null != userIdElement && null != stdEventId && !stdEventId.getText ().equals ("968"))
            {
                final String userId = userIdElement.getText ();
                mInsertWpOutputRow (CoEventNavigationListElement, userId);
            }

            /* Output the resulting XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (CoEventNavigationListElement);
            pWriter.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
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

        return;
    } // process()

    /**
     * (non-Javadoc)
     * Builds the XML required for navigation.
     *
     * @param pInsertCOEventRowElement the insert CO event row element
     * @return the element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private Element mBuildNavigationXMLElement (final Element pInsertCOEventRowElement)
        throws SystemException, JDOMException, BusinessException
    {
        Element CoEventNavigationListElement = null;
        Element navigateToElement = null;
        Element paramsElement = null;
        ICoEventConfigDO coEventConfigDO = null;
        String sValue = null;
        String newCoStatus = null;

        try
        {
            // Retrieve the configuration associated with the current event.
            coEventConfigDO = mGetCoEventConfigDO (pInsertCOEventRowElement);

            // Initialise the XML to be returned.
            CoEventNavigationListElement = mInitCoEventNavigationListXMLElement ();

            // Add the Sequence Number of the newly inserted Ae Event to the returned XML.
            sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/COEventSeq");
            XMLBuilder.add (CoEventNavigationListElement, "COEventSeq", sValue);

            // Add the StandardEventId of the newly inserted Ae Event to the returned XML.
            sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/StandardEventId");
            XMLBuilder.add (CoEventNavigationListElement, "StandardEventId", sValue);

            // Add the CONumber of the newly inserted Ae Event to the returned XML.
            sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/CONumber");
            XMLBuilder.add (CoEventNavigationListElement, "CONumber", sValue);

            // Add the new CO status (if any) to the returned XML.
            newCoStatus = coEventConfigDO.getSetStatusOnCommit ();
            XMLBuilder.add (CoEventNavigationListElement, "NewCOStatus", newCoStatus);

            // Construct the Word Processing part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("WordProcessing");
            if (coEventConfigDO.isWordProcessingCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("WordProcessing");
                paramsElement = mAddExtraWordProcessingData (pInsertCOEventRowElement, paramsElement);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddTocoEventNavigationListXMLElement (CoEventNavigationListElement, navigateToElement, paramsElement);

            // Construct the Oracle Report part of the XML.
            paramsElement = null;
            navigateToElement = new Element ("OracleReport");
            if (coEventConfigDO.isOracleReportCall ())
            {
                navigateToElement.addContent ("true");
                paramsElement = new Element ("WordProcessing");
                paramsElement = mAddExtraOracleReportData (pInsertCOEventRowElement, paramsElement);
            }
            else
            {
                navigateToElement.addContent ("false");
            }
            mAddTocoEventNavigationListXMLElement (CoEventNavigationListElement, navigateToElement, paramsElement);

        }
        finally
        {
            navigateToElement = null;
            paramsElement = null;
            coEventConfigDO = null;
            sValue = null;
        }

        return CoEventNavigationListElement;
    } // mBuildNavigationXMLElement()

    /**
     * (non-Javadoc)
     * Create the COEventNavigationList element.
     *
     * @return the element
     */
    private Element mInitCoEventNavigationListXMLElement ()
    {
        final Document document = new Document ();
        Element rootElement = null;

        rootElement = new Element ("COEventNavigationList");
        document.setRootElement (rootElement);
        XMLBuilder.add (rootElement, "NavigateTo");
        XMLBuilder.add (rootElement, "Params");

        return rootElement;
    }

    /**
     * (non-Javadoc)
     * Appends navigation data to the pCoEventNavigationListElement.
     *
     * @param pCoEventNavigationListElement the co event navigation list element
     * @param pNavigateToElement the navigate to element
     * @param pParamsElement the params element
     * @throws JDOMException the JDOM exception
     */
    private void mAddTocoEventNavigationListXMLElement (final Element pCoEventNavigationListElement,
                                                        final Element pNavigateToElement, final Element pParamsElement)
        throws JDOMException
    {
        Element insertParentElement = null;

        insertParentElement =
                (Element) XPath.selectSingleNode (pCoEventNavigationListElement, "/COEventNavigationList/NavigateTo");

        insertParentElement.addContent (((Element) pNavigateToElement.clone ()).detach ());

        if (null != pParamsElement)
        {
            insertParentElement =
                    (Element) XPath.selectSingleNode (pCoEventNavigationListElement, "/COEventNavigationList/Params");
            insertParentElement.addContent (((Element) pParamsElement.clone ()).detach ());
        }
    } // mAddTocoEventNavigationListXMLElement()

    /**
     * (non-Javadoc)
     * Adds word processing data to the pWordProcessingElement element.
     *
     * @param pInsertCOEventRowElement the insert CO event row element
     * @param pWordProcessingElement the word processing element
     * @return the element
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraWordProcessingData (final Element pInsertCOEventRowElement,
                                                 final Element pWordProcessingElement)
        throws JDOMException
    {
        String sValue = null;
        Element eventElement = null;

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/COEventSeq");
        XMLBuilder.add (eventElement, "COEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/CONumber");
        XMLBuilder.add (eventElement, "CONumber", sValue);

        //
        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/DebtSeqNumber");
        XMLBuilder.add (eventElement, "DebtSeqNumber", sValue);

        XMLBuilder.add (eventElement, "Beatles", "Paul McCartney");

        return pWordProcessingElement;
    } // mAddExtraWordProcessingData()

    /**
     * (non-Javadoc)
     * Adds oracle reports data to the pWordProcessingElement.
     *
     * @param pInsertCOEventRowElement the insert CO event row element
     * @param pWordProcessingElement the word processing element
     * @return the element
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private Element mAddExtraOracleReportData (final Element pInsertCOEventRowElement,
                                               final Element pWordProcessingElement)
        throws BusinessException, SystemException, JDOMException
    {
        XMLOutputter xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
        String sValue = null;
        Element eventElement = null;

        eventElement = new Element ("Event");
        pWordProcessingElement.addContent (eventElement);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/COEventSeq");
        XMLBuilder.add (eventElement, "COEventSeq", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/StandardEventId");
        XMLBuilder.add (eventElement, "StandardEventId", sValue);

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/EventDetails");
        XMLBuilder.add (eventElement, "CompleteEventDetails", sValue);

        if (sValue != null && sValue.length () > 0)
        {
            sValue = sValue.substring (0, sValue.indexOf (":") == -1 ? sValue.length () : sValue.indexOf (":"));
            XMLBuilder.add (eventElement, "EventDetails", sValue);
        }

        sValue = XMLBuilder.getXPathValue (pInsertCOEventRowElement, "/COEvent/CONumber");

        XMLBuilder.add (eventElement, "CONumber", sValue);

        final String coNumber = sValue;
        final String coParams = "<params><param name='coNumber'>" + coNumber + "</param></params>";
        final Element coXml = localServiceProxy.getJDOM (CO_SERVICE, GET_CO, coParams).getRootElement ();
        if (log.isDebugEnabled ())
        {
            xmlOutputter = new XMLOutputter (Format.getPrettyFormat ());
            log.debug ("CO XML : " + xmlOutputter.outputString (coXml));
        }
        // Element coDetails = (Element) XPath.selectSingleNode(coXml, "/ds/MaintainCO/DebtorName");

        final String coDebtorName = XMLBuilder.getXPathValue (coXml, "/ds/MaintainCO/DebtorName");

        XMLBuilder.add (eventElement, "DebtorName", coDebtorName);

        log.debug ("Processed Oracle Call Parameters");

        return pWordProcessingElement;
    } // mAddExtraOracleReportData()

    /**
     * (non-Javadoc)
     * Get an event config data object for the standard event id.
     *
     * @param pSourceElement the source element
     * @return the i co event config DO
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     */
    private ICoEventConfigDO mGetCoEventConfigDO (final Element pSourceElement) throws JDOMException, SystemException
    {
        ICoEventConfigDO coEventConfigDO = null;

        // Extract the Standard Event Id from XML Document.
        final Element standardEventIdElement =
                (Element) XPath.selectSingleNode (pSourceElement, "/COEvent/StandardEventId");
        final String sStandardEventId = standardEventIdElement.getText ();
        final int standardEventId = Integer.parseInt (sStandardEventId);

        // Retrieve the configuration data object associated with the standard Event id.
        final CoEventConfigManager COEventConfigManager = CoEventConfigManager.getInstance ();
        coEventConfigDO = COEventConfigManager.getCoEventConfigDO (standardEventId);

        return coEventConfigDO;
    } // mGetcoEventConfigDO()

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * M insert wp output row.
     *
     * @param coEventNavigationListElement the co event navigation list element
     * @param userId the user id
     * @throws JDOMException the JDOM exception
     * @throws SQLException the SQL exception
     * @throws NamingException the naming exception
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertWpOutputRow (final Element coEventNavigationListElement, final String userId)
        throws JDOMException, SQLException, NamingException, SystemException, BusinessException
    {
        final Element NavigatetoWPElement = (Element) XPath.selectSingleNode (coEventNavigationListElement,
                "/COEventNavigationList/NavigateTo/WordProcessing");

        if (null != NavigatetoWPElement)
        {

            if (NavigatetoWPElement.getText ().equals ("true"))
            {

                final String eventPK = XMLBuilder.getXPathValue (coEventNavigationListElement,
                        "/COEventNavigationList/Params/WordProcessing/Event/COEventSeq");

                Connection conn = null;
                PreparedStatement stmt = null;
                PreparedStatement ps = null;
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
                            int key = 0;
                            stmt = conn.prepareStatement ("SELECT WP_OUTPUT_SEQUENCE.NEXTVAL FROM DUAL");
                            rs = stmt.executeQuery ();
                            if (rs.next ())
                            {
                                key = rs.getInt (1);
                                ps = conn.prepareStatement (
                                        "INSERT INTO WP_OUTPUT (OUTPUT_ID, PDF_SOURCE, DATE_CREATED, PRINTED, CO_EVENT_SEQ, EVENT_SEQ, AE_EVENT_SEQ, FINAL_IND, XMLSOURCE, USER_ID ) values ( ? , empty_blob() , SYSDATE, ?, ?, ? , ?, ? , ?, ?)");
                                ps.setInt (1, key);
                                ps.setString (2, "N");
                                ps.setObject (3, eventPK);
                                ps.setObject (4, null);
                                ps.setObject (5, null);
                                ps.setString (6, "N");
                                ps.setString (7, null);
                                ps.setString (8, userId);
                                ps.executeUpdate ();
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
                    if (ps != null)
                    {
                        ps.close ();
                    }
                    if (stmt != null)
                    {
                        stmt.close ();
                    }
                    if (null != conn && !conn.isClosed ())
                    {
                        conn.close ();
                    }
                }
            }
        }
    } // mInsertWpOutputRow

} // class PostInsertCoEventNavigationCustomProcessor
