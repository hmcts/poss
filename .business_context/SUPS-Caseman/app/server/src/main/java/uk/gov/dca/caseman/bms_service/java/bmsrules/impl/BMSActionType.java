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

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSActionTypes;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-2005.
 *
 * @author Amjad Khan
 */
public class BMSActionType implements IBMSActionTypes
{
    
    /** The Constant ACTIONTYPES_TAG. */
    private static final String ACTIONTYPES_TAG = "ActionTypes";
    
    /** The Constant ACTIONTYPE_TAG. */
    private static final String ACTIONTYPE_TAG = "ActionType";
    
    /** The Constant BMSTYPE_TAG. */
    private static final String BMSTYPE_TAG = "BmsType";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;

    /** The action type. */
    private String actionType;
    
    /** The bms type. */
    private String bmsType = null;

    /**
     * Constructor.
     * 
     * @param actionType The action type
     * @param bmsType The bms type
     */
    public BMSActionType (final String actionType, final String bmsType)
    {
        setActionType (actionType);
        setBmsType (bmsType);
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public BMSActionType ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Sets the action type.
     *
     * @param actionType the new action type
     */
    public void setActionType (final String actionType)
    {
        this.actionType = actionType;
    }

    /**
     * Sets the bms type.
     *
     * @param bmsType the new bms type
     */
    public void setBmsType (final String bmsType)
    {
        this.bmsType = bmsType;
    }

    /**
     * {@inheritDoc}
     */
    public String getActionType ()
    {
        return actionType;
    }

    /**
     * {@inheritDoc}
     */
    public String getBmsType ()
    {
        return bmsType;
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
        else if ( !(obj instanceof BMSActionType))
        {
            return false;
        }

        final BMSActionType objType = (BMSActionType) obj;
        if (actionType != null && !actionType.equals (objType.actionType))
        {
            return false;
        }
        else if (bmsType != null && !bmsType.equals (objType.bmsType))
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
        if (actionType != null)
        {
            result = 37 * result + actionType.hashCode ();
        }
        if (bmsType != null)
        {
            result = 37 * result + bmsType.hashCode ();
        }
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSActionTypes#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, ACTIONTYPES_TAG, false);
        addXMLTagValues (strBuf, actionType, ACTIONTYPE_TAG);
        addXMLTagValues (strBuf, bmsType, BMSTYPE_TAG);
        addXMLTag (strBuf, ACTIONTYPES_TAG, true);
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return out.outputString (builder.build (new StringReader (strBuf.toString ())).getRootElement ());
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
     * (non-Javadoc).
     *
     * @return the string
     * @see java.lang.Object#toString()
     */
    public String toString ()
    {
        return "[ BMSActionType OBJECT = \n" + ACTIONTYPE_TAG + " = " + actionType + "," + BMSTYPE_TAG + " = " +
                bmsType + "]";
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
