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

    // кнопка "Все посты"
    const allPostsLi = document.createElement("li");
    allPostsLi.className = "list-group-item";
    allPostsLi.innerHTML = `<a href="#" class="blog-link fw-bold" data-id="all">All posts</a>`;
    blogList.appendChild(allPostsLi);

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
        if (blogId === "all") {
          loadAllPosts(); // показываем все посты
        } else {
          loadPosts(blogId, link.textContent); // посты конкретного блога
        }
      });
    });

  } catch (err) {
    console.error("Ошибка при загрузке блогов:", err);
  }
}

// Загружаем все посты
async function loadAllPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error("Ошибка загрузки постов");

    const data = await res.json();
    console.log("📌 All Posts:", data);

    renderPosts(data.items, "All posts");
  } catch (err) {
    console.error("Ошибка при загрузке всех постов:", err);
  }
}

// Загружаем посты конкретного блога
// Загружаем посты конкретного блога
async function loadPosts(blogId, blogName) {
  try {
    const res = await fetch(`${API_URL}/blogs/${blogId}/posts`);
    if (!res.ok) throw new Error("Ошибка загрузки постов блога");

    const data = await res.json();
    console.log(`📌 Posts from ${blogName}:`, data);

    renderPosts(data.items, `Posts from ${blogName}`);
  } catch (err) {
    console.error("Ошибка при загрузке постов блога:", err);
  }
}


// Рендер постов сеткой
function renderPosts(posts, title) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = `<h4>${title}</h4>`;

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML += `<p>No posts found</p>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row row-cols-1 row-cols-md-2 g-4"; // сетка 2 колонки

  posts.forEach(post => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.shortDescription}</p>
        </div>
        <div class="card-footer text-muted small">
          ${new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    `;
    row.appendChild(col);
  });

  postsContainer.appendChild(row);
}

// запуск
document.addEventListener("DOMContentLoaded", () => {
  loadBlogs();
  loadAllPosts(); // сразу показываем все посты
});
