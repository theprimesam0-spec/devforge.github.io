import { useUser } from '@/hooks/useUser';
import ServiceCard from './ServiceCard';
import type { ServiceCardData } from '@/types';

const services: ServiceCardData[] = [
  {
    id: 'exe-converter',
    title: '.cmd/.bat/.ps1/.py to .EXE Converter',
    subtitle: 'converter.exe',
    price: '₹10 / $0.12',
    icon: '⚡',
    description:
      'Transform your .cmd, .bat, .ps1, and .py scripts into standalone Windows executables.',
    features: [
      'Supports .cmd, .bat, .ps1, .py files',
      'Standalone .exe output',
      'No runtime dependencies',
      'Custom icon embedding',
      'Fast turnaround — under 24hrs',
    ],
    ctaText: 'Pay & Convert',
    ctaAction: 'payment',
  },
  {
    id: 'pc-format',
    title: 'PC Format & Windows Install',
    subtitle: 'system-restore.sys',
    price: '₹500 / $6',
    icon: '🖥️',
    description:
      'Full PC formatting, fresh Windows installation, driver setup, and essential software configuration. On-site in Biraul area.',
    features: [
      'Complete disk formatting',
      'Latest Windows installation',
      'Driver & firmware updates',
      'Essential software setup',
      'On-site service in Biraul',
    ],
    ctaText: 'Book Service',
    ctaAction: 'payment',
  },
  {
    id: 'custom-software',
    title: 'Custom Utility Software',
    subtitle: 'dev-studio.app',
    price: '₹999+ / $12+',
    icon: '🛠️',
    description:
      'Bespoke automation tools, utility applications, and scripts tailored to your workflow. From simple scripts to full desktop apps.',
    features: [
      'Custom automation scripts',
      'Desktop utility applications',
      'Workflow optimization tools',
      'Source code delivery',
      'Post-delivery support',
    ],
    ctaText: 'Request Quote',
    ctaAction: 'payment',
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    subtitle: 'web-forge.dev',
    price: '₹20,000+ / $240+',
    icon: '🌐',
    description:
      'Modern, responsive websites and web applications. From landing pages to full-stack solutions with cutting-edge technologies.',
    features: [
      'Responsive design',
      'Modern frameworks (React, Next.js)',
      'SEO optimized',
      'CMS integration',
      'Hosting setup included',
    ],
    ctaText: 'Discuss Project',
    ctaAction: 'payment',
  },
  {
    id: 'data-recovery',
    title: 'Data Recovery',
    subtitle: 'recovery.bin',
    price: '₹299+ / $3.60+',
    icon: '💾',
    description:
      'Recover lost files from corrupted drives, formatted disks, or accidental deletion. Local drop-off and pickup available.',
    features: [
      'HDD & SSD recovery',
      'Formatted disk recovery',
      'Deleted file restoration',
      'USB & SD card recovery',
      'Confidential handling',
    ],
    ctaText: 'Get Help',
    ctaAction: 'payment',
  },
  {
    id: 'virus-removal',
    title: 'Virus & Malware Removal',
    subtitle: 'clean-sweep.exe',
    price: '₹199 / $2.40',
    icon: '🛡️',
    description:
      'Thorough malware scanning, virus removal, and system hardening. Get your PC running clean and secure again.',
    features: [
      'Deep malware scanning',
      'Rootkit removal',
      'System optimization',
      'Security software setup',
      'Prevention tips & training',
    ],
    ctaText: 'Clean My PC',
    ctaAction: 'payment',
  },
];

export default function ServicesGrid() {
  const { isSignedIn } = useUser();

  return (
    <section
      id="services"
      style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            marginBottom: '12px',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{'// '}</span>
          <span style={{ color: 'var(--text-primary)' }}>Our </span>
          <span className="neon-green-text">Services</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Click any card to flip and explore details. Interactive macOS-style service windows.
        </p>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          justifyItems: 'stretch',
        }}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            data={service}
            isAuthenticated={!!isSignedIn}
          />
        ))}
      </div>
    </section>
  );
}
