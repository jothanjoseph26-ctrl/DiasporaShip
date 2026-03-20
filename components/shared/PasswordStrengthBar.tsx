interface PasswordStrengthBarProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: password.length === 0 ? '' : labels[Math.min(score - 1, 3)] || 'Weak' };
}

const segmentColors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { score, label } = getStrength(password);

  if (!password) return null;

  const labelColor = score <= 1 ? 'text-red-600' : score === 2 ? 'text-amber-600' : score === 3 ? 'text-yellow-700' : 'text-green-600';

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? segmentColors[score - 1] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium mt-1.5 ${labelColor}`}>{label}</p>
    </div>
  );
}
