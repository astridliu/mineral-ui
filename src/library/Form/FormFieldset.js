/* @flow */
import React from 'react';
import { createStyledComponent } from '../styles';
import { createThemedComponent, mapComponentThemes } from '../themes';
import Text, { componentTheme as textComponentTheme } from '../Text/Text';

type Props = {
  /** Rendered content of the component, most likely [FormField](/components/form-field) */
  children?: React$Node,
  /** Disable (visually) the fieldset */
  disabled?: boolean,
  /** Title of the fieldset */
  legend?: string | React$Element<*>
};

export const componentTheme = (baseTheme: Object) => {
  const textTheme = textComponentTheme(baseTheme);
  const {
    Text_color_h5,
    Text_fontSize_h5,
    Text_fontWeight_h5,
    ...rest
  } = textTheme;
  const ignoreRest = { ...rest };

  return {
    FormFieldset_borderColor: baseTheme.borderColor,

    FormFieldsetLegend_color_text: Text_color_h5,
    FormFieldsetLegend_fontSize: Text_fontSize_h5,
    FormFieldsetLegend_fontWeight: Text_fontWeight_h5,

    ...baseTheme
  };
};

const ThemedText = createThemedComponent(Text, ({ theme: baseTheme }) => {
  const formFieldTheme = componentTheme(baseTheme);
  return {
    ...mapComponentThemes(
      {
        name: 'FormFieldsetLegend',
        theme: formFieldTheme
      },
      {
        name: 'Text',
        theme: {
          Text_fontSize_h5: formFieldTheme.FormFieldsetLegend_fontSize,
          Text_fontWeight_h5: formFieldTheme.FormFieldsetLegend_fontWeight
        }
      },
      baseTheme
    )
  };
});

const styles = {
  root: ({ theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);

    return {
      border: '1px solid transparent',
      borderTopColor: theme.FormFieldset_borderColor,
      padding: 0
    };
  },
  legend: ({ disabled, theme: baseTheme }) => {
    const theme = componentTheme(baseTheme);
    return {
      color: disabled
        ? theme.color_text_disabled
        : theme.FormFieldsetLegend_color_text,
      lineHeight: theme.size_medium,
      padding: 0,
      paddingLeft: theme.direction === 'rtl' ? theme.space_inline_sm : null,
      paddingRight: theme.direction === 'ltr' ? theme.space_inline_sm : null
    };
  }
};

const Root = createStyledComponent('fieldset', styles.root, {
  displayName: 'FormFieldset',
  includeStyleReset: true,
  rootEl: 'fieldset'
});

const Legend = createStyledComponent(ThemedText, styles.legend).withProps({
  element: 'legend',
  appearance: 'h5',
  noMargins: true
});

/**
 * FormFieldsets group related [FormFields](/components/form-field) and provide a legend.
 * Grouping FormFields provides contextual clues to users and enhances
 * accessibility.
 */
export default function FormFieldset({
  children,
  legend,
  ...restProps
}: Props) {
  return (
    <Root {...restProps}>
      {legend && <Legend>{legend}</Legend>}
      {children}
    </Root>
  );
}
