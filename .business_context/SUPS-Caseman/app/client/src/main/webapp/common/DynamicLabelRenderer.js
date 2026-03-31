function DynamicLabelRenderer() {}

DynamicLabelRenderer.prototype.dispose = function() {}

/**
 * Static factory method to create the dynamic label renderer
 *
 * @param id the id to give the newly created dynamic label
 * @param forId the id of the component the label is linked to
 * @return the newly created dynamic label
 * @author kznwpr
 */
DynamicLabelRenderer.createInline = function(id, forId)
{
	// Write the outer div element in the document note that we need to specify the class because
	// that is what links this particular div to its adapter
	document.write("<div class='" + DynamicLabelGUIAdaptor.CSS_CLASS_NAME + "' id='" + id + "'><label for='" + forId + "'></label></div>");

	// Get the div element we just created
	var element = document.getElementById(id);

	// Create a new instance of the renderer
	var renderer = new DynamicLabelRenderer();

	// Store in the renderer a reference to the label element we created inside the div
	// because this is what the adapter will update
	renderer.m_labelElement = element.childNodes[0];

	// Store in the element a reference to the renderer
	element.__renderer = renderer;
	
	return renderer;
}
