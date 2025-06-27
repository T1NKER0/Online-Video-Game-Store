# 🎮 PlayStation Store-Inspired System

A full-stack system for managing and purchasing digital video games, inspired by the PlayStation Store. It consists of two separate applications: an **Administrator Application** and a **Video Game Store Application**.

> **Technologies Used**  
> - 🖥️ Frontend: React (for both Admin and Store UIs)
> - 🔙 Backend: Node.js with Express.js (API services)
> - 🗄️ Databases: MySQL (Admin and Video Game Store databases)

---

## 🛠️ Administrator Application

This application manages two databases:

- **Admin Database**: Stores administrator user credentials and details.
- **Video Game Store Database**: Stores all video game and player-related data.

### 🔐 Admin Features

- Log in with administrator credentials.
- Manage administrator users (add, modify, remove).
- Manage video game genres (create, update, delete).
- Add new games with details:
  - Title
  - Developer
  - Price
  - Description
  - Reference image
- Modify and update game information.
- Remove games from the store.

---

## 🛒 Video Game Store Application

This application interacts with the `video_game_store` database.

### 🧑‍💻 Player Features

- Create and log into accounts.
- Browse games by genre.
- Search for games by title or keyword.
- View detailed information about each game.
- Add or remove games from their wishlist.
- Purchase games.
  - Upon purchase, the game is automatically removed from the player's wishlist.

---


