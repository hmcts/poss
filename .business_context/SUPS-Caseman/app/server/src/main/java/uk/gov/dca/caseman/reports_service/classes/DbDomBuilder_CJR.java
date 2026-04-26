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
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

/**
 * A specific builder to create a dom as input to a database service.
 * <p>
 * A Builder may be populated with source data over time, prior to generating the output dom.
 * <p>
 * 
 * @author Alex Peterson
 */
public class DbDomBuilder_CJR
{
    
    /** The Constant PARAM_XPATH. */
    private static final String PARAM_XPATH = "/params/param";
    
    /** The Constant CJR_EL_XPATH. */
    private static final String CJR_EL_XPATH = "/params/param[@name='reportRequest']/Report/specificParameters/CJR";

    /**  The generated result dom. */
    private Document dbDom;
    
    /**  Reference to the service input dom, which should be tread as immutable here. */
    private Document inputDom; // input data

    /**
     * Constructor.
     * 
     * @param inputDom The input document.
     */
    public DbDomBuilder_CJR (final Document inputDom)
    {
        this.inputDom = inputDom;
    }

    /**
     * Builds the database document.
     *
     * @return The database document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDom () throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        dbDom = builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input CJR element
        final Element cjrEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), CJR_EL_XPATH);

        // Convert to a List of rows
        final List<Element> deleteRowEls = BuilderUtils.parameterRowsFromGroup (cjrEl);

        final List<Element> rowEls = BuilderUtils.parameterRowsFromGroup (cjrEl);
        final Element insertEl = new Element ("insert_text_items");
        insertEl.addContent (rowEls);

        // Set target output element
        final Element paramEl = (Element) XPath.selectSingleNode (dbDom.getRootElement (), PARAM_XPATH);
        paramEl.addContent (insertEl);

        return dbDom;
    }

    /**
     * Returns a database document document for deleted text items.
     *
     * @return The database document.
     * @throws JDOMException the JDOM exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public Document buildDbDeleteDom () throws JDOMException, IOException
    {
        // create new output dom
        final SAXBuilder builder = new SAXBuilder ();
        dbDom = builder.build (new StringReader ("<params><param name='reportDbUpdate'></param></params>"));

        // Get input CJR element
        final Element cjrEl = (Element) XPath.selectSingleNode (inputDom.getRootElement (), CJR_EL_XPATH);

        // Convert to a List of rows
        final List<Element> deleteRowEls = BuilderUtils.parameterRowsFromGroupForDelete (cjrEl);

        final Element deleteEl = new Element ("delete_text_items");
        deleteEl.addContent (deleteRowEls);

        // Set target output element
        final Element paramEl = (Element) XPath.selectSingleNode (dbDom.getRootElement (), PARAM_XPATH);
        paramEl.addContent (deleteEl);

        return dbDom;
    }
}
