var photostart = document.querySelector('#photostart')
var photosection = document.querySelector('#photosection')

var photosectionvisible = 'false'

const video = document.querySelector("#video"),
    photo = document.querySelector("#photo"),
    canvas = document.querySelector("#canvas"),
    takepicturebutton = document.querySelector("#takepicturebutton")

photostart.addEventListener('click', (elem) => {
    // console.log(elem, this)
    photosectionvisible = !photosectionvisible
    if (photosectionvisible) {
        video.style.display = 'block'
        takepicturebutton.style.display = 'block'
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

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
var constraints = {
    video: {
        facingMode: "environment",
        width: { min: 600, ideal: 720, max: 1920 },
        height: { min: 800, ideal: 1280, max: 1920 }
    },
    audio: false
}

function cameraStop() {
    takepicturebutton.style.display = 'none'
    video.style.display = 'none'
    let stream = video.srcObject;
    if (!stream || !stream.getTracks()) {
        return;
    }
    stream.getTracks().forEach(t => t.stop())
}

function closeMessages() {
    document.querySelector('#error').classList.remove('visible')
    document.querySelector('#message').classList.remove('visible')
    document.querySelector('#error').innerHTML = ''
    document.querySelector('#message').innerHTML = ''
    document.querySelector('#closemessages').classList.remove('visible')
}

function showMessage(id, msg) {
    // console.log("%O", msg)
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
            showMessage('#message', 'setting stream track to video')
            track = stream.getTracks()[0]
            video.srcObject = stream
        })
        .catch(err => showMessage('#error', err))
}


function upload() {
    canvas.toBlob((blob) => {
        var formData = new FormData()
        formData.append("file", blob, timestamp() + '.jpg')
        formData.append('upload_token', TOKEN)
        fetch(BACKEND, { method: 'POST', body: formData })
            .then((response) => {
                showMessage('#message', response.status == 200 ? "Kuva talletettu" : "Virhe?" + response)
                photosection.style.display = 'none'
                photostart.classList.remove('has-text-success')
            })
            .catch((err) => showMessage('#error', err))
    }, 'image/jpeg', 0.90)
}

takepicturebutton.onclick = function() {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)
    photo.src = canvas.toDataURL("image/jpeg")
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