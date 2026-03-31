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
package uk.gov.dca.caseman.common.java.sql;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

/**
 * .
 * 
 * @author Michael Barker
 *         class LikeEqualsSQLGenerator
 *
 */
public class LikeEqualsSQLGenerator implements ISQLGenerator
{

    /** String field param. */
    private String param;
    /** String field column. */
    private String column;

    /**
     * .
     * initialise method
     * 
     * @param generateConfig instance of Element
     * @throws SystemException incase SystemException occurs.
     */
    public final void initialise (final Element generateConfig) throws SystemException
    {
        final String param1 = generateConfig.getAttributeValue ("param");
        final String column1 = generateConfig.getAttributeValue ("column");
        if (param1 == null)
        {
            throw new SystemException ("The LikeEqualsSQLGenerator requires that" + "'param' attribute is defined");
        }
        if (column1 == null)
        {
            throw new SystemException (
                    "" + "The LikeEqualsSQLGenerator requires that" + "'column' attribute is defined");
        }

        this.param = param1;
        this.column = column1;
    }

    /**
     * .
     * getPersonalDetailsForUser method
     * 
     * @param s instance of String
     * @return String
     */
    public final String escape (final String s)
    {
        return s.replaceAll ("'", "''");
    }

    /**
     * .
     *
     * The generate method
     * 
     * @param inputXML instance of Document
     * @param context instance of IQueryContextReader
     * @return String
     * @throws BusinessException incase an application occurs
     * @throws SystemException incase SystemException occurs.
     */
    public final String generate (final Document inputXML, final IQueryContextReader context)
        throws BusinessException, SystemException
    {
        String result = null;
        final String value = (String) context.getValue (param);
        if (value != null && value.trim ().length () > 0)
        {
            if (value.indexOf ('%') > -1 || value.indexOf ('_') > -1)
            {
                result = column + " LIKE '" + escape (value) + "'";
            }
            else
            {
                result = column + " = '" + escape (value) + "'";
            }
        }

        return result;
    }

    /**
     * .
     * 
     * @return Object
     * @see java.lang.Object#clone()
     */

    public final Object clone ()
    {
        final LikeEqualsSQLGenerator lesg = new LikeEqualsSQLGenerator ();
        lesg.column = column;
        lesg.param = param;
        return lesg;
    }
}
