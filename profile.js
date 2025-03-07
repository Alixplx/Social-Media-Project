// This Object to get query from url ---> profileId=id
const urlParams = new URLSearchParams(window.location.search)
const getId = urlParams.get('profileId')

setupUI()

getUser()

getPosts()

function getUser() {

    const emailElement = document.getElementById('main-info-email')
    const nameElement = document.getElementById('main-info-name')
    const userNameElement = document.getElementById('main-info-username')
    const namePostsElement = document.getElementById('name-posts')
    const imageElement = document.getElementById('main-info-image')


    const postsCountElement = document.getElementById('posts-count')
    const commentsCountElement = document.getElementById('comments-count')

    axios.get(`${baseUrl}users/${getId}`)
    .then((response) => {

        const user = response.data.data

        emailElement.innerHTML = user.email
        nameElement.innerHTML = user.name
        userNameElement.innerHTML = user.username
        namePostsElement.innerHTML = `${user.username}'s`
        imageElement.src = user.profile_image

        postsCountElement.innerHTML = user.posts_count
        commentsCountElement.innerHTML = user.comments_count
    })
}


function getPosts() {

    toggleLoader(true)

    axios.get(`${baseUrl}users/${getId}/posts`)
    .then((response) => {

        const posts = response.data.data

        const userPostsElement = document.getElementById('user-posts')

        for (let post of posts) {

            let postTitle = ""

            let user = getCurrentInfoUser()
            let isMyPost = user != null && post.author.id == user.id
            let buttonContent = ``

            if (isMyPost) {

                buttonContent = `

                    <button id="editButtonPost" class="btn btn-secondary" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                        </svg>
                        Edit
                    </button>

                    <button id="deleteButtonPost" class="btn btn-danger" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                        Delete
                    </button>
                `
            }

            if (postTitle != null) {

                postTitle = post.title
            }

            let content = `
            
                <div class="card shadow my-3">
            
                    <div class="card-header">
                                
                        <img src="${post.author.profile_image}" class="profile_img rounded-circle border border-3">
                        <b>${post.author.username}</b>
                        ${buttonContent}
                    </div>
            
                    <div class="card-body" onclick="postInfo(${post.id})" style="cursor: pointer">

                        <img src="${post.image}" id="post_image">

                        <h6 class="post_time">${post.created_at}</h6>
                        
                        <h5>${postTitle}</h5>
                        
                        <p>${post.body}</p>
                                
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
                        
                </div>
            `

            userPostsElement.innerHTML += content

            const currentPostTagsId = `post-tags-${post.id}`
            const postTagsElement = document.getElementById(currentPostTagsId)

            postTagsElement.innerHTML = ""

            for (let tag of post.tags) {

                let tagsContent = `

                    <button class="btn btn-sm rounded-5" id="btn_tags">${tag.name}</button>
                `

                postTagsElement.innerHTML += tagsContent
            }
        }

    }).catch((error) => {

        const message = error.response.data.message
        showAlert(message, 'danger')

    }).finally(() => {

        toggleLoader(false)
    })
}