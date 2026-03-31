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
package uk.gov.dca.caseman.ae_event_service.java;

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

import uk.gov.dca.caseman.ae_service.java.AeDefs;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: CoEvent Method: insertCoEventsAuto Class:
 * InsertAutoCoEventsCustomProcessor.java @author Chris Hutt
 * 
 * Created:
 * 18 Aug 2005
 * 
 * Description:
 * This CustomProcessor class provides a facility for the creation of 'AUTO'
 * AE_EVENTS. A pipeline process document will be perused for a //AEEvents node.
 * Any child nodes will be submitted to the appropriate insert AE_EVENT service.
 * The AeEventUpdateHelper class will then be used to perform any updates
 * associated with the standard event.
 * 
 * Change History
 * 
 * 16/11/05 Chris Hutt: BMS - now depends on AeEventId
 * 21/11/05 Chris Hutt: CaseEventSeq and AeEventSeq returned in DOM
 * 21/11/05 Chris Hutt: Navigation code retrofitted from Reports development branch
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 10/07/2006 Chris Hutt TD3870: no case event if ae is a mags order type.
 * 25/07/2006 Paul Roberts: Change to logging.
 * 
 * 1 Dec 2006 Chris Hutt
 * Defects UCT838/839: Requirement to update AE_APPLICATIONS and generate an AeEvent.
 * This has involved including this custom processor in the pipeline. Since the //AEEvents node
 * may not be present in the dom a test for null has been added.
 * 
 * @author Chris Hutt
 */
public class InsertAutoAeEventsCustomProcessor implements ICustomProcessor
{
    
    /**  Local Service Proxy used to call other local services. */
    private final AbstractSupsServiceProxy localServiceProxy;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (InsertAutoAeEventsCustomProcessor.class);

    /**
     * Constructor.
     */
    public InsertAutoAeEventsCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        Element parentElement = null;
        Element bmsAeEventElement = null;
        Element aeEventNavigationListElement = null;
        String aEEventSeq = null;
        String caseEventSeq = null;
        String sXml = null;
        boolean navRequired = false;
        AeEventUpdateHelper aeEventUpdateHelper = null;
        XMLOutputter xmlOutputter = null;
        String aeNumber = null;
        String aeType = null;

        try
        {

            parentElement = (Element) XPath.selectSingleNode (params, "//AEEvents");
            aeEventUpdateHelper = new AeEventUpdateHelper ();
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());

            if (null != parentElement)
            {

                // Loop through each ae event submitted for creation
                final List<Element> aeEventList = parentElement.getChildren ("AEEvent");
                Element aeEventElement = null;

                final Iterator<Element> it = aeEventList.iterator ();
                while (it.hasNext ())
                {

                    // Now we have the AE Event.
                    aeEventElement = (Element) it.next ();

                    // If no aeType is defined then go and get it from the associated AE
                    // (it means the first event is being processed)
                    if (aeType == null)
                    {
                        aeNumber = aeEventElement.getChildText ("AENumber");
                        aeType = this.mGetAeType (aeNumber);
                    }

                    // If a mags order type of AE then no case event should be created
                    if (aeType.equals ("MG"))
                    {

                        // Insert a row in AE_EVENTS
                        aEEventSeq = mInsertAeEventRow (aeEventElement);

                    }
                    else
                    {

                        // Get the BMS details before Case Event insert is done
                        bmsAeEventElement = mGetAeEventBMS (aeEventElement);

                        // Insert a row in CASE_EVENTS (if appropriate)
                        caseEventSeq = mInsertCaseEventRow (bmsAeEventElement);

                        bmsAeEventElement.getChild ("CaseEventSeq").setText (caseEventSeq);

                        // Insert a row in AE_EVENTS
                        aEEventSeq = mInsertAeEventRow (bmsAeEventElement);

                    }

                    aeEventElement.getChild ("AEEventSeq").setText (aEEventSeq);

                    if ( !navRequired)
                    {
                        aeEventNavigationListElement = aeEventUpdateHelper.getAutoEventNavigation (aeEventElement);
                        if (aeEventNavigationListElement != null)
                        {
                            navRequired = true;
                            // Output the navigation XML
                            sXml = xmlOutputter.outputString (aeEventNavigationListElement);
                        }
                    }

                }
            }

