import { Sequelize, DataTypes } from 'sequelize';

// Configuración directa (ajusta estos valores si es necesario)
const sequelize = new Sequelize('diplomado_db', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const Users = sequelize.define('Users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: Status.ACTIVE },
});

const Tasks = sequelize.define('Tasks', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  done: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Users.hasMany(Tasks);
Tasks.belongsTo(Users);

function randomStatus() {
  return Math.random() > 0.5 ? Status.ACTIVE : Status.INACTIVE;
}

function randomBool() {
  return Math.random() > 0.5;
}

function randomTaskName(i, userId) {
  return `Task ${i + 1} for user ${userId}`;
}

async function seedUsersAndTasks() {
  await sequelize.sync({ force: true });
  // Crear 50 usuarios
  const users = await Users.bulkCreate(
    Array.from({ length: 50 }, (_, i) => ({
      username: `user${i + 1}`,
      password: `password${i + 1}`,
      status: randomStatus(),
    }))
  );

  // Crear 50 tareas para cada usuario
  let allTasks = [];
  users.forEach((user, idx) => {
    const userTasks = Array.from({ length: 50 }, (_, i) => ({
      name: randomTaskName(i, user.id),
      done: randomBool(),
      UserId: user.id,
    }));
    allTasks = allTasks.concat(userTasks);
  });
  await Tasks.bulkCreate(allTasks);
  console.log('50 usuarios y 50 tareas por usuario creados!');
  process.exit(0);
}

seedUsersAndTasks().catch(e => { console.error(e); process.exit(1); });
