/*
 * Created on 18-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.output.Context;
import uk.gov.dca.db.pipeline.mapping.sql.Paged;
import uk.gov.dca.db.pipeline.mapping.sql.Statement;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

public class SQLExecutor extends  AbstractExecutor {

    private final static Log sqllog = SUPSLogFactory.getLogger(SupsConstants.SQL_LOG);
    private final StatementFactory m_statementFactory;
    private PreparedStatement m_ps = null;
    private ResultSet m_rs = null;
    private Connection m_cn = null;
    private ResultSetMetaData m_rsmd = null;
    private boolean isOpen = false;
    private Map columnAliases;
	private String m_name;
    
    public SQLExecutor(String name, StatementFactory statementFactory, Map customHandlers) {
    	super(customHandlers);
        m_statementFactory = statementFactory;
        m_name = name;
    }

    /**
     * Creates the prepared statement, opens the connection to the database, opens
     * the result set and gets the meta data.
     * @throws BusinessException 
     */
    public void open(Connection cn, Document inputXML, Context context) throws SystemException, BusinessException {
        
        Statement st = m_statementFactory.getStatement(inputXML, context);
        columnAliases = st.getColumnAliases();
        String sql = st.getSQL();
        try {
            m_ps = cn.prepareStatement(sql);
            int idx = 1;
            for (Iterator i = st.getDependentVariables().iterator(); i.hasNext();) {
                String variable = (String) i.next();
                Object value = context.getValue(variable);
                if (value != null) {
                    m_ps.setObject(idx, value);
                }
                else {
                    m_ps.setNull(idx, Types.VARCHAR);
                }
                idx++;
            }
            if (m_statementFactory.isPaged()) {
                Paged paged = (Paged) m_statementFactory;
                int pageNum = paged.getPageNumber(context);
                int pageSize = paged.getPageSize(context);
                int first = (pageNum-1) * pageSize;
                int last = pageNum * pageSize +1;
                m_ps.setInt(idx++, last);
                m_ps.setInt(idx++, first);
            }
            if (sqllog.isInfoEnabled()) {
            	DBUtil.logSql(sqllog, m_name, st.getSQL());            	
            }
            m_rs = m_ps.executeQuery();
            m_rsmd = m_rs.getMetaData();
            isOpen = true;
        }
        catch (SQLException e) {
            throw new SystemException("Unable to open executor, SQL: " + sql + " error: " + e.getMessage(), e);
        }
    }
    
    /**
     * Moves onto the next row in the result set if possible.
     */
    public boolean next() throws SystemException {
        try {
            if (isOpen) {
                return m_rs.next();            
            }
            else {
                throw new SystemException("The SQL Executor has not been opened property");
            }            
        }
        catch (SQLException e) {
            throw new SystemException("Unable to move to next cursor row: " + e.getMessage(), e);
        }
    }
    

    /**
     * Loads the current rows in the supplied context.
     * 
     * @throws SystemException 
     */
    public void load(Context context) throws SystemException {
        
        try {
        	loadRow(m_rs, m_rsmd, columnAliases, context);
        	/*
            for (int i = 1; i <= m_rsmd.getColumnCount(); i++) {
                String column = m_rsmd.getColumnName(i);
                int type = m_rsmd.getColumnType(i);
                String value = getValue(column, type, m_rs, i);
                if (columnAliases.containsKey(column)) {
                    column = (String) columnAliases.get(column);
                }
                context.setValue(column, value);
            } 
            */                   
        }
        catch (SQLException e) {
            throw new SystemException("Unable to load row from database: " + e.getMessage(), e);
        }
        
    }
    
    
    /**
     * Closes all of the open database resources.
     */
    public void close() {
        DBUtil.quietClose(m_rs);
        DBUtil.quietClose(m_ps);
        DBUtil.quietClose(m_cn);
        isOpen = false;
    }

    public boolean isCacheable() {
        // TODO Auto-generated method stub
        return false;
    }
    
}
