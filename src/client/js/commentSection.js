const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementById("deleteBtn");
const videoComments = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  deleteBtn.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const deleteComment = event.target.parentElement;
  const {
    dataset: { id },
  } = event.target.parentElement;
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId: id }),
  });

  if (response.status === 200) {
    deleteComment.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  deleteBtn.addEventListener("click", handleDelete);
}
