import { Input as ChakraInput, FormControl, FormLabel, InputProps as ChakraInputProps, forwardRef, FormErrorMessage } from "@chakra-ui/react";
import { ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";


interface InputProps extends ChakraInputProps {
	name: string;
	label?: string;
	error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
	{ name, label, error, ...rest },
	ref
) => {

	return (
		<FormControl isInvalid={!!error}>
			{!!label && <FormLabel htmlFor={name}>{label}</FormLabel >}
			<ChakraInput
				name={name}
				focusBorderColor="pink.500"
				bg="gray.900"
				variant="filled"
				_hover={{ bgColor: "gray.900" }}
				size="lg"
				id={name}
				ref={ref}
				{...rest}
			/>
			{!!error && (
				<FormErrorMessage>
					{error.message}
				</FormErrorMessage>
			)}
		</FormControl>
	)
}

export const Input = forwardRef(InputBase)