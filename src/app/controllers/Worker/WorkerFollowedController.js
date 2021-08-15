import { Op } from 'sequelize';
import File from '../../models/File';
// -----------------------------------------------------------------------------
import Worker from '../../models/Worker';

class WorkerFollowedCountController {
  async index(req, res) {
    const { id } = req.params;
    const worker = await Worker.findByPk(id);
    const users = await worker.getUser({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    // const countFollowers = users.length;

    return res.json(users);
  }
}

export default new WorkerFollowedCountController();
