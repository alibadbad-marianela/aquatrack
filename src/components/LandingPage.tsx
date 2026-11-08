import React, { useEffect, useRef, useState } from 'react';
import {
  Droplets,
  ArrowRight,
  Sparkles,
  Newspaper,
  GraduationCap,
  LogIn,
  UserPlus,
  ShieldCheck,
  BarChart3,
  Gamepad2,
  Scale,
  Compass
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCreator: () => void;
  onOpenNews: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenCreator,
  onOpenNews,
}) => {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const plateRef = useRef<HTMLImageElement>(null);
  const camMainRef = useRef<HTMLDivElement>(null);
  const camCutoutRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);

  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLSpanElement>(null);
  const l0Ref = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const rk1Ref = useRef<HTMLDivElement>(null);
  const rk3Ref = useRef<HTMLDivElement>(null);

  const l2Ref = useRef<HTMLDivElement>(null);
  const visHeadingRef = useRef<HTMLHeadingElement>(null);
  const visChipRef = useRef<HTMLDivElement>(null);
  const visParaRef = useRef<HTMLParagraphElement>(null);

  const l3Ref = useRef<HTMLDivElement>(null);
  const acctParaRef = useRef<HTMLParagraphElement>(null);

  const l4Ref = useRef<HTMLDivElement>(null);
  const credRef = useRef<HTMLDivElement>(null);
  const carbonCardRef = useRef<HTMLDivElement>(null);
  const carbonNumRef = useRef<HTMLSpanElement>(null);
  const sparkPolyRef = useRef<SVGPolylineElement>(null);
  const featsRef = useRef<HTMLDivElement>(null);

  const progInnerRef = useRef<HTMLDivElement>(null);
  const solSectionRef = useRef<HTMLElement>(null);

  // Interactive state
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [activeFeatRow, setActiveFeatRow] = useState<number | null>(null);

  // Vision words data
  const visionLines = [
    ['From', 'Data', 'Chaos', 'to'],
    ['Science-Backed,'],
    ['Actionable', 'Insights'],
  ];

  // Accounting paragraph text
  const acctWords =
    'Our ecosystem-level accounting translates complex field science into verifiable, compliance-ready metrics — so you can drive measurable results, not just reports.'.split(
      ' '
    );

  useEffect(() => {
    // 1. Math and Utility Helpers
    const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const story = storyRef.current;
    const cv = cvRef.current;
    const video = videoRef.current;
    const plateImg = plateRef.current;
    const camCutout = camCutoutRef.current;
    const camMain = camMainRef.current;
    const fogBank = fogRef.current;
    const heroCopy = heroCopyRef.current;
    const heroText = heroTextRef.current;
    const l0 = l0Ref.current;
    const l1 = l1Ref.current;
    const hudBlock = hudRef.current;
    const captionBlock = captionRef.current;
    const scrollHint = hintRef.current;
    const rk1 = rk1Ref.current;
    const rk3 = rk3Ref.current;
    const l2 = l2Ref.current;
    const visChip = visChipRef.current;
    const visPara = visParaRef.current;
    const l3 = l3Ref.current;
    const l4 = l4Ref.current;
    const credBlock = credRef.current;
    const carbonCard = carbonCardRef.current;
    const carbonNum = carbonNumRef.current;
    const sparkPoly = sparkPolyRef.current;
    const progInner = progInnerRef.current;
    const solSection = solSectionRef.current;

    if (!story || !cv || !video || !plateImg || !camMain || !camCutout) return;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // Grab elements by class
    const visionWordSpans = Array.from(document.querySelectorAll<HTMLElement>('.vision-word-elem'));
    const acctWordSpans = Array.from(document.querySelectorAll<HTMLElement>('.acct-word-elem'));
    const hotspotElems = Array.from(document.querySelectorAll<HTMLElement>('.hotspot-elem'));
    const featRowElems = Array.from(document.querySelectorAll<HTMLElement>('.feat-row-elem'));
    const solCards = Array.from(document.querySelectorAll<HTMLElement>('.sol-card-elem'));
    const statNums = Array.from(document.querySelectorAll<HTMLElement>('.stat-num-elem'));

    // Setup sparkline total length
    let sparkLength = 260;
    if (sparkPoly) {
      try {
        sparkLength = sparkPoly.getTotalLength();
      } catch {
        sparkLength = 260;
      }
      sparkPoly.style.strokeDasharray = `${sparkLength}`;
      sparkPoly.style.strokeDashoffset = `${sparkLength}`;
    }

    // 2. Video Frame Caching & Canvas Scrubbing
    let NF = 121;
    let frames: (Blob | null)[] = new Array(NF).fill(null);
    let want = 0;
    let shown = -1;
    let busy = false;

    const grabCanvas = document.createElement('canvas');
    grabCanvas.width = 1600;
    grabCanvas.height = 900;
    const grabCtx = grabCanvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (w > 0 && h > 0) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        if (shown >= 0 && frames[shown]) {
          drawBitmap(frames[shown]!);
        }
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawBitmap(blob: Blob) {
      if (!blob || !cv || !ctx) return;
      createImageBitmap(blob)
        .then((bmp) => {
          const cw = cv.width;
          const ch = cv.height;
          const bw = bmp.width;
          const bh = bmp.height;
          const scale = Math.max(cw / bw, ch / bh);
          const dw = bw * scale;
          const dh = bh * scale;
          const dx = (cw - dw) / 2;
          const dy = (ch - dh) / 2;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(bmp, dx, dy, dw, dh);
          bmp.close();
        })
        .catch(() => {});
    }

    function drawWant() {
      if (busy || !cv || !ctx) return;
      let nearestIdx = -1;
      let bestDist = Infinity;
      for (let k = 0; k < NF; k++) {
        const plus = want + k;
        if (plus < NF && frames[plus]) {
          nearestIdx = plus;
          bestDist = k;
          break;
        }
        const minus = want - k;
        if (minus >= 0 && frames[minus]) {
          nearestIdx = minus;
          bestDist = k;
          break;
        }
      }

      if (nearestIdx >= 0 && nearestIdx !== shown) {
        busy = true;
        shown = nearestIdx;
        createImageBitmap(frames[nearestIdx]!)
          .then((bmp) => {
            const cw = cv.width;
            const ch = cv.height;
            const bw = bmp.width;
            const bh = bmp.height;
            const scale = Math.max(cw / bw, ch / bh);
            const dw = bw * scale;
            const dh = bh * scale;
            const dx = (cw - dw) / 2;
            const dy = (ch - dh) / 2;
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(bmp, dx, dy, dw, dh);
            bmp.close();
            busy = false;
            drawWant();
          })
          .catch(() => {
            busy = false;
          });
      }
    }

    function initVideoScraper() {
      if (!video || !grabCtx) return;
      if (video.duration) {
        NF = Math.max(2, Math.round(video.duration * 24));
        frames = new Array(NF).fill(null);
      }

      // Frame 0 capture first
      grabCtx.drawImage(video, 0, 0, grabCanvas.width, grabCanvas.height);
      grabCanvas.toBlob(
        (blob) => {
          if (blob) {
            frames[0] = blob;
            drawWant();
          }
        },
        'image/jpeg',
        0.9
      );

      const vAny = video as any;
      if ('requestVideoFrameCallback' in vAny) {
        const onFrame = (_now: number, metadata: any) => {
          const i = Math.min(NF - 1, Math.round((metadata.mediaTime || video.currentTime) * 24));
          if (i > 0 && !frames[i]) {
            grabCtx.drawImage(video, 0, 0, grabCanvas.width, grabCanvas.height);
            grabCanvas.toBlob(
              (blob) => {
                if (blob && !frames[i]) {
                  frames[i] = blob;
                  if (i === want) drawWant();
                }
              },
              'image/jpeg',
              0.86
            );
          }
          if (i < NF - 1 && !video.ended) {
            vAny.requestVideoFrameCallback(onFrame);
          }
        };
        vAny.requestVideoFrameCallback(onFrame);
        video.play().catch(() => {});
      } else {
        // Fallback sequential step
        let seekIdx = 0;
        const stepFallback = () => {
          if (seekIdx >= NF) return;
          video.currentTime = Math.min(seekIdx / 24, (video.duration || 5.04) - 0.01);
        };
        video.addEventListener('seeked', () => {
          if (!frames[seekIdx]) {
            grabCtx.drawImage(video, 0, 0, grabCanvas.width, grabCanvas.height);
            grabCanvas.toBlob(
              (blob) => {
                if (blob) {
                  frames[seekIdx] = blob;
                  if (seekIdx === want) drawWant();
                }
                seekIdx++;
                stepFallback();
              },
              'image/jpeg',
              0.86
            );
          } else {
            seekIdx++;
            stepFallback();
          }
        });
        stepFallback();
      }
    }

    video.addEventListener('loadeddata', initVideoScraper);
    if (video.readyState >= 2) initVideoScraper();

    // 3. Hero Layout positioning
    const layoutHero = () => {
      if (!heroCopy || !heroText) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      if (W <= 820) {
        heroCopy.style.top = '';
        heroCopy.style.fontSize = '';
        return;
      }

      const bw = W * 1.06;
      const bh = H * 1.12;
      const k = Math.max(bw / 1600, bh / 900);
      const fernTop = -0.09 * H + (bh - 900 * k) / 2 + 245 * k + 0.06 * H;
      let fs = Math.min(104, 72 * k);

      heroCopy.style.fontSize = `${fs}px`;
      const textWidth = heroText.offsetWidth || fs * 11;
      if (textWidth > 0.86 * W) {
        fs = fs * ((0.86 * W) / textWidth);
        heroCopy.style.fontSize = `${fs}px`;
      }
      const blockHeight = heroCopy.offsetHeight || fs * 1.4;
      const targetTop = fernTop + 0.5 * fs - blockHeight;
      heroCopy.style.top = `${Math.round(targetTop)}px`;
    };

    window.addEventListener('resize', layoutHero);
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(layoutHero);
    }
    layoutHero();

    // 4. Pointer Tracking
    let mx = 0,
      my = 0;
    let sx = 0,
      sy = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 5. Per-Frame Scroll Controller (rAF loop)
    let sp = 0;
    let lastTime = performance.now();
    let animId = 0;

    const tick = (nowTime: number) => {
      const dt = Math.min(64, nowTime - lastTime);
      lastTime = nowTime;

      // Progress
      const storyRect = story.getBoundingClientRect();
      const totalScroll = story.offsetHeight - window.innerHeight;
      const rawP = clamp(-storyRect.top / (totalScroll > 0 ? totalScroll : 1));

      const smoothFactor = 1 - Math.pow(0.86, dt / 16.7);
      sp += (rawP - sp) * smoothFactor;
      if (Math.abs(rawP - sp) < 0.0002) sp = rawP;

      // Pointer smoothing
      sx += (mx - sx) * 0.06;
      sy += (my - sy) * 0.06;

      // Video scrub
      const vp = ease(seg(sp, 0.05, 0.7));
      want = Math.round(vp * (NF - 1));
      drawWant();

      // Camera transform
      const camTy = -sy * 12 + (1 - vp) * window.innerHeight * 0.06;
      const camScale = 1 + 0.02 * (1 - vp);
      const camTransform = `translate3d(${-sx * 18}px, ${camTy}px, 0) scale(${camScale})`;
      camMain.style.transform = camTransform;
      camCutout.style.transform = camTransform;

      // Hand-off
      const ho = shown < 0 ? 0 : shown === 0 ? seg(sp, 0.06, 0.105) : 1;
      const plateOpacity = 1 - ho;
      plateImg.style.opacity = `${plateOpacity}`;
      plateImg.style.visibility = plateOpacity <= 0 ? 'hidden' : 'visible';

      camCutout.style.opacity = `${plateOpacity}`;
      camCutout.style.visibility = plateOpacity > 0 && sp < 0.14 ? 'visible' : 'hidden';

      // Floating rock sprites fly-past
      const fp = seg(sp, 0.02, 0.2);
      const fe = fp * fp;
      if (rk1 && rk3) {
        if (fp >= 1) {
          rk1.style.visibility = 'hidden';
          rk3.style.visibility = 'hidden';
        } else {
          rk1.style.visibility = 'visible';
          rk3.style.visibility = 'visible';

          const d1 = 1.3,
            x1 = -0.3,
            y1 = -0.6;
          rk1.style.transform = `translate3d(${x1 * fp * 70 + sx * -24 * d1}vw, ${
            y1 * fp * 60 + sy * -16 * d1
          }vh, 0) scale(${1 + fe * 1.6 * d1})`;
          rk1.style.filter = `blur(${fe * 5 * d1}px)`;

          const d3 = 1.8,
            x3 = 1.0,
            y3 = 0.55;
          rk3.style.transform = `translate3d(${x3 * fp * 70 + sx * -24 * d3}vw, ${
            y3 * fp * 60 + sy * -16 * d3
          }vh, 0) scale(${1 + fe * 1.6 * d3})`;
          rk3.style.filter = `blur(${fe * 5 * d3}px)`;
        }
      }

      // Hero Copy (L0) and HUD/Caption (L1)
      const h = seg(sp, 0.02, 0.1);
      if (l0 && l1 && heroCopy && hudBlock && captionBlock && scrollHint) {
        if (h >= 1) {
          l0.style.visibility = 'hidden';
          l1.style.visibility = 'hidden';
        } else {
          l0.style.visibility = 'visible';
          l1.style.visibility = 'visible';

          heroCopy.style.transform = `translate3d(${-sx * 10}px, ${-h * 80 - sy * 6}px, 0) scale(${
            1 + h * 0.12
          })`;
          heroCopy.style.filter = `blur(${h * 14}px)`;
          heroCopy.style.opacity = `${1 - h}`;

          const hudH = seg(sp, 0.02, 0.08);
          hudBlock.style.transform = `translate3d(${sx * 26}px, ${sy * 18 - h * 40}px, 0)`;
          hudBlock.style.opacity = `${1 - hudH}`;

          const capH = seg(sp, 0.01, 0.05);
          captionBlock.style.opacity = `${1 - capH}`;
          scrollHint.style.opacity = `${1 - capH}`;
        }
      }

      // Fog Bank
      const fg = ease(seg(sp, 0.38, 0.47));
      if (fogBank) {
        if (fg <= 0) {
          fogBank.style.visibility = 'hidden';
          fogBank.style.opacity = '0';
        } else {
          fogBank.style.visibility = 'visible';
          fogBank.style.opacity = `${fg}`;
          fogBank.style.transform = `translate3d(${(fg - 1) * 18 + sx * -10}vw, ${sy * -6}px, 0)`;
        }
      }

      // Layer L2: Vision
      const vIn = seg(sp, 0.16, 0.27);
      const vOut = seg(sp, 0.34, 0.42);
      if (l2 && visChip && visPara) {
        if (vIn <= 0 || vOut >= 1) {
          l2.style.visibility = 'hidden';
        } else {
          l2.style.visibility = 'visible';
          visionWordSpans.forEach((wSpan, i) => {
            const k = clamp(vIn * 1.6 - i * 0.08);
            const ty = (1 - k) * 30 - vOut * 60;
            const blurVal = (1 - k) * 12 + vOut * 14;
            const opVal = k * (1 - vOut);
            wSpan.style.transform = `translate3d(0, ${ty}px, 0)`;
            wSpan.style.filter = `blur(${blurVal}px)`;
            wSpan.style.opacity = `${opVal}`;
          });

          const chipParaOp = clamp(vIn * 2 - 0.6) * (1 - vOut);
          const chipParaLift = -vOut * 50;
          visChip.style.opacity = `${chipParaOp}`;
          visChip.style.transform = `translate3d(0, ${chipParaLift}px, 0)`;
          visPara.style.opacity = `${chipParaOp}`;
          visPara.style.transform = `translate3d(0, ${chipParaLift}px, 0)`;
        }
      }

      // Layer L3: Accounting & Hotspots
      const aIn = seg(sp, 0.45, 0.55);
      const aOut = seg(sp, 0.63, 0.68);
      if (l3) {
        if (aIn <= 0 || aOut >= 1) {
          l3.style.visibility = 'hidden';
        } else {
          l3.style.visibility = 'visible';
          acctWordSpans.forEach((wSpan, i) => {
            const k = clamp(aIn * 2.2 - (i / acctWordSpans.length) * 1.2);
            wSpan.style.opacity = `${(0.15 + 0.85 * k) * (1 - aOut)}`;
            wSpan.style.filter = `blur(${(1 - k) * 6 + aOut * 10}px)`;
          });

          hotspotElems.forEach((hs, i) => {
            const k = seg(sp, 0.49 + i * 0.02, 0.53 + i * 0.02);
            hs.style.transform = `translate3d(${sx * -30}px, ${sy * -20}px, 0) scale(${
              k * (1 - aOut)
            })`;
          });
        }
      }

      // Layer L4: Station
      const sIn = seg(sp, 0.72, 0.82);
      if (l4 && credBlock && carbonCard && carbonNum && sparkPoly) {
        if (sIn <= 0) {
          l4.style.visibility = 'hidden';
        } else {
          l4.style.visibility = 'visible';
          credBlock.style.opacity = `${sIn}`;
          credBlock.style.transform = `translate3d(0, ${(1 - sIn) * 30}px, 0)`;
          credBlock.style.filter = `blur(${(1 - sIn) * 8}px)`;

          const cIn = ease(seg(sp, 0.74, 0.86));
          carbonCard.style.opacity = `${cIn}`;
          carbonCard.style.transform = `translate3d(${sx * -14}px, ${
            (1 - cIn) * 60 + sy * -10
          }px, 0) rotateY(${sx * 8}deg) rotateX(${-sy * 8}deg)`;

          const cardCount = Math.round(24 * seg(sp, 0.76, 0.9));
          carbonNum.textContent = `${cardCount}`;

          const sparkP = seg(sp, 0.77, 0.92);
          sparkPoly.style.strokeDashoffset = `${sparkLength * (1 - sparkP)}`;

          featRowElems.forEach((row, i) => {
            const k = ease(seg(sp, 0.76 + i * 0.025, 0.82 + i * 0.025));
            row.style.opacity = `${k}`;
            row.style.transform = `translateX(${(1 - k) * 40}px)`;
          });
        }
      }

      // Progress Bar
      if (progInner) {
        progInner.style.transform = `scaleX(${sp})`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // 6. 3D Card Tilt Interaction
    const cleanups: (() => void)[] = [];
    solCards.forEach((card) => {
      const onCardMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg)`;
      };
      const onCardLeave = () => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      };
      card.addEventListener('mousemove', onCardMove);
      card.addEventListener('mouseleave', onCardLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onCardMove);
        card.removeEventListener('mouseleave', onCardLeave);
      });
    });

    // 7. Solutions Stats Count-Up Animation
    let statsAnimated = false;
    const checkStatsTrigger = () => {
      if (statsAnimated || !solSection) return;
      const rect = solSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        statsAnimated = true;
        const duration = 1600;
        const startTime = performance.now();

        const stepStats = (t: number) => {
          const progress = clamp((t - startTime) / duration);
          const eased = ease(progress);

          statNums.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const isComma = el.getAttribute('data-format') === 'comma';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const suffix = el.getAttribute('data-suffix') || '';

            const currentVal = target * eased;
            let formatted = '';
            if (decimals > 0) {
              formatted = currentVal.toFixed(decimals);
            } else if (isComma) {
              formatted = Math.round(currentVal).toLocaleString('en-US');
            } else {
              formatted = Math.round(currentVal).toString();
            }
            el.textContent = suffix + formatted;
          });

          if (progress < 1) {
            requestAnimationFrame(stepStats);
          }
        };
        requestAnimationFrame(stepStats);
      }
    };

    window.addEventListener('scroll', checkStatsTrigger, { passive: true });
    checkStatsTrigger();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', layoutHero);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', checkStatsTrigger);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div className="relative bg-[#e7ebe8] text-[#10291a] antialiased selection:bg-[#c6f35c] selection:text-[#10291a] overflow-x-hidden font-['Inter_Tight',sans-serif]">
      {/* 1. FIXED NAVIGATION BAR */}
      <nav
        id="nav"
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 py-4 sm:py-5.5 pointer-events-auto bg-white/40 backdrop-blur-md border-b border-black/5"
      >
        {/* Left: Combined Brand Emblem */}
        <div className="flex items-center gap-2.5">
          <svg className="w-6.5 h-6.5 shrink-0 text-[#10291a]" viewBox="0 0 32 32" fill="none">
            <path d="M16 2l12 7v14l-12 7-12-7V9z" fill="currentColor" />
            <path d="M16 8c-4 4-5 9-1 16 1-5 4-9 8-11-3 0-5 1-7 3 0-3 0-5 0-8z" fill="#c6f35c" />
          </svg>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#10291a]">
              Mossline
            </span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-[#2c4434] opacity-75">
              × AquaTrack
            </span>
          </div>
        </div>

        {/* Center Menu */}
        <div className="hidden md:flex items-center gap-7">
          <a
            href="#sol"
            className="flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#10291a] hover:text-[#a9dd3a] transition-colors"
          >
            <span>Solutions</span>
            <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-current -translate-y-0.5 rotate-45" />
          </a>
          <a
            href="#story"
            className="flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#10291a] hover:text-[#a9dd3a] transition-colors"
          >
            <span>Our tech</span>
            <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-current -translate-y-0.5 rotate-45" />
          </a>
          <button
            onClick={onOpenNews}
            className="flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#10291a] hover:text-[#a9dd3a] transition-colors cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5 text-emerald-700" />
            <span>Water News</span>
          </button>
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 font-mono text-[11.5px] tracking-[0.14em] uppercase text-[#10291a] hover:text-[#a9dd3a] transition-colors cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>Creator</span>
          </button>
        </div>

        {/* Right CTA Area: Sign In, Launch App, LET'S TALK */}
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <button
            onClick={onOpenLogin}
            className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-md hover:bg-black/5 text-[#10291a] transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#10291a] hover:bg-[#1b3d28] text-white font-mono text-[11px] tracking-wider uppercase shadow-sm transition-all cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c6f35c]" />
          </button>

          <a
            href="#sol"
            className="group hidden lg:inline-flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.16em] uppercase text-[#10291a]"
          >
            <span>LET&apos;S TALK</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-[3px] bg-[#c6f35c] text-[#10291a] font-sans font-bold text-sm leading-none transition-transform duration-300 group-hover:translate-x-1">
              ›
            </span>
          </a>
        </div>
      </nav>

      {/* 2. PINNED SCROLL STORY (640vh) */}
      <section id="story" ref={storyRef} className="relative h-[640vh]">
        <div
          id="stage"
          ref={stageRef}
          className="sticky top-0 h-screen w-screen overflow-hidden bg-[#dfe3e0]"
        >
          {/* Main Camera Box */}
          <div
            id="camMain"
            ref={camMainRef}
            className="absolute -top-[9%] -bottom-[3%] -left-[3%] -right-[3%] will-change-transform pointer-events-none"
          >
            <canvas id="cv" ref={cvRef} className="absolute inset-0 w-full h-full block" />
            <img
              id="plateImg"
              ref={plateRef}
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_031618_8ce6dca1-972d-429d-8d13-bf0691c37848.png&w=2400&q=88"
              alt="Floating Moss Island Hero Still"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[2]"
            />
            {/* Ambient Mist */}
            <div
              className="absolute -inset-[10%] pointer-events-none z-[3]"
              style={{
                background:
                  'radial-gradient(40% 30% at 20% 80%, rgba(255,255,255,0.55) 0%, transparent 70%), radial-gradient(35% 25% at 85% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)',
                animation: 'mistDrift 18s ease-in-out infinite alternate',
              }}
            />
          </div>

          {/* Hidden 2x2 Video Scraper */}
          <video
            id="push"
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261106_025717_906b686d-9a9a-4dea-bab4-ae2454f8390e.mp4"
            className="absolute w-[2px] h-[2px] opacity-0 pointer-events-none"
          />

          {/* Fog Bank */}
          <div
            id="fogBank"
            ref={fogRef}
            className="absolute -left-[8vw] -top-[6vh] w-[56vw] h-[60vh] pointer-events-none z-10 invisible opacity-0"
            style={{
              maskImage:
                'radial-gradient(ellipse 52% 48% at 46% 46%, #000 44%, rgba(0,0,0,0.7) 64%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 52% 48% at 46% 46%, #000 44%, rgba(0,0,0,0.7) 64%, transparent 100%)',
            }}
          >
            <div
              className="absolute inset-0 blur-[10px]"
              style={{
                background:
                  'radial-gradient(60% 55% at 40% 45%, #d9dddd, #cfd4d4 60%, #c9cfcf)',
              }}
            />
            <div
              className="absolute -inset-[20%] opacity-55 blur-[14px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 700 460' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.006 0.014' numOctaves='3' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 0.74  0 0 0 0 0.78  0 0 0 0 0.79  1.4 0 0 0 -0.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                animation: 'fogA 26s ease-in-out infinite alternate',
              }}
            />
            <div
              className="absolute -inset-[20%] opacity-90 blur-[8px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 700 460' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.004 0.009' numOctaves='4' seed='11'/%3E%3CfeColorMatrix values='0 0 0 0 0.90  0 0 0 0 0.92  0 0 0 0 0.92  1.6 0 0 0 -0.55'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f2)'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                animation: 'fogB 19s ease-in-out infinite alternate',
              }}
            />
          </div>

          {/* Layer L0: Hero Headline */}
          <div id="l0" ref={l0Ref} className="absolute inset-0 pointer-events-none">
            <div
              id="heroCopy"
              ref={heroCopyRef}
              className="absolute left-0 right-0 text-center pointer-events-none z-12 transition-opacity duration-100"
            >
              <div className="chip">Planet intelligence · Living Water Ecosystems</div>
              <h1 className="font-['Inter_Tight',sans-serif] font-medium leading-[0.92] tracking-[-0.045em] mt-4.5 text-[#10291a]">
                <span className="block overflow-hidden pb-[0.06em] whitespace-nowrap">
                  <span
                    id="heroText"
                    ref={heroTextRef}
                    className="inline-block translate-y-[105%] animate-[heroRise_1.1s_cubic-bezier(.2,.8,.2,1)_forwards]"
                  >
                    Measure the Living Planet
                  </span>
                </span>
              </h1>
            </div>
          </div>

          {/* Front Cut-Out CamF (Asset 3 with horizontal mask) */}
          <div
            id="camCutout"
            ref={camCutoutRef}
            className="absolute -top-[9%] -bottom-[3%] -left-[3%] -right-[3%] will-change-transform pointer-events-none z-15 invisible"
            style={{
              maskImage:
                'linear-gradient(90deg, transparent 25%, #000 27.5%, #000 71.5%, transparent 74%)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 25%, #000 27.5%, #000 71.5%, transparent 74%)',
            }}
          >
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_031657_baaa3380-5ece-482a-a623-a1838fd7653c.png&w=2400&q=90"
              alt="Island Cutout"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Floating Rock Sprites (Asset 4) */}
          <div
            id="rk1"
            ref={rk1Ref}
            className="absolute left-[4%] top-[13%] w-[7.5vw] aspect-[260/295] overflow-hidden pointer-events-none z-20"
          >
            <div className="absolute inset-0 animate-[bob1_6s_ease-in-out_infinite_alternate]">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025635_82593f6a-1cf7-41c1-94ac-96fb89ebfd1a.png&w=2400&q=85"
                alt="Floating Rock 1"
                className="absolute max-w-none"
                style={{
                  width: `${(1200 / 260) * 100}%`,
                  left: `${(-30 / 260) * 100}%`,
                  top: `${(-200 / 295) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            id="rk3"
            ref={rk3Ref}
            className="absolute left-[80%] top-[58%] w-[14vw] aspect-[265/270] overflow-hidden pointer-events-none z-20"
          >
            <div
              className="absolute inset-0 animate-[bob3_8.5s_ease-in-out_infinite_alternate]"
              style={{ animationDelay: '-3s' }}
            >
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025635_82593f6a-1cf7-41c1-94ac-96fb89ebfd1a.png&w=2400&q=85"
                alt="Floating Rock 3"
                className="absolute max-w-none"
                style={{
                  width: `${(1200 / 265) * 100}%`,
                  left: `${(-895 / 265) * 100}%`,
                  top: `${(-240 / 270) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Layer L1: HUD, Caption, Scroll Hint */}
          <div id="l1" ref={l1Ref} className="absolute inset-0 pointer-events-none z-25">
            {/* HUD */}
            <div id="hudBlock" ref={hudRef} className="absolute left-[53.5%] top-[62%]">
              {/* White Crosshair */}
              <div className="absolute -left-11 top-1 w-5.5 h-5.5">
                <span className="absolute left-0 top-[10.5px] w-5.5 h-[1px] bg-white" />
                <span className="absolute left-[10.5px] top-0 w-[1px] h-5.5 bg-white" />
              </div>
              <div className="relative inline-block">
                <div className="chip">Biodiversity · Watershed</div>
                <pre className="font-mono text-[11px] tracking-[0.12em] leading-[1.65] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] mt-3">
                  LAT 34.0922° N{'\n'}LON 116.2432° W{'\n'}ELEV 842 M
                </pre>
                <div
                  className="absolute -inset-x-3.5 -top-2 -bottom-2.5 border border-white/55 pointer-events-none"
                  style={{
                    clipPath:
                      'polygon(0 0, 14px 0, 14px 1px, 1px 1px, 1px 14px, 0 14px, 0 calc(100% - 14px), 1px calc(100% - 14px), 1px calc(100% - 1px), 14px calc(100% - 1px), 14px 100%, 0 100%, calc(100% - 14px) 100%, calc(100% - 14px) calc(100% - 1px), calc(100% - 1px) calc(100% - 1px), calc(100% - 1px) calc(100% - 14px), 100% calc(100% - 14px), 100% 100%, 100% 14px, calc(100% - 1px) 14px, calc(100% - 1px) 1px, calc(100% - 14px) 1px, calc(100% - 14px) 0, 100% 0)',
                  }}
                />
              </div>
            </div>

            {/* Caption */}
            <div
              id="captionBlock"
              ref={captionRef}
              className="absolute left-[34px] bottom-[34px] pl-4 border-l-2 border-[#c6f35c] font-mono text-[11.5px] leading-[1.75] tracking-[0.13em] uppercase text-[#2c4434]"
            >
              Real-time ecosystem insights.
              <br />
              Powered by science, blockchain,
              <br />
              and transparent data.
            </div>

            {/* Scroll Hint */}
            <div
              id="scrollHint"
              ref={hintRef}
              className="absolute right-[34px] bottom-[36px] flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-[#2c4434]"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-[1.3px] border-current">
                <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-current -translate-y-0.25 rotate-45 animate-[nudge_1.6s_ease-in-out_infinite]" />
              </span>
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>

          {/* Layer L2: Vision */}
          <div
            id="l2"
            ref={l2Ref}
            className="absolute inset-0 pointer-events-none z-28 flex items-center justify-center invisible"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(820px,90vw)] text-center text-white">
              <div id="visChip" ref={visChipRef} className="chip">
                Our vision
              </div>
              <h2
                id="visHeading"
                ref={visHeadingRef}
                className="font-['Inter_Tight',sans-serif] font-medium text-[clamp(34px,4.6vw,70px)] leading-none tracking-[-0.04em] my-5 [text-shadow:0_2px_40px_rgba(10,30,15,0.55),0_1px_3px_rgba(10,30,15,0.3)]"
              >
                {visionLines.map((lineWords, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {lineWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="vision-word-elem inline-block whitespace-pre will-change-transform"
                      >
                        {word}{' '}
                      </span>
                    ))}
                    {lineIdx < visionLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p
                id="visPara"
                ref={visParaRef}
                className="text-base leading-[1.45] [text-shadow:0_1px_14px_rgba(10,30,15,0.7)]"
              >
                A breakthrough in environmental measurement,
                <br />
                built for commercial use.
              </p>
            </div>
          </div>

          {/* Layer L3: Accounting & Hotspots */}
          <div id="l3" ref={l3Ref} className="absolute inset-0 pointer-events-none z-30 invisible">
            <p
              id="acctPara"
              ref={acctParaRef}
              className="absolute left-[34px] top-[14vh] w-[min(560px,86vw)] text-[#10291a] text-[clamp(20px,1.9vw,29px)] leading-[1.16] tracking-[-0.02em] [text-shadow:0_0_24px_rgba(255,255,255,0.8)]"
            >
              {acctWords.map((word, idx) => (
                <span
                  key={idx}
                  className="acct-word-elem inline-block whitespace-pre will-change-opacity"
                >
                  {word}{' '}
                </span>
              ))}
            </p>

            {/* 4 Interactive Hotspots */}
            {[
              { id: 1, left: '12%', top: '58%', label: 'Soil carbon', val: '+3.8 t/ha' },
              { id: 2, left: '33%', top: '41%', label: 'Canopy moisture', val: '71 % RH' },
              { id: 3, left: '70%', top: '66%', label: 'Species index', val: '214 taxa' },
              { id: 4, left: '83%', top: '47%', label: 'Microclimate', val: '14.2 °C' },
            ].map((hs) => {
              const isOn = activeHotspot === hs.id;
              return (
                <div
                  key={hs.id}
                  style={{ left: hs.left, top: hs.top }}
                  onClick={() => setActiveHotspot(isOn ? null : hs.id)}
                  className={`hotspot-elem group absolute flex items-center gap-2.5 cursor-pointer select-none origin-center pointer-events-auto transition-transform duration-300 ${
                    isOn ? 'on' : ''
                  }`}
                >
                  <div className="relative w-5.5 h-5.5 rounded-full bg-[#c6f35c] flex items-center justify-center shrink-0 shadow-[0_0_0_0_rgba(198,243,92,0.7)] animate-[dotPing_2.4s_infinite] group-hover:scale-115 transition-transform">
                    <span className="absolute w-2.5 h-[1.4px] bg-[#10291a]" />
                    <span className="absolute w-[1.4px] h-2.5 bg-[#10291a]" />
                  </div>
                  <div className="flex flex-col py-1.5 px-2.25 rounded-[4px] bg-[rgba(246,248,245,0.72)] backdrop-blur-[8px] font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#10291a] shadow-xs">
                    <span>{hs.label}</span>
                    <em
                      className={`not-italic text-[#4f8a12] font-semibold overflow-hidden transition-all duration-450 ${
                        isOn
                          ? 'max-h-5 opacity-100 mt-0.75'
                          : 'max-h-0 opacity-0 group-hover:max-h-5 group-hover:opacity-100 group-hover:mt-0.75'
                      }`}
                    >
                      {hs.val}
                    </em>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer L4: Station */}
          <div id="l4" ref={l4Ref} className="absolute inset-0 pointer-events-none z-32 invisible">
            {/* Heading */}
            <div id="credBlock" ref={credRef} className="absolute left-[34px] top-[13vh] max-w-[380px]">
              <div className="flex w-max font-mono text-[10.5px] py-1 px-2 rounded-[3px] bg-[#c6f35c] text-[#10291a] mb-3.5 font-medium">
                ✕ Field station 07
              </div>
              <h3 className="font-['Inter_Tight',sans-serif] text-[#10291a] text-[clamp(22px,2vw,30px)] leading-[1.08] tracking-[-0.025em] [text-shadow:0_0_24px_rgba(255,255,255,0.8)]">
                Scientific credibility for corporate climate action
              </h3>
            </div>

            {/* Carbon Card */}
            <div
              id="carbonCard"
              ref={carbonCardRef}
              className="absolute left-[38%] top-[38vh] w-[250px] p-4.5 rounded-[10px] bg-[rgba(40,58,44,0.32)] border border-white/22 backdrop-blur-[16px] backdrop-saturate-120 text-white pointer-events-auto shadow-2xl"
            >
              <h4 className="font-['Inter_Tight',sans-serif] text-[15px] font-medium leading-[1.25]">
                Accumulated carbon
                <br />
                balance
              </h4>
              <div className="font-mono text-[9.5px] opacity-70 mt-1">Plot 07 · 12 months</div>
              <div className="mt-4.5 font-['Inter_Tight',sans-serif] text-[46px] font-medium tracking-[-0.04em] leading-none flex items-baseline gap-1.5">
                <span id="carbonNum" ref={carbonNumRef}>
                  0
                </span>
                <span className="font-mono text-[10px] tracking-wider text-emerald-300">
                  tCO₂e
                </span>
              </div>
              <div className="absolute right-4 top-24 font-mono text-[10px] py-0.75 px-1.5 bg-[#c6f35c] text-[#10291a] rounded-[3px] font-medium">
                +2.6 tCO₂e
              </div>
              <svg className="w-full h-[70px] mt-4 overflow-visible" viewBox="0 0 220 70">
                <polyline
                  ref={sparkPolyRef}
                  fill="none"
                  stroke="#c6f35c"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,60 30,55 60,57 90,44 120,46 150,30 180,24 214,10"
                />
                <circle cx="90" cy="44" r="2.4" fill="#ffffff" />
                <circle cx="150" cy="30" r="2.4" fill="#ffffff" />
                <circle cx="214" cy="10" r="3.4" fill="#c6f35c" />
              </svg>
              <div className="font-mono text-[9.5px] tracking-[0.14em] opacity-60 mt-3 text-center">
                Q1 · Q2 · Q3 · Q4
              </div>
            </div>

            {/* Feature List */}
            <div
              id="featsList"
              ref={featsRef}
              className="absolute right-[34px] top-[30vh] w-[min(400px,36vw)] py-1.5 px-4 rounded-[10px] bg-[rgba(246,248,245,0.62)] backdrop-blur-[14px] pointer-events-auto shadow-lg"
            >
              {[
                { idx: '01', text: 'Gold-standard observation system' },
                { idx: '02', text: 'World-class atmospheric monitoring (AMRV)' },
                { idx: '03', text: 'Integrated algorithmic processing' },
                { idx: '04', text: 'Blockchain-secured traceability' },
                { idx: '05', text: 'Built for scale and complexity' },
              ].map((row, i) => {
                const isOn = activeFeatRow === i;
                return (
                  <div
                    key={row.idx}
                    onClick={() => setActiveFeatRow(isOn ? null : i)}
                    className={`feat-row-elem grid grid-cols-[30px_1fr_16px] gap-2 items-center py-2.75 border-b border-[#10291a]/14 last:border-b-0 font-mono text-[11px] tracking-[0.12em] uppercase text-[#10291a] cursor-pointer transition-all duration-300 hover:text-[#4f8a12] hover:pl-1.5 ${
                      isOn ? 'text-[#4f8a12] pl-1.5' : ''
                    }`}
                  >
                    <span className="opacity-60">{row.idx}</span>
                    <span>{row.text}</span>
                    <span
                      className={`transition-transform duration-300 ${
                        isOn ? 'translate-x-1 text-[#4f8a12]' : ''
                      }`}
                    >
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="prog absolute left-1/2 bottom-[22px] -translate-x-1/2 w-[120px] h-[2px] bg-[#10291a]/18 rounded-[2px] overflow-hidden z-40">
            <div
              id="progInner"
              ref={progInnerRef}
              className="h-full w-full bg-[#a9dd3a] origin-left scale-x-0"
            />
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION (Slides up -30vh over pinned story) */}
      <section
        id="sol"
        ref={solSectionRef}
        className="relative z-[5] -mt-[30vh] bg-white rounded-t-[22px] px-4 sm:px-8.5 pt-16 sm:pt-17.5 pb-20 sm:pb-22.5 shadow-[0_-30px_60px_rgba(16,41,26,0.12)] text-[#10291a]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Head */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10">
            <div className="max-w-[640px]">
              <div className="chip">Our solutions</div>
              <h2 className="font-['Inter_Tight',sans-serif] font-medium text-[clamp(34px,3.9vw,58px)] leading-none tracking-[-0.04em] mt-5 text-[#10291a]">
                Validating what the ecosystem does naturally
              </h2>
            </div>
            <div className="max-w-[360px] text-[15px] leading-relaxed text-[#4a5a4f]">
              Field sensors, atmospheric flux towers and satellite data fused into one auditable
              record — so every tonne you report can be traced back to the ground it came from.
            </div>
          </div>

          {/* 3 Tilting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-13.5">
            {/* Card 1 */}
            <div
              className="sol-card-elem group relative h-[440px] rounded-xl overflow-hidden bg-[#1b3122] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out"
            >
              <div
                className="absolute inset-0 bg-cover transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-107"
                style={{
                  backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025630_9a37a1e0-2547-4973-8160-c75205993914.png&w=1400&q=82')`,
                  backgroundPosition: '22% 70%',
                  backgroundSize: '260%',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a190f]/45 via-transparent to-[#0a190f]/75" />
              <div className="relative h-full p-6 flex flex-col justify-between z-[2]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase opacity-90">
                    [Nature-based solutions]
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c6f35c] text-[#10291a] text-sm font-semibold transition-transform duration-300 group-hover:-rotate-45">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Inter_Tight',sans-serif] text-[25px] font-medium tracking-[-0.03em] leading-[1.05] mb-2">
                    Forest & peatland
                    <br />
                    carbon projects
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-white/85 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-20 group-hover:opacity-100">
                    Continuous flux measurement replaces sampled estimates, so credits reflect what
                    the land actually absorbs.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="sol-card-elem group relative h-[440px] rounded-xl overflow-hidden bg-[#1b3122] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out"
            >
              <div
                className="absolute inset-0 bg-cover transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-107"
                style={{
                  backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025545_b003e5cc-e68f-4fee-b686-c217a5d81eea.png&w=1400&q=82')`,
                  backgroundPosition: '50% 50%',
                  backgroundSize: '190%',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a190f]/45 via-transparent to-[#0a190f]/75" />
              <div className="relative h-full p-6 flex flex-col justify-between z-[2]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase opacity-90">
                    [Supply chain solutions]
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c6f35c] text-[#10291a] text-sm font-semibold transition-transform duration-300 group-hover:-rotate-45">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Inter_Tight',sans-serif] text-[25px] font-medium tracking-[-0.03em] leading-[1.05] mb-2">
                    Scope 3 sourcing
                    <br />
                    verification
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-white/85 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-20 group-hover:opacity-100">
                    Trace commodities to the plots that grew them, with deforestation-free evidence
                    attached to every shipment.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="sol-card-elem group relative h-[440px] rounded-xl overflow-hidden bg-[#1b3122] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out"
            >
              <div
                className="absolute inset-0 bg-cover transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-107"
                style={{
                  backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025630_9a37a1e0-2547-4973-8160-c75205993914.png&w=1400&q=82')`,
                  backgroundPosition: '62% 30%',
                  backgroundSize: '230%',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a190f]/45 via-transparent to-[#0a190f]/75" />
              <div className="relative h-full p-6 flex flex-col justify-between z-[2]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase opacity-90">
                    [Biodiversity credits]
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c6f35c] text-[#10291a] text-sm font-semibold transition-transform duration-300 group-hover:-rotate-45">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Inter_Tight',sans-serif] text-[25px] font-medium tracking-[-0.03em] leading-[1.05] mb-2">
                    Living species
                    <br />
                    baselines
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-white/85 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-20 group-hover:opacity-100">
                    Acoustic and eDNA monitoring builds a measurable biodiversity baseline you can
                    report against year over year.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Count-up Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-15 pt-5 border-t border-[#e0e5e0]">
            <div className="pt-5.5">
              <div
                className="stat-num-elem font-['Inter_Tight',sans-serif] text-[44px] font-medium tracking-[-0.04em] text-[#10291a] leading-none"
                data-target="1240"
                data-format="comma"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-[#6a7a6f] mt-2">
                Sensors deployed
              </div>
            </div>

            <div className="pt-5.5">
              <div
                className="stat-num-elem font-['Inter_Tight',sans-serif] text-[44px] font-medium tracking-[-0.04em] text-[#10291a] leading-none"
                data-target="38"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-[#6a7a6f] mt-2">
                Countries monitored
              </div>
            </div>

            <div className="pt-5.5">
              <div
                className="stat-num-elem font-['Inter_Tight',sans-serif] text-[44px] font-medium tracking-[-0.04em] text-[#10291a] leading-none"
                data-target="2.1"
                data-decimals="1"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-[#6a7a6f] mt-2">
                Mt CO₂e verified
              </div>
            </div>

            <div className="pt-5.5">
              <div
                className="stat-num-elem font-['Inter_Tight',sans-serif] text-[44px] font-medium tracking-[-0.04em] text-[#10291a] leading-none"
                data-target="99.4"
                data-decimals="1"
                data-suffix="% "
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-[#6a7a6f] mt-2">
                % Data uptime
              </div>
            </div>
          </div>

          {/* AQUATRACK ECOSYSTEM INTEGRATION SECTION */}
          <div className="mt-20 pt-16 border-t border-[#10291a]/10">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#10291a] via-[#1b3d28] to-[#0d2216] text-white shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#c6f35c]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#c6f35c] text-xs font-mono tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AquaTrack Ecosystem Platform</span>
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                  From Planetary Sensing to Personal Water Conservation.
                </h3>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                  AquaTrack pairs Mossline’s atmospheric flux data with household water tracking,
                  verified Philippine environmental laws, real-time analytics, and educational games.
                  Join the mission to track every drop and protect every tomorrow.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Droplets className="w-5 h-5 text-[#c6f35c] mb-2" />
                    <h5 className="font-semibold text-xs text-white">Daily Tracking</h5>
                    <p className="text-[11px] text-white/60 mt-0.5">Logs in 5 units</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <BarChart3 className="w-5 h-5 text-[#c6f35c] mb-2" />
                    <h5 className="font-semibold text-xs text-white">Analytics</h5>
                    <p className="text-[11px] text-white/60 mt-0.5">Rolling 7d & 30d</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Scale className="w-5 h-5 text-[#c6f35c] mb-2" />
                    <h5 className="font-semibold text-xs text-white">PH Water Laws</h5>
                    <p className="text-[11px] text-white/60 mt-0.5">RA 9275 & PD 1067</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Gamepad2 className="w-5 h-5 text-[#c6f35c] mb-2" />
                    <h5 className="font-semibold text-xs text-white">Eco Games</h5>
                    <p className="text-[11px] text-white/60 mt-0.5">Interactive arcade</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                  <button
                    onClick={onOpenRegister}
                    className="px-6 py-3.5 rounded-xl bg-[#c6f35c] hover:bg-[#a9dd3a] text-[#10291a] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </button>

                  <button
                    onClick={onOpenLogin}
                    className="px-6 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </button>

                  <a
                    href="/mossline.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3.5 rounded-xl text-white/70 hover:text-white text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Standalone Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[#e0e5e0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6a7a6f] gap-4">
            <div>
              © 2026 Mossline × AquaTrack. All rights reserved. Track Every Drop, Protect Every Tomorrow.
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <button onClick={onOpenNews} className="hover:text-[#10291a] cursor-pointer">
                Water News
              </button>
              <span>·</span>
              <button onClick={onOpenCreator} className="hover:text-[#10291a] cursor-pointer">
                About Creator
              </button>
              <span>·</span>
              <a href="/mossline.html" className="hover:text-[#10291a]">
                Pure Standalone
              </a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};
