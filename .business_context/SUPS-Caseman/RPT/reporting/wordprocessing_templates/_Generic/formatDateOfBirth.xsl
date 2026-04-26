<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:fo="http://www.w3.org/1999/XSL/Format" 
	xmlns:supsfo="http://eds.com/supsfo" 
	xmlns:xalan="http://xml.apache.org/xalan"
	exclude-result-prefixes="ora w v w10 sl aml wx o dt st1"
>
	<xsl:template name="format-date-of-birth-template">
		<!-- Param : mode         : Set at the time of call from Addressee.xsl. Examples of possible values are "subject", "defendant", "instigator_claimant" etc. -->
		<!-- Param : party        : Set at the time of call from Addressee.xsl. Current party whose output is being generated. 
									Same as $addressee. Could be claimant, defendant, representative etc.-->
		<!-- Param : partyType    : Set in the dobParameter element of *-FO.xml. Means the type of party whose date of birth needs to be displayed. -->
		<!-- Param : referenceCJR : Type of output being produced. Example, CJR065A, same as /supsfo:root/supsfo:defaultFooter/@id -->
		
		<xsl:param name="mode"/> 
		<xsl:param name="party"/>
		<xsl:param name="partyType"/>	
		<xsl:param name="referenceCJR"/>

<!--	
	Some debugging code. Please do not remove.
	
		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>f</fo:block>
		</fo:table-cell>
		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>
				Party0 = <xsl:value-of select="local-name()"/>
				Party2 = <xsl:value-of select="local-name(xalan:nodeset($party))"/>

				Party10 = <xsl:value-of select="name()"/>
				Party12 = <xsl:value-of select="name(xalan:nodeset($party))"/>
			</fo:block>
		</fo:table-cell>

		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>Type : <xsl:value-of select="xalan:nodeset($party)/type"/></fo:block>
		</fo:table-cell>
-->				
<!--
		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>Type : <xsl:value-of select="xalan:nodeset($party)/type"/></fo:block>
		</fo:table-cell>
-->
<!--
		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>Doc : <xsl:value-of select="$referenceCJR"/></fo:block>
		</fo:table-cell>

		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>Mode : <xsl:value-of select="$mode"/></fo:block>
		</fo:table-cell>
