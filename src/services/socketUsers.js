const users = [];

const addUser = ({ id, name, province, city }) => {
  name = name.trim().toLowerCase();
  city = city.trim().toLowerCase();
  province = province.trim().toLowerCase();

  const existingUser = users.find((user) => {
    user.name === name;
  });

  if (existingUser) {
    return { error: 'Username is taken' };
  }
  const user = { id, name, province, city };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const user = getUser(id);
  const index = users.indexOf(user);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInCity = (city) => users.filter((user) => user.city === city);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInCity,
};
