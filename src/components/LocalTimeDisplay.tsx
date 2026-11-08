import React, { useState, useEffect } from 'react';
import { Clock, Globe, MapPin } from 'lucide-react';

interface GeolocationResult {
  timezone: string;
  city?: string;
  country?: string;
  countryCode?: string;
  source: 'ip' | 'browser';
}

function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return '🌐';
  const offset = 127397;
  const chars = [...code.toUpperCase()].map((c) => c.charCodeAt(0) + offset);
  return String.fromCodePoint(...chars);
}

export const LocalTimeDisplay: React.FC = () => {
  // Start with browser's local timezone as instant fallback
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila';

  const [timeZone, setTimeZone] = useState<string>(browserTimeZone);
  const [locationLabel, setLocationLabel] = useState<string>(() => {
    // Friendly name from browser timezone e.g. "Asia/Manila" -> "Manila"
    const parts = browserTimeZone.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ');
  });
  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [now, setNow] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState<boolean>(true);

  // 1. Fetch IP-based geolocation with browser fallback
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    async function detectLocation() {
      try {
        // Attempt IP Geolocation lookup
        const res = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.timezone) {
            setTimeZone(data.timezone);
            const city = data.city || '';
            const country = data.country_name || data.country || '';
            const code = data.country_code || data.country;
            if (city && country) {
              setLocationLabel(`${city}, ${code || country}`);
            } else if (country) {
              setLocationLabel(country);
            }
            if (code) setCountryCode(code);
            return;
          }
        }
      } catch {
        // IP geolocation timed out or blocked by client; proceed to fallback
      } finally {
        clearTimeout(timeoutId);
      }

      // Fallback: use browser local timezone
      if (isMounted) {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Manila';
        setTimeZone(localTz);
        const city = localTz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time';
        setLocationLabel(city);
      }
    }

    detectLocation();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // 2. Real-time clock update (every 1 second without page refresh)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date, time, and timezone abbreviation safely for target timeZone
  let timeStr = '';
  let dateStr = '';
  let tzAbbr = '';

  try {
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    timeStr = timeFormatter.format(now);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    dateStr = dateFormatter.format(now);

    // Get time zone abbreviation / daylight-savings indicator e.g. "PST", "PHT", "EDT"
    const tzNameFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    });
    const parts = tzNameFormatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    tzAbbr = tzPart ? tzPart.value : '';
  } catch {
    // Ultimate fallback if timezone string isn't recognized
    timeStr = now.toLocaleTimeString();
    dateStr = now.toLocaleDateString();
  }

  const flag = getCountryFlag(countryCode);

  return (
    <div
      className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50/90 dark:bg-[#0c1a2c]/90 border border-slate-200/90 dark:border-cyan-900/40 shadow-xs text-xs transition-all duration-300 hover:border-cyan-500/30"
      title={`Live Local Time for ${locationLabel} (${timeZone}) • Accounts for Timezone & Daylight Saving Time`}
      aria-label={`Current local time: ${dateStr} ${timeStr} ${tzAbbr} in ${locationLabel}`}
    >
      {/* Live Pulsing Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Flag / Location */}
      <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
        <span className="text-sm select-none" aria-hidden="true">
          {flag}
        </span>
        <span className="max-w-[130px] truncate hidden lg:inline text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {locationLabel}
        </span>
      </div>

      <span className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden lg:inline" />

      {/* Dynamic Date */}
      <span className="text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap text-[11px] hidden sm:inline">
        {dateStr}
      </span>

      {/* Dynamic Live Time with seconds & Timezone abbreviation */}
      <div className="flex items-center gap-1.5 font-data font-bold text-cyan-700 dark:text-cyan-300 tracking-tight whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        <span>{timeStr}</span>
        {tzAbbr && (
          <span className="text-[10px] uppercase font-semibold px-1 py-0.2 rounded bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
            {tzAbbr}
          </span>
        )}
      </div>
    </div>
  );
};
