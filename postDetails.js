const userNamePostElement = document.getElementById('username-post-span')
const postElement = document.getElementById('post')

// This Object to get query from url ---> postId=id
const urlParams = new URLSearchParams(window.location.search)
const getId = urlParams.get('postId')

setupUI()

getPost()

function getPost() {

    toggleLoader(true)
    axios.get(`${baseUrl}posts/${getId}`)
    .then((response) => {

        const post = response.data.data
        const comments = post.comments
        const author = post.author

        userNamePostElement.innerHTML = author.username

        let postTitle = ""

        if (postTitle != null) {

            postTitle = post.title
        }

        let commentsContent = ``

        for(let comment of comments) {

            commentsContent += `

                <div class="p-3" id="post-content">

                    <div>

                        <img src="${comment.author.profile_image}" class="rounded-circle" id="image-comment" />
                        <b>${comment.author.username}</b>
                    </div>

                    <div id="commentBody">

                        ${comment.body}
                    </div>
                </div>
            `
        }

        const postContent = `
        
            <div class="card shadow my-3">
            
                <div class="card-header">
                                
                    <img src="${author.profile_image}" class="profile_img rounded-circle border border-3">
                    <b>${author.username}</b>
                </div>
            
                <div class="card-body">

                    <img src="${post.image}" id="post_image">
                    <h6 class="post_time">${post.created_at}</h6>
                    <h5>${postTitle}</h5>
                    <p>
                        ${post.body}    
                    </p>
                                
                    <hr />

                    <div>
                                    
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>

                        <span>${post.comments_count} Comments

                            <span id="post-tags-${post.id}"> 

                            </span>
                        </span>
                    </div>
                </div>
                      
                <div id="comments">

                    ${commentsContent}
                </div>

                <div class="input-group mb-3" id="add-comment-div">

                    <input id="comment-input" type="text" placeholder="Add Your Comment Here..." class="form-control mt-2" />
                    <button class="btn btn-outline-primary" type="button" onclick="createComments()">Send</button>
                </div>

            </div>
        `

        postElement.innerHTML = postContent

    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, 'danger')

    }).finally(() => {

        toggleLoader(false)
    })
}

function createComments() {

    let commentBody = document.getElementById('comment-input').value

    let params = {

        "body": commentBody
    }

    let token = localStorage.getItem('Token')

    let url = `${baseUrl}posts/${getId}/comments`

    const header = {

        headers:  {
            
            "authorization": `Bearer ${token}`
        }
    }

    axios.post(url, params, header)
    .then((response) => {

        console.log(response.data)
        showAlert("The Comment has been Posted Successfully", "success")
        getPost()

    }).catch((error) => {

        const errorMessage = error.response.data.message
        showAlert(errorMessage, "danger")
    })
}