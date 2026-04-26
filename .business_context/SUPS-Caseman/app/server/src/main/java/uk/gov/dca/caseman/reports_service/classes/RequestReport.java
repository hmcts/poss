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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Requests a report from an Oracle Reports Server.
 * <p>
 * The database is first updated with both report parameter information and any application data passed in.
 * The framework reporting service is invoked and optionally polled for completion status.
 * An additional capability is provided temporarily to invoke the interim reporting solution instead.
 * <p>
 * Only status results are returned from this service.
 * <p>
 * 
 * @author Alex Peterson
 *
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 */
public class RequestReport extends AbstractComponent implements IGenerator
{
    
    /** The Constant REPORT_EL_XPATH. */
    static final String REPORT_EL_XPATH = "/params/param[@name='reportRequest']/Report";
    
    /** The Constant PARAM_XPATH. */
    static final String PARAM_XPATH = "/params/param";
    
    /** The Constant TEMPLATE_DOC_PARAMS. */
    static final String TEMPLATE_DOC_PARAMS = "<params><param name='reportRequest'></param></params>";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (RequestReport.class);

    /**
     * Constructor.
     */
    public RequestReport ()
    {
    }

    /**
     * {@inheritDoc}
     */
    protected void process () throws BusinessException, SystemException
    {

        /* EXAMPLE INPUT DOM:
         * <params>
         * <param name="reportRequest">
         * <Report>
         * <ReportModule>CM_BMS_ALL.rdf</ReportModule> // specifically named parameters, logic here possible
         * <PrintJobId />
         * <JobId />
         * <CourtCode>111</CourtCode>
         * <CourtUser>Freddie</CourtUser>
         * <ReportModuleGroup>CO</ReportModuleGroup> // [NONE],CJR,CO,AE
         * <View>Yes</View> // [No],Yes,Custom
         * <Service>Framework</Service> // [Framework],Custom
         * <specificParameters>
         * <Parameter name="P_REPORT_START_DATE">04-APR-2005</Parameter> // meta-parameters, passed on directly
         * <Parameter name="P_REPORT_END_DATE">04-JUN-2005</Parameter>
         * <Parameter name="P_SECTION" />
         * <CJR> <CommonParameters/><Parameter/><Parameter/><AppParameter/>... </CJR> // all parameters within groups
         * used for database,
         * <CO> <CommonParameters/><Parameter/><Parameter/><AppParameter/>... </CO> // maybe also used in logic and as
         * report params,
         * <AE> <CommonParameters/><AppParameter/>... </AE> // but only on group basis, not specific module.
         * </specificParameters>
         * </Report>
         * </param>
         * <param name="SUPS.userID">anonymousUser</param>
         * </params> */

        String reportModuleGroup = null; // union of different content: [NONE],CJR,CO,AE

        Document inputDom = null; // original input dom
        Document reportDom = null; // report request submission dom
        Document serviceResultDom = null; // service return value dom

        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getPrettyFormat ());

        final SAXBuilder builder = new SAXBuilder ();

