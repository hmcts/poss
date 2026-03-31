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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSManager;
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSFactory;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleNonEvent;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleNonEventList;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.user_court_service.java.UserCourtDefs;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.UpdateLockedException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 09-Mar-2005
 *
 * v1.0 09/03/2005 Amjad Khan
 * V1.1 08/03/2005 Chris Hutt: DEFECT 2390 Add CreatingCourt and CreatingSection (BMS enhancement)
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * * Chris Hutt TD : UCT_Group2 1593 25 April 2008
 * userCourt and userSection can be specified by caller of this custom processor. Then the values derived from
 * determineSectionDetail will NOT be used.
 * 
 * @author Amjad Khan
 * 
 */
public class BMSNonEventBusinessHelperCustomProcessor implements ICustomProcessor
{
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (BMSNonEventBusinessHelperCustomProcessor.class);

    /** The Constant WARRANT_SERVICE. */
    private static final String WARRANT_SERVICE = "ejb/WarrantServiceLocal";
    
    /** The Constant CASE_SERVICE. */
    private static final String CASE_SERVICE = "ejb/CaseServiceLocal";
    
    /** The Constant GET_CASE_JURISDICTION. */
    private static final String GET_CASE_JURISDICTION = "getCaseJurisdictionLocal";
    
    /** The Constant GET_WARRANT_SUMMARY. */
    private static final String GET_WARRANT_SUMMARY = "getWarrantSummaryLocal";
    
    /** The Constant BMS_SERVICE. */
    private static final String BMS_SERVICE = "ejb/BmsServiceLocal";
    
    /** The Constant ADD_BMS_TASKS. */
    private static final String ADD_BMS_TASKS = "addBmsTasksLocal";
    
    /** The Constant SYSTEM_DATE_SERVICE. */
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    
    /** The Constant SUCCESS. */
    private static final String SUCCESS = "S";
    
    /** The Constant NO_MATCH. */
    private static final String NO_MATCH = "N";
    
    /** The Constant BMS_TAG. */
    private static final String BMS_TAG = "BMS";
    
    /** The Constant STATUS_TAG. */
    private static final String STATUS_TAG = "BmsType";

    /** The Constant PARAM_TAG. */
    private static final String PARAM_TAG = "param";
    
    /** The Constant PARAMS_TAG. */
    private static final String PARAMS_TAG = "params";
    
    /** The Constant TASK_NUMBER_TAG. */
    private static final String TASK_NUMBER_TAG = "TaskNumber";
    
    /** The Constant TASK_DATE_TAG. */
    private static final String TASK_DATE_TAG = "TaskDate";
    
    /** The Constant AGE_CATEGORY_TAG. */
    private static final String AGE_CATEGORY_TAG = "AgeCategory";
    
    /** The Constant TASK_COUNT_TAG. */
    private static final String TASK_COUNT_TAG = "TaskCount";
    
    /** The Constant COURT_CODE_TAG. */
    private static final String COURT_CODE_TAG = "CourtCode";
    
    /** The Constant TASK_TAG. */
    private static final String TASK_TAG = "Task";
    
    /** The Constant DS_TAG. */
    private static final String DS_TAG = "ds";
    
    /** The Constant CREATINGCOURT_TAG. */
    private static final String CREATINGCOURT_TAG = "CreatingCourt";
    
    /** The Constant CREATINGSECTION_TAG. */
    private static final String CREATINGSECTION_TAG = "CreatingSection";

    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The system date path. */
    private final XPath systemDatePath;
    
    /** The warrant summary local warrant path. */
    private final XPath warrantSummaryLocalWarrantPath;
    
    /** The warrant summary case number path. */
    private final XPath warrantSummaryCaseNumberPath;
    
    /** The case summary jurisdiction path. */
    private final XPath caseSummaryJurisdictionPath;
    
    /** The user id path. */
    private final XPath userIdPath;

    /** The param BMS. */
    private BMSRuleNonEvent paramBMS;

    /** The status. */
    private String status = null;

    /** The user id. */
    private String userId = null;
    
    /** The user court. */
    private String userCourt = null;
    
    /** The user section. */
    private String userSection = null;

