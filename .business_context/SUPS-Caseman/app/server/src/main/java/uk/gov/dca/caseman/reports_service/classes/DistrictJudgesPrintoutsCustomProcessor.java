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
 * Service: Reports Method: RunDistrictJudgesPrintouts
 * Class: DistrictJudgesPrintoutsCustomProcessor.java
 * 
 * @author Chris Hutt
 *         Created: 7-Oct-2005
 * 
 *         Description: Runs the District Judges Printouts (Case Maintenance Menu/District Judges Printouts)
 * 
 *         Change History:
 *         16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class DistrictJudgesPrintoutsCustomProcessor implements ICustomProcessor
{

    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;

    /** The out. */
    private final XMLOutputter out;

    /** The Constant CASE_SERVICE. */
    // Services.
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant GET_DEF_COUNT. */
    private static final String GET_DEF_COUNT = "getDefCountLocal";

    /** The Constant REPORTS_SERVICE. */
    private static final String REPORTS_SERVICE = "ejb/ReportsServiceLocal";
    
    /** The Constant REQUEST_REPORT. */
    private static final String REQUEST_REPORT = "requestReportLocal";

    /** The count of defendants path. */
    private final XPath countOfDefendantsPath;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public DistrictJudgesPrintoutsCustomProcessor () throws JDOMException
    {
        localServiceProxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getPrettyFormat ());

        countOfDefendantsPath = XPath.newInstance ("/ds/Case/NumberOfDefendants");
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

        Element caseElement = null;
        String caseNumber = null;

        String adminCourtCode = null;

        RequestReportXMLBuilder requestReportBuilder = null;
        final Element RequestReportElement = null;
        final Element paramsElement = null;

        Element casesElement = null;
        String userId = null;
        String courtId = null;

        List<Element> caseList = null;

        try
        {

            casesElement = (Element) XPath.selectSingleNode (params, "/params/param[@name='CM_DJ_PrintOuts']/Cases");

            userId = ((Element) XPath.selectSingleNode (params, "params/param[@name='userId']")).getText ();
            courtId = ((Element) XPath.selectSingleNode (params, "params/param[@name='courtId']")).getText ();

            XMLOutputter xmlOutputter = null;
            String sXml = null;
            final int defendantCount = 0;

            // Create to requestReportBuilder (a object holding params which can be easily
            // converted into XML for submission to report service) and load with common properties
            requestReportBuilder = new RequestReportXMLBuilder ("", // String pReportModule
                    "", // String pPrintJobId
                    "", // String pJobId
                    courtId, // String pCourtCode
                    userId // String pCourtUser
            );

            // Loop through Cases
            caseList = casesElement.getChildren ("Case");

            final Iterator<Element> it = caseList.iterator ();
            while (it.hasNext ())
            {

                // Now we have the Case.
                caseElement = (Element) it.next ();

                // get the case number and admin court code
                caseNumber = caseElement.getChildText ("CaseNumber");
                adminCourtCode = caseElement.getChildText ("AdminCourtCode");

                // Add case to the RequestReportXMLBuilder object
                requestReportBuilder.addSpecificParameter ("P_CASE_NUMBER", caseNumber);

                // CR080 indicates that we should run CM_DJ_1, CM_DJ_2 and CM_DJ_5 only regardless of the number of
                // defendants
                mRunReport ("CM_DJ_1.rdf", requestReportBuilder);
                mRunReport ("CM_DJ_2.rdf", requestReportBuilder);
                mRunReport ("CM_DJ_5.rdf", requestReportBuilder);
            }

            /* Framework dictates that something must be returned to the client */
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

    /**
     * (non-Javadoc)
     * Runs Report.
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

        pRequestReportXMLBuilder.setReportModule (pReport);
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