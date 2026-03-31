package uk.gov.dca.db.pipeline.mapping.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Handles get values from a result set.  Handles different types
 * appropriately.
 * 
 * @author MichaelB
 *
 */
public interface Handler {

    public String getValue(int type, ResultSet rs, int pos) throws SQLException;

	
}
