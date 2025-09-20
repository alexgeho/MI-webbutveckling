const API_URL = "http://localhost:5003";

// Получаем ID блога из URL (?id=...)
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

async function loadBlogPosts() {
  try {
    const res = await fetch(`${API_URL}/blogs/${blogId}/posts`);
    if (!res.ok) throw new Error("Ошибка загрузки постов");
    const data = await res.json();
    console.log("📌 Posts for blog:", data);

    const postsDiv = document.getElementById("posts");
    postsDiv.innerHTML = "";

    data.items.forEach(post => {
      const card = document.createElement("div");
      card.className = "col-12 card p-2";

      card.innerHTML = `
        <h5>${post.title}</h5>
        <p>${post.shortDescription}</p>
      `;

      postsDiv.appendChild(card);
    });
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

loadBlogPosts();
