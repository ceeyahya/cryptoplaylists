import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import '@fontsource/epilogue';
import {
	Box,
	Heading,
	IconButton,
	VStack,
	Button,
	Flex,
	Text,
	SimpleGrid,
	Input,
	Spacer,
	FormControl,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { RiSunFill, RiMoonFill } from 'react-icons/ri';
import Playlist from './artifacts/contracts/Playlist.sol/Playlist.json';

import TransactionCard from './components/TransactionCard';

function App() {
	const [account, setAccount] = useState('');
	const [mining, setMining] = useState(false);
	const [count, setCount] = useState(0);
	const [link, setLink] = useState('');
	const [allPlaylists, setAllPlaylists] = useState([]);
	const { colorMode, toggleColorMode } = useColorMode();

	const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
	const abi = Playlist.abi;

	const checkIfWalletConnected = () => {
		const { ethereum } = window;
		if (!ethereum) {
			alert('Make sure you have Metamask');
			return;
		}

		ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
			if (accounts.length !== 0) {
				const account = accounts[0];
				setAccount(account);
			} else {
				console.log('No Authorized Account Found !');
			}
		});
	};

	const connectWallet = () => {
		const { ethereum } = window;
		if (!ethereum) {
			alert('Make sure the Metamask extension is installed');
		}

		ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
			console.log('Connected', accounts[0]);
			setAccount(accounts[0]);
		});
	};

	const submittedPlaylistsCount = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = await provider.getSigner();
		const playlistContract = new ethers.Contract(contractAddress, abi, signer);

		let count = await playlistContract.getPlaylistsCount();
		setCount(count.toNumber());
		return count.toNumber();
	};

	const submitPlaylist = async (link) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = await provider.getSigner();
		const playlistContract = new ethers.Contract(contractAddress, abi, signer);

		let playlistCount = await submittedPlaylistsCount();

		let playlistTxn = await playlistContract.submitPlaylist(link);

		setMining(true);
		await playlistTxn.wait();
		setMining(false);

		await window.location.reload();

		playlistCount = await submittedPlaylistsCount();
	};

	const getAllPlaylists = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = await provider.getSigner();
		const playlistContract = new ethers.Contract(contractAddress, abi, signer);

		let playlists = await playlistContract.getAllPlaylists();

		let playlistsCleaned = [];

		playlists.forEach((playlist) => {
			playlistsCleaned.push({
				address: playlist.user,
				timestamp: new Date(playlist.timestamp * 1000).toLocaleDateString(),
				playlistLink: playlist.playlistLink,
			});
		});
		setAllPlaylists(playlistsCleaned.reverse());
	};

	useEffect(() => {
		checkIfWalletConnected();
		submittedPlaylistsCount();
		getAllPlaylists();
	}, []);

	return (
		<Box width='100%' p={4} position='relative'>
			<Box>
				<Flex align='center' px={4}>
					{account ? (
						<Text w={['32', 'auto']} isTruncated>
							{account}
						</Text>
					) : null}
					<Spacer />
					<IconButton
						onClick={toggleColorMode}
						aria-label='Switch Theme Modes'
						icon={colorMode === 'light' ? <RiMoonFill /> : <RiSunFill />}
						colorScheme='cyan'
						size='lg'
						boxShadow='sm'
						isRound
					/>
				</Flex>
			</Box>

			<VStack pt={32} pb={32} spacing={10}>
				<VStack spacing={2}>
					<Heading align='center' as='h1' maxW='4xl'>
						Share your Spotify Playlist !
					</Heading>
					<Text
						color={useColorModeValue('gray.600', 'gray.500')}
						maxW='xl'
						align='center'
						fontSize={['sm', 'md']}>
						I'm on a quest to discover more and more music ! Please send your
						playlists regardless genre, language or any other barrier.
					</Text>
				</VStack>

				{account ? (
					<FormControl maxW='3xl' mx='auto' py={4} spacing={4}>
						<Flex direction='column' align='center'>
							<Input
								w='full'
								h={14}
								value={link}
								onChange={(e) => setLink(e.target.value)} //
								placeholder='https://open.spotify.com/playlist/6rnNiTWsUxMFUFe2q8JOkp?si=c42351bcb69341c3'
							/>
							<Button
								colorScheme='cyan'
								w='full'
								mt={2}
								px={12}
								py={6}
								boxShadow='sm'
								onClick={() => submitPlaylist(link)}
								isLoading={mining ? true : false}
								loadingText={mining ? 'Mining' : null}>
								Submit Playlist
							</Button>
						</Flex>
					</FormControl>
				) : (
					<Button
						colorScheme='cyan'
						maxW='xl'
						w='full'
						py={6}
						boxShadow='sm'
						onClick={connectWallet}>
						Login with Metamask
					</Button>
				)}
			</VStack>

			{account ? (
				<Flex maxW='3xl' mx='auto' direction='column'>
					<Flex align='baseline'>
						<Heading as='h6'>Mined Transactions</Heading>
						<Spacer />
						<Text>({count} playlists submitted)</Text>
					</Flex>
					<SimpleGrid py={4} columns={1} gap={4}>
						{allPlaylists.map((playlist, i) => (
							<TransactionCard key={i} playlist={playlist} />
						))}
					</SimpleGrid>
				</Flex>
			) : null}
		</Box>
	);
}

export default App;
