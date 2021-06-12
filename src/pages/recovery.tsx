import { GetServerSideProps } from "next"
import { Flex, Button, Stack, Heading, Text } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { withSSRGuest } from "../utils/withSSRGuest"
import { Input } from '../components/Form/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import * as yup from 'yup';
import Link from 'next/link'

import { useAuth } from "../hooks/useAuth"
import {
	AuthenticateLayout, AuthenticateLayoutLeft, AuthenticateLayoutRight
} from "../components/Layout/Authenticate"


type RecoveryFormData = {
	code: string;
	password: string;
	password_confirmation: string;
};

const recoveryFormSchema = yup.object().shape({
	code: yup.string().required('Código é obrigatório'),
	password: yup.string().required('Senha é obrigatória'),
	password_confirmation: yup.string().required('Confirmação de senha é obrigatória')
		.oneOf([yup.ref('password'), null], 'Senhas devem ser iguais')
});



export default function Recovery() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(recoveryFormSchema)
	})
	const { errors } = formState
	const { recovery } = useAuth()
	const handleForgot: SubmitHandler<RecoveryFormData> = async (values) => {
		const errors = await recovery(values);
		if (errors) {
			console.log('deu b.o', errors) // melhorar o visual error handling
		}
	}


	return (
		<>
			<Head>
				<title>Jiraya - Recuperar Senha</title>
			</Head>
			<AuthenticateLayout
			>
				<AuthenticateLayoutLeft justify="center">
					<Heading as="h1" pt="10" mb="4" fontSize="72">JIRAYA</Heading>
					<Text lineHeight="10" fontSize="32px">
						O jiraya ajuda você a se conectar e compartilhar com as pessoas que fazem parte da sua vida.
					</Text>
				</AuthenticateLayoutLeft>
				<AuthenticateLayoutRight>
					<Flex
						as="form"
						w="100%"
						maxWidth={360}
						bg="gray.800"
						p="8"
						borderRadius={8}
						flexDir="column"
						onSubmit={handleSubmit(handleForgot)}
						onKeyPress={() => {

						}}
					>

						<Stack spacing="4">
							<Input
								name="code"
								placeholder="Código"
								type="code"
								{...register('code')}
								error={errors.code}
							/>
							<Input
								name="password"
								placeholder="Senha"
								type="password"
								{...register('password')}
								error={errors.password}
							/>
							<Input
								name="password_confirmation"
								placeholder="Confirmação de senha"
								type="password"
								{...register('password_confirmation')}
								error={errors.password_confirmation}
							/>
						</Stack>

						<Button
							type="submit"
							mt={6}
							colorScheme="pink"
							size="lg"
							isLoading={formState.isSubmitting}
						>
							Redifinir Senha
						</Button>

						<Link href="/forgot">
							<Button
								mt={8}
								variant="solid"
								bg="transparent"
								_hover={{ bg: "transparent" }}
								_focus={{ bg: "transparent" }}
								_active={{ bg: "transparent" }}
								size="lg"
							>
								Voltar
							</Button>
						</Link>
					</Flex>

				</AuthenticateLayoutRight>
			</AuthenticateLayout>
		</>
	)
}



export const getServerSideProps: GetServerSideProps = withSSRGuest(async () => {
	return {
		props: {}
	}
})