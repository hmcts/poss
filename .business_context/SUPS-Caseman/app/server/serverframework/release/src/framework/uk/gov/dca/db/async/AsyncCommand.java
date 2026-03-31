/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.IOException;
import java.io.Reader;
import java.io.Serializable;

/**
 * @author Michael Barker
 *
 */
public class AsyncCommand implements Serializable
{
    private static final long serialVersionUID = -251347832842440576L;

    public final static String ASYNC_DS = "java:AsyncDS";
    public final static String NEW_TX = "NEW_TX";
    
    private long id;
    private String serviceName;
    private String methodName;
    private String request;
    private String response;
    private int state;
    private long timeTaken;
    private static final int BUF_SIZE = 8192;
    private String userId;
    private String courtId;
    private String destination;
    private int requestType;
    private String node;
    
    AsyncCommand(long id)
    {
        this.id = id;
    }
    
    /**
     * Get the identifier for this command.  Will be used by
     * the client to an update 
     * @return
     */
    public long getId()
    {
        return this.id;
    }
    
    
    
    /**
     * @return Returns the methodName.
     */
    public String getMethodName()
    {
        return methodName;
    }
    /**
     * @param methodName The methodName to set.
     */
    public void setMethodName(String methodName)
    {
        this.methodName = methodName;
    }
    /**
     * @return Returns the request.
     */
    public String getRequest()
    {
        return request;
    }
    /**
     * @param request The request to set.
     */
    public void setRequest(String request)
    {
        this.request = request;
    }
    
    /**
     * Sets the request value from a stream.
     * 
     * @param reader
     * @throws IOException
     */
    public void setRequest(Reader reader) throws IOException
    {
        if (reader != null)
        {
	        char[] buf = new char[BUF_SIZE];
	        StringBuffer sb = new StringBuffer();
	        
	        int numChars = 0;
	        while ((numChars = reader.read(buf)) != -1)
	        {
	            sb.append(buf, 0, numChars);
	        }
	        
	        setRequest(sb.toString());
        }
        else
        {
            setResponse("");
        }
    }
    
    /**
     * @return Returns the response.
     */
    public String getResponse()
    {
        return response;
    }
    /**
     * @param response The response to set.
     */
    public void setResponse(String response)
    {
        this.response = response;
    }
    
    /**
     * Sets the response value from a stream.
     * 
     * @param reader
     * @throws IOException
     */
    public void setResponse(Reader reader) throws IOException
    {
        if (reader != null)
        {
            char[] buf = new char[BUF_SIZE];
            StringBuffer sb = new StringBuffer();
            
            int numChars = 0;
            while ((numChars = reader.read(buf)) != -1)
            {
                sb.append(buf, 0, numChars);
            }
            
            setResponse(sb.toString());            
        }
        else
        {
            setResponse("");
        }
    }
    
    /**
     * @return Returns the serviceName.
     */
    public String getServiceName()
    {
        return serviceName;
    }
    /**
     * @param serviceName The serviceName to set.
     */
    public void setServiceName(String serviceName)
    {
        this.serviceName = serviceName;
    }
    /**
     * @return Returns the state.
     */
    public int getState()
    {
        return state;
    }
    /**
     * @param state The state to set.
     */
    public void setState(int state)
    {
        this.state = state;
    }
    
    /**
     * @return Returns the timeTaken.
     */
    public long getTimeTaken()
    {
        return timeTaken;
    }
    /**
     * @param timeTaken The timeTaken to set.
     */
    public void setTimeTaken(long timeTaken)
    {
        this.timeTaken = timeTaken;
    }
    
    /**
     * @return Returns the courtId.
     */
    public String getCourtId()
    {
        return courtId;
    }
    /**
     * @param courtId The courtId to set.
     */
    public void setCourtId(String courtId)
    {
        this.courtId = courtId;
    }
    /**
     * @return Returns the userId.
     */
    public String getUserId()
    {
        return userId;
    }
    /**
     * @param userId The userId to set.
     */
    public void setUserId(String userId)
    {
        this.userId = userId;
    }
    
    public String getDestination()
    {
        return destination;
    }
    
    public void setDestination(String destination)
    {
        this.destination = destination;
    }
    
    public int getRequestType()
    {
        return this.requestType;
    }
    
    public void setRequestType(int requestType)
    {
        this.requestType = requestType;
    }
    
    public String getNode()
    {
        return node;
    }
    
    public void setNode(String node)
    {
        this.node = node;
    }
    
    public void complete()
    {
        setState(State.COMPLETED);
    }
    
    public String getStateXML(long eta)
    {
       	if (getState() != State.QUEUED && getState() != State.PROCESSING)
       	{
       	   eta = 0;
       	}
       
        StringBuffer sb = new StringBuffer();
        sb.append("<Async>");
        sb.append("<Id>");
        sb.append(getId());
        sb.append("</Id>");
        sb.append("<State>");
        sb.append(getState());
        sb.append("</State>");
        sb.append("<Eta>");
        sb.append(eta);
        sb.append("</Eta>");
        if (getResponse() == null)
        {
            sb.append("<Response/>");
        }
        else
        {
            sb.append("<Response>");
            sb.append(getResponse());
            sb.append("</Response>");
        }
        sb.append("</Async>");
        return sb.toString();
    }
    
    public static class State
    {
        private State() {}
        public final static int COMPLETED = 0, QUEUED = 1, PROCESSING = 2, ERROR = 3, CANCELLED = 4;
    }
    
    public static class RequestType
    {
        private RequestType() {}
        public final static int GENERAL = 0, DOCUMENT = 1;
    }
}
