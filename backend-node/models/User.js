const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async create(name, email, hashedPassword) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, email });
        }
      });
    });
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = User;
