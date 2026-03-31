package uk.gov.cs.sups.caseman.wp;

import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.OutputStream;

/**
 * The PostscriptControlPipe is an output stream that accepts Postscript data
 * and embeds control commands in that data. All data received is immediately
 * written to the output stream passed to the constructor.
 * 
 * @author sz2n4g
 */
public class PostscriptControlPipe extends FilterOutputStream {
    private static byte[] command1 = "<< /Duplex ".getBytes();
    private static byte[] command2 = " /Tumble ".getBytes();
    private static byte[] command3 = " >> setpagedevice\r\n".getBytes();
    private static byte[] enabled = "true".getBytes();
    private static byte[] disabled = "false".getBytes();
    
    /** Postscript command to enable/disable duplex (defaults to disabled) */
    private boolean duplexEnabled = false;
    /** Postscript command to enable/disable tumble (defaults to disabled) */
    private boolean tumbleEnabled = false;
    private boolean inserted = false;
    private int state;
    private static final int START_LINE = 0;
    private static final int COMMENT_LINE = 1;
    private static final int FINISHED = 2;
    
    public PostscriptControlPipe(OutputStream out) {
        super(out);
    }
    public void write(byte[] b, int off, int len) throws IOException {
        if (inserted) {
            out.write(b, off, len);
        } else {
            int end = off + len;
            for (int i = off; i < end; i++) {
                check(b[i]);
                out.write(b);
            }
        }
    }
    public void write(int b) throws IOException {
        if (inserted) {
            out.write(b);
        } else {
            check((byte)b);
            out.write(b);
        }
    }
    /**
     * @param b
     */
    private void check(byte b) throws IOException {
        if (state == START_LINE) {
            if (b == '%') {
                state = COMMENT_LINE;
            } else if (b == '\r') {
            } else if (b == '\n') {
            } else {
                state = FINISHED;
                insertCommands();
            }

        } else if (state == COMMENT_LINE) {
            if (b == '\r') {
                state = START_LINE;
            } else if (b == '\n') {
                state = START_LINE;
            }
        }
    }
    /**
     * 
     */
    private void insertCommands() throws IOException {
        out.write(command1);
        out.write(duplexEnabled ? enabled : disabled);
        out.write(command2);
        out.write(tumbleEnabled ? enabled : disabled);
        out.write(command3);
    }
    public boolean isDuplexEnabled() {
        return duplexEnabled;
    }
    public void setDuplexEnabled(boolean duplexEnabled) {
        this.duplexEnabled = duplexEnabled;
    }
    public boolean isTumbleEnabled() {
        return tumbleEnabled;
    }
    public void setTumbleEnabled(boolean tumbleEnabled) {
        this.tumbleEnabled = tumbleEnabled;
    }
}
