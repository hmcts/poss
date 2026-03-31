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
package uk.gov.dca.caseman.bms_service.java;

import java.io.IOException;
import java.io.StringReader;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRule;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSTypes;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSFactory;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRule;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleList;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Amjad Khan
 */
public class BMSBusinessHelperCustomProcessor implements ICustomProcessor
{
    
    /** The Constant CASE_TYPE_ALL. */
    private static final String CASE_TYPE_ALL = "ALL";
    
    /** The Constant CASE_TYPE_DR. */
    private static final String CASE_TYPE_DR = "DR";
    
    /** The Constant CASE_TYPE_CC. */
    private static final String CASE_TYPE_CC = "CC";
    
    /** The Constant CASE_TYPE_QB. */
    private static final String CASE_TYPE_QB = "QB";
    
    /** The Constant CASE_TYPE_CH. */
    private static final String CASE_TYPE_CH = "CH";
    
    /** The Constant CASE_TYPE_FE. */
    private static final String CASE_TYPE_FE = "FE";
    
    /** The Constant BMS_TAG. */
    private static final String BMS_TAG = "BMS";
    
    /** The Constant BMS_TYPE_TAG. */
    private static final String BMS_TYPE_TAG = "BmsType";
    
    /** The Constant BMS_TASK_TAG. */
    private static final String BMS_TASK_TAG = "Task";
    
    /** The Constant PARAM_TAG. */
    private static final String PARAM_TAG = "param";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The param BMS. */
    private BMSRule paramBMS;

    /** The bms rule to convert. */
    private IBMSRule bmsRuleToConvert;

    /** The iom. */
    private IBMSManager iom;

    /**
     * Constructor.
     */
    public BMSBusinessHelperCustomProcessor ()
    {
    }

