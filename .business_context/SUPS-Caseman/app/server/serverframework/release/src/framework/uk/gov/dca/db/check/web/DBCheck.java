/*
 * Created on 21-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;

/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 */
public class DBCheck extends AbstractCheck
{
    String sql = "SELECT COUNT(*) AS NUM_USERS FROM DCA_USER";
    
    public String execute()
    {
        DataSource ds = null;
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String result;
        
        try
        {
            final ConfigUtil config = ConfigUtil.create(FrameworkConfigParam.PROJECT_CONFIG.getValue());   
            ds = (DataSource)config.get("");
            cn = ds.getConnection();
            ps = cn.prepareStatement(sql);
            rs = ps.executeQuery();
            
            if (rs.next())
            {
                rs.getInt("NUM_USERS");
                result = "Success";
            }
            else
            {
                throw new Exception("Unable to count courts");
            }
        }
        catch (Exception e)
        {
            result = "Failed, " + e.getMessage();
        }
        finally
        {
            DBUtil.quietClose(cn);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(rs);
        }
        
        return result;
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.ediary.reports.web.Check#getName()
     */
    public String getName()
    {
        return "Database Check";
    }
}
