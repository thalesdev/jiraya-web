import { GetServerSideProps } from "next"
import { Flex, Button, Stack, Heading, Text } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { withSSRGuest } from "../utils/withSSRGuest"
import { Input } from '../components/Form/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'
import * as yup from 'yup';
import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'


import { useAuth } from "../hooks/useAuth"
import {
	AuthenticateLayout, AuthenticateLayoutLeft, AuthenticateLayoutRight
} from "../components/Layout/Authenticate"


type SignInFormData = {
	email: string;
	password: string;
};

const signInFormSchema = yup.object().shape({
	email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
	password: yup.string().required('Senha obrigatória')
});



export default function Signin() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(signInFormSchema)
	})
	const { errors } = formState
	const { signIn } = useAuth()
	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		await signIn(values); // try catchia
	}

	return (
		<>
			<Head>
				<title>Jiraya - Entrar</title>
			</Head>
			<AuthenticateLayout
			>
				<AuthenticateLayoutLeft>
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
						onSubmit={handleSubmit(handleSignIn)}
					>
						<Button
							mb={3}
							bg="gray.900"
							_hover={{ bg: "gray.700" }}
							size="lg"
							leftIcon={<AiFillGithub />}
							iconSpacing="6"
						>
							Entrar com Github
						</Button>

						<Button
							mb={6}
							bg="gray.900"
							_hover={{ bg: "gray.700" }}
							size="lg"
							leftIcon={<FcGoogle />}
							iconSpacing="6"
						>
							Entrar com Google
						</Button>

						<Stack spacing="4">

							<Input
								name="email"
								placeholder="E-mail"
								type="email"
								{...register('email', {
									required: "E-mail é requirido"
								})}
								error={errors.email}
							/>
							<Input
								name="password"
								placeholder="Senha"
								type="password"
								{...register('password')}
								error={errors.password}
							/>

						</Stack>

						<Button
							type="submit"
							mt={6}
							colorScheme="pink"
							size="lg"
							isLoading={formState.isSubmitting}
						>
							Entrar
						</Button>
						<Button
							mt={1}
							variant="solid"
							bg="transparent"
							_hover={{ bg: "transparent" }}
							_focus={{ bg: "transparent" }}
							_active={{ bg: "transparent" }}
							size="lg"
						>
							Esqueceu a senha?
						</Button>

						<Button
							mt={6}
							colorScheme="green"
							size="lg"
						>
							Criar Conta
						</Button>
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