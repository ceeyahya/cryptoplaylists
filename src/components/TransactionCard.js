import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';

export default function TransactionCard({ playlist }) {
	const { address, timestamp, playlistLink } = playlist;

	return (
		<Box
			bg={useColorModeValue('gray.100', 'gray.700')}
			mb={4}
			boxShadow='sm'
			px={4}
			py={4}
			borderRadius='lg'>
			<Flex align='baseline'>
				<Box fontWeight='bold' w={['32', 'auto']} isTruncated>
					{address}
				</Box>
				<Box ml={2} textColor={useColorModeValue('gray.400', 'gray.500')}>
					({timestamp.toString()})
				</Box>
			</Flex>
			<Link
				href={playlistLink}
				color={useColorModeValue('cyan.600', 'cyan.500')}
				py={2}
				isExternal>
				<Box w={['56', 'auto']} isTruncated>
					{playlistLink}
				</Box>
			</Link>
		</Box>
	);
}
