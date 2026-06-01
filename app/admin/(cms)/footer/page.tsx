import { prisma } from '@/lib/prisma';
import { updateFooterConfig } from '@/app/actions/footer';

const inputCls = 'w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none';

export default async function FooterAdminPage() {
  const footer = await prisma.footerConfig.findUnique({ where: { id: 'main' } });

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">Footer</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Controls the footer tagline, description, and copyright name.
      </p>

      <form action={updateFooterConfig} className="space-y-5 max-w-2xl">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Tagline</label>
          <input
            name="tagline"
            defaultValue={footer?.tagline ?? ''}
            className={inputCls}
            placeholder="Building technology with purpose."
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={footer?.description ?? ''}
            className={inputCls}
            placeholder="Whether you need a technical partner…"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Copyright Name</label>
          <input
            name="copyrightName"
            defaultValue={footer?.copyrightName ?? ''}
            className={inputCls}
            placeholder="Nazmus Sakib Siraji"
          />
          <p className="text-[11px] text-zinc-700 mt-1">Used in &quot;© 2024 [name]. All rights reserved.&quot;</p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
