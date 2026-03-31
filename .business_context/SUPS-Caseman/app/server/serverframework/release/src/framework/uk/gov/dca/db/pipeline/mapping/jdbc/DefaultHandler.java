package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Default handling of types from a JDBC result set.
 * 
 * @author MichaelB
 *
 */
public class DefaultHandler implements Handler {
	
	private final static DefaultHandler INSTANCE = new DefaultHandler();

	private Reader dateReader = new DateReader();
	private Reader timestampReader = new TimestampReader();
	private Reader arrayReader = new ArrayReader();
	private Reader objectReader = new ObjectReader();
	
    public String getValue(int type, ResultSet rs, int pos) throws SQLException {
    	
        switch(type) {
            case Types.DATE:
            	return dateReader.getValue(rs, pos);
                
            case Types.TIMESTAMP:
            	return timestampReader.getValue(rs, pos);
                
            case Types.ARRAY:
            	return arrayReader.getValue(rs, pos);
                
            default:
            	return objectReader.getValue(rs, pos);
        }
    }   
    
    public final static DefaultHandler getDefault() {
    	return INSTANCE;
    }
}
