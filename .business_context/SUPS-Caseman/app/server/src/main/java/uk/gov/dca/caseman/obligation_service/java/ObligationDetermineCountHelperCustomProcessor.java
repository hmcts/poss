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
package uk.gov.dca.caseman.obligation_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 17-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 25-Jul-2006 Paul Roberts: Logging. Remove unused variables.
 *
 * @author Amjad Khan
 */
public class ObligationDetermineCountHelperCustomProcessor extends AbstractCasemanCustomProcessor
{

    /** The Constant OBLIGATION_SERVICE. */
    private static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    
    /** The Constant GET_OBLIGATION_SEQUENCE. */
    private static final String GET_OBLIGATION_SEQUENCE = "getObligationCountLocal";
    
    /** The Constant GET_AE_OBLIGATION_SEQUENCE. */
    private static final String GET_AE_OBLIGATION_SEQUENCE = "getAEObligationCountLocal";

    /** The Constant ACTIVE. */
    private static final String ACTIVE = "A";
    
    /** The Constant NON_ACTIVE. */
    private static final String NON_ACTIVE = "NA";
    
    /** The Constant NONE. */
    private static final String NONE = "N";

    /** The Constant N. */
    private static final String N = "N";
    
    /** The Constant Y. */
    private static final String Y = "Y";

    /** The Constant CASEEVENT_FLAG. */
    private static final String CASEEVENT_FLAG = "C";
    
    /** The Constant AEEVENT_FLAG. */
    private static final String AEEVENT_FLAG = "A";

    /** The Constant OBLIGATION_TAG. */
    private static final String OBLIGATION_TAG = "Obligations";
    
    /** The Constant TYPE_TAG. */
    private static final String TYPE_TAG = "Type";

    /** The Constant OBLIGATION_COUNT. */
    private static final String OBLIGATION_COUNT = "/Obligation/Count";
    
    /** The Constant CASENUMBER_PARAM_TAG. */
    private static final String CASENUMBER_PARAM_TAG = "params/param[@name='caseNumber']";
    
    /** The Constant EVENTTYPE_PARAM_TAG. */
    private static final String EVENTTYPE_PARAM_TAG = "params/param[@name='eventType']";
    
    /** The Constant BLANK. */
    private static final String BLANK = ">";

    /** The case number path. */
    private final XPath caseNumberPath;
    
    /** The event type path. */
    private final XPath eventTypePath;
    
    /** The obligation count path. */
    private final XPath obligationCountPath;

    /** The case number. */
    private String caseNumber;
    
    /** The event type. */
    private String eventType;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public ObligationDetermineCountHelperCustomProcessor () throws JDOMException
    {
        super ();
        caseNumberPath = XPath.newInstance (CASENUMBER_PARAM_TAG);
        eventTypePath = XPath.newInstance (EVENTTYPE_PARAM_TAG);
        obligationCountPath = XPath.newInstance (OBLIGATION_COUNT);
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     * 
     *      <params>
     *      <param name="caseNumber">CJH00100</param>
     *      </params>
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        processInputParams (params);
        return convertToDoc ();
    }

    /**
     * (non-Javadoc)
     * Return an obligations xml fragment.
     *
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document convertToDoc () throws BusinessException, SystemException
    {

        return toXML ();
    }

    /**
     * (non-Javadoc)
     * Set case number and event type class variables.
     *
     * @param params the params
     * @throws SystemException the system exception
     */
    private void processInputParams (final Document params) throws SystemException
    {

        try
        {
            final Element input = (Element) caseNumberPath.selectSingleNode (params);

            caseNumber = input.getText ();
            eventType = ((Element) eventTypePath.selectSingleNode (params)).getText ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
    }

    /**
     * (non-Javadoc)
     * Validate event type.
     *
     * @return true, if successful
     */
    private boolean validateEventType ()
    {
        return eventType.equals (AEEVENT_FLAG) || eventType.equals (CASEEVENT_FLAG);
    }

    /**
     * (non-Javadoc)
     * Determine if there are obligations on the database for the case.
     *
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineCountReturn () throws BusinessException, SystemException
    {
        if (validateEventType ())
        {
            if (getObligationCountOnDatabase (N))
            {
                return ACTIVE;
            }
            else if (getObligationCountOnDatabase (Y))
            {
                return NON_ACTIVE;
            }
        }
        return NONE;
    }

    /**
     * (non-Javadoc)
     * Determine if there are obligations on the database for the case.
     *
     * @param deleteFlag the delete flag
     * @return the obligation count on database
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private boolean getObligationCountOnDatabase (final String deleteFlag) throws BusinessException, SystemException
    {
        Element obligationResult = null;
        /* <params>
         * <param name="caseNumber">CJH00100</param>
         * <param name="deleteFlag">Y</param>
         * </params> */
        try
        {
            if ( !isEmpty (caseNumber))
            {
                obligationResult = determineEventTypeService (deleteFlag);
                final Element obligationCountElement =
                        (Element) obligationCountPath.selectSingleNode (obligationResult);

                if (isEmpty (obligationCountElement.getText ()))
                {
                    return false;
                }
                else if (Integer.parseInt (obligationCountElement.getText ()) > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        throw new SystemException ("Case Number is Empty");
    }

    /**
     * (non-Javadoc)
     * Get the obligation sequence via a service call.
     *
     * @param deleteFlag the delete flag
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element determineEventTypeService (final String deleteFlag) throws SystemException, BusinessException
    {
        final Element obligationParams = getObligationCountParams (deleteFlag);
        if (eventType.equals (CASEEVENT_FLAG))
        {
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, GET_OBLIGATION_SEQUENCE,
                    obligationParams.getDocument ()).getRootElement ();
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, GET_AE_OBLIGATION_SEQUENCE,
                    obligationParams.getDocument ()).getRootElement ();
        }
        else
        {
            throw new SystemException ("Event Type is not listed = " + eventType);
        }
    }

    /**
     * (non-Javadoc)
     * Create a params element for use in getting an obligation count.
     *
     * @param deleteFlag the delete flag
     * @return the obligation count params
     */
    private Element getObligationCountParams (final String deleteFlag)
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
        XMLBuilder.addParam (paramsElement, "deleteFlag", deleteFlag);

        return paramsElement;
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || BLANK.equals (s);
    }

    /**
     * (non-Javadoc)
     * Create an obligations element.
     *
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document toXML () throws BusinessException, SystemException
    {
        /* <Obligations>
         * <Type>A</Type>
         * </Obligations> */
        final Element obligationElement = new Element (OBLIGATION_TAG);
        final Element typeElement = new Element (TYPE_TAG);
        typeElement.setText (determineCountReturn ());
        obligationElement.addContent (typeElement);

        final Document doc = new Document ();
        doc.setRootElement (obligationElement);

        return doc;
    }

}
