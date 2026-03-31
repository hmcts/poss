/*
 * Created on 26-Aug-2004
 *
 */
package uk.gov.dca.db.pipeline;

/**
 * A 'role' interface for components which create XML.
 * Therefore the output will be different from the input.
 * NOTE: it may be desirable to breakdown this interface further since
 * it is currently used to include such things as aggregation and transformation.
 *
 * @author Grant Miller
 */
public interface IGenerator {}
