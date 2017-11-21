import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/md/add';
import { translate, Trans, Interpolate } from 'react-i18next';
import { Flex } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
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

const EmptyView = ({
  caption,
  imageSrc,
  className,
  handleAddEntry,
  firstEntryView
}) => {
  return (
    <Flex align="center" justify="center" flexAuto className={className}>
      <Figure>
        {imageSrc && <img src={imageSrc} />}
        <Caption>{caption}</Caption>
        <If condition={firstEntryView}>
          <br />
          <Button onClick={handleAddEntry} full light icon={<PlusIcon />}>
            <Trans i18nKey="add-entry" parent="span">
              Add Entry
            </Trans>
          </Button>
        </If>
      </Figure>
    </Flex>
  );
};

EmptyView.propTypes = {
  caption: PropTypes.string,
  className: PropTypes.string,
  imageSrc: PropTypes.string,
  handleAddEntry: PropTypes.func,
  firstEntryView: PropTypes.bool
};

export default translate()(EmptyView);

const ColoredFlex = styled(Flex)`
  background-color: #181b1f;
  color: #fff;
`;

const Title = styled.h3`
  margin-bottom: var(--spacing-half);
`;

const NoArchiveSelectedView = () => (
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
        >
          Unlock an archive to begin ({`${isOSX() ? '⌘' : 'Ctrl'}+1`}).
        </Interpolate>
      </Caption>
    </Figure>
  </ColoredFlex>
);

export const NoArchiveSelected = translate()(NoArchiveSelectedView);

const WelcomeScreenView = () => (
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

export const WelcomeScreen = translate()(WelcomeScreenView);