    /**
     * Processes the params document.
     * 
     * <params>
     * <param name="caseNumber">CJH00100</param>
     * <param name="eventID">CJH00100</param>
     * <param name="lastUpdateUser">CJH00100</param>
     * <param name="eventSeq">CJH00100</param>
     * </params>
     *
     * @param params The params document
     * @return The processed document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Document process (final Document params) throws BusinessException, SystemException
    {
        processFlow (params);
        return convertToDoc ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        processFlow (params);

        try
        {
            writer.write (toXML ());
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * Process flow.
     *
     * @param params the params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processFlow (final Document params) throws BusinessException, SystemException
    {
        iom = BMSFactory.getBMSManager ();
        processInputParams (params);
        bmsRuleToConvert = determineBmsRules ();
    }

    /**
     * (non-Javadoc)
     * Returns document with BMS element.
     *
     * @return the document
     * @throws SystemException the system exception
     */
    private Document convertToDoc () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (new StringReader (toXML ()));
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
     * Sets values in BMSRule based on input params.
     * PJR
     *
     * @param params the params
     */
    private void processInputParams (final Document params)
    {
        final List<Element> elements = params.getRootElement ().getChildren ();
        paramBMS = new BMSRule ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals (PARAM_TAG))
            {
                final String nameAtt = current.getAttributeValue ("name");
                if (nameAtt != null)
                {
                    if (nameAtt.equals ("eventID"))
                    {
                        paramBMS.setEventId (Integer.parseInt (current.getValue ()));
                    }
                    if (nameAtt.equals ("caseType"))
                    {
                        paramBMS.setCaseType (current.getValue ());
                    }
                    if (nameAtt.equals ("applicantType"))
                    {
                        paramBMS.setApplicantType (current.getValue ());
                    }
                    if (nameAtt.equals ("hearingType"))
                    {
                        paramBMS.setHearingType (current.getValue ());
                    }
                    if (nameAtt.equals ("hearingFlag"))
                    {
                        paramBMS.setHearingFlag (current.getValue ());
                    }
                    if (nameAtt.equals ("issue"))
                    {
                        paramBMS.setIssue (current.getValue ());
                    }
                    if (nameAtt.equals ("applicantResponse"))
                    {
                        paramBMS.setApplicantResponse (current.getValue ());
                    }
                    if (nameAtt.equals ("aeEventID"))
                    {
                        if (current.getText () == null || current.getText ().equals (""))
                        {
                            paramBMS.setAEEventID (0);
                        }
                        else
                        {
                            paramBMS.setAEEventID (Integer.parseInt (current.getText ()));
                        }
                    }
                    if (nameAtt.equals ("eventType"))
                    {
                        paramBMS.setEventType (current.getValue ());
                    }
                    if (nameAtt.equals ("codedParty"))
                    {
                        paramBMS.setCodedParty (current.getValue ());
                    }
                    if (nameAtt.equals ("eventTypeFlag"))
                    {
                        paramBMS.setEventTypeFlag (current.getValue ());
                    }
                    if (nameAtt.equals ("caseTypeCategory"))
                    {
                        paramBMS.setCaseTypeCategory (current.getValue ());
                    }
                    if (nameAtt.equals ("listingType"))
                    {
                        paramBMS.setListingType (current.getValue ());
                    }
                    if (nameAtt.equals ("taskType"))
                    {
                        paramBMS.setBMSType (current.getValue ());
                    }
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Get map containing BMS rules.
     *
     * @return the IBMS rule
     * @throws SystemException the system exception
     */
    private IBMSRule determineBmsRules () throws SystemException
    {
        final BMSRuleList m = getBMSRules ();

        if (m != null)
        {
            return determineMulipleOblRules (m);
        }
        // no rules found
        return null;
    }

    /**
     * (non-Javadoc)
     * Iterate through BMS rules.
     *
     * @param m the m
     * @return the IBMS rule
     * @throws SystemException the system exception
     */
    private IBMSRule determineMulipleOblRules (final BMSRuleList m) throws SystemException
    {
        // Need to add in BMS Type Check too
        final Iterator<IBMSRule> it = m.values ().iterator ();
        // This CourtType is retrieved form BMSTypes where case types are listed with any court type
        final String bmsCourtType = getCaseTypes () == null ? null : getCaseTypes ().getCourtType ();
        final String caseCCRefType = getCaseTypes () == null ? null : getCaseTypes ().getCaseType ();
        // The BMSList is a TreeMap ordered in Descending Order so BMS records with the least variables will be output
        // last
        while (it.hasNext ())
        {
            final IBMSRule bms = (IBMSRule) it.next ();
            if (bms != null)
            {
                // If case type all is set for most records, its uniquely identifiable from other variables
                if ((paramBMS.getCaseType ().equals (bms.getCaseType ()) // Current BMSRule in loop matches the case
                                                                         // type of the case generating the BMS
                        || bms.getCaseType ().equals (CASE_TYPE_ALL) // Current BMSRule in loop matches all case types
                        ||
                        !isEmpty (bms.getCaseTypeCategory ()) &&
                                paramBMS.getCaseTypeCategory ().equals (bms.getCaseTypeCategory ())) // Current BMSRule
                                                                                                      // in loop has a
                                                                                                      // case type
                                                                                                      // category which
                                                                                                      // matches the
                                                                                                      // case's case
                                                                                                      // type category
                        && matchParams (bms))
                {
                    // Optional Fields Check if case type matches return
                    if (bms.getBMSType ().equals ("S"))
                    {
                        if (bmsCourtType == null || isEmpty (bms.getCourtType ()) ||
                                bmsCourtType != null && bms.getCourtType ().equals (bmsCourtType))
                        {
                            // Match Court Type
                            return bms;
                        }
                    }
                    else
                    {
                        return bms;
                    }
                }
                else
                { // For All other Case Types Such AS CC or DR, these are checked against CCRef Codes
                    // Case Types can either be one of the above or CC/DR/CH/QB
                    if (caseCCRefType != null && bmsCourtType != null && bms.getCaseType ().equals (CASE_TYPE_DR) &&
                            matchParams (bms))
                    { // DR
                        // Covers all DR Cases - At the moment DR are unique for each case, this may change so add in
                        // determineMatchRecordMatch method
                        // No Court Type has been Set in the BmsRules, therefore cannot compare as in the cases CH and
                        // QB
                        return bms;
                    }
                    else if (caseCCRefType != null && bmsCourtType == null &&
                            bms.getCaseType ().equals (CASE_TYPE_CC) && matchParams (bms))
                    {
                        // Covers Cases CC
                        return bms;
                    }
                    else if (caseCCRefType != null && bmsCourtType != null &&
                            bms.getCourtType ().equals (bmsCourtType) && //
                            (bms.getCaseType ().equals (CASE_TYPE_CH) || bms.getCaseType ().equals (CASE_TYPE_QB) ||
                                    bms.getCaseType ().equals (CASE_TYPE_FE)) &&
                            matchParams (bms))
                    { // CH QB FE CASES
                        return bms;
                    }
                }
            }
        }
        // No Match Return
        return null;
    }

    /**
     * (non-Javadoc)
     * Counts BMS values.
     *
     * @param bms the bms
     * @return true, if successful
     * @throws SystemException the system exception
     */
    private boolean matchParams (final IBMSRule bms) throws SystemException
    {
        // This will match all xml fields set to a value. Except for case tpe and event id which
        final Iterator<String> it = bms.getComparableValues ().iterator ();
        int count = 0;
        while (it.hasNext ())
        {
            final String methodName = (String) it.next ();
            try
            {
                if (bms.getClass ().getMethod (methodName, null).invoke (bms, null)
                        .equals (paramBMS.getClass ().getMethod (methodName, null).invoke (paramBMS, null)))
                {
                    count++;
                }
            }
            catch (final NoSuchMethodException e)
            {
                throw new SystemException (e);
            }
            catch (final InvocationTargetException e)
            {
                throw new SystemException (e);
            }
            catch (final IllegalAccessException e)
            {
                throw new SystemException (e);
            }
            // The only exception which could possibly occur is Null Pointer
        }
        return count == bms.getComparableValues ().size ();
    }

    /**
     * Gets the case types.
     *
     * @return the case types
     */
    private IBMSTypes getCaseTypes ()
    {
        return iom.getCCREFCodes (paramBMS.getCaseType ());
    }

    /**
     * Gets the BMS rules.
     *
     * @return the BMS rules
     */
    private BMSRuleList getBMSRules ()
    {
        return iom.getBMSRules (paramBMS.getEventId ());
    }

    /**
     * (non-Javadoc)
     * Utility function to determine if a string is empty.
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
     * Utility function to return BMS element as a string.
     *
     * @return the string
     */
    private String toXML ()
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, BMS_TAG, false);

        if (bmsRuleToConvert != null)
        {
            addXMLTagValues (strBuf, bmsRuleToConvert.getBMSType (), BMS_TYPE_TAG);
            addXMLTagValues (strBuf, bmsRuleToConvert.getTask (), BMS_TASK_TAG);
        }

        addXMLTag (strBuf, BMS_TAG, true);
        return strBuf.toString ();
    }

    /**
     * (non-Javadoc)
     * Utility function to add start tag, text and end tag to a string.
     *
     * @param strBuf the str buf
     * @param val the val
     * @param constant the constant
     */
    private void addXMLTagValues (final StringBuffer strBuf, final String val, final String constant)
    {
        addXMLTag (strBuf, constant, false);
        strBuf.append (val);
        addXMLTag (strBuf, constant, true);
    }

    /**
     * (non-Javadoc)
     * Utility function to add start/end tag to a string.
     *
     * @param strBuf the str buf
     * @param constant the constant
     * @param endTag the end tag
     */
    private void addXMLTag (final StringBuffer strBuf, final String constant, final boolean endTag)
    {
        strBuf.append (STARTTAG);
        if (endTag)
        {
            strBuf.append (SLASH);
        }
        strBuf.append (constant);
        strBuf.append (ENDTAG);
    }

}
