/*
 * Created on 04-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.tools;

import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.GraphicsConfiguration;
import java.awt.GridBagConstraints;
import java.awt.HeadlessException;

import javax.swing.JFrame;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JEditorPane;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.BoxLayout;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;

import java.awt.GridBagLayout;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.swing.JScrollPane;

/**
 * Graphical user interface for the TestService application.  This class acts as a front end for the TestService application with the 
 * actual invocation of services being delegated to the TestService class.
 * 
 * @author JamesB
 */
public class TestServiceGUI extends JFrame {

	private javax.swing.JPanel jContentPane = null;

	private JPanel jPanel = null;
	private JLabel jLabel = null;
	private JTextField serviceName = null;
	private JLabel jLabel1 = null;
	private JTextField methodName = null;
	private JPanel jPanel2 = null;
	private JLabel jLabel2 = null;
	private JButton jButton = null;
	private JEditorPane parameters = null;
	private JPanel jPanel3 = null;
	private JLabel jLabel3 = null;
	private JTextField methodDescriptorPath = null;
	private JLabel jLabel4 = null;
	private JComboBox invocationMethod = null;
	private JButton jButton1 = null;
	private JEditorPane result = null;
	private JLabel jLabel5 = null;

	private JScrollPane jScrollPane = null;
	private JScrollPane jScrollPane1 = null;
	private JFileChooser fc = null;
	
	/**
	 * @throws java.awt.HeadlessException
	 */
	public TestServiceGUI() throws HeadlessException, IOException {
		super();
				
		// TODO Auto-generated constructor stub
		initialize();
	}

	/**
	 * @param gc
	 * @throws IOException
	 */
	public TestServiceGUI(GraphicsConfiguration gc) throws IOException {
		super(gc);
		// TODO Auto-generated constructor stub
		initialize();
	}

	/**
	 * @param title
	 * @throws java.awt.HeadlessException
	 * @throws IOException
	 */
	public TestServiceGUI(String title) throws HeadlessException, IOException {
		super(title);
		// TODO Auto-generated constructor stub
		initialize();
	}

	/**
	 * @param title
	 * @param gc
	 * @throws IOException
	 */
	public TestServiceGUI(String title, GraphicsConfiguration gc) throws IOException {
		super(title, gc);
		// TODO Auto-generated constructor stub
		initialize();
	}

	/**
	 * This method initializes jScrollPane	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */    
	private JScrollPane getJScrollPane() {
		if (jScrollPane == null) {
			jScrollPane = new JScrollPane();
			//jScrollPane.setPreferredSize(new java.awt.Dimension(15,100));
			jScrollPane.setMinimumSize(new Dimension(15, 250));
			jScrollPane.getViewport().add(getParameters());
		}
		return jScrollPane;
	}
	
	/**
	 * This method initializes jScrollPane1	
	 * 	
	 * @return javax.swing.JScrollPane	
	 */    
	private JScrollPane getJScrollPane1() {
		if (jScrollPane1 == null) {
			jScrollPane1 = new JScrollPane();
			jScrollPane1.setPreferredSize(new java.awt.Dimension(3,150));
			jScrollPane1.getViewport().add(getResult());
		}
		return jScrollPane1;
	}

   	/**
	 * Main method
	 * 
	 * @param args not used in this application
   	 * @throws IOException
   	 * @throws HeadlessException
	 */
	public static void main(String[] args) throws HeadlessException, IOException {
		// set the native look and feel for the application
		try {
		    UIManager.setLookAndFeel(
		        UIManager.getSystemLookAndFeelClassName());
		} catch (UnsupportedLookAndFeelException ex) {
			System.out.println("Unable to load native look and feel");
			// ... gulp!
		} catch (ClassNotFoundException e) {
			// ... gulp!
		} catch (InstantiationException e) {
			// ... gulp!
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// ... gulp!
		}
		
		TestServiceGUI test = new TestServiceGUI();
	    test.setDefaultCloseOperation(EXIT_ON_CLOSE);
	    test.setVisible(true);
	}
	
