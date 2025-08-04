const db = require('../config/database');

class Task {
  static async findAllByUserId(userId, status = null, sortByDueDate = false) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM tasks WHERE user_id = ?';
      let params = [userId];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      if (sortByDueDate) {
        query += ' ORDER BY CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ASC, created_at DESC';
      } else {
        query += ' ORDER BY created_at DESC';
      }

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findByIdAndUserId(taskId, userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async create(title, description, dueDate, userId) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      db.run('INSERT INTO tasks (title, description, due_date, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, dueDate, userId, now, now], function(err) {
        if (err) {
          reject(err);
        } else {
          // Get the created task
          db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }

  static async update(taskId, userId, title, description, status, dueDate) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      db.run('UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, updated_at = ? WHERE id = ? AND user_id = ?',
        [title, description, status, dueDate, now, taskId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          // Get updated task
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, updatedRow) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedRow);
            }
          });
        }
      });
    });
  }

  static async markAsCompleted(taskId, userId) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      db.run('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?',
        ['COMPLETED', now, taskId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          // Get updated task
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, updatedRow) => {
            if (err) {
              reject(err);
            } else {
              resolve(updatedRow);
            }
          });
        }
      });
    });
  }

  static async delete(taskId, userId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
}

module.exports = Task;
