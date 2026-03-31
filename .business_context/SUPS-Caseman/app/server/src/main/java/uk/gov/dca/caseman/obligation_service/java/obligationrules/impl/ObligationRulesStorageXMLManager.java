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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRulesStorageManager;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Created on 04-Mar-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author Amjad Khan
 */
public class ObligationRulesStorageXMLManager implements IObligationRulesStorageManager
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationRulesStorageXMLManager.class);
    
    /** The Constant OBJRULES. */
    private static final String OBJRULES = "uk/gov/dca/caseman/obligation_service/xml/ObligationRules.xml";
    
    /** The Constant OBJTYPES. */
    private static final String OBJTYPES = "uk/gov/dca/caseman/obligation_service/xml/ObligationTypes.xml";
    
    /** The Constant OBJRULES_AE. */
    private static final String OBJRULES_AE = "uk/gov/dca/caseman/obligation_service/xml/ObligationsAEList.xml";

    /**
     * Constructor.
     */
    public ObligationRulesStorageXMLManager ()
    {
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationTypes () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (OBJTYPES, this));
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to Load XML Obligation Types= " + e.getMessage (), e);
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to Load XML Obligation Types= " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRules () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (OBJRULES, this));
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to Load XML Obligation Rules = " + e.getMessage (), e);
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to Load XML Obligation Rules = " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRulesAE () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (Util.getInputSource (OBJRULES_AE, this));
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to Load XML Obligation AE List = " + e.getMessage (), e);
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to Load XML Obligation AE List = " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRulesEvents () throws SystemException
    {
        return new Document ();
    }

}
