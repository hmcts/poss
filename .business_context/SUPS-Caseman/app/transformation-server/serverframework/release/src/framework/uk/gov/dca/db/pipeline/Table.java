package uk.gov.dca.db.pipeline;

/**
 * Contains the description of a table to be used in the construction of SQL
 * statements in order to statify queries against a template.
 * 
 * @author Howard Henson
 */
public class Table implements Comparable {

    private String m_alias;
    private String m_name;
    
    /**
     * Constructs the table.
     * 
     * @param name
     * @param alias
     */
    public Table(String name, String alias){
        super();
        m_name = name;
        m_alias = alias;
    }
    
    /**
     * Copy constructor.  Performs a deep copy of a table object
     * 
     * @param table
     */
    public Table(Table table) {
    	m_alias = table.m_alias;
    	m_name = table.m_name;
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     */
    public int compareTo(Object obj) {
        return toString().compareTo(obj);
    }

    public int hashCode() {
        return toString().hashCode();
    }
    

    public boolean equals(Object obj) {
        return toString().equals(obj);
    }
    
     /**
     * Returns the table information in the form of a string that can be used in
     * a SQL statement.
     */
    public String toString() {
        return m_name + (m_alias == null ? "" : " " + m_alias);
    }

    /**
     * @return Returns the alias.
     */
    public String getAlias() {
        return m_alias;
    }

    /**
     * @return Returns the name.
     */
    public String getName() {
        return m_name;
    }
    
}