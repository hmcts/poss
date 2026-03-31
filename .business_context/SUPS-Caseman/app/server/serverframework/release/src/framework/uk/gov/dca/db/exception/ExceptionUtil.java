package uk.gov.dca.db.exception;

public class ExceptionUtil {

    /**
     * Determines if a specific exception is a framework exception.
     * 
     * @param e
     * @return
     */
    public static boolean isFrameworkException(Exception e) {
        return e instanceof SystemException ||
            e instanceof BusinessException;
    }
    
    /**
     * Check the class of the exception and rethrow appropriately.
     * 
     * @param e
     * @param altMessage
     * @throws BusinessException
     * @throws SystemException
     */
    public static void rethrow(Throwable e, String altMessage) throws BusinessException, SystemException {
        
        if (e instanceof SystemException) {
            throw (SystemException) e;
        }
        else if (e instanceof BusinessException) {
            throw (BusinessException) e;
        }
        else {
            throw new SystemException(altMessage, e);
        }
        
    }
    
}
