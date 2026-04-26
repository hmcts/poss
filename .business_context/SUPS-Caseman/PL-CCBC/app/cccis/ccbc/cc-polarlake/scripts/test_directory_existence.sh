/usr/bin/ftp -n $1 >$5/tmp.tmp<<endftp 
user $2 $3
cd $4
bye
endftp

if grep "Failed to change directory" $5/tmp.tmp >/dev/null 2>&1
then
    rm -f $5/tmp.tmp    
    exit 1
else
    rm -f $5/tmp.tmp
    exit 0
fi
