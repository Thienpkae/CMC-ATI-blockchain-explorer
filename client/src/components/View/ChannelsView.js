/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import View from '../Styled/View';
import Channels from '../Lists/Channels';
import { channelsType } from '../types';

export const ChannelsView = ({ channels, getBlockSearch, blockSearch, currentChannel, getChannelPeerData, channelPeerData, getBlockHash, blockHashList }) => (
  <View>
    <Channels
      channels={channels}
      getBlockSearch={getBlockSearch}
      blockSearch={blockSearch}
      currentChannel={currentChannel}
      getChannelPeerData={getChannelPeerData}
      channelPeerData={channelPeerData}
      getBlockHash={getBlockHash}
      blockHashList={blockHashList}
    />
  </View>
);

ChannelsView.propTypes = {
  channels: channelsType.isRequired,
};

export default ChannelsView;