	/**
	 * Performs rudimentary field validation before the service is executed.
	 * 
	 * @return String containing any error messages resulting from the validation
	 */
	private String performValidation() {
		StringBuffer failureMessage = new StringBuffer();
		
		if(getInvocationMethod().getSelectedItem().equals(TestService.LOCAL)) {
			// for local service invocation, check that a method descriptor file has been specified
			String descriptorPath = getMethodDescriptorPath().getText();
			
			if(descriptorPath == null || descriptorPath.length() == 0) {
				failureMessage.append("A method descriptor file must be specified for a LOCAL service invocation.\n");
			}
		}
		
		String serviceName = getServiceName().getText();
		if(serviceName == null || serviceName.length() == 0) {
			failureMessage.append("A service name must be specified.\n");
		}
		
		String methodName = getMethodName().getText();
		if(methodName == null || methodName.length() == 0) {
			failureMessage.append("A method name must be specified.\n");
		}
		
		String parameters = getParameters().getText();
		if(parameters == null || parameters.length() == 0) {
			failureMessage.append("Parameters must be specified.\n");
		}
		
		return failureMessage.toString();
	}
	
	/**
	 * This method initializes the TestServiceGUI java bean
	 * 
	 * @return void
	 * @throws IOException
	 */
	private void initialize() throws IOException {
		this.setSize(754, 728);
		this.setContentPane(getJContentPane());
		this.setTitle("Test Service GUI");
			
		// set-up file chooser dialog
		String initialFileChooserDir = TestServiceProperties.getInstance().getProperty(TestServiceProperties.GUI_FILE_CHOOSER_DIRECTORY);
		fc = new JFileChooser(initialFileChooserDir);
	}
	
	/**
	 * This method initializes jContentPane
	 * 
	 * @return javax.swing.JPanel
	 */
	private javax.swing.JPanel getJContentPane() {
		if(jContentPane == null) {
			jContentPane = new javax.swing.JPanel();
			jContentPane.setLayout(new java.awt.BorderLayout());
			jContentPane.add(getJPanel(), java.awt.BorderLayout.CENTER);
		}
		return jContentPane;
	}
	
	/**
	 * This method initializes jPanel	
	 * 	
	 * @return javax.swing.JPanel	
	 */    
	private JPanel getJPanel() {
		if (jPanel == null) {
			jPanel = new JPanel();
			jPanel.setLayout(new BoxLayout(jPanel, BoxLayout.Y_AXIS));
			jPanel.add(getJPanel2(), null);
			jPanel.add(getJPanel3(), null);
		}
		return jPanel;
	}

	/**
	 * This method initializes jTextField	
	 * 	
	 * @return javax.swing.JTextField	
	 */    
	private JTextField getServiceName() {
		if (serviceName == null) {
			serviceName = new JTextField();
			serviceName.setColumns(15);
		}
		return serviceName;
	}
	
	/**
	 * This method initializes jTextField	
	 * 	
	 * @return javax.swing.JTextField	
	 */    
	private JTextField getMethodName() {
		if (methodName == null) {
			methodName = new JTextField();
			methodName.setColumns(20);
		}
		return methodName;
	}
	
