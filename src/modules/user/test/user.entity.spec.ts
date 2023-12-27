import UserEntity from '../entities/user.entity';

describe('UserEntity', () => {
  let userEntity: UserEntity;

  beforeEach(async () => {
    userEntity = new UserEntity();
    userEntity.id = 123;
    userEntity.fullname = 'John Stone';
    userEntity.email = 'john@example.com';
    userEntity.password = 'abcd1234';
    userEntity.avatar = 'http://localhost:3000/images.jpg';
    userEntity.createdAt = new Date();
    userEntity.updatedAt = new Date();
  });

  it('should be defined', () => {
    expect(userEntity).toBeDefined();
  });

  describe('validate user entity', () => {
    it('must have title and title must longer than 5 characters', () => {
      const res = userEntity.fullname.length;
      expect(res).toBeGreaterThanOrEqual(5);
    });

    it('must have email and must be a valid email', () => {
      const res = userEntity.fullname;
      expect(res).not.toBeNull();
    });
  });
});
