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
import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSFactory;
import uk.gov.dca.caseman.bms_service.java.bmsrules.impl.BMSRuleNonEventList;
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
public class BMSNonEventRequiredParamsProcessor implements ICustomProcessor
{
    
    /** The Constant BMS_TAG. */
    private static final String BMS_TAG = "BMS";
    
    /** The Constant PARAM_TYPE_TAG. */
    private static final String PARAM_TYPE_TAG = "ParamType";
    
    /** The Constant PARAM_TAG. */
    private static final String PARAM_TAG = "param";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The section. */
    private String section;
    
    /** The bms type. */
    private String bmsType;
    
    /** The params. */
    HashMap<String, String> params = new HashMap<>();

    /** The iom. */
    private IBMSManager iom;

    /**
     * Constructor.
     */
    public BMSNonEventRequiredParamsProcessor ()
    {
    }

    /**
     * Processes the passed parameters document.
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
     * Process params.
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
     * Create a BMS document.
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
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc)
     * Get section and bmsType.
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
                    if (nameAtt.equals ("section"))
                    {
                        section = current.getValue ();
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
     * Determine rules and create paramneters.
     *
     */
    private void determineBmsRules ()
    {
        final BMSRuleNonEventList m = getBMSRules ();
        if (m != null)
        {
            determineBmsParams (m);
        }
    }

    /**
     * (non-Javadoc)
     * Determine parameters from a map containing the rules.
     *
     * @param m the m
     */
    private void determineBmsParams (final BMSRuleNonEventList m)
    {
        final Iterator<IBMSRuleNonEvent> it = m.values ().iterator ();

        while (it.hasNext ())
        {
            final IBMSRuleNonEvent bms = (IBMSRuleNonEvent) it.next ();
            if (bmsType.equals (bms.getBmsType ()))
            {
                determineParams (bms.getComparableValues ().iterator ());
                determineParams (bms.getRequiredParamValues ().iterator ());
            }
        }

    }

    /**
     * (non-Javadoc)
     * Add parameters to params class variable.
     *
     * @param it the it
     * @return true, if successful
     */
    private boolean determineParams (final Iterator<String> it)
    {
        // This will match all xml fields set to a value. Except for case tpe and event id which
        while (it.hasNext ())
        {
            final String paramName = ((String) it.next ()).substring (3).toUpperCase ();
            params.put (paramName, null);
        }
        return false;
    }

    /**
     * Gets the BMS rules.
     *
     * @return the BMS rules
     */
    private BMSRuleNonEventList getBMSRules ()
    {
        return iom.getBMSRulesNonEvents (section);
    }

    /**
     * (non-Javadoc)
     * Return bms xml tags as string.
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
     * Adds a tag to a string.
     * PJR
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
     * Adds a start or end tag to a string.
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
