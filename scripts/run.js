const hre = require('hardhat');

async function main() {
	const Playlist = await hre.ethers.getContractFactory('Playlist');
	const playlist = await Playlist.deploy();
	await playlist.deployed();

	console.log('Contract Address:', playlist.address);

	let contractBalance = await hre.ethers.provider.getBalance(playlist.address);

	console.log(
		'Contract Balance',
		hre.ethers.utils.formatEther(contractBalance)
	);

	let playlistCount;
	playlistCount = await playlist.getPlaylistsCount();

	let playlistTxn = await playlist.submitPlaylist(
		'https://open.spotify.com/playlist/6rnNiTWsUxMFUFe2q8JOkp?si=d4b3cce12981409f'
	);
	await playlistTxn.wait();

	contractBalance = await hre.ethers.provider.getBalance(playlist.address);
	console.log(
		'Contract Balance',
		hre.ethers.utils.formatEther(contractBalance)
	);

	let allPlaylists = await playlist.getAllPlaylists();
	console.log(allPlaylists);

	playlistCount = await playlist.getPlaylistsCount();
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
