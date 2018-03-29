/* @flow */
import React, { Children, cloneElement } from 'react';
import { ellipsis } from 'polished';
import { createStyledComponent, getNormalizedValue, pxToEm } from '../styles';
import { createThemedComponent, mapComponentThemes } from '../themes';
import IconDanger from '../Icon/IconDanger';
import IconSuccess from '../Icon/IconSuccess';
import IconWarning from '../Icon/IconWarning';
import Text, { componentTheme as textComponentTheme } from '../Text/Text';
import CardRow from './CardRow';

type Props = {
  /** See the [Actions Menu](#actions-menu) example (will take precedence over `secondaryText`) */
  actions?: React$Node,
  /** Avatar image displayed beside the title */
  avatar?: string | React$Element<*>,
  /** Title of Card */
  children: React$Node,
  /** Information displayed beside the title (`actions` will take precedence over this) */
  secondaryText?: string | React$Element<*>,
  /** Subtitle displayed under the title */
  subtitle?: React$Node,
  /** Available variants */
  variant?: 'danger' | 'success' | 'warning'
};

export const componentTheme = (baseTheme: Object) => {
  const textTheme = textComponentTheme(baseTheme);
  const {
    Text_color,
    Text_color_h4,
    Text_fontSize_h4,
    Text_fontSize_mouse,
    Text_fontWeight_h4,
    ...rest
  } = textTheme;
  const ignoreRest = { ...rest };

  return {
    CardTitle_color: Text_color_h4,
    CardTitle_fontSize: Text_fontSize_h4,
    CardTitle_fontWeight: Text_fontWeight_h4,

    CardTitleAvatar_margin: baseTheme.space_inline_sm,
    CardTitleAvatarSize: baseTheme.size_small,
    CardTitleAvatarSize_large: baseTheme.size_large,

    CardTitleIcon_margin: baseTheme.space_inline_sm,

    CardTitleSecondaryText_color: Text_color,
    CardTitleSecondaryText_fontSize: Text_fontSize_mouse,
    CardTitleSecondaryText_fontWeight: baseTheme.fontWeight_regular,

    CardSubtitle_color: Text_color,
    CardSubtitle_fontSize: Text_fontSize_mouse,
    CardSubtitle_fontWeight: baseTheme.fontWeight_regular,
    CardSubtitle_marginTop: baseTheme.space_stack_sm,

    ...baseTheme
  };
};

const ThemedTextTitle = createThemedComponent(Text, ({ theme: baseTheme }) => {
  const cardTitleTheme = componentTheme(baseTheme);
  return {
    ...mapComponentThemes(
      {
        name: 'CardTitle',
        theme: cardTitleTheme
      },
      {
        name: 'Text',
        theme: {
          Text_color_h4: cardTitleTheme.CardTitle_color,
          Text_fontSize_h4: cardTitleTheme.CardTitle_fontSize,
          Text_fontWeight_h4: cardTitleTheme.CardTitle_fontWeight
        }
      },
      baseTheme
    )
  };
});

const ThemedTextSecondary = createThemedComponent(
  Text,
  ({ theme: baseTheme }) => {
    const cardTitleTheme = componentTheme(baseTheme);
    return {
      ...mapComponentThemes(
        {
          name: 'CardTitleSecondaryText',
          theme: cardTitleTheme
        },
        {
          name: 'Text',
          theme: {
            Text_fontSize_mouse: cardTitleTheme.CardTitleSecondaryText_fontSize
          }
        },
        baseTheme
      )
    };
  }
);

const ThemedTextSubtitle = createThemedComponent(
  Text,
  ({ theme: baseTheme }) => {
    const cardTitleTheme = componentTheme(baseTheme);
    return {
      ...mapComponentThemes(
        {
          name: 'CardSubtitle',
          theme: cardTitleTheme
        },
        {
          name: 'Text',
          theme: {
            Text_fontSize_mouse: cardTitleTheme.CardSubtitle_fontSize
          }
        },
        baseTheme
      )
    };
  }
);

