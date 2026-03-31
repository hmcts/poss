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
package uk.gov.dca.caseman.reports_service.classes;

import java.util.Map;

/**
 * The Class CommandLineBuilder.
 *
 * @author Doug Satchwell, Alex Peterson
 */
public class CommandLineBuilder
{
    
    /** The server. */
    private String server;
    
    /** The databaselogin. */
    private String databaselogin;
    
    /** The courtcode. */
    private String courtcode;
    
    /** The courtuser. */
    private String courtuser;
    
    /** The report. */
    private String report;
    
    /** The desformat. */
    private String desformat;
    
    /** The destype. */
    private String destype;
    
    /** The desname. */
    private String desname;
    
    /** The parameters. */
    private Map<String, String> parameters;  // guess-work - class is apparently unused

    /**
     * Builds the command line.
     * 
     * @return The command line.
     */
    public String buildCommandLine ()
    {
        String cmd = "server=" + server + " userid=" + databaselogin + " p_court_code=" + courtcode +
                " p_submitted_by=" + courtuser + " report=" + report + " desformat=" + desformat + " destype=" +
                destype + " desname=" + desname;

        final StringBuffer parms = new StringBuffer ();
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            //final Map.Entry<String, String> entry = (Map.Entry) iter.next ();
            parms.append (" " + entry.getKey () + "=" + entry.getValue ());
        }
        cmd += parms.toString ();
        return cmd;
    }

    // eclipse-generated gettersandsetters...

    /**
     * Gets the courtcode.
     *
     * @return the courtcode
     */
    public String getCourtcode ()
    {
        return courtcode;
    }

    /**
     * Sets the courtcode.
     *
     * @param courtcode the new courtcode
     */
    public void setCourtcode (final String courtcode)
    {
        this.courtcode = courtcode;
    }

    /**
     * Gets the courtuser.
     *
     * @return the courtuser
     */
    public String getCourtuser ()
    {
        return courtuser;
    }

    /**
     * Sets the courtuser.
     *
     * @param courtuser the new courtuser
     */
    public void setCourtuser (final String courtuser)
    {
        this.courtuser = courtuser;
    }

    /**
     * Gets the databaselogin.
     *
     * @return the databaselogin
     */
    public String getDatabaselogin ()
    {
        return databaselogin;
    }

    /**
     * Sets the databaselogin.
     *
     * @param databaselogin the new databaselogin
     */
    public void setDatabaselogin (final String databaselogin)
    {
        this.databaselogin = databaselogin;
    }

    /**
     * Gets the desformat.
     *
     * @return the desformat
     */
    public String getDesformat ()
    {
        return desformat;
    }

    /**
     * Sets the desformat.
     *
     * @param desformat the new desformat
     */
    public void setDesformat (final String desformat)
    {
        this.desformat = desformat;
    }

    /**
     * Gets the desname.
     *
     * @return the desname
     */
    public String getDesname ()
    {
        return desname;
    }

    /**
     * Sets the desname.
     *
     * @param desname the new desname
     */
    public void setDesname (final String desname)
    {
        this.desname = desname;
    }

    /**
     * Gets the destype.
     *
     * @return the destype
     */
    public String getDestype ()
    {
        return destype;
    }

    /**
     * Sets the destype.
     *
     * @param destype the new destype
     */
    public void setDestype (final String destype)
    {
        this.destype = destype;
    }

    /**
     * Gets the parameters.
     *
     * @return the parameters
     */
    public Map<String, String> getParameters ()
    {
        return parameters;
    }

    /**
     * Sets the parameters.
     *
     * @param parameters the new parameters
     */
    public void setParameters (final Map<String, String> parameters)
    {
        this.parameters = parameters;
    }

    /**
     * Gets the report.
     *
     * @return the report
     */
    public String getReport ()
    {
        return report;
    }

    /**
     * Sets the report.
     *
     * @param report the new report
     */
    public void setReport (final String report)
    {
        this.report = report;
    }

    /**
     * Gets the server.
     *
     * @return the server
     */
    public String getServer ()
    {
        return server;
    }

    /**
     * Sets the server.
     *
     * @param server the new server
     */
    public void setServer (final String server)
    {
        this.server = server;
    }
}
