import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'

const ProductList = () => {
    return (
        <>
            <Center>
                <Box
                    w={"500px"}

                >
                    <Heading
                        as={"h1"}
                        my={5}
                        color={"white"}
                    >
                        Submitted Products
                    </Heading>
                    <Card
                        w={"500px"}
                    >
                        <CardBody>


                            <Card
                                my={2}
                                bg={"gray.50"}
                                boxShadow={"none"}
                            >
                                <CardBody
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >


                                        <Heading
                                            size={"md"}
                                        >
                                            Product 1
                                        </Heading>
                                        <Button>
                                            View Details
                                        </Button>
                                    </Box>

                                </CardBody>
                            </Card>
                            <Card
                                my={2}
                                bg={"gray.50"}
                                boxShadow={"none"}
                            >
                                <CardBody
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >


                                        <Heading
                                            size={"md"}
                                        >
                                            Product 1
                                        </Heading>
                                        <Button>
                                            View Details
                                        </Button>
                                    </Box>

                                </CardBody>
                            </Card>
                            <Card
                                my={2}
                                bg={"gray.50"}
                                boxShadow={"none"}
                            >
                                <CardBody
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >


                                        <Heading
                                            size={"md"}
                                        >
                                            Product 1
                                        </Heading>
                                        <Button>
                                            View Details
                                        </Button>
                                    </Box>

                                </CardBody>
                            </Card>

                            <Center>
                                <Button
                                    colorScheme={"yellow"}
                                    mt={5}
                                >
                                    Create SnapShot
                                </Button>
                            </Center>

                        </CardBody>
                    </Card>
                </Box>

            </Center>

        </>

    )
}

export default ProductList