const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_EXPIRATION_TIME':
        return '3600';
      case 'APP_FRONTEND_URL':
        return 'http://localhost:3000';
      default:
        return '40000';
    }
  },
};

export default mockedConfigService;
