package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * Gets a timestamp from a JDBC result set.
 * 
 * @author MichaelB
 *
 */
public class TimestampReader implements Reader {

	public String getValue(ResultSet rs, int pos) throws SQLException {
        Timestamp atime = rs.getTimestamp(pos);
        
        if ( atime != null && !rs.wasNull() ) {
            SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
            dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
            return dateFormat.format(atime);
        }
        else {
            return "";
        }
	}

}
