class User {
  constructor({ name, email, password, role = "user" }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async create(newUser) {
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [newUser.name, newUser.email, newUser.password, newUser.role];

    try {
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";

    try {
      const [rows] = await db.query(query, [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
