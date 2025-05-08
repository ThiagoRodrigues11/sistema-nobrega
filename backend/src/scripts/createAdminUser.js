import bcrypt from 'bcryptjs';
import { sequelize } from '../models/index.js';
import Usuario from '../models/usuario.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Check if admin user already exists
    const adminExists = await Usuario.findOne({
      where: { username: 'admin' }
    });

    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await Usuario.create({
      username: 'admin',
      password: hashedPassword,
      nome: 'Administrador',
      email: 'admin@example.com',
      nivel_acesso: 'admin'
    });

    console.log('Admin user created successfully:', adminUser.username);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 