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

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRule;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 15-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 28-Jan-2013 Chris Vincent: event id's are now Strings instead of integers. Trac 4767
 *
 * @author Amjad Khan
 */
public class ObligationRule implements IObligationRule
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationRule.class);

    /** The Constant OBLIGATIONRULE_TAG. */
    private static final String OBLIGATIONRULE_TAG = "ObligationRule";
    
    /** The Constant EVENTID_TAG. */
    private static final String EVENTID_TAG = "EventId";
    
    /** The Constant OBLIGATIONTYPE_TAG. */
    private static final String OBLIGATIONTYPE_TAG = "ObligationType";
    
    /** The Constant MAINTEANCEMODE_TAG. */
    private static final String MAINTEANCEMODE_TAG = "MaintenanceMode";
    
    /** The Constant MECHANISM_TAG. */
    private static final String MECHANISM_TAG = "Mechanism";
    
    /** The Constant ACTION_TAG. */
    private static final String ACTION_TAG = "Action";
    
    /** The Constant DEFAULTDAYS_TAG. */
    private static final String DEFAULTDAYS_TAG = "DefaultDays";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";
    
    /** The Constant EMPTY. */
    private static final String EMPTY = "";

    /** The out. */
    private final XMLOutputter out;

    /** The event id. */
    private String eventId;
    
    /** The obligation type. */
    private String obligationType;
    
    /** The maintenance mode. */
    private String maintenanceMode;
    
    /** The mechanism. */
    private String mechanism;
    
    /** The action. */
    private String action;
    
    /** The default days. */
    private int defaultDays;

    /**
     * Constructor.
     * 
     * @param eventID The event id.
     * @param obligationType The obligation type.
     * @param maintenanceMode The maintenance mode.
     * @param mechanism The mechanism.
     * @param action The action.
     * @param defaultDays The default days.
     */
    public ObligationRule (final String eventID, final String obligationType, final String maintenanceMode,
            final String mechanism, final String action, final int defaultDays)
    {
        setEventId (eventID);
        setObligationType (obligationType);
        setMaintenanceMode (maintenanceMode);
        setMechanism (mechanism);
        setAction (action);
        setDefaultDays (defaultDays);
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public ObligationRule ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Sets the event id.
     *
     * @param eventId the new event id
     */
    public void setEventId (final String eventId)
    {
        this.eventId = eventId;
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
     * Sets the maintenance mode.
     *
     * @param maintenanceMode the new maintenance mode
     */
    public void setMaintenanceMode (final String maintenanceMode)
    {
        this.maintenanceMode = maintenanceMode;
    }

    /**
     * Sets the mechanism.
     *
     * @param mechanism the new mechanism
     */
    public void setMechanism (final String mechanism)
    {
        this.mechanism = mechanism;
    }

    /**
     * Sets the action.
     *
     * @param action the new action
     */
    public void setAction (final String action)
    {
        this.action = action;
    }

    /**
     * Sets the default days.
     *
     * @param defaultDays the new default days
     */
    public void setDefaultDays (final int defaultDays)
    {
        this.defaultDays = defaultDays;
    }

    /**
     * {@inheritDoc}
     */
    public String getEventId ()
    {
        return eventId;
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
    public String getMaintenanceMode ()
    {
        return maintenanceMode;
    }

    /**
     * {@inheritDoc}
     */
    public String getMechanism ()
    {
        return mechanism;
    }

    /**
     * {@inheritDoc}
     */
    public String getAction ()
    {
        return action;
    }

    /**
     * {@inheritDoc}
     */
    public int getDefaultDays ()
    {
        return defaultDays;
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
        else if ( !(obj instanceof ObligationRule))
        {
            return false;
        }

        final ObligationRule objRule = (ObligationRule) obj;
        if (action != null && !action.equals (objRule.getAction ()))
        {
            return false;
        }
        if (defaultDays != objRule.defaultDays)
        {
            return false;
        }
        if (eventId != null && !eventId.equals (objRule.eventId))
        {
            return false;
        }
        if (maintenanceMode != null && !maintenanceMode.equals (objRule.maintenanceMode))
        {
            return false;
        }
        if (mechanism != null && !mechanism.equals (objRule.mechanism))
        {
            return false;
        }
        if (obligationType != null && !obligationType.equals (objRule.obligationType))
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
        if (action != null)
        {
            result = 37 * result + action.hashCode ();
        }
        result = 37 * result + defaultDays;
        result = 37 * result + eventId.hashCode ();
        if (maintenanceMode != null)
        {
            result = 37 * result + maintenanceMode.hashCode ();
        }
        if (mechanism != null)
        {
            result = 37 * result + mechanism.hashCode ();
        }
        if (obligationType != null)
        {
            result = 37 * result + obligationType.hashCode ();
        }
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRule#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, OBLIGATIONRULE_TAG, false);
        addXMLTagValues (strBuf, eventId, EVENTID_TAG);
        addXMLTagValues (strBuf, obligationType, OBLIGATIONTYPE_TAG);
        addXMLTagValues (strBuf, mechanism, MECHANISM_TAG);
        addXMLTagValues (strBuf, action, ACTION_TAG);
        addXMLTagValues (strBuf, maintenanceMode, MAINTEANCEMODE_TAG);
        addXMLTagValues (strBuf, getDefaultDaysStr (), DEFAULTDAYS_TAG);
        addXMLTag (strBuf, OBLIGATIONRULE_TAG, true);
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
        return "[" + OBLIGATIONRULE_TAG + " OBJECT = \n" + EVENTID_TAG + " = " + eventId + "," + OBLIGATIONTYPE_TAG +
                " = " + obligationType + "," + MECHANISM_TAG + " = " + mechanism + "," + ACTION_TAG + " = " + action +
                "," + MAINTEANCEMODE_TAG + " = " + maintenanceMode + "," + DEFAULTDAYS_TAG + " = " + defaultDays +
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

    /**
     * {@inheritDoc}
     */
    public String getDefaultDaysStr ()
    {
        return defaultDays != 0 ? Integer.toString (defaultDays) : EMPTY;
    }

}
