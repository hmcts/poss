package uk.gov.dca.db.util;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CharsetEncoder;
import java.nio.charset.CoderResult;

/**
 * Implementation of a Character set that only returns the low byte
 * of a character.
 * 
 * @author Michael Barker
 *
 */
public class BIT8 extends Charset
{
    protected BIT8()
    {
        super("BIT8", new String[] { "BIT8" });
    }

    public boolean contains(Charset cs)
    {
        return false;
    }

    public CharsetDecoder newDecoder()
    {
        return new BIT8Decoder(this);
    }

    public CharsetEncoder newEncoder()
    {
        return new BIT8Encoder(this);
    }

    private static class BIT8Encoder extends CharsetEncoder
    {

        protected BIT8Encoder(Charset cs)
        {
            super(cs, 1f, 1f);
        }

        protected CoderResult encodeLoop(CharBuffer in, ByteBuffer out)
        {
            while (true)
            {
                if (in.remaining() <= 0)
                {
                    return CoderResult.UNDERFLOW;
                }
                else if (out.remaining() <= 0)
                {
                    return CoderResult.OVERFLOW;
                }
                else
                {
                    byte b = (byte) (0xFF & in.get());
                    out.put(b);
                }
            }
        }
    }
    
    private static class BIT8Decoder extends CharsetDecoder
    {

        protected BIT8Decoder(Charset cs)
        {
            super(cs, 1f, 1f);
        }

        protected CoderResult decodeLoop(ByteBuffer in, CharBuffer out)
        {
            while (true)
            {
                if (in.remaining() <= 0)
                {
                    return CoderResult.UNDERFLOW;
                }
                else if (out.remaining() <= 0)
                {
                    return CoderResult.OVERFLOW;
                }
                else
                {
                    char c = (char) (0xFF & in.get());
                    out.put(c);
                }
            }
        }
    }
    
    public static Charset create()
    {
        return new BIT8();
    }

}
