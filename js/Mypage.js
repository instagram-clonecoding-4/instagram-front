document.addEventListener("DOMContentLoaded", () => {
    const followBtn = document.querySelector(".follow-btn");
    const profileEditBtn = document.querySelector(".profile-edit-btn");

   
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 

    if (isLoggedIn) {
        followBtn.style.display = "none";
        profileEditBtn.style.display = "inline-block";
    } else {
        followBtn.style.display = "inline-block";
        profileEditBtn.style.display = "none";

        let isFollowing = false;
        followBtn.addEventListener("click", () => {
            isFollowing = !isFollowing;
            followBtn.textContent = isFollowing ? "언팔로우" : "팔로우";
            followBtn.style.backgroundColor = isFollowing ? "#dbdbdb" : "#0095f6";
        });
    }
});

