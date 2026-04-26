// Bunch of utility methods used to generate the precompile for the framework

SerialisationUtils = function(){};

// Takes an array of strings an turns them into string which
// when evaluated returns the original array.
SerialisationUtils.stringArrayToLiteral = function (array)
{
    str = "[";
    for (var i=0; i < array.length; i++)
    {
        str += array[i] + ",";
    }
    if (array.length > 0)
    {
      str = str.substring(0,str.length-1); 
    }
    str += "]";
    
    return str;
}

/*
 * Prints out the listener tree (including predicate nodes) 
 * starting at the passed in node
 */
SerialisationUtils.printListeners = function(node)
{
    var printString = "";
    printString +=  node.serialise() + "\n";

    for (var a in node.m_childNodes)
    {
        if (a != "__parent__" && a != "__proto__") // Mozilla
        {
            printString += SerialisationUtils.printListeners(node.m_childNodes[a]);    
        }
    }   
    
    for (var a in node.m_predicates)
    {
        if (a != "__parent__" && a != "__proto__")
        {
            printString += SerialisationUtils.printListeners(node.m_predicates[a]);    
        }
    }   
    
    return printString;
}

/*
 * Returns all of the data dependencies for each of the adaptors in the system
 *
 * Returned string has the form of :
 *
 * FormController.dataDepPreCompArray = new Array({adaptor_id},{parent_array},
 *                                                {children_array},{contained_children_array},
 *                                                {parent_container_id})
 *
 */
SerialisationUtils.printDataDep = function()
{
    var adaptors = FormController.getInstance().m_adaptors;
    
    str = "FormController.dataDepPreCompArray = new Array(";
    for (var i=0; i < adaptors.length; i++)
    {
        var m_parentsString = SerialisationUtils.convertObjectOfAdaptorsToStringArray(adaptors[i].m_parents);
        var m_childrenString = SerialisationUtils.convertArrayOfAdaptorsToString(adaptors[i].m_children);
        var m_containedChildren = SerialisationUtils.convertArrayOfAdaptorsToString(adaptors[i].m_containedChildren);
        
        var parentContainer = adaptors[i].m_parentContainer;
        var parentContainerStr = "";
        
        if (parentContainer == null)
        {
            parentContainerStr = "null";
        } 
        else
        {
            parentContainerStr = "'" + parentContainer.getId() + "'";
        }
        
        str += "new Array('" + adaptors[i].getId() + "'," 
               + m_parentsString + "," 
               + m_childrenString + "," 
               + m_containedChildren + ","
               + parentContainerStr
               + ")\n,";
    } 
    if (adaptors.length > 0)
    {
      str = str.substring(0,str.length-1); 
    }
    str += ");\n";
    return str;
}

/*
 * Display the precompile for the page in a window
 */
SerialisationUtils.printPrecompile = function()
{
    var resultsWindow = window.open("", "Results", "height=600,width=400,scrollbars=yes,resizable=yes");
    
    var preComp = SerialisationUtils.getPrecompile();
    
    resultsWindow.document.write("<DIV>" + preComp + "</DIV>");
}

/* 
 * Returns the full precompile for the page
 */
SerialisationUtils.getPrecompile = function()
{
    var dm = FormController.getInstance().getDataModel();
    var str = "FormController.regNodes = new Object();";
    var listenerString = SerialisationUtils.printListeners (dm.m_root);
    var dataDepString = SerialisationUtils.printDataDep();
    var tabOrderString = SerialisationUtils.getTabOrder();
                    
    return str + listenerString + dataDepString + tabOrderString;
}   

/*
 * Returns a string of id's corresponding the the adaptor tabbing
 * order on the page
 */
SerialisationUtils.getTabOrder = function()
{
    var tabArray = FormController.getInstance().m_tabbingManager.m_tabOrder;
    return "FormController.tabOrder = " + SerialisationUtils.convertArrayOfAdaptorsToString(tabArray) + ";";
}

/* 
 * Converts an array of adaptors to a string which will evaluate to a
 * string of adaptor id's
 */
SerialisationUtils.convertArrayOfAdaptorsToString = function(adaptorArray)
{
    if (adaptorArray == null)
    {
        return "new Array()"; 
    }
    var str = "new Array(";
    var foundAdaptor = false;
    
    for (var i=0; i < adaptorArray.length; i++)
    {
        str += "'" + adaptorArray[i].getId() + "',"; 
        foundAdaptor = true;
    }
    if (foundAdaptor)
    {
      str = str.substring(0,str.length-1); 
    }
    str += ")";
    return str;
}


/*
 * Converts an associative array of adaptors to a string which will evaluate to
 * an array of adaptor id's
 */  
SerialisationUtils.convertObjectOfAdaptorsToStringArray = function(adaptorObject)
{
    if (adaptorObject == null)
    {
        return "new Array()"; 
    }
    
    var str = "new Array(";
    var foundAdaptor = false;
    for (var a in adaptorObject)
    {
        str += "'" + adaptorObject[a].getId() + "',"; 
        foundAdaptor = true;
    }
    if (foundAdaptor)
    {
      str = str.substring(0,str.length-1); 
    }
    str += ")";
    return str;
}

/*
 *  Takes an array of adaptor ids and returns an array of adaptor
 *  references.
 */
SerialisationUtils.convertStringArrayToAdaptorArray = function(array)
{
    var newArray = new Array();
    var m_adaptors = FormController.getInstance().m_adaptors;
    for (var i=0,l=array.length; i<l;i++)
    {
        newArray.push(m_adaptors[array[i]]);     
    }
    return newArray;
}

/*
 *  Takes an array of adaptor ids and returns an associative array of adaptor
 *  references.
 */
SerialisationUtils.convertStringArrayToAdaptorObject = function(array)
{
    var newObject = new Array(); // Array type used for consistency with old code.
    var m_adaptors = FormController.getInstance().m_adaptors;
    for (var i=0,l=array.length; i<l;i++)
    {
        newObject[array[i]] = m_adaptors[array[i]];     
    }
    return newObject;
}




    