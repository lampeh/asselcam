#!/bin/bash

BASEDIR=/home/assel/asseln/snapshots
FPS=24

find "$BASEDIR" -mindepth 3 -maxdepth 3 -type d |while read dir; do
	file="${dir}.mp4"

	if [ ! -e "$dir/done" ]; then
		if [ "$1" != "all" ]; then
			echo "Not done yet: $dir"
			continue
		fi
	elif [ -e "$file" ]; then
		echo "File exists: $file"
		continue
	fi

	echo "Creating file: $file"

	{ time ionice -c 2 -n 7 nice -20 avconv \
		-r $FPS \
		-f image2 -i "$dir/frame-%04d.png" \
		-aspect 16:9 \
		-c libx264 \
		-preset slower \
		-profile main \
		-me_method dia \
		-subq 10 \
		-threads 2 \
		-g $(($FPS*5)) \
		-vf "movie=/home/assel/asseln/attraktor_logo_150.png [watermark];[in][watermark] overlay=1080:25 [out]" \
		-f mp4 -y $dir/tmp.mp4; } || rm -v $dir/tmp.mp4


#		-partitions p8x8,b8x8,i8x8,i4x4 \
#		-me_method umh \
#		-me_range 32 \
#		-preset placebo \
#		-b 4000k \
#		-crf 20 \

	mv -v $dir/tmp.mp4 $file
done
