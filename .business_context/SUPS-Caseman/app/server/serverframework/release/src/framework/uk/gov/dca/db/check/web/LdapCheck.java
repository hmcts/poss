/*
 * Created on 21-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import javax.naming.ldap.LdapContext;

import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.ldap.LdapUtil;


/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 */
public class LdapCheck extends AbstractCheck
{

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#execute()
     */
    public String execute()
    {
        LdapContext ctx = null;
        String result;
        try
        {
            LdapUtil lu = LdapUtil.getInstance();
            ctx = lu.getContext();
            LdapContext o = (LdapContext) ctx.lookup(lu.getUser());
            if (o != null)
            {
                result = "Success";                
            }
            else
            {
                result= "Faild, Ldap user not found";
            }
        }
        catch (Exception e)
        {
            result = "Failed, " + e.getMessage();
        }
        finally
        {
            DBUtil.quietClose(ctx);
        }
        
        return result;
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#getName()
     */
    public String getName()
    {
        return "LDAP Check";
    }

}