        try
        {

            final String inputParams = m_dataSrc.toString (); // read in the Client Dom

            inputDom = builder.build (new StringReader (inputParams));

            if (log.isDebugEnabled ())
            {
                log.debug ("Incoming XML: " + outputter.outputString (inputDom));
            }

            // Select the main dom elements and basic sanity test
            final Element rootEl = inputDom.getRootElement ();
            final Object reportObject = XPath.selectSingleNode (rootEl, REPORT_EL_XPATH);
            if (reportObject == null || !(reportObject instanceof Element))
            {
                throw new SystemException (
                        "The XPath " + REPORT_EL_XPATH + " did not identify an element in the incoming XML.");
            }
            final Element reportEl = (Element) reportObject;

            // Extract the control parameters:
            reportModuleGroup = reportEl.getChild ("ReportModuleGroup") == null ? null
                    : reportEl.getChild ("ReportModuleGroup").getTextTrim ();
        }
        catch (final IOException e)
        {
            throw new SystemException ("Failed to read input source", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to build JDOM from input source", e);
        }

        log.debug ("Control parameters: " + "reportModuleGroup=" + reportModuleGroup);

        // ---
        // Update database and prepare suitable report request invocation dom:
        // These are separate transactions so any inserts and updates are committed.
        if ("CJR".equals (reportModuleGroup))
        {
            reportDom = prepareCJR (inputDom);
        }
        else if ("CO".equals (reportModuleGroup))
        {
            reportDom = prepareCO (inputDom);
        }
        else if ("AE".equals (reportModuleGroup))
        {
            reportDom = prepareAE (inputDom);
        }
        else
        { // "NONE"
          // no database updates to do for additional report input, assume pre-Release5 style parameters only present
            reportDom = prepareNONE (inputDom);
        }

        if (log.isDebugEnabled ())
        {
            log.debug ("reportDom built: " + outputter.outputString (reportDom));
        }

        String reportModule = null;
        try
        {
            reportModule = ((Element) XPath.selectSingleNode (reportDom.getRootElement (),
                    "/params/param[@name='reportRequest']/Report/ReportModule")).getText ();
            final Element warrantNode = (Element) XPath.selectSingleNode (reportDom.getRootElement (),
                    "/params/param[@name='createWarrantResponse']");
            if (reportModule.equalsIgnoreCase ("NO_OUTPUT") || warrantNode != null)
            {
                log.debug ("Not calling any report module.");
                outputter.setFormat (Format.getRawFormat ());
                outputter.output (reportDom, m_dataSink);
            }
            else
            {
                serviceResultDom = submitReportRequest (reportDom);
                outputter.setFormat (Format.getRawFormat ());
                outputter.output (serviceResultDom, m_dataSink);
            }

        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to return results from service", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to return results from service", e);
        }

    }

    // =========================================================================
    /**
     * Updates database and prepares suitable report request invocation dom for ReportModuleGroup "CJR".
     * <p>
     *
     * @param inputDom the input dom
     * @return reportDom
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document prepareCJR (final Document inputDom) throws BusinessException, SystemException
    {
        // SAXBuilder builder = new SAXBuilder();
        final XMLOutputter outputter = new XMLOutputter ();
        Document dbInsertDom = null;
        Document dbDeleteDom = null;

        // ---
        // Build dom for database update
        String dbInsertParams = null;
        String dbDeleteParams = null;
        try
        {
            final DbDomBuilder_CJR dbDomBuilder = new DbDomBuilder_CJR (inputDom);
            dbInsertDom = dbDomBuilder.buildDbDom ();
            dbDeleteDom = dbDomBuilder.buildDbDeleteDom ();
            outputter.setFormat (Format.getRawFormat ());
            dbInsertParams = outputter.outputString (dbInsertDom);
            dbDeleteParams = outputter.outputString (dbDeleteDom);
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build database dom for CJR", e1);
        }
        catch (final IOException e2)
        {
            throw new SystemException ("Failed to build database dom for CJR", e2);
        }
        if (log.isDebugEnabled ())
        {
            outputter.setFormat (Format.getPrettyFormat ());
            log.debug ("dbDom built for CJR Delete: " + outputter.outputString (dbDeleteDom));
            log.debug ("dbDom built for CJR Insert: " + outputter.outputString (dbInsertDom));
        }
        // ---
        // Database update
        Document dbResultDom = null;
        final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
        dbResultDom = localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "deleteTextItemsLocal", dbDeleteParams);
        dbResultDom = localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "insertTextItemsLocal", dbInsertParams);

        // ---
        // Build dom for report submission, parse dbResultDom for additional data if required
        Document reportDom = null;
        try
        {
            final ReportDomBuilder reportDomBuilder = new ReportDomBuilder (inputDom);
            reportDom = reportDomBuilder.buildReportDom ();
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build report dom for CJR", e1);
        }

        return reportDom;
    }

    /**
     * Updates database and prepares suitable report request invocation dom for ReportModuleGroup "CO".
     * <p>
     *
     * @param inputDom the input dom
     * @return reportDom
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document prepareCO (final Document inputDom) throws BusinessException, SystemException
    {
        // SAXBuilder builder = new SAXBuilder();
        final XMLOutputter outputter = new XMLOutputter ();
        Document dbDomCOEvents = null;
        Document dbInsertDom = null;
        // Document dbDeleteDom = null;
        Element dbDomHearingInsert = null;

        // ---
        // Build dom for database update
        String dbParams = null;
        String dbParamsHearingInsert = null;
        String dbCOEventsParams = null;
        DbDomBuilder_CO dbDomBuilder = null;
        try
        {
            dbDomBuilder = new DbDomBuilder_CO (inputDom);
            dbInsertDom = dbDomBuilder.buildDbDom ();
            outputter.setFormat (Format.getCompactFormat ());
            dbDomHearingInsert = dbDomBuilder.buildHearingDbDom ();
            dbDomCOEvents = dbDomBuilder.buildDbDomOthers ("update_co_events");
            dbParams = outputter.outputString (dbInsertDom);
            if (dbDomHearingInsert != null)
            {
                dbParamsHearingInsert = outputter.outputString (dbDomHearingInsert);
            }
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build database dom for CO", e1);
        }
        catch (final IOException e2)
        {
            throw new SystemException ("Failed to build database dom for CO", e2);
        }
        if (log.isDebugEnabled ())
        {
            outputter.setFormat (Format.getPrettyFormat ());
            log.debug ("dbDom built for CO: " + outputter.outputString (dbInsertDom));
            log.debug ("dbDom built for Hearings table Insert: " + dbParamsHearingInsert);
            log.debug ("dbDom built for CO Events update: " + outputter.outputString (dbDomCOEvents));
        }

        // ---
        // Database update
        Document dbResultDom = null;
        if (dbParamsHearingInsert != null)
        {
            final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
            dbResultDom = localServiceProxy.getJDOM ("ejb/HearingServiceLocal", "addHearingForCoLocal",
                    dbParamsHearingInsert);
            if (log.isDebugEnabled ())
            {
                log.debug ("dbDomResult returned after insert into Hearings Table : " +
                        outputter.outputString (dbResultDom));
            }
        }

        if (dbParamsHearingInsert != null)
        {
            try
            {
                dbDomCOEvents = dbDomBuilder.updateHearingSequence (dbDomCOEvents, dbResultDom);
                if (log.isDebugEnabled ())
                {
                    log.debug ("dbDom built for CO Event Table after Hearing Sequence Update: " +
                            outputter.outputString (dbDomCOEvents));
                }
                dbCOEventsParams = outputter.outputString (dbDomCOEvents);
            }
            catch (final JDOMException e)
            {
                throw new SystemException ("Failed to update database for CO Event Table", e);
            }
        }

        // Create Warrant

        Document createWarrantResponse = null;
        try
        {
            createWarrantResponse = dbDomBuilder.createWarrantifRequired ();
            if (createWarrantResponse != null)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Create Warrant Response For CO : " + outputter.outputString (createWarrantResponse));
                }
                dbDomCOEvents = dbDomBuilder.updateWarrantID (dbDomCOEvents, createWarrantResponse);
                if (log.isDebugEnabled ())
                {
                    log.debug ("dbDom built for CO Event Table after Warrant ID Applied is : " +
                            outputter.outputString (dbDomCOEvents));
                }
                dbCOEventsParams = outputter.outputString (dbDomCOEvents);
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to Create Warrant for CO", e);
        }

        // Create Warrant End

        if (dbParamsHearingInsert != null || createWarrantResponse != null)
        {
            dbCOEventsParams = outputter.outputString (dbDomCOEvents);
            final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
            dbResultDom =
                    localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "updateCoEventsLocal", dbCOEventsParams);
        }

        // ---
        // Database update
        dbResultDom = null;
        final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
        dbResultDom = localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "insertCoTextItemsLocal", dbParams);

        // ---
        // Build dom for report submission, parse dbResultDom for additional data if required
        Document reportDom = null;
        try
        {
            final ReportDomBuilder reportDomBuilder = new ReportDomBuilder (inputDom, createWarrantResponse);
            reportDom = reportDomBuilder.buildReportDom ();
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build report dom for CO", e1);
        }

        return reportDom;
    }

    /**
     * Updates database and prepares suitable report request invocation dom for ReportModuleGroup "AE".
     * <p>
     *
     * @param inputDom the input dom
     * @return reportDom
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document prepareAE (final Document inputDom) throws BusinessException, SystemException
    {
        // SAXBuilder builder = new SAXBuilder();
        final XMLOutputter outputter = new XMLOutputter ();
        Document dbDom = null;
        Document dbDomHearingInsert = null;

        // ---
        // Build dom for database update
        String dbParams = null;
        String dbParamsHearingInsert = null;
        // String dbParamsWarrantInsert = null;
        final DbDomBuilder_AE dbDomBuilder = new DbDomBuilder_AE (inputDom);
        try
        {
            log.debug ("Building DOM for AE Events table");
            dbDom = dbDomBuilder.buildDbDom ("update_ae_events");
            log.debug ("Building DOM for Hearings table");
            dbDomHearingInsert = dbDomBuilder.buildDbDom ("insert_hearing");
            outputter.setFormat (Format.getRawFormat ());
            dbParams = outputter.outputString (dbDom);
            dbParamsHearingInsert = outputter.outputString (dbDomHearingInsert);
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build database dom for AE", e1);
        }
        catch (final IOException e2)
        {
            throw new SystemException ("Failed to build database dom for AE", e2);
        }

        if (log.isDebugEnabled ())
        {
            outputter.setFormat (Format.getPrettyFormat ());
            log.debug ("dbDom built for AE Event Table: " + outputter.outputString (dbDom));
            log.debug ("dbDom built for Hearings table Insert: " + outputter.outputString (dbDomHearingInsert));
        }

        // ---
        // Database update
        Document dbResultDom = null;
        if (dbParamsHearingInsert != null)
        {
            final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
            dbResultDom =
                    localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "insertHearingLocal", dbParamsHearingInsert);
            if (log.isDebugEnabled ())
            {
                log.debug ("dbDomResult returned after insert into Hearings Table : " +
                        outputter.outputString (dbResultDom));
            }
        }

        // replace hrg_seq for storage in AE_Events table
        if (dbParamsHearingInsert != null)
        {
            try
            {
                dbDom = dbDomBuilder.updateHearingSequence (dbDom, dbResultDom);
                if (log.isDebugEnabled ())
                {
                    log.debug ("dbDom built for AE Event Table after Hearing Sequence Update: " +
                            outputter.outputString (dbDom));
                }
                dbParams = outputter.outputString (dbDom);
            }
            catch (final JDOMException e)
            {
                throw new SystemException ("Failed to update database for AE Event Table", e);
            }
        }
        Document createWarrantResponse = null;
        try
        {
            createWarrantResponse = dbDomBuilder.createWarrantifRequired ();
            if (createWarrantResponse != null)
            {
                if (log.isDebugEnabled ())
                {
                    log.debug ("Create Warrant Response : " + outputter.outputString (createWarrantResponse));
                }
                dbDom = dbDomBuilder.updateWarrantID (dbDom, createWarrantResponse);
                if (log.isDebugEnabled ())
                {
                    log.debug ("dbDom built for AE Event Table after Warrant ID Applied is : " +
                            outputter.outputString (dbDom));
                }
                dbParams = outputter.outputString (dbDom);
            }

            dbResultDom = null;
            final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
            dbResultDom = localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "updateAeEventsLocal", dbParams);
        }
        catch (final BusinessException e)
        {
            throw new SystemException ("Failed to update database for AE Event Table", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Failed to update database for AE Event Table", e);
        }

        // ---
        // Build dom for report submission, parse dbResultDom for additional data if required
        Document reportDom = null;
        try
        {
            final ReportDomBuilder reportDomBuilder = new ReportDomBuilder (inputDom, createWarrantResponse);
            reportDom = reportDomBuilder.buildReportDom ();
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build report dom for AE", e1);
        }

        return reportDom;
    }

    /**
     * Updates database and prepares suitable report request invocation dom for ReportModuleGroup "NONE".
     * <p>
     *
     * @param inputDom the input dom
     * @return reportDom
     * @throws SystemException the system exception
     */
    private Document prepareNONE (final Document inputDom) throws SystemException
    {
        // SAXBuilder builder = new SAXBuilder();
        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getRawFormat ());

        // No database update required.

        // ---
        // Build dom for report submission
        Document reportDom = null;
        try
        {
            final ReportDomBuilder reportDomBuilder = new ReportDomBuilder (inputDom);
            reportDom = reportDomBuilder.buildReportDom ();
        }
        catch (final JDOMException e1)
        {
            throw new SystemException ("Failed to build report dom for NONE", e1);
        }

        return reportDom;
    }

    /**
     * (non-Javadoc)
     * Call the framework reports service.
     *
     * @param reportDom the report dom
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document submitReportRequest (final Document reportDom) throws BusinessException, SystemException
    {

        Document serviceResultDom = null;
        final XMLOutputter outputter = new XMLOutputter ();
        outputter.setFormat (Format.getRawFormat ());
        final String reportString = outputter.outputString (reportDom);

        final SupsLocalServiceProxy localServiceProxy = new SupsLocalServiceProxy ();
        serviceResultDom = localServiceProxy.getJDOM ("ejb/ReportsServiceLocal", "runReportLocal", reportString);

        if (serviceResultDom == null)
        {
            throw new SystemException ("Error calling Oracle Report service : ");
        }

        log.trace ("Returned from Reporting Service");

        return serviceResultDom;
    }

    // =========================================================================
    // General helpers

    /**
     * Helper to read an external file into a String.
     *
     * @param fileName The file name.
     * @return The external xml string.
     * @throws SystemException the system exception
     */
    public String getExternalXml (final String fileName) throws SystemException
    {
        InputStream fileIs = null;
        final URL fileUrl = null;
        String fileContent = "";

        try
        {
            fileIs = this.getClass ().getResourceAsStream (fileName);
            // pathname of file in running jar as found by class loader

            final BufferedReader in = new BufferedReader (new InputStreamReader (fileIs));
            String line = null;
            final StringBuffer buffer = new StringBuffer ();
            while ((line = in.readLine ()) != null)
            {
                buffer.append (line);
            }
            fileContent = buffer.toString ();
        }
        catch (final IOException e)
        {
            throw new SystemException ("Failed to read test file:" + fileName, e);
        }

        return fileContent;
    }

    // =========================================================================
    // Framework callbacks

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
    }

    /**
     * (non-Javadoc).
     *
     * @param processingInstructions the processing instructions
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element,
     *      java.util.Map)
     */
    public void preloadCache (final Element processingInstructions, final Map<String, Object> preloadCache)
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param config the config
     * @param preloadCache the preload cache
     * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element,
     *      java.util.Map)
     */
    public void prepare (final Element config, final Map<String, Object> preloadCache)
    {
    }
}