<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:sl="http://schemas.microsoft.com/schemaLibrary/2003/core" xmlns:aml="http://schemas.microsoft.com/aml/2001/core" xmlns:wx="http://schemas.microsoft.com/office/word/2003/auxHint" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:st1="urn:schemas-microsoft-com:office:smarttags" w:macrosPresent="no" w:embeddedObjPresent="yes" w:ocxPresent="no">
	<xsl:output method="xml" indent="yes"/>
	<xsl:preserve-space elements="*"/>
		<xsl:variable name="outputLocation">C:\build\wp\mappings\VariableToQuestionMapping.xml</xsl:variable>
		<xsl:variable name="outputDocument" select="document($outputLocation)"/>
	<xsl:template match="*" priority="-1" mode="copy"><xsl:text disable-output-escaping="yes">&lt;</xsl:text><xsl:value-of select="local-name()"/><xsl:text> </xsl:text><xsl:apply-templates select="@*"/><xsl:if test="(local-name() != 'text') and (count(./*) = 0) and (not(text()))"> /</xsl:if><xsl:text disable-output-escaping="yes">&gt;</xsl:text><xsl:if test="(local-name() != 'text') "><xsl:text disable-output-escaping="yes">]]&gt;</xsl:text><w:br/><xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text></xsl:if><xsl:apply-templates mode="copy"/><xsl:if test="(local-name() = 'text') or (count(./*) > 0) or (text())"><xsl:text disable-output-escaping="yes">&lt;/</xsl:text><xsl:value-of select="local-name()"/><xsl:text disable-output-escaping="yes">&gt;</xsl:text><xsl:text disable-output-escaping="yes">]]&gt;</xsl:text><w:br/><xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text></xsl:if></xsl:template>
	<xsl:template match="@*"><xsl:value-of select="name()"/><xsl:text>="</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text></xsl:template>
	<xsl:template match="text()" mode="copy"><xsl:value-of select="."/></xsl:template>
	<xsl:template match="comment()" mode="copy"><xsl:copy-of select="."/></xsl:template>
	<xsl:template match="/">
		<w:wordDocument xml:space="preserve">
			<w:fonts>
				<w:defaultFonts w:ascii="Times New Roman" w:fareast="Times New Roman" w:h-ansi="Times New Roman" w:cs="Times New Roman"/>
			</w:fonts>
			<w:styles>
				<w:versionOfBuiltInStylenames w:val="4"/>
				<w:latentStyles w:defLockedState="off" w:latentStyleCount="156"/>
				<w:style w:type="paragraph" w:default="on" w:styleId="Normal">
					<w:name w:val="Normal"/>
					<w:rsid w:val="00BC437F"/>
					<w:rPr>
						<wx:font wx:val="Times New Roman"/>
						<w:sz w:val="20"/>
						<w:sz-cs w:val="20"/>
						<w:lang w:val="EN-GB" w:fareast="EN-GB" w:bidi="AR-SA"/>
					</w:rPr>
				</w:style>
				<w:style w:type="paragraph" w:styleId="Heading1">
					<w:name w:val="heading 1"/>
					<wx:uiName wx:val="Heading 1"/>
					<w:basedOn w:val="Normal"/>
					<w:next w:val="Normal"/>
					<w:rsid w:val="00BC437F"/>
					<w:pPr>
						<w:pStyle w:val="Heading1"/>
						<w:keepNext/>
						<w:spacing w:before="240" w:after="60"/>
						<w:outlineLvl w:val="0"/>
					</w:pPr>
					<w:rPr>
						<w:rFonts w:ascii="Arial" w:h-ansi="Arial" w:cs="Arial"/>
						<wx:font wx:val="Arial"/>
						<w:b/>
						<w:b-cs/>
						<w:kern w:val="32"/>
						<w:sz w:val="32"/>
						<w:sz-cs w:val="32"/>
					</w:rPr>
				</w:style>
				<w:style w:type="paragraph" w:styleId="Heading2">
					<w:name w:val="heading 2"/>
					<wx:uiName wx:val="Heading 2"/>
					<w:basedOn w:val="Normal"/>
					<w:next w:val="Normal"/>
					<w:rsid w:val="00BB4549"/>
					<w:pPr>
						<w:pStyle w:val="Heading2"/>
						<w:keepNext/>
						<w:spacing w:before="240" w:after="60"/>
						<w:outlineLvl w:val="1"/>
					</w:pPr>
					<w:rPr>
						<w:rFonts w:ascii="Arial" w:h-ansi="Arial" w:cs="Arial"/>
						<wx:font wx:val="Arial"/>
						<w:b/>
						<w:b-cs/>
						<w:i/>
						<w:i-cs/>
						<w:sz w:val="28"/>
						<w:sz-cs w:val="28"/>
					</w:rPr>
				</w:style>
				<w:style w:type="character" w:default="on" w:styleId="DefaultParagraphFont">
					<w:name w:val="Default Paragraph Font"/>
					<w:semiHidden/>
				</w:style>
				<w:style w:type="table" w:default="on" w:styleId="TableNormal">
					<w:name w:val="Normal Table"/>
					<wx:uiName wx:val="Table Normal"/>
					<w:semiHidden/>
					<w:rPr>
						<wx:font wx:val="Times New Roman"/>
					</w:rPr>
					<w:tblPr>
						<w:tblInd w:w="0" w:type="dxa"/>
						<w:tblCellMar>
							<w:top w:w="0" w:type="dxa"/>
							<w:left w:w="108" w:type="dxa"/>
							<w:bottom w:w="0" w:type="dxa"/>
							<w:right w:w="108" w:type="dxa"/>
						</w:tblCellMar>
					</w:tblPr>
				</w:style>
				<w:style w:type="list" w:default="on" w:styleId="NoList">
					<w:name w:val="No List"/>
					<w:semiHidden/>
				</w:style>
			</w:styles>
			<w:docPr>
				<w:view w:val="print"/>
				<!--w:zoom w:val="best-fit" w:percent="114"/-->
				<w:proofState w:spelling="clean" w:grammar="clean"/>
				<w:attachedTemplate w:val=""/>
				<w:defaultTabStop w:val="720"/>
				<w:characterSpacingControl w:val="DontCompress"/>
				<w:validateAgainstSchema/>
				<w:saveInvalidXML w:val="off"/>
				<w:ignoreMixedContent w:val="off"/>
				<w:alwaysShowPlaceholderText w:val="on"/>
				<w:compat>
					<w:doNotUseHTMLParagraphAutoSpacing>on</w:doNotUseHTMLParagraphAutoSpacing>
					<w:applyBreakingRules>on</w:applyBreakingRules>
				</w:compat>
			</w:docPr>
			<w:body>
							<wx:sect>
								<w:proofErr w:type="gramStart"/>
								<wx:sub-section>
									<wx:sub-section>
										<w:p>
											<w:pPr>
												<w:pStyle w:val="Heading1"/>
											</w:pPr>
											<w:r>
												<w:t>Document Variables</w:t>
											</w:r>
											<w:proofErr w:type="gramEnd"/>
										</w:p>
										<w:sectPr>
											<w:pgSz w:h="16838" w:w="11906"/>
											<w:pgMar w:gutter="0" w:footer="708" w:header="708" w:left="1800" w:bottom="1440" w:right="1800" w:top="1440"/>
											<w:cols w:space="708"/>
											<w:docGrid w:line-pitch="360"/>
										</w:sectPr>
									</wx:sub-section>
								</wx:sub-section>
							</wx:sect>
				<xsl:for-each select="xsl:stylesheet/xsl:variable">
					<xsl:sort select="@name"/>
					<xsl:variable name="varName">
						<xsl:value-of select="@name"/>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="contains($varName, 'TestVariable')"/>
						<xsl:otherwise>
							<wx:sect>
								<w:proofErr w:type="gramStart"/>
								<wx:sub-section>
									<wx:sub-section>
										<w:p>
											<w:pPr>
												<w:pStyle w:val="Heading2"/>
											</w:pPr>
											<w:r>
												<w:t><xsl:value-of select="@name"/></w:t>
											</w:r>
											<w:proofErr w:type="gramEnd"/>
										</w:p>
										<w:tbl>
											<w:tblPr>
												<w:tblW w:w="8377" w:type="dxa"/>
												<w:tblCellMar>
													<w:left w:w="10" w:type="dxa"/>
													<w:right w:w="10" w:type="dxa"/>
												</w:tblCellMar>
											</w:tblPr>
											<w:tblGrid>
												<w:gridCol w:w="559"/>
												<w:gridCol w:w="6818"/>
											</w:tblGrid>
											<w:tr>
												<w:tc>
													<w:tcPr>
														<w:tcW w:w="559" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t>Code</w:t>
														</w:r>
													</w:p>
												</w:tc>
												<w:tc>
													<w:tcPr>
														<w:noWrap val="on"/>
														<w:tcW w:w="6818" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t><xsl:text disable-output-escaping="yes">&lt;![CDATA[</xsl:text><xsl:apply-templates select="." mode="copy"/><xsl:text disable-output-escaping="yes">]]&gt;</xsl:text></w:t>
														</w:r>
													</w:p>
												</w:tc>
											</w:tr>
											<w:tr>
												<w:tc>
													<w:tcPr>
														<w:tcW w:w="559" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t>Desc.</w:t>
														</w:r>
													</w:p>
												</w:tc>
												<w:tc>
													<w:tcPr>
														<w:tcW w:w="6818" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t></w:t>
														</w:r>
													</w:p>
												</w:tc>
											</w:tr>
