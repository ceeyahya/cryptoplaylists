// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Playlist {
  uint totalPlaylists;
  uint private seed;

  mapping(address => uint) public lastWavedAt;
  event NewPlaylist(address indexed from, string playlistLink, uint timestamp);

  struct PlaylistStruct {
    address user;
    string playlistLink;
    uint timestamp;
  }

  PlaylistStruct[] playlists;

  constructor() payable {
    console.log("I'm from the constructor");
  }

  function submitPlaylist(string memory _playlistLink) public {
    require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Please wait 15 minutes before resubmitting");

    lastWavedAt[msg.sender] = block.timestamp;

    totalPlaylists += 1;
    console.log('%s just submitted a playlist', msg.sender);

    uint randomNumber = (block.difficulty + block.timestamp + seed) % 100;
    console.log('Generated:', randomNumber);

    seed = randomNumber;

    if(randomNumber < 50) {
      console.log('%s WON', msg.sender);
      uint prizeAmount = 0.0001 ether;
      require(prizeAmount <= address(this).balance, "This contract is broke, You can't withdraw at the thime :(");
      (bool success,) = (msg.sender).call{value: prizeAmount}("");
      require(success, "Failed to withdraw money from the contract");
    }

    playlists.push(PlaylistStruct(msg.sender, _playlistLink, block.timestamp));
    emit NewPlaylist(msg.sender, _playlistLink, block.timestamp);
  }

  function getAllPlaylists() view public returns (PlaylistStruct[] memory) {
    return playlists;
  }

  function getPlaylistsCount() view public returns (uint) {
    console.log('Total Playlists Submitted: %d', totalPlaylists);
    return totalPlaylists;
  }

}