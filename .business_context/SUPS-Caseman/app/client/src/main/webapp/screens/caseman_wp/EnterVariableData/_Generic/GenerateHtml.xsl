<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE xxx [
<!ENTITY nbsp   "&#160;">
<!ENTITY bull   "&#8226;">
]>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">

	
	<xsl:output method="html" 
			version="1.0" 
			indent="yes" stand-alone="yes" 
			media-type="text/html" 
			doctype-public='-//W3C//DTD HTML 4.01//EN" "http://www.w3c.org/TR/html4/strict.dtd' omit-xml-declaration="yes" />
	
    
				<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="Screen">
		<xsl:variable name="thisScreenId"><xsl:value-of select="Name"/></xsl:variable>
		<html>
			<head>
				<title>CaseMan Enter Variable Data <xsl:value-of select="Name"/></title>
				<link href="@wp_directory_root@/../EnterVariableData.css" type="text/css" rel="stylesheet"></link>		
				<script type="text/javascript" src="../../../../Framework.js">/** **/</script>
				<script type="text/javascript" src="../../../../CaseManWPIncludeFiles.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../../WordProcessing.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/WPU.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/Old.js" charset="ISO-8859-15" >/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/HearingAttendeesGUIAdaptor.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/HearingAttendeesRenderer.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/COAttendeesGUIAdaptor.js">/** **/</script>
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/COAttendeesRenderer.js">/** **/</script>				
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/WP_DatePickerRenderer.js">/** **/</script>				
				<script type="text/javascript" src="@wp_directory_root@/../_Generic/Functions/WP_DropDownFieldRenderer.js">/** **/</script>
				<script src="@wp_directory_root@/../../../caseman_uc108_109/MaintainCOFunctions.js" type="text/javascript">/** **/</script>
				<script src="@wp_directory_root@/../../../caseman_uc108_109/MaintainCOVariables.js" type="text/javascript">/** **/</script>
				
    			<xsl:element name="script">
					<xsl:attribute name="src">@wp_directory_root@/<xsl:value-of select="Name"/>.js</xsl:attribute>
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:text>/** **/</xsl:text>
				</xsl:element>
			</head>
			<body>
				<form id="enterVariableData" action="#">
					<table class="CaseManMenuBar">
					  	<tr>
							<td id="navigation_container">&nbsp;</td>
						</tr>
					</table>
					<table class="layout">
						<tr>
							<td>
								<div class="panel">	
									<table class="content">
										<tr>
											<td>
												<table>
													<tr>
														<td style="width: 150px">
															<input id="Header_ScreenType" type="text" value="" size="15"/>
														</td>
														<td>
															<input id="Header_CaseNumber" type="text" size="15"/>
														</td>
													</tr>
													<tr>
														<td>
															<input id="Header_Parties" type="text" Value="" size="15"/>
														</td>
														<td>
															<script type="text/javascript">Grid.createInline("Header_PartyTypeListGrid", ["Party Type", "Number", "Name"], 3, 1);</script>																					
														</td>
													</tr>											
													<tr>
														<td>
															<label for="Header_Order">Order</label>
														</td>
														<td>
															<input id="Header_Order" type="text" size="110"/>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="panel">
									<table class="content">
										<tr>
											<td>
												
												<div id="scroller_container"> 
					                                <div class="scrolling_region" id="scroller"> 
																										
													<table>
														<xsl:apply-templates select="GroupId">
															<xsl:with-param name="screenId">
																<xsl:value-of select="$thisScreenId"/>
															</xsl:with-param>												
														</xsl:apply-templates>
													</table>
					
													</div>
												</div>
					
											</td>
										</tr>
									</table>
								</div>
							</td>
						</tr>
					</table>
					<script type="text/javascript">		
					ActionBarRenderer.createInline("status_bar", [ {id: "Status_SaveButton", label: "Save"} ]);
					</script>
					<div class="popup popupsubform" id="ProgressBar_SubForm"></div>
				</form>
			<script type="text/javascript">Services.formConfigLoaded = true; </script></body>
		</html>
	</xsl:template>

	<xsl:template match="GroupId">
		<xsl:param name="screenId"/>
		
		<xsl:variable name="thisGroupId">
			<xsl:value-of select="."/>
		</xsl:variable>
				
		<xsl:for-each select="document('./Grouping.xml')/Groups/Group[@GroupId=$thisGroupId]/QuestionId">
			<xsl:variable name="thisQuestionId">
				<xsl:value-of select="."/>
			</xsl:variable>
			<xsl:variable name="thisQuestionFile"><xsl:text>./Questions/</xsl:text><xsl:value-of select="$thisQuestionId"/><xsl:text>.xml</xsl:text></xsl:variable>
			<xsl:variable name="objectName"><xsl:value-of select="document($thisQuestionFile)/Question/ObjectName"/></xsl:variable>
			<xsl:comment>Q <xsl:value-of select="$thisQuestionId"/></xsl:comment>
			
			<!-- Check context for visiblitity of html-->
			<xsl:variable name="isVisible" select="document($thisQuestionFile)/Question/Context[@screenId=$screenId]/isVisible"/>
          
          <xsl:choose>
          	<xsl:when test="boolean($isVisible)">
	           <xsl:if test="$isVisible != 'false'">	
					<tr>
						<td style="width: 350px" align="right">
							<xsl:element name="label">
								<xsl:choose>
									<xsl:when test="boolean(document($thisQuestionFile)/Question/Context[@screenId=$screenId]/Label)">										
										<xsl:value-of select="document($thisQuestionFile)/Question/Context[@screenId=$screenId]/Label"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="document($thisQuestionFile)/Question/Label"/>	
									</xsl:otherwise>
								</xsl:choose>
							</xsl:element>
						</td>
						<td>
							<xsl:copy-of select="document($thisQuestionFile)/Question/Html/*"/>
						</td>
					</tr>
				</xsl:if>
			 </xsl:when>
			 <xsl:otherwise>
			 		<tr>
						<td  style="width: 350px" align="right">
							<xsl:element name="label">
								<xsl:value-of select="document($thisQuestionFile)/Question/Label"/>
							</xsl:element>
						</td>
						<td>
							<xsl:copy-of select="document($thisQuestionFile)/Question/Html/*"/>
						</td>
					</tr>
			 </xsl:otherwise>
		  </xsl:choose>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>