<!--Q BEGIN-->
								<xsl:variable name="nameTemp" select="@name"/>																		
									<xsl:for-each select="$outputDocument/mappings/map[name=$nameTemp]/question">
										<xsl:if test="./id != ''">
											<w:tr>
												<w:tc>
													<w:tcPr>
														<w:tcW w:w="559" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t>Q.<xsl:value-of select="./id"/></w:t>
														</w:r>
													</w:p>
												</w:tc>
												<w:tc>
													<w:tcPr>
														<w:tcW w:w="6818" w:type="dxa"/>
														<w:tcBorders>
															<w:top w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:left w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:bottom w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
															<w:right w:val="outset" w:sz="6" wx:bdrwidth="15" w:space="0" w:color="auto"/>
														</w:tcBorders>
														<w:vAlign w:val="center"/>
													</w:tcPr>
													<w:p>
														<w:r>
															<w:t><xsl:value-of select="./xpath"/></w:t>
														</w:r>
													</w:p>
												</w:tc>
											</w:tr>
											</xsl:if>
										</xsl:for-each>											
<!--Q END-->
										</w:tbl>
										<w:sectPr>
											<w:pgSz w:w="11906" w:h="16838"/>
											<w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="708" w:footer="708" w:gutter="0"/>
											<w:cols w:space="708"/>
											<w:docGrid w:line-pitch="360"/>
										</w:sectPr>
									</wx:sub-section>
								</wx:sub-section>
							</wx:sect>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</w:body>
		</w:wordDocument>
	</xsl:template>
</xsl:stylesheet>
