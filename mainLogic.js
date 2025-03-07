const createPostModalElement = document.getElementById('createPostModal')
const postModalTitleElement = document.getElementById('post-modal-title')
const createPostTitleElement = document.getElementById('create-post-title')
const createPostBodyElement = document.getElementById('create-post-body')
const createPostImageElement = document.getElementById('create-post-image')
const postSubmitButtonElement = document.getElementById('post-modal-submit-btn')
const postIdElement = document.getElementById('post-id')
const deletePostModalElement = document.getElementById('deletePostModal')


const baseUrl = "https://tarmeezacademy.com/api/v1/"

function loginUser() {

    const passwdElement = document.getElementById('passwd-input')
    const usernameElement = document.getElementById('username-input')
    const loginModalElement = document.getElementById("loginModal")

    const username = usernameElement.value
    const password = passwdElement.value

    const params = {

        "username" : username,
        "password" : password
    }

    const url = `${baseUrl}login`

    toggleLoader(true)

    axios.post(url, params)
    .then((response) => {

        localStorage.setItem("Token", response.data.token)
        localStorage.setItem("User", JSON.stringify(response.data.user))

        const modalInstance = bootstrap.Modal.getInstance(loginModalElement)
        modalInstance.hide()

        showAlert("Logged In Successfully!", "success")
        setupUI()
        location.reload()

    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, 'danger')

    }).finally(() => {

        toggleLoader(false)
    })
}

function registerUser() {
    
    const registerModalElement = document.getElementById("registerModal")
    const registerNameElement = document.getElementById('name-register-input')
    const registerUserNameElement = document.getElementById('username-register-input')
    const registerPasswdElement = document.getElementById('passwd-register-input')
    const profileImageRegisterElement = document.getElementById('profile-register-input')

    const name = registerNameElement.value
    const username = registerUserNameElement.value
    const password = registerPasswdElement.value
    const profileImg = profileImageRegisterElement.files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", profileImg)

    const url = `${baseUrl}register`

    toggleLoader(true)
    axios.post(url, formData)
    .then((response) => {

        localStorage.setItem("Token", response.data.token)
        localStorage.setItem("User", JSON.stringify(response.data.user))

        const modalInstance = bootstrap.Modal.getInstance(registerModalElement)
        modalInstance.hide()

        showAlert("New User Registered Successfully!", "success")
        setupUI()

    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, "danger")

    }).finally(() => {

        toggleLoader(false)
    })
}


function logout() {
    
    localStorage.removeItem('Token')
    localStorage.removeItem('User')
    showAlert("Logged Out Successfully")
    setupUI()
}

function showAlert (customMessage, bgColor="success") {

    const alertPlaceholder = document.getElementById('successAlert')

    const alert = (message, type) => {

        const wrapper = document.createElement('div')

        wrapper.innerHTML = [

            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    alert(customMessage, bgColor)
    
    setTimeout(()=> {

        // todo:  Hide Alert After Period Time
        const closeAlert = bootstrap.Alert.getOrCreateInstance('#successAlert')
        closeAlert.dispose()

    }, 2000)
}

function setupUI() {

    const navUsernameElement = document.getElementById('nav_username')
    const profileImageElement = document.getElementById('profile_img')

    const token = localStorage.getItem('Token')

    const loggedDivElement = document.getElementById('logged-in-div')
    const logoutDivELement = document.getElementById('logout-div')
    const createButtonElement = document.getElementById('create-post-btn')

    if (token == null) {

        if (createButtonElement != null) {

            createButtonElement.style.setProperty("display", "none", "important")
        }
        loggedDivElement.style.setProperty("display", "flex", "important")
        logoutDivELement.style.setProperty("display", "none", "important")
        navUsernameElement.style.setProperty("display", "none", "important")
        profileImageElement.style.setProperty("display", "none", "important")

    } else { // For Logged In User

        if (createButtonElement != null) {

            createButtonElement.style.setProperty("display", "block", "important")
        }
        loggedDivElement.style.setProperty("display", "none", "important")
        logoutDivELement.style.setProperty("display", "flex", "important")
        navUsernameElement.innerHTML = getCurrentInfoUser().username
        profileImageElement.src = getCurrentInfoUser().profile_image
    }
}

function getCurrentInfoUser() {

    let user = null
    const getUser = localStorage.getItem('User')

    if (getUser != null) {

        user = JSON.parse(getUser)
    }

    return user
}

function createPost() {

    let post_Id = postIdElement.value
    let isCreate = post_Id == null || post_Id == ""

    const postTitle = createPostTitleElement.value
    const postBody = createPostBodyElement.value
    const postImage = createPostImageElement.files[0]

    const token = localStorage.getItem('Token')
    const header = {

        headers: {

            "Content-Type" : "multipart/form-data",
            "authorization" : `Bearer ${token}`
        }
    }

    let formData = new FormData()
    formData.append("title", postTitle)
    formData.append("body", postBody)
    formData.append("image", postImage)

    let url = ``

    if (isCreate == true) {

        url = `${baseUrl}posts`

    } else {

        formData.append('_method', 'put')
        url = `${baseUrl}posts/${post_Id}`
    }

    toggleLoader(true)
    axios.post(url, formData, header)
    .then((response) => {

        const modalInstance = bootstrap.Modal.getInstance(createPostModalElement)
        modalInstance.hide()
        showAlert("New Post Has Been Created", "success")
        location.reload()

    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, "danger")

    }).finally(() => {

        toggleLoader(false)
    })
}


function editPost(postObject) {
    
    let postObj = JSON.parse(decodeURIComponent(postObject))
    
    postSubmitButtonElement.innerHTML = "Update Post"
    postIdElement.value = postObj.id
    postModalTitleElement.innerHTML = "Edit Post"
    createPostTitleElement.value = postObj.title
    createPostBodyElement.value = postObj.body

    let postModal = new bootstrap.Modal(createPostModalElement, {})
    postModal.toggle()
}

function deletePost(postObject) {

    let postObj = JSON.parse(decodeURIComponent(postObject))

    document.getElementById('delete-post-id-input').value = postObj.id

    let postModal = new bootstrap.Modal(deletePostModalElement, {})
    postModal.toggle()
}

function confirmPostDelete() {

    const postId = document.getElementById('delete-post-id-input').value
    const url = `${baseUrl}posts/${postId}`
    const token = localStorage.getItem('Token')

    const header = {

        headers: {

            "Content-Type" : "multipart/form-data",
            "authorization" : `Bearer ${token}`
        }
    }

    axios.delete(url, header)
    .then((response) => {

        const modalInstance = bootstrap.Modal.getInstance(deletePostModalElement)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        location.reload()
    
    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, "danger")
    })
}

function postInfo(postId) {

    
    window.location = `postDetails.html?postId=${postId}`
}

function getMyProfile() {

    const profile = getCurrentInfoUser()
    window.location = `profile.html?profileId=${profile.id}`
}

function toggleLoader(showLoader = true) {

    const loaderElement = document.getElementById('loader')

    if (showLoader) {

        loaderElement.style.visibility = 'visible'

    } else {

        loaderElement.style.visibility = 'hidden'
    }
}