            if (sXml == null)
            {
                // Output the original XML
                sXml = xmlOutputter.outputString (params.getRootElement ());
            }
            log.debug ("InsertAutoAeEventsCustomProcessor Response: " + sXml);
            writer.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Call service to get event BMS.
     *
     * @param pAeEventElement the ae event element
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element mGetAeEventBMS (final Element pAeEventElement) throws SystemException, BusinessException
    {
        XMLOutputter out = null;
        Element paramsElement = null;
        Element bmsAeEventRowElement = null;
        Element aeEventElement = null;
        Element resultElement = null;

        try
        {
            aeEventElement = (Element) pAeEventElement.clone ();
            aeEventElement.detach ();

            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "AEEvent", aeEventElement);

            out = new XMLOutputter (Format.getCompactFormat ());

            final String sXmlParams = out.outputString (paramsElement);

            resultElement = localServiceProxy
                    .getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.GET_AE_EVENT_BMS, sXmlParams).getRootElement ();

            bmsAeEventRowElement = (Element) XPath.selectSingleNode (resultElement, "//AEEvent");
            bmsAeEventRowElement.detach ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return bmsAeEventRowElement;
    } // mGetAeEventBMS()

    /**
     * (non-Javadoc)
     * Call service to insert AE event row.
     *
     * @param pAeEventElement the ae event element
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mInsertAeEventRow (final Element pAeEventElement) throws SystemException, BusinessException
    {
        XMLOutputter out = null;
        Element paramsElement = null;
        Element insertAeEventRowElement = null;
        Element aeEventElement = null;
        String aEEventSeq = null;

        aeEventElement = (Element) pAeEventElement.clone ();
        aeEventElement.detach ();

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "aeEvent", aeEventElement);

        out = new XMLOutputter (Format.getCompactFormat ());

        final String sXmlParams = out.outputString (paramsElement);

        insertAeEventRowElement = localServiceProxy
                .getJDOM (AeEventDefs.AE_EVENT_SERVICE, AeEventDefs.INSERT_AE_EVENT_ROW_AUTO, sXmlParams)
                .getRootElement ();

        aEEventSeq = insertAeEventRowElement.getChildText ("AEEventSeq");

        return aEEventSeq;
    } // mInsertAeEventRow()

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * (non-Javadoc)
     * Insert a case event associated with the ae event.
     *
     * @param pAeEventElement The ae event element
     * @return The case event seq
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String mInsertCaseEventRow (final Element pAeEventElement) throws BusinessException, SystemException
    {
        AeEventUpdateHelper aeEventUpdateHelper = null;
        String caseEventSeq = null;

        try
        {
            aeEventUpdateHelper = new AeEventUpdateHelper ();

            caseEventSeq = aeEventUpdateHelper.InsertCaseEventonAeEventInsert (pAeEventElement);

            // update the doc with the caseeventSeq
            pAeEventElement.getChild ("CaseEventSeq").setText (caseEventSeq);
            // Document doc = new Document();
            // doc.setRootElement(pAeEventElement);
            // XMLBuilder.setXPathValue(doc.getRootElement(), "/AEEvent/CaseEventSeq", caseEventSeq ) ;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return caseEventSeq;
    }

    /**
     * (non-Javadoc)
     * Call service to get the AE event type.
     *
     * @param pAeNumber the ae number
     * @return the string
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private String mGetAeType (final String pAeNumber) throws SystemException, BusinessException
    {
        XMLOutputter out = null;
        Element paramsElement = null;
        Element aeElement = null;
        String aeType = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "aeNumber", pAeNumber);

            out = new XMLOutputter (Format.getCompactFormat ());

            final String sXmlParams = out.outputString (paramsElement);

            aeElement = localServiceProxy.getJDOM (AeDefs.AE_SERVICE, AeDefs.GET_AE_TYPE, sXmlParams).getRootElement ();

            aeType = ((Element) XPath.selectSingleNode (aeElement, "/ds/Ae/AEType")).getText ();

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return aeType;
    } // mInsertAeEventRow()

}