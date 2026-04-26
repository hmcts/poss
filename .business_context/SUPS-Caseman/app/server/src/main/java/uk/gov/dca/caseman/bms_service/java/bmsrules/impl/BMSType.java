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
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.io.IOException;
import java.io.StringReader;

import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSTypes;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Amjad Khan
 */
public class BMSType implements IBMSTypes
{
    
    /** The Constant CASETYPES_TAG. */
    private static final String CASETYPES_TAG = "CaseTypes";
    
    /** The Constant CASETYPE_TAG. */
    private static final String CASETYPE_TAG = "CaseType";
    
    /** The Constant COURTTYPE_TAG. */
    private static final String COURTTYPE_TAG = "CourtType";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;

    /** The case type. */
    private String caseType = null;
    
    /** The court type. */
    private String courtType = null;

    /**
     * Constructor.
     * 
     * @param caseType The case type
     * @param courtType The court type
     */
    public BMSType (final String caseType, final String courtType)
    {
        setCaseType (caseType);
        setCourtType (courtType);
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public BMSType ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Sets the case type.
     *
     * @param caseType the new case type
     */
    public void setCaseType (final String caseType)
    {
        this.caseType = caseType;
    }

    /**
     * Sets the court type.
     *
     * @param courtType the new court type
     */
    public void setCourtType (final String courtType)
    {
        this.courtType = courtType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCaseType ()
    {
        return caseType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCourtType ()
    {
        return courtType;
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
        else if ( !(obj instanceof BMSType))
        {
            return false;
        }

        final BMSType objType = (BMSType) obj;
        if (caseType != null && !caseType.equals (objType.caseType))
        {
            return false;
        }
        else if (courtType != null && !courtType.equals (objType.courtType))
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
        if (caseType != null)
        {
            result = 37 * result + caseType.hashCode ();
        }
        if (courtType != null)
        {
            result = 37 * result + courtType.hashCode ();
        }
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSTypes#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, CASETYPES_TAG, false);
        addXMLTagValues (strBuf, caseType, CASETYPE_TAG);
        addXMLTagValues (strBuf, courtType, COURTTYPE_TAG);
        addXMLTag (strBuf, CASETYPES_TAG, true);
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return out.outputString (builder.build (new StringReader (strBuf.toString ())).getRootElement ());
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
     * (non-Javadoc).
     *
     * @return the string
     * @see java.lang.Object#toString()
     */
    public String toString ()
    {
        return "[" + CASETYPES_TAG + " OBJECT = \n" + CASETYPE_TAG + " = " + caseType + "," + COURTTYPE_TAG + " = " +
                courtType + "]";
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
