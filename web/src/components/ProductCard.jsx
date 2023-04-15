
import React from 'react'
import {
    Box,
    Button,
    Text,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Center,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Heading,
    VStack,
    HStack,
    Tag,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'


const ProductCard = ({
    productId,
    submittedAddress,
}) => {
    const navigate = useNavigate()

    return (
        <>
            <Card
                my={2}
                bg={"gray.50"}
                boxShadow={"none"}
            >
                <CardBody
                >
                    <Box
                        display="flex"
                        alignItems="left"
                        justifyContent="space-between"
                    >

                        <VStack
                            textAlign="left"
                        >
                            <Heading size={"md"} textAlign="left">
                                Product {productId}
                            </Heading>
                            <Text size={"xs"} textAlign="left">
                                Submitted Address: {`${submittedAddress.substring(0, 5)}...${submittedAddress.substring(submittedAddress.length - 5)}`}
                            </Text>
                        </VStack>

                        <Button>
                            View Details
                        </Button>
                    </Box>

                </CardBody>
            </Card>
        </>
    )
}

export default ProductCard