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

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

/**
 * A specific builder to create a dom as input to the custom reports service.
 * <p>
 * A Builder may be populated with source data over time, prior to generating the output dom.
 * <p>
 * 
 * @author Alex Peterson
 */
public class ReportDomBuilder_Custom
{
    
    /** The Constant PARAM_XPATH. */
    private static final String PARAM_XPATH = "/params/param";
    
    /** The Constant REPORT_EL_XPATH. */
    private static final String REPORT_EL_XPATH = "/params/param[@name='reportRequest']/Report";

    /**  The generated report dom. */
    private Document reportDom;
    
    /**  Reference to the service input dom, which should be tread as immutable here. */
    private Document inputDom; // input data

    /**
     * Constructor.
     *
     * @param inputDom the input dom
     */
    public ReportDomBuilder_Custom (final Document inputDom)
    {
        this.inputDom = inputDom;
    }

    /**
     * Returns a report document.
     *
     * @return The report document.
     * @throws JDOMException the JDOM exception
     */
    public Document buildReportDom () throws JDOMException
    {
        // Initial test:
        // Copy original document and remove what's not required:
        reportDom = (Document) inputDom.clone ();

        final Element rootEl = reportDom.getRootElement ();
        final Element reportEl = (Element) XPath.selectSingleNode (rootEl, REPORT_EL_XPATH);

        reportEl.removeChild ("ReportModuleGroup");
        reportEl.removeChild ("View");
        reportEl.removeChild ("Service");

        final Element specificParameterEl = reportEl.getChild ("specificParameters");
        specificParameterEl.removeChild ("CJR");
        specificParameterEl.removeChild ("CO");
        specificParameterEl.removeChild ("AE");

        return reportDom;
    }

}
