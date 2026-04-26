import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.event.PrintJobEvent;
import javax.print.event.PrintJobListener;
import javax.swing.JButton;

/**
 * @author sz2n4g
 */
public class WPPrintApplet extends Applet implements ActionListener {
    /** Comment for <code>serialVersionUID</code> */
    private static final long serialVersionUID = 1L;
    private JButton print;
    private URL servletUrl;
    
    public void init() {
        super.init();
        setLayout(new BorderLayout());
        print = new JButton("Print");
        print.addActionListener(this);
        add(print, BorderLayout.CENTER);
        URL url = getCodeBase();
        try {
            servletUrl = new URL(url.toString() + "/WPPrint");
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
        }
    }
    
    /**
     * @see java.awt.event.ActionListener#actionPerformed(java.awt.event.ActionEvent)
     */
    public void actionPerformed(ActionEvent event) {
        Thread thread = new Thread(new PrintThread());
        thread.start();
    }
    
    class PrintThread implements Runnable {

        /**
         * @see java.lang.Runnable#run()
         */
        public void run() {
            print.setEnabled(false);
            // Open connection to server
            // Create print job
            DocFlavor myFormat = DocFlavor.INPUT_STREAM.POSTSCRIPT;
            // Create a Doc
            try {
                String jobId = getParameter("jobId");
                HttpURLConnection connection = new WPHttpSocket(servletUrl, jobId, getParameter("jobXsl"));
                connection.connect();
                InputStream input = connection.getInputStream();
                Doc myDoc = new SimpleDoc(input, myFormat, null); 

                PrintRequestAttributeSet aset = new HashPrintRequestAttributeSet(); 

                PrintService service = PrintServiceLookup.lookupDefaultPrintService();

                DocPrintJob job = service.createPrintJob();
                job.addPrintJobListener(new PrintStatusReporter(jobId));
                try {
                    job.print(myDoc, aset); 
                } catch (PrintException e) {
                }
                // Cleanup
                connection.disconnect();
            } catch (MalformedURLException e) {
            } catch (IOException e) {
            }
            print.setEnabled(true);
        }
    }
    
    class PrintStatusReporter implements PrintJobListener {
        private String jobId;
        /**
         * @param jobId
         */
        public PrintStatusReporter(String jobId) {
            this.jobId = jobId;
        }

        /**
         * @see javax.print.event.PrintJobListener#printDataTransferCompleted(javax.print.event.PrintJobEvent)
         */
        public void printDataTransferCompleted(PrintJobEvent pje) {
        }

        /**
         * @see javax.print.event.PrintJobListener#printJobCanceled(javax.print.event.PrintJobEvent)
         */
        public void printJobCanceled(PrintJobEvent pje) {
            sendJobStatus(jobId, pje.getPrintEventType());
        }

        /**
         * @see javax.print.event.PrintJobListener#printJobCompleted(javax.print.event.PrintJobEvent)
         */
        public void printJobCompleted(PrintJobEvent pje) {
            sendJobStatus(jobId, pje.getPrintEventType());
        }

        /**
         * @see javax.print.event.PrintJobListener#printJobFailed(javax.print.event.PrintJobEvent)
         */
        public void printJobFailed(PrintJobEvent pje) {
            sendJobStatus(jobId, pje.getPrintEventType());
        }

        /**
         * @see javax.print.event.PrintJobListener#printJobNoMoreEvents(javax.print.event.PrintJobEvent)
         */
        public void printJobNoMoreEvents(PrintJobEvent pje) {
            sendJobStatus(jobId, pje.getPrintEventType());
        }

        /**
         * @see javax.print.event.PrintJobListener#printJobRequiresAttention(javax.print.event.PrintJobEvent)
         */
        public void printJobRequiresAttention(PrintJobEvent pje) {
        }
        
        public void sendJobStatus(String jobId, int jobStatus) {
            HttpURLConnection connection = new WPHttpSocket(servletUrl, jobId, jobStatus);
            try {
                connection.connect();
            } catch (IOException e) {
            }
            connection.disconnect();
        }
    }
}
