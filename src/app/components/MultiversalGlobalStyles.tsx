import { CustomerTheme } from '@/modules/core/data/types/CustomerTheme';
import {
  AllowedVariableFont,
  injectFontFamily,
} from '@/modules/core/fonts/fonts';
import {
  css,
  Global,
} from '@emotion/react';
import React from 'react';
import {
  NRN_DEFAULT_FALLBACK_FONTS,
  NRN_DEFAULT_FONT,
} from '../constants';

type Props = {
  customerTheme: CustomerTheme;
}

/**
 * Those styles are applied
 *  - universally (browser + server)
 *  - globally (applied to all pages), through Layouts
 *
 * @param props
 */
const MultiversalGlobalStyles: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { customerTheme } = props;
  const {
    primaryColor,
    primaryColorVariant1,
    onPrimaryColor,
    secondaryColor,
    secondaryColorVariant1,
    onSecondaryColor,
    backgroundColor,
    onBackgroundColor,
    surfaceColor,
    onSurfaceColor,
    errorColor,
    onErrorColor,
    fonts: activeFont,
    ...rest
  } = customerTheme;
  const fontName: AllowedVariableFont = activeFont || NRN_DEFAULT_FONT;
  const fontFamily = injectFontFamily(fontName);

  return (
    <Global
      styles={css`
        // Inject font-faces for the active font
        ${fontFamily}

        // Apply active font to all elements
        body.nrn {
          * {
            font-family: "${fontName}", "${NRN_DEFAULT_FALLBACK_FONTS}" !important;
          }
        }

        body.nrn, // Only applied to the main application
        body.sb-show-main { // And when included within Storybook
          background-color: ${backgroundColor};

          .page-container {
            background-color: ${backgroundColor};
            min-height: 400px; // Avoids sidebar to display on top of the footer low height pages

            @media (max-width: 991.98px) {
              min-height: 300px;
            }
          }

          .container {
            justify-content: center;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
          }

          .container-white {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            margin-top: 30px;
            margin-bottom: 30px;
          }

          #__next {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        // Applied to all elements marked with ".nrn"
        // Those will be applied even into iframes.
        // If there are iframes being displayed, they'll inherit the below behaviors.
        .nrn,
        .sb-show-main {
          // ----------- Application-wide custom elements -----------


          // ----------- Color system utilities -----------

          a {
            color: ${primaryColor};

            &:hover {
              color: ${primaryColorVariant1};
            }
          }

          .pcolor,
          .primary-color,
          [class*="primary_color"] {
            color: ${primaryColor};
            fill: ${primaryColor}; // For SVG
          }

          .pbgcolor,
          .primary-background-color {
            background-color: ${primaryColor};
            color: ${onPrimaryColor};
          }

          .scolor,
          .secondary-color,
          [class*="secondary_color"] {
            color: ${secondaryColor};
            fill: ${secondaryColor}; // For SVG
          }

          .sbgcolor,
          .secondary-background-color {
            background-color: ${secondaryColor};
            color: ${onSecondaryColor};
          }

          // ----------- Shortcuts utilities -----------

          .b,
          .bold {
            font-weight: bold;
          }

          .i,
          .italic {
            font-weight: bold;
          }

          .center {
            text-align: center;
          }

          .center-block {
            text-align: center;
            margin: auto;
          }

          .hide-sm-md,
          .hide-mobile {
            @media (max-width: 991.98px) {
              display: none;
            }
          }

          // ----------- Override native elements -----------

          button {
            cursor: pointer;

            &:focus {
              outline: 0; // Overrides Bootstrap default behavior
            }

            &.disabled {
              cursor: not-allowed;
            }
          }

          label {
            cursor: pointer;
          }

          // ----------- Animations utilities -----------

          .animated, // Compatible with animate.css v3
          .animate__animated // Compatible with animate.css v4 (breaking change, see https://animate.style/#usage)
          {
            // Delay control (latency)
            &.delay-100ms {
              animation-delay: 0.1s;
            }

            &.delay-200ms {
              animation-delay: 0.2s;
            }

            &.delay-400ms {
              animation-delay: 0.4s;
            }

            &.delay-600ms {
              animation-delay: 0.6s;
            }

            // Duration control (speed)
            &.duration-100ms {
              animation-duration: 0.1s;
            }

            &.duration-200ms {
              animation-duration: 0.2s;
            }

            &.duration-300ms {
              animation-duration: 0.3s;
            }

            &.duration-400ms {
              animation-duration: 0.4s;
            }

            &.duration-600ms {
              animation-duration: 0.6s;
            }

            &.duration-3000ms {
              animation-duration: 3s;
            }

            &.duration-6000ms {
              animation-duration: 6s;
            }
          }

        }

        // ----------- Reactstrap/Bootstrap override -----------

        .fade {
          opacity: 1 !important; // Overrides default bootstrap behaviour to avoid make-believe SSR doesn't work on the demo, when JS is disabled - See https://github.com/UnlyEd/next-right-now/issues/9
        }

        // ----------- React-Select override -----------

        .select {
          * {
            color: ${primaryColor} !important;
          }
        }

        // ----------- Font-Awesome override -----------

        [class*="fa-"],
        [class*="fal-"],
        [class*="fas-"],
        [class*="far-"] {
          margin-right: 5px;
          cursor: pointer;
        }

        // ----------- CookieConsent override -----------

        .cc-revoke {
          border: 1px solid lightgrey;
        }

        .cc-btn.cc-allow {
          background-color: ${primaryColor} !important;
          color: white !important;

          &:hover {
            opacity: 0.8;
          }
        }

        .cc-btn.cc-deny {
          color: darkgrey !important;
        }
      `}
    />
  );
};

export default MultiversalGlobalStyles;
