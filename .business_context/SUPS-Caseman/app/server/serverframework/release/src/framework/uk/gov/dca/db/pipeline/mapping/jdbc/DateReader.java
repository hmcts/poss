package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

/**
 * Reads a date value from a result set.  The caller is responsable
 * for checking the type is appropriate for this call.
 * 
 * @author MichaelB
 *
 */
public class DateReader implements Reader {

	public String getValue(ResultSet rs, int pos) throws SQLException {
		
		java.sql.Date aDate = rs.getDate(pos);
        
        if ( aDate != null && !rs.wasNull() ) {
            SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
            dateFormat.applyPattern("yyyy-MM-dd");
            return dateFormat.format(aDate);
        }
        else {
            return "";
        }
		
	}
	
}
