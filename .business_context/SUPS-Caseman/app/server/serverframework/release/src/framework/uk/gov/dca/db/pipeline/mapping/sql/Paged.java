/*
 * Created on 05-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;

public interface Paged {

    int getPageNumber(IQueryContextReader context) throws SystemException;
    
    int getPageSize(IQueryContextReader context) throws SystemException;
}
