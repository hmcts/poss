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

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * A specific builder to create a dom as input to the framework reports service.
 * <p>
 * A Builder may be populated with source data over time, prior to generating the output dom.
 * <p>
 * 
 * @author Alex Peterson
 */
public class ReportDomBuilder
{
    
    /** The Constant PARAMS_XPATH. */
    private static final String PARAMS_XPATH = "/params";
    
    /** The Constant REPORT_EL_XPATH. */
    private static final String REPORT_EL_XPATH = "/params/param[@name='reportRequest']/Report";
    
    /** The Constant AE_EL_XPATH. */
    private static final String AE_EL_XPATH =
            "/params/param[@name='reportRequest']/Report/specificParameters/AE/CommonParameters/Column[@name='ISSUE_STAGE']";
    
    /** The Constant WARRANT_RESPONSE_XPATH. */
    private static final String WARRANT_RESPONSE_XPATH = "/params/param[@name='WarrantNumber']";

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ReportDomBuilder.class);
    
    /**  The generated report dom. */
    private Document reportDom;
    
    /**  Reference to the service input dom, which should be tread as immutable here. */
    private Document inputDom; // input data
    
    /** The create warrant response. */
    private Document createWarrantResponse;

    /**
     * Constructor.
     * 
     * @param inputDom The input document.
     */
    public ReportDomBuilder (final Document inputDom)
    {
        this.inputDom = inputDom;
    }

    /**
     * Constructor.
     * 
     * @param inputDom The input document.
     * @param createWarrantResponse The create warrant response document.
     */
    public ReportDomBuilder (final Document inputDom, final Document createWarrantResponse)
    {
        this.inputDom = inputDom;
        this.createWarrantResponse = createWarrantResponse;
    }

    /**
     * Builds a report document.
     *
     * @return The report document.
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     */
    public Document buildReportDom () throws JDOMException, SystemException
    {
        // Initial test:
        // Copy original document and remove what's not required:
        reportDom = (Document) inputDom.clone ();

        final Element rootEl = reportDom.getRootElement ();
        final Element reportEl = (Element) XPath.selectSingleNode (rootEl, REPORT_EL_XPATH);

        // reportEl.removeChild("ReportModuleGroup");
        reportEl.removeChild ("View");
        reportEl.removeChild ("Service");

        final Element specificParameterEl = reportEl.getChild ("specificParameters");
        specificParameterEl.removeChild ("CJR");
        specificParameterEl.removeChild ("CO");
        specificParameterEl.removeChild ("AE");

        // Check if there are any '*' character in content of reportName tag.
        // This char must get replaced by I, R or S after checking with AE Events service.
        reportDom = issueReissueCheck ();

        if (createWarrantResponse != null)
        {
            final Element paramsElement = (Element) XPath.selectSingleNode (rootEl, PARAMS_XPATH);
            final Element warrantNumberElement =
                    (Element) XPath.selectSingleNode (createWarrantResponse, WARRANT_RESPONSE_XPATH);
            XMLBuilder.addParam (paramsElement, "createWarrantResponse", warrantNumberElement.getText ());
        }

        return reportDom;
    }

    /**
     * (non-Javadoc)
     * Based on issue stage change text of modules element.
     *
     * @return the document
     * @throws JDOMException the JDOM exception
     * @throws SystemException the system exception
     */
    private Document issueReissueCheck () throws JDOMException, SystemException
    {

        final Element rootEl = reportDom.getRootElement ();
        final Element reportEl = (Element) XPath.selectSingleNode (rootEl, REPORT_EL_XPATH);
        final Element modulesEl = reportEl.getChild ("ReportModule");
        String modules = modulesEl.getText ();
        log.debug ("Modules are : " + modules);
        if (modules.indexOf ("*") != -1)
        {
            final Element issueStageEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), AE_EL_XPATH);
            final String issueStage = issueStageEl.getText ();
            log.debug ("Issue Stage passed is : " + issueStage);
            if (issueStage.equals ("ISS"))
            {
                modules = modules.replace ('*', 'I');
            }
            else if (issueStage.equals ("R/I"))
            {
                modules = modules.replace ('*', 'R');
            }
            else if (issueStage.equals ("S/S"))
            {
                modules = modules.replace ('*', 'S');
            }
            else
            {
                throw new SystemException ("Illegal Issue Stage passed.");
            }
            modules = modules.replace ('*', 'I');
            modulesEl.setText (modules);
            if (log.isDebugEnabled ())
            {
                final XMLOutputter outputter = new XMLOutputter ();
                outputter.setFormat (Format.getPrettyFormat ());
                log.debug ("Report DOM after IssueStage replacement : " + outputter.outputString (reportDom));
            }
        }
        return reportDom;
    }

}
