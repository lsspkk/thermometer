# statistics from digital thermometers 

Website, that can be used to create statistics from digital thermometers. Phone camera is used to take a screenshot from which the numbers are identified. Then each user has an account, and list of thermometer locations, and their readings.


# functionality
- front: take screenshot
- back1: convert image so that numbers are readable
- back1: ocr read numbers from image
- front: login with google oauth
- back2: list of thermometer locations
- back2: list of temperatures
- front: show some graph of different locations/temperatures
- back3: get outside weather temperatures from some open weather API


# backend

https://blog.realkinetic.com/building-minimal-docker-containers-for-python-applications-37d0272c52f3
https://realpython.com/python-opencv-color-spaces/
https://medium.com/coinmonks/a-box-detection-algorithm-for-any-image-containing-boxes-756c15d7ed26
https://datacarpentry.org/image-processing/09-contours/




## local test
TESSDATA_PREFIX="/c/Users/Omistaja/Desktop/space/study/javascript/thermometer/backend/Trained data/"
export UPLOAD_TOKEN=test
export UPLOAD_PORT=8000
curl -F "file=@proto/kuva1.jpg" -F "upload_token=test" 192.168.99.100:8000/upload
