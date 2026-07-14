interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
}

const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
  super_admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Super Admin' },
  ketua: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ketua' },
  sekretaris: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sekretaris' },
  anggota: { bg: 'bg-green-100', text: 'text-green-700', label: 'Anggota' },
};

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const config = roleConfig[role] || { bg: 'bg-gray-100', text: 'text-gray-600', label: role };

  return (
    <span className={`inline-flex items-center font-black uppercase tracking-widest rounded-full ${
      size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-xs'
    } ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
