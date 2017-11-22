import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from '../../shared/i18n';
import { translate, Trans, Interpolate } from 'react-i18next';
import { Flex } from 'styled-flexbox';
import { isOSX } from '../../shared/utils/platform';
import logo from '../styles/img/solo-logo.svg';
import AddArchiveButton from '../containers/add-archive-button';

const Caption = styled.figcaption`
  color: var(--gray-dark);
  font-weight: 300;
`;

const Figure = styled.figure`
  text-align: center;
`;

const EmptyView = ({ caption, imageSrc, className }) => {
  return (
    <Flex align="center" justify="center" flexAuto className={className}>
      <Figure>
        {imageSrc && <img src={imageSrc} />}
        <Caption>{caption}</Caption>
      </Figure>
    </Flex>
  );
};

EmptyView.propTypes = {
  caption: PropTypes.string,
  className: PropTypes.string,
  imageSrc: PropTypes.string
};

export default EmptyView;

const ColoredFlex = styled(Flex)`
  background-color: RGBA(20, 20, 20, 0.8);
  color: #fff;
`;

const Title = styled.h3`
  margin-bottom: var(--spacing-half);
`;

class Translate extends Component {
  static propTypes = {
    i18nKey: PropTypes.string,
    parent: PropTypes.string,
    defaultText: PropTypes.string,
    values: PropTypes.object
  };

  interpolation(str, values) {
    return str.replace(/\{\{(.*?)\}\}/g, (a, b) => values[b] || '');
  }

  render() {
    const {
      parent: Parent = 'span',
      i18nKey,
      values,
      defaultText
    } = this.props;
    const translatedText = i18n.t(i18nKey, values);
    return (
      <Parent>
        {translatedText === i18nKey
          ? this.interpolation(defaultText, values)
          : translatedText}
      </Parent>
    );
  }
}

let interpolateComponent = <strong>a interpolated component</strong>;
const NoArchiveSelectedView = ({ t }) => (
  <ColoredFlex align="center" justify="center" flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Trans i18nKey="welcome-back-title" parent="span">
          Welcome back to Buttercup.
        </Trans>
      </Title>
      <Caption>
        <Interpolate
          i18nKey="unlock-archive"
          os={`${isOSX() ? '⌘' : 'Ctrl'}+1`}
          component={interpolateComponent}
        />

        <Translate
          i18nKey="unlock-archive"
          values={{
            os: `${isOSX() ? '⌘' : 'Ctrl'}+1`
          }}
          defaultText="Welcome back to Buttercup. {{os}}"
        />
      </Caption>
    </Figure>
  </ColoredFlex>
);

NoArchiveSelectedView.propTypes = {
  t: PropTypes.func
};

export const NoArchiveSelected = translate()(NoArchiveSelectedView);

const WelcomeScreenView = ({ t }) => (
  <ColoredFlex align="center" justify="center" flexColumn flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Trans i18nKey="welcome-title" parent="span">
          Welcome to Buttercup.
        </Trans>
      </Title>
      <Caption>
        <Trans i18nKey="welcome-caption" parent="span">
          You haven't added any archives yet. Why not add one?
        </Trans>
      </Caption>
    </Figure>
    <AddArchiveButton />
  </ColoredFlex>
);

WelcomeScreenView.propTypes = {
  t: PropTypes.func
};

export const WelcomeScreen = translate()(WelcomeScreenView);
