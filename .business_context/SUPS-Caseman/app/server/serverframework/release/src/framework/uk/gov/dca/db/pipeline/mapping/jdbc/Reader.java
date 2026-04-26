package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Reads a value from a result set.  Caller must determine if the type
 * is appropriate.
 * 
 * @author MichaelB
 *
 */
public interface Reader {

	String getValue(ResultSet rs, int pos) throws SQLException;
	
}
