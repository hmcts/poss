/*
 * Created on 08-Nov-2004
 *
 */
package uk.gov.dca.db.security;

import uk.gov.dca.db.exception.SystemException;

/**
 * Interface to abstract encoding of a message from the algorithm used
 * 
 * @author GrantM
 */
public interface IMessageEncoder {
	/**
	 * Encodes the message
	 * @param message
	 * @return - encoded message
	 */
	public byte[] encode( String message ) throws EncodingException, SystemException;
    public byte[] encodeUTF8( String message ) throws EncodingException, SystemException;
    public byte[] encodeDefault( String message ) throws EncodingException, SystemException;
}
