'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  // Return success even if user not found — prevents email enumeration
  if (!user) return { success: true };

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({ data: { email, token, expiresAt } });

  const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: 'Portfolio CMS <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your admin password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#09090b;color:#e4e4e7;border-radius:12px">
          <h2 style="margin:0 0 16px;color:#fff">Reset your password</h2>
          <p style="color:#a1a1aa;margin:0 0 24px">Click the button below to set a new password for your portfolio admin. This link expires in <strong style="color:#fff">1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Reset Password</a>
          <p style="color:#52525b;font-size:12px;margin:24px 0 0">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    // Log the reset URL to the terminal so you can test without a real Resend key
    console.warn('[password-reset] Email send failed — use this link to reset manually:');
    console.warn(resetUrl);
    console.error(err);
  }

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = (formData.get('token') as string).trim();
  const password = (formData.get('password') as string).trim();

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    return { error: 'This reset link is invalid or has expired.' };
  }

  const bcrypt = await import('bcryptjs');
  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email: record.email },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { success: true };
}
