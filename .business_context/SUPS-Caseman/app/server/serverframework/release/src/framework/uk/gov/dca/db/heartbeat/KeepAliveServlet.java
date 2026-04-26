package uk.gov.dca.db.heartbeat;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Used by the Web gateway to determine if the server is still running.
 * 
 * @author Michael Barker
 */

public class KeepAliveServlet extends HttpServlet {

    private static final long serialVersionUID = -8484071142046444357L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (request == null) {
            throw new IllegalArgumentException("request cannot be null");
        }
        if (response == null) {
            throw new IllegalArgumentException("response cannot be null");
        }

        respondToKeepAlive(request, response);

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (request == null) {
            throw new IllegalArgumentException("request cannot be null");
        }
        if (response == null) {
            throw new IllegalArgumentException("response cannot be null");
        }

        respondToKeepAlive(request, response);

    }

    private void respondToKeepAlive(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        assert request != null;
        assert response != null;

        response.setContentType("text/html");

        PrintWriter out = response.getWriter();
        out.print((new Date()) + " - keepalive response");

        HttpSession session = request.getSession(false); // do not create the
                                                         // session if it
                                                         // does not already
                                                         // exist
        // remove the session if it did exist
        if (session != null) {
            session.invalidate();
        }

    }

}
