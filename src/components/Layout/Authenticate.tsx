import React, { ReactNode } from 'react';
import { Flex, Button, Stack } from '@chakra-ui/react'

interface AuthenticateProps {
	children: ReactNode
}


export function AuthenticateLayoutRight({ children }: AuthenticateProps) {
	return (
		<>
			{children}
		</>
	)
}


export function AuthenticateLayoutLeft({ children }: AuthenticateProps) {
	return (
		<Flex flex="1" direction="column" px="6">
			{children}
		</Flex>
	)
}


export function AuthenticateLayout({ children }: AuthenticateProps) {
	return (
		<Flex
			w="100vw"
			h="100vh"
			align="center"
			justify="space-between"
			py="10"
			pb="8"
		>
			<Flex width="980px" mx="auto" my="0">
				{children}
			</Flex>
		</Flex>
	);
}

// partials
