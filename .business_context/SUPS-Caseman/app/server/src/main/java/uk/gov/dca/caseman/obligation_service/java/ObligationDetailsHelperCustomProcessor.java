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

import java.io.IOException;
import java.io.StringReader;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRule;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.impl.ObligationFactory;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Created on 17-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 25-Jul-2006 Paul Roberts: Logging. Remove unused variables.
 * 28-Jan-2013 Chris Vincent: getOblRules() now retrieves with String event id instead of integer. Trac 4767.
 *
 * @author Amjad Khan
 */
public class ObligationDetailsHelperCustomProcessor implements ICustomProcessor
{

    /** The Constant OBLIGATION_TAG. */
    private static final String OBLIGATION_TAG = "MaintainObligations";
    
    /** The Constant MULTIUSE_TAG. */
    private static final String MULTIUSE_TAG = "MultiUse";
    
    /** The Constant DS_TAG. */
    private static final String DS_TAG = "ds";
    
    /** The Constant DEFAULTDAYS_TAG. */
    private static final String DEFAULTDAYS_TAG = "DefaultDays";
    
    /** The Constant BLANK. */
    private static final String BLANK = "";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The event ID. */
    private String eventID;
    
    /** The obligation type. */
    private String obligationType;
    
    /** The iom. */
    private IObligationManager iom;

    /**
     * Constructor.
     */
    public ObligationDetailsHelperCustomProcessor ()
    {

    }

    /**
     * Processes the passed pipeline parameters document.
     * 
     * <params>
     * <param name="obligationType">8</param>
     * <param name="eventID">49</param>
     * </params>
     *
     * @param params the params
     * @return the document
     * @throws SystemException the system exception
     */
    public Document process (final Document params) throws SystemException
    {
        processInputParams (params);
        return convertToDoc ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log) throws SystemException
    {
        processInputParams (params);

        try
        {
            writer.write (toXML ());
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
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
     * Get an obligations xml fragment.
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
     * Read input params and set class variables - eventID and obligationType.
     *
     * @param params the params
     */
    private void processInputParams (final Document params)
    {
        iom = ObligationFactory.getObligationManager ();
        final List<Element> elements = params.getRootElement ().getChildren ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("param"))
            {
                final String nameAtt = current.getAttributeValue ("name");
                if (nameAtt != null)
                {

                    if (nameAtt.equals ("eventID"))
                    {
                        eventID = current.getValue ();
                    }
                    if (nameAtt.equals ("obligationType"))
                    {
                        obligationType = current.getValue ();
                    }
                }
            }
        }
    }

    /**
     * Gets the multi use.
     *
     * @param obligationType the obligation type
     * @return the multi use
     */
    private boolean getMultiUse (final String obligationType)
    {
        return iom.getObligationTypes (obligationType).getMultiUse ();
    }

    /**
     * Gets the obl rules.
     *
     * @return the obl rules
     */
    private IObligationRule getOblRules ()
    {
        return iom.getObligationRules (eventID);
    }

    /**
     * (non-Javadoc)
     * Create an obligations dom fragment
     * <ds>
     * <MaintainObligations>
     * <DefaultDays>0</DefaultDays>
     * <Multiuse>true</Multiuse>
     * </MaintainObligations>
     * </ds>.
     *
     * @return the string
     */
    private String toXML ()
    {
        final StringBuffer strBuf = new StringBuffer ();

        addXMLTag (strBuf, DS_TAG, false);
        addXMLTag (strBuf, OBLIGATION_TAG, false);
        if (getOblRules () != null && getOblRules ().getObligationType ().equals (obligationType))
        {
            addXMLTagValues (strBuf, getOblRules ().getDefaultDaysStr (), DEFAULTDAYS_TAG);
            addXMLTagValues (strBuf, Boolean.toString (getMultiUse (obligationType)), MULTIUSE_TAG);
        }
        else if (iom.getObligationTypes (obligationType) != null)
        {
            addXMLTagValues (strBuf, BLANK, DEFAULTDAYS_TAG);
            addXMLTagValues (strBuf, Boolean.toString (getMultiUse (obligationType)), MULTIUSE_TAG);
        }
        else
        {
            addXMLTagValues (strBuf, BLANK, DEFAULTDAYS_TAG);
            addXMLTagValues (strBuf, BLANK, MULTIUSE_TAG);
        }
        addXMLTag (strBuf, OBLIGATION_TAG, true);
        addXMLTag (strBuf, DS_TAG, true);
        return strBuf.toString ();
    }

    /**
     * (non-Javadoc)
     * Add start tag, value and endtag to a stringbuffer.
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
     * Add start or end tag to a string buffer.
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