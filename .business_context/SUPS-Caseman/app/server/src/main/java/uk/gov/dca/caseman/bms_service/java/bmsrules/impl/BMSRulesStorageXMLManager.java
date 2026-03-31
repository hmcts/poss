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
 * TODO LastChangedBy: $ */
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.io.FilterInputStream;
import java.io.IOException;
import java.io.StringWriter;

import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRulesStorageManager;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 
 * @author Amjad Khan
 */
public class BMSRulesStorageXMLManager implements IBMSRulesStorageManager
{

    /** The Constant BMSRULES. */
    private static final String BMSRULES = "uk/gov/dca/caseman/bms_service/xml/BMSRules.xml";

    /** The Constant BMSRULENONEVENT. */
    private static final String BMSRULENONEVENT = "uk/gov/dca/caseman/bms_service/xml/BmsRulesNonEvent.xml";

    /** The Constant BMSCASETYPES. */
    private static final String BMSCASETYPES = "uk/gov/dca/caseman/bms_service/xml/BMSCaseTypes.xml";

    /** The Constant BMSRULENONEVENTACTION. */
    private static final String BMSRULENONEVENTACTION = "uk/gov/dca/caseman/bms_service/xml/BmsRulesNonEventAction.xml";

    /**
     * Constructor.
     */
    public BMSRulesStorageXMLManager ()
    {
    }

    /**
     * {@inheritDoc}
     */
    public Document getCCREFCodes () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (BMSCASETYPES, this));
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
     * {@inheritDoc}
     */
    public Document getBMSRules () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            // parse the Schema agaisnt the XSD to ensure its valid
            // SUPSXMLParser parser = new SUPSXMLParser();
            // parser.parse(getString(BMSRULES), BMSRULES_XSD);
            return builder.build (Util.getInputSource (BMSRULES, this));
            // return builder.build(Util.getInputSource(BMSRULES, this));
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
     * {@inheritDoc}
     */
    public Document getBMSRulesNonEvents () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (BMSRULENONEVENT, this));
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to Load XML BMS Rules Non Events.", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to Load XML BMS Rules Non Events.", e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getBMSRulesNonEventsAction () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (BMSRULENONEVENTACTION, this));
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to Load XML BMS Rules Non Event Actions.", e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to Load XML BMS Rules Non Event Actions.", e);
        }
    }

    /**
     * Returns file name string for given file name.
     *
     * @param fileName The filename
     * @return The file name string
     * @throws SystemException the system exception
     */
    public String getString (final String fileName) throws SystemException
    {

        try (final FilterInputStream in = (FilterInputStream) Util.getInputStream (BMSRULES, this);
                final StringWriter out = new StringWriter (in.available ()))
        {
            while (in.available () != 0)
            {
                out.write (in.read ());
            }
            return out.toString ();
        }
        catch (final IOException e)
        {
            throw new SystemException ("Exception thrown in getFileString.", e);
        }
    }

}
