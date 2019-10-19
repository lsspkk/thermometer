import cv2
import pytesseract
import numpy as np
import argparse

# https://datacarpentry.org/image-processing/07-thresholding/

def remove_dots(image):
    nlabels, labels, stats, centroids = cv2.connectedComponentsWithStats(image, None, None, None, 8, cv2.CV_32S)
    sizes = stats[1:, -1] #get CC_STAT_AREA component
    img2 = np.zeros((labels.shape), np.uint8)

    for i in range(0, nlabels - 1):
        if sizes[i] >= 150:   #filter small dotted regions
            img2[labels == i + 1] = 255

    return img2


def to_text(filename,psm=13, thinner=24,threshold=75, show=False):
    originalImage = cv2.imread(filename)
    grayImage = cv2.cvtColor(originalImage, cv2.COLOR_BGR2GRAY)

    k = 7
    #for i in range(7):
    #    grayImage = cv2.GaussianBlur(src = grayImage, ksize = (k, k), sigmaX = 0)  

    grayImage = cv2.medianBlur(grayImage, 11)  
    (thresh, blackAndWhiteImage) = cv2.threshold(grayImage, threshold, 255, cv2.THRESH_BINARY)
    edged = cv2.Canny(blackAndWhiteImage, 30, 200)
    #cv2.imshow('aa', edged)
    #cv2.waitKey(0)
    contours,hierarchy = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(grayImage, contours, -1, 255, thinner)
    (thresh, blackAndWhiteImage) = cv2.threshold(grayImage, threshold, 255, cv2.THRESH_BINARY)
    grayImage = remove_dots(blackAndWhiteImage)
    
    (thresh, blackAndWhiteImage) = cv2.threshold(grayImage, threshold, 255, cv2.THRESH_BINARY)
    edged = cv2.Canny(blackAndWhiteImage, 30, 200)
    contours,hierarchy = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(blackAndWhiteImage, contours, -1, 0, thinner-4)
    
    if show:
        cv2.imshow('Black white image', blackAndWhiteImage)
        cv2.waitKey(0)
        cv2.destroyAllWindows()


    # cv2.imwrite("output_"+filename, blackAndWhiteImage)

    text= pytesseract.image_to_string(blackAndWhiteImage, lang="lets", config="--psm %s --oem 0 -c tessedit_char_whitelist=0123456789C." % psm)
    return text

parser = argparse.ArgumentParser()
parser.add_argument("file", help="filename", type=str)
parser.add_argument("-th", "--threshold", help="threshold", type=int)
parser.add_argument("-s", "--show", help="show", action="store_true")
args = parser.parse_args()
th = [40,50,60,70,80,90,100]
if args.threshold:
    th = [args.threshold]

for j in th:
    row = []
    for i in range(4,10,2):
        row.append(str(str(i) + '=' + to_text(args.file,8,i,j,args.show)))
    print(row)
