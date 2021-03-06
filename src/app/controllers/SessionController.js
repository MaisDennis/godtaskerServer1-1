import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      phonenumber: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { phonenumber, password } = req.body;

    const user = await User.findOne({
      where: { phonenumber },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const {
      // id, user_name, avatar
      id,
      subscriber,
      first_name,
      last_name,
      user_name,
      // phonenumber,
      email,
      birth_date,
      gender,
      avatar,

      instagram,
      linkedin,
      bio,
    } = user;

    return res.json({
      user: {
        id,
        subscriber,
        first_name,
        last_name,
        user_name,
        phonenumber,
        email,
        birth_date,
        gender,
        avatar,

        instagram,
        linkedin,
        bio,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
