import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type NavKey = 'articles' | 'tools' | 'about' | 'contact';

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'articles', label: '文章', href: '/#articles' },
  { key: 'tools', label: '开源工具', href: '/#tools' },
  { key: 'about', label: '关于', href: '/#about' },
  { key: 'contact', label: '交流联系', href: '/#contact' },
];

export default function HeaderNav({ currentPath }: { currentPath: string }) {
  const isHome = currentPath === '/' || currentPath === '';

  const getInitialActive = (): NavKey => {
    if (currentPath.startsWith('/tools')) return 'tools';
    if (currentPath.startsWith('/articles')) return 'articles';
    return 'articles';
  };

  const [activeKey, setActiveKey] = useState<NavKey>(getInitialActive);

  useEffect(() => {
    const syncState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '') as NavKey;
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

    syncState();

    const onTabEvent = (e: Event) => {
      const detail = (e as CustomEvent<NavKey>).detail;
      if (detail) setActiveKey(detail);
    };

    window.addEventListener('hashchange', syncState);
    window.addEventListener('popstate', syncState);
    window.addEventListener('switch-home-tab', onTabEvent);
    window.addEventListener('home-tab-changed', onTabEvent);
    return () => {
      window.removeEventListener('hashchange', syncState);
      window.removeEventListener('popstate', syncState);
      window.removeEventListener('switch-home-tab', onTabEvent);
      window.removeEventListener('home-tab-changed', onTabEvent);
    };
  }, [currentPath]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    key: NavKey
  ) => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      setActiveKey(key);
      window.history.replaceState(null, '', `#${key}`);
      window.dispatchEvent(new CustomEvent('switch-home-tab', { detail: key }));
      const showcaseEl = document.getElementById('showcase');
      if (showcaseEl) {
        const rect = showcaseEl.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.65 || rect.top < -60) {
          showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <nav
      aria-label="主导航"
      className="flex items-center gap-0.5 rounded-full border border-paper-300/90 bg-paper-100/90 p-1"
    >
      {NAV_ITEMS.map((item) => {
        const active = activeKey === item.key;
        // If user is on an article detail page and clicks 文章, take them to /articles archive or /#articles
        const resolvedHref =
          !isHome && item.key === 'articles' && currentPath !== '/articles' && currentPath !== '/articles/'
            ? '/articles'
            : item.href;

        return (
          <a
            key={item.key}
            href={resolvedHref}
            onClick={(e) => handleClick(e, item.key)}
            className={`relative rounded-full px-3 sm:px-3.5 py-1.5 text-xs sm:text-[13px] font-bold transition-colors whitespace-nowrap ${
              active ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            {active && (
              <motion.span
                layoutId="topHeaderNavActivePill"
                transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                className="absolute inset-0 rounded-full border border-paper-300 bg-paper-50 shadow-sm"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
              )}
              <span>{item.label}</span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
