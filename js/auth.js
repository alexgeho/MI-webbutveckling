// auth.js

// 🔹 Базовый URL backend-а
const API_URL = "http://localhost:5003";

// 🔹 Все пути authRouter-а
const AUTH_ENDPOINTS = {
  registration: `${API_URL}/auth/registration`,
  login: `${API_URL}/auth/login`,
  logout: `${API_URL}/auth/logout`,
  refresh: `${API_URL}/auth/refresh-token`,
  me: `${API_URL}/auth/me`,
  registrationConfirmation: `${API_URL}/auth/registration-confirmation`,
  registrationResend: `${API_URL}/auth/registration-email-resending`,
  passwordRecovery: `${API_URL}/auth/password-recovery`,
  newPassword: `${API_URL}/auth/new-password`,
};

// 🔹 Общая функция для вывода сообщений пользователю
function showAlert(message, type = "danger") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} mt-3`;
  alertDiv.textContent = message;

  const container = document.querySelector(".card");
  container.appendChild(alertDiv);

  setTimeout(() => alertDiv.remove(), 3000);
}

// 🔹 Регистрация
async function handleRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showAlert("Введите корректный email", "warning");
    }
    if (password.length < 6) {
      return showAlert("Пароль должен быть минимум 6 символов", "warning");
    }

    try {
      const res = await fetch(AUTH_ENDPOINTS.registration, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, email, password }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Ошибка регистрации");
      }

      showAlert("Регистрация успешна! Проверьте email для подтверждения.", "success");
      form.reset();
    } catch (err) {
      showAlert(err.message);
    }
  });
}

// 🔹 Логин
async function handleLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginOrEmail = document.getElementById("loginOrEmail").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!loginOrEmail || !password) {
      return showAlert("Заполните все поля", "warning");
    }

    try {
      const res = await fetch(AUTH_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginOrEmail, password }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Неверный логин или пароль");
      }

      const data = await res.json();

      showAlert("Успешный вход!", "success");

      // Сохраняем accessToken, если backend его возвращает
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        console.log("JWT сохранён:", data.accessToken);
      } else {
        console.log("Ответ от сервера:", data);
      }

      // Пример запроса к /auth/me после входа
      try {
        const meRes = await fetch(AUTH_ENDPOINTS.me, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("ME response:", await meRes.json());
      } catch (meErr) {
        console.error("Ошибка при запросе /me:", meErr);
      }

    } catch (err) {
      showAlert(err.message);
    }
  });
}

// 🔹 Запускаем обработчики
handleRegisterForm();
handleLoginForm();
