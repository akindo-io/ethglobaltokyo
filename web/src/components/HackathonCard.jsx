
import React, {useEffect, useState} from 'react'
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
import HackathonContract from '../ABIs/WaveHackathon.json'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

import { CONTRACT_ADDRESS, ERC20_SAMPLE_ADDRESS } from '../Config.js'

const USDC_ADDRESS = ERC20_SAMPLE_ADDRESS

const HackathonCard = ({
    hackathonId,
    waveCount,
}) => {
    const navigate = useNavigate() 


    return (
        <>
            <Card
                my={2}
                bg={"gray.50"}
                boxShadow={"none"}
                onClick={() => {
                    navigate(`/hackathons/${hackathonId}`)
                }}
                _hover={{
                    cursor: "pointer",
                }}
            >
                <CardBody
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <HStack>

                            <Heading
                                size={"md"}
                            >
                                {hackathonId}
                            </Heading>
                            <Tag
                                colorScheme="green"
                            >
                                Wave {waveCount}
                            </Tag>
                        </HStack>

                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                window.open(`https://snapshot.org/#/hackathon.eth/proposal/${hackathonId.replace(/ /g, '-')}`);
                            }}
                            colorScheme='yellow'
                            isDisabled={false}
                        >
                            Vote Now
                        </Button>
                    </Box>

                </CardBody>
            </Card>
        </>
    )
}

export default HackathonCard