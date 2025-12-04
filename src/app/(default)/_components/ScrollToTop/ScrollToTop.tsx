'use client';

import { Affix, ActionIcon, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowNarrowUpDashed } from '@tabler/icons-react';

export function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <ActionIcon
            size="lg"
            variant="filled"
            radius="xl"
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            aria-label="Scroll to top"
          >
            <IconArrowNarrowUpDashed size={20} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}

