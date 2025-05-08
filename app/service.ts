const mockSendCodeApi = (phone: string) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
};

const mockLoginApi = (phone: string, code: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve({ success: true }) : reject('验证码错误');
      console.log('mobile:', phone, 'code:', code);
    }, 1000);
  });
};

export {
  mockSendCodeApi,
  mockLoginApi,
}