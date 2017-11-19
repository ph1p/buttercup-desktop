import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/md/add';
import { FormattedMessage } from 'react-intl';
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
            <FormattedMessage id="add-entry" defaultMessage="Add Entry" />
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

export default EmptyView;

const ColoredFlex = styled(Flex)`
  background-color: #181b1f;
  color: #fff;
`;

const Title = styled.h3`
  margin-bottom: var(--spacing-half);
`;

export const NoArchiveSelected = () => (
  <ColoredFlex align="center" justify="center" flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <FormattedMessage
          id="welcome-back-title"
          defaultMessage="Welcome back to Buttercup."
        />
      </Title>
      <Caption>
        <FormattedMessage
          id="unlock-archive"
          defaultMessage="Unlock an archive to begin ({os})."
          values={{
            os: `${isOSX() ? '⌘' : 'Ctrl'}+1`
          }}
        />
      </Caption>
    </Figure>
  </ColoredFlex>
);

export const WelcomeScreen = () => (
  <ColoredFlex align="center" justify="center" flexColumn flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <FormattedMessage
          id="welcome-title"
          defaultMessage="Welcome to Buttercup."
        />
      </Title>
      <Caption>
        <FormattedMessage
          id="welcome-caption"
          defaultMessage="You haven't added any archives yet. Why not add one?"
        />
      </Caption>
    </Figure>
    <AddArchiveButton />
  </ColoredFlex>
);
