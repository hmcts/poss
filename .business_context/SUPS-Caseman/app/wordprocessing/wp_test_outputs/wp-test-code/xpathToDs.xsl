<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xml"/>
	<xsl:strip-space elements="*"/>
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="@*|node()">
		<xsl:param name="location"/>
		<xsl:copy>
			<xsl:apply-templates select="@*|node()">
				<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
			</xsl:apply-templates>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="@*|node()" mode="address">
		<xsl:param name="location"/>
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" mode="address">
				<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
			</xsl:apply-templates>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="xsl:stylesheet">
		<xsl:apply-templates select="xsl:template[@match='ds']" mode="called"/>
	</xsl:template>
	<xsl:template match="xsl:template">
	</xsl:template>
	<xsl:template match="xsl:output">
	</xsl:template>
	<xsl:template match="xsl:variable">
	</xsl:template>
	<xsl:template match="xsl:template" mode="called">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:template" mode="address">
		<xsl:param name="location"/>
		<xsl:apply-templates mode="address">
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:apply-templates">
		<xsl:param name="location"/>
		<xsl:choose>
			<xsl:when test="string-length(@select) > 0">
				<xsl:variable name="stripped"><xsl:call-template name="stripbrackets"><xsl:with-param name="in"><xsl:value-of select="@select"/></xsl:with-param></xsl:call-template></xsl:variable>
				<xsl:variable name="s"><xsl:call-template name="findmatch"><xsl:with-param name="in"><xsl:value-of select="$stripped"/></xsl:with-param></xsl:call-template></xsl:variable>
				<xsl:choose>
					<xsl:when test="$s = 'Address'">
						<xsl:apply-templates select="/xsl:stylesheet/xsl:template[@match=$s]" mode="address">
							<xsl:with-param name="location"><xsl:if test="string-length($location) > 0 and not(starts-with($stripped, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="$stripped"/></xsl:with-param>
						</xsl:apply-templates>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="string-length(@mode) > 0">
								<xsl:variable name="m"><xsl:value-of select="@mode"/></xsl:variable>
								<xsl:apply-templates select="/xsl:stylesheet/xsl:template[@match=$s][@mode=$m]" mode="called">
									<xsl:with-param name="location"><xsl:if test="string-length($location) > 0 > 0 and not(starts-with($stripped, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="$stripped"/></xsl:with-param>
								</xsl:apply-templates>
							</xsl:when>
							<xsl:otherwise>
								<xsl:apply-templates select="/xsl:stylesheet/xsl:template[@match=$s]" mode="called">
									<xsl:with-param name="location"><xsl:if test="string-length($location) > 0 > 0 and not(starts-with($stripped, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="$stripped"/></xsl:with-param>
								</xsl:apply-templates>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates>
					<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
				</xsl:apply-templates>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="xsl:call-template">
		<xsl:param name="location"/>
		<xsl:variable name="name"><xsl:value-of select="@name"/></xsl:variable>
		<xsl:apply-templates select="/xsl:stylesheet/xsl:template[@name=$name]" mode="called">
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:if">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:if" mode="address">
		<xsl:param name="location"/>
		<xsl:apply-templates mode="address">
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:choose">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:when">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:otherwise">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:value-of select="$location"/></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:for-each">
		<xsl:param name="location"/>
		<xsl:apply-templates>
			<xsl:with-param name="location"><xsl:call-template name="striplastelement"><xsl:with-param name="in"><xsl:value-of select="@select"/></xsl:with-param></xsl:call-template></xsl:with-param>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template match="xsl:value-of">
		<xsl:param name="location"/>
		<xsl:call-template name="stripbrackets">
			<xsl:with-param name="in"><xsl:if test="string-length($location) > 0 and not(starts-with(@select, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="@select"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template match="xsl:value-of" mode="address">
		<xsl:param name="location"/>
		<xsl:if test="string-length($location) > 0 and not(starts-with(@select, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="@select"/>
	</xsl:template>
	<xsl:template match="xsl:copy-of">
		<xsl:param name="location"/>
		<xsl:call-template name="stripbrackets">
			<xsl:with-param name="in"><xsl:if test="string-length($location) > 0 and not(starts-with(@select, '/'))"><xsl:value-of select="$location"/>/</xsl:if><xsl:value-of select="@select"/></xsl:with-param>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="lastpathelement">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="contains($in, '[')">
				<xsl:call-template name="lastpathelement">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '[')"/><xsl:value-of select="substring-after($in, ']')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="lastelement">
					<xsl:with-param name="in"><xsl:value-of select="$in"/></xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="stripbrackets">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="contains($in, '/*')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '/*')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($in, '/.')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '/.')"/></xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($in, '[')">
				<xsl:call-template name="stripbrackets">
					<xsl:with-param name="in"><xsl:value-of select="substring-before($in, '[')"/><xsl:value-of select="substring-after($in, ']')"/></xsl:with-param>
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
	<xsl:template name="findmatch">
		<xsl:param name="in"/>
		<xsl:choose>
			<xsl:when test="/xsl:stylesheet/xsl:template[@match=$in]">
				<xsl:value-of select="$in"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="contains($in, '/')">
					<xsl:call-template name="findmatch">
						<xsl:with-param name="in"><xsl:value-of select="substring-after($in, '/')"/></xsl:with-param>
					</xsl:call-template>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>