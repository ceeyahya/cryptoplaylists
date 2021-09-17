const hre = require('hardhat');

async function deploy() {
	const playlistContractFactory = await ethers.getContractFactory('Playlist');
	const playlist = await playlistContractFactory.deploy({
		value: hre.ethers.utils.parseEther('0.1'),
	});

	await playlist.deployed();

	console.log('Playlist Contract Address:', playlist.address);
}

deploy()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
