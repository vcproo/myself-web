import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Search } from 'lucide-react';

type DockKey = 'articles' | 'tools' | 'about' | 'contact';

const DOCK_ITEMS: { key: DockKey; label: string; href: string }[] = [
  { key: 'articles', label: '文章', href: '/#articles' },
  { key: 'tools', label: '开源工具', href: '/#tools' },
  { key: 'about', label: '关于', href: '/#about' },
  { key: 'contact', label: '交流联系', href: '/#contact' },
];

export default function FloatingDock({
  currentPath,
  alwaysVisible = false,
}: {
  currentPath: string;
  alwaysVisible?: boolean;
}) {
  const isHome = currentPath === '/' || currentPath === '';
  const [visible, setVisible] = useState(alwaysVisible);
  const [activeKey, setActiveKey] = useState<DockKey>(() => {
    if (currentPath.startsWith('/tools')) return 'tools';
    return 'articles';
  });

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }

    const onScroll = () => {
      const threshold = Math.max(360, window.innerHeight * 0.62);
      setVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysVisible]);

  useEffect(() => {
    const syncTab = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '') as DockKey;
      if (path.startsWith('/tools')) {
        setActiveKey('tools');
      } else if (path.startsWith('/articles')) {
        setActiveKey('articles');
      } else if (
        hash === 'articles' ||
        hash === 'tools' ||
        hash === 'about' ||
        hash === 'contact'
      ) {
        setActiveKey(hash);
      } else {
        setActiveKey('articles');
      }
    };

    syncTab();
    const onTabEvent = (e: Event) => {
      const detail = (e as CustomEvent<DockKey>).detail;
      if (detail) setActiveKey(detail);
    };

    window.addEventListener('hashchange', syncTab);
    window.addEventListener('switch-home-tab', onTabEvent);
    window.addEventListener('home-tab-changed', onTabEvent);
    return () => {
      window.removeEventListener('hashchange', syncTab);
      window.removeEventListener('switch-home-tab', onTabEvent);
      window.removeEventListener('home-tab-changed', onTabEvent);
    };
  }, [currentPath]);

  const handleDockClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    key: DockKey
  ) => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      setActiveKey(key);
      window.history.replaceState(null, '', `#${key}`);
      window.dispatchEvent(new CustomEvent('switch-home-tab', { detail: key }));
      const el = document.getElementById('showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 max-w-[94vw]"
        >
          <div className="flex items-center gap-1 rounded-full border border-[#27232D]/15 bg-[#FCFBF8]/92 p-1.5 shadow-[0_12px_36px_-8px_rgba(39,35,45,0.22)] backdrop-blur-md">
            {/* Mini IP Avatar back-to-top */}
            <a
              href="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              title="回到开屏顶部"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3EBDD] ring-1 ring-[#27232D]/15 hover:scale-105 transition-transform"
            >
              <img
                src="/ip/avatar-64.png"
                alt="蜘蛛侦探"
                className="h-7 w-7 rounded-full object-cover"
              />
            </a>

            <span className="h-4 w-[1px] bg-[#E6DDD0] mx-0.5" aria-hidden="true" />

            <nav aria-label="快捷板块切换" className="flex items-center gap-0.5">
              {DOCK_ITEMS.map((item) => {
                const active = activeKey === item.key;
                const href =
                  !isHome &&
                  item.key === 'articles' &&
                  currentPath !== '/articles' &&
                  currentPath !== '/articles/'
                    ? '/articles'
                    : item.href;

                return (
                  <a
                    key={item.key}
                    href={href}
                    onClick={(e) => handleDockClick(e, item.key)}
                    className={`relative rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                      active
                        ? 'text-[#27232D]'
                        : 'text-[#645B55] hover:text-[#27232D]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="floatingDockPill"
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-[#C7EFDC]/75 border border-[#27232D]/12"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <span className="hidden sm:inline-block h-4 w-[1px] bg-[#E6DDD0] mx-0.5" aria-hidden="true" />

            {/* Trigger Global Command Palette */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent('open-command-palette'))
              }
              title="搜索文章与工具 (⌘K)"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-[#49414F] hover:bg-[#F3EBDD] hover:text-[#27232D] transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="回到顶部"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#49414F] hover:bg-[#F3EBDD] hover:text-[#D95A49] transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