	/**
	 * This method initializes jPanel2	
	 * 	
	 * @return javax.swing.JPanel	
	 */    
	private JPanel getJPanel2() {
		if (jPanel2 == null) {
			GridBagConstraints gridBagConstraints71 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints6 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints51 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints41 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints21 = new GridBagConstraints();
			jLabel2 = new JLabel();
			jLabel = new JLabel();
			jLabel1 = new JLabel();
			jLabel.setText("Service name:");
			jLabel1.setText("Method name:");
			GridBagConstraints gridBagConstraints7 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints8 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints9 = new GridBagConstraints();
			jPanel2 = new JPanel();
			jPanel2.setLayout(new GridBagLayout());
			jLabel2.setText("Parameters:");
			jLabel2.setToolTipText("The parameters for the service method call in XML");
			jLabel2.setHorizontalAlignment(javax.swing.SwingConstants.LEFT);
			gridBagConstraints7.gridx = 0;
			gridBagConstraints7.gridy = 1;
			gridBagConstraints7.insets = new java.awt.Insets(10,0,0,0);
			gridBagConstraints7.anchor = java.awt.GridBagConstraints.WEST;
			gridBagConstraints7.gridwidth = 2;
			gridBagConstraints8.gridx = 0;
			gridBagConstraints8.gridy = 1;
			gridBagConstraints8.weightx = 1.0;
			gridBagConstraints8.weighty = 1.0;
			gridBagConstraints8.fill = java.awt.GridBagConstraints.BOTH;
			gridBagConstraints8.ipady = 204;
			gridBagConstraints8.gridwidth = 4;
			gridBagConstraints8.insets = new java.awt.Insets(0,0,0,0);
			gridBagConstraints9.gridx = 5;
			gridBagConstraints9.gridy = 3;
			gridBagConstraints9.insets = new java.awt.Insets(5,0,5,10);
			gridBagConstraints9.anchor = java.awt.GridBagConstraints.EAST;
			gridBagConstraints21.weightx = 1.0;
			gridBagConstraints21.weighty = 100.0D;
			gridBagConstraints21.fill = java.awt.GridBagConstraints.BOTH;
			gridBagConstraints21.gridx = 0;
			gridBagConstraints21.gridy = 2;
			gridBagConstraints21.gridwidth = 6;
			gridBagConstraints41.gridx = 1;
			gridBagConstraints41.gridy = 0;
			gridBagConstraints41.insets = new java.awt.Insets(20,20,0,0);
			gridBagConstraints41.anchor = java.awt.GridBagConstraints.EAST;
			gridBagConstraints41.fill = java.awt.GridBagConstraints.HORIZONTAL;
			gridBagConstraints51.gridx = 2;
			gridBagConstraints51.gridy = 0;
			gridBagConstraints51.weightx = 1.0;
			gridBagConstraints51.fill = java.awt.GridBagConstraints.NONE;
			gridBagConstraints51.anchor = java.awt.GridBagConstraints.WEST;
			gridBagConstraints51.insets = new java.awt.Insets(20,0,0,0);
			gridBagConstraints6.gridx = 3;
			gridBagConstraints6.gridy = 0;
			gridBagConstraints6.insets = new java.awt.Insets(20,0,0,0);
			gridBagConstraints71.gridx = 4;
			gridBagConstraints71.gridy = 0;
			gridBagConstraints71.weightx = 1.0;
			gridBagConstraints71.fill = java.awt.GridBagConstraints.HORIZONTAL;
			gridBagConstraints71.insets = new java.awt.Insets(20,0,0,0);
			jPanel2.add(jLabel2, gridBagConstraints7);
			jPanel2.add(getJScrollPane(), gridBagConstraints21);
			jPanel2.add(getJButton(), gridBagConstraints9);
			jPanel2.add(jLabel, gridBagConstraints41);
			jPanel2.add(getServiceName(), gridBagConstraints51);
			jPanel2.add(jLabel1, gridBagConstraints6);
			jPanel2.add(getMethodName(), gridBagConstraints71);
		}
		return jPanel2;
	}
	
	/**
	 * This method initializes jButton	
	 * 	
	 * @return javax.swing.JButton	
	 */    
	private JButton getJButton() {
		if (jButton == null) {
			jButton = new JButton();
			jButton.setText("Load parameters");
			jButton.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
			jButton.setHorizontalTextPosition(javax.swing.SwingConstants.TRAILING);
			jButton.setToolTipText("Load parameter XML from a file on the local file system");
			jButton.addActionListener(new java.awt.event.ActionListener() { 
				public void actionPerformed(java.awt.event.ActionEvent e) {    

					int returnVal = fc.showOpenDialog(TestServiceGUI.this);
					if (returnVal == JFileChooser.APPROVE_OPTION) {
						String parameterText = null;
						try {
							File file = fc.getSelectedFile();
							TestService service = new TestService();
							parameterText = service.getSampleData(file);
						}
						catch(FileNotFoundException ex) {
							JOptionPane.showMessageDialog(TestServiceGUI.this, ex.getMessage(),"Load Failure", JOptionPane.ERROR_MESSAGE);
						}
						catch(IOException ex) {
							JOptionPane.showMessageDialog(TestServiceGUI.this, ex.getMessage(),"Load Failure", JOptionPane.ERROR_MESSAGE);
						}
						getParameters().setText(parameterText);
					}
				}
			});
		}
		return jButton;
	}
	
