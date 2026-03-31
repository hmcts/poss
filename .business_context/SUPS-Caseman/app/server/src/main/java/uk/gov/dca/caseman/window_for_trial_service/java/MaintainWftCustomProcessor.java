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

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: WindowForTrial
 * Method: maintainWft
 * Class: MaintainWftCustomProcessor.java
 * Author: Chris Hutt
 * Created: 03-Feb-2005
 * Description:
 * 
 * Change History:
 * 23-Mar-2006 Phil Haferer (EDS): Added mUpdateWftExclusionDates() and related methods, in response to
 * TD 2585: "WFT Excluded Dates removed when WFT record not updated".
 * 17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 */
public class MaintainWftCustomProcessor extends AbstractCustomProcessor
{
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;
    
    /** The wft service max wft id param path. */
    private final XPath wftServiceMaxWftIdParamPath;
    
    /** The wft window for trial path. */
    private final XPath wftWindowForTrialPath;
    
    /** The wft case event path. */
    private final XPath wftCaseEventPath;
    
    /** The wft case event seq path. */
    private final XPath wftCaseEventSeqPath;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (MaintainWftCustomProcessor.class);
    
    /** The case number. */
    String caseNumber = null;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public MaintainWftCustomProcessor () throws JDOMException
    {

        wftWindowForTrialPath = XPath.newInstance (WftDefs.WFT_XPATH);
        wftServiceMaxWftIdParamPath = XPath.newInstance (WftDefs.WFT_MAXWFTID_XPATH);
        // wftCaseEventPath = XPath.newInstance(WftDefs.WFT_CASEEVENTID_XPATH);
        wftCaseEventPath = XPath.newInstance (WftDefs.WFT_CASEEVENT_XPATH);
        wftCaseEventSeqPath = XPath.newInstance (WftDefs.WFT_CASEEVENTSEQ_XPATH);

        proxy = new SupsLocalServiceProxy ();

        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * (non-Javadoc).
     *
     * @param pNewWftDoc the new wft doc
     * @param pWriter the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.AbstractCustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document pNewWftDoc, final Writer pWriter, final Log pLog)
        throws BusinessException, SystemException
    {
        Element wftResultElement = null;
        Element wftElement = null;
        Element caseEventElement = null;
        final Element wftsFilteredElement = null;
        Element updCaseEventElement = null;

        String wftStatus = null;
        String wftParams = null;
        final String caseEventId = null;
        String caseEventSeq = null;

        int prevMax = 0;

        try
        {
            // Initialise the Element to submit to the update service
            // This will hold all the WFTs with a status of NEW or UPDATED
            initWftXML (wftsFilteredElement);

            // Get all WindowForTrial elements
            final List<Element> wftList = wftWindowForTrialPath.selectNodes (pNewWftDoc);

            // Iterate through supplied Windows For Trial
            // adding a wft_id to all with a Status of NEW
            final Iterator<Element> it = wftList.iterator ();
            while (it.hasNext ())
            {

                wftElement = (Element) it.next ();

                if (isEmpty (caseNumber))
                {
                    caseNumber = wftElement.getChild ("CaseNumber").getText ();
                }

                // Determine whether this is a new Window For Trial
                wftStatus = wftElement.getChild ("Status").getText ();
                if (isEmpty (wftStatus) || "NEW".equals (wftStatus))
                {
                    prevMax = addWftId (wftElement, prevMax);
                }
            }

            // now call the service which will persist the filterd WFTs
            wftParams = getXMLString (pNewWftDoc.getRootElement ());

            wftResultElement = proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.MAINTAIN_WFT, wftParams).getRootElement ();
            mUpdateWftExclusionDates (wftResultElement);

            // Update the CaseEvent's details
            caseEventElement = (Element) wftCaseEventPath.selectSingleNode (pNewWftDoc);

            if (null != caseEventElement)
            {
                caseEventSeq = caseEventElement.getChild ("CaseEventSeq").getText ();
                if ( !isEmpty (caseEventSeq))
                {
                    caseEventElement = (Element) caseEventElement.detach ();
                    updCaseEventElement = XMLBuilder.getNewParamsElement ();
                    XMLBuilder.addParam (updCaseEventElement, "caseEventSeq", caseEventElement);
                    wftResultElement = proxy.getJDOM (CaseEventDefs.CASEEVENT_SERVICE, CaseEventDefs.UPD_CASEEVENT,
                            getXMLString (updCaseEventElement)).getRootElement ();
                }
            }

            // Finally perform a getWft
            wftParams = buildXMLParams ("caseNumber", caseNumber);
            wftResultElement = proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.GET_WFT, wftParams).getRootElement ();

            final String s = getXMLString (wftResultElement);
            log.debug ("MaintainWft Response: " + s);
            pWriter.write (s);

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
     * create wft xml.
     *
     * @param pWftFilterElement the wft filter element
     */
    private void initWftXML (Element pWftFilterElement)
    {
        pWftFilterElement = new Element ("ds");
        final Element maintWftElement = new Element ("MaintainWindowForTrial");
        final Element wftsElement = new Element ("WindowsForTrial");
        maintWftElement.addContent (wftsElement);
        pWftFilterElement.addContent (((Element) maintWftElement.clone ()).detach ());
    }

    /**
     * Adds the to wft XML.
     */
    private void addToWftXML ()
    {

    }

