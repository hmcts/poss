/*
 * Created on 10-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security;

/**
 * Implementations encode arrays of bytes in a String.
 * 
 * @author JamesB
 */
public interface ByteStreamEncoder {
	
	/**
	 * Encodes a byte array into a String containing a sequence of base encoded numbers representing the elements in the byte array.
	 * 
	 * @param bytes the byte array to encode
	 * @return a String containing a sequence of base encoded numbers representing the elements of the byte array
	 */
	public String encode(byte[] bytes) throws EncodingException;
	
	/**
	 * Decodes a previously encoded byte stream into a byte array
	 * 
	 * @param stream a String containing a sequence of base encoded numbers representing the elements of the byte array
	 * @return a byte array containing the bytes from the stream
	 */
	public byte[] decode(String stream) throws EncodingException;
}
