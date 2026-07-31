import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-key';

  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateTokenAndSetCookie;