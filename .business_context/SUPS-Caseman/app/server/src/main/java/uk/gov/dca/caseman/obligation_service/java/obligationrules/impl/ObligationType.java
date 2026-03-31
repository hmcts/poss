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
package uk.gov.dca.caseman.obligation_service.java.obligationrules.impl;

import java.io.IOException;
import java.io.StringReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationTypes;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 15-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author Amjad Khan
 */
public class ObligationType implements IObligationTypes
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationType.class);

    /** The Constant OBLIGATIONTYPES_TAG. */
    private static final String OBLIGATIONTYPES_TAG = "ObligationTypes";
    
    /** The Constant OBLIGATIONTYPE_TAG. */
    private static final String OBLIGATIONTYPE_TAG = "ObligationType";
    
    /** The Constant OBLIGATIONDESCRIPTION_TAG. */
    private static final String OBLIGATIONDESCRIPTION_TAG = "ObligationDescription";
    
    /** The Constant MULITUSE_TAG. */
    private static final String MULITUSE_TAG = "MultiUse";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;

    /** The obligation type. */
    private String obligationType;
    
    /** The obligation description. */
    private String obligationDescription;
    
    /** The multi use. */
    private boolean multiUse;

    /**
     * Constructor.
     * 
     * @param obligationType The obligation type.
     * @param obligationDescription The obligation description.
     * @param multiUse True false multi use string.
     */
    public ObligationType (final String obligationType, final String obligationDescription, final String multiUse)
    {
        setObligationType (obligationType);
        setObligationDescription (obligationDescription);
        setMultiUse (Boolean.valueOf (multiUse).booleanValue ());
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public ObligationType ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Sets the obligation type.
     *
     * @param obligationType the new obligation type
     */
    public void setObligationType (final String obligationType)
    {
        this.obligationType = obligationType;
    }

    /**
     * Sets the obligation description.
     *
     * @param obligationDescription the new obligation description
     */
    public void setObligationDescription (final String obligationDescription)
    {
        this.obligationDescription = obligationDescription;
    }

    /**
     * Sets the multi use.
     *
     * @param multiUse the new multi use
     */
    public void setMultiUse (final boolean multiUse)
    {
        this.multiUse = multiUse;
    }

    /**
     * {@inheritDoc}
     */
    public String getObligationType ()
    {
        return obligationType;
    }

    /**
     * {@inheritDoc}
     */
    public String getObligationDescription ()
    {
        return obligationDescription;
    }

    /**
     * {@inheritDoc}
     */
    public boolean getMultiUse ()
    {
        return multiUse;
    }

    /**
     * (non-Javadoc).
     *
     * @param obj the obj
     * @return true, if successful
     * @see java.lang.Object#equals(java.lang.Object)
     */
    public boolean equals (final Object obj)
    {

        if (obj == this)
        {
            return true;
        }
        else if ( !(obj instanceof ObligationType))
        {
            return false;
        }

        final ObligationType objType = (ObligationType) obj;
        if (obligationType != null && !obligationType.equals (objType.obligationType))
        {
            return false;
        }
        if (obligationDescription != null && !obligationDescription.equals (objType.obligationDescription))
        {
            return false;
        }
        if (multiUse != objType.multiUse)
        {
            return false;
        }
        return true;
    }

    /**
     * (non-Javadoc).
     *
     * @return the int
     * @see java.lang.Object#hashCode()
     */
    public int hashCode ()
    {
        int result = 17;
        if (obligationType != null)
        {
            result = 37 * result + obligationType.hashCode ();
        }
        if (obligationDescription != null)
        {
            result = 37 * result + obligationDescription.hashCode ();
        }
        result = 37 * result + new Boolean (multiUse).hashCode ();
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationTypes#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, OBLIGATIONTYPES_TAG, false);
        addXMLTagValues (strBuf, obligationType, OBLIGATIONTYPE_TAG);
        addXMLTagValues (strBuf, obligationDescription, OBLIGATIONDESCRIPTION_TAG);
        addXMLTagValues (strBuf, Boolean.toString (multiUse), MULITUSE_TAG);
        addXMLTag (strBuf, OBLIGATIONTYPES_TAG, true);
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return out.outputString (builder.build (new StringReader (strBuf.toString ())).getRootElement ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @see java.lang.Object#toString()
     */
    public String toString ()
    {
        return "[" + OBLIGATIONTYPES_TAG + " OBJECT = \n" + OBLIGATIONTYPE_TAG + " = " + obligationType + "," +
                OBLIGATIONDESCRIPTION_TAG + " = " + obligationDescription + "," + MULITUSE_TAG + " = " + multiUse +
                " ]";
    }

    /**
     * Adds the XML tag values.
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
     * Adds the XML tag.
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
