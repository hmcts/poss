package uk.gov.dca.db.security.serversecret;

import org.apache.commons.logging.Log;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

/**
 * @author Imran Patel
 */
public class GetNextSecretCommand implements Command {

	/**
	 * Package visibility constructor to prevent direct manipulation of server secret from external code
	 */
	public GetNextSecretCommand(SecretGenerationStrategy generator, String datasourceId) {
		super();
		
		this.generator = generator;
		this.datasourceId = datasourceId;
	}
	
	/**
	 * 
	 * @param observer
	 */
	public void setObserver(SecretChangeObserver observer) {
		this.observer = observer;
	}

	/**
	 * @see uk.gov.dca.db.impl.command.Command#execute()
	 */
	public void execute() throws BusinessException, SystemException {
		Calendar expiryTime = Calendar.getInstance();
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement selectStatement = null;
		ResultSet results = null; 
		
		try {
			// select record for update
            datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if(datasource == null)
				throw new SystemException("Datasource retrieved using ServiceLocator was null");
			            
			con = datasource.getConnection();

			selectStatement = con.prepareStatement(SELECT_STATEMENT);
            
			results = selectStatement.executeQuery();
			
			if(results.next()) {
				Timestamp time = results.getTimestamp(1);
				log.debug("execute : timestamp of current server_secret is "+time.toGMTString());
				if((new Date()).before(time)) {
					log.debug("execute : retrieving current server_secret as it is valid");
					String secret = results.getString(2);
					expiryTime.setTimeInMillis(time.getTime());
				}
				else {
					log.debug("execute : creating new server_secret as expired");
					createSecret(con, false);
				}
			}
			else {
				log.debug("execute : creating new server_secret as db doesn't contain one");
				createSecret(con, true);
			}
		}
		catch(SQLException e) {
            log.error("Error retrieving server_secret: " + e.getMessage());
            if(log.isInfoEnabled()){
                log.error("Error retrieving server_secret: ", e);                
            }
			throw new SystemException("Error retrieving server_secret: " + e.getMessage(), e);
		}
		finally {
            DBUtil.quietClose(results);
            DBUtil.quietClose(selectStatement);
            DBUtil.quietClose(con);
	    }
	}
	
	private void createSecret(Connection con, boolean notExists) throws SystemException, SQLException
    {
        PreparedStatement ps = null;
		try
        {
            String secret = generator.generateSecret();
            Calendar expiryTime = generator.getNewExpiryDate();
            //if there is an observer then notify it of the fact that the secret has changed
            if(observer != null) {
                observer.secretChanged(secret, expiryTime);
            }
            // now update database with new values
            if(notExists)
                ps = con.prepareStatement(INSERT_STATEMENT);
            else ps = con.prepareStatement(UPDATE_STATEMENT);

            ps.setTimestamp(1, new Timestamp(expiryTime.getTime().getTime()));
            ps.setString(2, secret);
            if(notExists)
                ps.execute();
            else {
                int updates = ps.executeUpdate();

                if ( updates == 0 ) {
                    throw new SystemException("Error updating the server_secret, record not found");
                }
            }
        }
        finally
        {
            DBUtil.quietClose(ps);
        }
	}
		
	
		private final static String SELECT_STATEMENT = "SELECT EXPIRY_DATE, SECRET FROM SERVER_SECRET WHERE SERVER_SECRET_ID = 1 FOR UPDATE";
		private final static String UPDATE_STATEMENT = "UPDATE SERVER_SECRET SET EXPIRY_DATE = ?, SECRET = ? WHERE SERVER_SECRET_ID = 1";
		private final static String INSERT_STATEMENT = "INSERT INTO SERVER_SECRET (SERVER_SECRET_ID, EXPIRY_DATE, SECRET) VALUES (1,?,?)";
		
		private SecretGenerationStrategy generator = null;
		private SecretChangeObserver observer = null;
		
		private String datasourceId = null;
		private static final Log log = SUPSLogFactory.getLogger(GetNextSecretCommand.class);
}
