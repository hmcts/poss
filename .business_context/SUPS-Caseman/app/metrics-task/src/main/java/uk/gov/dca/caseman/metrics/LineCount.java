package uk.gov.dca.caseman.metrics;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.taskdefs.MatchingTask;

/**
 * Ant task to count lines in files and summarise them by file extension.
 * @author Nick Wilson
 */
public class LineCount extends MatchingTask {
    private File basedir;
    private File destdir;
    
    private ArrayList extensions;
    private HashMap fileCounts;
    private HashMap lineCounts;

    public void execute() throws BuildException {
        if (basedir == null && fileset == null) {
            throw new BuildException("basedir must be specified");
        }
        if (destdir == null) {
            throw new BuildException("destdir must be specified");
        }
        if (!destdir.exists()) {
            throw new BuildException("destdir folder does not exist: " + destdir.getPath());
        }

        extensions = new ArrayList();
        fileCounts = new HashMap();
        lineCounts = new HashMap();
        
        DirectoryScanner ds = getDirectoryScanner(basedir);
        String[] files = ds.getIncludedFiles();
        for (int i = 0; i < files.length; i++) {
            log("file: " + files[i]);
            count(files[i]);
        }
        writeResults();
        basedir = null;
    }

    private void writeResults() {
		File outputFile = new File(destdir, "LineCounts.xml");
		try {
			outputFile.createNewFile();
			BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
			writer.write("<linecounts>\r\n");
			for(Iterator i = extensions.iterator(); i.hasNext();) {
				String extension = (String) i.next();
				writer.write("  <");
				writer.write(extension);
				writer.write(">\r\n");
				
				writer.write("    <files>");
				writer.write(fileCounts.get(extension).toString());
				writer.write("</files>\r\n");
				
				writer.write("    <lines>");
				writer.write(lineCounts.get(extension).toString());
				writer.write("</lines>\r\n");
				
				writer.write("  </");
				writer.write(extension);
				writer.write(">\r\n");
			}
			writer.write("</linecounts>\r\n");
			writer.flush();
			writer.close();
		} catch (IOException e) {
			log(e.getMessage());
			e.printStackTrace();
		}
	}

	private void count(String filename) {
		File file = new File(basedir, filename);
		int lineCount = 0;
		String extension = "NONE";
		int dotIndex = filename.lastIndexOf('.');
		if (dotIndex >= 0 && dotIndex < (filename.length() - 1)) {
			extension = filename.substring(dotIndex + 1);
		}
		if (!extensions.contains(extension)) {
			extensions.add(extension);
		}
		try {
			BufferedReader reader = new BufferedReader(new FileReader(file));
			while (reader.readLine() != null) {
				lineCount++;
			}
			addLineCount(extension, lineCount);
			incrementFileCount(extension);
		} catch (FileNotFoundException e) {
			log(e.getMessage());
		} catch (IOException e) {
			log(e.getMessage());
		}
	}

	private void incrementFileCount(String extension) {
		Long fileCount = (Long) fileCounts.get(extension);
		if (fileCount == null) {
			fileCount = new Long(1);
		} else {
			fileCount = new Long(fileCount.longValue() + 1);
		}
		fileCounts.put(extension, fileCount);
	}

	private void addLineCount(String extension, long lines) {
		Long lineCount = (Long) lineCounts.get(extension);
		if (lineCount == null) {
			lineCount = new Long(lines);
		} else {
			lineCount = new Long(lineCount.longValue() + lines);
		}
		lineCounts.put(extension, lineCount);
	}

	public void setBasedir (File basedir) {
        this.basedir = basedir;
    }

	public void setDestdir(File destdir) {
		this.destdir = destdir;
	}
}