    /**
     * (non-Javadoc)
     * 
     * PJR - Not a sequence?.
     *
     * @param pWftElement the wft element
     * @param pPrevMax the prev max
     * @return the int
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     */
    private int addWftId (final Element pWftElement, final int pPrevMax)
        throws BusinessException, SystemException, JDOMException
    {

        final Element caseNumberParamElement = null;
        Element wftResultElement = null;
        Element wftMaxIdElement = null;
        final Element wftIdElement = null;
        String wftParams = null;
        String wftMaxId = null;

        int newWftId = 0;

        if (pPrevMax == 0)
        {
            // get the current max wft_id with a case
            wftParams = buildXMLParams ("caseNumber", caseNumber);
            wftResultElement = proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.GET_MAX_WFT, wftParams).getRootElement ();
            wftMaxIdElement = (Element) wftServiceMaxWftIdParamPath.selectSingleNode (wftResultElement);

            // calculate the wft_id to be used for the insert depending on result returned
            wftMaxId = wftMaxIdElement.getText ();
            if (isEmpty (wftMaxId))
            {
                newWftId = 1;
            }
            else
            {
                newWftId = Integer.parseInt (wftMaxId) + 1;
            }
        }
        else
        {
            newWftId = pPrevMax + 1;

        }

        pWftElement.getChild ("WFTId").setText (String.valueOf (newWftId));

        return newWftId;
    }

    /**
     * Adds an element to a params element.
     *
     * @param pName the name
     * @param pContent the content
     * @return the string
     */
    private String buildXMLParams (final String pName, final String pContent)
    {

        final Element rootElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (rootElement, pName, pContent);
        return getXMLString (rootElement);
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

    /**
     * Handles the update of the WFT_EXCLUSIONS rows.
     * For each WINDOW_FOR_TRAIL all the associated WFT_EXCLUSIONS rows are first deleted, and then the
     * currently required rows are re-inserted.
     * (This used to be possible all in one service, but the framework was changed to register deletes
     * and perform them after all the inserts/updates, which destroyed this functionality).
     *
     * @param pDsElement the ds element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mUpdateWftExclusionDates (final Element pDsElement) throws SystemException, BusinessException
    {
        Element maintainWindowForTrialElement = null;
        Element windowsForTrialElement = null;
        List<Element> windowsForTrialElementList = null;
        Element windowForTrailElement = null;

        maintainWindowForTrialElement = pDsElement.getChild ("MaintainWindowForTrial");
        windowsForTrialElement = maintainWindowForTrialElement.getChild ("WindowsForTrial");

        windowsForTrialElementList = windowsForTrialElement.getChildren ();

        // Iterate through the list of Window For Trials, handling the Dates for each one.
        for (Iterator<Element> i = windowsForTrialElementList.iterator (); i.hasNext ();)
        {
            windowForTrailElement = (Element) i.next ();
            mProcessWindowForTrail (windowForTrailElement);
        } // for(Iterator i = ...
    } // mUpdateWftExclusionDates()

    /**
     * Process window for trial.
     *
     * @param windowForTrailElement the window for trail element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mProcessWindowForTrail (final Element windowForTrailElement) throws SystemException, BusinessException
    {
        String caseNumber = null;
        String wftId = null;
        Element datesElement = null;
        List<Element> datesElementList = null;
        Element dateElement = null;
        String exclusionDate = null;

        caseNumber = windowForTrailElement.getChild ("CaseNumber").getText ();
        wftId = windowForTrailElement.getChild ("WFTId").getText ();
        mDeleteWftExclusions (caseNumber, wftId);

        datesElement = windowForTrailElement.getChild ("Dates");
        datesElementList = datesElement.getChildren ();

        // Iterate through the list of Window For Trials, handling the Dates for each one.
        for (Iterator<Element> i = datesElementList.iterator (); i.hasNext ();)
        {
            dateElement = (Element) i.next ();
            exclusionDate = dateElement.getChild ("Value").getText ();
            mInsertWftExclusion (caseNumber, wftId, exclusionDate);
        } // for(Iterator i = ...
    } // mProcessWindowForTrail()

    /**
     * Delete wft exclusions.
     *
     * @param pCaseNumber the case number
     * @param pWftId the wft id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mDeleteWftExclusions (final String pCaseNumber, final String pWftId)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "wftId", pWftId);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.DELETE_WFT_EXCLUSIONS_METHOD, sXmlParams);

    } // mDeleteWftExclusions()

    /**
     * Insert wft exclusion.
     *
     * @param pCaseNumber the case number
     * @param pWftId the wft id
     * @param pExclusionDate the exclusion date
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void mInsertWftExclusion (final String pCaseNumber, final String pWftId, final String pExclusionDate)
        throws SystemException, BusinessException
    {
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "caseNumber", pCaseNumber);
        XMLBuilder.addParam (paramsElement, "wftId", pWftId);
        XMLBuilder.addParam (paramsElement, "exclusionDate", pExclusionDate);

        // Translate to string.
        xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        sXmlParams = xmlOutputter.outputString (paramsElement);

        // Call the service.
        proxy.getJDOM (WftDefs.WFT_SERVICE, WftDefs.INSERT_WFT_EXCLUSION_METHOD, sXmlParams);

    } // mInsertWftExclusion()

}
