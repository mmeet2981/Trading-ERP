'use strict';

const jwt = require('jsonwebtoken');

module.exports = function makeTokenService({ JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV }) {
  return {
    generateToken,
    verifyToken,
    setTokenCookie,
    clearTokenCookie,
  };

  function generateToken(payload) {
    const expiresIn = JWT_EXPIRES_IN || '24h';
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  function verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  function setTokenCookie(res, token) {
    const isProduction = NODE_ENV === 'production';
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours

    res.cookie('auth_token', token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: isProduction, // Only send over HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: '/', // Available on all routes
    });
  }

  function clearTokenCookie(res) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }
};