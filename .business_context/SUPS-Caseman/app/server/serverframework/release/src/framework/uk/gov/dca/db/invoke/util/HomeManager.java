package uk.gov.dca.db.invoke.util;

import java.rmi.RemoteException;
import java.util.HashMap;

import javax.ejb.EJBHome;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;

import org.apache.commons.logging.Log;

import edu.emory.mathcs.backport.java.util.concurrent.ConcurrentHashMap;

import uk.gov.dca.db.util.SUPSLogFactory;


public final class HomeManager
{
    private final static Log log = SUPSLogFactory.getLogger(HomeManager.class);
	private static final HomeManager instance = new HomeManager();
	private static final ConcurrentHashMap homes = new ConcurrentHashMap();
	private Context context = null;

	private HomeManager()
	{
		init();
	}

	public static HomeManager getInstance()
	{
		 return instance;
	}

	private void init()
	{
		ServiceLocator locator = ServiceLocator.getInstance();
		context = locator.getInitialContext();
	}

	public EJBHome lookup(String name)	throws NamingException, ClassCastException,RemoteException, ClassCastException
	{
		EJBHome home = null;
		if((home = (EJBHome)homes.get(name)) == null)
		{
			home = (EJBHome)PortableRemoteObject.narrow(context.lookup(name),EJBHome.class);
			home = (EJBHome)PortableRemoteObject.narrow(home,home.getEJBMetaData().
			getHomeInterfaceClass());
			homes.put(name,home);
		}
		return home;
	}
}