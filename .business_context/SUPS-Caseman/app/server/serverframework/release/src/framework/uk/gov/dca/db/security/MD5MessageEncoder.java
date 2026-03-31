/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.BIT8;

/**
 * Encodes a message using the MD5 algorithm
 * @author GrantM
 *
 */
public class MD5MessageEncoder implements IMessageEncoder {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.IMessageEncoder#encode(java.lang.String)
	 */
	public byte[] encode(String message) throws EncodingException, SystemException {
		byte [] encodedMessage = null;
		
		MessageDigest MD5Digest = null;
		
		try {
			MD5Digest = MessageDigest.getInstance("MD5");
		}
		catch ( NoSuchAlgorithmException e ) {
			throw new SystemException("Unable to find MD5 algorithm: "+e.getMessage(),e);
		}
			
		MD5Digest.reset();
		// compute the digest (i.e. do the encoding)
		try {
			MD5Digest.update( BIT8.create().encode(message).array() );
			encodedMessage = MD5Digest.digest();           
		}
		catch (Exception e) {
			// nothing thrown explicitly but could be runtime exceptions to catch
			throw new EncodingException("An error occurred trying to use the MD5 algorithm: "+e.getMessage(),e);
		}
		
		return encodedMessage;
	}
    
    public byte[] encodeUTF8(String message) throws EncodingException, SystemException {
        byte [] encodedMessage = null;
        
        MessageDigest MD5Digest = null;
        
        try {
            MD5Digest = MessageDigest.getInstance("MD5");
        }
        catch ( NoSuchAlgorithmException e ) {
            throw new SystemException("Unable to find MD5 algorithm: "+e.getMessage(),e);
        }
            
        MD5Digest.reset();
        // compute the digest (i.e. do the encoding)
        try {
          MD5Digest.reset();
          MD5Digest.update( message.getBytes("UTF-8") );
          encodedMessage = MD5Digest.digest();
        }
        catch (Exception e) {
            // nothing thrown explicitly but could be runtime exceptions to catch
            throw new EncodingException("An error occurred trying to use the MD5 algorithm: "+e.getMessage(),e);
        }
        
        return encodedMessage;
    }
    
    public byte[] encodeDefault(String message) throws EncodingException, SystemException {
        byte [] encodedMessage = null;
        
        MessageDigest MD5Digest = null;
        
        try {
            MD5Digest = MessageDigest.getInstance("MD5");
        }
        catch ( NoSuchAlgorithmException e ) {
            throw new SystemException("Unable to find MD5 algorithm: "+e.getMessage(),e);
        }
            
        MD5Digest.reset();
        // compute the digest (i.e. do the encoding)
        try {
          MD5Digest.reset();
          MD5Digest.update( message.getBytes() );
          encodedMessage = MD5Digest.digest();
        }
        catch (Exception e) {
            // nothing thrown explicitly but could be runtime exceptions to catch
            throw new EncodingException("An error occurred trying to use the MD5 algorithm: "+e.getMessage(),e);
        }
        
        return encodedMessage;
    }
}
