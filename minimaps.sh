#!/bin/bash
DIR="assets/data/map/"


for i in $(ls ${DIR}*.tmx); do
    tmxrasterizer --hide-layer luz ${i} ${i%.*}big.png
    convert ${i%.*}big.png -resize 156x156\>  ${i%.*}.png
    rm ${i%.*}big.png    
done