package uk.gov.dca.db.security.serversecret;

import java.util.Calendar;

/**
 * @author Imran PAtel
 */
interface SecretChangeObserver {

	public void secretChanged(String newSecret, Calendar newExpiryDate);
}
