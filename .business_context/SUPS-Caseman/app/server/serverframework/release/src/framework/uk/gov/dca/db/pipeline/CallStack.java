/*
 * Created on 06-Jun-2005
 *
 */
package uk.gov.dca.db.pipeline;

import uk.gov.dca.db.pipeline.component_input.ConverterFactory;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Thread local call stack to hold multiple instances
 * of a ComponentContext.
 * 
 * @author Michael Barker
 *
 */
public class CallStack
{
	/**
	 * Private constructor to prevent direct instantiation
	 */
	private CallStack() {
		// empty
	}
	

    /**
     * Static method to get a reference to the call stack.
     * 
     * @return
     */
    public static CallStack getInstance()
    {
    	return (CallStack) instance.get();    
    }
	
    /**
     * Push the parameters for the next context onto the stack.
     * 
     * @param user
     * @param service
     * @param method
     * @param params
     */
    public void push(String service, String method, String params)
    {
        // Top will initially be null.
        ComponentContext current = new ComponentContext(top);
        
        current.putSystemItem(IComponentContext.SERVICE_NAME_KEY, service);
        current.putSystemItem(IComponentContext.METHOD_NAME_KEY, method);
        current.putSystemItem(IComponentContext.REQUEST_PARAMETERS_KEY, params);
        current.setInputConverterFactory(m_converterFactory);
        
        top = current;
    }
    
    /**
     * Push the parameters for the next context onto the stack.
     * 
     * @param user
     * @param service
     * @param method
     * @param params
     */
    public void push(String service, String method, ComponentInput params)
    {
        // Top will initially be null.
        ComponentContext current = new ComponentContext(top);
        
        current.putSystemItem(IComponentContext.SERVICE_NAME_KEY, service);
        current.putSystemItem(IComponentContext.METHOD_NAME_KEY, method);
        current.putSystemItem(IComponentContext.COMPONENT_INPUT_KEY, params);
        current.setInputConverterFactory(m_converterFactory);
        
        top = current;
    }
    
    /**
     * Pop the top element off the stack.
     * 
     * @return
     * @throws RuntimeException if pop is attempted on an empty call stack.
     */
    public ComponentContext pop()
    {
        if (top == null)
        {
            throw new RuntimeException("No context has been pushed onto the stack");
        }
        
        ComponentContext current = top;
        top = current.getParent();
        
        return current;
    }
    
    /**
     * Returns the top item on the stack without removing it.
     * 
     * @return
     */
    public ComponentContext peek()
    {
        return top;
    }
    
   
    private final static ThreadLocal instance = new ThreadLocal() {
    	protected synchronized Object initialValue ()
        {
           return new CallStack();
        }
    };
    
    private ComponentContext top = null;
    private static final ConverterFactory m_converterFactory = new ConverterFactory();
}
