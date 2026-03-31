<?xml version="1.0" encoding="UTF-8"?>
<!--
	Change History:
	27/11/2006 - Chris Vincent, added tabindex="-1" to body tag, shifted the progress bar popup so below the
				 status bar and set style height: 534px on table of class content instead of using the specific
				 global stylesheet which results in the incorrect alignment of the status bar.  For the WP
				 generated screens, needed to test if is a CO output Q&A as has a different sized header to
				 the Case & AE Q&A's so must use a different style for the body.  UCT Defect 737.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">
	<!-- Don't need spacing in the output -->
	<!--xsl:strip-space elements="*"/-->
	<!-- Present the output as a normal XML document -->
	<xsl:output method="html" 
			version="1.0" 
			indent="yes" 
			stand-alone="yes"
			media-type="text/html" 
			doctype-public='-//W3C//DTD HTML 4.01//EN" "http://www.w3c.org/TR/html4/strict.dtd' omit-xml-declaration="yes" />
    
				<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="Screen">
		<xsl:variable name="thisScreenId"><xsl:value-of select="Name"/></xsl:variable>
		<xsl:variable name="wPScreen"><xsl:value-of select="WPScreen"/></xsl:variable>
		<xsl:variable name="reportModuleGroup"><xsl:value-of select="ReportModuleGroup"/></xsl:variable>
		<html>
			<head>
				<title>CaseMan Enter Variable Data <xsl:value-of select="Name"/></title>
				<meta http-equiv="charset" content="UTF8"/>
				<link href="../../CaseManStyleSheet.css" type="text/css" rel="stylesheet" />
				<link href="@wp_directory_root@/OracleReports.css" type="text/css" rel="stylesheet"></link>		
				<script type="text/javascript" src="../../../Framework.js">/** **/</script>
				<script type="text/javascript" src="../../../CaseManValidationHelper.js">/** **/</script>
				<script type="text/javascript" src="../../../CaseManUtils.js" charset="ISO-8859-15">/** **/</script>
				<script type="text/javascript" src="../../../Messages.js">/** **/</script>
				<script type="text/javascript" src="../../../ReportUtils.js"></script>
				<script type="text/javascript" src="../../../CaseManFormParameters.js">/** **/</script>
				<script type="text/javascript" src="../../../NavigationController.js">/** **/</script>
				<script type="text/javascript" src="../../../PartyTypeCodes.js">/** **/</script>

    			<xsl:element name="script">
					<xsl:attribute name="src">@wp_directory_root@/<xsl:value-of select="Name"/>.js</xsl:attribute>
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:text>/** **/</xsl:text>
				</xsl:element>
			</head>
			<body tabindex="-1">
				<form id="OracleReportForm" name="OracleReportForm" action="#">
				   	<table class="CaseManMenuBar">
      					  <tr>
       				    	<td></td>
    					  </tr>
   					</table>			
					<table class="layout">
					<xsl:choose>
						<xsl:when test="$wPScreen = 'Y'">
								<tr>
									<td>
										<div class="panel">	
											<table class="content">
												<tr>
													<td>
														<table>
															
															<xsl:if test="$reportModuleGroup = 'CJR'">
															<tr>
																<td style="width: 150px">
																	<label for="Header_CaseNumber">Case Number</label>
																</td>
																<td>
																	<input id="Header_CaseNumber" type="text" size="15"/>
																</td>
															</tr>			
															<tr>
																<td>
																	<label>Parties on Case</label>
																</td>
																<td colspan="6">
																	<script type="text/javascript">Grid.createInline("Header_PartyTypeListGrid", ["Party Type", "Number", "Name"], 3, 1);</script>																					
																</td>
															</tr>																													
															</xsl:if>
															<xsl:if test="$reportModuleGroup = 'AE'">
															<tr>
																<td>
																	<label for="Header_CaseNumber">Case Number</label>
																</td>
																<td>
																	<input id="Header_CaseNumber" type="text" size="15"/>
																</td>
																<td>
																	<label for="Header_AENumber">AE Number</label>
																</td>
																<td>
																	<input id="Header_AENumber" type="text" size="15"/>
																</td>
																<td>
																	<label for="Header_AEType">AE Type</label>
																</td>
																<td>
																	<input id="Header_AEType" type="text" size="30"/>
																</td>																	
															</tr>	
															<tr>
																<td>
																	<label>Parties on Case</label>
																</td>
																<td colspan="6">
																	<script type="text/javascript">Grid.createInline("Header_PartyTypeListGrid", ["Party Type", "Number", "Name"], 3, 1);</script>																					
																</td>
															</tr>																															
															</xsl:if>
															<xsl:if test="$reportModuleGroup = 'CO'">
															<tr>
																<td style="width: 150px">
																	<label for="Header_CONumber">CO Number</label>
																</td>
																<td>
																	<input id="Header_CONumber" type="text" size="15"/>
																</td>
															</tr>	
															<tr>
																<td style="width: 150px">
																	<label for="Header_DebtorName">Debtor Name</label>
																</td>
																<td>
																	<input id="Header_DebtorName" type="text" size="70"/>
																</td>																
															</tr>															
															</xsl:if>																																
														
																									
															<tr>
																<td>
																	<label for="Header_Order">Order/Notice</label>
																</td>
																<td colspan="6">
																	<input name="header_Order" id="Header_Order" type="text" size="110"/>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
										</div>
									</td>
								</tr>	
						</xsl:when >
						<xsl:otherwise>					
							<tr>
								<td class="alignCentre">
									<div class="panel">
										<table class="headercontent">
											<tr>
												<td class="alignCentre">	
													<table>
														<tr>
															<td align="left" style="width: 150px">
																<label>Owning Court</label>
															</td>
															<td align="left" style="width: 60px">
																<input id="OwningCourt_Code" type="text" size="5"/>
															</td>
															<td align="left" style="width: 20px">
																<input id="OwningCourt_Name" type="text" size="20"/>
															</td>					
														</tr>											
													</table>	
												</td>
											</tr>
										</table>
									</div>	
								</td>
							</tr>						
							</xsl:otherwise>	
						</xsl:choose>
						<xsl:choose>
							<xsl:when test="$wPScreen = 'Y'">	
								<xsl:variable name="tGroups">
									<xsl:value-of select="count(/Screen/GroupId)"/>
								</xsl:variable>	
								<xsl:choose>
									<xsl:when test="$tGroups = 0">
										<tr>
											<td class="alignCentre">
												<div class="panel">
													
													<xsl:choose>
														<xsl:when test="$reportModuleGroup = 'CO'">
															<table class="rel5noparamcontentco">
																<tr>											
																	<td class="alignCentre">
																		<table>
																			 <tr>
																				<td align="center" style="width: 650px" colspan="2">
																					<label>Click on Save button to run the Report</label>
																				</td>
																			</tr>
																		</table>	
																	</td>
																</tr>
															</table>
														</xsl:when>
														
														<xsl:otherwise>
															<table class="rel5noparamcontent">
																<tr>											
																	<td class="alignCentre">
																		<table>
																			 <tr>
																				<td align="center" style="width: 650px" colspan="2">
																					<label>Click on Save button to run the Report</label>
																				</td>
																			</tr>
																		</table>	
																	</td>
																</tr>
															</table>
														</xsl:otherwise>
													</xsl:choose>									
												</div>								
											</td>
										</tr>
									</xsl:when>								
									<xsl:otherwise>						
									<tr>
										<td>
										<div class="panel">
											
											<xsl:choose>
												<xsl:when test="$reportModuleGroup = 'CO'">
													<table class="contentcontentco">
														<tr>																	
															<td>	
																<div id="scroller_container">
																<div id="scroller" class="scrolling_region"> 
																
																	<xsl:for-each select="GroupId">
																		<xsl:variable name="thisGroupId">
																			<xsl:value-of select="."/>
																		</xsl:variable>	
																		<xsl:variable name="totalGroups">
																			<xsl:value-of select="count(/Screen/GroupId)"/>
																		</xsl:variable>		
																		<xsl:comment><xsl:value-of select="$totalGroups"/></xsl:comment>													
																		<xsl:comment><xsl:value-of select="$thisGroupId"/></xsl:comment>			
																		<xsl:call-template name="GenerateHTML">
																			<xsl:with-param name="screenId">
																				<xsl:value-of select="$thisScreenId"/>
																			</xsl:with-param>						
																			<xsl:with-param name="thisGroupId">
																				<xsl:value-of select="$thisGroupId"/>
																			</xsl:with-param>
																			<xsl:with-param name="paramTotalGroups">
																				<xsl:value-of select="$totalGroups"/>
																			</xsl:with-param>
																			<xsl:with-param name="paramWPScreen">
																				<xsl:value-of select="$wPScreen"/>
																			</xsl:with-param>																				
																		</xsl:call-template>
																	</xsl:for-each>	
																
																</div>
																</div> 
															</td>	
														</tr>
													</table>	
												</xsl:when>
												
												<xsl:otherwise>		
													<table class="contentcontent">
														<tr>																	
															<td>	
				
																<div id="scroller_container">
																<div id="scroller" class="scrolling_region"> 
																
																	<xsl:for-each select="GroupId">
																		<xsl:variable name="thisGroupId">
																			<xsl:value-of select="."/>
																		</xsl:variable>	
																		<xsl:variable name="totalGroups">
																			<xsl:value-of select="count(/Screen/GroupId)"/>
																		</xsl:variable>		
																		<xsl:comment><xsl:value-of select="$totalGroups"/></xsl:comment>													
																		<xsl:comment><xsl:value-of select="$thisGroupId"/></xsl:comment>			
																		<xsl:call-template name="GenerateHTML">
																			<xsl:with-param name="screenId">
																				<xsl:value-of select="$thisScreenId"/>
																			</xsl:with-param>						
																			<xsl:with-param name="thisGroupId">
																				<xsl:value-of select="$thisGroupId"/>
																			</xsl:with-param>
																			<xsl:with-param name="paramTotalGroups">
																				<xsl:value-of select="$totalGroups"/>
																			</xsl:with-param>
																			<xsl:with-param name="paramWPScreen">
																				<xsl:value-of select="$wPScreen"/>
																			</xsl:with-param>																				
																		</xsl:call-template>
																	</xsl:for-each>	
																
																</div>
																</div> 
															</td>	
														</tr>
													</table>
												</xsl:otherwise>
											</xsl:choose>												
										</div>								
										</td>
									</tr>	
									</xsl:otherwise>																						
								</xsl:choose>
							</xsl:when>	
							<xsl:otherwise>
								<tr>
									<td class="alignCentre">
										<div class="panel">
											<table class="content" style="height:534px;">
												<tr>											
													<td class="alignCentre">
														<xsl:for-each select="GroupId">
															<xsl:variable name="thisGroupId">
																<xsl:value-of select="."/>
															</xsl:variable>	
															<xsl:variable name="totalGroups">
																<xsl:value-of select="count(/Screen/GroupId)"/>
															</xsl:variable>		
															<xsl:comment><xsl:value-of select="$totalGroups"/></xsl:comment>													
															<xsl:comment><xsl:value-of select="$thisGroupId"/></xsl:comment>			
															<xsl:call-template name="GenerateHTML">
																<xsl:with-param name="screenId">
																	<xsl:value-of select="$thisScreenId"/>
																</xsl:with-param>						
																<xsl:with-param name="thisGroupId">
																	<xsl:value-of select="$thisGroupId"/>
																</xsl:with-param>
																<xsl:with-param name="paramTotalGroups">
																	<xsl:value-of select="$totalGroups"/>
																</xsl:with-param>	
																<xsl:with-param name="paramWPScreen">
																	<xsl:value-of select="$wPScreen"/>
																</xsl:with-param>																																				
															</xsl:call-template>
														</xsl:for-each>	
													</td>
												</tr>
											</table>													
										</div>								
									</td>
								</tr>																
							</xsl:otherwise>	
						</xsl:choose>									
					</table>
					<!--
					<xsl:apply-templates select="GroupId">
						<xsl:with-param name="screenId">
							<xsl:value-of select="$thisScreenId"/>
						</xsl:with-param>												
					</xsl:apply-templates>
					-->					

					<!-- Status Bar Panel -->
					<xsl:choose>
						<xsl:when test="$wPScreen = 'Y'">
							<script type="text/javascript">		
								ActionBarRenderer.createInline(
									"status_bar",
									[
										{id: "Status_SaveButton", label: "Save"}
									]
								);	
							</script>						
						</xsl:when >
						<xsl:otherwise>
							<script type="text/javascript">		
								ActionBarRenderer.createInline(
									"status_bar",
									[
										{id: "Status_RunReportButton", label: "Run Report"},
										{id: "Status_Close_Btn", label: "Close"}
									]
								);
							</script>							
						</xsl:otherwise>
					</xsl:choose>					
					
					<!-- End Status Bar Panel -->	
					
			<!-- Progress Indicator Popup -->
			<div class="popup" id="ProgressIndicator_Popup">
				<div class="panel" id="ProgressIndicator_Panel">
					<table width="100%" class="content" cellspacing="5">
						<tr>
							<td>
								<label for="Progress_Bar">Generating Report</label>
							</td>
						</tr>
						<tr>
							<td>
						  		<input id="Progress_Bar" type="text" size="67"/>
							</td>
						</tr>
						<tr>
							<td id="Progress_Status"></td>
						</tr>
					</table>
				</div>
				<div id="ProgressIndicator_ActionBarContainer">
					<script type="text/javascript">
						ActionBarRenderer.createInlineNoStatusBar(
							"ProgressIndicator_ActionBar",
							[
								{label: "Cancel", id: "Popup_Cancel"}
							]
						);	
					</script>	
				</div>
			</div>
			<!-- End Progress Indicator Popup -->
		
				</form>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="GenerateHTML">
		<xsl:param name="screenId"/>
		<xsl:param name="thisGroupId"/>	
		<xsl:param name="paramTotalGroups"/>	
		<xsl:param name="paramWPScreen"/>		
		<table>
			<xsl:for-each select="document('../Grouping.xml')/Groups/Group[@GroupId=$thisGroupId]/QuestionId">
				<xsl:variable name="thisQuestionId">
					<xsl:value-of select="."/>
				</xsl:variable>
				<xsl:variable name="thisQuestionFile"><xsl:text>../Questions/</xsl:text><xsl:value-of select="$thisQuestionId"/><xsl:text>.xml</xsl:text></xsl:variable>
				<xsl:variable name="objectName"><xsl:value-of select="document($thisQuestionFile)/Question/ObjectName"/></xsl:variable>
				<xsl:comment><xsl:value-of select="$thisQuestionFile"/></xsl:comment>
				<xsl:variable name="isQuestion"><xsl:value-of select="document($thisQuestionFile)/Question/IsQuestion"/></xsl:variable>
				<xsl:choose>
					<xsl:when test="$isQuestion = 'N'">
				 		<tr>
							<td align="center" style="width: 650px" colspan="2">
								<xsl:element name="label">
									<!--xsl:attribute name="for"><xsl:value-of select="$objectName"/></xsl:attribute-->
									<xsl:value-of select="document($thisQuestionFile)/Question/Label"/>
								</xsl:element>
							</td>
						</tr>
					</xsl:when>	
					<xsl:otherwise>							
				 		<tr>
					 		<xsl:choose>
								<xsl:when test="$paramWPScreen = 'Y'">
									<td align="right" style="width: 475px">
										<xsl:element name="label">
											<!--xsl:attribute name="for"><xsl:value-of select="$objectName"/></xsl:attribute-->
											<xsl:value-of select="document($thisQuestionFile)/Question/Label"/>
										</xsl:element>
									</td>	
									<td align="right" style="width: 20px">
									</td>							
								</xsl:when >
								<xsl:otherwise>
									<td align="left" style="width: 200px">
									<xsl:element name="label">
										<!--xsl:attribute name="for"><xsl:value-of select="$objectName"/></xsl:attribute-->
										<xsl:value-of select="document($thisQuestionFile)/Question/Label"/>
									</xsl:element>
							</td>								
								</xsl:otherwise>
							</xsl:choose>	
							<td class="alignLeft">
								<xsl:copy-of select="document($thisQuestionFile)/Question/Html/*"/>
							</td>
						</tr>
					</xsl:otherwise>
				</xsl:choose>										
			</xsl:for-each>
			<xsl:if test="$paramTotalGroups &gt; 1">
				<tr>
					<td colspan="2"><hr></hr></td>
				</tr>
			</xsl:if>
		</table>			
	</xsl:template>
</xsl:stylesheet>