const { User } = require("../models");
const router = require("../routes/usersRouter");
const bcryptjs = require('bcryptjs');
const nodemailer = require('../config/nodemailerConfig.js');

class Person {
  async findAllUsers() {
    return User.findAll();
  }
  async findByEmail(email) {
    return User.findOne({
      where: { email },
    });
  }
    async findByUserId(id) {
      return User.findByPk(id);

  }
/*   async newUser(body) {
    let password = body.password;
    let passwordHashed = bcryptjs.hashSync(password, 10);
    body.password = passwordHashed;
    return User.create(body);
  } */
  async modifyUser(cuerpoDeDatos) {
    return User.update(
      //datos que cambiamos
      {
        billing_address: cuerpoDeDatos.billing_address,
        shipping_address: cuerpoDeDatos.shipping_address,
        phone: cuerpoDeDatos.phone,
        city: cuerpoDeDatos.city,
        country: cuerpoDeDatos.country,
        birthday: cuerpoDeDatos.birthday
      },
      //donde
      { where: { id: cuerpoDeDatos.idUser } }
    );
  }
  async deleteUser(id) {
    return User.destroy({ where: { id: id } });
  }

  async newUser(user) {
    user.password = await bcryptjs.hash(user.password, 10);

    //Creamos una token que enviamos por mail para activar
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    console.log(token)
    user = {
      name : user.name,
      last_name1: user.last_name1,
      last_name2: user.last_name2,
      email: user.email,
      password: user.password,
      birthday: user.birthday,
      shipping_address: user.shipping_address,
      country: user.country,
      city: user.city,
      zipCode: user.zipCode,
      dni: user.dni,
      phone: user.phone,
      token: token
    }

    console.log(user)

    let usuario = await User.create(user);

    //Llamamos a la funcion para enviar el correo al usuario.
    await nodemailer.sendConfirmationEmail(user.name, user.email, token);

    return usuario;

  }

  async findByToken(token) {
    return User.findOne({ token: token });
  }

 //Función que recibe token de email y activa la cuenta del usuario.
 async updateActive(token) {
   console.log(token);
  let user = await User.findOne({where:{token}});
  console.log(user);
  let usuario = await User.update(
      {
          isActive: true,
        },
        {where: {id: user.id}}
  );
  let resultado = "La cuenta se ha activado correctamente. Por favor, ve a la web de Smile para ingresar.";
  return resultado;

}


}
let usersController = new Person();
module.exports = usersController;
