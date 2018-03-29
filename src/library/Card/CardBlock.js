/* @flow */
import React from 'react';
import { createStyledComponent } from '../styles';
import { createThemedComponent, mapComponentThemes } from '../themes';
import Text, { componentTheme as textComponentTheme } from '../Text/Text';
import { componentTheme as cardComponentTheme } from './Card';
import CardRow from './CardRow';

type Props = {
  /** Contents of CardBlock */
  children: React$Node
};

export const componentTheme = (baseTheme: Object) => {
  const textTheme = textComponentTheme(baseTheme);
  const { Text_fontSize, Text_lineHeight, ...rest } = textTheme;
  const ignoreRest = { ...rest };

  return {
    ...mapComponentThemes(
      {
        name: 'Text',
        theme: {
          Text_fontSize,
          Text_lineHeight
        }
      },
      {
        name: 'CardBlock',
        theme: {}
      },
      baseTheme
    )
  };
};

const ThemedText = createThemedComponent(Text, ({ theme: baseTheme }) => {
  return {
    ...mapComponentThemes(
      {
        name: 'CardBlock',
        theme: componentTheme(baseTheme)
      },
      {
        name: 'Text',
        theme: {}
      },
      baseTheme
    )
  };
});

const styles = {
  root: props => {
    const theme = cardComponentTheme(props.theme);

    return {
      '&:last-child': {
        marginBottom: theme.CardRow_marginVerticalLast
      }
    };
  }
};

const Root = createStyledComponent(CardRow, styles.root, {
  displayName: 'CardBlock'
});

/**
 * CardBlock is used to normalize font sizes for content and to provide
 * consistent margins and padding.
 */
export default function CardBlock({ children, ...restProps }: Props) {
  return (
    <Root {...restProps}>
      <ThemedText color="inherit" element="div" noMargins>
        {children}
      </ThemedText>
    </Root>
  );
}
