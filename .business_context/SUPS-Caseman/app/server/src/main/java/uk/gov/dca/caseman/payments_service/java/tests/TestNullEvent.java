// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import org.easymock.MockControl;
 * 
 * import junit.framework.TestCase;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.events.*;
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestNullEvent extends TestCase {
 * 
 * private Event event;
 * private ServiceAdaptor adaptor;
 * private MockControl control;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * event = Event.getInstance(99999, adaptor);
 * }
 * 
 * public void testNullEvent() throws Exception
 * {
 * control.replay();
 * 
 * event.exists();
 * event.fire();
 * event.saveErrorStatus(true);
 * event.saveErrorStatus(false);
 * event.setParam("asd", "asd");
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullEvent.class);
 * }
 * 
 * }
 * //[enddef] */