import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * @author sz2n4g
 */
public class WPHttpSocket extends HttpURLConnection {
    private Socket socket;
    private String status;
    private ArrayList responseKeys;
    private HashMap responseHeaders;
    private String jobId;
    private String jobXsl;
    private int jobStatus;

    /**
     * @param url
     */
    public WPHttpSocket(URL url, String jobId, String jobXsl) {
        super(url);
        this.jobId = jobId;
        this.jobXsl = jobXsl;
        jobStatus = 0;
    }

    /**
     * @param url
     */
    public WPHttpSocket(URL url, String jobId, int jobStatus) {
        super(url);
        this.jobId = jobId;
        this.jobStatus = jobStatus;
    }

    /**
     * @see java.net.HttpURLConnection#disconnect()
     */
    public void disconnect() {
        try {
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        socket = null;
        responseHeaders = null;
        responseKeys = null;
    }

    /**
     * @see java.net.HttpURLConnection#usingProxy()
     */
    public boolean usingProxy() {
        return false;
    }

    /**
     * @see java.net.URLConnection#connect()
     */
    public void connect() throws IOException {
        responseKeys = new ArrayList();
        responseHeaders = new HashMap();
        SocketAddress socketAddress = new InetSocketAddress(url.getHost(), url.getPort());
        socket = new Socket();
        socket.connect(socketAddress);
        OutputStream output = socket.getOutputStream();
        output.write(getHeaderBytes());
        output.flush();
        InputStream input = socket.getInputStream();
        readResponseHeader(input);
    }
    /**
     * @param input
     */
    private void readResponseHeader(InputStream input) throws IOException {
        while (readHeaderLine(input)) {
        }
    }

    /**
     * @param input
     */
    private boolean readHeaderLine(InputStream input) throws IOException {
        boolean isHeader = false;
        StringBuffer key = new StringBuffer();
        StringBuffer value = null;
        int c = 0;
        while(true) {
            c = input.read();
            if (c == ':') {
                value = new StringBuffer();
                while(true) {
                    c =  input.read();
                    if (c == '\n') {
                        break;
                    } else if (c == '\r') {
                    } else {
                        isHeader = true;
                        value.append((char)c);
                    }
                }
                break;
            } else if (c == '\n') {
                break;
            } else if (c == '\r') {
            } else {
                isHeader = true;
                key.append((char)c);
            }
        }
        if (key.length() != 0) {
            if (value != null) {
                responseKeys.add(key.toString());
                responseHeaders.put(key.toString(), value.toString());
            } else {
                status = key.toString();
            }
        }
        return isHeader;
    }

    /**
     * @return
     */
    private byte[] getHeaderBytes() {
        StringBuffer header = new StringBuffer();
        header.append("GET /wpprint/WPPrint?jobId=");
        header.append(jobId);
        if (jobXsl != null) {
            header.append("&jobXsl=");
            header.append(jobXsl);
        }
        if (jobStatus != 0) {
            header.append("&jobStatus=");
            header.append(jobStatus);
        }
        header.append(" HTTP/1.0\n\n");
        return header.toString().getBytes();
    }

    public InputStream getInputStream() throws IOException {
        InputStream input;
        if (socket == null) {
            input = super.getInputStream();
        } else {
            input = socket.getInputStream(); //new GZIPInputStream(
        }
        return input;
    }
    
    public String getHeaderField(int n) {
        String field = null;
        if (n == 0) {
            field = status;
        } else if (n > 0 && n <= responseKeys.size()) {
            field = (String) responseHeaders.get(responseKeys.get(n-1));
        }
        return field;
    }
    public String getHeaderFieldKey(int n) {
        String fieldKey = null;
        if (n > 0 && n <= responseKeys.size()) {
            fieldKey = (String) responseKeys.get(n-1);
        }
        return fieldKey;
    }
    public String getHeaderField(String name) {
        return (String) responseHeaders.get(name);
    }
    public Map getHeaderFields() {
        return Collections.unmodifiableMap(responseHeaders);
    }
}