	/**
	 * This method initializes jEditorPane	
	 * 	
	 * @return javax.swing.JEditorPane	
	 */    
	private JEditorPane getParameters() {
		if (parameters == null) {
			parameters = new JEditorPane();
			parameters.setPreferredSize(new java.awt.Dimension(200,150));
		}
		return parameters;
	}
	
	/**
	 * This method initializes jPanel3	
	 * 	
	 * @return javax.swing.JPanel	
	 */    
	private JPanel getJPanel3() {
		if (jPanel3 == null) {
			jLabel5 = new JLabel();
			GridBagConstraints gridBagConstraints11 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints31 = new GridBagConstraints();
			jLabel4 = new JLabel();
			jLabel3 = new JLabel();
			jPanel3 = new JPanel();
			jPanel3.setLayout(new GridBagLayout());
			GridBagConstraints gridBagConstraints1 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints2 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints3 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints4 = new GridBagConstraints();
			GridBagConstraints gridBagConstraints5 = new GridBagConstraints();
			gridBagConstraints1.gridx = 0;
			gridBagConstraints1.gridy = 0;
			gridBagConstraints1.anchor = java.awt.GridBagConstraints.EAST;
			gridBagConstraints1.gridwidth = 2;
			gridBagConstraints1.insets = new java.awt.Insets(16,0,0,0);
			jLabel3.setText("Method descriptor path:");
			gridBagConstraints2.gridx = 2;
			gridBagConstraints2.gridy = 0;
			gridBagConstraints2.weightx = 1.0;
			gridBagConstraints2.fill = java.awt.GridBagConstraints.HORIZONTAL;
			gridBagConstraints2.anchor = java.awt.GridBagConstraints.WEST;
			gridBagConstraints2.gridwidth = 2;
			gridBagConstraints2.insets = new java.awt.Insets(16,0,0,10);
			gridBagConstraints3.gridx = 0;
			gridBagConstraints3.gridy = 2;
			gridBagConstraints3.gridwidth = 2;
			gridBagConstraints3.anchor = java.awt.GridBagConstraints.EAST;
			gridBagConstraints3.insets = new java.awt.Insets(15,0,0,0);
			jLabel4.setText("Invocation method:");
			gridBagConstraints4.gridx = 2;
			gridBagConstraints4.gridy = 2;
			gridBagConstraints4.weightx = 1.0;
			gridBagConstraints4.fill = java.awt.GridBagConstraints.NONE;
			gridBagConstraints4.anchor = java.awt.GridBagConstraints.WEST;
			gridBagConstraints4.insets = new java.awt.Insets(15,0,0,0);
			gridBagConstraints5.gridx = 3;
			gridBagConstraints5.gridy = 2;
			gridBagConstraints5.anchor = java.awt.GridBagConstraints.EAST;
			gridBagConstraints5.insets = new java.awt.Insets(15,0,0,10);
			jLabel3.setVisible(false);
			gridBagConstraints11.gridx = 0;
			gridBagConstraints11.gridy = 3;
			gridBagConstraints11.insets = new java.awt.Insets(10,0,0,0);
			jLabel5.setText("Result:");
			gridBagConstraints31.weightx = 1.0;
			gridBagConstraints31.weighty = 1.0;
			gridBagConstraints31.fill = java.awt.GridBagConstraints.BOTH;
			gridBagConstraints31.gridx = 0;
			gridBagConstraints31.gridy = 4;
			gridBagConstraints31.gridwidth = 4;
			jPanel3.add(jLabel3, gridBagConstraints1);
			jPanel3.add(getMethodDescriptorPath(), gridBagConstraints2);
			jPanel3.add(getJScrollPane1(), gridBagConstraints31);
			jPanel3.add(jLabel4, gridBagConstraints3);
			jPanel3.add(getInvocationMethod(), gridBagConstraints4);
			jPanel3.add(getJButton1(), gridBagConstraints5);
			jPanel3.add(jLabel5, gridBagConstraints11);
			
			
		}
		return jPanel3;
	}
	
