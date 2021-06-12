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


type ForgotFormData = {
	email: string;
};

const forgotFormSchema = yup.object().shape({
	email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
});



export default function Forgot() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(forgotFormSchema)
	})
	const { errors } = formState
	const { forgot } = useAuth()
	const handleForgot: SubmitHandler<ForgotFormData> = async (values) => {
		const errors = await forgot(values);
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

						<Stack spacing="6">
							<Text>
								Um código será enviado para seu email para recuperar sua senha.
							</Text>
							<Input
								name="email"
								placeholder="E-mail"
								type="email"
								{...register('email')}
								error={errors.email}
							/>
						</Stack>

						<Button
							type="submit"
							mt={6}
							colorScheme="pink"
							size="lg"
							isLoading={formState.isSubmitting}
						>
							Enviar Código
						</Button>
						<Link href="/recovery">
							<Button
								mt={4}
								variant="solid"
								bg="gray.900"
								_hover={{ bg: "transparent" }}
								_focus={{ bg: "transparent" }}
								_active={{ bg: "transparent" }}
								size="lg"
							>
								Já tenho um código
							</Button>
						</Link>
						<Link href="/signin">
							<Button
								mt={8}
								variant="solid"
								bg="transparent"
								_hover={{ bg: "transparent" }}
								_focus={{ bg: "transparent" }}
								_active={{ bg: "transparent" }}
								size="lg"
							>
								Lembro minha senha
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