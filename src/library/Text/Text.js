/* @flow */
import React, { Component } from 'react';
import { createStyledComponent } from '../styles';

type Props = {
  /** Available horizontal alignments */
  align?: 'start' | 'end' | 'center' | 'justify',
  /** Available styles */
  appearance?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'mouse' | 'prose',
  /** Rendered content */
  children: React$Node,
  /** Color of text */
  color?: string,
  /** The rendered HTML element, e.g. `'span'`, `'strong'` */
  element?: string,
  /** Available font weights */
  fontWeight?: 'regular' | 'semiBold' | 'bold' | 'extraBold' | number,
  /** Remove top & bottom margins */
  noMargins?: boolean
};

export const componentTheme = (baseTheme: Object) => ({
  Text_backgroundColor_selected: baseTheme.color_theme_40,
  Text_color: baseTheme.color_text,
  Text_color_h1: baseTheme.color_gray_100,
  Text_color_h2: baseTheme.color_gray_80,
  Text_color_h3: baseTheme.color_gray_80,
  Text_color_h4: baseTheme.color_gray_80,
  Text_color_h5: baseTheme.color_gray_100,
  Text_color_h6: baseTheme.color_gray_80,
  Text_fontSize: baseTheme.fontSize_ui,
  Text_fontSize_h1: baseTheme.fontSize_h1,
  Text_fontSize_h2: baseTheme.fontSize_h2,
  Text_fontSize_h3: baseTheme.fontSize_h3,
  Text_fontSize_h4: baseTheme.fontSize_h4,
  Text_fontSize_h5: baseTheme.fontSize_h5,
  Text_fontSize_h6: baseTheme.fontSize_h6,
  Text_fontSize_mouse: baseTheme.fontSize_mouse,
  Text_fontSize_prose: baseTheme.fontSize_prose,
  Text_fontWeight_h1: baseTheme.fontWeight_extraBold,
  Text_fontWeight_h2: baseTheme.fontWeight_bold,
  Text_fontWeight_h3: baseTheme.fontWeight_bold,
  Text_fontWeight_h4: baseTheme.fontWeight_bold,
  Text_fontWeight_h5: baseTheme.fontWeight_bold,
  Text_fontWeight_h6: baseTheme.fontWeight_regular,
  Text_lineHeight: baseTheme.lineHeight_prose,
  Text_lineHeight_heading: baseTheme.lineHeight,
  Text_lineHeight_headingSmall: baseTheme.lineHeight_prose,
  Text_marginBottom: baseTheme.space_stack_md,
  Text_marginBottom_heading: baseTheme.space_stack_sm,

  ...baseTheme
});

const styles = {
  root: ({
    align,
    appearance: propAppearance,
    color,
    element,
    fontWeight,
    noMargins,
    theme: baseTheme
  }) => {
    let theme = componentTheme(baseTheme);
    const headingValues = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const isHeading = headingValues.indexOf(element) !== -1;
    const appearance = propAppearance
      ? propAppearance
      : isHeading ? element : null;
    const isHeadingAppearance = headingValues.indexOf(appearance) !== -1;
    const rtl = theme.direction === 'rtl';

    if (isHeadingAppearance && appearance) {
      theme = {
        ...theme,
        Text_color: theme[`Text_color_${appearance}`],
        Text_fontSize: theme[`Text_fontSize_${appearance}`],
        Text_fontWeight: theme[`Text_fontWeight_${appearance}`],
        Text_lineHeight:
          ['h5', 'h6'].indexOf(appearance) !== -1
            ? theme.Text_lineHeight_headingSmall
            : theme.Text_lineHeight_heading,
        Text_marginBottom: theme.Text_marginBottom_heading
      };
    }

    let styles = {
      color: color || theme.Text_color,
      fontSize:
        appearance && !isHeadingAppearance
          ? theme[`Text_fontSize_${appearance}`]
          : theme.Text_fontSize,
      fontWeight: (() => {
        if (fontWeight && theme[`fontWeight_${fontWeight}`]) {
          return theme[`fontWeight_${fontWeight}`];
        } else if (isHeadingAppearance && theme.Text_fontWeight) {
          return theme.Text_fontWeight;
        } else {
          return fontWeight || theme.fontWeight_regular;
        }
      })(),
      lineHeight: theme.Text_lineHeight,
      // Not normalized because we actually want `##em` as applied value
      marginBottom: !noMargins ? theme.Text_marginBottom : 0,
      marginTop: 0,
      textAlign: (() => {
        if ((rtl && align == 'start') || (!rtl && align == 'end')) {
          return 'right';
        } else if ((rtl && align == 'end') || align == 'start') {
          return 'left';
        } else {
          return align;
        }
      })(),

      '&::selection': {
        backgroundColor: theme.Text_backgroundColor_selected
      }
    };

    if (['code', 'kbd', 'samp'].indexOf(element) !== -1) {
      (styles: Object).fontFamily = theme.fontFamily_monospace;
    }

    return styles;
  }
};

// Text's root node must be created outside of render, so that the entire DOM
// element is replaced only when the element prop is changed, otherwise it is
// updated in place
function createRootNode(props: Props) {
  const { element = Text.defaultProps.element } = props;

  return createStyledComponent(element, styles.root, {
    includeStyleReset: true,
    rootEl: element
  });
}

/**
 * The Text component provides styles and semantic meaning for text and headings
 * in a manner consistent with other components.
 */
export default class Text extends Component<Props> {
  static defaultProps = {
    align: 'start',
    element: 'p'
  };

  componentWillUpdate(nextProps: Props) {
    if (this.props.element !== nextProps.element) {
      this.rootNode = createRootNode(nextProps);
    }
  }

  rootNode: React$ComponentType<*> = createRootNode(this.props);

  render() {
    const Root = this.rootNode;

    return <Root {...this.props} />;
  }
}
