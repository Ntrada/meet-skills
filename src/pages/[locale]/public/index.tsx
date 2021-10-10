import { CommonServerSideParams } from '@/app/types/CommonServerSideParams';
import { OnlyBrowserPageProps } from '@/layouts/core/types/OnlyBrowserPageProps';
import { SSGPageProps } from '@/layouts/core/types/SSGPageProps';
import PublicLayout from '@/layouts/public/components/PublicLayout';
import {
  getPublicLayoutStaticPaths,
  getPublicLayoutStaticProps,
} from '@/layouts/public/publicLayoutSSG';
import { AMPLITUDE_PAGES } from '@/modules/core/amplitude/events';
import useCustomer from '@/modules/core/data/hooks/useCustomer';
import { Customer } from '@/modules/core/data/types/Customer';
import { createLogger } from '@/modules/core/logging/logger';
import { Box } from '@chakra-ui/react';
import {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
import React from 'react';
import { Banner } from '@/common/components/banners/Banner';

import { LandingPage } from '../../../common/components/heroes/LandingPage';
import { UserCardWithRating } from '@/common/components/cards/user-card-with-rating/UserCardWithRating';
import { HeaderWithAction } from '@/common/components/headers/header-with-actions/HeaderWithAction';
import { HeaderWithActionAndTab } from '@/common/components/headers/header-with-actions-and-tabs/HeaderWithActionAndTab';
import { NotificationWithSeparator } from '@/common/components/notifications/NotificationWithSeparator';
import { ButtonCheckboxList } from '@/common/components/checkboxes/button-checkbox/ButtonCheckboxList';
import { TestemonialWithCurve } from '@/common/components/testemonials/testemonials-with-curve/TestemonialWithCurve';
import { DarkWithTestimonial } from '@/common/components/features/dark-with-testimonial/DarkWithTestimonial';
import { SignIn } from '@/common/components/auth/sign-in/SignIn';

const fileLabel = 'pages/[locale]/public/index';
const logger = createLogger({ // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
  fileLabel,
});

/**
 * Only executed on the server side at build time.
 * Necessary when a page has dynamic routes and uses "getStaticProps".
 */
export const getStaticPaths: GetStaticPaths<CommonServerSideParams> = getPublicLayoutStaticPaths();

/**
 * Only executed on the server side at build time.
 *
 * @return Props (as "SSGPageProps") that will be passed to the Page component, as props.
 *
 * @see https://github.com/vercel/next.js/discussions/10949#discussioncomment-6884
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps<SSGPageProps, CommonServerSideParams> = getPublicLayoutStaticProps();

/**
 * SSG pages are first rendered by the server (during static bundling).
 * Then, they're rendered by the client, and gain additional props (defined in OnlyBrowserPageProps).
 * Because this last case is the most common (server bundle only happens during development stage), we consider it a default.
 * To represent this behaviour, we use the native Partial TS keyword to make all OnlyBrowserPageProps optional.
 *
 * Beware props in OnlyBrowserPageProps are not available on the server.
 */
type Props = {} & SSGPageProps<Partial<OnlyBrowserPageProps>>;

/**
 * Example of a public page.
 */
const ExamplePublicPage: NextPage<Props> = (props): JSX.Element => {
  const customer: Customer = useCustomer();
  logger.info('customer', customer);

  return (
    <PublicLayout
      {...props}
      pageName={AMPLITUDE_PAGES.TEMPLATE_SSG_PAGE}
    >

      <DarkWithTestimonial />
      {/* <SignIn />
      <TestemonialWithCurve />
      <ButtonCheckboxList />
      <NotificationWithSeparator />
      <UserCardWithRating />
      <HeaderWithActionAndTab />
      <HeaderWithAction />
      <LandingPage />
      <Banner /> */}
    </PublicLayout>
  );
};

export default ExamplePublicPage;
