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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.case_event_service.java.CaseEventConfigManager;
import uk.gov.dca.caseman.case_event_service.java.ICaseEventConfigDO;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 03-Feb-2005.
 *
 * @author Chris Hutt
 */
public class GetWftNavigationDataCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The case number param path. */
    private final XPath caseNumberParamPath;
    
    /** The event id param path. */
    private final XPath eventIdParamPath;
    
    /** The wft service case number param path. */
    private final XPath wftServiceCaseNumberParamPath;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public GetWftNavigationDataCustomProcessor () throws JDOMException
    {
        super ();

        eventIdParamPath = XPath.newInstance (WftDefs.EVENT_ID_PARAM_XPATH);
        caseNumberParamPath = XPath.newInstance (WftDefs.CASE_NUMBER_PARAM_XPATH);
        wftServiceCaseNumberParamPath = XPath.newInstance (WftDefs.WFT_CASE_NUMBER_XPATH);
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param plog the plog
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log plog) throws SystemException, BusinessException
    {
        /* Logic:
         * Event Configuration holds 2 related valuesd
         * Navigation = boolean
         * Prompt = A,B or C
         * 
         * If Prompt = C then if no Window For Trial associated with the case:
         * Navigation = false
         * Prompt = false
         *
         *
         * However, coded so that a call out to check case status no done unless
         * config requires it (ie Navigation = true) */
        String wftPrompt;
        boolean wftNavigation;
        Element output = null;
        Element input = null;
        String caseNumber = null;
        String eventIdStr = null;
        Element wftResult = null;
        Element wftCaseElement = null;
        Element caseNumberParams = null;

        try
        {
            input = (Element) eventIdParamPath.selectSingleNode (params);
            eventIdStr = input.getText ();

            // Get the rules associated with the specified event
            // -------------------------------------------------

            final ICaseEventConfigDO configDO = mGetCaseEventConfigDO (eventIdStr);

            wftNavigation = configDO.isWindowForTrialCall ();
            wftPrompt = configDO.getWindowForTrialPrompt ();

            // If the wftprompt value is set to 'C' there must be a WindowForTrial associated with
            // the case - otherwise WFT navigation does not apply.
            // -------------------------------------------------------------------------------------

            if (wftNavigation && wftPrompt.equals ("C"))
            {
                input = (Element) caseNumberParamPath.selectSingleNode (params);
                caseNumber = input.getText ();

                caseNumberParams = buildXMLParams (caseNumber);

                final Document wftResultDoc = invokeLocalServiceProxy (WftDefs.WFT_SERVICE, WftDefs.GET_WFT_STATUS,
                        caseNumberParams.getDocument ());

                wftResult = wftResultDoc.getRootElement ();

                wftCaseElement = (Element) wftServiceCaseNumberParamPath.selectSingleNode (wftResult);
                if (null == wftCaseElement)
                {
                    wftPrompt = "false";
                    wftNavigation = false;
                }
            }

            // Assemble the output
            output = new WftNavigationXMLBuilder ().getXMLElement (String.valueOf (wftNavigation), wftPrompt);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return output.getDocument ();
    }

    /**
     * (non-Javadoc)
     * Build params element with case number.
     *
     * @param pContent the content
     * @return the element
     */
    private Element buildXMLParams (final String pContent)
    {

        final Element rootElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (rootElement, "caseNumber", pContent);
        return rootElement;
    }

    /**
     * (non-Javadoc)
     * Determine string is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * (non-Javadoc)
     * Retrieve the configuration data object associated with the standard Event id.
     *
     * @param pEventId the event id
     * @return the i case event config DO
     * @throws SystemException the system exception
     */
    private ICaseEventConfigDO mGetCaseEventConfigDO (final String pEventId) throws SystemException
    {
        ICaseEventConfigDO caseEventConfigDO = null;

        // Retrieve the configuration data object associated with the standard Event id.
        final CaseEventConfigManager caseEventConfigManager = CaseEventConfigManager.getInstance ();
        caseEventConfigDO = caseEventConfigManager.getCaseEventConfigDO (Integer.parseInt (pEventId));

        return caseEventConfigDO;

    } // mGetCaseEventConfigDO()

    /**
     * (non-Javadoc)
     * Convert string to boolean.
     *
     * @param pBoolean the boolean
     * @return the string
     */
    private String mConvertBoolean (final boolean pBoolean)
    {

        final String xx = String.valueOf (pBoolean);
        String pString = "false";
        if (pBoolean)
        {
            pString = "true";
        }
        return pString;
    }
}
