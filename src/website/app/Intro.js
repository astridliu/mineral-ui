/**
 * Copyright 2017 CA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */
import {
  createStyledComponent,
  getNormalizedValue,
  pxToEm
} from '../../styles';
import Markdown from './Markdown';

export default createStyledComponent(Markdown, ({ theme }) => ({
  '& > p': {
    color: theme.color_gray_70,
    fontSize: pxToEm(20),
    fontWeight: '300',
    maxWidth: getNormalizedValue(theme.maxTextWidth, pxToEm(20)),

    [theme.bp_moreSpacious]: {
      fontSize: pxToEm(24),
      maxWidth: getNormalizedValue(theme.maxTextWidth, pxToEm(24))
    }
  }
}));
