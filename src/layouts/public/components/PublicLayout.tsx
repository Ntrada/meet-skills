import { PageShellWithGroupedMenu } from '@/common/components/page-shell/page-shell-with-grouped-menu/PageShellWithGroupedMenu';
import CoreLayout, { Props as CoreLayoutProps } from '@/layouts/core/components/CoreLayout';
import { createLogger } from '@/modules/core/logging/logger';
import { css } from '@emotion/react';
import React from 'react';

const fileLabel = 'layouts/public/components/PublicLayout';
const logger = createLogger({
  fileLabel,
});

type Props = Omit<CoreLayoutProps, 'layoutName'>;

/**
 * Overrides the CoreLayout to adapt it to the Public layout.
 *
 * Hides nav, footer and preview banner and applies some custom CSS for demonstration purpose.
 */
const PublicLayout: React.FunctionComponent<Props> = (props): JSX.Element => {
  return (
    <PageShellWithGroupedMenu>
    <CoreLayout
          layoutBaseCSS={css`
          `}
          layoutName={'public-layout'}
          hideFooter={true}
          hideNav={true}
          hidePreviewBanner={true}
          {...props}
        />
    </PageShellWithGroupedMenu>

  );
};

export default PublicLayout;
