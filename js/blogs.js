console.log("blogs.js loaded!");

// Адрес API
const API_URL = "http://localhost:5003";

// Загружаем список блогов
async function loadBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error("Ошибка загрузки блогов");

    const data = await res.json();
    console.log("📌 Blogs from API:", data);

    const blogList = document.getElementById("blog-list");
    blogList.innerHTML = ""; // очищаем список

    // создаём список блогов
    data.items.forEach(blog => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `<a href="#" class="blog-link" data-id="${blog.id}">${blog.name}</a>`;
      blogList.appendChild(li);
    });

    // добавляем обработчики кликов
    document.querySelectorAll(".blog-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const blogId = link.getAttribute("data-id");
        loadPosts(blogId, link.textContent); // загружаем посты
      });
    });

  } catch (err) {
    console.error("Ошибка при загрузке блогов:", err);
  }
}

// Загружаем посты для выбранного блога
async function loadPosts(blogId, blogName) {
  try {
    const res = await fetch(`${API_URL}/blogs/${blogId}/posts`);
    if (!res.ok) throw new Error("Ошибка загрузки постов");

    const data = await res.json();
    console.log("📌 Posts:", data);

    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = `<h5>Posts from ${blogName}</h5>`;

    const row = document.createElement("div");
    row.className = "row g-3"; // Bootstrap сетка с отступами

    data.items.forEach(post => {
      const col = document.createElement("div");
      col.className = "col-md-6"; // по 2 поста в строке

      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.shortDescription || ""}</p>
            <a href="post.html?id=${post.id}" class="btn btn-primary">Read more</a>
          </div>
        </div>
      `;

      row.appendChild(col);
    });

    postsContainer.appendChild(row);
  } catch (err) {
    console.error("Ошибка при загрузке постов:", err);
  }
}


// запуск
document.addEventListener("DOMContentLoaded", loadBlogs);
