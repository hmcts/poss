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
import java.util.HashMap;
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
public class BMSRequiredParamsProcessor implements ICustomProcessor
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
    
    /** The Constant PARAM_TYPE_TAG. */
    private static final String PARAM_TYPE_TAG = "ParamType";
    
    /** The Constant PARAM_TAG. */
    private static final String PARAM_TAG = "param";
    
    /** The Constant BMSTYPE. */
    private static final String BMSTYPE = "getBMSType";

    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The event ID. */
    private String eventID;
    
    /** The case type. */
    private String caseType;
    
    /** The bms type. */
    private String bmsType;
    
    /** The params. */
    HashMap<String, ?> params = new HashMap<>();  // values are unused...

    /** The iom. */
    private IBMSManager iom;

    /**
     * Constructor.
     */
    public BMSRequiredParamsProcessor ()
    {
    }

    /**
     * Processes the passed params document.
     * 
     * <params>
     * <param name="caseType">CJH00100</param>
     * <param name="eventID">CJH00100</param>
     * <param name="bmsType">CJH00100</param>
     * </params>
     *
     * @param params The params document
     * @return The processed params document
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
     * Process required params.
     *
     * @param params the params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processFlow (final Document params) throws BusinessException, SystemException
    {
        iom = BMSFactory.getBMSManager ();
        processInputParams (params);
        determineBmsRules ();
    }

    /**
     * (non-Javadoc)
     * Get bms document.
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
     * Get BMS params from input params xml.
     *
     * @param params the params
     */
    private void processInputParams (final Document params)
    {
        final List<Element> elements = params.getRootElement ().getChildren ();

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
                        eventID = current.getValue ();
                    }
                    if (nameAtt.equals ("caseType"))
                    {
                        caseType = current.getValue ();
                    }
                    if (nameAtt.equals ("taskType"))
                    {
                        bmsType = current.getValue ();
                    }
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Get BMS rules.
     * PJR
     */
    private void determineBmsRules ()
    {
        final BMSRuleList m = getBMSRules ();
        /* We need to revist this at a later date either
         * creating a new xml structure or store the number of params. This may appear inefficient but this is
         * due to time constraints */
        if (m != null)
        {
            determineSingleParams (m);
        }
    }

    /**
     * (non-Javadoc)
     * Determine params.
     *
     * @param m the m
     */
    private void determineSingleParams (final BMSRuleList m)
    {
        Iterator<IBMSRule> it = m.values ().iterator ();
        int countMatch = 0;

        // Matched Records
        while (it.hasNext ())
        {
            final IBMSRule bms = (IBMSRule) it.next ();
            if (bmsType.equals (bms.getBMSType ()) &&
                    (caseType.equals (bms.getCaseType ()) || bms.getCaseType ().equals (CASE_TYPE_ALL)))
            {
                determineParams (bms);
                countMatch++;
            }
        }
        // Unmatched Records Iterate through All Other Case Types these could CC DR CH And QB
        if (countMatch++ == 0)
        {
            // Reset Iterator
            it = m.values ().iterator ();
            while (it.hasNext ())
            {
                final IBMSRule bms = (IBMSRule) it.next ();
                if (bmsType.equals (bms.getBMSType ()) && umatchedCases (bms))
                {
                    determineParams (bms);
                }
            }
        }
    }

    /**
     * (non-Javadoc)
     * Return true for unmatched cases.
     *
     * @param bms the bms
     * @return true, if successful
     */
    private boolean umatchedCases (final IBMSRule bms)
    {
        final String caseCCRefType = getCaseTypes () == null ? null : getCaseTypes ().getCaseType ();

        if (caseCCRefType != null && bms.getCaseType ().equals (CASE_TYPE_DR))
        { // DR
            // Covers all DR Cases - At the moment DR are unique for each case, this may change so add in
            // determineMatchRecordMatch method
            return true;
        }
        else if (bms.getCaseType ().equals (CASE_TYPE_CC) || bms.getCaseType ().equals (CASE_TYPE_CH) ||
                bms.getCaseType ().equals (CASE_TYPE_QB) || bms.getCaseType ().equals (CASE_TYPE_FE))
        {
            // Covers Cases CC, CH and Qb
            return true;
        }
        return false;
    }

    /**
     * (non-Javadoc)
     * Add params to params hashmap.
     *
     * @param bms the bms
     * @return true, if successful
     */
    private boolean determineParams (final IBMSRule bms)
    {
        // This will match all xml fields set to a value. Except for case tpe and event id which
        final Iterator<String> it = bms.getComparableValues ().iterator ();
        while (it.hasNext ())
        {
            final String methodName = (String) it.next ();
            // Don't Add BmsType as this a Mandatory Field the Client is aware of
            if ( !methodName.equals (BMSTYPE))
            {
                final String paramName = methodName.substring (3).toUpperCase ();
                params.put (paramName, null);
            }
        }
        return false;
    }

    /**
     * Gets the BMS rules.
     *
     * @return the BMS rules
     */
    private BMSRuleList getBMSRules ()
    {
        return iom.getBMSRules (Integer.parseInt (eventID));
    }

    /**
     * Gets the case types.
     *
     * @return the case types
     */
    private IBMSTypes getCaseTypes ()
    {
        return iom.getCCREFCodes (caseType);
    }

    /**
     * (non-Javadoc)
     * Return BMS params document.
     *
     * @return the string
     */
    private String toXML ()
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, BMS_TAG, false);

        if ( !params.keySet ().isEmpty ())
        {
            final Iterator<String> it = params.keySet ().iterator ();
            while (it.hasNext ())
            {
                addXMLTagValues (strBuf, (String) it.next (), PARAM_TYPE_TAG);
            }
        }
        addXMLTag (strBuf, BMS_TAG, true);
        return strBuf.toString ();
    }

    /**
     * (non-Javadoc)
     * Add xml tags and text to a string.
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
     * Add XML tags to a string buffer.
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
