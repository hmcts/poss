/**
 * ServicesInternal is a class designed to provide general services
 * for the framework. The services provided by this class are not
 * intended for the general development environment.
 *
*/

function ServicesInternal()
{}

/**
 * Method returns reference to instance of
 * performance instrumentation class on application
 * controller.
 *
 * @return Reference to instance of class ProcessPerformanceMonitor
 * @public
 *
*/

ServicesInternal.getPerformanceMonitor = function()
{
    // Use unusual method of referencing application controller
    // such that we can access performance monitor from most
    // parts of the application.
    
    return top["AppController"].getInstance().getPerformanceMonitor();
}