const styles = {
  avatar: ({ subtitle, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);
    const rtl = theme.direction === 'rtl';
    const width = subtitle
      ? theme.CardTitleAvatarSize_large
      : theme.CardTitleAvatarSize;

    return {
      flex: '0 0 auto',
      marginLeft: rtl ? theme.CardTitleAvatar_margin : null,
      marginRight: rtl ? null : theme.CardTitleAvatar_margin,
      width,

      '&[class] > *': {
        height: 'auto',
        width: '100%'
      }
    };
  },
  inner: {
    flex: '1 1 auto'
  },
  secondaryText: props => {
    const theme = componentTheme(props.theme);

    return {
      flex: '0 0 auto',
      // Optical alignment
      transform: `translateY(${getNormalizedValue(
        pxToEm(5),
        theme.CardTitleSecondaryText_fontSize
      )})`,
      ...ellipsis('33%')
    };
  },
  root: {
    display: 'flex'
  },
  subtitle: ({ avatar, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      fontWeight: theme.CardSubtitle_fontWeight,
      marginTop: avatar
        ? null
        : getNormalizedValue(
            theme.CardSubtitle_marginTop,
            theme.CardSubtitle_fontSize
          )
    };
  },
  title: ({ theme: baseTheme, variant }) => {
    const theme = componentTheme(baseTheme);
    const rtl = theme.direction === 'rtl';

    return {
      alignItems: 'flex-start',
      display: 'flex',

      '& > [role="img"]': {
        fill: variant ? theme[`color_text_${variant}`] : null,
        marginLeft: rtl ? theme.CardTitleIcon_margin : null,
        marginRight: rtl ? null : theme.CardTitleIcon_margin,
        position: 'relative',
        top: pxToEm(4) // optical alignment
      }
    };
  },
  titleContent: ({ actions, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);
    const rtl = theme.direction === 'rtl';
    const actionsMargin = getNormalizedValue(
      theme.CardTitleIcon_margin,
      theme.CardTitle_fontSize
    );

    return {
      flex: '1 1 auto',
      marginLeft: actions && rtl ? actionsMargin : null,
      marginRight: actions && !rtl ? actionsMargin : null
    };
  }
};

const Root = createStyledComponent(CardRow, styles.root, {
  displayName: 'CardTitle'
});
const Avatar = createStyledComponent('span', styles.avatar);
const Inner = createStyledComponent('div', styles.inner);
const SecondaryText = createStyledComponent(
  ThemedTextSecondary,
  styles.secondaryText
).withProps({
  element: 'span',
  appearance: 'mouse',
  noMargins: true
});
const Subtitle = createStyledComponent(
  ThemedTextSubtitle,
  styles.subtitle
).withProps({
  element: 'h4',
  appearance: 'mouse',
  noMargins: true
});
const Title = createStyledComponent('div', styles.title);
const TitleContent = createStyledComponent(
  ThemedTextTitle,
  styles.titleContent
).withProps({
  element: 'h3',
  appearance: 'h4',
  noMargins: true
});

const variantIcons = {
  danger: <IconDanger size="medium" />,
  success: <IconSuccess size="medium" />,
  warning: <IconWarning size="medium" />
};

/**
 * CardTitle displays a Card title and an optional subtitle.
 * You can put CardTitle in any order in relation to other root components of
 * [Card](/components/card).
 */
export default function CardTitle({
  actions,
  avatar,
  children,
  secondaryText,
  subtitle,
  variant,
  ...restProps
}: Props) {
  const rootProps = {
    ...restProps
  };

  const secondaryComponent = actions ? (
    Children.map(actions, (action, index) =>
      cloneElement(action, { key: index })
    )
  ) : secondaryText ? (
    <SecondaryText>{secondaryText}</SecondaryText>
  ) : null;

  return (
    <Root {...rootProps}>
      {avatar && <Avatar subtitle={subtitle}>{avatar}</Avatar>}
      <Inner>
        <Title variant={variant}>
          {variant && variantIcons[variant]}
          <TitleContent actions={actions}>{children}</TitleContent>
          {secondaryComponent}
        </Title>
        {subtitle && <Subtitle avatar={avatar}>{subtitle}</Subtitle>}
      </Inner>
    </Root>
  );
}
