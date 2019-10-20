const TOKEN = 'test'
const BACKEND = 'localhost:8080/upload'
var photostart = document.querySelector('#photostart')
var photosection = document.querySelector('#photosection')

var photosectionvisible = 'false'

const video = document.querySelector("#video"),
    photo = document.querySelector("#photo"),
    canvas = document.querySelector("#canvas"),
    takepicturebutton = document.querySelector("#takepicturebutton")

photostart.addEventListener('click', (elem) => {
    console.log(elem, this)
    photosectionvisible = !photosectionvisible
    if (photosectionvisible) {
        video.style.display = 'block'
        photosection.style.display = 'block'
        photo.style.display = 'none'
        photostart.classList.add('has-text-success')
        cameraStart()
    } else {
        photosection.style.display = 'none'
        photostart.classList.remove('has-text-success')
        cameraStop()
    }
})

var constraints = { video: { facingMode: "environment" }, audio: false }

function cameraStop() {
    if (video.srcObject) {
        video.srcObject.getTracks().array.forEach((track) => track.stop())
    }
    video.style.display = 'none'
}

function closeMessages() {
    document.querySelector('#error').classList.remove('visible')
    document.querySelector('#message').classList.remove('visible')
    document.querySelector('#error').innerHTML = ''
    document.querySelector('#message').innerHTML = ''
    document.querySelector('#closemessages').classList.remove('visible')
}

function showMessage(id, msg) {
    console.log("%O", msg)
    msg = timestamp() + " " + msg
    const e = document.querySelector(id)
    e.innerHTML += `<p>${msg}</p>`
    e.classList.add('visible')
    document.querySelector('#closemessages').classList.add('visible')
}

function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            track = stream.getTracks()[0]
            video.srcObject = stream
        })
        .catch(err => showMessage('#error', err))
}


function upload() {
    var formData = new FormData();
    formData.append("file" + timestamp(), photo.src);
    formData.append('upload_token', TOKEN);
    console.log(formData)
    fetch(BACKEND, { method: 'POST', body: formData })
        .then((response) => showMessage('#message', msg))
        .catch((err) => showMessage('#error', err))
}

takepicturebutton.onclick = function() {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)
    photo.src = canvas.("image/jpeg")
    photo.style.display = 'block'
    cameraStop()
    upload()
}

function timestamp() {
    const d = new Date()
    var z = n => (n < 10 ? '0' : '') + n

    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + 'T' + z(d.getHours()) + '_' + z(d.getMinutes()) +
        '_' + z(d.getSeconds())
}