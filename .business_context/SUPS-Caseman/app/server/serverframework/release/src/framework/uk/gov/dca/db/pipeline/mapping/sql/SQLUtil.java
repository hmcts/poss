/*
 * Created on 09-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.util.Collection;
import java.util.regex.Matcher;

import uk.gov.dca.db.pipeline.Query;

public class SQLUtil {
    
    public static String prepareSQL(CharSequence sql, Collection parameters) {
        
        //Find all parameters
        Matcher vars = Query.s_variablePattern.matcher(sql);
        while (vars.find()) {
            //add var to dependent vars list
            String var = vars.group(1).toUpperCase();
            parameters.add(var);
        }
        
        //Replace all parameters with ?
        return vars.replaceAll("?");
    }
    
}
