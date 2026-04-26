package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.lang.reflect.Array;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Handles array types.
 * 
 * @author MichaelB
 *
 */
public class ArrayReader implements Reader {

	public String getValue(ResultSet rs, int pos) throws SQLException {
        Object o = rs.getArray(pos).getArray();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < Array.getLength(o); i++) {
            String val = Array.get(o, i).toString();
            sb.append(val);
            if (i < Array.getLength(o) - 1) {
                sb.append(",");
            }
        }
        return sb.toString();
	}

}