	/**
	 * This method initializes jTextField1	
	 * 	
	 * @return javax.swing.JTextField	
	 */    
	private JTextField getMethodDescriptorPath() {
		if (methodDescriptorPath == null) {
			methodDescriptorPath = new JTextField();
			methodDescriptorPath.setColumns(30);
			methodDescriptorPath.setVisible(false);
			methodDescriptorPath.setToolTipText("The relative path and file name of the method descriptor file.  The path should be relative to the project application directory (src/application) e.g. uk/gov/dca...");
		}
		return methodDescriptorPath;
	}
	
	/**
	 * This method initializes jComboBox	
	 * 	
	 * @return javax.swing.JComboBox	
	 */    
	private JComboBox getInvocationMethod() {
		if (invocationMethod == null) {
			invocationMethod = new JComboBox();
			invocationMethod.addItem(TestService.REMOTE);
			invocationMethod.addItem(TestService.LOCAL);
			invocationMethod.setSelectedItem(TestService.REMOTE);
			invocationMethod.setToolTipText("Controls whether the service is executed locally, within the current process, or remotely, as a web service ");
			invocationMethod.addActionListener(new java.awt.event.ActionListener() { 
				public void actionPerformed(java.awt.event.ActionEvent e) {
					boolean visible;
					
					if(getInvocationMethod().getSelectedItem().equals(TestService.LOCAL)) {
						visible = true;
					}
					else {
						visible = false;
					}	
					getMethodDescriptorPath().setVisible(visible);
					jLabel3.setVisible(visible);
				}
			});
		}
		return invocationMethod;
	}
	
	/**
	 * This method initializes jButton1	
	 * 	
	 * @return javax.swing.JButton	
	 */    
	private JButton getJButton1() {
		if (jButton1 == null) {
			jButton1 = new JButton();
			jButton1.setText("Execute");
			jButton1.addActionListener(new java.awt.event.ActionListener() { 
				public void actionPerformed(java.awt.event.ActionEvent e) {    
					String resultText = null;
					TestService service = new TestService();
					
					TestServiceGUI.this.setCursor(Cursor.getPredefinedCursor(Cursor.WAIT_CURSOR));

					String validationFailureMessage = performValidation();
					
					if(validationFailureMessage != null && validationFailureMessage.length() > 0) {
						JOptionPane.showMessageDialog(TestServiceGUI.this, "Please correct the following:\n\n" + validationFailureMessage,"Input Error", JOptionPane.ERROR_MESSAGE);
					}
					else {
					
						try {
							if(getInvocationMethod().getSelectedItem().equals(TestService.LOCAL)) {
								resultText = service.performQueryTest(getServiceName().getText(), getMethodName().getText(), getParameters().getText(), getMethodDescriptorPath().getText());
								//throw new RuntimeException("Error: local calls are not supported");
							} 
							else if(getInvocationMethod().getSelectedItem().equals(TestService.REMOTE)) {
								resultText = service.invokeServiceMethod(getServiceName().getText(), getMethodName().getText(), getParameters().getText());
							}
						}
						catch(Exception ex) {
							// write any errors to the result text pane
							resultText = "ERROR: " + ex.getMessage();
						}
					
						getResult().setText(resultText);
					}
					TestServiceGUI.this.setCursor(Cursor.getDefaultCursor());
				}
			});
		}
		return jButton1;
	}
 	
	/**
	 * This method initializes jEditorPane1	
	 * 	
	 * @return javax.swing.JEditorPane	
	 */    
	private JEditorPane getResult() {
		if (result == null) {
			result = new JEditorPane();
			result.setEditable(false);
		}
		return result;
	}
            }  //  @jve:decl-index=0:visual-constraint="48,8"
