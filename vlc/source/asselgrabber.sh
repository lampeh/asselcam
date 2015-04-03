#!/bin/bash

BASEDIR=/home/assel/asseln/snapshots
SNAPSHOT=/run/shm/asseln-latest.png

date="`date "+%Y-%m-%d"`"
lastdate="$date"
dir="$BASEDIR/$date"
mkdir -p $dir
i="`find $dir -type f -name "frame-*.png" -printf "%P\n"|sort -n -t - -k 2 -r |head -n1| sed -e 's/^frame-0*\([0-9]*\)\.png$/\1/;t;d'`"
i=$(($i+1))

laststat=""

while [ "$((10#0`date "+%s"` % 5))" != "0" ]; do
	sleep 0.1;
done

while :; do
	STAMP="`date +"%H:%M:%S\n%d.%m.%Y"`"
	date="`date "+%Y-%m-%d"`"

	[ "$date" != "$lastdate" ] && {
		touch $dir/done
		lastdate="$date"
		dir="$BASEDIR/$date"
		mkdir -p $dir
		i=1
	}

	file="$dir/frame-`printf %04d $i`.png"
	echo -e "$STAMP\n$file"

	[ -e "$SNAPSHOT" ] && {
		snapstat="`stat -c "%i %Z %s" "$SNAPSHOT"`"
		[ "$snapstat" = "$laststat" ] && { echo "File unchanged. Waiting."; sleep 1; continue; }

		cp -v $SNAPSHOT ${file}.tmp || { echo "Copy error. Retrying."; sleep 1; continue; }
		convert ${file}.tmp -font Nimbus-Mono-Regular -background transparent -fill yellow \
			-pointsize 20 -gravity southeast label:"$STAMP" -geometry +10+5 -compose over -composite \
			-pointsize 8 -gravity southwest label:"`printf "%05d" $i`" -compose over -composite \
			${file}.tmp

		mv -v ${file}.tmp ${file}

		laststat="$snapstat"
		i=$(($i+1))
	} || { echo "No such file: $SNAPSHOT"; sleep 1; continue; }

	sleep 1
	while [ "$((10#0`date "+%s"` % 5))" != "0" ]; do
		sleep 0.5;
	done
done
