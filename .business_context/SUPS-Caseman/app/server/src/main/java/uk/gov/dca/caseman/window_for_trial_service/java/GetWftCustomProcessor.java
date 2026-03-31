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
package uk.gov.dca.caseman.window_for_trial_service.java;

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

import uk.gov.dca.caseman.case_service.java.CaseDefs;
import uk.gov.dca.caseman.common.java.PartyKeyXMLTransformer;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 03-Feb-2005
 *
 * Change History:
 * 17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author Chris Hutt
 */
public class GetWftCustomProcessor implements ICustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;
    
    /** The case number param X path. */
    private final XPath caseNumberParamXPath;

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (GetWftCustomProcessor.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public GetWftCustomProcessor () throws JDOMException
    {
        caseNumberParamXPath = XPath.newInstance (WftDefs.CASE_NUMBER_PARAM_XPATH);

        proxy = new SupsLocalServiceProxy ();
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        Element sumResult = null;
        Element wftResult = null;
        Element maintainWftElement = null;
        Element eventElement = null;
        Element eventSeqElement = null;
        Element eventDetailsElement = null;
        Element input = null;
        Element output = null;
        String caseNumberParams = null;

        try
        {

            input = (Element) caseNumberParamXPath.selectSingleNode (params);
            final String caseNumber = input.getText ();
            caseNumberParams = buildXMLParams (caseNumber);

            if ( !isEmpty (caseNumber))
            {

                output = new Element ("ds");
                maintainWftElement = new Element ("MaintainWindowForTrial");

                // add empty event node structure to the dom. On the update this will be used to
                // update the event details row for the specified eventId.
                // ----------------------------------------------------------------------------

                eventElement = new Element ("CaseEvent");
                eventSeqElement = new Element ("CaseEventSeq");
                eventDetailsElement = new Element ("EventDetails");
                eventElement.addContent (eventSeqElement);
                eventElement.addContent (eventDetailsElement);
                maintainWftElement.addContent (eventElement);

                // get the Windows For Trial for the case
                // --------------------------------------
                wftResult =
                        proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.GET_CASE_WFTS, caseNumberParams).getRootElement ();
                maintainWftElement.addContent (((Element) wftResult.clone ()).detach ());

                // get the case summary
                // ---------------------
                sumResult = proxy.getJDOM (CaseDefs.CASE_SERVICE, CaseDefs.GET_CASE_SUMMARY, caseNumberParams)
                        .getRootElement ();

                // Add the SubjectPartyKey to each <Party>
                PartyKeyXMLTransformer.addPartyKey (/* Element element */sumResult,
                        /* String pPartyRoleCodeElementName */"PartyRoleCode",
                        /* String pCasePartyNumberElementName */"CasePartyNumber",
                        /* String pNewPartyKeyElementName */"SubjectPartyKey");

                maintainWftElement.addContent (((Element) sumResult.clone ()).detach ());

                output.addContent (((Element) maintainWftElement.clone ()).detach ());

                // Complete updates to elements not finalised by the database retrieval
                // -------------------------------------------------------------------
                wftXMLTransform (output);
            }

            final String s = getXMLString (output);
            log.debug ("GetWft Response: " + s);
            writer.write (s);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }

        return;
    }

    /**
     * (non-Javadoc)
     * Transform WFT XML.
     *
     * @param pElement the element
     * @throws JDOMException the JDOM exception
     */
    private void wftXMLTransform (final Element pElement) throws JDOMException
    {
        Element wftElement = null;
        Element dateElement = null;
        Document doc = null;

        /* Update <ExcludedDatesGenerated>
         * Update <StartAndEndDateSet>
         * Update <Excluded> for each <Date> */

        doc = new Document ();
        doc.setRootElement (pElement);

        final XPath wftXPath = XPath.newInstance (WftDefs.WFT_XPATH);
        final XPath datesXPath = XPath.newInstance (WftDefs.WFT_DATE_EXCLUDED_XPATH);

        // Get all WindowForTrial elements
        final List<Element> wftList = wftXPath.selectNodes (doc);

        final Iterator<Element> it = wftList.iterator ();
        while (it.hasNext ())
        {
            wftElement = (Element) it.next ();

            // 1. Update <ExcludedDatesGenerated> tag
            setChildText (wftElement, "ExcludedDatesGenerated", WftDefs.FALSE);

            // 2. Update <StartAndEndDatesSet> tag
            String startandEndDatesSetText = WftDefs.FALSE;

            final String sDate = getChildText (wftElement, "StartDate");
            if ( !isEmpty (sDate))
            {
                final String eDate = getChildText (wftElement, "EndDate");
                if ( !isEmpty (eDate))
                {
                    startandEndDatesSetText = WftDefs.TRUE;
                }
            }
            setChildText (wftElement, "StartAndEndDatesSet", startandEndDatesSetText);

            // 3. Set <Status> to EXISTING
            setChildText (wftElement, "Status", "EXISTING");

        }

        // 3. Update <Excluded> for each <Date>
        final List<Element> exclDateList = datesXPath.selectNodes (doc);
        final Iterator<Element> dit = exclDateList.iterator ();
        while (dit.hasNext ())
        {
            dateElement = (Element) dit.next ();
            setChildText (dateElement, "Excluded", WftDefs.TRUE);
        }
    }

    /**
     * Gets the child text.
     *
     * @param pElement the element
     * @param pChildElementName the child element name
     * @return the child text
     */
    private String getChildText (final Element pElement, final String pChildElementName)
    {

        return pElement.getChild (pChildElementName).getText ();

    }

    /**
     * Sets the child text.
     *
     * @param pElement the element
     * @param pChildElementName the child element name
     * @param pText the text
     */
    private void setChildText (final Element pElement, final String pChildElementName, final String pText)
    {
        pElement.getChild (pChildElementName).setText (pText);
    }

    /**
     * (non-Javadoc)
     * Build params element with caseNumber.
     *
     * @param pContent the content
     * @return the string
     */
    private String buildXMLParams (final String pContent)
    {

        final Element rootElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (rootElement, "caseNumber", pContent);
        return getXMLString (rootElement);
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
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
