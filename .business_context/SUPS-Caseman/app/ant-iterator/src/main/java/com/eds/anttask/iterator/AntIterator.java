package com.eds.anttask.iterator;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.taskdefs.Ant;
import org.apache.tools.ant.taskdefs.Property;
import org.apache.tools.ant.Task;
;

/**
 * Iterates through a comma separated list of strings and calls the
 * specified <i>target</i> for each string. The <i>property</i> parameter
 * is used as the name of the parameter to pass to the target, and the
 * string from the list is passed as the value of that parameter.<p>
 * This task is based on the <i>antcall</i> task and so supports the
 * required <i>target</i> parameter and the optional <i>inheritAll</i>
 * and <i>inheritRefs</i> parameters.
 * @author sz2n4g
 */
public class AntIterator extends Task {
    private String list;
    private String property;
    private Ant callee;
    private String subTarget;
    // must match the default value of Ant#inheritAll
    private boolean inheritAll = true;
    // must match the default value of Ant#inheritRefs
    private boolean inheritRefs = false;
    public void execute() throws BuildException {
        StringTokenizer tokenizer = new StringTokenizer(list, ",");
        if (callee == null) {
            init();
        }

        if (subTarget == null) {
            throw new BuildException("Attribute target is required.",
                                     getLocation());
        }

        callee.setAntfile(getProject().getProperty("ant.file"));
        callee.setTarget(subTarget);
        callee.setInheritAll(inheritAll);
        callee.setInheritRefs(inheritRefs);
        while(tokenizer.hasMoreTokens()) {
            String token = tokenizer.nextToken();
            Property p = callee.createProperty();
            p.setName(property);
            p.setValue(token);
            callee.execute();
        }
    }
    /**
     * @param list The list to set.
     */
    public void setList(String list) {
        this.list = list;
    }
    /**
     * @param property The property to set.
     */
    public void setProperty(String property) {
        this.property = property;
    }

    /**
     * If true, pass all properties to the new Ant project.
     * Defaults to true.
     */
    public void setInheritAll(boolean inherit) {
       inheritAll = inherit;
    }

    /**
     * If true, pass all references to the new Ant project.
     * Defaults to false
     * @param inheritRefs new value
     */
    public void setInheritRefs(boolean inheritRefs) {
        this.inheritRefs = inheritRefs;
    }

    /**
     * init this task by creating new instance of the ant task and
     * configuring it's by calling its own init method.
     */
    public void init() {
        callee = (Ant) getProject().createTask("ant");
        callee.setOwningTarget(getOwningTarget());
        callee.setTaskName(getTaskName());
        callee.setLocation(getLocation());
        callee.init();
    }

    /**
     * Property to pass to the invoked target.
     */
    public Property createParam() {
        if (callee == null) {
            init();
        }
        return callee.createProperty();
    }

    /**
     * Reference element identifying a data type to carry
     * over to the invoked target.
     * @since Ant 1.5
     */
    public void addReference(Ant.Reference r) {
        if (callee == null) {
            init();
        }
        callee.addReference(r);
    }

    /**
     * Set of properties to pass to the new project.
     *
     * @since Ant 1.6
     */
    public void addPropertyset(org.apache.tools.ant.types.PropertySet ps) {
        if (callee == null) {
            init();
        }
        callee.addPropertyset(ps);
    }

    /**
     * Target to execute, required.
     */
    public void setTarget(String target) {
        subTarget = target;
    }

    /**
     * Pass output sent to System.out to the new project.
     *
     * @since Ant 1.5
     */
    public void handleOutput(String output) {
        if (callee != null) {
            callee.handleOutput(output);
        } else {
            super.handleOutput(output);
        }
    }

    /**
     * @see Task#handleInput(byte[], int, int)
     *
     * @since Ant 1.6
     */
    public int handleInput(byte[] buffer, int offset, int length)
        throws IOException {
        if (callee != null) {
            return callee.handleInput(buffer, offset, length);
        } else {
            return super.handleInput(buffer, offset, length);
        }
    }

    /**
     * Pass output sent to System.out to the new project.
     *
     * @since Ant 1.5.2
     */
    public void handleFlush(String output) {
        if (callee != null) {
            callee.handleFlush(output);
        } else {
            super.handleFlush(output);
        }
    }

    /**
     * Pass output sent to System.err to the new project.
     *
     * @since Ant 1.5
     */
    public void handleErrorOutput(String output) {
        if (callee != null) {
            callee.handleErrorOutput(output);
        } else {
            super.handleErrorOutput(output);
        }
    }

    /**
     * Pass output sent to System.err to the new project and flush stream.
     *
     * @since Ant 1.5.2
     */
    public void handleErrorFlush(String output) {
        if (callee != null) {
            callee.handleErrorFlush(output);
        } else {
            super.handleErrorFlush(output);
        }
    }
}