-->

			<xsl:choose>

				<xsl:when test="string-length(xalan:nodeset($party)/type) = 0">
					<!-- if the addressee's type does not have any contents then do nothing -->
					<!-- RenderX Replacement: Added empty table cells to ensure that table-row always contains table-cells-->
					<fo:table-cell/>
					<fo:table-cell/>
				</xsl:when>

				<xsl:when test="($referenceCJR = 'CJR036' or $referenceCJR = 'CJR037') and $mode = 'subject'">					
					<!-- No date of birth to be displayed for the subject on this output -->
					<!-- regardless of whether or not the subject is represented by a solicitor -->
					<!-- RenderX Replacement: Added empty table cells to ensure that table-row always contains table-cells-->
					<fo:table-cell/>
					<fo:table-cell/>
				</xsl:when>

				<!-- Party passed is solicitor -->
				<xsl:when test="xalan:nodeset($party)/type = 'representative'">

					<!-- Store solicitor's surrogate id in a variable for later comparison to find out party it represents -->
					<xsl:variable name="representativeId"> 
						<xsl:value-of select="xalan:nodeset($party)/surrogateid"/> 
					</xsl:variable>

					<xsl:choose>
														
						<xsl:when test="$referenceCJR = 'CJR1424' or $referenceCJR = 'CJR013' or $referenceCJR = 'CJR014'">
							<!-- Special Case : if Claimant is represented by solicitor, 
								 then use subject (always defendant here) date of birth -->
							<xsl:call-template name="print_date_of_birth">
								<xsl:with-param name="party">
									<xsl:copy-of select="/variabledata/claim/defendant[number = $vdSubjectNumber]/*"/>
								</xsl:with-param>
								<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
								<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
							</xsl:call-template>
						</xsl:when>
						<!-- For these outputs, show date of birth of Subject -->
						<xsl:when test="$referenceCJR = 'CJR065A' or $referenceCJR = 'O_5_5' or $referenceCJR = 'N32'">									
							<!--
								RenderX Replacement: Replaced if element with choose element to ensure that table-row
								always contains table cells
							-->
							<xsl:choose>
								<xsl:when test="$mode = 'subject'">
									<xsl:call-template name="print_date_of_birth">
										<xsl:with-param name="party">
											<xsl:copy-of select="/variabledata/claim/*[number = $vdSubjectNumber and type = $vdSubjectType]/*"/>
										</xsl:with-param>
										<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
										<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<fo:table-cell/>
									<fo:table-cell/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						
						<!-- if CJR036 and CJR037, then find which type of party is represented by solicitor. 
							Depends on $mode passed to template -->
						<xsl:when test="$referenceCJR = 'CJR036' or $referenceCJR = 'CJR037'">									
							<xsl:call-template name="print_date_of_birth">
								<xsl:with-param name="party">
									<xsl:if test="$mode = 'instigator_claimant'">
										<xsl:copy-of select="/variabledata/claim/claimant[representativeid = $representativeId]/*"/>
									</xsl:if>
									<xsl:if test="$mode = 'instigator_defendant'">
										<xsl:copy-of select="/variabledata/claim/defendant[representativeid = $representativeId]/*"/>
									</xsl:if>
									<xsl:if test="$mode = 'instigator_pt20claimant'">
										<xsl:copy-of select="/variabledata/claim/part20claimant[representativeid = $representativeId]/*"/>
									</xsl:if>
									<xsl:if test="$mode = 'instigator_pt20defendant'">
										<xsl:copy-of select="/variabledata/claim/part20defendant[representativeid = $representativeId]/*"/>
									</xsl:if>																											
								</xsl:with-param>
								<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
								<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
							</xsl:call-template>							
						</xsl:when>						
						
						<xsl:otherwise>
							<!--
								RenderX Replacement: Replaced if element with choose element to ensure that table-row
								always contains table cells
							-->
							<xsl:choose>
								<xsl:when test="/variabledata/claim/*[representativeid = $representativeId]/type = 'defendant' or
												/variabledata/claim/*[representativeid = $representativeId]/type = 'part20defendant'">
									<!-- If party has a representative then display date of birth of party -->
									<!-- as long as the party is a defendant or a part 20 defendant -->
									<!-- TODO: What happens if a representative represents more than one party??? -->
									<xsl:call-template name="print_date_of_birth">
										<xsl:with-param name="party">
											<!-- Pass the party who is being represented by the solicitor -->
											<xsl:copy-of select="/variabledata/claim/*[representativeid = $representativeId]/*"/>
										</xsl:with-param>
										<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
										<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<fo:table-cell/>
									<fo:table-cell/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
						
					</xsl:choose>

				</xsl:when>

				<xsl:when test="xalan:nodeset($party)/type = 'claimant' or 
								xalan:nodeset($party)/type = 'part20claimant' or
								xalan:nodeset($party)/type = 'part20defendant'">
					
					<!--
						RenderX Replacement: Replaced multiple if elements with a single choose element to ensure
						that table-row always contains table cells
					-->
					<xsl:choose>
						<xsl:when test="$referenceCJR = 'CJR1424' or $referenceCJR = 'CJR013' or $referenceCJR = 'CJR014'">
							<!-- The addresses is the claimant, but we need to display the date of birth of subject 
								(always defendant)
							-->
							<xsl:call-template name="print_date_of_birth">
								<xsl:with-param name="party">
									<xsl:copy-of select="/variabledata/claim/defendant[number = $vdSubjectNumber]/*"/>
								</xsl:with-param>
								<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
								<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
							</xsl:call-template>						
						</xsl:when>
						<!-- Only display DateOfBirth if the party passed is the Subject. -->
						<xsl:when test="$referenceCJR = 'CJR065A' or $referenceCJR = 'O_5_5' or $referenceCJR = 'N441A' or $referenceCJR = 'N32'">
											
							<xsl:variable name="vdPassedPartyNumber">
								<xsl:value-of select="xalan:nodeset($party)/number"/>
							</xsl:variable>
							<xsl:variable name="vdPassedPartyType">
								<xsl:value-of select="xalan:nodeset($party)/type"/>
							</xsl:variable>	
							
							<xsl:choose>
								<xsl:when test="$vdPassedPartyNumber = $vdSubjectNumber and $vdSubjectType = $vdPassedPartyType"> 
									<xsl:call-template name="print_date_of_birth">
										<xsl:with-param name="party"><xsl:value-of select="$party"/></xsl:with-param>
										<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
										<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
									</xsl:call-template>	
								</xsl:when>
								<xsl:otherwise>
									<fo:table-cell/>
									<fo:table-cell/>
								</xsl:otherwise>
							</xsl:choose>
				
						</xsl:when>
						
						<!-- Only display DateOfBirth if following particular outputs are produced -->
						<xsl:when test="$referenceCJR = 'CJR036' or $referenceCJR = 'CJR037'">
							<xsl:call-template name="print_date_of_birth">
								<xsl:with-param name="party"><xsl:value-of select="$party"/></xsl:with-param>
								<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
								<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
							</xsl:call-template>								
						</xsl:when>

						<xsl:otherwise>
							<fo:table-cell/>
							<fo:table-cell/>
						</xsl:otherwise>
						
					</xsl:choose>
				</xsl:when>
							
				<xsl:otherwise>
					<!-- Any other type of party has been passed, 
						like Defendant/Debtor/Creditor/Employer etc has been passed -->
					<xsl:choose>
						<xsl:when test="$referenceCJR = 'CJR065A' or $referenceCJR = 'N32'">
							<!--
								RenderX Replacement: Replaced if element with choose element to ensure that table-row
								always contains table cells
							-->
							<xsl:choose>
								<xsl:when test="$mode = 'subject'">
									<xsl:call-template name="print_date_of_birth">
										<xsl:with-param name="party">
											<xsl:copy-of select="/variabledata/claim/*[number = $vdSubjectNumber and type = $vdSubjectType]/*"/>
										</xsl:with-param>
										<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
										<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<fo:table-cell/>
									<fo:table-cell/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>	
						<xsl:otherwise>
							<xsl:call-template name="print_date_of_birth">
								<xsl:with-param name="party"><xsl:value-of select="$party"/></xsl:with-param>
								<xsl:with-param name="partyType"><xsl:value-of select="$partyType"/></xsl:with-param>
								<xsl:with-param name="referenceCJR"><xsl:value-of select="$referenceCJR"/></xsl:with-param>
							</xsl:call-template>							
						</xsl:otherwise>						
					</xsl:choose>
				</xsl:otherwise>

			</xsl:choose>
			
	</xsl:template>

	<!-- Template to actually print the Date of Birth given the party, type and output type -->
	<xsl:template name="print_date_of_birth">
		<!-- Param : mode         : Set at the time of call from Addressee.xsl. Examples of possible values are "subject", "defendant", "instigator_claimant" etc. -->
		<!-- Param : party        : Set at the time of call from Addressee.xsl. Current party whose output is being generated. 
									Same as $addressee. Could be claimant, defendant, representative etc.-->
		<!-- Param : partyType    : Set in the dobParameter element of *-FO.xml. Means the type of party whose date of birth needs to be displayed. -->
		<!-- Param : referenceCJR : Type of output being produced. Example, CJR065A, same as /supsfo:root/supsfo:defaultFooter/@id -->
		
		<xsl:param name="party"/>
		<xsl:param name="partyType"/>	
		<xsl:param name="referenceCJR"/>	
		<xsl:variable name="partyTypePassed">
			<!-- In case this template was called as a result of representative being selected from Addressee XSL, we need to just select 
				1st party that is represented by the solicitor.
			-->				
			<xsl:value-of select="xalan:nodeset($party)/type[1]"/>
		</xsl:variable>
<!--		
		<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
			<fo:block>Type : <xsl:value-of select="$partyTypePassed"/> </fo:block>
		</fo:table-cell>		
-->
		<!--
			RenderX Replacement: Replaced if element with choose element to ensure that table-row
			always contains table cells
		-->
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($party)/dateofbirth) > 0">
				<xsl:choose>
					<xsl:when test="$partyType = 'subject' or $partyType = 'defendant' or $partyType = 'debtor' or $partyType = 'instigator'">
							<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
								<fo:block font-weight="bold">
									<!-- Call to convert the arguements to "proper" case. E.g. "part 20 defendant" into "Part 20 Defendant"-->
									<xsl:call-template name="convertcase">
										<xsl:with-param name="toconvert">
											<xsl:choose>
												<xsl:when test="$partyTypePassed = 'part20defendant'">part 20 defendant</xsl:when>
												<xsl:when test="$partyTypePassed = 'part20claimant'">part 20 claimant</xsl:when>
												<xsl:otherwise><xsl:value-of select="$partyTypePassed"/></xsl:otherwise>
											</xsl:choose>									
										</xsl:with-param>
										<xsl:with-param name="conversion">proper</xsl:with-param>
									</xsl:call-template>'s date of birth
									</fo:block>
							</fo:table-cell>
					</xsl:when>
				</xsl:choose>
				<fo:table-cell text-align="left" border-width="0.01in" border-style="solid" padding="0.1cm">
					<fo:block>
						<xsl:call-template name="format-date-placeholder">
							<xsl:with-param name="date-xpath">
								<xsl:choose>
									<xsl:when test="$partyType = 'subject'">
										<xsl:value-of select="$vdDateOfBirthForSubject"/>
									</xsl:when>
									<xsl:when test="$partyType = 'defendant'">
										<xsl:value-of select="xalan:nodeset($party)/dateofbirth"/>
									</xsl:when>			
									<xsl:when test="$partyType = 'debtor'">
										<xsl:value-of select="xalan:nodeset($party)/dateofbirth"/>
									</xsl:when>		
									<xsl:when test="$partyType = 'instigator'">
										<xsl:value-of select="xalan:nodeset($party)/dateofbirth"/>
									</xsl:when>														
								</xsl:choose>
							</xsl:with-param>
						</xsl:call-template>
						<!--Party = <xsl:value-of select="$referenceCJR"/> -->
					</fo:block>
				</fo:table-cell>
			</xsl:when>
			<xsl:otherwise>
				<fo:table-cell/>
				<fo:table-cell/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>	
</xsl:stylesheet>