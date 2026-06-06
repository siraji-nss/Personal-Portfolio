'use server';

import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
  const name          = (formData.get('name')          as string)?.trim() ?? '';
  const phone         = (formData.get('phone')         as string)?.trim() ?? '';
  const email         = (formData.get('email')         as string)?.trim() ?? '';
  const subject       = (formData.get('subject')       as string)?.trim() ?? '';
  const message       = (formData.get('message')       as string)?.trim() ?? '';
  const attachmentUrl = (formData.get('attachmentUrl') as string)?.trim() ?? '';

  if (!name)            return { error: 'Name is required.' };
  if (!phone && !email) return { error: 'Please provide at least a phone number or email address.' };

  // Persist to DB first — this is the source of truth for the admin inbox
  await prisma.contactMessage.create({
    data: {
      name,
      phone:         phone || null,
      email:         email || null,
      subject:       subject || null,
      message:       message || null,
      attachmentUrl: attachmentUrl || null,
    },
  });
  revalidatePath('/admin/inbox');

  // Send email notification — non-fatal if it fails
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#09090b;color:#e4e4e7;border-radius:12px">
      <h2 style="margin:0 0 20px;color:#fff;font-size:18px">New Contact Form Message</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#a1a1aa;width:120px;vertical-align:top">Name</td>
            <td style="padding:8px 0;color:#fff;font-weight:600">${name}</td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#a1a1aa;vertical-align:top">Phone</td>
            <td style="padding:8px 0;color:#fff">${phone}</td></tr>` : ''}
        ${email ? `<tr><td style="padding:8px 0;color:#a1a1aa;vertical-align:top">Email</td>
            <td style="padding:8px 0;color:#fff">${email}</td></tr>` : ''}
        ${subject ? `<tr><td style="padding:8px 0;color:#a1a1aa;vertical-align:top">Subject</td>
            <td style="padding:8px 0;color:#fff">${subject}</td></tr>` : ''}
        ${message ? `<tr><td style="padding:8px 0;color:#a1a1aa;vertical-align:top">Message</td>
            <td style="padding:8px 0;color:#e4e4e7;white-space:pre-wrap">${message}</td></tr>` : ''}
        ${attachmentUrl ? `<tr><td style="padding:8px 0;color:#a1a1aa;vertical-align:top">Attachment</td>
            <td style="padding:8px 0"><a href="${attachmentUrl}" style="color:#6366f1">View attachment</a></td></tr>` : ''}
      </table>
    </div>
  `;

  try {
    await resend.emails.send({
      from:    'Portfolio Contact <onboarding@resend.dev>',
      to:      'nazmussakibsiraji@gmail.com',
      replyTo: email || undefined,
      subject: subject ? `${subject} — from ${name}` : `New message from ${name}`,
      html,
    });
  } catch (err) {
    console.error('[contact] Email send failed:', err);
  }

  return { success: true };
}

// ─── Admin actions ────────────────────────────────────────────────────────────

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
}

export async function markMessageRead(formData: FormData) {
  await requireAdmin();
  const id     = formData.get('id') as string;
  const isRead = formData.get('isRead') === 'true';
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath('/admin/inbox');
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: formData.get('id') as string } });
  revalidatePath('/admin/inbox');
}
