import User from '../../models/User';
import Worker from '../../models/Worker';
// -----------------------------------------------------------------------------
class UserFollowingIndividualController {
  async index(req, res) {
    console.log(req.query)
    const { user_id, worker_id } = req.query;
    let user = await User.findByPk(user_id);
    const worker = await user.getWorker({
      where: {
        id: worker_id,
      }
    });

    return res.json(worker);
  }
}

export default new UserFollowingIndividualController();
