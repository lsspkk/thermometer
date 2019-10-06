var photostart = document.querySelector('#photostart')
var photosection = document.querySelector('#photosection')

var photosectionvisible = 'false'

photostart.addEventListener('click', (elem) => {
    console.log(elem, this)
    photosectionvisible = !photosectionvisible
    if (photosectionvisible) {
        photosection.style.display = 'block'
        photostart.classList.add('has-text-success')
        cameraStart()
    } else {
        photosection.style.display = 'none'
        photostart.classList.remove('has-text-success')
        cameraStop
    }
})


var constraints = { video: { facingMode: "environment" }, audio: false }
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")

function cameraStop() {
    stream.getTracks().array.forEach((track) => track.stop())
}

function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0]
            cameraView.srcObject = stream
        })
        .catch(function(error) {
            console.error("Error when starting camera.", error)
        })
}

cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth
    cameraSensor.height = cameraView.videoHeight
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0)
    cameraOutput.src = cameraSensor.toDataURL("image/webp")
    cameraOutput.classList.add("taken")
}