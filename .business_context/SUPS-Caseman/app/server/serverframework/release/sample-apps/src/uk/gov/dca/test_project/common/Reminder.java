
package uk.gov.dca.test_project.common;

import java.util.Timer;
import java.util.TimerTask;

/**
 * @author PaulR
 */

public class Reminder {
    Timer timer;
    String completed;

    public Reminder(int seconds) {
        timer = new Timer();
        completed = "";
        timer.schedule(new RemindTask(), seconds*1000);
	}

    class RemindTask extends TimerTask {
        public void run() {
        	setCompleted();
            System.out.println("Time's up!");
            timer.cancel(); //Terminate the timer thread
        }
    }

    public static void main(String args[]) {
        new Reminder(5);
        System.out.println("Task scheduled.");
    }
    
    private void setCompleted() {
    	completed = "completed";	
    }
    
    public String getCompleted() {
    	return completed;
    }
}
