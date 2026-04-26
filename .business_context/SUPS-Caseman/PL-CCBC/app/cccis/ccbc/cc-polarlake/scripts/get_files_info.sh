#######################################################################################
# File               : get_files_info.sh                                              #
# Desc               : ftp files used by ccbc_load_customer_media_data PL circuit     #
# Product history                                                            	      #
# Date      Ver   Who   Desc                                                          #
# ----      ---   ---   ----                                                          #
# 15/06/06  1.0   WK    New File					              #
# 15/11/06  1.1   WK    Fixing the defect 3864					      #
# 05/12/06  1.2   WK    Fixing defect 3924				              #
#										      #
#######################################################################################
ftp   -ni $2  > $6/file_info$$ 2> /dev/null << endftp  
user $3 $4
ls $5/$1
endftp

grep ^-  $6/file_info$$ > $6/file_info$$_1 
mv $6/file_info$$_1  $6/file_info$$ 

if [ -s $6/file_info$$ ]
then
	echo '<?xml version="1.0" encoding="UTF-8"?>
	<file>
	<info>
	  <file_name>'"`awk ' { print $9 }' $6/file_info$$  `</file_name>
          <size>`awk ' { print $5 }' $6/file_info$$ `</size>
	  <location>$5</location>
	</info>
	</file>"   >  $6/file_info$$
else
  ftp   -ni $2  > $6/file_info$$ 2> /dev/null << endftp
  user $3 $4
  ls $7/$1
endftp

grep ^-  $6/file_info$$ > $6/file_info$$_1 
mv  $6/file_info$$_1  $6/file_info$$ 

  if [ -s $6/file_info$$ ]
  then
                                                                                
        echo '<?xml version="1.0" encoding="UTF-8"?>
        <file>
        <info>
          <file_name>'"`awk ' { print $9 }' $6/file_info$$  `</file_name>
          <size>`awk ' { print $5 }' $6/file_info$$ `</size>
          <location>$7</location>
        </info>
        </file>"   >  $6/file_info$$
   else
	echo '<?xml version="1.0" encoding="UTF-8"?>
	<file> <empty/> 
	</file>'   >  $6/file_info$$

   fi
fi

mv  $6/file_info$$ $6/file_info.xml
