import jwt from 'jwt-simple';

import config from './../../config/config';
import Tasks from './../../models/tasks';
import Users from './../../models/users';

describe('Routes: Tasks', () => {
  const jwtSecret = config.jwtSecret;
  let token;
  let fakeTask;
  beforeEach(done => {
    Users
      .destroy({ where: {} })
      .then(() => Users.create({
        name: 'John',
        email: 'john@mail.net',
        password: '12345',
      }))
      .then(user => {
        Tasks
          .destroy({ where: {} })
          .then(() => Tasks.bulkCreate([{
            id: 1,
            title: 'Work',
            user_id: user.id,
          }, {
            id: 2,
            title: 'Study',
            user_id: user.id,
          }]))
          .then(tasks => {
            fakeTask = tasks[0];
            token = jwt.encode({ id: user.id }, jwtSecret);
            done();
          });
      });
  });
  describe('GET /tasks', () => {
    describe('status 200', () => {
      it('returns a list of tasks', done => {
        request.get('/api/v1/tasks')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.length(2);
            expect(res.body[0].title).to.eql('Work');
            expect(res.body[1].title).to.eql('Study');
            done(err);
          });
      });
    });
  });
  describe('POST /tasks', () => {
    describe('status 200', () => {
      it('creates a new task', done => {
        request.post('/api/v1/tasks')
          .set('Authorization', `JWT ${token}`)
          .send({ title: 'Run' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql('Run');
            expect(res.body.done).to.be.false();
            done(err);
          });
      });
    });
  });
  describe('GET /tasks/:id', () => {
    describe('status 200', () => {
      it('returns one task', done => {
        request.get(`/api/v1/tasks/${fakeTask.id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql('Work');
            done(err);
          });
      });
    });
    describe('status 404', () => {
      it('throws error when task not exist', done => {
        request.get('/api/v1/tasks/0')
          .set('Authorization', `JWT ${token}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });
  });
  describe('PUT /tasks/:id', () => {
    describe('status 204', () => {
      it('updates a task', done => {
        request.put(`/api/v1/tasks/${fakeTask.id}`)
          .set('Authorization', `JWT ${token}`)
          .send({
            title: 'Travel',
            done: true,
          })
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
  describe('DELETE /tasks/:id', () => {
    describe('status 204', () => {
      it('removes a task', done => {
        request.delete(`/api/v1/tasks/${fakeTask.id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
});
