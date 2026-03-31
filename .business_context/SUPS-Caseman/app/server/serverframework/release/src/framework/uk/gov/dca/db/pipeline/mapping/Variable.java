/*
 * Created on 19-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

/**
 * Represents a variable to be used in a select
 * clause.  Most often the name and the select will
 * be the same.  Allows for aliases functions.  The
 * select will be actual code executed in the select
 * and the name will be value placed in the 'AS' clause
 * when performing the query.
 * 
 * @author Michael Barker
 *
 */
public class Variable implements Comparable {

    private final String name;
    private final String select;
    
    public Variable(String name, String select) {
        this.name = name;
        this.select = select;
    }
    
    public Variable(String column) {
        this.name = column;
        this.select = column;
    }
    
    public String getSelect() {
        return select;
    }
    
    public String getName() {
        return name;
    }
    
    public int hashCode() {
        return name.hashCode();
    }
    
    /**
     * Compares equality.  Equality is if the name of
     * the variable is the same.
     */
    public boolean equals(Object o) {
        if (o != null && o instanceof Variable) {
            Variable v = (Variable) o;
            return name.equals(v.name);
        }
        return false;
    }
    
    public String toSQL() {
        return select + " AS \"" + name + "\"";
    }
    
    public String toString() {
        return name + ":" + select;
    }

    public int compareTo(Object o) {
        return name.compareTo(((Variable)o).name);
    }
}
