import { prisma } from '@/lib/prisma';
import { updateHeroConfig } from '@/app/actions/hero';
import AvatarUpload from './AvatarUpload';
import AdminForm from '@/components/admin/AdminForm';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default async function HeroAdminPage() {
  const hero = await prisma.heroConfig.findUnique({ where: { id: 'main' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Hero &amp; Identity</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Controls the nav logo photo, hero section photo, typing animation, badge, and intro text.
      </p>

      <AdminForm action={updateHeroConfig} className="space-y-5 max-w-2xl">
        <Field
          label="Full Name"
          name="fullName"
          defaultValue={hero?.fullName ?? 'Nazmus Sakib Siraji'}
          hint="Shown in the nav logo and hero heading."
        />

        <AvatarUpload
          fieldName="avatarUrl"
          label="Nav Logo Photo"
          initialUrl={hero?.avatarUrl}
        />

        <AvatarUpload
          fieldName="heroImageUrl"
          label="Hero Section Photo"
          initialUrl={hero?.heroImageUrl}
        />

        <Field label="Status Badge" name="statusBadge" defaultValue={hero?.statusBadge} />
        <Field
          label="Typing Texts (one per line)"
          name="typingTexts"
          textarea
          rows={5}
          defaultValue={hero?.typingTexts.join('\n')}
          hint="Each line becomes one cycling role in the typing animation."
        />
        <Field
          label="Intro Paragraph"
          name="introPara"
          textarea
          rows={4}
          defaultValue={hero?.introPara}
        />
        <Field label="Primary Title" name="primaryTitle" defaultValue={hero?.primaryTitle} />
        <Field label="Primary Company" name="primaryCompany" defaultValue={hero?.primaryCompany} />
        <Field
          label="Primary Company URL"
          name="primaryCompanyUrl"
          defaultValue={hero?.primaryCompanyUrl ?? ''}
          hint="e.g. https://arbree.com — makes the company name a clickable link in the hero."
        />
        <Field
          label="Secondary Lines (one per line)"
          name="secondaryLines"
          textarea
          rows={4}
          defaultValue={hero?.secondaryLines?.join('\n') ?? ''}
          hint="Each line appears separately below the primary title."
        />

        <hr className="border-white/[0.06] my-2" />
        <p className="text-xs text-zinc-600 uppercase tracking-widest">Find with me</p>

        <Field
          label="LinkedIn URL"
          name="linkedinUrl"
          defaultValue={hero?.linkedinUrl ?? ''}
          hint="e.g. https://linkedin.com/in/yourhandle"
        />
        <Field
          label="WhatsApp Number"
          name="whatsappNumber"
          defaultValue={hero?.whatsappNumber ?? ''}
          hint="Include country code, e.g. +8801712345678"
        />
        <Field
          label="Office Address"
          name="officeAddress"
          textarea
          rows={3}
          defaultValue={hero?.officeAddress ?? ''}
          hint="Shown in a modal when the map pin icon is clicked."
        />
        <Field
          label="Google Maps URL"
          name="officeMapUrl"
          defaultValue={hero?.officeMapUrl ?? ''}
          hint="Paste the Google Maps link for your office location."
        />

        <hr className="border-white/[0.06] my-2" />
        <p className="text-xs text-zinc-600 uppercase tracking-widest">Contact &amp; Identity</p>

        <ImageUploadField
          fieldName="faviconUrl"
          label="Favicon"
          initialUrl={hero?.faviconUrl}
          hint="PNG favicon shown as the browser tab icon. Recommended: 32×32 or 64×64 PNG."
        />

        <Field
          label="Primary Email"
          name="primaryEmail"
          defaultValue={hero?.primaryEmail ?? ''}
        />

        <Field
          label="Org Emails (one per line, format: email | Org Name)"
          name="orgEmails"
          textarea
          rows={3}
          defaultValue={
            Array.isArray(hero?.orgEmails)
              ? (hero.orgEmails as { email: string; name: string }[])
                  .map((o) => `${o.email} | ${o.name}`)
                  .join('\n')
              : ''
          }
        />
      </AdminForm>
    </div>
  );
}

function Field({
  label, name, defaultValue = '', textarea = false, rows = 2, hint,
}: {
  label: string; name: string; defaultValue?: string | null;
  textarea?: boolean; rows?: number; hint?: string;
}) {
  const cls = 'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue ?? ''} className={cls} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ''} className={cls} />
      )}
      {hint && <p className="text-[11px] text-zinc-700 mt-1">{hint}</p>}
    </div>
  );
}
