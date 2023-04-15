import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    ButtonGroup,
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
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
    VStack,
    MenuGroup,
    Tag,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
// import contract from "../ABIs/akindo-protocol.json";



const Voting = () => {

    const navigate = useNavigate()

    const snapshotUrl = "https://snapshot.org/#/"

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
                        Voting Now
                    </Heading>

                    <VStack>
                        <Card
                            w="500px"
                        >
                            <CardHeader>
                                <Heading size={"md"}>Hackathon 1</Heading>
                            </CardHeader>
                            <CardFooter>
                                <ButtonGroup>

                                    <Button
                                        onClick={() => window.open(snapshotUrl + 1)}
                                    >SnapShot Space</Button>
                                    <Button
                                        onClick={() => navigate('/productlist')}
                                    >
                                        View Products
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    </VStack>

            </Box>
            </Center>



        </>
    )
}

export default Voting