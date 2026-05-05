import { Router } from 'express';
import { 
  generateOtpCode, 
  saveOtp, 
  verifyOtp, 
  getOrCreateUser, 
  signToken 
} from '../services/auth.js';
import { authenticate, type AuthenticatedRequest } from '../middleware/authenticate.js';
import { sendOtpEmail, sendWelcomeEmail } from '../services/email.js';
import type { 
  AuthSendOtpRequest, 
  AuthVerifyOtpRequest, 
  AuthResponse,
  ApiError 
} from '@titleiq/shared';

const router = Router();

/**
 * POST /api/auth/send-otp
 * Generates and sends a 6-digit code to the user's email.
 */
router.post('/send-otp', async (req, res) => {
  const { email } = req.body as AuthSendOtpRequest;

  if (!email || !email.includes('@')) {
    const error: ApiError = { success: false, error: 'A valid email address is required.' };
    return res.status(400).json(error);
  }

  try {
    const code = generateOtpCode();
    await saveOtp(email, code);
    await sendOtpEmail(email, code);
    
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Auth (send-otp) error:', err);
    const error: ApiError = { success: false, error: 'Failed to send verification code. Please try again.' };
    res.status(500).json(error);
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies the 6-digit code and returns a JWT.
 */
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body as AuthVerifyOtpRequest;

  if (!email || !code) {
    const error: ApiError = { success: false, error: 'Email and verification code are required.' };
    return res.status(400).json(error);
  }

  try {
    const isValid = await verifyOtp(email, code);
    if (!isValid) {
      const error: ApiError = { success: false, error: 'Invalid or expired verification code.' };
      return res.status(401).json(error);
    }

    const { user, isNewUser } = await getOrCreateUser(email);
    const token = signToken(user);

    if (isNewUser) {
      // Send the welcome email asynchronously
      sendWelcomeEmail(email).catch(err => console.error('Error sending welcome email:', err));
    }

    // Set the token in a secure, httpOnly cookie
    res.cookie('titleiq_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const response: AuthResponse = {
      success: true,
      user,
      token, // Still return it for UI if needed, though browser will use cookie
    };
    
    res.status(200).json(response);
  } catch (err) {
    console.error('Auth (verify-otp) error:', err);
    const error: ApiError = { success: false, error: 'Verification failed. Please try again.' };
    res.status(500).json(error);
  }
});

/**
 * GET /api/auth/me
 * Returns the current authenticated user's data.
 */
router.get('/me', authenticate, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});

/**
 * POST /api/auth/logout
 * Clears the authentication cookie.
 */
router.post('/logout', (_req, res) => {
  res.clearCookie('titleiq_token');
  res.json({ success: true });
});

export default router;
