/*
 * Created on 12-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

public class MapNode {

    private final String name;
    private final String[] variables;
    
    public MapNode(String name, String[] variables) {
        this.name = name;
        this.variables = variables;
    }

    /**
     * @return Returns the name.
     */
    public String getName() {
        return name;
    }

    /**
     * @return Returns the variables.
     */
    public String[] getVariables() {
        return variables;
    }
    
    
}
