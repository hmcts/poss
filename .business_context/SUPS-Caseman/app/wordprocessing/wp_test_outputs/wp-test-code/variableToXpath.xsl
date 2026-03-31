<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xml"/>
	<xsl:strip-space elements="*"/>
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="@*|node()">
	</xsl:template>
	<xsl:template match="xsl:stylesheet">
		<mappings>
			<xsl:apply-templates select="xsl:variable" mode="top"/>
		</mappings>
	</xsl:template>
	<xsl:template match="xsl:variable">
	</xsl:template>
	<xsl:template match="xsl:variable" mode="top">
		<xsl:element name="variable"><xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute><xsl:apply-templates/></xsl:element>
	</xsl:template>
	<xsl:template match="xsl:output">
	</xsl:template>
	<xsl:template match="xsl:template">
	</xsl:template>
	<xsl:template match="xsl:apply-templates">
	</xsl:template>
	<xsl:template match="xsl:call-template">
		<xsl:choose>
			<xsl:when test="@name = 'convertcase'">
				<xsl:apply-templates select="xsl:with-param[@name='toconvert']"/>
			</xsl:when>
			<xsl:when test="@name = 'format-address-single-line'">
				<xsl:apply-templates select="xsl:with-param[@name='theAddress']" mode="address"/>
			</xsl:when>
			<xsl:when test="@name = 'format-address-multi-line'">
				<xsl:apply-templates select="xsl:with-param[@name='party']" mode="address"/>
			</xsl:when>
			<xsl:when test="@name = 'format-date'">
				<xsl:apply-templates select="xsl:with-param[@name='date-string-dd-MMM-yyyy']"/>
			</xsl:when>
			<xsl:when test="@name = 'correctCalculation'">
				<xsl:apply-templates select="xsl:with-param[@name='value']"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="xsl:with-param">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="xsl:with-param" mode="address">
		<xsl:apply-templates mode="address"/>
	</xsl:template>
	<xsl:template match="xsl:if">
		<xsl:call-template name="process-condition">
			<xsl:with-param name="condition"><xsl:value-of select="@test"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="process-condition">
		<xsl:param name="condition"/>
		<xsl:choose>
			<xsl:when test="contains($condition, ' or ')">
				<xsl:call-template name="process-condition">
					<xsl:with-param name="condition"><xsl:value-of select="substring-before($condition, ' or ')"/></xsl:with-param>
				</xsl:call-template>
				<xsl:call-template name="process-condition">
					<xsl:with-param name="condition"><xsl:value-of select="substring-after($condition, ' or ')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($condition, ' and ')">
				<xsl:call-template name="process-condition">
					<xsl:with-param name="condition"><xsl:value-of select="substring-before($condition, ' and ')"/></xsl:with-param>
				</xsl:call-template>
				<xsl:call-template name="process-condition">
					<xsl:with-param name="condition"><xsl:value-of select="substring-after($condition, ' and ')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="starts-with($condition, 'variabledata')">
						<xsl:variable name="xpath">
							<xsl:choose>
								<xsl:when test="contains($condition, '!=')">
									<xsl:value-of select="normalize-space(substring-before($condition, '!='))"/>
								</xsl:when>
								<xsl:when test="contains($condition, '=')">
									<xsl:value-of select="normalize-space(substring-before($condition, '='))"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$condition"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						<xsl:if test="count(preceding-sibling::xsl:if[contains($condition, $xpath)]) = 0">
							<xpath><xsl:value-of select="$xpath"/></xpath>
						</xsl:if>
					</xsl:when>
					<xsl:when test="starts-with($condition, '/variabledata')">
						<xsl:variable name="xpath">
							<xsl:choose>
								<xsl:when test="contains($condition, '!=')">
									<xsl:value-of select="normalize-space(substring-after(substring-before($condition, '!='), '/'))"/>
								</xsl:when>
								<xsl:when test="contains($condition, '=')">
									<xsl:value-of select="normalize-space(substring-after(substring-before($condition, '='), '/'))"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$condition"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						<xsl:if test="count(preceding-sibling::xsl:if[contains($condition, $xpath)]) = 0">
							<xpath><xsl:value-of select="$xpath"/></xpath>
						</xsl:if>
					</xsl:when>
					<xsl:when test="starts-with($condition, '$')">
						<xsl:variable name="var"><xsl:value-of select="normalize-space(substring-after(substring-before($condition, '='), '$'))"/></xsl:variable>
						<xsl:choose>
							<xsl:when test="/xsl:stylesheet/xsl:variable[@name = $var]">
								<xsl:if test="count(preceding-sibling::xsl:if[contains($condition, $var)]) = 0">
									<xpath>$<xsl:value-of select="$var"/></xpath>
								</xsl:if>
							</xsl:when>
						</xsl:choose>
					</xsl:when>
				</xsl:choose>
				<xsl:apply-templates/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="xsl:choose">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="xsl:when">
		<xsl:variable name="test"><xsl:call-template name="stripbrackets"><xsl:with-param name="in"><xsl:value-of select="@test"/></xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:choose>
			<xsl:when test="starts-with($test, 'variabledata')">
				<xsl:variable name="xpath">
					<xsl:choose>
						<xsl:when test="contains($test, '!=')">
							<xsl:value-of select="normalize-space(substring-before($test, '!='))"/>
						</xsl:when>
						<xsl:when test="contains($test, '=')">
							<xsl:value-of select="normalize-space(substring-before($test, '='))"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$test"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:if test="count(preceding-sibling::xsl:when[contains($test, $xpath)]) = 0">
					<xpath><xsl:value-of select="$xpath"/></xpath>
				</xsl:if>
			</xsl:when>
			<xsl:when test="starts-with($test, '/variabledata')">
				<xsl:variable name="xpath">
					<xsl:choose>
						<xsl:when test="contains($test, '!=')">
							<xsl:value-of select="normalize-space(substring-after(substring-before($test, '!='), '/'))"/>
						</xsl:when>
						<xsl:when test="contains($test, '=')">
							<xsl:value-of select="normalize-space(substring-after(substring-before($test, '='), '/'))"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="substring-after($test, '/')"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:if test="count(preceding-sibling::xsl:if[contains($test, $xpath)]) = 0">
					<xpath><xsl:value-of select="$xpath"/></xpath>
				</xsl:if>
			</xsl:when>
			<xsl:when test="starts-with($test, '$')">
				<xsl:variable name="var"><xsl:value-of select="normalize-space(substring-after(substring-before($test, '='), '$'))"/></xsl:variable>
				<xsl:choose>
					<xsl:when test="/xsl:stylesheet/xsl:variable[@name = $var]">
						<xsl:if test="count(preceding-sibling::xsl:when[contains($test, $var)]) = 0">
							<xpath>$<xsl:value-of select="$var"/></xpath>
						</xsl:if>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="xsl:otherwise">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="xsl:for-each">
		<xsl:variable name="path"><xsl:call-template name="striplastelement"><xsl:with-param name="in"><xsl:value-of select="@select"/></xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:call-template name="displayxpath">
			<xsl:with-param name="xpath"><xsl:value-of select="$path"/></xsl:with-param>
		</xsl:call-template>
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="xsl:value-of">
		<xsl:call-template name="displayxpath">
			<xsl:with-param name="xpath"><xsl:value-of select="@select"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template match="xsl:copy-of">
		<xsl:call-template name="displayxpath">
			<xsl:with-param name="xpath"><xsl:value-of select="@select"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template match="xsl:copy-of" mode="address">
		<xsl:variable name="xpath"><xsl:call-template name="displayxpath"><xsl:with-param name="xpath"><xsl:value-of select="@select"/></xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:variable name="path"><xsl:call-template name="striplastelement"><xsl:with-param name="in"><xsl:value-of select="$xpath"/></xsl:with-param></xsl:call-template>/address</xsl:variable>
		<xpath><xsl:value-of select="$path"/><xsl:text>/line1</xsl:text></xpath>
		<xpath><xsl:value-of select="$path"/><xsl:text>/line2</xsl:text></xpath>
		<xpath><xsl:value-of select="$path"/><xsl:text>/line3</xsl:text></xpath>
		<xpath><xsl:value-of select="$path"/><xsl:text>/line4</xsl:text></xpath>
		<xpath><xsl:value-of select="$path"/><xsl:text>/line5</xsl:text></xpath>
		<xpath><xsl:value-of select="$path"/><xsl:text>/postcode</xsl:text></xpath>
	</xsl:template>
	<xsl:template match="xsl:text">
	</xsl:template>
	<xsl:template name="displayxpath">
		<xsl:param name="xpath"/>
		<xsl:choose>
			<xsl:when test="starts-with($xpath, '/')">
				<xsl:call-template name="displayxpath"><xsl:with-param name="xpath"><xsl:value-of select="substring-after($xpath, '/')"/></xsl:with-param></xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($xpath, '+')">
				<xsl:call-template name="displayxpath"><xsl:with-param name="xpath"><xsl:value-of select="normalize-space(substring-before($xpath, '+'))"/></xsl:with-param></xsl:call-template>
				<xsl:call-template name="displayxpath"><xsl:with-param name="xpath"><xsl:value-of select="normalize-space(substring-after($xpath, '+'))"/></xsl:with-param></xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xpath><xsl:call-template name="stripbrackets"><xsl:with-param name="in"><xsl:value-of select="$xpath"/></xsl:with-param></xsl:call-template></xpath>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="stripbrackets">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="contains($in, '[')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '[')"/><xsl:value-of select="substring-after($in, ']')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="starts-with($in, 'count(')">
				<xsl:variable name="aftercount"><xsl:value-of select="substring-after($in, '(')"/></xsl:variable>
				<xsl:variable name="countpath"><xsl:value-of select="substring-before($aftercount, ')')"/></xsl:variable>
				<xsl:variable name="lastelement">/<xsl:call-template name="lastelement"><xsl:with-param name="in"><xsl:value-of select="$countpath"/></xsl:with-param></xsl:call-template>)</xsl:variable>
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($aftercount, $lastelement)"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="starts-with($in, 'substring-after(')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-after(substring-before($in, ','), 'substring-after(')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="starts-with($in, 'substring-before(')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-after(substring-before($in, ','), 'substring-before(')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($in, '(')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-after(substring-before($in, ')'), '(')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$in"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="lastelement">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="contains($in, '/')">
				<xsl:choose>
					<xsl:when test="substring-after($in, '/') = '*'">
						<xsl:call-template name="lastelement">
							<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '/')"/></xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="lastelement">
							<xsl:with-param name="in"><xsl:value-of select="substring-after($in, '/')"/></xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$in"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="striplastelement">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="contains($in, '/')">
				<xsl:value-of select="substring-before($in, '/')"/>
				<xsl:variable name="after"><xsl:value-of select="substring-after($in, '/')"/></xsl:variable>
				<xsl:if test="contains($after, '/')">
					<xsl:text>/</xsl:text>
				</xsl:if>
				<xsl:call-template name="striplastelement">
					<xsl:with-param name="in"><xsl:value-of select="$after"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>