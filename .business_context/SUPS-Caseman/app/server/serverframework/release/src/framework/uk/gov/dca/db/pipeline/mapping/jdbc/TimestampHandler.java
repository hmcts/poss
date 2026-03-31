package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * Handles all dates as timestamps.
 * 
 * @author MichaelB
 *
 */
public class TimestampHandler implements Handler {

	private Reader timestampReader = new TimestampReader();
	private Reader arrayReader = new ArrayReader();
	private Reader objectReader = new ObjectReader();
	
    public String getValue(int type, ResultSet rs, int pos) throws SQLException {
    	
        switch(type) {
            case Types.DATE:
            case Types.TIMESTAMP:
            	return timestampReader.getValue(rs, pos);
                
            case Types.ARRAY:
            	return arrayReader.getValue(rs, pos);
                
            default:
            	return objectReader.getValue(rs, pos);
        }
    }    

}
