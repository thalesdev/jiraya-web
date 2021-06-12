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
import { signIn as signInSocial } from 'next-auth/client'
import Link from 'next/link'

import { useAuth } from "../hooks/useAuth"
import {
	AuthenticateLayout, AuthenticateLayoutLeft, AuthenticateLayoutRight
} from "../components/Layout/Authenticate"


type SignInFormData = {
	email: string;
	username: string;
	fullname: string;
	password: string;
};

const signUpFormSchema = yup.object().shape({
	email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
	password: yup.string().required('Senha obrigatória'),
	username: yup.string().required('Nome de usuário obrigatório'),
	fullname: yup.string().required('Nome completo obrigatório')

});



export default function Signup() {

	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(signUpFormSchema)
	})
	const { errors } = formState
	const { signUp } = useAuth()
	const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
		const errors = await signUp(values);
		if (errors) {
			console.log('deu b.o', errors) // melhorar o visual error handling
		}
	}


	return (
		<>
			<Head>
				<title>Jiraya - Registrar-se</title>
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
						onSubmit={handleSubmit(handleSignIn)}
						onKeyPress={() => {

						}}
					>
						<Button
							mb={3}
							bg="gray.900"
							_hover={{ bg: "gray.700" }}
							size="lg"
							leftIcon={<AiFillGithub />}
							iconSpacing="6"
							onClick={() => { signInSocial('github') }}
						>
							Registrar-se com Github
						</Button>

						{/* <Button
							mb={6}
							bg="gray.900"
							_hover={{ bg: "gray.700" }}
							size="lg"
							leftIcon={<FcGoogle />}
							iconSpacing="6"
						>
							Registrar-se com Google
						</Button> */}

						<Stack spacing="4">
							<Input
								name="fullname"
								placeholder="Nome completo"
								type="text"
								{...register('fullname')}
								error={errors.username}
							/>
							<Input
								name="email"
								placeholder="E-mail"
								type="email"
								{...register('email')}
								error={errors.email}
							/>
							<Input
								name="username"
								placeholder="Nome de usuário"
								type="text"
								{...register('username')}
								error={errors.username}
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
							Registrar-se
						</Button>
						<Link href="/signin">
							<Button
								mt={6}
								variant="solid"
								bg="transparent"
								_hover={{ bg: "transparent" }}
								_focus={{ bg: "transparent" }}
								_active={{ bg: "transparent" }}
								size="lg"
							>
								Já tenho uma conta
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