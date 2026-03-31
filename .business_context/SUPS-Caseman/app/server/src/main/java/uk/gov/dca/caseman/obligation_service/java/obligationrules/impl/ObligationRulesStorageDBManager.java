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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRulesStorageManager;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 02-Mar-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *
 * @author Amjad Khan
 */
public class ObligationRulesStorageDBManager implements IObligationRulesStorageManager
{
    
    /** The Constant log. */
    private static final Log log = LogFactory.getLog (ObligationRulesStorageDBManager.class);
    
    /** The Constant OBLIGATION_SERVICE. */
    private static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    
    /** The Constant GET_OBLIGATIONTYPES. */
    private static final String GET_OBLIGATIONTYPES = "getObligationTypesLocal";
    
    /** The Constant GET_OBLIGATIONRULES. */
    private static final String GET_OBLIGATIONRULES = "getObligationRulesLocal";
    
    /** The Constant GET_OBLIGATIONRULESEVENTS. */
    private static final String GET_OBLIGATIONRULESEVENTS = "getObligationRulesEventsLocal";

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The out. */
    private final XMLOutputter out;

    /**
     * Constructor.
     */
    public ObligationRulesStorageDBManager ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationTypes () throws BusinessException, SystemException
    {
        try
        {
            return proxy.getJDOM (OBLIGATION_SERVICE, GET_OBLIGATIONTYPES, "<params><param></param></params>");
        }
        catch (final BusinessException e)
        {
            throw new BusinessException ("Unable to Load Obligation Types from Database: " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRulesEvents () throws BusinessException, SystemException
    {
        try
        {
            return proxy.getJDOM (OBLIGATION_SERVICE, GET_OBLIGATIONRULES, "<params/>");
        }
        catch (final BusinessException e)
        {
            throw new BusinessException ("Unable to Load Obligation Rules Events from Database: " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRules () throws BusinessException, SystemException
    {

        try
        {
            return proxy.getJDOM (OBLIGATION_SERVICE, GET_OBLIGATIONRULESEVENTS, "<params/>");
        }
        catch (final BusinessException e)
        {
            throw new BusinessException ("Unable to Load Obligation Rules from Database: " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public Document getObligationRulesAE ()
    {
        return new Document ();
    }

}
