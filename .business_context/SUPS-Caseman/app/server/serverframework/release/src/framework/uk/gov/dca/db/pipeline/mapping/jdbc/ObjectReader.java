package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;

import oracle.sql.ROWID;

/**
 * Default reader for items from a result set.  Simply
 * gets an object and returns a string.
 * 
 * @author MichaelB
 *
 */
public class ObjectReader implements Reader {

	public String getValue(ResultSet rs, int pos) throws SQLException {
        Object resultItem = rs.getObject(pos);
        String result;
        
        if ( resultItem != null && !rs.wasNull()) {
        	if (resultItem instanceof ROWID) { 
                result = ((ROWID) resultItem).stringValue();
        	}
        	else {
                result = resultItem.toString();
        	}
        }
        else {
            result = "";
        }
        
        return result;
	}

}
