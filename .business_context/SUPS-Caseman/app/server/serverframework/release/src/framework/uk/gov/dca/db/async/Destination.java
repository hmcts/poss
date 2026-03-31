/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.Serializable;
import java.util.Properties;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public interface Destination
{
    String getId();
    String getJndiName();
    String getFactory();
    int getMinPoolSize();
    int getMaxPoolSize();
    public void send(Serializable payload, int messageType) throws SystemException, BusinessException;
    public void send(Serializable payload, Properties p, int messageType) throws SystemException, BusinessException;
}