    /** The iom. */
    private IBMSManager iom;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public BMSNonEventBusinessHelperCustomProcessor () throws JDOMException
    {
        proxy = new SupsLocalServiceProxy ();
        systemDatePath = XPath.newInstance ("/SystemDate");
        warrantSummaryLocalWarrantPath = XPath.newInstance ("/ds/Warrant/LocalNumber");
        warrantSummaryCaseNumberPath = XPath.newInstance ("/ds/Warrant/CaseNumber");
        caseSummaryJurisdictionPath = XPath.newInstance ("/ds/Case/Jurisdiction");
        userIdPath = XPath.newInstance ("params/param[@name='userId']");
    }

    /**
     * Processes the parameters document.
     * 
     * <params>
     * <param name="caseNumber">CJH00100</param>
     * <param name="eventID">CJH00100</param>
     * <param name="lastUpdateUser">CJH00100</param>
     * <param name="eventSeq">CJH00100</param>
     * </params>
     *
     * @param params The xml parameters.
     * @return The process parameters document
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
     * (non-Javadoc)
     * Extract parameters and begin processing.
     *
     * @param params the params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processFlow (final Document params) throws BusinessException, SystemException
    {
        try
        {
            userId = ((Element) userIdPath.selectSingleNode (params)).getText ();
            determineSectionDetail (userId);
            iom = BMSFactory.getBMSManager ();
            processInputParams (params);
            status = determineBmsRules ();
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Return BMS data in a Document.
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
     * Configure BMSRuleNonEvent based upon input params.
     *
     * @param params the params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processInputParams (final Document params) throws BusinessException, SystemException
    {
        final List<Element> elements = params.getRootElement ().getChildren ();
        paramBMS = new BMSRuleNonEvent ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals (PARAM_TAG))
            {
                final String nameAtt = current.getAttributeValue ("name");
                if (nameAtt != null && !isEmpty (current.getValue ()))
                {
                    if (nameAtt.equals ("section"))
                    {
                        paramBMS.setSection (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("courtCode"))
                    {
                        paramBMS.setCourtCode (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("warrantId"))
                    {
                        paramBMS.setWarrantId (current.getValue ().toUpperCase ());
                        // Call Warrant Service to determine the warrant type and Court Code
                        determineWarrantType (paramBMS);
                    }
                    if (nameAtt.equals ("receiptDate"))
                    {
                        paramBMS.setReceiptDateRequired (formatDate (current.getValue ()));
                    }
                    if (nameAtt.equals ("processingDate"))
                    {
                        paramBMS.setProcessingDateRequired (formatDate (current.getValue ()));
                    }
                    if (nameAtt.equals ("typeOfWarrant"))
                    {
                        paramBMS.setTypeOfWarrant (current.getValue ());
                    }
                    if (nameAtt.equals ("manuallyCreated"))
                    {
                        if (current.getText () == null || current.getText ().equals ("") ||
                                !current.getText ().equals ("Y"))
                        {
                            paramBMS.setManuallyCreatedReturn (false);
                        }
                        else
                        {
                            paramBMS.setManuallyCreatedReturn (true);
                        }
                    }
                    if (nameAtt.equals ("returnCode"))
                    {
                        paramBMS.setReturnCode (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("count"))
                    {
                        if (current.getText () == null || current.getText ().equals (""))
                        {
                            paramBMS.setCountIncrement (0);
                        }
                        else
                        {
                            paramBMS.setCountIncrement (Integer.parseInt (current.getText ()));
                        }
                    }
                    if (nameAtt.equals ("returnType"))
                    {
                        paramBMS.setReturnType (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("payoutType"))
                    {
                        paramBMS.setPayoutType (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("paymentType"))
                    {
                        paramBMS.setPaymentType (current.getValue ().toUpperCase ());
                    }
                    if (nameAtt.equals ("error"))
                    {
                        if (current.getText () == null || current.getText ().equals ("") ||
                                !current.getText ().equals ("Y"))
                        {
                            paramBMS.setError (false);
                        }
                        else
                        {
                            paramBMS.setError (true);
                        }
                    }
                    if (nameAtt.equals ("taskType"))
                    {
                        paramBMS.setBmsType (current.getValue ().toUpperCase ());
                    }

                    if (nameAtt.equals ("creatingCourtCode"))
                    {
                        userCourt = current.getValue ().toUpperCase ();
                    }

                    if (nameAtt.equals ("creatingSection"))
                    {
                        userSection = current.getValue ().toUpperCase ();
                    }
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Get BMS rules in a map.
     *
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineBmsRules () throws BusinessException, SystemException
    {
        final BMSRuleNonEventList m = getBMSRules ();

        if (m != null)
        {
            return determineMulipleBMSNERules (m);
        }
        // no rules found
        return null;
    }

    /**
     * (non-Javadoc)
     * Iterate through BMSNE rules and if required add parameters and tasks.
     *
     * @param m the m
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineMulipleBMSNERules (final BMSRuleNonEventList m) throws BusinessException, SystemException
    {
        final Iterator<IBMSRuleNonEvent> it = m.values ().iterator ();

        // The BMSNonEventList is a TreeMap ordered in Descending Order so BMS records with the least variables will be
        // output last
        while (it.hasNext ())
        {
            final IBMSRuleNonEvent bms = (IBMSRuleNonEvent) it.next ();
            if (bms != null && matchParams (bms) && checkRequiredParams (bms))
            {
                // Call Service to update or error.
                addAdditonalParametersForUpdate (bms);
                addBmsTasks (paramBMS);
                return SUCCESS;
            }
        }
        // No Match Return
        return NO_MATCH;
    }

    /**
     * (non-Javadoc)
     * Add task to BMS params and determine processing/receipt dates.
     *
     * @param bms the bms
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void addAdditonalParametersForUpdate (final IBMSRuleNonEvent bms) throws BusinessException, SystemException
    {
        // Add bms task
        paramBMS.setTask (bms.getTask ());
        /* Add count for only those counts stored, any other count which is not stored
         * needs to passed as in the case of payments and this already been checked in
         * by checkRequiredParams, counts which are passed in cannot be decremented */
        if (bms.getCountIncrement () != null && Integer.parseInt (bms.getCountIncrement ()) != 0)
        {
            if (paramBMS.getError ())
            {
                paramBMS.setCountIncrement ( -Integer.parseInt (bms.getCountIncrement ()));
            }
            else
            {
                paramBMS.setCountIncrement (Integer.parseInt (bms.getCountIncrement ()));
            }

        }
        // Add Processing Date And Receipt Date
        determineProcessingAndReciptDate (paramBMS);
    }

    /**
     * (non-Javadoc)
     * Check required params.
     *
     * @param bms the bms
     * @return true, if successful
     * @throws SystemException the system exception
     */
    private boolean checkRequiredParams (final IBMSRuleNonEvent bms) throws SystemException
    {
        final Iterator<String> it = bms.getRequiredParamValues ().iterator ();
        int count = 0;
        while (it.hasNext ())
        {
            final String methodName = (String) it.next ();
            try
            {
                if ( !isEmpty ((String) paramBMS.getClass ().getMethod (methodName, null).invoke (paramBMS, null)))
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
        return count == bms.getRequiredParamValues ().size ();
    }

    /**
     * (non-Javadoc)
     * Match params.
     *
     * @param bms the bms
     * @return true, if successful
     * @throws SystemException the system exception
     */
    private boolean matchParams (final IBMSRuleNonEvent bms) throws SystemException
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
     * Gets the BMS rules.
     *
     * @return the BMS rules
     */
    private BMSRuleNonEventList getBMSRules ()
    {
        return iom.getBMSRulesNonEvents (paramBMS.getSection ());
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
     * Return BMS XML as a string.
     *
     * @return the string
     */
    private String toXML ()
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, BMS_TAG, false);

        if (status != null)
        {
            addXMLTagValues (strBuf, status, STATUS_TAG);
        }

        addXMLTag (strBuf, BMS_TAG, true);
        return strBuf.toString ();
    }

    /**
     * (non-Javadoc)
     * Add strat tag, text and end tag to a string.
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
     * Add start or end tag to a string.
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

    /**
     * (non-Javadoc)
     * Format a date to yyyy-MM-dd format.
     *
     * @param pDate the date
     * @return the date
     */
    private Date formatDate (final String pDate)
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        Date parseDate = null;
        try
        {
            parseDate = dateFormat.parse (pDate);
        }
        catch (final ParseException pe)
        {
            log.error ("ParseException caught");
            return null;
        }
        return parseDate;
    }

    /**
     * (non-Javadoc)
     * Format a date to yyyy-MM-dd format.
     *
     * @param pDate the date
     * @return the gregorian calendar
     */
    private GregorianCalendar formatParseDate (final String pDate)
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        Date parseDate = null;
        try
        {
            parseDate = dateFormat.parse (pDate);
        }
        catch (final ParseException pe)
        {
            log.error ("ParseException caught");
        }
        final GregorianCalendar gCal = new GregorianCalendar ();
        gCal.setTime (parseDate);
        return gCal;
    }

    /**
     * (non-Javadoc)
     * Call a service to determine the warrent type.
     *
     * @param paramBne the param bne
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void determineWarrantType (final BMSRuleNonEvent paramBne) throws BusinessException, SystemException
    {
        Element root = null;
        Element croot = null;

        try
        {
            final String warrantParams =
                    "<params><param name='warrantID'>" + paramBne.getWarrantId () + "</param></params>";
            root = proxy.getJDOM (WARRANT_SERVICE, GET_WARRANT_SUMMARY, warrantParams).getRootElement ();
            final Element localWarrant = (Element) warrantSummaryLocalWarrantPath.selectSingleNode (root);
            paramBne.setWarrantType (determineWarrantType (localWarrant.getText ()));

            String caseType = "ALL";
            final Element caseNumber = (Element) warrantSummaryCaseNumberPath.selectSingleNode (root);
            if (caseNumber != null && caseNumber.getText () != "")
            {
                // Case number populated on warrant, determine jurisdiction
                final String caseParams =
                        "<params><param name='caseNumber'>" + caseNumber.getText () + "</param></params>";
                croot = proxy.getJDOM (CASE_SERVICE, GET_CASE_JURISDICTION, caseParams).getRootElement ();
                final Element jurisdictionElement = (Element) caseSummaryJurisdictionPath.selectSingleNode (croot);
                String jurisdiction = "";

                if (null != jurisdictionElement)
                {
                    jurisdiction = jurisdictionElement.getText ();
                }
                if (jurisdiction.equals ("F"))
                {
                    caseType = "FAMILY";
                }
            }
            paramBne.setCaseType (caseType);

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Determine the warrent type based on local number.
     *
     * @param localNumber the local number
     * @return the string
     */
    private String determineWarrantType (final String localNumber)
    {
        if (isEmpty (localNumber))
        {
            return "HOME";
        }
        return "FOREIGN";
    }

    /**
     * (non-Javadoc)
     * Create required params XML and call a service to add BMS tasks.
     *
     * @param paramBne the param bne
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void addBmsTasks (final BMSRuleNonEvent paramBne) throws BusinessException, SystemException
    {
        try
        {
            final StringBuffer strBuf = new StringBuffer ();
            addXMLTag (strBuf, PARAMS_TAG, false);
            addXMLTag (strBuf, DS_TAG, false);
            addXMLTag (strBuf, TASK_TAG, false);
            addXMLTagValues (strBuf, paramBne.getTask (), TASK_NUMBER_TAG);
            addXMLTagValues (strBuf, determineTaskAge (paramBne), AGE_CATEGORY_TAG);
            addXMLTagValues (strBuf, paramBne.getProcessingDateRequired (), TASK_DATE_TAG);
            addXMLTagValues (strBuf, paramBne.getCountIncrement (), TASK_COUNT_TAG);
            addXMLTagValues (strBuf, paramBne.getCourtCode (), COURT_CODE_TAG);
            addXMLTagValues (strBuf, userCourt, CREATINGCOURT_TAG);
            addXMLTagValues (strBuf, userSection, CREATINGSECTION_TAG);
            addXMLTagValues (strBuf, paramBne.getCourtCode (), COURT_CODE_TAG);
            addXMLTag (strBuf, TASK_TAG, true);
            addXMLTag (strBuf, DS_TAG, true);
            addXMLTag (strBuf, PARAMS_TAG, true);
            proxy.getJDOM (BMS_SERVICE, ADD_BMS_TASKS, strBuf.toString ()).getRootElement ();

        }
        catch (final SystemException se)
        {
            /* Updated to add check for UpdateLockedException this is being thrown when the Update query is
             * called (See query_def_add_bms_tasks) and the current Task Count is 0
             * and the update is a decrement, this would make the Task count less than 0, but there is a
             * check within the update where the current task count + the decrement count which in this
             * instance is -1 is together equal or greater than zero.
             * In most cases this logic is true but if its not true as per the example above the framework
             * does a check to see if an update has been performed and in this case there is no update for
             * the example of of a task count of 0 and a decrement of -1 as this would equal less than 0.
             * The framework then throws a UpdateLockedException which is untrue due to the fact it believes
             * that because no database update has been performed there must be locking issue. This
             * is a flaw within the framework and since we require a simple fix, we have just caught and
             * interrogated the exception to see what type it is, if its of type UpdateLockedException then
             * there is no exception to be thrown and the update as far as the client is concerned is successful. */
            if (se.getCause () instanceof UpdateLockedException ||
                    se.getCause ().getCause () instanceof UpdateLockedException)
            {
                log.error ("Interrogated System Exception in method addBmsTasks for the call to service addBmsTasks " +
                        "and it is of type of Update Exception this will not be thrown but be swallowed /N ---> " +
                        "See Java Class for further details about this");
            }
            else
            {
                throw se;
            }
        }
    }

    /**
     * (non-Javadoc)
     * Set processing and receipt date to system date.
     * PJR
     *
     * @param paramBne the param bne
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void determineProcessingAndReciptDate (final BMSRuleNonEvent paramBne)
        throws BusinessException, SystemException
    {
        if (isEmpty (paramBne.getProcessingDateRequired ()))
        {
            paramBne.setProcessingDateRequired (callSystemDateService ().getTime ()); // This is need to set the Task
                                                                                      // Date
        }

        if (isEmpty (paramBne.getReceiptDateRequired ()))
        {
            paramBne.setReceiptDateRequired (callSystemDateService ().getTime ());
        }
    }

    /**
     * (non-Javadoc)
     * Determine the BMS task age.
     *
     * @param paramBne the param bne
     * @return the string
     * @throws SystemException the system exception
     */
    private String determineTaskAge (final BMSRuleNonEvent paramBne) throws SystemException
    {
        final GregorianCalendar pDate = formatParseDate (paramBne.getProcessingDateRequired ());
        final GregorianCalendar rDate = formatParseDate (paramBne.getReceiptDateRequired ());

        try
        {
            return BMSHelper.determineTaskAge (rDate, pDate);
        }
        catch (final BusinessException be)
        {
            throw new SystemException ("Business Exception caught in determineTaskAge \n" + be.getMessage (), be);
        }
        catch (final JDOMException je)
        {
            throw new SystemException ("JDOMException Exception caught in determineTaskAge \n" + je.getMessage (), je);
        }
    }

    /**
     * (non-Javadoc)
     * Call a service to get the system date.
     *
     * @return the gregorian calendar
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private GregorianCalendar callSystemDateService () throws BusinessException, SystemException
    {
        Element systemDate = null;

        try
        {
            final StringBuffer strBuf = new StringBuffer ();
            addXMLTag (strBuf, PARAMS_TAG, false);
            addXMLTag (strBuf, PARAMS_TAG, true);
            systemDate = proxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, strBuf.toString ()).getRootElement ();
            final Element systemDateEl = (Element) systemDatePath.selectSingleNode (systemDate);

            if (isEmpty (systemDateEl.getText ()))
            {
                log.error ("System Exception to be thrown no system date found");
                throw new SystemException ("No System date found ");
            }
            return formatParseDate (systemDateEl.getText ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * Call a service to get user specific data.
     *
     * @param pUserId the user id
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void determineSectionDetail (final String pUserId) throws SystemException, BusinessException
    {
        userCourt = "";
        userSection = "";

        Element rootElement = null;
        Element userCourtElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "userId", pUserId);

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            rootElement = proxy.getJDOM (UserCourtDefs.USER_COURT_SERVICE, UserCourtDefs.GET_USER_DETAILS, sXmlParams)
                    .getRootElement ();

            userCourtElement = (Element) rootElement.getChild ("UserCourt").detach ();

            if (null != userCourtElement)
            {
                userCourt = userCourtElement.getChildText ("CourtCode");
                userSection = userCourtElement.getChildText ("SectionName");
            }
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

    } // determinSectionDetail()
}
